package com.gotchabug.moneymate.dto.risk;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class RiskSurveyResponse {

    private int totalScore;
    private String resultType;
    private String description;

    private int riskAvoidancePercent;
    private int financialInterestPercent;
    private String riskAvoidanceLabel;
    private String financialInterestLabel;

    private List<InvestmentRecommendationCard> recommendations;
}