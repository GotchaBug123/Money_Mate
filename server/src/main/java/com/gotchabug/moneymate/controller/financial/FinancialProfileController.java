package com.gotchabug.moneymate.controller.financial;

import com.gotchabug.moneymate.dto.financial.FinancialProfileRequest;
import com.gotchabug.moneymate.dto.financial.FinancialProfileResponse;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.FinancialProfileService;
import io.swagger.v3.oas.annotations.Operation;
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

/*
추가 설명 코드
로그인한 사용자의 재무정보를 저장 및 조회하는 컨트롤러
*/

@RestController
@RequestMapping("/api/financial-profile")
@RequiredArgsConstructor
@Tag(name = "Financial Profile", description = "회원 재무정보 저장 및 조회 API")
public class FinancialProfileController {

    private final FinancialProfileService financialProfileService;

    /*
    재무정보 저장 및 수정
     */
    @PostMapping("/me")
    @Operation(summary = "내 재무정보 저장/수정", description = "로그인 사용자의 재무정보를 저장하거나 수정합니다.")
    public FinancialProfileResponse saveOrUpdateMyFinancialProfile(
            @Valid @RequestBody FinancialProfileRequest request,
            HttpSession session
    ) {

        Member loginUser = getLoginUser(session);

        return financialProfileService.saveOrUpdate(loginUser, request);
    }

    /*
    내 재무정보 조회
     */
    @GetMapping("/me")
    @Operation(summary = "내 재무정보 조회", description = "로그인 사용자의 재무정보를 조회합니다.")
    public FinancialProfileResponse getMyFinancialProfile(
            HttpSession session
    ) {

        Member loginUser = getLoginUser(session);

        return financialProfileService.getMyFinancialProfile(loginUser);
    }

    /*
    로그인 세션 확인
     */
    private Member getLoginUser(HttpSession session) {

        Object loginUser = session.getAttribute("loginUser");

        if (!(loginUser instanceof Member member)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "로그인이 필요합니다."
            );
        }

        return member;
    }

}
