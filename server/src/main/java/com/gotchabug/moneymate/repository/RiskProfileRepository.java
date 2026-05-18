package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.RiskProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RiskProfileRepository extends JpaRepository<RiskProfile, Long> {

    Optional<RiskProfile> findByMember_MemberId(Long memberId);
}