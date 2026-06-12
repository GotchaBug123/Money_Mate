package com.gotchabug.moneymate.investment.dto;

import com.gotchabug.moneymate.financial.dto.FinancialProfileResponse;
import com.gotchabug.moneymate.member.dto.MemberResponse;
import com.gotchabug.moneymate.risk.dto.RiskAnswerSheetResponse;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MyInvestmentResponse {

    private MemberResponse member;
    private FinancialProfileResponse profile;
    private RiskAnswerSheetResponse riskResult;
    private Integer diagnosisScore;
}