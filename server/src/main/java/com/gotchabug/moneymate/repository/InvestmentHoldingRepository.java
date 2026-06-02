package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.InvestmentHolding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * investment_holding 테이블 레포지토리
 */
@Repository
public interface InvestmentHoldingRepository extends JpaRepository<InvestmentHolding, Long> {

    /** 회원의 보유 종목 목록 (최신 등록순) */
    List<InvestmentHolding> findAllByMember_MemberIdOrderByCreatedAtDesc(Long memberId);

    /** ticker 중복 확인 */
    boolean existsByMember_MemberIdAndTicker(Long memberId, String ticker);

    /** 특정 회원 + ticker 단건 조회 */
    Optional<InvestmentHolding> findByMember_MemberIdAndTicker(Long memberId, String ticker);

    /** holdingId + memberId 동시 검증 삭제 */
    void deleteByHoldingIdAndMember_MemberId(Long holdingId, Long memberId);
}