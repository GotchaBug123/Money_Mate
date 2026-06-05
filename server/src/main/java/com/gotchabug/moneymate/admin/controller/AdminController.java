package com.gotchabug.moneymate.admin.controller;

import com.gotchabug.moneymate.admin.dto.AdminInquiryAnswerRequest;
import com.gotchabug.moneymate.admin.dto.AdminMemberUpdateRequest;
import com.gotchabug.moneymate.admin.service.AdminDashboardService;
import com.gotchabug.moneymate.admin.service.AdminInquiryService;
import com.gotchabug.moneymate.admin.service.AdminMemberService;
import com.gotchabug.moneymate.member.entity.Member;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Tag(name = "관리자", description = "관리자 대시보드, 회원관리, 문의관리 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminDashboardService adminDashboardService;
    private final AdminMemberService adminMemberService;
    private final AdminInquiryService adminInquiryService;

    @Operation(summary = "관리자 대시보드 조회")
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(HttpSession session) {
        checkAdmin(session);

        return ResponseEntity.ok(Map.of(
                "userCount", adminDashboardService.getUserCount(),
                "totalInquiryCount", adminDashboardService.getTotalInquiryCount(),
                "waitingInquiryCount", adminDashboardService.getWaitingInquiryCount(),
                "faqCount", adminDashboardService.getFaqCount()
        ));
    }

    @Operation(summary = "전체 회원 목록 조회")
    @GetMapping("/members")
    public ResponseEntity<?> getMembers(HttpSession session) {
        checkAdmin(session);

        return ResponseEntity.ok(adminMemberService.getAllMembers());
    }

    @Operation(summary = "회원 상세 조회")
    @GetMapping("/members/{id}")
    public ResponseEntity<?> getMember(
            @PathVariable Long id,
            HttpSession session
    ) {
        checkAdmin(session);

        return ResponseEntity.ok(adminMemberService.getMember(id));
    }

    @Operation(summary = "회원 정보 수정")
    @PutMapping("/members/{id}")
    public ResponseEntity<?> updateMember(
            @PathVariable Long id,
            @RequestBody AdminMemberUpdateRequest request,
            HttpSession session
    ) {
        checkAdmin(session);

        adminMemberService.updateMember(
                id,
                request.getName(),
                request.getEmail(),
                request.getRole(),
                request.getSignupStatus()
        );

        return ResponseEntity.ok(Map.of(
                "message", "회원 정보가 수정되었습니다.",
                "memberId", id
        ));
    }

    @Operation(summary = "회원 삭제")
    @DeleteMapping("/members/{id}")
    public ResponseEntity<?> deleteMember(
            @PathVariable Long id,
            HttpSession session
    ) {
        checkAdmin(session);

        adminMemberService.deleteMember(id);

        return ResponseEntity.ok(Map.of(
                "message", "회원이 삭제되었습니다.",
                "memberId", id
        ));
    }

    @Operation(summary = "전체 문의 목록 조회")
    @GetMapping("/inquiries")
    public ResponseEntity<?> getInquiries(HttpSession session) {
        checkAdmin(session);

        return ResponseEntity.ok(adminInquiryService.getAllInquiries());
    }

    @Operation(summary = "문의 상세 조회")
    @GetMapping("/inquiries/{id}")
    public ResponseEntity<?> getInquiry(
            @PathVariable Long id,
            HttpSession session
    ) {
        checkAdmin(session);

        return ResponseEntity.ok(adminInquiryService.getInquiry(id));
    }

    @Operation(summary = "문의 답변 등록")
    @PostMapping("/inquiries/{id}/answer")
    public ResponseEntity<?> answerInquiry(
            @PathVariable Long id,
            @RequestBody AdminInquiryAnswerRequest request,
            HttpSession session
    ) {
        checkAdmin(session);

        adminInquiryService.answerInquiry(id, request.getAnswer());

        return ResponseEntity.ok(Map.of(
                "message", "답변이 저장되었습니다.",
                "inquiryId", id
        ));
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
}