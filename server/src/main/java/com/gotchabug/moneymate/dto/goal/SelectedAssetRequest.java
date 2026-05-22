package com.gotchabug.moneymate.dto.goal;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class SelectedAssetRequest {

    @NotBlank(message = "Asset symbol is required.")
    private String symbol;

    @NotBlank(message = "Asset name is required.")
    private String assetName;

    @NotBlank(message = "Asset type is required.")
    private String assetType;

    @NotBlank(message = "Market is required.")
    private String market;

    @NotNull(message = "Target weight is required.")
    @DecimalMin(value = "0.0", inclusive = false, message = "Target weight must be greater than 0.")
    @DecimalMax(value = "1.0", message = "Target weight must be 1.0 or less.")
    private Double targetWeight;

    @NotNull(message = "Expected annual return is required.")
    @DecimalMin(value = "-1.0", message = "Expected annual return must be at least -100%.")
    private Double expectedAnnualReturn;

    @NotNull(message = "Annual volatility is required.")
    @DecimalMin(value = "0.0", message = "Annual volatility must be at least 0.")
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