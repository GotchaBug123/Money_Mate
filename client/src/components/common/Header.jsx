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

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        alert('로그아웃 되었습니다.');
        window.location.href = '/'; // 상태 갱신을 위해 메인으로 이동하며 새로고침
    };

    const defaultMenuItems = [
        {label: 'MY자산', to: '/asset'},
        {label: '포트폴리오', to: '/portfolio'},
        {label: '리밸런싱', to: '/rebalancing'},
        {label: '투자정보', to: '/investment-information'},
        {label: '커뮤니티', to: '/community'},
    ];

    const finalMenuItems = menuItems || defaultMenuItems;

    // 우측 버튼 렌더링 로직
    const renderRightButtons = () => {
        // 1. 외부에서 커스텀 버튼을 주입한 경우
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

        // 2. 로그인 상태인 경우
        if (isLoggedIn) {
            return (
                <>
                    <Link to="/mypage" className={`${styles.actionBtn} ${styles.secondaryBtn}`}>
                        내 정보
                    </Link>
                    <button onClick={handleLogout} className={`${styles.actionBtn} ${styles.secondaryBtn}`}>
                        로그아웃
                    </button>
                </>
            );
        }

        // 3. 로그아웃 상태인 경우 (기본)
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

                {/* 왼쪽: 로고 및 내비게이션 메뉴 */}
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

                {/* 오른쪽: 로그인/회원가입 등 액션 버튼 */}
                <div className={styles.rightSection}>
                    {renderRightButtons()}
                </div>

            </div>
        </header>
    );
}

export default Header;