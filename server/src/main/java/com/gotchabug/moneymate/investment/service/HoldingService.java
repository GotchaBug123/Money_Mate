package com.gotchabug.moneymate.investment.service;

import com.gotchabug.moneymate.auth.dto.HoldingDto;
import com.gotchabug.moneymate.investment.dto.PortfolioReturnDto;
import com.gotchabug.moneymate.investment.entity.InvestmentHolding;
import com.gotchabug.moneymate.market.entity.AssetIndicator;
import com.gotchabug.moneymate.market.entity.AssetPrice;
import com.gotchabug.moneymate.market.repository.AssetIndicatorRepository;
import com.gotchabug.moneymate.market.repository.AssetPriceRepository;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.investment.repository.InvestmentHoldingRepository;
import com.gotchabug.moneymate.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gotchabug.moneymate.investment.dto.MonthlyPortfolioDto;
import com.gotchabug.moneymate.investment.dto.PortfolioHistoryDto;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
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
    private final AssetPriceRepository assetPriceRepository;
    private final AssetIndicatorRepository assetIndicatorRepository;

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
     * 수량 직접 수정
     * holdingId + memberId 동시 검증 → 타인 데이터 수정 방지
     */
    @Transactional
    public HoldingDto updateQuantity(Long memberId, Long holdingId, int quantity) {
        InvestmentHolding holding = holdingRepository.findById(holdingId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 보유 종목입니다. holdingId=" + holdingId));
        if (!holding.getMember().getMemberId().equals(memberId)) {
            throw new IllegalArgumentException("본인의 종목만 수정할 수 있습니다.");
        }
        holding.setQuantity(quantity);
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

    /**
     * 포트폴리오 수익률 계산
     *
     * - 종합 수익률: (현재가 - 매수가) / 매수가 × 100  (buyPrice > 0 종목 기준)
     * - 월 수익률:  보유 종목별 monthlyReturnPct를 현재 평가액으로 가중 평균
     */
    @Transactional(readOnly = true)
    public PortfolioReturnDto getPortfolioReturn(Long memberId) {
        List<InvestmentHolding> holdings =
                holdingRepository.findAllByMember_MemberIdOrderByCreatedAtDesc(memberId);

        BigDecimal totalCost         = BigDecimal.ZERO;
        BigDecimal totalCurrentValue = BigDecimal.ZERO;
        BigDecimal weightedMonthly   = BigDecimal.ZERO;
        BigDecimal totalWeight       = BigDecimal.ZERO;

        for (InvestmentHolding h : holdings) {
            List<AssetPrice> prices = assetPriceRepository.findLatestByTicker(h.getTicker());
            if (prices.isEmpty()) continue;

            AssetPrice latest   = prices.get(0);
            BigDecimal curPrice = latest.getClosePrice();
            if (curPrice == null) continue;

            BigDecimal qty          = BigDecimal.valueOf(h.getQuantity());
            BigDecimal holdingValue = curPrice.multiply(qty);

            // 종합 수익률: buyPrice > 0 인 종목만
            if (h.getBuyPrice() != null && h.getBuyPrice().compareTo(BigDecimal.ZERO) > 0) {
                totalCost         = totalCost.add(h.getBuyPrice().multiply(qty));
                totalCurrentValue = totalCurrentValue.add(holdingValue);
            }

            // 월 수익률: asset_indicator 에서 monthlyReturnPct 가중 평균
            List<AssetIndicator> indicators =
                    assetIndicatorRepository.findLatestByAssetId(latest.getAsset().getAssetId());
            if (!indicators.isEmpty() && indicators.get(0).getMonthlyReturnPct() != null) {
                BigDecimal monthly = indicators.get(0).getMonthlyReturnPct();
                weightedMonthly = weightedMonthly.add(monthly.multiply(holdingValue));
                totalWeight     = totalWeight.add(holdingValue);
            }
        }

        BigDecimal totalReturnPct = null;
        if (totalCost.compareTo(BigDecimal.ZERO) > 0) {
            totalReturnPct = totalCurrentValue.subtract(totalCost)
                    .divide(totalCost, 6, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal monthlyReturnPct = null;
        if (totalWeight.compareTo(BigDecimal.ZERO) > 0) {
            monthlyReturnPct = weightedMonthly
                    .divide(totalWeight, 6, RoundingMode.HALF_UP)
                    .setScale(2, RoundingMode.HALF_UP);
        }

        return PortfolioReturnDto.builder()
                .totalReturnPct(totalReturnPct)
                .monthlyReturnPct(monthlyReturnPct)
                .totalInvestment(totalCost)
                .currentValue(totalCurrentValue)
                .build();
    }

    /**
     * 최근 6개월 포트폴리오 월별 평가액 + 수익률 계산
     *
     * - 각 월 말일 기준 closePrice × quantity 합산
     * - 월 수익률 = (이번 달 평가액 - 전달 평가액) / 전달 평가액 × 100
     */
    @Transactional(readOnly = true)
    public PortfolioHistoryDto getPortfolioHistory(Long memberId) {
        List<InvestmentHolding> holdings =
                holdingRepository.findAllByMember_MemberIdOrderByCreatedAtDesc(memberId);

        if (holdings.isEmpty()) {
            return PortfolioHistoryDto.builder().monthlyHistory(List.of()).build();
        }

        final int MONTHS = 6;
        LocalDate startDate = LocalDate.now().minusMonths(MONTHS).withDayOfMonth(1);

        // ticker → TreeMap<날짜, 종가> 사전 구성
        Map<String, TreeMap<LocalDate, BigDecimal>> priceMaps = new HashMap<>();
        for (InvestmentHolding h : holdings) {
            if (priceMaps.containsKey(h.getTicker())) continue;
            List<AssetPrice> prices =
                    assetPriceRepository.findPriceHistoryByTicker(h.getTicker(), startDate);
            TreeMap<LocalDate, BigDecimal> map = new TreeMap<>();
            for (AssetPrice p : prices) {
                if (p.getClosePrice() != null) map.put(p.getPriceDate(), p.getClosePrice());
            }
            priceMaps.put(h.getTicker(), map);
        }

        List<MonthlyPortfolioDto> history = new ArrayList<>();
        BigDecimal prevValue = null;

        YearMonth from = YearMonth.now().minusMonths(MONTHS - 1);
        YearMonth to   = YearMonth.now();

        for (YearMonth ym = from; !ym.isAfter(to); ym = ym.plusMonths(1)) {
            LocalDate monthEnd = ym.atEndOfMonth();
            BigDecimal portfolioValue = BigDecimal.ZERO;

            for (InvestmentHolding h : holdings) {
                TreeMap<LocalDate, BigDecimal> map = priceMaps.get(h.getTicker());
                if (map == null || map.isEmpty()) continue;

                // 해당 월 말일 이전 가장 최근 종가
                Map.Entry<LocalDate, BigDecimal> entry = map.floorEntry(monthEnd);
                if (entry == null) continue;

                portfolioValue = portfolioValue.add(
                        entry.getValue().multiply(BigDecimal.valueOf(h.getQuantity()))
                );
            }

            BigDecimal monthlyReturnPct = null;
            if (prevValue != null
                    && prevValue.compareTo(BigDecimal.ZERO) > 0
                    && portfolioValue.compareTo(BigDecimal.ZERO) > 0) {
                monthlyReturnPct = portfolioValue.subtract(prevValue)
                        .divide(prevValue, 6, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100"))
                        .setScale(2, RoundingMode.HALF_UP);
            }

            history.add(MonthlyPortfolioDto.builder()
                    .month(ym.toString())
                    .label(ym.getMonthValue() + "월")
                    .portfolioValue(portfolioValue)
                    .monthlyReturnPct(monthlyReturnPct)
                    .build());

            if (portfolioValue.compareTo(BigDecimal.ZERO) > 0) prevValue = portfolioValue;
        }

        return PortfolioHistoryDto.builder().monthlyHistory(history).build();
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