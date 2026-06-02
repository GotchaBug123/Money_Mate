package com.gotchabug.moneymate.controller.investment;

import com.gotchabug.moneymate.entity.FinancialProfile;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.entity.RiskAnswerSheet;
import com.gotchabug.moneymate.repository.FinancialProfileRepository;
import com.gotchabug.moneymate.repository.RiskAnswerSheetRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class MyInvestmentController {

    private final FinancialProfileRepository financialProfileRepository;
    private final RiskAnswerSheetRepository riskAnswerSheetRepository;

    @GetMapping("/my-investment")
    public String myInvestment(HttpSession session, Model model) {

        Object loginUserObj = session.getAttribute("loginUser");

        if (!(loginUserObj instanceof Member loginUser)) {
            return "redirect:/login";
        }

        FinancialProfile profile = financialProfileRepository
                .findByMember_MemberId(loginUser.getMemberId())
                .orElse(null);

        RiskAnswerSheet riskResult = riskAnswerSheetRepository
                .findTopByMember_MemberIdOrderBySubmittedAtDesc(loginUser.getMemberId())
                .orElse(null);

        Integer diagnosisScore = calculateDiagnosisScore(profile);

        model.addAttribute("member", loginUser);
        model.addAttribute("profile", profile);
        model.addAttribute("riskResult", riskResult);
        model.addAttribute("diagnosisScore", diagnosisScore);

        return "my-investment";
    }

    private Integer calculateDiagnosisScore(FinancialProfile profile) {
        if (profile == null || profile.getMonthlyIncome() == null) {
            return null;
        }

        double income = profile.getMonthlyIncome().doubleValue();
        double fixed = profile.getMonthlyFixedExpense().doubleValue();
        double variable = profile.getMonthlyVariableExpense().doubleValue();
        double investable = profile.getInvestableAmount().doubleValue();

        if (income <= 0) {
            return 0;
        }

        double expenseRatio = (fixed + variable) / income;
        double investRatio = investable / income;

        int score = 100;

        if (expenseRatio > 0.8) {
            score -= 35;
        } else if (expenseRatio > 0.6) {
            score -= 20;
        } else if (expenseRatio > 0.4) {
            score -= 10;
        }

        if (investRatio < 0.1) {
            score -= 25;
        } else if (investRatio < 0.2) {
            score -= 10;
        }

        return Math.max(score, 0);
    }
}