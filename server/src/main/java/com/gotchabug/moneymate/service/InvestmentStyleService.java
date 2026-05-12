package com.gotchabug.moneymate.service;

import com.gotchabug.moneymate.dto.investment.InvestmentSurveyRequest;
import com.gotchabug.moneymate.dto.investment.InvestmentSurveyResponse;
import com.gotchabug.moneymate.entity.InvestmentStyle;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.enums.InvestmentType;
import com.gotchabug.moneymate.repository.InvestmentStyleRepository;
import com.gotchabug.moneymate.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InvestmentStyleService {

    private final InvestmentStyleRepository investmentStyleRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public InvestmentSurveyResponse analyze(Long memberId, InvestmentSurveyRequest request) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));

        int totalScore = calculateTotalScore(request);
        InvestmentType investmentType = calculateInvestmentType(totalScore);
        int investmentHorizonMonth = calculateInvestmentHorizonMonth(request.getQ2());

        InvestmentStyle investmentStyle = investmentStyleRepository
                .findByMember_MemberId(memberId)
                .orElseGet(() -> InvestmentStyle.builder()
                        .member(member)
                        .riskScore(totalScore)
                        .riskType(investmentType)
                        .investmentHorizonMonth(investmentHorizonMonth)
                        .build());

        investmentStyle.updateResult(
                totalScore,
                investmentType,
                investmentHorizonMonth
        );

        investmentStyleRepository.save(investmentStyle);

        return InvestmentSurveyResponse.builder()
                .totalScore(totalScore)
                .investmentType(investmentType)
                .typeName(getTypeName(investmentType))
                .build();
    }

    private int calculateTotalScore(InvestmentSurveyRequest request) {
        return getQ1Score(request.getQ1())
                + getQ2Score(request.getQ2())
                + getQ3Score(request.getQ3())
                + getQ4Score(request.getQ4())
                + getQ5Score(request.getQ5())
                + getQ6Score(request.getQ6());
    }

    private int getQ1Score(int answer) {
        return switch (answer) {
            case 1 -> 2;
            case 2 -> 4;
            case 3 -> 6;
            case 4 -> 8;
            default -> throw new IllegalArgumentException("Q1 답변이 올바르지 않습니다.");
        };
    }

    private int getQ2Score(int answer) {
        return switch (answer) {
            case 1 -> 2;
            case 2 -> 4;
            case 3 -> 6;
            case 4 -> 8;
            case 5 -> 10;
            default -> throw new IllegalArgumentException("Q2 답변이 올바르지 않습니다.");
        };
    }

    private int getQ3Score(int answer) {
        return switch (answer) {
            case 1 -> 2;
            case 2 -> 4;
            case 3 -> 6;
            case 4 -> 8;
            default -> throw new IllegalArgumentException("Q3 답변이 올바르지 않습니다.");
        };
    }

    private int getQ4Score(int answer) {
        return switch (answer) {
            case 1 -> 2;
            case 2 -> 6;
            case 3 -> 10;
            case 4 -> 15;
            default -> throw new IllegalArgumentException("Q4 답변이 올바르지 않습니다.");
        };
    }

    private int getQ5Score(int answer) {
        return switch (answer) {
            case 1 -> 2;
            case 2 -> 4;
            case 3 -> 8;
            case 4 -> 12;
            default -> throw new IllegalArgumentException("Q5 답변이 올바르지 않습니다.");
        };
    }

    private int getQ6Score(int answer) {
        return switch (answer) {
            case 1 -> 2;
            case 2 -> 5;
            case 3 -> 10;
            default -> throw new IllegalArgumentException("Q6 답변이 올바르지 않습니다.");
        };
    }

    private InvestmentType calculateInvestmentType(int totalScore) {
        if (totalScore >= 50) {
            return InvestmentType.AGGRESSIVE;
        }
        if (totalScore >= 40) {
            return InvestmentType.ACTIVE;
        }
        if (totalScore >= 30) {
            return InvestmentType.NEUTRAL;
        }
        if (totalScore >= 20) {
            return InvestmentType.STABLE_SEEKING;
        }
        return InvestmentType.STABLE;
    }

    private int calculateInvestmentHorizonMonth(int answer) {
        return switch (answer) {
            case 1 -> 6;
            case 2 -> 24;
            case 3 -> 48;
            case 4 -> 84;
            case 5 -> 120;
            default -> throw new IllegalArgumentException("투자 기간 답변이 올바르지 않습니다.");
        };
    }

    private String getTypeName(InvestmentType investmentType) {
        return switch (investmentType) {
            case AGGRESSIVE -> "공격투자형";
            case ACTIVE -> "적극투자형";
            case NEUTRAL -> "위험중립형";
            case STABLE_SEEKING -> "안정추구형";
            case STABLE -> "안정형";
        };
    }
}