package com.gotchabug.moneymate.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "goal_simulation_result")
public class GoalSimulationResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long simulationResultId;

    // 시뮬레이션 실행 회원
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    // 현재 보유 투자금
    @Column(nullable = false)
    private Long currentAmount;

    // 매월 투자 금액
    @Column(nullable = false)
    private Long monthlyInvestment;

    // 목표 금액
    @Column(nullable = false)
    private Long targetAmount;

    // 투자 기간(년)
    @Column(nullable = false)
    private Integer years;

    // 연 기대 수익률
    @Column(nullable = false)
    private Double expectedAnnualReturn;

    // 연 변동성
    @Column(nullable = false)
    private Double annualVolatility;

    // 목표 달성 확률(%)
    @Column(nullable = false)
    private Double successProbability;

    // 평균 최종 자산
    @Column(nullable = false)
    private Long averageFinalAmount;

    // 낙관 시나리오 자산(상위 10%)
    @Column(nullable = false)
    private Long optimisticAmount;

    // 중간 시나리오 자산(중앙값)
    @Column(nullable = false)
    private Long medianAmount;

    // 비관 시나리오 자산(하위 10%)
    @Column(nullable = false)
    private Long pessimisticAmount;

    // VaR 기준 자산(하위 5%)
    @Column(nullable = false)
    private Long varAmount;

    // 하위 5% 평균 자산
    @Column(nullable = false)
    private Long worstCaseAverageAmount;

    // 목표 금액 대비 부족 금액
    @Column(nullable = false)
    private Long shortageAmount;

    // What-if 시뮬레이션 목표 달성 확률
    private Double whatIfSuccessProbability;

    // What-if 적용 후 확률 증가량
    private Double probabilityImprovement;

    // 생성 시간
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}