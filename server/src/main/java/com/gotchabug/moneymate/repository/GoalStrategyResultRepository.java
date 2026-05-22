package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.GoalStrategyResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GoalStrategyResultRepository
        extends JpaRepository<GoalStrategyResult, Long> {

    /**
     * 회원의 목표 전략 분석 결과 전체 조회
     * 최신 생성 순 정렬
     */
    List<GoalStrategyResult>
    findByMember_MemberIdOrderByCreatedAtDesc(Long memberId);

    /**
     * 회원의 가장 최근 목표 전략 결과 조회
     */
    Optional<GoalStrategyResult>
    findFirstByMember_MemberIdOrderByCreatedAtDesc(Long memberId);
}