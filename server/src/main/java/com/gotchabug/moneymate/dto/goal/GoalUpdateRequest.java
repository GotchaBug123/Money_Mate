package com.gotchabug.moneymate.dto.goal;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Schema(description = "투자 목표 수정 요청")
public class GoalUpdateRequest {

    @NotBlank(message = "목표명은 필수입니다.")
    @Schema(description = "목표명", example = "노후 준비")
    private String goalName;

    @NotNull(message = "목표 금액은 필수입니다.")
    @DecimalMin(value = "1", message = "목표 금액은 1원 이상이어야 합니다.")
    @Schema(description = "목표 금액", example = "80000000")
    private BigDecimal targetAmount;

    @NotNull(message = "목표일은 필수입니다.")
    @Future(message = "목표일은 오늘 이후여야 합니다.")
    @Schema(description = "목표일", example = "2035-12-31")
    private LocalDate targetDate;

    @NotNull(message = "월 납입금은 필수입니다.")
    @DecimalMin(value = "0", message = "월 납입금은 0원 이상이어야 합니다.")
    @Schema(description = "월 납입금", example = "700000")
    private BigDecimal monthlyContribution;

    @NotNull(message = "현재 금액은 필수입니다.")
    @DecimalMin(value = "0", message = "현재 금액은 0원 이상이어야 합니다.")
    @Schema(description = "현재 보유 금액", example = "5000000")
    private BigDecimal currentAmount;
}
