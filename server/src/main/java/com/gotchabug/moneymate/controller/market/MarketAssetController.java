package com.gotchabug.moneymate.controller.market;

import com.gotchabug.moneymate.dto.market.MarketAssetSearchResponse;
import com.gotchabug.moneymate.service.MarketAssetSearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/market/assets")
@Tag(name = "Market Assets", description = "국내 종목 마스터 및 Yahoo Finance 기반 종목 검색 API")
public class MarketAssetController {

    private final MarketAssetSearchService marketAssetSearchService;

    @GetMapping("/search")
    @Operation(
            summary = "종목 검색",
            description = "한글/숫자 키워드는 국내 종목 마스터에서 우선 검색하고, 영문 티커는 Yahoo Finance 검색 결과를 반환합니다."
    )
    public List<MarketAssetSearchResponse> searchAssets(
            @RequestParam(defaultValue = "") String keyword
    ) {
        return marketAssetSearchService.searchAssets(keyword);
    }
}
