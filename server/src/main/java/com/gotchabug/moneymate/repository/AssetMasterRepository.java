package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.AssetMaster;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface AssetMasterRepository extends JpaRepository<AssetMaster, Long> {

    List<AssetMaster> findBySymbolIn(Collection<String> symbols);

    @Query("""
            SELECT a
            FROM AssetMaster a
            WHERE a.country = 'KR'
              AND (
                    LOWER(a.assetName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                 OR LOWER(a.symbol) LIKE LOWER(CONCAT('%', :keyword, '%'))
                 OR LOWER(a.yahooSymbol) LIKE LOWER(CONCAT('%', :keyword, '%'))
              )
            ORDER BY
              CASE
                WHEN LOWER(a.symbol) = LOWER(:keyword) THEN 0
                WHEN LOWER(a.yahooSymbol) = LOWER(:keyword) THEN 1
                WHEN a.assetName = :keyword THEN 2
                WHEN LOWER(a.symbol) LIKE LOWER(CONCAT(:keyword, '%')) THEN 3
                ELSE 4
              END,
              a.assetName ASC
            """)
    List<AssetMaster> searchKoreanAssets(
            @Param("keyword") String keyword,
            Pageable pageable
    );
}
