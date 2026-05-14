package com.gotchabug.moneymate.controller;

import com.gotchabug.moneymate.dto.financial.FinancialProfileRequest;
import com.gotchabug.moneymate.dto.financial.FinancialProfileResponse;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.FinancialProfileService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@RequiredArgsConstructor
public class FinancialProfilePageController {

    private final FinancialProfileService financialProfileService;

    @GetMapping("/financial-profile")
    public String financialProfilePage(HttpSession session, Model model) {
        Object loginUserObj = session.getAttribute("loginUser");

        if (!(loginUserObj instanceof Member loginUser)) {
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

        return "financial-profile";
    }

    @PostMapping("/financial-profile")
    public String saveFinancialProfile(
            @Valid FinancialProfileRequest request,
            BindingResult bindingResult,
            HttpSession session,
            Model model
    ) {
        Object loginUserObj = session.getAttribute("loginUser");

        if (!(loginUserObj instanceof Member loginUser)) {
            return "redirect:/login";
        }

        if (bindingResult.hasErrors()) {
            model.addAttribute("member", loginUser);
            model.addAttribute("profile", null);
            model.addAttribute("errorMessage", "입력값을 다시 확인해주세요.");
            return "financial-profile";
        }

        financialProfileService.saveOrUpdate(loginUser, request);

        return "redirect:/diagnosis";
    }
}