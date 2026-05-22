package com.gotchabug.moneymate.dto.goal;

import com.gotchabug.moneymate.enums.RebalanceCycle;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.util.List;

@Getter
public class GoalStrategyRequest {

    @NotBlank(message = "목표 이름은 필수입니다.")
    private String goalName;

    @NotNull(message = "현재 자산은 필수입니다.")
    @Min(value = 0, message = "현재 자산은 0 이상이어야 합니다.")
    private Long currentAmount;

    @NotNull(message = "월 투자금은 필수입니다.")
    @Min(value = 0, message = "월 투자금은 0 이상이어야 합니다.")
    private Long monthlyInvestment;

    @NotNull(message = "목표 금액은 필수입니다.")
    @Min(value = 1000000, message = "목표 금액은 최소 100만원 이상이어야 합니다.")
    private Long targetAmount;

    @NotNull(message = "투자 기간은 필수입니다.")
    @Min(value = 1, message = "투자 기간은 최소 1년 이상이어야 합니다.")
    private Integer investmentYears;

    @NotNull(message = "리밸런싱 주기는 필수입니다.")
    private RebalanceCycle rebalanceCycle;

    @Valid
    @NotEmpty(message = "최소 1개 이상의 자산을 선택해야 합니다.")
    private List<SelectedAssetRequest> selectedAssets;

    @Min(value = 0, message = "추가 월 투자금은 0 이상이어야 합니다.")
    private Long additionalMonthlyInvestment;

    @Min(value = 0, message = "추가 투자 기간은 0 이상이어야 합니다.")
    private Integer additionalYears;

    public int totalInvestmentMonths() {
        return safeInvestmentYears() * 12;
    }

    public int totalWhatIfMonths() {
        return (safeInvestmentYears() + safeAdditionalYears()) * 12;
    }

    public long totalWhatIfMonthlyInvestment() {
        return safeMonthlyInvestment() + safeAdditionalMonthlyInvestment();
    }

    public long safeCurrentAmount() {
        return currentAmount == null ? 0L : currentAmount;
    }

    public long safeMonthlyInvestment() {
        return monthlyInvestment == null ? 0L : monthlyInvestment;
    }

    public long safeAdditionalMonthlyInvestment() {
        return additionalMonthlyInvestment == null
                ? 0L
                : additionalMonthlyInvestment;
    }

    public int safeInvestmentYears() {
        return investmentYears == null ? 0 : investmentYears;
    }

    public int safeAdditionalYears() {
        return additionalYears == null
                ? 0
                : additionalYears;
    }

    public boolean hasWhatIfCondition() {
        return safeAdditionalMonthlyInvestment() > 0
                || safeAdditionalYears() > 0;
    }

    public boolean hasRebalancing() {
        return rebalanceCycle != null
                && rebalanceCycle.isEnabled();
    }

    public long estimatedTotalContribution() {
        return safeCurrentAmount()
                + (safeMonthlyInvestment() * totalInvestmentMonths());
    }

    @AssertTrue(message = "선택 자산 비중의 합은 100%여야 합니다.")
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
}