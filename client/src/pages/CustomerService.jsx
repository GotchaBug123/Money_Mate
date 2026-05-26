import React from 'react';
import {useNavigate} from 'react-router-dom';

function CustomerService() {
    const navigate = useNavigate();

    // 4개의 사각형 영역에 적용될 공통 카드 스타일
    const cardStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid var(--border-color)',
        backgroundColor: 'white',
        borderRadius: '4px',
        fontSize: '18px',
        color: 'var(--text-main)',
        cursor: 'pointer'
    };

    return (
        <div className="container" style={{display: 'flex', justifyContent: 'center', padding: '60px 20px'}}>
            <div style={{width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px'}}>

                {/* 1. 공지사항 (전체 너비) */}
                <div
                    style={{...cardStyle, height: '100px'}}
                    onClick={() => alert('공지사항 페이지로 이동합니다.')}
                >
                    공지사항
                </div>

                {/* 2. 자주하는 질문 (전체 너비, 약간 더 높게) */}
                <div
                    style={{...cardStyle, height: '160px'}}
                    onClick={() => alert('FAQ 페이지로 이동합니다.')}
                >
                    자주하는 질문(FAQ) 8개
                </div>

                {/* 3. 반반 분할 영역 (주식 준비 & 고객의 소리) */}
                <div style={{display: 'flex', gap: '24px'}}>
                    <div
                        style={{...cardStyle, flex: 1, height: '200px'}}
                        onClick={() => alert('주식 준비 가이드로 이동합니다.')}
                    >
                        주식 준비 step 5단계
                    </div>
                    <div
                        style={{...cardStyle, flex: 1, height: '200px'}}
                        onClick={() => alert('고객의 소리 페이지로 이동합니다.')}
                    >
                        고객의 소리
                    </div>
                </div>

                {/* 4. 하단 버튼 영역 (내 문의내역 & 문의하기 버튼 나란히 배치) */}
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '8px'}}>
                    <button
                        onClick={() => navigate('/inquiry-list')}
                        style={{
                            padding: '12px 40px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: '#F3F4F6', // 약간의 시각적 분리를 위해 옅은 회색 배경 적용
                            borderRadius: '4px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        내 문의내역
                    </button>
                    <button
                        onClick={() => navigate('/inquiry-write')}
                        style={{
                            padding: '12px 40px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        문의하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CustomerService;