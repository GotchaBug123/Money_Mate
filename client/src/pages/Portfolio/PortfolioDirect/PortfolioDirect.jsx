import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PortfolioDirect.module.css';

// ✅ 백엔드 API 연결 시 아래 import로 교체
// import { searchStocks, LOGO_MAP } from '../../../data/stockData';

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
    if (!query || !query.trim()) return [];
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
        <div className={styles.logoBadge} style={{ background: badge.bg, color: badge.color }}>
            {name.charAt(0)}
        </div>
    );
    return (
        <img className={styles.logoImg} src={`https://logo.clearbit.com/${domain}`}
             alt={name} onError={() => setFailed(true)} />
    );
};

const PortfolioDirect = () => {
    const navigate = useNavigate();

    const [currency,     setCurrency]     = useState('만원');
    const [investAmount, setInvestAmount] = useState('');
    const [startDate,    setStartDate]    = useState('');
    const [endDate,      setEndDate]      = useState('');
    const [goalAmount,   setGoalAmount]   = useState('');
    const [cart,         setCart]         = useState([]);

    const [showSearchModal, setShowSearchModal] = useState(false);
    const [searchQuery,     setSearchQuery]     = useState('');
    const [searchResults,   setSearchResults]   = useState([]);

    const [showNameModal, setShowNameModal] = useState(false);
    const [portfolioName, setPortfolioName] = useState('');
    const [pendingAction, setPendingAction] = useState(null);

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        setSearchResults(searchStocks(searchQuery));
    };

    const handleAdd = (stock) => {
        if (cart.find(s => s.ticker === stock.ticker)) {
            alert('이미 추가된 종목입니다.'); return;
        }
        const newCart = [...cart, { ...stock, weight: 0 }];
        const eq  = Math.floor(100 / newCart.length);
        const rem = 100 - eq * newCart.length;
        setCart(newCart.map((s,i) => ({ ...s, weight: i===0 ? eq+rem : eq })));
    };

    const handleRemove = (ticker) => {
        const newCart = cart.filter(s => s.ticker !== ticker);
        if (!newCart.length) { setCart([]); return; }
        const eq  = Math.floor(100 / newCart.length);
        const rem = 100 - eq * newCart.length;
        setCart(newCart.map((s,i) => ({ ...s, weight: i===0 ? eq+rem : eq })));
    };

    const handleWeight = (ticker, val) =>
        setCart(cart.map(s => s.ticker===ticker ? { ...s, weight: Number(val) } : s));

    const totalWeight = cart.reduce((sum,s) => sum + Number(s.weight), 0);

    const handleAutoWeight = () => {
        if (!cart.length) return;
        const eq  = Math.floor(100 / cart.length);
        const rem = 100 - eq * cart.length;
        setCart(cart.map((s,i) => ({ ...s, weight: i===0 ? eq+rem : eq })));
    };

    const openSearchModal = () => {
        setSearchQuery('');
        setSearchResults([]);
        setShowSearchModal(true);
    };

    const validate = () => {
        if (!investAmount || !startDate || !endDate || !goalAmount) {
            alert('투자 금액, 기간, 목표 금액을 모두 입력해주세요.'); return false;
        }
        if (!cart.length) { alert('최소 1개 이상의 종목을 담아주세요.'); return false; }
        if (totalWeight !== 100) { alert(`비중 합계가 ${totalWeight}%입니다. 100%가 되어야 합니다.`); return false; }
        return true;
    };

    const openNameModal = (action) => {
        if (!validate()) return;
        setPendingAction(action);
        setShowNameModal(true);
    };

    const handleSave = async () => {
        if (!portfolioName.trim()) { alert('포트폴리오 이름을 입력해주세요.'); return; }
        try {
            // ✅ 실제 API 연결 시 주석 해제
            // await fetch('/api/portfolio/direct/save', { method:'POST', ... });
            setShowNameModal(false);
            alert('포트폴리오가 저장되었습니다!');
            navigate('/portfolio');
        } catch { alert('저장 중 오류가 발생했습니다.'); }
    };

    const handleResult = () => {
        if (!portfolioName.trim()) { alert('포트폴리오 이름을 입력해주세요.'); return; }
        setShowNameModal(false);
        navigate('/portfolio/result', {
            state: {
                stocks: cart.map(s => ({ name:s.name, ticker:s.ticker, weight:s.weight })),
                investAmount, currency, startDate, endDate, goalAmount,
                portfolioName, isDirect: true,
            },
        });
    };

    const handleModalConfirm = () =>
        pendingAction === 'save' ? handleSave() : handleResult();

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.layout}>

                {/* ── 왼쪽: 입력 폼 ── */}
                <div className={styles.formSection}>
                    <p className={styles.sectionTitle}>포트폴리오 직접 생성</p>

                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>투자 금액</label>
                        <div className={styles.amountRow}>
                            <select className={styles.currencySelect} value={currency} onChange={e=>setCurrency(e.target.value)}>
                                <option value="만원">만원</option>
                                <option value="달러">달러</option>
                            </select>
                            <input className={styles.textInput} type="number" placeholder="투자 금액 입력"
                                   value={investAmount} onChange={e=>setInvestAmount(e.target.value)} />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>투자 목표 기간</label>
                        <div className={styles.dateRow}>
                            <input className={styles.dateInput} type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} />
                            <span className={styles.dateSep}>~</span>
                            <input className={styles.dateInput} type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>목표 금액</label>
                        <input className={styles.textInput} type="number" placeholder="목표 금액 입력"
                               value={goalAmount} onChange={e=>setGoalAmount(e.target.value)} />
                    </div>

                    <div className={styles.btnGroup}>
                        <button className={styles.saveBtn} onClick={() => openNameModal('save')}>저장하기</button>
                        <button className={styles.resultBtn} onClick={() => openNameModal('result')}>결과 확인하기</button>
                    </div>
                </div>

                {/* ── 오른쪽: 장바구니 ── */}
                <div className={styles.cartSection}>
                    <p className={styles.sectionTitle}>
                        투자 종목
                        <span className={styles.cartCount}>{cart.length}개</span>
                    </p>

                    {cart.length === 0 ? (
                        <div className={styles.cartEmpty}>
                            <p className={styles.cartEmptyIcon}>+</p>
                            <p>아래 버튼을 눌러<br/>종목을 추가해주세요</p>
                        </div>
                    ) : (
                        <div className={styles.cartList}>
                            {cart.map(st => (
                                <div key={st.ticker} className={styles.cartItem}>
                                    <div className={styles.cartItemLeft}>
                                        <StockLogo ticker={st.ticker} name={st.name} />
                                        <div>
                                            <p className={styles.cartItemName}>{st.name}</p>
                                            <p className={styles.cartItemTicker}>{st.ticker} · {st.market}</p>
                                        </div>
                                    </div>
                                    <div className={styles.cartItemRight}>
                                        <div className={styles.weightRow}>
                                            <input className={styles.weightInput} type="number" min="0" max="100"
                                                   value={st.weight} onChange={e=>handleWeight(st.ticker, e.target.value)} />
                                            <span className={styles.weightPct}>%</span>
                                        </div>
                                        <button className={styles.removeBtn} onClick={() => handleRemove(st.ticker)}>✕</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {cart.length > 0 && (
                        <div className={styles.weightFooter}>
                            <div className={`${styles.weightTotal} ${totalWeight!==100 ? styles.weightError : styles.weightOk}`}>
                                비중 합계: {totalWeight}% {totalWeight===100 ? '✓' : `(${100-totalWeight > 0 ? '+' : ''}${100-totalWeight}% 남음)`}
                            </div>
                            {totalWeight !== 100 && (
                                <button className={styles.autoWeightBtn} onClick={handleAutoWeight}>
                                    균등 배분
                                </button>
                            )}
                        </div>
                    )}

                    <button className={styles.addStockBtn} onClick={openSearchModal}>
                        + 종목 추가
                    </button>

                    <button className={styles.cartConfirmBtn} onClick={() => openNameModal('result')}>
                        장바구니 확인
                    </button>
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
                                <p className={styles.searchMsg}>
                                    {searchQuery ? '검색 결과가 없습니다' : '종목명이나 티커를 입력하세요'}
                                </p>
                            ) : searchResults.map(st => {
                                const inCart = cart.find(s => s.ticker === st.ticker);
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
                                            <button className={`${styles.addBtn} ${inCart ? styles.addBtnDone : ''}`}
                                                    onClick={() => !inCart && handleAdd(st)} disabled={!!inCart}>
                                                {inCart ? '담김 ✓' : '+ 담기'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* 포트폴리오 이름 모달 */}
            {showNameModal && (
                <div className={styles.modalOverlay} onClick={() => setShowNameModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <p className={styles.modalTitle}>포트폴리오 이름 설정</p>
                        <p className={styles.modalDesc}>이 포트폴리오를 어떻게 부를까요?</p>
                        <input className={styles.modalInput} type="text" placeholder="예: 내 성장주 포트폴리오"
                               value={portfolioName} onChange={e => setPortfolioName(e.target.value)}
                               onKeyDown={e => e.key==='Enter' && handleModalConfirm()} autoFocus />
                        <div className={styles.modalBtns}>
                            <button className={styles.modalCancelBtn} onClick={() => setShowNameModal(false)}>취소</button>
                            <button className={styles.modalConfirmBtn} onClick={handleModalConfirm}>
                                {pendingAction==='save' ? '저장하기' : '결과 확인하기'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortfolioDirect;