package com.gotchabug.moneymate.controller;

import com.gotchabug.moneymate.dto.goal.GoalStrategyRequest;
import com.gotchabug.moneymate.dto.goal.GoalStrategyResponse;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.GoalStrategyService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/portfolio/rebalance")
public class PortfolioRebalanceController {

    private final GoalStrategyService goalStrategyService;

    @PostMapping("/analyze")
    public GoalStrategyResponse analyzePortfolioRebalance(
            @Valid @RequestBody GoalStrategyRequest request,
            HttpSession session
    ) {

        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        return goalStrategyService.analyzeGoalStrategy(
                loginUser.getMemberId(),
                request
        );
    }
}
