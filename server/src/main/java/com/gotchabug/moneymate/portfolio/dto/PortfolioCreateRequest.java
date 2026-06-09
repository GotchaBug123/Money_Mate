package com.gotchabug.moneymate.portfolio.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class PortfolioCreateRequest {

    @NotBlank
    private String portfolioName;

    private String portfolioType;

    private BigDecimal totalInvestedAmount;

    private BigDecimal totalEvaluationAmount;

    private BigDecimal expectedReturnPct;

    private BigDecimal expectedVolatilityPct;

    @Valid
    private List<PortfolioAssetTargetRequest> targetAssets;

    @Valid
    private List<PortfolioAssetCurrentRequest> currentAssets;

    @Valid
    private RebalancingRuleRequest rebalancingRule;

    @AssertTrue(message = "목표 자산 비중의 합은 100%여야 합니다.")
    public boolean isValidTargetWeightSum() {
        if (targetAssets == null || targetAssets.isEmpty()) {
            return true;
        }

        BigDecimal total = targetAssets.stream()
                .map(PortfolioAssetTargetRequest::getTargetWeightPct)
                .filter(weight -> weight != null)
                .map(this::normalizeWeight)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return total.subtract(new BigDecimal("100.0")).abs()
                .compareTo(new BigDecimal("0.01")) <= 0;
    }

    private BigDecimal normalizeWeight(BigDecimal weight) {
        if (weight.compareTo(BigDecimal.ONE) <= 0) {
            return weight.multiply(new BigDecimal("100"));
        }

        return weight;
    }
}
