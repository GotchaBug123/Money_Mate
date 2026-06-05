import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Rectangle,
    ReferenceLine
} from 'recharts';
import styles from './Home.module.css';
import {getMarketIndexApi} from "../../api/homeApi.js";

const AGE_DATA = [
    {label: '20대', value: 187, sub: '평균 187만원'},
    {label: '30대', value: 412, sub: '평균 412만원'},
    {label: '40대', value: 865, sub: '평균 865만원'},
    {label: '50대+', value: 1240, sub: '평균 1,240만원'},
];

const TYPE_DATA = [
    {label: '🛡️ 안정형', value: -6.0, riskLevel: '1/5', holdings: '국채, 예금, MMF'},
    {label: '✅ 안정추구형', value: 3.2, riskLevel: '2/5', holdings: '채권 ETF, 배당주, 리츠'},
    {label: '⚖️ 위험중립형', value: 8.7, riskLevel: '3/5', holdings: '국내 대형주, 글로벌 ETF'},
    {label: '📈 적극투자형', value: 14.8, riskLevel: '4/5', holdings: '미국 빅테크, 국내 대형주'},
    {label: '🚀 공격투자형', value: 28.3, riskLevel: '5/5', holdings: '해외 성장주, 테마 ETF'},
];

const PRODUCT_INFO = {
    stock: {
        title: '주식이란?',
        sections: [
            {
                heading: '🍕 주식이란?',
                body: '친구가 피자가게를 오픈하려고 하는데 내가 10%를 보태줬다면, 나는 그 피자가게의 10% 주인이 됩니다. 이를 증명하는 문서가 바로 \'주식\'입니다.'
            },
            {
                heading: '📈 주식을 하면 뭐가 좋을까요?',
                body: '• 회사가 번 돈을 나눠 가집니다 (배당금)\n• 회사가 유명해지면 내 증서의 가치도 뜁니다 (시세차익)\n• 내가 직접 회사를 차리지 않아도 됩니다'
            },
            {heading: '⚠️ 당연히 세상에 공짜는 없습니다', body: '• 피자가게가 망하면 내 돈도 사라집니다 (원금 손실)\n• 매일 가격이 널뛰기를 합니다 (변동성)'},
            {heading: '💡 결론', body: '그래서 우리는 분산투자와 리밸런싱으로 위험은 깎아내고 수익은 안정적으로 챙기는 전략을 씁니다! 😉'},
        ],
    },
    etf: {
        title: 'ETF란?',
        sections: [
            {heading: '🍱 ETF란?', body: '금융 전문가들이 여러 기업을 한 바구니에 담아놓고, 딱 1주만 사도 그 안의 모든 기업에 자동으로 분산 투자가 되도록 만든 상품입니다.'},
            {
                heading: '🛒 ETF의 확실한 장점',
                body: '• 단돈 1~2만 원으로 대기업의 주주가 됩니다\n• 주식처럼 실시간으로 편리하게 사고팝니다\n• 계란이 알아서 나누어 담깁니다 (안전성)'
            },
            {heading: '⚠️ ETF 투자할 때 주의할 점', body: '• 대박 수익률을 기대하긴 어렵습니다\n• 쥐꼬리만 한 수수료가 매일 빠져나갑니다\n• 원금 보장은 절대 안 됩니다'},
            {heading: '💡 결론', body: '안정 추구형에 가까울수록 ETF 비중을 높여서 포트폴리오를 짜 드립니다. 😉'},
        ],
    },
    robo: {
        title: '로보어드바이저란?',
        sections: [
            {heading: '🤖 로보어드바이저가 무엇인가요?', body: '"로봇 + 자산관리사" — 유저님만을 위해 24시간 내내 열일하는 AI 자산관리사입니다.'},
            {heading: '👍 왜 로보어드바이저와 함께해야 할까요?', body: '• 감정 없는 철벽 투자\n• 시간과 노력의 절약\n• 하락장에서도 든든한 맷집'},
            {
                heading: '⚠️ 꼭 알아두세요!',
                body: '• 원금을 100% 보장해 주지는 못합니다\n• 벼락부자가 되는 "대박 수익률"은 어렵습니다\n• 예측하지 못한 돌발 변수에는 둔감할 수 있습니다'
            },
        ],
    },
};

const products = [
    {icon: '📈', title: '주식', key: 'stock', desc: '국내·해외 개별 종목 분석 및 직접 투자', stat: '상장 종목 3,800+'},
    {icon: '🗂️', title: 'ETF', key: 'etf', desc: '분산 투자로 리스크를 줄이는 스마트 투자', stat: '국내외 ETF 700+'},
    {icon: '🤖', title: '로보어드바이저', key: 'robo', desc: 'AI가 자동으로 포트폴리오를 설계·운용', stat: '평균 수익률 +11.4%'},
];

const GUIDE_STEPS = [
    {
        step: '1️⃣ STEP 1.',
        title: '무료 재무 & 성향 진단 (숨은 투자금 찾기)',
        items: [
            {label: '내 재무 현황 적기', desc: '현재 수입과 지출을 가볍게 입력하면, 매달 묵혀두기 아까운 \'진짜 투자 가능한 여유 자금\'을 AI가 찾아 드립니다.'},
            {label: '투자 성향 분석', desc: '몇 가지 문답을 통해 내가 공격형인지, 안정형인지 파악하고 국내주식 / 해외주식 / ETF의 최적 배분 기준점을 안내받습니다.'},
        ],
    },
    {
        step: '2️⃣ STEP 2.',
        title: 'AI 자동 포트폴리오 생성 (고민은 끝!)',
        items: [
            {label: '목표 설정', desc: '투자 가능한 금액, 원하는 기간, 최종 목표 금액을 입력하세요.'},
            {label: '자동 매칭', desc: '유저님의 성향에 맞춘 최적의 분산투자 종목과 황금 비율(%)을 자동으로 세팅해 드립니다.'},
        ],
    },
    {
        step: '3️⃣ STEP 3.',
        title: '리밸런싱 시뮬레이션 (눈으로 보는 마법)',
        items: [
            {
                label: '리밸런싱 결과 확인',
                desc: '주가 변동에 따라 깨진 비중을 주기적으로 맞춰주는 리밸런싱 포트폴리오와 방치한 포트폴리오의 미래 자산 성장 곡선을 직접 비교하고, 목표 달성 확률을 확인할 수 있습니다.'
            },
        ],
    },
    {
        step: '4️⃣ STEP 4.',
        title: '하트❤️와 장바구니🛒 활용하기',
        items: [
            {label: '❤️ 하트 (관심)', desc: '"당장 산 건 아니지만 지켜보고 싶을 때" — 나만의 가상 실험실에 저장되어 매달 가상 수익률을 추적할 수 있습니다.'},
            {label: '🛒 장바구니 (실제 구매)', desc: '"내 증권 계좌로 진짜 매수한 주식일 때" — 실제 매수 평단가와 수량을 입력해주세요.'},
        ],
    },
];

// 💡 브랜드 파란색(#1B5ED9) 및 초록색(#1A7A45) 계열로 벡터 그래픽 리밸런싱 완료
const HeroIllustration = () => (
    <svg viewBox="0 0 420 260" xmlns="http://www.w3.org/2000/svg" className={styles.heroSvg}>
        <circle cx="340" cy="50" r="90" fill="#EAF2FC" opacity="0.6"/>
        <circle cx="80" cy="200" r="60" fill="#EDFAF4" opacity="0.5"/>
        <rect x="30" y="30" width="200" height="110" rx="14" fill="white" stroke="#e8eaf0" strokeWidth="1"/>
        <rect x="50" y="50" width="80" height="10" rx="4" fill="#EAF2FC"/>
        <rect x="50" y="68" width="140" height="22" rx="4" fill="#1B5ED9" opacity="0.12"/>
        <text x="58" y="84" fontSize="13" fontWeight="700" fill="#1B5ED9" fontFamily="sans-serif">+12.8%</text>
        <rect x="50" y="100" width="160" height="6" rx="3" fill="#f8f9fb"/>
        <rect x="50" y="100" width="105" height="6" rx="3" fill="#1B5ED9" opacity="0.5"/>
        <rect x="50" y="115" width="160" height="6" rx="3" fill="#f8f9fb"/>
        <rect x="50" y="115" width="130" height="6" rx="3" fill="#1A7A45" opacity="0.4"/>
        <rect x="180" y="80" width="210" height="150" rx="14" fill="white" stroke="#e8eaf0" strokeWidth="1"/>
        <text x="198" y="104" fontSize="11" fill="#888" fontFamily="sans-serif">포트폴리오 수익률</text>
        <polyline points="198,210 225,195 252,200 279,178 306,165 333,150 360,140 375,130" fill="none" stroke="#1B5ED9"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="198,210 225,195 252,200 279,178 306,165 333,150 360,140 375,130 375,220 198,220"
                  fill="#1B5ED9" stroke="none" opacity="0.07"/>
        <circle cx="375" cy="130" r="4" fill="white" stroke="#1B5ED9" strokeWidth="2"/>
        <line x1="198" y1="220" x2="380" y2="220" stroke="#e8eaf0" strokeWidth="1"/>
        <circle cx="100" cy="190" r="42" fill="white" stroke="#e8eaf0" strokeWidth="1"/>
        <path d="M100,190 L100,148 A42,42 0 0,1 137,212 Z" fill="#1B5ED9" opacity="0.8"/>
        <path d="M100,190 L137,212 A42,42 0 0,1 63,212 Z" fill="#1A7A45" opacity="0.7"/>
        <path d="M100,190 L63,212 A42,42 0 0,1 100,148 Z" fill="#EAF2FC" stroke="#1B5ED9" strokeWidth="0.5"/>
        <circle cx="100" cy="190" r="22" fill="white"/>
        <text x="100" y="194" fontSize="10" fontWeight="700" fill="#1B5ED9" textAnchor="middle"
              fontFamily="sans-serif">MY
        </text>
        <rect x="260" y="38" width="100" height="30" rx="8" fill="#1B5ED9"/>
        <text x="310" y="58" fontSize="12" fontWeight="700" fill="white" textAnchor="middle" fontFamily="sans-serif">무료
            진단 ↗
        </text>
    </svg>
);

const AgeTooltip = ({active, payload, label}) => {
    if (!active || !payload?.length) return null;
    const val = payload[0].value;
    return (
        <div className={styles.tooltip}>
            <p className={styles.tooltipLabel}>{label}</p>
            <p className={styles.tooltipValue}>{val.toLocaleString()}만원</p>
            <p className={styles.tooltipSub}>평균 투자 금액</p>
        </div>
    );
};

const TypeTooltip = ({active, payload, label}) => {
    if (!active || !payload?.length) return null;
    const val = payload[0].value;
    const item = payload[0].payload;
    const isPos = val >= 0;
    return (
        <div className={styles.tooltip}>
            <p className={styles.tooltipLabel}>{label}</p>
            <p className={styles.tooltipValue} style={{color: isPos ? '#60A5FA' : '#f87171'}}>
                평균 수익률 {isPos ? '+' : ''}{val}%
            </p>
            <div className={styles.tooltipDivider}/>
            <p className={styles.tooltipRow}>위험 레벨: <strong>{item.riskLevel}</strong></p>
            <p className={styles.tooltipRow}>주요 종목: <strong>{item.holdings}</strong></p>
        </div>
    );
};

const GuideModal = ({onClose}) => (
    <div className={styles.modalOverlay} onClick={close}>
        <div className={styles.guideModalBox} onClick={e => e.stopPropagation()}>
            <div className={styles.guideModalHeader}>
                <div>
                    <p className={styles.guideModalEyebrow}>🚀 처음 오셨나요?</p>
                    <h2 className={styles.guideModalTitle}>3분 만에 내 자산 황금 비율 찾는 가이드</h2>
                    <p className={styles.guideModalSub}>"돈은 있는데 어디에 어떻게 투자해야 할지 모르겠다면?"</p>
                </div>
                <button className={styles.modalClose} onClick={onClose}>✕</button>
            </div>
            <div className={styles.guideModalBody}>
                <p className={styles.guideIntro}>저희는 유저님의 재무 상태를 진단해 최적의 분산투자 포트폴리오를 추천하고, 실제 자산을 등록해 황금 비율을 유지하도록 돕는
                    독립형 자산 관리 플랫폼입니다. 딱 4단계만 따라오시면 자산 관리의 감이 확실하게 잡힙니다!</p>
                {GUIDE_STEPS.map((s, i) => (
                    <div key={i} className={styles.guideStep}>
                        <div className={styles.guideStepHeader}>
                            <span className={styles.guideStepNum}>{s.step}</span>
                            <span className={styles.guideStepTitle}>{s.title}</span>
                        </div>
                        {s.items.map((item, j) => (
                            <div key={j} className={styles.guideItem}>
                                <p className={styles.guideItemLabel}>{item.label}</p>
                                <p className={styles.guideItemDesc}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const ProductModal = ({product, onClose}) => {
    const info = PRODUCT_INFO[product.key];
    if (!info) return null;
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.modalTitleRow}>
                        <span className={styles.modalIcon}>{product.icon}</span>
                        <h2 className={styles.modalTitle}>{info.title}</h2>
                    </div>
                    <button className={styles.modalClose} onClick={onClose}>✕</button>
                </div>
                <div className={styles.modalBody}>
                    {info.sections.map((sec, i) => (
                        <div key={i} className={styles.modalSection}>
                            <p className={styles.modalHeading}>{sec.heading}</p>
                            <p className={styles.modalText}>{sec.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Home = () => {
    const navigate = useNavigate();
    const [activeProduct, setActiveProduct] = useState(null);
    const [guideOpen, setGuideOpen] = useState(false);
    const [chartTab, setChartTab] = useState('age');

    const [marketData, setMarketData] = useState([]);

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                const data = await getMarketIndexApi();
                const formattedData = data.map(item => ({
                    name: item.name,
                    value: item.priceLabel,
                    change: item.changeLabel,
                    percent: `${item.changePercent > 0 ? '+' : ''}${item.changePercent}%`,
                    up: item.rise
                }));
                setMarketData(formattedData);
            } catch (error) {
                console.error("시장 지수 로드 실패: ", error);
            }
        };
        fetchMarketData();
    }, []);

    return (
        <div className={styles.homeContainer}>

            {/* 히어로 */}
            <div className={styles.heroSection}>
                <div className={styles.heroLeft}>
                    <p className={styles.heroEyebrow}>AI 기반 자산 분석 플랫폼</p>
                    <h1 className={styles.heroTitle}>
                        투자의 첫걸음,<br/>
                        내 자산의 흐름을<br/>
                        읽는 것부터.
                    </h1>
                    <p className={styles.heroSub}>
                        막연한 두려움 대신 데이터가 주는 확실함을 경험해 보세요.
                        MoneyMate의 진단 솔루션이 당신의 일상에 꼭 맞는
                        현실적인 포트폴리오를 제안합니다.
                    </p>
                    <div className={styles.heroBtns}>
                        <button className={styles.primaryButton} onClick={() => navigate('/financial/input')}>
                            무료 진단 시작하기 →
                        </button>
                        <button className={styles.guideButton} onClick={() => setGuideOpen(true)}>
                            🚀 사용 가이드
                        </button>
                    </div>
                </div>
                <div className={styles.heroRight}>
                    <HeroIllustration/>
                </div>
            </div>

            {/* 시장 지수 & 환율 */}
            <div className={styles.marketGrid}>
                {marketData.map((item) => (
                    <div key={item.name} className={styles.marketCard}>
                        <p className={styles.marketName}>{item.name}</p>
                        <p className={styles.marketValue}>{item.value}</p>
                        <p className={item.up ? styles.changeUp : styles.changeDown}>
                            {item.change} ({item.percent})
                        </p>
                    </div>
                ))}
            </div>

            {/* 투자 상품 소개 */}
            <div className={styles.section}>
                <div className={styles.sectionLabel}>투자 상품 소개</div>
                <div className={styles.productGrid}>
                    {products.map((p) => (
                        <div key={p.title} className={styles.productCard} onClick={() => setActiveProduct(p)}>
                            <div className={styles.productIcon}>{p.icon}</div>
                            <div className={styles.productTitle}>{p.title}</div>
                            <div className={styles.productDesc}>{p.desc}</div>
                            <div className={styles.productStat}>{p.stat}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 회원 투자 통계 */}
            <div className={styles.statsCard}>
                <div className={styles.statsTop}>
                    <div>
                        <p className={styles.statsTitle}>
                            {chartTab === 'age'
                                ? '다른 회원들은 얼마나 투자하고 있을까요? 💰'
                                : '나와 비슷한 성향의 투자자들은 얼마나 벌었을까요? 📈'}
                        </p>
                        <p className={styles.statsSub}>
                            {chartTab === 'age'
                                ? '전체 회원들의 실제 자산 데이터를 기반으로 정밀 집계된 통계입니다.'
                                : '전체 회원들의 투자 성향진단 문답 데이터 내용 결과를 종합 분석한 수치입니다.'}
                        </p>
                    </div>
                    <div className={styles.tabRow}>
                        <button className={`${styles.tabBtn} ${chartTab === 'age' ? styles.tabBtnOn : ''}`}
                                onClick={() => setChartTab('age')}>연령대별
                        </button>
                        <button className={`${styles.tabBtn} ${chartTab === 'type' ? styles.tabBtnOn : ''}`}
                                onClick={() => setChartTab('type')}>투자성향별
                        </button>
                    </div>
                </div>

                {chartTab === 'age' ? (
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={AGE_DATA} margin={{top: 10, right: 20, left: 0, bottom: 0}}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
                            <XAxis dataKey="label" axisLine={false} tickLine={false}
                                   tick={{fontSize: 12, fill: '#888'}}/>
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#bbb'}}
                                   tickFormatter={v => v >= 10000 ? `${v / 10000}억` : `${v}만`} width={46}/>
                            <Tooltip content={<AgeTooltip/>} cursor={{stroke: '#e4eaf5', strokeWidth: 1}}/>
                            <Line type="monotone" dataKey="value" stroke="#1B5ED9" strokeWidth={2.5}
                                  dot={{fill: '#1B5ED9', r: 5, strokeWidth: 2, stroke: '#fff'}}
                                  activeDot={{r: 7, fill: '#1B5ED9', stroke: '#fff', strokeWidth: 2}}/>
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className={styles.typeChartWrap}>
                        <div className={styles.typeChartLeft}>
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart layout="vertical" data={TYPE_DATA}
                                          margin={{top: 4, right: 60, left: 10, bottom: 4}} barCategoryGap="25%">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false}/>
                                    <XAxis type="number" domain={[-15, 35]}
                                           ticks={[-10, -5, 0, 5, 10, 15, 20, 25, 30]}
                                           tickFormatter={v => `${v > 0 ? '+' : ''}${v}%`}
                                           axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#bbb'}}/>
                                    <YAxis type="category" dataKey="label" width={110}
                                           axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#555'}}/>
                                    <Tooltip content={<TypeTooltip/>} cursor={{fill: '#f4f6fb'}}/>
                                    <ReferenceLine x={0} stroke="#e0e0e0" strokeWidth={1.5}/>
                                    <Bar dataKey="value" maxBarSize={22}
                                         label={{
                                             position: 'right',
                                             fontSize: 11,
                                             fontWeight: 700,
                                             formatter: (v) => `${v >= 0 ? '+' : ''}${v}%`,
                                             fill: '#555'
                                         }}
                                         shape={(props) => {
                                             const {x, y, width, height, value} = props;
                                             return (
                                                 <Rectangle
                                                     x={x}
                                                     y={y}
                                                     width={width}
                                                     height={height}
                                                     fill={value >= 0 ? '#1B5ED9' : '#C0392B'}
                                                     opacity={0.85}
                                                     radius={[0, 4, 4, 0]}
                                                 />
                                             );
                                         }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={styles.insightCards}>
                            <div className={styles.insightCard} style={{borderLeft: '3px solid #1B5ED9'}}>
                                <p className={styles.insightTitle}>🏆 가장 높은 수익률</p>
                                <p className={styles.insightType}>공격투자형</p>
                                <p className={styles.insightDesc}>분석 결과 평균 +28.3%로 가장 높은 수익률을 기록했습니다.</p>
                            </div>
                            <div className={styles.insightCard} style={{borderLeft: '3px solid #1A7A45'}}>
                                <p className={styles.insightTitle}>🛡️ 가장 낮은 변동성</p>
                                <p className={styles.insightType}>안정형</p>
                                <p className={styles.insightDesc}>원금 보존 중심으로 변동성이 가장 낮은 성향입니다.</p>
                            </div>
                            <div className={styles.insightCard} style={{borderLeft: '3px solid #B47D0C'}}>
                                <p className={styles.insightTitle}>⚖️ 균형 추천 성향</p>
                                <p className={styles.insightType}>위험중립형</p>
                                <p className={styles.insightDesc}>안정성과 수익률 모두 적절한 균형을 보여줍니다.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 상품 설명 팝업 */}
            {activeProduct && <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)}/>}
            {/* 사용 가이드 팝업 */}
            {guideOpen && <GuideModal onClose={() => setGuideOpen(false)}/>}

        </div>
    );
};

export default Home;