package com.gotchabug.moneymate.investment.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RiskProfileResponse {

    private Integer totalScore;
    private String riskTypeCode;
    private String riskTypeName;
}