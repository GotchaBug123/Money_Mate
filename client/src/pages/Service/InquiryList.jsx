import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {getMyInquiryList} from '../../api/customerServiceApi';
import {useInquiryStore} from '../../store/useInquiryStore';
import styles from './InquiryList.module.css';

const extractInquiries = (payload) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (Array.isArray(payload?.inquiries)) {
        return payload.inquiries;
    }

    if (Array.isArray(payload?.data?.inquiries)) {
        return payload.data.inquiries;
    }

    if (Array.isArray(payload?.data)) {
        return payload.data;
    }

    return [];
};

const hasAnswer = (inquiry) => {
    const answer =
        inquiry?.answer ??
        inquiry?.answerContent ??
        inquiry?.reply ??
        inquiry?.response ??
        inquiry?.adminAnswer ??
        inquiry?.answerText;

    return answer != null && String(answer).trim() !== '';
};

const getInquiryStatus = (inquiry) => {
    const rawStatus = inquiry?.status ?? inquiry?.answerStatus ?? inquiry?.state;
    const normalizedStatus = String(rawStatus ?? '').replace(/\s+/g, '').toUpperCase();

    if (hasAnswer(inquiry)) {
        return '답변완료';
    }

    if (['ANSWERED', 'COMPLETED', 'DONE', 'ANSWER_COMPLETE', 'ANSWER_COMPLETED', '답변완료'].includes(normalizedStatus)) {
        return '답변완료';
    }

    if (['WAITING', 'PENDING', '대기', '답변대기'].includes(normalizedStatus)) {
        return '답변대기';
    }

    return rawStatus || '답변대기';
};

function InquiryList() {
    const navigate = useNavigate();

    const inquiries = useInquiryStore((state) => state.inquiries);
    const setInquiries = useInquiryStore((state) => state.setInquiries);

    useEffect(() => {
        const fetchMyInquiries = async () => {
            try {
                const data = await getMyInquiryList();
                setInquiries(extractInquiries(data));
            } catch (error) {
                console.error('문의 목록 조회 중 오류:', error);
            }
        };

        fetchMyInquiries();
    }, [setInquiries]);

    const getInquiryType = (inquiry) => {
        return inquiry.type ?? inquiry.category ?? inquiry.categoryName ?? '기타';
    };

    const getInquiryTitle = (inquiry) => {
        return inquiry.title ?? inquiry.subject ?? '-';
    };

    const getInquiryDate = (inquiry) => {
        const date = inquiry.date ?? inquiry.createdAt ?? inquiry.createdDate ?? inquiry.regDate;

        if (!date) {
            return '-';
        }

        return String(date).slice(0, 10);
    };

    const totalCount = inquiries.length;
    const pendingCount = inquiries.filter((item) => getInquiryStatus(item) === '답변대기').length;
    const completedCount = inquiries.filter((item) => getInquiryStatus(item) === '답변완료').length;

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

                <div className={styles.summaryCard}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>전체 문의</span>
                        <span className={styles.statValue}>{totalCount}건</span>
                    </div>

                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>답변 대기</span>
                        <span className={`${styles.statValue} ${styles.statHighlight}`}>
                            {pendingCount}건
                        </span>
                    </div>

                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>답변 완료</span>
                        <span className={styles.statValue}>{completedCount}건</span>
                    </div>
                </div>

                <div className={styles.listCard}>
                    <div className={styles.listHeader}>
                        <h3 className={styles.listTitle}>문의 목록</h3>
                        <p>문의 제목과 답변 상태를 확인하세요.</p>
                    </div>

                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th className={styles.th} style={{width: '10%'}}>번호</th>
                                <th className={styles.th} style={{width: '20%'}}>구분</th>
                                <th className={styles.th} style={{width: '40%', textAlign: 'left'}}>제목</th>
                                <th className={styles.th} style={{width: '15%'}}>작성일</th>
                                <th className={styles.th} style={{width: '15%'}}>상태</th>
                            </tr>
                            </thead>

                            <tbody>
                            {inquiries.length > 0 ? (
                                inquiries.map((inquiry, index) => {
                                    const status = getInquiryStatus(inquiry);

                                    return (
                                        <tr key={inquiry.inquiryNo ?? inquiry.id ?? inquiry.inquiryId ?? index}>
                                            <td className={styles.td} style={{textAlign: 'center'}}>
                                                {inquiries.length - index}
                                            </td>

                                            <td className={styles.td} style={{textAlign: 'center'}}>
                                                <span className={styles.typeBadge}>
                                                    {getInquiryType(inquiry)}
                                                </span>
                                            </td>

                                            <td className={`${styles.td} ${styles.tdTitle}`}>
                                                {getInquiryTitle(inquiry)}
                                            </td>

                                            <td className={styles.td} style={{textAlign: 'center'}}>
                                                {getInquiryDate(inquiry)}
                                            </td>

                                            <td className={styles.td} style={{textAlign: 'center'}}>
                                                <span
                                                    className={`${styles.statusBadge} ${
                                                        status === '답변완료'
                                                            ? styles.statusCompleted
                                                            : styles.statusPending
                                                    }`}
                                                >
                                                    {status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
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
        </div>
    );
}

export default InquiryList;
