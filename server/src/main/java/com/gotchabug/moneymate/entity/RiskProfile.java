package com.gotchabug.moneymate.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "risk_profile")
public class RiskProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long riskProfileId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false)
    private Integer totalScore = 0;

    @Column(nullable = false, length = 30)
    private String riskType = "미진단";

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder
    public RiskProfile(Member member,
                       Integer totalScore,
                       String riskType) {

        this.member = member;
        this.totalScore = totalScore;
        this.riskType = riskType;
    }

    public void updateRiskProfile(
            Integer totalScore,
            String riskType
    ) {
        this.totalScore = totalScore;
        this.riskType = riskType;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}