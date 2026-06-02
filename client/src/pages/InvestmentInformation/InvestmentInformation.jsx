import React, {useState} from 'react';
import styles from './InvestmentInformation.module.css';

const LOGO_MAP = {
    '005930': 'samsung.com', '000660': 'skhynix.com', 'NVDA': 'nvidia.com',
    'AAPL': 'apple.com', '360750': 'tigeretf.com', '005380': 'hyundai.com',
    '373220': 'lgensol.com', '035720': 'kakao.com', 'TSM': 'tsmc.com',
    'MU': 'micron.com', 'MSFT': 'microsoft.com', 'GOOGL': 'google.com',
    'AMZN': 'amazon.com', 'META': 'meta.com', 'TSLA': 'tesla.com',
};

// 💡 뱃지 색상은 다양성을 위해 유지
const BADGE_COLORS = ['#E8F0FE', '#EDFAF4', '#FFF0EE', '#FAEEDA', '#F0F4FF', '#FEF0F8', '#EEF8FF', '#F5F0FF'];
const BADGE_TEXT = ['#1B5ED9', '#1A7A45', '#C0392B', '#B47D0C', '#2E5CD9', '#C03980', '#0C7CD9', '#7B3FA0'];

const getBadge = (ticker) => {
    const idx = ticker.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % BADGE_COLORS.length;
    return {bg: BADGE_COLORS[idx], color: BADGE_TEXT[idx]};
};

const StockLogo = ({ticker, name, size = 36}) => {
    const [failed, setFailed] = useState(false);
    const domain = LOGO_MAP[ticker];
    const badge = getBadge(ticker);
    if (!domain || failed) return (
        <div className={styles.logoBadge} style={{
            width: size,
            height: size,
            background: badge.bg,
            color: badge.color,
            fontSize: size * 0.35,
            borderRadius: '50%'
        }}>
            {name.charAt(0)}
        </div>
    );
    return <img className={styles.logoImg} style={{width: size, height: size, borderRadius: '50%'}}
                src={`https://logo.clearbit.com/${domain}`} alt={name} onError={() => setFailed(true)}/>;
};

const MOCK_INDEX = [
    {
        label: '코스피',
        value: '2,634.82',
        change: '+32.14',
        changeRate: '+1.24%',
        pos: true,
        chart: [0, 4, 6, 10, 12, 16, 18, 22, 24, 20, 22, 26]
    },
    {
        label: '코스닥',
        value: '728.15',
        change: '-2.82',
        changeRate: '-0.38%',
        pos: false,
        chart: [24, 22, 20, 18, 16, 14, 12, 10, 12, 8, 6, 4]
    },
    {
        label: 'S&P 500',
        value: '5,304.72',
        change: '+45.88',
        changeRate: '+0.87%',
        pos: true,
        chart: [4, 6, 4, 10, 8, 14, 12, 18, 16, 20, 22, 26]
    },
    {
        label: '달러 환율',
        value: '1,342.50',
        change: '-1.60',
        changeRate: '-0.12%',
        pos: false,
        chart: [6, 8, 7, 12, 14, 16, 14, 18, 20, 22, 24, 26]
    },
];

const MOCK_STOCKS = [
    {id: 1, name: '삼성전자', ticker: '005930', market: '국내', price: '78,400원', chg: '+2.61%', pos: true, vol: '2.1조'},
    {
        id: 2,
        name: 'SK하이닉스',
        ticker: '000660',
        market: '국내',
        price: '198,500원',
        chg: '-0.88%',
        pos: false,
        vol: '8,420억'
    },
    {id: 3, name: 'NVIDIA', ticker: 'NVDA', market: '해외', price: '$1,208.88', chg: '+3.14%', pos: true, vol: '$18.4B'},
    {
        id: 4,
        name: 'TIGER 미국S&P500',
        ticker: '360750',
        market: 'ETF',
        price: '18,245원',
        chg: '-0.42%',
        pos: false,
        vol: '3,820억'
    },
    {id: 5, name: 'Apple', ticker: 'AAPL', market: '해외', price: '$196.89', chg: '+0.54%', pos: true, vol: '$9.2B'},
    {id: 6, name: '현대차', ticker: '005380', market: '국내', price: '245,000원', chg: '-1.20%', pos: false, vol: '1.4조'},
    {id: 7, name: 'LG에너지솔루션', ticker: '373220', market: '국내', price: '412,000원', chg: '+2.55%', pos: true, vol: '1.1조'},
    {id: 8, name: '카카오', ticker: '035720', market: '국내', price: '52,300원', chg: '-0.19%', pos: false, vol: '2.3조'},
    {id: 9, name: 'TSMC', ticker: 'TSM', market: '해외', price: '$185.40', chg: '+1.22%', pos: true, vol: '$4.1B'},
    {id: 10, name: '마이크론', ticker: 'MU', market: '해외', price: '$132.50', chg: '+0.74%', pos: true, vol: '$2.8B'},
    {id: 11, name: 'Microsoft', ticker: 'MSFT', market: '해외', price: '$420.21', chg: '+0.32%', pos: true, vol: '$8.1B'},
    {id: 12, name: 'Tesla', ticker: 'TSLA', market: '해외', price: '$178.82', chg: '-2.14%', pos: false, vol: '$6.3B'},
    {id: 13, name: 'Amazon', ticker: 'AMZN', market: '해외', price: '$185.07', chg: '+1.08%', pos: true, vol: '$5.9B'},
    {id: 14, name: 'Meta', ticker: 'META', market: '해외', price: '$492.30', chg: '+0.77%', pos: true, vol: '$4.2B'},
    {id: 15, name: 'Google', ticker: 'GOOGL', market: '해외', price: '$175.84', chg: '+0.45%', pos: true, vol: '$3.8B'},
    {
        id: 16,
        name: 'POSCO홀딩스',
        ticker: '005490',
        market: '국내',
        price: '392,000원',
        chg: '+0.33%',
        pos: true,
        vol: '4,200억'
    },
    {
        id: 17,
        name: '에코프로비엠',
        ticker: '247540',
        market: '국내',
        price: '118,500원',
        chg: '-2.11%',
        pos: false,
        vol: '6,800억'
    },
    {
        id: 18,
        name: 'KODEX 2차전지',
        ticker: '305720',
        market: 'ETF',
        price: '12,340원',
        chg: '-1.45%',
        pos: false,
        vol: '2,100억'
    },
    {
        id: 19,
        name: 'KODEX 반도체',
        ticker: '091160',
        market: 'ETF',
        price: '45,600원',
        chg: '+1.88%',
        pos: true,
        vol: '1,540억'
    },
    {id: 20, name: '기아', ticker: '000270', market: '국내', price: '98,400원', chg: '-0.61%', pos: false, vol: '3,200억'},
];

const MOCK_THEMES = [
    {
        name: 'AI 테마',
        avg: '+2.1%',
        pos: true,
        stocks: [{n: 'NVIDIA', c: '+3.14%', p: true}, {n: '삼성전자', c: '+2.61%', p: true}, {
            n: 'SK하이닉스',
            c: '-0.88%',
            p: false
        }]
    },
    {
        name: '반도체 테마',
        avg: '+0.9%',
        pos: true,
        stocks: [{n: 'SK하이닉스', c: '-0.88%', p: false}, {n: 'TSMC', c: '+1.22%', p: true}, {
            n: '마이크론',
            c: '+0.74%',
            p: true
        }]
    },
    {
        name: '2차전지 테마',
        avg: '-1.2%',
        pos: false,
        stocks: [{n: 'LG에너지솔루션', c: '-1.45%', p: false}, {n: 'POSCO홀딩스', c: '+0.33%', p: true}, {
            n: '에코프로비엠',
            c: '-2.11%',
            p: false
        }]
    },
];

const MOCK_DIVIDEND = [
    {
        title: '국내 고배당주', market: 'domestic',
        list: [
            {id: 'd1', name: 'KT&G', price: '88,500원', yield: '6.8%', freq: '연 배당 2회'},
            {id: 'd2', name: '하나금융지주', price: '62,400원', yield: '6.2%', freq: '연 배당 4회'},
            {id: 'd3', name: '우리금융지주', price: '14,250원', yield: '5.9%', freq: '연 배당 4회'},
            {id: 'd4', name: '기업은행', price: '13,800원', yield: '5.5%', freq: '연 배당 2회'},
        ]
    },
    {
        title: '해외 고배당주', market: 'foreign',
        list: [
            {id: 'd5', name: 'Altria Group', price: '$44.20', yield: '9.1%', freq: '분기 배당'},
            {id: 'd6', name: 'AT&T', price: '$16.80', yield: '6.7%', freq: '분기 배당'},
            {id: 'd7', name: 'Verizon', price: '$39.40', yield: '6.4%', freq: '분기 배당'},
            {id: 'd8', name: 'Realty Income', price: '$52.30', yield: '5.9%', freq: '월 배당'},
        ]
    },
    {
        title: 'ETF 고배당', market: 'etf',
        list: [
            {id: 'd9', name: 'TIGER 리츠부동산', price: '4,850원', yield: '5.4%', freq: '월 배당'},
            {id: 'd10', name: 'KODEX 배당가치', price: '11,240원', yield: '4.8%', freq: '분기 배당'},
            {id: 'd11', name: 'SCHD', price: '$27.80', yield: '3.6%', freq: '분기 배당'},
            {id: 'd12', name: 'VYM', price: '$118.40', yield: '3.1%', freq: '분기 배당'},
        ]
    },
];

const FILTERS = ['전체', '국내', '해외', 'ETF'];
const SORTS = ['거래대금', '거래량', '급상승', '급하락'];
const THEMES = ['전체', 'AI', '반도체', '2차전지', '자동차', '광통신'];
const PERIODS = ['1일', '1주일', '1개월', '3개월', '1년', '올해'];
const DETAIL_SORTS = ['수익률 상승', '수익률 하락', '거래대금'];
const DIV_SORTS = ['배당 수익률순', '배당금순', '시가총액순'];
const PAGE = 10;

const SIDEBAR_TABS = [
    {key: 'cart', label: '장바구니', icon: '🛒'},
    {key: 'like', label: '좋아요', icon: '❤️'},
    {key: 'recent', label: '최근 본', icon: '🕐'},
];

// 💡 하드코딩된 색상 제거 및 글로벌 변수 적용
const Spark = ({data, pos}) => {
    const W = 80, H = 28, min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * (H - 4) + 2}`).join(' ');
    return (
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
            <polyline points={pts} fill="none" stroke={pos ? 'var(--color-success)' : 'var(--color-error)'}
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
};

const InvestmentInformation = () => {
    const [filter, setFilter] = useState('전체');
    const [sort, setSort] = useState('거래대금');
    const [theme, setTheme] = useState('전체');
    const [query, setQuery] = useState('');
    const [showCount, setShowCount] = useState(PAGE);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarTab, setSidebarTab] = useState('cart');
    const [cart, setCart] = useState([1, 3]);
    const [likes, setLikes] = useState([2]);
    const [recent, setRecent] = useState([1, 2, 3]);

    const [themePanel, setThemePanel] = useState(null);
    const [detailPeriod, setDetailPeriod] = useState('1일');
    const [detailSort, setDetailSort] = useState('수익률 상승');
    const [detailShowAll, setDetailShowAll] = useState(false);
    const [detailSelected, setDetailSelected] = useState([]);

    const [divPanel, setDivPanel] = useState(null);
    const [divSort, setDivSort] = useState('배당 수익률순');
    const [divSelected, setDivSelected] = useState([]);

    const filtered = MOCK_STOCKS.filter(s =>
        (filter === '전체' || s.market === filter) &&
        (!query || s.name.includes(query) || s.ticker.toLowerCase().includes(query.toLowerCase()))
    );
    const visible = filtered.slice(0, showCount);

    const addRecent = (id) => setRecent(p => [id, ...p.filter(x => x !== id)].slice(0, 20));

    const toggleCart = (e, id) => {
        e.stopPropagation();
        setCart(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
        addRecent(id);
    };
    const toggleLike = (e, id) => {
        e.stopPropagation();
        setLikes(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
        addRecent(id);
    };

    const sidebarData = sidebarTab === 'cart'
        ? MOCK_STOCKS.filter(s => cart.includes(s.id))
        : sidebarTab === 'like'
            ? MOCK_STOCKS.filter(s => likes.includes(s.id))
            : MOCK_STOCKS.filter(s => recent.includes(s.id));

    const openThemePanel = (th) => {
        setThemePanel(th);
        setDetailPeriod('1일');
        setDetailSort('수익률 상승');
        setDetailShowAll(false);
        setDetailSelected([]);
        setDivPanel(null);
    };

    const toggleDetailSelect = (id) =>
        setDetailSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

    const handleDetailCart = () => {
        if (!detailSelected.length) {
            alert('담을 종목을 선택해주세요.');
            return;
        }
        setCart(p => [...new Set([...p, ...detailSelected])]);
        detailSelected.forEach(id => addRecent(id));
        alert(`${detailSelected.length}개 종목이 장바구니에 담겼습니다!`);
        setDetailSelected([]);
    };

    const detailStocks = [...MOCK_STOCKS].sort((a, b) => {
        if (detailSort === '수익률 상승') return (b.pos ? 1 : 0) - (a.pos ? 1 : 0) || parseFloat(b.chg) - parseFloat(a.chg);
        if (detailSort === '수익률 하락') return (a.pos ? 1 : 0) - (b.pos ? 1 : 0) || parseFloat(a.chg) - parseFloat(b.chg);
        return 0;
    });
    const detailVisible = detailShowAll ? detailStocks : detailStocks.slice(0, 6);

    const openDivPanel = (d) => {
        setDivPanel(d);
        setDivSort('배당 수익률순');
        setDivSelected([]);
        setThemePanel(null);
    };

    const toggleDivSelect = (id) =>
        setDivSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

    const handleDivCart = () => {
        if (!divSelected.length) {
            alert('담을 종목을 선택해주세요.');
            return;
        }
        alert(`${divSelected.length}개 종목이 장바구니에 담겼습니다!`);
        setDivSelected([]);
    };

    return (
        <div className={styles.wrap}>
            <div className={`${styles.main} ${sidebarOpen ? styles.mainShifted : ''}`}>

                <div className={styles.topBar}>
                    <button className={styles.sidebarToggle} onClick={() => setSidebarOpen(o => !o)}>
                        <span>🛒</span>
                        관심 주식
                        {(cart.length + likes.length) > 0 && (
                            <span className={styles.toggleBadge}>{cart.length + likes.length}</span>
                        )}
                    </button>
                </div>

                <div className={styles.idxGrid}>
                    {MOCK_INDEX.map((d, i) => (
                        <div key={i} className={styles.idxCard}>
                            <span className={styles.idxLabel}>{d.label}</span>
                            <span className={styles.idxVal}>{d.value}</span>
                            <div className={styles.idxBot}>
                                <span className={d.pos ? styles.idxPos : styles.idxNeg}>{d.change}</span>
                                <span className={d.pos ? styles.idxBadgePos : styles.idxBadgeNeg}>{d.changeRate}</span>
                            </div>
                            <Spark data={d.chart} pos={d.pos}/>
                        </div>
                    ))}
                </div>

                <div className={styles.chartCard}>
                    <div className={styles.ccTop}>
                        <span className={styles.ccTitle}>실시간 차트</span>
                        <div className={styles.ccRight}>
                            <input className={styles.srch} placeholder="종목명 또는 티커 검색"
                                   value={query} onChange={e => {
                                setQuery(e.target.value);
                                setShowCount(PAGE);
                            }}/>
                            <button className={styles.srchBtn}>검색</button>
                        </div>
                    </div>
                    <div className={styles.filterRow}>
                        <div className={styles.ftabs}>
                            {FILTERS.map(f => (
                                <button key={f} className={`${styles.ftab} ${filter === f ? styles.ftabOn : ''}`}
                                        onClick={() => {
                                            setFilter(f);
                                            setShowCount(PAGE);
                                        }}>{f}</button>
                            ))}
                        </div>
                        <div className={styles.stabs}>
                            {SORTS.map(s => (
                                <button key={s} className={`${styles.stab} ${sort === s ? styles.stabOn : ''}`}
                                        onClick={() => setSort(s)}>{s}</button>
                            ))}
                        </div>
                    </div>
                    <div className={styles.listHdr}>
                        <span>순위</span><span>종목</span><span>현재가</span><span>등락률</span><span>거래대금</span><span>담기</span>
                    </div>
                    {visible.map((s, i) => (
                        <div key={s.id} className={styles.srow}>
                            <span className={styles.sn}>{i + 1}</span>
                            <div className={styles.sInfo}>
                                <StockLogo ticker={s.ticker} name={s.name} size={36}/>
                                <div className={styles.si}>
                                    <div className={styles.sname}>{s.name}</div>
                                    <div className={styles.stick}>{s.ticker} · {s.market}</div>
                                </div>
                            </div>
                            <span className={styles.sp}>{s.price}</span>
                            <span className={s.pos ? styles.spos : styles.sneg}>{s.chg}</span>
                            <span className={styles.sv}>{s.vol}</span>
                            <div className={styles.sbts}>
                                <button className={`${styles.sbt} ${cart.includes(s.id) ? styles.sbtCartOn : ''}`}
                                        onClick={e => toggleCart(e, s.id)} title="장바구니">🛒
                                </button>
                                <button className={`${styles.sbt} ${likes.includes(s.id) ? styles.sbtLikeOn : ''}`}
                                        onClick={e => toggleLike(e, s.id)} title="좋아요">❤️
                                </button>
                            </div>
                        </div>
                    ))}
                    {showCount < filtered.length && (
                        <button className={styles.moreBtn}
                                onClick={() => setShowCount(c => Math.min(c + PAGE, Math.min(100, filtered.length)))}>
                            더보기 ({showCount}/{filtered.length}) ▼
                        </button>
                    )}
                </div>

                <div className={styles.section}>
                    <span className={styles.secTitle}>테마별 주식</span>
                    <div className={styles.pillRow}>
                        {THEMES.map(t => (
                            <button key={t} className={`${styles.pill} ${theme === t ? styles.pillOn : ''}`}
                                    onClick={() => setTheme(t)}>{t}</button>
                        ))}
                    </div>
                    <div className={styles.themeGrid}>
                        {MOCK_THEMES.map((th, i) => (
                            <div key={i} className={`${styles.tc} ${themePanel === th ? styles.tcActive : ''}`}>
                                <div className={styles.tcTop}>
                                    <span className={styles.tcName}>{th.name}</span>
                                    <span className={th.pos ? styles.tcBadgePos : styles.tcBadgeNeg}>{th.avg} 평균</span>
                                </div>
                                {th.stocks.map((st, j) => (
                                    <div key={j} className={styles.tcRow}>
                                        <span className={styles.tcSn}>{st.n}</span>
                                        <span className={st.p ? styles.tcSp : styles.tcSng}>{st.c}</span>
                                    </div>
                                ))}
                                <button className={styles.tcMore} onClick={() => openThemePanel(th)}>자세히 보기 →</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <span className={styles.secTitle}>배당금 TOP 10</span>
                    <div className={styles.divGrid}>
                        {MOCK_DIVIDEND.map((d, i) => (
                            <div key={i} className={`${styles.dc} ${divPanel === d ? styles.dcActive : ''}`}>
                                <div className={styles.dcHead}>{d.title}</div>
                                {d.list.map((item, j) => (
                                    <div key={j} className={styles.dcRow}>
                                        <span className={styles.dcN}>{item.name}</span>
                                        <span className={styles.dcY}>{item.yield}</span>
                                    </div>
                                ))}
                                <button className={styles.dcMore} onClick={() => openDivPanel(d)}>자세히 보기 →</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sbHeader}>
                    <span className={styles.sbTitle}>관심 주식</span>
                    <button className={styles.sbClose} onClick={() => setSidebarOpen(false)}>✕</button>
                </div>
                <div className={styles.sbTabs}>
                    {SIDEBAR_TABS.map(t => (
                        <button key={t.key}
                                className={`${styles.sbTab} ${sidebarTab === t.key ? styles.sbTabOn : ''}`}
                                onClick={() => setSidebarTab(t.key)}>
                            {t.icon} {t.label}
                            <span className={`${styles.sbBadge} ${sidebarTab === t.key ? styles.sbBadgeOn : ''}`}>
                                {t.key === 'cart' ? cart.length : t.key === 'like' ? likes.length : recent.length}
                            </span>
                        </button>
                    ))}
                </div>
                <div className={styles.sbBody}>
                    {sidebarData.length === 0 ? (
                        <p className={styles.sbEmpty}>아직 없어요</p>
                    ) : sidebarData.map((s, i) => (
                        <div key={i} className={styles.sbItem}>
                            <div className={styles.sbItemLeft}>
                                <StockLogo ticker={s.ticker} name={s.name} size={36}/>
                                <div>
                                    <div className={styles.sbItemName}>{s.name}</div>
                                    <div className={styles.sbItemTicker}>{s.ticker}</div>
                                </div>
                            </div>
                            <div style={{textAlign: 'right'}}>
                                <div className={styles.sbItemPrice}>{s.price}</div>
                                <div className={s.pos ? styles.sbItemPos : styles.sbItemNeg}>{s.chg}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {themePanel && (
                <div className={styles.themeOverlay} onClick={() => setThemePanel(null)}>
                    <div className={styles.themeDetailPanel} onClick={e => e.stopPropagation()}>
                        <div className={styles.tpHeader}>
                            <div className={styles.tpTitleRow}>
                                <span className={styles.tpTitle}>{themePanel.name}</span>
                                <span className={themePanel.pos ? styles.tpBadgePos : styles.tpBadgeNeg}>
                                    {themePanel.pos ? '↑' : '↓'} {themePanel.avg} 평균
                                </span>
                            </div>
                            <button className={styles.tpClose} onClick={() => setThemePanel(null)}>✕</button>
                        </div>
                        <div className={styles.tpPeriods}>
                            {PERIODS.map(p => (
                                <button key={p}
                                        className={`${styles.tpPeriod} ${detailPeriod === p ? styles.tpPeriodOn : ''}`}
                                        onClick={() => setDetailPeriod(p)}>{p}</button>
                            ))}
                        </div>
                        <div className={styles.tpSortTabs}>
                            {DETAIL_SORTS.map(s => (
                                <button key={s}
                                        className={`${styles.tpSortTab} ${detailSort === s ? styles.tpSortTabOn : ''}`}
                                        onClick={() => setDetailSort(s)}>{s}</button>
                            ))}
                        </div>
                        <div className={styles.tpStockList}>
                            {detailVisible.map(st => (
                                <div key={st.id}
                                     className={`${styles.tpStockRow} ${detailSelected.includes(st.id) ? styles.tpStockRowOn : ''}`}
                                     onClick={() => toggleDetailSelect(st.id)}>
                                    <div
                                        className={`${styles.tpCheckbox} ${detailSelected.includes(st.id) ? styles.tpCheckboxOn : ''}`}>
                                        {detailSelected.includes(st.id) && <span>✓</span>}
                                    </div>
                                    <StockLogo ticker={st.ticker} name={st.name} size={42}/>
                                    <div className={styles.tpSInfo}>
                                        <div className={styles.tpSName}>{st.name}</div>
                                        <div className={styles.tpSPrice}>현재가 {st.price}</div>
                                    </div>
                                    <span className={st.pos ? styles.tpSPos : styles.tpSNeg}>{st.chg}</span>
                                </div>
                            ))}
                        </div>
                        {!detailShowAll && MOCK_STOCKS.length > 6 && (
                            <button className={styles.tpMoreBtn} onClick={() => setDetailShowAll(true)}>
                                전체 종목 보기 ({MOCK_STOCKS.length}개) →
                            </button>
                        )}
                        <div className={styles.tpBottomBtns}>
                            <button className={styles.tpSecBtn} onClick={() => setThemePanel(null)}>닫기</button>
                            <button className={styles.tpPriBtn} onClick={handleDetailCart}>
                                🛒 {detailSelected.length > 0 ? `${detailSelected.length}개 종목 담기` : '바로 담기'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {divPanel && (
                <div className={styles.themeOverlay} onClick={() => setDivPanel(null)}>
                    <div className={styles.themeDetailPanel} onClick={e => e.stopPropagation()}>
                        <div className={styles.tpHeader}>
                            <div className={styles.tpTitleRow}>
                                <span className={styles.tpTitle}>{divPanel.title}</span>
                                <span className={styles.tpBadgePos}>배당 TOP {divPanel.list.length}</span>
                            </div>
                            <button className={styles.tpClose} onClick={() => setDivPanel(null)}>✕</button>
                        </div>
                        <div className={styles.tpSortTabs}>
                            {DIV_SORTS.map(s => (
                                <button key={s}
                                        className={`${styles.tpSortTab} ${divSort === s ? styles.tpSortTabOn : ''}`}
                                        onClick={() => setDivSort(s)}>{s}</button>
                            ))}
                        </div>
                        <div className={styles.tpStockList}>
                            {divPanel.list.map((item) => (
                                <div key={item.id}
                                     className={`${styles.tpDivRow} ${divSelected.includes(item.id) ? styles.tpStockRowOn : ''}`}
                                     onClick={() => toggleDivSelect(item.id)}>
                                    <div
                                        className={`${styles.tpCheckbox} ${divSelected.includes(item.id) ? styles.tpCheckboxOn : ''}`}>
                                        {divSelected.includes(item.id) && <span>✓</span>}
                                    </div>
                                    <div className={styles.tpDivInfo}>
                                        <div className={styles.tpSName}>{item.name}</div>
                                        <div className={styles.tpSPrice}>현재가 {item.price} · {item.freq}</div>
                                    </div>
                                    <div className={styles.tpDivRight}>
                                        <div className={styles.tpDivYield}>{item.yield}</div>
                                        <div className={styles.tpDivLabel}>배당수익률</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.tpBottomBtns}>
                            <button className={styles.tpSecBtn} onClick={() => setDivPanel(null)}>닫기</button>
                            <button className={styles.tpPriBtn} onClick={handleDivCart}>
                                🛒 {divSelected.length > 0 ? `${divSelected.length}개 종목 담기` : '바로 담기'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvestmentInformation;