package com.gotchabug.moneymate.portfolio.service;

import com.gotchabug.moneymate.market.entity.Asset;
import com.gotchabug.moneymate.market.repository.AssetRepository;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.member.repository.MemberRepository;
import com.gotchabug.moneymate.portfolio.dto.*;
import com.gotchabug.moneymate.portfolio.entity.Portfolio;
import com.gotchabug.moneymate.portfolio.entity.PortfolioAssetTarget;
import com.gotchabug.moneymate.portfolio.repository.PortfolioAssetTargetRepository;
import com.gotchabug.moneymate.portfolio.repository.PortfolioRepository;
import com.gotchabug.moneymate.rebalancing.dto.RebalancingAnalysisResponse;
import com.gotchabug.moneymate.rebalancing.dto.RebalancingAssetAdjustmentResponse;
import com.gotchabug.moneymate.rebalancing.dto.RebalancingHistoryResponse;
import com.gotchabug.moneymate.rebalancing.entity.PortfolioAssetCurrent;
import com.gotchabug.moneymate.rebalancing.entity.RebalancingDetail;
import com.gotchabug.moneymate.rebalancing.entity.RebalancingHistory;
import com.gotchabug.moneymate.rebalancing.entity.RebalancingRule;
import com.gotchabug.moneymate.rebalancing.repository.PortfolioAssetCurrentRepository;
import com.gotchabug.moneymate.rebalancing.repository.RebalancingDetailRepository;
import com.gotchabug.moneymate.rebalancing.repository.RebalancingHistoryRepository;
import com.gotchabug.moneymate.rebalancing.repository.RebalancingRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PortfolioService {

    private static final BigDecimal ONE = BigDecimal.ONE;
    private static final BigDecimal HUNDRED = new BigDecimal("100");
    private static final BigDecimal ZERO = BigDecimal.ZERO;

    private final MemberRepository memberRepository;
    private final AssetRepository assetRepository;
    private final PortfolioRepository portfolioRepository;
    private final PortfolioAssetTargetRepository portfolioAssetTargetRepository;
    private final PortfolioAssetCurrentRepository portfolioAssetCurrentRepository;
    private final RebalancingRuleRepository rebalancingRuleRepository;
    private final RebalancingHistoryRepository rebalancingHistoryRepository;
    private final RebalancingDetailRepository rebalancingDetailRepository;

    @Transactional
    public PortfolioResponse createPortfolio(Long memberId, PortfolioCreateRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        Portfolio portfolio = new Portfolio();
        portfolio.setMember(member);
        portfolio.setPortfolioName(request.getPortfolioName());
        portfolio.setPortfolioType(defaultText(request.getPortfolioType(), "USER_CREATED"));
        portfolio.setTotalInvestedAmount(defaultAmount(request.getTotalInvestedAmount()));
        portfolio.setTotalEvaluationAmount(defaultAmount(request.getTotalEvaluationAmount()));
        portfolio.setExpectedReturnPct(request.getExpectedReturnPct());
        portfolio.setExpectedVolatilityPct(request.getExpectedVolatilityPct());
        portfolio.setPortfolioStatus("ACTIVE");

        Portfolio savedPortfolio = portfolioRepository.save(portfolio);

        saveTargetAssets(savedPortfolio, request.getTargetAssets());
        saveCurrentAssets(savedPortfolio, request.getCurrentAssets());
        saveRebalancingRule(savedPortfolio, request.getRebalancingRule());
        updatePortfolioTotals(savedPortfolio, request);

        return getPortfolio(memberId, savedPortfolio.getPortfolioId());
    }

    public List<PortfolioResponse> getMyPortfolios(Long memberId) {
        return portfolioRepository
                .findByMember_MemberIdAndPortfolioStatusOrderByCreatedAtDesc(memberId, "ACTIVE")
                .stream()
                .map(portfolio -> toResponse(
                        portfolio,
                        getTargetEntities(portfolio.getPortfolioId()),
                        getCurrentEntities(portfolio.getPortfolioId())
                ))
                .toList();
    }

    public PortfolioResponse getPortfolio(Long memberId, Long portfolioId) {
        Portfolio portfolio = findOwnedPortfolio(memberId, portfolioId);

        return toResponse(
                portfolio,
                getTargetEntities(portfolioId),
                getCurrentEntities(portfolioId)
        );
    }

    public List<PortfolioAssetCurrentResponse> getCurrentAssets(Long memberId, Long portfolioId) {
        findOwnedPortfolio(memberId, portfolioId);

        return getCurrentEntities(portfolioId).stream()
                .map(PortfolioAssetCurrentResponse::from)
                .toList();
    }

    public List<PortfolioAssetTargetResponse> getTargetAssets(Long memberId, Long portfolioId) {
        findOwnedPortfolio(memberId, portfolioId);

        return getTargetEntities(portfolioId).stream()
                .map(PortfolioAssetTargetResponse::from)
                .toList();
    }

    @Transactional
    public RebalancingAnalysisResponse analyzeAndSaveRebalancing(Long memberId, Long portfolioId) {
        Portfolio portfolio = findOwnedPortfolio(memberId, portfolioId);
        List<PortfolioAssetTarget> targets = getTargetEntities(portfolioId);
        List<PortfolioAssetCurrent> currents = getCurrentEntities(portfolioId);

        if (targets.isEmpty()) {
            throw new IllegalArgumentException("목표 자산 비중이 없습니다.");
        }
        if (currents.isEmpty()) {
            throw new IllegalArgumentException("현재 포트폴리오 자산이 없습니다.");
        }

        BigDecimal totalEvaluationAmount = calculateTotalEvaluationAmount(currents);
        if (totalEvaluationAmount.compareTo(ZERO) <= 0) {
            throw new IllegalArgumentException("현재 포트폴리오 평가금액이 0보다 커야 합니다.");
        }

        RebalancingRule rule = rebalancingRuleRepository
                .findByPortfolio_PortfolioIdAndActiveYn(portfolioId, "Y")
                .orElseGet(() -> createDefaultRule(portfolio));

        List<RebalancingAssetAdjustmentResponse> adjustments =
                calculateAdjustments(targets, currents, totalEvaluationAmount, rule.getDeviationThresholdPct());

        boolean rebalanceNeeded = adjustments.stream()
                .anyMatch(RebalancingAssetAdjustmentResponse::getRebalanceRequired);

        RebalancingHistory history = saveHistory(
                portfolio,
                rule,
                rebalanceNeeded,
                adjustments
        );

        saveDetails(history, adjustments);

        return RebalancingAnalysisResponse.builder()
                .rebalanceId(history.getRebalanceId())
                .portfolioId(portfolio.getPortfolioId())
                .portfolioName(portfolio.getPortfolioName())
                .totalEvaluationAmount(totalEvaluationAmount)
                .deviationThresholdPct(rule.getDeviationThresholdPct())
                .rebalanceNeeded(rebalanceNeeded)
                .summary(buildSummary(rebalanceNeeded, adjustments))
                .adjustments(adjustments)
                .build();
    }

    public List<RebalancingHistoryResponse> getRebalancingHistory(Long memberId, Long portfolioId) {
        findOwnedPortfolio(memberId, portfolioId);

        return rebalancingHistoryRepository
                .findByPortfolio_PortfolioIdOrderByRebalanceDateDesc(portfolioId)
                .stream()
                .map(history -> RebalancingHistoryResponse.from(
                        history,
                        rebalancingDetailRepository
                                .findByHistory_RebalanceIdOrderByDetailIdAsc(history.getRebalanceId())
                                .stream()
                                .map(this::toAdjustmentResponse)
                                .toList()
                ))
                .toList();
    }

    private void saveTargetAssets(
            Portfolio portfolio,
            List<PortfolioAssetTargetRequest> targetRequests
    ) {
        if (targetRequests == null || targetRequests.isEmpty()) {
            return;
        }

        targetRequests.forEach(request -> {
            Asset asset = resolveAsset(
                    request.getAssetId(),
                    request.getTicker(),
                    request.getAssetName(),
                    request.getAssetType(),
                    request.getMarket()
            );

            PortfolioAssetTarget target = new PortfolioAssetTarget();
            target.setPortfolio(portfolio);
            target.setAsset(asset);
            target.setTargetWeightPct(normalizeWeight(request.getTargetWeightPct()));
            target.setExpectedReturnPct(request.getExpectedReturnPct());
            target.setRiskScore(request.getRiskScore());

            portfolioAssetTargetRepository.save(target);
        });
    }

    private void saveCurrentAssets(
            Portfolio portfolio,
            List<PortfolioAssetCurrentRequest> currentRequests
    ) {
        if (currentRequests == null || currentRequests.isEmpty()) {
            return;
        }

        currentRequests.forEach(request -> {
            Asset asset = resolveAsset(
                    request.getAssetId(),
                    request.getTicker(),
                    request.getAssetName(),
                    request.getAssetType(),
                    request.getMarket()
            );

            PortfolioAssetCurrent current = new PortfolioAssetCurrent();
            current.setPortfolio(portfolio);
            current.setAsset(asset);
            current.setHoldingQuantity(defaultAmount(request.getHoldingQuantity()));
            current.setAverageBuyPrice(request.getAverageBuyPrice());
            current.setCurrentPrice(request.getCurrentPrice());
            current.setCurrentWeightPct(normalizeNullableWeight(request.getCurrentWeightPct()));
            current.setEvaluationAmount(resolveEvaluationAmount(request));
            current.setUnrealizedProfitLoss(calculateUnrealizedProfitLoss(request));

            portfolioAssetCurrentRepository.save(current);
        });
    }

    private void saveRebalancingRule(
            Portfolio portfolio,
            RebalancingRuleRequest request
    ) {
        RebalancingRule rule = new RebalancingRule();
        rule.setPortfolio(portfolio);

        if (request != null) {
            if (request.getDeviationThresholdPct() != null) {
                rule.setDeviationThresholdPct(normalizeWeight(request.getDeviationThresholdPct()));
            }
            if (request.getExecutionCycle() != null && !request.getExecutionCycle().isBlank()) {
                rule.setExecutionCycle(request.getExecutionCycle());
            }
            if (request.getAutoRebalanceYn() != null && !request.getAutoRebalanceYn().isBlank()) {
                rule.setAutoRebalanceYn(request.getAutoRebalanceYn());
            }
        }

        rebalancingRuleRepository.save(rule);
    }

    private void updatePortfolioTotals(
            Portfolio portfolio,
            PortfolioCreateRequest request
    ) {
        List<PortfolioAssetCurrent> currents = getCurrentEntities(portfolio.getPortfolioId());

        if (request.getTotalEvaluationAmount() == null && !currents.isEmpty()) {
            portfolio.setTotalEvaluationAmount(calculateTotalEvaluationAmount(currents));
        }

        if (request.getTotalInvestedAmount() == null && !currents.isEmpty()) {
            portfolio.setTotalInvestedAmount(calculateTotalInvestedAmount(currents));
        }
    }

    private Asset resolveAsset(
            Long assetId,
            String ticker,
            String assetName,
            String assetType,
            String market
    ) {
        if (assetId != null) {
            return assetRepository.findById(assetId)
                    .orElseThrow(() -> new IllegalArgumentException("자산을 찾을 수 없습니다."));
        }

        if (ticker == null || ticker.isBlank()) {
            throw new IllegalArgumentException("assetId 또는 ticker는 필수입니다.");
        }

        return assetRepository.findByTicker(ticker)
                .orElseGet(() -> {
                    Asset asset = new Asset();
                    asset.setTicker(ticker.trim());
                    asset.setAssetName(defaultText(assetName, ticker.trim()));
                    asset.setAssetType(defaultText(assetType, "STOCK"));
                    asset.setMarket(defaultText(market, "UNKNOWN"));
                    asset.setCurrency(resolveCurrency(market));
                    asset.setDataSource("MANUAL");
                    return assetRepository.save(asset);
                });
    }

    private Portfolio findOwnedPortfolio(Long memberId, Long portfolioId) {
        return portfolioRepository.findByPortfolioIdAndMember_MemberId(portfolioId, memberId)
                .orElseThrow(() -> new IllegalArgumentException("포트폴리오를 찾을 수 없습니다."));
    }

    private List<PortfolioAssetTarget> getTargetEntities(Long portfolioId) {
        return portfolioAssetTargetRepository.findByPortfolio_PortfolioIdOrderByTargetIdAsc(portfolioId);
    }

    private List<PortfolioAssetCurrent> getCurrentEntities(Long portfolioId) {
        return portfolioAssetCurrentRepository.findByPortfolio_PortfolioIdOrderByCurrentIdAsc(portfolioId);
    }

    private PortfolioResponse toResponse(
            Portfolio portfolio,
            List<PortfolioAssetTarget> targets,
            List<PortfolioAssetCurrent> currents
    ) {
        return PortfolioResponse.from(
                portfolio,
                targets.stream().map(PortfolioAssetTargetResponse::from).toList(),
                currents.stream().map(PortfolioAssetCurrentResponse::from).toList()
        );
    }

    private List<RebalancingAssetAdjustmentResponse> calculateAdjustments(
            List<PortfolioAssetTarget> targets,
            List<PortfolioAssetCurrent> currents,
            BigDecimal totalEvaluationAmount,
            BigDecimal thresholdPct
    ) {
        Map<Long, PortfolioAssetTarget> targetMap = new LinkedHashMap<>();
        targets.forEach(target -> targetMap.put(target.getAsset().getAssetId(), target));

        Map<Long, PortfolioAssetCurrent> currentMap = new LinkedHashMap<>();
        currents.forEach(current -> currentMap.put(current.getAsset().getAssetId(), current));

        LinkedHashSet<Long> assetIds = new LinkedHashSet<>();
        assetIds.addAll(targetMap.keySet());
        assetIds.addAll(currentMap.keySet());

        return assetIds.stream()
                .map(assetId -> toAdjustment(
                        targetMap.get(assetId),
                        currentMap.get(assetId),
                        totalEvaluationAmount,
                        thresholdPct
                ))
                .toList();
    }

    private RebalancingAssetAdjustmentResponse toAdjustment(
            PortfolioAssetTarget target,
            PortfolioAssetCurrent current,
            BigDecimal totalEvaluationAmount,
            BigDecimal thresholdPct
    ) {
        Asset asset = target != null ? target.getAsset() : current.getAsset();
        BigDecimal targetWeight = target != null
                ? defaultAmount(target.getTargetWeightPct())
                : ZERO;
        BigDecimal currentAmount = current != null
                ? calculateEvaluationAmount(current)
                : ZERO;
        BigDecimal currentWeight = current != null
                ? resolveCurrentWeight(current, totalEvaluationAmount)
                : ZERO;
        BigDecimal targetAmount = totalEvaluationAmount
                .multiply(targetWeight)
                .divide(HUNDRED, 2, RoundingMode.HALF_UP);
        BigDecimal adjustmentAmount = targetAmount.subtract(currentAmount)
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal differencePct = targetWeight.subtract(currentWeight)
                .setScale(4, RoundingMode.HALF_UP);
        boolean rebalanceRequired = differencePct.abs().compareTo(thresholdPct) >= 0;
        String actionType = resolveActionType(differencePct, thresholdPct);

        return RebalancingAssetAdjustmentResponse.builder()
                .assetId(asset.getAssetId())
                .ticker(asset.getTicker())
                .assetName(asset.getAssetName())
                .currentWeightPct(currentWeight)
                .targetWeightPct(targetWeight)
                .differencePct(differencePct)
                .currentAmount(currentAmount)
                .targetAmount(targetAmount)
                .adjustmentAmount(adjustmentAmount)
                .buyAmount(adjustmentAmount.compareTo(ZERO) > 0 ? adjustmentAmount : ZERO)
                .sellAmount(adjustmentAmount.compareTo(ZERO) < 0 ? adjustmentAmount.abs() : ZERO)
                .actionType(actionType)
                .rebalanceRequired(rebalanceRequired)
                .build();
    }

    private RebalancingHistory saveHistory(
            Portfolio portfolio,
            RebalancingRule rule,
            boolean rebalanceNeeded,
            List<RebalancingAssetAdjustmentResponse> adjustments
    ) {
        RebalancingHistory history = new RebalancingHistory();
        history.setPortfolio(portfolio);
        history.setRule(rule);
        history.setRebalanceType("ANALYSIS");
        history.setTriggerReason(buildSummary(rebalanceNeeded, adjustments));
        history.setBeforeExpectedReturnPct(portfolio.getExpectedReturnPct());
        history.setAfterExpectedReturnPct(calculateAfterExpectedReturn(portfolio.getPortfolioId()));
        history.setBeforeRiskPct(portfolio.getExpectedVolatilityPct());
        history.setAfterRiskPct(calculateAfterRiskScore(portfolio.getPortfolioId()));
        history.setStatus("COMPLETED");

        return rebalancingHistoryRepository.save(history);
    }

    private void saveDetails(
            RebalancingHistory history,
            List<RebalancingAssetAdjustmentResponse> adjustments
    ) {
        adjustments.forEach(adjustment -> {
            Asset asset = assetRepository.findById(adjustment.getAssetId())
                    .orElseThrow(() -> new IllegalArgumentException("자산을 찾을 수 없습니다."));

            RebalancingDetail detail = new RebalancingDetail();
            detail.setHistory(history);
            detail.setAsset(asset);
            detail.setBeforeWeightPct(adjustment.getCurrentWeightPct());
            detail.setTargetWeightPct(adjustment.getTargetWeightPct());
            detail.setAfterWeightPct("HOLD".equals(adjustment.getActionType())
                    ? adjustment.getCurrentWeightPct()
                    : adjustment.getTargetWeightPct());
            detail.setActionType(adjustment.getActionType());

            rebalancingDetailRepository.save(detail);
        });
    }

    private RebalancingAssetAdjustmentResponse toAdjustmentResponse(RebalancingDetail detail) {
        BigDecimal differencePct = detail.getTargetWeightPct()
                .subtract(detail.getBeforeWeightPct())
                .setScale(4, RoundingMode.HALF_UP);

        return RebalancingAssetAdjustmentResponse.builder()
                .assetId(detail.getAsset().getAssetId())
                .ticker(detail.getAsset().getTicker())
                .assetName(detail.getAsset().getAssetName())
                .currentWeightPct(detail.getBeforeWeightPct())
                .targetWeightPct(detail.getTargetWeightPct())
                .differencePct(differencePct)
                .currentAmount(null)
                .targetAmount(null)
                .adjustmentAmount(null)
                .buyAmount(null)
                .sellAmount(null)
                .actionType(detail.getActionType())
                .rebalanceRequired(!"HOLD".equals(detail.getActionType()))
                .build();
    }

    private RebalancingRule createDefaultRule(Portfolio portfolio) {
        RebalancingRule rule = new RebalancingRule();
        rule.setPortfolio(portfolio);
        return rebalancingRuleRepository.save(rule);
    }

    private BigDecimal calculateTotalEvaluationAmount(List<PortfolioAssetCurrent> currents) {
        return currents.stream()
                .map(this::calculateEvaluationAmount)
                .reduce(ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateTotalInvestedAmount(List<PortfolioAssetCurrent> currents) {
        return currents.stream()
                .map(current -> {
                    if (current.getAverageBuyPrice() == null) {
                        return ZERO;
                    }
                    return current.getAverageBuyPrice()
                            .multiply(defaultAmount(current.getHoldingQuantity()));
                })
                .reduce(ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateEvaluationAmount(PortfolioAssetCurrent current) {
        if (current.getEvaluationAmount() != null) {
            return current.getEvaluationAmount().setScale(2, RoundingMode.HALF_UP);
        }
        if (current.getCurrentPrice() == null) {
            return ZERO;
        }
        return current.getCurrentPrice()
                .multiply(defaultAmount(current.getHoldingQuantity()))
                .setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal resolveEvaluationAmount(PortfolioAssetCurrentRequest request) {
        if (request.getEvaluationAmount() != null) {
            return request.getEvaluationAmount();
        }
        if (request.getCurrentPrice() == null || request.getHoldingQuantity() == null) {
            return ZERO;
        }
        return request.getCurrentPrice()
                .multiply(request.getHoldingQuantity())
                .setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateUnrealizedProfitLoss(PortfolioAssetCurrentRequest request) {
        if (request.getAverageBuyPrice() == null || request.getCurrentPrice() == null) {
            return null;
        }
        return request.getCurrentPrice()
                .subtract(request.getAverageBuyPrice())
                .multiply(defaultAmount(request.getHoldingQuantity()))
                .setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal resolveCurrentWeight(
            PortfolioAssetCurrent current,
            BigDecimal totalEvaluationAmount
    ) {
        if (current.getCurrentWeightPct() != null) {
            return current.getCurrentWeightPct().setScale(4, RoundingMode.HALF_UP);
        }

        if (totalEvaluationAmount.compareTo(ZERO) == 0) {
            return ZERO;
        }

        return calculateEvaluationAmount(current)
                .multiply(HUNDRED)
                .divide(totalEvaluationAmount, 4, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateAfterExpectedReturn(Long portfolioId) {
        List<PortfolioAssetTarget> targets = getTargetEntities(portfolioId);

        return targets.stream()
                .filter(target -> target.getExpectedReturnPct() != null)
                .map(target -> target.getExpectedReturnPct()
                        .multiply(defaultAmount(target.getTargetWeightPct()))
                        .divide(HUNDRED, 4, RoundingMode.HALF_UP))
                .reduce(ZERO, BigDecimal::add);
    }

    private BigDecimal calculateAfterRiskScore(Long portfolioId) {
        List<PortfolioAssetTarget> targets = getTargetEntities(portfolioId);

        return targets.stream()
                .filter(target -> target.getRiskScore() != null)
                .map(target -> target.getRiskScore()
                        .multiply(defaultAmount(target.getTargetWeightPct()))
                        .divide(HUNDRED, 4, RoundingMode.HALF_UP))
                .reduce(ZERO, BigDecimal::add);
    }

    private String resolveActionType(BigDecimal differencePct, BigDecimal thresholdPct) {
        if (differencePct.abs().compareTo(thresholdPct) < 0) {
            return "HOLD";
        }
        if (differencePct.compareTo(ZERO) > 0) {
            return "BUY";
        }
        return "SELL";
    }

    private String buildSummary(
            boolean rebalanceNeeded,
            List<RebalancingAssetAdjustmentResponse> adjustments
    ) {
        long buyCount = adjustments.stream()
                .filter(adjustment -> "BUY".equals(adjustment.getActionType()))
                .count();
        long sellCount = adjustments.stream()
                .filter(adjustment -> "SELL".equals(adjustment.getActionType()))
                .count();

        if (!rebalanceNeeded) {
            return "목표 비중과 현재 비중의 차이가 허용 범위 이내입니다.";
        }

        return "리밸런싱이 필요합니다. 매수 " + buyCount + "개, 매도 " + sellCount + "개 자산 조정안이 생성되었습니다.";
    }

    private BigDecimal normalizeNullableWeight(BigDecimal weight) {
        if (weight == null) {
            return null;
        }
        return normalizeWeight(weight);
    }

    private BigDecimal normalizeWeight(BigDecimal weight) {
        if (weight == null) {
            return ZERO;
        }
        if (weight.compareTo(ONE) <= 0) {
            return weight.multiply(HUNDRED).setScale(4, RoundingMode.HALF_UP);
        }
        return weight.setScale(4, RoundingMode.HALF_UP);
    }

    private BigDecimal defaultAmount(BigDecimal value) {
        return value == null ? ZERO : value;
    }

    private String defaultText(String value, String defaultValue) {
        if (value == null || value.isBlank()) {
            return defaultValue;
        }

        return value.trim();
    }

    private String resolveCurrency(String market) {
        if (market != null && market.equalsIgnoreCase("US")) {
            return "USD";
        }
        return "KRW";
    }
}
