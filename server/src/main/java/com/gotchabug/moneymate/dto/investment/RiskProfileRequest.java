package com.gotchabug.moneymate.dto.investment;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RiskProfileRequest {

    // 12문항 × 1~5점 = 최소 12점, 최대 60점
    @NotNull
    @Min(12)
    @Max(60)
    private Integer totalScore;
}