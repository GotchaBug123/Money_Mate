import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import styles from './Login.module.css';
import {loginApi} from "../../api/authApi.js";
import {useAuthStore} from "../../store/useAuthStore.js";

function Login() {
    const navigate = useNavigate();

    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const login = useAuthStore((state) => state.login);

    const handleLogin = async (e) => {
        e.preventDefault(); // 폼 제출 시 새로고침 방지

        if (!loginId || !password) {
            alert('아이디와 비밀번호를 입력해주세요.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await loginApi(loginId, password);

            if (response.success) {
                login(response.data);

                alert(response.message || `${response.data.name}님 환영합니다!`);

                if (response.data.role === 'ADMIN') navigate('/admin');
                else navigate('/');
            } else alert(response.message || '로그인에 실패했습니다.');
        } catch (error) {
            console.error('로그인 에러: ', error);
            const errorMsg = error.response?.data?.message || '아이디 또는 비밀번호가 일치하지 않습니다.';
            alert(errorMsg);
        } finally {
            setIsLoading(false);
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
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
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
                    <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? '로그인 중...' : '로그인'}
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