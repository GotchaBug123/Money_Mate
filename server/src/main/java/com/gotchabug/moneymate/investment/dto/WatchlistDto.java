package com.gotchabug.moneymate.investment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class WatchlistDto {

    private Long watchlistId;
    private String ticker;
    private String assetName;
    private String market;
    private LocalDateTime createdAt;
}