package com.gotchabug.moneymate.dto.customer;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "관리자 문의 답변 요청")
public class AdminInquiryAnswerRequest {

    @NotBlank(message = "답변 내용은 필수입니다.")
    @Schema(description = "답변 내용", example = "문의 내용을 확인했습니다.")
    private String answer;
}
