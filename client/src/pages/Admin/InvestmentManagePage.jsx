import React, {useState} from 'react';
import styles from './InvestmentManagePage.module.css'; // 💡 모듈 CSS 불러오기

// 기존 Mock 데이터 유지
const investmentMembers = [
    {
        id: '1',
        name: '김관리',
        userId: 'admin01',
        stocks: ['삼성전자', 'NAVER', '카카오', '현대차', 'SK하이닉스', 'KB금융'],
        totalAmount: 12400000,
        type: '국내주식 중심'
    },
    {
        id: '2',
        name: '이회원',
        userId: 'user01',
        stocks: ['TIGER 미국S&P500', '애플', '마이크로소프트'],
        totalAmount: 8250000,
        type: 'ETF / 해외주식 중심'
    },
    {
        id: '3',
        name: '박머니',
        userId: 'money123',
        stocks: ['삼성전자', 'KB금융', '신한지주', '현대차', '기아'],
        totalAmount: 6700000,
        type: '배당주 중심'
    },
    {
        id: '4',
        name: '최투자',
        userId: 'invest88',
        stocks: ['테슬라', '엔비디아', '애플', '구글', 'QQQ', '마이크로소프트', '아마존'],
        totalAmount: 15900000,
        type: '성장주 중심'
    },
    {
        id: '5',
        name: '정ETF',
        userId: 'etf100',
        stocks: ['KODEX 200', 'TIGER 미국나스닥100', 'ACE 미국배당다우존스'],
        totalAmount: 4800000,
        type: 'ETF 중심'
    },
    {
        id: '6',
        name: '한주식',
        userId: 'stock77',
        stocks: ['포스코홀딩스', 'LG화학', '삼성SDI', '셀트리온'],
        totalAmount: 9300000,
        type: '국내 성장주 중심'
    },
];

const statistics = [
    {ageGroup: '20대', stock: 'ETF', value: 42},
    {ageGroup: '30대', stock: '해외주식', value: 58},
    {ageGroup: '40대', stock: '국내주식', value: 47},
    {ageGroup: '50대', stock: '배당주', value: 39},
    {ageGroup: '60대', stock: '안정형 ETF', value: 31},
];

function InvestmentManagePage() {
    const [activeTab, setActiveTab] = useState('memberInvestment');
    const [searchType, setSearchType] = useState('all');
    const [searchInput, setSearchInput] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedStockMember, setSelectedStockMember] = useState(null);

    const filteredMembers = investmentMembers.filter((member) => {
        if (!searchKeyword) return true;

        const name = member.name.toLowerCase();
        const userId = member.userId.toLowerCase();
        const type = member.type.toLowerCase();
        const stocks = member.stocks.map((stock) => stock.toLowerCase());

        if (searchType === 'name') return name.includes(searchKeyword);
        if (searchType === 'userId') return userId.includes(searchKeyword);
        if (searchType === 'stock') return stocks.some((stock) => stock.includes(searchKeyword));
        if (searchType === 'type') return type.includes(searchKeyword);

        return (
            name.includes(searchKeyword) ||
            userId.includes(searchKeyword) ||
            type.includes(searchKeyword) ||
            stocks.some((stock) => stock.includes(searchKeyword))
        );
    });

    const totalInvestmentAmount = investmentMembers.reduce((sum, member) => sum + member.totalAmount, 0);
    const totalStockCount = investmentMembers.reduce((sum, member) => sum + member.stocks.length, 0);

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setSearchKeyword(searchInput.trim().toLowerCase());
    };

    const openStockModal = (member) => setSelectedStockMember(member);
    const closeStockModal = () => setSelectedStockMember(null);
    const formatWon = (amount) => amount.toLocaleString('ko-KR');

    return (
        <main className={styles.container}>
            {/* 상단 헤더 영역 */}
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>투자 정보 관리</h2>
                    <p className={styles.desc}>회원별 보유 종목, 평가금액, 투자 유형과 통계를 확인합니다.</p>
                </div>
            </div>

            {/* 통계 요약 그리드 */}
            <div className={styles.summaryGrid}>
                <article className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>관리 회원</span>
                    <span className={styles.summaryValue}>{investmentMembers.length}명</span>
                </article>
                <article className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>등록된 총 보유 종목</span>
                    <span className={styles.summaryValue}>{totalStockCount}개</span>
                </article>
                <article className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>총 평가금액 합계</span>
                    <span className={styles.summaryValue}>{formatWon(totalInvestmentAmount)}원</span>
                </article>
            </div>

            {/* 툴바 및 탭 메뉴 */}
            <div className={styles.toolbar}>
                <div className={styles.tabGroup}>
                    <button
                        type="button"
                        className={`${styles.tabBtn} ${activeTab === 'memberInvestment' ? styles.active : ''}`}
                        onClick={() => setActiveTab('memberInvestment')}
                    >
                        회원 투자 정보
                    </button>
                    <button
                        type="button"
                        className={`${styles.tabBtn} ${activeTab === 'statistics' ? styles.active : ''}`}
                        onClick={() => setActiveTab('statistics')}
                    >
                        연령별 통계
                    </button>
                </div>

                {activeTab === 'memberInvestment' && (
                    <form className={styles.searchBox} onSubmit={handleSearchSubmit}>
                        <select className={styles.select} value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}>
                            <option value="all">전체 검색</option>
                            <option value="name">회원 이름</option>
                            <option value="userId">아이디</option>
                            <option value="stock">종목명</option>
                            <option value="type">투자 유형</option>
                        </select>
                        <input
                            type="text"
                            className={styles.input}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="검색어 입력"
                        />
                        <button type="submit" className={styles.primaryBtn}>검색</button>
                    </form>
                )}
            </div>

            {/* 탭 1. 회원 투자 정보 */}
            {activeTab === 'memberInvestment' && (
                <>
                    <div className={styles.sectionTitle}>
                        <h3>회원별 투자 현황</h3>
                        <span>총 {filteredMembers.length}명의 데이터가 조회되었습니다.</span>
                    </div>

                    <div className={styles.cardGrid}>
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => {
                                const visibleStocks = member.stocks.slice(0, 4);
                                const hiddenStockCount = member.stocks.length - visibleStocks.length;

                                return (
                                    <article className={styles.memberCard} key={member.id}>
                                        <div className={styles.memberHeader}>
                                            <div className={styles.memberInfo}>
                                                <strong>{member.name}</strong>
                                                <span>{member.userId}</span>
                                            </div>
                                            <span className={styles.memberType}>{member.type}</span>
                                        </div>

                                        <div className={styles.memberBody}>
                                            <div className={styles.stockBox}>
                                                <h4>담은 주식</h4>
                                                <ul className={styles.stockList}>
                                                    {visibleStocks.map((stock) => (
                                                        <li key={stock}>• {stock}</li>
                                                    ))}
                                                </ul>
                                                {hiddenStockCount > 0 && (
                                                    <button type="button" className={styles.moreBtn}
                                                            onClick={() => openStockModal(member)}>
                                                        + {hiddenStockCount}개 더보기
                                                    </button>
                                                )}
                                            </div>

                                            <div className={styles.totalBox}>
                                                <h4>평가 금액</h4>
                                                <span
                                                    className={styles.totalAmount}>{formatWon(member.totalAmount)}원</span>
                                                <span className={styles.totalCount}>총 {member.stocks.length}개 종목</span>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })
                        ) : (
                            <div style={{
                                gridColumn: '1 / -1',
                                padding: '80px',
                                textAlign: 'center',
                                color: 'var(--color-text-muted)'
                            }}>
                                검색 결과가 없습니다.
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* 탭 2. 통계 화면 */}
            {activeTab === 'statistics' && (
                <div className={styles.statCard}>
                    <div className={styles.sectionTitle} style={{justifyContent: 'center'}}>
                        <h3>연령대별 평균 투자 성향</h3>
                    </div>
                    <p className={styles.desc}>연령대별로 선호하는 투자 상품과 비중을 확인합니다.</p>

                    <div className={styles.chartWrap}>
                        <svg viewBox="0 0 600 300" role="img" aria-label="연령대별 투자 통계 그래프"
                             style={{width: '100%', height: '320px'}}>
                            <polyline
                                points="60,220 180,150 300,175 420,195 540,230"
                                fill="none"
                                stroke="var(--color-primary)" /* 💡 글로벌 CSS 변수 직접 적용 */
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            {statistics.map((item, index) => {
                                const points = [{x: 60, y: 220}, {x: 180, y: 150}, {x: 300, y: 175}, {
                                    x: 420,
                                    y: 195
                                }, {x: 540, y: 230}];
                                return (
                                    <g key={item.ageGroup}>
                                        <circle cx={points[index].x} cy={points[index].y} r="8"
                                                fill="var(--color-primary)"/>
                                        <text x={points[index].x} y="270" textAnchor="middle" fontSize="16"
                                              fontWeight="700" fill="var(--color-text-main)">
                                            {item.ageGroup}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>

                    <div className={styles.statGrid}>
                        {statistics.map((item) => (
                            <div className={styles.statItem} key={item.ageGroup}>
                                <span className={styles.statAge}>{item.ageGroup}</span>
                                <span className={styles.statType}>{item.stock}</span>
                                <span className={styles.statPct}>{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 보유 주식 전체 보기 모달 */}
            {selectedStockMember && (
                <div className={styles.modalOverlay} onClick={closeStockModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>

                        <div className={styles.modalHeader}>
                            <h2>{selectedStockMember.name}님의<br/>보유 주식 전체 목록</h2>
                            <button type="button" className={styles.modalCloseBtn} onClick={closeStockModal}>✕</button>
                        </div>

                        <div className={styles.modalInfo}>
                            <span>아이디: {selectedStockMember.userId} | 투자유형: {selectedStockMember.type}</span>
                            <strong>총 평가금액 {formatWon(selectedStockMember.totalAmount)}원</strong>
                        </div>

                        <ul className={styles.modalStockList}>
                            {selectedStockMember.stocks.map((stock, index) => (
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