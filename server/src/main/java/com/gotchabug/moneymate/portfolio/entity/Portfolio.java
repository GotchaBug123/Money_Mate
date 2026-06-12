package com.gotchabug.moneymate.portfolio.entity;

import com.gotchabug.moneymate.common.BaseTimeEntity; // 💡 상속 추가
import com.gotchabug.moneymate.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "portfolio")
@Getter
@Setter
@NoArgsConstructor
public class Portfolio extends BaseTimeEntity { // 💡 지침 반영: 공통 시간 엔티티 상속 구조 일치

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "portfolio_id")
    private Long portfolioId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "goal_id")
    private Long goalId;

    @Column(name = "style_id")
    private Long styleId;

    @Column(name = "portfolio_name", nullable = false, length = 100)
    private String portfolioName;

    @Column(name = "portfolio_type", nullable = false, length = 30)
    private String portfolioType = "RECOMMENDED";

    @Column(name = "total_invested_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalInvestedAmount = BigDecimal.ZERO;

    @Column(name = "total_evaluation_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalEvaluationAmount = BigDecimal.ZERO;

    @Column(name = "expected_return_pct", precision = 10, scale = 4)
    private BigDecimal expectedReturnPct;

    @Column(name = "expected_volatility_pct", precision = 10, scale = 4)
    private BigDecimal expectedVolatilityPct;

    @Column(name = "portfolio_status", nullable = false, length = 20)
    private String portfolioStatus = "ACTIVE";

    // 💡 [수정] BaseTimeEntity와 중복되는 createdAt, updatedAt 필드 및 preUpdate 메서드 삭제

    @PrePersist
    public void prePersist() {
        if (this.portfolioName == null) {
            this.portfolioName = "장바구니";
        }

        if (this.portfolioType == null) {
            this.portfolioType = "CART";
        }

        if (this.portfolioStatus == null) {
            this.portfolioStatus = "ACTIVE";
        }

        if (this.totalInvestedAmount == null) {
            this.totalInvestedAmount = BigDecimal.ZERO;
        }

        if (this.totalEvaluationAmount == null) {
            this.totalEvaluationAmount = BigDecimal.ZERO;
        }
    }
}