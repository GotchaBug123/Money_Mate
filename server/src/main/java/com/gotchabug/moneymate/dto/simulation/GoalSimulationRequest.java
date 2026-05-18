package com.gotchabug.moneymate.dto.simulation;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class GoalSimulationRequest {

    // 현재 보유 투자금
    @NotNull
    @Min(0)
    private Long currentAmount;

    // 매월 투자 금액
    @NotNull
    @Min(0)
    private Long monthlyInvestment;

    // 사용자가 설정한 목표 금액
    @NotNull
    @Min(0)
    private Long targetAmount;

    // 투자 기간(년)
    @NotNull
    @Min(1)
    private Integer years;

    // 연 기대 수익률
    // 예: 0.05 = 연 5%
    @NotNull
    @DecimalMin("0.0")
    private Double expectedAnnualReturn;

    // 연 변동성
    // 예: 0.12 = 연 12%
    @NotNull
    @DecimalMin("0.0")
    private Double annualVolatility;

    // What-if 추가 월 투자금
    @Min(0)
    private Long additionalMonthlyInvestment;

    // What-if 추가 투자 기간
    @Min(0)
    private Integer additionalYears;
}