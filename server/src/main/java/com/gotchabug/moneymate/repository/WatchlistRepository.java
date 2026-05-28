package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {

    List<Watchlist> findByMember_MemberId(Long memberId);
}