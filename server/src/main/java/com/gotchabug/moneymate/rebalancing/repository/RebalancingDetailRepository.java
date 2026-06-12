package com.gotchabug.moneymate.rebalancing.repository;

import com.gotchabug.moneymate.rebalancing.entity.RebalancingDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RebalancingDetailRepository extends JpaRepository<RebalancingDetail, Long> {

    List<RebalancingDetail> findByHistory_RebalanceIdOrderByDetailIdAsc(Long rebalanceId);
}
