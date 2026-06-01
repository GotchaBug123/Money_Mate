import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './InquiryList.css';

function InquiryList() {
    const navigate = useNavigate();

    // 💡 백엔드 연동 전 임시 테스트용 데이터
    const [inquiries] = useState([
        {id: 2, type: '서비스 이용 문의', title: '포트폴리오 비중 조정은 어떻게 하나요?', date: '2026-05-25', status: '답변완료'},
        {id: 1, type: '오류 신고', title: '재무 진단 페이지 접속 시 에러가 납니다.', date: '2026-05-24', status: '답변대기'}
    ]);

    // 문의 현황 카운트 계산
    const totalCount = inquiries.length;
    const pendingCount = inquiries.filter(item => item.status === '답변대기').length;
    const completedCount = inquiries.filter(item => item.status === '답변완료').length;

    return (
        <div className="container inquiry-list-wrapper">
            <div className="inquiry-list-container">

                <h2 className="inquiry-list-title">나의 문의 내역</h2>

                {/* 상단: 나의 문의 현황 요약 박스 */}
                <div className="inquiry-summary-box">
                    나의 문의 현황: [전체 {totalCount}] [답변대기 {pendingCount}] [답변완료 {completedCount}]
                </div>

                {/* 중단: 문의 내역 테이블 */}
                <table className="inquiry-table">
                    <thead>
                    <tr>
                        <th className="inquiry-th th-id">번호</th>
                        <th className="inquiry-th th-type">유형</th>
                        <th className="inquiry-th th-title">제목</th>
                        <th className="inquiry-th th-date">날짜</th>
                        <th className="inquiry-th th-status">상태</th>
                    </tr>
                    </thead>
                    <tbody>
                    {inquiries.length > 0 ? (
                        inquiries.map((inquiry) => (
                            <tr key={inquiry.id}>
                                <td className="inquiry-td">{inquiry.id}</td>
                                <td className="inquiry-td">{inquiry.type}</td>
                                <td className="inquiry-td td-title">{inquiry.title}</td>
                                <td className="inquiry-td">{inquiry.date}</td>
                                {/* 💡 조건부 클래스로 상태별 색상 적용 */}
                                <td className={`inquiry-td td-status ${inquiry.status === '답변완료' ? 'status-completed' : 'status-pending'}`}>
                                    {inquiry.status}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="empty-row">
                                문의 내역이 없습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {/* 하단: 페이지네이션 및 새 문의 작성 버튼 */}
                <div className="inquiry-footer">
                    {/* 와이어프레임의 임시 페이지네이션 모양 */}
                    <div className="pagination-mock">
                        &gt; 1 &lt;
                    </div>

                    <button
                        onClick={() => navigate('/inquiry-write')}
                        className="new-inquiry-btn"
                    >
                        새 문의 작성
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InquiryList;