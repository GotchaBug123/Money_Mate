package com.gotchabug.moneymate.financial.controller;

import com.gotchabug.moneymate.financial.dto.FinancialProfileRequest;
import com.gotchabug.moneymate.financial.dto.FinancialProfileResponse;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.financial.service.FinancialProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * 로그인한 사용자의 재무정보 저장 및 조회 컨트롤러
 */
@RestController
@RequestMapping("/api/financial-profile")
@RequiredArgsConstructor
@Tag(
        name = "Financial Profile",
        description = "회원 재무정보 저장 및 조회 API"
)
public class FinancialProfileController {

    private final FinancialProfileService financialProfileService;

    /**
     * 재무정보 저장 및 수정
     */
    @PostMapping("/me")
    @Operation(
            summary = "내 재무정보 저장/수정",
            description = """
                    로그인한 사용자의 재무정보를 저장하거나 수정합니다.
                    
                    입력 정보
                    - 월 소득
                    - 월 고정지출
                    - 월 변동지출
                    - 총 자산
                    - 총 부채
                    - 현금성 자산
                    - 투자 가능 금액
                    
                    저장 후 소비율, 저축률, 순자산, 재무등급이 계산됩니다.
                    """
    )
    public FinancialProfileResponse saveOrUpdateMyFinancialProfile(

            @Parameter(description = "재무정보 입력 요청 데이터", required = true)
            @Valid
            @RequestBody
            FinancialProfileRequest request,

            @Parameter(hidden = true)
            HttpSession session
    ) {

        Member loginUser = getLoginUser(session);

        return financialProfileService.saveOrUpdate(
                loginUser,
                request
        );
    }

    /**
     * 내 재무정보 조회
     */
    @GetMapping("/me")
    @Operation(
            summary = "내 재무정보 조회",
            description = """
                    로그인한 사용자의 재무정보를 조회합니다.
                    
                    조회 항목
                    - 월 소득
                    - 월 고정지출
                    - 월 변동지출
                    - 총 자산
                    - 총 부채
                    - 현금성 자산
                    - 투자 가능 금액
                    - 순자산
                    - 소비율
                    - 저축률
                    - 재무등급
                    """
    )
    public FinancialProfileResponse getMyFinancialProfile(

            @Parameter(hidden = true)
            HttpSession session
    ) {

        Member loginUser = getLoginUser(session);

        return financialProfileService.getMyFinancialProfile(
                loginUser
        );
    }

    /**
     * 로그인 세션 확인
     */
    private Member getLoginUser(HttpSession session) {

        Object loginUser =
                session.getAttribute("loginUser");

        if (!(loginUser instanceof Member member)) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "로그인이 필요합니다."
            );
        }

        return member;
    }
}