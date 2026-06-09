package com.gotchabug.moneymate.market.repository;

import com.gotchabug.moneymate.market.entity.AssetPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AssetPriceRepository extends JpaRepository<AssetPrice, Long> {

    boolean existsByAssetAssetIdAndPriceDate(Long assetId, LocalDate priceDate);

    @Query("SELECT ap FROM AssetPrice ap WHERE ap.asset.assetId = :assetId ORDER BY ap.priceDate DESC")
    List<AssetPrice> findLatestByAssetId(@Param("assetId") Long assetId);

    /** 전체 가격 데이터 중 가장 최근 거래일 (데이터 최신 여부 판단용) */
    @Query("SELECT MAX(ap.priceDate) FROM AssetPrice ap")
    LocalDate findMaxPriceDate();

    @Query(value = """
    SELECT ap.*
    FROM asset_price ap
    INNER JOIN asset a ON ap.asset_id = a.asset_id
    INNER JOIN (
        SELECT asset_id, MAX(price_date) AS max_date
        FROM asset_price GROUP BY asset_id
    ) latest ON ap.asset_id = latest.asset_id
            AND ap.price_date = latest.max_date
    WHERE a.asset_type IN ('STOCK', 'ETF')
    ORDER BY (ap.close_price * ap.volume) DESC
    LIMIT 100
    """, nativeQuery = true)
    List<AssetPrice> findAllTop100();

    @Query(value = """
    SELECT ap.*
    FROM asset_price ap
    INNER JOIN asset a ON ap.asset_id = a.asset_id
    INNER JOIN (
        SELECT asset_id, MAX(price_date) AS max_date
        FROM asset_price GROUP BY asset_id
    ) latest ON ap.asset_id = latest.asset_id
            AND ap.price_date = latest.max_date
    WHERE a.market IN ('KOSPI', 'KOSDAQ')
      AND a.asset_type = 'STOCK'
    ORDER BY (ap.close_price * ap.volume) DESC
    LIMIT 100
    """, nativeQuery = true)
    List<AssetPrice> findKoreanStocksTop100();

    @Query(value = """
    SELECT ap.*
    FROM asset_price ap
    INNER JOIN asset a ON ap.asset_id = a.asset_id
    INNER JOIN (
        SELECT asset_id, MAX(price_date) AS max_date
        FROM asset_price GROUP BY asset_id
    ) latest ON ap.asset_id = latest.asset_id
            AND ap.price_date = latest.max_date
    WHERE a.market IN ('NYSE', 'NASDAQ')
      AND a.asset_type = 'STOCK'
    ORDER BY (ap.close_price * ap.volume) DESC
    LIMIT 100
    """, nativeQuery = true)
    List<AssetPrice> findOverseasStocksTop100();

    @Query(value = """
    SELECT ap.*
    FROM asset_price ap
    INNER JOIN asset a ON ap.asset_id = a.asset_id
    INNER JOIN (
        SELECT asset_id, MAX(price_date) AS max_date
        FROM asset_price GROUP BY asset_id
    ) latest ON ap.asset_id = latest.asset_id
            AND ap.price_date = latest.max_date
    WHERE a.asset_type = 'ETF'
    ORDER BY (ap.close_price * ap.volume) DESC
    LIMIT 100
    """, nativeQuery = true)
    List<AssetPrice> findEtfTop100();

    // ===== 배당금이 포함된 주식 =====
    // 대상: dividend_yield_pct > 0 (배당 지급 종목) AND < 10 (비정상 제외)
    // 정렬: monthly_return_pct DESC (월간 수익률 높은 순)
    // 화면 표시: 월간 수익률 (%)

    // 국내 (KOSPI + KOSDAQ, STOCK)
    @Query(value = """
    SELECT ap.*
    FROM asset_price ap
    INNER JOIN asset a ON ap.asset_id = a.asset_id
    INNER JOIN asset_indicator ai ON ap.asset_id = ai.asset_id
    INNER JOIN (
        SELECT asset_id, MAX(price_date) AS max_date
        FROM asset_price GROUP BY asset_id
    ) latest_p ON ap.asset_id = latest_p.asset_id
            AND ap.price_date = latest_p.max_date
    INNER JOIN (
        SELECT asset_id, MAX(base_date) AS max_date
        FROM asset_indicator GROUP BY asset_id
    ) latest_i ON ai.asset_id = latest_i.asset_id
            AND ai.base_date = latest_i.max_date
    WHERE a.market IN ('KOSPI', 'KOSDAQ')
      AND a.asset_type = 'STOCK'
      AND ai.dividend_yield_pct IS NOT NULL
      AND ai.dividend_yield_pct > 0
      AND ai.dividend_yield_pct < 10
    ORDER BY ai.monthly_return_pct DESC
    LIMIT 6
    """, nativeQuery = true)
    List<AssetPrice> findDividendTopKorean();

    // 해외 (NYSE + NASDAQ, STOCK)
    @Query(value = """
    SELECT ap.*
    FROM asset_price ap
    INNER JOIN asset a ON ap.asset_id = a.asset_id
    INNER JOIN asset_indicator ai ON ap.asset_id = ai.asset_id
    INNER JOIN (
        SELECT asset_id, MAX(price_date) AS max_date
        FROM asset_price GROUP BY asset_id
    ) latest_p ON ap.asset_id = latest_p.asset_id
            AND ap.price_date = latest_p.max_date
    INNER JOIN (
        SELECT asset_id, MAX(base_date) AS max_date
        FROM asset_indicator GROUP BY asset_id
    ) latest_i ON ai.asset_id = latest_i.asset_id
            AND ai.base_date = latest_i.max_date
    WHERE a.market IN ('NYSE', 'NASDAQ')
      AND a.asset_type = 'STOCK'
      AND ai.dividend_yield_pct IS NOT NULL
      AND ai.dividend_yield_pct > 0
      AND ai.dividend_yield_pct < 10
    ORDER BY ai.monthly_return_pct DESC
    LIMIT 6
    """, nativeQuery = true)
    List<AssetPrice> findDividendTopOverseas();

    // ETF
    @Query(value = """
    SELECT ap.*
    FROM asset_price ap
    INNER JOIN asset a ON ap.asset_id = a.asset_id
    INNER JOIN asset_indicator ai ON ap.asset_id = ai.asset_id
    INNER JOIN (
        SELECT asset_id, MAX(price_date) AS max_date
        FROM asset_price GROUP BY asset_id
    ) latest_p ON ap.asset_id = latest_p.asset_id
            AND ap.price_date = latest_p.max_date
    INNER JOIN (
        SELECT asset_id, MAX(base_date) AS max_date
        FROM asset_indicator GROUP BY asset_id
    ) latest_i ON ai.asset_id = latest_i.asset_id
            AND ai.base_date = latest_i.max_date
    WHERE a.asset_type = 'ETF'
      AND ai.dividend_yield_pct IS NOT NULL
      AND ai.dividend_yield_pct > 0
      AND ai.dividend_yield_pct < 10
    ORDER BY ai.monthly_return_pct DESC
    LIMIT 6
    """, nativeQuery = true)
    List<AssetPrice> findDividendTopEtf();

    // ETF 특집 TOP 10 (배당 필터 + LIMIT 10)
    @Query(value = """
    SELECT ap.*
    FROM asset_price ap
    INNER JOIN asset a ON ap.asset_id = a.asset_id
    INNER JOIN asset_indicator ai ON ap.asset_id = ai.asset_id
    INNER JOIN (
        SELECT asset_id, MAX(price_date) AS max_date
        FROM asset_price GROUP BY asset_id
    ) latest_p ON ap.asset_id = latest_p.asset_id
            AND ap.price_date = latest_p.max_date
    INNER JOIN (
        SELECT asset_id, MAX(base_date) AS max_date
        FROM asset_indicator GROUP BY asset_id
    ) latest_i ON ai.asset_id = latest_i.asset_id
            AND ai.base_date = latest_i.max_date
    WHERE a.asset_type = 'ETF'
      AND ai.dividend_yield_pct IS NOT NULL
      AND ai.dividend_yield_pct > 0
      AND ai.dividend_yield_pct < 10
    ORDER BY ai.monthly_return_pct DESC
    LIMIT 10
    """, nativeQuery = true)
    List<AssetPrice> findEtfThemeTop10();
    // 특정 종목의 최근 N년 가격 데이터 조회
    @Query("""
SELECT ap
FROM AssetPrice ap
JOIN ap.asset a
WHERE a.ticker = :ticker
  AND ap.priceDate >= :startDate
ORDER BY ap.priceDate ASC
""")
    List<AssetPrice> findPriceHistoryByTicker(
            @Param("ticker") String ticker,
            @Param("startDate") LocalDate startDate
    );
}