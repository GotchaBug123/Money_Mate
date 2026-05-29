import React, {useState} from 'react';

import './investmentManage.css';

const investmentMembers = [
    {
        id: '1',
        name: '김관리',
        userId: 'admin01',
        stocks: ['삼성전자', 'NAVER', '카카오', '현대차', 'SK하이닉스', 'KB금융'],
        totalAmount: 12400000,
        type: '국내주식 중심',
    },
    {
        id: '2',
        name: '이회원',
        userId: 'user01',
        stocks: ['TIGER 미국S&P500', '애플', '마이크로소프트'],
        totalAmount: 8250000,
        type: 'ETF / 해외주식 중심',
    },
    {
        id: '3',
        name: '박머니',
        userId: 'money123',
        stocks: ['삼성전자', 'KB금융', '신한지주', '현대차', '기아'],
        totalAmount: 6700000,
        type: '배당주 중심',
    },
    {
        id: '4',
        name: '최투자',
        userId: 'invest88',
        stocks: ['테슬라', '엔비디아', '애플', '구글', 'QQQ', '마이크로소프트', '아마존'],
        totalAmount: 15900000,
        type: '성장주 중심',
    },
    {
        id: '5',
        name: '정ETF',
        userId: 'etf100',
        stocks: ['KODEX 200', 'TIGER 미국나스닥100', 'ACE 미국배당다우존스'],
        totalAmount: 4800000,
        type: 'ETF 중심',
    },
    {
        id: '6',
        name: '한주식',
        userId: 'stock77',
        stocks: ['포스코홀딩스', 'LG화학', '삼성SDI', '셀트리온'],
        totalAmount: 9300000,
        type: '국내 성장주 중심',
    },
];

const statistics = [
    {
        ageGroup: '20대',
        stock: 'ETF',
        value: 42,
    },
    {
        ageGroup: '30대',
        stock: '해외주식',
        value: 58,
    },
    {
        ageGroup: '40대',
        stock: '국내주식',
        value: 47,
    },
    {
        ageGroup: '50대',
        stock: '배당주',
        value: 39,
    },
    {
        ageGroup: '60대',
        stock: '안정형 ETF',
        value: 31,
    },
];

function InvestmentManagePage() {
    const [activeTab, setActiveTab] = useState('memberInvestment');
    const [searchType, setSearchType] = useState('all');
    const [searchInput, setSearchInput] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedStockMember, setSelectedStockMember] = useState(null);

    const filteredMembers = investmentMembers.filter((member) => {
        if (!searchKeyword) {
            return true;
        }

        const name = member.name.toLowerCase();
        const userId = member.userId.toLowerCase();
        const type = member.type.toLowerCase();
        const stocks = member.stocks.map((stock) => stock.toLowerCase());

        if (searchType === 'name') {
            return name.includes(searchKeyword);
        }

        if (searchType === 'userId') {
            return userId.includes(searchKeyword);
        }

        if (searchType === 'stock') {
            return stocks.some((stock) => stock.includes(searchKeyword));
        }

        if (searchType === 'type') {
            return type.includes(searchKeyword);
        }

        return (
            name.includes(searchKeyword) ||
            userId.includes(searchKeyword) ||
            type.includes(searchKeyword) ||
            stocks.some((stock) => stock.includes(searchKeyword))
        );
    });

    const totalInvestmentAmount = investmentMembers.reduce(
        (sum, member) => sum + member.totalAmount,
        0
    );

    const totalStockCount = investmentMembers.reduce(
        (sum, member) => sum + member.stocks.length,
        0
    );

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setSearchKeyword(searchInput.trim().toLowerCase());
    };

    const openStockModal = (member) => {
        setSelectedStockMember(member);
    };

    const closeStockModal = () => {
        setSelectedStockMember(null);
    };

    const formatWon = (amount) => {
        return amount.toLocaleString('ko-KR');
    };

    return (
        <main className="admin-content-main investment-content-main">
            <section className="investment-manage-page">
                <div className="investment-page-header">
                    <div>
                        <span className="admin-section-label">Investment</span>
                        <h2>투자정보관리</h2>
                        <p>회원별 보유 종목, 평가금액, 투자 유형과 통계를 확인합니다.</p>
                    </div>

                    <div className="investment-summary-grid">
                        <article>
                            <span>관리 회원</span>
                            <strong>{investmentMembers.length}</strong>
                        </article>

                        <article>
                            <span>보유 종목</span>
                            <strong>{totalStockCount}</strong>
                        </article>

                        <article>
                            <span>총 평가금액</span>
                            <strong>{formatWon(totalInvestmentAmount)}원</strong>
                        </article>
                    </div>
                </div>

                <div className="investment-tab-toolbar">
                    <div className="investment-tab-buttons">
                        <button
                            type="button"
                            className={activeTab === 'memberInvestment' ? 'active' : ''}
                            onClick={() => setActiveTab('memberInvestment')}
                        >
                            회원투자정보
                        </button>

                        <button
                            type="button"
                            className={activeTab === 'statistics' ? 'active' : ''}
                            onClick={() => setActiveTab('statistics')}
                        >
                            통계
                        </button>
                    </div>

                    <form className="investment-search-box" onSubmit={handleSearchSubmit}>
                        <select
                            className="investment-search-select"
                            value={searchType}
                            onChange={(event) => setSearchType(event.target.value)}
                        >
                            <option value="all">전체</option>
                            <option value="name">회원 이름</option>
                            <option value="userId">아이디</option>
                            <option value="stock">종목명</option>
                            <option value="type">투자유형</option>
                        </select>

                        <input
                            type="text"
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            placeholder="검색어 입력"
                        />

                        <button type="submit">검색</button>
                    </form>
                </div>

                <section className="investment-content">
                    {activeTab === 'memberInvestment' && (
                        <>
                            <div className="investment-section-title">
                                <div>
                                    <h3>회원별 투자 현황</h3>
                                    <span>총 {filteredMembers.length}명의 투자정보가 조회되었습니다.</span>
                                </div>
                            </div>

                            <section className="investment-card-grid">
                                {filteredMembers.length > 0 ? (
                                    filteredMembers.map((member) => {
                                        const visibleStocks = member.stocks.slice(0, 5);
                                        const hiddenStockCount = member.stocks.length - visibleStocks.length;

                                        return (
                                            <article className="investment-member-card" key={member.id}>
                                                <div className="investment-member-top">
                                                    <div>
                                                        <strong>{member.name}</strong>
                                                        <span>{member.userId}</span>
                                                    </div>

                                                    <em>{member.type}</em>
                                                </div>

                                                <div className="investment-card-inner">
                                                    <div className="member-stock-box">
                                                        <h3>담은 주식</h3>

                                                        <ul>
                                                            {visibleStocks.map((stock) => (
                                                                <li key={stock}>{stock}</li>
                                                            ))}
                                                        </ul>

                                                        {hiddenStockCount > 0 && (
                                                            <button
                                                                type="button"
                                                                className="more-stock-button"
                                                                onClick={() => openStockModal(member)}
                                                            >
                                                                외 {hiddenStockCount}개 더 있음
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="member-total-box">
                                                        <h3>평가금액</h3>
                                                        <strong>{formatWon(member.totalAmount)}원</strong>
                                                        <span>보유 종목 {member.stocks.length}개</span>
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })
                                ) : (
                                    <div className="empty-investment-list">
                                        검색 결과가 없습니다.
                                    </div>
                                )}
                            </section>
                        </>
                    )}

                    {activeTab === 'statistics' && (
                        <section className="investment-statistics-page">
                            <div className="statistics-chart-box">
                                <div className="statistics-title">
                                    <span className="admin-section-label">Statistics</span>
                                    <h2>연령대별 평균 투자 성향</h2>
                                    <p>연령대별로 선호하는 투자 상품과 비중을 확인합니다.</p>
                                </div>

                                <div className="line-chart-area">
                                    <svg viewBox="0 0 600 300" role="img" aria-label="연령대별 투자 통계 그래프">
                                        <polyline
                                            points="60,220 180,150 300,175 420,195 540,230"
                                            fill="none"
                                            stroke="#5728f5"
                                            strokeWidth="5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />

                                        {statistics.map((item, index) => {
                                            const points = [
                                                {x: 60, y: 220},
                                                {x: 180, y: 150},
                                                {x: 300, y: 175},
                                                {x: 420, y: 195},
                                                {x: 540, y: 230},
                                            ];

                                            return (
                                                <g key={item.ageGroup}>
                                                    <circle
                                                        cx={points[index].x}
                                                        cy={points[index].y}
                                                        r="8"
                                                        fill="#5728f5"
                                                    />
                                                    <text
                                                        x={points[index].x}
                                                        y="270"
                                                        textAnchor="middle"
                                                        fontSize="16"
                                                        fontWeight="700"
                                                    >
                                                        {item.ageGroup}
                                                    </text>
                                                </g>
                                            );
                                        })}
                                    </svg>
                                </div>

                                <div className="statistics-summary-list">
                                    {statistics.map((item) => (
                                        <article key={item.ageGroup}>
                                            <strong>{item.ageGroup}</strong>
                                            <span>{item.stock}</span>
                                            <b>{item.value}%</b>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </section>
            </section>

            {selectedStockMember && (
                <div className="investment-modal-backdrop">
                    <section className="investment-stock-modal">
                        <div className="investment-modal-header">
                            <h2>{selectedStockMember.name}님의 보유 주식 전체 목록</h2>

                            <button type="button" onClick={closeStockModal}>
                                ×
                            </button>
                        </div>

                        <div className="investment-modal-user-info">
                            <span>아이디: {selectedStockMember.userId}</span>
                            <span>투자유형: {selectedStockMember.type}</span>
                            <strong>총 평가금액 {formatWon(selectedStockMember.totalAmount)}원</strong>
                        </div>

                        <ul className="investment-modal-stock-list">
                            {selectedStockMember.stocks.map((stock, index) => (
                                <li key={stock}>
                                    <span>{index + 1}</span>
                                    <strong>{stock}</strong>
                                </li>
                            ))}
                        </ul>

                        <div className="investment-modal-buttons">
                            <button type="button" onClick={closeStockModal}>
                                닫기
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
}

export default InvestmentManagePage;