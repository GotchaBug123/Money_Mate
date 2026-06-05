import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './SignUp.module.css';
import {TermsContent, PrivacyContent} from '../../components/Policies/PolicyContents';
import {signupApi} from "../../api/authApi.js";

function SignUp() {
    const navigate = useNavigate();

    // 폼 상태 관리
    const [formData, setFormData] = useState({
        loginId: '', password: '', passwordConfirm: '', name: '',
        birthDate: '', email: '', agreeTerms: false,
    });

    const [modalType, setModalType] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?/\\]).{8,}$/;
    const isPasswordValid = passwordRegex.test(formData.password);

    // const handleCheckId = () => alert('사용 가능한 아이디입니다.');
    // const handleSendAuthCode = () => alert('인증번호가 발송되었습니다.');

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!isPasswordValid) return alert('비밀번호 형식을 확인해 주세요.');
        if (formData.password !== formData.passwordConfirm) return alert('비밀번호가 일치하지 않습니다.');
        if (!formData.agreeTerms) return alert('이용약관 및 개인정보 처리방침에 동의해 주세요.');

        setIsLoading(true);
        try {
            await signupApi({
                loginId: formData.loginId,
                email: formData.email,
                name: formData.name,
                birthDate: formData.birthDate,
                password: formData.password
            });

            navigate('/signup-complete', {state: {userName: formData.name}});
        } catch (error) {
            console.error('회원가입 실패', error);
            const errorMsg = error.response?.data?.message || '회원가입에 실패했습니다. 아이디/이메일 중복 여부를 확인해주세요.';
            alert(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.card}>
                <h2 className={styles.title}>회원가입</h2>

                <form onSubmit={handleSignup} className={styles.form}>
                    {/* 아이디 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>아이디</label>
                        {/* 💡 중복확인 버튼 및 actionRow 제거. 단일 input으로 변경 */}
                        <input type="text" name="loginId" value={formData.loginId} onChange={handleChange}
                               className={styles.input} placeholder="아이디 입력" required/>
                    </div>

                    {/* 비밀번호 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>비밀번호</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange}
                               className={styles.input} placeholder="비밀번호 입력" required/>
                        <div
                            className={`${styles.statusBox} ${isPasswordValid ? styles.statusSuccess : styles.statusWarning}`}>
                            {isPasswordValid ? '✓ 사용 가능한 비밀번호입니다.' : '! 영문, 숫자, 특수문자 포함 8자 이상'}
                        </div>
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>비밀번호 확인</label>
                        <input type="password" name="passwordConfirm" value={formData.passwordConfirm}
                               onChange={handleChange} className={styles.input} placeholder="비밀번호 재입력" required/>
                        {formData.passwordConfirm && (
                            <div
                                className={`${styles.statusBox} ${formData.password === formData.passwordConfirm ? styles.statusSuccess : styles.statusError}`}>
                                {formData.password === formData.passwordConfirm ? '✓ 비밀번호가 일치합니다.' : '✕ 비밀번호가 일치하지 않습니다.'}
                            </div>
                        )}
                    </div>

                    {/* 이름 & 생년월일 */}
                    <div className={styles.halfRow}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>이름</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange}
                                   className={styles.input} placeholder="이름 입력" required/>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>생년월일</label>
                            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange}
                                   className={styles.input} required/>
                        </div>
                    </div>

                    {/* 이메일 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>이메일</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                               className={styles.input} placeholder="example@email.com" required/>
                    </div>

                    {/* 약관 동의 */}
                    <div className={styles.termsBox}>
                        <div className={styles.termsLabelWrap}>
                            <input type="checkbox" id="agreeCheckbox" name="agreeTerms" checked={formData.agreeTerms}
                                   onChange={handleChange} className={styles.termsCheckbox}/>
                            <label htmlFor="agreeCheckbox">[필수]</label>
                            <span className={styles.termsLink} onClick={() => setModalType('terms')}>이용약관</span>
                            <span>및</span>
                            <span className={styles.termsLink} onClick={() => setModalType('privacy')}>개인정보 처리방침</span>
                            <label htmlFor="agreeCheckbox">에 동의합니다.</label>
                        </div>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? '가입 진행 중...' : '회원가입 완료'}
                    </button>
                </form>
            </div>

            {/* ── 약관 확인 모달 ── */}
            {modalType && (
                <div className={styles.modalOverlay} onClick={() => setModalType(null)}>
                    <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <p className={styles.modalTitle}>{modalType === 'terms' ? '서비스 이용약관' : '개인정보처리방침'}</p>
                            <button className={styles.modalClose} onClick={() => setModalType(null)}>✕</button>
                        </div>
                        <div className={styles.modalBody}>
                            {modalType === 'terms' ? <TermsContent/> : <PrivacyContent/>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SignUp;