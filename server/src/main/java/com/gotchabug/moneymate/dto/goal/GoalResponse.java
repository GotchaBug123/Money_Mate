package com.gotchabug.moneymate.dto.goal;

import com.gotchabug.moneymate.entity.InvestmentGoal;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
@Schema(description = "투자 목표 응답")
public class GoalResponse {

    @Schema(description = "목표 ID", example = "1")
    private Long goalId;

    @Schema(description = "목표명", example = "내 집 마련")
    private String goalName;

    @Schema(description = "목표 금액", example = "50000000")
    private BigDecimal targetAmount;

    @Schema(description = "목표일", example = "2030-12-31")
    private LocalDate targetDate;

    @Schema(description = "월 납입금", example = "500000")
    private BigDecimal monthlyContribution;

    @Schema(description = "현재 보유 금액", example = "3000000")
    private BigDecimal currentAmount;

    @Schema(description = "목표 상태", example = "ACTIVE")
    private String goalStatus;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static GoalResponse from(InvestmentGoal goal) {
        return GoalResponse.builder()
                .goalId(goal.getGoalId())
                .goalName(goal.getGoalName())
                .targetAmount(goal.getTargetAmount())
                .targetDate(goal.getTargetDate())
                .monthlyContribution(goal.getMonthlyContribution())
                .currentAmount(goal.getCurrentAmount())
                .goalStatus(goal.getGoalStatus())
                .createdAt(goal.getCreatedAt())
                .updatedAt(goal.getUpdatedAt())
                .build();
    }
}
