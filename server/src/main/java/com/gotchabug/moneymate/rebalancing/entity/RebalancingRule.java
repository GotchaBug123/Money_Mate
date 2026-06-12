package com.gotchabug.moneymate.rebalancing.entity;

import com.gotchabug.moneymate.common.BaseTimeEntity;
import com.gotchabug.moneymate.portfolio.entity.Portfolio;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "rebalancing_rule")
@Getter
@Setter
@NoArgsConstructor
public class RebalancingRule extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rule_id")
    private Long ruleId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false, unique = true)
    private Portfolio portfolio;

    @Column(name = "deviation_threshold_pct", nullable = false, precision = 7, scale = 4)
    private BigDecimal deviationThresholdPct = new BigDecimal("5.0000");

    @Column(name = "execution_cycle", nullable = false, length = 20)
    private String executionCycle = "MONTHLY";

    @Column(name = "auto_rebalance_yn", nullable = false, length = 1)
    private String autoRebalanceYn = "Y";

    @Column(name = "active_yn", nullable = false, length = 1)
    private String activeYn = "Y";

    @PrePersist
    public void prePersist() {
        if (deviationThresholdPct == null) {
            deviationThresholdPct = new BigDecimal("5.0000");
        }
        if (executionCycle == null || executionCycle.isBlank()) {
            executionCycle = "MONTHLY";
        }
        if (autoRebalanceYn == null || autoRebalanceYn.isBlank()) {
            autoRebalanceYn = "Y";
        }
        if (activeYn == null || activeYn.isBlank()) {
            activeYn = "Y";
        }
    }
}
