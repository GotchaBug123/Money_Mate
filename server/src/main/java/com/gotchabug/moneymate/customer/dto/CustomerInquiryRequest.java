package com.gotchabug.moneymate.customer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "고객 문의 등록 요청")
public class CustomerInquiryRequest {

    @NotBlank(message = "문의 유형을 선택해주세요.")
    @Schema(description = "문의 카테고리", example = "투자")
    private String category;

    @NotBlank(message = "제목을 입력해주세요.")
    @Schema(description = "문의 제목", example = "포트폴리오 추천 문의")
    private String title;

    @NotBlank(message = "문의 내용을 입력해주세요.")
    @Schema(description = "문의 내용", example = "추천 결과를 다시 확인하고 싶습니다.")
    private String content;
}
