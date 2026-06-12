package com.gotchabug.moneymate.rebalancing.repository;

import com.gotchabug.moneymate.rebalancing.entity.RebalancingRule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RebalancingRuleRepository extends JpaRepository<RebalancingRule, Long> {

    Optional<RebalancingRule> findByPortfolio_PortfolioIdAndActiveYn(
            Long portfolioId,
            String activeYn
    );
}
