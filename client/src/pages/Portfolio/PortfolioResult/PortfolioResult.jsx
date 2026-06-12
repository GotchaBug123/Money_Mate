import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {analyzePortfolio} from '../../../api/financeApi';
import {usePortfolioStore} from '../../../store/usePortfolioStore';
import styles from './PortfolioResult.module.css';

const IllustSVG = () => (
    <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" className={styles.illustSvg}>
        <circle cx="100" cy="110" r="90" fill="var(--color-primary-light)" opacity="0.5"/>
        <rect x="30" y="130" width="28" height="55" rx="6" fill="var(--color-primary)" opacity="0.4"/>
        <rect x="66" y="100" width="28" height="85" rx="6" fill="var(--color-primary)" opacity="0.7"/>
        <rect x="102" y="75" width="28" height="110" rx="6" fill="var(--color-primary)"/>
        <rect x="138" y="55" width="28" height="130" rx="6" fill="var(--color-primary-hover)"/>
        <polyline points="38,125 74,95 110,70 148,50" fill="none" stroke="var(--color-success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="148" cy="50" r="5" fill="var(--color-success)"/>
        <circle cx="100" cy="40" r="18" fill="none" stroke="var(--color-primary)" strokeWidth="3" opacity="0.5"/>
        <circle cx="100" cy="40" r="11" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" opacity="0.7"/>
        <circle cx="100" cy="40" r="5" fill="var(--color-primary)"/>
        <line x1="108" y1="32" x2="118" y2="22" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="114" y1="22" x2="118" y2="22" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="118" y1="22" x2="118" y2="26" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
);

const BarChart = ({data}) => {
    const maxAbs = Math.max(...data.map((d) => Math.abs(d.value)));
    return (
        <div className={styles.barChart}>
            {data.map((d, i) => (
                <div key={i} className={styles.barRow}>
                    <span className={styles.barDot} style={{background: d.value < 0 ? 'var(--color-error)' : 'var(--color-success)'}}/>
                    <span className={styles.barLabel}>{d.label}</span>
                    <div className={styles.barTrack}>
                        <div
                            className={`${styles.barFill} ${d.value < 0 ? styles.barNeg : styles.barPos}`}
                            style={{width: `${(Math.abs(d.value) / maxAbs) * 100}%`}}
                        />
                    </div>
                    <span className={`${styles.barValue} ${d.value < 0 ? styles.neg : styles.pos}`}>
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
    const saveAutoPortfolio = usePortfolioStore((state) => state.saveAutoPortfolio);

    const {
        stocks = [],
        investAmount,
        currency = '만원',
        startDate,
        endDate,
        goalAmount,
        rebalanceCycle = 'QUARTERLY',
        typeName = '위험중립형',
        totalScore,
        selectedThemes,
        productScores,
    } = location.state || {};

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const investmentMonths = (() => {
                    if (!startDate || !endDate) return 12;
                    const diff = new Date(endDate) - new Date(startDate);
                    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24 * 30)));
                })();

                const requestData = {
                    currentAmount: (Number(investAmount) || 0) * 10000,
                    monthlyInvestment: 0,
                    targetAmount: Number(goalAmount) * 10000,
                    investmentMonths,
                    rebalanceCycle,
                    selectedAssets: stocks.map(st => ({
                        symbol: st.ticker || st.symbol || st.name,
                        assetName: st.name,
                        assetType: st.category || st.assetType || '국내',
                        market: st.market || st.category || '국내',
                        targetWeight: st.weight,
                        expectedAnnualReturn: (st.expectedReturn ?? st.expectedAnnualReturn ?? 8) / 100,
                        annualVolatility: st.annualVolatility || null,
                    })),
                };

                const data = await analyzePortfolio(requestData);
                setResult(data);
            } catch (e) {
                console.error('포트폴리오 분석 실패:', e);
            } finally {
                setLoading(false);
            }
        };

        if (stocks.length > 0) {
            fetchResult();
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.layout} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px'}}>
                    <p>포트폴리오 분석 중...</p>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.layout} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px'}}>
                    <p>분석 결과를 불러오지 못했습니다.</p>
                </div>
            </div>
        );
    }

    // 백엔드가 이미 퍼센트 값으로 반환하므로 추가 ×100 불필요
    const achievementRate = Math.min(100, Math.round(result.successProbability ?? 0));
    const finalAmount = result.medianAmount ?? 0;
    const avgReturnRate = Number((result.annualizedReturn ?? 0).toFixed(1));
    const maxDrawdown = Number((result.maxDrawdown ?? 0).toFixed(1));
    const minAnnualReturn = Number((result.worstAnnualReturn ?? 0).toFixed(1));
    const maxAnnualReturn = Number((result.bestAnnualReturn ?? 0).toFixed(1));

    const totalDays = (() => {
        if (!startDate || !endDate) return null;
        const diff = new Date(endDate) - new Date(startDate);
        return Math.round(diff / (1000 * 60 * 60 * 24));
    })();
    const remainingDays = (() => {
        if (!endDate) return 0;
        const diff = new Date(endDate) - new Date();
        return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
    })();
    const progressRate = totalDays ? Math.min(100, Math.round(((totalDays - remainingDays) / totalDays) * 100)) : 0;

    const barData = [
        {label: '연평균 수익률', value: avgReturnRate},
        {label: '최고 연수익률', value: maxAnnualReturn},
        {label: '최저 연수익률', value: minAnnualReturn},
        {label: '최대 낙폭', value: maxDrawdown},
    ];

    const handleSaveAndNavigate = () => {
        saveAutoPortfolio({
            name: typeName + ' 포트폴리오',
            stocks,
            investAmount,
            currency,
            goalAmount,
            avgReturnRate,
            achievementRate,
        });
        navigate('/portfolio');
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.layout}>

                <div className={styles.topRow}>
                    <div className={styles.topCards}>
                        <div className={styles.topCard}>
                            <div className={styles.cardLabelRow}>
                                <div className={`${styles.cardIcon} ${styles.iconBlue}`}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="4" width="18" height="18" rx="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6"/>
                                        <line x1="8" y1="2" x2="8" y2="6"/>
                                        <line x1="3" y1="10" x2="21" y2="10"/>
                                    </svg>
                                </div>
                                <p className={styles.cardLabel}>남은 목표 기간</p>
                            </div>
                            <div className={styles.gaugeRow}>
                                <div className={styles.gaugeTrack}>
                                    <div className={styles.gaugeFill} style={{width: `${progressRate}%`}}/>
                                </div>
                                <span className={styles.gaugeValue}>{remainingDays.toLocaleString()}일 남음</span>
                            </div>
                            {startDate && endDate && (
                                <p className={styles.cardMeta}>{startDate} ~ {endDate}</p>
                            )}
                        </div>

                        <div className={styles.topCard}>
                            <div className={styles.cardLabelRow}>
                                <div className={`${styles.cardIcon} ${styles.iconGreen}`}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                    </svg>
                                </div>
                                <p className={styles.cardLabel}>달성 확률</p>
                            </div>
                            <div className={styles.gaugeRow}>
                                <div className={styles.gaugeTrack}>
                                    <div className={styles.gaugeFillGreen} style={{width: `${achievementRate}%`}}/>
                                </div>
                                <span className={styles.gaugeValueGreen}>{achievementRate}%</span>
                            </div>
                            <p className={styles.cardMeta}>
                                투자금 {Number(investAmount).toLocaleString()}만원 →
                                목표 {Number(goalAmount).toLocaleString()}만원
                            </p>
                        </div>
                    </div>

                    <div className={styles.illustWrap}>
                        <IllustSVG/>
                    </div>
                </div>

                <div className={styles.statsSection}>
                    <div className={styles.statCard}>
                        <p className={styles.statLabel}>최종금액</p>
                        <p className={styles.statValue}>
                            {Math.round(finalAmount / 10000).toLocaleString()}<span className={styles.statUnit}>만원</span>
                        </p>
                        <div className={`${styles.statIcon} ${styles.iconWallet}`}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                                <path d="M16 3H8L4 7h16l-4-4z"/>
                                <circle cx="17" cy="13" r="1.5" fill="currentColor"/>
                            </svg>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <p className={styles.statLabel}>연평균 수익률</p>
                        <p className={`${styles.statValue} ${styles.pos}`}>+{avgReturnRate}%</p>
                        <div className={`${styles.statIcon} ${styles.iconPos}`}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                                <polyline points="17 6 23 6 23 12"/>
                            </svg>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <p className={styles.statLabel}>최대 낙폭</p>
                        <p className={`${styles.statValue} ${styles.neg}`}>{maxDrawdown}%</p>
                        <div className={`${styles.statIcon} ${styles.iconNeg}`}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                                <polyline points="17 18 23 18 23 12"/>
                            </svg>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <p className={styles.statLabel}>최고 연수익률</p>
                        <p className={`${styles.statValue} ${styles.pos}`}>+{maxAnnualReturn}%</p>
                        <div className={`${styles.statIcon} ${styles.iconPos}`}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                                <path d="M4 22h16"/>
                                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                                <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
                            </svg>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <p className={styles.statLabel}>최저 연수익률</p>
                        <p className={`${styles.statValue} ${styles.neg}`}>{minAnnualReturn}%</p>
                        <div className={`${styles.statIcon} ${styles.iconNeg}`}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="20" x2="18" y2="10"/>
                                <line x1="12" y1="20" x2="12" y2="4"/>
                                <line x1="6" y1="20" x2="6" y2="14"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className={styles.chartSection}>
                    <p className={styles.chartTitle}>수익률 분석</p>
                    <BarChart data={barData}/>
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
                    <button className={styles.primaryBtn} onClick={handleSaveAndNavigate}>
                        내 포트폴리오에서 이용하기
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"/>
                            <polyline points="12 5 19 12 12 19"/>
                        </svg>
                    </button>
                    <button
                        className={styles.secondaryBtn}
                        onClick={() => navigate('/portfolio/auto', {
                            state: {typeName, resultType: typeName, totalScore, selectedThemes},
                        })}
                    >
                        직접 만들어 다시하기
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1 4 1 10 7 10"/>
                            <path d="M3.51 15a9 9 0 1 0 .49-3.68"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PortfolioResult;