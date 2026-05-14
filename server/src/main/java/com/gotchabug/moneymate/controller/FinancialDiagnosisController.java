package com.gotchabug.moneymate.controller;

import com.gotchabug.moneymate.dto.financial.FinancialDiagnosisResponse;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.FinancialDiagnosisService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class FinancialDiagnosisController {

    private final FinancialDiagnosisService financialDiagnosisService;

    @GetMapping("/diagnosis")
    public String diagnosis(
            HttpSession session,
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

        model.addAttribute("result", result);

        return "diagnosis/result";
    }
}