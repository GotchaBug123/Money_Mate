package com.gotchabug.moneymate.portfolio.dto;

import jakarta.validation.constraints.DecimalMin;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PortfolioAssetTargetRequest {

    private Long assetId;

    private String ticker;

    private String assetName;

    private String assetType;

    private String market;

    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal targetWeightPct;

    private BigDecimal expectedReturnPct;

    private BigDecimal riskScore;
}
