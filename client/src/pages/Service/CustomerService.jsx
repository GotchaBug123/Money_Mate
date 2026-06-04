import React from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './CustomerService.module.css';

function CustomerService() {
    const navigate = useNavigate();

    const noticeItems = [
        {
            type: '공지',
            title: 'MoneyMate 시스템 점검 안내',
            date: '2026-06-02',
        },
        {
            type: '업데이트',
            title: '신규 테마 포트폴리오 추가 안내',
            date: '2026-05-28',
        },
        {
            type: '공지',
            title: '개인정보처리방침 개정 사전 안내',
            date: '2026-05-15',
        },
    ];

    const faqItems = [
        '포트폴리오 결과는 실제 수익률과 동일한가요?',
        '직접 만든 포트폴리오를 수정할 수 있나요?',
        '비밀번호를 잊어버렸습니다.',
        '투자 성향 진단은 다시 할 수 있나요?',
    ];

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <section className={styles.heroSection}>
                    <h1 className={styles.title}>무엇을 도와드릴까요?</h1>
                    <p className={styles.subtitle}>
                        MoneyMate 이용 중 궁금한 점을 빠르게 확인하고, 필요한 경우 문의를 남겨보세요.
                    </p>

                    <div className={styles.heroButtons}>
                        <button
                            type="button"
                            onClick={() => navigate('/inquiry-write')}
                        >
                            문의하기
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/inquiry-list')}
                        >
                            내 문의내역
                        </button>
                    </div>
                </section>

                <section className={styles.quickGrid}>
                    <button
                        type="button"
                        className={styles.quickCard}
                        onClick={() => navigate('/notice')}
                    >
                        <span className={styles.quickIcon}>📢</span>
                        <strong>공지사항</strong>
                        <p>서비스 점검, 업데이트, 중요 안내를 확인합니다.</p>
                    </button>

                    <button
                        type="button"
                        className={styles.quickCard}
                        onClick={() => navigate('/faq')}
                    >
                        <span className={styles.quickIcon}>❓</span>
                        <strong>자주하는 질문</strong>
                        <p>포트폴리오, 계정, 서비스 이용 관련 질문을 확인합니다.</p>
                    </button>

                    <button
                        type="button"
                        className={styles.quickCard}
                        onClick={() => navigate('/stock-guide')}
                    >
                        <span className={styles.quickIcon}>📈</span>
                        <strong>주식 준비 5단계</strong>
                        <p>초보자를 위한 투자 시작 가이드를 확인합니다.</p>
                    </button>

                    <button
                        type="button"
                        className={styles.quickCard}
                        onClick={() => navigate('/customer-feedback')}
                    >
                        <span className={styles.quickIcon}>💬</span>
                        <strong>고객의 소리</strong>
                        <p>서비스 제안, 칭찬, 불편사항을 자유롭게 남깁니다.</p>
                    </button>
                </section>

                <section className={styles.previewGrid}>
                    <article className={styles.previewCard}>
                        <div className={styles.sectionHeader}>
                            <div>
                                <span className={styles.sectionBadge}>Notice</span>
                                <h2>최근 공지사항</h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate('/notice')}
                            >
                                더보기
                            </button>
                        </div>

                        <div className={styles.noticeList}>
                            {noticeItems.map((notice) => (
                                <button
                                    key={`${notice.type}-${notice.title}`}
                                    type="button"
                                    onClick={() => navigate('/notice')}
                                    className={styles.noticeItem}
                                >
                                    <span className={notice.type === '업데이트' ? styles.updateBadge : styles.noticeBadge}>
                                        {notice.type}
                                    </span>

                                    <strong>{notice.title}</strong>
                                    <em>{notice.date}</em>
                                </button>
                            ))}
                        </div>
                    </article>

                    <article className={styles.previewCard}>
                        <div className={styles.sectionHeader}>
                            <div>
                                <span className={styles.sectionBadge}>FAQ</span>
                                <h2>자주하는 질문</h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate('/faq')}
                            >
                                더보기
                            </button>
                        </div>

                        <div className={styles.faqList}>
                            {faqItems.map((faq) => (
                                <button
                                    key={faq}
                                    type="button"
                                    onClick={() => navigate('/faq')}
                                    className={styles.faqItem}
                                >
                                    <span>Q</span>
                                    <strong>{faq}</strong>
                                </button>
                            ))}
                        </div>
                    </article>
                </section>

                <section className={styles.bottomGrid}>
                    <article className={styles.guideCard}>
                        <span className={styles.sectionBadge}>Stock Guide</span>
                        <h2>투자 시작이 처음이라면</h2>
                        <p>
                            계좌 개설부터 투자 성향 진단, 포트폴리오 구성, 리밸런싱까지
                            주식 투자를 시작하기 위한 흐름을 단계별로 확인해보세요.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate('/stock-guide')}
                        >
                            주식 준비 5단계 보기
                        </button>
                    </article>

                    <article className={styles.feedbackCard}>
                        <span className={styles.sectionBadge}>Customer Voice</span>
                        <h2>서비스 의견을 남겨주세요</h2>
                        <p>
                            MoneyMate를 이용하면서 좋았던 점, 불편했던 점, 추가되었으면 하는 기능을 알려주세요.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate('/customer-feedback')}
                        >
                            고객의 소리 작성
                        </button>
                    </article>
                </section>
            </div>
        </div>
    );
}

export default CustomerService;