package com.gotchabug.moneymate.financial.controller;

import com.gotchabug.moneymate.financial.dto.FinancialProfileRequest;
import com.gotchabug.moneymate.financial.dto.FinancialProfileResponse;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.financial.service.FinancialProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Tag(
        name = "Financial Profile Page",
        description = "재무정보 입력 화면 및 저장 처리 API"
)
@Controller
@RequiredArgsConstructor
public class FinancialProfilePageController {

    private final FinancialProfileService financialProfileService;

    @Operation(
            summary = "재무정보 입력 화면 조회",
            description = """
                    로그인한 사용자의 재무정보 입력 화면을 조회합니다.
                    
                    기존에 저장된 재무정보가 있는 경우 화면에 함께 전달합니다.
                    저장된 재무정보가 없는 경우 profile 값은 null로 전달됩니다.
                    """
    )
    @GetMapping("/financial-profile")
    public String financialProfilePage(

            @Parameter(hidden = true)
            HttpSession session,

            @Parameter(hidden = true)
            Model model
    ) {

        Object loginUserObj =
                session.getAttribute("loginUser");

        if (!(loginUserObj instanceof Member loginUser)) {
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

        return "financial-profile";
    }

    @Operation(
            summary = "재무정보 입력 화면 저장",
            description = """
                    재무정보 입력 화면에서 사용자가 입력한 재무정보를 저장하거나 수정합니다.
                    
                    저장 성공 시 재무진단 결과 화면으로 이동합니다.
                    입력값 검증 실패 시 재무정보 입력 화면으로 다시 이동합니다.
                    """
    )
    @PostMapping("/financial-profile")
    public String saveFinancialProfile(

            @Parameter(description = "재무정보 입력 요청 데이터", required = true)
            @Valid
            FinancialProfileRequest request,

            @Parameter(hidden = true)
            BindingResult bindingResult,

            @Parameter(hidden = true)
            HttpSession session,

            @Parameter(hidden = true)
            Model model
    ) {

        Object loginUserObj =
                session.getAttribute("loginUser");

        if (!(loginUserObj instanceof Member loginUser)) {
            return "redirect:/login";
        }

        if (bindingResult.hasErrors()) {

            model.addAttribute(
                    "member",
                    loginUser
            );

            model.addAttribute(
                    "profile",
                    null
            );

            model.addAttribute(
                    "errorMessage",
                    "입력값을 다시 확인해주세요."
            );

            return "financial-profile";
        }

        financialProfileService.saveOrUpdate(
                loginUser,
                request
        );

        return "redirect:/diagnosis";
    }
}