package com.gotchabug.moneymate.rebalancing.repository;

import com.gotchabug.moneymate.rebalancing.entity.PortfolioAssetCurrent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PortfolioAssetCurrentRepository extends JpaRepository<PortfolioAssetCurrent, Long> {

    List<PortfolioAssetCurrent> findByPortfolio_PortfolioIdOrderByCurrentIdAsc(Long portfolioId);

    Optional<PortfolioAssetCurrent> findByPortfolio_PortfolioIdAndAsset_AssetId(
            Long portfolioId,
            Long assetId
    );

    void deleteByPortfolio_PortfolioId(Long portfolioId);
}
