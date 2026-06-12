package com.gotchabug.moneymate.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/*
    핵심 방향인 "프론트-백엔드 간의 데이터 구조 싱크 일치,
    백엔드 단의 누락 방지 및 컨트롤러의 RESTful 규격화"를
    만족하기 위한 최종 포트폴리오 컨트롤러 구현 가이드
 */
@Getter
@Setter
public class WatchlistRequest {

    @NotBlank(message = "ticker는 필수입니다.")
    private String ticker;

    @NotBlank(message = "assetName은 필수입니다.")
    private String assetName;

    private String market;
}