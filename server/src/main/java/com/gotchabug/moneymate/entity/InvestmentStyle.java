package com.gotchabug.moneymate.entity;

import com.gotchabug.moneymate.enums.InvestmentType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "investment_style")
public class InvestmentStyle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long styleId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "risk_score", nullable = false)
    private Integer riskScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_type", nullable = false)
    private InvestmentType riskType;

    @Column(name = "investment_horizon_month", nullable = false)
    private Integer investmentHorizonMonth;

    public void updateResult(Integer riskScore,
                             InvestmentType riskType,
                             Integer investmentHorizonMonth) {
        this.riskScore = riskScore;
        this.riskType = riskType;
        this.investmentHorizonMonth = investmentHorizonMonth;
    }
}