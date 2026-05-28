package com.gotchabug.moneymate.service;

import com.gotchabug.moneymate.entity.InvestmentHolding;
import com.gotchabug.moneymate.entity.Watchlist;
import com.gotchabug.moneymate.repository.InvestmentHoldingRepository;
import com.gotchabug.moneymate.repository.WatchlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyInvestmentService {

    private final InvestmentHoldingRepository investmentHoldingRepository;
    private final WatchlistRepository watchlistRepository;

    public List<InvestmentHolding> getMyHoldings(Long memberId) {
        return investmentHoldingRepository.findByMember_MemberId(memberId);
    }

    public List<Watchlist> getMyWatchlist(Long memberId) {
        return watchlistRepository.findByMember_MemberId(memberId);
    }
}