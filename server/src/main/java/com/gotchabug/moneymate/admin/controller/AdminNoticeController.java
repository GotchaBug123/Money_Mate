package com.gotchabug.moneymate.admin.controller;

import com.gotchabug.moneymate.member.entity.Member;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Tag(
        name = "관리자 공지사항",
        description = "관리자 공지사항 관리 API"
)
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/notices")
public class AdminNoticeController {

    @Operation(
            summary = "관리자 공지사항 목록 조회",
            description = "관리자가 공지사항 목록을 조회합니다."
    )
    @GetMapping
    public ResponseEntity<List<AdminNoticeResponse>> getNotices(
            HttpSession session
    ) {
        checkAdmin(session);

        List<AdminNoticeResponse> response = List.of();

        return ResponseEntity.ok(response);
    }

    private void checkAdmin(HttpSession session) {
        Object loginUser = session.getAttribute("loginUser");

        if (!(loginUser instanceof Member member)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "로그인이 필요합니다."
            );
        }

        if (!"ADMIN".equalsIgnoreCase(member.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "관리자 권한이 필요합니다."
            );
        }
    }

    @Getter
    @AllArgsConstructor
    private static class AdminNoticeResponse {
        private Long noticeId;
        private String title;
        private String content;
        private LocalDateTime createdAt;
    }
}