import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './InvestmentDiagnosis.module.css';

const questions = [
    { id:1,  question:'사용자의 연령대를 알고 싶어요!',           sub:'연령대에 따라 투자 목표와 기간이 달라질 수 있어요.',    icon:'👤', options:['19세 미만','19~29세','30~39세','40~49세','50~59세','60세 이상'],              scores:[1,2,3,4,5,5], multi:false },
    { id:2,  question:'연간 소득은 어느 정도인가요?',             sub:'소득 수준에 따라 투자 가능 금액이 달라집니다.',       icon:'💰', options:['1천만원 미만','1천~3천만원 미만','3천~5천만원 미만','5천~8천만원 미만','8천만원 이상'], scores:[1,2,3,4,5], multi:false },
    { id:3,  question:'투자 목적은 무엇인가요?',                  sub:'목적에 따라 적합한 투자 전략이 달라집니다.',          icon:'🎯', options:['생활비나 비상금을 안전하게 보관하고 싶어요','가까운 미래에 쓸 목돈을 마련하고 싶어요','꾸준히 모아 중장기 목표자금을 만들고 싶어요','자산을 천천히 늘리고 싶어요','높은 수익을 기대하며 적극적으로 투자하고 싶어요'], scores:[1,2,3,4,5], multi:false },
    { id:4,  question:'이 자금을 언제 사용할 예정인가요?',         sub:'사용 시기에 따라 투자 기간이 결정됩니다.',            icon:'📅', options:['6개월 이내','1년 이내','1~3년 이내','3~5년 이후','5년 이상 장기적으로 투자할 예정이에요'], scores:[1,2,3,4,5], multi:false },
    { id:5,  question:'금융투자 경험은 어느 정도인가요?',          sub:'투자 경험에 따라 적합한 상품이 달라집니다.',          icon:'📊', options:['투자 경험이 거의 없어요','예금, 적금 정도만 해봤어요','펀드나 ETF를 조금 해봤어요','주식, 펀드, ETF 투자 경험이 있어요','다양한 금융상품에 투자해본 경험이 있어요'], scores:[1,2,3,4,5], multi:false },
    { id:6,  question:'금융상품의 구조와 위험을 얼마나 이해하고 있나요?', sub:'이해도에 따라 맞춤 상품을 추천해드립니다.',   icon:'🧠', options:['거의 이해하지 못해요','설명을 들으면 조금 이해할 수 있어요','기본적인 상품은 구분할 수 있어요','주식, 펀드, ETF의 차이를 알고 있어요','손실 가능성과 위험 구조까지 이해하고 있어요'], scores:[1,2,3,4,5], multi:false },
    { id:7,  question:'투자금은 전체 자산 중 어느 정도 비중인가요?', sub:'자산 비중에 따라 위험 수용도가 달라집니다.',        icon:'⚖️', options:['전체 자산의 대부분이에요','절반 이상이에요','30~50% 정도예요','10~30% 정도예요','10% 미만의 여유자금이에요'], scores:[1,2,3,4,5], multi:false },
    { id:8,  question:'투자 자금의 출처는 어떻게 되나요?',         sub:'자금 성격에 따라 적합한 위험 수준이 결정됩니다.',     icon:'💳', options:['생활비나 꼭 필요한 자금이에요','가까운 시일 내 사용할 예정인 자금이에요','일부 여유자금이에요','정기 소득 중 투자 가능한 금액이에요','당장 사용 계획이 없는 여유자금이에요'], scores:[1,2,3,4,5], multi:false },
    { id:9,  question:'투자할 때 가장 중요하게 생각하는 것은?',     sub:'투자 철학에 맞는 포트폴리오를 구성해드립니다.',       icon:'🏆', options:['원금 보존이 가장 중요해요','수익보다 안정성이 더 중요해요','안정성과 수익을 균형 있게 보고 싶어요','어느 정도 위험을 감수하고 수익을 높이고 싶어요','큰 수익을 위해 높은 변동성도 감수할 수 있어요'], scores:[1,2,3,4,5], multi:false },
    { id:10, question:'투자금에 손실이 발생한다면 어느 정도까지 감수할 수 있나요?', sub:'손실 허용 범위가 투자 전략을 결정합니다.', icon:'📉', options:['원금 손실은 원하지 않아요','5% 이내 손실까지 가능해요','10% 이내 손실까지 가능해요','20% 이내 손실까지 가능해요','30% 이상 손실 가능성도 감수할 수 있어요'], scores:[1,2,3,4,5], multi:false },
    { id:11, question:'투자 후 3개월 동안 -5% 손실이 발생하면 어떻게 하실 건가요?', sub:'심리적 대응 방식이 투자 성향을 보여줍니다.', icon:'🤔', options:['바로 해지하거나 매도할 것 같아요','일부 금액을 줄일 것 같아요','상황을 조금 더 지켜볼 것 같아요','장기 투자라 크게 신경 쓰지 않을 것 같아요','오히려 추가 투자 기회로 볼 것 같아요'], scores:[1,2,3,4,5], multi:false },
    { id:12, question:'원하는 투자 스타일은 무엇인가요?',           sub:'투자 스타일에 맞는 상품을 추천해드립니다.',           icon:'🎨', options:['예금처럼 최대한 안전한 방식이 좋아요','안정적인 상품 중심으로 투자하고 싶어요','안정성과 수익을 균형 있게 가져가고 싶어요','수익을 위해 어느 정도 위험을 감수하고 싶어요','높은 수익 가능성을 우선으로 보고 싶어요'], scores:[1,2,3,4,5], multi:false },
    { id:13, question:'선호하는 투자 상품은 무엇인가요?',           sub:'선호 상품을 포트폴리오에 반영합니다.',                icon:'🗂️', options:['예금/적금','국내 주식','국내 ETF','해외 주식','해외 ETF'], scores:[1,2,3,4,5], multi:false, tag:'product' },
    { id:14, question:'관심 있는 투자 테마는 무엇인가요?',          sub:'복수 선택 가능합니다.',                             icon:'✨', options:['AI','반도체','2차전지','자동차','광통신','배당/연금','미국 기술주','로봇/자동화'], scores:[0,0,0,0,0,0,0,0], multi:true, tag:'theme' },
];

const InvestmentQuestions = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState(Array(questions.length).fill(null));

    const q = questions[step];
    const current = answers[step];
    const progress = Math.round(((step + 1) / questions.length) * 100);

    const handleSelect = (idx) => {
        const updated = [...answers];
        if (q.multi) {
            const prev = Array.isArray(current) ? current : [];
            updated[step] = prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx];
        } else {
            updated[step] = idx;
        }
        setAnswers(updated);
    };

    const isAnswered = q.multi
        ? Array.isArray(current) && current.length > 0
        : current !== null;

    const handleNext = () => {
        if (step < questions.length - 1) setStep(step + 1);
        else navigate('/investment/result', { state: { answers, questions } });
    };

    const handlePrev = () => { if (step > 0) setStep(step - 1); };

    return (
        <div className={styles.pageWrapper}>
            {/* 상단 진행 바 */}
            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>

            <div className={styles.questionLayout}>
                {/* 왼쪽 사이드바 */}
                <div className={styles.questionLeft}>
                    <p className={styles.stepBadge}>Q{q.id}</p>
                    <div className={styles.stepInfo}>
                        <span className={styles.stepCurrent}>{step + 1}</span>
                        <span className={styles.stepTotal}> / {questions.length}</span>
                    </div>
                    <p className={styles.stepHint}>투자성향 진단</p>
                    <div className={styles.stepDots}>
                        {questions.map((_, i) => (
                            <div key={i} className={`${styles.dot} ${i < step ? styles.dotDone : ''} ${i === step ? styles.dotActive : ''}`} />
                        ))}
                    </div>
                    <div className={styles.sideDivider} />
                    <p className={styles.sideTipTitle}>잠깐! 투자성향 진단이란?</p>
                    <p className={styles.sideTipText}>고객님의 성향을 파악하여 더 적합한 투자 전략을 제안하기 위한 것입니다.</p>
                    <div className={styles.sideIllust}>📋</div>
                </div>

                {/* 오른쪽 질문 영역 */}
                <div className={styles.questionRight}>
                    <div className={styles.qHeader}>
                        <div className={styles.qIcon}>{q.icon}</div>
                        <h2 className={styles.questionText}>{q.question}</h2>
                    </div>
                    <p className={styles.qSub}>{q.sub}</p>
                    {q.multi && <p className={styles.multiHint}>복수 선택 가능</p>}

                    <div className={styles.optionList}>
                        {q.options.map((opt, idx) => {
                            const isSelected = q.multi
                                ? Array.isArray(current) && current.includes(idx)
                                : current === idx;
                            return (
                                <button key={idx}
                                        className={`${styles.optionBtn} ${isSelected ? styles.optionSelected : ''}`}
                                        onClick={() => handleSelect(idx)}>
                                    <div className={`${styles.radio} ${isSelected ? styles.radioOn : ''}`}>
                                        {isSelected && <div className={styles.radioDot} />}
                                    </div>
                                    <span className={`${styles.optionNum} ${isSelected ? styles.optionNumOn : ''}`}>{idx + 1}</span>
                                    <span className={styles.optionText}>{opt}</span>
                                    <span className={`${styles.optionArrow} ${isSelected ? styles.optionArrowOn : ''}`}>›</span>
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
    );
};

export default InvestmentQuestions;