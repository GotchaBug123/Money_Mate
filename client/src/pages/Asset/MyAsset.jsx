import React from 'react';
import {Link} from 'react-router-dom';
import styles from './MyAsset.module.css'; // 💡 모듈 CSS 불러오기

function MyAsset() {
    // 💡 백엔드 연동 전 임시로 사용할 하드코딩 데이터
    const mockData = {
        score: 85,
        investableAmount: '5,000,000',
        monthlyIncome: '3,000,000',
        monthlyFixedExpense: '1,000,000',
        monthlyVariableExpense: '800,000',
        debt: '15,000,000',
        cash: '2,000,000'
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>

                {/* 테스트용 페이지 이동 버튼 */}
                <div className={styles.topNavWrapper}>
                    <Link to="/asset-detail" className={styles.topNavLink}>
                        상세 화면(Asset Detail)으로 이동 &gt;
                    </Link>
                </div>

                <h2 className={styles.pageTitle}>마이 자산 화면</h2>

                {/* 1. 재무 평가 점수 */}
                <div className={styles.scoreCard}>
                    <span className={styles.scoreLabel}>재무 평가 점수</span>
                    <span className={styles.scoreValue}>{mockData.score}점</span>
                </div>

                {/* 2. 그래프 (꺾은선) 영역 */}
                <div className={styles.chartCard}>
                    그래프(꺾은선) 영역 - 데이터 연동 예정
                </div>

                {/* 3. 필터 버튼 4개 */}
                <div className={styles.filterGroup}>
                    {['필터1', '필터2', '필터3', '필터4'].map(filter => (
                        <button key={filter} className={styles.filterBtn}>
                            {filter}
                        </button>
                    ))}
                </div>

                {/* 4. 재무 요약 정보 카드 */}
                <div className={styles.summaryCard}>

                    {/* 상단: 투자 가능 금액 */}
                    <div className={styles.investableRow}>
                        <span className={styles.investableLabel}>투자 가능 금액</span>
                        <span className={styles.investableValue}>{mockData.investableAmount}원</span>
                    </div>

                    {/* 하단: 4개 항목 2단 Grid */}
                    <div className={styles.summaryGrid}>
                        <div className={styles.gridItem}>
                            <span className={styles.gridLabel}>월 수입</span>
                            <span className={styles.gridValue}>{mockData.monthlyIncome}원</span>
                        </div>
                        <div className={styles.gridItem}>
                            <span className={styles.gridLabel}>월 고정지출</span>
                            <span className={styles.gridValue}>{mockData.monthlyFixedExpense}원</span>
                        </div>
                        <div className={styles.gridItem}>
                            <span className={styles.gridLabel}>월 변동지출</span>
                            <span className={styles.gridValue}>{mockData.monthlyVariableExpense}원</span>
                        </div>
                        <div className={styles.gridItem}>
                            <span className={styles.gridLabel}>부채</span>
                            <span className={styles.gridValue}>{mockData.debt}원</span>
                        </div>
                        <div className={styles.gridItem}>
                            <span className={styles.gridLabel}>보유 현금</span>
                            <span className={styles.gridValue}>{mockData.cash}원</span>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default MyAsset;