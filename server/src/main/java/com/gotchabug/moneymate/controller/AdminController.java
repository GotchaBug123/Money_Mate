package com.gotchabug.moneymate.controller;

import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.AdminDashboardService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import com.gotchabug.moneymate.service.AdminMemberService;
import com.gotchabug.moneymate.service.AdminInquiryService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


@Controller
@RequiredArgsConstructor
public class AdminController {

    private final AdminDashboardService adminDashboardService;
    private final AdminMemberService adminMemberService;
    private final AdminInquiryService adminInquiryService;

    @GetMapping("/admin")
    public String adminMain(HttpSession session, Model model) {

        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        if (!"ADMIN".equals(loginUser.getRole())) {
            return "redirect:/main";
        }

        model.addAttribute("userCount", adminDashboardService.getUserCount());
        model.addAttribute("totalInquiryCount", adminDashboardService.getTotalInquiryCount());
        model.addAttribute("waitingInquiryCount", adminDashboardService.getWaitingInquiryCount());
        model.addAttribute("faqCount", adminDashboardService.getFaqCount());

        return "admin-main";
    }

    @GetMapping("/admin/members")
    public String adminMembers(HttpSession session, Model model) {

        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        if (!"ADMIN".equals(loginUser.getRole())) {
            return "redirect:/main";
        }

        model.addAttribute("members", adminMemberService.getAllMembers());

        return "admin-members";
    }

    @GetMapping("/admin/inquiries")
    public String adminInquiries(HttpSession session, Model model) {

        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        if (!"ADMIN".equals(loginUser.getRole())) {
            return "redirect:/main";
        }

        model.addAttribute("inquiries", adminInquiryService.getAllInquiries());

        return "admin-inquiries";
    }

    @GetMapping("/admin/inquiries/{id}")
    public String adminInquiryDetail(@PathVariable Long id,
                                     HttpSession session,
                                     Model model) {

        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        if (!"ADMIN".equals(loginUser.getRole())) {
            return "redirect:/main";
        }

        model.addAttribute("inquiry", adminInquiryService.getInquiry(id));

        return "admin-inquiry-detail";
    }

    @PostMapping("/admin/inquiries/{id}/answer")
    public String answerInquiry(@PathVariable Long id,
                                @RequestParam String answer,
                                HttpSession session,
                                RedirectAttributes redirectAttributes) {

        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        if (!"ADMIN".equals(loginUser.getRole())) {
            return "redirect:/main";
        }

        adminInquiryService.answerInquiry(id, answer);

        redirectAttributes.addFlashAttribute("message", "답변이 저장되었습니다.");

        return "redirect:/admin/inquiries";

    }
    @GetMapping("/admin/members/{id}/edit")
    public String editMemberPage(@PathVariable Long id,
                                 HttpSession session,
                                 Model model) {

        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        if (!"ADMIN".equals(loginUser.getRole())) {
            return "redirect:/main";
        }

        model.addAttribute("member", adminMemberService.getMember(id));

        return "admin-member-edit";
    }

    @PostMapping("/admin/members/{id}/edit")
    public String updateMember(@PathVariable Long id,
                               @RequestParam String name,
                               @RequestParam String email,
                               @RequestParam String role,
                               @RequestParam String signupStatus,
                               HttpSession session) {

        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        if (!"ADMIN".equals(loginUser.getRole())) {
            return "redirect:/main";
        }

        adminMemberService.updateMember(id, name, email, role, signupStatus);

        return "redirect:/admin/members";
    }

    @PostMapping("/admin/members/{id}/delete")
    public String deleteMember(@PathVariable Long id,
                               HttpSession session) {

        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return "redirect:/login";
        }

        if (!"ADMIN".equals(loginUser.getRole())) {
            return "redirect:/main";
        }

        adminMemberService.deleteMember(id);

        return "redirect:/admin/members";
    }
}