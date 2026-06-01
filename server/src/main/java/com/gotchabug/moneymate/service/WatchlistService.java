package com.gotchabug.moneymate.service;

import com.gotchabug.moneymate.dto.WatchlistDto;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.entity.Watchlist;
import com.gotchabug.moneymate.repository.MemberRepository;
import com.gotchabug.moneymate.repository.WatchlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 관심 종목 서비스
 * 테이블: watchlist (PDF DB 추가 정의)
 */
@Service
@RequiredArgsConstructor
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final MemberRepository memberRepository;

    /**
     * 회원의 관심 종목 목록 조회
     */
    @Transactional(readOnly = true)
    public List<WatchlistDto> getWatchlist(Long memberId) {
        return watchlistRepository
                .findAllByMember_MemberIdOrderByCreatedAtDesc(memberId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * 관심 종목 토글 (☆ → ★ 추가 / ★ → ☆ 해제)
     *
     * @return true  = 등록됨
     *         false = 해제됨
     */
    @Transactional
    public boolean toggleWatchlist(Long memberId, String ticker, String assetName, String market) {
        // 이미 등록된 경우 → 삭제(해제)
        if (watchlistRepository.existsByMember_MemberIdAndTicker(memberId, ticker)) {
            Watchlist existing = watchlistRepository
                    .findByMember_MemberIdAndTicker(memberId, ticker)
                    .orElseThrow();
            watchlistRepository.delete(existing);
            return false;
        }

        // 신규 등록
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다. memberId=" + memberId));

        Watchlist item = new Watchlist();
        item.setMember(member);
        item.setTicker(ticker);
        item.setAssetName(assetName);
        item.setMarket(market);

        watchlistRepository.save(item);
        return true;
    }

    /**
     * 관심 종목 삭제
     * watchlistId + memberId 동시 검증
     */
    @Transactional
    public void removeWatchlist(Long memberId, Long watchlistId) {
        watchlistRepository.deleteByWatchlistIdAndMember_MemberId(watchlistId, memberId);
    }

    /**
     * 특정 ticker 관심 등록 여부 확인 (버튼 상태 초기화용)
     */
    @Transactional(readOnly = true)
    public boolean isWatched(Long memberId, String ticker) {
        return watchlistRepository.existsByMember_MemberIdAndTicker(memberId, ticker);
    }

    private WatchlistDto toDto(Watchlist w) {
        return new WatchlistDto(
                w.getWatchlistId(),
                w.getTicker(),
                w.getAssetName(),
                w.getMarket(),
                w.getCreatedAt()
        );
    }
}