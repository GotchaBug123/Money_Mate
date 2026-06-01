package com.gotchabug.moneymate.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "asset_indicator")
@Getter
@Setter
public class AssetIndicator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "indicator_id")
    private Long indicatorId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Column(name = "base_date", nullable = false)
    private LocalDate baseDate;

    @Column(name = "daily_return_pct", precision = 10, scale = 4)
    private BigDecimal dailyReturnPct;

    @Column(name = "monthly_return_pct", precision = 10, scale = 4)
    private BigDecimal monthlyReturnPct;

    @Column(name = "volatility_30d", precision = 10, scale = 4)
    private BigDecimal volatility30d;

    @Column(name = "moving_avg_5d", precision = 15, scale = 2)
    private BigDecimal movingAvg5d;

    @Column(name = "moving_avg_20d", precision = 15, scale = 2)
    private BigDecimal movingAvg20d;

    @Column(name = "moving_avg_60d", precision = 15, scale = 2)
    private BigDecimal movingAvg60d;

    @Column(name = "sharpe_ratio", precision = 10, scale = 4)
    private BigDecimal sharpeRatio;

    @Column(name = "max_drawdown_pct", precision = 10, scale = 4)
    private BigDecimal maxDrawdownPct;

    // ── [추가] 배당 수익률 (%) ────────────────────────────────
    // Yahoo Finance trailingAnnualDividendYield × 100 → % 단위
    // 10% 이상 = 비정상 데이터 → 배당 TOP 6 화면 노출 차단
    @Column(name = "dividend_yield_pct", precision = 10, scale = 4)
    private BigDecimal dividendYieldPct;
    // ─────────────────────────────────────────────────────────

    @Column(name = "source_id")
    private Long sourceId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}