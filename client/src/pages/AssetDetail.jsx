import React from 'react';
import {Link} from "react-router-dom";

import {useModal} from '../hooks/useModal'

function AssetDetail() {
    // 모달 표시 여부를 관리하는 상태
    const {isOpen, open, close} = useModal();

    // 💡 백엔드 연동 전 임시로 사용할 하드코딩 데이터
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

    const boxStyle = {
        border: '1px solid var(--border-color)',
        backgroundColor: 'white',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'var(--text-main)',
        fontWeight: 'bold'
    };

    const btnStyle = {
        padding: '8px 24px',
        backgroundColor: '#E5E7EB',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '500'
    };

    return (
        <div className="container" style={{display: 'flex', justifyContent: 'center', padding: '40px 20px'}}>
            <div style={{width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px'}}>

                <div style={{display: 'flex', justifyContent: 'flex-start'}}>
                    <Link to="/asset" style={{
                        padding: '8px 16px',
                        backgroundColor: '#E5E7EB',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        color: 'var(--text-main)',
                        fontSize: '14px'
                    }}>
                        &lt; 요약 화면(My Asset)으로 돌아가기
                    </Link>
                </div>

                {/* 1. 상단 수익률 */}
                <div style={{display: 'flex', gap: '60px', padding: '0 16px'}}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                        <div style={{fontSize: '13px', fontWeight: 'bold'}}>◀ 4월 ▶</div>
                        <div style={{fontSize: '14px', color: 'var(--text-muted)'}}>월 수익률</div>
                        {/* 회색 박스 대신 실제 데이터 적용 */}
                        <div style={{fontSize: '18px', fontWeight: 'bold', color: '#EF4444'}}>
                            {mockData.monthlyReturn}
                        </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '4px'}}>
                        <div style={{fontSize: '14px', color: 'var(--text-muted)'}}>종합 수익률</div>
                        {/* 회색 박스 대신 실제 데이터 적용 */}
                        <div style={{fontSize: '18px', fontWeight: 'bold', color: '#EF4444'}}>
                            {mockData.totalReturn}
                        </div>
                    </div>
                </div>

                {/* 2. 그래프 (히스토그램) 영역 */}
                <div style={{
                    ...boxStyle,
                    height: '250px',
                    backgroundColor: '#D1D5DB',
                    border: 'none',
                    fontSize: '20px',
                    color: 'var(--text-muted)'
                }}>
                    그래프(히스토그램) - 데이터 연동 예정
                </div>

                {/* 3. 종목 리스트 2분할 */}
                <div style={{display: 'flex', gap: '24px'}}>

                    {/* 투자 종목 영역 */}
                    <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '16px'}}>
                        <div style={{
                            ...boxStyle,
                            height: '280px',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            flexDirection: 'column',
                            padding: '20px',
                            gap: '12px'
                        }}>
                            <div style={{fontSize: '16px', marginBottom: '8px'}}>투자 종목</div>
                            {/* 임시 데이터 리스트 출력 */}
                            {mockData.investedStocks.map(stock => (
                                <div key={stock.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    fontSize: '15px',
                                    fontWeight: 'normal'
                                }}>
                                    <span>{stock.name}</span>
                                    <div style={{display: 'flex', gap: '16px'}}>
                                        <span style={{color: 'var(--text-muted)'}}>{stock.quantity}</span>
                                        <span style={{
                                            color: stock.returnRate.includes('-') ? '#3B82F6' : '#EF4444',
                                            fontWeight: 'bold',
                                            width: '50px',
                                            textAlign: 'right'
                                        }}>
                                            {stock.returnRate}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center', gap: '16px'}}>
                            <button onClick={open} style={btnStyle}>주식 사기</button>
                            <button style={btnStyle}>주식 팔기</button>
                        </div>
                    </div>

                    {/* 관심 종목 영역 */}
                    <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '16px'}}>
                        <div style={{
                            ...boxStyle,
                            height: '280px',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            flexDirection: 'column',
                            padding: '20px',
                            gap: '12px'
                        }}>
                            <div style={{fontSize: '16px', marginBottom: '8px'}}>관심 종목</div>
                            {/* 임시 데이터 리스트 출력 */}
                            {mockData.watchList.map(stock => (
                                <div key={stock.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    fontSize: '15px',
                                    fontWeight: 'normal'
                                }}>
                                    <span>{stock.name}</span>
                                    <span>{stock.currentPrice}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <button style={btnStyle}>관심 종목 담기</button>
                        </div>
                    </div>

                </div>
            </div>

            {/* 💡 주식사기화면 모달 (변경사항 없음) */}
            {isOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    zIndex: 9999,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'white', padding: '40px 30px', borderRadius: '4px',
                        width: '380px', position: 'relative', border: '1px solid var(--border-color)'
                    }}>
                        <div style={{
                            position: 'absolute', top: '-12px', left: '16px',
                            backgroundColor: '#E5E7EB', padding: '4px 8px', fontSize: '13px',
                            border: '1px solid var(--border-color)', borderRadius: '2px'
                        }}>
                            주식사기화면
                        </div>

                        <div style={{display: 'flex', flexDirection: 'column', gap: '40px'}}>
                            <button style={{
                                padding: '30px', backgroundColor: '#BDBDBD', border: 'none',
                                fontSize: '24px', color: '#333', cursor: 'pointer'
                            }}>
                                주식 검색
                            </button>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', backgroundColor: '#BDBDBD',
                                    padding: '8px 12px', width: '60px', justifyContent: 'space-between',
                                    border: '1px solid #999'
                                }}>
                                    <span style={{color: 'transparent'}}>0</span>
                                    <span style={{fontSize: '12px', color: 'white'}}>▼</span>
                                </div>
                                <span style={{fontSize: '18px', fontWeight: 'bold'}}>주</span>

                                <button
                                    onClick={close}
                                    style={{
                                        padding: '8px 16px', backgroundColor: '#BDBDBD',
                                        border: '1px solid #999', fontSize: '16px', cursor: 'pointer'
                                    }}
                                >
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