package com.gotchabug.moneymate.portfolio.dto;

import com.gotchabug.moneymate.portfolio.entity.PortfolioAssetTarget;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class PortfolioAssetTargetResponse {

    private Long targetId;

    private Long assetId;

    private String ticker;

    private String assetName;

    private String assetType;

    private String market;

    private BigDecimal targetWeightPct;

    private BigDecimal expectedReturnPct;

    private BigDecimal riskScore;

    public static PortfolioAssetTargetResponse from(PortfolioAssetTarget target) {
        return PortfolioAssetTargetResponse.builder()
                .targetId(target.getTargetId())
                .assetId(target.getAsset().getAssetId())
                .ticker(target.getAsset().getTicker())
                .assetName(target.getAsset().getAssetName())
                .assetType(target.getAsset().getAssetType())
                .market(target.getAsset().getMarket())
                .targetWeightPct(target.getTargetWeightPct())
                .expectedReturnPct(target.getExpectedReturnPct())
                .riskScore(target.getRiskScore())
                .build();
    }
}
