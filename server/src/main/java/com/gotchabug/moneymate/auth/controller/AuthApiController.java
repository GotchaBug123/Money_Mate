package com.gotchabug.moneymate.auth.controller;

import com.gotchabug.moneymate.auth.dto.AuthResponse;
import com.gotchabug.moneymate.auth.dto.LoginRequest;
import com.gotchabug.moneymate.auth.dto.SignupRequest;
import com.gotchabug.moneymate.auth.service.AuthService;
import com.gotchabug.moneymate.member.entity.Member;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "로그인, 회원가입, 세션 사용자 확인 API")
public class AuthApiController {

    private final AuthService authService;

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "회원가입", description = "신규 회원을 등록합니다.")
    public AuthResponse signup(
            @Valid @RequestBody SignupRequest request
    ) {
        return AuthResponse.from(authService.signup(request));
    }

    @PostMapping("/login")
    @Operation(summary = "로그인", description = "아이디와 비밀번호를 검증하고 loginUser 세션을 생성합니다.")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request,
            @Parameter(hidden = true) HttpSession session
    ) {
        Member member = authService.login(request);
        session.setAttribute("loginUser", member);
        return AuthResponse.from(member);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "로그아웃", description = "현재 세션을 만료합니다.")
    public void logout(
            @Parameter(hidden = true) HttpSession session
    ) {
        session.invalidate();
    }

    @GetMapping("/me")
    @Operation(summary = "현재 로그인 사용자 조회", description = "세션에 저장된 loginUser 정보를 조회합니다.")
    public AuthResponse me(
            @Parameter(hidden = true) HttpSession session
    ) {
        Object loginUser = session.getAttribute("loginUser");

        if (!(loginUser instanceof Member member)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "로그인이 필요합니다."
            );
        }

        return AuthResponse.from(member);
    }
}
