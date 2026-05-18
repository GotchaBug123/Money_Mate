package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.GoalSimulationResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalSimulationResultRepository
        extends JpaRepository<GoalSimulationResult, Long> {

    // 회원별 시뮬레이션 결과 조회
    List<GoalSimulationResult>
    findByMember_MemberIdOrderByCreatedAtDesc(Long memberId);
}