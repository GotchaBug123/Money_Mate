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
    public void syncFiveYearPrices() {

        List<Asset> assets =
                assetRepository.findAllByAssetTypeIn(
                        List.of("STOCK", "ETF")
                );

        for (Asset asset : assets) {
            try {
                syncAssetPrice(asset);
            } catch (Exception e) {
                System.out.println("[Yahoo Finance 수집 실패] "
                        + asset.getTicker()
                        + " / "
                        + e.getMessage());
            }
        }
    }

    private void syncAssetPrice(Asset asset) throws Exception {

        String yahooTicker =
                convertToYahooTicker(asset);

        long period2 =
                Instant.now().getEpochSecond();

        long period1 =
                Instant.now()
                        .minusSeconds(60L * 60 * 24 * 365 * 5)
                        .getEpochSecond();

        String url =
                "https://query1.finance.yahoo.com/v8/finance/chart/"
                        + yahooTicker
                        + "?period1="
                        + period1
                        + "&period2="
                        + period2
                        + "&interval=1d";

        String response =
                restTemplate.getForObject(url, String.class);

        if (response == null || response.isBlank()) {
            return;
        }

        JsonNode root =
                objectMapper.readTree(response);

        JsonNode result =
                root.path("chart")
                        .path("result")
                        .get(0);

        if (result == null || result.isMissingNode()) {
            return;
        }

        JsonNode timestamps =
                result.path("timestamp");

        JsonNode quote =
                result.path("indicators")
                        .path("quote")
                        .get(0);

        if (timestamps == null
                || !timestamps.isArray()
                || quote == null
                || quote.isMissingNode()) {
            return;
        }

        JsonNode opens =
                quote.path("open");

        JsonNode highs =
                quote.path("high");

        JsonNode lows =
                quote.path("low");

        JsonNode closes =
                quote.path("close");

        JsonNode volumes =
                quote.path("volume");

        for (int i = 0; i < timestamps.size(); i++) {

            if (isInvalidPriceNode(opens, i)
                    || isInvalidPriceNode(highs, i)
                    || isInvalidPriceNode(lows, i)
                    || isInvalidPriceNode(closes, i)) {
                continue;
            }

            long unixTime =
                    timestamps.get(i).asLong();

            LocalDate priceDate =
                    Instant.ofEpochSecond(unixTime)
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate();

            if (assetPriceRepository.existsByAssetAssetIdAndPriceDate(
                    asset.getAssetId(),
                    priceDate
            )) {
                continue;
            }

            BigDecimal openPrice =
                    BigDecimal.valueOf(opens.get(i).asDouble());

            BigDecimal highPrice =
                    BigDecimal.valueOf(highs.get(i).asDouble());

            BigDecimal lowPrice =
                    BigDecimal.valueOf(lows.get(i).asDouble());

            BigDecimal closePrice =
                    BigDecimal.valueOf(closes.get(i).asDouble());

            Long volume =
                    0L;

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
        }
    }

    private boolean isInvalidPriceNode(
            JsonNode node,
            int index
    ) {
        return node == null
                || !node.isArray()
                || node.get(index) == null
                || node.get(index).isNull();
    }

    private String convertToYahooTicker(Asset asset) {

        String ticker =
                asset.getTicker();

        String market =
                asset.getMarket();

        if ("KOSPI".equalsIgnoreCase(market)) {
            return ticker + ".KS";
        }

        if ("KOSDAQ".equalsIgnoreCase(market)) {
            return ticker + ".KQ";
        }

        return ticker;
    }
}