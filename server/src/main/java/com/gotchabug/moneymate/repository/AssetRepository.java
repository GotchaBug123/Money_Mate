package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * 자산(asset) 테이블 Repository
 * DB 연동 후 실제 조회에 사용
 */
public interface AssetRepository extends JpaRepository<Asset, Long> {

    // ticker로 자산 단건 조회 (예: "KOSPI", "SPY")
    Optional<Asset> findByTicker(String ticker);
    List<Asset> findBySectorContaining(String sector);

    // 시장별 자산 목록 조회
    List<Asset> findByMarket(String market);

    // 자산 유형별 목록 조회 (STOCK / ETF / INDEX)
    List<Asset> findByAssetType(String assetType);

    // ── [추가] 여러 자산 유형으로 조회 ────────────────────────
    // 사용처: syncDividendYields() → STOCK + ETF 한꺼번에 조회
    List<Asset> findAllByAssetTypeIn(List<String> assetTypes);
    // ─────────────────────────────────────────────────────────
}