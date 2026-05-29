package com.gotchabug.moneymate.dto.community;

import com.gotchabug.moneymate.entity.CommunityAttachment;
import com.gotchabug.moneymate.entity.CommunityPost;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class CommunityPostResponse {

    private Long postId;
    private String category;
    private Long themeId;
    private String themeName;
    private String title;
    private String content;
    private Long authorId;
    private String authorName;
    private String stockSymbol;
    private String stockName;
    private Long viewCount;
    private Long likeCount;
    private Boolean liked;
    private Boolean owner;
    private List<AttachmentResponse> attachments;
    private List<CommunityCommentResponse> comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean edited;

    public static CommunityPostResponse from(
            CommunityPost post,
            Long currentMemberId,
            long likeCount,
            boolean liked,
            List<CommunityCommentResponse> comments
    ) {
        return CommunityPostResponse.builder()
                .postId(post.getPostId())
                .category(post.getCategory())
                .themeId(post.getTheme() == null ? null : post.getTheme().getThemeId())
                .themeName(post.getTheme() == null ? null : post.getTheme().getThemeName())
                .title(post.getTitle())
                .content(post.getContent())
                .authorId(post.getMember().getMemberId())
                .authorName(post.getAuthorName())
                .stockSymbol(post.getStockSymbol())
                .stockName(post.getStockName())
                .viewCount(post.getViewCount())
                .likeCount(likeCount)
                .liked(liked)
                .owner(currentMemberId != null && post.isWrittenBy(currentMemberId))
                .attachments(post.getAttachments().stream()
                        .map(AttachmentResponse::from)
                        .toList())
                .comments(comments)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .edited(isEdited(post.getCreatedAt(), post.getUpdatedAt()))
                .build();
    }

    public static CommunityPostResponse from(
            CommunityPost post,
            Long currentMemberId
    ) {
        return from(post, currentMemberId, 0L, false, List.of());
    }

    private static boolean isEdited(
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        return createdAt != null
                && updatedAt != null
                && updatedAt.isAfter(createdAt);
    }

    @Getter
    @Builder
    public static class AttachmentResponse {

        private Long attachmentId;
        private String attachmentUrl;
        private String attachmentName;

        public static AttachmentResponse from(CommunityAttachment attachment) {
            return AttachmentResponse.builder()
                    .attachmentId(attachment.getAttachmentId())
                    .attachmentUrl(attachment.getAttachmentUrl())
                    .attachmentName(attachment.getAttachmentName())
                    .build();
        }
    }
}
