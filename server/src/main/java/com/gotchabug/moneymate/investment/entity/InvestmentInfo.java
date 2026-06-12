package com.gotchabug.moneymate.investment.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "investment_info")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class InvestmentInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "info_id")
    private Long infoId;

    @Column(nullable = false, length = 200)
    private String title;

    @Lob
    @Column(name = "content", nullable = false, columnDefinition = "LONGTEXT")
    private String content;

    @Column(length = 50)
    private String category;

    @Column(name = "source_name", length = 100)
    private String sourceName;

    @Column(name = "source_url", length = 500)
    private String sourceUrl;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "view_count", nullable = false)
    private Long viewCount = 0L;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public void update(String title, String content, String category,
                       String sourceName, String sourceUrl, Boolean active) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.sourceName = sourceName;
        this.sourceUrl = sourceUrl;
        this.active = active;
    }

    public void increaseViewCount() {
        this.viewCount++;
    }

    @PrePersist
    public void prePersist() {
        this.active = this.active == null ? true : this.active;
        this.viewCount = this.viewCount == null ? 0L : this.viewCount;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}