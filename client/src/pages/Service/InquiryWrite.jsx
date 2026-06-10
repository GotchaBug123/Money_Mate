import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {createInquiry} from '../../api/customerServiceApi';
import {useAuthStore} from '../../store/useAuthStore';
import styles from './InquiryWrite.module.css';

function InquiryWrite() {
    const navigate = useNavigate();

    const storeLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const localLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isLoggedIn = storeLoggedIn || localLoggedIn;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        type: '',
        content: '',
        file: null
    });

    const inquiryTypes = [
        {value: '계정', label: '계정/로그인 문의'},
        {value: '서비스', label: '서비스 이용 문의'},
        {value: '투자', label: '투자 문의'},
        {value: '오류', label: '오류 신고'},
        {value: '기타', label: '기타'},
    ];

    const handleChange = (event) => {
        const {name, value, files} = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        if (!isLoggedIn) {
            alert('로그인 후 문의를 등록할 수 있습니다.');
            navigate('/login');
            return;
        }

        const title = formData.title.trim();
        const content = formData.content.trim();

        if (!title || !formData.type || !content) {
            alert('제목, 문의 유형, 내용을 모두 입력해 주세요.');
            return;
        }

        try {
            setIsSubmitting(true);

            const inquiryData = {
                category: formData.type,
                title,
                content
            };

            await createInquiry(inquiryData);

            alert('문의가 성공적으로 등록되었습니다.');
            navigate('/inquiry-list');
        } catch (error) {
            console.error('문의 등록 실패:', error);
            console.error('상태 코드:', error.response?.status);
            console.error('응답 데이터:', error.response?.data);

            alert('문의 등록에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <section className={styles.heroSection}>
                    <h1 className={styles.title}>고객센터 문의하기</h1>
                    <p className={styles.subtitle}>
                        서비스 이용 중 궁금한 점이나 오류 내용을 자세히 남겨주시면 확인 후 답변드리겠습니다.
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
                            onClick={() => navigate('/inquiry-list')}
                        >
                            내 문의내역
                        </button>
                    </div>
                </section>

                <section className={styles.formCard}>
                    <div className={styles.formHeader}>
                        <div>
                            <h2>문의 내용 작성</h2>
                        </div>

                        <p>필수 항목을 모두 입력한 뒤 문의를 등록해주세요.</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>제목</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="문의 제목을 입력해주세요."
                                value={formData.title}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>문의 유형</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className={`${styles.input} ${styles.select}`}
                            >
                                <option value="">문의 유형을 선택해주세요</option>
                                {inquiryTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

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

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>첨부 파일</label>

                            <label className={styles.fileWrapper}>
                                <input
                                    type="file"
                                    name="file"
                                    onChange={handleChange}
                                    className={styles.fileInput}
                                />

                                <span className={styles.fileButton}>파일 선택</span>
                                <strong>
                                    {formData.file ? formData.file.name : '선택된 파일이 없습니다.'}
                                </strong>
                            </label>
                        </div>

                        <div className={styles.noticeBox}>
                            <p>답변은 문의 내역에서 확인할 수 있습니다.</p>
                            <p>오류 신고의 경우 화면 캡처 파일을 함께 첨부하면 더 빠르게 확인할 수 있습니다.</p>
                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '등록 중...' : '문의 등록하기'}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default InquiryWrite;
