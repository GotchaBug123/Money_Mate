package com.gotchabug.moneymate.community.entity;

import com.gotchabug.moneymate.common.BaseTimeEntity;
import com.gotchabug.moneymate.member.entity.Member;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(
        name = "community_post",
        indexes = {
                @Index(name = "idx_community_post_member", columnList = "member_id"),
                @Index(name = "idx_community_post_theme", columnList = "theme_id"),
                @Index(name = "idx_community_post_category", columnList = "category"),
                @Index(name = "idx_community_post_created_at", columnList = "created_at"),
                @Index(name = "idx_community_post_view_count", columnList = "view_count")
        }
)
public class CommunityPost extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long postId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theme_id")
    private CommunityTheme theme;

    @Column(nullable = false, length = 30)
    private String category;

    @Column(nullable = false, length = 150)
    private String title;

    @Lob
    @Column(nullable = false)
    private String content;

    @Column(name = "stock_symbol", length = 30)
    private String stockSymbol;

    @Column(name = "stock_name", length = 100)
    private String stockName;

    @Column(name = "view_count", nullable = false)
    private Long viewCount;

    @Builder.Default
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CommunityAttachment> attachments = new ArrayList<>();

    public void increaseViewCount() {
        if (viewCount == null) {
            viewCount = 0L;
        }

        viewCount++;
    }

    public void update(
            CommunityTheme theme,
            String category,
            String title,
            String content,
            String stockSymbol,
            String stockName
    ) {
        this.theme = theme;
        this.category = category;
        this.title = title;
        this.content = content;
        this.stockSymbol = stockSymbol;
        this.stockName = stockName;
    }

    public void replaceAttachments(List<CommunityAttachment> newAttachments) {
        attachments.clear();

        for (CommunityAttachment attachment : newAttachments) {
            addAttachment(attachment);
        }
    }

    public void addAttachment(CommunityAttachment attachment) {
        attachments.add(attachment);
        attachment.assignPost(this);
    }

    public boolean isWrittenBy(Long memberId) {
        return member != null
                && member.getMemberId() != null
                && member.getMemberId().equals(memberId);
    }

    public String getAuthorName() {
        return member == null ? null : member.getName();
    }
}
