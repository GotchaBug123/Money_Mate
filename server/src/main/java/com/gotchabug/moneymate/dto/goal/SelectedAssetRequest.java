package com.gotchabug.moneymate.dto.goal;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class SelectedAssetRequest {

    @NotBlank(message = "자산 심볼은 필수입니다.")
    private String symbol;

    @NotBlank(message = "자산 이름은 필수입니다.")
    private String assetName;

    @NotBlank(message = "자산 유형은 필수입니다.")
    private String assetType;

    @NotBlank(message = "시장 정보는 필수입니다.")
    private String market;

    @NotNull(message = "목표 비중은 필수입니다.")
    @DecimalMin(
            value = "0.0",
            inclusive = false,
            message = "목표 비중은 0보다 커야 합니다."
    )
    @DecimalMax(
            value = "1.0",
            message = "목표 비중은 1.0 이하여야 합니다."
    )
    private Double targetWeight;

    @NotNull(message = "예상 연 수익률은 필수입니다.")
    @DecimalMin(
            value = "-1.0",
            message = "예상 연 수익률은 최소 -100% 이상이어야 합니다."
    )
    private Double expectedAnnualReturn;

    @NotNull(message = "연 변동성은 필수입니다.")
    @DecimalMin(
            value = "0.0",
            message = "연 변동성은 0 이상이어야 합니다."
    )
    private Double annualVolatility;

    private String theme;

    public double monthlyExpectedReturn() {
        return expectedAnnualReturn / 12.0;
    }

    public double monthlyVolatility() {
        return annualVolatility / Math.sqrt(12.0);
    }

    public long allocateFrom(long totalAmount) {
        return Math.round(allocationFrom(totalAmount));
    }

    public double allocationFrom(double totalAmount) {
        return totalAmount * targetWeight;
    }

    public double targetWeightPercent() {
        return targetWeight * 100.0;
    }

    public String displayName() {
        return assetName + "(" + symbol + ")";
    }
}