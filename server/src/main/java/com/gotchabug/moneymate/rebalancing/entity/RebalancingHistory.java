package com.gotchabug.moneymate.rebalancing.entity;

import com.gotchabug.moneymate.portfolio.entity.Portfolio;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rebalancing_history")
@Getter
@Setter
@NoArgsConstructor
public class RebalancingHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rebalance_id")
    private Long rebalanceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rule_id")
    private RebalancingRule rule;

    @Column(name = "rebalance_date", nullable = false)
    private LocalDateTime rebalanceDate;

    @Column(name = "rebalance_type", nullable = false, length = 30)
    private String rebalanceType;

    @Column(name = "trigger_reason", nullable = false, length = 255)
    private String triggerReason;

    @Column(name = "before_expected_return_pct", precision = 10, scale = 4)
    private BigDecimal beforeExpectedReturnPct;

    @Column(name = "after_expected_return_pct", precision = 10, scale = 4)
    private BigDecimal afterExpectedReturnPct;

    @Column(name = "before_risk_pct", precision = 10, scale = 4)
    private BigDecimal beforeRiskPct;

    @Column(name = "after_risk_pct", precision = 10, scale = 4)
    private BigDecimal afterRiskPct;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "COMPLETED";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (rebalanceDate == null) {
            rebalanceDate = now;
        }
        if (status == null || status.isBlank()) {
            status = "COMPLETED";
        }
        createdAt = now;
    }
}
