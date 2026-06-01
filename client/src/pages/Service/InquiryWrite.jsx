import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './InquiryWrite.css';

function InquiryWrite() {
    const navigate = useNavigate();

    // 폼 상태 관리
    const [formData, setFormData] = useState({
        title: '',
        type: '',
        content: '',
        file: null
    });

    const handleChange = (e) => {
        const {name, value, files} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 필수 입력값 검증
        if (!formData.title || !formData.type || !formData.content) {
            alert('제목, 문의 유형, 내용을 모두 입력해 주세요.');
            return;
        }

        // 백엔드 연동 전 임시 성공 처리
        alert('문의가 성공적으로 등록되었습니다.');
        navigate('/customer-service'); // 등록 완료 후 고객센터 메인으로 복귀
    };

    return (
        <div className="container inquiry-write-wrapper">
            <div className="inquiry-write-container">

                <h2 className="inquiry-write-title">고객센터 문의하기</h2>

                <form onSubmit={handleSubmit} className="inquiry-form">

                    {/* 1. 제목 입력 */}
                    <input
                        type="text"
                        name="title"
                        placeholder="제목"
                        value={formData.title}
                        onChange={handleChange}
                        className="inquiry-input"
                    />

                    {/* 2. 문의 유형 선택 (Select) */}
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="inquiry-input inquiry-select"
                    >
                        <option value="" disabled>문의 유형 선택</option>
                        <option value="account">계정/로그인 문의</option>
                        <option value="service">서비스 이용 문의</option>
                        <option value="error">오류 신고</option>
                        <option value="other">기타</option>
                    </select>

                    {/* 3. 문의 내용 입력 (Textarea) - 와이어프레임의 오타 수정 반영 */}
                    <textarea
                        name="content"
                        placeholder="문의 내용"
                        value={formData.content}
                        onChange={handleChange}
                        className="inquiry-input inquiry-textarea"
                    />

                    {/* 4. 파일 첨부 */}
                    <div className="inquiry-file-wrapper">
                        <input
                            type="file"
                            name="file"
                            onChange={handleChange}
                            className="inquiry-file-input"
                        />
                    </div>

                    {/* 5. 문의 등록 버튼 */}
                    <div className="inquiry-submit-wrapper">
                        <button
                            type="submit"
                            className="inquiry-submit-btn"
                        >
                            문의 등록
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}

export default InquiryWrite;