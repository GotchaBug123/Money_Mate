package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.entity.RiskAnswerSheet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RiskAnswerSheetRepository extends JpaRepository<RiskAnswerSheet, Long> {
    Optional<RiskAnswerSheet> findTopByMemberOrderBySubmittedAtDesc(Member member);
}