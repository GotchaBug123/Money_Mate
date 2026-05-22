package com.gotchabug.moneymate.service;

import com.gotchabug.moneymate.dto.investment.RiskProfileRequest;
import com.gotchabug.moneymate.dto.investment.RiskProfileResponse;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.entity.RiskProfile;
import com.gotchabug.moneymate.repository.MemberRepository;
import com.gotchabug.moneymate.repository.RiskProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RiskProfileService {

    private final RiskProfileRepository riskProfileRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public RiskProfileResponse analyze(Long memberId, RiskProfileRequest request) {

        Integer totalScore = request.getTotalScore();

        String riskTypeCode = calculateRiskTypeCode(totalScore);
        String riskTypeName = calculateRiskTypeName(riskTypeCode);

        // 로그인한 사용자일 때만 DB 저장
        if (memberId != null) {
            Member member = memberRepository.findById(memberId)
                    .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));

            RiskProfile riskProfile = riskProfileRepository
                    .findByMember_MemberId(memberId)
                    .orElseGet(() -> RiskProfile.builder()
                            .member(member)
                            .totalScore(totalScore)
                            .riskTypeCode(riskTypeCode)
                            .riskTypeName(riskTypeName)
                            .build());

            riskProfile.updateResult(totalScore, riskTypeCode, riskTypeName);

            riskProfileRepository.save(riskProfile);
        }

        return RiskProfileResponse.builder()
                .totalScore(totalScore)
                .riskTypeCode(riskTypeCode)
                .riskTypeName(riskTypeName)
                .build();
    }

    private String calculateRiskTypeCode(Integer totalScore) {

        if (totalScore >= 52) {     //52~60
            return "AGGRESSIVE";
        }
        if (totalScore >= 42) {     //42~51
            return "ACTIVE";
        }
        if (totalScore >= 30) {     //30~41
            return "NEUTRAL";
        }
        if (totalScore >= 20) {     //20~29
            return "STABLE_SEEKING";
        }
        return "STABLE";            //12~19
    }

    private String calculateRiskTypeName(String riskTypeCode) {
        return switch (riskTypeCode) {
            case "AGGRESSIVE" -> "공격투자형";
            case "ACTIVE" -> "적극투자형";
            case "NEUTRAL" -> "위험중립형";
            case "STABLE_SEEKING" -> "안정추구형";
            case "STABLE" -> "안정형";
            default -> "알 수 없음";
        };
    }
}