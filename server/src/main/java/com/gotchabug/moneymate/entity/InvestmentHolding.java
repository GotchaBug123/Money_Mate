package com.gotchabug.moneymate.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 내가 담은 투자 주식 테이블
 * 테이블명: investment_holding
 *
 * PDF DB 추가 정의 기준:
 * holding_id   BIGINT AUTO_INCREMENT PK
 * member_id    BIGINT NOT NULL (FK → member)
 * ticker       VARCHAR(30) NOT NULL
 * asset_name   VARCHAR(100) NOT NULL
 * market       VARCHAR(30)
 * quantity     INT NOT NULL DEFAULT 1
 * buy_price    DECIMAL(15,2) NOT NULL
 * buy_date     DATE NOT NULL DEFAULT (CURRENT_DATE)
 * created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
 */
@Entity
@Table(
        name = "investment_holding",
        uniqueConstraints = @UniqueConstraint(columnNames = {"member_id", "ticker"})
)
@Getter
@Setter
@NoArgsConstructor
public class InvestmentHolding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "holding_id")
    private Long holdingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "ticker", nullable = false, length = 30)
    private String ticker;

    @Column(name = "asset_name", nullable = false, length = 100)
    private String assetName;

    @Column(name = "market", length = 30)
    private String market;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;

    @Column(name = "buy_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal buyPrice;

    @Column(name = "buy_date", nullable = false)
    private LocalDate buyDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.buyDate == null) {
            this.buyDate = LocalDate.now();
        }
    }
}