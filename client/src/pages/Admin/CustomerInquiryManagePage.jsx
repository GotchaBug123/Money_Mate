import React, {useState} from 'react';

import './customerInquiryManage.css';

function CustomerInquiryManagePage({
                                       inquiries,
                                       onAnswerInquiry,
                                       onDeleteInquiry,
                                   }) {
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
        if (!searchKeyword) {
            return true;
        }

        const inquiryNo = inquiry.inquiryNo.toLowerCase();
        const title = inquiry.title.toLowerCase();
        const writerId = inquiry.writerId.toLowerCase();
        const writerName = inquiry.writerName.toLowerCase();
        const email = inquiry.email.toLowerCase();
        const status = inquiry.status.toLowerCase();

        if (searchType === 'inquiryNo') {
            return inquiryNo.includes(searchKeyword);
        }

        if (searchType === 'title') {
            return title.includes(searchKeyword);
        }

        if (searchType === 'writer') {
            return (
                writerId.includes(searchKeyword) ||
                writerName.includes(searchKeyword) ||
                email.includes(searchKeyword)
            );
        }

        if (searchType === 'status') {
            return status.includes(searchKeyword);
        }

        return (
            inquiryNo.includes(searchKeyword) ||
            title.includes(searchKeyword) ||
            writerId.includes(searchKeyword) ||
            writerName.includes(searchKeyword) ||
            email.includes(searchKeyword) ||
            status.includes(searchKeyword)
        );
    });

    const waitingCount = inquiries.filter((inquiry) => inquiry.status === '답변 전').length;
    const completeCount = inquiries.filter((inquiry) => inquiry.status === '답변 완료').length;
    const deletedCount = inquiries.filter((inquiry) => inquiry.status === '삭제 조치').length;

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setSearchKeyword(searchInput.trim().toLowerCase());
    };

    const handleOpenInquiry = (inquiry) => {
        setAnswerForm({
            ...inquiry,
            attachmentUrl: inquiry.attachmentUrl || '',
        });
        setMode('answer');
    };

    const handleAnswerChange = (event) => {
        const {value} = event.target;

        setAnswerForm((prevForm) => ({
            ...prevForm,
            answer: value,
        }));
    };

    const handleSubmitAnswer = (event) => {
        event.preventDefault();

        if (!answerForm.answer.trim()) {
            alert('답변 내용을 입력해주세요.');
            return;
        }

        onAnswerInquiry(answerForm);
        setMode('list');
    };

    if (mode === 'answer') {
        return (
            <main className="admin-content-main inquiry-content-main">
                <section className="inquiry-answer-page">
                    <div className="inquiry-page-header">
                        <div>
                            <span className="admin-section-label">Inquiry Answer</span>
                            <h2>문의 답변 작성</h2>
                            <p>회원 문의 내용을 확인하고 관리자 답변을 등록합니다.</p>
                        </div>

                        <button
                            type="button"
                            className="inquiry-back-button"
                            onClick={() => setMode('list')}
                        >
                            목록으로
                        </button>
                    </div>

                    <form className="inquiry-answer-form" onSubmit={handleSubmitAnswer}>
                        <div className="inquiry-top-fields">
                            <div className="inquiry-form-field">
                                <label>회원 ID</label>
                                <input
                                    type="text"
                                    value={answerForm.writerId}
                                    readOnly
                                />
                            </div>

                            <div className="inquiry-form-field">
                                <label>회원 이름</label>
                                <input
                                    type="text"
                                    value={answerForm.writerName}
                                    readOnly
                                />
                            </div>
                        </div>

                        {answerForm.email && (
                            <div className="inquiry-form-field wide">
                                <label>이메일</label>
                                <input
                                    type="text"
                                    value={answerForm.email}
                                    readOnly
                                />
                            </div>
                        )}

                        <div className="inquiry-form-field wide">
                            <label>문의 제목</label>
                            <input
                                type="text"
                                value={answerForm.title}
                                readOnly
                            />
                        </div>

                        <div className="inquiry-form-field wide content-field">
                            <label>문의 내용</label>
                            <textarea
                                value={answerForm.content}
                                readOnly
                            />
                        </div>

                        <div className="inquiry-form-field wide">
                            <label>첨부파일</label>

                            <div className="file-view-box">
                                <input
                                    type="text"
                                    value={answerForm.attachmentName || '첨부파일 없음'}
                                    readOnly
                                />

                                {answerForm.attachmentName && (
                                    <a
                                        className={
                                            answerForm.attachmentUrl
                                                ? 'file-open-button'
                                                : 'file-open-button disabled'
                                        }
                                        href={answerForm.attachmentUrl || undefined}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={(event) => {
                                            if (!answerForm.attachmentUrl) {
                                                event.preventDefault();
                                            }
                                        }}
                                    >
                                        파일 확인
                                    </a>
                                )}
                            </div>

                            {answerForm.attachmentName && !answerForm.attachmentUrl && (
                                <p className="file-help-text">
                                    현재는 파일명만 확인 가능합니다. 실제 파일 열기는 백엔드 파일 URL 연결 후 가능합니다.
                                </p>
                            )}
                        </div>

                        <div className="inquiry-form-field wide content-field">
                            <label>답변 내용</label>
                            <textarea
                                value={answerForm.answer}
                                onChange={handleAnswerChange}
                                placeholder="관리자 답변 내용을 입력하세요."
                            />
                        </div>

                        <div className="inquiry-answer-buttons">
                            <button type="button" onClick={() => setMode('list')}>
                                취소
                            </button>
                            <button type="submit">
                                저장
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        );
    }

    return (
        <main className="admin-content-main inquiry-content-main">
            <section className="inquiry-manage-page">
                <div className="inquiry-page-header">
                    <div>
                        <span className="admin-section-label">Customer Inquiry</span>
                        <h2>고객문의관리</h2>
                        <p>고객 문의를 확인하고 답변 등록 또는 삭제 조치를 처리합니다.</p>
                    </div>

                    <div className="inquiry-summary-grid">
                        <article>
                            <span>전체 문의</span>
                            <strong>{inquiries.length}</strong>
                        </article>

                        <article className="waiting">
                            <span>답변 대기</span>
                            <strong>{waitingCount}</strong>
                        </article>

                        <article>
                            <span>답변 완료</span>
                            <strong>{completeCount}</strong>
                        </article>

                        <article>
                            <span>삭제 조치</span>
                            <strong>{deletedCount}</strong>
                        </article>
                    </div>
                </div>

                <div className="inquiry-toolbar">
                    <div>
                        <h3>문의 목록</h3>
                        <span>총 {filteredInquiries.length}개의 문의가 조회되었습니다.</span>
                    </div>

                    <form className="inquiry-search-box" onSubmit={handleSearchSubmit}>
                        <select
                            className="inquiry-search-select"
                            value={searchType}
                            onChange={(event) => setSearchType(event.target.value)}
                        >
                            <option value="all">전체</option>
                            <option value="inquiryNo">문의 번호</option>
                            <option value="title">문의 제목</option>
                            <option value="writer">작성자</option>
                            <option value="status">상태</option>
                        </select>

                        <input
                            type="text"
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            placeholder="검색어 입력"
                        />

                        <button type="submit">
                            검색
                        </button>
                    </form>
                </div>

                <div className="inquiry-list-box">
                    <div className="inquiry-table-header">
                        <span>문의 번호</span>
                        <span>문의 제목</span>
                        <span>작성자</span>
                        <span>작성일</span>
                        <span>상태</span>
                        <span>관리</span>
                    </div>

                    <div className="inquiry-table-body">
                        {filteredInquiries.length > 0 ? (
                            filteredInquiries.map((inquiry) => (
                                <div className="inquiry-row" key={inquiry.inquiryNo}>
                                    <span>{inquiry.inquiryNo}</span>
                                    <span>{inquiry.title}</span>
                                    <span>
                                        {inquiry.writerName}
                                        {inquiry.email ? ' / 비회원' : ''}
                                    </span>
                                    <span>{inquiry.createdAt}</span>
                                    <span
                                        className={
                                            inquiry.status === '답변 완료'
                                                ? 'status-complete'
                                                : inquiry.status === '삭제 조치'
                                                    ? 'status-deleted'
                                                    : 'status-waiting'
                                        }
                                    >
                                        {inquiry.status}
                                    </span>

                                    <div className="inquiry-actions">
                                        <button
                                            type="button"
                                            className="check-button"
                                            onClick={() => handleOpenInquiry(inquiry)}
                                            disabled={inquiry.status === '삭제 조치'}
                                        >
                                            확인
                                        </button>

                                        <button
                                            type="button"
                                            className="delete-button"
                                            onClick={() => onDeleteInquiry(inquiry.inquiryNo)}
                                            disabled={inquiry.status === '삭제 조치'}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-inquiry-list">
                                검색 결과가 없습니다.
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default CustomerInquiryManagePage;