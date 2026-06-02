package com.gotchabug.moneymate.controller.market;

import com.gotchabug.moneymate.dto.investment.AssetSummaryDto;
import com.gotchabug.moneymate.entity.Asset;
import com.gotchabug.moneymate.entity.AssetPrice;
import com.gotchabug.moneymate.repository.AssetPriceRepository;
import com.gotchabug.moneymate.repository.AssetRepository;
import com.gotchabug.moneymate.service.InvestmentInfoService;
import com.gotchabug.moneymate.service.StockDataService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Tag(name = "Stock Data", description = "주식 데이터 동기화 및 투자정보 조회 API")
public class StockDataController {

    private final StockDataService stockDataService;
    private final AssetRepository assetRepository;
    private final AssetPriceRepository assetPriceRepository;
    private final InvestmentInfoService investmentInfoService;

    @GetMapping("/api/stock/sync")
    @Operation(summary = "국내 주식 데이터 동기화", description = "주가와 수익률 데이터를 외부 데이터 소스에서 동기화합니다.")
    public String sync() {
        return stockDataService.syncAll();
    }

    @GetMapping("/api/stock/sync-overseas-top")
    @Operation(summary = "해외 거래량 상위 종목 동기화", description = "해외 주식 거래량 상위 종목 데이터를 동기화합니다.")
    public String syncOverseasTop() {
        return stockDataService.syncOverseasTop100();
    }

    @GetMapping("/api/stock/sync-all")
    @Operation(summary = "전체 주식 데이터 동기화", description = "국내 주식 데이터와 해외 거래량 상위 종목 데이터를 함께 동기화합니다.")
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
    @Operation(summary = "배당 수익률 동기화", description = "Yahoo Finance 배당 수익률 데이터를 asset_indicator에 저장합니다.")
    public String syncDividend() {
        return stockDataService.syncDividendYields();
    }
    // ─────────────────────────────────────────────────────────

    @GetMapping("/api/test/sector")
    @Operation(summary = "섹터 검색 테스트", description = "특정 섹터에 해당하는 자산과 가격 데이터 존재 여부를 확인합니다.")
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
    @Operation(summary = "배당 상위 종목 조회", description = "국내, 해외, ETF 배당 상위 종목을 조회합니다.")
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
