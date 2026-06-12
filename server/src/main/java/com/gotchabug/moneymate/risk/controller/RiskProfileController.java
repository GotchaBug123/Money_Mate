package com.gotchabug.moneymate.risk.controller;

import com.gotchabug.moneymate.investment.dto.RiskProfileRequest;
import com.gotchabug.moneymate.investment.dto.RiskProfileResponse;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.risk.service.RiskProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/risk-profile")
@Tag(
        name = "Risk Profile",
        description = "투자 성향(위험 성향) 분석 API"
)
public class RiskProfileController {

    private final RiskProfileService riskProfileService;

    @PostMapping
    @Operation(
            summary = "투자 성향 분석",
            description = """
                    사용자의 투자 성향을 분석합니다.

                    분석 항목
                    - 투자 경험
                    - 투자 기간
                    - 투자 목표
                    - 위험 감수 수준
                    - 자산 규모
                    - 투자 가능 금액

                    분석 결과
                    - 투자 성향 유형
                    - 위험 점수
                    - 추천 투자 전략
                    - 추천 자산군
                    """
    )
    public RiskProfileResponse analyze(

            @Parameter(description = "투자 성향 분석 요청 데이터", required = true)
            @Valid
            @RequestBody
            RiskProfileRequest request,

            @Parameter(hidden = true)
            HttpSession session
    ) {

        Member loginUser =
                (Member) session.getAttribute("loginUser");

        Long memberId =
                loginUser != null
                        ? loginUser.getMemberId()
                        : null;

        return riskProfileService.analyze(
                memberId,
                request
        );
    }
}