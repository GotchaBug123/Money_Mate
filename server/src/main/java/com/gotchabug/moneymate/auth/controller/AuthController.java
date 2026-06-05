package com.gotchabug.moneymate.auth.controller;

import com.gotchabug.moneymate.auth.dto.LoginRequest;
import com.gotchabug.moneymate.auth.dto.SignupRequest;
import com.gotchabug.moneymate.auth.service.AuthService;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.auth.dto.FindIdRequest;
import com.gotchabug.moneymate.auth.dto.FindPasswordRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "인증", description = "회원가입, 로그인, 로그아웃 API")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "회원가입", description = "회원가입 정보를 입력받아 신규 회원을 등록합니다.")
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> signup(
            @Valid @RequestBody SignupRequest request
    ) {
        try {
            authService.signup(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(ApiResponse.success("회원가입 성공", null));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponse.fail(e.getMessage()));
        }
    }

    @Operation(summary = "로그인", description = "아이디와 비밀번호를 검증하고 로그인 세션을 생성합니다.")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpSession session
    ) {
        try {
            Member member = authService.login(request);
            session.setAttribute("loginUser", member);

            return ResponseEntity.ok(
                    ApiResponse.success("로그인 성공", LoginResponse.from(member))
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.fail(e.getMessage()));
        }
    }

    @Operation(summary = "로그아웃", description = "현재 로그인된 사용자의 세션을 만료합니다.")
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpSession session) {
        session.invalidate();

        return ResponseEntity.ok(
                ApiResponse.success("로그아웃 성공", null)
        );
    }

    @Operation(summary = "로그인 사용자 조회", description = "현재 세션에 저장된 로그인 사용자를 조회합니다.")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<LoginResponse>> me(HttpSession session) {
        Object loginUser = session.getAttribute("loginUser");

        if (!(loginUser instanceof Member member)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.fail("로그인이 필요합니다."));
        }

        return ResponseEntity.ok(
                ApiResponse.success("로그인 사용자 조회 성공", LoginResponse.from(member))
        );
    }

    @Getter
    @Builder
    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;

        public static <T> ApiResponse<T> success(String message, T data) {
            return ApiResponse.<T>builder()
                    .success(true)
                    .message(message)
                    .data(data)
                    .build();
        }

        public static <T> ApiResponse<T> fail(String message) {
            return ApiResponse.<T>builder()
                    .success(false)
                    .message(message)
                    .data(null)
                    .build();
        }
    }

    public record LoginResponse(
            Long memberId,
            String loginId,
            String email,
            String name,
            String role
    ) {
        public static LoginResponse from(Member member) {
            return new LoginResponse(
                    member.getMemberId(),
                    member.getLoginId(),
                    member.getEmail(),
                    member.getName(),
                    member.getRole()
            );
        }
    }
    @Operation(summary = "아이디 찾기", description = "이름과 이메일을 통해 회원 아이디를 조회합니다.")
    @PostMapping("/find-id")
    public ResponseEntity<ApiResponse<String>> findId(
            @Valid @RequestBody FindIdRequest request
    ) {
        try {
            String loginId = authService.findId(request);

            return ResponseEntity.ok(
                    ApiResponse.success("아이디 조회 성공", loginId)
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponse.fail(e.getMessage()));
        }
    }

    @Operation(summary = "비밀번호 재설정", description = "아이디와 이메일을 확인한 뒤 새 비밀번호로 재설정합니다.")
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody FindPasswordRequest request
    ) {
        try {
            authService.resetPassword(request);

            return ResponseEntity.ok(
                    ApiResponse.success("비밀번호가 변경되었습니다.", null)
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponse.fail(e.getMessage()));
        }
    }
}