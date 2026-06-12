package com.gotchabug.moneymate.market.controller;

import com.gotchabug.moneymate.market.dto.MarketAssetSearchResponse;
import com.gotchabug.moneymate.market.MarketAssetSearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
@Tag(
        name = "Market Assets",
        description = "국내 종목 마스터 및 Yahoo Finance 기반 종목 검색 API"
)
public class MarketAssetController {

    private final MarketAssetSearchService marketAssetSearchService;

    @GetMapping("/search")
    @Operation(
            summary = "종목 검색",
            description = """
                    종목명 또는 티커(symbol)를 이용하여 종목을 검색합니다.
                    
                    검색 방식
                    - 한글 입력 : 국내 종목 마스터 검색
                    - 숫자 입력 : 국내 종목 코드 검색
                    - 영문 입력 : Yahoo Finance 종목 검색
                    
                    예시
                    - 삼성전자
                    - 005930
                    - AAPL
                    - TSLA
                    - NVDA
                    """
    )
    public List<MarketAssetSearchResponse> searchAssets(

            @Parameter(
                    description = "검색 키워드(종목명 또는 티커)",
                    example = "삼성전자"
            )
            @RequestParam(defaultValue = "")
            String keyword
    ) {

        return marketAssetSearchService.searchAssets(
                keyword
        );
    }
}