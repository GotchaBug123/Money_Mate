import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './PortfolioResult.module.css';

const MOCK_SIMULATE = (investAmount, goalAmount) => {
    const invest = Number(investAmount) || 1000;
    const goal   = Number(goalAmount)   || 1500;
    const rate   = Math.min(98, Math.round((invest / goal) * 85 + Math.random() * 10));
    return {
        remainingDays:   842,
        achievementRate: rate,
        finalAmount:     Math.round(invest * 1.43),
        avgReturnRate:   12.4,
        maxDrawdown:     -18.2,
        minAnnualReturn: -8.5,
        maxAnnualReturn: 34.7,
    };
};

const BarChart = ({ data }) => {
    const max = Math.max(...data.map((d) => Math.abs(d.value)));
    return (
        <div className={styles.barChart}>
            {data.map((d, i) => (
                <div key={i} className={styles.barRow}>
                    <span className={styles.barLabel}>{d.label}</span>
                    <div className={styles.barTrack}>
                        <div
                            className={`${styles.barFill} ${d.value < 0 ? styles.barNeg : styles.barPos}`}
                            style={{ width: `${(Math.abs(d.value) / max) * 100}%` }}
                        />
                    </div>
                    <span className={`${styles.barValue} ${d.value < 0 ? styles.barNeg : styles.barPos}`}>
                        {d.value > 0 ? '+' : ''}{d.value}%
                    </span>
                </div>
            ))}
        </div>
    );
};

const PortfolioResult = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        stocks = [],
        investAmount,
        currency = '만원',
        startDate,
        endDate,
        goalAmount,
        typeName = '위험중립형',
        totalScore,
        selectedThemes,
        productScores,
    } = location.state || {};

    // ✅ 실제 API 연결 시 아래 useEffect로 교체
    // useEffect(() => {
    //     fetch('/api/portfolio/simulate', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ stocks, investAmount, currency, startDate, endDate, goalAmount, typeName }),
    //     })
    //     .then(r => r.json())
    //     .then(setResult);
    // }, []);

    const result = MOCK_SIMULATE(investAmount, goalAmount);

    const {
        remainingDays,
        achievementRate,
        finalAmount,
        avgReturnRate,
        maxDrawdown,
        minAnnualReturn,
        maxAnnualReturn,
    } = result;

    const totalDays = (() => {
        if (!startDate || !endDate) return null;
        const diff = new Date(endDate) - new Date(startDate);
        return Math.round(diff / (1000 * 60 * 60 * 24));
    })();
    const progressRate = totalDays ? Math.min(100, Math.round(((totalDays - remainingDays) / totalDays) * 100)) : 0;

    const barData = [
        { label: '연평균 수익률', value: avgReturnRate },
        { label: '최고 연수익률', value: maxAnnualReturn },
        { label: '최저 연수익률', value: minAnnualReturn },
        { label: '최대 낙폭',     value: maxDrawdown },
    ];

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.layout}>
                <div className={styles.topSection}>
                    <div className={styles.topCard}>
                        <p className={styles.topCardLabel}>남은 목표 기간</p>
                        <div className={styles.gaugeRow}>
                            <div className={styles.gaugeTrack}>
                                <div className={styles.gaugeFill} style={{ width: `${progressRate}%` }} />
                            </div>
                            <span className={styles.gaugeValue}>{remainingDays.toLocaleString()}일 남음</span>
                        </div>
                        {startDate && endDate && (
                            <p className={styles.dateRange}>{startDate} ~ {endDate}</p>
                        )}
                    </div>

                    <div className={styles.topCard}>
                        <p className={styles.topCardLabel}>달성 확률</p>
                        <div className={styles.gaugeRow}>
                            <div className={styles.gaugeTrack}>
                                <div className={styles.gaugeFillGreen} style={{ width: `${achievementRate}%` }} />
                            </div>
                            <span className={styles.gaugeValueGreen}>{achievementRate}%</span>
                        </div>
                        <p className={styles.dateRange}>
                            투자금 {Number(investAmount).toLocaleString()}{currency} → 목표 {Number(goalAmount).toLocaleString()}{currency}
                        </p>
                    </div>
                </div>

                <div className={styles.statsSection}>
                    <div className={styles.statCard}>
                        <p className={styles.statLabel}>최종금액</p>
                        <p className={styles.statValue}>{finalAmount.toLocaleString()}<span className={styles.statUnit}>{currency}</span></p>
                    </div>
                    <div className={styles.statCard}>
                        <p className={styles.statLabel}>연평균 수익률</p>
                        <p className={`${styles.statValue} ${styles.pos}`}>+{avgReturnRate}%</p>
                    </div>
                    <div className={styles.statCard}>
                        <p className={styles.statLabel}>최대 낙폭</p>
                        <p className={`${styles.statValue} ${styles.neg}`}>{maxDrawdown}%</p>
                    </div>
                    <div className={styles.statCard}>
                        <p className={styles.statLabel}>최고 연수익률</p>
                        <p className={`${styles.statValue} ${styles.pos}`}>+{maxAnnualReturn}%</p>
                    </div>
                    <div className={styles.statCard}>
                        <p className={styles.statLabel}>최저 연수익률</p>
                        <p className={`${styles.statValue} ${styles.neg}`}>{minAnnualReturn}%</p>
                    </div>
                </div>

                <div className={styles.chartSection}>
                    <p className={styles.chartTitle}>수익률 분석</p>
                    <BarChart data={barData} />
                </div>

                {stocks.length > 0 && (
                    <div className={styles.stockSummary}>
                        <p className={styles.chartTitle}>구성 종목 ({stocks.length}개)</p>
                        <div className={styles.stockChips}>
                            {stocks.map((st, i) => (
                                <span key={i} className={styles.stockChip}>
                                    {st.name} <strong>{st.weight}%</strong>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.actionRow}>
                    <button className={styles.primaryBtn} onClick={() => navigate('/portfolio')}>
                        내 포트폴리오에서 이용하기
                    </button>
                    <button
                        className={styles.secondaryBtn}
                        onClick={() => navigate('/portfolio/auto', {
                            state: { typeName, totalScore, selectedThemes, productScores },
                        })}
                    >
                        직접 만들어 다시하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PortfolioResult;