package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.InvestmentStyle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvestmentStyleRepository
        extends JpaRepository<InvestmentStyle, Long> {

    Optional<InvestmentStyle> findByMember_MemberId(Long memberId);
}