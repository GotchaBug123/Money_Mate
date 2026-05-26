import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './InvestmentDiagnosis.module.css';

const typeInfo = {
    '안정형':     { emoji: '🛡️', range: '12~21점', color: '#2E7D9E', bg: '#E3F2F8', desc: '원금 보존을 최우선으로 합니다. 예금·채권 중심의 안전 자산을 선호하며, 수익보다는 손실 방어가 중요합니다.' },
    '안정추구형': { emoji: '⚖️', range: '22~31점', color: '#1A7A45', bg: '#EDFAF4', desc: '안정성을 중시하면서도 소폭의 수익을 기대합니다. 채권 비중을 높이고 일부 주식·ETF를 편입하는 전략이 적합합니다.' },
    '위험중립형': { emoji: '🎯', range: '32~41점', color: '#1B5ED9', bg: '#E8F0FE', desc: '안정성과 수익성의 균형을 추구합니다. 국내외 ETF와 우량주를 균형 있게 편입하는 포트폴리오가 어울립니다.' },
    '적극투자형': { emoji: '🚀', range: '42~51점', color: '#B47D0C', bg: '#FAEEDA', desc: '수익 극대화를 위해 어느 정도의 위험을 감수합니다. 성장주·테마 ETF 비중을 높인 공격적 분산 투자가 적합합니다.' },
    '공격투자형': { emoji: '🔥', range: '52~60점', color: '#C0392B', bg: '#FFF0EE', desc: '높은 변동성도 감수하며 최대 수익을 추구합니다. 해외 성장주, 레버리지 ETF, 테마 집중 투자 전략에 어울립니다.' },
};

const getType = (total) => {
    if (total <= 21) return '안정형';
    if (total <= 31) return '안정추구형';
    if (total <= 41) return '위험중립형';
    if (total <= 51) return '적극투자형';
    return '공격투자형';
};

const productInfo = {
    '국내': {
        label: '국내 투자',
        desc: '코스피·코스닥 중심의 국내 주식과 ETF. 환율 리스크 없이 익숙한 시장에서 투자 가능합니다.',
        pros: ['환율 리스크 없음', '국내 기업 정보 접근 용이', '소액 투자 가능'],
        cons: ['시장 규모 제한', '성장성 상대적으로 낮음'],
    },
    '해외': {
        label: '해외 투자',
        desc: '미국·글로벌 주식 중심. 높은 성장성과 분산 효과를 기대할 수 있으나 환율 변동에 유의해야 합니다.',
        pros: ['글로벌 우량기업 접근', '높은 성장 포텐셜', '달러 자산 헤지'],
        cons: ['환율 리스크', '정보 접근 어려움'],
    },
    'ETF': {
        label: 'ETF 투자',
        desc: '국내외 다양한 ETF로 분산 투자. 낮은 비용과 높은 유동성으로 효율적인 포트폴리오 구성이 가능합니다.',
        pros: ['낮은 운용 비용', '간편한 분산 투자', '다양한 테마 선택'],
        cons: ['개별 종목 초과 수익 제한', '레버리지 상품 주의'],
    },
};

const calcProductScores = (answers, questions) => {
    const scores = { '국내': 0, '해외': 0, 'ETF': 0 };
    if (!answers || !questions) return scores;

    const total = answers.slice(0, 12).reduce((sum, ans, i) => {
        if (ans === null || ans === undefined) return sum;
        return sum + (questions[i]?.scores?.[ans] || 0);
    }, 0);

    const productAns = answers[12];
    if (productAns === 0) { scores['국내'] += 10; }
    else if (productAns === 1) { scores['국내'] += 20; }
    else if (productAns === 2) { scores['ETF'] += 20; scores['국내'] += 10; }
    else if (productAns === 3) { scores['해외'] += 20; }
    else if (productAns === 4) { scores['ETF'] += 20; scores['해외'] += 10; }

    if (total <= 21) { scores['국내'] += 30; scores['ETF'] += 20; scores['해외'] += 10; }
    else if (total <= 31) { scores['국내'] += 25; scores['ETF'] += 25; scores['해외'] += 15; }
    else if (total <= 41) { scores['ETF'] += 30; scores['국내'] += 20; scores['해외'] += 20; }
    else if (total <= 51) { scores['해외'] += 25; scores['ETF'] += 30; scores['국내'] += 15; }
    else { scores['해외'] += 35; scores['ETF'] += 25; scores['국내'] += 10; }

    const maxScore = Math.max(...Object.values(scores));
    Object.keys(scores).forEach((k) => {
        scores[k] = Math.min(100, Math.round((scores[k] / (maxScore + 10)) * 100));
    });
    return scores;
};

const InvestmentResult = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { answers, questions } = location.state || { answers: Array(14).fill(2), questions: [] };

    const [activeFilter, setActiveFilter] = useState('ETF');

    const totalScore = answers.slice(0, 12).reduce((sum, ans, i) => {
        if (ans === null || ans === undefined) return sum;
        return sum + (questions[i]?.scores?.[ans] || 0);
    }, 0);

    const typeName = getType(totalScore);
    const typeData = typeInfo[typeName];
    const productScores = calcProductScores(answers, questions);

    const themeAnswers = Array.isArray(answers[13]) ? answers[13] : [];
    const themeOptions = ['AI', '반도체', '2차전지', '자동차', '광통신', '배당/연금', '미국 기술주', '로봇/자동화'];
    const selectedThemes = themeAnswers.map((i) => themeOptions[i]);

    const filterData = productInfo[activeFilter];
    const filterScore = productScores[activeFilter];

    return (
        <div className={styles.pageWrapper} style={{ padding: 0 }}>
            <div className={styles.resultLayout3}>
                {/* ── 왼쪽: 투자 성향 ── */}
                <div className={styles.col1}>
                    <p className={styles.colLabel}>투자 성향</p>
                    <div className={styles.typeEmoji}>{typeData.emoji}</div>
                    <h2 className={styles.typeName} style={{ color: typeData.color }}>{typeName}</h2>
                    <div className={styles.typeRange} style={{ background: typeData.bg, color: typeData.color }}>
                        {typeData.range}
                    </div>
                    <p className={styles.typeDesc}>{typeData.desc}</p>

                    <div className={styles.scoreCircleWrap}>
                        <svg viewBox="0 0 80 80" className={styles.scoreCircle}>
                            <circle cx="40" cy="40" r="34" fill="none" stroke="#f0f2f5" strokeWidth="7" />
                            <circle
                                cx="40" cy="40" r="34" fill="none"
                                stroke={typeData.color} strokeWidth="7"
                                strokeDasharray={`${(totalScore / 60) * 213.6} 213.6`}
                                strokeLinecap="round"
                                transform="rotate(-90 40 40)"
                            />
                        </svg>
                        <div className={styles.scoreCircleText}>
                            <span className={styles.scoreCircleNum} style={{ color: typeData.color }}>{totalScore}</span>
                            <span className={styles.scoreCircleMax}>/ 60</span>
                        </div>
                    </div>

                    {selectedThemes.length > 0 && (
                        <div className={styles.themeSection}>
                            <p className={styles.themeLabel}>관심 테마</p>
                            <div className={styles.themeTags}>
                                {selectedThemes.map((t) => (
                                    <span key={t} className={styles.themeTag} style={{ background: typeData.bg, color: typeData.color }}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── 가운데: 투자 상품 분석 ── */}
                <div className={styles.col2}>
                    <p className={styles.colLabel}>투자 상품 분석</p>
                    <div className={styles.filterTabs}>
                        {['국내', '해외', 'ETF'].map((f) => (
                            <button
                                key={f}
                                className={`${styles.filterTab} ${activeFilter === f ? styles.filterTabActive : ''}`}
                                onClick={() => setActiveFilter(f)}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className={styles.filterCard} style={{ borderColor: typeData.color + '44' }}>
                        <div className={styles.filterCardTop}>
                            <span className={styles.filterCardLabel}>{filterData.label}</span>
                            <span className={styles.filterScore} style={{ color: typeData.color }}>
                                적합도 {filterScore}점
                            </span>
                        </div>
                        <div className={styles.filterGaugeTrack}>
                            <div className={styles.filterGaugeFill} style={{ width: `${filterScore}%`, background: typeData.color }} />
                        </div>
                        <p className={styles.filterDesc}>{filterData.desc}</p>

                        <div className={styles.proConRow}>
                            <div className={styles.proList}>
                                <p className={styles.proConTitle} style={{ color: '#1A7A45' }}>장점</p>
                                {filterData.pros.map((p) => (
                                    <div key={p} className={styles.proItem}>✓ {p}</div>
                                ))}
                            </div>
                            <div className={styles.conList}>
                                <p className={styles.proConTitle} style={{ color: '#C0392B' }}>유의사항</p>
                                {filterData.cons.map((c) => (
                                    <div key={c} className={styles.conItem}>✗ {c}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.allScoreRow}>
                        {['국내', '해외', 'ETF'].map((f) => (
                            <div key={f} className={styles.miniScore}>
                                <span className={styles.miniScoreLabel}>{f}</span>
                                <div className={styles.miniTrack}>
                                    <div className={styles.miniFill} style={{ width: `${productScores[f]}%`, background: typeData.color }} />
                                </div>
                                <span className={styles.miniScoreNum} style={{ color: typeData.color }}>{productScores[f]}점</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── 오른쪽: 포트폴리오 CTA ── */}
                <div className={styles.col3}>
                    <p className={styles.colLabel}>다음 단계</p>
                    <div className={styles.ctaCard} style={{ background: typeData.bg }}>
                        <div className={styles.ctaEmoji}>📊</div>
                        <h3 className={styles.ctaTitle} style={{ color: typeData.color }}>
                            맞춤 포트폴리오를<br />생성해드릴게요
                        </h3>
                        <p className={styles.ctaDesc}>
                            {typeName} 성향에 맞는 최적의 국내·해외 투자 포트폴리오를 AI가 자동으로 구성합니다.
                        </p>
                        <button
                            className={styles.ctaBtn}
                            style={{ background: typeData.color }}
                            onClick={() => navigate('/portfolio/auto', {
                                state: { typeName, totalScore, selectedThemes, productScores }
                            })}
                        >
                            포트폴리오 생성하러 가기 →
                        </button>
                    </div>

                    <div className={styles.retakeCard}>
                        <p className={styles.retakeText}>결과가 맞지 않나요?</p>
                        <button className={styles.retakeBtn} onClick={() => navigate('/investment/questions')}>
                            다시 진단하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestmentResult;