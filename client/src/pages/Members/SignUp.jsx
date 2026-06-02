import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './SignUp.module.css';

function SignUp() {
    const navigate = useNavigate();

    // 폼 상태 관리
    const [formData, setFormData] = useState({
        id: '',
        password: '',
        passwordConfirm: '',
        name: '',
        birthDate: '',
        phone: '',
        verificationCode: '',
        email: '',
        agreeTerms: false,
    });

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?/\\]).{8,}$/;
    const isPasswordValid = passwordRegex.test(formData.password);

    // 임시 기능 핸들러
    const handleCheckId = () => alert('사용 가능한 아이디입니다.');
    const handleSendAuthCode = () => alert('인증번호가 발송되었습니다.');

    const handleSignup = (e) => {
        e.preventDefault();

        if (!isPasswordValid) {
            alert('비밀번호 형식을 확인해 주세요.');
            return;
        }
        if (formData.password !== formData.passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!formData.agreeTerms) {
            alert('이용약관 및 개인정보 처리방침에 동의해 주세요.');
            return;
        }

        // 회원가입 성공 시 완료 페이지로 이름 전달하며 이동
        navigate('/signup-complete', {state: {userName: formData.name}});
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.card}>
                <h2 className={styles.title}>회원가입</h2>

                <form onSubmit={handleSignup} className={styles.form}>

                    {/* 아이디 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>아이디</label>
                        <div className={styles.actionRow}>
                            <input
                                type="text"
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="아이디 입력"
                                required
                            />
                            <button
                                type="button"
                                onClick={handleCheckId}
                                className={styles.actionBtn}
                            >
                                중복확인
                            </button>
                        </div>
                    </div>

                    {/* 비밀번호 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="비밀번호 입력"
                            required
                        />
                        <div
                            className={`${styles.statusBox} ${isPasswordValid ? styles.statusSuccess : styles.statusWarning}`}>
                            {isPasswordValid ? '✓ 사용 가능한 비밀번호입니다.' : '! 영문, 숫자, 특수문자 포함 8자 이상'}
                        </div>
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>비밀번호 확인</label>
                        <input
                            type="password"
                            name="passwordConfirm"
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="비밀번호 재입력"
                            required
                        />
                        {formData.passwordConfirm && (
                            <div
                                className={`${styles.statusBox} ${formData.password === formData.passwordConfirm ? styles.statusSuccess : styles.statusError}`}>
                                {formData.password === formData.passwordConfirm ? '✓ 비밀번호가 일치합니다.' : '✕ 비밀번호가 일치하지 않습니다.'}
                            </div>
                        )}
                    </div>

                    {/* 이름 & 생년월일 (2단 레이아웃) */}
                    <div className={styles.halfRow}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>이름</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="이름 입력"
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>생년월일</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                className={styles.input}
                                required
                            />
                        </div>
                    </div>

                    {/* 전화번호 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>전화번호</label>
                        <div className={styles.actionRow}>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="010-0000-0000"
                                required
                            />
                            <button
                                type="button"
                                onClick={handleSendAuthCode}
                                className={styles.actionBtn}
                            >
                                인증받기
                            </button>
                        </div>
                    </div>

                    {/* 이메일 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>이메일</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="example@email.com"
                            required
                        />
                    </div>

                    {/* 약관 동의 영역 */}
                    <div className={styles.termsBox}>
                        <label className={styles.termsLabel}>
                            <input
                                type="checkbox"
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                className={styles.termsCheckbox}
                            />
                            [필수] 이용약관 및 개인정보 처리방침에 동의합니다.
                        </label>
                    </div>

                    {/* 가입 완료 버튼 */}
                    <button type="submit" className={styles.submitBtn}>
                        회원가입 완료
                    </button>

                </form>
            </div>
        </div>
    );
}

export default SignUp;