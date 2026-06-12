import React, {useState, useEffect} from 'react';
import styles from './InvestmentManagePage.module.css';
import {
    getAdminInvestmentSummaryApi,
    getAdminInvestmentMembersApi,
    getAdminAgeGroupStatsApi
} from '../../api/adminApi.js';

function InvestmentManagePage() {
    const [activeTab, setActiveTab] = useState('memberInvestment');
    const [members, setMembers] = useState([]);
    const [summary, setSummary] = useState({memberCount: 0, holdingCount: 0, totalEvaluation: 0});
    const [ageStats, setAgeStats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedStockMember, setSelectedStockMember] = useState(null);

    useEffect(() => {
        if (activeTab !== 'memberInvestment') return;
        const load = async () => {
            setLoading(true);
            try {
                const [sum, list] = await Promise.all([
                    getAdminInvestmentSummaryApi(),
                    getAdminInvestmentMembersApi({keyword: searchKeyword || undefined}),
                ]);
                setSummary(sum);
                setMembers(Array.isArray(list) ? list : []);
            } catch (error) {
                console.error('투자 정보 조회 실패:', error);
                alert('투자 정보를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [activeTab]);

    useEffect(() => {
        if (activeTab !== 'statistics') return;
        const load = async () => {
            try {
                const data = await getAdminAgeGroupStatsApi();
                setAgeStats(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('통계 조회 실패:', error);
            }
        };
        load();
    }, [activeTab]);

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        const kw = searchInput.trim();
        setSearchKeyword(kw);
        setLoading(true);
        try {
            const list = await getAdminInvestmentMembersApi({keyword: kw || undefined});
            setMembers(Array.isArray(list) ? list : []);
        } catch (error) {
            console.error('투자 검색 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredMembers = members;
    const formatWon = (amount) => Number(amount ?? 0).toLocaleString('ko-KR');

    const openStockModal = (member) => setSelectedStockMember(member);
    const closeStockModal = () => setSelectedStockMember(null);

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>투자 정보 관리</h2>
                    <p className={styles.desc}>회원별 보유 종목, 평가금액, 투자 유형과 통계를 확인합니다.</p>
                </div>
            </div>

            <div className={styles.summaryGrid}>
                <article className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>관리 회원</span>
                    <span className={styles.summaryValue}>{summary.memberCount ?? members.length}명</span>
                </article>
                <article className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>등록된 총 보유 종목</span>
                    <span className={styles.summaryValue}>{summary.holdingCount ?? 0}개</span>
                </article>
                <article className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>총 평가금액 합계</span>
                    <span className={styles.summaryValue}>{formatWon(summary.totalEvaluation)}원</span>
                </article>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.tabGroup}>
                    <button type="button"
                            className={`${styles.tabBtn} ${activeTab === 'memberInvestment' ? styles.active : ''}`}
                            onClick={() => setActiveTab('memberInvestment')}>
                        회원 투자 정보
                    </button>
                    <button type="button"
                            className={`${styles.tabBtn} ${activeTab === 'statistics' ? styles.active : ''}`}
                            onClick={() => setActiveTab('statistics')}>
                        연령별 통계
                    </button>
                </div>
                {activeTab === 'memberInvestment' && (
                    <form className={styles.searchBox} onSubmit={handleSearchSubmit}>
                        <input type="text" className={styles.input} value={searchInput}
                               onChange={(e) => setSearchInput(e.target.value)} placeholder="이름 또는 아이디 검색"/>
                        <button type="submit" className={styles.primaryBtn}>검색</button>
                    </form>
                )}
            </div>

            {activeTab === 'memberInvestment' && (
                <>
                    <div className={styles.sectionTitle}>
                        <h3>회원별 투자 현황</h3>
                        <span>총 {filteredMembers.length}명의 데이터가 조회되었습니다.</span>
                    </div>
                    {loading ? (
                        <div style={{padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)'}}>불러오는
                            중...</div>
                    ) : (
                        <div className={styles.cardGrid}>
                            {filteredMembers.length > 0 ? filteredMembers.map((member) => {
                                const visibleStocks = member.holdingNames ?? [];
                                const hiddenCount = member.remainCount ?? 0;
                                return (
                                    <article className={styles.memberCard} key={member.memberId}>
                                        <div className={styles.memberHeader}>
                                            <div className={styles.memberInfo}>
                                                <strong>{member.name}</strong>
                                                <span>{member.loginId}</span>
                                            </div>
                                            <span className={styles.memberType}>{member.riskTypeName ?? '-'}</span>
                                        </div>
                                        <div className={styles.memberBody}>
                                            <div className={styles.stockBox}>
                                                <h4>담은 주식</h4>
                                                <ul className={styles.stockList}>
                                                    {visibleStocks.map((stock) => (
                                                        <li key={stock}>• {stock}</li>
                                                    ))}
                                                </ul>
                                                {hiddenCount > 0 && (
                                                    <button type="button" className={styles.moreBtn}
                                                            onClick={() => openStockModal(member)}>
                                                        + {hiddenCount}개 더보기
                                                    </button>
                                                )}
                                            </div>
                                            <div className={styles.totalBox}>
                                                <h4>평가 금액</h4>
                                                <span
                                                    className={styles.totalAmount}>{formatWon(member.totalEvaluation)}원</span>
                                                <span
                                                    className={styles.totalCount}>총 {member.holdingCount ?? 0}개 종목</span>
                                            </div>
                                        </div>
                                    </article>
                                );
                            }) : (
                                <div style={{
                                    gridColumn: '1/-1',
                                    padding: '80px',
                                    textAlign: 'center',
                                    color: 'var(--color-text-muted)'
                                }}>
                                    검색 결과가 없습니다.
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {activeTab === 'statistics' && (
                <div className={styles.statCard}>
                    <div className={styles.sectionTitle} style={{justifyContent: 'center'}}>
                        <h3>연령대별 평균 투자 성향</h3>
                    </div>
                    <p className={styles.desc}>연령대별로 선호하는 투자 상품과 비중을 확인합니다.</p>
                    <div className={styles.statGrid}>
                        {ageStats.map((item) => (
                            <div className={styles.statItem} key={item.ageGroup}>
                                <span className={styles.statAge}>{item.ageGroup}</span>
                                <span className={styles.statType}>{item.topRiskType ?? item.stock ?? '-'}</span>
                                <span className={styles.statPct}>{item.ratio ?? item.value ?? 0}%</span>
                            </div>
                        ))}
                        {ageStats.length === 0 && (
                            <div style={{gridColumn: '1/-1', textAlign: 'center', color: 'var(--color-text-muted)'}}>
                                통계 데이터가 없습니다.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selectedStockMember && (
                <div className={styles.modalOverlay} onClick={closeStockModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{selectedStockMember.name}님의<br/>보유 주식 전체 목록</h2>
                            <button type="button" className={styles.modalCloseBtn} onClick={closeStockModal}>✕</button>
                        </div>
                        <div className={styles.modalInfo}>
                            <span>아이디: {selectedStockMember.loginId} | 투자유형: {selectedStockMember.riskTypeName ?? '-'}</span>
                            <strong>총 평가금액 {formatWon(selectedStockMember.totalEvaluation)}원</strong>
                        </div>
                        <ul className={styles.modalStockList}>
                            {(selectedStockMember.holdingNames ?? []).map((stock, index) => (
                                <li key={stock}>
                                    <span className={styles.stockIndex}>{index + 1}</span>
                                    <span className={styles.stockName}>{stock}</span>
                                </li>
                            ))}
                        </ul>
                        <div style={{display: 'flex', justifyContent: 'center', marginTop: '24px'}}>
                            <button type="button" className={styles.primaryBtn} onClick={closeStockModal}
                                    style={{width: '100%'}}>
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default InvestmentManagePage;
