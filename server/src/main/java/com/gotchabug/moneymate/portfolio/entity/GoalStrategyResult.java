package com.gotchabug.moneymate.portfolio.entity;

import com.gotchabug.moneymate.common.BaseTimeEntity;
import com.gotchabug.moneymate.enums.RebalanceCycle;
import com.gotchabug.moneymate.member.entity.Member;
import jakarta.persistence.*;
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
                @Index(name = "idx_goal_strategy_member", columnList = "member_id"),
                @Index(name = "idx_goal_strategy_created_at", columnList = "created_at")
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

    // 💡 [수정] Oracle 21c 환경 호환성을 위해 MySQL용 'LONGTEXT' 명시 문법을 제거하고
    // JPA 표준 @Lob 어노테이션을 활용하여 대용량 데이터(CLOB) 매핑을 안전하게 처리합니다.
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