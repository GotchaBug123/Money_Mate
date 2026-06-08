import React, {useState, useRef} from 'react';
import styles from './Rebalancing.module.css';
import {searchAssetsApi, analyzeRebalanceApi} from "../../api/rebalanceApi.js";
import {ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";

const LOGO_MAP = {
    '005930': 'samsung.com', '000660': 'skhynix.com', 'NVDA': 'nvidia.com',
    'AAPL': 'apple.com', '360750': 'tigeretf.com', '005380': 'hyundai.com',
    '373220': 'lgensol.com', '035720': 'kakao.com', 'TSM': 'tsmc.com',
    'MU': 'micron.com', 'MSFT': 'microsoft.com', 'TSLA': 'tesla.com',
};

/*const STOCK_LIST = [
    {id: 1, name: '삼성전자', ticker: '005930', market: '국내', price: '78,400원', chg: '+2.61%', pos: true},
    {id: 2, name: 'SK하이닉스', ticker: '000660', market: '국내', price: '198,500원', chg: '-0.88%', pos: false},
    {id: 3, name: 'NVIDIA', ticker: 'NVDA', market: '해외', price: '$1,208.88', chg: '+3.14%', pos: true},
    {id: 4, name: 'TIGER 미국S&P500', ticker: '360750', market: 'ETF', price: '18,245원', chg: '-0.42%', pos: false},
    {id: 5, name: 'Apple', ticker: 'AAPL', market: '해외', price: '$196.89', chg: '+0.54%', pos: true},
    {id: 6, name: '현대차', ticker: '005380', market: '국내', price: '245,000원', chg: '-1.20%', pos: false},
    {id: 7, name: 'LG에너지솔루션', ticker: '373220', market: '국내', price: '412,000원', chg: '+2.55%', pos: true},
    {id: 8, name: '카카오', ticker: '035720', market: '국내', price: '52,300원', chg: '-0.19%', pos: false},
    {id: 9, name: 'TSMC', ticker: 'TSM', market: '해외', price: '$185.40', chg: '+1.22%', pos: true},
    {id: 10, name: '마이크론', ticker: 'MU', market: '해외', price: '$132.50', chg: '+0.74%', pos: true},
    {id: 11, name: 'Microsoft', ticker: 'MSFT', market: '해외', price: '$420.21', chg: '+0.32%', pos: true},
    {id: 12, name: 'Tesla', ticker: 'TSLA', market: '해외', price: '$178.82', chg: '-2.14%', pos: false},
];*/

/*const searchStocks = (query) => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return STOCK_LIST.filter(s =>
        s.name.toLowerCase().includes(q) || s.ticker.toLowerCase().includes(q)
    );
};*/

// 💡 종목 구분을 위한 다양한 배지 컬러 테마는 유지
const BADGE_COLORS = ['#E8F0FE', '#EDFAF4', '#FFF0EE', '#FAEEDA', '#F0F4FF', '#FEF0F8', '#EEF8FF', '#F5F0FF'];
const BADGE_TEXT = ['#1B5ED9', '#1A7A45', '#C0392B', '#B47D0C', '#2E5CD9', '#C03980', '#0C7CD9', '#7B3FA0'];

const getBadge = (ticker) => {
    if (!ticker) return {bg: BADGE_COLORS[0], color: BADGE_TEXT[0]};
    const idx = ticker.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % BADGE_COLORS.length;
    return {bg: BADGE_COLORS[idx], color: BADGE_TEXT[idx]};
};

const StockLogo = ({ticker, name}) => {
    const [failed, setFailed] = useState(false);
    const domain = LOGO_MAP[ticker];
    const badge = getBadge(ticker);

    if (!domain || failed) return (
        <div className={styles.logoBadge} style={{background: badge.bg, color: badge.color}}>
            {name ? name.charAt(0) : '?'}
        </div>
    );
    return <img className={styles.logoImg} src={`https://logo.clearbit.com/${domain}`}
                alt={name} onError={() => setFailed(true)}/>;
};

/*const MOCK_RESULT = (investAmount) => ({
    achievementRate: 74,
    finalAmount: Math.round(Number(investAmount) * 1.38),
    avgReturnRate: 11.2,
    maxDrawdown: -15.4,
    minAnnualReturn: -6.8,
    maxAnnualReturn: 29.3,
});*/

const CustomTooltip = ({active, payload, label, currency}) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: '#fff',
                padding: '12px 16px',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
                <p style={{margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold', color: 'var(--color-text-main)'}}>
                    {label}개월 차
                </p>
                {/* 예상 자산 (Area) */}
                <p style={{margin: 0, fontSize: '14px', color: 'var(--color-primary)', fontWeight: '600'}}>
                    예상 자산: {payload[0]?.value?.toLocaleString()} {currency}
                </p>
                {/* 목표 자산 (Line) - 있는 경우에만 표시 */}
                {payload[1] && (
                    <p style={{margin: '4px 0 0 0', fontSize: '13px', color: 'var(--color-text-muted)'}}>
                        목표 자산: {payload[1]?.value?.toLocaleString()} {currency}
                    </p>
                )}
            </div>
        );
    }
    return null;
};

const Rebalancing = () => {
    const resultRef = useRef(null);

    const [currency, setCurrency] = useState('원화');
    const [investAmount, setInvestAmount] = useState('');
    const [addPeriod, setAddPeriod] = useState('없음');
    const [addAmount, setAddAmount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [stocks, setStocks] = useState([]);

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const [showSearchModal, setShowSearchModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        try {
            const data = await searchAssetsApi(searchQuery);
            setSearchResults(data);
        } catch (error) {
            console.error('검색 실패:', error);
            alert('종목 검색에 실패했습니다.');
        }
    };

    const handleAdd = (stock) => {
        const targetTicker = stock.symbol || stock.ticker;
        if (stocks.find(s => s.ticker === targetTicker)) {
            alert('이미 추가된 종목입니다.');
            return;
        }
        const newStock = {
            ticker: targetTicker,
            name: stock.assetName,
            market: stock.market,
            assetType: stock.assetType || 'STOCK',
            weight: 0
        };
        const newStocks = [...stocks, newStock];
        const eq = Math.floor(100 / newStocks.length);
        const rem = 100 - eq * newStocks.length;
        setStocks(newStocks.map((s, i) => ({...s, weight: i === 0 ? eq + rem : eq})));
    };

    const handleRemove = (ticker) => {
        const newStocks = stocks.filter(s => s.ticker !== ticker);
        if (!newStocks.length) {
            setStocks([]);
            return;
        }
        const eq = Math.floor(100 / newStocks.length);
        const rem = 100 - eq * newStocks.length;
        setStocks(newStocks.map((s, i) => ({...s, weight: i === 0 ? eq + rem : eq})));
    };

    const handleWeight = (ticker, val) =>
        setStocks(stocks.map(s => s.ticker === ticker ? {...s, weight: Number(val)} : s));

    const totalWeight = stocks.reduce((sum, s) => sum + Number(s.weight), 0);

    const handleAutoWeight = () => {
        if (!stocks.length) return;
        const eq = Math.floor(100 / stocks.length);
        const rem = 100 - eq * stocks.length;
        setStocks(stocks.map((s, i) => ({...s, weight: i === 0 ? eq + rem : eq})));
    };

    const handleRebalance = async () => {
        if (!investAmount || !startDate || !endDate || !goalAmount) {
            return alert('투자 금액, 기간, 목표 금액을 모두 입력해주세요.');
        }
        if (!stocks.length) return alert('최소 1개 이상의 종목을 추가해주세요.');
        if (totalWeight !== 100) return alert(`비중 합계가 ${totalWeight}%입니다. 100%가 되어야 합니다.`);

        // 백엔드 제약조건(최소 100만원) 프론트엔드에서 사전 차단
        if (Number(goalAmount) < 1000000) {
            return alert('목표 금액은 최소 1,000,000원 이상이어야 합니다.');
        }

        setLoading(true);
        setResult(null);

        // 기간 계산 (startDate ~ endDate) -> years, months
        const start = new Date(startDate);
        const end = new Date(endDate);
        const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

        if (totalMonths <= 0) {
            setLoading(false);
            return alert('목표일은 시작일보다 미래여야 합니다.');
        }

        let years = Math.floor(totalMonths / 12);
        let months = totalMonths % 12;

        // 💡 [핵심 우회 로직] 백엔드의 @Min(1) 에러 피하기
        // 딱 맞아떨어지는 N년 0개월인 경우, (N-1)년 12개월로 변환합니다.
        if (months === 0 && years > 0) {
            years -= 1;
            months = 12;
        }
        // 혹시 1년 미만(예: 6개월) 투자일 경우 백엔드 에러 방지를 위해 강제로 1년 세팅
        if (years === 0) years = 1;

        const cycleMap = {'없음': 'NONE', '매달': 'MONTHLY', '매분기': 'QUARTERLY', '매년': 'YEARLY'};

        const requestData = {
            goalName: "나의 커스텀 포트폴리오",
            currentAmount: Number(investAmount),
            monthlyInvestment: addPeriod === '없음' ? 0 : Number(addAmount || 0),
            targetAmount: Number(goalAmount),
            investmentYears: years,    // 💡 1 이상 보장
            investmentMonths: months,  // 💡 1 이상 보장
            rebalanceCycle: cycleMap[addPeriod],
            selectedAssets: stocks.map(st => ({
                symbol: st.ticker,
                assetName: st.name,
                assetType: st.assetType || 'STOCK',
                market: st.market || 'KOSPI',
                targetWeight: st.weight
            }))
        };

        try {
            const data = await analyzeRebalanceApi(requestData);
            setResult(data);
            setTimeout(() => resultRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'}), 100);
        } catch (error) {
            console.error('시뮬레이션 실패:', error);
            // 백엔드가 내려주는 진짜 에러 메시지 확인하기
            const errorMsg = error.response?.data?.message || '입력값을 다시 확인해주세요.';
            alert(`분석 실패: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>

                {/* 헤더 */}
                <div className={styles.pageHeader}>
                    <div className={styles.pageHeaderIcon}>🔄</div>
                    <div>
                        <p className={styles.pageHeaderTitle}>리밸런싱 시뮬레이션</p>
                        <p className={styles.pageHeaderDesc}>현재 포트폴리오를 주기적으로 재조정했을 때의 수익률을 시뮬레이션합니다.</p>
                    </div>
                </div>

                <div className={styles.layout}>

                    {/* ── 왼쪽: 입력 폼 ── */}
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
                                       value={investAmount} onChange={e => setInvestAmount(e.target.value)}/>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>추가 납입금액</label>
                            <div className={styles.fieldRow}>
                                <select className={styles.sel} value={addPeriod} onChange={e => {
                                    setAddPeriod(e.target.value);
                                    if (e.target.value === '없음') setAddAmount('');
                                }}>
                                    <option>없음</option>
                                    <option>매달</option>
                                    <option>매분기</option>
                                    <option>매년</option>
                                </select>
                                <input
                                    className={addPeriod === '없음' ? styles.disabledInput : styles.textInput}
                                    type="number" placeholder="금액 입력"
                                    value={addAmount} onChange={e => setAddAmount(e.target.value)}
                                    disabled={addPeriod === '없음'}
                                />
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

                        <div className={styles.inputGroup}>
                            <div className={styles.stockHeader}>
                                <label className={styles.inputLabel}>주식 종목</label>
                                <span className={styles.stockCount}>{stocks.length}개</span>
                            </div>

                            {stocks.map(st => (
                                <div key={st.ticker} className={styles.stockItem}>
                                    <div className={styles.stockItemLeft}>
                                        <StockLogo ticker={st.ticker} name={st.name}/>
                                        <div>
                                            <p className={styles.stockItemName}>{st.name}</p>
                                            <p className={styles.stockItemTicker}>{st.ticker}</p>
                                        </div>
                                    </div>
                                    <div className={styles.stockItemRight}>
                                        <input className={styles.weightInput} type="number" min="0" max="100"
                                               value={st.weight}
                                               onChange={e => handleWeight(st.ticker, e.target.value)}/>
                                        <span className={styles.weightPct}>%</span>
                                        <button className={styles.removeBtn} onClick={() => handleRemove(st.ticker)}>✕
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {stocks.length > 0 && (
                                <div className={styles.weightFooter}>
                                    <span
                                        className={`${styles.weightTotal} ${totalWeight !== 100 ? styles.weightError : styles.weightOk}`}>
                                        비중 합계: {totalWeight}% {totalWeight === 100 ? '✓' : `(${100 - totalWeight > 0 ? '+' : ''}${100 - totalWeight}% 남음)`}
                                    </span>
                                    {totalWeight !== 100 && (
                                        <button className={styles.autoWeightBtn} onClick={handleAutoWeight}>균등
                                            배분</button>
                                    )}
                                </div>
                            )}

                            <button className={styles.addStockBtn} onClick={() => {
                                setSearchQuery('');
                                setSearchResults([]);
                                setShowSearchModal(true);
                            }}>
                                + 종목 추가하기
                            </button>
                        </div>

                        <button className={styles.rebalanceBtn} onClick={handleRebalance} disabled={loading}>
                            {loading ? '계산 중...' : '⚖ 리밸런싱 시뮬레이션 시작'}
                        </button>
                    </div>

                    {/* ── 오른쪽: 결과 ── */}
                    <div className={styles.resultSection} ref={resultRef}>
                        {!result && !loading && (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIllust}>📊</div>
                                <p className={styles.emptyTitle}>투자 정보를 모두 입력하고<br/>시뮬레이션 시작을 눌러주세요</p>
                                <p className={styles.emptyDesc}>리밸런싱 전/후의 가상 비교 결과가 표시됩니다.</p>
                            </div>
                        )}

                        {loading && (
                            <div className={styles.emptyState}>
                                <div className={styles.spinner}/>
                                <p className={styles.loadingText}>과거 데이터를 기반으로 리밸런싱을 시뮬레이션 중입니다...</p>
                            </div>
                        )}

                        {result && !loading && (
                            <>
                                <div className={styles.chartCard}>
                                    <div className={styles.chartTop}>
                                        <span className={styles.chartLabel}>포트폴리오 성장 시뮬레이션</span>
                                        <div className={styles.chartLegend}>
                                            {/* 범례 표시 */}
                                            <span style={{
                                                color: 'var(--color-primary)',
                                                fontWeight: '600',
                                                marginRight: '12px'
                                            }}>■ 예상 자산</span>
                                            <span style={{color: '#888', fontWeight: '600'}}>--- 목표 자산</span>
                                        </div>
                                    </div>

                                    <div style={{width: '100%', height: 260, marginTop: '20px'}}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ComposedChart
                                                data={result.chartData}
                                                // 💡 1. right 여백을 늘리고, left를 음수로 당겨서 중앙 밸런스를 맞춥니다.
                                                margin={{top: 10, right: 30, left: -15, bottom: 0}}
                                            >
                                                <defs>
                                                    <linearGradient id="colorMedian" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="var(--color-primary)"
                                                              stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="var(--color-primary)"
                                                              stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>

                                                <XAxis
                                                    dataKey="month"
                                                    tickFormatter={(tick) => `${tick}개월`}
                                                    // 💡 2. 축 선을 숨겨서 더 깔끔하게 만듭니다.
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{fill: 'var(--color-text-muted)', fontSize: 12}}
                                                    tickMargin={10}
                                                />

                                                <YAxis
                                                    tickFormatter={(tick) => currency === '원화' ? `${(tick / 10000).toLocaleString()}만` : tick.toLocaleString()}
                                                    // 💡 3. Y축 여백을 80에서 55로 줄이고, 선을 숨깁니다.
                                                    width={55}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{fill: 'var(--color-text-muted)', fontSize: 12}}
                                                />

                                                <CartesianGrid strokeDasharray="3 3" vertical={false}
                                                               stroke="var(--color-border-light)"/>

                                                <Tooltip content={<CustomTooltip currency={currency}/>}
                                                         cursor={{stroke: '#e4eaf5', strokeWidth: 1}}/>

                                                <Area
                                                    type="monotone"
                                                    dataKey="medianAmount"
                                                    stroke="var(--color-primary)"
                                                    fillOpacity={1}
                                                    fill="url(#colorMedian)"
                                                    strokeWidth={3}
                                                    name="예상 자산"
                                                />

                                                <Line
                                                    type="monotone"
                                                    dataKey="targetAmount"
                                                    stroke="#94a3b8"
                                                    strokeWidth={2}
                                                    name="목표 자산"
                                                    strokeDasharray="5 5"
                                                    dot={false}
                                                />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className={styles.achieveCard}>
                                    <span className={styles.achieveLabel}>시뮬레이션 달성 확률</span>
                                    <div className={styles.achieveRow}>
                                        <div className={styles.achieveTrack}>
                                            <div className={styles.achieveFill}
                                                 style={{width: `${result.successProbability}%`}}/>
                                        </div>
                                        <span className={styles.achieveVal}>{result.successProbability}%</span>
                                    </div>
                                    <p style={{marginTop: '10px', fontSize: '13px', color: 'var(--color-text-muted)'}}>
                                        {result.goalAchievementMessage}
                                    </p>
                                </div>

                                <div className={styles.statsGrid}>
                                    <div className={styles.statItem}>
                                        <p className={styles.statLabel}>최종 시뮬레이션 금액</p>
                                        <p className={styles.statVal}>{Number(result.finalAmount).toLocaleString()}<span
                                            className={styles.statUnit}>{currency}</span></p>
                                    </div>
                                    <div className={styles.statItem}>
                                        <p className={styles.statLabel}>연평균 수익률</p>
                                        <p className={`${styles.statVal} ${result.annualizedReturn >= 0 ? styles.pos : styles.neg}`}>
                                            {result.annualizedReturn > 0 ? '+' : ''}{result.annualizedReturn}%
                                        </p>
                                    </div>
                                    <div className={styles.statItem}>
                                        <p className={styles.statLabel}>최대 낙폭</p>
                                        <p className={`${styles.statVal} ${styles.neg}`}>{result.maxDrawdown}%</p>
                                    </div>
                                    <div className={styles.statItem}>
                                        <p className={styles.statLabel}>최고 연수익률</p>
                                        <p className={`${styles.statVal} ${result.bestAnnualReturn >= 0 ? styles.pos : styles.neg}`}>
                                            {result.bestAnnualReturn > 0 ? '+' : ''}{result.bestAnnualReturn}%
                                        </p>
                                    </div>
                                    <div className={styles.statItem}>
                                        <p className={styles.statLabel}>최저 연수익률</p>
                                        <p className={`${styles.statVal} ${styles.neg}`}>{result.worstAnnualReturn}%</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* 종목 검색 모달 */}
            {showSearchModal && (
                <div className={styles.modalOverlay} onClick={() => setShowSearchModal(false)}>
                    <div className={styles.searchModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.searchModalHeader}>
                            <p className={styles.searchModalTitle}>종목 검색</p>
                            <button className={styles.searchModalClose} onClick={() => setShowSearchModal(false)}>✕
                            </button>
                        </div>
                        <div className={styles.searchRow}>
                            <input className={styles.searchInput} type="text" placeholder="종목명 또는 티커 입력"
                                   value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                   onKeyDown={e => e.key === 'Enter' && handleSearch()} autoFocus/>
                            <button className={styles.searchBtn} onClick={handleSearch}>검색</button>
                        </div>
                        <div className={styles.searchResults}>
                            {searchResults.length === 0 ? (
                                <p className={styles.searchMsg}>{searchQuery ? '검색 결과가 없습니다' : '종목명이나 티커를 입력하세요'}</p>
                            ) : searchResults.map(st => {
                                const targetTicker = st.symbol || st.ticker;
                                const inList = stocks.find(s => s.ticker === targetTicker);
                                return (
                                    <div key={targetTicker} className={styles.resultItem}>
                                        <div className={styles.resultLeft}>
                                            <StockLogo ticker={targetTicker} name={st.assetName}/>
                                            <div>
                                                <p className={styles.resultName}>{st.assetName}</p>
                                                <p className={styles.resultInfo}>{targetTicker} · {st.market}</p>
                                            </div>
                                        </div>
                                        <div className={styles.resultRight}>
                                            <button className={`${styles.addBtn} ${inList ? styles.addBtnDone : ''}`}
                                                    onClick={() => !inList && handleAdd(st)} disabled={!!inList}>
                                                {inList ? '추가됨 ✓' : '+ 추가'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rebalancing;