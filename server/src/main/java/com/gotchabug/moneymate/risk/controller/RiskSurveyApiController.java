package com.gotchabug.moneymate.risk.controller;

import com.gotchabug.moneymate.risk.dto.RiskSurveyRequest;
import com.gotchabug.moneymate.risk.dto.RiskSurveyResponse;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.risk.service.RiskSurveyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/risk-survey")
@Tag(
        name = "Risk Survey",
        description = "투자성향 설문 및 분석 결과 저장 API"
)
public class RiskSurveyApiController {

    private final RiskSurveyService riskSurveyService;

    @PostMapping
    @Operation(
            summary = "투자성향 설문 제출",
            description = """
                    투자성향 설문 결과를 제출하고 분석 결과를 반환합니다.

                    분석 항목
                    - 연령대
                    - 연간 소득
                    - 투자 목적
                    - 투자 기간
                    - 투자 경험
                    - 금융상품 이해도
                    - 위험 감수 수준
                    - 선호 투자 상품
                    - 관심 투자 테마

                    분석 결과
                    - 투자 성향 유형
                    - 총점
                    - 위험 회피도
                    - 금융 관심도
                    - 국내 투자 점수
                    - 미국 투자 점수
                    - ETF 투자 점수
                    - 추천 투자 전략
                    - 추천 ETF 및 자산군
                    """
    )
    public RiskSurveyResponse submitSurvey(

            @Parameter(
                    description = "투자성향 설문 요청 데이터",
                    required = true
            )
            @RequestBody
            RiskSurveyRequest request,

            @Parameter(hidden = true)
            HttpSession session
    ) {

        Member loginUser =
                (Member) session.getAttribute("loginUser");

        if (loginUser == null) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "로그인이 필요합니다."
            );
        }

        return riskSurveyService.submitSurvey(
                loginUser,
                request
        );
    }
}