package com.gotchabug.moneymate.controller.admin;

import com.gotchabug.moneymate.entity.Member;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@io.swagger.v3.oas.annotations.Hidden
@Controller
public class AdminNoticeController {

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
