import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {useModal} from '../../hooks/useModal';
import styles from './AssetDetail.module.css';

function AssetDetail() {
    const {isOpen, open, close} = useModal();
    const [currentMonth, setCurrentMonth] = useState(4);

    const monthlyData = {
        1: {
            monthlyReturn: '+1.8%',
            totalReturn: '+4.2%',
        },
        2: {
            monthlyReturn: '+2.7%',
            totalReturn: '+6.9%',
        },
        3: {
            monthlyReturn: '-1.1%',
            totalReturn: '+5.8%',
        },
        4: {
            monthlyReturn: '+5.2%',
            totalReturn: '+12.8%',
        },
        5: {
            monthlyReturn: '+3.4%',
            totalReturn: '+16.2%',
        },
        6: {
            monthlyReturn: '-0.8%',
            totalReturn: '+15.4%',
        },
        7: {
            monthlyReturn: '+2.9%',
            totalReturn: '+18.3%',
        },
    };

    const handlePrevMonth = () => {
        setCurrentMonth((prevMonth) => {
            if (prevMonth === 1) {
                return 1;
            }

            return prevMonth - 1;
        });
    };

    const handleNextMonth = () => {
        setCurrentMonth((prevMonth) => {
            if (prevMonth === 12) {
                return 12;
            }

            return prevMonth + 1;
        });
    };

    const mockData = {
        monthlyReturn: monthlyData[currentMonth]?.monthlyReturn || '+0.0%',
        totalReturn: monthlyData[currentMonth]?.totalReturn || '+0.0%',
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

                <Link to="/asset" className={styles.backLink}>
                    &lt; 요약 화면(My Asset)으로 돌아가기
                </Link>

                {/* 1. 상단 수익률 카드 */}
                <div className={styles.topCard}>
                    <div className={styles.returnItem}>
                        <span className={styles.returnMonth}>
                            <button type="button" onClick={handlePrevMonth}>
                                ◀
                            </button>
                            {currentMonth}월
                            <button type="button" onClick={handleNextMonth}>
                                ▶
                            </button>
                        </span>
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
                </div>

                {/* 2. 그래프 (히스토그램) 영역 */}
                <div className={styles.chartCard}>
                    그래프(히스토그램) 영역 - 데이터 연동 예정
                </div>

                {/* 3. 종목 리스트 2분할 */}
                <div className={styles.listSection}>

                    {/* 투자 종목 영역 */}
                    <div className={styles.listColumn}>
                        <div className={styles.listBox}>
                            <h3 className={styles.listTitle}>투자 종목</h3>
                            {mockData.investedStocks.map(stock => {
                                const isPos = !stock.returnRate.includes('-');
                                return (
                                    <div key={stock.id} className={styles.listItem}>
                                        <span className={styles.itemName}>{stock.name}</span>
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

                    {/* 관심 종목 영역 */}
                    <div className={styles.listColumn}>
                        <div className={styles.listBox}>
                            <h3 className={styles.listTitle}>관심 종목</h3>
                            {mockData.watchList.map(stock => (
                                <div key={stock.id} className={styles.listItem}>
                                    <span className={styles.itemName}>{stock.name}</span>
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

            {/* 💡 주식사기화면 모달 (팝업) */}
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