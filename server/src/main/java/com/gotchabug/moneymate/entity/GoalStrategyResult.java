package com.gotchabug.moneymate.entity;

import com.gotchabug.moneymate.common.BaseTimeEntity;
import com.gotchabug.moneymate.enums.RebalanceCycle;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(
        name = "goal_strategy_result",
        indexes = {
                @Index(
                        name = "idx_goal_strategy_member",
                        columnList = "member_id"
                ),
                @Index(
                        name = "idx_goal_strategy_created_at",
                        columnList = "created_at"
                )
        }
)
public class GoalStrategyResult extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "goal_strategy_result_id")
    private Long goalStrategyResultId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "goal_name", nullable = false, length = 100)
    private String goalName;

    @Column(name = "current_amount", nullable = false)
    private Long currentAmount;

    @Column(name = "monthly_investment", nullable = false)
    private Long monthlyInvestment;

    @Column(name = "target_amount", nullable = false)
    private Long targetAmount;

    @Column(name = "investment_years", nullable = false)
    private Integer investmentYears;

    @Enumerated(EnumType.STRING)
    @Column(name = "rebalance_cycle", nullable = false, length = 30)
    private RebalanceCycle rebalanceCycle;

    @Lob
    @Column(name = "selected_asset_summary", nullable = false)
    private String selectedAssetSummary;

    @Column(name = "success_probability", nullable = false)
    private Double successProbability;

    @Column(name = "average_final_amount", nullable = false)
    private Long averageFinalAmount;

    @Column(name = "optimistic_amount", nullable = false)
    private Long optimisticAmount;

    @Column(name = "median_amount", nullable = false)
    private Long medianAmount;

    @Column(name = "pessimistic_amount", nullable = false)
    private Long pessimisticAmount;

    @Column(name = "var_amount", nullable = false)
    private Long varAmount;

    @Column(name = "worst_case_average_amount", nullable = false)
    private Long worstCaseAverageAmount;

    @Column(name = "shortage_amount", nullable = false)
    private Long shortageAmount;

    public boolean achievedTarget() {
        return medianAmount >= targetAmount;
    }
}
