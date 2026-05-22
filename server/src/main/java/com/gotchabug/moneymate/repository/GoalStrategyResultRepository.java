package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.GoalStrategyResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GoalStrategyResultRepository
        extends JpaRepository<GoalStrategyResult, Long> {

    /**
     * Finds all goal strategy results for a member, newest first.
     */
    List<GoalStrategyResult>
    findByMember_MemberIdOrderByCreatedAtDesc(Long memberId);

    /**
     * Finds the latest goal strategy result for a member.
     */
    Optional<GoalStrategyResult>
    findFirstByMember_MemberIdOrderByCreatedAtDesc(Long memberId);
}