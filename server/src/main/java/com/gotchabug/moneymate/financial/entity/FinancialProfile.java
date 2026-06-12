package com.gotchabug.moneymate.financial.entity;

import com.gotchabug.moneymate.member.entity.Member;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "financial_profile")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FinancialProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Long profileId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false, unique = true)
    private Member member;

    @Column(name = "monthly_income", nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyIncome = BigDecimal.ZERO;

    @Column(name = "monthly_fixed_expense", nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyFixedExpense = BigDecimal.ZERO;

    @Column(name = "monthly_variable_expense", nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyVariableExpense = BigDecimal.ZERO;

    @Column(name = "total_asset", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAsset = BigDecimal.ZERO;

    @Column(name = "total_liability", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalLiability = BigDecimal.ZERO;

    @Column(name = "cash_asset", nullable = false, precision = 15, scale = 2)
    private BigDecimal cashAsset = BigDecimal.ZERO;

    @Column(name = "investable_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal investableAmount = BigDecimal.ZERO;

    @Column(name = "net_asset", nullable = false, precision = 15, scale = 2)
    private BigDecimal netAsset = BigDecimal.ZERO;

    @Column(name = "total_expense", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalExpense = BigDecimal.ZERO;

    @Column(name = "expense_ratio", nullable = false, precision = 5, scale = 2)
    private BigDecimal expenseRatio = BigDecimal.ZERO;

    @Column(name = "saving_ratio", nullable = false, precision = 5, scale = 2)
    private BigDecimal savingRatio = BigDecimal.ZERO;

    @Column(name = "diagnosis_grade", length = 20)
    private String diagnosisGrade;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    public FinancialProfile(Member member) {
        this.member = member;
    }

    /*
    신규 재무정보 생성
     */
    public static FinancialProfile create(Member member) {
        return FinancialProfile.builder()
                .member(member)
                .build();
    }

    /*
    재무정보 수정
     */
    public void updateFinancialInfo(
            BigDecimal monthlyIncome,
            BigDecimal monthlyFixedExpense,
            BigDecimal monthlyVariableExpense,
            BigDecimal totalAsset,
            BigDecimal totalLiability,
            BigDecimal cashAsset
    ) {

        this.monthlyIncome = monthlyIncome;
        this.monthlyFixedExpense = monthlyFixedExpense;
        this.monthlyVariableExpense = monthlyVariableExpense;
        this.totalAsset = totalAsset;
        this.totalLiability = totalLiability;
        this.cashAsset = cashAsset;

        this.totalExpense = this.monthlyFixedExpense
                .add(this.monthlyVariableExpense);

        this.investableAmount = this.monthlyIncome
                .subtract(this.totalExpense);

        this.netAsset = this.totalAsset
                .subtract(this.totalLiability);

        this.expenseRatio = calculatePercent(
                this.totalExpense,
                this.monthlyIncome
        );

        this.savingRatio = calculatePercent(
                this.investableAmount,
                this.monthlyIncome
        );
    }

    /*
    재무 진단 등급 저장
     */
    public void updateDiagnosisGrade(String diagnosisGrade) {
        this.diagnosisGrade = diagnosisGrade;
    }

    /*
    생성 시간 자동 저장
     */
    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        this.createdAt = now;
        this.updatedAt = now;
    }

    /*
    수정 시간 자동 저장
     */
    @PreUpdate
    protected void onUpdate() {

        this.updatedAt = LocalDateTime.now();
    }

    private BigDecimal calculatePercent(
            BigDecimal numerator,
            BigDecimal denominator
    ) {

        if (denominator == null || denominator.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        return numerator
                .multiply(BigDecimal.valueOf(100))
                .divide(denominator, 2, java.math.RoundingMode.HALF_UP);
    }
}
