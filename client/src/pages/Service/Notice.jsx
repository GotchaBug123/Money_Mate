import React, {useState} from 'react';
import styles from './Notice.module.css';

const MOCK_NOTICES = [
    {
        id: 1,
        type: '공지',
        title: 'MoneyMate 시스템 점검 안내 (6/10)',
        date: '2026-06-02',
        content: `안녕하세요. MoneyMate입니다.

더 나은 서비스 제공을 위해 아래와 같이 시스템 점검이 진행될 예정입니다.

- 점검 일시: 2026년 6월 10일(수) 02:00 ~ 06:00 (4시간)
- 점검 내용: DB 서버 안정화 및 AI 포트폴리오 알고리즘 업데이트
- 서비스 영향: 점검 시간 동안 서비스 접속 및 이용 불가

이용에 불편을 드려 죄송합니다. 항상 발전하는 머니메이트가 되겠습니다.
감사합니다.`
    },
    {
        id: 2,
        type: '업데이트',
        title: '신규 테마 포트폴리오 (AI, 반도체) 추가 안내',
        date: '2026-05-28',
        content: `안녕하세요!

새로운 투자 테마인 "AI"와 "반도체" 섹터가 포트폴리오 자동 생성 알고리즘에 추가되었습니다.

이제 맞춤형 진단을 통해 더 다양한 글로벌 메가 트렌드 포트폴리오를 만나보실 수 있습니다.
많은 이용 부탁드립니다.`
    },
    {
        id: 3,
        type: '공지',
        title: '개인정보처리방침 개정 사전 안내',
        date: '2026-05-15',
        content: `머니메이트를 이용해 주시는 회원 여러분께 감사드립니다.

개인정보처리방침이 2026년 6월 1일부로 일부 개정될 예정입니다.

자세한 개정 사항은 하단 푸터의 '개인정보처리방침' 페이지를 참고해 주시기 바랍니다.`
    }
];

function Notice() {
    const [expandedId, setExpandedId] = useState(null);

    const toggleAccordion = (id) => {
        setExpandedId((prevId) => (prevId === id ? null : id));
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <section className={styles.heroSection}>
                    <span className={styles.pageBadge}>Notice</span>
                    <h1 className={styles.title}>공지사항</h1>
                    <p className={styles.subtitle}>
                        MoneyMate의 서비스 점검, 업데이트, 중요 안내를 확인하세요.
                    </p>
                </section>

                <section className={styles.noticeSummary}>
                    <div>
                        <span>전체 공지</span>
                        <strong>{MOCK_NOTICES.length}개</strong>
                    </div>
                    <div>
                        <span>최근 공지</span>
                        <strong>{MOCK_NOTICES[0].date}</strong>
                    </div>
                    <div>
                        <span>업데이트</span>
                        <strong>{MOCK_NOTICES.filter((notice) => notice.type === '업데이트').length}개</strong>
                    </div>
                </section>

                <section className={styles.listCard}>
                    <div className={styles.listHeader}>
                        <div>
                            <span className={styles.sectionBadge}>Notice List</span>
                            <h2>공지 목록</h2>
                        </div>
                        <p>제목을 누르면 자세한 내용을 확인할 수 있습니다.</p>
                    </div>

                    {MOCK_NOTICES.map((notice) => {
                        const isOpen = expandedId === notice.id;

                        return (
                            <article key={notice.id} className={`${styles.noticeItem} ${isOpen ? styles.noticeItemOpen : ''}`}>
                                <button
                                    type="button"
                                    className={styles.noticeHead}
                                    onClick={() => toggleAccordion(notice.id)}
                                >
                                    <span
                                        className={`${styles.badge} ${
                                            notice.type === '업데이트' ? styles.badgeUpdate : styles.badgeNotice
                                        }`}
                                    >
                                        {notice.type}
                                    </span>

                                    <span className={styles.itemTitle}>{notice.title}</span>
                                    <span className={styles.itemDate}>{notice.date}</span>
                                    <span className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`}>
                                        ▼
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className={styles.noticeBody}>
                                        {notice.content}
                                    </div>
                                )}
                            </article>
                        );
                    })}

                    <div className={styles.pagination}>
                        <button type="button" className={styles.pageBtn}>
                            &lt; 1 &gt;
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Notice;