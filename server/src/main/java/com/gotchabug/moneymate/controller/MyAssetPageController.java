package com.gotchabug.moneymate.controller;

import com.gotchabug.moneymate.dto.HoldingDto;
import com.gotchabug.moneymate.dto.WatchlistDto;
import com.gotchabug.moneymate.dto.financial.FinancialProfileResponse;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.FinancialProfileService;
import com.gotchabug.moneymate.service.HoldingService;
import com.gotchabug.moneymate.service.WatchlistService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class MyAssetPageController {

    private final FinancialProfileService financialProfileService;
    private final HoldingService holdingService;
    private final WatchlistService watchlistService;

    @GetMapping("/my-asset")
    public String myAssetPage(HttpSession session, Model model) {
        Object loginUserObj = session.getAttribute("loginUser");

        if (!(loginUserObj instanceof Member loginUser)) {
            return "redirect:/login";
        }

        Long memberId = loginUser.getMemberId();
        model.addAttribute("member", loginUser);

        // 재무정보
        try {
            FinancialProfileResponse profile =
                    financialProfileService.getMyFinancialProfile(loginUser);
            model.addAttribute("profile", profile);
        } catch (Exception e) {
            model.addAttribute("profile", null);
        }

        // 장바구니 (investment_holding)
        try {
            List<HoldingDto> holdings = holdingService.getHoldingList(memberId);
            model.addAttribute("holdings", holdings);
        } catch (Exception e) {
            model.addAttribute("holdings", List.of());
        }

        // 관심 종목 (watchlist)
        try {
            List<WatchlistDto> watchlistItems = watchlistService.getWatchlist(memberId);
            model.addAttribute("watchlistItems", watchlistItems);
        } catch (Exception e) {
            model.addAttribute("watchlistItems", List.of());
        }

        return "my-asset";
    }
}