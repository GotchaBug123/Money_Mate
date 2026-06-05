package com.gotchabug.moneymate.admin.dto;

import com.gotchabug.moneymate.market.entity.AssetMaster;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminAssetMasterResponse {

    private Long assetId;
    private String symbol;
    private String yahooSymbol;
    private String assetName;
    private String market;
    private String assetType;
    private String country;

    public static AdminAssetMasterResponse from(AssetMaster assetMaster) {
        return AdminAssetMasterResponse.builder()
                .assetId(assetMaster.getAssetId())
                .symbol(assetMaster.getSymbol())
                .yahooSymbol(assetMaster.getYahooSymbol())
                .assetName(assetMaster.getAssetName())
                .market(assetMaster.getMarket())
                .assetType(assetMaster.getAssetType())
                .country(assetMaster.getCountry())
                .build();
    }
}