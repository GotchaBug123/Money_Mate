import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './CustomerFeedback.module.css';
import {getInquiryCategories, createInquiry} from '../../api/customerServiceApi.js';

const FALLBACK_TYPES = [
    {categoryId: null, categoryName: '💡 서비스 제안'},
    {categoryId: null, categoryName: '👏 칭찬해요'},
    {categoryId: null, categoryName: '😞 불편해요'},
    {categoryId: null, categoryName: '기타 의견'},
];

function CustomerFeedback() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState(FALLBACK_TYPES);
    const [formData, setFormData] = useState({
        categoryId: null,
        title: '',
        content: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getInquiryCategories();
                const list = Array.isArray(data) ? data : (data.categories ?? []);
                if (list.length > 0) {
                    setCategories(list);
                    setFormData(prev => ({...prev, categoryId: list[0].categoryId}));
                }
            } catch (error) {
                console.error('카테고리 조회 실패:', error);
            }
        };
        loadCategories();
    }, []);

    const handleTypeSelect = (categoryId) => {
        setFormData(prev => ({...prev, categoryId}));
    };

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.title.trim() || !formData.content.trim()) {
            alert('제목과 내용을 모두 입력해 주세요.');
            return;
        }

        setSubmitting(true);
        try {
            await createInquiry({
                categoryId: formData.categoryId,
                title: formData.title,
                content: formData.content,
            });
            alert('소중한 의견이 성공적으로 접수되었습니다. 더 나은 머니메이트가 되겠습니다!');
            navigate('/customer-service');
        } catch (error) {
            console.error('의견 제출 실패:', error);
            alert('제출 중 오류가 발생했습니다. 다시 시도해 주세요.');
        } finally {
            setSubmitting(false);
        }
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
                                {categories.map((cat) => (
                                    <button
                                        key={cat.categoryId ?? cat.categoryName}
                                        type="button"
                                        className={`${styles.chip} ${formData.categoryId === cat.categoryId ? styles.chipActive : ''}`}
                                        onClick={() => handleTypeSelect(cat.categoryId)}
                                    >
                                        {cat.categoryName}
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

                        <button type="submit" className={styles.submitBtn} disabled={submitting}>
                            {submitting ? '제출 중...' : '의견 보내기'}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default CustomerFeedback;