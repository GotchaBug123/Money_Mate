package com.gotchabug.moneymate.market;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotchabug.moneymate.investment.dto.MarketIndexDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

/**
 * 시장 지수 카드 서비스
 *
 * StockDataService 와의 차이:
 *   StockDataService  → interval=1d&range=1mo  → DB 저장용 (배치)
 *   MarketIndexService→ interval=5m&range=1d   → 실시간 직접 조회 (DB 미사용)
 *
 * 호출 API:
 *   https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=5m&range=1d
 *
 * 파싱 항목:
 *   meta.regularMarketPrice  → 현재가
 *   meta.previousClose       → 전일 종가  → 등락률 계산
 *   meta.marketState         → REGULAR / CLOSED / PRE / POST
 *   indicators.quote[0].close → 5분봉 종가 배열 → 스파크라인
 *
 * 지수 카드 4개:
 *   코스피 추종  069500.KS  (KODEX 200)
 *   코스닥 추종  229200.KS  (KODEX 코스닥150)
 *   S&P 500    SPY
 *   달러 환율   USDKRW=X
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MarketIndexService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // 5분봉, 당일 데이터 (주식 / ETF)
    private static final String CHART_URL_STOCK =
            "https://query1.finance.yahoo.com/v8/finance/chart/%s?interval=5m&range=1d";

    // 1시간봉, 5일 데이터 (환율: 5m 요청 시 close 전부 null로 옴)
    private static final String CHART_URL_FOREX =
            "https://query1.finance.yahoo.com/v8/finance/chart/%s?interval=1h&range=5d";

    /**
     * 지수 카드 4개 한 번에 조회
     * InvestmentInfoPageController 가 아닌
     * MarketIndexController 에서만 호출됨 (JS fetch 방식)
     */
    public List<MarketIndexDto> getAllIndexes() {

        // { yahoo심볼, 카드라벨, 종목명, 통화 }
        String[][] targets = {
                {"069500.KS", "코스피 추종 (KODEX 200)",      "KODEX 200",       "KRW"},
                {"229200.KS", "코스닥 추종 (KODEX 코스닥150)", "KODEX 코스닥150",  "KRW"},
                {"SPY",       "S&P 500 추종 (SPY)",            "SPY",             "USD"},
                {"USDKRW=X",  "달러 환율 (USD/KRW)",           "USD/KRW",         "KRW"}
        };

        List<MarketIndexDto> result = new ArrayList<>();
        for (String[] t : targets) {
            result.add(fetchOne(t[0], t[1], t[2], t[3]));
            // Yahoo Finance 과다 요청 방지
            try { Thread.sleep(300); } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        return result;
    }

    /**
     * 종목 1개 조회 & 파싱
     *
     * 환율(USDKRW=X) 처리 특이사항:
     *   - interval=5m&range=1d 요청 시 close 배열이 전부 null → 스파크라인 없음
     *   - 해결: 환율은 interval=1h&range=5d 사용
     *   - 전일가 필드도 previousClose 대신 chartPreviousClose 우선 사용
     */
    private MarketIndexDto fetchOne(String yahooSymbol, String label,
                                    String name, String currency) {
        try {
            // 환율 심볼(=X 포함)은 1시간봉 5일 데이터 사용
            boolean isForex = yahooSymbol.endsWith("=X");
            String url = String.format(
                    isForex ? CHART_URL_FOREX : CHART_URL_STOCK,
                    yahooSymbol
            );
            String json = callYahoo(url);

            JsonNode root   = objectMapper.readTree(json);
            JsonNode result = root.path("chart").path("result").get(0);

            if (result == null || result.isMissingNode()) {
                log.warn("[지수카드] {} - API 응답 없음", yahooSymbol);
                return emptyDto(yahooSymbol, label, name, currency);
            }

            JsonNode meta = result.path("meta");

            // 현재가
            BigDecimal price = safeDecimal(meta.path("regularMarketPrice"));

            // 전일 종가 — 환율은 chartPreviousClose, 주식은 previousClose
            BigDecimal prevClose = safeDecimal(meta.path("chartPreviousClose"));
            if (prevClose == null) {
                prevClose = safeDecimal(meta.path("previousClose"));
            }

            // 등락률 = (현재가 - 전일종가) / 전일종가 × 100
            BigDecimal changePercent = null;
            if (price != null && prevClose != null
                    && prevClose.compareTo(BigDecimal.ZERO) != 0) {
                changePercent = price.subtract(prevClose)
                        .divide(prevClose, 6, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .setScale(2, RoundingMode.HALF_UP);
            }

            // 장 상태
            String marketState = meta.path("marketState").asText("CLOSED");

            // 스파크라인 — null 값 제거 후 최대 80포인트만 사용
            List<Double> sparkline = new ArrayList<>();
            JsonNode quoteNode = result.path("indicators").path("quote").get(0);
            if (quoteNode != null && !quoteNode.isMissingNode()) {
                JsonNode closes = quoteNode.path("close");
                if (closes != null && closes.isArray()) {
                    for (JsonNode c : closes) {
                        if (!c.isNull()) sparkline.add(c.asDouble());
                    }
                }
            }

            // 환율: 5일치 1시간봉 → 너무 많으면 마지막 80개만 사용 (캔버스 성능)
            if (isForex && sparkline.size() > 80) {
                sparkline = sparkline.subList(sparkline.size() - 80, sparkline.size());
            }

            log.debug("[지수카드] {} 스파크라인 {}개", yahooSymbol, sparkline.size());

            return MarketIndexDto.builder()
                    .yahooSymbol(yahooSymbol)
                    .label(label)
                    .name(name)
                    .currency(currency)
                    .price(price)
                    .changePercent(changePercent)
                    .marketState(marketState)
                    .sparkline(sparkline)
                    .build();

        } catch (Exception e) {
            log.error("[지수카드] {} 조회 실패: {}", yahooSymbol, e.getMessage());
            return emptyDto(yahooSymbol, label, name, currency);
        }
    }

    /**
     * Yahoo Finance HTTP 호출
     * User-Agent 없으면 403 → 브라우저 헤더 필수
     */
    private String callYahoo(String url) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
                        "AppleWebKit/537.36 (KHTML, like Gecko) " +
                        "Chrome/124.0.0.0 Safari/537.36");
        headers.set("Accept",          "application/json, text/plain, */*");
        headers.set("Accept-Language", "ko-KR,ko;q=0.9,en-US;q=0.8");
        headers.set("Referer",         "https://finance.yahoo.com/");

        ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.GET,
                new HttpEntity<>(headers),
                String.class
        );
        return response.getBody();
    }

    /** API 실패 시 빈 DTO → 화면에 "-" 표시 */
    private MarketIndexDto emptyDto(String symbol, String label,
                                    String name, String currency) {
        return MarketIndexDto.builder()
                .yahooSymbol(symbol)
                .label(label)
                .name(name)
                .currency(currency)
                .marketState("CLOSED")
                .sparkline(List.of())
                .build();
    }

    /** JsonNode → BigDecimal 안전 변환 */
    private BigDecimal safeDecimal(JsonNode node) {
        if (node == null || node.isNull() || node.isMissingNode()) return null;
        try {
            return new BigDecimal(node.asText()).setScale(2, RoundingMode.HALF_UP);
        } catch (Exception e) {
            return null;
        }
    }
}