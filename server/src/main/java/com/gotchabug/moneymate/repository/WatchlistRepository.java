package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * watchlist 테이블 레포지토리
 */
@Repository
public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {

    /** 회원의 관심 종목 목록 (최신 등록순) */
    List<Watchlist> findAllByMember_MemberIdOrderByCreatedAtDesc(Long memberId);

    /** ticker 중복 확인 */
    boolean existsByMember_MemberIdAndTicker(Long memberId, String ticker);

    /** 특정 회원 + ticker 단건 조회 */
    Optional<Watchlist> findByMember_MemberIdAndTicker(Long memberId, String ticker);

    /** watchlistId + memberId 동시 검증 삭제 */
    void deleteByWatchlistIdAndMember_MemberId(Long watchlistId, Long memberId);
}