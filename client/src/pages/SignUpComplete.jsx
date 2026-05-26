import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';

function SignUpComplete() {
    const navigate = useNavigate();
    const location = useLocation();

    // 회원가입 페이지에서 보낸 이름 데이터를 가져옵니다.
    // 데이터가 없을 경우를 대비해 '회원'을 기본값으로 설정합니다.
    const userName = location.state?.userName || '회원';

    const handleFinish = () => {
        // '완료' 버튼 클릭 시 로그인 페이지로 이동합니다.
        navigate('/login');
    };

    return (
        <div className="container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 120px)', // 헤더와 푸터 높이를 제외한 중앙 배치
            padding: '20px'
        }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '800px',
                padding: '100px 40px', // 와이어프레임처럼 넓은 여백
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '40px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'white'
            }}>
                {/* 환영 메시지 영역 */}
                <div style={{marginBottom: '20px'}}>
                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: 'bold',
                        color: 'var(--text-main)',
                        lineHeight: '1.4'
                    }}>
                        <span style={{color: 'var(--primary-color)'}}>{userName}</span>님<br/>
                        환영합니다!
                    </h1>
                </div>

                {/* 완료 버튼 영역 */}
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <button
                        onClick={handleFinish}
                        style={{
                            padding: '12px 60px',
                            backgroundColor: '#D1D5DB', // 와이어프레임의 회색 버튼 색상
                            color: 'var(--text-main)',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#9CA3AF'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#D1D5DB'}
                    >
                        완료
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SignUpComplete;