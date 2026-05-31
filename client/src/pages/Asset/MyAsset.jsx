import React from 'react';
import {Link} from 'react-router-dom';
import './MyAsset.css';

function MyAsset() {
    // 💡 백엔드 연동 전 임시로 사용할 하드코딩 데이터
    const mockData = {
        score: 85,
        investableAmount: '5,000,000',
        monthlyIncome: '3,000,000',
        monthlyFixedExpense: '1,000,000',
        monthlyVariableExpense: '800,000',
        debt: '15,000,000',
        cash: '2,000,000'
    };

    return (
        <div className="my-asset-wrapper">
            <div className="my-asset-container">

                {/* 테스트용 페이지 이동 버튼 */}
                <div className="top-nav-wrapper">
                    <Link to="/asset-detail" className="top-nav-link">
                        상세 화면(Asset Detail)으로 이동 &gt;
                    </Link>
                </div>

                <h2 className="page-title">마이 자산 화면</h2>

                {/* 1. 재무 평가 점수 */}
                <div className="common-box score-box">
                    <span>재무 평가 점수</span>
                    <span className="score-value">{mockData.score}점</span>
                </div>

                {/* 2. 그래프 (꺾은선) 영역 */}
                <div className="common-box graph-box">
                    그래프(꺾은선) - 데이터 연동 예정
                </div>

                {/* 3. 필터 버튼 4개 */}
                <div className="filter-group">
                    {['필터1', '필터2', '필터3', '필터4'].map(filter => (
                        <button key={filter} className="filter-btn">
                            {filter}
                        </button>
                    ))}
                </div>

                {/* 4. 재무 요약 정보 (Grid 배치) */}
                <div className="summary-section">

                    {/* 상단: 투자 가능 금액 (중앙) */}
                    <div className="investable-row">
                        <span className="investable-label">투자 가능 금액</span>
                        <span className="investable-value">{mockData.investableAmount}원</span>
                    </div>

                    {/* 하단: 4개 항목 2단 Grid */}
                    <div className="summary-grid">
                        <div className="grid-item">
                            <span className="grid-label">월 수입</span>
                            <span>{mockData.monthlyIncome}원</span>
                        </div>
                        <div className="grid-item">
                            <span className="grid-label">월 고정지출</span>
                            <span>{mockData.monthlyFixedExpense}원</span>
                        </div>
                        <div className="grid-item">
                            <span className="grid-label">월 변동지출</span>
                            <span>{mockData.monthlyVariableExpense}원</span>
                        </div>
                        <div className="grid-item">
                            <span className="grid-label">부채</span>
                            <span>{mockData.debt}원</span>
                        </div>
                        <div className="grid-item">
                            <span className="grid-label">보유 현금</span>
                            <span>{mockData.cash}원</span>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default MyAsset;