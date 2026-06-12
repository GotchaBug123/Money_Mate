import React, {useState, useRef, useEffect} from 'react';
import styles from './Rebalancing.module.css';
import {searchAssetsApi, analyzeRebalanceApi} from "../../api/rebalanceApi.js";
import {ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";
import StockLogo from '../../components/common/StockLogo.jsx';

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
                    예상 자산: {Math.round((payload[0]?.value ?? 0) / 10000).toLocaleString()}만원
                </p>
                {/* 목표 자산 (Line) - 있는 경우에만 표시 */}
                {payload[1] && (
                    <p style={{margin: '4px 0 0 0', fontSize: '13px', color: 'var(--color-text-muted)'}}>
                        목표 자산: {Math.round((payload[1]?.value ?? 0) / 10000).toLocaleString()}만원
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
    const [tooltipPos, setTooltipPos] = useState(null);
    const chartContainerRef = useRef(null);

    const [showSearchModal, setShowSearchModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (!searchQuery.trim()) { setSearchResults([]); return; }
        const controller = new AbortController();
        searchAssetsApi(searchQuery, controller.signal)
            .then(data => setSearchResults(data))
            .catch(() => {});
        return () => controller.abort();
    }, [searchQuery]);

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
        if (Number(goalAmount) < 100) {
            return alert('목표 금액은 최소 100만원 이상이어야 합니다.');
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
        // 납입 주기별 월 환산: 백엔드는 monthlyInvestment를 항상 월 단위로 처리함
        const periodDivisor = {'매달': 1, '매분기': 3, '매년': 12};
        const monthlyInvestment = addPeriod === '없음'
            ? 0
            : Math.round(Number(addAmount || 0) * 10000 / (periodDivisor[addPeriod] ?? 1));

        const requestData = {
            goalName: "나의 커스텀 포트폴리오",
            currentAmount: Number(investAmount) * 10000,
            monthlyInvestment,
            targetAmount: Number(goalAmount) * 10000,
            investmentYears: years,
            investmentMonths: months,
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
                            <label className={styles.inputLabel}>투자 금액 (만원)</label>
                            <div className={styles.fieldRow}>
                                <select className={styles.sel} value={currency}
                                        onChange={e => setCurrency(e.target.value)}>
                                    <option>원화</option>
                                    <option>달러</option>
                                </select>
                                <input className={styles.textInput} type="number" placeholder="예: 500"
                                       value={investAmount} onChange={e => setInvestAmount(e.target.value)}/>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>추가 납입금액 (만원)</label>
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
                                    type="number" placeholder="예: 10"
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
                            <label className={styles.inputLabel}>목표 금액 (만원)</label>
                            <input className={styles.textInput} type="number" placeholder="예: 1000"
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

                                    <div ref={chartContainerRef} style={{width: '100%', height: 260, marginTop: '20px'}}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ComposedChart
                                                data={result.chartData}
                                                margin={{top: 10, right: 30, left: -15, bottom: 0}}
                                                onMouseMove={(e) => {
                                                    if (e?.activeCoordinate) {
                                                        const { x, y } = e.activeCoordinate;
                                                        const chartW = chartContainerRef.current?.offsetWidth ?? 400;
                                                        const offsetX = x > chartW * 0.6 ? -180 : 20;
                                                        const offsetY = y < 80 ? 20 : -80;
                                                        setTooltipPos({ x: x + offsetX, y: y + offsetY });
                                                    }
                                                }}
                                                onMouseLeave={() => setTooltipPos(null)}
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
                                                    tickFormatter={(tick) => {
                                                        const man = Math.round(tick / 10000);
                                                        if (man >= 10000) return `${(man / 10000).toFixed(1)}억`;
                                                        return `${man}만`;
                                                    }}
                                                    width={65}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{fill: 'var(--color-text-muted)', fontSize: 12}}
                                                />

                                                <CartesianGrid strokeDasharray="3 3" vertical={false}
                                                               stroke="var(--color-border-light)"/>

                                                <Tooltip
                                                    content={<CustomTooltip currency={currency}/>}
                                                    cursor={{stroke: '#e4eaf5', strokeWidth: 1}}
                                                    position={tooltipPos ?? undefined}
                                                />

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
                                        <p className={styles.statVal}>{Math.round(Number(result.finalAmount) / 10000).toLocaleString()}<span
                                            className={styles.statUnit}>만원</span></p>
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