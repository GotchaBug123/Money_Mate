import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Header from '../../components/common/Header';
import MemberManagePage from './MemberManagePage';
import InvestmentManagePage from './InvestmentManagePage';
import CommunityManagePage from './CommunityManagePage';
import CustomerInquiryManagePage from './CustomerInquiryManagePage';

import styles from './AdminPage.module.css'; // 💡 모듈 CSS 불러오기

function AdminPage({
                       onLogout,
                       posts: externalPosts,
                       onUpdatePost,
                       onDeletePost,
                   }) {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('dashboard');

    // 💡 기존의 상태 데이터 (Members, Inquiries 등) 그대로 유지
    const [members, setMembers] = useState([
        {
            memberNo: '1', userId: 'admin01', name: '김관리', birthDate: '1998-03-15',
            joinedAt: '2026-05-01', phone: '010-1234-5678', email: 'admin01@moneymate.com',
        },
        {
            memberNo: '2', userId: 'user01', name: '이회원', birthDate: '2000-07-22',
            joinedAt: '2026-05-10', phone: '010-2222-3333', email: 'user01@moneymate.com',
        },
    ]);
    const [posts, setPosts] = useState(externalPosts || []);
    const [inquiries, setInquiries] = useState([
        {inquiryNo: '1', status: '대기'}
    ]);
    const waitingInquiryCount = inquiries.filter(inq => inq.status === '대기').length;

    // 핸들러 함수들 (기존 로직 유지)
    const handleDeleteMember = () => { /* ... */
    };
    const handleUpdateMember = () => { /* ... */
    };
    const handleUpdatePost = () => { /* ... */
    };
    const handleDeletePost = () => { /* ... */
    };
    const handleAnswerInquiry = () => { /* ... */
    };
    const handleDeleteInquiry = () => { /* ... */
    };

    // 관리자 전용 헤더 메뉴 구성
    const adminMenuItems = [
        {label: '대시보드', onClick: () => setActiveMenu('dashboard')},
        {label: '회원관리', onClick: () => setActiveMenu('memberManage')},
        {label: '투자관리', onClick: () => setActiveMenu('investmentManage')},
        {label: '커뮤니티관리', onClick: () => setActiveMenu('communityManage')},
        {label: '고객문의관리', onClick: () => setActiveMenu('customerInquiryManage')},
    ];

    const adminRightButtons = [
        {
            label: '관리자 로그아웃',
            secondary: true,
            onClick: () => {
                if (onLogout) onLogout();
                else navigate('/login');
            }
        }
    ];

    return (
        <div className={styles.pageWrapper}>

            {/* 💡 관리자용 커스텀 헤더 적용 */}
            <Header
                logoTo="/admin"
                logoOnClick={() => setActiveMenu('dashboard')}
                menuItems={adminMenuItems}
                rightButtons={adminRightButtons}
            />

            {activeMenu === 'dashboard' && (
                <main className={styles.mainContainer}>
                    <section className={styles.heroSection}>
                        <div>
                            <span className={styles.eyebrow}>Administrator Dashboard</span>
                            <h1 className={styles.heroTitle}>머니메이트 관리자 센터</h1>
                            <p className={styles.heroDesc}>
                                회원, 투자, 커뮤니티, 고객 문의 등 서비스 전체 현황을 한눈에 파악하고 관리하세요.
                            </p>
                        </div>
                    </section>

                    <section className={styles.cardGrid}>
                        <button
                            className={styles.dashboardCard}
                            onClick={() => setActiveMenu('memberManage')}
                        >
                            <span className={styles.cardIcon}>👥</span>
                            <h2 className={styles.cardTitle}>회원관리</h2>
                            <p className={styles.cardDesc}>전체 회원 목록 조회, 상세 정보 수정 및 탈퇴 처리를 관리합니다.</p>
                            <strong className={styles.cardHighlight}>총 {members.length}명</strong>
                        </button>

                        <button
                            className={styles.dashboardCard}
                            onClick={() => setActiveMenu('investmentManage')}
                        >
                            <span className={styles.cardIcon}>📈</span>
                            <h2 className={styles.cardTitle}>투자관리</h2>
                            <p className={styles.cardDesc}>투자 상품, 포트폴리오 성과 및 수익률 통계를 모니터링합니다.</p>
                            <strong className={styles.cardHighlight}>활성 상품 현황</strong>
                        </button>

                        <button
                            className={styles.dashboardCard}
                            onClick={() => setActiveMenu('communityManage')}
                        >
                            <span className={styles.cardIcon}>💬</span>
                            <h2 className={styles.cardTitle}>커뮤니티관리</h2>
                            <p className={styles.cardDesc}>게시글 모니터링, 부적절한 콘텐츠 블라인드 및 삭제를 진행합니다.</p>
                            <strong className={styles.cardHighlight}>게시글 {posts.length}개</strong>
                        </button>

                        <button
                            className={styles.dashboardCard}
                            onClick={() => setActiveMenu('customerInquiryManage')}
                        >
                            <span className={styles.cardIcon}>🎧</span>
                            <h2 className={styles.cardTitle}>고객문의관리</h2>
                            <p className={styles.cardDesc}>문의 답변, 삭제 조치, 처리 상태를 관리합니다.</p>
                            <strong className={styles.cardHighlight}>대기 {waitingInquiryCount}건</strong>
                        </button>
                    </section>
                </main>
            )}

            {/* 서브 페이지 라우팅 */}
            {activeMenu === 'memberManage' && (
                <MemberManagePage
                    members={members}
                    onDeleteMember={handleDeleteMember}
                    onUpdateMember={handleUpdateMember}
                />
            )}

            {activeMenu === 'investmentManage' && (
                <InvestmentManagePage/>
            )}

            {activeMenu === 'communityManage' && (
                <CommunityManagePage
                    posts={posts}
                    onUpdatePost={handleUpdatePost}
                    onDeletePost={handleDeletePost}
                />
            )}

            {activeMenu === 'customerInquiryManage' && (
                <CustomerInquiryManagePage
                    inquiries={inquiries}
                    onAnswerInquiry={handleAnswerInquiry}
                    onDeleteInquiry={handleDeleteInquiry}
                />
            )}
        </div>
    );
}

export default AdminPage;