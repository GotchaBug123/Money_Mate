package com.gotchabug.moneymate.member.controller;

import com.gotchabug.moneymate.financial.dto.FinancialProfileResponse;
import com.gotchabug.moneymate.member.dto.MemberUpdateRequest;
import com.gotchabug.moneymate.member.dto.MemberResponse; // 1. 응답용 DTO 가정
import com.gotchabug.moneymate.member.dto.PasswordChangeRequest;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.financial.service.FinancialProfileService;
import com.gotchabug.moneymate.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Tag(name = "My Page", description = "마이페이지 회원정보 조회, 수정, 비밀번호 변경 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage")
public class MypageController {

    private final MemberService memberService;
    private final FinancialProfileService financialProfileService;

    @Operation(summary = "마이페이지 조회", description = "로그인한 사용자의 회원정보와 재무정보를 반환합니다.")
    @GetMapping
    public ResponseEntity<?> mypage(@Parameter(hidden = true) HttpSession session) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        Map<String, Object> responseData = new HashMap<>();

        // 2. 엔티티 대신 안전한 Response DTO로 변환하여 리액트에 전달
        responseData.put("member", MemberResponse.from(loginUser));

        try {
            FinancialProfileResponse profile = financialProfileService.getMyFinancialProfile(loginUser);
            responseData.put("profile", profile);
        } catch (Exception e) {
            responseData.put("profile", null);
        }

        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "회원정보 수정 처리", description = "로그인한 사용자의 정보를 수정하고 결과를 반환합니다.")
    @PutMapping("/edit")
    public ResponseEntity<?> updateMember(
            @Valid @RequestBody MemberUpdateRequest memberUpdateRequest,
            BindingResult bindingResult,
            @Parameter(hidden = true) HttpSession session
    ) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("입력값이 올바르지 않습니다.");
        }

        Member updatedMember = memberService.updateMember(loginUser, memberUpdateRequest);
        session.setAttribute("loginUser", updatedMember);

        // 3. 수정 후 반환할 때도 DTO로 감싸서 패스워드 등의 유출을 막음
        return ResponseEntity.ok(MemberResponse.from(updatedMember));
    }

    @Operation(summary = "비밀번호 변경 처리", description = "로그인한 사용자의 새 비밀번호로 변경합니다.")
    @PostMapping("/password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody PasswordChangeRequest passwordChangeRequest,
            BindingResult bindingResult,
            @Parameter(hidden = true) HttpSession session
    ) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("비밀번호 형식이 올바르지 않습니다.");
        }

        Map<String, String> response = new HashMap<>();
        try {
            memberService.changePassword(loginUser, passwordChangeRequest);
            response.put("message", "비밀번호가 성공적으로 변경되었습니다.");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("errorMessage", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}