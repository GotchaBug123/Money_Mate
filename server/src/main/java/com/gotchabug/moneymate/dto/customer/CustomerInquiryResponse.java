package com.gotchabug.moneymate.dto.customer;

import com.gotchabug.moneymate.entity.CustomerInquiry;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@Schema(description = "고객 문의 응답")
public class CustomerInquiryResponse {

    @Schema(description = "문의 ID", example = "1")
    private Long inquiryId;

    @Schema(description = "작성자 회원 ID", example = "3")
    private Long memberId;

    @Schema(description = "작성자 이름", example = "홍길동")
    private String memberName;

    @Schema(description = "카테고리", example = "투자")
    private String category;

    @Schema(description = "제목", example = "포트폴리오 추천 문의")
    private String title;

    @Schema(description = "내용", example = "추천 결과를 다시 확인하고 싶습니다.")
    private String content;

    @Schema(description = "관리자 답변", example = "확인 후 안내드리겠습니다.")
    private String answer;

    @Schema(description = "문의 상태", example = "WAITING")
    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime answeredAt;

    public static CustomerInquiryResponse from(CustomerInquiry inquiry) {
        return CustomerInquiryResponse.builder()
                .inquiryId(inquiry.getInquiryId())
                .memberId(inquiry.getMember() == null ? null : inquiry.getMember().getMemberId())
                .memberName(inquiry.getMember() == null ? null : inquiry.getMember().getName())
                .category(inquiry.getCategory())
                .title(inquiry.getTitle())
                .content(inquiry.getContent())
                .answer(inquiry.getAnswer())
                .status(inquiry.getStatus())
                .createdAt(inquiry.getCreatedAt())
                .answeredAt(inquiry.getAnsweredAt())
                .build();
    }
}
