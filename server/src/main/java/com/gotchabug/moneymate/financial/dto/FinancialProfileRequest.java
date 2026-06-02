package com.gotchabug.moneymate.financial.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class FinancialProfileRequest {

    @NotNull(message = "월수입은 필수입니다.")
    @DecimalMin(value = "0.0", message = "월수입은 0 이상이어야 합니다.")
    private BigDecimal monthlyIncome;

    @NotNull(message = "월 고정지출은 필수입니다.")
    @DecimalMin(value = "0.0", message = "월 고정지출은 0 이상이어야 합니다.")
    private BigDecimal monthlyFixedExpense;

    @NotNull(message = "월 변동지출은 필수입니다.")
    @DecimalMin(value = "0.0", message = "월 변동지출은 0 이상이어야 합니다.")
    private BigDecimal monthlyVariableExpense;

    @NotNull(message = "총자산은 필수입니다.")
    @DecimalMin(value = "0.0", message = "총자산은 0 이상이어야 합니다.")
    private BigDecimal totalAsset;

    @NotNull(message = "총부채는 필수입니다.")
    @DecimalMin(value = "0.0", message = "총부채는 0 이상이어야 합니다.")
    private BigDecimal totalLiability;

    @NotNull(message = "현금성 자산은 필수입니다.")
    @DecimalMin(value = "0.0", message = "현금성 자산은 0 이상이어야 합니다.")
    private BigDecimal cashAsset;
}