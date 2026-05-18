package com.gotchabug.moneymate.dto.investment;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RiskProfileRequest {

    @NotNull
    @Min(12)
    @Max(63)
    private Integer totalScore;
}