import React, {useState, useEffect} from 'react';
import styles from './InvestmentInformation.module.css';
import {getInvestmentInfoApi} from '../../api/investmentApi';

const LOGO_MAP = {
    '005930': 'samsung.com', '000660': 'skhynix.com', 'NVDA': 'nvidia.com',
    'AAPL': 'apple.com', '360750': 'tigeretf.com', '005380': 'hyundai.com',
    '373220': 'lgensol.com', '035720': 'kakao.com', 'TSM': 'tsmc.com',
    'MU': 'micron.com', 'MSFT': 'microsoft.com', 'GOOGL': 'google.com',
    'AMZN': 'amazon.com', 'META': 'meta.com', 'TSLA': 'tesla.com',
};

const BADGE_COLORS = ['#E8F0FE', '#EDFAF4', '#FFF0EE', '#FAEEDA', '#F0F4FF', '#FEF0F8', '#EEF8FF', '#F5F0FF'];
const BADGE_TEXT = ['#1B5ED9', '#1A7A45', '#C0392B', '#B47D0C', '#2E5CD9', '#C03980', '#0C7CD9', '#7B3FA0'];

const getBadge = (ticker) => {
    if (!ticker) return {bg: BADGE_COLORS[0], color: BADGE_TEXT[0]};
    const idx = ticker.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % BADGE_COLORS.length;
    return {bg: BADGE_COLORS[idx], color: BADGE_TEXT[idx]};
};

const StockLogo = ({ticker, name, size = 36}) => {
    const [failed, setFailed] = useState(false);
    const domain = LOGO_MAP[ticker];
    const badge = getBadge(ticker);

    if (!domain || failed) {
        return (
            <div
                className={styles.logoBadge}
                style={{
                    width: size,
                    height: size,
                    background: badge.bg,
                    color: badge.color,
                    fontSize: size * 0.35,
                    borderRadius: '50%'
                }}
            >
                {name ? name.charAt(0) : '?'}
            </div>
        );
    }

    return (
        <img
            className={styles.logoImg}
            style={{width: size, height: size, borderRadius: '50%'}}
            src={`https://logo.clearbit.com/${domain}`}
            alt={name}
            onError={() => setFailed(true)}
        />
    );
};

const FILTERS = ['전체', '국내', '해외', 'ETF'];
const SORTS = ['거래대금', '거래량', '급상승', '급하락'];
const THEMES = ['전체', 'AI', '반도체', '2차전지', '자동차', '광통신'];
const PERIODS = ['1일', '1주일', '1개월', '3개월', '1년', '올해'];
const DETAIL_SORTS = ['수익률 상승', '수익률 하락', '거래대금'];
const DIV_SORTS = ['배당 수익률순', '배당금순', '시가총액순'];
const PAGE = 20;

const SIDEBAR_TABS = [
    {key: 'cart', label: '장바구니', icon: '🛒'},
    {key: 'like', label: '좋아요', icon: '❤️'},
    {key: 'recent', label: '최근 본', icon: '🕐'},
];

const parseChange = (chg) => {
    if (!chg) return 0;
    return Number(chg.replace('%', '').replace('+', ''));
};

const getTradeValue = (vol) => {
    if (!vol) return 0;
    if (vol.includes('조')) return Number(vol.replace('조', '')) * 10000;
    if (vol.includes('억')) return Number(vol.replace('억', '').replace(',', ''));
    if (vol.includes('B')) return Number(vol.replace('$', '').replace('B', '')) * 13000;
    if (vol.includes('M')) return Number(vol.replace('$', '').replace('M', '')) * 13;
    return 0;
};

const sortStocks = (stocks, sort) => {
    const sorted = [...stocks];
    if (sort === '거래대금') return sorted.sort((a, b) => getTradeValue(b.vol) - getTradeValue(a.vol));
    if (sort === '거래량') return sorted.sort((a, b) => (b.volume || 0) - (a.volume || 0));
    if (sort === '급상승') return sorted.sort((a, b) => parseChange(b.chg) - parseChange(a.chg));
    if (sort === '급하락') return sorted.sort((a, b) => parseChange(a.chg) - parseChange(b.chg));
    return sorted;
};

const Spark = ({data, pos}) => {
    if (!data || data.length === 0) return null;
    const W = 80;
    const H = 28;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const pts = data
        .map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * (H - 4) + 2}`)
        .join(' ');

    return (
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
            <polyline
                points={pts}
                fill="none"
                stroke={pos ? 'var(--color-success)' : 'var(--color-error)'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

const InvestmentInformation = () => {
    // 백엔드 연결용 상태 변수들
    const [isLoading, setIsLoading] = useState(true);
    const [indices, setIndices] = useState([]);
    const [stockList, setStockList] = useState([]);
    const [themeList, setThemeList] = useState([]);
    const [divList, setDivList] = useState([]);

    // 기존 UI 및 필터 상태 변수들
    const [filter, setFilter] = useState('전체');
    const [sort, setSort] = useState('거래대금');
    const [theme, setTheme] = useState('전체');
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarTab, setSidebarTab] = useState('cart');
    const [cart, setCart] = useState([]);
    const [likes, setLikes] = useState([]);
    const [recent, setRecent] = useState([]);

    const [themePanel, setThemePanel] = useState(null);
    const [detailPeriod, setDetailPeriod] = useState('1일');
    const [detailSort, setDetailSort] = useState('수익률 상승');
    const [detailShowAll, setDetailShowAll] = useState(false);
    const [detailSelected, setDetailSelected] = useState([]);

    const [divPanel, setDivPanel] = useState(null);
    const [divSort, setDivSort] = useState('배당 수익률순');
    const [divSelected, setDivSelected] = useState([]);

    // 백엔드 API 호출
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const res = await getInvestmentInfoApi('ALL');

                // 1. 시장 지수 데이터 맵핑
                const mappedIndices = [];
                if (res.kospi) mappedIndices.push({
                    label: '코스피',
                    value: res.kospi.priceLabel,
                    change: res.kospi.changeLabel,
                    changeRate: `${res.kospi.changePercent > 0 ? '+' : ''}${res.kospi.changePercent}%`,
                    pos: res.kospi.rise,
                    chart: res.kospi.sparkline || []
                });
                if (res.kosdaq) mappedIndices.push({
                    label: '코스닥',
                    value: res.kosdaq.priceLabel,
                    change: res.kosdaq.changeLabel,
                    changeRate: `${res.kosdaq.changePercent > 0 ? '+' : ''}${res.kosdaq.changePercent}%`,
                    pos: res.kosdaq.rise,
                    chart: res.kosdaq.sparkline || []
                });
                if (res.snp500) mappedIndices.push({
                    label: 'S&P 500',
                    value: res.snp500.priceLabel,
                    change: res.snp500.changeLabel,
                    changeRate: `${res.snp500.changePercent > 0 ? '+' : ''}${res.snp500.changePercent}%`,
                    pos: res.snp500.rise,
                    chart: res.snp500.sparkline || []
                });
                if (res.usdKrw) mappedIndices.push({
                    label: '달러 환율',
                    value: res.usdKrw.priceLabel,
                    change: res.usdKrw.changeLabel,
                    changeRate: `${res.usdKrw.changePercent > 0 ? '+' : ''}${res.usdKrw.changePercent}%`,
                    pos: res.usdKrw.rise,
                    chart: res.usdKrw.sparkline || []
                });
                setIndices(mappedIndices);

                // 2. 메인 주식 리스트 (TOP 100) 맵핑
                const mappedStocks = (res.assetList || []).map(s => ({
                    id: s.assetId || s.symbol,
                    name: s.assetName,
                    ticker: s.ticker || s.symbol,
                    market: s.market,
                    price: s.closePriceLabel || `${s.closePrice}`,
                    chg: s.dailyReturnLabel || `${s.dailyReturnPct > 0 ? '+' : ''}${s.dailyReturnPct}%`,
                    vol: s.tradingValueLabel || s.volumeLabel || '0',
                    pos: s.rise,
                    volume: s.volume || 0
                }));
                setStockList(mappedStocks);

                // 3. 테마별 섹션 맵핑
                const makeTheme = (name, list) => {
                    if (!list || list.length === 0) return null;
                    const avgPct = list.reduce((acc, curr) => acc + (curr.dailyReturnPct || 0), 0) / list.length;
                    return {
                        name,
                        avg: `${avgPct > 0 ? '+' : ''}${avgPct.toFixed(1)}%`,
                        pos: avgPct >= 0,
                        stocks: list.map(s => ({
                            id: s.assetId || s.symbol,
                            name: s.assetName,
                            ticker: s.ticker || s.symbol,
                            chg: s.dailyReturnLabel || `${s.dailyReturnPct > 0 ? '+' : ''}${s.dailyReturnPct}%`,
                            pos: s.rise,
                            price: s.closePriceLabel,
                            vol: s.tradingValueLabel,
                            volume: s.volume
                        }))
                    };
                };
                const themes = [
                    makeTheme('반도체 테마', res.semiList),
                    makeTheme('AI 테마', res.aiList),
                    makeTheme('2차전지 테마', res.batteryList),
                    makeTheme('바이오 테마', res.bioList),
                    makeTheme('금융 테마', res.finList),
                ].filter(Boolean);
                setThemeList(themes);

                // 4. 배당 데이터 맵핑
                const makeDiv = (title, market, list) => {
                    if (!list || list.length === 0) return null;
                    return {
                        title,
                        market,
                        list: list.map(s => ({
                            id: s.assetId || s.symbol,
                            name: s.assetName,
                            ticker: s.ticker || s.symbol,
                            price: s.closePriceLabel,
                            yield: s.dividendYieldLabel || `${s.dividendYieldPct}%`,
                            freq: s.country === 'US' ? '분기 배당' : '연 배당',
                            pos: s.rise
                        }))
                    };
                };
                const divs = [
                    makeDiv('국내 고배당주', 'domestic', res.dividendKoreanList),
                    makeDiv('해외 고배당주', 'foreign', res.dividendOverseasList),
                    makeDiv('ETF 고배당', 'etf', res.dividendEtfList),
                ].filter(Boolean);
                setDivList(divs);

            } catch (e) {
                console.error("투자정보 불러오기 실패", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // 💡 필터 및 정렬 로직에 이제 MOCK_STOCKS 대신 백엔드에서 받은 stockList를 사용합니다.
    const filtered = sortStocks(
        stockList.filter((stock) =>
            (filter === '전체' || stock.market === filter) &&
            (
                !query ||
                stock.name.toLowerCase().includes(query.toLowerCase()) ||
                stock.ticker.toLowerCase().includes(query.toLowerCase())
            )
        ),
        sort
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
    const startIndex = (currentPage - 1) * PAGE;
    const visible = filtered.slice(startIndex, startIndex + PAGE);

    const addRecent = (id) => setRecent((prev) => [id, ...prev.filter((item) => item !== id)].slice(0, 20));

    const toggleCart = (event, id) => {
        event.stopPropagation();
        setCart((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
        addRecent(id);
    };

    const toggleLike = (event, id) => {
        event.stopPropagation();
        setLikes((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
        addRecent(id);
    };

    const sidebarData = sidebarTab === 'cart'
        ? stockList.filter((stock) => cart.includes(stock.id))
        : sidebarTab === 'like'
            ? stockList.filter((stock) => likes.includes(stock.id))
            : stockList.filter((stock) => recent.includes(stock.id));

    const openThemePanel = (selectedTheme) => {
        setThemePanel(selectedTheme);
        setDetailPeriod('1일');
        setDetailSort('수익률 상승');
        setDetailShowAll(false);
        setDetailSelected([]);
        setDivPanel(null);
    };

    const toggleDetailSelect = (id) =>
        setDetailSelected((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);

    const handleDetailCart = () => {
        if (!detailSelected.length) {
            alert('담을 종목을 선택해주세요.');
            return;
        }
        setCart((prev) => [...new Set([...prev, ...detailSelected])]);
        detailSelected.forEach((id) => addRecent(id));
        alert(`${detailSelected.length}개 종목이 장바구니에 담겼습니다!`);
        setDetailSelected([]);
    };

    // 💡 테마 모달의 목록은 전체 종목이 아니라 '해당 테마에 속한 종목'들만 정렬하여 보여줍니다.
    const detailStocks = sortStocks(
        themePanel ? themePanel.stocks : [],
        detailSort === '거래대금' ? '거래대금' : detailSort === '수익률 상승' ? '급상승' : '급하락'
    );
    const detailVisible = detailShowAll ? detailStocks : detailStocks.slice(0, 6);

    const openDivPanel = (selectedDividend) => {
        setDivPanel(selectedDividend);
        setDivSort('배당 수익률순');
        setDivSelected([]);
        setThemePanel(null);
    };

    const toggleDivSelect = (id) =>
        setDivSelected((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);

    const handleDivCart = () => {
        if (!divSelected.length) {
            alert('담을 종목을 선택해주세요.');
            return;
        }
        alert(`${divSelected.length}개 종목이 장바구니에 담겼습니다!`);
        setDivSelected([]);
    };

    if (isLoading) {
        return (
            <div className={styles.wrap} style={{justifyContent: 'center', alignItems: 'center'}}>
                <div style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--color-primary)'}}>
                    실시간 투자 정보를 불러오는 중입니다...
                </div>
            </div>
        );
    }

    return (
        <div className={styles.wrap}>
            <div className={`${styles.main} ${sidebarOpen ? styles.mainShifted : ''}`}>
                <div className={styles.topBar}>
                    <button className={styles.sidebarToggle} onClick={() => setSidebarOpen((open) => !open)}>
                        <span>🛒</span>
                        관심 주식
                        {(cart.length + likes.length) > 0 && (
                            <span className={styles.toggleBadge}>{cart.length + likes.length}</span>
                        )}
                    </button>
                </div>

                <div className={styles.idxGrid}>
                    {indices.map((item) => (
                        <div key={item.label} className={styles.idxCard}>
                            <span className={styles.idxLabel}>{item.label}</span>
                            <span className={styles.idxVal}>{item.value}</span>
                            <div className={styles.idxBot}>
                                <span className={item.pos ? styles.idxPos : styles.idxNeg}>{item.change}</span>
                                <span
                                    className={item.pos ? styles.idxBadgePos : styles.idxBadgeNeg}>{item.changeRate}</span>
                            </div>
                            <Spark data={item.chart} pos={item.pos}/>
                        </div>
                    ))}
                </div>

                <div className={styles.chartCard}>
                    <div className={styles.ccTop}>
                        <span className={styles.ccTitle}>실시간 TOP 100 차트</span>
                        <div className={styles.ccRight}>
                            <input
                                className={styles.srch}
                                placeholder="종목명 또는 티커 검색"
                                value={query}
                                onChange={(event) => {
                                    setQuery(event.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            <button className={styles.srchBtn}>검색</button>
                        </div>
                    </div>

                    <div className={styles.filterRow}>
                        <div className={styles.ftabs}>
                            {FILTERS.map((filterName) => (
                                <button
                                    key={filterName}
                                    className={`${styles.ftab} ${filter === filterName ? styles.ftabOn : ''}`}
                                    onClick={() => {
                                        setFilter(filterName);
                                        setCurrentPage(1);
                                    }}
                                >
                                    {filterName}
                                </button>
                            ))}
                        </div>

                        <div className={styles.stabs}>
                            {SORTS.map((sortName) => (
                                <button
                                    key={sortName}
                                    className={`${styles.stab} ${sort === sortName ? styles.stabOn : ''}`}
                                    onClick={() => {
                                        setSort(sortName);
                                        setCurrentPage(1);
                                    }}
                                >
                                    {sortName}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.listHdr}>
                        <span>순위</span>
                        <span>종목</span>
                        <span>현재가</span>
                        <span>등락률</span>
                        <span>거래대금</span>
                        <span>담기</span>
                    </div>

                    {visible.map((stock, index) => {
                        const rank = startIndex + index + 1;

                        return (
                            <div key={stock.id} className={styles.srow}>
                                <span className={styles.sn}>{rank}</span>

                                <div className={styles.sInfo}>
                                    <StockLogo ticker={stock.ticker} name={stock.name} size={36}/>
                                    <div className={styles.si}>
                                        <div className={styles.sname}>{stock.name}</div>
                                        <div className={styles.stick}>{stock.ticker} · {stock.market}</div>
                                    </div>
                                </div>

                                <span className={styles.sp}>{stock.price}</span>
                                <span className={stock.pos ? styles.spos : styles.sneg}>{stock.chg}</span>
                                <span className={styles.sv}>{stock.vol}</span>

                                <div className={styles.sbts}>
                                    <button
                                        className={`${styles.sbt} ${cart.includes(stock.id) ? styles.sbtCartOn : ''}`}
                                        onClick={(event) => toggleCart(event, stock.id)}
                                        title="장바구니"
                                    >
                                        🛒
                                    </button>
                                    <button
                                        className={`${styles.sbt} ${likes.includes(stock.id) ? styles.sbtLikeOn : ''}`}
                                        onClick={(event) => toggleLike(event, stock.id)}
                                        title="좋아요"
                                    >
                                        ❤️
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <div style={{
                        marginTop: '24px',
                        paddingTop: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '14px',
                        borderTop: '1px solid var(--color-border)'
                    }}>
                        <button
                            type="button"
                            className={styles.moreBtn}
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                            style={{maxWidth: '120px', opacity: currentPage === 1 ? 0.45 : 1}}
                        >
                            이전
                        </button>

                        <span style={{
                            minWidth: '90px',
                            color: 'var(--color-text-main)',
                            fontSize: '15px',
                            fontWeight: 900,
                            textAlign: 'center'
                        }}>
                            {currentPage} / {totalPages}
                        </span>

                        <button
                            type="button"
                            className={styles.moreBtn}
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                            style={{maxWidth: '120px', opacity: currentPage === totalPages ? 0.45 : 1}}
                        >
                            다음
                        </button>
                    </div>
                </div>

                <div className={styles.section}>
                    <span className={styles.secTitle}>테마별 주식</span>

                    <div className={styles.pillRow}>
                        {THEMES.map((themeName) => (
                            <button
                                key={themeName}
                                className={`${styles.pill} ${theme === themeName ? styles.pillOn : ''}`}
                                onClick={() => setTheme(themeName)}
                            >
                                {themeName}
                            </button>
                        ))}
                    </div>

                    <div className={styles.themeGrid}>
                        {themeList.map((themeItem) => (
                            <div key={themeItem.name}
                                 className={`${styles.tc} ${themePanel === themeItem ? styles.tcActive : ''}`}>
                                <div className={styles.tcTop}>
                                    <span className={styles.tcName}>{themeItem.name}</span>
                                    <span
                                        className={themeItem.pos ? styles.tcBadgePos : styles.tcBadgeNeg}>{themeItem.avg} 평균</span>
                                </div>

                                {themeItem.stocks.slice(0, 3).map((stock) => (
                                    <div key={stock.id || stock.name} className={styles.tcRow}>
                                        <span className={styles.tcSn}>{stock.name}</span>
                                        <span className={stock.pos ? styles.tcSp : styles.tcSng}>{stock.chg}</span>
                                    </div>
                                ))}

                                <button className={styles.tcMore} onClick={() => openThemePanel(themeItem)}>
                                    자세히 보기 →
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <span className={styles.secTitle}>배당금 TOP 10</span>

                    <div className={styles.divGrid}>
                        {divList.map((dividend) => (
                            <div key={dividend.title}
                                 className={`${styles.dc} ${divPanel === dividend ? styles.dcActive : ''}`}>
                                <div className={styles.dcHead}>{dividend.title}</div>

                                {dividend.list.slice(0, 4).map((item) => (
                                    <div key={item.id} className={styles.dcRow}>
                                        <span className={styles.dcN}>{item.name}</span>
                                        <span className={styles.dcY}>{item.yield}</span>
                                    </div>
                                ))}

                                <button className={styles.dcMore} onClick={() => openDivPanel(dividend)}>
                                    자세히 보기 →
                                </button>
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
                    {SIDEBAR_TABS.map((tab) => (
                        <button
                            key={tab.key}
                            className={`${styles.sbTab} ${sidebarTab === tab.key ? styles.sbTabOn : ''}`}
                            onClick={() => setSidebarTab(tab.key)}
                        >
                            {tab.icon} {tab.label}
                            <span className={`${styles.sbBadge} ${sidebarTab === tab.key ? styles.sbBadgeOn : ''}`}>
                                {tab.key === 'cart' ? cart.length : tab.key === 'like' ? likes.length : recent.length}
                            </span>
                        </button>
                    ))}
                </div>

                <div className={styles.sbBody}>
                    {sidebarData.length === 0 ? (
                        <p className={styles.sbEmpty}>아직 없어요</p>
                    ) : sidebarData.map((stock) => (
                        <div key={stock.id} className={styles.sbItem}>
                            <div className={styles.sbItemLeft}>
                                <StockLogo ticker={stock.ticker} name={stock.name} size={36}/>
                                <div>
                                    <div className={styles.sbItemName}>{stock.name}</div>
                                    <div className={styles.sbItemTicker}>{stock.ticker}</div>
                                </div>
                            </div>

                            <div style={{textAlign: 'right'}}>
                                <div className={styles.sbItemPrice}>{stock.price}</div>
                                <div className={stock.pos ? styles.sbItemPos : styles.sbItemNeg}>{stock.chg}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {themePanel && (
                <div className={styles.themeOverlay} onClick={() => setThemePanel(null)}>
                    <div className={styles.themeDetailPanel} onClick={(event) => event.stopPropagation()}>
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
                            {PERIODS.map((period) => (
                                <button
                                    key={period}
                                    className={`${styles.tpPeriod} ${detailPeriod === period ? styles.tpPeriodOn : ''}`}
                                    onClick={() => setDetailPeriod(period)}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>

                        <div className={styles.tpSortTabs}>
                            {DETAIL_SORTS.map((sortName) => (
                                <button
                                    key={sortName}
                                    className={`${styles.tpSortTab} ${detailSort === sortName ? styles.tpSortTabOn : ''}`}
                                    onClick={() => setDetailSort(sortName)}
                                >
                                    {sortName}
                                </button>
                            ))}
                        </div>

                        <div className={styles.tpStockList}>
                            {detailVisible.map((stock) => (
                                <div
                                    key={stock.id}
                                    className={`${styles.tpStockRow} ${detailSelected.includes(stock.id) ? styles.tpStockRowOn : ''}`}
                                    onClick={() => toggleDetailSelect(stock.id)}
                                >
                                    <div
                                        className={`${styles.tpCheckbox} ${detailSelected.includes(stock.id) ? styles.tpCheckboxOn : ''}`}>
                                        {detailSelected.includes(stock.id) && <span>✓</span>}
                                    </div>

                                    <StockLogo ticker={stock.ticker} name={stock.name} size={42}/>

                                    <div className={styles.tpSInfo}>
                                        <div className={styles.tpSName}>{stock.name}</div>
                                        <div className={styles.tpSPrice}>현재가 {stock.price}</div>
                                    </div>

                                    <span className={stock.pos ? styles.tpSPos : styles.tpSNeg}>{stock.chg}</span>
                                </div>
                            ))}
                        </div>

                        {!detailShowAll && detailStocks.length > 6 && (
                            <button className={styles.tpMoreBtn} onClick={() => setDetailShowAll(true)}>
                                전체 종목 보기 ({detailStocks.length}개) →
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
                    <div className={styles.themeDetailPanel} onClick={(event) => event.stopPropagation()}>
                        <div className={styles.tpHeader}>
                            <div className={styles.tpTitleRow}>
                                <span className={styles.tpTitle}>{divPanel.title}</span>
                                <span className={styles.tpBadgePos}>배당 TOP {divPanel.list.length}</span>
                            </div>

                            <button className={styles.tpClose} onClick={() => setDivPanel(null)}>✕</button>
                        </div>

                        <div className={styles.tpSortTabs}>
                            {DIV_SORTS.map((sortName) => (
                                <button
                                    key={sortName}
                                    className={`${styles.tpSortTab} ${divSort === sortName ? styles.tpSortTabOn : ''}`}
                                    onClick={() => setDivSort(sortName)}
                                >
                                    {sortName}
                                </button>
                            ))}
                        </div>

                        <div className={styles.tpStockList}>
                            {divPanel.list.map((item) => (
                                <div
                                    key={item.id}
                                    className={`${styles.tpDivRow} ${divSelected.includes(item.id) ? styles.tpStockRowOn : ''}`}
                                    onClick={() => toggleDivSelect(item.id)}
                                >
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