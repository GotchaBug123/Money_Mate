package com.gotchabug.moneymate.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 관심 종목 응답 DTO
 * 테이블: watchlist
 */
@Getter
@AllArgsConstructor
public class WatchlistDto {
    /** watchlist.watchlist_id */
    private Long watchlistId;
    /** watchlist.ticker */
    private String ticker;
    /** watchlist.asset_name */
    private String assetName;
    /** watchlist.market */
    private String market;
    /** watchlist.created_at */
    private LocalDateTime createdAt;
}