package com.gotchabug.moneymate.controller;

import com.gotchabug.moneymate.entity.FinancialProfile;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.repository.FinancialProfileRepository;
import com.gotchabug.moneymate.service.MypageService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class MypageController {

    private final MypageService mypageService;
    private final FinancialProfileRepository financialProfileRepository;

    @GetMapping("/mypage")
    public String mypage(HttpSession session, Model model) {

        Member loginUser =
                (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        Member member =
                mypageService.getMyInfo(loginUser.getMemberId());

        FinancialProfile profile =
                financialProfileRepository
                        .findByMember_MemberId(loginUser.getMemberId())
                        .orElse(null);

        model.addAttribute("member", member);
        model.addAttribute("profile", profile);

        return "mypage";
    }
}