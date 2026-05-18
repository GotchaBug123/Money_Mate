package com.gotchabug.moneymate.dto.simulation;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class    GoalSimulationResponse {

    // DB에 저장된 시뮬레이션 결과 ID
    private Long simulationResultId;

    // 목표 달성 확률(%)
    private Double successProbability;

    // 평균 최종 자산
    private Long averageFinalAmount;

    // 낙관 시나리오(상위 10%)
    private Long optimisticAmount;

    // 보통 시나리오(중앙값)
    private Long medianAmount;

    // 비관 시나리오(하위 10%)
    private Long pessimisticAmount;

    // 최악의 경우 평균 자산(하위 5%)
    private Long worstCaseAverageAmount;

    // VaR 기준 위험 자산 금액
    private Long varAmount;

    // 목표 금액 대비 부족 금액
    private Long shortageAmount;

    // What-if 시뮬레이션 확률
    private Double whatIfSuccessProbability;

    // 기존 대비 확률 증가량
    private Double probabilityImprovement;
}