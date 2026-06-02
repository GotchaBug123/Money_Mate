package com.gotchabug.moneymate.controller.admin;

import com.gotchabug.moneymate.dto.admin.notice.NoticeCreateRequest;
import com.gotchabug.moneymate.dto.admin.notice.NoticeResponse;
import com.gotchabug.moneymate.dto.admin.notice.NoticeUpdateRequest;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.AdminNoticeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/notices")
@Tag(name = "Admin Notice", description = "관리자 공지사항 관리 API")
public class AdminNoticeApiController {

    private final AdminNoticeService adminNoticeService;

    @Operation(
            summary = "관리자 공지사항 목록 조회",
            description = "관리자 권한으로 등록된 공지사항 전체 목록을 조회합니다."
    )
    @GetMapping
    public List<NoticeResponse> getNotices(HttpSession session) {
        validateAdmin(session);

        return adminNoticeService.getNotices();
    }

    @Operation(
            summary = "관리자 공지사항 상세 조회",
            description = "공지사항 ID로 상세 내용을 조회합니다."
    )
    @GetMapping("/{noticeId}")
    public NoticeResponse getNotice(
            @Parameter(description = "조회할 공지사항 ID", example = "1")
            @PathVariable Long noticeId,
            HttpSession session
    ) {
        validateAdmin(session);

        return adminNoticeService.getNotice(noticeId);
    }

    @Operation(
            summary = "관리자 공지사항 등록",
            description = "공지사항 제목과 내용을 입력해 새 공지사항을 등록합니다."
    )
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NoticeResponse createNotice(
            @Valid @RequestBody NoticeCreateRequest request,
            HttpSession session
    ) {
        validateAdmin(session);

        return adminNoticeService.createNotice(request);
    }

    @Operation(
            summary = "관리자 공지사항 수정",
            description = "공지사항 ID에 해당하는 공지사항의 제목과 내용을 수정합니다."
    )
    @PutMapping("/{noticeId}")
    public NoticeResponse updateNotice(
            @Parameter(description = "수정할 공지사항 ID", example = "1")
            @PathVariable Long noticeId,
            @Valid @RequestBody NoticeUpdateRequest request,
            HttpSession session
    ) {
        validateAdmin(session);

        return adminNoticeService.updateNotice(noticeId, request);
    }

    @Operation(
            summary = "관리자 공지사항 삭제",
            description = "공지사항 ID에 해당하는 공지사항을 삭제합니다."
    )
    @DeleteMapping("/{noticeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteNotice(
            @Parameter(description = "삭제할 공지사항 ID", example = "1")
            @PathVariable Long noticeId,
            HttpSession session
    ) {
        validateAdmin(session);

        adminNoticeService.deleteNotice(noticeId);
    }

    private void validateAdmin(HttpSession session) {
        Object loginUser = session.getAttribute("loginUser");

        if (!(loginUser instanceof Member member)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Login is required."
            );
        }

        if (!"ADMIN".equalsIgnoreCase(member.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Admin permission is required."
            );
        }
    }
}
