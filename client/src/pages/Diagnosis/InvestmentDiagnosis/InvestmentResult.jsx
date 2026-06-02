import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import styles from './InvestmentDiagnosis.module.css';

// 💡 하드코딩 색상 대신 글로벌 CSS 변수 적극 활용
const typeInfo = {
    '안정형': {
        emoji: '🛡️',
        range: '12~21점',
        color: 'var(--color-success)',
        bg: 'var(--color-success-bg)',
        rankPct: '상위 82%',
        volatility: '낮음',
        period: '1년 미만',
        risk: '낮음'
    },
    '안정추구형': {
        emoji: '⚖️',
        range: '22~31점',
        color: 'var(--color-primary-hover)',
        bg: 'var(--color-bg-input)',
        rankPct: '상위 65%',
        volatility: '낮음',
        period: '1~3년',
        risk: '낮음'
    },
    '위험중립형': {
        emoji: '🎯',
        range: '32~41점',
        color: 'var(--color-primary)',
        bg: 'var(--color-primary-light)',
        rankPct: '상위 45%',
        volatility: '보통',
        period: '1~3년',
        risk: '보통'
    },
    '적극투자형': {
        emoji: '🚀',
        range: '42~51점',
        color: 'var(--color-warning)',
        bg: 'var(--color-warning-bg)',
        rankPct: '상위 18%',
        volatility: '높음',
        period: '3년 이상',
        risk: '높음'
    },
    '공격투자형': {
        emoji: '🔥',
        range: '52~60점',
        color: 'var(--color-error)',
        bg: 'var(--color-error-bg)',
        rankPct: '상위 5%',
        volatility: '매우 높음',
        period: '3년 이상',
        risk: '매우 높음'
    },
};

const dummyResult = {
    totalScore: 35,
    typeName: '위험중립형',
    selectedThemes: ['우량주 (대형주/블루칩)', '성장주 (IT/테크/바이오)'],
    productScores: {국내주식: 72, 해외주식: 63, 펀드: 72, ETF: 59, 채권: 47}
};

const InvestmentResult = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {totalScore, typeName, selectedThemes, productScores} = location.state || dummyResult;
    const typeData = typeInfo[typeName];

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.resultContainer}>

                {/* 2단 결과 레이아웃 */}
                <div className={styles.resultLayout}>

                    {/* ── 왼쪽: 결과 요약 ── */}
                    <div className={styles.resultLeft}>
                        <div>
                            <p className={styles.eyebrow}>투자 성향 진단 결과</p>
                            <h1 className={styles.resultTitle}>당신의 투자 성향은?</h1>
                        </div>

                        <div className={styles.typeCard} style={{borderColor: typeData.color}}>
                            <div className={styles.typeEmoji}>{typeData.emoji}</div>
                            <h2 className={styles.typeName} style={{color: typeData.color}}>{typeName}</h2>
                            <p className={styles.typeDesc}>
                                안정성과 수익성의 균형을 중요하게 생각하는 유형입니다.<br/>
                                감내할 수 있는 리스크 내에서 꾸준한 성장을 목표로 합니다.
                            </p>
                        </div>

                        <div className={styles.infoGrid}>
                            <div className={styles.infoBox}>
                                <span className={styles.infoLabel}>진단 점수</span>
                                <span className={styles.infoVal} style={{color: typeData.color}}>{totalScore}점 <small
                                    style={{
                                        fontSize: '12px',
                                        color: 'var(--color-text-muted)'
                                    }}>({typeData.range})</small></span>
                            </div>
                            <div className={styles.infoBox}>
                                <span className={styles.infoLabel}>예상 변동성</span>
                                <span className={styles.infoVal}>{typeData.volatility}</span>
                            </div>
                            <div className={styles.infoBox}>
                                <span className={styles.infoLabel}>권장 투자 기간</span>
                                <span className={styles.infoVal}>{typeData.period}</span>
                            </div>
                            <div className={styles.infoBox}>
                                <span className={styles.infoLabel}>리스크 수용도</span>
                                <span className={styles.infoVal}>{typeData.risk}</span>
                            </div>
                        </div>

                        <div className={styles.proConBox}>
                            <div className={styles.proConCol}>
                                <p className={styles.proConTitle} style={{color: typeData.color}}>투자의 장점</p>
                                <div className={styles.proItem}>안정적인 자산 방어</div>
                                <div className={styles.proItem}>예적금보다 높은 수익 기대</div>
                            </div>
                            <div className={styles.proConCol}>
                                <p className={styles.proConTitle} style={{color: 'var(--color-text-main)'}}>주의할 점</p>
                                <div className={styles.conItem}>단기 고수익 창출 어려움</div>
                                <div className={styles.conItem}>인플레이션 헤지 한계</div>
                            </div>
                        </div>
                    </div>

                    {/* ── 오른쪽: 추천 및 CTA ── */}
                    <div className={styles.resultRight}>

                        <div className={styles.chartBox}>
                            <h3 className={styles.chartTitle}>추천 포트폴리오 비중</h3>
                            <div className={styles.chartBarWrap}>
                                {Object.entries(productScores).sort((a, b) => b[1] - a[1]).map(([key, val]) => (
                                    <div key={key} className={styles.chartRow}>
                                        <span className={styles.chartLabel}>{key}</span>
                                        <div className={styles.chartTrack}>
                                            <div className={styles.chartFill}
                                                 style={{width: `${val}%`, background: typeData.color}}/>
                                        </div>
                                        <span className={styles.chartLabel} style={{
                                            textAlign: 'right',
                                            color: typeData.color
                                        }}>{Math.round(val)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.ctaCard}>
                            <h3 className={styles.ctaTitle}>자동 포트폴리오 구성</h3>
                            <div className={styles.featureList}>
                                {[
                                    {icon: '🤖', title: 'AI 맞춤 추천', desc: '성향에 딱 맞는 종목 조합'},
                                    {icon: '🔄', title: '정기 리밸런싱', desc: '시장 변화에 따라 자동 조정'},
                                ].map(f => (
                                    <div key={f.title} className={styles.featureItem}>
                                        <span className={styles.featureIcon}>{f.icon}</span>
                                        <div>
                                            <p className={styles.featureTitle}
                                               style={{color: typeData.color}}>{f.title}</p>
                                            <p className={styles.featureDesc}>{f.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className={styles.ctaBtn} style={{background: typeData.color}}
                                    onClick={() => navigate('/portfolio/auto', {
                                        state: {
                                            typeName,
                                            totalScore,
                                            selectedThemes,
                                            productScores
                                        }
                                    })}>
                                ✦ 포트폴리오 생성하러 가기 →
                            </button>
                        </div>

                        <div className={styles.retakeCard}>
                            <p className={styles.retakeText}>결과가 만족스럽지 않으신가요?</p>
                            <button className={styles.retakeBtn} onClick={() => navigate('/investment/questions')}>다시
                                진단하기
                            </button>
                        </div>

                        <p className={styles.securityNote}>🔒 모든 정보는 안전하게 보호됩니다.</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default InvestmentResult;