package com.gotchabug.moneymate.rebalancing.entity;

import com.gotchabug.moneymate.market.entity.Asset;
import com.gotchabug.moneymate.portfolio.entity.Portfolio;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "portfolio_asset_current",
        uniqueConstraints = @UniqueConstraint(columnNames = {"portfolio_id", "asset_id"})
)
@Getter
@Setter
@NoArgsConstructor
public class PortfolioAssetCurrent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "current_id")
    private Long currentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Column(name = "holding_quantity", nullable = false, precision = 18, scale = 6)
    private BigDecimal holdingQuantity = BigDecimal.ZERO;

    @Column(name = "average_buy_price", precision = 15, scale = 2)
    private BigDecimal averageBuyPrice;

    @Column(name = "current_price", precision = 15, scale = 2)
    private BigDecimal currentPrice;

    @Column(name = "current_weight_pct", precision = 7, scale = 4)
    private BigDecimal currentWeightPct;

    @Column(name = "evaluation_amount", precision = 15, scale = 2)
    private BigDecimal evaluationAmount;

    @Column(name = "unrealized_profit_loss", precision = 15, scale = 2)
    private BigDecimal unrealizedProfitLoss;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (holdingQuantity == null) {
            holdingQuantity = BigDecimal.ZERO;
        }
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
