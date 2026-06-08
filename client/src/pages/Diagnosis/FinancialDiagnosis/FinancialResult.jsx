import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import styles from './FinancialDiagnosis.module.css';

const getLevelStyle = (grade) => {
    switch (grade) {
        case '매우 우수':
            return {color: 'var(--color-success)', bg: 'var(--color-success-bg)', barColor: 'var(--color-success)', badgeBg: 'var(--color-success-bg)'};
        case '우수':
            return {color: 'var(--color-primary)', bg: 'var(--color-primary-light)', barColor: 'var(--color-primary)', badgeBg: 'var(--color-primary-light)'};
        case '양호':
            return {color: '#2E7D9E', bg: '#E3F2F8', barColor: '#2E7D9E', badgeBg: '#E3F2F8'};
        case '보통':
            return {color: 'var(--color-warning)', bg: 'var(--color-warning-bg)', barColor: 'var(--color-warning)', badgeBg: 'var(--color-warning-bg)'};
        case '주의 필요':
            return {color: 'var(--color-error)', bg: 'var(--color-error-bg)', barColor: 'var(--color-error)', badgeBg: 'var(--color-error-bg)'};
        default:
            return {color: 'var(--color-text-main)', bg: 'var(--color-bg-input)', barColor: 'var(--color-text-muted)', badgeBg: 'var(--color-bg-input)'};
    }
};

const summaryFields = [
    {key: 'income', label: '월 수입', icon: '💰', iconBg: 'var(--color-primary-light)'},
    {key: 'fixedExpense', label: '월 고정지출', icon: '📋', iconBg: 'var(--color-error-bg)'},
    {key: 'variableExpense', label: '월 변동지출', icon: '🛒', iconBg: 'var(--color-warning-bg)'},
    {key: 'totalAsset', label: '총 자산', icon: '🏦', iconBg: 'var(--color-primary-light)'},
    {key: 'debt', label: '총 부채', icon: '📊', iconBg: 'var(--color-error-bg)'},
    {key: 'cash', label: '보유 현금', icon: '💳', iconBg: 'var(--color-success-bg)'},
];

const CircleGauge = ({score, color}) => {
    const r = 42;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - score / 100);
    return (
        <div className={styles.circleWrap}>
            <svg width="100" height="100" viewBox="0 0 100 100" style={{transform: 'rotate(-90deg)'}}>
                <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-bg-input)" strokeWidth="10"/>
                <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="10"
                        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"/>
            </svg>
            <div className={styles.circleCenterContent}>
                <span className={styles.circleScore} style={{color}}>{score}</span>
                <span className={styles.circleMax}>/ 100점</span>
            </div>
        </div>
    );
};

const toManwon = (won) => Math.round(won / 10000);

const FinancialResult = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {diagnosisData, form} = location.state ?? {};

    if (!diagnosisData) {
        return (
            <div className={styles.resultPage} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh'}}>
                <div style={{textAlign: 'center'}}>
                    <p style={{marginBottom: '16px', color: 'var(--color-text-muted)'}}>진단 결과를 불러올 수 없습니다.</p>
                    <button className={styles.priBtn} onClick={() => navigate('/financial/input')}>
                        재무진단 입력으로 이동
                    </button>
                </div>
            </div>
        );
    }

    const {totalScore, grade, riskLevel, expenseRate, debtRate, liquidityMonths, investableAmount, feedbacks = []} = diagnosisData;
    const {color, barColor, badgeBg} = getLevelStyle(grade);

    const comment = feedbacks[0] ?? '재무 상태를 분석했습니다.';
    const tip = feedbacks[1] ?? '정기적인 재무 점검을 통해 건전한 재무 상태를 유지하세요.';
    const extraFeedbacks = feedbacks.slice(2);

    const investableManwon = toManwon(investableAmount ?? 0);

    return (
        <div className={styles.resultPage}>
            <div className={styles.resultGrid}>

                {/* ── 왼쪽 ── */}
                <div className={styles.resultLeft}>
                    <p className={styles.eyebrow}>재무진단 결과</p>
                    <h1 className={styles.resultTitle}>재무 평가 점수</h1>
                    <p className={styles.resultSubtitle}>나의 재무 상태를 한눈에 확인해보세요.</p>

                    {/* 점수 카드 */}
                    <div className={styles.scoreCard}>
                        <div className={styles.scoreTop}>
                            <CircleGauge score={totalScore} color={color}/>
                            <div className={styles.scoreRight}>
                                <span className={styles.levelBadge} style={{background: badgeBg, color}}>
                                    {grade}
                                </span>
                                <p className={styles.scoreTitle} style={{color}}>
                                    {grade} 재무 상태입니다!
                                </p>
                                <p className={styles.scoreComment}>{comment}</p>
                            </div>
                        </div>
                        <div className={styles.gaugeWrap}>
                            <div className={styles.gaugeTrack}>
                                <div className={styles.gaugeFill} style={{width: `${totalScore}%`, background: barColor}}/>
                            </div>
                            <span className={styles.gaugePct} style={{color}}>{totalScore}%</span>
                        </div>
                        <div className={styles.tipRow}>
                            <span className={styles.tipIcon}>💡</span>
                            <span className={styles.tipText}>Tip: {tip}</span>
                        </div>
                    </div>

                    {/* 재무 지표 */}
                    <div className={styles.investCard}>
                        <p className={styles.investLabel}>월 투자 가능 금액</p>
                        <p className={styles.investVal} style={{color}}>
                            월 {investableManwon.toLocaleString()}만원 내외
                        </p>
                        <p className={styles.investDesc}>월 잉여금의 50% 기준 권장 투자 한도입니다.</p>

                        {/* 추가 재무 지표 */}
                        <div style={{marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px'}}>
                            {riskLevel && (
                                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}>
                                    <span style={{color: 'var(--color-text-muted)'}}>위험 수준</span>
                                    <span style={{fontWeight: 600, color}}>{riskLevel}</span>
                                </div>
                            )}
                            {expenseRate != null && (
                                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}>
                                    <span style={{color: 'var(--color-text-muted)'}}>소비율</span>
                                    <span style={{fontWeight: 600}}>{(expenseRate * 100).toFixed(1)}%</span>
                                </div>
                            )}
                            {debtRate != null && (
                                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}>
                                    <span style={{color: 'var(--color-text-muted)'}}>부채 비율</span>
                                    <span style={{fontWeight: 600}}>{(debtRate * 100).toFixed(1)}%</span>
                                </div>
                            )}
                            {liquidityMonths != null && (
                                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}>
                                    <span style={{color: 'var(--color-text-muted)'}}>유동성 (비상금)</span>
                                    <span style={{fontWeight: 600}}>{liquidityMonths.toFixed(1)}개월치</span>
                                </div>
                            )}
                        </div>

                        <div className={styles.investTips}>
                            {[
                                {icon: '📈', text: '꾸준한 투자 습관이\n자산 성장의 핵심입니다.'},
                                {icon: '🛡️', text: '분산 투자를 통해\n리스크를 관리하세요.'},
                                {icon: '🔄', text: '정기적인 리밸런싱으로\n성과를 최적화하세요.'},
                            ].map((t, i) => (
                                <div key={i} className={styles.investTipItem}>
                                    <span className={styles.investTipIcon}>{t.icon}</span>
                                    <span className={styles.investTipText}>{t.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 추가 피드백 */}
                    {extraFeedbacks.length > 0 && (
                        <div className={styles.motiveCard}>
                            <span className={styles.motiveEmoji}>📝</span>
                            <div>
                                {extraFeedbacks.map((fb, i) => (
                                    <p key={i} className={styles.motiveDesc}>{fb}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 동기부여 배너 */}
                    <div className={styles.motiveCard}>
                        <span className={styles.motiveEmoji}>🌱</span>
                        <div>
                            <p className={styles.motiveTitle}>지금 시작하는 투자가 미래의 나를 만듭니다.</p>
                            <p className={styles.motiveDesc}>꾸준한 관리와 현명한 선택으로 재무적 자유를 이루세요!</p>
                        </div>
                    </div>
                </div>

                {/* ── 오른쪽 ── */}
                <div className={styles.resultRight}>
                    {/* 입력 정보 요약 */}
                    {form && (
                        <div className={styles.summaryCard}>
                            <div className={styles.summaryHeader}>
                                <span>📄</span> 입력 정보 요약
                            </div>
                            {summaryFields.map((f) => (
                                <div key={f.key} className={styles.summaryRow}>
                                    <div className={styles.summaryLeft}>
                                        <div className={styles.summaryIcon} style={{background: f.iconBg}}>
                                            {f.icon}
                                        </div>
                                        <span className={styles.summaryKey}>{f.label}</span>
                                    </div>
                                    <span className={styles.summaryVal}>
                                        {Number(form[f.key] || 0).toLocaleString()}만원
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 안내 배너 */}
                    <div className={styles.infoBanner}>
                        <span className={styles.infoIcon}>ℹ️</span>
                        <p className={styles.infoText}>
                            입력하신 정보를 바탕으로 분석한 결과입니다.<br/>
                            더 정확한 진단을 위해 정기적으로 정보를 업데이트해주세요.
                        </p>
                    </div>

                    {/* 버튼 */}
                    <div className={styles.resultBtnRow}>
                        <button className={styles.secBtn} onClick={() => navigate('/financial/input')}>
                            🔄 다시 입력하기
                        </button>
                        <button className={styles.priBtn} onClick={() => navigate('/investment/questions')}>
                            투자성향진단 →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialResult;
