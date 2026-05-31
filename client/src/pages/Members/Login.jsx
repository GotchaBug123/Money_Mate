import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import './Login.css';

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
        <div className="container login-wrapper">
            <div className="card login-card">
                <h2 className="login-title">로그인</h2>

                <form onSubmit={handleLogin} className="login-form">

                    {/* 아이디 입력 */}
                    <div className="form-row">
                        <label className="form-label">아이디</label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="form-input"
                        />
                    </div>

                    {/* 비밀번호 입력 */}
                    <div className="form-row">
                        <label className="form-label">비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                        />
                    </div>

                    {/* 추가된 로그인 버튼 */}
                    <button type="submit" className="login-submit-btn">
                        로그인
                    </button>
                </form>

                {/* 하단 3개 버튼 (아이디 찾기, 비밀번호 찾기, 회원가입) */}
                <div className="bottom-links-wrapper">
                    <Link to="/find-id" className="btn-light bottom-link-btn">
                        아이디 찾기
                    </Link>
                    <Link to="/find-pw" className="btn-light bottom-link-btn">
                        비밀번호 찾기
                    </Link>
                    <Link to="/signup" className="btn-light bottom-link-btn">
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;