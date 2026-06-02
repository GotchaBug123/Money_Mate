package com.gotchabug.moneymate.risk.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskSurveyResponse {

    private int totalScore;
    private String resultType;
    private String description;

    private BigDecimal riskAvoidancePercent;
    private BigDecimal financialInterestPercent;

    private String riskAvoidanceLabel;
    private String financialInterestLabel;

    private List<InvestmentRecommendationCard> recommendations;
}