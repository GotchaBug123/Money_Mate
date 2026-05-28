package com.gotchabug.moneymate.controller;

import com.gotchabug.moneymate.dto.financial.FinancialProfileResponse;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.FinancialProfileService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class MyAssetController {

    private final FinancialProfileService financialProfileService;

    @GetMapping("/my-asset")
    public String myAssetMain() {
        return "my-asset";
    }

    @GetMapping("/my-asset/financial")
    public String myAssetFinancialPage(HttpSession session, Model model) {

        Object loginUserObj = session.getAttribute("loginUser");

        if (!(loginUserObj instanceof Member loginUser)) {
            return "redirect:/login";
        }

        FinancialProfileResponse profile =
                financialProfileService.getMyFinancialProfile(loginUser);

        model.addAttribute("member", loginUser);
        model.addAttribute("profile", profile);

        return "my-asset-financial";
    }

    @GetMapping("/my-investment")
    public String myInvestmentPage() {
        return "my-investment";
    }
}