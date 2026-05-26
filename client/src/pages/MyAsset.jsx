import React from 'react';
import {Link} from 'react-router-dom';

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

    // 공통 레이아웃 스타일
    const boxStyle = {
        border: '1px solid var(--border-color)',
        backgroundColor: 'white',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        color: 'var(--text-main)'
    };

    return (
        <div className="container" style={{display: 'flex', justifyContent: 'center', padding: '40px 20px'}}>
            <div style={{width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px'}}>

                {/* 테스트용 페이지 이동 버튼 */}
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Link to="/asset-detail" style={{
                        padding: '8px 16px',
                        backgroundColor: '#E5E7EB',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        color: 'var(--text-main)',
                        fontSize: '14px'
                    }}>
                        상세 화면(Asset Detail)으로 이동 &gt;
                    </Link>
                </div>

                <h2 style={{textAlign: 'center', margin: 0}}>마이 자산 화면</h2>

                {/* 1. 재무 평가 점수 */}
                <div style={{...boxStyle, height: '80px', fontSize: '18px', flexDirection: 'column', gap: '8px'}}>
                    <span>재무 평가 점수</span>
                    <span style={{fontSize: '24px', color: 'var(--primary-color)'}}>{mockData.score}점</span>
                </div>

                {/* 2. 그래프 (꺾은선) 영역 */}
                <div style={{
                    ...boxStyle,
                    height: '300px',
                    backgroundColor: '#D1D5DB',
                    border: 'none',
                    fontSize: '20px',
                    color: 'var(--text-muted)'
                }}>
                    그래프(꺾은선) - 데이터 연동 예정
                </div>

                {/* 3. 필터 버튼 4개 */}
                <div style={{display: 'flex', gap: '8px'}}>
                    {['필터1', '필터2', '필터3', '필터4'].map(filter => (
                        <button key={filter} style={{
                            padding: '6px 16px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'white',
                            cursor: 'pointer'
                        }}>
                            {filter}
                        </button>
                    ))}
                </div>

                {/* 4. 재무 요약 정보 (Grid 배치) */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '32px',
                    marginTop: '24px',
                    padding: '0 40px'
                }}>

                    {/* 상단: 투자 가능 금액 (중앙) */}
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px'}}>
                        <span style={{fontWeight: 'bold', fontSize: '18px'}}>투자 가능 금액</span>
                        <span style={{fontSize: '20px', fontWeight: 'bold'}}>{mockData.investableAmount}원</span>
                    </div>

                    {/* 하단: 4개 항목 2단 Grid */}
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: '32px', columnGap: '40px'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <span style={{fontWeight: 'bold'}}>월 수입</span>
                            <span>{mockData.monthlyIncome}원</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <span style={{fontWeight: 'bold'}}>월 고정지출</span>
                            <span>{mockData.monthlyFixedExpense}원</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <span style={{fontWeight: 'bold'}}>월 변동지출</span>
                            <span>{mockData.monthlyVariableExpense}원</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <span style={{fontWeight: 'bold'}}>부채</span>
                            <span>{mockData.debt}원</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <span style={{fontWeight: 'bold'}}>보유 현금</span>
                            <span>{mockData.cash}원</span>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default MyAsset;