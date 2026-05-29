import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

const marketData = [
    { name: '코스피', value: '2,738.42', change: '+18.65', percent: '+0.69%', up: true },
    { name: '나스닥', value: '19,215.46', change: '+124.80', percent: '+0.65%', up: true },
    { name: 'S&P 500', value: '5,304.72', change: '-6.20', percent: '-0.12%', up: false },
];

const exchangeData = [
    { name: 'USD/KRW', value: '1,356.50', change: '-4.30', percent: '-0.32%', up: false },
    { name: 'JPY/KRW', value: '9.14', change: '-0.03', percent: '-0.33%', up: false },
    { name: 'EUR/KRW', value: '1,472.20', change: '+2.10', percent: '+0.14%', up: true },
];

const products = [
    {
        icon: '📈',
        title: '주식',
        desc: '국내·해외 개별 종목 분석 및 직접 투자',
        stat: '상장 종목 3,800+',
    },
    {
        icon: '🗂️',
        title: 'ETF',
        desc: '분산 투자로 리스크를 줄이는 스마트 투자',
        stat: '국내외 ETF 700+',
    },
    {
        icon: '🤖',
        title: '로보어드바이저',
        desc: 'AI가 자동으로 포트폴리오를 설계·운용',
        stat: '평균 수익률 +11.4%',
    },
];

const histogramData = [
    { label: '-20%', h: 18, profit: false },
    { label: '-10%', h: 26, profit: false },
    { label: '0%',   h: 44, profit: true  },
    { label: '+5%',  h: 62, profit: true  },
    { label: '+10%', h: 82, profit: true  },
    { label: '+15%', h: 74, profit: true  },
    { label: '+20%', h: 58, profit: true  },
    { label: '+25%', h: 42, profit: true  },
    { label: '+30%', h: 30, profit: true  },
    { label: '+40%', h: 22, profit: false },
    { label: '+50%', h: 14, profit: false },
];

const SparklineSvg = ({ color }) => {
    const points = color === 'blue'
        ? '0,28 20,24 40,26 60,18 80,20 100,14 120,16 140,10 160,8 180,12 200,6'
        : '0,10 20,14 40,12 60,18 80,16 100,22 120,18 140,24 160,20 180,22 200,26';
    const fill = color === 'blue' ? '#E8F0FE' : '#E1F5EE';
    const stroke = color === 'blue' ? '#1B5ED9' : '#0F6E56';
    return (
        <svg className={styles.sparkline} viewBox="0 0 200 36" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <polyline points={points} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={`${points} 200,36 0,36`} fill={fill} stroke="none" opacity="0.5" />
        </svg>
    );
};

const HeroIllustration = () => (
    <svg viewBox="0 0 420 260" xmlns="http://www.w3.org/2000/svg" className={styles.heroSvg}>
        {/* 배경 원형 장식 */}
        <circle cx="340" cy="50" r="90" fill="#E8F0FE" opacity="0.5" />
        <circle cx="80" cy="200" r="60" fill="#E1F5EE" opacity="0.4" />

        {/* 카드 배경 */}
        <rect x="30" y="30" width="200" height="110" rx="14" fill="white" stroke="#E8ECF2" strokeWidth="1" />
        <rect x="50" y="50" width="80" height="10" rx="4" fill="#E8F0FE" />
        <rect x="50" y="68" width="140" height="22" rx="4" fill="#1B5ED9" opacity="0.12" />
        <text x="58" y="84" fontSize="13" fontWeight="700" fill="#1B5ED9" fontFamily="sans-serif">+12.8%</text>
        <rect x="50" y="100" width="160" height="6" rx="3" fill="#F0F2F5" />
        <rect x="50" y="100" width="105" height="6" rx="3" fill="#1B5ED9" opacity="0.5" />
        <rect x="50" y="115" width="160" height="6" rx="3" fill="#F0F2F5" />
        <rect x="50" y="115" width="130" height="6" rx="3" fill="#0F6E56" opacity="0.4" />

        {/* 차트 카드 */}
        <rect x="180" y="80" width="210" height="150" rx="14" fill="white" stroke="#E8ECF2" strokeWidth="1" />
        <text x="198" y="104" fontSize="11" fill="#888" fontFamily="sans-serif">포트폴리오 수익률</text>
        {/* 라인 차트 */}
        <polyline
            points="198,210 225,195 252,200 279,178 306,165 333,150 360,140 375,130"
            fill="none" stroke="#1B5ED9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        />
        <polyline
            points="198,210 225,195 252,200 279,178 306,165 333,150 360,140 375,130 375,220 198,220"
            fill="#1B5ED9" stroke="none" opacity="0.07"
        />
        {/* 도트 */}
        <circle cx="375" cy="130" r="4" fill="white" stroke="#1B5ED9" strokeWidth="2" />
        {/* 축선 */}
        <line x1="198" y1="220" x2="380" y2="220" stroke="#E8ECF2" strokeWidth="1" />

        {/* 원형 파이 */}
        <circle cx="100" cy="190" r="42" fill="white" stroke="#E8ECF2" strokeWidth="1" />
        <path d="M100,190 L100,148 A42,42 0 0,1 137,212 Z" fill="#1B5ED9" opacity="0.8" />
        <path d="M100,190 L137,212 A42,42 0 0,1 63,212 Z" fill="#0F6E56" opacity="0.7" />
        <path d="M100,190 L63,212 A42,42 0 0,1 100,148 Z" fill="#E8F0FE" stroke="#1B5ED9" strokeWidth="0.5" />
        <circle cx="100" cy="190" r="22" fill="white" />
        <text x="100" y="194" fontSize="10" fontWeight="600" fill="#1B5ED9" textAnchor="middle" fontFamily="sans-serif">MY</text>

        {/* 뱃지 */}
        <rect x="260" y="38" width="100" height="30" rx="8" fill="#1B5ED9" />
        <text x="310" y="58" fontSize="12" fontWeight="600" fill="white" textAnchor="middle" fontFamily="sans-serif">무료 진단 ↗</text>
    </svg>
);

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.homeContainer}>

            {/* 히어로 섹션 */}
            <div className={styles.heroSection}>
                <div className={styles.heroLeft}>
                    <p className={styles.heroEyebrow}>AI 기반 자산 분석 플랫폼</p>
                    <h1 className={styles.heroTitle}>
                        투자의 첫걸음,<br />
                        내 자산의 흐름을<br />
                        읽는 것부터.
                    </h1>
                    <p className={styles.heroSub}>
                        막연한 두려움 대신 데이터가 주는 확실함을 경험해 보세요.
                        기본적인 수입과 지출 데이터만으로도 충분합니다.
                        MoneyMate의 진단 솔루션이 당신의 일상에 꼭 맞는
                        현실적인 포트폴리오를 제안합니다.
                    </p>
                    <button
                        className={styles.primaryButton}
                        onClick={() => navigate('/financial/input')}
                    >
                        무료 진단 시작하기 →
                    </button>
                </div>
                <div className={styles.heroRight}>
                    <HeroIllustration />
                </div>
            </div>

            {/* 지수 & 환율 2단 그리드 */}
            <div className={styles.gridRow}>
                <div className={styles.marketCard}>
                    <div className={styles.marketCardHeader}>
                        <span className={styles.marketTitle}>국내 · 해외 지수</span>
                        <span className={`${styles.badge} ${styles.badgeLive}`}>장중</span>
                    </div>
                    {marketData.map((item) => (
                        <div key={item.name} className={styles.marketRow}>
                            <span className={styles.marketName}>{item.name}</span>
                            <div className={styles.marketRight}>
                                <span className={styles.marketValue}>{item.value}</span>
                                <span className={item.up ? styles.changeUp : styles.changeDown}>
                                    {item.change} ({item.percent})
                                </span>
                            </div>
                        </div>
                    ))}
                    <SparklineSvg color="blue" />
                </div>

                <div className={styles.marketCard}>
                    <div className={styles.marketCardHeader}>
                        <span className={styles.marketTitle}>환율</span>
                        <span className={`${styles.badge} ${styles.badgeReal}`}>실시간</span>
                    </div>
                    {exchangeData.map((item) => (
                        <div key={item.name} className={styles.marketRow}>
                            <span className={styles.marketName}>{item.name}</span>
                            <div className={styles.marketRight}>
                                <span className={styles.marketValue}>{item.value}</span>
                                <span className={item.up ? styles.changeUp : styles.changeDown}>
                                    {item.change} ({item.percent})
                                </span>
                            </div>
                        </div>
                    ))}
                    <SparklineSvg color="green" />
                </div>
            </div>

            {/* 투자 상품 소개 */}
            <div className={styles.section}>
                <div className={styles.sectionLabel}>투자 상품 소개</div>
                <div className={styles.productGrid}>
                    {products.map((p) => (
                        <div key={p.title} className={styles.productCard}>
                            <div className={styles.productIcon}>{p.icon}</div>
                            <div className={styles.productTitle}>{p.title}</div>
                            <div className={styles.productDesc}>{p.desc}</div>
                            <div className={styles.productStat}>{p.stat}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 투자 수익률 회원 성향 그래프 */}
            <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                    <div>
                        <div className={styles.chartTitle}>투자 수익률에 따른 회원들의 성향 그래프</div>
                        <div className={styles.chartSub}>2026년 5월 기준 · 전체 회원 42,318명</div>
                    </div>
                    <div className={styles.legend}>
                        <div className={styles.legendItem}>
                            <div className={`${styles.legendDot} ${styles.dotProfit}`} />
                            <span>수익</span>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={`${styles.legendDot} ${styles.dotLoss}`} />
                            <span>손실</span>
                        </div>
                    </div>
                </div>
                <div className={styles.histogram}>
                    {histogramData.map((d) => (
                        <div key={d.label} className={styles.histBar}>
                            <div
                                className={`${styles.bar} ${d.profit ? styles.barProfit : styles.barLoss}`}
                                style={{ height: `${d.h}%` }}
                            />
                            <div className={styles.barLabel}>{d.label}</div>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
};

export default Home;