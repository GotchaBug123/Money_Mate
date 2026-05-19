package com.gotchabug.moneymate.dto.risk;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class InvestmentRecommendationCard {

    private String categoryName;
    private int rankNo;
    private int matchingScore;
    private double operationLevel;
    private String riskType;
    private String minimumAmount;
    private String reason;
    private String[] tags;

    private int riskAvoidancePercent;
    private int financialInterestPercent;
    private String riskAvoidanceLabel;
    private String financialInterestLabel;
}