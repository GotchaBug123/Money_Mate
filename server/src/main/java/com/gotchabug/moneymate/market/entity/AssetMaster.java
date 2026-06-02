package com.gotchabug.moneymate.market.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(
        name = "asset_master",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_asset_master_symbol", columnNames = "symbol"),
                @UniqueConstraint(name = "uq_asset_master_yahoo_symbol", columnNames = "yahoo_symbol")
        },
        indexes = {
                @Index(name = "idx_asset_master_asset_name", columnList = "asset_name"),
                @Index(name = "idx_asset_master_market", columnList = "market"),
                @Index(name = "idx_asset_master_country", columnList = "country")
        }
)
public class AssetMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "asset_id")
    private Long assetId;

    @Column(nullable = false, length = 20)
    private String symbol;

    @Column(name = "yahoo_symbol", nullable = false, length = 30)
    private String yahooSymbol;

    @Column(name = "asset_name", nullable = false, length = 120)
    private String assetName;

    @Column(nullable = false, length = 20)
    private String market;

    @Column(name = "asset_type", nullable = false, length = 20)
    private String assetType;

    @Column(nullable = false, length = 10)
    private String country;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public void update(
            String yahooSymbol,
            String assetName,
            String market,
            String assetType,
            String country
    ) {
        this.yahooSymbol = yahooSymbol;
        this.assetName = assetName;
        this.market = market;
        this.assetType = assetType;
        this.country = country;
    }
}
