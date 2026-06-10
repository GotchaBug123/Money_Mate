import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './InvestmentDiagnosis.module.css';
import {submitRiskSurveyApi, saveRiskProfileApi} from '../../../api/riskSurveyApi.js';
import {useAuthStore} from '../../../store/useAuthStore.js';
import {savePendingSurvey} from '../../../utils/pendingInvestmentSurvey.js';

const typeDescriptions = {
    '안정형': '원금 보전을 최우선으로 생각하며, 낮은 위험의 안정적인 상품을 선호합니다.',
    '안정추구형': '예금보다 높은 수익을 원하지만, 위험은 최소화하려는 소극적 투자자입니다.',
    '위험중립형': '수익과 위험의 균형을 추구하며, 중간 수준의 변동성을 수용합니다.',
    '적극투자형': '높은 수익을 위해 일정 수준의 위험을 감수할 의향이 있습니다.',
    '공격투자형': '최대 수익을 위해 높은 위험도 기꺼이 감수하는 공격적 투자자입니다.',
};

const questions = [
    {
        id: 1,
        question: '연령대는 어떻게 되시나요?',
        sub: '연령대에 따라 투자 목표와 기간이 달라질 수 있어요.',
        icon: '👤',
        options: ['19세 미만', '19~29세', '30~39세', '40~49세', '50~59세', '60세 이상'],
        scores: [0, 0, 0, 0, 0, 0], // 통계용 (점수 미반영)
        statsOnly: true,
        multi: false,
    },
    {
        id: 2,
        question: '연간 소득은 어느 정도인가요?',
        sub: '소득 수준에 따라 투자 가능 금액이 달라집니다.',
        icon: '💰',
        options: ['1천만원 미만', '1천~3천만원 미만', '3천~5천만원 미만', '5천~8천만원 미만', '8천만원 이상'],
        scores: [1, 2, 3, 4, 5],
        multi: false,
    },
    {
        id: 3,
        question: '투자 목적은 무엇인가요?',
        sub: '목적에 따라 적합한 투자 전략이 달라집니다.',
        icon: '🎯',
        options: [
            '생활비나 비상금을 안전하게 보관하고 싶어요',
            '가까운 미래에 쓸 목돈을 마련하고 싶어요',
            '꾸준히 모아 중장기 목표자금을 만들고 싶어요',
            '자산을 천천히 늘리고 싶어요',
            '높은 수익을 기대하며 적극적으로 투자하고 싶어요',
        ],
        scores: [1, 2, 3, 4, 5],
        multi: false,
    },
    {
        id: 4,
        question: '이 자금을 언제 사용할 예정인가요?',
        sub: '투자 기간에 따라 적합한 상품이 달라집니다.',
        icon: '⏳',
        options: ['6개월 이내', '1년 이내', '1~3년 이내', '3~5년 이후', '5년 이상 장기적으로 투자할 예정이에요'],
        scores: [1, 2, 3, 4, 5],
        multi: false,
    },
    {
        id: 5,
        question: '금융투자 경험은 어느 정도인가요?',
        sub: '경험에 따라 추천하는 상품의 난이도가 달라집니다.',
        icon: '📈',
        options: [
            '투자 경험이 거의 없어요',
            '예금, 적금 정도만 해봤어요',
            '펀드나 ETF를 조금 해봤어요',
            '주식, 펀드, ETF 투자 경험이 있어요',
            '다양한 금융상품에 투자해본 경험이 있어요',
        ],
        scores: [1, 2, 3, 4, 5],
        multi: false,
    },
    {
        id: 6,
        question: '금융상품의 구조와 위험을 얼마나 이해하고 있나요?',
        sub: '이해도에 따라 적합한 상품 수준이 달라집니다.',
        icon: '🧠',
        options: [
            '거의 이해하지 못해요',
            '설명을 들으면 조금 이해할 수 있어요',
            '기본적인 상품은 구분할 수 있어요',
            '주식, 펀드, ETF의 차이를 알고 있어요',
            '손실 가능성과 위험 구조까지 이해하고 있어요',
        ],
        scores: [1, 2, 3, 4, 5],
        multi: false,
    },
    {
        id: 7,
        question: '투자금은 전체 자산 중 어느 정도 비중인가요?',
        sub: '투자 비중에 따라 위험 감내 능력이 달라집니다.',
        icon: '⚖️',
        options: [
            '전체 자산의 대부분이에요',
            '절반 이상이에요',
            '30~50% 정도예요',
            '10~30% 정도예요',
            '10% 미만의 여유자금이에요',
        ],
        scores: [1, 2, 3, 4, 5],
        multi: false,
    },
    {
        id: 8,
        question: '투자 자금의 출처는 어떻게 되나요?',
        sub: '자금 성격에 따라 위험 허용 범위가 결정됩니다.',
        icon: '🏦',
        options: [
            '생활비나 꼭 필요한 자금이에요',
            '가까운 시일 내 사용할 예정인 자금이에요',
            '일부 여유자금이에요',
            '정기 소득 중 투자 가능한 금액이에요',
            '당장 사용 계획이 없는 여유자금이에요',
        ],
        scores: [1, 2, 3, 4, 5],
        multi: false,
    },
    {
        id: 9,
        question: '투자할 때 가장 중요하게 생각하는 것은 무엇인가요?',
        sub: '투자 우선순위가 포트폴리오 전략의 기준이 됩니다.',
        icon: '🏆',
        options: [
            '원금 보존이 가장 중요해요',
            '수익보다 안정성이 더 중요해요',
            '안정성과 수익을 균형 있게 보고 싶어요',
            '어느 정도 위험을 감수하고 수익을 높이고 싶어요',
            '큰 수익을 위해 높은 변동성도 감수할 수 있어요',
        ],
        scores: [1, 2, 3, 4, 5],
        multi: false,
    },
    {
        id: 10,
        question: '투자금에 손실이 발생한다면 어느 정도까지 감수할 수 있나요?',
        sub: '손실 감내 수준은 투자 성향의 핵심 지표입니다.',
        icon: '📉',
        options: [
            '원금 손실은 원하지 않아요',
            '5% 이내 손실까지 가능해요',
            '10% 이내 손실까지 가능해요',
            '20% 이내 손실까지 가능해요',
            '30% 이상 손실 가능성도 감수할 수 있어요',
        ],
        scores: [1, 2, 3, 4, 5],
        multi: false,
    },
    {
        id: 11,
        question: '투자 후 3개월 동안 -5% 손실이 발생하면 어떻게 하실 건가요?',
        sub: '실제 손실 상황에서의 행동 패턴을 파악합니다.',
        icon: '😰',
        options: [
            '바로 해지하거나 매도할 것 같아요',
            '일부 금액을 줄일 것 같아요',
            '상황을 조금 더 지켜볼 것 같아요',
            '장기 투자라 크게 신경 쓰지 않을 것 같아요',
            '오히려 추가 투자 기회로 볼 것 같아요',
        ],
        scores: [1, 2, 3, 4, 5],
        multi: false,
    },
    {
        id: 12,
        question: '원하는 투자 스타일은 무엇인가요?',
        sub: '투자 스타일에 맞는 상품을 추천해 드립니다.',
        icon: '🎨',
        options: [
            '예금처럼 최대한 안전한 방식이 좋아요',
            '안정적인 상품 중심으로 투자하고 싶어요',
            '안정성과 수익을 균형 있게 가져가고 싶어요',
            '수익을 위해 어느 정도 위험을 감수하고 싶어요',
            '높은 수익 가능성을 우선으로 보고 싶어요',
        ],
        scores: [1, 2, 3, 4, 5],
        multi: false,
    },
    {
        id: 13,
        question: '선호하는 투자 상품은 무엇인가요?',
        sub: '선호 상품을 기반으로 맞춤 포트폴리오를 구성합니다.',
        icon: '📦',
        options: ['예금/적금', '국내 주식', '국내 ETF', '해외 주식', '해외 ETF'],
        scores: [1, 2, 3, 4, 5],
        multi: false,
    },
    {
        id: 14,
        question: '관심 있는 투자 테마를 모두 선택해주세요.',
        sub: '선택한 테마를 중심으로 포트폴리오가 구성됩니다.',
        icon: '🧩',
        options: ['AI', '반도체', '2차전지', '자동차', '광통신', '배당/연금', '미국 기술주', '로봇/자동화'],
        scores: [5, 5, 4, 3, 4, 2, 5, 4],
        multi: true,
    },
];

const InvestmentQuestions = () => {
    const navigate = useNavigate();
    const {user} = useAuthStore();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState(Array(questions.length).fill(null));
    const [submitting, setSubmitting] = useState(false);

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

    const handleNext = async () => {
        if (step < questions.length - 1) {
            setStep((p) => p + 1);
            return;
        }
        const {totalScore, typeName, selectedThemes} = calculateResult();

        // 비로그인: API 없이 로컬 결과로 바로 이동 (체험 모드)
        if (!user) {
            savePendingSurvey(answers, selectedThemes);
            const guestSurveyData = {
                totalScore,
                resultType: typeName,
                description: typeDescriptions[typeName],
                recommendations: [],
            };
            navigate('/investment/result', {
                state: {surveyData: guestSurveyData, selectedThemes, isGuest: true, rawAnswers: answers},
            });
            return;
        }

        setSubmitting(true);
        try {
            const toVal = (idx) => idx !== null ? idx + 1 : undefined;
            const surveyData = await submitRiskSurveyApi({
                ageGroup: toVal(answers[0]),
                incomeRange: toVal(answers[1]),
                investmentPurpose: toVal(answers[2]),
                investmentHorizon: toVal(answers[3]),
                experienceLevel: toVal(answers[4]),
                understandingLevel: toVal(answers[5]),
                investmentRatio: toVal(answers[6]),
                fundSource: toVal(answers[7]),
                priority: toVal(answers[8]),
                lossTolerance: toVal(answers[9]),
                lossReaction: toVal(answers[10]),
                investmentStyle: toVal(answers[11]),
                preferredProduct: toVal(answers[12]),
                preferredThemes: selectedThemes,
            });
            // risk_profile 테이블에 최신 성향 저장 (실패해도 결과 화면 진행)
            saveRiskProfileApi(surveyData.totalScore).catch((e) =>
                console.warn('risk_profile 저장 실패:', e)
            );
            navigate('/investment/result', {state: {surveyData, selectedThemes}});
        } catch (error) {
            console.error('투자성향 설문 제출 실패:', error);
            alert('결과 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setSubmitting(false);
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
            if (q.statsOnly) return; // Q1 연령대: 통계용, 점수 미반영
            if (q.multi && Array.isArray(ans)) {
                // Q14 관심 테마: 테마 목록만 수집, 점수 미반영
                ans.forEach((idx) => selectedThemes.push(q.options[idx]));
            } else if (ans !== null) {
                score += q.scores[ans]; // Q2~Q13: 각 1~5점
            }
        });

        // 12문항 × 1~5점 → 12~60점 범위 클램프
        score = Math.min(60, Math.max(12, score));

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
                                className={`${styles.nextBtn} ${(!isAnswered || submitting) ? styles.nextBtnDisabled : ''}`}
                                onClick={handleNext}
                                disabled={!isAnswered || submitting}
                            >
                                {submitting ? '분석 중...' : step === questions.length - 1 ? '결과 보기 →' : '다음 질문 →'}
                            </button>
                        </div>

                        <div className={styles.securityNote}>
                            {user
                                ? '🔒 입력하신 정보는 안전하게 보호됩니다.'
                                : '🔒 비회원 체험 모드 — 입력하신 정보는 서버에 저장되지 않습니다.'}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InvestmentQuestions;