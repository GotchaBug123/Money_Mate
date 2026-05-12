package com.gotchabug.moneymate.service;

import com.gotchabug.moneymate.entity.FinancialProfile;
import com.gotchabug.moneymate.repository.FinancialProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class FinancialProfileService {

    private final FinancialProfileRepository financialProfileRepository;

    @Transactional
    public FinancialProfile updateFinancialProfile(
            Long memberId,
            BigDecimal monthlyIncome,
            BigDecimal monthlyFixedExpense,
            BigDecimal monthlyVariableExpense,
            BigDecimal totalAsset,
            BigDecimal totalLiability,
            BigDecimal cashAsset
    ) {

        FinancialProfile profile = financialProfileRepository
                .findByMember_MemberId(memberId)
                .orElseThrow(() -> new IllegalArgumentException("재무 정보 없음"));

        BigDecimal totalExpense =
                monthlyFixedExpense.add(monthlyVariableExpense);

        BigDecimal investableAmount =
                monthlyIncome.subtract(totalExpense);

        if (investableAmount.compareTo(BigDecimal.ZERO) < 0) {
            investableAmount = BigDecimal.ZERO;
        }

        profileUpdate(
                profile,
                monthlyIncome,
                monthlyFixedExpense,
                monthlyVariableExpense,
                totalAsset,
                totalLiability,
                cashAsset,
                investableAmount
        );

        return financialProfileRepository.save(profile);
    }

    private void profileUpdate(
            FinancialProfile profile,
            BigDecimal monthlyIncome,
            BigDecimal monthlyFixedExpense,
            BigDecimal monthlyVariableExpense,
            BigDecimal totalAsset,
            BigDecimal totalLiability,
            BigDecimal cashAsset,
            BigDecimal investableAmount
    ) {

        try {

            java.lang.reflect.Field incomeField =
                    FinancialProfile.class.getDeclaredField("monthlyIncome");

            incomeField.setAccessible(true);
            incomeField.set(profile, monthlyIncome);

            java.lang.reflect.Field fixedField =
                    FinancialProfile.class.getDeclaredField("monthlyFixedExpense");

            fixedField.setAccessible(true);
            fixedField.set(profile, monthlyFixedExpense);

            java.lang.reflect.Field variableField =
                    FinancialProfile.class.getDeclaredField("monthlyVariableExpense");

            variableField.setAccessible(true);
            variableField.set(profile, monthlyVariableExpense);

            java.lang.reflect.Field assetField =
                    FinancialProfile.class.getDeclaredField("totalAsset");

            assetField.setAccessible(true);
            assetField.set(profile, totalAsset);

            java.lang.reflect.Field liabilityField =
                    FinancialProfile.class.getDeclaredField("totalLiability");

            liabilityField.setAccessible(true);
            liabilityField.set(profile, totalLiability);

            java.lang.reflect.Field cashField =
                    FinancialProfile.class.getDeclaredField("cashAsset");

            cashField.setAccessible(true);
            cashField.set(profile, cashAsset);

            java.lang.reflect.Field investField =
                    FinancialProfile.class.getDeclaredField("investableAmount");

            investField.setAccessible(true);
            investField.set(profile, investableAmount);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}