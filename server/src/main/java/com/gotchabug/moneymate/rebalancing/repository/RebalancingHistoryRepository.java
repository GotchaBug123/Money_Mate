package com.gotchabug.moneymate.rebalancing.repository;

import com.gotchabug.moneymate.rebalancing.entity.RebalancingHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RebalancingHistoryRepository extends JpaRepository<RebalancingHistory, Long> {

    List<RebalancingHistory> findByPortfolio_PortfolioIdOrderByRebalanceDateDesc(Long portfolioId);
}
