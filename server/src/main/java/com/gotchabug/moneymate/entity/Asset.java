package com.gotchabug.moneymate.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 자산 엔티티
 * DB 테이블: asset
 * 종목(주식, ETF, 지수, 환율 등) 기본 정보를 담는다
 */
@Entity
@Table(name = "asset")
@Getter
@Setter
public class Asset {

    // 자산 고유 번호 (PK, AUTO_INCREMENT)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "asset_id")
    private Long assetId;

    // 종목 코드 (예: 005930, SPY, KOSPI)
    @Column(name = "ticker", nullable = false, unique = true, length = 30)
    private String ticker;

    // 자산명 (예: 삼성전자, S&P 500 ETF)
    @Column(name = "asset_name", nullable = false, length = 100)
    private String assetName;

    // 자산 유형 (STOCK / ETF / INDEX / FOREX)
    @Column(name = "asset_type", nullable = false, length = 30)
    private String assetType;

    // 시장 구분 (KOSPI / KOSDAQ / NYSE / NASDAQ / FOREX)
    @Column(name = "market", nullable = false, length = 30)
    private String market;

    // 통화 (KRW / USD 등), 기본값 KRW
    @Column(name = "currency", nullable = false, length = 10)
    private String currency;

    // 섹터 (반도체 / 2차전지 / AI / 바이오 등)
    @Column(name = "sector", length = 50)
    private String sector;

    // 발행기관명 (ETF 운용사 등)
    @Column(name = "issuer_name", length = 100)
    private String issuerName;

    // 벤치마크 지수 (ETF 추종 지수)
    @Column(name = "benchmark_index", length = 100)
    private String benchmarkIndex;

    // 총보수 비율 (ETF 운용 수수료)
    @Column(name = "expense_ratio", precision = 7, scale = 4)
    private BigDecimal expenseRatio;

    // 위험 등급 (LOW / MEDIUM / HIGH)
    @Column(name = "risk_grade", length = 20)
    private String riskGrade;

    // 데이터 출처명 (예: YAHOO_FINANCE / MANUAL)
    @Column(name = "data_source", nullable = false, length = 30)
    private String dataSource;

    // 외부 데이터 소스 번호 (external_data_source 참조)
    @Column(name = "source_id")
    private Long sourceId;

    // 생성일시
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 수정일시
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}