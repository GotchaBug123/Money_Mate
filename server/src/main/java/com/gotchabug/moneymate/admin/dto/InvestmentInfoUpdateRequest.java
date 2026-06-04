package com.gotchabug.moneymate.admin.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Schema(description = "관리자 투자정보 수정 요청")
public class InvestmentInfoUpdateRequest {

    @NotBlank(message = "제목은 필수입니다.")
    @Size(max = 150, message = "제목은 150자 이하로 입력해주세요.")
    @Schema(description = "투자정보 제목", example = "6월 ETF 시장 동향 수정본")
    private String title;

    @NotBlank(message = "내용은 필수입니다.")
    @Schema(description = "투자정보 내용", example = "시장 변동성과 추천 확인 포인트를 수정합니다.")
    private String content;

    @NotBlank(message = "카테고리는 필수입니다.")
    @Size(max = 50, message = "카테고리는 50자 이하로 입력해주세요.")
    @Schema(description = "투자정보 카테고리", example = "ETF")
    private String category;

    @Size(max = 100, message = "출처명은 100자 이하로 입력해주세요.")
    @Schema(description = "출처명", example = "한국거래소")
    private String sourceName;

    @Size(max = 500, message = "출처 URL은 500자 이하로 입력해주세요.")
    @Schema(description = "출처 URL", example = "https://www.krx.co.kr")
    private String sourceUrl;

    @Schema(description = "활성 여부", example = "true")
    private Boolean active;
}
