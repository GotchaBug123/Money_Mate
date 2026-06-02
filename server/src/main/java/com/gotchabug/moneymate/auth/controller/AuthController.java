package com.gotchabug.moneymate.auth.controller;

import com.gotchabug.moneymate.auth.dto.HoldingDto;
import com.gotchabug.moneymate.auth.dto.LoginRequest;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Tag(
        name = "인증",
        description = "회원가입, 로그인, 로그아웃 API"
)
@Controller
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(
            summary = "회원가입 화면 조회",
            description = "회원가입 페이지를 조회합니다."
    )
    @GetMapping("/signup")
    public String signupForm(Model model) {
        model.addAttribute("signupRequest", new HoldingDto.SignupRequest());
        return "join";
    }

    @Operation(
            summary = "회원가입",
            description = "회원가입 정보를 입력받아 신규 회원을 등록합니다."
    )
    @PostMapping("/signup")
    public String signup(
            @Parameter(description = "회원가입 요청 정보")
            @Valid @ModelAttribute HoldingDto.SignupRequest request,

            BindingResult bindingResult,
            Model model
    ) {

        if (bindingResult.hasErrors()) {
            return "join";
        }

        try {
            authService.signup(request);
            return "redirect:/login";
        } catch (IllegalArgumentException e) {
            model.addAttribute("error", e.getMessage());
            return "join";
        }
    }

    @Operation(
            summary = "로그인 화면 조회",
            description = "로그인 페이지를 조회합니다."
    )
    @GetMapping("/login")
    public String loginForm(Model model) {
        model.addAttribute("loginRequest", new LoginRequest());
        return "login";
    }

    @Operation(
            summary = "로그인",
            description = "아이디와 비밀번호를 검증하고 로그인 세션을 생성합니다. ADMIN 권한은 관리자 페이지로, 일반 사용자는 메인 페이지로 이동합니다."
    )
    @PostMapping("/login")
    public String login(
            @Parameter(description = "로그인 요청 정보")
            @Valid @ModelAttribute LoginRequest request,

            BindingResult bindingResult,
            HttpSession session,
            Model model
    ) {

        if (bindingResult.hasErrors()) {
            return "login";
        }

        try {
            Member member = authService.login(request);

            session.setAttribute("loginUser", member);

            if ("ADMIN".equals(member.getRole())) {
                return "redirect:/admin";
            }

            return "redirect:/main";

        } catch (IllegalArgumentException e) {
            model.addAttribute("error", e.getMessage());
            return "login";
        }
    }

    @Operation(
            summary = "로그아웃",
            description = "현재 로그인된 사용자의 세션을 만료시키고 홈 화면으로 이동합니다."
    )
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }
}