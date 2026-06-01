import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './InquiryWrite.module.css';

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
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <h2 className={styles.title}>고객센터 문의하기</h2>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* 1. 제목 입력 */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>제목</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="문의 제목을 입력해주세요"
                                value={formData.title}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        {/* 2. 문의 유형 선택 (Select) */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>문의 유형</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className={`${styles.input} ${styles.select}`}
                            >
                                <option value="" disabled>문의 유형 선택</option>
                                <option value="account">계정/로그인 문의</option>
                                <option value="service">서비스 이용 문의</option>
                                <option value="error">오류 신고</option>
                                <option value="other">기타</option>
                            </select>
                        </div>

                        {/* 3. 문의 내용 입력 (Textarea) */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>문의 내용</label>
                            <textarea
                                name="content"
                                placeholder="문의하실 내용을 상세히 적어주세요."
                                value={formData.content}
                                onChange={handleChange}
                                className={`${styles.input} ${styles.textarea}`}
                            />
                        </div>

                        {/* 4. 파일 첨부 */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>첨부 파일 (선택)</label>
                            <div className={styles.fileWrapper}>
                                <input
                                    type="file"
                                    name="file"
                                    onChange={handleChange}
                                    className={styles.fileInput}
                                />
                            </div>
                        </div>

                        {/* 5. 문의 등록 버튼 */}
                        <button type="submit" className={styles.submitBtn}>
                            문의 등록하기
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default InquiryWrite;