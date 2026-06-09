package com.gotchabug.moneymate.rebalancing.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class RebalancingAssetAdjustmentResponse {

    private Long assetId;

    private String ticker;

    private String assetName;

    private BigDecimal currentWeightPct;

    private BigDecimal targetWeightPct;

    private BigDecimal differencePct;

    private BigDecimal currentAmount;

    private BigDecimal targetAmount;

    private BigDecimal adjustmentAmount;

    private BigDecimal buyAmount;

    private BigDecimal sellAmount;

    private String actionType;

    private Boolean rebalanceRequired;
}
