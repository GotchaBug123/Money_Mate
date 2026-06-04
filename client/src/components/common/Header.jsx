import React from 'react';
import {Link} from 'react-router-dom';
import styles from './Header.module.css';
import moneymateLogo from '../../assets/moneymate_logo.png';

function Header({
                    menuItems,
                    rightButtons,
                    logoTo = '/',
                    logoOnClick,
                }) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    const userName =
        localStorage.getItem('userName') ||
        localStorage.getItem('memberName') ||
        localStorage.getItem('name') ||
        localStorage.getItem('nickname') ||
        localStorage.getItem('userId') ||
        localStorage.getItem('loginId') ||
        localStorage.getItem('id') ||
        '회원';

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        alert('로그아웃 되었습니다.');
        window.location.href = '/';
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
                    <span style={{
                        color: 'var(--color-text-main)',
                        fontSize: '15px',
                        fontWeight: 900,
                        whiteSpace: 'nowrap',
                        marginRight: '4px'
                    }}>
                        {userName}님! 안녕하세요!
                    </span>

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

export default Header;