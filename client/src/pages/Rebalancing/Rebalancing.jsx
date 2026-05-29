import React, { useState, useRef } from 'react';
import styles from './Rebalancing.module.css';

const LOGO_MAP = {
    '005930':'samsung.com','000660':'skhynix.com','NVDA':'nvidia.com',
    'AAPL':'apple.com','360750':'tigeretf.com','005380':'hyundai.com',
    '373220':'lgensol.com','035720':'kakao.com','TSM':'tsmc.com',
    'MU':'micron.com','MSFT':'microsoft.com','TSLA':'tesla.com',
};

const STOCK_LIST = [
    {id:1, name:'삼성전자',        ticker:'005930',market:'국내',price:'78,400원',  chg:'+2.61%',pos:true},
    {id:2, name:'SK하이닉스',      ticker:'000660',market:'국내',price:'198,500원', chg:'-0.88%',pos:false},
    {id:3, name:'NVIDIA',          ticker:'NVDA',  market:'해외',price:'$1,208.88',chg:'+3.14%',pos:true},
    {id:4, name:'TIGER 미국S&P500',ticker:'360750',market:'ETF', price:'18,245원', chg:'-0.42%',pos:false},
    {id:5, name:'Apple',           ticker:'AAPL',  market:'해외',price:'$196.89',  chg:'+0.54%',pos:true},
    {id:6, name:'현대차',          ticker:'005380',market:'국내',price:'245,000원', chg:'-1.20%',pos:false},
    {id:7, name:'LG에너지솔루션',  ticker:'373220',market:'국내',price:'412,000원', chg:'+2.55%',pos:true},
    {id:8, name:'카카오',          ticker:'035720',market:'국내',price:'52,300원',  chg:'-0.19%',pos:false},
    {id:9, name:'TSMC',            ticker:'TSM',   market:'해외',price:'$185.40',  chg:'+1.22%',pos:true},
    {id:10,name:'마이크론',        ticker:'MU',    market:'해외',price:'$132.50',  chg:'+0.74%',pos:true},
    {id:11,name:'Microsoft',       ticker:'MSFT',  market:'해외',price:'$420.21',  chg:'+0.32%',pos:true},
    {id:12,name:'Tesla',           ticker:'TSLA',  market:'해외',price:'$178.82',  chg:'-2.14%',pos:false},
];

const searchStocks = (query) => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return STOCK_LIST.filter(s =>
        s.name.toLowerCase().includes(q) || s.ticker.toLowerCase().includes(q)
    );
};

const BADGE_COLORS = ['#E8F0FE','#EDFAF4','#FFF0EE','#FAEEDA','#F0F4FF','#FEF0F8','#EEF8FF','#F5F0FF'];
const BADGE_TEXT   = ['#1B5ED9','#1A7A45','#C0392B','#B47D0C','#2E5CD9','#C03980','#0C7CD9','#7B3FA0'];

const getBadge = (ticker) => {
    const idx = ticker.split('').reduce((a,c) => a + c.charCodeAt(0), 0) % BADGE_COLORS.length;
    return { bg: BADGE_COLORS[idx], color: BADGE_TEXT[idx] };
};

const StockLogo = ({ ticker, name }) => {
    const [failed, setFailed] = useState(false);
    const domain = LOGO_MAP[ticker];
    const badge  = getBadge(ticker);
    if (!domain || failed) return (
        <div className={styles.logoBadge} style={{ background:badge.bg, color:badge.color }}>
            {name.charAt(0)}
        </div>
    );
    return <img className={styles.logoImg} src={`https://logo.clearbit.com/${domain}`}
                alt={name} onError={() => setFailed(true)} />;
};

const MOCK_RESULT = (investAmount) => ({
    achievementRate: 74,
    finalAmount: Math.round(Number(investAmount) * 1.38),
    avgReturnRate: 11.2,
    maxDrawdown: -15.4,
    minAnnualReturn: -6.8,
    maxAnnualReturn: 29.3,
});

const Rebalancing = () => {
    const resultRef = useRef(null);

    const [currency,      setCurrency]      = useState('원화');
    const [investAmount,  setInvestAmount]  = useState('');
    const [addPeriod,     setAddPeriod]     = useState('없음');
    const [addAmount,     setAddAmount]     = useState('');
    const [startDate,     setStartDate]     = useState('');
    const [endDate,       setEndDate]       = useState('');
    const [goalAmount,    setGoalAmount]    = useState('');
    const [stocks,        setStocks]        = useState([]);
    const [result,        setResult]        = useState(null);
    const [loading,       setLoading]       = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [searchQuery,     setSearchQuery]     = useState('');
    const [searchResults,   setSearchResults]   = useState([]);

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        setSearchResults(searchStocks(searchQuery));
    };

    const handleAdd = (stock) => {
        if (stocks.find(s => s.ticker === stock.ticker)) { alert('이미 추가된 종목입니다.'); return; }
        const newStocks = [...stocks, { ...stock, weight: 0 }];
        const eq = Math.floor(100 / newStocks.length);
        const rem = 100 - eq * newStocks.length;
        setStocks(newStocks.map((s,i) => ({ ...s, weight: i===0 ? eq+rem : eq })));
    };

    const handleRemove = (ticker) => {
        const newStocks = stocks.filter(s => s.ticker !== ticker);
        if (!newStocks.length) { setStocks([]); return; }
        const eq = Math.floor(100 / newStocks.length);
        const rem = 100 - eq * newStocks.length;
        setStocks(newStocks.map((s,i) => ({ ...s, weight: i===0 ? eq+rem : eq })));
    };

    const handleWeight = (ticker, val) =>
        setStocks(stocks.map(s => s.ticker===ticker ? { ...s, weight: Number(val) } : s));

    const totalWeight = stocks.reduce((sum,s) => sum + Number(s.weight), 0);

    const handleAutoWeight = () => {
        if (!stocks.length) return;
        const eq = Math.floor(100 / stocks.length);
        const rem = 100 - eq * stocks.length;
        setStocks(stocks.map((s,i) => ({ ...s, weight: i===0 ? eq+rem : eq })));
    };

    const handleRebalance = async () => {
        if (!investAmount || !startDate || !endDate || !goalAmount) {
            alert('투자 금액, 기간, 목표 금액을 모두 입력해주세요.'); return;
        }
        if (!stocks.length) { alert('최소 1개 이상의 종목을 추가해주세요.'); return; }
        if (totalWeight !== 100) { alert(`비중 합계가 ${totalWeight}%입니다. 100%가 되어야 합니다.`); return; }
        setLoading(true);
        try {
            await new Promise(res => setTimeout(res, 1000));
            setResult(MOCK_RESULT(investAmount));
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior:'smooth', block:'start' }), 100);
        } catch {
            alert('리밸런싱 확인 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.pageHeader}>
                <div className={styles.pageHeaderIcon}>🔄</div>
                <div>
                    <p className={styles.pageHeaderTitle}>리밸런싱 시뮬레이션</p>
                    <p className={styles.pageHeaderDesc}>투자 정보를 입력하고 리밸런싱 결과를 확인해보세요.</p>
                </div>
            </div>

            <div className={styles.layout}>
                {/* ── 왼쪽: 입력 폼 ── */}
                <div className={styles.formSection}>

                    {/* 투자 금액 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>투자 금액</label>
                        <div className={styles.fieldRow}>
                            <select className={styles.sel} value={currency} onChange={e=>setCurrency(e.target.value)}>
                                <option>원화</option>
                                <option>달러</option>
                            </select>
                            <input className={styles.textInput} type="number" placeholder="금액 입력"
                                   value={investAmount} onChange={e=>setInvestAmount(e.target.value)} />
                        </div>
                    </div>

                    {/* 추가 납입금액 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>추가 납입금액</label>
                        <div className={styles.fieldRow}>
                            <select className={styles.sel} value={addPeriod} onChange={e=>{setAddPeriod(e.target.value); if(e.target.value==='없음') setAddAmount('');}}>
                                <option>없음</option>
                                <option>매달</option>
                                <option>매분기</option>
                                <option>매년</option>
                            </select>
                            <input
                                className={addPeriod==='없음' ? styles.disabledInput : styles.textInput}
                                type="number"
                                placeholder="금액 입력"
                                value={addAmount}
                                onChange={e=>setAddAmount(e.target.value)}
                                disabled={addPeriod==='없음'}
                            />
                        </div>
                    </div>

                    {/* 투자 목표 기간 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>투자 목표 기간</label>
                        <div className={styles.dateRow}>
                            <input className={styles.dateInput} type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} />
                            <span className={styles.dateSep}>~</span>
                            <input className={styles.dateInput} type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} />
                        </div>
                    </div>

                    {/* 목표 금액 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>목표 금액</label>
                        <input className={styles.textInput} type="number" placeholder="목표 금액 입력"
                               value={goalAmount} onChange={e=>setGoalAmount(e.target.value)} />
                    </div>

                    {/* 주식 종목 */}
                    <div className={styles.inputGroup}>
                        <div className={styles.stockHeader}>
                            <label className={styles.inputLabel}>주식 종목</label>
                            <span className={styles.stockCount}>{stocks.length}개</span>
                        </div>
                        {stocks.map(st => (
                            <div key={st.ticker} className={styles.stockItem}>
                                <div className={styles.stockItemLeft}>
                                    <StockLogo ticker={st.ticker} name={st.name} />
                                    <div>
                                        <p className={styles.stockItemName}>{st.name}</p>
                                        <p className={styles.stockItemTicker}>{st.ticker}</p>
                                    </div>
                                </div>
                                <div className={styles.stockItemRight}>
                                    <input className={styles.weightInput} type="number" min="0" max="100"
                                           value={st.weight} onChange={e=>handleWeight(st.ticker, e.target.value)} />
                                    <span className={styles.weightPct}>%</span>
                                    <button className={styles.removeBtn} onClick={() => handleRemove(st.ticker)}>✕</button>
                                </div>
                            </div>
                        ))}
                        {stocks.length > 0 && (
                            <div className={styles.weightFooter}>
                                <span className={`${styles.weightTotal} ${totalWeight!==100 ? styles.weightError : styles.weightOk}`}>
                                    비중 합계: {totalWeight}% {totalWeight===100 ? '✓' : `(${100-totalWeight > 0 ? '+' : ''}${100-totalWeight}% 남음)`}
                                </span>
                                {totalWeight !== 100 && (
                                    <button className={styles.autoWeightBtn} onClick={handleAutoWeight}>균등 배분</button>
                                )}
                            </div>
                        )}
                        <button className={styles.addStockBtn} onClick={() => {
                            setSearchQuery(''); setSearchResults([]); setShowSearchModal(true);
                        }}>
                            + 종목 추가
                        </button>
                    </div>

                    <button className={styles.rebalanceBtn} onClick={handleRebalance} disabled={loading}>
                        {loading ? '계산 중...' : '⚖ 리밸런싱 확인'}
                    </button>
                </div>

                {/* ── 오른쪽: 결과 ── */}
                <div className={styles.resultSection} ref={resultRef}>
                    {!result && !loading && (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIllust}>📊</div>
                            <p className={styles.emptyTitle}>투자 정보를 입력하고<br/>리밸런싱 확인을 눌러주세요</p>
                            <p className={styles.emptyDesc}>리밸런싱 결과가 여기에 표시됩니다.</p>
                        </div>
                    )}
                    {loading && (
                        <div className={styles.emptyState}>
                            <div className={styles.spinner} />
                            <p className={styles.loadingText}>리밸런싱을 계산하고 있습니다...</p>
                        </div>
                    )}
                    {result && !loading && (
                        <>
                            <div className={styles.chartCard}>
                                <div className={styles.chartTop}>
                                    <span className={styles.chartLabel}>포트폴리오 성장 시뮬레이션</span>
                                    <div className={styles.chartLegend}>
                                        <span className={styles.legendBlue}>─ 리밸런싱 후</span>
                                        <span className={styles.legendGray}>- - 리밸런싱 전</span>
                                    </div>
                                </div>
                                <svg width="100%" height="200" viewBox="0 0 600 180" preserveAspectRatio="none" className={styles.chartSvg}>
                                    <polyline points="0,160 75,135 150,115 225,90 300,68 375,48 450,28 525,14 600,4"
                                              fill="none" stroke="#185FA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <polyline points="0,160 75,155 150,158 225,148 300,145 375,140 450,132 525,125 600,118"
                                              fill="none" stroke="#e0e0e0" strokeWidth="1.5" strokeDasharray="6,4"/>
                                </svg>
                            </div>
                            <div className={styles.achieveCard}>
                                <span className={styles.achieveLabel}>달성 확률</span>
                                <div className={styles.achieveRow}>
                                    <div className={styles.achieveTrack}>
                                        <div className={styles.achieveFill} style={{ width:`${result.achievementRate}%` }} />
                                    </div>
                                    <span className={styles.achieveVal}>{result.achievementRate}%</span>
                                </div>
                            </div>
                            <div className={styles.statsGrid}>
                                <div className={styles.statItem}>
                                    <p className={styles.statLabel}>최종금액</p>
                                    <p className={styles.statVal}>{Number(result.finalAmount).toLocaleString()}<span className={styles.statUnit}>{currency}</span></p>
                                </div>
                                <div className={styles.statItem}>
                                    <p className={styles.statLabel}>연평균 수익률</p>
                                    <p className={`${styles.statVal} ${styles.pos}`}>+{result.avgReturnRate}%</p>
                                </div>
                                <div className={styles.statItem}>
                                    <p className={styles.statLabel}>최대 낙폭</p>
                                    <p className={`${styles.statVal} ${styles.neg}`}>{result.maxDrawdown}%</p>
                                </div>
                                <div className={styles.statItem}>
                                    <p className={styles.statLabel}>최고 연수익률</p>
                                    <p className={`${styles.statVal} ${styles.pos}`}>+{result.maxAnnualReturn}%</p>
                                </div>
                                <div className={styles.statItem}>
                                    <p className={styles.statLabel}>최저 연수익률</p>
                                    <p className={`${styles.statVal} ${styles.neg}`}>{result.minAnnualReturn}%</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* 종목 검색 모달 */}
            {showSearchModal && (
                <div className={styles.modalOverlay} onClick={() => setShowSearchModal(false)}>
                    <div className={styles.searchModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.searchModalHeader}>
                            <p className={styles.searchModalTitle}>종목 검색</p>
                            <button className={styles.searchModalClose} onClick={() => setShowSearchModal(false)}>✕</button>
                        </div>
                        <div className={styles.searchRow}>
                            <input className={styles.searchInput} type="text" placeholder="종목명 또는 티커 입력"
                                   value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                   onKeyDown={e => e.key==='Enter' && handleSearch()} autoFocus />
                            <button className={styles.searchBtn} onClick={handleSearch}>검색</button>
                        </div>
                        <div className={styles.searchResults}>
                            {searchResults.length === 0 ? (
                                <p className={styles.searchMsg}>{searchQuery ? '검색 결과가 없습니다' : '종목명이나 티커를 입력하세요'}</p>
                            ) : searchResults.map(st => {
                                const inList = stocks.find(s => s.ticker === st.ticker);
                                return (
                                    <div key={st.ticker} className={styles.resultItem}>
                                        <div className={styles.resultLeft}>
                                            <StockLogo ticker={st.ticker} name={st.name} />
                                            <div>
                                                <p className={styles.resultName}>{st.name}</p>
                                                <p className={styles.resultInfo}>{st.ticker} · {st.market} · {st.price}</p>
                                            </div>
                                        </div>
                                        <div className={styles.resultRight}>
                                            <span className={st.pos ? styles.resultPos : styles.resultNeg}>{st.chg}</span>
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