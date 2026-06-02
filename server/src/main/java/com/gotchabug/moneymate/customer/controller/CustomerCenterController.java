package com.gotchabug.moneymate.customer.controller;

import com.gotchabug.moneymate.customer.dto.CustomerInquiryRequest;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.customer.service.CustomerCenterService;
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
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Tag(name = "고객센터", description = "고객센터 화면 조회 및 문의 등록 API")
@Controller
@RequiredArgsConstructor
public class CustomerCenterController {

    private final CustomerCenterService customerCenterService;

    @Operation(
            summary = "고객센터 화면 조회",
            description = "로그인한 사용자의 고객센터 화면을 조회합니다. FAQ, 문의 카테고리, 내 문의 목록을 함께 제공합니다."
    )
    @GetMapping("/customer-center")
    public String customerCenter(
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

        model.addAttribute(
                "faqs",
                customerCenterService.getTopFaqs()
        );

        model.addAttribute(
                "categories",
                customerCenterService.getCategories()
        );

        model.addAttribute(
                "inquiries",
                customerCenterService.getMyInquiries(
                        loginUser.getMemberId()
                )
        );

        model.addAttribute(
                "inquiryRequest",
                new CustomerInquiryRequest()
        );

        return "customer-center";
    }

    @Operation(
            summary = "고객 문의 등록",
            description = "로그인한 사용자가 고객센터 문의를 등록합니다. 입력값 검증 실패 시 고객센터 화면으로 다시 이동합니다."
    )
    @PostMapping("/customer-center/inquiry")
    public String createInquiry(

            @Parameter(description = "고객 문의 등록 요청 데이터")
            @Valid
            @ModelAttribute("inquiryRequest")
            CustomerInquiryRequest request,

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

            model.addAttribute(
                    "member",
                    loginUser
            );

            model.addAttribute(
                    "faqs",
                    customerCenterService.getTopFaqs()
            );

            model.addAttribute(
                    "categories",
                    customerCenterService.getCategories()
            );

            model.addAttribute(
                    "inquiries",
                    customerCenterService.getMyInquiries(
                            loginUser.getMemberId()
                    )
            );

            return "customer-center";
        }

        customerCenterService.createInquiry(
                loginUser,
                request.getCategory(),
                request.getTitle(),
                request.getContent()
        );

        return "redirect:/customer-center?success";
    }
}