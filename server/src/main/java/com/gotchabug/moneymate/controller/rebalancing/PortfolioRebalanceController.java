package com.gotchabug.moneymate.controller.rebalancing;

import com.gotchabug.moneymate.dto.goal.GoalStrategyRequest;
import com.gotchabug.moneymate.dto.goal.GoalStrategyResponse;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.GoalStrategyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Portfolio Rebalance", description = "포트폴리오 리밸런싱 분석 API")
public class PortfolioRebalanceController {

    private final GoalStrategyService goalStrategyService;

    @PostMapping("/analyze")
    @Operation(
            summary = "포트폴리오 리밸런싱 분석",
            description = "선택 종목, 투자금, 목표금액, 투자기간을 기반으로 목표 달성 확률과 리밸런싱 분석 결과를 반환합니다."
    )
    public GoalStrategyResponse analyzePortfolioRebalance(
            @Valid @RequestBody GoalStrategyRequest request,
            @Parameter(hidden = true)
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
