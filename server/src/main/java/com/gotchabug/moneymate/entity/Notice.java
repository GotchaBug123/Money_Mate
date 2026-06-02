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
        name = "notice",
        indexes = {
                @Index(name = "idx_notice_active_yn", columnList = "active_yn"),
                @Index(name = "idx_notice_created_at", columnList = "created_at")
        }
)
public class Notice extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_id")
    private Long noticeId;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "important_yn", nullable = false, length = 1)
    private String importantYn;

    @Column(name = "active_yn", nullable = false, length = 1)
    private String activeYn;

    @Column(name = "view_count", nullable = false)
    private Long viewCount;

    public void update(
            String title,
            String content,
            String importantYn
    ) {
        this.title = title;
        this.content = content;
        this.importantYn = importantYn;
    }

    public void increaseViewCount() {
        if (viewCount == null) {
            viewCount = 0L;
        }

        viewCount++;
    }

    public void delete() {
        this.activeYn = "N";
    }

    public boolean isActive() {
        return "Y".equalsIgnoreCase(activeYn);
    }

    public boolean isImportant() {
        return "Y".equalsIgnoreCase(importantYn);
    }
}