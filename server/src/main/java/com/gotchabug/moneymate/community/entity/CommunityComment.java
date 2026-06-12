package com.gotchabug.moneymate.community.entity;

import com.gotchabug.moneymate.common.BaseTimeEntity;
import com.gotchabug.moneymate.member.entity.Member;
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
        name = "community_comment",
        indexes = {
                @Index(name = "idx_community_comment_post", columnList = "post_id"),
                @Index(name = "idx_community_comment_member", columnList = "member_id"),
                @Index(name = "idx_community_comment_created_at", columnList = "created_at")
        }
)
public class CommunityComment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long commentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private CommunityPost post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String content;

    public void updateContent(String content) {
        this.content = content;
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
