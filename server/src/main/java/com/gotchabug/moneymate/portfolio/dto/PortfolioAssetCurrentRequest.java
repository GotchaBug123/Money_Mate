package com.gotchabug.moneymate.portfolio.dto;

import jakarta.validation.constraints.DecimalMin;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PortfolioAssetCurrentRequest {

    private Long assetId;

    private String ticker;

    private String assetName;

    private String assetType;

    private String market;

    @DecimalMin(value = "0.0")
    private BigDecimal holdingQuantity;

    private BigDecimal averageBuyPrice;

    private BigDecimal currentPrice;

    private BigDecimal currentWeightPct;

    private BigDecimal evaluationAmount;
}
