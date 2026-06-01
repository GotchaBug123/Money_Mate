package com.gotchabug.moneymate.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 자산 가격 엔티티
 * DB 테이블: asset_price
 * 일별 OHLCV(시가/고가/저가/종가/거래량) 데이터를 담는다
 */
@Entity
@Table(name = "asset_price")
@Getter
@Setter
public class AssetPrice {

    // 자산 가격 고유 번호 (PK)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "price_id")
    private Long priceId;

    // 자산 (asset 테이블 참조)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    // 가격 기준일
    @Column(name = "price_date", nullable = false)
    private LocalDate priceDate;

    // 시가
    @Column(name = "open_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal openPrice;

    // 고가
    @Column(name = "high_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal highPrice;

    // 저가
    @Column(name = "low_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal lowPrice;

    // 종가 (현재가로 사용)
    @Column(name = "close_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal closePrice;

    // 수정 종가 (배당/분할 반영)
    @Column(name = "adj_close_price", precision = 15, scale = 2)
    private BigDecimal adjClosePrice;

    // 거래량
    @Column(name = "volume")
    private Long volume;

    // 외부 데이터 소스 번호
    @Column(name = "source_id")
    private Long sourceId;

    // 생성일시
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}