import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './InvestmentDiagnosis.module.css';

const questions = [
    {
        id: 1,
        question: '사용자의 연령대를 알고 싶어요!',
        sub: '연령대에 따라 투자 목표와 기간이 달라질 수 있어요.',
        icon: '👤',
        options: ['19세 미만', '19~29세', '30~39세', '40~49세', '50~59세', '60세 이상'],
        scores: [1, 2, 3, 4, 5, 5],
        multi: false
    },
    {
        id: 2,
        question: '연간 소득은 어느 정도인가요?',
        sub: '소득 수준에 따라 투자 가능 금액이 달라집니다.',
        icon: '💰',
        options: ['1천만원 미만', '1천~3천만원 미만', '3천~5천만원 미만', '5천~8천만원 미만', '8천만원 이상'],
        scores: [1, 2, 3, 4, 5],
        multi: false
    },
    {
        id: 3,
        question: '투자 목적은 무엇인가요?',
        sub: '목적에 따라 적합한 투자 전략이 달라집니다.',
        icon: '🎯',
        options: ['생활비나 비상금을 안전하게 보관하고 싶어요', '가까운 미래에 쓸 목돈을 마련하고 싶어요', '꾸준히 모아 중장기 목표자금을 만들고 싶어요', '자산을 천천히 늘리고 싶어요', '높은 수익을 기대하며 적극적으로 투자하고 싶어요'],
        scores: [1, 2, 3, 4, 5],
        multi: false
    },
    {
        id: 4,
        question: '이 자금을 언제 사용할 예정인가요?',
        sub: '투자 기간에 따라 적합한 상품이 달라집니다.',
        icon: '⏳',
        options: ['1년 이내', '1~3년 이내', '3~5년 이내', '5~10년 이내', '10년 이상'],
        scores: [1, 2, 3, 4, 5],
        multi: false
    },
    {
        id: 5,
        question: '과거에 투자해 본 경험이 있나요?',
        sub: '경험에 따라 추천하는 상품의 난이도가 달라집니다.',
        icon: '📈',
        options: ['예금/적금만 해봤어요', '국내 주식이나 펀드에 투자해 봤어요', '해외 주식, ETF 등 다양한 투자를 해봤어요', '파생상품, 코인 등 고위험 투자 경험이 있어요'],
        scores: [1, 3, 4, 5],
        multi: false
    },
    {
        id: 6,
        question: '투자로 인해 원금 손실이 발생한다면?',
        sub: '손실 감내 수준은 투자 성향의 핵심 지표입니다.',
        icon: '📉',
        options: ['절대 안 돼요. 원금은 무조건 보장되어야 해요', '-5% 정도는 감수할 수 있어요', '-10% 정도는 감수할 수 있어요', '-20% 정도는 감수할 수 있어요', '더 큰 수익을 위해서라면 그 이상도 감수할 수 있어요'],
        scores: [1, 2, 3, 4, 5],
        multi: false
    },
    {
        id: 7,
        question: '관심 있는 투자 테마를 모두 선택해주세요.',
        sub: '선택한 테마를 중심으로 포트폴리오가 구성됩니다.',
        icon: '🧩',
        options: ['우량주 (대형주/블루칩)', '성장주 (IT/테크/바이오)', '배당주 (고배당/안정형)', '테마주 (AI/친환경/전기차)', '해외주식 (미국주식 중심)', '안전자산 (금/달러/채권)'],
        scores: [1, 4, 2, 5, 4, 1],
        multi: true
    },
];

const InvestmentQuestions = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState(Array(questions.length).fill(null));

    const handleSelect = (idx) => {
        const q = questions[step];
        const newAns = [...answers];

        if (q.multi) {
            let cur = newAns[step] || [];
            if (cur.includes(idx)) cur = cur.filter((i) => i !== idx);
            else cur = [...cur, idx];
            newAns[step] = cur;
        } else {
            newAns[step] = idx;
        }
        setAnswers(newAns);
    };

    const handleNext = () => {
        if (step < questions.length - 1) {
            setStep((p) => p + 1);
        } else {
            const resultData = calculateResult();
            navigate('/investment/result', {state: resultData});
        }
    };

    const handlePrev = () => {
        if (step > 0) setStep((p) => p - 1);
    };

    const calculateResult = () => {
        let score = 0;
        let selectedThemes = [];

        answers.forEach((ans, i) => {
            const q = questions[i];
            if (q.multi && Array.isArray(ans)) {
                ans.forEach((idx) => {
                    score += q.scores[idx];
                    selectedThemes.push(q.options[idx]);
                });
            } else if (ans !== null) {
                score += q.scores[ans];
            }
        });

        // 60점 만점 기준 환산
        score = Math.min(60, Math.max(12, score + 5));

        let typeName = '위험중립형';
        if (score <= 21) typeName = '안정형';
        else if (score <= 31) typeName = '안정추구형';
        else if (score <= 41) typeName = '위험중립형';
        else if (score <= 51) typeName = '적극투자형';
        else typeName = '공격투자형';

        return {
            totalScore: score,
            typeName,
            selectedThemes,
            productScores: {
                국내주식: Math.min(100, score * 1.5 + 20),
                해외주식: Math.min(100, score * 1.8),
                펀드: Math.min(100, score * 1.2 + 30),
                ETF: Math.min(100, score * 1.4 + 10),
                채권: Math.max(0, 100 - score * 1.5),
            }
        };
    };

    const q = questions[step];
    const isAnswered = q.multi ? (answers[step]?.length > 0) : (answers[step] !== null);
    const progressPct = ((step) / questions.length) * 100;

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.questionContainer}>

                {/* 프로그레스 바 */}
                <div className={styles.progressBarWrap}>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{width: `${progressPct}%`}}/>
                    </div>
                </div>

                {/* 질문 패널 레이아웃 */}
                <div className={styles.questionLayout}>
                    <div className={styles.questionLeft}>
                        <span className={styles.stepBadge}>STEP 0{step + 1}</span>
                        <div className={styles.stepInfo}>
                            <span className={styles.stepCurrent}>{step + 1}</span>
                            <span className={styles.stepTotal}> / {questions.length}</span>
                        </div>
                        <p className={styles.stepHint}>정답은 없습니다.<br/>나의 상황에 가장 가까운 답변을 골라주세요.</p>
                    </div>

                    <div className={styles.questionRight}>
                        <div className={styles.qHeader}>
                            <span className={styles.qIcon}>{q.icon}</span>
                            <h2 className={styles.qTitle}>{q.question}</h2>
                            <p className={styles.qSub}>{q.sub}</p>
                        </div>

                        <div className={styles.optionList}>
                            {q.options.map((opt, idx) => {
                                const isSelected = q.multi ? answers[step]?.includes(idx) : answers[step] === idx;
                                return (
                                    <button
                                        key={idx}
                                        className={`${styles.optionBtn} ${isSelected ? styles.optionBtnOn : ''}`}
                                        onClick={() => handleSelect(idx)}
                                    >
                                        <div className={`${styles.radioCircle} ${isSelected ? styles.radioOn : ''}`}>
                                            {isSelected && <div className={styles.radioDot}/>}
                                        </div>
                                        <span
                                            className={`${styles.optionNum} ${isSelected ? styles.optionNumOn : ''}`}>{idx + 1}</span>
                                        <span className={styles.optionText}>{opt}</span>
                                        <span
                                            className={`${styles.optionArrow} ${isSelected ? styles.optionArrowOn : ''}`}>›</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className={styles.navRow}>
                            {step > 0 && (
                                <button className={styles.prevBtn} onClick={handlePrev}>← 이전 질문</button>
                            )}
                            <button
                                className={`${styles.nextBtn} ${!isAnswered ? styles.nextBtnDisabled : ''}`}
                                onClick={handleNext}
                                disabled={!isAnswered}
                            >
                                {step === questions.length - 1 ? '결과 보기 →' : '다음 질문 →'}
                            </button>
                        </div>

                        <div className={styles.securityNote}>
                            🔒 입력하신 정보는 안전하게 보호됩니다.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InvestmentQuestions;