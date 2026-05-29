package com.gotchabug.moneymate.service;

import com.gotchabug.moneymate.entity.AssetMaster;
import com.gotchabug.moneymate.repository.AssetMasterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Slf4j
@Component
@RequiredArgsConstructor
public class AssetMasterSeedRunner implements ApplicationRunner {

    private static final Charset KIS_CHARSET = Charset.forName("MS949");
    private static final int BATCH_SIZE = 500;

    private final AssetMasterRepository assetMasterRepository;

    @Value("${market.asset-master.enabled:true}")
    private boolean enabled;

    @Value("${market.asset-master.kospi-zip-path:C:/Users/minta/Downloads/kospi_code.mst.zip}")
    private String kospiZipPath;

    @Value("${market.asset-master.kosdaq-zip-path:C:/Users/minta/Downloads/kosdaq_code.mst.zip}")
    private String kosdaqZipPath;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (!enabled) {
            log.info("Asset master seed loading is disabled.");
            return;
        }

        Map<String, AssetMasterSeedRow> seedRows = new LinkedHashMap<>();
        loadRows(seedRows, kospiZipPath, "KOSPI", ".KS");
        loadRows(seedRows, kosdaqZipPath, "KOSDAQ", ".KQ");

        if (seedRows.isEmpty()) {
            log.warn("No asset master rows were loaded. Check Korean Investment mst zip file paths.");
            return;
        }

        Map<String, AssetMaster> existingAssets = findExistingAssets(seedRows.keySet()).stream()
                .collect(Collectors.toMap(AssetMaster::getSymbol, Function.identity()));
        List<AssetMaster> assetsToSave = new ArrayList<>();

        for (AssetMasterSeedRow seedRow : seedRows.values()) {
            AssetMaster existingAsset = existingAssets.get(seedRow.symbol());

            if (existingAsset == null) {
                assetsToSave.add(AssetMaster.builder()
                        .symbol(seedRow.symbol())
                        .yahooSymbol(seedRow.yahooSymbol())
                        .assetName(seedRow.assetName())
                        .market(seedRow.market())
                        .assetType(seedRow.assetType())
                        .country(seedRow.country())
                        .build());
                continue;
            }

            existingAsset.update(
                    seedRow.yahooSymbol(),
                    seedRow.assetName(),
                    seedRow.market(),
                    seedRow.assetType(),
                    seedRow.country()
            );
            assetsToSave.add(existingAsset);
        }

        assetMasterRepository.saveAll(assetsToSave);
        log.info("Asset master seed completed. parsed={}, savedOrUpdated={}", seedRows.size(), assetsToSave.size());
    }

    private void loadRows(
            Map<String, AssetMasterSeedRow> seedRows,
            String zipPathValue,
            String market,
            String yahooSuffix
    ) {
        Path zipPath = Path.of(zipPathValue);

        if (!Files.exists(zipPath)) {
            log.warn("Asset master zip file does not exist. path={}", zipPath);
            return;
        }

        try {
            List<AssetMasterSeedRow> rows = parseKisMstZip(zipPath, market, yahooSuffix);

            for (AssetMasterSeedRow row : rows) {
                seedRows.putIfAbsent(row.symbol(), row);
            }

            log.info("Loaded asset master rows. market={}, path={}, rows={}", market, zipPath, rows.size());
        } catch (IOException exception) {
            log.warn("Failed to parse asset master zip. market={}, path={}", market, zipPath, exception);
        }
    }

    private List<AssetMasterSeedRow> parseKisMstZip(
            Path zipPath,
            String market,
            String yahooSuffix
    ) throws IOException {
        List<AssetMasterSeedRow> rows = new ArrayList<>();

        try (ZipInputStream zipInputStream = new ZipInputStream(Files.newInputStream(zipPath), KIS_CHARSET)) {
            ZipEntry entry;

            while ((entry = zipInputStream.getNextEntry()) != null) {
                if (entry.isDirectory()) {
                    continue;
                }

                readMstLines(zipInputStream, market, yahooSuffix, rows);
            }
        }

        return rows;
    }

    private void readMstLines(
            InputStream inputStream,
            String market,
            String yahooSuffix,
            List<AssetMasterSeedRow> rows
    ) throws IOException {
        ByteArrayOutputStream lineBuffer = new ByteArrayOutputStream();
        int currentByte;

        while ((currentByte = inputStream.read()) != -1) {
            if (currentByte == '\n') {
                addParsedRow(lineBuffer.toByteArray(), market, yahooSuffix, rows);
                lineBuffer.reset();
                continue;
            }

            if (currentByte != '\r') {
                lineBuffer.write(currentByte);
            }
        }

        if (lineBuffer.size() > 0) {
            addParsedRow(lineBuffer.toByteArray(), market, yahooSuffix, rows);
        }
    }

    private void addParsedRow(
            byte[] lineBytes,
            String market,
            String yahooSuffix,
            List<AssetMasterSeedRow> rows
    ) {
        AssetMasterSeedRow row = parseMstLine(lineBytes, market, yahooSuffix);

        if (row != null) {
            rows.add(row);
        }
    }

    private AssetMasterSeedRow parseMstLine(
            byte[] lineBytes,
            String market,
            String yahooSuffix
    ) {
        if (lineBytes.length < 63) {
            return null;
        }

        String symbol = decode(lineBytes, 0, 9).trim();
        String assetName = decode(lineBytes, 21, 40).trim();
        String rawAssetType = decode(lineBytes, 61, 2).trim();
        String assetType = mapKisAssetType(rawAssetType, assetName);

        if (symbol.isBlank() || assetName.isBlank() || assetType == null) {
            return null;
        }

        return new AssetMasterSeedRow(
                symbol,
                symbol + yahooSuffix,
                assetName,
                market,
                assetType,
                "KR"
        );
    }

    private String decode(byte[] lineBytes, int start, int length) {
        if (lineBytes.length <= start) {
            return "";
        }

        int safeLength = Math.min(length, lineBytes.length - start);
        return new String(lineBytes, start, safeLength, KIS_CHARSET);
    }

    private String mapKisAssetType(String rawAssetType, String assetName) {
        return switch (rawAssetType) {
            case "ST", "FS" -> "STOCK";
            case "EF" -> "ETF";
            case "EN" -> "ETN";
            default -> inferAssetTypeFromName(assetName);
        };
    }

    private String inferAssetTypeFromName(String assetName) {
        String upperName = assetName.toUpperCase();

        if (upperName.contains("ETF")
                || upperName.startsWith("KODEX")
                || upperName.startsWith("TIGER")
                || upperName.startsWith("RISE")
                || upperName.startsWith("ACE")
                || upperName.startsWith("KOSEF")
                || upperName.startsWith("ARIRANG")
                || upperName.startsWith("SOL")
                || upperName.startsWith("HANARO")
                || upperName.startsWith("TIMEFOLIO")
                || upperName.startsWith("UNICORN")) {
            return "ETF";
        }

        return null;
    }

    private List<AssetMaster> findExistingAssets(Collection<String> symbols) {
        List<String> symbolList = new ArrayList<>(symbols);
        List<AssetMaster> existingAssets = new ArrayList<>();

        for (int start = 0; start < symbolList.size(); start += BATCH_SIZE) {
            int end = Math.min(start + BATCH_SIZE, symbolList.size());
            existingAssets.addAll(assetMasterRepository.findBySymbolIn(symbolList.subList(start, end)));
        }

        return existingAssets;
    }

    private record AssetMasterSeedRow(
            String symbol,
            String yahooSymbol,
            String assetName,
            String market,
            String assetType,
            String country
    ) {
    }
}
