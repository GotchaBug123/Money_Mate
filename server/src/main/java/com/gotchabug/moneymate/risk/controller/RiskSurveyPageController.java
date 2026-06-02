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
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@RequiredArgsConstructor
@Tag(
        name = "Risk Survey Page",
        description = "투자성향 설문 화면 및 결과 화면 API"
)
public class RiskSurveyPageController {

    private final RiskSurveyService riskSurveyService;

    @Operation(
            summary = "투자성향 설문 화면 조회",
            description = "투자성향 설문 입력 화면으로 이동합니다."
    )
    @GetMapping("/risk-survey")
    public String riskSurveyPage() {

        return "risk-survey";
    }

    @Operation(
            summary = "투자성향 설문 제출",
            description = """
                    사용자가 입력한 투자성향 설문을 분석합니다.

                    분석 결과
                    - 투자성향 유형
                    - 총점
                    - 위험 회피도
                    - 금융 관심도
                    - 국내 투자 점수
                    - 미국 투자 점수
                    - ETF 투자 점수
                    - 추천 투자 상품
                    - 추천 투자 전략

                    분석 완료 후 결과 화면으로 이동합니다.
                    """
    )
    @PostMapping("/risk-survey")
    public String submitSurvey(

            @Parameter(
                    description = "투자성향 설문 요청 데이터",
                    required = true
            )
            @ModelAttribute
            RiskSurveyRequest request,

            @Parameter(hidden = true)
            HttpSession session,

            @Parameter(hidden = true)
            Model model
    ) {

        Member loginUser =
                (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        RiskSurveyResponse result =
                riskSurveyService.submitSurvey(
                        loginUser,
                        request
                );

        model.addAttribute(
                "result",
                result
        );

        return "risk-result";
    }

    @Operation(
            summary = "투자성향 테스트 화면 조회",
            description = "투자성향 분석 기능 테스트용 화면으로 이동합니다."
    )
    @GetMapping("/risk-survey-test")
    public String riskSurveyTestPage() {

        return "risk-survey-test";
    }
}