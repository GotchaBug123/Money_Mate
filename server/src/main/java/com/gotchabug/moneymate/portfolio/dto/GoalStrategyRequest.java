package com.gotchabug.moneymate.portfolio.dto;

import com.gotchabug.moneymate.enums.RebalanceCycle;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.util.List;

@Getter
public class GoalStrategyRequest {

    private String goalName;

    @Min(value = 0, message = "현재 보유 금액은 0원 이상이어야 합니다.")
    private Long currentAmount;

    // 리밸런싱 화면의 "투자 금액" 입력값은 월 투자금으로 처리합니다.
    @NotNull(message = "월 투자금은 필수입니다.")
    @Min(value = 0, message = "월 투자금은 0원 이상이어야 합니다.")
    private Long monthlyInvestment;

    @NotNull(message = "목표 금액은 필수입니다.")
    @Min(value = 1000000, message = "목표 금액은 최소 100만원 이상이어야 합니다.")
    private Long targetAmount;

    @Min(value = 1, message = "투자 기간은 최소 1년 이상이어야 합니다.")
    private Integer investmentYears;

    @Min(value = 1, message = "투자 기간은 최소 1개월 이상이어야 합니다.")
    private Integer investmentMonths;

    @NotNull(message = "리밸런싱 주기는 필수입니다.")
    private RebalanceCycle rebalanceCycle;

    @Valid
    @NotEmpty(message = "최소 1개 이상의 종목을 선택해야 합니다.")
    private List<SelectedAssetRequest> selectedAssets;

    public int totalInvestmentMonths() {
        if (investmentMonths != null) {
            return investmentMonths;
        }

        return safeInvestmentYears() * 12;
    }

    public long safeCurrentAmount() {
        return currentAmount == null ? 0L : currentAmount;
    }

    public long safeMonthlyInvestment() {
        return monthlyInvestment == null ? 0L : monthlyInvestment;
    }

    public int safeInvestmentYears() {
        return investmentYears == null ? 0 : investmentYears;
    }

    public int storageInvestmentYears() {
        if (investmentYears != null) {
            return investmentYears;
        }

        return Math.max(1, totalInvestmentMonths() / 12);
    }

    public String safeGoalName() {
        if (goalName == null || goalName.trim().isEmpty()) {
            return "포트폴리오 리밸런싱 분석";
        }

        return goalName.trim();
    }

    public long estimatedTotalContribution() {
        return safeCurrentAmount()
                + (safeMonthlyInvestment() * totalInvestmentMonths());
    }

    @AssertTrue(message = "선택한 자산 비중의 합은 100%여야 합니다.")
    public boolean isValidWeightSum() {

        if (selectedAssets == null || selectedAssets.isEmpty()) {
            return false;
        }

        if (selectedAssets.stream()
                .anyMatch(asset -> asset == null
                        || asset.getTargetWeight() == null)) {
            return false;
        }

        double totalWeight = selectedAssets.stream()
                .mapToDouble(SelectedAssetRequest::getTargetWeight)
                .sum();

        return Math.abs(totalWeight - 1.0) < 0.0001;
    }

    @AssertTrue(message = "투자 기간은 연 단위 또는 월 단위 중 하나는 필수입니다.")
    public boolean isValidInvestmentPeriod() {
        return investmentYears != null || investmentMonths != null;
    }
}
