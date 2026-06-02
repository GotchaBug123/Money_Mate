package com.gotchabug.moneymate.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 내가 담은 관심 주식 테이블
 * 테이블명: watchlist
 *
 * PDF DB 추가 정의 기준:
 * watchlist_id  BIGINT AUTO_INCREMENT PK
 * member_id     BIGINT NOT NULL (FK → member)
 * ticker        VARCHAR(30) NOT NULL
 * asset_name    VARCHAR(100) NOT NULL
 * market        VARCHAR(30)
 * created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
 */
@Entity
@Table(
        name = "watchlist",
        uniqueConstraints = @UniqueConstraint(columnNames = {"member_id", "ticker"})
)
@Getter
@Setter
@NoArgsConstructor
public class Watchlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "watchlist_id")
    private Long watchlistId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "ticker", nullable = false, length = 30)
    private String ticker;

    @Column(name = "asset_name", nullable = false, length = 100)
    private String assetName;

    @Column(name = "market", length = 30)
    private String market;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}