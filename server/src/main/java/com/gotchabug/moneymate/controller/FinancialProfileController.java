package com.gotchabug.moneymate.controller;

import com.gotchabug.moneymate.dto.financial.FinancialProfileRequest;
import com.gotchabug.moneymate.dto.financial.FinancialProfileResponse;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.FinancialProfileService;
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
import org.springframework.web.bind.annotation.PathVariable;

/*
추가 설명 코드
사용자의 세션을 확인하여 본인 확인을 마친 뒤,
재무 정보를 안전하게 저장하거나 꺼내주는 통로
 */

@RestController
@RequestMapping("/api/financial-profile")
@RequiredArgsConstructor
public class FinancialProfileController {

    private final FinancialProfileService financialProfileService;

    @PostMapping("/me")
    public FinancialProfileResponse saveOrUpdateMyFinancialProfile(
            @Valid @RequestBody FinancialProfileRequest request,
            HttpSession session
    ) {
        Member loginUser = getLoginUser(session);

        return financialProfileService.saveOrUpdate(loginUser, request);
    }

    @GetMapping("/me")
    public FinancialProfileResponse getMyFinancialProfile(
            HttpSession session
    ) {
        Member loginUser = getLoginUser(session);

        return financialProfileService.getMyFinancialProfile(loginUser);
    }

    private Member getLoginUser(HttpSession session) {
        Object loginUser = session.getAttribute("loginUser");

        if (!(loginUser instanceof Member member)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        return member;
    }

    @PostMapping("/test/{memberId}")
    public FinancialProfileResponse saveOrUpdateByMemberIdForTest(
            @PathVariable Long memberId,
            @Valid @RequestBody FinancialProfileRequest request
    ) {
        return financialProfileService.saveOrUpdateByMemberId(memberId, request);
    }
}