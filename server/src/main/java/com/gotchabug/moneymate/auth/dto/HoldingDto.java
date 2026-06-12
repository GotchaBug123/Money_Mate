package com.gotchabug.moneymate.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 투자 보유 종목(장바구니) 응답 DTO
 * 테이블: investment_holding
 */
@Getter
@AllArgsConstructor
public class HoldingDto {
    /** investment_holding.holding_id */
    private Long holdingId;
    /** investment_holding.ticker */
    private String ticker;
    /** investment_holding.asset_name */
    private String assetName;
    /** investment_holding.market */
    private String market;
    /** investment_holding.quantity */
    private Integer quantity;
    /** investment_holding.buy_price */
    private BigDecimal buyPrice;
    /** investment_holding.buy_date */
    private LocalDate buyDate;
    /** investment_holding.created_at */
    private LocalDateTime createdAt;

    @Getter
    @Setter
    public static class SignupRequest {

        @NotBlank(message = "아이디는 필수입니다.")
        @Size(min = 4, max = 20)
        private String loginId;

        @NotBlank(message = "이메일은 필수입니다.")
        @Email
        private String email;

        @NotBlank(message = "이름은 필수입니다.")
        private String name;

        @NotBlank(message = "비밀번호는 필수입니다.")
        @Size(min = 4, max = 20)
        private String password;
    }

    /**
     * 관심 종목 응답 DTO
     * 테이블: watchlist
     */
    @Getter
    @AllArgsConstructor
    public static class WatchlistDto {
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
}