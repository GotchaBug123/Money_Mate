package com.gotchabug.moneymate.controller;

import com.gotchabug.moneymate.dto.investment.InvestmentSurveyRequest;
import com.gotchabug.moneymate.dto.investment.InvestmentSurveyResponse;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.InvestmentStyleService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/investment")
public class InvestmentStyleController {

    private final InvestmentStyleService investmentStyleService;

    @PostMapping("/survey")
    public InvestmentSurveyResponse analyze(
            @Valid @RequestBody InvestmentSurveyRequest request,
            HttpSession session
    ) {

        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        return investmentStyleService.analyze(
                loginUser.getMemberId(),
                request
        );
    }
}