package com.gotchabug.moneymate.service;

import com.gotchabug.moneymate.dto.risk.InvestmentRecommendationCard;
import com.gotchabug.moneymate.dto.risk.RiskSurveyRequest;
import com.gotchabug.moneymate.dto.risk.RiskSurveyResponse;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.entity.RiskAnswerSheet;
import com.gotchabug.moneymate.repository.RiskAnswerSheetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.StringJoiner;

@Service
@RequiredArgsConstructor
public class RiskSurveyService {

    private final RiskAnswerSheetRepository riskAnswerSheetRepository;

    public RiskSurveyResponse submitSurvey(Member member, RiskSurveyRequest request) {

        int totalScore =
                request.getIncomeRange()
                        + request.getInvestmentPurpose()
                        + request.getInvestmentHorizon()
                        + request.getExperienceLevel()
                        + request.getUnderstandingLevel()
                        + request.getInvestmentRatio()
                        + request.getFundSource()
                        + request.getPriority()
                        + request.getLossTolerance()
                        + request.getLossReaction()
                        + request.getInvestmentStyle()
                        + request.getPreferredProduct();

        String resultType = calculateResultType(totalScore);
        String description = getDescription(resultType);

        BigDecimal riskAvoidancePercent = calculateRiskAvoidancePercent(request);
        BigDecimal financialInterestPercent = calculateFinancialInterestPercent(request);

        List<InvestmentRecommendationCard> recommendations =
                createRecommendationCards(
                        member,
                        request,
                        resultType,
                        riskAvoidancePercent,
                        financialInterestPercent
                );

        RiskAnswerSheet sheet = RiskAnswerSheet.builder()
                .member(member)
                .totalScore(totalScore)
                .resultType(resultType)
                .ageGroup(convertAgeGroup(request.getAgeGroup()))
                .incomeRange(convertIncomeRange(request.getIncomeRange()))
                .investmentPurpose(String.valueOf(request.getInvestmentPurpose()))
                .investmentHorizon(String.valueOf(request.getInvestmentHorizon()))
                .experienceLevel(String.valueOf(request.getExperienceLevel()))
                .understandingLevel(String.valueOf(request.getUnderstandingLevel()))
                .riskTolerance(String.valueOf(request.getLossTolerance()))
                .preferredProduct(convertPreferredProduct(request.getPreferredProduct()))
                .preferredThemes(joinThemes(request))
                .riskAvoidancePercent(riskAvoidancePercent)
                .financialInterestPercent(financialInterestPercent)
                .build();

        riskAnswerSheetRepository.save(sheet);

        return RiskSurveyResponse.builder()
                .totalScore(totalScore)
                .resultType(resultType)
                .description(description)
                .riskAvoidancePercent(riskAvoidancePercent)
                .financialInterestPercent(financialInterestPercent)
                .riskAvoidanceLabel(levelLabel(riskAvoidancePercent))
                .financialInterestLabel(levelLabel(financialInterestPercent))
                .recommendations(recommendations)
                .build();
    }

    private String calculateResultType(int score) {
        if (score <= 21) return "안정형";
        if (score <= 31) return "안정추구형";
        if (score <= 41) return "위험중립형";
        if (score <= 51) return "적극투자형";
        return "공격투자형";
    }

    private String getDescription(String resultType) {
        return switch (resultType) {
            case "안정형" -> "원금 안정성을 가장 중요하게 생각하는 투자자입니다.";
            case "안정추구형" -> "안정성을 우선하지만 일부 수익 기회도 고려하는 투자자입니다.";
            case "위험중립형" -> "안정성과 수익성의 균형을 추구하는 투자자입니다.";
            case "적극투자형" -> "수익을 위해 일정 수준의 위험을 감수할 수 있는 투자자입니다.";
            case "공격투자형" -> "높은 수익 가능성을 위해 높은 변동성도 감수할 수 있는 투자자입니다.";
            default -> "투자성향 분석 결과입니다.";
        };
    }

    private BigDecimal calculateRiskAvoidancePercent(RiskSurveyRequest request) {
        int rawScore =
                reverseScore(request.getInvestmentRatio())
                        + reverseScore(request.getFundSource())
                        + reverseScore(request.getPriority())
                        + reverseScore(request.getLossTolerance())
                        + reverseScore(request.getLossReaction())
                        + reverseScore(request.getInvestmentStyle());

        return BigDecimal.valueOf(rawScore - 6)
                .divide(BigDecimal.valueOf(24), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateFinancialInterestPercent(RiskSurveyRequest request) {
        int themeCount = request.getPreferredThemes() == null
                ? 0
                : Math.min(request.getPreferredThemes().size(), 5);

        int rawScore =
                request.getExperienceLevel()
                        + request.getUnderstandingLevel()
                        + request.getPreferredProduct()
                        + themeCount;

        return BigDecimal.valueOf(rawScore - 3)
                .divide(BigDecimal.valueOf(17), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP);
    }

    private int reverseScore(int value) {
        return 6 - value;
    }

    private String levelLabel(BigDecimal percent) {
        if (percent.compareTo(BigDecimal.valueOf(70)) >= 0) return "높음";
        if (percent.compareTo(BigDecimal.valueOf(40)) >= 0) return "보통";
        return "낮음";
    }

    private List<InvestmentRecommendationCard> createRecommendationCards(
            Member member,
            RiskSurveyRequest request,
            String resultType,
            BigDecimal riskAvoidancePercent,
            BigDecimal financialInterestPercent
    ) {
        int koreaStockScore = 40;
        int usStockScore = 40;
        int koreaEtfScore = 40;
        int usEtfScore = 40;

        if (riskAvoidancePercent.compareTo(BigDecimal.valueOf(40)) < 0) {
            koreaStockScore += 20;
            usStockScore += 20;
        } else if (riskAvoidancePercent.compareTo(BigDecimal.valueOf(70)) >= 0) {
            koreaEtfScore += 20;
            usEtfScore += 20;
        } else {
            koreaStockScore += 10;
            usStockScore += 10;
            koreaEtfScore += 10;
            usEtfScore += 10;
        }

        if (financialInterestPercent.compareTo(BigDecimal.valueOf(70)) >= 0) {
            koreaStockScore += 12;
            usStockScore += 15;
            usEtfScore += 8;
        } else if (financialInterestPercent.compareTo(BigDecimal.valueOf(40)) < 0) {
            koreaEtfScore += 12;
            usEtfScore += 12;
        } else {
            koreaEtfScore += 8;
            usEtfScore += 8;
        }

        switch (request.getPreferredProduct()) {
            case 2 -> koreaStockScore += 15;
            case 3 -> koreaEtfScore += 15;
            case 4 -> usStockScore += 15;
            case 5 -> usEtfScore += 15;
            default -> {
                koreaEtfScore += 8;
                usEtfScore += 8;
            }
        }

        if (request.getPreferredThemes() != null) {
            for (String theme : request.getPreferredThemes()) {
                if (theme.contains("AI") || theme.contains("반도체") || theme.contains("2차전지")
                        || theme.contains("자동차") || theme.contains("광통신")
                        || theme.contains("로봇")) {
                    koreaStockScore += 4;
                    koreaEtfScore += 3;
                }

                if (theme.contains("미국")) {
                    usStockScore += 8;
                    usEtfScore += 6;
                }

                if (theme.contains("배당") || theme.contains("연금")) {
                    koreaEtfScore += 8;
                    usEtfScore += 8;
                }
            }
        }

        koreaStockScore = Math.min(koreaStockScore, 100);
        usStockScore = Math.min(usStockScore, 100);
        koreaEtfScore = Math.min(koreaEtfScore, 100);
        usEtfScore = Math.min(usEtfScore, 100);

        List<InvestmentRecommendationCard> cards = new ArrayList<>();

        cards.add(buildCard(member, "한국주식", koreaStockScore, resultType, riskAvoidancePercent, financialInterestPercent));
        cards.add(buildCard(member, "미국주식", usStockScore, resultType, riskAvoidancePercent, financialInterestPercent));
        cards.add(buildCard(member, "국내ETF", koreaEtfScore, resultType, riskAvoidancePercent, financialInterestPercent));
        cards.add(buildCard(member, "미국ETF", usEtfScore, resultType, riskAvoidancePercent, financialInterestPercent));

        cards.sort((a, b) -> Integer.compare(b.getMatchingScore(), a.getMatchingScore()));

        List<InvestmentRecommendationCard> rankedCards = new ArrayList<>();

        for (int i = 0; i < cards.size(); i++) {
            InvestmentRecommendationCard card = cards.get(i);

            rankedCards.add(InvestmentRecommendationCard.builder()
                    .categoryName(card.getCategoryName())
                    .rankNo(i + 1)
                    .matchingScore(card.getMatchingScore())
                    .operationLevel(card.getOperationLevel())
                    .riskType(card.getRiskType())
                    .minimumAmount(card.getMinimumAmount())
                    .reason(card.getReason())
                    .tags(card.getTags())
                    .riskAvoidancePercent(card.getRiskAvoidancePercent())
                    .financialInterestPercent(card.getFinancialInterestPercent())
                    .riskAvoidanceLabel(card.getRiskAvoidanceLabel())
                    .financialInterestLabel(card.getFinancialInterestLabel())
                    .build());
        }

        return rankedCards;
    }

    private InvestmentRecommendationCard buildCard(
            Member member,
            String categoryName,
            int matchingScore,
            String resultType,
            BigDecimal riskAvoidancePercent,
            BigDecimal financialInterestPercent
    ) {
        double operationLevel = Math.round((matchingScore / 10.0) * 10) / 10.0;

        String riskType;
        if (matchingScore >= 75) {
            riskType = "공격형";
        } else if (matchingScore >= 60) {
            riskType = "균형형";
        } else {
            riskType = "방어형";
        }

        String minimumAmount = categoryName.contains("ETF")
                ? "100만원부터"
                : "300만원부터";

        return InvestmentRecommendationCard.builder()
                .categoryName(categoryName)
                .matchingScore(matchingScore)
                .operationLevel(operationLevel)
                .riskType(riskType)
                .minimumAmount(minimumAmount)
                .reason(createEasyReason(member, categoryName, riskAvoidancePercent, financialInterestPercent))
                .tags(createEasyTags(riskAvoidancePercent, financialInterestPercent, categoryName))
                .riskAvoidancePercent(riskAvoidancePercent)
                .financialInterestPercent(financialInterestPercent)
                .riskAvoidanceLabel(levelLabel(riskAvoidancePercent))
                .financialInterestLabel(levelLabel(financialInterestPercent))
                .build();
    }

    private String createEasyReason(
            Member member,
            String categoryName,
            BigDecimal riskAvoidancePercent,
            BigDecimal financialInterestPercent
    ) {
        String name = member.getName();

        if (categoryName.equals("한국주식")) {
            if (riskAvoidancePercent.compareTo(BigDecimal.valueOf(40)) < 0
                    && financialInterestPercent.compareTo(BigDecimal.valueOf(60)) >= 0) {
                return name + "님은 손실 위험을 어느 정도 감수할 수 있고 금융상품에 대한 관심도도 높은 편입니다. "
                        + "그래서 익숙한 국내 기업에 투자하는 한국주식 포트폴리오가 잘 맞습니다.";
            }

            if (riskAvoidancePercent.compareTo(BigDecimal.valueOf(70)) >= 0) {
                return name + "님은 안정성을 중요하게 보는 편입니다. "
                        + "한국주식은 변동성이 있을 수 있으므로 관심 있는 테마 중심으로 소액부터 접근하는 것이 좋습니다.";
            }

            return name + "님은 안정성과 수익을 함께 고려하는 편입니다. "
                    + "한국주식은 국내 산업 흐름을 쉽게 이해할 수 있어 균형 잡힌 투자 선택지가 될 수 있습니다.";
        }

        if (categoryName.equals("미국주식")) {
            if (riskAvoidancePercent.compareTo(BigDecimal.valueOf(40)) < 0
                    && financialInterestPercent.compareTo(BigDecimal.valueOf(60)) >= 0) {
                return name + "님은 성장 가능성이 큰 자산에 관심이 있고 변동성도 감수할 수 있는 편입니다. "
                        + "미국주식은 AI, 반도체, 빅테크 기업에 투자할 수 있어 잘 어울립니다.";
            }

            if (riskAvoidancePercent.compareTo(BigDecimal.valueOf(70)) >= 0) {
                return name + "님은 위험을 피하려는 성향이 강한 편입니다. "
                        + "미국주식은 변동성이 있을 수 있으니 ETF와 함께 분산해서 접근하는 것이 좋습니다.";
            }

            return name + "님은 글로벌 성장 산업에도 관심을 가져볼 만한 성향입니다. "
                    + "미국주식은 장기 성장 가능성이 있는 기업을 중심으로 선택할 수 있습니다.";
        }

        if (categoryName.equals("국내ETF")) {
            if (riskAvoidancePercent.compareTo(BigDecimal.valueOf(60)) >= 0) {
                return name + "님은 안정성을 중요하게 생각하는 편입니다. "
                        + "국내ETF는 여러 종목에 나누어 투자할 수 있어 개별 주식보다 부담을 줄일 수 있습니다.";
            }

            return name + "님은 수익 기회도 원하지만 한 종목에 집중되는 위험은 줄이는 것이 좋습니다. "
                    + "국내ETF는 테마와 시장에 분산 투자할 수 있어 적합합니다.";
        }

        if (riskAvoidancePercent.compareTo(BigDecimal.valueOf(60)) >= 0) {
            return name + "님은 안정적인 분산투자를 선호할 가능성이 높습니다. "
                    + "미국ETF는 S&P500, 나스닥 같은 대표 지수에 나누어 투자할 수 있어 장기투자에 적합합니다.";
        }

        return name + "님은 해외 성장시장에도 관심을 가져볼 만한 성향입니다. "
                + "미국ETF는 미국 대표 기업들에 분산 투자하면서 성장성과 안정성을 함께 기대할 수 있습니다.";
    }

    private List<String> createEasyTags(
            BigDecimal riskAvoidancePercent,
            BigDecimal financialInterestPercent,
            String categoryName
    ) {
        List<String> tags = new ArrayList<>();

        tags.add("#위험회피 " + levelLabel(riskAvoidancePercent));
        tags.add("#금융관심 " + levelLabel(financialInterestPercent));

        if (categoryName.contains("ETF")) {
            tags.add("#분산투자");
        } else {
            tags.add("#성장투자");
        }

        if (categoryName.contains("미국")) {
            tags.add("#글로벌");
        } else {
            tags.add("#국내시장");
        }

        return tags;
    }

    private String convertAgeGroup(int value) {
        return switch (value) {
            case 1 -> "19세 미만";
            case 2 -> "19~29세";
            case 3 -> "30~39세";
            case 4 -> "40~49세";
            case 5 -> "50~59세";
            case 6 -> "60세 이상";
            default -> "미입력";
        };
    }

    private String convertIncomeRange(int value) {
        return switch (value) {
            case 1 -> "1천만원 미만";
            case 2 -> "1천만원 이상~3천만원 미만";
            case 3 -> "3천만원 이상~5천만원 미만";
            case 4 -> "5천만원 이상~8천만원 미만";
            case 5 -> "8천만원 이상";
            default -> "미입력";
        };
    }

    private String convertPreferredProduct(int value) {
        return switch (value) {
            case 1 -> "예금/적금";
            case 2 -> "국내 주식";
            case 3 -> "국내 ETF";
            case 4 -> "해외 주식";
            case 5 -> "해외 ETF";
            default -> "미입력";
        };
    }

    private String joinThemes(RiskSurveyRequest request) {
        if (request.getPreferredThemes() == null || request.getPreferredThemes().isEmpty()) {
            return "";
        }

        StringJoiner joiner = new StringJoiner(",");
        request.getPreferredThemes().forEach(joiner::add);
        return joiner.toString();
    }
}