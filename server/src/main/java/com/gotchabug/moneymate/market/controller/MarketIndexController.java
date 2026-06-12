package com.gotchabug.moneymate.market.controller;

import com.gotchabug.moneymate.investment.dto.MarketIndexDto;
import com.gotchabug.moneymate.market.MarketIndexService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(
        name = "Market Index",
        description = "실시간 시장 지수 조회 API"
)
public class MarketIndexController {

    private final MarketIndexService marketIndexService;

    @GetMapping("/api/market/index")
    @Operation(
            summary = "실시간 시장 지수 조회",
            description = """
                    Yahoo Finance 데이터를 기반으로 주요 시장 지수를 조회합니다.
                    
                    조회 대상
                    - 코스피
                    - 코스닥
                    - S&P500
                    - 원/달러 환율
                    
                    반환 데이터
                    - 현재가
                    - 등락률
                    - 통화
                    - 시장 상태
                    - 스파크라인 차트 데이터
                    - 화면 표시용 포맷 데이터
                    
                    investment-info 화면에서
                    DOMContentLoaded 시 자동 호출되며
                    60초마다 자동 갱신됩니다.
                    """
    )
    public List<MarketIndexDto> getMarketIndex() {

        return marketIndexService.getAllIndexes();
    }
}