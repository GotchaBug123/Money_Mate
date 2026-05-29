import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './FinancialDiagnosis.module.css';

const getLevelStyle = (label) => {
    switch (label) {
        case '매우 우수': return { color: '#1A7A45', bg: '#EDFAF4', barColor: '#1A7A45', badgeBg: '#EDFAF4' };
        case '우수':      return { color: '#1B5ED9', bg: '#E8F0FE', barColor: '#1B5ED9', badgeBg: '#E8F0FE' };
        case '양호':      return { color: '#2E7D9E', bg: '#E3F2F8', barColor: '#2E7D9E', badgeBg: '#E3F2F8' };
        case '보통':      return { color: '#B47D0C', bg: '#FAEEDA', barColor: '#E6A817', badgeBg: '#FAEEDA' };
        case '주의 필요': return { color: '#C0392B', bg: '#FFF0EE', barColor: '#E05555', badgeBg: '#FFF0EE' };
        default:          return { color: '#333',    bg: '#f4f4f4', barColor: '#ccc',    badgeBg: '#f4f4f4' };
    }
};

const summaryFields = [
    { key: 'income',          label: '월 수입',    icon: '💰', iconBg: '#EAF2FC' },
    { key: 'fixedExpense',    label: '월 고정지출', icon: '📋', iconBg: '#FFF0EE' },
    { key: 'variableExpense', label: '월 변동지출', icon: '🛒', iconBg: '#FAEEDA' },
    { key: 'debt',            label: '부채',       icon: '📊', iconBg: '#FCEBEB' },
    { key: 'cash',            label: '보유 현금',   icon: '💳', iconBg: '#EDFAF4' },
];

// ✅ 백엔드 연결 시 삭제
// API: POST /api/financial/diagnose
// Request: { income, fixedExpense, variableExpense, debt, cash }
// Response: { score, level, investableAmount, comment, tip, form }
const DUMMY_RESULT = {
    score: 75,
    level: '우수',
    investableAmount: 115,
    comment: '전반적으로 재무 상태가 건전합니다. 적극적인 투자를 고려해보세요.',
    tip: '비상금 확보 및 장기 투자 전략을 유지하면 더 안정적인 성장이 가능합니다.',
    form: { income: '350', fixedExpense: '120', variableExpense: '80', debt: '0', cash: '600' },
};

// 원형 게이지 SVG
const CircleGauge = ({ score, color }) => {
    const r = 42;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - score / 100);
    return (
        <div className={styles.circleWrap}>
            <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r={r} fill="none" stroke="#eef0f5" strokeWidth="10" />
                <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="10"
                        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
            </svg>
            <div className={styles.circleCenterContent}>
                <span className={styles.circleScore} style={{ color }}>{score}</span>
                <span className={styles.circleMax}>/ 100점</span>
            </div>
        </div>
    );
};

const FinancialResult = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ 백엔드 연결 시: location.state.result 로 받아옴
    const resultData = location.state?.result ?? DUMMY_RESULT;
    const { score, level, investableAmount, comment, tip, form } = resultData;
    const { color, barColor, badgeBg } = getLevelStyle(level);

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
                            <CircleGauge score={score} color={color} />
                            <div className={styles.scoreRight}>
                                <span className={styles.levelBadge} style={{ background: badgeBg, color }}>
                                    {level}
                                </span>
                                <p className={styles.scoreTitle} style={{ color }}>
                                    {level} 재무 상태입니다!
                                </p>
                                <p className={styles.scoreComment}>{comment}</p>
                            </div>
                        </div>
                        <div className={styles.gaugeWrap}>
                            <div className={styles.gaugeTrack}>
                                <div className={styles.gaugeFill} style={{ width: `${score}%`, background: barColor }} />
                            </div>
                            <span className={styles.gaugePct} style={{ color }}>{score}%</span>
                        </div>
                        <div className={styles.tipRow}>
                            <span className={styles.tipIcon}>💡</span>
                            <span className={styles.tipText}>Tip: {tip}</span>
                        </div>
                    </div>

                    {/* 투자 가능 금액 */}
                    <div className={styles.investCard}>
                        <p className={styles.investLabel}>월 투자 가능 금액</p>
                        <p className={styles.investVal} style={{ color }}>
                            월 {investableAmount.toLocaleString()}만원 내외
                        </p>
                        <p className={styles.investDesc}>월 잉여금의 50% 기준 권장 투자 한도입니다.</p>
                        <div className={styles.investTips}>
                            {[
                                { icon: '📈', text: '꾸준한 투자 습관이\n자산 성장의 핵심입니다.' },
                                { icon: '🛡️', text: '분산 투자를 통해\n리스크를 관리하세요.' },
                                { icon: '🔄', text: '정기적인 리밸런싱으로\n성과를 최적화하세요.' },
                            ].map((t, i) => (
                                <div key={i} className={styles.investTipItem}>
                                    <span className={styles.investTipIcon}>{t.icon}</span>
                                    <span className={styles.investTipText}>{t.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

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
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryHeader}>
                            <span>📄</span> 입력 정보 요약
                        </div>
                        {summaryFields.map((f) => (
                            <div key={f.key} className={styles.summaryRow}>
                                <div className={styles.summaryLeft}>
                                    <div className={styles.summaryIcon} style={{ background: f.iconBg }}>
                                        {f.icon}
                                    </div>
                                    <span className={styles.summaryKey}>{f.label}</span>
                                </div>
                                <span className={styles.summaryVal}>
                                    {Number(form[f.key]).toLocaleString()}만원
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* 안내 배너 */}
                    <div className={styles.infoBanner}>
                        <span className={styles.infoIcon}>ℹ️</span>
                        <p className={styles.infoText}>
                            입력하신 정보를 바탕으로 분석한 결과입니다.<br />
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