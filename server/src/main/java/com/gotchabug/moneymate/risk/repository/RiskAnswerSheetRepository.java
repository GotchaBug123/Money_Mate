package com.gotchabug.moneymate.risk.repository;

import com.gotchabug.moneymate.risk.entity.RiskAnswerSheet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RiskAnswerSheetRepository
        extends JpaRepository<RiskAnswerSheet, Long> {

    Optional<RiskAnswerSheet>
    findTopByMember_MemberIdOrderBySubmittedAtDesc(Long memberId);

}