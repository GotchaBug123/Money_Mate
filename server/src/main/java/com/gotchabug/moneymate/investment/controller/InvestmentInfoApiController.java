package com.gotchabug.moneymate.investment.controller;

import com.gotchabug.moneymate.investment.dto.AssetSummaryDto;
import com.gotchabug.moneymate.investment.service.InvestmentInfoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "투자정보", description = "투자정보 화면 데이터 REST API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/investment-info")
public class InvestmentInfoApiController {

    private final InvestmentInfoService investmentInfoService;

    @Operation(summary = "투자정보 전체 화면 데이터 조회")
    @GetMapping
    public InvestmentInfoResponse getInvestmentInfo(
            @RequestParam(defaultValue = "ALL") String market
    ) {
        List<AssetSummaryDto> assetList = switch (market) {
            case "KR" -> investmentInfoService.getKoreanList();
            case "OVERSEAS" -> investmentInfoService.getOverseasList();
            case "ETF" -> investmentInfoService.getEtfList();
            default -> investmentInfoService.getAssetList();
        };

        return InvestmentInfoResponse.builder()
                .selectedMarket(market)
                .assetList(assetList)
                .kospi(investmentInfoService.getMarketIndex("069500"))
                .kosdaq(investmentInfoService.getMarketIndex("229200"))
                .snp500(investmentInfoService.getMarketIndex("SPY"))
                .usdKrw(investmentInfoService.getMarketIndex("USD/KRW"))
                .semiList(investmentInfoService.getTopBySector("반도체"))
                .batteryList(investmentInfoService.getTopBySector("2차전지"))
                .aiList(investmentInfoService.getTopBySector("AI"))
                .bioList(investmentInfoService.getTopBySector("바이오"))
                .finList(investmentInfoService.getTopBySector("금융"))
                .energyList(investmentInfoService.getTopBySector("에너지"))
                .consumeList(investmentInfoService.getTopBySector("소비재"))
                .itList(investmentInfoService.getTopBySector("IT"))
                .etfThemeList(investmentInfoService.getEtfThemeTop10())
                .dividendKoreanList(investmentInfoService.getDividendTopKorean())
                .dividendOverseasList(investmentInfoService.getDividendTopOverseas())
                .dividendEtfList(investmentInfoService.getDividendTopEtf())
                .build();
    }

    @Getter
    @Builder
    public static class InvestmentInfoResponse {
        private String selectedMarket;
        private List<AssetSummaryDto> assetList;

        private Object kospi;
        private Object kosdaq;
        private Object snp500;
        private Object usdKrw;

        private List<AssetSummaryDto> semiList;
        private List<AssetSummaryDto> batteryList;
        private List<AssetSummaryDto> aiList;
        private List<AssetSummaryDto> bioList;
        private List<AssetSummaryDto> finList;
        private List<AssetSummaryDto> energyList;
        private List<AssetSummaryDto> consumeList;
        private List<AssetSummaryDto> itList;

        private List<AssetSummaryDto> etfThemeList;
        private List<AssetSummaryDto> dividendKoreanList;
        private List<AssetSummaryDto> dividendOverseasList;
        private List<AssetSummaryDto> dividendEtfList;
    }
}