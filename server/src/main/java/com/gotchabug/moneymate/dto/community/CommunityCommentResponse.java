package com.gotchabug.moneymate.dto.community;

import com.gotchabug.moneymate.entity.CommunityComment;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CommunityCommentResponse {

    private Long commentId;
    private Long postId;
    private Long authorId;
    private String authorName;
    private String content;
    private Boolean owner;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CommunityCommentResponse from(
            CommunityComment comment,
            Long currentMemberId
    ) {
        return CommunityCommentResponse.builder()
                .commentId(comment.getCommentId())
                .postId(comment.getPost().getPostId())
                .authorId(comment.getMember().getMemberId())
                .authorName(comment.getAuthorName())
                .content(comment.getContent())
                .owner(currentMemberId != null
                        && comment.isWrittenBy(currentMemberId))
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
