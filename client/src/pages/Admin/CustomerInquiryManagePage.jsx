import React, {useState, useEffect} from 'react';
import styles from './CustomerInquiryManagePage.module.css';
import {getAdminInquiriesApi, answerAdminInquiryApi} from '../../api/adminApi.js';

function CustomerInquiryManagePage() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState('list');
    const [searchType, setSearchType] = useState('all');
    const [searchInput, setSearchInput] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [answerForm, setAnswerForm] = useState({});

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await getAdminInquiriesApi();
                setInquiries(Array.isArray(data) ? data : (data.inquiries ?? []));
            } catch (error) {
                console.error('문의 목록 조회 실패:', error);
                alert('문의 목록을 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filteredInquiries = inquiries.filter((inq) => {
        if (!searchKeyword) return true;
        const no = String(inq.inquiryId ?? '').toLowerCase();
        const title = (inq.title ?? '').toLowerCase();
        const memberName = (inq.memberName ?? '').toLowerCase();
        const status = (inq.status ?? '').toLowerCase();
        if (searchType === 'inquiryNo') return no.includes(searchKeyword);
        if (searchType === 'title') return title.includes(searchKeyword);
        if (searchType === 'writerName') return memberName.includes(searchKeyword);
        if (searchType === 'status') return status.includes(searchKeyword);
        return no.includes(searchKeyword) || title.includes(searchKeyword) ||
            memberName.includes(searchKeyword) || status.includes(searchKeyword);
    });

    const totalCount = inquiries.length;
    const waitingCount = inquiries.filter(i => (i.status ?? '').includes('대기')).length;
    const completedCount = inquiries.filter(i => (i.status ?? '').includes('완료')).length;
    const deletedCount = inquiries.filter(i => (i.status ?? '').includes('삭제')).length;

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
        const inquiryId = answerForm.inquiryId;
        try {
            await answerAdminInquiryApi(inquiryId, answerForm.answer);
            setInquiries(prev => prev.map(i =>
                (i.inquiryId ?? i.inquiryNo) === inquiryId
                    ? {...i, answer: answerForm.answer, status: '답변 완료'}
                    : i
            ));
            alert('답변이 등록되었습니다.');
            setMode('list');
        } catch (error) {
            console.error('답변 등록 실패:', error);
            alert('답변 등록에 실패했습니다.');
        }
    };

    const handleDeleteClick = () => {
        alert('문의 삭제 기능은 현재 지원되지 않습니다.');
    };

    const getStatusBadge = (status) => {
        if ((status ?? '').includes('대기')) return styles.statusPending;
        if ((status ?? '').includes('완료')) return styles.statusCompleted;
        if ((status ?? '').includes('삭제')) return styles.statusDeleted;
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
                            <select className={styles.select} value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                                <option value="all">전체</option>
                                <option value="inquiryNo">문의 번호</option>
                                <option value="title">제목</option>
                                <option value="writerName">작성자</option>
                                <option value="email">이메일</option>
                                <option value="status">상태</option>
                            </select>
                            <input type="text" className={styles.input} value={searchInput}
                                   onChange={(e) => setSearchInput(e.target.value)} placeholder="검색어를 입력하세요"/>
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
                            filteredInquiries.map((inq) => (
                                <div className={styles.tableRow} key={inq.inquiryId}>
                                    <span>{inq.inquiryId}</span>
                                    <span>{inq.memberName ?? '-'}</span>
                                    <span className={styles.colTitle} onClick={() => handleOpenInquiry(inq)}>
                                        {inq.title}
                                    </span>
                                    <span>{String(inq.createdAt ?? '').slice(0, 10)}</span>
                                    <span>
                                        <span className={`${styles.statusBadge} ${getStatusBadge(inq.status)}`}>
                                            {inq.status ?? '대기'}
                                        </span>
                                    </span>
                                    <div className={styles.actionGroup}>
                                        <button className={styles.actionBtn} onClick={() => handleOpenInquiry(inq)}>
                                            상세/답변
                                        </button>
                                        <button className={styles.dangerBtn}
                                                onClick={() => handleDeleteClick(inq.inquiryId)}
                                                disabled={(inq.status ?? '').includes('삭제')}>
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            ))
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
                            <span className={styles.detailValue}>{(answerForm.createdAt ?? '').slice(0, 10)}</span>
                        </div>
                        <div className={styles.detailField}>
                            <span className={styles.detailLabel}>작성자</span>
                            <span className={styles.detailValue}>{answerForm.memberName ?? '-'}</span>
                        </div>
                        <div className={styles.detailField}>
                            <span className={styles.detailLabel}>처리 상태</span>
                            <span className={styles.detailValue}>{answerForm.status ?? '대기'}</span>
                        </div>
                        <div className={`${styles.detailField} ${styles.full}`}>
                            <span className={styles.detailLabel}>문의 제목</span>
                            <span className={styles.detailValue} style={{fontSize: '18px'}}>{answerForm.title}</span>
                        </div>
                        <div className={`${styles.detailField} ${styles.full}`}>
                            <span className={styles.detailLabel}>문의 내용</span>
                            <div className={styles.detailValue} style={{
                                padding: '16px', background: '#fff', border: '1px solid var(--color-border)',
                                borderRadius: '8px', minHeight: '100px', whiteSpace: 'pre-wrap'
                            }}>
                                {answerForm.content}
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleAnswerSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>관리자 답변</label>
                            <textarea
                                name="answer"
                                value={answerForm.answer}
                                onChange={(e) => setAnswerForm(prev => ({...prev, answer: e.target.value}))}
                                placeholder="고객에게 안내할 답변 내용을 입력해주세요."
                                className={styles.textarea}
                                required
                                readOnly={(answerForm.status ?? '').includes('삭제')}
                            />
                        </div>
                        <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px'}}>
                            <button type="button" className={styles.secondaryBtn} onClick={handleCloseInquiry}>
                                취소 / 목록으로
                            </button>
                            {!(answerForm.status ?? '').includes('삭제') && (
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
