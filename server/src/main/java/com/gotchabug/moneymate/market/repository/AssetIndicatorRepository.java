package com.gotchabug.moneymate.market.repository;

import com.gotchabug.moneymate.market.entity.AssetIndicator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AssetIndicatorRepository extends JpaRepository<AssetIndicator, Long> {

    // 중복 저장 방지용
    boolean existsByAssetAssetIdAndBaseDate(Long assetId, LocalDate baseDate);

    // 특정 자산 최신 지표 1건
    @Query("SELECT ai FROM AssetIndicator ai WHERE ai.asset.assetId = :assetId ORDER BY ai.baseDate DESC")
    List<AssetIndicator> findLatestByAssetId(@Param("assetId") Long assetId);
}