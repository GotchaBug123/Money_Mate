package com.gotchabug.moneymate.entity;

import com.gotchabug.moneymate.common.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "investment_goal")
public class InvestmentGoal extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "goal_id")
    private Long goalId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "goal_name", nullable = false, length = 100)
    private String goalName;

    @Column(name = "target_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal targetAmount;

    @Column(name = "target_date", nullable = false)
    private LocalDate targetDate;

    @Column(name = "monthly_contribution", nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyContribution;

    @Column(name = "current_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal currentAmount;

    @Column(name = "goal_status", nullable = false, length = 20)
    private String goalStatus;

    public void update(
            String goalName,
            BigDecimal targetAmount,
            LocalDate targetDate,
            BigDecimal monthlyContribution,
            BigDecimal currentAmount
    ) {
        this.goalName = goalName;
        this.targetAmount = targetAmount;
        this.targetDate = targetDate;
        this.monthlyContribution = monthlyContribution;
        this.currentAmount = currentAmount;
    }

    public void delete() {
        this.goalStatus = "DELETED";
    }

    public boolean isActive() {
        return "ACTIVE".equalsIgnoreCase(goalStatus);
    }
}
