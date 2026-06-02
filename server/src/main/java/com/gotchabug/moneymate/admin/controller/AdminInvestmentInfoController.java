package com.gotchabug.moneymate.admin.controller;

import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.market.repository.AssetMasterRepository;
import com.gotchabug.moneymate.market.repository.AssetRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Tag(
        name = "관리자 투자정보",
        description = "관리자 투자정보 관리 화면 API"
)
@Controller
@RequiredArgsConstructor
public class AdminInvestmentInfoController {

    private final AssetRepository assetRepository;
    private final AssetMasterRepository assetMasterRepository;

    @Operation(
            summary = "관리자 투자정보 조회",
            description = "관리자가 투자정보 화면에서 자산 목록과 종목 마스터 목록을 조회합니다."
    )
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