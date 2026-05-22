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

    @NotBlank(message = "Goal name is required.")
    private String goalName;

    @NotNull(message = "Current amount is required.")
    @Min(value = 0, message = "Current amount must be at least 0.")
    private Long currentAmount;

    @NotNull(message = "Monthly investment is required.")
    @Min(value = 0, message = "Monthly investment must be at least 0.")
    private Long monthlyInvestment;

    @NotNull(message = "Target amount is required.")
    @Min(value = 1000000, message = "Target amount must be at least 1,000,000.")
    private Long targetAmount;

    @NotNull(message = "Investment years is required.")
    @Min(value = 1, message = "Investment years must be at least 1.")
    private Integer investmentYears;

    @NotNull(message = "Rebalance cycle is required.")
    private RebalanceCycle rebalanceCycle;

    @Valid
    @NotEmpty(message = "At least one selected asset is required.")
    private List<SelectedAssetRequest> selectedAssets;

    @Min(value = 0, message = "Additional monthly investment must be at least 0.")
    private Long additionalMonthlyInvestment;

    @Min(value = 0, message = "Additional years must be at least 0.")
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

    @AssertTrue(message = "Selected asset target weights must add up to 100%.")
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