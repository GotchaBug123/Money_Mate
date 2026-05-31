import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './SignUp.css';

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
    // formData.password가 정규식을 통과하면 true, 아니면 false가 됩니다.
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
            alert('이용약관에 동의해 주세요.');
            return;
        }

        navigate('/signup-complete', {state: {userName: formData.name}});
    };

    return (
        <div className="container signup-wrapper">
            <div className="card signup-card">
                <h2 className="signup-title">회원가입</h2>

                <form onSubmit={handleSignup}>

                    {/* 아이디 */}
                    <div className="form-row">
                        <label className="form-label">아이디</label>
                        <input type="text" name="id" value={formData.id} onChange={handleChange} className="form-input"
                               placeholder="아이디 입력" required/>
                        <button type="button" onClick={handleCheckId} className="form-btn">중복확인</button>
                    </div>

                    {/* 비밀번호 */}
                    <div className="form-group">
                        <div className="form-row-inner">
                            <label className="form-label">비밀번호</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange}
                                   className="form-input" placeholder="비밀번호 입력" required/>
                        </div>
                        {/* 비밀번호 기준 안내 (조건부 클래스 적용) */}
                        <div className={`validation-box ${isPasswordValid ? 'success' : 'warning'}`}>
                            {isPasswordValid ? '사용 가능한 비밀번호입니다.' : '영문, 숫자, 특수문자 포함 8자 이상'}
                        </div>
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="form-group large">
                        <div className="form-row-inner">
                            <label className="form-label">비밀번호 확인</label>
                            <input type="password" name="passwordConfirm" value={formData.passwordConfirm}
                                   onChange={handleChange} className="form-input" placeholder="비밀번호 재입력" required/>
                        </div>
                        {/* 비밀번호 일치 확인 안내 (조건부 클래스 적용) */}
                        {formData.passwordConfirm && (
                            <div
                                className={`validation-box ${formData.password === formData.passwordConfirm ? 'success' : 'error'}`}>
                                {formData.password === formData.passwordConfirm ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                            </div>
                        )}
                    </div>

                    {/* 이름 & 생년월일 (한 줄에 배치) */}
                    <div className="form-row">
                        <label className="form-label">이름</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange}
                               className="form-input"
                               placeholder="이름 입력" required/>

                        <label className="birth-label">생년월일</label>
                        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange}
                               className="form-input birth-input" required/>
                    </div>

                    {/* 전화번호 */}
                    <div className="form-row">
                        <label className="form-label">전화번호</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                               className="form-input"
                               placeholder="010-0000-0000" required/>
                        <button type="button" onClick={handleSendAuthCode} className="form-btn">인증받기</button>
                    </div>

                    {/* 인증번호 */}
                    <div className="form-row">
                        <label className="form-label">인증번호</label>
                        <input type="text" name="verificationCode" value={formData.verificationCode}
                               onChange={handleChange} className="form-input" placeholder="인증번호 입력" required/>
                    </div>

                    {/* 이메일 */}
                    <div className="form-row">
                        <label className="form-label">이메일</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                               className="form-input" placeholder="example@email.com" required/>
                    </div>

                    {/* 약관 동의 영역 */}
                    <div className="terms-box">
                        <label className="terms-label">
                            <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms}
                                   onChange={handleChange} className="terms-checkbox"/>
                            [필수] 이용약관 및 개인정보 처리방침에 동의합니다.
                        </label>
                    </div>

                    {/* 가입 완료 버튼 */}
                    <button type="submit" className="submit-btn">
                        회원가입 완료
                    </button>

                </form>
            </div>
        </div>
    );
}

export default SignUp;