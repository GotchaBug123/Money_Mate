package com.gotchabug.moneymate.risk.repository;

import com.gotchabug.moneymate.risk.entity.RiskProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RiskProfileRepository extends JpaRepository<RiskProfile, Long> {

    Optional<RiskProfile> findByMember_MemberId(Long memberId);
}