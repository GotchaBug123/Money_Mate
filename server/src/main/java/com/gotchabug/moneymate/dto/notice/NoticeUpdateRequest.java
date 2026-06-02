package com.gotchabug.moneymate.dto.admin.notice;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Schema(description = "관리자 공지사항 수정 요청")
public class NoticeUpdateRequest {

    @NotBlank(message = "제목은 필수입니다.")
    @Size(max = 150, message = "제목은 150자 이하로 입력해주세요.")
    @Schema(description = "공지사항 제목", example = "서비스 점검 안내 수정")
    private String title;

    @NotBlank(message = "내용은 필수입니다.")
    @Schema(description = "공지사항 내용", example = "점검 시간이 03:00까지로 변경되었습니다.")
    private String content;

    @Schema(description = "중요 공지 여부", example = "false")
    private Boolean important;
}
