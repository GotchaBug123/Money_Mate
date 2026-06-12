import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import styles from './InvestmentDiagnosis.module.css';
import {useAuthStore} from '../../../store/useAuthStore.js';
import {submitPendingSurvey} from '../../../utils/pendingInvestmentSurvey.js';
import {getLatestRiskSurveyApi} from '../../../api/riskSurveyApi.js';

const typeInfo = {
    '안정형': {
        emoji: '🛡️', range: '12~21점', color: 'var(--color-success)', bg: 'var(--color-success-bg)',
        volatility: '낮음', period: '1년 미만', risk: '낮음'
    },
    '안정추구형': {
        emoji: '⚖️', range: '22~31점', color: 'var(--color-primary-hover)', bg: 'var(--color-bg-input)',
        volatility: '낮음', period: '1~3년', risk: '낮음'
    },
    '위험중립형': {
        emoji: '🎯', range: '32~41점', color: 'var(--color-primary)', bg: 'var(--color-primary-light)',
        volatility: '보통', period: '1~3년', risk: '보통'
    },
    '적극투자형': {
        emoji: '🚀', range: '42~51점', color: 'var(--color-warning)', bg: 'var(--color-warning-bg)',
        volatility: '높음', period: '3년 이상', risk: '높음'
    },
    '공격투자형': {
        emoji: '🔥', range: '52~60점', color: 'var(--color-error)', bg: 'var(--color-error-bg)',
        volatility: '매우 높음', period: '3년 이상', risk: '매우 높음'
    },
};

const InvestmentResult = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {user, openLoginModal} = useAuthStore();

    const {surveyData: initialSurveyData, selectedThemes, isGuest} = location.state ?? {};
    const [surveyData, setSurveyData] = useState(initialSurveyData);
    const [guestMode, setGuestMode] = useState(isGuest || !user);
    const [saving, setSaving] = useState(false);

    // 결과 페이지에 있는 동안 로그인하면 백엔드에 제출하고 UI를 풀버전으로 전환.
    // LoginModal이 먼저 submitPendingSurvey를 가져간 경우(null 반환) 최신 결과를 백엔드에서 조회한다.
    useEffect(() => {
        if (!user || !guestMode) return;
        setSaving(true);
        submitPendingSurvey()
            .then(async (result) => {
                if (result) {
                    setSurveyData(result);
                    setGuestMode(false);
                } else {
                    // LoginModal이 이미 제출함 → 백엔드에서 최신 결과 가져오기
                    const latest = await getLatestRiskSurveyApi().catch(() => null);
                    if (latest) {
                        setSurveyData(latest);
                        setGuestMode(false);
                    }
                }
            })
            .catch(console.error)
            .finally(() => setSaving(false));
    }, [user]);

    if (!surveyData) {
        return (
            <div className={styles.pageWrapper} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh'}}>
                <div style={{textAlign: 'center'}}>
                    <p style={{marginBottom: '16px', color: 'var(--color-text-muted)'}}>진단 결과를 불러올 수 없습니다.</p>
                    <button className={styles.retakeBtn} onClick={() => navigate('/investment/questions')}>
                        진단 다시 시작하기
                    </button>
                </div>
            </div>
        );
    }

    const {totalScore, resultType, description, riskAvoidancePercent, financialInterestPercent, riskAvoidanceLabel, financialInterestLabel, recommendations = []} = surveyData;

    const typeData = typeInfo[resultType] ?? typeInfo['위험중립형'];
    const {color, bg} = typeData;

    const topRecommendations = [...recommendations].sort((a, b) => a.rankNo - b.rankNo).slice(0, 3);

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.resultContainer}>
                <div className={styles.resultLayout}>

                    {/* ── 왼쪽: 결과 요약 ── */}
                    <div className={styles.resultLeft}>
                        <div>
                            <p className={styles.eyebrow}>투자 성향 진단 결과</p>
                            <h1 className={styles.resultTitle}>당신의 투자 성향은?</h1>
                        </div>

                        <div className={styles.typeCard} style={{borderColor: color}}>
                            <div className={styles.typeEmoji}>{typeData.emoji}</div>
                            <h2 className={styles.typeName} style={{color}}>{resultType}</h2>
                            <p className={styles.typeDesc}>{description}</p>
                        </div>

                        <div className={styles.infoGrid}>
                            <div className={styles.infoBox}>
                                <span className={styles.infoLabel}>진단 점수</span>
                                <span className={styles.infoVal} style={{color}}>
                                    {totalScore}점 <small style={{fontSize: '12px', color: 'var(--color-text-muted)'}}>({typeData.range})</small>
                                </span>
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

                        {/* 위험 회피도 / 금융 관심도 */}
                        {(riskAvoidancePercent != null || financialInterestPercent != null) && (
                            <div className={styles.proConBox}>
                                <div className={styles.proConCol}>
                                    <p className={styles.proConTitle} style={{color}}>위험 회피도</p>
                                    <div className={styles.proItem}>{riskAvoidanceLabel ?? `${riskAvoidancePercent}%`}</div>
                                    <div style={{marginTop: '8px', height: '6px', borderRadius: '3px', background: 'var(--color-bg-input)', overflow: 'hidden'}}>
                                        <div style={{height: '100%', width: `${riskAvoidancePercent}%`, background: color, borderRadius: '3px'}}/>
                                    </div>
                                </div>
                                <div className={styles.proConCol}>
                                    <p className={styles.proConTitle} style={{color: 'var(--color-text-main)'}}>금융 관심도</p>
                                    <div className={styles.conItem}>{financialInterestLabel ?? `${financialInterestPercent}%`}</div>
                                    <div style={{marginTop: '8px', height: '6px', borderRadius: '3px', background: 'var(--color-bg-input)', overflow: 'hidden'}}>
                                        <div style={{height: '100%', width: `${financialInterestPercent}%`, background: 'var(--color-text-muted)', borderRadius: '3px'}}/>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 관심 테마 */}
                        {selectedThemes?.length > 0 && (
                            <div style={{marginTop: '16px'}}>
                                <p style={{fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px'}}>선택한 관심 테마</p>
                                <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
                                    {selectedThemes.map((t) => (
                                        <span key={t} style={{fontSize: '12px', padding: '4px 10px', borderRadius: '20px', background: bg, color, fontWeight: 600}}>{t}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── 오른쪽: 추천 전략 및 CTA ── */}
                    <div className={styles.resultRight}>

                        {/* 추천 투자 전략 카드 */}
                        {topRecommendations.length > 0 && (
                            <div className={styles.chartBox}>
                                <h3 className={styles.chartTitle}>맞춤 투자 전략 추천</h3>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px'}}>
                                    {topRecommendations.map((rec) => (
                                        <div key={rec.rankNo} style={{padding: '14px', borderRadius: '10px', border: `1px solid ${color}22`, background: bg}}>
                                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px'}}>
                                                <span style={{fontWeight: 700, fontSize: '14px', color}}>{rec.categoryName}</span>
                                                <span style={{fontSize: '12px', fontWeight: 600, color, background: `${color}18`, padding: '2px 8px', borderRadius: '20px'}}>
                                                    매칭 {rec.matchingScore}%
                                                </span>
                                            </div>
                                            <p style={{fontSize: '13px', color: 'var(--color-text-muted)', margin: '0 0 8px 0'}}>{rec.reason}</p>
                                            {rec.tags?.length > 0 && (
                                                <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px'}}>
                                                    {rec.tags.map((tag) => (
                                                        <span key={tag} style={{fontSize: '11px', padding: '2px 7px', borderRadius: '20px', background: 'var(--color-bg-input)', color: 'var(--color-text-muted)'}}>{tag}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {saving ? (
                            <div className={styles.ctaCard} style={{textAlign: 'center', padding: '40px 24px'}}>
                                <p style={{color: 'var(--color-text-muted)', fontSize: '14px'}}>
                                    진단 결과를 저장하는 중입니다...
                                </p>
                            </div>
                        ) : guestMode ? (
                            <div className={styles.ctaCard}>
                                <h3 className={styles.ctaTitle}>결과를 저장하고 싶으신가요?</h3>
                                <p style={{fontSize: '14px', color: 'var(--color-text-muted)', margin: '0 0 16px'}}>
                                    회원가입하면 진단 결과가 저장되고 맞춤 포트폴리오를 생성할 수 있어요.
                                </p>
                                <div className={styles.featureList}>
                                    {[
                                        {icon: '💾', title: '결과 저장', desc: '진단 결과를 언제든 다시 확인'},
                                        {icon: '🤖', title: 'AI 맞춤 추천', desc: '성향에 딱 맞는 종목 조합'},
                                        {icon: '🔄', title: '정기 리밸런싱', desc: '시장 변화에 따라 자동 조정'},
                                    ].map(f => (
                                        <div key={f.title} className={styles.featureItem}>
                                            <span className={styles.featureIcon}>{f.icon}</span>
                                            <div>
                                                <p className={styles.featureTitle} style={{color}}>{f.title}</p>
                                                <p className={styles.featureDesc}>{f.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className={styles.ctaBtn} style={{background: color}}
                                        onClick={() => navigate('/signup')}>
                                    회원가입하고 포트폴리오 만들기 →
                                </button>
                                <button
                                    onClick={() => openLoginModal()}
                                    style={{marginTop: '10px', width: '100%', padding: '10px', background: 'none', border: `1px solid ${color}`, borderRadius: '8px', color, fontSize: '14px', fontWeight: 600, cursor: 'pointer'}}
                                >
                                    이미 회원이신가요? 로그인
                                </button>
                            </div>
                        ) : (
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
                                                <p className={styles.featureTitle} style={{color}}>{f.title}</p>
                                                <p className={styles.featureDesc}>{f.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className={styles.ctaBtn} style={{background: color}}
                                        onClick={() => navigate('/portfolio/auto', {state: {resultType, totalScore, selectedThemes, recommendations}})}>
                                    ✦ 포트폴리오 생성하러 가기 →
                                </button>
                            </div>
                        )}

                        <div className={styles.retakeCard}>
                            <p className={styles.retakeText}>결과가 만족스럽지 않으신가요?</p>
                            <button className={styles.retakeBtn} onClick={() => navigate('/investment/questions')}>다시 진단하기</button>
                        </div>

                        <p className={styles.securityNote}>🔒 모든 정보는 안전하게 보호됩니다.</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default InvestmentResult;
