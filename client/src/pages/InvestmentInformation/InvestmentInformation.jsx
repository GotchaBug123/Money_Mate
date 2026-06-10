import React, {useState, useEffect} from 'react';
import styles from './InvestmentInformation.module.css';
import {getInvestmentInfoApi, syncStockDataApi, syncDividendDataApi, getMarketIndexApi, getHoldingListApi, addHoldingApi, updateHoldingQuantityApi, removeHoldingApi} from '../../api/investmentApi';
import {useAuthStore} from '../../store/useAuthStore';

const LOGO_MAP = {
    // 국내 (Google이 파비콘을 캐싱한 주요 기업만)
    '005930': 'samsung.com',    // 삼성전자
    '000660': 'skhynix.com',    // SK하이닉스
    '005380': 'hyundai.com',    // 현대차
    '000270': 'kia.com',        // 기아
    '005490': 'posco.com',      // 포스코홀딩스
    '066570': 'lg.com',         // LG전자
    '035720': 'kakao.com',      // 카카오
    '035420': 'naver.com',      // NAVER
    '068270': 'celltrion.com',  // 셀트리온
    '017670': 'sktelecom.com',  // SK텔레콤
    '030200': 'kt.com',         // KT
    '034020': 'doosan.com',     // 두산에너빌리티
    '259960': 'krafton.com',    // 크래프톤
    '323410': 'kakaobank.com',  // 카카오뱅크
    '036570': 'ncsoft.com',     // 엔씨소프트
    // 해외 대형주
    'NVDA': 'nvidia.com', 'AAPL': 'apple.com', 'MSFT': 'microsoft.com',
    'GOOGL': 'google.com', 'GOOG': 'google.com', 'AMZN': 'amazon.com',
    'META': 'meta.com', 'TSLA': 'tesla.com', 'TSM': 'tsmc.com',
    'MU': 'micron.com', 'AMD': 'amd.com', 'INTC': 'intel.com',
    'AVGO': 'broadcom.com', 'QCOM': 'qualcomm.com', 'ASML': 'asml.com',
    'JPM': 'jpmorganchase.com', 'BAC': 'bankofamerica.com',
    'V': 'visa.com', 'MA': 'mastercard.com', 'WMT': 'walmart.com',
    'JNJ': 'jnj.com', 'PFE': 'pfizer.com',
    'XOM': 'exxonmobil.com', 'CVX': 'chevron.com', 'NKE': 'nike.com',
    'DIS': 'disney.com', 'NFLX': 'netflix.com', 'SBUX': 'starbucks.com',
    'COST': 'costco.com', 'HD': 'homedepot.com',
    // ETF
    'SPY': 'ssga.com', 'QQQ': 'invesco.com', 'VOO': 'vanguard.com',
    'VTI': 'vanguard.com', 'SCHD': 'schwab.com',
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
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
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
const PAGE = 10;

const SIDEBAR_TABS = [
    {key: 'cart', label: '장바구니', icon: '🛒'},
    {key: 'like', label: '좋아요', icon: '❤️'},
    {key: 'recent', label: '최근 본', icon: '🕐'},
];

// 데이터 최신 여부 판단
// - 가격 데이터가 아예 없으면 stale
// - 최근 거래일이 STALE_DAYS일보다 오래되면 stale
//   (주말·공휴일·장중 미반영을 고려해 당일 비교 대신 일수 임계값 사용)
const STALE_DAYS = 4;

const isDataStale = (res) => {
    if (!res.assetList || res.assetList.length === 0) return true;
    if (!res.latestPriceDate) return true;

    const latest = new Date(res.latestPriceDate);
    if (Number.isNaN(latest.getTime())) return true;

    const diffDays = (Date.now() - latest.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > STALE_DAYS;
};

// 배당 수익률 데이터가 한 번도 수집되지 않은 경우 감지
const hasDividendData = (res) =>
    (res.dividendKoreanList?.length > 0) ||
    (res.dividendOverseasList?.length > 0) ||
    (res.dividendEtfList?.length > 0);

// 시장 상태 코드 → 한글 라벨
const MARKET_STATE_LABEL = {
    REGULAR: '장중',
    CLOSED: '장마감',
    PRE: '장전',
    POST: '장후',
    PREPRE: '장전',
    POSTPOST: '장후',
};

// MarketIndexDto → 지수 카드 데이터 변환
const mapIndexCard = (idx, label) => {
    const price = idx?.price;
    const cp = idx?.changePercent;
    const currency = idx?.currency;

    let value = '-';
    if (price !== null && price !== undefined) {
        value = currency === 'USD'
            ? `$${Number(price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
            : Number(price).toLocaleString('ko-KR', {maximumFractionDigits: 2});
    }

    const hasRate = cp !== null && cp !== undefined;
    const pos = hasRate ? Number(cp) >= 0 : true;
    const changeRate = hasRate ? `${pos ? '+' : ''}${Number(cp).toFixed(2)}%` : '-';

    return {
        label,
        value,
        change: MARKET_STATE_LABEL[idx?.marketState] ?? '',
        changeRate,
        pos,
        chart: idx?.sparkline || [],
    };
};

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
    const H = 44;
    const PAD = 4;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const coords = data.map((v, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - PAD - ((v - min) / range) * (H - PAD * 2);
        return [x, y];
    });

    const linePts = coords.map(([x, y]) => `${x},${y}`).join(' ');
    // 라인 아래 영역 채우기용 폴리곤 좌표
    const areaPts = `0,${H} ${linePts} ${W},${H}`;
    const color = pos ? 'var(--color-success)' : 'var(--color-error)';
    const fillId = `sparkFill-${pos ? 'up' : 'down'}`;

    return (
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
             style={{display: 'block', width: '100%', height: `${H}px`, marginTop: '4px'}}>
            <defs>
                <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
                    <stop offset="100%" stopColor={color} stopOpacity="0"/>
                </linearGradient>
            </defs>
            <polygon points={areaPts} fill={`url(#${fillId})`} stroke="none"/>
            <polyline
                points={linePts}
                fill="none"
                stroke={color}
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
    const [syncStatus, setSyncStatus] = useState(null); // null | 'syncing' | 'dividend'
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
    const [holdings, setHoldings] = useState([]); // [{holdingId, ticker, assetName, market, quantity}]
    const [likes, setLikes] = useState([]);
    const [recent, setRecent] = useState([]);

    const {user, openLoginModal} = useAuthStore();

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
                // 1차 조회
                let res = await getInvestmentInfoApi('ALL');

                // 데이터가 최신이 아니면 동기화 후 재조회
                // (스케줄러가 매일 새벽 수집하므로, 평소엔 이 분기를 타지 않음)
                if (isDataStale(res)) {
                    setSyncStatus('syncing');
                    await syncStockDataApi();

                    setSyncStatus('dividend');
                    await syncDividendDataApi();

                    setSyncStatus(null);
                    res = await getInvestmentInfoApi('ALL');
                } else if (!hasDividendData(res)) {
                    // 주가는 최신이지만 배당 수익률이 한 번도 수집되지 않은 경우
                    setSyncStatus('dividend');
                    await syncDividendDataApi();
                    setSyncStatus(null);
                    res = await getInvestmentInfoApi('ALL');
                }

                // 1. 시장 지수 데이터 맵핑 (전용 실시간 엔드포인트 사용 - sparkline 포함)
                // 반환 순서: 코스피(KODEX200) → 코스닥 → S&P500 → USD/KRW
                try {
                    const indexData = await getMarketIndexApi();
                    const LABELS = ['코스피', '코스닥', 'S&P 500', '달러 환율'];
                    const mappedIndices = (indexData || []).map((idx, i) => mapIndexCard(idx, LABELS[i]));
                    setIndices(mappedIndices);
                } catch (indexError) {
                    console.error('시장 지수 불러오기 실패', indexError);
                    setIndices([]);
                }

                // 2. 메인 주식 리스트 (TOP 100) 맵핑
                // market 필드를 필터 버튼 값(국내/해외/ETF)으로 정규화
                const normalizeMarket = (s) => {
                    if (s.assetType === 'ETF') return 'ETF';
                    if (s.market === 'KOSPI' || s.market === 'KOSDAQ') return '국내';
                    return '해외';
                };
                const mappedStocks = (res.assetList || []).map(s => ({
                    id: s.assetId || s.symbol,
                    name: s.assetName,
                    ticker: s.ticker || s.symbol,
                    market: normalizeMarket(s),
                    rawMarket: s.market,
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

    useEffect(() => {
        if (!user) { setHoldings([]); return; }
        getHoldingListApi()
            .then(data => setHoldings(data || []))
            .catch(err => console.error('장바구니 불러오기 실패', err));
    }, [user]);

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

    const handleRemoveHolding = async (holdingId) => {
        try {
            await removeHoldingApi(holdingId);
            setHoldings(prev => prev.filter(h => h.holdingId !== holdingId));
        } catch (e) {
            console.error('장바구니 삭제 실패', e);
        }
    };

    const handleQuantityChange = async (holdingId, newQty) => {
        if (newQty < 1) { await handleRemoveHolding(holdingId); return; }
        try {
            const updated = await updateHoldingQuantityApi(holdingId, newQty);
            setHoldings(prev => prev.map(h => h.holdingId === holdingId ? {...h, quantity: updated.quantity} : h));
        } catch (e) {
            console.error('수량 변경 실패', e);
        }
    };

    const toggleCart = async (event, stock) => {
        event.stopPropagation();
        if (!user) { openLoginModal(); return; }
        const existing = holdings.find(h => h.ticker === stock.ticker);
        if (existing) {
            // 낙관적 삭제: UI 먼저 제거 후 API 호출
            setHoldings(prev => prev.filter(h => h.holdingId !== existing.holdingId));
            try {
                await removeHoldingApi(existing.holdingId);
            } catch (e) {
                // API 실패 시 되돌리기
                setHoldings(prev => [...prev, existing]);
                alert('장바구니에서 제거하는데 실패했습니다.');
            }
        } else {
            // 낙관적 추가: 임시 항목으로 UI 먼저 표시 후 API 호출
            const tempId = Date.now();
            const tempItem = {holdingId: tempId, ticker: stock.ticker, assetName: stock.name, market: stock.market || '', quantity: 1};
            setHoldings(prev => [...prev, tempItem]);
            try {
                const result = await addHoldingApi({ticker: stock.ticker, assetName: stock.name, market: stock.market || '', buyPrice: 0});
                setHoldings(prev => prev.map(h => h.holdingId === tempId ? result : h));
            } catch (e) {
                setHoldings(prev => prev.filter(h => h.holdingId !== tempId));
                alert('장바구니 담기에 실패했습니다. 로그인 상태를 확인해주세요.');
            }
        }
        addRecent(stock.id);
    };

    const toggleLike = (event, id) => {
        event.stopPropagation();
        setLikes((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
        addRecent(id);
    };

    const cartSidebarData = holdings.map(h => {
        const stock = stockList.find(s => s.ticker === h.ticker);
        return {holdingId: h.holdingId, id: h.holdingId, name: h.assetName, ticker: h.ticker, market: h.market || '', price: stock?.price || '-', chg: stock?.chg || '-', pos: stock?.pos ?? true, quantity: h.quantity};
    });

    const sidebarData = sidebarTab === 'cart'
        ? cartSidebarData
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

    const handleDetailCart = async () => {
        if (!detailSelected.length) { alert('담을 종목을 선택해주세요.'); return; }
        if (!user) { openLoginModal(); return; }
        const selectedStocks = themePanel.stocks.filter(s => detailSelected.includes(s.id));
        for (const stock of selectedStocks) {
            if (holdings.some(h => h.ticker === stock.ticker)) continue;
            try {
                const result = await addHoldingApi({ticker: stock.ticker, assetName: stock.name, market: stock.market || '', buyPrice: 0});
                setHoldings(prev => [...prev, result]);
            } catch (e) {
                console.error('장바구니 담기 실패', e);
            }
        }
        selectedStocks.forEach(s => addRecent(s.id));
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

    const handleDivCart = async () => {
        if (!divSelected.length) { alert('담을 종목을 선택해주세요.'); return; }
        if (!user) { openLoginModal(); return; }
        const selectedItems = divPanel.list.filter(s => divSelected.includes(s.id));
        for (const item of selectedItems) {
            if (holdings.some(h => h.ticker === item.ticker)) continue;
            try {
                const result = await addHoldingApi({ticker: item.ticker, assetName: item.name, market: '', buyPrice: 0});
                setHoldings(prev => [...prev, result]);
            } catch (e) {
                console.error('장바구니 담기 실패', e);
            }
        }
        selectedItems.forEach(s => addRecent(s.id));
        alert(`${divSelected.length}개 종목이 장바구니에 담겼습니다!`);
        setDivSelected([]);
    };

    if (isLoading) {
        const message = syncStatus === 'syncing'
            ? '📡 주가 데이터를 수집하는 중입니다... (최초 1회, 약 90초 소요)'
            : syncStatus === 'dividend'
                ? '💰 배당 수익률 데이터를 수집하는 중입니다... (약 90초 소요)'
                : '실시간 투자 정보를 불러오는 중입니다...';

        return (
            <div className={styles.wrap} style={{justifyContent: 'center', alignItems: 'center'}}>
                <div style={{textAlign: 'center', padding: '60px 20px'}}>
                    <div style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '12px'}}>
                        {message}
                    </div>
                    {syncStatus && (
                        <div style={{fontSize: '14px', color: 'var(--color-text-muted)'}}>
                            데이터가 준비되면 자동으로 화면이 표시됩니다.
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.wrap} ${sidebarOpen ? styles.wrapShifted : ''}`}>
            <div className={styles.main}>
                <div className={styles.topBar}>
                    <button className={styles.sidebarToggle} onClick={() => setSidebarOpen((open) => !open)}>
                        <span>🛒</span>
                        관심 주식
                        {(holdings.length + likes.length) > 0 && (
                            <span className={styles.toggleBadge}>{holdings.length + likes.length}</span>
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
                                        <div className={styles.stick}>{stock.ticker} · {stock.rawMarket || stock.market}</div>
                                    </div>
                                </div>

                                <span className={styles.sp}>{stock.price}</span>
                                <span className={stock.pos ? styles.spos : styles.sneg}>{stock.chg}</span>
                                <span className={styles.sv}>{stock.vol}</span>

                                <div className={styles.sbts}>
                                    <button
                                        className={`${styles.sbt} ${holdings.some(h => h.ticker === stock.ticker) ? styles.sbtCartOn : ''}`}
                                        onClick={(event) => toggleCart(event, stock)}
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
                        {(theme === '전체' ? themeList : themeList.filter(t => t.name.includes(theme))).map((themeItem) => (
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
                                {tab.key === 'cart' ? holdings.length : tab.key === 'like' ? likes.length : recent.length}
                            </span>
                        </button>
                    ))}
                </div>

                <div className={styles.sbBody}>
                    {sidebarData.length === 0 ? (
                        <div className={styles.sbEmpty}>
                            <span style={{fontSize: '32px'}}>
                                {sidebarTab === 'cart' ? '🛒' : sidebarTab === 'like' ? '❤️' : '🕐'}
                            </span>
                            <span>
                                {sidebarTab === 'cart' ? '장바구니가 비어있어요' : sidebarTab === 'like' ? '좋아요한 종목이 없어요' : '최근 본 종목이 없어요'}
                            </span>
                        </div>
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
                                {sidebarTab === 'cart' ? (
                                    <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', justifyContent: 'flex-end'}}>
                                        <button onClick={() => handleQuantityChange(stock.holdingId, stock.quantity - 1)} style={{width: 22, height: 22, border: '1px solid #ddd', borderRadius: 4, background: '#f5f5f5', cursor: 'pointer', fontSize: 14, lineHeight: 1}}>−</button>
                                        <span style={{fontSize: '13px', fontWeight: 700, minWidth: '18px', textAlign: 'center'}}>{stock.quantity}</span>
                                        <button onClick={() => handleQuantityChange(stock.holdingId, stock.quantity + 1)} style={{width: 22, height: 22, border: '1px solid #ddd', borderRadius: 4, background: '#f5f5f5', cursor: 'pointer', fontSize: 14, lineHeight: 1}}>+</button>
                                        <button onClick={() => handleRemoveHolding(stock.holdingId)} style={{width: 22, height: 22, border: '1px solid #fca5a5', borderRadius: 4, background: '#fff1f1', cursor: 'pointer', fontSize: 13, color: '#E53E3E', lineHeight: 1}}>×</button>
                                    </div>
                                ) : (
                                    <div className={stock.pos ? styles.sbItemPos : styles.sbItemNeg}>{stock.chg}</div>
                                )}
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