import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

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

    // 공통 스타일
    const rowStyle = {display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px'};
    const labelStyle = {width: '100px', fontWeight: 'bold', flexShrink: 0};
    const inputStyle = {
        flex: 1,
        padding: '12px',
        backgroundColor: '#E5E7EB',
        border: 'none',
        borderRadius: '4px',
        fontSize: '15px'
    };
    const btnStyle = {
        padding: '12px 16px',
        backgroundColor: '#D1D5DB',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
    };

    return (
        <div className="container" style={{display: 'flex', justifyContent: 'center', padding: '60px 20px'}}>
            <div className="card" style={{width: '100%', maxWidth: '600px', padding: '40px'}}>
                <h2 style={{textAlign: 'center', marginBottom: '40px', color: 'var(--primary-color)'}}>회원가입</h2>

                <form onSubmit={handleSignup}>

                    {/* 아이디 */}
                    <div style={rowStyle}>
                        <label style={labelStyle}>아이디</label>
                        <input type="text" name="id" value={formData.id} onChange={handleChange} style={inputStyle}
                               placeholder="아이디 입력" required/>
                        <button type="button" onClick={handleCheckId} style={btnStyle}>중복확인</button>
                    </div>

                    {/* 비밀번호 */}
                    <div style={{marginBottom: '16px'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                            <label style={labelStyle}>비밀번호</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange}
                                   style={inputStyle} placeholder="비밀번호 입력" required/>
                        </div>
                        {/* 비밀번호 기준 안내 (와이어프레임의 주황색 박스) */}
                        <div style={{
                            marginLeft: '116px',
                            marginTop: '8px',
                            padding: '8px',
                            backgroundColor: isPasswordValid ? '#22C55E' : '#F97316', // 조건 만족 시 초록색, 불만족 시 주황색
                            color: 'white',
                            borderRadius: '4px',
                            fontSize: '12px',
                            textAlign: 'center',
                            transition: 'background-color 0.3s ease' // 색상이 부드럽게 바뀌도록 애니메이션 추가
                        }}>
                            {isPasswordValid ? '사용 가능한 비밀번호입니다.' : '영문, 숫자, 특수문자 포함 8자 이상'}
                        </div>
                    </div>

                    {/* 비밀번호 확인 */}
                    <div style={{marginBottom: '24px'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                            <label style={labelStyle}>비밀번호 확인</label>
                            <input type="password" name="passwordConfirm" value={formData.passwordConfirm}
                                   onChange={handleChange} style={inputStyle} placeholder="비밀번호 재입력" required/>
                        </div>
                        {/* 비밀번호 일치 확인 안내 (와이어프레임의 주황색 박스) */}
                        {formData.passwordConfirm && (
                            <div style={{
                                marginLeft: '116px',
                                marginTop: '8px',
                                padding: '8px',
                                backgroundColor: formData.password === formData.passwordConfirm ? '#22C55E' : '#EF4444',
                                color: 'white',
                                borderRadius: '4px',
                                fontSize: '12px',
                                textAlign: 'center'
                            }}>
                                {formData.password === formData.passwordConfirm ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                            </div>
                        )}
                    </div>

                    {/* 이름 & 생년월일 (한 줄에 배치) */}
                    <div style={rowStyle}>
                        <label style={labelStyle}>이름</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle}
                               placeholder="이름 입력" required/>

                        <label style={{width: '70px', fontWeight: 'bold', textAlign: 'center'}}>생년월일</label>
                        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange}
                               style={{...inputStyle, flex: '0.8'}} required/>
                    </div>

                    {/* 전화번호 */}
                    <div style={rowStyle}>
                        <label style={labelStyle}>전화번호</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle}
                               placeholder="010-0000-0000" required/>
                        <button type="button" onClick={handleSendAuthCode} style={btnStyle}>인증받기</button>
                    </div>

                    {/* 인증번호 */}
                    <div style={rowStyle}>
                        <label style={labelStyle}>인증번호</label>
                        <input type="text" name="verificationCode" value={formData.verificationCode}
                               onChange={handleChange} style={inputStyle} placeholder="인증번호 입력" required/>
                    </div>

                    {/* 이메일 */}
                    <div style={rowStyle}>
                        <label style={labelStyle}>이메일</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                               style={inputStyle} placeholder="example@email.com" required/>
                    </div>

                    {/* 약관 동의 영역 */}
                    <div style={{
                        marginTop: '32px',
                        padding: '16px',
                        backgroundColor: '#F3F4F6',
                        borderRadius: '4px',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}>
                            <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms}
                                   onChange={handleChange} style={{width: '18px', height: '18px'}}/>
                            [필수] 이용약관 및 개인정보 처리방침에 동의합니다.
                        </label>
                    </div>

                    {/* 가입 완료 버튼 */}
                    <button type="submit" style={{
                        width: '100%',
                        marginTop: '24px',
                        padding: '16px',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}>
                        회원가입 완료
                    </button>

                </form>
            </div>
        </div>
    );
}

export default SignUp;