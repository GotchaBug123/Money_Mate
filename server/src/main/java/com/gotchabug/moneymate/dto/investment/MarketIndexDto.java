package com.gotchabug.moneymate.dto.investment;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.List;

/**
 * 시장 지수 카드 DTO
 *
 * 용도: GET /api/market/index 응답
 *
 * MarketIndexService 가 Yahoo Finance Chart API를 호출해서
 * 파싱한 결과를 이 DTO에 담아 JS로 전달한다.
 *
 * JS에서 쓰는 필드:
 *   label           → 카드 라벨 ("코스피 추종 (KODEX 200)")
 *   name            → 종목명   ("KODEX 200")
 *   priceLabel      → 가격 문자열 ("127,800원" / "$745.64")
 *   changeLabel     → 등락률    ("+3.61%" / "-0.52%")
 *   rise            → 상승 여부 (색상 결정)
 *   marketStateLabel→ 장 상태  ("장 진행중" / "장 마감")
 *   sparkline       → 5분봉 종가 배열 → Canvas 스파크라인
 */
@Getter
@Builder
public class MarketIndexDto {

    /** Yahoo Finance 심볼  (069500.KS / 229200.KS / SPY / USDKRW=X) */
    private String yahooSymbol;

    /** 카드 상단 라벨  예) "코스피 추종 (KODEX 200)" */
    private String label;

    /** 굵게 표시되는 종목명  예) "KODEX 200" */
    private String name;

    /** 통화  KRW / USD */
    private String currency;

    /** 현재가 (BigDecimal, 소수점 2자리) */
    private BigDecimal price;

    /** 전일 대비 등락률 (%) */
    private BigDecimal changePercent;

    /** 장 상태  REGULAR / CLOSED / PRE / POST */
    private String marketState;

    /**
     * 당일 5분봉 종가 배열 (null 제거 완료)
     * Canvas drawSparkline() 함수에서 바로 사용
     */
    private List<Double> sparkline;

    // ── JSON 직렬화 시 자동 포함되는 포맷 메서드 ──

    /** "127,800원" 또는 "$745.64" */
    public String getPriceLabel() {
        if (price == null) return "-";
        NumberFormat nf = NumberFormat.getNumberInstance();
        if ("USD".equals(currency)) {
            nf.setMinimumFractionDigits(2);
            nf.setMaximumFractionDigits(2);
            return "$" + nf.format(price);
        } else {
            nf.setMaximumFractionDigits(2);
            return nf.format(price) + "원";
        }
    }

    /** "+3.61%" 또는 "-0.52%" */
    public String getChangeLabel() {
        if (changePercent == null) return "-";
        String sign = changePercent.compareTo(BigDecimal.ZERO) >= 0 ? "+" : "";
        return sign + String.format("%.2f", changePercent) + "%";
    }

    /** 상승 여부 (JS에서 CSS 클래스 분기에 사용) */
    public boolean isRise() {
        return changePercent != null && changePercent.compareTo(BigDecimal.ZERO) >= 0;
    }

    /** "장 진행중" / "장 마감" / "프리장" / "시간외" */
    public String getMarketStateLabel() {
        if (marketState == null) return "";
        return switch (marketState) {
            case "REGULAR" -> "장 진행중";
            case "CLOSED"  -> "장 마감";
            case "PRE"     -> "프리장";
            case "POST"    -> "시간외";
            default        -> marketState;
        };
    }
}