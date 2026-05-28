package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.InvestmentHolding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvestmentHoldingRepository extends JpaRepository<InvestmentHolding, Long> {

    List<InvestmentHolding> findByMember_MemberId(Long memberId);
}