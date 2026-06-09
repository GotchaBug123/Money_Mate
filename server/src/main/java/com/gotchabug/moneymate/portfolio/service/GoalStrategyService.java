package com.gotchabug.moneymate.portfolio.service;

import com.gotchabug.moneymate.enums.RebalanceCycle;
import com.gotchabug.moneymate.market.entity.AssetPrice;
import com.gotchabug.moneymate.market.repository.AssetPriceRepository;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.member.repository.MemberRepository;
import com.gotchabug.moneymate.portfolio.dto.GoalStrategyRequest;
import com.gotchabug.moneymate.portfolio.dto.GoalStrategyResponse;
import com.gotchabug.moneymate.portfolio.dto.SelectedAssetRequest;
import com.gotchabug.moneymate.portfolio.entity.GoalStrategyResult;
import com.gotchabug.moneymate.portfolio.repository.GoalStrategyResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GoalStrategyService {

    private static final int SIMULATION_COUNT = 1000;
    private static final int TRADING_DAYS_PER_YEAR = 252;

    private final GoalStrategyResultRepository goalStrategyResultRepository;
    private final MemberRepository memberRepository;
    private final AssetPriceRepository assetPriceRepository;

    @Transactional
    public GoalStrategyResponse analyzeGoalStrategy(
            Long memberId,
            GoalStrategyRequest request
    ) {

        Member member = findMember(memberId);
        long simulationSeed = createSimulationSeed(request);

        SimulationSummary summary = runScenario(
                request,
                request.totalInvestmentMonths(),
                request.safeMonthlyInvestment(),
                request.getRebalanceCycle(),
                simulationSeed
        );

        saveStrategyResult(
                member,
                request,
                summary,
                createAssetSummary(request.getSelectedAssets())
        );

        GoalAchievement goalAchievement = evaluateGoalAchievement(
                request,
                summary
        );

        long recommendedMonthlyInvestment =
                calculateRecommendedMonthlyInvestment(request, summary);

        return GoalStrategyResponse.builder()
                .successProbability(summary.successProbability())
                .goalAchievementStatus(goalAchievement.status())
                .goalAchievementMessage(goalAchievement.message())
                .pessimisticTargetReached(goalAchievement.pessimisticTargetReached())
                .finalAmount(summary.finalAmount())
                .averageFinalAmount(summary.averageFinalAmount())
                .optimisticAmount(summary.optimisticAmount())
                .medianAmount(summary.medianAmount())
                .pessimisticAmount(summary.pessimisticAmount())
                .shortageAmount(summary.shortageAmount())
                .recommendedMonthlyInvestment(recommendedMonthlyInvestment)
                .annualizedReturn(summary.annualizedReturn())
                .maxDrawdown(summary.maxDrawdown())
                .bestAnnualReturn(summary.bestAnnualReturn())
                .worstAnnualReturn(summary.worstAnnualReturn())
                .chartData(summary.chartData())
                .selectedAssets(createAssetSummaries(request.getSelectedAssets()))
                .build();
    }

    @Transactional
    public GoalStrategyResponse simulate(
            Long memberId,
            GoalStrategyRequest request
    ) {
        return analyzeGoalStrategy(memberId, request);
    }

    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Login user not found."));
    }

    private SimulationSummary runScenario(
            GoalStrategyRequest request,
            int totalMonths,
            long monthlyInvestment,
            RebalanceCycle rebalanceCycle,
            long simulationSeed
    ) {

        Map<String, MarketStat> marketStatMap =
                createMarketStatMap(request.getSelectedAssets());

        Random random = new Random(simulationSeed);
        long[] finalAmounts = new long[SIMULATION_COUNT];
        long[][] monthlyAmounts = new long[SIMULATION_COUNT][totalMonths + 1];
        double[] maxDrawdowns = new double[SIMULATION_COUNT];
        double[] bestAnnualReturns = new double[SIMULATION_COUNT];
        double[] worstAnnualReturns = new double[SIMULATION_COUNT];

        for (int i = 0; i < SIMULATION_COUNT; i++) {
            SingleSimulationResult result = runSingleSimulation(
                    request,
                    totalMonths,
                    monthlyInvestment,
                    rebalanceCycle,
                    random,
                    marketStatMap
            );

            finalAmounts[i] = result.finalAmount();
            monthlyAmounts[i] = result.monthlyAmounts();
            maxDrawdowns[i] = result.maxDrawdown();
            bestAnnualReturns[i] = result.bestAnnualReturn();
            worstAnnualReturns[i] = result.worstAnnualReturn();
        }

        Arrays.sort(finalAmounts);

        return summarizeSimulation(
                finalAmounts,
                request,
                monthlyAmounts,
                maxDrawdowns,
                bestAnnualReturns,
                worstAnnualReturns
        );
    }

    private SingleSimulationResult runSingleSimulation(
            GoalStrategyRequest request,
            int totalMonths,
            long monthlyInvestment,
            RebalanceCycle rebalanceCycle,
            Random random,
            Map<String, MarketStat> marketStatMap
    ) {

        double[] assetAmounts = initializeAssetAmounts(request);

        RebalanceCycle activeCycle =
                rebalanceCycle == null
                        ? RebalanceCycle.NONE
                        : rebalanceCycle;

        long[] monthlyAmounts = new long[totalMonths + 1];
        double[] indexHistory = new double[totalMonths + 1];

        double portfolioIndex = 1.0;
        double peakIndex = 1.0;
        double maxDrawdown = 0.0;
        double bestAnnualReturn = Double.NEGATIVE_INFINITY;
        double worstAnnualReturn = Double.POSITIVE_INFINITY;

        monthlyAmounts[0] = request.safeCurrentAmount();
        indexHistory[0] = portfolioIndex;

        for (int month = 1; month <= totalMonths; month++) {

            double portfolioGrowthFactor = applyMonthlyInvestmentGrowth(
                    request.getSelectedAssets(),
                    assetAmounts,
                    monthlyInvestment,
                    random,
                    marketStatMap
            );

            portfolioIndex *= portfolioGrowthFactor;
            peakIndex = Math.max(peakIndex, portfolioIndex);

            maxDrawdown = Math.min(
                    maxDrawdown,
                    (portfolioIndex / peakIndex) - 1.0
            );

            monthlyAmounts[month] = toFinalAmount(assetAmounts);
            indexHistory[month] = portfolioIndex;

            if (month >= 12) {
                double annualReturn =
                        (portfolioIndex / indexHistory[month - 12]) - 1.0;

                bestAnnualReturn = Math.max(bestAnnualReturn, annualReturn);
                worstAnnualReturn = Math.min(worstAnnualReturn, annualReturn);
            }

            if (activeCycle.shouldRebalance(month)) {
                rebalanceAssets(
                        assetAmounts,
                        request.getSelectedAssets()
                );
            }
        }

        if (bestAnnualReturn == Double.NEGATIVE_INFINITY) {
            double totalReturn = portfolioIndex - 1.0;
            bestAnnualReturn = totalReturn;
            worstAnnualReturn = totalReturn;
        }

        return new SingleSimulationResult(
                toFinalAmount(assetAmounts),
                monthlyAmounts,
                maxDrawdown,
                bestAnnualReturn,
                worstAnnualReturn
        );
    }

    private double[] initializeAssetAmounts(
            GoalStrategyRequest request
    ) {

        List<SelectedAssetRequest> assets = request.getSelectedAssets();
        double[] assetAmounts = new double[assets.size()];

        for (int i = 0; i < assets.size(); i++) {
            assetAmounts[i] =
                    assets.get(i).allocationFrom(request.safeCurrentAmount());
        }

        return assetAmounts;
    }

    private double applyMonthlyInvestmentGrowth(
            List<SelectedAssetRequest> assets,
            double[] assetAmounts,
            long monthlyInvestment,
            Random random,
            Map<String, MarketStat> marketStatMap
    ) {

        double totalBeforeGrowth = Arrays.stream(assetAmounts).sum();

        double portfolioGrowthFactor =
                totalBeforeGrowth > 0 ? 0.0 : 1.0;

        for (int i = 0; i < assets.size(); i++) {

            SelectedAssetRequest asset = assets.get(i);

            MarketStat stat =
                    marketStatMap.getOrDefault(
                            normalizeTicker(asset.getSymbol()),
                            new MarketStat(
                                    asset.getExpectedAnnualReturn(),
                                    asset.getAnnualVolatility()
                            )
                    );

            double monthlyExpectedReturn =
                    Math.pow(
                            1.0 + stat.expectedAnnualReturn(),
                            1.0 / 12.0
                    ) - 1.0;

            double monthlyVolatility =
                    stat.annualVolatility() / Math.sqrt(12.0);

            double drift =
                    monthlyExpectedReturn
                            - 0.5 * monthlyVolatility * monthlyVolatility;

            double randomShock =
                    random.nextGaussian();

            double growthFactor =
                    Math.exp(
                            drift + monthlyVolatility * randomShock
                    );

            if (totalBeforeGrowth > 0) {
                double assetWeight =
                        assetAmounts[i] / totalBeforeGrowth;

                portfolioGrowthFactor +=
                        assetWeight * growthFactor;
            }

            assetAmounts[i] =
                    assetAmounts[i] * growthFactor;

            assetAmounts[i] +=
                    asset.allocationFrom(monthlyInvestment);
        }

        return portfolioGrowthFactor;
    }

    private Map<String, MarketStat> createMarketStatMap(
            List<SelectedAssetRequest> assets
    ) {

        Map<String, MarketStat> statMap = new HashMap<>();

        for (SelectedAssetRequest asset : assets) {
            String ticker = normalizeTicker(asset.getSymbol());

            if (!statMap.containsKey(ticker)) {
                statMap.put(ticker, calculateMarketStat(asset));
            }
        }

        return statMap;
    }

    private MarketStat calculateMarketStat(
            SelectedAssetRequest asset
    ) {

        String ticker = normalizeTicker(asset.getSymbol());

        LocalDate startDate =
                LocalDate.now().minusYears(5);

        List<AssetPrice> prices =
                assetPriceRepository.findPriceHistoryByTicker(
                        ticker,
                        startDate
                );

        if (prices == null || prices.size() < 30) {
            return new MarketStat(
                    asset.getExpectedAnnualReturn(),
                    asset.getAnnualVolatility()
            );
        }

        List<Double> dailyReturns = new ArrayList<>();

        for (int i = 1; i < prices.size(); i++) {

            double prev =
                    prices.get(i - 1)
                            .getClosePrice()
                            .doubleValue();

            double curr =
                    prices.get(i)
                            .getClosePrice()
                            .doubleValue();

            if (prev > 0 && curr > 0) {
                dailyReturns.add((curr - prev) / prev);
            }
        }

        if (dailyReturns.isEmpty()) {
            return new MarketStat(
                    asset.getExpectedAnnualReturn(),
                    asset.getAnnualVolatility()
            );
        }

        AssetPrice firstPrice = prices.get(0);
        AssetPrice lastPrice = prices.get(prices.size() - 1);

        double firstClose =
                firstPrice.getClosePrice().doubleValue();

        double lastClose =
                lastPrice.getClosePrice().doubleValue();

        if (firstClose <= 0 || lastClose <= 0) {
            return new MarketStat(
                    asset.getExpectedAnnualReturn(),
                    asset.getAnnualVolatility()
            );
        }

        long days =
                Math.max(
                        1,
                        ChronoUnit.DAYS.between(
                                firstPrice.getPriceDate(),
                                lastPrice.getPriceDate()
                        )
                );

        double years =
                Math.max(1.0 / 365.0, days / 365.0);

        double annualReturn =
                Math.pow(lastClose / firstClose, 1.0 / years) - 1.0;

        double avgDailyReturn =
                dailyReturns.stream()
                        .mapToDouble(Double::doubleValue)
                        .average()
                        .orElse(0.0);

        double variance =
                dailyReturns.stream()
                        .mapToDouble(r ->
                                Math.pow(r - avgDailyReturn, 2)
                        )
                        .average()
                        .orElse(0.0);

        double dailyVolatility =
                Math.sqrt(variance);

        double annualVolatility =
                dailyVolatility * Math.sqrt(TRADING_DAYS_PER_YEAR);

        annualReturn = clampDouble(annualReturn, -0.80, 1.00);
        annualVolatility = clampDouble(annualVolatility, 0.01, 1.20);

        return new MarketStat(
                annualReturn,
                annualVolatility
        );
    }

    private String normalizeTicker(String symbol) {

        if (symbol == null) {
            return "";
        }

        String ticker = symbol.trim().toUpperCase(Locale.ROOT);

        if (ticker.endsWith(".KS") || ticker.endsWith(".KQ")) {
            return ticker.substring(0, ticker.length() - 3);
        }

        return ticker;
    }

    private void rebalanceAssets(
            double[] assetAmounts,
            List<SelectedAssetRequest> assets
    ) {

        double totalAmount = Arrays.stream(assetAmounts).sum();

        for (int i = 0; i < assets.size(); i++) {
            assetAmounts[i] =
                    assets.get(i).allocationFrom(totalAmount);
        }
    }

    private long toFinalAmount(double[] assetAmounts) {
        double totalAmount = Arrays.stream(assetAmounts).sum();

        if (Double.isNaN(totalAmount) || totalAmount <= 0) {
            return 0L;
        }

        if (totalAmount >= Long.MAX_VALUE) {
            return Long.MAX_VALUE;
        }

        return Math.round(totalAmount);
    }

    private SimulationSummary summarizeSimulation(
            long[] finalAmounts,
            GoalStrategyRequest request,
            long[][] monthlyAmounts,
            double[] maxDrawdowns,
            double[] bestAnnualReturns,
            double[] worstAnnualReturns
    ) {

        int successCount = 0;

        for (long amount : finalAmounts) {
            if (amount >= request.getTargetAmount()) {
                successCount++;
            }
        }

        double successProbability =
                roundOne((double) successCount / finalAmounts.length * 100.0);

        long averageAmount =
                Math.round(
                        Arrays.stream(finalAmounts)
                                .average()
                                .orElse(0)
                );

        long optimistic = percentile(finalAmounts, 0.90);
        long median = percentile(finalAmounts, 0.50);
        long pessimistic = percentile(finalAmounts, 0.10);
        long varAmount = percentile(finalAmounts, 0.05);
        long worstCaseAverageAmount = worstCaseAverage(finalAmounts, 0.05);

        long shortageAmount =
                Math.max(0, request.getTargetAmount() - median);

        return new SimulationSummary(
                successProbability,
                averageAmount,
                median,
                optimistic,
                median,
                pessimistic,
                calculateAnnualizedReturn(request, median),
                summarizeMetricAsPercent(maxDrawdowns),
                summarizeMetricAsPercent(bestAnnualReturns),
                summarizeMetricAsPercent(worstAnnualReturns),
                varAmount,
                worstCaseAverageAmount,
                shortageAmount,
                createChartData(monthlyAmounts, request.getTargetAmount())
        );
    }

    private Double calculateAnnualizedReturn(
            GoalStrategyRequest request,
            long finalAmount
    ) {

        long totalContribution = request.estimatedTotalContribution();

        if (totalContribution <= 0) {
            return 0.0;
        }

        double cumulativeReturn =
                ((double) finalAmount - totalContribution)
                        / totalContribution;

        if (cumulativeReturn <= -1.0) {
            return -100.0;
        }

        double annualizedReturn =
                Math.pow(
                        1.0 + cumulativeReturn,
                        1.0 / Math.max(
                                1.0 / 12.0,
                                request.totalInvestmentMonths() / 12.0
                        )
                ) - 1.0;

        return roundOne(annualizedReturn * 100.0);
    }

    private Double summarizeMetricAsPercent(
            double[] values
    ) {

        if (values == null || values.length == 0) {
            return null;
        }

        double[] sortedValues =
                Arrays.copyOf(values, values.length);

        Arrays.sort(sortedValues);

        return roundOne(percentile(sortedValues, 0.50) * 100.0);
    }

    private List<GoalStrategyResponse.ChartPoint> createChartData(
            long[][] monthlyAmounts,
            long targetAmount
    ) {

        if (monthlyAmounts == null || monthlyAmounts.length == 0) {
            return List.of();
        }

        int totalMonths = monthlyAmounts[0].length - 1;
        int intervalMonths = chartIntervalMonths(totalMonths);

        List<GoalStrategyResponse.ChartPoint> chartData = new ArrayList<>();

        for (int month = 0; month <= totalMonths; month++) {
            if (month != 0
                    && month != totalMonths
                    && month % intervalMonths != 0) {
                continue;
            }

            long[] amountsAtMonth =
                    new long[monthlyAmounts.length];

            for (int i = 0; i < monthlyAmounts.length; i++) {
                amountsAtMonth[i] =
                        monthlyAmounts[i][month];
            }

            Arrays.sort(amountsAtMonth);

            chartData.add(
                    GoalStrategyResponse.ChartPoint.builder()
                            .month(month)
                            .optimisticAmount(percentile(amountsAtMonth, 0.90))
                            .medianAmount(percentile(amountsAtMonth, 0.50))
                            .pessimisticAmount(percentile(amountsAtMonth, 0.10))
                            .targetAmount(targetAmount)
                            .build()
            );
        }

        return chartData;
    }

    private int chartIntervalMonths(int totalMonths) {
        if (totalMonths <= 60) {
            return 1;
        }

        if (totalMonths <= 180) {
            return 3;
        }

        return 12;
    }

    private long percentile(
            long[] sortedAmounts,
            double percentile
    ) {

        int index =
                (int) Math.round(
                        (sortedAmounts.length - 1) * percentile
                );

        return sortedAmounts[
                clamp(index, 0, sortedAmounts.length - 1)
                ];
    }

    private double percentile(
            double[] sortedValues,
            double percentile
    ) {

        int index =
                (int) Math.round(
                        (sortedValues.length - 1) * percentile
                );

        return sortedValues[
                clamp(index, 0, sortedValues.length - 1)
                ];
    }

    private long worstCaseAverage(
            long[] sortedAmounts,
            double percentile
    ) {

        int count =
                Math.max(
                        1,
                        (int) Math.ceil(sortedAmounts.length * percentile)
                );

        long sum = 0L;

        for (int i = 0; i < count; i++) {
            sum += sortedAmounts[i];
        }

        return Math.round((double) sum / count);
    }

    private String createAssetSummary(
            List<SelectedAssetRequest> assets
    ) {

        return assets.stream()
                .map(asset -> String.format(
                        Locale.US,
                        "%s %.1f%%",
                        asset.displayName(),
                        asset.targetWeightPercent()
                ))
                .reduce((a, b) -> a + ", " + b)
                .orElse("");
    }

    private List<GoalStrategyResponse.AssetSummary> createAssetSummaries(
            List<SelectedAssetRequest> assets
    ) {

        return assets.stream()
                .map(asset -> GoalStrategyResponse.AssetSummary.builder()
                        .symbol(asset.getSymbol())
                        .assetName(asset.getAssetName())
                        .assetType(asset.getAssetType())
                        .market(asset.getMarket())
                        .targetWeight(asset.getTargetWeight())
                        .theme(asset.getTheme())
                        .build())
                .toList();
    }

    private GoalAchievement evaluateGoalAchievement(
            GoalStrategyRequest request,
            SimulationSummary summary
    ) {

        long targetAmount = request.getTargetAmount();

        if (summary.pessimisticAmount() >= targetAmount) {
            return new GoalAchievement(
                    "목표 달성 안정권",
                    "비관 시나리오에서도 목표 금액을 초과하여 목표 달성 안정권입니다.",
                    true
            );
        }

        if (summary.medianAmount() >= targetAmount) {
            return new GoalAchievement(
                    "목표 달성 가능성 있음",
                    "중앙 시나리오에서는 목표를 달성하지만, 비관 시나리오에서는 목표 금액에 미달할 수 있습니다.",
                    false
            );
        }

        if (summary.averageFinalAmount() >= targetAmount) {
            return new GoalAchievement(
                    "평균 기준 목표 근접",
                    "평균 결과는 목표에 근접하지만 중앙 시나리오 기준으로는 추가 투자가 필요합니다.",
                    false
            );
        }

        return new GoalAchievement(
                "목표 달성 가능성 낮음",
                "현재 조건에서는 목표 달성 가능성이 낮아 월 투자금 또는 투자 기간 조정이 필요합니다.",
                false
        );
    }

    private long calculateRecommendedMonthlyInvestment(
            GoalStrategyRequest request,
            SimulationSummary summary
    ) {

        if (summary.pessimisticAmount() >= request.getTargetAmount()) {
            return request.safeMonthlyInvestment();
        }

        int totalMonths =
                Math.max(1, request.totalInvestmentMonths());

        long conservativeShortage =
                Math.max(
                        0L,
                        request.getTargetAmount() - summary.pessimisticAmount()
                );

        return request.safeMonthlyInvestment()
                + (long) Math.ceil((double) conservativeShortage / totalMonths);
    }

    private GoalStrategyResult saveStrategyResult(
            Member member,
            GoalStrategyRequest request,
            SimulationSummary summary,
            String assetSummary
    ) {

        GoalStrategyResult result =
                GoalStrategyResult.builder()
                        .member(member)
                        .goalName(request.safeGoalName())
                        .currentAmount(request.safeCurrentAmount())
                        .monthlyInvestment(request.safeMonthlyInvestment())
                        .targetAmount(request.getTargetAmount())
                        .investmentYears(request.storageInvestmentYears())
                        .rebalanceCycle(request.getRebalanceCycle())
                        .selectedAssetSummary(assetSummary)
                        .successProbability(summary.successProbability())
                        .averageFinalAmount(summary.averageFinalAmount())
                        .optimisticAmount(summary.optimisticAmount())
                        .medianAmount(summary.medianAmount())
                        .pessimisticAmount(summary.pessimisticAmount())
                        .varAmount(summary.varAmount())
                        .worstCaseAverageAmount(summary.worstCaseAverageAmount())
                        .shortageAmount(summary.shortageAmount())
                        .build();

        return goalStrategyResultRepository.save(result);
    }

    private long createSimulationSeed(
            GoalStrategyRequest request
    ) {

        long seed = 1469598103934665603L;

        seed = mix(seed, request.safeCurrentAmount());
        seed = mix(seed, request.safeMonthlyInvestment());
        seed = mix(seed, request.getTargetAmount());
        seed = mix(seed, request.totalInvestmentMonths());

        if (request.getRebalanceCycle() != null) {
            seed = mix(seed, safeHash(request.getRebalanceCycle().name()));
        }

        for (SelectedAssetRequest asset : request.getSelectedAssets()) {
            seed = mix(seed, safeHash(asset.getSymbol()));
            seed = mix(seed, safeHash(asset.getAssetName()));
            seed = mix(seed, Double.doubleToLongBits(asset.getTargetWeight()));
            seed = mix(seed, Double.doubleToLongBits(asset.getExpectedAnnualReturn()));
            seed = mix(seed, Double.doubleToLongBits(asset.getAnnualVolatility()));
        }

        return seed;
    }

    private long mix(long seed, long value) {
        return (seed ^ value) * 1099511628211L;
    }

    private int safeHash(String value) {
        return value == null ? 0 : value.hashCode();
    }

    private double roundOne(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private int clamp(int value, int min, int max) {
        return Math.max(min, Math.min(max, value));
    }

    private double clampDouble(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }

    private record SimulationSummary(
            double successProbability,
            long averageFinalAmount,
            long finalAmount,
            long optimisticAmount,
            long medianAmount,
            long pessimisticAmount,
            Double annualizedReturn,
            Double maxDrawdown,
            Double bestAnnualReturn,
            Double worstAnnualReturn,
            long varAmount,
            long worstCaseAverageAmount,
            long shortageAmount,
            List<GoalStrategyResponse.ChartPoint> chartData
    ) {
    }

    private record SingleSimulationResult(
            long finalAmount,
            long[] monthlyAmounts,
            double maxDrawdown,
            double bestAnnualReturn,
            double worstAnnualReturn
    ) {
    }

    private record MarketStat(
            double expectedAnnualReturn,
            double annualVolatility
    ) {
    }

    private record GoalAchievement(
            String status,
            String message,
            boolean pessimisticTargetReached
    ) {
    }
}