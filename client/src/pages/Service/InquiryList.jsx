import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './InquiryList.module.css';

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
        <div className={styles.pageWrapper}>
            <div className={styles.container}>

                <h2 className={styles.title}>나의 문의 내역</h2>

                {/* 상단: 나의 문의 현황 요약 카드 (모던 스타일 적용) */}
                <div className={styles.summaryCard}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>전체 문의</span>
                        <span className={styles.statValue}>{totalCount}건</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>답변 대기</span>
                        <span className={`${styles.statValue} ${styles.textWarning}`}>{pendingCount}건</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>답변 완료</span>
                        <span className={`${styles.statValue} ${styles.textSuccess}`}>{completedCount}건</span>
                    </div>
                </div>

                {/* 중단: 문의 내역 테이블 */}
                <div className={styles.tableCard}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th className={`${styles.th} ${styles.colId}`}>번호</th>
                            <th className={`${styles.th} ${styles.colType}`}>유형</th>
                            <th className={`${styles.th} ${styles.colTitle}`}>제목</th>
                            <th className={`${styles.th} ${styles.colDate}`}>날짜</th>
                            <th className={`${styles.th} ${styles.colStatus}`}>상태</th>
                        </tr>
                        </thead>
                        <tbody>
                        {inquiries.length > 0 ? (
                            inquiries.map((inquiry) => (
                                <tr key={inquiry.id}>
                                    <td className={styles.td}>{inquiry.id}</td>
                                    <td className={styles.td}>{inquiry.type}</td>
                                    <td className={`${styles.td} ${styles.tdTitle}`}>{inquiry.title}</td>
                                    <td className={styles.td}>{inquiry.date}</td>
                                    <td className={styles.td}>
                                        {/* 💡 조건부 클래스로 상태별 배지(Badge) 적용 */}
                                        <span
                                            className={`${styles.statusBadge} ${inquiry.status === '답변완료' ? styles.statusCompleted : styles.statusPending}`}>
                                                {inquiry.status}
                                            </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className={`${styles.td} ${styles.emptyRow}`}>
                                    문의 내역이 없습니다.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* 하단: 페이지네이션 및 새 문의 작성 버튼 */}
                <div className={styles.footer}>
                    <button className={styles.pagination}>
                        &lt; 1 &gt;
                    </button>

                    <button
                        onClick={() => navigate('/inquiry-write')}
                        className={styles.writeBtn}
                    >
                        새 문의 작성
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InquiryList;