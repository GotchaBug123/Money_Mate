package com.gotchabug.moneymate.financial.service;

import com.gotchabug.moneymate.financial.dto.FinancialDiagnosisResponse;
import com.gotchabug.moneymate.financial.entity.FinancialProfile;
import com.gotchabug.moneymate.financial.repository.FinancialProfileRepository;
import com.gotchabug.moneymate.investment.repository.WatchlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FinancialDiagnosisServiceImpl
        implements WatchlistRepository.FinancialDiagnosisService {

    private final FinancialProfileRepository financialProfileRepository;

    @Override
    public FinancialDiagnosisResponse diagnose(Long memberId) {

        FinancialProfile profile =
                financialProfileRepository.findByMember_MemberId(memberId)
                        .orElseThrow(() ->
                                new ResponseStatusException(HttpStatus.NOT_FOUND, "재무정보가 없습니다."));

        // 수입이 0이면 재무진단 미완료 상태로 간주
        if (profile.getMonthlyIncome().compareTo(BigDecimal.ZERO) == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "재무진단을 완료해주세요.");
        }

        BigDecimal totalExpense =
                profile.getMonthlyFixedExpense()
                        .add(profile.getMonthlyVariableExpense());

        /*
        소비율
         */
        BigDecimal expenseRate =
                calculateRate(totalExpense, profile.getMonthlyIncome());

        /*
        부채비율
         */
        BigDecimal debtRate =
                calculateRate(
                        profile.getTotalLiability(),
                        profile.getTotalAsset()
                );

        /*
        현금 유동성 (totalExpense가 0이면 0개월 처리)
         */
        BigDecimal liquidityMonths = totalExpense.compareTo(BigDecimal.ZERO) == 0
                ? BigDecimal.ZERO
                : profile.getCashAsset().divide(totalExpense, 1, RoundingMode.HALF_UP);

        /*
        점수 계산
         */
        int expenseScore = calculateExpenseScore(expenseRate);

        int debtScore = calculateDebtScore(debtRate);

        int liquidityScore = calculateLiquidityScore(liquidityMonths);

        int investableScore =
                calculateInvestableScore(
                        profile.getInvestableAmount()
                );

        int totalScore =
                (expenseScore * 35
                        + debtScore * 35
                        + liquidityScore * 20
                        + investableScore * 10) / 100;

        /*
        등급
         */
        String grade = calculateGrade(totalScore);

        /*
        위험도
         */
        String riskLevel = calculateRiskLevel(totalScore);

        /*
        피드백
         */
        List<String> feedbacks =
                generateFeedbacks(
                        expenseRate,
                        debtRate,
                        liquidityMonths,
                        profile.getInvestableAmount()
                );

        return FinancialDiagnosisResponse.builder()
                .totalScore(totalScore)
                .grade(grade)
                .riskLevel(riskLevel)
                .expenseRate(expenseRate)
                .debtRate(debtRate)
                .liquidityMonths(liquidityMonths)
                .investableAmount(profile.getInvestableAmount())
                .feedbacks(feedbacks)
                .build();
    }

    /*
    비율 계산
     */
    private BigDecimal calculateRate(
            BigDecimal value,
            BigDecimal base
    ) {

        if (base.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        return value.divide(base, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    /*
    소비 점수
     */
    private int calculateExpenseScore(BigDecimal expenseRate) {

        if (expenseRate.compareTo(BigDecimal.valueOf(50)) <= 0) {
            return 100;
        }

        if (expenseRate.compareTo(BigDecimal.valueOf(70)) <= 0) {
            return 80;
        }

        if (expenseRate.compareTo(BigDecimal.valueOf(90)) <= 0) {
            return 60;
        }

        return 40;
    }

    /*
    부채 점수
     */
    private int calculateDebtScore(BigDecimal debtRate) {

        if (debtRate.compareTo(BigDecimal.valueOf(20)) <= 0) {
            return 100;
        }

        if (debtRate.compareTo(BigDecimal.valueOf(40)) <= 0) {
            return 80;
        }

        if (debtRate.compareTo(BigDecimal.valueOf(60)) <= 0) {
            return 60;
        }

        return 40;
    }

    /*
    유동성 점수
     */
    private int calculateLiquidityScore(BigDecimal liquidityMonths) {

        if (liquidityMonths.compareTo(BigDecimal.valueOf(6)) >= 0) {
            return 100;
        }

        if (liquidityMonths.compareTo(BigDecimal.valueOf(3)) >= 0) {
            return 80;
        }

        if (liquidityMonths.compareTo(BigDecimal.valueOf(1)) >= 0) {
            return 60;
        }

        return 40;
    }

    /*
    투자 가능 점수
     */
    private int calculateInvestableScore(BigDecimal investableAmount) {

        if (investableAmount.compareTo(BigDecimal.valueOf(2000000)) >= 0) {
            return 100;
        }

        if (investableAmount.compareTo(BigDecimal.valueOf(1000000)) >= 0) {
            return 80;
        }

        if (investableAmount.compareTo(BigDecimal.valueOf(300000)) >= 0) {
            return 60;
        }

        return 40;
    }

    /*
    등급 계산
     */
    private String calculateGrade(int score) {

        if (score >= 90) return "S";
        if (score >= 80) return "A";
        if (score >= 70) return "B";
        if (score >= 60) return "C";

        return "D";
    }

    /*
    위험도 계산
     */
    private String calculateRiskLevel(int score) {

        if (score >= 80) return "안정";
        if (score >= 60) return "보통";

        return "위험";
    }

    /*
    피드백 생성
     */
    private List<String> generateFeedbacks(
            BigDecimal expenseRate,
            BigDecimal debtRate,
            BigDecimal liquidityMonths,
            BigDecimal investableAmount
    ) {

        List<String> feedbacks = new ArrayList<>();

        if (expenseRate.compareTo(BigDecimal.valueOf(80)) > 0) {
            feedbacks.add("소비 비율이 높습니다.");
        }

        if (debtRate.compareTo(BigDecimal.valueOf(60)) > 0) {
            feedbacks.add("부채 비율 관리가 필요합니다.");
        }

        if (liquidityMonths.compareTo(BigDecimal.valueOf(3)) < 0) {
            feedbacks.add("비상자금 확보가 필요합니다.");
        }

        if (investableAmount.compareTo(BigDecimal.ZERO) <= 0) {
            feedbacks.add("현재 투자 가능 금액이 부족합니다.");
        }

        if (feedbacks.isEmpty()) {
            feedbacks.add("현재 재무 상태가 안정적입니다.");
        }

        return feedbacks;
    }
}
