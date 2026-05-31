import React from 'react';
import {Link} from "react-router-dom";
import {useModal} from '../../hooks/useModal';
import './AssetDetail.css';

function AssetDetail() {
    // 모달 표시 여부를 관리하는 상태
    const {isOpen, open, close} = useModal();

    // 백엔드 연동 전 임시로 사용할 하드코딩 데이터
    const mockData = {
        monthlyReturn: '+5.2%',
        totalReturn: '+12.8%',
        investedStocks: [
            {id: 1, name: '삼성전자', quantity: '50주', returnRate: '+2.1%'},
            {id: 2, name: '애플', quantity: '10주', returnRate: '+8.5%'},
            {id: 3, name: '현대차', quantity: '15주', returnRate: '-1.2%'}
        ],
        watchList: [
            {id: 1, name: '테슬라', currentPrice: '250,000원'},
            {id: 2, name: '엔비디아', currentPrice: '1,200,000원'}
        ]
    };

    return (
        <div className="asset-detail-wrapper">
            <div className="asset-detail-container">

                <div className="back-link-wrapper">
                    <Link to="/asset" className="back-link">
                        &lt; 요약 화면(My Asset)으로 돌아가기
                    </Link>
                </div>

                {/* 1. 상단 수익률 */}
                <div className="return-section">
                    <div className="return-item">
                        <div className="return-month">◀ 4월 ▶</div>
                        <div className="return-label">월 수익률</div>
                        <div className="return-value">{mockData.monthlyReturn}</div>
                    </div>
                    <div className="return-item end">
                        <div className="return-label">종합 수익률</div>
                        <div className="return-value">{mockData.totalReturn}</div>
                    </div>
                </div>

                {/* 2. 그래프 (히스토그램) 영역 */}
                <div className="common-box graph-placeholder">
                    그래프(히스토그램) - 데이터 연동 예정
                </div>

                {/* 3. 종목 리스트 2분할 */}
                <div className="list-section">

                    {/* 투자 종목 영역 */}
                    <div className="list-column">
                        <div className="common-box list-box">
                            <div className="list-title">투자 종목</div>

                            {mockData.investedStocks.map(stock => (
                                <div key={stock.id} className="list-item">
                                    <span>{stock.name}</span>
                                    <div className="list-item-right">
                                        <span className="item-quantity">{stock.quantity}</span>
                                        {/* 💡 수익률 색상 분기 처리를 위해 color만 인라인 스타일 유지 */}
                                        <span
                                            className="item-return"
                                            style={{ color: stock.returnRate.includes('-') ? '#3B82F6' : '#EF4444' }}
                                        >
                                            {stock.returnRate}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="btn-group">
                            <button onClick={open} className="action-btn">주식 사기</button>
                            <button className="action-btn">주식 팔기</button>
                        </div>
                    </div>

                    {/* 관심 종목 영역 */}
                    <div className="list-column">
                        <div className="common-box list-box">
                            <div className="list-title">관심 종목</div>

                            {mockData.watchList.map(stock => (
                                <div key={stock.id} className="list-item">
                                    <span>{stock.name}</span>
                                    <span>{stock.currentPrice}</span>
                                </div>
                            ))}
                        </div>
                        <div className="btn-group">
                            <button className="action-btn">관심 종목 담기</button>
                        </div>
                    </div>

                </div>
            </div>

            {/* 💡 주식사기화면 모달 (팝업) */}
            {isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">

                        <div className="modal-label">주식사기화면</div>

                        <div className="modal-body">
                            <button className="search-placeholder-btn">주식 검색</button>

                            <div className="modal-bottom-row">
                                <div className="select-placeholder">
                                    <span className="select-value">0</span>
                                    <span className="select-arrow">▼</span>
                                </div>
                                <span className="unit-text">주</span>

                                <button onClick={close} className="modal-close-btn">
                                    닫기
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default AssetDetail;