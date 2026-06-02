package com.gotchabug.moneymate.admin.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;


import java.math.BigDecimal;
import java.util.List;


/**
 * 관리자 투자정보관리 - 회원별 투자 현황 응답 DTO
 */
@Getter
@Builder
@Schema(description = "회원별 투자 현황")
public class AdminMemberInvestmentResponse {


    @Schema(description = "회원 ID")
    private Long memberId;


    @Schema(description = "회원 이름")
    private String name;


    @Schema(description = "로그인 ID")
    private String loginId;


    @Schema(description = "투자 성향 코드 (예: AGGRESSIVE / MODERATE 등)")
    private String riskTypeCode;


    @Schema(description = "투자 성향명 (예: 공격형 / 안정형 등)")
    private String riskTypeName;


    @Schema(description = "총 평가금액 (보유 종목 buyPrice × quantity 합산)")
    private BigDecimal totalEvaluation;


    @Schema(description = "보유 종목 수")
    private int holdingCount;


    @Schema(description = "보유 종목 목록 (최대 5개 미리보기)")
    private List<String> holdingNames;


    @Schema(description = "미리보기 초과 종목 수 (5개 초과 시 표시)")
    private int remainCount;
}
