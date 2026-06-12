    package com.gotchabug.moneymate.market;

    import com.gotchabug.moneymate.market.entity.AssetMaster;
    import com.gotchabug.moneymate.market.repository.AssetMasterRepository;
    import lombok.RequiredArgsConstructor;
    import lombok.extern.slf4j.Slf4j;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.boot.ApplicationArguments;
    import org.springframework.boot.ApplicationRunner;
    import org.springframework.core.io.Resource;
    import org.springframework.core.io.ResourceLoader;
    import org.springframework.stereotype.Component;
    import org.springframework.transaction.annotation.Transactional;

    import java.io.BufferedReader;
    import java.io.IOException;
    import java.io.InputStreamReader;
    import java.nio.charset.StandardCharsets;
    import java.util.ArrayList;
    import java.util.Collection;
    import java.util.LinkedHashMap;
    import java.util.List;
    import java.util.Map;
    import java.util.function.Function;
    import java.util.stream.Collectors;

    @Slf4j
    @Component
    @RequiredArgsConstructor
    public class AssetMasterSeedRunner implements ApplicationRunner {

        private static final int BATCH_SIZE = 500;

        private final AssetMasterRepository assetMasterRepository;
        private final ResourceLoader resourceLoader;

        @Value("${market.asset-master.enabled:true}")
        private boolean enabled;

        @Value("${market.asset-master.csv-path:classpath:/data/kr_assets.csv}")
        private String csvPath;

        @Override
        @Transactional
        public void run(ApplicationArguments args) {
            if (!enabled) {
                log.info("Asset master seed loading is disabled.");
                return;
            }

            Map<String, AssetMasterSeedRow> seedRows = loadRows(csvPath);

            if (seedRows.isEmpty()) {
                log.warn("No asset master rows were loaded. path={}", csvPath);
                return;
            }

            Map<String, AssetMaster> existingAssets =
                    findExistingAssets(seedRows.keySet()).stream()
                            .collect(Collectors.toMap(
                                    AssetMaster::getSymbol,
                                    Function.identity()
                            ));
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
            log.info(
                    "Asset master seed completed. parsed={}, savedOrUpdated={}",
                    seedRows.size(),
                    assetsToSave.size()
            );
        }

        private Map<String, AssetMasterSeedRow> loadRows(String csvPathValue) {
            Resource resource = resourceLoader.getResource(csvPathValue);
            Map<String, AssetMasterSeedRow> seedRows = new LinkedHashMap<>();

            if (!resource.exists()) {
                log.warn("Asset master CSV does not exist. path={}", csvPathValue);
                return seedRows;
            }

            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(
                            resource.getInputStream(),
                            StandardCharsets.UTF_8
                    )
            )) {
                String line;
                boolean header = true;

                while ((line = reader.readLine()) != null) {
                    if (header) {
                        header = false;
                        continue;
                    }

                    AssetMasterSeedRow seedRow = parseCsvLine(line);

                    if (seedRow != null) {
                        seedRows.putIfAbsent(seedRow.symbol(), seedRow);
                    }
                }
            } catch (IOException exception) {
                log.warn("Failed to parse asset master CSV. path={}", csvPathValue, exception);
            }

            return seedRows;
        }

        private AssetMasterSeedRow parseCsvLine(String line) {
            List<String> columns = splitCsv(line);

            if (columns.size() < 6) {
                return null;
            }

            String symbol = stripBom(columns.get(0).trim());
            String yahooSymbol = columns.get(1).trim();
            String assetName = columns.get(2).trim();
            String market = columns.get(3).trim();
            String assetType = columns.get(4).trim();
            String country = columns.get(5).trim();

            if (symbol.isBlank()
                    || yahooSymbol.isBlank()
                    || assetName.isBlank()
                    || market.isBlank()
                    || assetType.isBlank()
                    || country.isBlank()) {
                return null;
            }

            return new AssetMasterSeedRow(
                    symbol,
                    yahooSymbol,
                    assetName,
                    market,
                    assetType,
                    country
            );
        }

        private List<String> splitCsv(String line) {
            List<String> columns = new ArrayList<>();
            StringBuilder current = new StringBuilder();
            boolean inQuotes = false;

            for (int i = 0; i < line.length(); i++) {
                char character = line.charAt(i);

                if (character == '"') {
                    if (inQuotes
                            && i + 1 < line.length()
                            && line.charAt(i + 1) == '"') {
                        current.append('"');
                        i++;
                        continue;
                    }

                    inQuotes = !inQuotes;
                    continue;
                }

                if (character == ',' && !inQuotes) {
                    columns.add(current.toString());
                    current.setLength(0);
                    continue;
                }

                current.append(character);
            }

            columns.add(current.toString());
            return columns;
        }

        private String stripBom(String value) {
            if (value != null && value.startsWith("\uFEFF")) {
                return value.substring(1);
            }

            return value;
        }

        private List<AssetMaster> findExistingAssets(Collection<String> symbols) {
            List<String> symbolList = new ArrayList<>(symbols);
            List<AssetMaster> existingAssets = new ArrayList<>();

            for (int start = 0; start < symbolList.size(); start += BATCH_SIZE) {
                int end = Math.min(start + BATCH_SIZE, symbolList.size());
                existingAssets.addAll(assetMasterRepository.findBySymbolIn(
                        symbolList.subList(start, end)
                ));
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
