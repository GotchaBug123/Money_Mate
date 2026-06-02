package com.gotchabug.moneymate.financial.controller;

import com.gotchabug.moneymate.auth.dto.HoldingDto;
import com.gotchabug.moneymate.financial.dto.FinancialProfileResponse;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.financial.service.FinancialProfileService;
import com.gotchabug.moneymate.investment.service.HoldingService;
import com.gotchabug.moneymate.investment.service.WatchlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Tag(
        name = "My Asset Page",
        description = "마이자산 메인 화면 조회 API"
)
@Controller
@RequiredArgsConstructor
public class MyAssetPageController {

    private final FinancialProfileService financialProfileService;
    private final HoldingService holdingService;
    private final WatchlistService watchlistService;

    @Operation(
            summary = "마이자산 메인 화면 조회",
            description = """
                    로그인한 사용자의 마이자산 메인 화면을 조회합니다.

                    조회 항목
                    - 회원 정보
                    - 재무정보
                    - 내가 담은 투자 종목
                    - 관심 종목
                    """
    )
    @GetMapping("/my-asset")
    public String myAssetPage(

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

        Long memberId =
                loginUser.getMemberId();

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

        try {
            List<HoldingDto> holdings =
                    holdingService.getHoldingList(
                            memberId
                    );

            model.addAttribute(
                    "holdings",
                    holdings
            );

        } catch (Exception e) {

            model.addAttribute(
                    "holdings",
                    List.of()
            );
        }

        try {
            List<HoldingDto.WatchlistDto> watchlistItems =
                    watchlistService.getWatchlist(
                            memberId
                    );

            model.addAttribute(
                    "watchlistItems",
                    watchlistItems
            );

        } catch (Exception e) {

            model.addAttribute(
                    "watchlistItems",
                    List.of()
            );
        }

        return "my-asset";
    }
}