package com.gotchabug.moneymate.risk.entity;

import com.gotchabug.moneymate.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
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
    @Column(name = "answer_sheet_id")
    private Long answerSheetId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "total_score")
    private Integer totalScore;

    @Column(name = "result_type")
    private String resultType;

    @Column(name = "age_group")
    private String ageGroup;

    @Column(name = "income_range")
    private String incomeRange;

    @Column(name = "investment_purpose")
    private String investmentPurpose;

    @Column(name = "investment_horizon")
    private String investmentHorizon;

    @Column(name = "experience_level")
    private String experienceLevel;

    @Column(name = "understanding_level")
    private String understandingLevel;

    @Column(name = "risk_tolerance")
    private String riskTolerance;

    @Column(name = "preferred_product")
    private String preferredProduct;

    @Column(name = "preferred_themes", columnDefinition = "TEXT")
    private String preferredThemes;

    @Column(name = "risk_avoidance_percent", precision = 5, scale = 2)
    private BigDecimal riskAvoidancePercent;

    @Column(name = "financial_interest_percent", precision = 5, scale = 2)
    private BigDecimal financialInterestPercent;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @PrePersist
    public void prePersist() {
        this.submittedAt = LocalDateTime.now();
    }
}