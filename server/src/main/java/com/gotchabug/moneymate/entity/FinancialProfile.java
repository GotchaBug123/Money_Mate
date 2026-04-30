package com.gotchabug.moneymate.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "financial_profile")
public class FinancialProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long profileId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    private BigDecimal monthlyIncome = BigDecimal.ZERO;
    private BigDecimal monthlyFixedExpense = BigDecimal.ZERO;
    private BigDecimal monthlyVariableExpense = BigDecimal.ZERO;
    private BigDecimal totalAsset = BigDecimal.ZERO;
    private BigDecimal totalLiability = BigDecimal.ZERO;
    private BigDecimal cashAsset = BigDecimal.ZERO;
    private BigDecimal investableAmount = BigDecimal.ZERO;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder
    public FinancialProfile(Member member) {
        this.member = member;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}