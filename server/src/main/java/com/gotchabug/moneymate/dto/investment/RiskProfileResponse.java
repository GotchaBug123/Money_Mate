package com.gotchabug.moneymate.dto.investment;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RiskProfileResponse {

    private Integer totalScore;
    private String riskTypeCode;
    private String riskTypeName;
}