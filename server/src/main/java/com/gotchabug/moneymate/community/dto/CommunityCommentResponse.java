package com.gotchabug.moneymate.community.dto;

import com.gotchabug.moneymate.community.entity.CommunityComment;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CommunityCommentResponse {

    private Long commentId;
    private Long postId;
    private Long authorId;
    private Long authorMemberId;
    private String authorName;
    private String content;
    private Boolean owner;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean edited;

    public static CommunityCommentResponse from(
            CommunityComment comment,
            Long currentMemberId
    ) {
        return CommunityCommentResponse.builder()
                .commentId(comment.getCommentId())
                .postId(comment.getPost().getPostId())
                .authorId(comment.getMember().getMemberId())
                .authorMemberId(comment.getMember().getMemberId())
                .authorName(comment.getAuthorName())
                .content(comment.getContent())
                .owner(currentMemberId != null
                        && comment.isWrittenBy(currentMemberId))
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .edited(isEdited(comment.getCreatedAt(), comment.getUpdatedAt()))
                .build();
    }

    private static boolean isEdited(
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        return createdAt != null
                && updatedAt != null
                && updatedAt.isAfter(createdAt);
    }
}
