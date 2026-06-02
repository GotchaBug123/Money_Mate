// src/pages/CustomerService/StockGuide.jsx

import React from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './StockGuide.module.css';

function StockGuide() {
    const navigate = useNavigate();

    const STEPS = [
        {
            num: 1,
            title: '증권사 계좌 개설하기',
            desc: '투자의 첫걸음은 내 이름으로 된 주식 계좌를 만드는 것입니다. 원하시는 증권사의 모바일 앱(MTS)을 다운로드하고 비대면으로 계좌를 개설해 보세요. 신분증과 본인 명의 타행 계좌만 있으면 5분 만에 쉽게 개설할 수 있습니다.',
            action: null, // 버튼 없음
        },
        {
            num: 2,
            title: '나의 투자 성향 파악하기',
            desc: '무작정 남들이 사는 주식을 따라 사기 전, 내가 원금 보장을 중요하게 생각하는지, 위험을 감수하더라도 높은 수익률을 원하는지 아는 것이 중요합니다. MoneyMate의 무료 진단을 통해 나의 성향을 정확히 파악해 보세요.',
            action: {label: '무료 진단받기 ↗', path: '/financial/input'},
        },
        {
            num: 3,
            title: '투자 예산 및 시드머니 설정하기',
            desc: '주식은 항상 가격이 변동하므로 당장 다음 달에 생활비로 써야 할 돈을 넣는 것은 위험합니다. 최소 1년~3년 이상 묵혀둘 수 있는 순수한 \'여유 자금\'으로 시작하는 것이 가장 안전한 투자의 비결입니다.',
            action: null,
        },
        {
            num: 4,
            title: '안전한 포트폴리오 시뮬레이션 하기',
            desc: '계란을 한 바구니에 담지 말라는 격언처럼, 개별 종목과 ETF를 섞어 위험을 분산해야 합니다. 매수 전 MoneyMate의 AI 포트폴리오 추천이나 직접 구성을 통해 과거 수익률을 시뮬레이션해 보세요.',
            action: {label: '포트폴리오 생성하기 ↗', path: '/portfolio'},
        },
        {
            num: 5,
            title: '실전 투자 시작 및 주기적인 리밸런싱',
            desc: '결정하신 포트폴리오 비율에 맞춰 증권사 앱에서 실제로 주식을 매수합니다. 이후 3개월이나 6개월에 한 번씩, 가격 변동으로 인해 틀어진 비율을 원래대로 맞춰주는 \'리밸런싱\'을 통해 자산을 안전하게 불려 나가세요!',
            action: {label: '리밸런싱 알아보기 ↗', path: '/portfolio/rebalancing'},
        }
    ];

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>

                <div className={styles.header}>
                    <h1 className={styles.title}>초보자를 위한 주식 준비 5단계</h1>
                    <p className={styles.subtitle}>
                        어렵게만 느껴졌던 주식 투자, MoneyMate가 제안하는 안전한 5단계 가이드를 따라<br/>
                        당신의 자산을 현명하게 관리하는 첫걸음을 내디뎌 보세요.
                    </p>
                </div>

                <div className={styles.timeline}>
                    {STEPS.map((step) => (
                        <div key={step.num} className={styles.stepCard}>
                            <div className={styles.stepNumber}>{step.num}</div>

                            <div className={styles.stepContent}>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDesc}>{step.desc}</p>

                                {/* 유도 액션 버튼이 있는 경우만 렌더링 */}
                                {step.action && (
                                    <button
                                        className={styles.actionBtn}
                                        onClick={() => navigate(step.action.path)}
                                    >
                                        {step.action.label}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default StockGuide;