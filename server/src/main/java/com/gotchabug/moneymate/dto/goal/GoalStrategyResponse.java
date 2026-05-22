package com.gotchabug.moneymate.dto.goal;

import com.gotchabug.moneymate.enums.RebalanceCycle;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class GoalStrategyResponse {

    private Long goalStrategyResultId;

    private String goalName;

    private Double successProbability;

    private String strategyGrade;

    private String strategyStatus;

    private Long averageFinalAmount;

    private Long optimisticAmount;

    private Long medianAmount;

    private Long pessimisticAmount;

    private Long worstCaseAverageAmount;

    private Long varAmount;

    private Long shortageAmount;

    private Long recommendedMonthlyInvestment;

    private RebalanceCycle rebalanceCycle;

    private boolean rebalancingApplied;

    private Double rebalancingProbabilityImprovement;

    private String selectedAssetSummary;

    private Double whatIfSuccessProbability;

    private Double probabilityImprovement;

    private String strategyComment;

    private List<GoalStrategyInsight> insights;

    public boolean hasWhatIfResult() {
        return whatIfSuccessProbability != null;
    }

    public boolean hasImprovement() {
        return probabilityImprovement != null
                && probabilityImprovement > 0;
    }

    public boolean hasShortageAmount() {
        return shortageAmount != null
                && shortageAmount > 0;
    }
}