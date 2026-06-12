package com.gotchabug.moneymate.admin.controller;

import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.admin.service.AdminDashboardService;
import com.gotchabug.moneymate.admin.service.AdminInquiryService;
import com.gotchabug.moneymate.admin.service.AdminMemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Tag(
        name = "관리자",
        description = "관리자 대시보드, 회원관리, 문의관리 API"
)
@Controller
@RequiredArgsConstructor
public class AdminController {

    private final AdminDashboardService adminDashboardService;
    private final AdminMemberService adminMemberService;
    private final AdminInquiryService adminInquiryService;

    @Operation(
            summary = "관리자 대시보드 조회",
            description = "회원 수, 전체 문의 수, 대기 문의 수, FAQ 수를 조회합니다."
    )
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

    @Operation(
            summary = "전체 회원 목록 조회",
            description = "관리자가 전체 회원 목록을 조회합니다."
    )
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

    @Operation(
            summary = "전체 문의 목록 조회",
            description = "관리자가 전체 고객 문의 목록을 조회합니다."
    )
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

    @Operation(
            summary = "문의 상세 조회",
            description = "특정 문의의 상세 내용을 조회합니다."
    )
    @GetMapping("/admin/inquiries/{id}")
    public String adminInquiryDetail(

            @Parameter(description = "문의 ID", example = "1")
            @PathVariable Long id,

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

    @Operation(
            summary = "문의 답변 등록",
            description = "관리자가 문의에 대한 답변을 등록합니다."
    )
    @PostMapping("/admin/inquiries/{id}/answer")
    public String answerInquiry(

            @Parameter(description = "문의 ID", example = "1")
            @PathVariable Long id,

            @Parameter(
                    description = "답변 내용",
                    example = "문의주신 내용을 확인하였으며 처리 완료되었습니다."
            )
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

    @Operation(
            summary = "회원 수정 화면 조회",
            description = "특정 회원의 수정 정보를 조회합니다."
    )
    @GetMapping("/admin/members/{id}/edit")
    public String editMemberPage(

            @Parameter(description = "회원 ID", example = "1")
            @PathVariable Long id,

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

    @Operation(
            summary = "회원 정보 수정",
            description = "회원 이름, 이메일, 권한, 가입 상태를 수정합니다."
    )
    @PostMapping("/admin/members/{id}/edit")
    public String updateMember(

            @Parameter(description = "회원 ID", example = "1")
            @PathVariable Long id,

            @Parameter(description = "회원 이름", example = "홍길동")
            @RequestParam String name,

            @Parameter(description = "이메일", example = "test@test.com")
            @RequestParam String email,

            @Parameter(description = "회원 권한", example = "USER")
            @RequestParam String role,

            @Parameter(description = "가입 상태", example = "ACTIVE")
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

    @Operation(
            summary = "회원 삭제",
            description = "특정 회원 정보를 삭제합니다."
    )
    @PostMapping("/admin/members/{id}/delete")
    public String deleteMember(

            @Parameter(description = "회원 ID", example = "1")
            @PathVariable Long id,

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