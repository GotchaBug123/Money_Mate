package com.gotchabug.moneymate.investment.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class PortfolioHistoryDto {
    private List<MonthlyPortfolioDto> monthlyHistory;
}
