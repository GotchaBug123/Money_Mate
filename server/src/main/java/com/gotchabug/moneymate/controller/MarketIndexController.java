package com.gotchabug.moneymate.controller;

import com.gotchabug.moneymate.dto.investment.MarketIndexDto;
import com.gotchabug.moneymate.service.MarketIndexService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 시장 지수 카드 REST 컨트롤러
 *
 * GET /api/market/index
 *   → MarketIndexService.getAllIndexes() 호출
 *   → Yahoo Finance 5분봉 실시간 파싱
 *   → 코스피 / 코스닥 / S&P500 / 달러환율 4개 반환
 *
 * 호출 주체:
 *   investment-info.html 의 JS loadMarketIndex()
 *   → DOMContentLoaded 즉시 1회 + 60초마다 자동 갱신
 *
 * 응답 예시:
 * [
 *   {
 *     "yahooSymbol"     : "069500.KS",
 *     "label"           : "코스피 추종 (KODEX 200)",
 *     "name"            : "KODEX 200",
 *     "currency"        : "KRW",
 *     "price"           : 127800.00,
 *     "changePercent"   : 3.61,
 *     "marketState"     : "CLOSED",
 *     "sparkline"       : [126500.0, 126800.0, 127200.0, ...],
 *     "priceLabel"      : "127,800원",
 *     "changeLabel"     : "+3.61%",
 *     "rise"            : true,
 *     "marketStateLabel": "장 마감"
 *   },
 *   ...
 * ]
 */
@RestController
@RequiredArgsConstructor
public class MarketIndexController {

    private final MarketIndexService marketIndexService;

    @GetMapping("/api/market/index")
    public List<MarketIndexDto> getMarketIndex() {
        return marketIndexService.getAllIndexes();
    }
}