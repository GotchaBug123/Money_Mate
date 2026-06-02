package com.gotchabug.moneymate.controller.member;

import com.gotchabug.moneymate.dto.financial.FinancialProfileResponse;
import com.gotchabug.moneymate.dto.member.MemberUpdateRequest;
import com.gotchabug.moneymate.dto.member.PasswordChangeRequest;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.FinancialProfileService;
import com.gotchabug.moneymate.service.MemberService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("/mypage")
public class MypageController {

    private final MemberService memberService;
    private final FinancialProfileService financialProfileService;

    @GetMapping
    public String mypage(HttpSession session, Model model) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        model.addAttribute("member", loginUser);

        try {
            FinancialProfileResponse profile =
                    financialProfileService.getMyFinancialProfile(loginUser);

            model.addAttribute("profile", profile);
        } catch (Exception e) {
            model.addAttribute("profile", null);
        }

        return "mypage";
    }

    @GetMapping("/edit")
    public String editForm(HttpSession session, Model model) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        MemberUpdateRequest request = new MemberUpdateRequest();
        request.setName(loginUser.getName());
        request.setEmail(loginUser.getEmail());
        request.setBirthDate(loginUser.getBirthDate());

        model.addAttribute("memberUpdateRequest", request);

        return "mypage-edit";
    }

    @PostMapping("/edit")
    public String updateMember(
            @Valid @ModelAttribute MemberUpdateRequest memberUpdateRequest,
            BindingResult bindingResult,
            HttpSession session,
            Model model
    ) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        if (bindingResult.hasErrors()) {
            return "mypage-edit";
        }

        Member updatedMember = memberService.updateMember(loginUser, memberUpdateRequest);

        session.setAttribute("loginUser", updatedMember);

        return "redirect:/mypage";
    }

    @GetMapping("/password")
    public String passwordForm(HttpSession session, Model model) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        model.addAttribute("passwordChangeRequest", new PasswordChangeRequest());

        return "mypage-password";
    }

    @PostMapping("/password")
    public String changePassword(
            @Valid @ModelAttribute PasswordChangeRequest passwordChangeRequest,
            BindingResult bindingResult,
            HttpSession session,
            Model model
    ) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        if (bindingResult.hasErrors()) {
            return "mypage-password";
        }

        try {
            memberService.changePassword(loginUser, passwordChangeRequest);
        } catch (IllegalArgumentException e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "mypage-password";
        }

        model.addAttribute("successMessage", "비밀번호가 변경되었습니다.");
        return "mypage-password";
    }
}