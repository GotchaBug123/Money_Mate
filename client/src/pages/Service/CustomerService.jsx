import React from 'react';
import {useNavigate} from 'react-router-dom';
import './CustomerService.css';

function CustomerService() {
    const navigate = useNavigate();

    return (
        <div className="container cs-wrapper">
            <div className="cs-container">

                {/* 1. 공지사항 (전체 너비) */}
                <div
                    className="cs-card notice"
                    onClick={() => alert('공지사항 페이지로 이동합니다.')}
                >
                    공지사항
                </div>

                {/* 2. 자주하는 질문 (전체 너비, 약간 더 높게) */}
                <div
                    className="cs-card faq"
                    onClick={() => alert('FAQ 페이지로 이동합니다.')}
                >
                    자주하는 질문(FAQ) 8개
                </div>

                {/* 3. 반반 분할 영역 (주식 준비 & 고객의 소리) */}
                <div className="cs-split-row">
                    <div
                        className="cs-card split"
                        onClick={() => alert('주식 준비 가이드로 이동합니다.')}
                    >
                        주식 준비 step 5단계
                    </div>
                    <div
                        className="cs-card split"
                        onClick={() => alert('고객의 소리 페이지로 이동합니다.')}
                    >
                        고객의 소리
                    </div>
                </div>

                {/* 4. 하단 버튼 영역 (내 문의내역 & 문의하기 버튼 나란히 배치) */}
                <div className="cs-button-group">
                    <button
                        onClick={() => navigate('/inquiry-list')}
                        className="cs-btn history"
                    >
                        내 문의내역
                    </button>
                    <button
                        onClick={() => navigate('/inquiry-write')}
                        className="cs-btn write"
                    >
                        문의하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CustomerService;