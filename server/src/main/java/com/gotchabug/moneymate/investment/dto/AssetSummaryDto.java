package com.gotchabug.moneymate.investment.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.math.RoundingMode;

@Getter
@Builder
public class AssetSummaryDto {

    private Long assetId;
    private String ticker;
    private String assetName;
    private String assetType;
    private String market;
    private String sector;
    private String currency;
    private LocalDate priceDate;
    private BigDecimal closePrice;
    private BigDecimal dailyReturnPct;
    private BigDecimal monthlyReturnPct;
    private Long volume;
    private BigDecimal tradingValue;

    // ── [추가] 배당 수익률 (%) ────────────────────────────────
    // 배당금 TOP 6 화면 표시용 + 10% 이상 필터링 기준
    private BigDecimal dividendYieldPct;
    // ─────────────────────────────────────────────────────────

    public String getTradingValueLabel() {
        if (tradingValue == null || tradingValue.compareTo(BigDecimal.ZERO) == 0) return "-";
        BigDecimal inEok = tradingValue.divide(new BigDecimal("100000000"), 0, RoundingMode.HALF_UP);
        java.text.NumberFormat nf = java.text.NumberFormat.getNumberInstance();
        return nf.format(inEok) + "억";
    }

    public String getVolumeLabel() {
        if (volume == null) return "-";
        return java.text.NumberFormat.getNumberInstance().format(volume);
    }

    public String getClosePriceLabel() {
        if (closePrice == null) return "-";
        java.text.NumberFormat nf = java.text.NumberFormat.getNumberInstance();
        if ("USD".equals(currency)) {
            nf.setMinimumFractionDigits(2);
            nf.setMaximumFractionDigits(2);
            return "$" + nf.format(closePrice);
        } else {
            nf.setMaximumFractionDigits(0);
            return nf.format(closePrice) + "원";
        }
    }

    public String getDailyReturnLabel() {
        if (dailyReturnPct == null) return "-";
        String sign = dailyReturnPct.compareTo(BigDecimal.ZERO) >= 0 ? "+" : "";
        return sign + String.format("%.2f", dailyReturnPct) + "%";
    }

    public String getMonthlyReturnLabel() {
        if (monthlyReturnPct == null) return "-";
        String sign = monthlyReturnPct.compareTo(BigDecimal.ZERO) >= 0 ? "+" : "";
        return sign + String.format("%.2f", monthlyReturnPct) + "%";
    }

    // ── [추가] 배당 수익률 라벨 ───────────────────────────────
    // 배당금 TOP 6 화면에서 수치 표시용 (예: +3.25%)
    public String getDividendYieldLabel() {
        if (dividendYieldPct == null || dividendYieldPct.compareTo(BigDecimal.ZERO) == 0)
            return "-";
        return "+" + String.format("%.2f", dividendYieldPct) + "%";
    }
    // ─────────────────────────────────────────────────────────

    public boolean isRise() {
        return dailyReturnPct != null && dailyReturnPct.compareTo(BigDecimal.ZERO) >= 0;
    }

    public boolean isMonthlyRise() {
        return monthlyReturnPct != null && monthlyReturnPct.compareTo(BigDecimal.ZERO) >= 0;
    }

    public String getAvatarText() {
        if (assetName == null || assetName.isEmpty()) return "?";
        return assetName.length() >= 2 ? assetName.substring(0, 2) : assetName;
    }
}