import React, {useState} from 'react';
import styles from './CustomerInquiryManagePage.module.css'; // 💡 모듈 CSS 적용

function CustomerInquiryManagePage({inquiries, onAnswerInquiry, onDeleteInquiry}) {
    const [mode, setMode] = useState('list');
    const [searchType, setSearchType] = useState('all');
    const [searchInput, setSearchInput] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [answerForm, setAnswerForm] = useState({
        inquiryNo: '',
        title: '',
        writerId: '',
        writerName: '',
        email: '',
        createdAt: '',
        status: '',
        content: '',
        attachmentName: '',
        attachmentUrl: '',
        answer: '',
    });

    const filteredInquiries = inquiries.filter((inquiry) => {
        if (!searchKeyword) return true;

        const inquiryNo = inquiry.inquiryNo.toLowerCase();
        const title = inquiry.title.toLowerCase();
        const writerId = inquiry.writerId.toLowerCase();
        const writerName = inquiry.writerName.toLowerCase();
        const email = inquiry.email.toLowerCase();
        const status = inquiry.status.toLowerCase();

        if (searchType === 'inquiryNo') return inquiryNo.includes(searchKeyword);
        if (searchType === 'title') return title.includes(searchKeyword);
        if (searchType === 'writerId') return writerId.includes(searchKeyword);
        if (searchType === 'writerName') return writerName.includes(searchKeyword);
        if (searchType === 'email') return email.includes(searchKeyword);
        if (searchType === 'status') return status.includes(searchKeyword);

        return (
            inquiryNo.includes(searchKeyword) ||
            title.includes(searchKeyword) ||
            writerId.includes(searchKeyword) ||
            writerName.includes(searchKeyword) ||
            email.includes(searchKeyword) ||
            status.includes(searchKeyword)
        );
    });

    // 💡 요약 통계 계산
    const totalCount = inquiries.length;
    const waitingCount = inquiries.filter(inq => inq.status === '대기' || inq.status === '답변 대기').length;
    const completedCount = inquiries.filter(inq => inq.status === '답변 완료').length;
    const deletedCount = inquiries.filter(inq => inq.status === '삭제 조치').length;

    // 💡 핸들러
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setSearchKeyword(searchInput.trim().toLowerCase());
    };

    const handleSearchReset = () => {
        setSearchType('all');
        setSearchInput('');
        setSearchKeyword('');
    };

    const handleOpenInquiry = (inquiry) => {
        setAnswerForm({...inquiry});
        setMode('answer');
    };

    const handleCloseInquiry = () => {
        setAnswerForm({
            inquiryNo: '', title: '', writerId: '', writerName: '', email: '',
            createdAt: '', status: '', content: '', attachmentName: '', attachmentUrl: '', answer: '',
        });
        setMode('list');
    };

    const handleAnswerChange = (event) => {
        setAnswerForm((prev) => ({...prev, answer: event.target.value}));
    };

    const handleAnswerSubmit = (event) => {
        event.preventDefault();
        if (onAnswerInquiry) {
            onAnswerInquiry({...answerForm, status: '답변 완료'});
        }
        alert('답변이 등록되었습니다.');
        setMode('list');
    };

    const handleDeleteClick = (inquiryNo) => {
        const isConfirm = window.confirm('정말 이 문의를 삭제(숨김 조치)하시겠습니까?');
        if (isConfirm) {
            if (onDeleteInquiry) onDeleteInquiry(inquiryNo);
            alert('문의가 삭제 조치되었습니다.');
        }
    };

    // 상태에 따른 배지 스타일 결정
    const getStatusBadge = (status) => {
        if (status.includes('대기')) return styles.statusPending;
        if (status.includes('완료')) return styles.statusCompleted;
        if (status.includes('삭제')) return styles.statusDeleted;
        return '';
    };

    return (
        <main className={styles.container}>

            {/* 상단 헤더 영역 */}
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>고객 문의 관리</h2>
                    <p className={styles.desc}>고객의 문의 사항을 확인하고 답변을 등록 및 관리할 수 있습니다.</p>
                </div>
            </div>

            {/* 통계 요약 그리드 */}
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

            {/* 리스트 모드 */}
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
                            <button type="button" className={styles.secondaryBtn} onClick={handleSearchReset}>초기화
                            </button>
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

                        {filteredInquiries.length > 0 ? (
                            filteredInquiries.map((inquiry) => (
                                <div className={styles.tableRow} key={inquiry.inquiryNo}>
                                    <span>{inquiry.inquiryNo}</span>
                                    <span>
                                        {inquiry.writerName}<br/>
                                        <small style={{color: 'var(--color-text-muted)'}}>({inquiry.writerId})</small>
                                    </span>
                                    <span
                                        className={styles.colTitle}
                                        onClick={() => handleOpenInquiry(inquiry)}
                                    >
                                        {inquiry.title}
                                    </span>
                                    <span>{inquiry.createdAt}</span>
                                    <span>
                                        <span className={`${styles.statusBadge} ${getStatusBadge(inquiry.status)}`}>
                                            {inquiry.status}
                                        </span>
                                    </span>
                                    <div className={styles.actionGroup}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleOpenInquiry(inquiry)}
                                        >
                                            상세/답변
                                        </button>
                                        <button
                                            className={styles.dangerBtn}
                                            onClick={() => handleDeleteClick(inquiry.inquiryNo)}
                                            disabled={inquiry.status === '삭제 조치'}
                                        >
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

            {/* 답변/상세 모드 */}
            {mode === 'answer' && (
                <div className={styles.tableWrapper} style={{padding: '32px'}}>
                    <div className={styles.header} style={{marginBottom: '24px'}}>
                        <h2 className={styles.title}>문의 상세 및 답변 등록</h2>
                    </div>

                    <div className={styles.detailGrid}>
                        <div className={styles.detailField}>
                            <span className={styles.detailLabel}>문의 번호</span>
                            <span className={styles.detailValue}>{answerForm.inquiryNo}</span>
                        </div>
                        <div className={styles.detailField}>
                            <span className={styles.detailLabel}>작성일</span>
                            <span className={styles.detailValue}>{answerForm.createdAt}</span>
                        </div>
                        <div className={styles.detailField}>
                            <span className={styles.detailLabel}>작성자 (ID)</span>
                            <span className={styles.detailValue}>{answerForm.writerName} ({answerForm.writerId})</span>
                        </div>
                        <div className={styles.detailField}>
                            <span className={styles.detailLabel}>이메일</span>
                            <span className={styles.detailValue}>{answerForm.email}</span>
                        </div>
                        <div className={`${styles.detailField} ${styles.full}`}>
                            <span className={styles.detailLabel}>문의 제목</span>
                            <span className={styles.detailValue} style={{fontSize: '18px'}}>{answerForm.title}</span>
                        </div>
                        <div className={`${styles.detailField} ${styles.full}`}>
                            <span className={styles.detailLabel}>문의 내용</span>
                            <div className={styles.detailValue} style={{
                                padding: '16px',
                                background: '#fff',
                                border: '1px solid var(--color-border)',
                                borderRadius: '8px',
                                minHeight: '100px',
                                whiteSpace: 'pre-wrap'
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
                                value={answerForm.answer || ''}
                                onChange={handleAnswerChange}
                                placeholder="고객에게 안내할 답변 내용을 입력해주세요."
                                className={styles.textarea}
                                required
                                readOnly={answerForm.status === '삭제 조치'}
                            />
                        </div>

                        <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px'}}>
                            <button type="button" className={styles.secondaryBtn} onClick={handleCloseInquiry}>
                                취소 / 목록으로
                            </button>
                            {answerForm.status !== '삭제 조치' && (
                                <button type="submit" className={styles.primaryBtn}>
                                    답변 등록/수정
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

        </main>
    );
}

export default CustomerInquiryManagePage;