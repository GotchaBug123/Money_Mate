package com.gotchabug.moneymate.admin.dto;

import com.gotchabug.moneymate.market.entity.Asset;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminAssetResponse {

    private Long assetId;
    private String ticker;
    private String assetName;
    private String assetType;
    private String market;
    private String currency;
    private String sector;
    private String riskGrade;
    private String dataSource;

    public static AdminAssetResponse from(Asset asset) {
        return AdminAssetResponse.builder()
                .assetId(asset.getAssetId())
                .ticker(asset.getTicker())
                .assetName(asset.getAssetName())
                .assetType(asset.getAssetType())
                .market(asset.getMarket())
                .currency(asset.getCurrency())
                .sector(asset.getSector())
                .riskGrade(asset.getRiskGrade())
                .dataSource(asset.getDataSource())
                .build();
    }
}