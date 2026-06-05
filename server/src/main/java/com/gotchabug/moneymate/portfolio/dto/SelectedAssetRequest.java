package com.gotchabug.moneymate.portfolio.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class SelectedAssetRequest {

    @NotBlank(message = "종목 코드는 필수입니다.")
    private String symbol;

    @NotBlank(message = "종목명은 필수입니다.")
    private String assetName;

    @NotBlank(message = "자산 유형은 필수입니다.")
    private String assetType;

    @NotBlank(message = "시장 정보는 필수입니다.")
    private String market;

    @DecimalMin(
            value = "0.0",
            inclusive = false,
            message = "목표 비중은 0보다 커야 합니다."
    )
    @DecimalMax(
            value = "100.0",
            message = "목표 비중은 100% 이하여야 합니다."
    )
    private Double targetWeight;

    @DecimalMin(
            value = "-1.0",
            message = "예상 연 수익률은 -100% 이상이어야 합니다."
    )
    private Double expectedAnnualReturn;

    @DecimalMin(
            value = "0.0",
            message = "연 변동성은 0 이상이어야 합니다."
    )
    private Double annualVolatility;

    private String theme;

    public Double getTargetWeight() {
        if (targetWeight == null) {
            return null;
        }

        if (targetWeight > 1.0) {
            return targetWeight / 100.0;
        }

        return targetWeight;
    }

    public Double getExpectedAnnualReturn() {
        if (expectedAnnualReturn != null) {
            return expectedAnnualReturn;
        }

        if ("ETF".equalsIgnoreCase(assetType)) {
            return 0.06;
        }

        return 0.08;
    }

    public Double getAnnualVolatility() {
        if (annualVolatility != null) {
            return annualVolatility;
        }

        if ("ETF".equalsIgnoreCase(assetType)) {
            return 0.15;
        }

        return 0.22;
    }

    public double monthlyExpectedReturn() {
        return getExpectedAnnualReturn() / 12.0;
    }

    public double monthlyVolatility() {
        return getAnnualVolatility() / Math.sqrt(12.0);
    }

    public long allocateFrom(long totalAmount) {
        return Math.round(allocationFrom(totalAmount));
    }

    public double allocationFrom(double totalAmount) {
        return totalAmount * getTargetWeight();
    }

    public double targetWeightPercent() {
        return getTargetWeight() * 100.0;
    }

    public String displayName() {
        return assetName + "(" + symbol + ")";
    }
}
