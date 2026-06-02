package com.gotchabug.moneymate.investment.controller;

import com.gotchabug.moneymate.investment.dto.AssetSummaryDto;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.investment.service.InvestmentInfoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Tag(
        name = "Investment Info Page",
        description = "투자정보 화면 조회 API"
)
@Controller
@RequestMapping("/investment-info")
@RequiredArgsConstructor
public class InvestmentInfoPageController {

    private final InvestmentInfoService investmentInfoService;

    @Operation(
            summary = "투자정보 화면 조회",
            description = """
                    로그인한 사용자의 투자정보 화면을 조회합니다.

                    조회 항목
                    - 국내/해외/ETF 종목 리스트
                    - 상단 시장 지수 카드
                    - 테마별 TOP 종목
                    - 배당금 TOP 종목

                    market 파라미터 값
                    - ALL: 전체
                    - KR: 국내
                    - OVERSEAS: 해외
                    - ETF: ETF
                    """
    )
    @GetMapping
    public String investmentInfo(

            @Parameter(
                    description = "조회할 시장 구분",
                    example = "ALL"
            )
            @RequestParam(
                    value = "market",
                    required = false,
                    defaultValue = "ALL"
            )
            String market,

            @Parameter(hidden = true)
            HttpSession session,

            @Parameter(hidden = true)
            Model model
    ) {

        Member loginUser =
                (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        List<AssetSummaryDto> assetList = switch (market) {
            case "KR" -> investmentInfoService.getKoreanList();
            case "OVERSEAS" -> investmentInfoService.getOverseasList();
            case "ETF" -> investmentInfoService.getEtfList();
            default -> investmentInfoService.getAssetList();
        };

        model.addAttribute(
                "kospi",
                investmentInfoService.getMarketIndex("069500")
        );

        model.addAttribute(
                "kosdaq",
                investmentInfoService.getMarketIndex("229200")
        );

        model.addAttribute(
                "snp500",
                investmentInfoService.getMarketIndex("SPY")
        );

        model.addAttribute(
                "usdKrw",
                investmentInfoService.getMarketIndex("USD/KRW")
        );

        model.addAttribute(
                "assetList",
                assetList
        );

        model.addAttribute(
                "selectedMarket",
                market
        );

        model.addAttribute(
                "loginUser",
                loginUser
        );

        model.addAttribute(
                "semiList",
                investmentInfoService.getTopBySector("반도체")
        );

        model.addAttribute(
                "batteryList",
                investmentInfoService.getTopBySector("2차전지")
        );

        model.addAttribute(
                "aiList",
                investmentInfoService.getTopBySector("AI")
        );

        model.addAttribute(
                "bioList",
                investmentInfoService.getTopBySector("바이오")
        );

        model.addAttribute(
                "finList",
                investmentInfoService.getTopBySector("금융")
        );

        model.addAttribute(
                "energyList",
                investmentInfoService.getTopBySector("에너지")
        );

        model.addAttribute(
                "consumeList",
                investmentInfoService.getTopBySector("소비재")
        );

        model.addAttribute(
                "itList",
                investmentInfoService.getTopBySector("IT")
        );

        model.addAttribute(
                "etfThemeList",
                investmentInfoService.getEtfThemeTop10()
        );

        model.addAttribute(
                "dividendKoreanList",
                investmentInfoService.getDividendTopKorean()
        );

        model.addAttribute(
                "dividendOverseasList",
                investmentInfoService.getDividendTopOverseas()
        );

        model.addAttribute(
                "dividendEtfList",
                investmentInfoService.getDividendTopEtf()
        );

        return "investment-info";
    }
}