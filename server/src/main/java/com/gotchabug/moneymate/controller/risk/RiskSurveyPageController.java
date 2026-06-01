package com.gotchabug.moneymate.controller.risk;

import com.gotchabug.moneymate.dto.risk.RiskSurveyRequest;
import com.gotchabug.moneymate.dto.risk.RiskSurveyResponse;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.RiskSurveyService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@RequiredArgsConstructor
public class RiskSurveyPageController {

    private final RiskSurveyService riskSurveyService;

    @GetMapping("/risk-survey")
    public String riskSurveyPage() {
        return "risk-survey";
    }

    @PostMapping("/risk-survey")
    public String submitSurvey(
            @ModelAttribute RiskSurveyRequest request,
            HttpSession session,
            Model model
    ) {

        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        RiskSurveyResponse result =
                riskSurveyService.submitSurvey(loginUser, request);

        model.addAttribute("result", result);

        return "risk-result";
    }

    @GetMapping("/risk-survey-test")
    public String riskSurveyTestPage() {
        return "risk-survey-test";
    }
}