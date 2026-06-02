package com.gotchabug.moneymate.rebalancing.controller;

import com.gotchabug.moneymate.portfolio.dto.GoalStrategyRequest;
import com.gotchabug.moneymate.portfolio.dto.GoalStrategyResponse;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.portfolio.service.GoalStrategyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/portfolio/rebalance")
@Tag(
        name = "Portfolio Rebalance",
        description = "포트폴리오 리밸런싱 분석 API"
)
public class PortfolioRebalanceController {

    private final GoalStrategyService goalStrategyService;

    @PostMapping("/analyze")
    @Operation(
            summary = "포트폴리오 리밸런싱 분석",
            description = """
                    선택 종목, 투자금, 목표금액, 투자기간을 기반으로 포트폴리오 리밸런싱을 분석합니다.

                    분석 결과
                    - 목표 달성 확률
                    - 예상 수익률
                    - 위험도
                    - 추천 포트폴리오 비중
                    - 리밸런싱 전략
                    """
    )
    public GoalStrategyResponse analyzePortfolioRebalance(

            @Parameter(description = "포트폴리오 리밸런싱 분석 요청 데이터", required = true)
            @Valid
            @RequestBody
            GoalStrategyRequest request,

            @Parameter(hidden = true)
            HttpSession session
    ) {

        Member loginUser =
                getLoginUser(session);

        return goalStrategyService.analyzeGoalStrategy(
                loginUser.getMemberId(),
                request
        );
    }

    private Member getLoginUser(HttpSession session) {

        Object loginUser =
                session.getAttribute("loginUser");

        if (!(loginUser instanceof Member member)) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "로그인이 필요합니다."
            );
        }

        return member;
    }
}