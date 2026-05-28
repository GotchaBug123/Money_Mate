package com.gotchabug.moneymate.controller;

import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.MyInvestmentService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class MyInvestmentController {

    private final MyInvestmentService myInvestmentService;

    @GetMapping("/my-investment")
    public String myInvestmentPage(HttpSession session, Model model) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        Long memberId = loginUser.getMemberId();

        model.addAttribute("holdings", myInvestmentService.getMyHoldings(memberId));
        model.addAttribute("watchlist", myInvestmentService.getMyWatchlist(memberId));

        return "my-investment";
    }
}