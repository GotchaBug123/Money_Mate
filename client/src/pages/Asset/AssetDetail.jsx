import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import {useModal} from '../../hooks/useModal';
import styles from './AssetDetail.module.css';
import {getHoldingListApi, addHoldingApi, removeHoldingApi, getWatchlistApi} from '../../api/assetApi.js';
import {searchAssetsApi} from '../../api/rebalanceApi.js';

const monthlyData = {
    '2026-01': {monthlyReturn: '+1.8%', totalReturn: '+4.2%'},
    '2026-02': {monthlyReturn: '+2.7%', totalReturn: '+6.9%'},
    '2026-03': {monthlyReturn: '-1.1%', totalReturn: '+5.8%'},
    '2026-04': {monthlyReturn: '+5.2%', totalReturn: '+12.8%'},
    '2026-05': {monthlyReturn: '+3.4%', totalReturn: '+16.2%'},
    '2026-06': {monthlyReturn: '-0.8%', totalReturn: '+15.4%'},
    '2026-07': {monthlyReturn: '+2.9%', totalReturn: '+18.3%'},
};

const barChartData = [
    {label: '1월', height: '34%', value: '+1.8%', minus: false},
    {label: '2월', height: '48%', value: '+2.7%', minus: false},
    {label: '3월', height: '24%', value: '-1.1%', minus: true},
    {label: '4월', height: '76%', value: '+5.2%', minus: false},
    {label: '5월', height: '58%', value: '+3.4%', minus: false},
    {label: '6월', height: '20%', value: '-0.8%', minus: true},
    {label: '7월', height: '52%', value: '+2.9%', minus: false},
];

function AssetDetail() {
    const {isOpen, open, close} = useModal();
    const {isOpen: isSellOpen, open: openSell, close: closeSell} = useModal();
    const [selectedDate, setSelectedDate] = useState('2026-04-01');
    const [holdings, setHoldings] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [buyPrice, setBuyPrice] = useState('');
    const [buyQty, setBuyQty] = useState(1);
    const [buyLoading, setBuyLoading] = useState(false);

    const [sellTarget, setSellTarget] = useState(null);
    const [sellLoading, setSellLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [holdingData, watchlistData] = await Promise.all([
                    getHoldingListApi(),
                    getWatchlistApi(),
                ]);
                setHoldings(holdingData);
                setWatchlist(watchlistData);
            } catch (error) {
                console.error('자산 상세 조회 실패:', error);
                alert('자산 정보를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleModalClose = () => {
        close();
        setSearchQuery('');
        setSearchResults([]);
        setSelectedStock(null);
        setBuyPrice('');
        setBuyQty(1);
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        try {
            const data = await searchAssetsApi(searchQuery);
            setSearchResults(data);
        } catch (error) {
            console.error('종목 검색 실패:', error);
            alert('종목 검색에 실패했습니다.');
        }
    };

    const handleSelectStock = (stock) => {
        setSelectedStock(stock);
        setSearchResults([]);
        setSearchQuery('');
    };

    const handleSellModalClose = () => {
        closeSell();
        setSellTarget(null);
    };

    const handleSell = async () => {
        if (!sellTarget) return alert('종목을 선택해주세요.');
        setSellLoading(true);
        try {
            await removeHoldingApi(sellTarget.holdingId);
            setHoldings((prev) => prev.filter(h => h.holdingId !== sellTarget.holdingId));
            handleSellModalClose();
        } catch (error) {
            console.error('종목 매도 실패:', error);
            alert('종목 매도에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setSellLoading(false);
        }
    };

    const handleBuy = async () => {
        if (!selectedStock) return alert('종목을 선택해주세요.');
        setBuyLoading(true);
        try {
            const added = await addHoldingApi({
                ticker: selectedStock.symbol,
                assetName: selectedStock.assetName,
                market: selectedStock.market,
                buyPrice: buyPrice ? Number(buyPrice) : undefined,
                quantity: Number(buyQty),
            });
            setHoldings((prev) => [...prev, added]);
            handleModalClose();
        } catch (error) {
            console.error('종목 담기 실패:', error);
            alert('종목 담기에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setBuyLoading(false);
        }
    };

    const selectedMonthKey = selectedDate.slice(0, 7);
    const monthlyReturn = monthlyData[selectedMonthKey]?.monthlyReturn || '+0.0%';
    const totalReturn = monthlyData[selectedMonthKey]?.totalReturn || '+0.0%';

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>

                <div className={styles.pageTop}>
                    <Link to="/asset" className={styles.backLink}>
                        &lt; 요약 화면으로 돌아가기
                    </Link>

                    <div>
                        <h2 className={styles.pageTitle}>자산 상세 현황</h2>
                        <p className={styles.pageDesc}>월별 수익률과 보유 종목 흐름을 확인합니다.</p>
                    </div>
                </div>

                <section className={styles.topCard}>
                    <div className={styles.returnItem}>
                        <span className={styles.returnLabel}>조회 날짜</span>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className={styles.returnDateInput}
                        />
                    </div>

                    <div className={styles.returnItem}>
                        <span className={styles.returnLabel}>월 수익률</span>
                        <span className={`${styles.returnValue} ${monthlyReturn.includes('-') ? styles.neg : styles.pos}`}>
                            {monthlyReturn}
                        </span>
                    </div>

                    <div className={styles.returnItem}>
                        <span className={styles.returnLabel}>종합 수익률</span>
                        <span className={`${styles.returnValue} ${totalReturn.includes('-') ? styles.neg : styles.pos}`}>
                            {totalReturn}
                        </span>
                    </div>
                </section>

                <section className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <div>
                            <h3>월별 수익률 흐름</h3>
                        </div>
                        <strong>{selectedMonthKey}</strong>
                    </div>

                    <div className={styles.barChart}>
                        {barChartData.map((bar) => (
                            <div key={bar.label} className={styles.barItem}>
                                <span>{bar.label}</span>
                                <div>
                                    <b className={bar.minus ? styles.minusBar : undefined} style={{height: bar.height}}></b>
                                </div>
                                <em>{bar.value}</em>
                            </div>
                        ))}
                    </div>
                </section>

                <div className={styles.listSection}>
                    <div className={styles.listColumn}>
                        <div className={styles.listBox}>
                            <div className={styles.listHeader}>
                                <div>
                                    <h3 className={styles.listTitle}>투자 종목</h3>
                                </div>
                                <strong>{loading ? '-' : `${holdings.length}개`}</strong>
                            </div>

                            {loading ? (
                                <p style={{color: 'var(--color-text-muted)', fontSize: '13px', padding: '12px 0'}}>불러오는 중...</p>
                            ) : holdings.length === 0 ? (
                                <p style={{color: 'var(--color-text-muted)', fontSize: '13px', padding: '12px 0'}}>보유 종목이 없습니다.</p>
                            ) : holdings.map((stock) => (
                                <div key={stock.holdingId} className={styles.listItem}>
                                    <div className={styles.stockInfo}>
                                        <span className={styles.stockAvatar}>{stock.assetName.slice(0, 1)}</span>
                                        <span className={styles.itemName}>{stock.assetName}</span>
                                    </div>

                                    <div className={styles.itemRight}>
                                        <span className={styles.itemQuantity}>{stock.quantity}주</span>
                                        <span className={styles.itemQuantity}>
                                            {stock.buyPrice ? `${Number(stock.buyPrice).toLocaleString()}원` : '-'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.btnGroup}>
                            <button onClick={open} className={styles.primaryBtn}>주식 사기</button>
                            <button className={styles.secondaryBtn} onClick={openSell}>주식 팔기</button>
                        </div>
                    </div>

                    <div className={styles.listColumn}>
                        <div className={styles.listBox}>
                            <div className={styles.listHeader}>
                                <div>
                                    <h3 className={styles.listTitle}>관심 종목</h3>
                                </div>
                                <strong>{loading ? '-' : `${watchlist.length}개`}</strong>
                            </div>

                            {loading ? (
                                <p style={{color: 'var(--color-text-muted)', fontSize: '13px', padding: '12px 0'}}>불러오는 중...</p>
                            ) : watchlist.length === 0 ? (
                                <p style={{color: 'var(--color-text-muted)', fontSize: '13px', padding: '12px 0'}}>관심 종목이 없습니다.</p>
                            ) : watchlist.map((stock) => (
                                <div key={stock.watchlistId} className={styles.listItem}>
                                    <div className={styles.stockInfo}>
                                        <span className={styles.stockAvatar}>{stock.assetName.slice(0, 1)}</span>
                                        <span className={styles.itemName}>{stock.assetName}</span>
                                    </div>

                                    <span className={styles.itemQuantity}>{stock.market ?? stock.ticker}</span>
                                </div>
                            ))}
                        </div>

                        <div className={styles.btnGroup}>
                            <button className={styles.secondaryBtn}>관심 종목 담기</button>
                        </div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className={styles.modalOverlay} onClick={handleModalClose}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>주식 사기</h3>
                            <button onClick={handleModalClose} className={styles.modalCloseBtn}>✕</button>
                        </div>

                        {/* 종목 검색 */}
                        {!selectedStock && (
                            <>
                                <div style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
                                    <input
                                        type="text"
                                        placeholder="종목명 또는 티커 입력"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                        className={styles.qtyInput}
                                        style={{flex: 1}}
                                        autoFocus
                                    />
                                    <button className={styles.buyBtn} onClick={handleSearch}>검색</button>
                                </div>

                                {searchResults.length > 0 && (
                                    <div style={{maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: '8px', marginBottom: '12px'}}>
                                        {searchResults.map((stock) => (
                                            <div
                                                key={stock.symbol}
                                                onClick={() => handleSelectStock(stock)}
                                                style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--color-border-light)'}}
                                            >
                                                <div>
                                                    <p style={{margin: 0, fontSize: '14px', fontWeight: 600}}>{stock.assetName}</p>
                                                    <p style={{margin: 0, fontSize: '12px', color: 'var(--color-text-muted)'}}>{stock.symbol} · {stock.market}</p>
                                                </div>
                                                <span style={{fontSize: '12px', color: 'var(--color-primary)'}}>+ 선택</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {searchResults.length === 0 && searchQuery && (
                                    <p style={{fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px'}}>검색 결과가 없습니다.</p>
                                )}
                            </>
                        )}

                        {/* 선택된 종목 */}
                        {selectedStock && (
                            <div style={{padding: '10px 14px', background: 'var(--color-bg-input)', borderRadius: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <div>
                                    <p style={{margin: 0, fontSize: '14px', fontWeight: 600}}>{selectedStock.assetName}</p>
                                    <p style={{margin: 0, fontSize: '12px', color: 'var(--color-text-muted)'}}>{selectedStock.symbol} · {selectedStock.market}</p>
                                </div>
                                <button onClick={() => setSelectedStock(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '14px'}}>✕</button>
                            </div>
                        )}

                        {/* 수량 / 매수가 입력 */}
                        <div className={styles.modalBottomRow}>
                            <div className={styles.qtyControl}>
                                <input
                                    type="number"
                                    value={buyQty}
                                    min={1}
                                    onChange={e => setBuyQty(e.target.value)}
                                    className={styles.qtyInput}
                                />
                                <span className={styles.unitText}>주</span>
                            </div>
                            <div className={styles.qtyControl}>
                                <input
                                    type="number"
                                    placeholder="매수가"
                                    value={buyPrice}
                                    min={0}
                                    onChange={e => setBuyPrice(e.target.value)}
                                    className={styles.qtyInput}
                                />
                                <span className={styles.unitText}>원</span>
                            </div>
                            <button
                                className={styles.buyBtn}
                                onClick={handleBuy}
                                disabled={!selectedStock || buyLoading}
                            >
                                {buyLoading ? '처리 중...' : '매수하기'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isSellOpen && (
                <div className={styles.modalOverlay} onClick={handleSellModalClose}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>주식 팔기</h3>
                            <button onClick={handleSellModalClose} className={styles.modalCloseBtn}>✕</button>
                        </div>

                        {holdings.length === 0 ? (
                            <p style={{fontSize: '14px', color: 'var(--color-text-muted)', padding: '12px 0'}}>보유 종목이 없습니다.</p>
                        ) : (
                            <div style={{maxHeight: '260px', overflowY: 'auto', marginBottom: '12px'}}>
                                {holdings.map((stock) => {
                                    const isSelected = sellTarget?.holdingId === stock.holdingId;
                                    return (
                                        <div
                                            key={stock.holdingId}
                                            onClick={() => setSellTarget(isSelected ? null : stock)}
                                            style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                padding: '10px 14px', cursor: 'pointer', borderRadius: '8px', marginBottom: '6px',
                                                border: `1px solid ${isSelected ? 'var(--color-error)' : 'var(--color-border)'}`,
                                                background: isSelected ? 'var(--color-error-bg)' : 'var(--color-bg-input)',
                                            }}
                                        >
                                            <div>
                                                <p style={{margin: 0, fontSize: '14px', fontWeight: 600}}>{stock.assetName}</p>
                                                <p style={{margin: 0, fontSize: '12px', color: 'var(--color-text-muted)'}}>
                                                    {stock.quantity}주 · {stock.buyPrice ? `${Number(stock.buyPrice).toLocaleString()}원` : '매수가 없음'}
                                                </p>
                                            </div>
                                            {isSelected && <span style={{fontSize: '12px', color: 'var(--color-error)', fontWeight: 600}}>선택됨 ✓</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className={styles.modalBottomRow}>
                            <button className={styles.secondaryBtn} onClick={handleSellModalClose}>취소</button>
                            <button
                                className={styles.buyBtn}
                                onClick={handleSell}
                                disabled={!sellTarget || sellLoading}
                                style={{background: sellTarget ? 'var(--color-error)' : undefined}}
                            >
                                {sellLoading ? '처리 중...' : '매도하기'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AssetDetail;
