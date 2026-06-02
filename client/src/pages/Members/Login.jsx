import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import styles from './Login.module.css';

function Login() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault(); // 폼 제출 시 새로고침 방지

        // 💡 백엔드 연동 전 하드코딩 테스트 (아이디: test, 비밀번호: 1234)
        if (id === 'test' && password === '1234') {
            localStorage.setItem('isLoggedIn', 'true');
            alert('로그인 성공! 메인페이지로 이동합니다.');
            window.location.href = '/'; // 상태를 헤더에 반영하기 위해 이동
        } else if (id === 'admin' && password === '1234') {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('role', 'admin');
            alert('관리자 로그인 성공!');
            window.location.href = '/admin';
        } else {
            alert('아이디 또는 비밀번호가 일치하지 않습니다.\n(테스트 계정: test / 1234)');
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.loginCard}>
                <h2 className={styles.title}>로그인</h2>

                <form onSubmit={handleLogin} className={styles.form}>
                    {/* 아이디 입력 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>아이디</label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className={styles.input}
                            placeholder="아이디를 입력해주세요"
                        />
                    </div>

                    {/* 비밀번호 입력 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="비밀번호를 입력해주세요"
                        />
                    </div>

                    {/* 로그인 버튼 */}
                    <button type="submit" className={styles.submitBtn}>
                        로그인
                    </button>
                </form>

                {/* 하단 3개 링크 */}
                <div className={styles.bottomLinks}>
                    <Link to="/find-id" className={styles.linkBtn}>
                        아이디 찾기
                    </Link>
                    <div className={styles.divider}/>
                    <Link to="/find-pw" className={styles.linkBtn}>
                        비밀번호 찾기
                    </Link>
                    <div className={styles.divider}/>
                    <Link to="/signup" className={styles.linkBtn}>
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;