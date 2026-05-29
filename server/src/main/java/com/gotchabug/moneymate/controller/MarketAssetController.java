package com.gotchabug.moneymate.controller;

import com.gotchabug.moneymate.dto.market.MarketAssetSearchResponse;
import com.gotchabug.moneymate.service.MarketAssetSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/market/assets")
public class MarketAssetController {

    private final MarketAssetSearchService marketAssetSearchService;

    @GetMapping("/search")
    public List<MarketAssetSearchResponse> searchAssets(
            @RequestParam(defaultValue = "") String keyword
    ) {
        return marketAssetSearchService.searchAssets(keyword);
    }
}
