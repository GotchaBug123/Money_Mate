package com.gotchabug.moneymate.market.controller;

import com.gotchabug.moneymate.market.service.YahooFinancePriceSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/market/sync")
public class MarketDataSyncController {

    private final YahooFinancePriceSyncService yahooFinancePriceSyncService;

    @GetMapping("/yahoo-prices")
    public Map<String, String> syncYahooPrices() {

        yahooFinancePriceSyncService.syncFiveYearPrices();

        return Map.of(
                "message",
                "Yahoo Finance 5년 가격 데이터 수집 완료"
        );
    }
}