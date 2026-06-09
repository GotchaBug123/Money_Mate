package com.gotchabug.moneymate.rebalancing.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
public class RebalancingAnalysisResponse {

    private Long rebalanceId;

    private Long portfolioId;

    private String portfolioName;

    private BigDecimal totalEvaluationAmount;

    private BigDecimal deviationThresholdPct;

    private Boolean rebalanceNeeded;

    private String summary;

    private List<RebalancingAssetAdjustmentResponse> adjustments;
}
