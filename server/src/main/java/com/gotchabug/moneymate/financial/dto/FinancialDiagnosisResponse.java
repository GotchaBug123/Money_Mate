package com.gotchabug.moneymate.financial.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
public class FinancialDiagnosisResponse {

    /*
    종합 점수
     */
    private Integer totalScore;

    /*
    재무 등급
     */
    private String grade;

    /*
    위험도
     */
    private String riskLevel;

    /*
    소비율
     */
    private BigDecimal expenseRate;

    /*
    부채 비율
     */
    private BigDecimal debtRate;

    /*
    현금 유동성 (개월)
     */
    private BigDecimal liquidityMonths;

    /*
    투자 가능 금액
     */
    private BigDecimal investableAmount;

    /*
    진단 피드백
     */
    private List<String> feedbacks;
}