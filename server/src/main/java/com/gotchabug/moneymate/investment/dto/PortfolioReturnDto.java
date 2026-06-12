package com.gotchabug.moneymate.investment.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class PortfolioReturnDto {

    private BigDecimal totalReturnPct;    // 종합 수익률 (%)
    private BigDecimal monthlyReturnPct;  // 월 수익률 (%)
    private BigDecimal totalInvestment;   // 총 투자금액
    private BigDecimal currentValue;      // 현재 평가액
}
