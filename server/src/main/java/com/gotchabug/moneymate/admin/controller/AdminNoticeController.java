package com.gotchabug.moneymate.admin.controller;

import com.gotchabug.moneymate.member.entity.Member;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Tag(
        name = "관리자 공지사항",
        description = "관리자 공지사항 관리 API"
)
@Controller
public class AdminNoticeController {

    @Operation(
            summary = "관리자 공지사항 목록 조회",
            description = "관리자가 공지사항 목록을 조회합니다. 현재는 빈 목록을 반환합니다."
    )
    @GetMapping("/admin/notices")
    public String notices(HttpSession session, Model model) {
        String redirect = getAdminRedirect(session);
        if (redirect != null) {
            return redirect;
        }

        model.addAttribute("notices", List.of());

        return "admin-notices";
    }

    private String getAdminRedirect(HttpSession session) {
        Object loginUser = session.getAttribute("loginUser");

        if (!(loginUser instanceof Member member)) {
            return "redirect:/login";
        }

        if (!"ADMIN".equalsIgnoreCase(member.getRole())) {
            return "redirect:/main";
        }

        return null;
    }
}