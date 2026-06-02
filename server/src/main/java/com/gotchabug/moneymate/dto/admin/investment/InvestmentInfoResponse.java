package com.gotchabug.moneymate.dto.admin.investment;

import com.gotchabug.moneymate.entity.InvestmentInfo;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@Schema(description = "관리자 투자정보 응답")
public class InvestmentInfoResponse {

    @Schema(description = "투자정보 ID", example = "1")
    private Long infoId;
    @Schema(description = "제목", example = "ETF 장기투자 가이드")
    private String title;
    @Schema(description = "내용", example = "ETF 투자 시 유의할 점을 정리한 정보입니다.")
    private String content;
    @Schema(description = "카테고리", example = "ETF")
    private String category;
    @Schema(description = "출처명", example = "MoneyMate Research")
    private String sourceName;
    @Schema(description = "출처 URL", example = "https://example.com/report")
    private String sourceUrl;
    @Schema(description = "활성 여부", example = "true")
    private Boolean active;
    @Schema(description = "조회수", example = "0")
    private Long viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static InvestmentInfoResponse from(InvestmentInfo investmentInfo) {
        return InvestmentInfoResponse.builder()
                .infoId(investmentInfo.getInfoId())
                .title(investmentInfo.getTitle())
                .content(investmentInfo.getContent())
                .category(investmentInfo.getCategory())
                .sourceName(investmentInfo.getSourceName())
                .sourceUrl(investmentInfo.getSourceUrl())
                .active(investmentInfo.isActive())
                .viewCount(investmentInfo.getViewCount())
                .createdAt(investmentInfo.getCreatedAt())
                .updatedAt(investmentInfo.getUpdatedAt())
                .build();
    }
}
