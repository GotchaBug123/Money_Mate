import React, {useState, useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import styles from './LoginModal.module.css';
import {useAuthStore} from '../../store/useAuthStore.js';
import {loginApi} from '../../api/authApi.js';

function LoginModal() {
    const {loginModalOpen, loginRedirectTo, closeLoginModal, login} = useAuthStore();
    const navigate = useNavigate();

    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 로그인 없이 닫기 — 보호된 페이지에서 왔으면 홈으로 이동
    const handleClose = () => {
        closeLoginModal();
        if (loginRedirectTo) navigate('/');
    };

    // ESC 키로 닫기
    useEffect(() => {
        if (!loginModalOpen) return;
        const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [loginModalOpen]);

    // 모달 열릴 때 입력값 초기화
    useEffect(() => {
        if (loginModalOpen) {
            setLoginId('');
            setPassword('');
        }
    }, [loginModalOpen]);

    if (!loginModalOpen) return null;

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!loginId || !password) return alert('아이디와 비밀번호를 입력해주세요.');
        setIsLoading(true);
        try {
            const response = await loginApi(loginId, password);
            if (response.success) {
                login(response.data);
                closeLoginModal();
                // loginRedirectTo가 null이면 현재 페이지에 머물며 useEffect가 처리
                if (loginRedirectTo) navigate(loginRedirectTo);
            } else {
                alert(response.message || '로그인에 실패했습니다.');
            }
        } catch (error) {
            const msg = error.response?.data?.message || '아이디 또는 비밀번호가 일치하지 않습니다.';
            alert(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.backdrop} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button type="button" className={styles.closeBtn} onClick={handleClose}>✕</button>

                <div className={styles.header}>
                    <h2 className={styles.title}>로그인</h2>
                    <p className={styles.desc}>MoneyMate 서비스를 이용하려면 로그인이 필요해요.</p>
                </div>

                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>아이디</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            placeholder="아이디를 입력해주세요"
                            autoFocus
                        />
                    </div>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>비밀번호</label>
                        <input
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력해주세요"
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? '로그인 중...' : '로그인'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <Link to="/find-id" className={styles.footerLink} onClick={closeLoginModal}>아이디 찾기</Link>
                    <span className={styles.divider}>·</span>
                    <Link to="/find-pw" className={styles.footerLink} onClick={closeLoginModal}>비밀번호 찾기</Link>
                    <span className={styles.divider}>·</span>
                    <Link to="/signup" className={styles.footerLink} onClick={closeLoginModal}>회원가입</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;
