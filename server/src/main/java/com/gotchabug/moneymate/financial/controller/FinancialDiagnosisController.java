package com.gotchabug.moneymate.financial.controller;

import com.gotchabug.moneymate.financial.dto.FinancialDiagnosisResponse;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.investment.repository.WatchlistRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Tag(
        name = "재무진단",
        description = "회원 재무진단 결과 조회 API"
)
@Controller
@RequiredArgsConstructor
public class FinancialDiagnosisController {

    private final WatchlistRepository.FinancialDiagnosisService financialDiagnosisService;

    @Operation(
            summary = "재무진단 결과 조회",
            description = "로그인한 회원의 재무 정보를 기반으로 재무 건강 점수, 등급, 소비율, 저축률 등의 진단 결과를 조회합니다."
    )
    @GetMapping("/diagnosis")
    public String diagnosis(

            @Parameter(hidden = true)
            HttpSession session,

            @Parameter(hidden = true)
            Model model
    ) {

        Object loginUserObj =
                session.getAttribute("loginUser");

        if (!(loginUserObj instanceof Member loginUser)) {
            return "redirect:/login";
        }

        FinancialDiagnosisResponse result =
                financialDiagnosisService
                        .diagnose(loginUser.getMemberId());

        model.addAttribute(
                "result",
                result
        );

        return "diagnosis/result";
    }
}