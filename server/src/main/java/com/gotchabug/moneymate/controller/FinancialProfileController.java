package com.gotchabug.moneymate.controller;

import com.gotchabug.moneymate.entity.FinancialProfile;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.repository.FinancialProfileRepository;
import com.gotchabug.moneymate.service.FinancialProfileService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@Controller
@RequiredArgsConstructor
@RequestMapping("/financial")
public class FinancialProfileController {

    private final FinancialProfileRepository financialProfileRepository;
    private final FinancialProfileService financialProfileService;

    @GetMapping("/profile")
    public String financialProfilePage(
            HttpSession session,
            Model model
    ) {

        Member loginUser =
                (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        FinancialProfile profile =
                financialProfileRepository
                        .findByMember_MemberId(loginUser.getMemberId())
                        .orElse(null);

        model.addAttribute("profile", profile);

        return "financial-profile";
    }

    @PostMapping("/profile")
    public String updateFinancialProfile(
            HttpSession session,

            @RequestParam BigDecimal monthlyIncome,
            @RequestParam BigDecimal monthlyFixedExpense,
            @RequestParam BigDecimal monthlyVariableExpense,
            @RequestParam BigDecimal totalAsset,
            @RequestParam BigDecimal totalLiability,
            @RequestParam BigDecimal cashAsset
    ) {

        Member loginUser =
                (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        financialProfileService.updateFinancialProfile(
                loginUser.getMemberId(),
                monthlyIncome,
                monthlyFixedExpense,
                monthlyVariableExpense,
                totalAsset,
                totalLiability,
                cashAsset
        );

        return "redirect:/mypage";
    }
}