import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './CustomerFeedback.module.css';

const FEEDBACK_TYPES = [
    '💡 서비스 제안',
    '👏 칭찬해요',
    '😞 불편해요',
    '기타 의견'
];

function CustomerFeedback() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        type: '💡 서비스 제안',
        title: '',
        content: ''
    });

    const handleTypeSelect = (selectedType) => {
        setFormData((prev) => ({
            ...prev,
            type: selectedType
        }));
    };

    const handleChange = (event) => {
        const {name, value} = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!formData.title.trim() || !formData.content.trim()) {
            alert('제목과 내용을 모두 입력해 주세요.');
            return;
        }

        alert('소중한 의견이 성공적으로 접수되었습니다. 더 나은 머니메이트가 되겠습니다!');
        navigate('/customer-service');
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <button
                    type="button"
                    className={styles.backButton}
                    onClick={() => navigate('/customer-service')}
                >
                    &lt; 고객센터로 돌아가기
                </button>

                <section className={styles.heroSection}>
                    <span className={styles.pageBadge}>Customer Voice</span>
                    <h1 className={styles.title}>고객의 소리</h1>
                    <p className={styles.subtitle}>
                        머니메이트를 이용하시면서 느꼈던 칭찬, 불편, 제안 등
                        여러분의 소중한 의견을 자유롭게 남겨주세요.
                    </p>
                </section>

                <section className={styles.formCard}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>어떤 의견을 남겨주시겠어요?</label>

                            <div className={styles.typeChips}>
                                {FEEDBACK_TYPES.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        className={`${styles.chip} ${formData.type === type ? styles.chipActive : ''}`}
                                        onClick={() => handleTypeSelect(type)}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>제목</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="의견의 핵심을 짧게 적어주세요."
                                value={formData.title}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>상세 내용</label>
                            <textarea
                                name="content"
                                placeholder="서비스 이용 중 좋았던 점이나 개선이 필요한 점을 자유롭게 적어주세요."
                                value={formData.content}
                                onChange={handleChange}
                                className={`${styles.input} ${styles.textarea}`}
                            />
                        </div>

                        <div className={styles.noticeBox}>
                            <p>등록해주신 의견은 서비스 개선을 위한 소중한 자료로 활용됩니다.</p>
                            <p>개별 답변이 필요한 이용 문의나 오류 신고는 고객센터 문의하기를 이용해 주세요.</p>
                        </div>

                        <button type="submit" className={styles.submitBtn}>
                            의견 보내기
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default CustomerFeedback;