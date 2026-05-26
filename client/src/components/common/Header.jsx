import React from 'react';
import {Link} from 'react-router-dom';
import moneymateLogo from '../../assets/moneymate_logo.png';

function Header() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        alert('로그아웃 되었습니다.');
        window.location.href = '/'; // 상태 갱신을 위해 메인으로 이동하며 새로고침
    };
    const btnStyle = {
        padding: '8px 16px',
        borderRadius: '4px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer'
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
                    <Link to="/" style={{display: 'flex', alignItems: 'center'}}>
                        <img
                            src={moneymateLogo}
                            alt="MoneyMate 로고"
                            style={{height: '32px', objectFit: 'contain', display: 'block'}}
                        />
                    </Link>

                    <nav style={{display: 'flex', gap: '20px', fontWeight: '500'}}>
                        <Link to="/asset">MY자산</Link>
                        <Link to="/portfolio">포트폴리오</Link>
                        <Link to="/rebalancing">리밸런싱</Link>
                        <Link to="/info">투자정보</Link>
                        <Link to="/community">커뮤니티</Link>
                    </nav>
                </div>

                {/* 💡 로그인 상태에 따른 우측 버튼 분기 처리 */}
                <div style={{display: 'flex', gap: '12px'}}>
                    {isLoggedIn ? (
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
                    ) : (
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
                    )}
                </div>

            </div>
        </header>
    );
}

export default Header;