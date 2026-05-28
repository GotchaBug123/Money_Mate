package com.gotchabug.moneymate.dto.risk;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvestmentRecommendationCard {

    private String categoryName;
    private int rankNo;
    private int matchingScore;
    private double operationLevel;
    private String riskType;
    private String minimumAmount;
    private String reason;

    private List<String> tags;

    private BigDecimal riskAvoidancePercent;
    private BigDecimal financialInterestPercent;

    private String riskAvoidanceLabel;
    private String financialInterestLabel;
}