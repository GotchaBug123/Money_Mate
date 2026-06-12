import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useInquiryStore} from '../../store/useInquiryStore';
import {getMyInquiryList} from '../../api/customerServiceApi';
import styles from './InquiryList.module.css';

function InquiryList() {
    const navigate = useNavigate();
    const inquiries = useInquiryStore((state) => state.inquiries);
    const setInquiries = useInquiryStore((state) => state.setInquiries);
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    useEffect(() => {
        getMyInquiryList()
            .then((data) => setInquiries(data))
            .catch((err) => console.error('문의 내역 불러오기 실패:', err));
    }, []);

    const getInquiryStatus = (inquiry) => {
        const status = inquiry.status ?? inquiry.answerStatus ?? inquiry.state;

        if (status === 'ANSWERED' || status === 'COMPLETED' || status === '답변완료' || status === '답변 완료') {
            return '답변완료';
        }

        if (status === 'WAITING' || status === 'PENDING' || status === '대기' || status === '답변대기' || status === '답변 대기') {
            return '답변대기';
        }

        return status || '답변대기';
    };

    const getInquiryType = (inquiry) => inquiry.type ?? inquiry.category ?? inquiry.categoryName ?? '기타';
    const getInquiryTitle = (inquiry) => inquiry.title ?? inquiry.subject ?? '-';
    const getInquiryDate = (inquiry) => {
        const date = inquiry.date ?? inquiry.createdAt ?? inquiry.createdDate ?? inquiry.regDate;
        if (!date) return '-';
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
                    <p className={styles.subtitle}>내가 남긴 문의와 답변 상태를 한눈에 확인할 수 있습니다.</p>
                    <div className={styles.heroButtons}>
                        <button type="button" onClick={() => navigate('/customer-service')}>고객센터 홈</button>
                        <button type="button" onClick={() => navigate('/inquiry-write')}>새 문의 작성</button>
                    </div>
                </section>

                <div className={styles.summaryCard}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>전체 문의</span>
                        <span className={styles.statValue}>{totalCount}건</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>답변 대기</span>
                        <span className={`${styles.statValue} ${styles.statHighlight}`}>{pendingCount}건</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>답변 완료</span>
                        <span className={styles.statValue}>{completedCount}건</span>
                    </div>
                </div>

                <div className={styles.listCard}>
                    <div className={styles.listHeader}>
                        <h3 className={styles.listTitle}>문의 목록</h3>
                        <p>문의 제목을 클릭하면 상세 내용을 확인할 수 있습니다.</p>
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
                                        <tr key={inquiry.inquiryNo ?? inquiry.id ?? index}>
                                            <td className={styles.td} style={{textAlign: 'center'}}>
                                                {inquiries.length - index}
                                            </td>
                                            <td className={styles.td} style={{textAlign: 'center'}}>
                                                <span className={styles.typeBadge}>{getInquiryType(inquiry)}</span>
                                            </td>
                                            <td
                                                className={`${styles.td} ${styles.tdTitle}`}
                                                style={{cursor: 'pointer'}}
                                                onClick={() => setSelectedInquiry(inquiry)}
                                            >
                                                {getInquiryTitle(inquiry)}
                                            </td>
                                            <td className={styles.td} style={{textAlign: 'center'}}>
                                                {getInquiryDate(inquiry)}
                                            </td>
                                            <td className={styles.td} style={{textAlign: 'center'}}>
                                                <span className={`${styles.statusBadge} ${status === '답변완료' ? styles.statusCompleted : styles.statusPending}`}>
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
                        <button className={styles.pagination}>&lt; 1 &gt;</button>
                        <button onClick={() => navigate('/inquiry-write')} className={styles.writeBtn}>
                            새 문의 작성
                        </button>
                    </div>
                </div>
            </div>

            {selectedInquiry && (
                <div
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}
                    onClick={() => setSelectedInquiry(null)}
                >
                    <div
                        style={{
                            background: 'var(--color-bg-card)', borderRadius: 'var(--radius-xl)',
                            padding: '32px', width: '560px', maxWidth: '90vw', maxHeight: '80vh',
                            overflowY: 'auto', boxShadow: 'var(--shadow-hover)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                            <h3 style={{fontSize: '18px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0}}>
                                문의 상세
                            </h3>
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                style={{background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-light)'}}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
                            <span className={styles.typeBadge}>{getInquiryType(selectedInquiry)}</span>
                            <span className={`${styles.statusBadge} ${getInquiryStatus(selectedInquiry) === '답변완료' ? styles.statusCompleted : styles.statusPending}`}>
                                {getInquiryStatus(selectedInquiry)}
                            </span>
                        </div>

                        <div style={{marginBottom: '8px', fontSize: '13px', color: 'var(--color-text-muted)'}}>
                            {getInquiryDate(selectedInquiry)}
                        </div>

                        <h4 style={{fontSize: '16px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '12px'}}>
                            {getInquiryTitle(selectedInquiry)}
                        </h4>

                        <div style={{
                            padding: '16px', background: 'var(--color-bg-page)',
                            borderRadius: 'var(--radius-md)', fontSize: '14px',
                            color: 'var(--color-text-sub)', lineHeight: 1.6,
                            whiteSpace: 'pre-wrap', marginBottom: '20px'
                        }}>
                            {selectedInquiry.content || '내용 없음'}
                        </div>

                        {selectedInquiry.answer && (
                            <div>
                                <h4 style={{fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px'}}>
                                    관리자 답변
                                </h4>
                                <div style={{
                                    padding: '16px', background: 'var(--color-primary-light)',
                                    borderRadius: 'var(--radius-md)', fontSize: '14px',
                                    color: 'var(--color-text-sub)', lineHeight: 1.6,
                                    whiteSpace: 'pre-wrap', borderLeft: '3px solid var(--color-primary)'
                                }}>
                                    {selectedInquiry.answer}
                                </div>
                            </div>
                        )}

                        {!selectedInquiry.answer && (
                            <div style={{
                                padding: '16px', background: 'var(--color-bg-page)',
                                borderRadius: 'var(--radius-md)', fontSize: '14px',
                                color: 'var(--color-text-muted)', textAlign: 'center'
                            }}>
                                아직 답변이 등록되지 않았습니다.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default InquiryList;