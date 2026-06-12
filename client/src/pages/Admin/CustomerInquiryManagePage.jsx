import React, {useEffect, useState} from 'react';
import styles from './CustomerInquiryManagePage.module.css';
import {answerAdminInquiryApi, deleteAdminInquiryApi, getAdminInquiriesApi} from '../../api/adminApi.js';

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

const getInquiryStatusLabel = (inquiry) => {
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

    if (['DELETED', '삭제', '삭제처리'].includes(normalizedStatus)) {
        return '삭제처리';
    }

    return rawStatus || '답변대기';
};

function CustomerInquiryManagePage() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState('list');
    const [searchType, setSearchType] = useState('all');
    const [searchInput, setSearchInput] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [answerForm, setAnswerForm] = useState({});

    const loadInquiries = async () => {
        setLoading(true);
        try {
            const data = await getAdminInquiriesApi();
            setInquiries(extractInquiries(data));
        } catch (error) {
            console.error('문의 목록 조회 실패:', error);
            alert('문의 목록을 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timerId = window.setTimeout(() => {
            loadInquiries();
        }, 0);

        return () => window.clearTimeout(timerId);
    }, []);

    const filteredInquiries = inquiries.filter((inq) => {
        if (!searchKeyword) return true;

        const no = String(inq.inquiryId ?? inq.inquiryNo ?? '').toLowerCase();
        const title = (inq.title ?? '').toLowerCase();
        const memberName = (inq.memberName ?? '').toLowerCase();
        const email = (inq.email ?? '').toLowerCase();
        const status = getInquiryStatusLabel(inq).toLowerCase();

        if (searchType === 'inquiryNo') return no.includes(searchKeyword);
        if (searchType === 'title') return title.includes(searchKeyword);
        if (searchType === 'writerName') return memberName.includes(searchKeyword);
        if (searchType === 'email') return email.includes(searchKeyword);
        if (searchType === 'status') return status.includes(searchKeyword);

        return no.includes(searchKeyword) ||
            title.includes(searchKeyword) ||
            memberName.includes(searchKeyword) ||
            email.includes(searchKeyword) ||
            status.includes(searchKeyword);
    });

    const totalCount = inquiries.length;
    const waitingCount = inquiries.filter((inq) => getInquiryStatusLabel(inq) === '답변대기').length;
    const completedCount = inquiries.filter((inq) => getInquiryStatusLabel(inq) === '답변완료').length;
    const deletedCount = inquiries.filter((inq) => getInquiryStatusLabel(inq) === '삭제처리').length;

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchKeyword(searchInput.trim().toLowerCase());
    };

    const handleSearchReset = () => {
        setSearchType('all');
        setSearchInput('');
        setSearchKeyword('');
    };

    const handleOpenInquiry = (inq) => {
        setAnswerForm({...inq, answer: inq.answer ?? ''});
        setMode('answer');
    };

    const handleCloseInquiry = () => {
        setAnswerForm({});
        setMode('list');
    };

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();

        const inquiryId = answerForm.inquiryId ?? answerForm.inquiryNo;
        const answer = answerForm.answer?.trim();

        if (!inquiryId) {
            alert('문의 번호를 확인할 수 없습니다.');
            return;
        }

        if (!answer) {
            alert('답변 내용을 입력해주세요.');
            return;
        }

        try {
            await answerAdminInquiryApi(inquiryId, answer);
            await loadInquiries();
            alert('답변이 등록되었습니다.');
            setAnswerForm({});
            setMode('list');
        } catch (error) {
            console.error('답변 등록 실패:', error);
            alert('답변 등록에 실패했습니다.');
        }
    };

    const handleDeleteClick = async (inquiryId) => {
        if (!window.confirm('해당 문의를 삭제하시겠습니까?')) return;
        try {
            await deleteAdminInquiryApi(inquiryId);
            setInquiries(prev => prev.filter(inq => inq.inquiryId !== inquiryId));
            if (answerForm?.inquiryId === inquiryId) setAnswerForm({});
        } catch (error) {
            console.error('문의 삭제 실패:', error);
            alert('문의 삭제에 실패했습니다.');
        }
    };

    const getStatusBadge = (inquiry) => {
        const statusLabel = getInquiryStatusLabel(inquiry);

        if (statusLabel === '답변대기') return styles.statusPending;
        if (statusLabel === '답변완료') return styles.statusCompleted;
        if (statusLabel === '삭제처리') return styles.statusDeleted;

        return '';
    };

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>고객 문의 관리</h2>
                    <p className={styles.desc}>고객의 문의 사항을 확인하고 답변을 등록 및 관리할 수 있습니다.</p>
                </div>
            </div>

            <div className={styles.summaryGrid}>
                <article className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>전체 문의</span>
                    <span className={`${styles.summaryValue} ${styles.textPrimary}`}>{totalCount}건</span>
                </article>
                <article className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>답변 대기</span>
                    <span className={`${styles.summaryValue} ${styles.textWarning}`}>{waitingCount}건</span>
                </article>
                <article className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>답변 완료</span>
                    <span className={`${styles.summaryValue} ${styles.textSuccess}`}>{completedCount}건</span>
                </article>
                <article className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>삭제 조치</span>
                    <span className={`${styles.summaryValue} ${styles.textError}`}>{deletedCount}건</span>
                </article>
            </div>

            {mode === 'list' && (
                <>
                    <div className={styles.toolbar}>
                        <form className={styles.searchBox} onSubmit={handleSearchSubmit}>
                            <select
                                className={styles.select}
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                            >
                                <option value="all">전체</option>
                                <option value="inquiryNo">문의 번호</option>
                                <option value="title">제목</option>
                                <option value="writerName">작성자</option>
                                <option value="email">이메일</option>
                                <option value="status">상태</option>
                            </select>
                            <input
                                type="text"
                                className={styles.input}
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="검색어를 입력하세요"
                            />
                            <button type="submit" className={styles.primaryBtn}>검색</button>
                            <button type="button" className={styles.secondaryBtn} onClick={handleSearchReset}>초기화</button>
                        </form>
                    </div>

                    <div className={styles.tableWrapper}>
                        <div className={styles.tableHead}>
                            <span>번호</span>
                            <span>작성자</span>
                            <span>제목</span>
                            <span>작성일</span>
                            <span>상태</span>
                            <span>관리</span>
                        </div>
                        {loading ? (
                            <div style={{padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)'}}>불러오는 중...</div>
                        ) : filteredInquiries.length > 0 ? (
                            filteredInquiries.map((inq) => {
                                const statusLabel = getInquiryStatusLabel(inq);

                                return (
                                    <div className={styles.tableRow} key={inq.inquiryId ?? inq.inquiryNo}>
                                        <span>{inq.inquiryId ?? inq.inquiryNo}</span>
                                        <span>{inq.memberName ?? '-'}</span>
                                        <span className={styles.colTitle} onClick={() => handleOpenInquiry(inq)}>
                                            {inq.title}
                                        </span>
                                        <span>{String(inq.createdAt ?? '').slice(0, 10)}</span>
                                        <span>
                                            <span className={`${styles.statusBadge} ${getStatusBadge(inq)}`}>
                                                {statusLabel}
                                            </span>
                                        </span>
                                        <div className={styles.actionGroup}>
                                            <button className={styles.actionBtn} onClick={() => handleOpenInquiry(inq)}>
                                                상세/답변
                                            </button>
                                            <button
                                                className={styles.dangerBtn}
                                                onClick={() => handleDeleteClick(inq.inquiryId)}
                                                disabled={statusLabel === '삭제처리'}
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div style={{padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)'}}>
                                문의 내역이 없습니다.
                            </div>
                        )}
                    </div>
                </>
            )}

            {mode === 'answer' && (
                <div className={styles.tableWrapper} style={{padding: '32px'}}>
                    <div className={styles.header} style={{marginBottom: '24px'}}>
                        <h2 className={styles.title}>문의 상세 및 답변 등록</h2>
                    </div>
                    <div className={styles.detailGrid}>
                        <div className={styles.detailField}>
                            <span className={styles.detailLabel}>문의 번호</span>
                            <span className={styles.detailValue}>{answerForm.inquiryId ?? answerForm.inquiryNo}</span>
                        </div>
                        <div className={styles.detailField}>
                            <span className={styles.detailLabel}>작성일</span>
                            <span className={styles.detailValue}>{String(answerForm.createdAt ?? '').slice(0, 10)}</span>
                        </div>
                        <div className={styles.detailField}>
                            <span className={styles.detailLabel}>작성자</span>
                            <span className={styles.detailValue}>{answerForm.memberName ?? '-'}</span>
                        </div>
                        <div className={styles.detailField}>
                            <span className={styles.detailLabel}>처리 상태</span>
                            <span className={styles.detailValue}>{getInquiryStatusLabel(answerForm)}</span>
                        </div>
                        <div className={`${styles.detailField} ${styles.full}`}>
                            <span className={styles.detailLabel}>문의 제목</span>
                            <span className={styles.detailValue} style={{fontSize: '18px'}}>{answerForm.title}</span>
                        </div>
                        <div className={`${styles.detailField} ${styles.full}`}>
                            <span className={styles.detailLabel}>문의 내용</span>
                            <div
                                className={styles.detailValue}
                                style={{
                                    padding: '16px',
                                    background: '#fff',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '8px',
                                    minHeight: '100px',
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                {answerForm.content}
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleAnswerSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>관리자 답변</label>
                            <textarea
                                name="answer"
                                value={answerForm.answer ?? ''}
                                onChange={(e) => setAnswerForm((prev) => ({...prev, answer: e.target.value}))}
                                placeholder="고객에게 안내할 답변 내용을 입력해주세요."
                                className={styles.textarea}
                                required
                                readOnly={getInquiryStatusLabel(answerForm) === '삭제처리'}
                            />
                        </div>
                        <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px'}}>
                            <button type="button" className={styles.secondaryBtn} onClick={handleCloseInquiry}>
                                취소 / 목록으로
                            </button>
                            {getInquiryStatusLabel(answerForm) !== '삭제처리' && (
                                <button type="submit" className={styles.primaryBtn}>답변 등록/수정</button>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </main>
    );
}

export default CustomerInquiryManagePage;
