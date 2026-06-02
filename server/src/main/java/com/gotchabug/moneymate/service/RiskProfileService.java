package com.gotchabug.moneymate.service;

import com.gotchabug.moneymate.dto.RiskTestRequest;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.entity.RiskProfile;
import com.gotchabug.moneymate.repository.RiskProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RiskProfileService {

    private final RiskProfileRepository riskProfileRepository;

    @Transactional
    public void saveRiskTest(
            Member member,
            RiskTestRequest request
    ) {

        int totalScore =
                request.getQuestion1()
                        + request.getQuestion2()
                        + request.getQuestion3()
                        + request.getQuestion4()
                        + request.getQuestion5();

        String riskType = calculateRiskType(totalScore);

        RiskProfile profile =
                riskProfileRepository
                        .findByMember_MemberId(member.getMemberId())
                        .orElse(
                                RiskProfile.builder()
                                        .member(member)
                                        .totalScore(0)
                                        .riskType("미진단")
                                        .build()
                        );

        profile.updateRiskProfile(
                totalScore,
                riskType
        );

        riskProfileRepository.save(profile);
    }

    private String calculateRiskType(int score) {

        if (score <= 8) {
            return "안정형";
        }

        if (score <= 12) {
            return "안정추구형";
        }

        if (score <= 16) {
            return "위험중립형";
        }

        if (score <= 20) {
            return "적극투자형";
        }

        return "공격투자형";
    }
}