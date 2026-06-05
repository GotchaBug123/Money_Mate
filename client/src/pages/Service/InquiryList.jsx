import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './InquiryList.module.css';

function InquiryList() {
    const navigate = useNavigate();

    const [inquiries] = useState([
        {
            id: 2,
            type: '서비스 이용 문의',
            title: '포트폴리오 비중 조정은 어떻게 하나요?',
            date: '2026-05-25',
            status: '답변완료'
        },
        {
            id: 1,
            type: '오류 신고',
            title: '재무 진단 페이지 접속 시 에러가 납니다.',
            date: '2026-05-24',
            status: '답변대기'
        }
    ]);

    const totalCount = inquiries.length;
    const pendingCount = inquiries.filter((item) => item.status === '답변대기').length;
    const completedCount = inquiries.filter((item) => item.status === '답변완료').length;

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <section className={styles.heroSection}>
                    <h1 className={styles.title}>나의 문의 내역</h1>
                    <p className={styles.subtitle}>
                        내가 남긴 문의와 답변 상태를 한눈에 확인할 수 있습니다.
                    </p>

                    <div className={styles.heroButtons}>
                        <button
                            type="button"
                            onClick={() => navigate('/customer-service')}
                        >
                            고객센터 홈
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/inquiry-write')}
                        >
                            새 문의 작성
                        </button>
                    </div>
                </section>

                <section className={styles.summaryCard}>
                    <article className={styles.statItem}>
                        <span className={styles.statLabel}>전체 문의</span>
                        <strong className={styles.statValue}>{totalCount}건</strong>
                    </article>

                    <article className={styles.statItem}>
                        <span className={styles.statLabel}>답변 대기</span>
                        <strong className={`${styles.statValue} ${styles.statHighlight}`}>
                            {pendingCount}건
                        </strong>
                    </article>

                    <article className={styles.statItem}>
                        <span className={styles.statLabel}>답변 완료</span>
                        <strong className={styles.statValue}>{completedCount}건</strong>
                    </article>
                </section>

                <section className={styles.listCard}>
                    <div className={styles.listHeader}>
                        <div>
                            <h2 className={styles.listTitle}>문의 목록</h2>
                        </div>

                        <p>문의 제목과 답변 상태를 확인하세요.</p>
                    </div>

                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th className={styles.th}>번호</th>
                                <th className={styles.th}>구분</th>
                                <th className={`${styles.th} ${styles.titleTh}`}>제목</th>
                                <th className={styles.th}>작성일</th>
                                <th className={styles.th}>상태</th>
                            </tr>
                            </thead>

                            <tbody>
                            {inquiries.length > 0 ? (
                                inquiries.map((inquiry, index) => (
                                    <tr key={inquiry.id}>
                                        <td className={styles.td}>
                                            {inquiries.length - index}
                                        </td>

                                        <td className={styles.td}>
                                            <span className={styles.typeBadge}>
                                                {inquiry.type}
                                            </span>
                                        </td>

                                        <td className={`${styles.td} ${styles.tdTitle}`}>
                                            {inquiry.title}
                                        </td>

                                        <td className={styles.td}>
                                            {inquiry.date}
                                        </td>

                                        <td className={styles.td}>
                                            <span
                                                className={`${styles.statusBadge} ${
                                                    inquiry.status === '답변완료'
                                                        ? styles.statusCompleted
                                                        : styles.statusPending
                                                }`}
                                            >
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

                    <div className={styles.footer}>
                        <button type="button" className={styles.pagination}>
                            &lt; 1 &gt;
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/inquiry-write')}
                            className={styles.writeBtn}
                        >
                            새 문의 작성
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default InquiryList;