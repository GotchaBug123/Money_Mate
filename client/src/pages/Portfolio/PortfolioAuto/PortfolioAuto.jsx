import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './PortfolioAuto.module.css';

// ─────────────────────────────────────────────
// ✅ Mock 데이터 (백엔드 API 연결 시 이 부분만 교체)
// API: POST /api/portfolio/recommend
// Request: { typeName, totalScore, selectedThemes, investAmount, currency, startDate, endDate, goalAmount }
// Response: { stocks: [ { name, ticker, category, weight, expectedReturn, reason } ] }
// ─────────────────────────────────────────────
const MOCK_RESPONSE = () => ({
    stocks: [
        { name: 'TIGER 미국S&P500', ticker: '360750', category: 'ETF',  weight: 30, expectedReturn: 11.4, reason: '미국 대형주 분산 효과 극대화' },
        { name: 'NVIDIA',           ticker: 'NVDA',   category: '해외',  weight: 25, expectedReturn: 18.7, reason: 'AI 반도체 성장 모멘텀 최강' },
        { name: '삼성전자',          ticker: '005930', category: '국내',  weight: 25, expectedReturn: 8.2,  reason: '반도체 글로벌 리더, 안정적 배당' },
        { name: 'KODEX 2차전지',     ticker: '305720', category: 'ETF',  weight: 20, expectedReturn: 14.1, reason: '2차전지 테마 집중 투자' },
    ],
});

const CATEGORY_COLOR = { '국내': '#1B5ED9', '해외': '#C0392B', 'ETF': '#1A7A45' };
const CATEGORY_BG    = { '국내': '#E8F0FE', '해외': '#FFF0EE', 'ETF': '#EDFAF4' };
const PIE_COLORS     = ['#1B5ED9', '#C0392B', '#1A7A45', '#B47D0C'];

// 파이차트 SVG — cumAngle을 재할당 없이 reduce로 처리
const PieChart = ({ stocks }) => {
    const total = stocks.reduce((s, st) => s + st.weight, 0);
    const cx = 110, cy = 110, r = 80;
    const toRad = (deg) => (deg * Math.PI) / 180;

    const { slices } = stocks.reduce(
        (acc, st, i) => {
            const angle = (st.weight / total) * 360;
            const start = acc.cumAngle;
            const end   = acc.cumAngle + angle;
            const x1 = cx + r * Math.cos(toRad(start));
            const y1 = cy + r * Math.sin(toRad(start));
            const x2 = cx + r * Math.cos(toRad(end));
            const y2 = cy + r * Math.sin(toRad(end));
            const large = angle > 180 ? 1 : 0;
            const path  = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`;
            return {
                cumAngle: end,
                slices: [...acc.slices, { path, color: PIE_COLORS[i], ...st }],
            };
        },
        { cumAngle: -90, slices: [] }
    );

    return (
        <svg viewBox="0 0 220 220" className={styles.pie}>
            {slices.map((s, i) => (
                <path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth="2">
                    <title>{s.name} {s.weight}%</title>
                </path>
            ))}
            <circle cx={cx} cy={cy} r={38} fill="#fff" />
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill="#888">포트폴리오</text>
            <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fill="#888">구성비</text>
        </svg>
    );
};

const PortfolioAuto = () => {
    const navigate  = useNavigate();
    const location  = useLocation();
    const { typeName = '위험중립형', totalScore, selectedThemes, productScores } = location.state || {};

    const [currency,   setCurrency]   = useState('만원');
    const [amount,     setAmount]     = useState('');
    const [startDate,  setStartDate]  = useState('');
    const [endDate,    setEndDate]    = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [loading,    setLoading]    = useState(false);
    const [stocks,     setStocks]     = useState(null);

    const handleGenerate = async () => {
        if (!amount || !startDate || !endDate || !goalAmount) {
            alert('모든 항목을 입력해주세요.');
            return;
        }
        setLoading(true);
        try {
            // ✅ 실제 API 연결 시 아래 주석 해제 후 Mock 제거
            // const response = await fetch('/api/portfolio/recommend', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         typeName, totalScore, selectedThemes, productScores,
            //         investAmount: Number(amount), currency,
            //         startDate, endDate,
            //         goalAmount: Number(goalAmount),
            //     }),
            // });
            // const data = await response.json();
            // setStocks(data.stocks);

            await new Promise((res) => setTimeout(res, 1200));
            setStocks(MOCK_RESPONSE().stocks);
        } catch {
            alert('포트폴리오 생성 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleResult = () => {
        navigate('/portfolio/result', {
            state: {
                stocks,
                investAmount: amount,
                currency,
                startDate,
                endDate,
                goalAmount,
                typeName,
                totalScore,
                selectedThemes,
                productScores,
            },
        });
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.layout}>

                {/* ── 왼쪽: 입력 폼 ── */}
                <div className={styles.formSection}>
                    <p className={styles.sectionTitle}>포트폴리오 자동 생성</p>
                    <p className={styles.sectionSub}>
                        <span className={styles.typeBadge}>{typeName}</span> 성향 기반으로 최적 포트폴리오를 구성합니다.
                    </p>

                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>투자 금액</label>
                        <div className={styles.amountRow}>
                            <select className={styles.currencySelect} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                                <option value="만원">만원</option>
                                <option value="달러">달러</option>
                            </select>
                            <input className={styles.textInput} type="number" placeholder="투자 금액을 입력하세요"
                                   value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>투자 목표 기간</label>
                        <div className={styles.dateRow}>
                            <input className={styles.dateInput} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            <span className={styles.dateSep}>~</span>
                            <input className={styles.dateInput} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>목표 금액</label>
                        <input className={styles.textInput} type="number" placeholder="목표 금액을 입력하세요"
                               value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} />
                    </div>

                    <button className={styles.generateBtn} onClick={handleGenerate} disabled={loading}>
                        {loading ? '생성 중...' : '포트폴리오 생성하기'}
                    </button>

                    {stocks && (
                        <button className={styles.resultBtn} onClick={handleResult}>
                            결과 확인하기 →
                        </button>
                    )}
                </div>

                {/* ── 오른쪽: 추천 결과 ── */}
                <div className={styles.resultSection}>
                    {loading && (
                        <div className={styles.loadingBox}>
                            <div className={styles.spinner} />
                            <p className={styles.loadingText}>AI가 포트폴리오를 구성하고 있습니다...</p>
                        </div>
                    )}

                    {!loading && !stocks && (
                        <div className={styles.emptyBox}>
                            <p className={styles.emptyText}>투자 정보를 입력하면{'\n'}추천 포트폴리오가 표시됩니다</p>
                        </div>
                    )}

                    {!loading && stocks && (
                        <div className={styles.stockResult}>
                            {/* 파이차트 + 범례 */}
                            <div className={styles.chartRow}>
                                <PieChart stocks={stocks} />
                                <div className={styles.legend}>
                                    {stocks.map((st, i) => (
                                        <div key={i} className={styles.legendItem}>
                                            <span className={styles.legendDot} style={{ background: PIE_COLORS[i] }} />
                                            <span className={styles.legendName}>{st.name}</span>
                                            <span className={styles.legendWeight}>{st.weight}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 종목 카드 리스트 */}
                            <div className={styles.stockList}>
                                {stocks.map((st, i) => (
                                    <div key={i} className={styles.stockCard}>
                                        <div className={styles.stockLeft}>
                                            <span className={styles.categoryBadge}
                                                  style={{ background: CATEGORY_BG[st.category], color: CATEGORY_COLOR[st.category] }}>
                                                {st.category}
                                            </span>
                                            <div>
                                                <p className={styles.stockName}>{st.name}</p>
                                                <p className={styles.stockTicker}>{st.ticker}</p>
                                            </div>
                                        </div>
                                        <div className={styles.stockRight}>
                                            <p className={styles.stockWeight}>{st.weight}%</p>
                                            <p className={styles.stockReturn}>+{st.expectedReturn}%</p>
                                            <p className={styles.stockReason}>{st.reason}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PortfolioAuto;