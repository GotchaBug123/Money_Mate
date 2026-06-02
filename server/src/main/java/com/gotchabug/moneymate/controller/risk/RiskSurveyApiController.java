package com.gotchabug.moneymate.controller.risk;

import com.gotchabug.moneymate.dto.risk.RiskSurveyRequest;
import com.gotchabug.moneymate.dto.risk.RiskSurveyResponse;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.RiskSurveyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/risk-survey")
@Tag(name = "Risk Profile", description = "투자성향 분석 API")
public class RiskSurveyApiController {

    private final RiskSurveyService riskSurveyService;

    @PostMapping
    @Operation(summary = "투자성향 설문 제출", description = "로그인 사용자의 투자성향 설문 답변을 저장하고 분석 결과를 반환합니다.")
    public RiskSurveyResponse submitSurvey(
            @RequestBody RiskSurveyRequest request,
            @Parameter(hidden = true)
            HttpSession session
    ) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        return riskSurveyService.submitSurvey(loginUser, request);
    }
}
