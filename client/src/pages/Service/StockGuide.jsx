import React from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './StockGuide.module.css';

function StockGuide() {
    const navigate = useNavigate();

    const STEPS = [
        {
            num: 1,
            title: '증권사 계좌 개설하기',
            desc: '투자의 첫걸음은 내 이름으로 된 주식 계좌를 만드는 것입니다. 원하시는 증권사의 모바일 앱을 다운로드하고 비대면으로 계좌를 개설해 보세요.',
            action: null,
        },
        {
            num: 2,
            title: '나의 투자 성향 파악하기',
            desc: '무작정 남들이 사는 주식을 따라 사기 전, 내가 어떤 위험 수준을 감당할 수 있는지 아는 것이 중요합니다. MoneyMate의 무료 진단을 통해 나의 성향을 확인해 보세요.',
            action: {label: '무료 진단받기', path: '/financial/input'},
        },
        {
            num: 3,
            title: '투자 예산 및 시드머니 설정하기',
            desc: '주식은 항상 가격이 변동하므로 당장 필요한 생활비를 넣는 것은 위험합니다. 최소 1년 이상 묵혀둘 수 있는 여유 자금으로 시작하는 것이 좋습니다.',
            action: null,
        },
        {
            num: 4,
            title: '안전한 포트폴리오 시뮬레이션 하기',
            desc: '개별 종목과 ETF를 함께 구성하면 위험을 분산할 수 있습니다. 매수 전 MoneyMate의 AI 포트폴리오 추천이나 직접 구성을 통해 시뮬레이션해 보세요.',
            action: {label: '포트폴리오 생성하기', path: '/portfolio'},
        },
        {
            num: 5,
            title: '실전 투자 시작 및 주기적인 리밸런싱',
            desc: '정한 포트폴리오 비율에 맞춰 실제 투자를 시작하고, 3개월 또는 6개월마다 비율을 다시 맞추는 리밸런싱으로 자산을 안정적으로 관리해 보세요.',
            action: {label: '리밸런싱 알아보기', path: '/rebalancing'},
        }
    ];

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <section className={styles.heroSection}>
                    <h1 className={styles.title}>초보자를 위한 주식 준비 5단계</h1>
                    <p className={styles.subtitle}>
                        어렵게만 느껴졌던 주식 투자, MoneyMate가 제안하는 안전한 5단계 가이드를 따라
                        자산 관리의 첫걸음을 시작해 보세요.
                    </p>
                </section>

                <section className={styles.guideSummary}>
                    <div>
                        <span>진행 단계</span>
                        <strong>5단계</strong>
                    </div>
                    <div>
                        <span>추천 방식</span>
                        <strong>성향 진단</strong>
                    </div>
                    <div>
                        <span>관리 방법</span>
                        <strong>리밸런싱</strong>
                    </div>
                </section>

                <section className={styles.timeline}>
                    {STEPS.map((step) => (
                        <article key={step.num} className={styles.stepCard}>
                            <div className={styles.stepNumber}>
                                {step.num}
                            </div>

                            <div className={styles.stepContent}>
                                <span className={styles.stepBadge}>STEP {step.num}</span>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDesc}>{step.desc}</p>

                                {step.action && (
                                    <button
                                        type="button"
                                        className={styles.actionBtn}
                                        onClick={() => navigate(step.action.path)}
                                    >
                                        {step.action.label} ↗
                                    </button>
                                )}
                            </div>
                        </article>
                    ))}
                </section>
            </div>
        </div>
    );
}

export default StockGuide;