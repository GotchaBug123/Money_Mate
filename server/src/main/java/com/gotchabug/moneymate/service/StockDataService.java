package com.gotchabug.moneymate.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotchabug.moneymate.entity.Asset;
import com.gotchabug.moneymate.entity.AssetIndicator;
import com.gotchabug.moneymate.entity.AssetPrice;
import com.gotchabug.moneymate.repository.AssetIndicatorRepository;
import com.gotchabug.moneymate.repository.AssetPriceRepository;
import com.gotchabug.moneymate.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

/**
 * Yahoo Finance API 데이터 수집 서비스
 *
 * [리팩토링] TICKER_LIST 제거 → DB asset 테이블에서 종목 조회
 *
 * 종목 마스터 데이터: init_asset_data.sql → asset 테이블
 * 서비스 역할: DB에서 종목 읽기 → Yahoo Finance API 호출 → 결과 저장
 *
 * Yahoo Finance 티커 규칙:
 *   KOSPI 종목  → ticker + ".KS"  (005930.KS)
 *   KOSDAQ 종목 → ticker + ".KQ"  (293490.KQ)
 *   미국 종목   → ticker 그대로    (AAPL)
 *   지수/환율   → 고정 매핑        (KOSPI → ^KS11)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StockDataService {

    private final AssetRepository assetRepository;
    private final AssetPriceRepository assetPriceRepository;
    private final AssetIndicatorRepository assetIndicatorRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // Yahoo Finance API URL
    private static final String YAHOO_CHART_URL =
            "https://query1.finance.yahoo.com/v8/finance/chart/%s?interval=1d&range=1mo";

    private static final String YAHOO_SUMMARY_URL =
            "https://query1.finance.yahoo.com/v10/finance/quoteSummary/%s?modules=summaryDetail";

    /**
     * 전체 종목 데이터 동기화
     *
     * [리팩토링]
     *   기존: TICKER_LIST(Java 하드코딩 90개) 순회
     *   수정: DB asset 테이블에서 전체 조회 → 순회
     *
     * DB asset 테이블 → Yahoo Finance chart API → asset_price + asset_indicator 저장
     */
    @Transactional
    public String syncAll() {

        // ── DB에서 전체 종목 조회 ──
        List<Asset> allAssets = assetRepository.findAll();

        int success = 0;
        int fail    = 0;

        for (Asset asset : allAssets) {

            // DB ticker + market → Yahoo Finance 호출 심볼 변환
            String yahooSymbol = toYahooSymbol(asset);

            try {
                // ── Step 1. Yahoo Finance chart API 호출 ──
                String url = String.format(YAHOO_CHART_URL, yahooSymbol);

                org.springframework.http.HttpHeaders headers = createYahooHeaders();
                org.springframework.http.HttpEntity<String> entity =
                        new org.springframework.http.HttpEntity<>(headers);

                org.springframework.http.ResponseEntity<String> response =
                        restTemplate.exchange(
                                url,
                                org.springframework.http.HttpMethod.GET,
                                entity,
                                String.class
                        );

                JsonNode root   = objectMapper.readTree(response.getBody());
                JsonNode result = root.path("chart").path("result").get(0);

                if (result == null || result.isMissingNode()) {
                    log.warn("[SKIP] {} - API 응답 없음", asset.getTicker());
                    fail++;
                    continue;
                }

                JsonNode timestamps = result.path("timestamp");
                JsonNode quote      = result.path("indicators")
                        .path("quote").get(0);

                if (timestamps == null || !timestamps.isArray()
                        || timestamps.size() == 0) {
                    log.warn("[SKIP] {} - 타임스탬프 없음", asset.getTicker());
                    fail++;
                    continue;
                }

                // ── Step 2. 1개월치 날짜별 가격 저장 ──
                for (int i = 0; i < timestamps.size(); i++) {
                    long ts = timestamps.get(i).asLong();
                    LocalDate priceDate = Instant.ofEpochSecond(ts)
                            .atZone(ZoneId.of("Asia/Seoul"))
                            .toLocalDate();

                    BigDecimal open  = safeDecimal(quote.path("open").get(i));
                    BigDecimal high  = safeDecimal(quote.path("high").get(i));
                    BigDecimal low   = safeDecimal(quote.path("low").get(i));
                    BigDecimal close = safeDecimal(quote.path("close").get(i));

                    JsonNode volNode = quote.path("volume").get(i);
                    Long volume = (volNode != null && !volNode.isNull())
                            ? volNode.asLong() : 0L;

                    if (close == null) continue;

                    boolean exists = assetPriceRepository
                            .existsByAssetAssetIdAndPriceDate(
                                    asset.getAssetId(), priceDate);
                    if (exists) continue;

                    AssetPrice price = new AssetPrice();
                    price.setAsset(asset);
                    price.setPriceDate(priceDate);
                    price.setOpenPrice(open  != null ? open  : close);
                    price.setHighPrice(high  != null ? high  : close);
                    price.setLowPrice(low   != null ? low   : close);
                    price.setClosePrice(close);
                    price.setAdjClosePrice(close);
                    price.setVolume(volume);
                    assetPriceRepository.save(price);
                }

                // ── Step 3. asset_indicator 저장 (일간 + 월간 수익률) ──
                int last = timestamps.size() - 1;

                BigDecimal todayClose   = safeDecimal(quote.path("close").get(last));
                BigDecimal prevDayClose = null;
                BigDecimal firstClose   = null;

                if (last >= 1) {
                    prevDayClose = safeDecimal(quote.path("close").get(last - 1));
                }

                for (int i = 0; i <= last; i++) {
                    BigDecimal c = safeDecimal(quote.path("close").get(i));
                    if (c != null) { firstClose = c; break; }
                }

                if (todayClose != null) {
                    LocalDate latestDate = Instant
                            .ofEpochSecond(timestamps.get(last).asLong())
                            .atZone(ZoneId.of("Asia/Seoul"))
                            .toLocalDate();

                    boolean indExists = assetIndicatorRepository
                            .existsByAssetAssetIdAndBaseDate(
                                    asset.getAssetId(), latestDate);

                    if (!indExists) {
                        AssetIndicator indicator = new AssetIndicator();
                        indicator.setAsset(asset);
                        indicator.setBaseDate(latestDate);

                        // 일간 수익률 = (오늘 - 어제) / 어제 × 100
                        if (prevDayClose != null
                                && prevDayClose.compareTo(BigDecimal.ZERO) != 0) {
                            BigDecimal dailyReturn = todayClose
                                    .subtract(prevDayClose)
                                    .divide(prevDayClose, 6, RoundingMode.HALF_UP)
                                    .multiply(new BigDecimal("100"))
                                    .setScale(4, RoundingMode.HALF_UP);
                            indicator.setDailyReturnPct(dailyReturn);
                        }

                        // 월간 수익률 = (오늘 - 1개월 전 첫 종가) / 첫 종가 × 100
                        if (firstClose != null
                                && firstClose.compareTo(BigDecimal.ZERO) != 0) {
                            BigDecimal monthlyReturn = todayClose
                                    .subtract(firstClose)
                                    .divide(firstClose, 6, RoundingMode.HALF_UP)
                                    .multiply(new BigDecimal("100"))
                                    .setScale(4, RoundingMode.HALF_UP);
                            indicator.setMonthlyReturnPct(monthlyReturn);
                        }

                        assetIndicatorRepository.save(indicator);
                    }
                }

                success++;
                log.info("[OK] {} 저장 완료", asset.getTicker());

            } catch (Exception e) {
                fail++;
                log.error("[FAIL] {} 오류: {}", asset.getTicker(), e.getMessage());
            }

            // Yahoo Finance 과다 요청 방지 (1초 간격)
            try { Thread.sleep(1000); }
            catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
            }
        }

        return String.format("완료! 성공: %d건, 실패: %d건 (총 %d건)",
                success, fail, allAssets.size());
    }

    /**
     * 해외 주식 실시간 거래량 TOP 100 동기화
     * Yahoo Finance Screener API 사용
     * 동적으로 미국 주식 거래량 TOP 종목을 가져와서 DB에 저장
     */
    @Transactional
    public String syncOverseasTop100() {
        String screenerUrl =
                "https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved"
                        + "?scrIds=most_actives&count=100";

        try {
            org.springframework.http.HttpHeaders headers = createYahooHeaders();
            org.springframework.http.HttpEntity<String> entity =
                    new org.springframework.http.HttpEntity<>(headers);

            org.springframework.http.ResponseEntity<String> response =
                    restTemplate.exchange(
                            screenerUrl,
                            org.springframework.http.HttpMethod.GET,
                            entity,
                            String.class
                    );
            String json = response.getBody();
            JsonNode root   = objectMapper.readTree(json);
            JsonNode quotes = root.path("finance").path("result")
                    .get(0).path("quotes");

            if (quotes == null || !quotes.isArray()) {
                return "스크리너 응답 없음";
            }

            int success = 0;
            for (JsonNode q : quotes) {
                try {
                    String ticker    = q.path("symbol").asText();
                    String name      = q.path("longName")
                            .asText(q.path("shortName").asText(ticker));
                    String exchange  = q.path("fullExchangeName").asText("NYSE");
                    String quoteType = q.path("quoteType").asText("EQUITY");

                    BigDecimal closePrice = safeDecimal(q.path("regularMarketPrice"));
                    BigDecimal prevClose  = safeDecimal(q.path("regularMarketPreviousClose"));
                    BigDecimal openPrice  = safeDecimal(q.path("regularMarketOpen"));
                    BigDecimal highPrice  = safeDecimal(q.path("regularMarketDayHigh"));
                    BigDecimal lowPrice   = safeDecimal(q.path("regularMarketDayLow"));
                    Long volume = q.path("regularMarketVolume").asLong(0L);

                    if (closePrice == null) continue;

                    String assetType = "EQUITY".equals(quoteType) ? "STOCK" : "ETF";
                    String market    = exchange.contains("NASDAQ") ? "NASDAQ" : "NYSE";

                    Asset asset = assetRepository.findByTicker(ticker).orElse(null);
                    if (asset == null) {
                        asset = new Asset();
                        asset.setTicker(ticker);
                        asset.setAssetName(name);
                        asset.setAssetType(assetType);
                        asset.setMarket(market);
                        asset.setCurrency("USD");
                        asset.setDataSource("YAHOO_SCREENER");
                        asset = assetRepository.save(asset);
                    }

                    LocalDate today = LocalDate.now();
                    boolean priceExists = assetPriceRepository
                            .existsByAssetAssetIdAndPriceDate(asset.getAssetId(), today);
                    if (!priceExists) {
                        AssetPrice price = new AssetPrice();
                        price.setAsset(asset);
                        price.setPriceDate(today);
                        price.setOpenPrice(openPrice != null ? openPrice : closePrice);
                        price.setHighPrice(highPrice != null ? highPrice : closePrice);
                        price.setLowPrice(lowPrice  != null ? lowPrice  : closePrice);
                        price.setClosePrice(closePrice);
                        price.setAdjClosePrice(closePrice);
                        price.setVolume(volume);
                        assetPriceRepository.save(price);
                    }

                    if (prevClose != null && prevClose.compareTo(BigDecimal.ZERO) != 0) {
                        boolean indExists = assetIndicatorRepository
                                .existsByAssetAssetIdAndBaseDate(asset.getAssetId(), today);
                        if (!indExists) {
                            BigDecimal dailyReturn = closePrice
                                    .subtract(prevClose)
                                    .divide(prevClose, 6, RoundingMode.HALF_UP)
                                    .multiply(new BigDecimal("100"))
                                    .setScale(4, RoundingMode.HALF_UP);

                            AssetIndicator indicator = new AssetIndicator();
                            indicator.setAsset(asset);
                            indicator.setBaseDate(today);
                            indicator.setDailyReturnPct(dailyReturn);
                            assetIndicatorRepository.save(indicator);
                        }
                    }
                    success++;

                } catch (Exception e) {
                    log.warn("[해외 TOP] {} 저장 실패: {}",
                            q.path("symbol").asText(), e.getMessage());
                }
            }
            return "해외 TOP 동기화 완료: " + success + "개";

        } catch (Exception e) {
            log.error("해외 TOP 100 동기화 실패: {}", e.getMessage());
            return "실패: " + e.getMessage();
        }
    }

    /**
     * 배당 수익률 데이터 동기화
     *
     * [수정] v10/quoteSummary → v8/chart API로 변경
     * 이유: v10 API는 최근 Yahoo Finance 인증 강화로 차단됨
     *
     * v8/chart API 응답의 meta.trailingAnnualDividendYield 필드 사용
     * → syncAll()과 동일한 API 엔드포인트 사용 → 안정적
     *
     * 호출: GET /api/stock/sync-dividend
     */
    @Transactional
    public String syncDividendYields() {
        int success = 0;
        int skip    = 0;
        int fail    = 0;

        // DB에서 STOCK + ETF 종목만 조회 (INDEX, FOREX 제외)
        List<Asset> assets = assetRepository.findAllByAssetTypeIn(List.of("STOCK", "ETF"));

        for (Asset asset : assets) {

            String yahooSymbol = toYahooSymbol(asset);

            try {
                // ── v8/chart API 호출 (syncAll과 동일한 엔드포인트) ──
                String url = String.format(YAHOO_CHART_URL, yahooSymbol);

                org.springframework.http.HttpHeaders headers = createYahooHeaders();
                org.springframework.http.HttpEntity<String> entity =
                        new org.springframework.http.HttpEntity<>(headers);

                org.springframework.http.ResponseEntity<String> response =
                        restTemplate.exchange(
                                url,
                                org.springframework.http.HttpMethod.GET,
                                entity,
                                String.class
                        );

                JsonNode root   = objectMapper.readTree(response.getBody());
                JsonNode result = root.path("chart").path("result").get(0);

                if (result == null || result.isMissingNode()) {
                    log.warn("[배당싱크] {} - API 응답 없음", asset.getTicker());
                    fail++;
                    continue;
                }

                // ── meta 필드에서 trailingAnnualDividendYield 추출 ──
                // 소수 형태 (예: 0.032 = 3.2%) → × 100 하여 % 단위로 저장
                JsonNode meta      = result.path("meta");
                JsonNode yieldNode = meta.path("trailingAnnualDividendYield");

                BigDecimal dividendYieldPct;
                if (yieldNode.isMissingNode() || yieldNode.isNull()) {
                    // 배당 없는 종목 (성장주 등) → 0.0 저장
                    dividendYieldPct = BigDecimal.ZERO;
                } else {
                    dividendYieldPct = new BigDecimal(yieldNode.asText())
                            .multiply(new BigDecimal("100"))
                            .setScale(4, RoundingMode.HALF_UP);
                }

                // 최신 asset_indicator 레코드에 dividend_yield_pct 업데이트
                List<AssetIndicator> indicators =
                        assetIndicatorRepository.findLatestByAssetId(asset.getAssetId());

                if (indicators.isEmpty()) {
                    log.warn("[배당싱크] {} - asset_indicator 없음 (syncAll 먼저 실행 필요)",
                            asset.getTicker());
                    skip++;
                } else {
                    AssetIndicator indicator = indicators.get(0);
                    indicator.setDividendYieldPct(dividendYieldPct);
                    assetIndicatorRepository.save(indicator);
                    log.info("[배당싱크] {} → {}%", asset.getTicker(), dividendYieldPct);
                    success++;
                }

            } catch (Exception e) {
                fail++;
                log.error("[배당싱크] {} 오류: {}", asset.getTicker(), e.getMessage());
            }

            try { Thread.sleep(1000); }
            catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
            }
        }

        return String.format("[배당 수익률 동기화] 성공: %d건, 스킵: %d건, 실패: %d건",
                success, skip, fail);
    }

    // ═══════════════════════════════════════════════════════════
    // 유틸 메서드
    // ═══════════════════════════════════════════════════════════

    /**
     * DB ticker + market → Yahoo Finance API 호출 심볼 변환
     *
     * 규칙:
     *   KOSPI  종목 → ticker + ".KS"  (005930 → 005930.KS)
     *   KOSDAQ 종목 → ticker + ".KQ"  (293490 → 293490.KQ)
     *   NYSE/NASDAQ → ticker 그대로    (AAPL → AAPL)
     *   INDEX/FOREX → 거래소 지수 고정 매핑 (4개)
     */
    private String toYahooSymbol(Asset asset) {
        String ticker   = asset.getTicker();
        String market   = asset.getMarket();
        String assetType = asset.getAssetType();

        // INDEX / FOREX: 거래소 지수·환율은 Yahoo 심볼이 특수함
        if ("INDEX".equals(assetType) || "FOREX".equals(assetType)) {
            return switch (ticker) {
                case "KOSPI"   -> "^KS11";
                case "KOSDAQ"  -> "^KQ11";
                case "SPY_IDX" -> "^GSPC";
                case "USD/KRW" -> "USDKRW=X";
                default -> ticker;
            };
        }

        // STOCK / ETF: market 기반 접미사 자동 생성
        if ("KOSPI".equals(market))  return ticker + ".KS";
        if ("KOSDAQ".equals(market)) return ticker + ".KQ";
        return ticker; // NYSE, NASDAQ → 변환 없음
    }

    /**
     * Yahoo Finance API 호출에 필요한 브라우저 헤더
     * User-Agent 없으면 403 차단됨
     */
    private org.springframework.http.HttpHeaders createYahooHeaders() {
        org.springframework.http.HttpHeaders headers =
                new org.springframework.http.HttpHeaders();
        headers.set("User-Agent",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
                        "AppleWebKit/537.36 (KHTML, like Gecko) " +
                        "Chrome/120.0.0.0 Safari/537.36");
        headers.set("Accept", "application/json, text/plain, */*");
        headers.set("Accept-Language", "ko-KR,ko;q=0.9,en-US;q=0.8");
        headers.set("Referer", "https://finance.yahoo.com/");
        return headers;
    }

    /** JsonNode → BigDecimal 안전 변환 */
    private BigDecimal safeDecimal(JsonNode node) {
        if (node == null || node.isNull()) return null;
        try {
            return new BigDecimal(node.asText()).setScale(2, RoundingMode.HALF_UP);
        } catch (Exception e) {
            return null;
        }
    }
}