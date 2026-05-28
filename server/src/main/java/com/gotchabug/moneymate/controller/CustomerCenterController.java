package com.gotchabug.moneymate.controller;

import com.gotchabug.moneymate.dto.customer.CustomerInquiryRequest;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.CustomerCenterService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@RequiredArgsConstructor
public class CustomerCenterController {

    private final CustomerCenterService customerCenterService;

    @GetMapping("/customer-center")
    public String customerCenter(HttpSession session, Model model) {

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

    @PostMapping("/customer-center/inquiry")
    public String createInquiry(

            @Valid
            @ModelAttribute("inquiryRequest")
            CustomerInquiryRequest request,

            BindingResult bindingResult,

            HttpSession session,

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