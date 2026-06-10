import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import styles from './MyAsset.module.css';
import {getFinancialProfileApi, getFinanceDiagnosisApi} from '../../api/myPageApi.js';
import {getPortfolioHistoryApi} from '../../api/assetApi.js';
import {useAuthStore} from '../../store/useAuthStore.js';

// SVG viewBox "0 0 720 250" 기준으로 월별 평가액을 좌표로 변환
const buildChartPoints = (monthlyHistory) => {
    if (!monthlyHistory || monthlyHistory.length === 0) return [];
    const values = monthlyHistory.map(m => Number(m.portfolioValue));
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;
    const X_START = 70, X_END = 650, Y_MIN = 50, Y_MAX = 200;
    const n = monthlyHistory.length;
    return monthlyHistory.map((m, i) => ({
        month: m.label,
        x: n === 1 ? (X_START + X_END) / 2 : X_START + (i / (n - 1)) * (X_END - X_START),
        y: Y_MAX - ((Number(m.portfolioValue) - minVal) / range) * (Y_MAX - Y_MIN),
    }));
};

const filterDescription = {
    전체: '전체 재무 정보를 확인합니다.',
    수입: '월 수입과 보유 현금을 확인합니다.',
    지출: '월 고정지출과 월 변동지출을 확인합니다.',
    부채: '현재 부채 정보를 확인합니다.',
};

function MyAsset() {
    const navigate = useNavigate();
    const {user} = useAuthStore();
    const [activeFilter, setActiveFilter] = useState('전체');
    const [profile, setProfile] = useState(null);
    const [diagnosis, setDiagnosis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chartPoints, setChartPoints] = useState([]);

    useEffect(() => {
        if (!user) return; // 비로그인 시 API 호출 안 함 (PrivateRoute가 블러 처리)
        const fetchData = async () => {
            try {
                const [profileRes, diagnosisRes, historyRes] = await Promise.all([
                    getFinancialProfileApi(),
                    getFinanceDiagnosisApi(),
                    getPortfolioHistoryApi().catch(() => null),
                ]);
                setProfile(profileRes);
                setDiagnosis(diagnosisRes);
                setChartPoints(buildChartPoints(historyRes?.monthlyHistory));
                setLoading(false);
            } catch (error) {
                if (error.response?.status === 404) {
                    // 재무진단 미완료 → 입력 페이지로 이동
                    navigate('/financial/input', {replace: true});
                } else {
                    console.error('자산 정보 조회 실패:', error);
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [user]);

    const summaryItems = profile ? [
        {category: '수입', label: '월 수입', value: `${Number(profile.monthlyIncome).toLocaleString()}원`},
        {category: '지출', label: '월 고정지출', value: `${Number(profile.monthlyFixedExpense).toLocaleString()}원`},
        {category: '지출', label: '월 변동지출', value: `${Number(profile.monthlyVariableExpense).toLocaleString()}원`},
        {category: '부채', label: '부채', value: `${Number(profile.totalLiability).toLocaleString()}원`},
        {category: '수입', label: '보유 현금', value: `${Number(profile.cashAsset).toLocaleString()}원`},
    ] : [];

    const filteredSummaryItems = activeFilter === '전체'
        ? summaryItems
        : summaryItems.filter((item) => item.category === activeFilter);

    if (loading) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.container}
                     style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px'}}>
                    <p style={{color: 'var(--color-text-muted)'}}>자산 정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }



    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>

                <div className={styles.topNavWrapper}>
                    <button
                        onClick={() => navigate('/financial/input')}
                        className={styles.topNavLink}
                    >
                        재무정보 수정하기 &gt;
                    </button>
                    <Link to="/asset-detail" className={styles.topNavLink}>
                        상세 화면으로 이동 &gt;
                    </Link>
                </div>

                <section className={styles.heroSection}>
                    <div>
                        <h2 className={styles.pageTitle}>마이 자산 화면</h2>
                        <p className={styles.pageDesc}>재무 평가 점수와 투자 가능 금액을 한눈에 확인합니다.</p>
                    </div>

                    <div className={styles.scoreCard}>
                        <span className={styles.scoreLabel}>재무 평가 점수</span>
                        <span className={styles.scoreValue}>{diagnosis?.totalScore ?? '-'}점</span>
                    </div>
                </section>

                <section className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <div>
                            <h3>자산 흐름 그래프</h3>
                        </div>
                        <strong>최근 6개월</strong>
                    </div>

                    <div className={styles.lineChartMock}>
                        {chartPoints.length === 0 ? (
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '160px', color: 'var(--color-text-muted)', fontSize: '14px'}}>
                                보유 종목을 추가하면 자산 흐름이 표시됩니다.
                            </div>
                        ) : (
                            <svg viewBox="0 0 720 250" className={styles.assetLineChart}>
                                <polyline
                                    points={chartPoints.map((point) => `${point.x},${point.y}`).join(' ')}
                                    fill="none"
                                    className={styles.assetLine}
                                />
                                {chartPoints.map((point) => (
                                    <g key={point.month}>
                                        <circle cx={point.x} cy={point.y} r="18" className={styles.assetDotBg}/>
                                        <circle cx={point.x} cy={point.y} r="7" className={styles.assetDot}/>
                                        <text x={point.x} y="222" textAnchor="middle" className={styles.assetMonthText}>
                                            {point.month}
                                        </text>
                                    </g>
                                ))}
                            </svg>
                        )}
                    </div>
                </section>

                <section className={styles.filterSection}>
                    <div className={styles.filterText}>
                        <span>재무 정보 필터</span>
                        <strong>{filterDescription[activeFilter]}</strong>
                    </div>

                    <div className={styles.filterGroup}>
                        {['전체', '수입', '지출', '부채'].map((filter) => (
                            <button
                                key={filter}
                                type="button"
                                className={`${styles.filterBtn} ${activeFilter === filter ? styles.activeFilterBtn : ''}`}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </section>

                <section className={styles.summaryCard}>
                    <div className={styles.investableRow}>
                        <span className={styles.investableLabel}>투자 가능 금액</span>
                        <span className={styles.investableValue}>
                            {profile ? `${Number(profile.investableAmount).toLocaleString()}원` : '-'}
                        </span>
                    </div>

                    <div className={styles.summaryGrid}>
                        {filteredSummaryItems.map((item) => (
                            <div className={styles.gridItem} key={item.label}>
                                <div>
                                    <span className={styles.gridCategory}>{item.category}</span>
                                    <span className={styles.gridLabel}>{item.label}</span>
                                </div>
                                <span className={styles.gridValue}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}

export default MyAsset;
