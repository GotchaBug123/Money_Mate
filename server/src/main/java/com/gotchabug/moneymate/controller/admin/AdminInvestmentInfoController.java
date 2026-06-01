package com.gotchabug.moneymate.controller.admin;

import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.repository.AssetMasterRepository;
import com.gotchabug.moneymate.repository.AssetRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class AdminInvestmentInfoController {

    private final AssetRepository assetRepository;
    private final AssetMasterRepository assetMasterRepository;

    @GetMapping("/admin/investment-info")
    public String investmentInfo(HttpSession session, Model model) {
        String redirect = getAdminRedirect(session);
        if (redirect != null) {
            return redirect;
        }

        model.addAttribute("assets", assetRepository.findAll(PageRequest.of(0, 50)).getContent());
        model.addAttribute("assetMasters", assetMasterRepository.findAll(PageRequest.of(0, 50)).getContent());

        return "admin-investment-info";
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
