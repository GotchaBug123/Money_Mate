package com.gotchabug.moneymate.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotchabug.moneymate.dto.market.MarketAssetSearchResponse;
import com.gotchabug.moneymate.entity.AssetMaster;
import com.gotchabug.moneymate.repository.AssetMasterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MarketAssetSearchService {

    private static final String YAHOO_SEARCH_URL =
            "https://query1.finance.yahoo.com/v1/finance/search?q=";
    private static final int SEARCH_LIMIT = 10;

    private final ObjectMapper objectMapper;
    private final AssetMasterRepository assetMasterRepository;
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(3))
            .build();

    public List<MarketAssetSearchResponse> searchAssets(String keyword) {
        String normalizedKeyword = normalize(keyword);

        if (normalizedKeyword.isBlank()) {
            return fallbackAssets("");
        }

        List<MarketAssetSearchResponse> koreanAssets =
                searchKoreanAssets(normalizedKeyword);

        if (!koreanAssets.isEmpty()) {
            return koreanAssets;
        }

        if (containsHangul(normalizedKeyword)
                || isNumericKeyword(normalizedKeyword)) {
            return fallbackAssets(normalizedKeyword);
        }

        try {
            List<MarketAssetSearchResponse> yahooResults =
                    searchYahooFinance(normalizedKeyword);

            if (!yahooResults.isEmpty()) {
                return yahooResults;
            }
        } catch (IOException | InterruptedException | RuntimeException exception) {
            if (exception instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
        }

        return fallbackAssets(normalizedKeyword);
    }

    private List<MarketAssetSearchResponse> searchKoreanAssets(String keyword) {
        return assetMasterRepository
                .searchKoreanAssets(keyword, PageRequest.of(0, SEARCH_LIMIT))
                .stream()
                .map(this::toSearchResponse)
                .toList();
    }

    private MarketAssetSearchResponse toSearchResponse(
            AssetMaster assetMaster
    ) {
        return new MarketAssetSearchResponse(
                assetMaster.getSymbol(),
                assetMaster.getYahooSymbol(),
                assetMaster.getAssetName(),
                assetMaster.getMarket(),
                assetMaster.getAssetType(),
                assetMaster.getCountry(),
                defaultExpectedAnnualReturn(assetMaster.getAssetType()),
                defaultAnnualVolatility(assetMaster.getAssetType()),
                defaultTheme(assetMaster)
        );
    }

    private List<MarketAssetSearchResponse> searchYahooFinance(String keyword)
            throws IOException, InterruptedException {

        String encodedKeyword = URLEncoder.encode(
                keyword,
                StandardCharsets.UTF_8
        );
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(YAHOO_SEARCH_URL + encodedKeyword))
                .timeout(Duration.ofSeconds(5))
                .header("Accept", "application/json")
                .header("User-Agent", "MoneyMate/1.0")
                .GET()
                .build();

        HttpResponse<String> response = httpClient.send(
                request,
                HttpResponse.BodyHandlers.ofString()
        );

        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            return List.of();
        }

        JsonNode quotes = objectMapper.readTree(response.body()).path("quotes");
        Map<String, MarketAssetSearchResponse> results =
                new LinkedHashMap<>();

        if (!quotes.isArray()) {
            return List.of();
        }

        for (JsonNode quote : quotes) {
            String symbol = quote.path("symbol").asText("");

            if (symbol.isBlank()) {
                continue;
            }

            String assetName = firstNonBlank(
                    quote.path("shortname").asText(""),
                    quote.path("longname").asText(""),
                    symbol
            );
            String quoteType = quote.path("quoteType").asText("EQUITY");
            String exchange = quote.path("exchange").asText("");
            String exchangeDisplay = quote.path("exchDisp").asText("");
            String assetType = mapAssetType(quoteType);
            String market = mapMarket(exchange, exchangeDisplay);

            results.putIfAbsent(symbol, new MarketAssetSearchResponse(
                    symbol,
                    symbol,
                    assetName,
                    market,
                    assetType,
                    inferCountry(market),
                    defaultExpectedAnnualReturn(assetType),
                    defaultAnnualVolatility(assetType),
                    firstNonBlank(exchangeDisplay, quoteType, "Yahoo Finance")
            ));

            if (results.size() >= SEARCH_LIMIT) {
                break;
            }
        }

        return new ArrayList<>(results.values());
    }

    private List<MarketAssetSearchResponse> fallbackAssets(String keyword) {
        String normalizedKeyword = normalize(keyword)
                .toLowerCase(Locale.ROOT);

        return fallbackAssetPool().stream()
                .filter(asset -> normalizedKeyword.isBlank()
                        || contains(asset.symbol(), normalizedKeyword)
                        || contains(asset.yahooSymbol(), normalizedKeyword)
                        || contains(asset.assetName(), normalizedKeyword)
                        || contains(asset.assetType(), normalizedKeyword)
                        || contains(asset.market(), normalizedKeyword)
                        || contains(asset.country(), normalizedKeyword)
                        || contains(asset.theme(), normalizedKeyword))
                .limit(SEARCH_LIMIT)
                .toList();
    }

    private List<MarketAssetSearchResponse> fallbackAssetPool() {
        return List.of(
                new MarketAssetSearchResponse(
                        "SPY",
                        "SPY",
                        "S&P 500 ETF",
                        "US",
                        "ETF",
                        "US",
                        0.08,
                        0.16,
                        "미국 주식"
                ),
                new MarketAssetSearchResponse(
                        "QQQ",
                        "QQQ",
                        "Nasdaq 100 ETF",
                        "US",
                        "ETF",
                        "US",
                        0.10,
                        0.20,
                        "미국 성장주"
                ),
                new MarketAssetSearchResponse(
                        "TLT",
                        "TLT",
                        "미국 장기채 ETF",
                        "US",
                        "ETF",
                        "US",
                        0.035,
                        0.09,
                        "채권"
                ),
                new MarketAssetSearchResponse(
                        "AAPL",
                        "AAPL",
                        "Apple",
                        "US",
                        "STOCK",
                        "US",
                        0.09,
                        0.24,
                        "빅테크"
                ),
                new MarketAssetSearchResponse(
                        "MSFT",
                        "MSFT",
                        "Microsoft",
                        "US",
                        "STOCK",
                        "US",
                        0.085,
                        0.22,
                        "빅테크"
                ),
                new MarketAssetSearchResponse(
                        "NVDA",
                        "NVDA",
                        "NVIDIA",
                        "US",
                        "STOCK",
                        "US",
                        0.13,
                        0.34,
                        "AI"
                ),
                new MarketAssetSearchResponse(
                        "005930",
                        "005930.KS",
                        "삼성전자",
                        "KOSPI",
                        "STOCK",
                        "KR",
                        0.065,
                        0.25,
                        "반도체"
                ),
                new MarketAssetSearchResponse(
                        "069500",
                        "069500.KS",
                        "KODEX 200",
                        "KOSPI",
                        "ETF",
                        "KR",
                        0.055,
                        0.18,
                        "국내 지수"
                )
        );
    }

    private String mapAssetType(String quoteType) {
        return switch (normalize(quoteType).toUpperCase(Locale.ROOT)) {
            case "ETF" -> "ETF";
            case "EQUITY" -> "STOCK";
            case "MUTUALFUND" -> "FUND";
            case "INDEX" -> "INDEX";
            case "CRYPTOCURRENCY" -> "CRYPTO";
            default -> "STOCK";
        };
    }

    private String mapMarket(
            String exchange,
            String exchangeDisplay
    ) {
        String normalizedExchange = normalize(exchange)
                .toUpperCase(Locale.ROOT);
        String normalizedDisplay = normalize(exchangeDisplay)
                .toUpperCase(Locale.ROOT);

        if (normalizedExchange.startsWith("KSC")
                || normalizedExchange.startsWith("KOS")
                || normalizedExchange.startsWith("KOE")
                || normalizedDisplay.contains("KOREA")
                || normalizedDisplay.contains("KOSPI")
                || normalizedDisplay.contains("KOSDAQ")) {
            return "KR";
        }

        if (normalizedExchange.startsWith("NMS")
                || normalizedExchange.startsWith("NYQ")
                || normalizedExchange.startsWith("NGM")
                || normalizedExchange.startsWith("NAS")
                || normalizedExchange.startsWith("ASE")
                || normalizedExchange.startsWith("PCX")
                || normalizedExchange.startsWith("BTS")
                || normalizedDisplay.contains("NASDAQ")
                || normalizedDisplay.contains("NYSE")) {
            return "US";
        }

        return firstNonBlank(normalizedExchange, "GLOBAL");
    }

    private Double defaultExpectedAnnualReturn(String assetType) {
        return switch (normalize(assetType).toUpperCase(Locale.ROOT)) {
            case "ETF" -> 0.07;
            case "INDEX" -> 0.06;
            case "CRYPTO" -> 0.12;
            case "FUND" -> 0.05;
            case "ETN" -> 0.06;
            default -> 0.08;
        };
    }

    private Double defaultAnnualVolatility(String assetType) {
        return switch (normalize(assetType).toUpperCase(Locale.ROOT)) {
            case "ETF" -> 0.18;
            case "INDEX" -> 0.16;
            case "CRYPTO" -> 0.45;
            case "FUND" -> 0.12;
            case "ETN" -> 0.22;
            default -> 0.25;
        };
    }

    private String defaultTheme(AssetMaster assetMaster) {
        if ("ETF".equalsIgnoreCase(assetMaster.getAssetType())) {
            return "국내 ETF";
        }

        if ("ETN".equalsIgnoreCase(assetMaster.getAssetType())) {
            return "국내 ETN";
        }

        return "한국 주식";
    }

    private String inferCountry(String market) {
        String normalizedMarket = normalize(market).toUpperCase(Locale.ROOT);

        if ("KR".equals(normalizedMarket)
                || "KOSPI".equals(normalizedMarket)
                || "KOSDAQ".equals(normalizedMarket)
                || normalizedMarket.startsWith("KSC")
                || normalizedMarket.startsWith("KOS")
                || normalizedMarket.startsWith("KOE")) {
            return "KR";
        }

        if ("US".equals(normalizedMarket)
                || normalizedMarket.startsWith("NMS")
                || normalizedMarket.startsWith("NYQ")
                || normalizedMarket.startsWith("NGM")
                || normalizedMarket.startsWith("NAS")
                || normalizedMarket.startsWith("ASE")
                || normalizedMarket.startsWith("PCX")
                || normalizedMarket.startsWith("BTS")) {
            return "US";
        }

        return "GLOBAL";
    }

    private boolean containsHangul(String value) {
        return normalize(value).chars()
                .anyMatch(character -> character >= '가'
                        && character <= '힣');
    }

    private boolean isNumericKeyword(String value) {
        return normalize(value).matches("\\d+");
    }

    private boolean contains(String value, String keyword) {
        return normalize(value).toLowerCase(Locale.ROOT).contains(keyword);
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value.trim();
            }
        }

        return "";
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }
}
