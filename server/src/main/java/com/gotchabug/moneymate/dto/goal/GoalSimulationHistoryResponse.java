package com.gotchabug.moneymate.dto.goal;

import com.gotchabug.moneymate.entity.GoalStrategyResult;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@Schema(description = "목표 시뮬레이션 이력 응답")
public class GoalSimulationHistoryResponse {

    @Schema(description = "결과 ID", example = "1")
    private Long resultId;

    @Schema(description = "목표명", example = "포트폴리오 리밸런싱 분석")
    private String goalName;

    @Schema(description = "현재 금액", example = "0")
    private Long currentAmount;

    @Schema(description = "월 투자금", example = "500000")
    private Long monthlyInvestment;

    @Schema(description = "목표 금액", example = "50000000")
    private Long targetAmount;

    @Schema(description = "투자 기간", example = "10")
    private Integer investmentYears;

    @Schema(description = "성공 확률", example = "72.3")
    private Double successProbability;

    @Schema(description = "평균 최종 금액", example = "53000000")
    private Long averageFinalAmount;

    @Schema(description = "중앙 시나리오 금액", example = "51000000")
    private Long medianAmount;

    @Schema(description = "비관 시나리오 금액", example = "42000000")
    private Long pessimisticAmount;

    @Schema(description = "부족 금액", example = "0")
    private Long shortageAmount;

    private LocalDateTime createdAt;

    public static GoalSimulationHistoryResponse from(GoalStrategyResult result) {
        return GoalSimulationHistoryResponse.builder()
                .resultId(result.getGoalStrategyResultId())
                .goalName(result.getGoalName())
                .currentAmount(result.getCurrentAmount())
                .monthlyInvestment(result.getMonthlyInvestment())
                .targetAmount(result.getTargetAmount())
                .investmentYears(result.getInvestmentYears())
                .successProbability(result.getSuccessProbability())
                .averageFinalAmount(result.getAverageFinalAmount())
                .medianAmount(result.getMedianAmount())
                .pessimisticAmount(result.getPessimisticAmount())
                .shortageAmount(result.getShortageAmount())
                .createdAt(result.getCreatedAt())
                .build();
    }
}
