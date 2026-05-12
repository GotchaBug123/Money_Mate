package com.gotchabug.moneymate.dto.investment;

import com.gotchabug.moneymate.enums.InvestmentType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class InvestmentSurveyResponse {

    private Integer totalScore;
    private InvestmentType investmentType;
    private String typeName;
}