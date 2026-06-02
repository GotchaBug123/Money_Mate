package com.gotchabug.moneymate.controller.risk;

import com.gotchabug.moneymate.dto.investment.RiskProfileRequest;
import com.gotchabug.moneymate.dto.investment.RiskProfileResponse;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.RiskProfileService;
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
@Tag(name = "Risk Profile", description = "투자성향 분석 API")
public class RiskProfileController {

    private final RiskProfileService riskProfileService;

    @PostMapping
    @Operation(
            summary = "투자성향 분석",
            description = "투자성향 설문 요청값을 기반으로 사용자의 투자성향 결과를 분석합니다."
    )
    public RiskProfileResponse analyze(
            @Valid @RequestBody RiskProfileRequest request,
            @Parameter(hidden = true)
            HttpSession session
    ) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        Long memberId = loginUser != null
                ? loginUser.getMemberId()
                : null;

        return riskProfileService.analyze(memberId, request);
    }
}
