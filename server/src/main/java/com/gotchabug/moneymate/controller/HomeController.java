package com.gotchabug.moneymate.controller;

import com.gotchabug.moneymate.entity.FinancialProfile;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.repository.FinancialProfileRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class HomeController {

    private final FinancialProfileRepository financialProfileRepository;

    @GetMapping("/")
    public String home(HttpSession session, Model model) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        FinancialProfile profile = null;

        if (loginUser != null) {
            profile = financialProfileRepository
                    .findByMember_MemberId(loginUser.getMemberId())
                    .orElse(null);
        }

        model.addAttribute("loginUser", loginUser);
        model.addAttribute("profile", profile);

        return "home";
    }

    @GetMapping("/main")
    public String main(HttpSession session, Model model) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        FinancialProfile profile = financialProfileRepository
                .findByMember_MemberId(loginUser.getMemberId())
                .orElse(null);

        model.addAttribute("loginUser", loginUser);
        model.addAttribute("profile", profile);

        return "home";
    }
}