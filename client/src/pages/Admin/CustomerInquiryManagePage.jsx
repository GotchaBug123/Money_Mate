import React, {useState} from 'react';

import './customerInquiryManage.css';

function CustomerInquiryManagePage({
                                       inquiries,
                                       onAnswerInquiry,
                                       onDeleteInquiry,
                                   }) {
    const [mode, setMode] = useState('list');
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
                    <div className="admin-page-label">고객센터관리화면</div>

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
                            <label>내용</label>
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
                                답변하기
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
                <div className="admin-page-label">고객센터관리화면</div>

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
                        {inquiries.length > 0 ? (
                            inquiries.map((inquiry) => (
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
                                문의 내역이 없습니다.
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default CustomerInquiryManagePage;