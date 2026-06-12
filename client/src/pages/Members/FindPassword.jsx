import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import styles from './FindPassword.module.css';
import {resetPasswordApi} from "../../api/authApi.js";

function FindPassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        loginId: '',
        email: '',
        newPassword: '',
        newPasswordConfirm: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?/\\]).{8,}$/;
    const isPasswordValid = passwordRegex.test(formData.newPassword);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!formData.loginId || !formData.email || !formData.newPassword || !formData.newPasswordConfirm) {
            return alert('모든 항목을 입력해 주세요.');
        }
        if (!isPasswordValid) {
            return alert('비밀번호 형식을 확인해 주세요.');
        }
        if (formData.newPassword !== formData.newPasswordConfirm) {
            return alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        }

        setIsLoading(true);
        try {
            // API 호출
            await resetPasswordApi(
                formData.loginId,
                formData.email,
                formData.newPassword,
                formData.newPasswordConfirm
            );

            alert('비밀번호가 성공적으로 재설정되었습니다.\n새로운 비밀번호로 로그인해 주세요!');
            navigate('/login');
        } catch (error) {
            console.error('비밀번호 재설정 실패:', error);
            const errorMsg = error.response?.data?.message || '입력하신 아이디 또는 이메일과 일치하는 계정을 찾을 수 없습니다.';
            alert(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.card}>
                <h2 className={styles.title}>비밀번호 재설정</h2>
                <p style={{textAlign: 'center', marginBottom: '24px', color: 'var(--color-text-muted)'}}>
                    가입하신 아이디와 이메일을 확인한 후, 새로운 비밀번호로 변경합니다.
                </p>

                <form onSubmit={handleResetPassword} className={styles.form}>
                    {/* 아이디 입력 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>아이디</label>
                        <input
                            type="text"
                            name="loginId"
                            value={formData.loginId}
                            onChange={handleChange}
                            placeholder="가입 시 등록한 아이디"
                            className={styles.input}
                        />
                    </div>

                    {/* 이메일 입력 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>이메일</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@email.com"
                            className={styles.input}
                        />
                    </div>

                    {/* 새 비밀번호 입력 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>새 비밀번호</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                        />
                        {formData.newPassword && (
                            <div
                                className={`${styles.statusBox} ${isPasswordValid ? styles.statusSuccess : styles.statusWarning}`}>
                                {isPasswordValid ? '✓ 사용 가능한 비밀번호입니다.' : '! 영문, 숫자, 특수문자 포함 8자 이상'}
                            </div>
                        )}
                    </div>

                    {/* 새 비밀번호 확인 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>새 비밀번호 확인</label>
                        <input
                            type="password"
                            name="newPasswordConfirm"
                            value={formData.newPasswordConfirm}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="새 비밀번호 재입력"
                        />
                        {formData.newPasswordConfirm && (
                            <div
                                className={`${styles.statusBox} ${formData.newPassword === formData.newPasswordConfirm ? styles.statusSuccess : styles.statusError}`}>
                                {formData.newPassword === formData.newPasswordConfirm ? '✓ 비밀번호가 일치합니다.' : '✕ 비밀번호가 일치하지 않습니다.'}
                            </div>
                        )}
                    </div>

                    {/* 완료 버튼 */}
                    <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? '변경 중...' : '비밀번호 변경하기'}
                    </button>
                </form>

                {/* 하단 이동 버튼 */}
                <div style={{marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px'}}>
                    <Link to="/find-id" style={{color: 'var(--color-text-muted)', textDecoration: 'none'}}>아이디 찾기</Link>
                    <span style={{color: 'var(--color-border-light)'}}>|</span>
                    <Link to="/login" style={{color: 'var(--color-text-muted)', textDecoration: 'none'}}>로그인하러 가기</Link>
                </div>
            </div>
        </div>
    );
}

export default FindPassword;