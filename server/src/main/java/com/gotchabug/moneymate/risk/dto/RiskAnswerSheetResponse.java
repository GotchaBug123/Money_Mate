package com.gotchabug.moneymate.risk.dto;

import com.gotchabug.moneymate.risk.entity.RiskAnswerSheet;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class RiskAnswerSheetResponse {

    private Long answerSheetId;

    private Integer totalScore;
    private String resultType;
    private BigDecimal riskAvoidancePercent;
    private BigDecimal financialInterestPercent;
    private LocalDateTime submittedAt;

    public static RiskAnswerSheetResponse from(
            RiskAnswerSheet sheet
    ) {

        if (sheet == null) {
            return null;
        }

        return RiskAnswerSheetResponse.builder()
                .answerSheetId(sheet.getAnswerSheetId())
                .totalScore(sheet.getTotalScore())
                .resultType(sheet.getResultType())
                .riskAvoidancePercent(sheet.getRiskAvoidancePercent())
                .financialInterestPercent(sheet.getFinancialInterestPercent())
                .submittedAt(sheet.getSubmittedAt())
                .build();
    }
}
