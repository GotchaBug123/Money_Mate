package com.gotchabug.moneymate.portfolio.repository;

import com.gotchabug.moneymate.portfolio.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

    Optional<Portfolio> findFirstByMember_MemberIdAndPortfolioTypeAndPortfolioStatus(
            Long memberId,
            String portfolioType,
            String portfolioStatus
    );

    List<Portfolio> findByMember_MemberIdAndPortfolioStatusOrderByCreatedAtDesc(
            Long memberId,
            String portfolioStatus
    );

    Optional<Portfolio> findByPortfolioIdAndMember_MemberId(
            Long portfolioId,
            Long memberId
    );
}
