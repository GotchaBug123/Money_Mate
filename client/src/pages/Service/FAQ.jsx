import React, {useState} from 'react';
import styles from './FAQ.module.css';

const CATEGORIES = ['전체', '포트폴리오', '회원/계정', '서비스 이용'];

const MOCK_FAQS = [
    {
        id: 1,
        category: '포트폴리오',
        question: '포트폴리오 시뮬레이션 결과는 실제 수익률과 동일한가요?',
        answer: '아닙니다. 포트폴리오 시뮬레이션 결과는 어디까지나 과거의 시장 데이터(백테스트)를 기반으로 산출된 가상의 결과치입니다.\n따라서 미래의 실제 수익률을 보장하지 않으며, 투자 의사결정을 위한 참고 자료로만 활용해 주시길 바랍니다.'
    },
    {
        id: 2,
        category: '포트폴리오',
        question: '직접 생성한 포트폴리오의 비중을 수정하고 싶어요.',
        answer: '직접 생성하신 포트폴리오는 [포트폴리오 메인] > [내 포트폴리오 상세 결과 보기] 페이지에서 하단의 "직접 만들어 다시하기" 버튼을 클릭하여 종목 추가/삭제 및 비중을 재조정하실 수 있습니다.'
    },
    {
        id: 3,
        category: '회원/계정',
        question: '비밀번호를 잊어버렸습니다. 어떻게 찾을 수 있나요?',
        answer: '로그인 화면 하단의 [비밀번호 찾기] 메뉴를 통해 가입 시 등록하신 이메일 주소를 입력하시면, 해당 이메일로 임시 비밀번호 또는 비밀번호 재설정 링크를 발송해 드립니다.'
    },
    {
        id: 4,
        category: '회원/계정',
        question: '회원 탈퇴는 어디서 할 수 있나요?',
        answer: '로그인 후 [마이페이지] 하단에 위치한 "회원 탈퇴" 버튼을 클릭하시면 진행하실 수 있습니다.\n단, 회원 탈퇴 시 기존에 진단받으셨던 재무/투자 성향 내역과 저장된 포트폴리오 정보는 모두 안전하게 파기되며 복구할 수 없으니 유의해 주시기 바랍니다.'
    },
    {
        id: 5,
        category: '서비스 이용',
        question: '투자 성향 진단은 몇 번이고 다시 할 수 있나요?',
        answer: '네, 가능합니다! 시장 상황이나 고객님의 자산 상태가 변할 때마다 언제든지 [재무 진단] 메뉴를 통해 새롭게 진단을 받아보실 수 있습니다. 새롭게 받은 진단 결과를 바탕으로 AI 포트폴리오도 새롭게 추천받으실 수 있습니다.'
    }
];

function FAQ() {
    const [activeCategory, setActiveCategory] = useState('전체');
    const [expandedId, setExpandedId] = useState(null);

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        setExpandedId(null);
    };

    const toggleAccordion = (id) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };

    const filteredFaqs = activeCategory === '전체'
        ? MOCK_FAQS
        : MOCK_FAQS.filter((faq) => faq.category === activeCategory);

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <section className={styles.heroSection}>
                    <span className={styles.pageBadge}>FAQ</span>
                    <h1 className={styles.title}>자주하는 질문</h1>
                    <p className={styles.subtitle}>
                        MoneyMate 이용 중 자주 묻는 질문을 카테고리별로 확인하세요.
                    </p>
                </section>

                <section className={styles.faqSummary}>
                    <div>
                        <span>전체 질문</span>
                        <strong>{MOCK_FAQS.length}개</strong>
                    </div>
                    <div>
                        <span>현재 카테고리</span>
                        <strong>{activeCategory}</strong>
                    </div>
                    <div>
                        <span>조회 결과</span>
                        <strong>{filteredFaqs.length}개</strong>
                    </div>
                </section>

                <section className={styles.categoryTabs}>
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            type="button"
                            className={`${styles.tabBtn} ${activeCategory === category ? styles.tabBtnActive : ''}`}
                            onClick={() => handleCategoryClick(category)}
                        >
                            {category}
                        </button>
                    ))}
                </section>

                <section className={styles.listCard}>
                    <div className={styles.listHeader}>
                        <div>
                            <span className={styles.sectionBadge}>FAQ List</span>
                            <h2>{activeCategory} 질문</h2>
                        </div>
                        <p>질문을 누르면 답변을 확인할 수 있습니다.</p>
                    </div>

                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq) => {
                            const isOpen = expandedId === faq.id;

                            return (
                                <article key={faq.id} className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}>
                                    <button
                                        type="button"
                                        className={styles.faqHead}
                                        onClick={() => toggleAccordion(faq.id)}
                                    >
                                        <span className={styles.qMark}>Q</span>

                                        <span className={styles.itemText}>
                                            <span className={styles.categoryBadge}>
                                                {faq.category}
                                            </span>
                                            <span className={styles.itemTitle}>
                                                {faq.question}
                                            </span>
                                        </span>

                                        <span className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`}>
                                            ▼
                                        </span>
                                    </button>

                                    {isOpen && (
                                        <div className={styles.faqBody}>
                                            <span className={styles.aMark}>A</span>
                                            <p className={styles.answerText}>{faq.answer}</p>
                                        </div>
                                    )}
                                </article>
                            );
                        })
                    ) : (
                        <div className={styles.emptyState}>
                            해당 카테고리에 등록된 자주하는 질문이 없습니다.
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default FAQ;