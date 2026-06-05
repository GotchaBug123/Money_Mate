package com.gotchabug.moneymate.financial.dto;

import com.gotchabug.moneymate.financial.entity.FinancialProfile;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class FinancialProfileResponse {

    private Long profileId;
    private Long memberId;

    private BigDecimal monthlyIncome;
    private BigDecimal monthlyFixedExpense;
    private BigDecimal monthlyVariableExpense;

    private BigDecimal totalAsset;
    private BigDecimal totalLiability;
    private BigDecimal cashAsset;

    private BigDecimal investableAmount;
    private BigDecimal netAsset;
    private BigDecimal totalExpense;
    private BigDecimal expenseRatio;
    private BigDecimal savingRatio;

    private String diagnosisGrade;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static FinancialProfileResponse from(FinancialProfile profile) {
        return FinancialProfileResponse.builder()
                .profileId(profile.getProfileId())
                .memberId(profile.getMember().getMemberId())
                .monthlyIncome(profile.getMonthlyIncome())
                .monthlyFixedExpense(profile.getMonthlyFixedExpense())
                .monthlyVariableExpense(profile.getMonthlyVariableExpense())
                .totalAsset(profile.getTotalAsset())
                .totalLiability(profile.getTotalLiability())
                .cashAsset(profile.getCashAsset())
                .investableAmount(profile.getInvestableAmount())
                .netAsset(profile.getNetAsset())
                .totalExpense(profile.getTotalExpense())
                .expenseRatio(profile.getExpenseRatio())
                .savingRatio(profile.getSavingRatio())
                .diagnosisGrade(profile.getDiagnosisGrade())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}
