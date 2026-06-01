package com.gotchabug.moneymate.controller.auth;

import com.gotchabug.moneymate.dto.LoginRequest;
import com.gotchabug.moneymate.dto.SignupRequest;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.AuthService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @GetMapping("/signup")
    public String signupForm(Model model) {
        model.addAttribute("signupRequest", new SignupRequest());
        return "join";
    }

    @PostMapping("/signup")
    public String signup(@Valid @ModelAttribute SignupRequest request,
                         BindingResult bindingResult,
                         Model model) {

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

    @GetMapping("/login")
    public String loginForm(Model model) {
        model.addAttribute("loginRequest", new LoginRequest());
        return "login";
    }

    @PostMapping("/login")
    public String login(@Valid @ModelAttribute LoginRequest request,
                        BindingResult bindingResult,
                        HttpSession session,
                        Model model) {

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

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }
}
