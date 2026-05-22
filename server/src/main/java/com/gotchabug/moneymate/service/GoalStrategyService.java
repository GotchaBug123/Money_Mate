package com.gotchabug.moneymate.service;

import com.gotchabug.moneymate.dto.goal.GoalStrategyInsight;
import com.gotchabug.moneymate.dto.goal.GoalStrategyRequest;
import com.gotchabug.moneymate.dto.goal.GoalStrategyResponse;
import com.gotchabug.moneymate.dto.goal.SelectedAssetRequest;
import com.gotchabug.moneymate.entity.GoalStrategyResult;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.enums.RebalanceCycle;
import com.gotchabug.moneymate.repository.GoalStrategyResultRepository;
import com.gotchabug.moneymate.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GoalStrategyService {

    private static final int SIMULATION_COUNT = 1000;
    private static final int RECOMMENDATION_SEARCH_STEPS = 14;
    private static final double TARGET_SUCCESS_PROBABILITY = 70.0;
    private static final double GRADE_S_THRESHOLD = 90.0;
    private static final double GRADE_A_THRESHOLD = 80.0;
    private static final double GRADE_B_THRESHOLD = 70.0;
    private static final double GRADE_C_THRESHOLD = 60.0;
    private static final double STATUS_GOOD_THRESHOLD = 80.0;
    private static final double STATUS_NORMAL_THRESHOLD = 60.0;
    private static final double STATUS_WARNING_THRESHOLD = 40.0;
    private static final double IMPORTANT_PROBABILITY_DELTA = 3.0;

    private final GoalStrategyResultRepository goalStrategyResultRepository;
    private final MemberRepository memberRepository;

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

        SimulationSummary whatIfSummary = calculateWhatIfSummary(
                request,
                simulationSeed
        );

        Double whatIfProbability = whatIfSummary == null
                ? null
                : whatIfSummary.successProbability();

        Double improvement = calculateProbabilityImprovement(
                summary.successProbability(),
                whatIfProbability
        );

        Double rebalancingImprovement = calculateRebalancingImprovement(
                request,
                summary,
                simulationSeed
        );

        String strategyGrade = calculateStrategyGrade(
                summary.successProbability()
        );

        String strategyStatus = calculateStrategyStatus(
                summary.successProbability()
        );

        Long recommendedMonthlyInvestment =
                calculateRecommendedMonthlyInvestment(
                        request,
                        summary,
                        simulationSeed
                );

        String strategyComment = generateStrategyComment(
                request,
                summary,
                strategyGrade
        );

        String assetSummary = createAssetSummary(
                request.getSelectedAssets()
        );

        List<GoalStrategyInsight> insights = createInsights(
                request,
                summary,
                improvement,
                rebalancingImprovement,
                recommendedMonthlyInvestment
        );

        GoalStrategyResult savedResult = saveStrategyResult(
                member,
                request,
                summary,
                strategyGrade,
                strategyComment,
                recommendedMonthlyInvestment,
                assetSummary,
                whatIfProbability,
                improvement
        );

        return GoalStrategyResponse.builder()
                .goalStrategyResultId(savedResult.getGoalStrategyResultId())
                .goalName(request.getGoalName())
                .successProbability(summary.successProbability())
                .strategyGrade(strategyGrade)
                .strategyStatus(strategyStatus)
                .averageFinalAmount(summary.averageFinalAmount())
                .optimisticAmount(summary.optimisticAmount())
                .medianAmount(summary.medianAmount())
                .pessimisticAmount(summary.pessimisticAmount())
                .worstCaseAverageAmount(summary.worstCaseAverageAmount())
                .varAmount(summary.varAmount())
                .shortageAmount(summary.shortageAmount())
                .recommendedMonthlyInvestment(recommendedMonthlyInvestment)
                .rebalanceCycle(request.getRebalanceCycle())
                .rebalancingApplied(request.hasRebalancing())
                .rebalancingProbabilityImprovement(rebalancingImprovement)
                .selectedAssetSummary(assetSummary)
                .whatIfSuccessProbability(whatIfProbability)
                .probabilityImprovement(improvement)
                .strategyComment(strategyComment)
                .insights(insights)
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
                        new IllegalArgumentException("로그인 사용자를 찾을 수 없습니다."));
    }

    private SimulationSummary calculateWhatIfSummary(
            GoalStrategyRequest request,
            long simulationSeed
    ) {

        if (!request.hasWhatIfCondition()) {
            return null;
        }

        return runScenario(
                request,
                request.totalWhatIfMonths(),
                request.totalWhatIfMonthlyInvestment(),
                request.getRebalanceCycle(),
                simulationSeed
        );
    }

    private Double calculateRebalancingImprovement(
            GoalStrategyRequest request,
            SimulationSummary currentSummary,
            long simulationSeed
    ) {

        if (request.getSelectedAssets().size() < 2) {
            return null;
        }

        if (request.hasRebalancing()) {
            SimulationSummary noRebalanceSummary = runScenario(
                    request,
                    request.totalInvestmentMonths(),
                    request.safeMonthlyInvestment(),
                    RebalanceCycle.NONE,
                    simulationSeed
            );

            return roundOne(
                    currentSummary.successProbability()
                            - noRebalanceSummary.successProbability()
            );
        }

        SimulationSummary quarterlySummary = runScenario(
                request,
                request.totalInvestmentMonths(),
                request.safeMonthlyInvestment(),
                RebalanceCycle.QUARTERLY,
                simulationSeed
        );

        return roundOne(
                quarterlySummary.successProbability()
                        - currentSummary.successProbability()
        );
    }

    private SimulationSummary runScenario(
            GoalStrategyRequest request,
            int totalMonths,
            long monthlyInvestment,
            RebalanceCycle rebalanceCycle,
            long simulationSeed
    ) {

        Random random = new Random(simulationSeed);
        long[] finalAmounts = new long[SIMULATION_COUNT];

        for (int i = 0; i < SIMULATION_COUNT; i++) {
            finalAmounts[i] = runSingleSimulation(
                    request,
                    totalMonths,
                    monthlyInvestment,
                    rebalanceCycle,
                    random
            );
        }

        Arrays.sort(finalAmounts);

        return summarizeSimulation(finalAmounts, request);
    }

    private long runSingleSimulation(
            GoalStrategyRequest request,
            int totalMonths,
            long monthlyInvestment,
            RebalanceCycle rebalanceCycle,
            Random random
    ) {

        double[] assetAmounts = initializeAssetAmounts(request);
        RebalanceCycle activeCycle = rebalanceCycle == null
                ? RebalanceCycle.NONE
                : rebalanceCycle;

        for (int month = 1; month <= totalMonths; month++) {
            applyMonthlyInvestmentGrowth(
                    request.getSelectedAssets(),
                    assetAmounts,
                    monthlyInvestment,
                    random
            );

            if (activeCycle.shouldRebalance(month)) {
                rebalanceAssets(
                        assetAmounts,
                        request.getSelectedAssets()
                );
            }
        }

        return toFinalAmount(assetAmounts);
    }

    private double[] initializeAssetAmounts(
            GoalStrategyRequest request
    ) {

        List<SelectedAssetRequest> assets =
                request.getSelectedAssets();

        double[] assetAmounts =
                new double[assets.size()];

        for (int i = 0; i < assets.size(); i++) {
            assetAmounts[i] = assets.get(i)
                    .allocationFrom(request.safeCurrentAmount());
        }

        return assetAmounts;
    }

    private void applyMonthlyInvestmentGrowth(
            List<SelectedAssetRequest> assets,
            double[] assetAmounts,
            long monthlyInvestment,
            Random random
    ) {

        for (int i = 0; i < assets.size(); i++) {
            SelectedAssetRequest asset = assets.get(i);
            double monthlyVolatility = asset.monthlyVolatility();
            double drift = asset.monthlyExpectedReturn()
                    - 0.5 * monthlyVolatility * monthlyVolatility;
            double randomShock = random.nextGaussian();

            assetAmounts[i] = assetAmounts[i] * Math.exp(
                    drift + monthlyVolatility * randomShock
            );

            assetAmounts[i] += asset.allocationFrom(monthlyInvestment);
        }
    }

    private void rebalanceAssets(
            double[] assetAmounts,
            List<SelectedAssetRequest> assets
    ) {

        double totalAmount =
                Arrays.stream(assetAmounts).sum();

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
            GoalStrategyRequest request
    ) {

        int successCount = 0;

        for (long amount : finalAmounts) {
            if (amount >= request.getTargetAmount()) {
                successCount++;
            }
        }

        double successProbability = roundOne(
                (double) successCount / finalAmounts.length * 100.0
        );

        long averageAmount =
                Math.round(Arrays.stream(finalAmounts)
                        .average()
                        .orElse(0));

        long optimistic =
                percentile(finalAmounts, 0.90);

        long median =
                percentile(finalAmounts, 0.50);

        long pessimistic =
                percentile(finalAmounts, 0.10);

        long varAmount =
                percentile(finalAmounts, 0.05);

        long worstCaseAverageAmount =
                worstCaseAverage(finalAmounts, 0.05);

        long shortageAmount =
                Math.max(
                        0,
                        request.getTargetAmount() - median
                );

        return new SimulationSummary(
                successProbability,
                averageAmount,
                optimistic,
                median,
                pessimistic,
                varAmount,
                worstCaseAverageAmount,
                shortageAmount
        );
    }

    private long percentile(
            long[] sortedAmounts,
            double percentile
    ) {

        int index = (int) Math.round(
                (sortedAmounts.length - 1) * percentile
        );

        return sortedAmounts[clamp(
                index,
                0,
                sortedAmounts.length - 1
        )];
    }

    private long worstCaseAverage(
            long[] sortedAmounts,
            double percentile
    ) {

        int count = Math.max(
                1,
                (int) Math.ceil(sortedAmounts.length * percentile)
        );

        long sum = 0L;

        for (int i = 0; i < count; i++) {
            sum += sortedAmounts[i];
        }

        return Math.round((double) sum / count);
    }

    private Double calculateProbabilityImprovement(
            Double currentProbability,
            Double whatIfProbability
    ) {

        if (whatIfProbability == null) {
            return null;
        }

        return roundOne(whatIfProbability - currentProbability);
    }

    private String calculateStrategyGrade(
            double probability
    ) {

        if (probability >= GRADE_S_THRESHOLD) return "S";
        if (probability >= GRADE_A_THRESHOLD) return "A";
        if (probability >= GRADE_B_THRESHOLD) return "B";
        if (probability >= GRADE_C_THRESHOLD) return "C";

        return "D";
    }

    private String calculateStrategyStatus(
            double probability
    ) {

        if (probability >= STATUS_GOOD_THRESHOLD) {
            return "양호";
        }

        if (probability >= STATUS_NORMAL_THRESHOLD) {
            return "보통";
        }

        if (probability >= STATUS_WARNING_THRESHOLD) {
            return "주의";
        }

        return "위험";
    }

    private Long calculateRecommendedMonthlyInvestment(
            GoalStrategyRequest request,
            SimulationSummary summary,
            long simulationSeed
    ) {

        if (summary.successProbability() >= TARGET_SUCCESS_PROBABILITY) {
            return request.safeMonthlyInvestment();
        }

        long lowerBound = request.safeMonthlyInvestment();
        long upperBound = initialRecommendationUpperBound(
                request,
                summary
        );

        while (upperBound < request.getTargetAmount()) {
            SimulationSummary upperSummary = runScenario(
                    request,
                    request.totalInvestmentMonths(),
                    upperBound,
                    request.getRebalanceCycle(),
                    simulationSeed
            );

            if (upperSummary.successProbability()
                    >= TARGET_SUCCESS_PROBABILITY) {
                break;
            }

            upperBound = Math.min(
                    request.getTargetAmount(),
                    nextRecommendationUpperBound(
                            upperBound,
                            request.getTargetAmount()
                    )
            );
        }

        for (int i = 0; i < RECOMMENDATION_SEARCH_STEPS; i++) {
            long midPoint = lowerBound
                    + (upperBound - lowerBound) / 2;

            if (midPoint == lowerBound) {
                break;
            }

            SimulationSummary midSummary = runScenario(
                    request,
                    request.totalInvestmentMonths(),
                    midPoint,
                    request.getRebalanceCycle(),
                    simulationSeed
            );

            if (midSummary.successProbability()
                    >= TARGET_SUCCESS_PROBABILITY) {
                upperBound = midPoint;
            } else {
                lowerBound = midPoint;
            }
        }

        return Math.max(
                request.safeMonthlyInvestment(),
                upperBound
        );
    }

    private long initialRecommendationUpperBound(
            GoalStrategyRequest request,
            SimulationSummary summary
    ) {

        int totalMonths = Math.max(
                1,
                request.totalInvestmentMonths()
        );

        long contributionOnlyEstimate = request.safeMonthlyInvestment()
                + (long) Math.ceil(
                (double) summary.shortageAmount() / totalMonths
        );

        return Math.max(
                request.safeMonthlyInvestment() + 1,
                contributionOnlyEstimate
        );
    }

    private long nextRecommendationUpperBound(
            long currentUpperBound,
            long targetAmount
    ) {

        if (currentUpperBound >= targetAmount / 2) {
            return targetAmount;
        }

        return Math.max(
                currentUpperBound + 1,
                currentUpperBound * 2
        );
    }

    private String generateStrategyComment(
            GoalStrategyRequest request,
            SimulationSummary summary,
            String strategyGrade
    ) {

        if (summary.successProbability() >= STATUS_GOOD_THRESHOLD) {
            return strategyGrade + "등급 전략입니다. 현재 목표 달성 가능성이 높은 편입니다.";
        }

        if (summary.shortageAmount() > 0) {
            return strategyGrade + "등급 전략입니다. 목표 금액까지 부족 금액이 예상되므로 월 투자금을 늘리거나 자산 비중을 조정하는 것이 좋습니다.";
        }

        if (!request.hasRebalancing()
                && request.getSelectedAssets().size() > 1) {
            return strategyGrade + "등급 전략입니다. 여러 자산을 선택했기 때문에 주기적인 리밸런싱을 적용하면 전략 안정성을 높일 수 있습니다.";
        }

        return strategyGrade + "등급 전략입니다. 시장 흐름에 따라 결과가 달라질 수 있으므로 전략을 주기적으로 점검하는 것이 좋습니다.";
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

    private List<GoalStrategyInsight> createInsights(
            GoalStrategyRequest request,
            SimulationSummary summary,
            Double whatIfImprovement,
            Double rebalancingImprovement,
            Long recommendedMonthlyInvestment
    ) {

        List<GoalStrategyInsight> insights =
                new ArrayList<>();

        String strategyStatus = calculateStrategyStatus(
                summary.successProbability()
        );

        insights.add(
                GoalStrategyInsight.builder()
                        .insightType("목표달성확률")
                        .title("목표 달성 확률")
                        .value(formatPercent(summary.successProbability()))
                        .description("현재 전략이 목표 금액에 도달할 것으로 예상되는 확률입니다.")
                        .actionCode(summary.successProbability() >= TARGET_SUCCESS_PROBABILITY
                                ? "현재전략유지"
                                : "전략재검토")
                        .importance("높음")
                        .status(strategyStatus)
                        .build()
        );

        if (summary.shortageAmount() > 0) {
            insights.add(
                    GoalStrategyInsight.builder()
                            .insightType("부족금액")
                            .title("예상 부족 금액")
                            .value(formatMoney(summary.shortageAmount()))
                            .description("중앙 시나리오 기준 목표 금액보다 부족한 금액입니다.")
                            .actionCode("월투자금증액")
                            .importance("높음")
                            .status("주의")
                            .build()
            );

            insights.add(
                    GoalStrategyInsight.builder()
                            .insightType("권장월투자금")
                            .title("권장 월 투자금")
                            .value(formatMoney(recommendedMonthlyInvestment))
                            .description("목표 달성 가능성을 높이기 위해 필요한 월 투자금 추정치입니다.")
                            .actionCode("권장투자금적용")
                            .importance("보통")
                            .status("보통")
                            .build()
            );
        }

        addRebalancingInsight(
                insights,
                request,
                rebalancingImprovement
        );

        addWhatIfInsight(
                insights,
                request,
                whatIfImprovement
        );

        return insights;
    }

    private void addRebalancingInsight(
            List<GoalStrategyInsight> insights,
            GoalStrategyRequest request,
            Double rebalancingImprovement
    ) {

        if (rebalancingImprovement == null) {
            return;
        }

        boolean meaningfulDelta =
                Math.abs(rebalancingImprovement) >= IMPORTANT_PROBABILITY_DELTA;

        insights.add(
                GoalStrategyInsight.builder()
                        .insightType("리밸런싱효과")
                        .title(request.hasRebalancing()
                                ? "리밸런싱 효과"
                                : "분기 리밸런싱 비교")
                        .value(formatSignedPercent(rebalancingImprovement))
                        .description(request.hasRebalancing()
                                ? "리밸런싱을 적용하지 않았을 때와 비교한 목표 달성 확률 차이입니다."
                                : "분기별 리밸런싱을 적용했을 때 예상되는 목표 달성 확률 차이입니다.")
                        .actionCode(request.hasRebalancing()
                                ? "리밸런싱유지"
                                : "리밸런싱적용")
                        .importance(meaningfulDelta ? "보통" : "낮음")
                        .status(rebalancingImprovement >= 0
                                ? "양호"
                                : "보통")
                        .build()
        );
    }

    private void addWhatIfInsight(
            List<GoalStrategyInsight> insights,
            GoalStrategyRequest request,
            Double whatIfImprovement
    ) {

        if (whatIfImprovement == null) {
            return;
        }

        boolean improved = whatIfImprovement > 0;

        insights.add(
                GoalStrategyInsight.builder()
                        .insightType("추가투자효과")
                        .title("추가 투자 전략 효과")
                        .value(formatSignedPercent(whatIfImprovement))
                        .description(String.format(
                                Locale.US,
                                "추가 월 투자금 %s, 추가 투자 기간 %d년을 적용한 결과입니다.",
                                formatMoney(request.safeAdditionalMonthlyInvestment()),
                                request.safeAdditionalYears()
                        ))
                        .actionCode(improved
                                ? "추가투자전략적용"
                                : "추가전략재검토")
                        .importance(improved ? "보통" : "낮음")
                        .status(improved ? "양호" : "보통")
                        .build()
        );
    }

    private GoalStrategyResult saveStrategyResult(
            Member member,
            GoalStrategyRequest request,
            SimulationSummary summary,
            String strategyGrade,
            String strategyComment,
            Long recommendedMonthlyInvestment,
            String assetSummary,
            Double whatIfProbability,
            Double improvement
    ) {

        GoalStrategyResult result =
                GoalStrategyResult.builder()
                        .member(member)
                        .goalName(request.getGoalName())
                        .currentAmount(request.safeCurrentAmount())
                        .monthlyInvestment(request.safeMonthlyInvestment())
                        .targetAmount(request.getTargetAmount())
                        .investmentYears(request.getInvestmentYears())
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
                        .recommendedMonthlyInvestment(recommendedMonthlyInvestment)
                        .strategyGrade(strategyGrade)
                        .strategyComment(strategyComment)
                        .whatIfSuccessProbability(whatIfProbability)
                        .probabilityImprovement(improvement)
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
        seed = mix(seed, request.safeInvestmentYears());

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

    private String formatMoney(long amount) {
        return String.format(Locale.US, "%,d원", amount);
    }

    private String formatPercent(double value) {
        return String.format(Locale.US, "%.1f%%", value);
    }

    private String formatSignedPercent(double value) {
        return String.format(Locale.US, "%+.1f%%", value);
    }

    private double roundOne(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private int clamp(int value, int min, int max) {
        return Math.max(min, Math.min(max, value));
    }

    private record SimulationSummary(
            double successProbability,
            long averageFinalAmount,
            long optimisticAmount,
            long medianAmount,
            long pessimisticAmount,
            long varAmount,
            long worstCaseAverageAmount,
            long shortageAmount
    ) {
    }
}