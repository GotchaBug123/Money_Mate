import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PortfolioDirect.module.css';

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

const PortfolioDirect = () => {
    const navigate = useNavigate();

    const [portfolioName, setPortfolioName] = useState('');
    const [currency,      setCurrency]      = useState('원화');
    const [investAmount,  setInvestAmount]  = useState('');
    const [addPeriod,     setAddPeriod]     = useState('없음');
    const [addAmount,     setAddAmount]     = useState('');
    const [startDate,     setStartDate]     = useState('');
    const [endDate,       setEndDate]       = useState('');
    const [goalAmount,    setGoalAmount]    = useState('');
    const [cart,          setCart]          = useState([]);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [searchQuery,     setSearchQuery]     = useState('');
    const [searchResults,   setSearchResults]   = useState([]);
    const [showNameModal, setShowNameModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    const handleSearch = () => setSearchResults(searchStocks(searchQuery));

    const handleAdd = (stock) => {
        if (cart.find(s => s.ticker === stock.ticker)) { alert('이미 추가된 종목입니다.'); return; }
        const newCart = [...cart, { ...stock, weight: 0 }];
        const eq = Math.floor(100 / newCart.length);
        const rem = 100 - eq * newCart.length;
        setCart(newCart.map((s,i) => ({ ...s, weight: i===0 ? eq+rem : eq })));
    };

    const handleRemove = (ticker) => {
        const newCart = cart.filter(s => s.ticker !== ticker);
        if (!newCart.length) { setCart([]); return; }
        const eq = Math.floor(100 / newCart.length);
        const rem = 100 - eq * newCart.length;
        setCart(newCart.map((s,i) => ({ ...s, weight: i===0 ? eq+rem : eq })));
    };

    const handleWeight = (ticker, val) =>
        setCart(cart.map(s => s.ticker===ticker ? { ...s, weight: Number(val) } : s));

    const totalWeight = cart.reduce((sum,s) => sum + Number(s.weight), 0);

    const handleAutoWeight = () => {
        if (!cart.length) return;
        const eq = Math.floor(100 / cart.length);
        const rem = 100 - eq * cart.length;
        setCart(cart.map((s,i) => ({ ...s, weight: i===0 ? eq+rem : eq })));
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
                investAmount, currency, addPeriod, addAmount,
                startDate, endDate, goalAmount, portfolioName, isDirect: true,
            },
        });
    };

    const handleModalConfirm = () => pendingAction === 'save' ? handleSave() : handleResult();

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.pageHeader}>
                <div className={styles.pageHeaderIcon}>
                    <i className="ti ti-chart-pie" />
                </div>
                <div>
                    <p className={styles.pageHeaderTitle}>포트폴리오 직접 생성</p>
                    <p className={styles.pageHeaderDesc}>나만의 투자 목표에 맞는 포트폴리오를 직접 구성해보세요.</p>
                </div>
            </div>

            <div className={styles.layout}>
                {/* 왼쪽 */}
                <div className={styles.panel}>
                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>목표 이름</label>
                        <input className={styles.textInput} type="text" placeholder="목표 이름을 입력해주세요"
                               value={portfolioName} onChange={e=>setPortfolioName(e.target.value)} />
                    </div>

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
                                type="number" placeholder="금액 입력"
                                value={addAmount} onChange={e=>setAddAmount(e.target.value)}
                                disabled={addPeriod==='없음'}
                            />
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

                    <div className={styles.btnRow}>
                        <button className={styles.saveBtn} onClick={() => openNameModal('save')}>
                            <i className="ti ti-device-floppy" />저장하기
                        </button>
                        <button className={styles.resultBtn} onClick={() => openNameModal('result')}>
                            <i className="ti ti-chart-bar" />결과 확인하기
                        </button>
                    </div>
                </div>

                {/* 오른쪽 */}
                <div className={styles.panel}>
                    <div className={styles.stockHead}>
                        <div className={styles.stockTitleRow}>
                            <span className={styles.inputLabel}>투자 종목</span>
                            <span className={styles.stockBadge}>{cart.length}개</span>
                        </div>
                        <button className={styles.addStockBtn} onClick={() => {
                            setSearchQuery(''); setSearchResults([]); setShowSearchModal(true);
                        }}>
                            <i className="ti ti-plus" />종목 추가하기
                        </button>
                    </div>

                    {cart.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIllust}>
                                <i className="ti ti-clipboard-list" style={{ fontSize:'32px', color:'#185FA5' }} />
                            </div>
                            <p className={styles.emptyTitle}>아직 추가된 종목이 없어요</p>
                            <p className={styles.emptyDesc}>종목 추가하기 버튼을 눌러<br/>투자 종목을 추가해보세요.</p>
                        </div>
                    ) : (
                        <div className={styles.cartList}>
                            {cart.map(st => (
                                <div key={st.ticker} className={styles.cartItem}>
                                    <div className={styles.cartLeft}>
                                        <StockLogo ticker={st.ticker} name={st.name} />
                                        <div>
                                            <p className={styles.cartName}>{st.name}</p>
                                            <p className={styles.cartTicker}>{st.ticker} · {st.market}</p>
                                        </div>
                                    </div>
                                    <div className={styles.cartRight}>
                                        <input className={styles.weightInput} type="number" min="0" max="100"
                                               value={st.weight} onChange={e=>handleWeight(st.ticker, e.target.value)} />
                                        <span className={styles.weightPct}>%</span>
                                        <button className={styles.removeBtn} onClick={() => handleRemove(st.ticker)}>✕</button>
                                    </div>
                                </div>
                            ))}
                            {cart.length > 0 && (
                                <div className={styles.weightFooter}>
                                    <span className={`${styles.weightTotal} ${totalWeight!==100 ? styles.weightErr : styles.weightOk}`}>
                                        비중 합계: {totalWeight}% {totalWeight===100 ? '✓' : `(${100-totalWeight > 0 ? '+' : ''}${100-totalWeight}% 남음)`}
                                    </span>
                                    {totalWeight !== 100 && (
                                        <button className={styles.autoBtn} onClick={handleAutoWeight}>균등 배분</button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <button className={styles.cartBtn} onClick={() => openNameModal('result')}>
                        <i className="ti ti-shopping-cart" />장바구니 담기
                    </button>
                </div>
            </div>

            {/* 종목 검색 모달 */}
            {showSearchModal && (
                <div className={styles.overlay} onClick={() => setShowSearchModal(false)}>
                    <div className={styles.searchModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHead}>
                            <p className={styles.modalTitle}>종목 검색</p>
                            <button className={styles.modalClose} onClick={() => setShowSearchModal(false)}>✕</button>
                        </div>
                        <div className={styles.searchRow}>
                            <input className={styles.searchInput} type="text" placeholder="종목명 또는 티커 입력"
                                   value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
                                   onKeyDown={e=>e.key==='Enter' && handleSearch()} autoFocus />
                            <button className={styles.searchBtn} onClick={handleSearch}>검색</button>
                        </div>
                        <div className={styles.searchResults}>
                            {searchResults.length === 0 ? (
                                <p className={styles.searchMsg}>{searchQuery ? '검색 결과가 없습니다' : '종목명이나 티커를 입력하세요'}</p>
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

            {/* 이름 설정 모달 */}
            {showNameModal && (
                <div className={styles.overlay} onClick={() => setShowNameModal(false)}>
                    <div className={styles.nameModal} onClick={e => e.stopPropagation()}>
                        <p className={styles.modalTitle}>포트폴리오 이름 설정</p>
                        <p className={styles.modalDesc}>이 포트폴리오를 어떻게 부를까요?</p>
                        <input className={styles.nameInput} type="text" placeholder="예: 내 성장주 포트폴리오"
                               value={portfolioName} onChange={e=>setPortfolioName(e.target.value)}
                               onKeyDown={e=>e.key==='Enter' && handleModalConfirm()} autoFocus />
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