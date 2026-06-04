// src/pages/CustomerService/Notice.jsx

import React, {useState} from 'react';
import styles from './Notice.module.css';

// 💡 백엔드 연결 전 임시 Mock 데이터
const MOCK_NOTICES = [
    {
        id: 1,
        type: '공지',
        title: 'MoneyMate 시스템 점검 안내 (6/10)',
        date: '2026-06-02',
        content: `안녕하세요. MoneyMate입니다.\n\n더 나은 서비스 제공을 위해 아래와 같이 시스템 점검이 진행될 예정입니다.\n\n- 점검 일시: 2026년 6월 10일(수) 02:00 ~ 06:00 (4시간)\n- 점검 내용: DB 서버 안정화 및 AI 포트폴리오 알고리즘 업데이트\n- 서비스 영향: 점검 시간 동안 서비스 접속 및 이용 불가\n\n이용에 불편을 드려 죄송합니다. 항상 발전하는 머니메이트가 되겠습니다.\n감사합니다.`
    },
    {
        id: 2,
        type: '업데이트',
        title: '신규 테마 포트폴리오 (AI, 반도체) 추가 안내',
        date: '2026-05-28',
        content: `안녕하세요!\n새로운 투자 테마인 "AI"와 "반도체" 섹터가 포트폴리오 자동 생성 알고리즘에 추가되었습니다.\n\n이제 맞춤형 진단을 통해 더 다양한 글로벌 메가 트렌드 포트폴리오를 만나보실 수 있습니다.\n많은 이용 부탁드립니다.`
    },
    {
        id: 3,
        type: '공지',
        title: '개인정보처리방침 개정 사전 안내',
        date: '2026-05-15',
        content: `머니메이트를 이용해 주시는 회원 여러분께 감사드립니다.\n개인정보처리방침이 2026년 6월 1일부로 일부 개정될 예정입니다.\n\n자세한 개정 사항은 하단 푸터의 '개인정보처리방침' 페이지를 참고해 주시기 바랍니다.`
    }
];

function Notice() {
    // 현재 펼쳐져 있는 공지사항의 ID를 추적 (null이면 모두 닫힌 상태)
    const [expandedId, setExpandedId] = useState(null);

    const toggleAccordion = (id) => {
        // 이미 열려있는 항목을 누르면 닫고, 다른 항목을 누르면 그 항목을 엽니다.
        setExpandedId((prevId) => (prevId === id ? null : id));
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>

                <div className={styles.headerRow}>
                    <h2 className={styles.title}>공지사항</h2>
                </div>

                <div className={styles.listCard}>
                    {MOCK_NOTICES.map((notice) => {
                        const isOpen = expandedId === notice.id;

                        return (
                            <div key={notice.id} className={styles.noticeItem}>
                                {/* 아코디언 헤더 (클릭 영역) */}
                                <div
                                    className={styles.noticeHead}
                                    onClick={() => toggleAccordion(notice.id)}
                                >
                                    <span
                                        className={`${styles.badge} ${notice.type === '업데이트' ? styles.badgeUpdate : styles.badgeNotice}`}>
                                        {notice.type}
                                    </span>
                                    <p className={styles.itemTitle}>{notice.title}</p>
                                    <span className={styles.itemDate}>{notice.date}</span>

                                    {/* 💡 화살표 아이콘 (열림 여부에 따라 회전 애니메이션 적용) */}
                                    <div className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`}>
                                        ▼
                                    </div>
                                </div>

                                {/* 아코디언 바디 (펼쳐지는 본문) */}
                                {isOpen && (
                                    <div className={styles.noticeBody}>
                                        {notice.content}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* 하단 페이지네이션 영역 */}
                    <div className={styles.pagination}>
                        <button className={styles.pageBtn}>
                            &lt; 1 &gt;
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Notice;