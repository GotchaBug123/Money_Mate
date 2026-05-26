import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PortfolioMain.module.css';

// ─────────────────────────────────────────────
// ✅ Mock 데이터 (백엔드 API 연결 시 이 부분만 교체)
// API: GET /api/portfolio/auto-list    → 자동생성 포트폴리오 목록
// API: GET /api/portfolio/direct-list → 직접입력 포트폴리오 목록
// Response: [ { id, name, investAmount, currency, startDate, endDate, goalAmount, stocks, createdAt,
//              finalAmount, avgReturnRate, achievementRate } ]
// ─────────────────────────────────────────────
const MOCK_AUTO_LIST = [
    {
        id: 1,
        name: '공격투자형 포트폴리오',
        investAmount: 500,
        currency: '만원',
        startDate: '2026-05-24',
        endDate: '2030-05-24',
        goalAmount: 800,
        finalAmount: 715,
        avgReturnRate: 12.4,
        achievementRate: 78,
        stocks: [
            { name: 'TIGER 미국S&P500', weight: 30 },
            { name: 'NVIDIA', weight: 25 },
            { name: '삼성전자', weight: 25 },
            { name: 'KODEX 2차전지', weight: 20 },
        ],
        createdAt: '2026-05-24',
    },
];

const MOCK_DIRECT_LIST = [];

const AutoCard = ({ portfolio, onClick }) => (
    <div className={styles.card} onClick={onClick}>
        <div className={styles.cardTop}>
            <p className={styles.cardName}>{portfolio.name}</p>
            <p className={styles.cardDate}>{portfolio.createdAt}</p>
        </div>
        <div className={styles.cardStats}>
            <div className={styles.statBox}>
                <p className={styles.statLabel}>투자금액</p>
                <p className={styles.statValue}>{Number(portfolio.investAmount).toLocaleString()}{portfolio.currency}</p>
            </div>
            <div className={styles.statBox}>
                <p className={styles.statLabel}>연평균 수익률</p>
                <p className={`${styles.statValue} ${styles.pos}`}>+{portfolio.avgReturnRate}%</p>
            </div>
            <div className={styles.statBox}>
                <p className={styles.statLabel}>달성 확률</p>
                <p className={`${styles.statValue} ${styles.pos}`}>{portfolio.achievementRate}%</p>
            </div>
        </div>
        <div className={styles.cardStocks}>
            {portfolio.stocks.map((st, i) => (
                <span key={i} className={styles.stockChip}>
                    {st.name} <strong>{st.weight}%</strong>
                </span>
            ))}
        </div>
        <div className={styles.cardBottom}>
            <span className={styles.cardPeriod}>{portfolio.startDate} ~ {portfolio.endDate}</span>
            <span className={styles.cardGoal}>목표 {Number(portfolio.goalAmount).toLocaleString()}{portfolio.currency}</span>
        </div>
    </div>
);

const DirectCard = ({ portfolio, onClick }) => (
    <div className={styles.card} onClick={onClick}>
        <div className={styles.cardTop}>
            <p className={styles.cardName}>{portfolio.name}</p>
            <p className={styles.cardDate}>{portfolio.createdAt}</p>
        </div>
        <div className={styles.cardStocks}>
            {portfolio.stocks.map((st, i) => (
                <span key={i} className={styles.stockChip}>
                    {st.name} <strong>{st.weight}%</strong>
                </span>
            ))}
        </div>
        <div className={styles.cardBottom}>
            <span className={styles.cardPeriod}>{portfolio.startDate} ~ {portfolio.endDate}</span>
            <span className={styles.cardGoal}>목표 {Number(portfolio.goalAmount).toLocaleString()}{portfolio.currency}</span>
        </div>
    </div>
);

const PortfolioMain = () => {
    const navigate = useNavigate();
    const [autoList, setAutoList] = useState([]);
    const [directList, setDirectList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                // ✅ 실제 API 연결 시 아래 주석 해제 후 Mock 제거
                // const [autoRes, directRes] = await Promise.all([
                //     fetch('/api/portfolio/auto-list'),
                //     fetch('/api/portfolio/direct-list'),
                // ]);
                // setAutoList(await autoRes.json());
                // setDirectList(await directRes.json());

                await new Promise((res) => setTimeout(res, 400));
                setAutoList(MOCK_AUTO_LIST);
                setDirectList(MOCK_DIRECT_LIST);
            } catch (err) {
                console.error('포트폴리오 목록 불러오기 실패', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPortfolios();
    }, []);

    return (
        <div className={styles.pageWrapper}>

            {/* 상단 자동 생성 버튼 */}
            <button
                className={styles.autoGenBtn}
                onClick={() => navigate('/portfolio/auto')}
            >
                포트폴리오 자동 생성
            </button>

            {/* ── 1번 줄: 자동생성 포트폴리오 ── */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <p className={styles.sectionTitle}>내 포트폴리오</p>
                    <p className={styles.sectionDesc}>
                        투자성향 분석 기반으로 AI가 자동 구성한 포트폴리오입니다.
                        수익률·달성 확률 등 시뮬레이션 결과를 확인할 수 있어요.
                    </p>
                </div>

                {loading ? (
                    <p className={styles.loadingText}>불러오는 중...</p>
                ) : autoList.length === 0 ? (
                    <div className={styles.emptyCard}>
                        <p className={styles.emptyText}>아직 자동 생성된 포트폴리오가 없어요</p>
                        <button className={styles.emptyBtn} onClick={() => navigate('/portfolio/auto')}>
                            자동 생성하러 가기 →
                        </button>
                    </div>
                ) : (
                    <div className={styles.cardRow}>
                        {autoList.map((p) => (
                            <AutoCard
                                key={p.id}
                                portfolio={p}
                                onClick={() => navigate('/portfolio/result', { state: { ...p } })}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* ── 2번 줄: 직접 입력 포트폴리오 ── */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <p className={styles.sectionTitle}>내 포트폴리오</p>
                    <p className={styles.sectionDesc}>
                        직접 목표와 종목을 설정해 나만의 포트폴리오를 구성할 수 있어요.
                        원하는 주식을 담고 목표 수익을 직접 설정해보세요.
                    </p>
                </div>

                {loading ? (
                    <p className={styles.loadingText}>불러오는 중...</p>
                ) : (
                    <div className={styles.cardRow}>
                        {directList.map((p) => (
                            <DirectCard
                                key={p.id}
                                portfolio={p}
                                onClick={() => navigate('/portfolio/result', { state: { ...p } })}
                            />
                        ))}
                        <div
                            className={styles.addCard}
                            onClick={() => navigate('/portfolio/direct')}
                        >
                            <span className={styles.addIcon}>+</span>
                            <span className={styles.addText}>생성하기</span>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default PortfolioMain;