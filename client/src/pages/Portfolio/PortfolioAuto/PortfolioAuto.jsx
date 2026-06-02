import React, {useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import styles from './PortfolioAuto.module.css';

const MOCK_RESPONSE = () => ({
    stocks: [
        {
            name: 'TIGER 미국S&P500',
            ticker: '360750',
            category: 'ETF',
            weight: 30,
            expectedReturn: 11.4,
            reason: '미국 대형주 분산 효과 극대화'
        },
        {name: 'NVIDIA', ticker: 'NVDA', category: '해외', weight: 25, expectedReturn: 18.7, reason: 'AI 반도체 성장 모멘텀 최강'},
        {name: '삼성전자', ticker: '005930', category: '국내', weight: 25, expectedReturn: 8.2, reason: '반도체 글로벌 리더, 안정적 배당'},
        {
            name: 'KODEX 2차전지',
            ticker: '305720',
            category: 'ETF',
            weight: 20,
            expectedReturn: 14.1,
            reason: '2차전지 테마 집중 투자'
        },
    ],
});

// 💡 하드코딩 헥스코드 대신 글로벌 CSS 변수 사용!
const CATEGORY_COLOR = {'국내': 'var(--color-primary)', '해외': 'var(--color-error)', 'ETF': 'var(--color-success)'};
const CATEGORY_BG = {
    '국내': 'var(--color-primary-light)',
    '해외': 'var(--color-error-bg)',
    'ETF': 'var(--color-success-bg)'
};
const PIE_COLORS = ['var(--color-primary)', 'var(--color-error)', 'var(--color-success)', 'var(--color-warning)'];

const PieChart = ({stocks}) => {
    const total = stocks.reduce((s, st) => s + st.weight, 0);
    const cx = 110, cy = 110, r = 80;
    const toRad = (deg) => (deg * Math.PI) / 180;

    const {slices} = stocks.reduce(
        (acc, st, i) => {
            const angle = (st.weight / total) * 360;
            const start = acc.cumAngle;
            const end = acc.cumAngle + angle;

            const x1 = cx + r * Math.cos(toRad(start));
            const y1 = cy + r * Math.sin(toRad(start));
            const x2 = cx + r * Math.cos(toRad(end));
            const y2 = cy + r * Math.sin(toRad(end));

            const large = angle > 180 ? 1 : 0;
            const path = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`;

            return {cumAngle: end, slices: [...acc.slices, {path, color: PIE_COLORS[i], ...st}]};
        },
        {cumAngle: -90, slices: []}
    );

    return (
        <svg viewBox="0 0 220 220" className={styles.pie}>
            {slices.map((s, i) => (
                <path key={i} d={s.path} fill={s.color} stroke="var(--color-bg-input)" strokeWidth="3">
                    <title>{s.name} {s.weight}%</title>
                </path>
            ))}
            <circle cx={cx} cy={cy} r={44} fill="var(--color-bg-input)"/>
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize="12" fontWeight="700"
                  fill="var(--color-text-muted)">포트폴리오
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" fontSize="12" fontWeight="700"
                  fill="var(--color-text-muted)">구성비
            </text>
        </svg>
    );
};

const PortfolioAuto = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 이전 진단 결과에서 넘어온 성향 정보
    const {typeName = '위험중립형', totalScore, selectedThemes, productScores} = location.state || {};

    const [currency, setCurrency] = useState('원화');
    const [amount, setAmount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [goalAmount, setGoalAmount] = useState('');

    const [loading, setLoading] = useState(false);
    const [stocks, setStocks] = useState(null);

    const handleGenerate = async () => {
        if (!amount || !startDate || !endDate || !goalAmount) {
            alert('모든 항목을 입력해주세요.');
            return;
        }
        setLoading(true);
        try {
            // ✅ 실제 API 연결 시 주석 해제 및 활용
            // const res = await fetch('/api/portfolio/recommend', { method:'POST', ... });
            // setStocks((await res.json()).stocks);

            await new Promise(res => setTimeout(res, 1200)); // 인공 딜레이
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
                productScores
            },
        });
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>

                {/* ── 상단 헤더 ── */}
                <div className={styles.pageHeader}>
                    <div className={styles.pageHeaderIcon}>✦</div>
                    <div>
                        <p className={styles.pageHeaderTitle}>포트폴리오 자동 생성</p>
                        <div className={styles.pageHeaderDesc}>
                            <span className={styles.typeBadge}>{typeName}</span>
                            진단된 성향을 기반으로 최적의 투자 포트폴리오를 AI가 구성합니다.
                        </div>
                    </div>
                </div>

                {/* ── 2단 레이아웃 ── */}
                <div className={styles.layout}>

                    {/* 왼쪽: 설정 폼 */}
                    <div className={styles.formSection}>
                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>투자 금액</label>
                            <div className={styles.fieldRow}>
                                <select className={styles.sel} value={currency}
                                        onChange={e => setCurrency(e.target.value)}>
                                    <option>원화</option>
                                    <option>달러</option>
                                </select>
                                <input className={styles.textInput} type="number" placeholder="금액 입력"
                                       value={amount} onChange={e => setAmount(e.target.value)}/>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>투자 목표 기간</label>
                            <div className={styles.dateRow}>
                                <input className={styles.dateInput} type="date" value={startDate}
                                       onChange={e => setStartDate(e.target.value)}/>
                                <span className={styles.dateSep}>~</span>
                                <input className={styles.dateInput} type="date" value={endDate}
                                       onChange={e => setEndDate(e.target.value)}/>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>목표 금액</label>
                            <input className={styles.textInput} type="number" placeholder="목표 금액 입력"
                                   value={goalAmount} onChange={e => setGoalAmount(e.target.value)}/>
                        </div>

                        <button className={styles.generateBtn} onClick={handleGenerate} disabled={loading}>
                            {loading ? 'AI 분석 중...' : '포트폴리오 생성하기'}
                        </button>

                        {stocks && (
                            <button className={styles.resultBtn} onClick={handleResult}>
                                전체 분석 결과 확인하기 →
                            </button>
                        )}
                    </div>

                    {/* 오른쪽: 추천 결과 */}
                    <div className={styles.resultSection}>

                        {/* 초기 상태 */}
                        {!loading && !stocks && (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIllust}>🤖</div>
                                <p className={styles.emptyTitle}>투자 정보를 모두 입력하시면<br/>맞춤형 추천 포트폴리오가 표시됩니다.</p>
                                <p className={styles.emptyDesc}>AI가 성향에 맞는 최적의 종목과 비율을 계산해 드립니다.</p>
                            </div>
                        )}

                        {/* 로딩 상태 */}
                        {loading && (
                            <div className={styles.emptyState}>
                                <div className={styles.spinner}/>
                                <p className={styles.loadingText}>AI가 유저님의 성향에 맞는 최적의 종목을 계산하고 있습니다...</p>
                            </div>
                        )}

                        {/* 완료 상태 */}
                        {!loading && stocks && (
                            <div className={styles.stockResult}>
                                <div className={styles.chartRow}>
                                    <PieChart stocks={stocks}/>
                                    <div className={styles.legend}>
                                        {stocks.map((st, i) => (
                                            <div key={i} className={styles.legendItem}>
                                                <span className={styles.legendDot} style={{background: PIE_COLORS[i]}}/>
                                                <span className={styles.legendName}>{st.name}</span>
                                                <span className={styles.legendWeight}>{st.weight}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.stockList}>
                                    {stocks.map((st, i) => (
                                        <div key={i} className={styles.stockCard}>
                                            <div className={styles.stockLeft}>
                                                <span className={styles.categoryBadge}
                                                      style={{
                                                          background: CATEGORY_BG[st.category],
                                                          color: CATEGORY_COLOR[st.category]
                                                      }}>
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
        </div>
    );
};

export default PortfolioAuto;