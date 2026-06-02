package com.gotchabug.moneymate.dto.admin.notice;

import com.gotchabug.moneymate.entity.Notice;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@Schema(description = "공지사항 응답")
public class NoticeResponse {

    @Schema(description = "공지사항 ID", example = "1")
    private Long noticeId;
    @Schema(description = "공지사항 제목", example = "서비스 점검 안내")
    private String title;
    @Schema(description = "공지사항 내용", example = "서비스 점검 안내 내용입니다.")
    private String content;
    @Schema(description = "중요 공지 여부", example = "true")
    private Boolean important;
    @Schema(description = "활성 여부", example = "true")
    private Boolean active;
    @Schema(description = "조회수", example = "12")
    private Long viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static NoticeResponse from(Notice notice) {
        return NoticeResponse.builder()
                .noticeId(notice.getNoticeId())
                .title(notice.getTitle())
                .content(notice.getContent())
                .important(notice.isImportant())
                .active(notice.isActive())
                .viewCount(notice.getViewCount())
                .createdAt(notice.getCreatedAt())
                .updatedAt(notice.getUpdatedAt())
                .build();
    }
}
