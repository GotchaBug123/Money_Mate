package com.gotchabug.moneymate.admin.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;


/**
 * 관리자 투자정보관리 - 연령대별 평균 투자 성향 통계 DTO
 */
@Getter
@Builder
@Schema(description = "연령대별 투자 성향 통계")
public class AdminAgeGroupStatResponse {


    @Schema(description = "연령대 레이블 (예: 20대 / 30대 / 40대 / 50대 / 60대)")
    private String ageGroup;


    @Schema(description = "해당 연령대 가장 많은 투자 유형명 (예: ETF / 해외주식 등)")
    private String dominantRiskTypeName;


    @Schema(description = "해당 유형 비율 (%) - 소수점 없는 정수")
    private int ratio;


    @Schema(description = "평균 투자 성향 점수 (연령대 내 totalScore 평균)")
    private double avgScore;
}