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

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FinancialProfileService {

    private final FinancialProfileRepository financialProfileRepository;

    @Transactional
    public FinancialProfileResponse saveOrUpdate(
            Member loginUser,
            FinancialProfileRequest request
    ) {
        validateLoginUser(loginUser);

        FinancialProfile profile = financialProfileRepository
                .findByMember_MemberId(loginUser.getMemberId())
                .orElseGet(() -> FinancialProfile.create(loginUser));


        profile.updateFinancialInfo(
                request.getMonthlyIncome(),
                request.getMonthlyFixedExpense(),
                request.getMonthlyVariableExpense(),
                request.getTotalAsset(),
                request.getTotalLiability(),
                request.getCashAsset()
        );

        FinancialProfile savedProfile = financialProfileRepository.saveAndFlush(profile);

        return FinancialProfileResponse.from(savedProfile);
    }

    public FinancialProfileResponse getMyFinancialProfile(Member loginUser) {
        validateLoginUser(loginUser);

        FinancialProfile profile = financialProfileRepository
                .findByMember_MemberId(loginUser.getMemberId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "재무정보를 찾을 수 없습니다."
                ));

        return FinancialProfileResponse.from(profile);
    }

    private void validateLoginUser(Member loginUser) {
        if (loginUser == null || loginUser.getMemberId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "로그인이 필요합니다."
            );
        }
    }
}