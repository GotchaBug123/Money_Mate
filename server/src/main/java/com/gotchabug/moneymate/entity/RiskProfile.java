package com.gotchabug.moneymate.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "risk_profile")
public class RiskProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long riskProfileId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false)
    private Integer totalScore;

    @Column(nullable = false, length = 20)
    private String riskTypeCode;

    @Column(nullable = false, length = 30)
    private String riskTypeName;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public void updateResult(Integer totalScore, String riskTypeCode, String riskTypeName) {
        this.totalScore = totalScore;
        this.riskTypeCode = riskTypeCode;
        this.riskTypeName = riskTypeName;
    }
}