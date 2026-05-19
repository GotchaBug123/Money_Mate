package com.gotchabug.moneymate.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "risk_answer_sheet")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskAnswerSheet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long answerSheetId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    private Integer totalScore;

    private String resultType;

    private String ageGroup;
    private String incomeRange;
    private String investmentPurpose;
    private String investmentHorizon;
    private String experienceLevel;
    private String understandingLevel;
    private String riskTolerance;
    private String preferredProduct;

    @Column(columnDefinition = "TEXT")
    private String preferredThemes;

    private Integer riskAvoidancePercent;
    private Integer financialInterestPercent;

    private LocalDateTime submittedAt;

    @PrePersist
    public void prePersist() {
        this.submittedAt = LocalDateTime.now();
    }
}