package com.gotchabug.moneymate.portfolio.controller;

import com.gotchabug.moneymate.auth.SessionMemberResolver;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.portfolio.dto.*;
import com.gotchabug.moneymate.portfolio.service.PortfolioService;
import com.gotchabug.moneymate.rebalancing.dto.RebalancingAnalysisResponse;
import com.gotchabug.moneymate.rebalancing.dto.RebalancingHistoryResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/portfolios")
@Tag(name = "Portfolio", description = "포트폴리오 생성, 조회, 리밸런싱 분석 API")
public class PortfolioController {

    private final PortfolioService portfolioService;
    private final SessionMemberResolver sessionMemberResolver;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "포트폴리오 생성",
            description = "목표 자산비중, 현재 보유 자산, 리밸런싱 기준을 포함한 사용자 포트폴리오를 생성합니다."
    )
    public PortfolioResponse createPortfolio(
            @Valid @RequestBody PortfolioCreateRequest request,
            @Parameter(hidden = true) HttpSession session
    ) {
        Member loginUser = sessionMemberResolver.resolve(session);

        return portfolioService.createPortfolio(loginUser.getMemberId(), request);
    }

    @GetMapping
    @Operation(summary = "내 포트폴리오 목록 조회")
    public List<PortfolioResponse> getMyPortfolios(
            @Parameter(hidden = true) HttpSession session
    ) {
        Member loginUser = sessionMemberResolver.resolve(session);

        return portfolioService.getMyPortfolios(loginUser.getMemberId());
    }

    @GetMapping("/{portfolioId}")
    @Operation(summary = "포트폴리오 상세 조회")
    public PortfolioResponse getPortfolio(
            @PathVariable Long portfolioId,
            @Parameter(hidden = true) HttpSession session
    ) {
        Member loginUser = sessionMemberResolver.resolve(session);

        return portfolioService.getPortfolio(loginUser.getMemberId(), portfolioId);
    }

    @GetMapping("/{portfolioId}/current-assets")
    @Operation(summary = "현재 포트폴리오 자산 조회")
    public List<PortfolioAssetCurrentResponse> getCurrentAssets(
            @PathVariable Long portfolioId,
            @Parameter(hidden = true) HttpSession session
    ) {
        Member loginUser = sessionMemberResolver.resolve(session);

        return portfolioService.getCurrentAssets(loginUser.getMemberId(), portfolioId);
    }

    @GetMapping("/{portfolioId}/target-assets")
    @Operation(summary = "목표 자산비중 조회")
    public List<PortfolioAssetTargetResponse> getTargetAssets(
            @PathVariable Long portfolioId,
            @Parameter(hidden = true) HttpSession session
    ) {
        Member loginUser = sessionMemberResolver.resolve(session);

        return portfolioService.getTargetAssets(loginUser.getMemberId(), portfolioId);
    }

    @PostMapping("/{portfolioId}/rebalance/analyze")
    @Operation(
            summary = "현재/목표 비중 기반 리밸런싱 분석",
            description = "현재 자산비중과 목표 자산비중의 차이를 계산하고 매수/매도 조정안을 저장합니다."
    )
    public RebalancingAnalysisResponse analyzeRebalancing(
            @PathVariable Long portfolioId,
            @Parameter(hidden = true) HttpSession session
    ) {
        Member loginUser = sessionMemberResolver.resolve(session);

        return portfolioService.analyzeAndSaveRebalancing(loginUser.getMemberId(), portfolioId);
    }

    @GetMapping("/{portfolioId}/rebalance/history")
    @Operation(summary = "리밸런싱 분석 이력 조회")
    public List<RebalancingHistoryResponse> getRebalancingHistory(
            @PathVariable Long portfolioId,
            @Parameter(hidden = true) HttpSession session
    ) {
        Member loginUser = sessionMemberResolver.resolve(session);

        return portfolioService.getRebalancingHistory(loginUser.getMemberId(), portfolioId);
    }
}
