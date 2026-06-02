package com.gotchabug.moneymate.controller.investment;

import com.gotchabug.moneymate.dto.investment.AssetSummaryDto;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.InvestmentInfoService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * 투자정보 페이지 컨트롤러
 * URL: GET /investment-info
 */
@Controller
@RequestMapping("/investment-info")
@RequiredArgsConstructor
public class InvestmentInfoPageController {

    private final InvestmentInfoService investmentInfoService;

    @GetMapping
    public String investmentInfo(
            @RequestParam(value = "market", required = false, defaultValue = "ALL") String market,
            HttpSession session,
            Model model
    ) {
        // 로그인 체크
        Member loginUser = (Member) session.getAttribute("loginUser");
        if (loginUser == null) {
            return "redirect:/login";
        }

        // 탭별 종목 리스트
        List<AssetSummaryDto> assetList = switch (market) {
            case "KR"       -> investmentInfoService.getKoreanList();
            case "OVERSEAS" -> investmentInfoService.getOverseasList();
            case "ETF"      -> investmentInfoService.getEtfList();
            default         -> investmentInfoService.getAssetList();
        };

        // 상단 지수 카드 4개
        model.addAttribute("kospi",  investmentInfoService.getMarketIndex("069500"));
        model.addAttribute("kosdaq", investmentInfoService.getMarketIndex("229200"));
        model.addAttribute("snp500", investmentInfoService.getMarketIndex("SPY"));
        model.addAttribute("usdKrw", investmentInfoService.getMarketIndex("USD/KRW"));

        // 종목 리스트 + 탭
        model.addAttribute("assetList",      assetList);
        model.addAttribute("selectedMarket", market);
        model.addAttribute("loginUser",      loginUser);

        // ★ 테마별 종목 TOP 6 (1개월 수익률순)
        model.addAttribute("semiList",     investmentInfoService.getTopBySector("반도체"));
        model.addAttribute("batteryList",  investmentInfoService.getTopBySector("2차전지"));
        model.addAttribute("aiList",       investmentInfoService.getTopBySector("AI"));
        model.addAttribute("bioList",      investmentInfoService.getTopBySector("바이오"));
        model.addAttribute("finList",      investmentInfoService.getTopBySector("금융"));
        model.addAttribute("energyList",   investmentInfoService.getTopBySector("에너지"));
        model.addAttribute("consumeList",  investmentInfoService.getTopBySector("소비재"));
        model.addAttribute("itList",       investmentInfoService.getTopBySector("IT"));
        model.addAttribute("etfThemeList", investmentInfoService.getEtfThemeTop10());

        // ★ 배당금 TOP 6 (국내 / 해외 / ETF)
        // asset 마스터 DB에서 market + asset_type 카테고리 필터링으로 각각 조회
        model.addAttribute("dividendKoreanList",   investmentInfoService.getDividendTopKorean());
        model.addAttribute("dividendOverseasList",  investmentInfoService.getDividendTopOverseas());
        model.addAttribute("dividendEtfList",       investmentInfoService.getDividendTopEtf());

        return "investment-info";
    }
}