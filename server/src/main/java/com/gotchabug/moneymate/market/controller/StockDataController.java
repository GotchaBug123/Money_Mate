package com.gotchabug.moneymate.market.controller;

import com.gotchabug.moneymate.investment.dto.AssetSummaryDto;
import com.gotchabug.moneymate.market.entity.Asset;
import com.gotchabug.moneymate.market.entity.AssetPrice;
import com.gotchabug.moneymate.market.repository.AssetPriceRepository;
import com.gotchabug.moneymate.market.repository.AssetRepository;
import com.gotchabug.moneymate.investment.service.InvestmentInfoService;
import com.gotchabug.moneymate.investment.service.StockDataService;
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
@Tag(
        name = "Stock Data",
        description = "주가 데이터 동기화 및 배당 수익률 조회 API"
)
public class StockDataController {

    private final StockDataService stockDataService;
    private final AssetRepository assetRepository;
    private final AssetPriceRepository assetPriceRepository;
    private final InvestmentInfoService investmentInfoService;

    @Operation(
            summary = "국내 주가 데이터 동기화",
            description = "국내 종목의 주가 및 수익률 데이터를 동기화합니다."
    )
    @GetMapping("/api/stock/sync")
    public String sync() {
        return stockDataService.syncAll();
    }

    @Operation(
            summary = "해외 상위 종목 데이터 동기화",
            description = "Yahoo Finance 기반으로 해외 상위 100개 종목 데이터를 동기화합니다."
    )
    @GetMapping("/api/stock/sync-overseas-top")
    public String syncOverseasTop() {
        return stockDataService.syncOverseasTop100();
    }

    @Operation(
            summary = "전체 주가 데이터 동기화",
            description = "국내 종목 데이터와 해외 상위 100개 종목 데이터를 함께 동기화합니다."
    )
    @GetMapping("/api/stock/sync-all")
    public String syncAll() {
        String r1 = stockDataService.syncAll();
        String r2 = stockDataService.syncOverseasTop100();

        return r1 + "\n" + r2;
    }

    @Operation(
            summary = "배당 수익률 동기화",
            description = """
                    Yahoo Finance에서 실제 배당 수익률 데이터를 수집하여 저장합니다.

                    저장 대상
                    - asset_indicator.dividend_yield_pct

                    활용 화면
                    - 배당금 TOP 6
                    - 국내 배당 TOP
                    - 해외 배당 TOP
                    - ETF 배당 TOP

                    비정상적으로 높은 배당 수익률 종목은 서비스 로직에서 제외됩니다.
                    """
    )
    @GetMapping("/api/stock/sync-dividend")
    public String syncDividend() {
        return stockDataService.syncDividendYields();
    }

    @Operation(
            summary = "섹터 종목 테스트 조회",
            description = """
                    반도체 섹터에 포함된 종목과 해당 종목의 최신 가격 데이터 개수를 확인하는 테스트 API입니다.

                    개발 및 데이터 검증용 API입니다.
                    """
    )
    @GetMapping("/api/test/sector")
    public String testSector() {

        List<Asset> assets =
                assetRepository.findBySectorContaining("반도체");

        StringBuilder sb =
                new StringBuilder();

        sb.append("=== findBySectorContaining('반도체') 결과: ")
                .append(assets.size())
                .append("건 ===\n");

        for (Asset a : assets) {

            List<AssetPrice> prices =
                    assetPriceRepository.findLatestByAssetId(
                            a.getAssetId()
                    );

            sb.append("ticker=")
                    .append(a.getTicker())
                    .append(" | name=")
                    .append(a.getAssetName())
                    .append(" | sector=")
                    .append(a.getSector())
                    .append(" | assetId=")
                    .append(a.getAssetId())
                    .append(" | priceCount=")
                    .append(prices.size())
                    .append("\n");
        }

        return sb.toString();
    }

    @Operation(
            summary = "배당 TOP 6 조회",
            description = """
                    국내, 해외, ETF 카테고리별 배당 수익률 TOP 6 종목을 조회합니다.

                    반환 항목
                    - 국내 배당 TOP 6
                    - 해외 배당 TOP 6
                    - ETF 배당 TOP 6
                    - 조회 시각
                    """
    )
    @GetMapping("/api/dividend/top6")
    public Map<String, Object> getDividendTop6() {

        List<AssetSummaryDto> korean =
                investmentInfoService.getDividendTopKorean();

        List<AssetSummaryDto> overseas =
                investmentInfoService.getDividendTopOverseas();

        List<AssetSummaryDto> etf =
                investmentInfoService.getDividendTopEtf();

        String updatedAt =
                LocalDateTime.now()
                        .format(
                                DateTimeFormatter.ofPattern(
                                        "yyyy-MM-dd HH:mm:ss"
                                )
                        );

        return Map.of(
                "korean",
                korean,
                "overseas",
                overseas,
                "etf",
                etf,
                "updatedAt",
                updatedAt
        );
    }
}