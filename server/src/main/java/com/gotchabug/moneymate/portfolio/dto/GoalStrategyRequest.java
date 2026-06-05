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

    @NotNull(message = "월 투자금은 필수입니다.")
    @Min(value = 0, message = "월 투자금은 0원 이상이어야 합니다.")
    private Long monthlyInvestment;

    @NotNull(message = "목표 금액은 필수입니다.")
    @Min(value = 1000000, message = "목표 금액은 최소 100만원 이상이어야 합니다.")
    private Long targetAmount;

    @NotNull(message = "투자 기간은 필수입니다.")
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

    // 💡 [수정] 프론트엔드(리액트)에서 전송된 자산 비중 소수점 합산 시,
    // 자바 부동소수점 오차로 인해 올바른 값도 유효성 검증 실패(400 Bad Request)가 뜨는 현상을 방지합니다.
    @AssertTrue(message = "선택한 자산 비중의 합은 100%(1.0)여야 합니다.")
    public boolean isValidWeightSum() {
        if (selectedAssets == null || selectedAssets.isEmpty()) {
            return false;
        }

        if (selectedAssets.stream()
                .anyMatch(asset -> asset == null || asset.getTargetWeight() == null)) {
            return false;
        }

        double totalWeight = selectedAssets.stream()
                .mapToDouble(SelectedAssetRequest::getTargetWeight)
                .sum();

        // 오차 범위(0.0001)를 두어 프론트엔드 데이터 형식과 싱크를 맞춥니다.
        return Math.abs(totalWeight - 1.0) < 0.0001;
    }
}