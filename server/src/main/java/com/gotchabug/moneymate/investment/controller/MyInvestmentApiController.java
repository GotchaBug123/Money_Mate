package com.gotchabug.moneymate.investment.controller;

import com.gotchabug.moneymate.financial.dto.FinancialProfileResponse;
import com.gotchabug.moneymate.financial.entity.FinancialProfile;
import com.gotchabug.moneymate.financial.repository.FinancialProfileRepository;
import com.gotchabug.moneymate.investment.dto.MyInvestmentResponse;
import com.gotchabug.moneymate.member.dto.MemberResponse;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.risk.dto.RiskAnswerSheetResponse;
import com.gotchabug.moneymate.risk.entity.RiskAnswerSheet;
import com.gotchabug.moneymate.risk.repository.RiskAnswerSheetRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/my-investment")
@Tag(
        name = "My Investment",
        description = "내 투자정보 API"
)
public class MyInvestmentApiController {

    private final FinancialProfileRepository financialProfileRepository;
    private final RiskAnswerSheetRepository riskAnswerSheetRepository;

    @GetMapping
    @Operation(summary = "내 투자정보 조회")
    public MyInvestmentResponse getMyInvestment(HttpSession session) {

        Object loginUserObj = session.getAttribute("loginUser");

        if (!(loginUserObj instanceof Member loginUser)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "로그인이 필요합니다."
            );
        }

        FinancialProfile profile = financialProfileRepository
                .findByMember_MemberId(loginUser.getMemberId())
                .orElse(null);

        RiskAnswerSheet riskResult = riskAnswerSheetRepository
                .findTopByMember_MemberIdOrderBySubmittedAtDesc(loginUser.getMemberId())
                .orElse(null);

        return MyInvestmentResponse.builder()
                .member(MemberResponse.from(loginUser))
                .profile(FinancialProfileResponse.from(profile))
                .riskResult(RiskAnswerSheetResponse.from(riskResult))
                .diagnosisScore(calculateDiagnosisScore(profile))
                .build();
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