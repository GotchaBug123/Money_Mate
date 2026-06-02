package com.gotchabug.moneymate.investment.service;

import com.gotchabug.moneymate.investment.dto.AssetSummaryDto;
import com.gotchabug.moneymate.market.entity.Asset;
import com.gotchabug.moneymate.market.entity.AssetIndicator;
import com.gotchabug.moneymate.market.entity.AssetPrice;
import com.gotchabug.moneymate.market.repository.AssetIndicatorRepository;
import com.gotchabug.moneymate.market.repository.AssetPriceRepository;
import com.gotchabug.moneymate.market.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 투자정보 서비스
 * DB(asset / asset_price / asset_indicator)에서 읽어서 화면에 전달
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InvestmentInfoService {

    private final AssetRepository assetRepository;
    private final AssetPriceRepository assetPriceRepository;
    private final AssetIndicatorRepository assetIndicatorRepository;

    public List<AssetSummaryDto> getAssetList() {
        return toDto(assetPriceRepository.findAllTop100());
    }

    public List<AssetSummaryDto> getKoreanList() {
        return toDto(assetPriceRepository.findKoreanStocksTop100());
    }

    public List<AssetSummaryDto> getOverseasList() {
        return toDto(assetPriceRepository.findOverseasStocksTop100());
    }

    public List<AssetSummaryDto> getEtfList() {
        return toDto(assetPriceRepository.findEtfTop100());
    }

    public List<AssetSummaryDto> getTopBySector(String sector) {
        List<Asset> assets = assetRepository.findBySectorContaining(sector);

        List<AssetSummaryDto> result = new java.util.ArrayList<>();
        for (Asset asset : assets) {
            List<AssetPrice> prices =
                    assetPriceRepository.findLatestByAssetId(asset.getAssetId());
            if (prices.isEmpty()) continue;
            AssetPrice price = prices.get(0);

            List<AssetIndicator> indicators =
                    assetIndicatorRepository.findLatestByAssetId(asset.getAssetId());
            BigDecimal daily = indicators.isEmpty()
                    ? null : indicators.get(0).getDailyReturnPct();
            BigDecimal monthly = (indicators.isEmpty()
                    || indicators.get(0).getMonthlyReturnPct() == null)
                    ? null : indicators.get(0).getMonthlyReturnPct();

            BigDecimal tradingValue = BigDecimal.ZERO;
            if (price.getClosePrice() != null && price.getVolume() != null) {
                tradingValue = price.getClosePrice()
                        .multiply(BigDecimal.valueOf(price.getVolume()));
            }

            result.add(AssetSummaryDto.builder()
                    .assetId(asset.getAssetId())
                    .ticker(asset.getTicker())
                    .assetName(asset.getAssetName())
                    .assetType(asset.getAssetType())
                    .market(asset.getMarket())
                    .sector(asset.getSector())
                    .currency(asset.getCurrency())
                    .closePrice(price.getClosePrice())
                    .dailyReturnPct(daily)
                    .monthlyReturnPct(monthly)
                    .volume(price.getVolume())
                    .tradingValue(tradingValue)
                    .build());
        }

        result.sort((a, b) -> {
            BigDecimal ra = a.getMonthlyReturnPct() != null
                    ? a.getMonthlyReturnPct() : BigDecimal.ZERO;
            BigDecimal rb = b.getMonthlyReturnPct() != null
                    ? b.getMonthlyReturnPct() : BigDecimal.ZERO;
            return rb.compareTo(ra);
        });

        return result.size() > 10 ? result.subList(0, 10) : result;
    }

    public List<AssetSummaryDto> getDividendTopKorean() {
        return toDto(assetPriceRepository.findDividendTopKorean());
    }

    public List<AssetSummaryDto> getDividendTopOverseas() {
        return toDto(assetPriceRepository.findDividendTopOverseas());
    }

    public List<AssetSummaryDto> getDividendTopEtf() {
        return toDto(assetPriceRepository.findDividendTopEtf());
    }

    public List<AssetSummaryDto> getEtfThemeTop10() {
        return toDto(assetPriceRepository.findEtfThemeTop10());
    }

    public AssetSummaryDto getMarketIndex(String ticker) {
        return assetRepository.findByTicker(ticker).map(asset -> {
            List<AssetPrice> prices =
                    assetPriceRepository.findLatestByAssetId(asset.getAssetId());
            if (prices.isEmpty()) return null;

            AssetPrice price = prices.get(0);
            List<AssetIndicator> indicators =
                    assetIndicatorRepository.findLatestByAssetId(asset.getAssetId());

            BigDecimal dailyReturn   = indicators.isEmpty() ? null
                    : indicators.get(0).getDailyReturnPct();
            BigDecimal monthlyReturn = indicators.isEmpty() ? null
                    : indicators.get(0).getMonthlyReturnPct();

            BigDecimal tradingValue = BigDecimal.ZERO;
            if (price.getClosePrice() != null && price.getVolume() != null) {
                tradingValue = price.getClosePrice()
                        .multiply(BigDecimal.valueOf(price.getVolume()));
            }

            return AssetSummaryDto.builder()
                    .assetId(asset.getAssetId())
                    .ticker(asset.getTicker())
                    .assetName(asset.getAssetName())
                    .assetType(asset.getAssetType())
                    .market(asset.getMarket())
                    .sector(asset.getSector())
                    .currency(asset.getCurrency())
                    .closePrice(price.getClosePrice())
                    .dailyReturnPct(dailyReturn)
                    .monthlyReturnPct(monthlyReturn)
                    .volume(price.getVolume())
                    .tradingValue(tradingValue)
                    .priceDate(price.getPriceDate())
                    .build();
        }).orElse(null);
    }

    private List<AssetSummaryDto> toDto(List<AssetPrice> prices) {

        Map<Long, BigDecimal> dailyMap = prices.stream()
                .map(ap -> ap.getAsset().getAssetId())
                .distinct()
                .collect(Collectors.toMap(
                        id -> id,
                        id -> {
                            List<AssetIndicator> list =
                                    assetIndicatorRepository.findLatestByAssetId(id);
                            return (list.isEmpty() || list.get(0).getDailyReturnPct() == null)
                                    ? BigDecimal.ZERO
                                    : list.get(0).getDailyReturnPct();
                        }
                ));

        Map<Long, BigDecimal> monthlyMap   = new java.util.HashMap<>();
        // ── [추가] 배당 수익률 맵 (asset_id → dividend_yield_pct) ─
        Map<Long, BigDecimal> dividendMap  = new java.util.HashMap<>();
        // ─────────────────────────────────────────────────────────

        prices.stream()
                .map(ap -> ap.getAsset().getAssetId())
                .distinct()
                .forEach(id -> {
                    List<AssetIndicator> list =
                            assetIndicatorRepository.findLatestByAssetId(id);

                    BigDecimal monthly = (list.isEmpty() || list.get(0).getMonthlyReturnPct() == null)
                            ? null : list.get(0).getMonthlyReturnPct();
                    monthlyMap.put(id, monthly);

                    // ── [추가] dividend_yield_pct 매핑 ────────────
                    BigDecimal dividend = (list.isEmpty() || list.get(0).getDividendYieldPct() == null)
                            ? null : list.get(0).getDividendYieldPct();
                    dividendMap.put(id, dividend);
                    // ─────────────────────────────────────────────
                });

        return prices.stream().map(ap -> {
            Asset asset = ap.getAsset();
            BigDecimal tradingValue = BigDecimal.ZERO;
            if (ap.getClosePrice() != null && ap.getVolume() != null) {
                tradingValue = ap.getClosePrice()
                        .multiply(BigDecimal.valueOf(ap.getVolume()));
            }
            return AssetSummaryDto.builder()
                    .assetId(asset.getAssetId())
                    .ticker(asset.getTicker())
                    .assetName(asset.getAssetName())
                    .assetType(asset.getAssetType())
                    .market(asset.getMarket())
                    .sector(asset.getSector())
                    .currency(asset.getCurrency())
                    .closePrice(ap.getClosePrice())
                    .dailyReturnPct(dailyMap.getOrDefault(asset.getAssetId(), BigDecimal.ZERO))
                    .monthlyReturnPct(monthlyMap.get(asset.getAssetId()))
                    .dividendYieldPct(dividendMap.get(asset.getAssetId())) // ← [추가]
                    .volume(ap.getVolume())
                    .tradingValue(tradingValue)
                    .priceDate(ap.getPriceDate())
                    .build();
        }).toList();
    }
}