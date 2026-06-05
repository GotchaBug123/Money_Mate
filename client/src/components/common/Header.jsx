import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import styles from './Header.module.css';
import moneymateLogo from '../../assets/moneymate_logo.png';
import {useAuthStore} from '../../store/useAuthStore'; // 💡 Zustand 스토어 가져오기
import {logoutApi} from '../../api/authApi';           // 💡 로그아웃 API 가져오기

function Header({
                    menuItems,
                    rightButtons,
                    logoTo = '/',
                    logoOnClick,
                }) {
    const navigate = useNavigate();

    const {isLoggedIn, user, logout} = useAuthStore();

    const userName = user?.name || '회원';

    const handleLogout = async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.error('백엔드 로그아웃 실패:', error);
        } finally {
            logout();
            alert('로그아웃 되었습니다.');
            navigate('/');
        }
    };

    const defaultMenuItems = [
        {label: 'MY자산', to: '/asset'},
        {label: '포트폴리오', to: '/portfolio'},
        {label: '리밸런싱', to: '/rebalancing'},
        {label: '투자정보', to: '/investment-information'},
        {label: '커뮤니티', to: '/community'},
        {label: '고객센터', to: '/customer-service'},
    ];

    const finalMenuItems = menuItems || defaultMenuItems;

    const renderRightButtons = () => {
        if (rightButtons) {
            return rightButtons.map((button) => {
                const btnClass = button.primary
                    ? `${styles.actionBtn} ${styles.primaryBtn}`
                    : `${styles.actionBtn} ${styles.secondaryBtn}`;

                if (button.to) {
                    return (
                        <Link key={button.label} to={button.to} className={btnClass}>
                            {button.label}
                        </Link>
                    );
                }

                return (
                    <button key={button.label} type="button" onClick={button.onClick} className={btnClass}>
                        {button.label}
                    </button>
                );
            });
        }

        if (isLoggedIn) {
            return (
                <>
                    <div style={userNameStyle}>
                        <span style={{fontSize: '20px', lineHeight: 1}}>🙂</span>
                        <span style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: 'var(--color-text-main)',
                            whiteSpace: 'nowrap'
                        }}>
                            {userName}님
                        </span>
                    </div>

                    <Link to="/mypage" className={`${styles.actionBtn} ${styles.secondaryBtn}`}>
                        내 정보
                    </Link>

                    <button onClick={handleLogout} className={`${styles.actionBtn} ${styles.secondaryBtn}`}>
                        로그아웃
                    </button>
                </>
            );
        }

        return (
            <>
                <Link to="/login" className={`${styles.actionBtn} ${styles.secondaryBtn}`}>
                    로그인
                </Link>
                <Link to="/signup" className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                    회원가입
                </Link>
            </>
        );
    };

    return (
        <header className={styles.headerWrapper}>
            <div className={styles.container}>
                <div className={styles.leftSection}>
                    <Link to={logoTo} onClick={logoOnClick} className={styles.logoLink}>
                        <img
                            src={moneymateLogo}
                            alt="MoneyMate 로고"
                            className={styles.logoImg}
                        />
                        <span style={logoTextStyle}>MoneyMate</span>
                    </Link>

                    <nav className={styles.nav}>
                        {finalMenuItems.map((item) => {
                            if (item.to) {
                                return (
                                    <Link key={item.label} to={item.to} className={styles.navItem}>
                                        {item.label}
                                    </Link>
                                );
                            }
                            return (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={item.onClick}
                                    className={styles.navItem}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className={styles.rightSection}>
                    {renderRightButtons()}
                </div>
            </div>
        </header>
    );
}

const logoTextStyle = {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--color-primary, #2563EB)',
    letterSpacing: '-0.3px',
    marginLeft: '6px',
};

const userNameStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
};

export default Header;