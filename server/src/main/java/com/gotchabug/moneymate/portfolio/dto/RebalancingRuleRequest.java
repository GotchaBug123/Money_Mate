package com.gotchabug.moneymate.portfolio.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class RebalancingRuleRequest {

    private BigDecimal deviationThresholdPct;

    private String executionCycle;

    private String autoRebalanceYn;
}
