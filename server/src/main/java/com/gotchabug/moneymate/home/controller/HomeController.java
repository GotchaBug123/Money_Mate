package com.gotchabug.moneymate.home.controller;

import com.gotchabug.moneymate.financial.entity.FinancialProfile;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.financial.repository.FinancialProfileRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Tag(
        name = "Home",
        description = "메인 홈 화면 조회 API"
)
@Controller
@RequiredArgsConstructor
public class HomeController {

    private final FinancialProfileRepository financialProfileRepository;

    @Operation(
            summary = "홈 화면 조회",
            description = """
                    메인 홈 화면을 조회합니다.

                    로그인 사용자인 경우
                    - 회원 정보
                    - 재무정보

                    를 함께 조회하여 화면에 제공합니다.
                    """
    )
    @GetMapping("/")
    public String home(

            @Parameter(hidden = true)
            HttpSession session,

            @Parameter(hidden = true)
            Model model
    ) {

        Member loginUser =
                (Member) session.getAttribute("loginUser");

        FinancialProfile profile = null;

        if (loginUser != null) {

            profile = financialProfileRepository
                    .findByMember_MemberId(
                            loginUser.getMemberId()
                    )
                    .orElse(null);
        }

        model.addAttribute(
                "loginUser",
                loginUser
        );

        model.addAttribute(
                "profile",
                profile
        );

        return "home";
    }

    @Operation(
            summary = "로그인 후 메인 화면 조회",
            description = """
                    로그인한 사용자의 메인 화면을 조회합니다.

                    로그인하지 않은 경우 로그인 화면으로 이동합니다.
                    """
    )
    @GetMapping("/main")
    public String main(

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

        FinancialProfile profile =
                financialProfileRepository
                        .findByMember_MemberId(
                                loginUser.getMemberId()
                        )
                        .orElse(null);

        model.addAttribute(
                "loginUser",
                loginUser
        );

        model.addAttribute(
                "profile",
                profile
        );

        return "home";
    }

    @Operation(
            summary = "홈 화면 조회(/home)",
            description = """
                    홈 화면을 조회합니다.

                    '/' 경로와 동일한 기능을 수행합니다.
                    로그인 사용자의 재무정보를 함께 제공합니다.
                    """
    )
    @GetMapping("/home")
    public String homePage(

            @Parameter(hidden = true)
            HttpSession session,

            @Parameter(hidden = true)
            Model model
    ) {

        Member loginUser =
                (Member) session.getAttribute("loginUser");

        FinancialProfile profile = null;

        if (loginUser != null) {

            profile = financialProfileRepository
                    .findByMember_MemberId(
                            loginUser.getMemberId()
                    )
                    .orElse(null);
        }

        model.addAttribute(
                "loginUser",
                loginUser
        );

        model.addAttribute(
                "profile",
                profile
        );

        return "home";
    }
}