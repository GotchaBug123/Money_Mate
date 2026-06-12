package com.gotchabug.moneymate.portfolio.dto;

import com.gotchabug.moneymate.rebalancing.entity.PortfolioAssetCurrent;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class PortfolioAssetCurrentResponse {

    private Long currentId;

    private Long assetId;

    private String ticker;

    private String assetName;

    private String assetType;

    private String market;

    private BigDecimal holdingQuantity;

    private BigDecimal averageBuyPrice;

    private BigDecimal currentPrice;

    private BigDecimal currentWeightPct;

    private BigDecimal evaluationAmount;

    private BigDecimal unrealizedProfitLoss;

    public static PortfolioAssetCurrentResponse from(PortfolioAssetCurrent current) {
        return PortfolioAssetCurrentResponse.builder()
                .currentId(current.getCurrentId())
                .assetId(current.getAsset().getAssetId())
                .ticker(current.getAsset().getTicker())
                .assetName(current.getAsset().getAssetName())
                .assetType(current.getAsset().getAssetType())
                .market(current.getAsset().getMarket())
                .holdingQuantity(current.getHoldingQuantity())
                .averageBuyPrice(current.getAverageBuyPrice())
                .currentPrice(current.getCurrentPrice())
                .currentWeightPct(current.getCurrentWeightPct())
                .evaluationAmount(current.getEvaluationAmount())
                .unrealizedProfitLoss(current.getUnrealizedProfitLoss())
                .build();
    }
}
