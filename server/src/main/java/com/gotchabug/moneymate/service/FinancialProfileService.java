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

        profile.updateFinancialInfo(
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
}