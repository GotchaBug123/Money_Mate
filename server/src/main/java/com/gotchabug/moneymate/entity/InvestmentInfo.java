package com.gotchabug.moneymate.entity;

import com.gotchabug.moneymate.common.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(
        name = "investment_info",
        indexes = {
                @Index(name = "idx_investment_info_category", columnList = "category"),
                @Index(name = "idx_investment_info_active_yn", columnList = "active_yn"),
                @Index(name = "idx_investment_info_created_at", columnList = "created_at")
        }
)
public class InvestmentInfo extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "info_id")
    private Long infoId;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "source_name", length = 100)
    private String sourceName;

    @Column(name = "source_url", length = 500)
    private String sourceUrl;

    @Column(name = "active_yn", nullable = false, length = 1)
    private String activeYn;

    @Column(name = "view_count", nullable = false)
    private Long viewCount;

    public void update(
            String title,
            String content,
            String category,
            String sourceName,
            String sourceUrl,
            String activeYn
    ) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.sourceName = sourceName;
        this.sourceUrl = sourceUrl;
        this.activeYn = activeYn;
    }

    public void delete() {
        this.activeYn = "N";
    }

    public boolean isActive() {
        return "Y".equalsIgnoreCase(activeYn);
    }
}
