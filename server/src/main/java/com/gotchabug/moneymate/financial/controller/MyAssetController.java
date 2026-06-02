package com.gotchabug.moneymate.financial.controller;

import com.gotchabug.moneymate.financial.dto.FinancialProfileRequest;
import com.gotchabug.moneymate.financial.dto.FinancialProfileResponse;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.financial.service.FinancialProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Tag(
        name = "My Asset",
        description = "마이자산 재무정보 조회 및 수정 화면 API"
)
@Controller
@RequiredArgsConstructor
public class MyAssetController {

    private final FinancialProfileService financialProfileService;

    @Operation(
            summary = "내 재무정보 화면 조회",
            description = "로그인한 사용자의 재무정보를 조회하여 마이자산 재무정보 화면으로 이동합니다."
    )
    @GetMapping("/my-asset/financial")
    public String myAssetFinancialPage(

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

        FinancialProfileResponse profile =
                financialProfileService.getMyFinancialProfile(
                        loginUser
                );

        model.addAttribute(
                "member",
                loginUser
        );

        model.addAttribute(
                "profile",
                profile
        );

        return "my-asset-financial";
    }

    @Operation(
            summary = "내 재무정보 수정 화면 조회",
            description = "로그인한 사용자의 기존 재무정보를 조회하여 재무정보 수정 화면으로 이동합니다."
    )
    @GetMapping("/my-asset/financial/edit")
    public String financialEditPage(

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

        FinancialProfileResponse profile =
                financialProfileService.getMyFinancialProfile(
                        loginUser
                );

        model.addAttribute(
                "member",
                loginUser
        );

        model.addAttribute(
                "profile",
                profile
        );

        return "financial-edit";
    }

    @Operation(
            summary = "내 재무정보 수정 처리",
            description = "마이자산 화면에서 사용자가 수정한 재무정보를 저장한 뒤 내 재무정보 화면으로 이동합니다."
    )
    @PostMapping("/my-asset/financial/edit")
    public String updateFinancialProfile(

            @Parameter(hidden = true)
            HttpSession session,

            @Parameter(description = "수정할 재무정보 요청 데이터", required = true)
            @ModelAttribute
            FinancialProfileRequest request
    ) {

        Object loginUserObj =
                session.getAttribute("loginUser");

        if (!(loginUserObj instanceof Member loginUser)) {
            return "redirect:/login";
        }

        financialProfileService.saveOrUpdate(
                loginUser,
                request
        );

        return "redirect:/my-asset/financial";
    }
}