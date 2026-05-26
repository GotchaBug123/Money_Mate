import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

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

    // 테이블 공통 스타일
    const thStyle = {
        padding: '16px',
        borderBottom: '2px solid var(--border-color)',
        textAlign: 'center',
        fontWeight: 'bold'
    };
    const tdStyle = {
        padding: '16px',
        borderBottom: '1px solid var(--border-color)',
        textAlign: 'center',
        color: 'var(--text-main)'
    };

    return (
        <div className="container" style={{display: 'flex', justifyContent: 'center', padding: '60px 20px'}}>
            <div style={{width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '32px'}}>

                <h2 style={{textAlign: 'center', color: 'var(--text-main)', margin: 0}}>나의 문의 내역</h2>

                {/* 상단: 나의 문의 현황 요약 박스 */}
                <div style={{
                    padding: '20px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px'
                }}>
                    나의 문의 현황: [전체 {totalCount}] [답변대기 {pendingCount}] [답변완료 {completedCount}]
                </div>

                {/* 중단: 문의 내역 테이블 */}
                <table style={{width: '100%', borderCollapse: 'collapse', backgroundColor: 'white'}}>
                    <thead>
                    <tr>
                        <th style={{...thStyle, width: '10%'}}>번호</th>
                        <th style={{...thStyle, width: '20%'}}>유형</th>
                        <th style={{...thStyle, width: '40%', textAlign: 'left'}}>제목</th>
                        <th style={{...thStyle, width: '15%'}}>날짜</th>
                        <th style={{...thStyle, width: '15%'}}>상태</th>
                    </tr>
                    </thead>
                    <tbody>
                    {inquiries.length > 0 ? (
                        inquiries.map((inquiry) => (
                            <tr key={inquiry.id}>
                                <td style={tdStyle}>{inquiry.id}</td>
                                <td style={tdStyle}>{inquiry.type}</td>
                                <td style={{...tdStyle, textAlign: 'left', cursor: 'pointer'}}>{inquiry.title}</td>
                                <td style={tdStyle}>{inquiry.date}</td>
                                <td style={{
                                    ...tdStyle,
                                    color: inquiry.status === '답변완료' ? 'var(--primary-color)' : '#F97316',
                                    fontWeight: '500'
                                }}>
                                    {inquiry.status}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{padding: '40px', textAlign: 'center', color: 'var(--text-muted)'}}>
                                문의 내역이 없습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {/* 하단: 페이지네이션 및 새 문의 작성 버튼 */}
                <div
                    style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px'}}>
                    {/* 와이어프레임의 임시 페이지네이션 모양 */}
                    <div style={{
                        padding: '8px 24px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        backgroundColor: 'white'
                    }}>
                        &gt; 1 &lt;
                    </div>

                    <button
                        onClick={() => navigate('/inquiry-write')}
                        style={{
                            padding: '12px 32px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        새 문의 작성
                    </button>
                </div>

            </div>
        </div>
    );
}

export default InquiryList;