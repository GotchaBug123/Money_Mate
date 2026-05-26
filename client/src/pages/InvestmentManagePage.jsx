import React, { useState } from 'react';
import '../styles/investmentManage.css';


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
    const [searchInput, setSearchInput] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [openedStockMemberId, setOpenedStockMemberId] = useState(null);

    const filteredMembers = investmentMembers.filter((member) => {
        if (!searchKeyword) {
            return true;
        }

        return (
            member.name.toLowerCase().includes(searchKeyword) ||
            member.userId.toLowerCase().includes(searchKeyword) ||
            member.type.toLowerCase().includes(searchKeyword) ||
            member.stocks.some((stock) => stock.toLowerCase().includes(searchKeyword))
        );
    });

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setSearchKeyword(searchInput.trim().toLowerCase());
    };

    const handleOpenStockList = (memberId) => {
        setOpenedStockMemberId((prevId) => (prevId === memberId ? null : memberId));
    };

    const formatWon = (amount) => {
        return amount.toLocaleString('ko-KR');
    };

    return (
        <main className="admin-content-main investment-content-main">
            <section className="investment-manage-page">
                <div className="admin-page-label">투자정보관리 화면</div>

                <div className="investment-layout">
                    <aside className="investment-side-filter">
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
                    </aside>

                    <section className="investment-content">
                        <form className="investment-search-box" onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(event) => setSearchInput(event.target.value)}
                                placeholder="회원 이름 / 아이디 / 종목 검색"
                            />

                            <button type="submit">검색</button>
                        </form>

                        {activeTab === 'memberInvestment' && (
                            <section className="investment-card-grid">
                                {filteredMembers.length > 0 ? (
                                    filteredMembers.map((member) => {
                                        const visibleStocks = member.stocks.slice(0, 5);
                                        const hiddenStockCount = member.stocks.length - visibleStocks.length;
                                        const isStockListOpen = openedStockMemberId === member.id;

                                        return (
                                            <article className="investment-member-card" key={member.id}>
                                                <div className="investment-member-name">
                                                    {member.name}
                                                </div>

                                                <div className="investment-card-inner">
                                                    <div className="member-stock-box">
                                                        <h3>담은 주식(5개)</h3>

                                                        <ul>
                                                            {visibleStocks.map((stock) => (
                                                                <li key={stock}>{stock}</li>
                                                            ))}
                                                        </ul>

                                                        {hiddenStockCount > 0 && (
                                                            <button
                                                                type="button"
                                                                className="more-stock-button"
                                                                onClick={() => handleOpenStockList(member.id)}
                                                            >
                                                                외 {hiddenStockCount}개 더 있음
                                                            </button>
                                                        )}

                                                        {isStockListOpen && (
                                                            <div className="all-stock-list">
                                                                <strong>전체 담은 주식</strong>

                                                                <ul>
                                                                    {member.stocks.map((stock) => (
                                                                        <li key={stock}>{stock}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="member-total-box">
                                                        <h3>전체 통계</h3>
                                                        <strong>{formatWon(member.totalAmount)}원</strong>
                                                        <span>{member.type}</span>
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
                        )}

                        {activeTab === 'statistics' && (
                            <section className="investment-statistics-page">
                                <div className="statistics-chart-box">
                                    <h2>연령대별 평균 투자 성향</h2>

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
                                                    { x: 60, y: 220 },
                                                    { x: 180, y: 150 },
                                                    { x: 300, y: 175 },
                                                    { x: 420, y: 195 },
                                                    { x: 540, y: 230 },
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
                </div>
            </section>
        </main>
    );
}

export default InvestmentManagePage;