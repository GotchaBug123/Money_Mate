package com.gotchabug.moneymate.controller;

import com.gotchabug.moneymate.dto.RiskTestRequest;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.RiskProfileService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("/risk")
public class RiskProfileController {

    private final RiskProfileService riskProfileService;

    @GetMapping("/test")
    public String riskTestPage(
            HttpSession session,
            Model model
    ) {

        Member loginUser =
                (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        model.addAttribute(
                "riskTestRequest",
                new RiskTestRequest()
        );

        return "risk-test";
    }

    @PostMapping("/test")
    public String submitRiskTest(
            HttpSession session,

            @ModelAttribute RiskTestRequest request
    ) {

        Member loginUser =
                (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        riskProfileService.saveRiskTest(
                loginUser,
                request
        );

        return "redirect:/mypage";
    }
}