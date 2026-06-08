package com.gotchabug.moneymate.portfolio.repository;

import com.gotchabug.moneymate.portfolio.entity.PortfolioAssetTarget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PortfolioAssetTargetRepository extends JpaRepository<PortfolioAssetTarget, Long> {

    @Query("""
        SELECT t
        FROM PortfolioAssetTarget t
        JOIN FETCH t.asset
        JOIN t.portfolio p
        WHERE p.member.memberId = :memberId
          AND p.portfolioType = 'CART'
          AND p.portfolioStatus = 'ACTIVE'
        ORDER BY t.createdAt DESC
    """)
    List<PortfolioAssetTarget> findCartTargetsByMemberId(@Param("memberId") Long memberId);

    Optional<PortfolioAssetTarget> findByPortfolio_PortfolioIdAndAsset_AssetId(
            Long portfolioId,
            Long assetId
    );

    List<PortfolioAssetTarget> findByPortfolio_PortfolioIdOrderByTargetIdAsc(Long portfolioId);

    void deleteByPortfolio_PortfolioId(Long portfolioId);

    @Query("""
        SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END
        FROM PortfolioAssetTarget t
        JOIN t.portfolio p
        WHERE p.member.memberId = :memberId
          AND p.portfolioType = 'CART'
          AND p.portfolioStatus = 'ACTIVE'
          AND t.asset.assetId = :assetId
    """)
    boolean existsCartTarget(
            @Param("memberId") Long memberId,
            @Param("assetId") Long assetId
    );

    @Modifying
    @Query("""
        DELETE FROM PortfolioAssetTarget t
        WHERE t.targetId = :targetId
          AND t.portfolio.portfolioId IN (
              SELECT p.portfolioId
              FROM Portfolio p
              WHERE p.member.memberId = :memberId
                AND p.portfolioType = 'CART'
                AND p.portfolioStatus = 'ACTIVE'
          )
    """)
    int deleteCartTarget(
            @Param("memberId") Long memberId,
            @Param("targetId") Long targetId
    );
}
