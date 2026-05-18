package com.gotchabug.moneymate.controller;

import com.gotchabug.moneymate.dto.investment.RiskProfileRequest;
import com.gotchabug.moneymate.dto.investment.RiskProfileResponse;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.RiskProfileService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/risk-profile")
public class RiskProfileController {

    private final RiskProfileService riskProfileService;

    @PostMapping
    public RiskProfileResponse analyze(
            @Valid @RequestBody RiskProfileRequest request,
            HttpSession session
    ) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        Long memberId = loginUser != null
                ? loginUser.getMemberId()
                : null;

        return riskProfileService.analyze(memberId, request);
    }
}