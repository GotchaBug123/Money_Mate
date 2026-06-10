package com.gotchabug.moneymate.investment.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class MonthlyPortfolioDto {
    private String month;              // "2026-01"
    private String label;              // "1월"
    private BigDecimal portfolioValue; // 해당 월 말 포트폴리오 평가액
    private BigDecimal monthlyReturnPct; // 전월 대비 수익률 (%)
}
