package com.gotchabug.moneymate.controller;

import com.gotchabug.moneymate.dto.risk.RiskSurveyRequest;
import com.gotchabug.moneymate.dto.risk.RiskSurveyResponse;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.RiskSurveyService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/risk-survey")
public class RiskSurveyApiController {

    private final RiskSurveyService riskSurveyService;

    @PostMapping
    public RiskSurveyResponse submitSurvey(
            @RequestBody RiskSurveyRequest request,
            HttpSession session
    ) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        return riskSurveyService.submitSurvey(loginUser, request);
    }
}