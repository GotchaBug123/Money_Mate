package com.gotchabug.moneymate.home.controller;

import com.gotchabug.moneymate.auth.dto.AuthResponse;
import com.gotchabug.moneymate.financial.dto.FinancialProfileResponse;
import com.gotchabug.moneymate.financial.repository.FinancialProfileRepository;
import com.gotchabug.moneymate.home.dto.HomeResponse;
import com.gotchabug.moneymate.member.entity.Member;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(
        name = "Home",
        description = "메인 화면에서 필요한 로그인 사용자 및 재무 요약 조회 API"
)
@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
public class HomeController {

    private final FinancialProfileRepository financialProfileRepository;

    @Operation(
            summary = "홈 요약 조회",
            description = "세션 로그인 여부와 로그인 사용자의 재무 프로필 요약을 JSON으로 조회합니다."
    )
    @GetMapping
    public HomeResponse getHomeSummary(
            @Parameter(hidden = true)
            HttpSession session
    ) {
        Object loginUserObj = session.getAttribute("loginUser");

        if (!(loginUserObj instanceof Member loginUser)) {
            return HomeResponse.builder()
                    .loggedIn(false)
                    .member(null)
                    .financialProfile(null)
                    .build();
        }

        FinancialProfileResponse financialProfile = financialProfileRepository
                .findByMember_MemberId(loginUser.getMemberId())
                .map(FinancialProfileResponse::from)
                .orElse(null);

        return HomeResponse.builder()
                .loggedIn(true)
                .member(AuthResponse.from(loginUser))
                .financialProfile(financialProfile)
                .build();
    }
}
