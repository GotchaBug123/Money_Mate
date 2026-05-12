package com.gotchabug.moneymate.dto.investment;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvestmentSurveyRequest {

    @NotNull
    @Min(1)
    @Max(4)
    private Integer q1;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer q2;

    @NotNull
    @Min(1)
    @Max(4)
    private Integer q3;

    @NotNull
    @Min(1)
    @Max(4)
    private Integer q4;

    @NotNull
    @Min(1)
    @Max(4)
    private Integer q5;

    @NotNull
    @Min(1)
    @Max(3)
    private Integer q6;
}