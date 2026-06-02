package com.gotchabug.moneymate.member.controller;

import com.gotchabug.moneymate.financial.dto.FinancialProfileResponse;
import com.gotchabug.moneymate.member.dto.MemberUpdateRequest;
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
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Tag(
        name = "My Page",
        description = "마이페이지 회원정보 조회, 수정, 비밀번호 변경 API"
)
@Controller
@RequiredArgsConstructor
@RequestMapping("/mypage")
public class MypageController {

    private final MemberService memberService;
    private final FinancialProfileService financialProfileService;

    @Operation(
            summary = "마이페이지 조회",
            description = "로그인한 사용자의 회원정보와 재무정보를 조회하여 마이페이지 화면으로 이동합니다."
    )
    @GetMapping
    public String mypage(

            @Parameter(hidden = true)
            HttpSession session,

            @Parameter(hidden = true)
            Model model
    ) {
        Member loginUser =
                (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        model.addAttribute(
                "member",
                loginUser
        );

        try {
            FinancialProfileResponse profile =
                    financialProfileService.getMyFinancialProfile(
                            loginUser
                    );

            model.addAttribute(
                    "profile",
                    profile
            );

        } catch (Exception e) {

            model.addAttribute(
                    "profile",
                    null
            );
        }

        return "mypage";
    }

    @Operation(
            summary = "회원정보 수정 화면 조회",
            description = "로그인한 사용자의 기존 회원정보를 조회하여 회원정보 수정 화면으로 이동합니다."
    )
    @GetMapping("/edit")
    public String editForm(

            @Parameter(hidden = true)
            HttpSession session,

            @Parameter(hidden = true)
            Model model
    ) {
        Member loginUser =
                (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        MemberUpdateRequest request =
                new MemberUpdateRequest();

        request.setName(
                loginUser.getName()
        );

        request.setEmail(
                loginUser.getEmail()
        );

        request.setBirthDate(
                loginUser.getBirthDate()
        );

        model.addAttribute(
                "memberUpdateRequest",
                request
        );

        return "mypage-edit";
    }

    @Operation(
            summary = "회원정보 수정 처리",
            description = "로그인한 사용자의 이름, 이메일, 생년월일 정보를 수정합니다."
    )
    @PostMapping("/edit")
    public String updateMember(

            @Parameter(description = "회원정보 수정 요청 데이터", required = true)
            @Valid
            @ModelAttribute
            MemberUpdateRequest memberUpdateRequest,

            @Parameter(hidden = true)
            BindingResult bindingResult,

            @Parameter(hidden = true)
            HttpSession session,

            @Parameter(hidden = true)
            Model model
    ) {
        Member loginUser =
                (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        if (bindingResult.hasErrors()) {
            return "mypage-edit";
        }

        Member updatedMember =
                memberService.updateMember(
                        loginUser,
                        memberUpdateRequest
                );

        session.setAttribute(
                "loginUser",
                updatedMember
        );

        return "redirect:/mypage";
    }

    @Operation(
            summary = "비밀번호 변경 화면 조회",
            description = "로그인한 사용자의 비밀번호 변경 화면으로 이동합니다."
    )
    @GetMapping("/password")
    public String passwordForm(

            @Parameter(hidden = true)
            HttpSession session,

            @Parameter(hidden = true)
            Model model
    ) {
        Member loginUser =
                (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        model.addAttribute(
                "passwordChangeRequest",
                new PasswordChangeRequest()
        );

        return "mypage-password";
    }

    @Operation(
            summary = "비밀번호 변경 처리",
            description = "로그인한 사용자의 현재 비밀번호를 확인한 뒤 새 비밀번호로 변경합니다."
    )
    @PostMapping("/password")
    public String changePassword(

            @Parameter(description = "비밀번호 변경 요청 데이터", required = true)
            @Valid
            @ModelAttribute
            PasswordChangeRequest passwordChangeRequest,

            @Parameter(hidden = true)
            BindingResult bindingResult,

            @Parameter(hidden = true)
            HttpSession session,

            @Parameter(hidden = true)
            Model model
    ) {
        Member loginUser =
                (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        if (bindingResult.hasErrors()) {
            return "mypage-password";
        }

        try {
            memberService.changePassword(
                    loginUser,
                    passwordChangeRequest
            );

        } catch (IllegalArgumentException e) {

            model.addAttribute(
                    "errorMessage",
                    e.getMessage()
            );

            return "mypage-password";
        }

        model.addAttribute(
                "successMessage",
                "비밀번호가 변경되었습니다."
        );

        return "mypage-password";
    }
}