package com.gotchabug.moneymate.service;

import com.gotchabug.moneymate.dto.simulation.GoalSimulationRequest;
import com.gotchabug.moneymate.dto.simulation.GoalSimulationResponse;
import com.gotchabug.moneymate.entity.GoalSimulationResult;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.repository.GoalSimulationResultRepository;
import com.gotchabug.moneymate.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class GoalSimulationService {

    // 몬테카를로 시뮬레이션 반복 횟수
    private static final int SIMULATION_COUNT = 1000;

    private final GoalSimulationResultRepository goalSimulationResultRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public GoalSimulationResponse simulate(
            Long memberId,
            GoalSimulationRequest request
    ) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("로그인 사용자 정보를 찾을 수 없습니다."));

        Random random = new Random();
        int successCount = 0;

        long[] finalAmounts = new long[SIMULATION_COUNT];

        // 연 수익률 → 월 수익률 변환
        double monthlyReturn = request.getExpectedAnnualReturn() / 12.0;

        // 연 변동성 → 월 변동성 변환
        double monthlyVolatility = request.getAnnualVolatility() / Math.sqrt(12);

        // 총 투자 개월 수
        int totalMonths = request.getYears() * 12;

        // 몬테카를로 시뮬레이션 시작
        for (int i = 0; i < SIMULATION_COUNT; i++) {

            double asset = request.getCurrentAmount();

            for (int month = 0; month < totalMonths; month++) {

                // 정규분포 기반 랜덤값 생성
                double randomShock = random.nextGaussian();

                // 기하 브라운 운동 기반 자산 변화 공식
                asset = asset * Math.exp(
                        (monthlyReturn - 0.5 * monthlyVolatility * monthlyVolatility)
                                + monthlyVolatility * randomShock
                );

                // 월 투자금 추가
                asset += request.getMonthlyInvestment();
            }

            long finalAmount = Math.round(asset);
            finalAmounts[i] = finalAmount;

            // 목표 달성 여부 확인
            if (finalAmount >= request.getTargetAmount()) {
                successCount++;
            }
        }

        Arrays.sort(finalAmounts);

        // 목표 달성 확률 계산
        double successProbability =
                (double) successCount / SIMULATION_COUNT * 100;

        // 평균 최종 자산 계산
        long averageFinalAmount =
                (long) Arrays.stream(finalAmounts).average().orElse(0);

        // 시나리오별 자산 계산
        long pessimisticAmount = finalAmounts[(int) (SIMULATION_COUNT * 0.1)];
        long medianAmount = finalAmounts[(int) (SIMULATION_COUNT * 0.5)];
        long optimisticAmount = finalAmounts[(int) (SIMULATION_COUNT * 0.9)];

        // 하위 5% 리스크 자산
        long varAmount = finalAmounts[(int) (SIMULATION_COUNT * 0.05)];

        // 최악의 경우 평균 자산 계산
        int worstCaseCount = (int) (SIMULATION_COUNT * 0.05);
        long worstCaseAverageAmount = 0;

        for (int i = 0; i < worstCaseCount; i++) {
            worstCaseAverageAmount += finalAmounts[i];
        }

        worstCaseAverageAmount = worstCaseAverageAmount / worstCaseCount;

        // 목표 대비 부족 금액
        long shortageAmount =
                Math.max(0, request.getTargetAmount() - medianAmount);

        // What-if 시뮬레이션 결과
        double whatIfSuccessProbability = successProbability;

        if (request.getAdditionalMonthlyInvestment() != null
                || request.getAdditionalYears() != null) {

            long additionalMonthlyInvestment =
                    request.getAdditionalMonthlyInvestment() != null
                            ? request.getAdditionalMonthlyInvestment()
                            : 0L;

            int additionalYears =
                    request.getAdditionalYears() != null
                            ? request.getAdditionalYears()
                            : 0;

            int whatIfMonths = totalMonths + additionalYears * 12;
            int whatIfSuccessCount = 0;

            for (int i = 0; i < SIMULATION_COUNT; i++) {

                double asset = request.getCurrentAmount();

                for (int month = 0; month < whatIfMonths; month++) {

                    double randomShock = random.nextGaussian();

                    asset = asset * Math.exp(
                            (monthlyReturn - 0.5 * monthlyVolatility * monthlyVolatility)
                                    + monthlyVolatility * randomShock
                    );

                    asset += request.getMonthlyInvestment() + additionalMonthlyInvestment;
                }

                if (asset >= request.getTargetAmount()) {
                    whatIfSuccessCount++;
                }
            }

            whatIfSuccessProbability =
                    (double) whatIfSuccessCount / SIMULATION_COUNT * 100;
        }

        // 기존 대비 확률 증가량
        double probabilityImprovement =
                whatIfSuccessProbability - successProbability;

        // 시뮬레이션 결과 DB 저장
        GoalSimulationResult simulationResult =
                GoalSimulationResult.builder()
                        .member(member)
                        .currentAmount(request.getCurrentAmount())
                        .monthlyInvestment(request.getMonthlyInvestment())
                        .targetAmount(request.getTargetAmount())
                        .years(request.getYears())
                        .expectedAnnualReturn(request.getExpectedAnnualReturn())
                        .annualVolatility(request.getAnnualVolatility())
                        .successProbability(successProbability)
                        .averageFinalAmount(averageFinalAmount)
                        .optimisticAmount(optimisticAmount)
                        .medianAmount(medianAmount)
                        .pessimisticAmount(pessimisticAmount)
                        .worstCaseAverageAmount(worstCaseAverageAmount)
                        .varAmount(varAmount)
                        .shortageAmount(shortageAmount)
                        .whatIfSuccessProbability(whatIfSuccessProbability)
                        .probabilityImprovement(probabilityImprovement)
                        .build();

        GoalSimulationResult savedResult =
                goalSimulationResultRepository.save(simulationResult);

        return GoalSimulationResponse.builder()
                .simulationResultId(savedResult.getSimulationResultId())
                .successProbability(successProbability)
                .averageFinalAmount(averageFinalAmount)
                .optimisticAmount(optimisticAmount)
                .medianAmount(medianAmount)
                .pessimisticAmount(pessimisticAmount)
                .worstCaseAverageAmount(worstCaseAverageAmount)
                .varAmount(varAmount)
                .shortageAmount(shortageAmount)
                .whatIfSuccessProbability(whatIfSuccessProbability)
                .probabilityImprovement(probabilityImprovement)
                .build();
    }
}