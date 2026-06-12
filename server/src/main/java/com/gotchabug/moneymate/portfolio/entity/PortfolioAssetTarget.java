package com.gotchabug.moneymate.portfolio.entity;

import com.gotchabug.moneymate.common.BaseTimeEntity; // 💡 상속 추가
import com.gotchabug.moneymate.market.entity.Asset;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(
        name = "portfolio_asset_target",
        uniqueConstraints = @UniqueConstraint(columnNames = {"portfolio_id", "asset_id"})
)
@Getter
@Setter
@NoArgsConstructor
public class PortfolioAssetTarget extends BaseTimeEntity { // 💡 상속 구조 일치

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

    // 💡 [수정] 중복되는 시간 컬럼 필드 삭제

    @PrePersist
    public void prePersist() {
        if (this.targetWeightPct == null) {
            this.targetWeightPct = BigDecimal.ZERO;
        }
    }
}