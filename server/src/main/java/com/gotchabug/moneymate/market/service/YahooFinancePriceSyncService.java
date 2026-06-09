package com.gotchabug.moneymate.market.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotchabug.moneymate.market.entity.Asset;
import com.gotchabug.moneymate.market.entity.AssetPrice;
import com.gotchabug.moneymate.market.repository.AssetPriceRepository;
import com.gotchabug.moneymate.market.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class YahooFinancePriceSyncService {

    private final AssetRepository assetRepository;
    private final AssetPriceRepository assetPriceRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public int syncFiveYearPrices() {

        List<Asset> assets =
                assetRepository.findAllByAssetTypeIn(List.of("STOCK", "ETF"));

        System.out.println("[수집 대상 개수] " + assets.size());

        int totalSavedCount = 0;

        for (Asset asset : assets) {
            try {
                int savedCount = syncAssetPrice(asset);
                totalSavedCount += savedCount;

                System.out.println("[수집 성공] "
                        + asset.getTicker()
                        + " / 저장 "
                        + savedCount
                        + "건");

            } catch (Exception e) {
                System.out.println("[수집 실패] "
                        + asset.getTicker()
                        + " / "
                        + e.getMessage());
                e.printStackTrace();
            }
        }

        return totalSavedCount;
    }

    private int syncAssetPrice(Asset asset) throws Exception {

        String yahooTicker = convertToYahooTicker(asset);

        String url =
                "https://query1.finance.yahoo.com/v8/finance/chart/"
                        + yahooTicker
                        + "?interval=1d&range=5y";

        System.out.println("[Yahoo URL] " + url);
        HttpHeaders headers = new HttpHeaders();

        headers.set(
                "User-Agent",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137.0 Safari/537.36"
        );

        HttpEntity<String> entity =
                new HttpEntity<>(headers);

        ResponseEntity<String> responseEntity =
                restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        entity,
                        String.class
                );

        String response =
                responseEntity.getBody();

        if (response == null || response.isBlank()) {
            System.out.println("[응답 없음] " + yahooTicker);
            return 0;
        }

        System.out.println("[Yahoo 응답 앞부분] "
                + response.substring(0, Math.min(300, response.length())));

        JsonNode root = objectMapper.readTree(response);

        JsonNode result =
                root.path("chart")
                        .path("result")
                        .get(0);

        if (result == null || result.isMissingNode()) {
            System.out.println("[result 없음] " + yahooTicker);
            return 0;
        }

        JsonNode timestamps = result.path("timestamp");

        JsonNode quote =
                result.path("indicators")
                        .path("quote")
                        .get(0);

        if (timestamps == null || !timestamps.isArray()) {
            System.out.println("[timestamp 없음] " + yahooTicker);
            return 0;
        }

        if (quote == null || quote.isMissingNode()) {
            System.out.println("[quote 없음] " + yahooTicker);
            return 0;
        }

        JsonNode opens = quote.path("open");
        JsonNode highs = quote.path("high");
        JsonNode lows = quote.path("low");
        JsonNode closes = quote.path("close");
        JsonNode volumes = quote.path("volume");

        System.out.println("[timestamp 개수] " + timestamps.size());

        int savedCount = 0;

        for (int i = 0; i < timestamps.size(); i++) {

            if (isInvalidPriceNode(opens, i)
                    || isInvalidPriceNode(highs, i)
                    || isInvalidPriceNode(lows, i)
                    || isInvalidPriceNode(closes, i)) {
                continue;
            }

            long unixTime = timestamps.get(i).asLong();

            LocalDate priceDate =
                    Instant.ofEpochSecond(unixTime)
                            .atZone(ZoneId.of("Asia/Seoul"))
                            .toLocalDate();

            if (assetPriceRepository.existsByAssetAssetIdAndPriceDate(
                    asset.getAssetId(),
                    priceDate
            )) {
                continue;
            }

            BigDecimal openPrice = BigDecimal.valueOf(opens.get(i).asDouble());
            BigDecimal highPrice = BigDecimal.valueOf(highs.get(i).asDouble());
            BigDecimal lowPrice = BigDecimal.valueOf(lows.get(i).asDouble());
            BigDecimal closePrice = BigDecimal.valueOf(closes.get(i).asDouble());

            Long volume = 0L;

            if (volumes != null
                    && volumes.isArray()
                    && volumes.get(i) != null
                    && !volumes.get(i).isNull()) {
                volume = volumes.get(i).asLong();
            }

            AssetPrice assetPrice = new AssetPrice();
            assetPrice.setAsset(asset);
            assetPrice.setPriceDate(priceDate);
            assetPrice.setOpenPrice(openPrice);
            assetPrice.setHighPrice(highPrice);
            assetPrice.setLowPrice(lowPrice);
            assetPrice.setClosePrice(closePrice);
            assetPrice.setAdjClosePrice(closePrice);
            assetPrice.setVolume(volume);

            assetPriceRepository.save(assetPrice);
            savedCount++;
        }

        return savedCount;
    }

    private boolean isInvalidPriceNode(JsonNode node, int index) {
        return node == null
                || !node.isArray()
                || node.get(index) == null
                || node.get(index).isNull();
    }

    private String convertToYahooTicker(Asset asset) {

        String ticker = asset.getTicker();
        String market = asset.getMarket();

        if ("KOSPI".equalsIgnoreCase(market)) {
            return ticker + ".KS";
        }

        if ("KOSDAQ".equalsIgnoreCase(market)) {
            return ticker + ".KQ";
        }

        return ticker;
    }
}