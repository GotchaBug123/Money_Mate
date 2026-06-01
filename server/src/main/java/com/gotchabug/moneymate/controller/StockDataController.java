package com.gotchabug.moneymate.controller;

import com.gotchabug.moneymate.dto.investment.AssetSummaryDto;
import com.gotchabug.moneymate.entity.Asset;
import com.gotchabug.moneymate.entity.AssetPrice;
import com.gotchabug.moneymate.repository.AssetPriceRepository;
import com.gotchabug.moneymate.repository.AssetRepository;
import com.gotchabug.moneymate.service.InvestmentInfoService;
import com.gotchabug.moneymate.service.StockDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class StockDataController {

    private final StockDataService stockDataService;
    private final AssetRepository assetRepository;
    private final AssetPriceRepository assetPriceRepository;
    private final InvestmentInfoService investmentInfoService;

    @GetMapping("/api/stock/sync")
    public String sync() {
        return stockDataService.syncAll();
    }

    @GetMapping("/api/stock/sync-overseas-top")
    public String syncOverseasTop() {
        return stockDataService.syncOverseasTop100();
    }

    @GetMapping("/api/stock/sync-all")
    public String syncAll() {
        String r1 = stockDataService.syncAll();
        String r2 = stockDataService.syncOverseasTop100();
        return r1 + "\n" + r2;
    }

    // ── [신규] 배당 수익률 동기화 엔드포인트 ──────────────────
    /**
     * Yahoo Finance에서 실제 배당 수익률(trailingAnnualDividendYield)을 수집하여
     * asset_indicator.dividend_yield_pct 에 저장합니다.
     *
     * 실행 순서:
     *   1. GET /api/stock/sync          ← 주가/수익률 동기화 (기존)
     *   2. GET /api/stock/sync-dividend ← 배당 수익률 동기화 (신규)
     *
     * 완료 후 배당금 TOP 6 화면에:
     *   - 실제 배당 수익률(%) 기준으로 정렬됨
     *   - 10% 이상 비정상 종목은 자동 제외됨
     */
    @GetMapping("/api/stock/sync-dividend")
    public String syncDividend() {
        return stockDataService.syncDividendYields();
    }
    // ─────────────────────────────────────────────────────────

    @GetMapping("/api/test/sector")
    public String testSector() {
        List<Asset> assets = assetRepository.findBySectorContaining("반도체");

        StringBuilder sb = new StringBuilder();
        sb.append("=== findBySectorContaining('반도체') 결과: ")
                .append(assets.size()).append("건 ===\n");

        for (Asset a : assets) {
            List<AssetPrice> prices =
                    assetPriceRepository.findLatestByAssetId(a.getAssetId());
            sb.append("ticker=").append(a.getTicker())
                    .append(" | name=").append(a.getAssetName())
                    .append(" | sector=").append(a.getSector())
                    .append(" | assetId=").append(a.getAssetId())
                    .append(" | priceCount=").append(prices.size())
                    .append("\n");
        }
        return sb.toString();
    }

    @GetMapping("/api/dividend/top6")
    public Map<String, Object> getDividendTop6() {
        List<AssetSummaryDto> korean   = investmentInfoService.getDividendTopKorean();
        List<AssetSummaryDto> overseas = investmentInfoService.getDividendTopOverseas();
        List<AssetSummaryDto> etf      = investmentInfoService.getDividendTopEtf();

        String updatedAt = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        return Map.of(
                "korean",    korean,
                "overseas",  overseas,
                "etf",       etf,
                "updatedAt", updatedAt
        );
    }
}