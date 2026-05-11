package com.gotchabug.moneymate.service;

import com.gotchabug.moneymate.dto.financial.FinancialProfileRequest;
import com.gotchabug.moneymate.dto.financial.FinancialProfileResponse;
import com.gotchabug.moneymate.entity.FinancialProfile;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.repository.FinancialProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.gotchabug.moneymate.repository.MemberRepository;

/*
코드 추가 설명
로그인한 사용자의 재무 데이터를 안전하게 검증하고,
상황(신규/기존)에 맞춰 스마트하게 저장 및 조회하는 재무관리 비서임.
*/


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FinancialProfileService {

    private final FinancialProfileRepository financialProfileRepository;
    private final MemberRepository memberRepository;
    @Transactional
    public FinancialProfileResponse saveOrUpdate(Member loginUser, FinancialProfileRequest request) {
        if (loginUser == null || loginUser.getMemberId() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        FinancialProfile profile = financialProfileRepository
                .findByMember_MemberId(loginUser.getMemberId())
                .orElseGet(() -> FinancialProfile.builder()
                        .member(loginUser)
                        .build());

        profile.updateFinancialInfo(
                request.getMonthlyIncome(),
                request.getMonthlyFixedExpense(),
                request.getMonthlyVariableExpense(),
                request.getTotalAsset(),
                request.getTotalLiability(),
                request.getCashAsset()
        );

        FinancialProfile savedProfile = financialProfileRepository.save(profile);

        return FinancialProfileResponse.from(savedProfile);
    }

    public FinancialProfileResponse getMyFinancialProfile(Member loginUser) {
        if (loginUser == null || loginUser.getMemberId() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        FinancialProfile profile = financialProfileRepository
                .findByMember_MemberId(loginUser.getMemberId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "재무정보를 찾을 수 없습니다."
                ));

        return FinancialProfileResponse.from(profile);
    }

    @Transactional
    public FinancialProfileResponse saveOrUpdateByMemberId(Long memberId, FinancialProfileRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "회원을 찾을 수 없습니다."
                ));

        FinancialProfile profile = financialProfileRepository
                .findByMember_MemberId(memberId)
                .orElseGet(() -> FinancialProfile.builder()
                        .member(member)
                        .build());

        profile.updateFinancialInfo(
                request.getMonthlyIncome(),
                request.getMonthlyFixedExpense(),
                request.getMonthlyVariableExpense(),
                request.getTotalAsset(),
                request.getTotalLiability(),
                request.getCashAsset()
        );

        FinancialProfile savedProfile = financialProfileRepository.save(profile);

        return FinancialProfileResponse.from(savedProfile);
    }

}