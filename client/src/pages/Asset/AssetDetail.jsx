import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {useModal} from '../../hooks/useModal';
import styles from './AssetDetail.module.css';

function AssetDetail() {
    const {isOpen, open, close} = useModal();
    const [selectedDate, setSelectedDate] = useState('2026-04-01');

    const monthlyData = {
        '2026-01': {
            monthlyReturn: '+1.8%',
            totalReturn: '+4.2%',
        },
        '2026-02': {
            monthlyReturn: '+2.7%',
            totalReturn: '+6.9%',
        },
        '2026-03': {
            monthlyReturn: '-1.1%',
            totalReturn: '+5.8%',
        },
        '2026-04': {
            monthlyReturn: '+5.2%',
            totalReturn: '+12.8%',
        },
        '2026-05': {
            monthlyReturn: '+3.4%',
            totalReturn: '+16.2%',
        },
        '2026-06': {
            monthlyReturn: '-0.8%',
            totalReturn: '+15.4%',
        },
        '2026-07': {
            monthlyReturn: '+2.9%',
            totalReturn: '+18.3%',
        },
    };

    const selectedMonthKey = selectedDate.slice(0, 7);

    const mockData = {
        monthlyReturn: monthlyData[selectedMonthKey]?.monthlyReturn || '+0.0%',
        totalReturn: monthlyData[selectedMonthKey]?.totalReturn || '+0.0%',
        investedStocks: [
            {id: 1, name: '삼성전자', quantity: '50주', returnRate: '+2.1%'},
            {id: 2, name: '애플', quantity: '10주', returnRate: '+8.5%'},
            {id: 3, name: '현대차', quantity: '15주', returnRate: '-1.2%'}
        ],
        watchList: [
            {id: 1, name: '테슬라', currentPrice: '250,000원'},
            {id: 2, name: '엔비디아', currentPrice: '1,200,000원'}
        ]
    };

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
                            onChange={(event) => setSelectedDate(event.target.value)}
                            className={styles.returnDateInput}
                        />
                    </div>

                    <div className={styles.returnItem}>
                        <span className={styles.returnLabel}>월 수익률</span>
                        <span
                            className={`${styles.returnValue} ${mockData.monthlyReturn.includes('-') ? styles.neg : styles.pos}`}>
                            {mockData.monthlyReturn}
                        </span>
                    </div>

                    <div className={styles.returnItem}>
                        <span className={styles.returnLabel}>종합 수익률</span>
                        <span
                            className={`${styles.returnValue} ${mockData.totalReturn.includes('-') ? styles.neg : styles.pos}`}>
                            {mockData.totalReturn}
                        </span>
                    </div>
                </section>

                <section className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <div>
                            <span className={styles.chartBadge}>Monthly Return</span>
                            <h3>월별 수익률 흐름</h3>
                        </div>
                        <strong>{selectedMonthKey}</strong>
                    </div>

                    <div className={styles.barChart}>
                        <div className={styles.barItem}>
                            <span>1월</span>
                            <div><b style={{height: '34%'}}></b></div>
                            <em>+1.8%</em>
                        </div>
                        <div className={styles.barItem}>
                            <span>2월</span>
                            <div><b style={{height: '48%'}}></b></div>
                            <em>+2.7%</em>
                        </div>
                        <div className={styles.barItem}>
                            <span>3월</span>
                            <div><b className={styles.minusBar} style={{height: '24%'}}></b></div>
                            <em>-1.1%</em>
                        </div>
                        <div className={styles.barItem}>
                            <span>4월</span>
                            <div><b style={{height: '76%'}}></b></div>
                            <em>+5.2%</em>
                        </div>
                        <div className={styles.barItem}>
                            <span>5월</span>
                            <div><b style={{height: '58%'}}></b></div>
                            <em>+3.4%</em>
                        </div>
                        <div className={styles.barItem}>
                            <span>6월</span>
                            <div><b className={styles.minusBar} style={{height: '20%'}}></b></div>
                            <em>-0.8%</em>
                        </div>
                        <div className={styles.barItem}>
                            <span>7월</span>
                            <div><b style={{height: '52%'}}></b></div>
                            <em>+2.9%</em>
                        </div>
                    </div>
                </section>

                <div className={styles.listSection}>
                    <div className={styles.listColumn}>
                        <div className={styles.listBox}>
                            <div className={styles.listHeader}>
                                <div>
                                    <span>Holding</span>
                                    <h3 className={styles.listTitle}>투자 종목</h3>
                                </div>
                                <strong>{mockData.investedStocks.length}개</strong>
                            </div>

                            {mockData.investedStocks.map(stock => {
                                const isPos = !stock.returnRate.includes('-');

                                return (
                                    <div key={stock.id} className={styles.listItem}>
                                        <div className={styles.stockInfo}>
                                            <span className={styles.stockAvatar}>{stock.name.slice(0, 1)}</span>
                                            <span className={styles.itemName}>{stock.name}</span>
                                        </div>

                                        <div className={styles.itemRight}>
                                            <span className={styles.itemQuantity}>{stock.quantity}</span>
                                            <span className={`${styles.itemReturn} ${isPos ? styles.pos : styles.neg}`}>
                                                {stock.returnRate}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className={styles.btnGroup}>
                            <button onClick={open} className={styles.primaryBtn}>주식 사기</button>
                            <button className={styles.secondaryBtn}>주식 팔기</button>
                        </div>
                    </div>

                    <div className={styles.listColumn}>
                        <div className={styles.listBox}>
                            <div className={styles.listHeader}>
                                <div>
                                    <span>Watchlist</span>
                                    <h3 className={styles.listTitle}>관심 종목</h3>
                                </div>
                                <strong>{mockData.watchList.length}개</strong>
                            </div>

                            {mockData.watchList.map(stock => (
                                <div key={stock.id} className={styles.listItem}>
                                    <div className={styles.stockInfo}>
                                        <span className={styles.stockAvatar}>{stock.name.slice(0, 1)}</span>
                                        <span className={styles.itemName}>{stock.name}</span>
                                    </div>

                                    <span className={styles.itemQuantity}>{stock.currentPrice}</span>
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
                <div className={styles.modalOverlay} onClick={close}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>주식 사기</h3>
                            <button onClick={close} className={styles.modalCloseBtn}>✕</button>
                        </div>

                        <button className={styles.searchPlaceholderBtn}>
                            + 종목 검색하기
                        </button>

                        <div className={styles.modalBottomRow}>
                            <div className={styles.qtyControl}>
                                <input type="number" defaultValue={0} min={0} className={styles.qtyInput}/>
                                <span className={styles.unitText}>주</span>
                            </div>
                            <button className={styles.buyBtn} onClick={() => {
                                alert('매수 기능은 준비 중입니다.');
                                close();
                            }}>
                                매수하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AssetDetail;