package com.gotchabug.moneymate.entity;



import com.gotchabug.moneymate.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "financial_profile")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class FinancialProfile extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Long profileId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false, unique = true)
    private Member member;

    @Column(name = "monthly_income", nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyIncome;

    @Column(name = "monthly_fixed_expense", nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyFixedExpense;

    @Column(name = "monthly_variable_expense", nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyVariableExpense;

    @Column(name = "total_asset", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAsset;

    @Column(name = "total_liability", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalLiability;

    @Column(name = "cash_asset", nullable = false, precision = 15, scale = 2)
    private BigDecimal cashAsset;

    @Column(name = "investable_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal investableAmount;

    public void update(
            BigDecimal monthlyIncome,
            BigDecimal monthlyFixedExpense,
            BigDecimal monthlyVariableExpense,
            BigDecimal totalAsset,
            BigDecimal totalLiability,
            BigDecimal cashAsset,
            BigDecimal investableAmount
    ) {
        this.monthlyIncome = monthlyIncome;
        this.monthlyFixedExpense = monthlyFixedExpense;
        this.monthlyVariableExpense = monthlyVariableExpense;
        this.totalAsset = totalAsset;
        this.totalLiability = totalLiability;
        this.cashAsset = cashAsset;
        this.investableAmount = investableAmount;
    }
}
