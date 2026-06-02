package com.gotchabug.moneymate.financial.repository;

import com.gotchabug.moneymate.financial.entity.FinancialProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FinancialProfileRepository extends JpaRepository<FinancialProfile, Long> {

    Optional<FinancialProfile> findByMember_MemberId(Long memberId);
}