package com.gotchabug.moneymate.dto.financial;

import com.gotchabug.moneymate.entity.FinancialProfile;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/*
DB에 저장된 복잡한 재무 데이터를 사용자에게 보여주기 좋게 딱 필요한
항목만 정리 및 포장
 */


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
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}