package com.gotchabug.moneymate.investment.scheduler;

import com.gotchabug.moneymate.investment.service.StockDataService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 주가 데이터 자동 수집 스케줄러
 *
 * 매일 오전 6시에 Yahoo Finance에서 주가 및 배당 데이터를 수집한다.
 * 수집 대상 테이블: asset_price, asset_indicator
 *
 * 기존 수동 트리거 API(/api/stock/sync, /api/stock/sync-dividend)는
 * 그대로 유지되며, 본 스케줄러는 동일한 서비스 메서드를 호출한다.
 *
 * 실행 순서:
 *   1. syncAll()           → 주가 및 일간/월간 수익률 수집
 *   2. syncDividendYields() → 배당 수익률 수집 (1번 완료 후 실행 필요)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StockDataScheduler {

    private final StockDataService stockDataService;

    /**
     * 매일 오전 6시 (Asia/Seoul) 주가 + 배당 데이터 자동 수집
     *
     * cron: 초 분 시 일 월 요일
     *   "0 0 6 * * *" → 매일 06:00:00
     */
    @Scheduled(cron = "0 0 6 * * *", zone = "Asia/Seoul")
    public void collectDailyStockData() {
        log.info("[스케줄러] 주가 데이터 자동 수집 시작");

        try {
            String syncResult = stockDataService.syncAll();
            log.info("[스케줄러] 주가 동기화 완료 - {}", syncResult);

            String dividendResult = stockDataService.syncDividendYields();
            log.info("[스케줄러] 배당 동기화 완료 - {}", dividendResult);

            log.info("[스케줄러] 주가 데이터 자동 수집 종료");
        } catch (Exception e) {
            log.error("[스케줄러] 주가 데이터 자동 수집 실패: {}", e.getMessage(), e);
        }
    }
}
