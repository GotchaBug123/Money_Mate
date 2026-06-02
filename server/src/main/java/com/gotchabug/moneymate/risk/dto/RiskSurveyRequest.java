package com.gotchabug.moneymate.risk.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RiskSurveyRequest {

    private int ageGroup;              // 1번
    private int incomeRange;           // 2번
    private int investmentPurpose;     // 3번
    private int investmentHorizon;     // 4번
    private int experienceLevel;       // 5번
    private int understandingLevel;    // 6번
    private int investmentRatio;       // 7번
    private int fundSource;            // 8번
    private int priority;              // 9번
    private int lossTolerance;         // 10번
    private int lossReaction;          // 11번
    private int investmentStyle;       // 12번
    private int preferredProduct;      // 13번

    private List<String> preferredThemes; // 14번
}