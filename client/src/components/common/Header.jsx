import React from 'react';
import {Link} from 'react-router-dom';
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

    const btnStyle = {
        padding: '8px 16px',
        borderRadius: '4px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer'
    };

    const navButtonStyle = {
        border: 'none',
        backgroundColor: 'transparent',
        padding: 0,
        fontSize: 'inherit',
        fontWeight: '500',
        cursor: 'pointer'
    };

    const renderRightButtons = () => {
        if (rightButtons) {
            return rightButtons.map((button) => {
                if (button.to) {
                    return (
                        <Link
                            key={button.label}
                            to={button.to}
                            style={{
                                ...btnStyle,
                                backgroundColor: button.primary ? 'var(--primary-color)' : 'white',
                                color: button.primary ? 'white' : 'var(--text-main)',
                                border: button.primary ? 'none' : '1px solid var(--border-color)'
                            }}
                        >
                            {button.label}
                        </Link>
                    );
                }

                return (
                    <button
                        key={button.label}
                        type="button"
                        onClick={button.onClick}
                        style={{
                            ...btnStyle,
                            backgroundColor: button.primary ? 'var(--primary-color)' : 'white',
                            color: button.primary ? 'white' : 'var(--text-main)',
                            border: button.primary ? 'none' : '1px solid var(--border-color)'
                        }}
                    >
                        {button.label}
                    </button>
                );
            });
        }

        if (isLoggedIn) {
            return (
                <>
                    <Link to="/mypage" style={{
                        ...btnStyle,
                        backgroundColor: 'var(--bg-color)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-color)'
                    }}>
                        내 정보
                    </Link>
                    <button onClick={handleLogout} style={{
                        ...btnStyle,
                        backgroundColor: 'white',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-color)'
                    }}>
                        로그아웃
                    </button>
                </>
            );
        }

        return (
            <>
                <Link to="/login" style={{
                    ...btnStyle,
                    backgroundColor: 'white',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-color)'
                }}>
                    로그인
                </Link>
                <Link to="/signup" style={{
                    ...btnStyle,
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    border: 'none'
                }}>
                    회원가입
                </Link>
            </>
        );
    };

    return (
        <header style={{
            backgroundColor: 'white',
            borderBottom: '1px solid var(--border-color)',
            position: 'sticky', // 스크롤을 내려도 원래 자리에 끈적하게(sticky) 붙어있으라는 뜻
            top: 0,             // 브라우저 최상단(0px)에 붙입니다
            zIndex: 1000
        }}>
            <div className="container"
                 style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px'}}>

                <div style={{display: 'flex', gap: '32px', alignItems: 'center'}}>
                    <Link
                        to={logoTo}
                        onClick={logoOnClick}
                        style={{display: 'flex', alignItems: 'center'}}
                    >
                        <img
                            src={moneymateLogo}
                            alt="MoneyMate 로고"
                            style={{height: '32px', objectFit: 'contain', display: 'block'}}
                        />
                    </Link>

                    <nav style={{display: 'flex', gap: '20px', fontWeight: '500'}}>
                        {finalMenuItems.map((item) => {
                            if (item.to) {
                                return (
                                    <Link key={item.label} to={item.to}>
                                        {item.label}
                                    </Link>
                                );
                            }

                            return (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={item.onClick}
                                    style={navButtonStyle}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* 💡 로그인 상태에 따른 우측 버튼 분기 처리 */}
                <div style={{display: 'flex', gap: '12px'}}>
                    {renderRightButtons()}
                </div>

            </div>
        </header>
    );
}

export default Header;