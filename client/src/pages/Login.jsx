import React, {useState} from 'react';
import {Link} from 'react-router-dom';

function Login() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault(); // 폼 제출 시 새로고침 방지

        // 💡 백엔드 연동 전 하드코딩 테스트 (아이디: test, 비밀번호: 1234)
        if (id === 'test' && password === '1234') {
            localStorage.setItem('isLoggedIn', 'true');
            alert('로그인 성공! 마이페이지로 이동합니다.');
            window.location.href = '/mypage'; // 상태를 헤더에 반영하기 위해 이동
        } else {
            alert('아이디 또는 비밀번호가 일치하지 않습니다.\n(테스트 계정: test / 1234)');
        }
    };

    return (
        <div className="container" style={{display: 'flex', justifyContent: 'center', padding: '80px 20px'}}>
            <div className="card" style={{width: '100%', maxWidth: '500px', padding: '40px'}}>
                <h2 style={{textAlign: 'center', marginBottom: '40px', color: 'var(--primary-color)'}}>로그인</h2>

                <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>

                    {/* 아이디 입력 */}
                    <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                        <label style={{width: '80px', fontWeight: 'bold'}}>아이디</label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '16px',
                                backgroundColor: '#E5E7EB',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    {/* 비밀번호 입력 */}
                    <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                        <label style={{width: '80px', fontWeight: 'bold'}}>비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '16px',
                                backgroundColor: '#E5E7EB',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    {/* 추가된 로그인 버튼 */}
                    <button
                        type="submit"
                        style={{
                            marginTop: '16px', padding: '16px',
                            backgroundColor: 'var(--primary-color)', color: 'white',
                            border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer'
                        }}
                    >
                        로그인
                    </button>
                </form>

                {/* 하단 3개 버튼 (아이디 찾기, 비밀번호 찾기, 회원가입) */}
                <div style={{display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '32px'}}>
                    <Link to="/find-id" className="btn-light" style={{
                        flex: 1,
                        padding: '12px 0',
                        textAlign: 'center',
                        backgroundColor: '#E5E7EB',
                        borderRadius: '4px',
                        fontSize: '14px'
                    }}>
                        아이디 찾기
                    </Link>
                    <Link to="/find-pw" className="btn-light" style={{
                        flex: 1,
                        padding: '12px 0',
                        textAlign: 'center',
                        backgroundColor: '#E5E7EB',
                        borderRadius: '4px',
                        fontSize: '14px'
                    }}>
                        비밀번호 찾기
                    </Link>
                    <Link to="/signup" className="btn-light" style={{
                        flex: 1,
                        padding: '12px 0',
                        textAlign: 'center',
                        backgroundColor: '#E5E7EB',
                        borderRadius: '4px',
                        fontSize: '14px'
                    }}>
                        회원가입
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Login;