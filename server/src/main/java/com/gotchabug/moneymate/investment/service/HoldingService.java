package com.gotchabug.moneymate.investment.service;

import com.gotchabug.moneymate.auth.dto.HoldingDto;
import com.gotchabug.moneymate.investment.entity.InvestmentHolding;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.investment.repository.InvestmentHoldingRepository;
import com.gotchabug.moneymate.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 투자 보유 종목(장바구니) 서비스
 * 테이블: investment_holding (PDF DB 추가 정의)
 */
@Service
@RequiredArgsConstructor
public class HoldingService {

    private final InvestmentHoldingRepository holdingRepository;
    private final MemberRepository memberRepository;

    /**
     * 회원의 보유 종목 목록 조회
     */
    @Transactional(readOnly = true)
    public List<HoldingDto> getHoldingList(Long memberId) {
        return holdingRepository
                .findAllByMember_MemberIdOrderByCreatedAtDesc(memberId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * 장바구니 담기 (투자 종목 추가)
     *
     * - ticker가 이미 있으면 수량 +1
     * - 없으면 신규 INSERT
     *
     * @param memberId  회원 ID
     * @param ticker    종목 코드 (예: 005930)
     * @param assetName 종목명 (예: 삼성전자)
     * @param market    시장 (예: KOSPI)
     * @param buyPrice  매수가
     */
    @Transactional
    public HoldingDto addHolding(Long memberId, String ticker, String assetName,
                                 String market, BigDecimal buyPrice) {
        // 이미 담긴 종목이면 수량 +1
        if (holdingRepository.existsByMember_MemberIdAndTicker(memberId, ticker)) {
            InvestmentHolding existing = holdingRepository
                    .findByMember_MemberIdAndTicker(memberId, ticker)
                    .orElseThrow();
            existing.setQuantity(existing.getQuantity() + 1);
            return toDto(holdingRepository.save(existing));
        }

        // 신규 추가
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다. memberId=" + memberId));

        InvestmentHolding holding = new InvestmentHolding();
        holding.setMember(member);
        holding.setTicker(ticker);
        holding.setAssetName(assetName);
        holding.setMarket(market);
        holding.setQuantity(1);
        holding.setBuyPrice(buyPrice != null ? buyPrice : BigDecimal.ZERO);
        holding.setBuyDate(LocalDate.now());

        return toDto(holdingRepository.save(holding));
    }

    /**
     * 보유 종목 삭제
     * holdingId + memberId 동시 검증 → 타인 데이터 삭제 방지
     */
    @Transactional
    public void removeHolding(Long memberId, Long holdingId) {
        if (!holdingRepository.existsById(holdingId)) {
            throw new IllegalArgumentException("존재하지 않는 보유 종목입니다. holdingId=" + holdingId);
        }
        holdingRepository.deleteByHoldingIdAndMember_MemberId(holdingId, memberId);
    }

    /**
     * 특정 ticker가 장바구니에 있는지 확인 (버튼 상태 초기화용)
     */
    @Transactional(readOnly = true)
    public boolean isHolding(Long memberId, String ticker) {
        return holdingRepository.existsByMember_MemberIdAndTicker(memberId, ticker);
    }

    private HoldingDto toDto(InvestmentHolding h) {
        return new HoldingDto(
                h.getHoldingId(),
                h.getTicker(),
                h.getAssetName(),
                h.getMarket(),
                h.getQuantity(),
                h.getBuyPrice(),
                h.getBuyDate(),
                h.getCreatedAt()
        );
    }
}