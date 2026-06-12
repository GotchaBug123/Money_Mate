import React from 'react';
import {useNavigate} from 'react-router-dom';
import {usePortfolioStore} from '../../../store/usePortfolioStore';
import styles from './PortfolioMain.module.css';

const CHIP_COLORS = [
    {bg: 'var(--color-primary-light)', color: 'var(--color-primary)'},
    {bg: 'var(--color-success-bg)', color: 'var(--color-success)'},
    {bg: 'var(--color-error-bg)', color: 'var(--color-error)'},
    {bg: 'var(--color-warning-bg)', color: 'var(--color-warning)'},
    {bg: 'var(--color-bg-input)', color: 'var(--color-text-sub)'},
];

const AutoCard = ({portfolio, onView, onDelete}) => (
    <div className={styles.card}>
        <button className={styles.delBtn} onClick={(e) => {
            e.stopPropagation();
            onDelete();
        }}>✕
        </button>
        <div>
            <p className={styles.cardType}>AI 자동 포트폴리오</p>
            <h3 className={styles.cardTitle}>{portfolio.name}</h3>
            <p className={styles.cardDate}>생성일: {portfolio.createdAt}</p>
        </div>
        <div className={styles.statGrid}>
            <div className={styles.statCol}>
                <span className={styles.statLabel}>예상 연평균 수익률</span>
                <span className={`${styles.statVal} ${styles.pos}`}>+{portfolio.avgReturnRate}%</span>
            </div>
            <div className={styles.statCol}>
                <span className={styles.statLabel}>목표 달성 확률</span>
                <span className={styles.statVal}>{portfolio.achievementRate}%</span>
            </div>
        </div>
        <div className={styles.stockChips}>
            {portfolio.stocks.map((st, i) => {
                const color = CHIP_COLORS[i % CHIP_COLORS.length];
                return (
                    <span key={i} className={styles.chip} style={{background: color.bg, color: color.color}}>
                        {st.name} {st.weight}%
                    </span>
                );
            })}
        </div>
        <div className={styles.ctaBox}>
            <div className={styles.ctaRow}>
                <span className={styles.ctaLabel}>목표 금액</span>
                <span className={styles.ctaVal}>{portfolio.goalAmount}만원</span>
            </div>
            <button className={styles.ctaBtn} onClick={onView}>상세 결과 보기</button>
        </div>
    </div>
);

const DirectCard = ({portfolio, onView, onDelete}) => (
    <div className={styles.card}>
        <button className={styles.delBtn} onClick={(e) => {
            e.stopPropagation();
            onDelete();
        }}>✕
        </button>
        <div>
            <p className={styles.cardType}>내 포트폴리오</p>
            <h3 className={styles.cardTitle}>{portfolio.name}</h3>
            <p className={styles.cardDate}>투자 금액: {portfolio.investAmount}{portfolio.currency}</p>
        </div>
        <div className={styles.statGrid}>
            <div className={styles.statCol}>
                <span className={styles.statLabel}>편입 종목 수</span>
                <span className={styles.statVal}>{portfolio.stocks.length}개</span>
            </div>
            <div className={styles.statCol}>
                <span className={styles.statLabel}>목표 금액</span>
                <span className={styles.statVal}>{portfolio.goalAmount}만원</span>
            </div>
        </div>
        <div className={styles.stockChips}>
            {portfolio.stocks.slice(0, 3).map((st, i) => {
                const color = CHIP_COLORS[i % CHIP_COLORS.length];
                return (
                    <span key={i} className={styles.chip} style={{background: color.bg, color: color.color}}>
                        {st.name} {st.weight}%
                    </span>
                );
            })}
            {portfolio.stocks.length > 3 && (
                <span className={styles.chip} style={{background: 'var(--color-bg-input)', color: 'var(--color-text-sub)'}}>
                    +{portfolio.stocks.length - 3}
                </span>
            )}
        </div>
        <div className={styles.ctaBox}>
            <button className={styles.ctaBtn} onClick={onView}>포트폴리오 관리하기</button>
        </div>
    </div>
);

const PortfolioMain = () => {
    const navigate = useNavigate();
    const autoList = usePortfolioStore((state) => state.autoList);
    const directList = usePortfolioStore((state) => state.directList);
    const deleteAutoPortfolio = usePortfolioStore((state) => state.deleteAutoPortfolio);
    const deleteDirectPortfolio = usePortfolioStore((state) => state.deleteDirectPortfolio);

    const handleDelete = (id, type) => {
        if (window.confirm('포트폴리오를 삭제하시겠습니까?')) {
            if (type === 'auto') deleteAutoPortfolio(id);
            else deleteDirectPortfolio(id);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>

                <section className={styles.section}>
                    <div className={styles.secHead}>
                        <div className={styles.secIconWrap}><span className={styles.secIcon}>🤖</span></div>
                        <div>
                            <p className={styles.secTitle}>AI 추천 포트폴리오</p>
                            <p className={styles.secDesc}>유저님의 투자 성향과 목표 금액에 맞추어 인공지능이 분석하고 추천한 최적의 포트폴리오 내역입니다.</p>
                        </div>
                    </div>

                    <div className={styles.cardRow}>
                        {autoList.map(p => (
                            <AutoCard key={p.id} portfolio={p}
                                      onView={() => navigate('/portfolio/result', {state: {...p}})}
                                      onDelete={() => handleDelete(p.id, 'auto')}/>
                        ))}
                        <div className={styles.addCard} onClick={() => navigate('/portfolio/auto')}>
                            <div className={styles.addIconWrap}><span className={styles.addPlus}>+</span></div>
                            <span className={styles.addLabel}>새로운 AI 포트폴리오 진단받기</span>
                        </div>
                    </div>
                </section>

                <div className={styles.divider}/>

                <section className={styles.section}>
                    <div className={styles.secHead}>
                        <div className={styles.secIconWrap}><span className={styles.secIcon}>📋</span></div>
                        <div>
                            <p className={styles.secTitle}>내 포트폴리오</p>
                            <p className={styles.secDesc}>직접 목표와 종목을 설정해 나만의 포트폴리오를 구성할 수 있어요. 원하는 주식을 담고 목표 수익을 직접 설정해보세요.</p>
                        </div>
                    </div>

                    <div className={styles.cardRow}>
                        {directList.map(p => (
                            <DirectCard key={p.id} portfolio={p}
                                        onView={() => navigate('/portfolio/result', {state: {...p}})}
                                        onDelete={() => handleDelete(p.id, 'direct')}/>
                        ))}
                        <div className={styles.addCard} onClick={() => navigate('/portfolio/direct')}>
                            <div className={styles.addIconWrap}><span className={styles.addPlus}>+</span></div>
                            <span className={styles.addLabel}>직접 포트폴리오 구성하기</span>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default PortfolioMain;