package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.InvestmentGoal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvestmentGoalRepository extends JpaRepository<InvestmentGoal, Long> {

    List<InvestmentGoal> findByMember_MemberIdAndGoalStatusOrderByCreatedAtDesc(
            Long memberId,
            String goalStatus
    );

    Optional<InvestmentGoal> findByGoalIdAndMember_MemberIdAndGoalStatus(
            Long goalId,
            Long memberId,
            String goalStatus
    );
}
