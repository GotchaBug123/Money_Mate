package com.gotchabug.moneymate.market.dto;

public record MarketAssetSearchResponse(
        String symbol,
        String yahooSymbol,
        String assetName,
        String market,
        String assetType,
        String country,
        Double expectedAnnualReturn,
        Double annualVolatility,
        String theme
) {

    public MarketAssetSearchResponse(
            String symbol,
            String assetName,
            String assetType,
            String market,
            Double expectedAnnualReturn,
            Double annualVolatility,
            String theme
    ) {
        this(
                symbol,
                symbol,
                assetName,
                market,
                assetType,
                inferCountry(market),
                expectedAnnualReturn,
                annualVolatility,
                theme
        );
    }

    private static String inferCountry(String market) {
        if ("KR".equalsIgnoreCase(market)
                || "KOSPI".equalsIgnoreCase(market)
                || "KOSDAQ".equalsIgnoreCase(market)) {
            return "KR";
        }

        if ("US".equalsIgnoreCase(market)) {
            return "US";
        }

        return "GLOBAL";
    }
}
