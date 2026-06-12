package com.gotchabug.moneymate.portfolio.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class GoalStrategyResponse {

    private Double successProbability;

    private String goalAchievementStatus;

    private String goalAchievementMessage;

    private Boolean pessimisticTargetReached;

    private Long finalAmount;

    private Long averageFinalAmount;

    private Long optimisticAmount;

    private Long medianAmount;

    private Long pessimisticAmount;

    private Long shortageAmount;

    private Long recommendedMonthlyInvestment;

    private Double annualizedReturn;

    private Double totalReturn;

    private Double maxDrawdown;

    private Double bestAnnualReturn;

    private Double worstAnnualReturn;

    private List<ChartPoint> chartData;

    private List<AssetSummary> selectedAssets;

    @Getter
    @Builder
    public static class ChartPoint {

        private Integer month;

        private Long optimisticAmount;

        private Long medianAmount;

        private Long pessimisticAmount;

        private Long targetAmount;
    }

    @Getter
    @Builder
    public static class AssetSummary {

        private String symbol;

        private String assetName;

        private String assetType;

        private String market;

        private Double targetWeight;

        private String theme;
    }
}
