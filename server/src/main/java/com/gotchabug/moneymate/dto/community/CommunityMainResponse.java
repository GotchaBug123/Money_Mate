package com.gotchabug.moneymate.dto.community;

import com.gotchabug.moneymate.entity.CommunityTheme;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class CommunityMainResponse {

    private List<ThemeResponse> themes;
    private List<CommunityPostListResponse> popularPosts;
    private List<ThemeResponse> popularCommunities;
    private List<CategorySection> categorySections;

    @Getter
    @Builder
    public static class ThemeResponse {

        private Long themeId;
        private String themeName;
        private String description;
        private Integer displayOrder;

        public static ThemeResponse from(CommunityTheme theme) {
            return ThemeResponse.builder()
                    .themeId(theme.getThemeId())
                    .themeName(theme.getThemeName())
                    .description(theme.getDescription())
                    .displayOrder(theme.getDisplayOrder())
                    .build();
        }
    }

    @Getter
    @Builder
    public static class CategorySection {

        private String category;
        private List<CommunityPostListResponse> posts;
    }
}
