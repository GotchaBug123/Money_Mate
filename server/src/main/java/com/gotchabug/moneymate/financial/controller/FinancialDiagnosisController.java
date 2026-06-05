package com.gotchabug.moneymate.financial.controller;

import com.gotchabug.moneymate.auth.SessionMemberResolver;
import com.gotchabug.moneymate.financial.dto.FinancialDiagnosisResponse;
import com.gotchabug.moneymate.investment.repository.WatchlistRepository;
import com.gotchabug.moneymate.member.entity.Member;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(
        name = "Financial Diagnosis",
        description = "회원 재무진단 결과 조회 API"
)
@RestController
@RequestMapping("/api/financial-diagnosis")
@RequiredArgsConstructor
public class FinancialDiagnosisController {

    private final WatchlistRepository.FinancialDiagnosisService financialDiagnosisService;
    private final SessionMemberResolver sessionMemberResolver;

    @Operation(
            summary = "내 재무진단 결과 조회",
            description = "세션 로그인 사용자의 재무 프로필을 기반으로 재무진단 점수, 등급, 위험도, 피드백을 조회합니다."
    )
    @GetMapping("/me")
    public FinancialDiagnosisResponse getMyFinancialDiagnosis(
            @Parameter(hidden = true)
            HttpSession session
    ) {
        Member loginUser = sessionMemberResolver.resolve(session);

        return financialDiagnosisService.diagnose(loginUser.getMemberId());
    }
}
