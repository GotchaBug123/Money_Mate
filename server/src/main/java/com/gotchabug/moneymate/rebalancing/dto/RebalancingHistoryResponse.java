package com.gotchabug.moneymate.rebalancing.dto;

import com.gotchabug.moneymate.rebalancing.entity.RebalancingHistory;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class RebalancingHistoryResponse {

    private Long rebalanceId;

    private Long portfolioId;

    private String portfolioName;

    private LocalDateTime rebalanceDate;

    private String rebalanceType;

    private String triggerReason;

    private BigDecimal beforeExpectedReturnPct;

    private BigDecimal afterExpectedReturnPct;

    private BigDecimal beforeRiskPct;

    private BigDecimal afterRiskPct;

    private String status;

    private List<RebalancingAssetAdjustmentResponse> details;

    public static RebalancingHistoryResponse from(
            RebalancingHistory history,
            List<RebalancingAssetAdjustmentResponse> details
    ) {
        return RebalancingHistoryResponse.builder()
                .rebalanceId(history.getRebalanceId())
                .portfolioId(history.getPortfolio().getPortfolioId())
                .portfolioName(history.getPortfolio().getPortfolioName())
                .rebalanceDate(history.getRebalanceDate())
                .rebalanceType(history.getRebalanceType())
                .triggerReason(history.getTriggerReason())
                .beforeExpectedReturnPct(history.getBeforeExpectedReturnPct())
                .afterExpectedReturnPct(history.getAfterExpectedReturnPct())
                .beforeRiskPct(history.getBeforeRiskPct())
                .afterRiskPct(history.getAfterRiskPct())
                .status(history.getStatus())
                .details(details)
                .build();
    }
}
