package com.gotchabug.moneymate.portfolio.dto;

import com.gotchabug.moneymate.portfolio.entity.Portfolio;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class PortfolioResponse {

    private Long portfolioId;

    private String portfolioName;

    private String portfolioType;

    private BigDecimal totalInvestedAmount;

    private BigDecimal totalEvaluationAmount;

    private BigDecimal expectedReturnPct;

    private BigDecimal expectedVolatilityPct;

    private String portfolioStatus;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<PortfolioAssetTargetResponse> targetAssets;

    private List<PortfolioAssetCurrentResponse> currentAssets;

    public static PortfolioResponse from(
            Portfolio portfolio,
            List<PortfolioAssetTargetResponse> targetAssets,
            List<PortfolioAssetCurrentResponse> currentAssets
    ) {
        return PortfolioResponse.builder()
                .portfolioId(portfolio.getPortfolioId())
                .portfolioName(portfolio.getPortfolioName())
                .portfolioType(portfolio.getPortfolioType())
                .totalInvestedAmount(portfolio.getTotalInvestedAmount())
                .totalEvaluationAmount(portfolio.getTotalEvaluationAmount())
                .expectedReturnPct(portfolio.getExpectedReturnPct())
                .expectedVolatilityPct(portfolio.getExpectedVolatilityPct())
                .portfolioStatus(portfolio.getPortfolioStatus())
                .createdAt(portfolio.getCreatedAt())
                .updatedAt(portfolio.getUpdatedAt())
                .targetAssets(targetAssets)
                .currentAssets(currentAssets)
                .build();
    }
}
