package com.gotchabug.moneymate.dto.community;

import com.gotchabug.moneymate.entity.CommunityPost;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CommunityPostListResponse {

    private Long postId;
    private String category;
    private Long themeId;
    private String themeName;
    private String title;
    private String contentPreview;
    private String authorName;
    private String stockSymbol;
    private String stockName;
    private Long viewCount;
    private Long likeCount;
    private Integer attachmentCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CommunityPostListResponse from(
            CommunityPost post,
            long likeCount
    ) {
        return CommunityPostListResponse.builder()
                .postId(post.getPostId())
                .category(post.getCategory())
                .themeId(post.getTheme() == null ? null : post.getTheme().getThemeId())
                .themeName(post.getTheme() == null ? null : post.getTheme().getThemeName())
                .title(post.getTitle())
                .contentPreview(createPreview(post.getContent()))
                .authorName(post.getAuthorName())
                .stockSymbol(post.getStockSymbol())
                .stockName(post.getStockName())
                .viewCount(post.getViewCount())
                .likeCount(likeCount)
                .attachmentCount(post.getAttachments() == null
                        ? 0
                        : post.getAttachments().size())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    public static CommunityPostListResponse from(CommunityPost post) {
        return from(post, 0L);
    }

    private static String createPreview(String content) {
        if (content == null) {
            return "";
        }

        String normalizedContent = content.replaceAll("\\s+", " ").trim();

        if (normalizedContent.length() <= 120) {
            return normalizedContent;
        }

        return normalizedContent.substring(0, 120) + "...";
    }
}
