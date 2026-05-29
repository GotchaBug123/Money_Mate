import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PortfolioMain.module.css';

// ✅ 백엔드 연결 시 교체
// API: GET /api/portfolio/auto-list
// API: GET /api/portfolio/direct-list
const MOCK_AUTO_LIST = [
    {
        id: 1,
        name: '공격투자형 포트폴리오',
        investAmount: 500, currency: '만원',
        startDate: '2026-05-24', endDate: '2030-05-24',
        goalAmount: 800, finalAmount: 715,
        avgReturnRate: 12.4, achievementRate: 78,
        stocks: [
            { name: 'TIGER 미국S&P500', weight: 30 },
            { name: 'NVIDIA', weight: 25 },
            { name: '삼성전자', weight: 25 },
            { name: 'KODEX 2차전지', weight: 20 },
        ],
        createdAt: '2026-05-24',
    },
];
const MOCK_DIRECT_LIST = [];

const CHIP_COLORS = [
    { bg: '#EAF2FC', color: '#185FA5' },
    { bg: '#EDFAF4', color: '#1A7A45' },
    { bg: '#FFF0EE', color: '#C0392B' },
    { bg: '#FAEEDA', color: '#B47D0C' },
];

const CardMenu = ({ onView, onEdit, onDelete }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        if (!open) return;
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);
    return (
        <div className={styles.menuWrap} ref={ref} onClick={e => e.stopPropagation()}>
            <button className={styles.menuBtn} onClick={() => setOpen(o => !o)}>···</button>
            {open && (
                <div className={styles.dropdown}>
                    <button className={styles.dropItem} onClick={() => { onView(); setOpen(false); }}>결과 보기</button>
                    <button className={styles.dropItem} onClick={() => { onEdit(); setOpen(false); }}>수정하기</button>
                    <div className={styles.dropSep} />
                    <button className={`${styles.dropItem} ${styles.dropDanger}`} onClick={() => { onDelete(); setOpen(false); }}>삭제하기</button>
                </div>
            )}
        </div>
    );
};

const AutoCard = ({ portfolio, onView, onDelete }) => (
    <div className={styles.card} onClick={onView}>
        <div className={styles.cardInner}>
            <CardMenu onView={onView} onEdit={() => alert('수정 기능은 준비 중입니다.')} onDelete={onDelete} />
            <p className={styles.cardName}>{portfolio.name}</p>
            <p className={styles.cardDate}>{portfolio.createdAt}</p>
            <div className={styles.cardStats}>
                <div className={styles.statBox}>
                    <p className={styles.statLabel}>투자금액</p>
                    <p className={styles.statVal}>{Number(portfolio.investAmount).toLocaleString()}{portfolio.currency}</p>
                </div>
                <div className={styles.statBox}>
                    <p className={styles.statLabel}>연평균 수익률</p>
                    <p className={`${styles.statVal} ${styles.pos}`}>+{portfolio.avgReturnRate}%</p>
                </div>
                <div className={styles.statBox}>
                    <p className={styles.statLabel}>달성 확률</p>
                    <p className={`${styles.statVal} ${styles.pos}`}>{portfolio.achievementRate}%</p>
                </div>
            </div>
            <div className={styles.chips}>
                {portfolio.stocks.map((st, i) => (
                    <span key={i} className={styles.chip}
                          style={{ background: CHIP_COLORS[i % CHIP_COLORS.length].bg, color: CHIP_COLORS[i % CHIP_COLORS.length].color }}>
                        {st.name} <strong>{st.weight}%</strong>
                    </span>
                ))}
            </div>
            <div className={styles.cardFoot}>
                <span className={styles.footPeriod}>{portfolio.startDate} ~ {portfolio.endDate}&nbsp;&nbsp;목표 {Number(portfolio.goalAmount).toLocaleString()}{portfolio.currency}</span>
                <span className={styles.footArrow}>›</span>
            </div>
        </div>
    </div>
);

const DirectCard = ({ portfolio, onView, onDelete }) => (
    <div className={styles.card} onClick={onView}>
        <div className={styles.cardInner}>
            <CardMenu onView={onView} onEdit={() => alert('수정 기능은 준비 중입니다.')} onDelete={onDelete} />
            <p className={styles.cardName}>{portfolio.name}</p>
            <p className={styles.cardDate}>{portfolio.createdAt}</p>
            <div className={styles.chips}>
                {portfolio.stocks.map((st, i) => (
                    <span key={i} className={styles.chip}
                          style={{ background: CHIP_COLORS[i % CHIP_COLORS.length].bg, color: CHIP_COLORS[i % CHIP_COLORS.length].color }}>
                        {st.name} <strong>{st.weight}%</strong>
                    </span>
                ))}
            </div>
            <div className={styles.cardFoot}>
                <span className={styles.footPeriod}>{portfolio.startDate} ~ {portfolio.endDate}&nbsp;&nbsp;목표 {Number(portfolio.goalAmount).toLocaleString()}{portfolio.currency}</span>
                <span className={styles.footArrow}>›</span>
            </div>
        </div>
    </div>
);

const PortfolioMain = () => {
    const navigate = useNavigate();
    const [autoList,   setAutoList]   = useState([]);
    const [directList, setDirectList] = useState([]);
    const [loading,    setLoading]    = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                await new Promise(r => setTimeout(r, 400));
                setAutoList(MOCK_AUTO_LIST);
                setDirectList(MOCK_DIRECT_LIST);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const handleDelete = (id, type) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        if (type === 'auto')   setAutoList(p => p.filter(x => x.id !== id));
        if (type === 'direct') setDirectList(p => p.filter(x => x.id !== id));
    };

    return (
        <div className={styles.pageWrapper}>

            {/* ── 자동생성 섹션 ── */}
            <section className={styles.section}>
                <div className={styles.secHead}>
                    <div className={styles.secIconWrap}><span className={styles.secIcon}>🤖</span></div>
                    <div>
                        <p className={styles.secTitle}>내 포트폴리오</p>
                        <p className={styles.secDesc}>투자성향 분석 기반으로 AI가 자동 구성한 포트폴리오입니다. 수익률·달성 확률 등 시뮬레이션 결과를 확인할 수 있어요.</p>
                    </div>
                </div>

                {loading ? (
                    <p className={styles.loadingText}>불러오는 중...</p>
                ) : (
                    <div className={styles.cardRow}>
                        {autoList.map(p => (
                            <AutoCard key={p.id} portfolio={p}
                                      onView={() => navigate('/portfolio/result', { state: { ...p } })}
                                      onDelete={() => handleDelete(p.id, 'auto')} />
                        ))}
                        {/* 자동생성 CTA 카드 */}
                        <div className={styles.ctaCard} onClick={() => navigate('/portfolio/auto')}>
                            <div className={styles.ctaIllust}>📊</div>
                            <p className={styles.ctaTitle}>포트폴리오 자동 생성</p>
                            <p className={styles.ctaDesc}>투자성향 분석을 기반으로 AI가<br/>맞춤형 포트폴리오를 자동으로 만들어드려요.</p>
                            <button className={styles.ctaBtn} onClick={e => { e.stopPropagation(); navigate('/portfolio/auto'); }}>
                                ✦ 포트폴리오 자동 생성하기
                            </button>
                        </div>
                    </div>
                )}
            </section>

            <div className={styles.divider} />

            {/* ── 직접생성 섹션 ── */}
            <section className={styles.section}>
                <div className={styles.secHead}>
                    <div className={styles.secIconWrap}><span className={styles.secIcon}>📋</span></div>
                    <div>
                        <p className={styles.secTitle}>내 포트폴리오</p>
                        <p className={styles.secDesc}>직접 목표와 종목을 설정해 나만의 포트폴리오를 구성할 수 있어요. 원하는 주식을 담고 목표 수익을 직접 설정해보세요.</p>
                    </div>
                </div>

                {loading ? (
                    <p className={styles.loadingText}>불러오는 중...</p>
                ) : (
                    <div className={styles.cardRow}>
                        {directList.map(p => (
                            <DirectCard key={p.id} portfolio={p}
                                        onView={() => navigate('/portfolio/result', { state: { ...p } })}
                                        onDelete={() => handleDelete(p.id, 'direct')} />
                        ))}
                        <div className={styles.addCard} onClick={() => navigate('/portfolio/direct')}>
                            <div className={styles.addIconWrap}><span className={styles.addPlus}>+</span></div>
                            <span className={styles.addLabel}>직접 포트폴리오 구성하기</span>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default PortfolioMain;