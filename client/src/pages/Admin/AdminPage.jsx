import React, {useState, useEffect} from 'react';
import Header from '../../components/common/Header';
import MemberManagePage from './MemberManagePage';
import InvestmentManagePage from './InvestmentManagePage';
import CommunityManagePage from './CommunityManagePage';
import CustomerInquiryManagePage from './CustomerInquiryManagePage';
import {getAdminDashboardApi} from '../../api/adminApi.js';
import {getAdminInvestmentSummaryApi} from '../../api/adminApi.js';
import {useAuthStore} from '../../store/useAuthStore.js';
import styles from './AdminPage.module.css';

function AdminPage() {
    const {logout} = useAuthStore();
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [dashboard, setDashboard] = useState({
        memberCount: 0,
        postCount: 0,
        waitingInquiryCount: 0,
    });

    useEffect(() => {
        if (activeMenu !== 'dashboard') return;
        const loadDashboard = async () => {
            try {
                const [dash, invest] = await Promise.all([
                    getAdminDashboardApi(),
                    getAdminInvestmentSummaryApi().catch(() => ({})),
                ]);
                setDashboard({
                    memberCount: dash.userCount ?? 0,
                    postCount: invest.memberCount ?? 0,
                    waitingInquiryCount: dash.waitingInquiryCount ?? 0,
                });
            } catch (error) {
                console.error('대시보드 조회 실패:', error);
            }
        };
        loadDashboard();
    }, [activeMenu]);

    const handleLogout = () => {
        logout();
        // AdminRoute가 user 변경을 감지해 자동 리다이렉트하므로 별도 navigate 불필요
    };

    const adminMenuItems = [
        {label: '대시보드', onClick: () => setActiveMenu('dashboard')},
        {label: '회원관리', onClick: () => setActiveMenu('memberManage')},
        {label: '투자관리', onClick: () => setActiveMenu('investmentManage')},
        {label: '커뮤니티관리', onClick: () => setActiveMenu('communityManage')},
        {label: '고객문의관리', onClick: () => setActiveMenu('customerInquiryManage')},
        {label: '일반 페이지', to: '/'},
    ];

    const adminRightButtons = [
        {label: '관리자 로그아웃', secondary: true, onClick: handleLogout},
    ];

    return (
        <div className={styles.pageWrapper}>
            <Header
                logoTo="/admin"
                logoOnClick={activeMenu !== 'dashboard' ? () => setActiveMenu('dashboard') : undefined}
                menuItems={adminMenuItems}
                rightButtons={adminRightButtons}
            />

            {activeMenu === 'dashboard' && (
                <main className={styles.mainContainer}>
                    <section className={styles.heroSection}>
                        <div>
                            <h1 className={styles.heroTitle}>머니메이트 관리자 센터</h1>
                            <p className={styles.heroDesc}>
                                회원, 투자, 커뮤니티, 고객 문의 등 서비스 전체 현황을 한눈에 파악하고 관리하세요.
                            </p>
                        </div>
                    </section>

                    <section className={styles.cardGrid}>
                        <button className={styles.dashboardCard} onClick={() => setActiveMenu('memberManage')}>
                            <span className={styles.cardIcon}>👥</span>
                            <h2 className={styles.cardTitle}>회원관리</h2>
                            <p className={styles.cardDesc}>전체 회원 목록 조회, 상세 정보 수정 및 탈퇴 처리를 관리합니다.</p>
                            <strong className={styles.cardHighlight}>총 {dashboard.memberCount}명</strong>
                        </button>

                        <button className={styles.dashboardCard} onClick={() => setActiveMenu('investmentManage')}>
                            <span className={styles.cardIcon}>📈</span>
                            <h2 className={styles.cardTitle}>투자관리</h2>
                            <p className={styles.cardDesc}>투자 상품, 포트폴리오 성과 및 수익률 통계를 모니터링합니다.</p>
                            <strong className={styles.cardHighlight}>활성 상품 현황</strong>
                        </button>

                        <button className={styles.dashboardCard} onClick={() => setActiveMenu('communityManage')}>
                            <span className={styles.cardIcon}>💬</span>
                            <h2 className={styles.cardTitle}>커뮤니티관리</h2>
                            <p className={styles.cardDesc}>게시글 모니터링, 부적절한 콘텐츠 블라인드 및 삭제를 진행합니다.</p>
                            <strong className={styles.cardHighlight}>게시글 {dashboard.postCount}개</strong>
                        </button>

                        <button className={styles.dashboardCard} onClick={() => setActiveMenu('customerInquiryManage')}>
                            <span className={styles.cardIcon}>🎧</span>
                            <h2 className={styles.cardTitle}>고객문의관리</h2>
                            <p className={styles.cardDesc}>문의 답변, 삭제 조치, 처리 상태를 관리합니다.</p>
                            <strong className={styles.cardHighlight}>대기 {dashboard.waitingInquiryCount}건</strong>
                        </button>
                    </section>
                </main>
            )}

            {activeMenu === 'memberManage' && <MemberManagePage/>}
            {activeMenu === 'investmentManage' && <InvestmentManagePage/>}
            {activeMenu === 'communityManage' && <CommunityManagePage/>}
            {activeMenu === 'customerInquiryManage' && <CustomerInquiryManagePage/>}
        </div>
    );
}

export default AdminPage;
