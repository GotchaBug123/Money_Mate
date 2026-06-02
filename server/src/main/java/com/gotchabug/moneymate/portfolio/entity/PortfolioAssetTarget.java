package com.gotchabug.moneymate.portfolio.entity;

import com.gotchabug.moneymate.market.entity.Asset;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "portfolio_asset_target",
        uniqueConstraints = @UniqueConstraint(columnNames = {"portfolio_id", "asset_id"})
)
@Getter
@Setter
@NoArgsConstructor
public class PortfolioAssetTarget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "target_id")
    private Long targetId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Column(name = "target_weight_pct", nullable = false, precision = 7, scale = 4)
    private BigDecimal targetWeightPct = BigDecimal.ZERO;

    @Column(name = "expected_return_pct", precision = 10, scale = 4)
    private BigDecimal expectedReturnPct;

    @Column(name = "risk_score", precision = 10, scale = 4)
    private BigDecimal riskScore;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();

        if (this.targetWeightPct == null) {
            this.targetWeightPct = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}