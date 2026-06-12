package com.gotchabug.moneymate.admin.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;


/**
 * 관리자 투자정보관리 - 상단 요약 통계 DTO
 */
@Getter
@Builder
@Schema(description = "투자정보 요약 통계")
public class AdminInvestmentSummaryResponse {


    @Schema(description = "투자정보 등록 회원 수 (보유 종목이 1개 이상인 회원)")
    private long memberCount;


    @Schema(description = "전체 보유 종목 수")
    private long totalHoldingCount;


    @Schema(description = "전체 평가금액 합계")
    private java.math.BigDecimal totalEvaluation;
}