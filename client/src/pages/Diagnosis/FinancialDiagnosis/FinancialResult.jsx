import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './FinancialDiagnosis.module.css';

const getLevelStyle = (label) => {
    switch (label) {
        case '매우 우수': return { color: '#1A7A45', bg: '#EDFAF4', barColor: '#1A7A45' };
        case '우수':      return { color: '#1B5ED9', bg: '#E8F0FE', barColor: '#1B5ED9' };
        case '양호':      return { color: '#2E7D9E', bg: '#E3F2F8', barColor: '#2E7D9E' };
        case '보통':      return { color: '#B47D0C', bg: '#FAEEDA', barColor: '#E6A817' };
        case '주의 필요': return { color: '#C0392B', bg: '#FFF0EE', barColor: '#E05555' };
        default:          return { color: '#333',    bg: '#f4f4f4', barColor: '#ccc' };
    }
};

const summaryFields = [
    { key: 'income',          label: '월 수입' },
    { key: 'fixedExpense',    label: '월 고정지출' },
    { key: 'variableExpense', label: '월 변동지출' },
    { key: 'debt',            label: '부채' },
    { key: 'cash',            label: '보유 현금' },
];

// 테스트용 더미 데이터 (백엔드 연결 시 삭제)
const DUMMY_RESULT = {
    score: 75,
    level: '우수',
    investableAmount: 115,
    comment: '전반적으로 재무 상태가 건전합니다. 적극적인 투자를 고려해보세요.',
    form: { income: '350', fixedExpense: '120', variableExpense: '80', debt: '0', cash: '600' }
};

const FinancialResult = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ 백엔드 연결 시: location.state.result 에서 받아옴, 없으면 더미 사용
    const resultData = (location.state && location.state.result)
        ? location.state.result
        : DUMMY_RESULT;

    const { score, level, investableAmount, comment, form } = resultData;
    const { color, bg, barColor } = getLevelStyle(level);

    return (
        <div className={styles.pageWrapper} style={{ padding: 0 }}>
            <div className={styles.resultLayout}>
                <div className={styles.resultLeft}>
                    <p className={styles.eyebrow}>재무진단 결과</p>
                    <h1 className={styles.resultTitle}>재무 평가 점수</h1>

                    <div className={styles.scoreCard} style={{ background: bg }}>
                        <div className={styles.scoreNumRow}>
                            <span className={styles.scoreNum} style={{ color }}>{score}</span>
                            <span className={styles.scoreMax} style={{ color }}> / 100점</span>
                        </div>
                        <div className={styles.scoreLabelBadge} style={{ background: color, color: '#fff' }}>
                            {level}
                        </div>
                        <div className={styles.gaugeTrack}>
                            <div className={styles.gaugeFill} style={{ width: `${score}%`, background: barColor }} />
                        </div>
                        <p className={styles.scoreComment}>{comment}</p>
                    </div>

                    <div className={styles.investCard}>
                        <div className={styles.investCardLabel}>월 투자 가능 금액</div>
                        <div className={styles.investCardValue} style={{ color }}>
                            월 {investableAmount.toLocaleString()}만원 내외
                        </div>
                        <p className={styles.investCardDesc}>
                            월 잉여금의 50% 기준 권장 투자 한도입니다.
                        </p>
                    </div>
                </div>

                <div className={styles.resultRight}>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryHeader}>입력 정보 요약</div>
                        <div className={styles.summaryList}>
                            {summaryFields.map((f) => (
                                <div key={f.key} className={styles.summaryRow}
                                     style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #eee' }}>
                                    <span className={styles.summaryKey}>{f.label}</span>
                                    <span className={styles.summaryVal} style={{ fontWeight:'bold' }}>
                                        {Number(form[f.key]).toLocaleString()}만원
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.resultActions} style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
                        <button className={styles.secondaryBtn}
                                onClick={() => navigate('/financial/input')}
                                style={{ flex:1, padding:'15px' }}>
                            다시 입력하기
                        </button>
                        <button className={styles.submitBtn}
                                onClick={() => navigate('/investment/questions')}
                                style={{ flex:1, padding:'15px', backgroundColor:'#3b9cff', color:'#fff', border:'none', cursor:'pointer' }}>
                            투자성향진단 →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialResult;