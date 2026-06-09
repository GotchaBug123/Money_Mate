package com.gotchabug.moneymate.rebalancing.entity;

import com.gotchabug.moneymate.market.entity.Asset;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rebalancing_detail")
@Getter
@Setter
@NoArgsConstructor
public class RebalancingDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detail_id")
    private Long detailId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rebalance_id", nullable = false)
    private RebalancingHistory history;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Column(name = "before_weight_pct", nullable = false, precision = 7, scale = 4)
    private BigDecimal beforeWeightPct;

    @Column(name = "target_weight_pct", nullable = false, precision = 7, scale = 4)
    private BigDecimal targetWeightPct;

    @Column(name = "after_weight_pct", precision = 7, scale = 4)
    private BigDecimal afterWeightPct;

    @Column(name = "action_type", nullable = false, length = 20)
    private String actionType;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
