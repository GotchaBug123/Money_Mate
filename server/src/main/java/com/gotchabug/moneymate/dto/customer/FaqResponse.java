package com.gotchabug.moneymate.dto.customer;

import com.gotchabug.moneymate.entity.Faq;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@Schema(description = "FAQ 응답")
public class FaqResponse {

    @Schema(description = "FAQ ID", example = "1")
    private Long faqId;

    @Schema(description = "카테고리", example = "투자")
    private String category;

    @Schema(description = "질문", example = "포트폴리오 추천은 어떻게 만들어지나요?")
    private String question;

    @Schema(description = "답변", example = "투자성향과 목표를 기반으로 분석합니다.")
    private String answer;

    @Schema(description = "조회수", example = "12")
    private Integer viewCount;

    @Schema(description = "활성 여부", example = "true")
    private Boolean active;

    private LocalDateTime createdAt;

    public static FaqResponse from(Faq faq) {
        return FaqResponse.builder()
                .faqId(faq.getFaqId())
                .category(faq.getCategory())
                .question(faq.getQuestion())
                .answer(faq.getAnswer())
                .viewCount(faq.getViewCount())
                .active("Y".equalsIgnoreCase(faq.getActiveYn()))
                .createdAt(faq.getCreatedAt())
                .build();
    }
}
