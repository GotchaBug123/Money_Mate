package com.gotchabug.moneymate.investment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class HoldingDto {

    private Long holdingId;
    private String ticker;
    private String assetName;
    private String market;
    private Integer quantity;
    private BigDecimal buyPrice;
    private LocalDate buyDate;
    private LocalDateTime createdAt;
}