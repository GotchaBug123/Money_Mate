import React, {useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    // 이전 화면(FindPassword)에서 넘겨준 아이디 확인 (비정상 접근 방지)
    const userId = location.state?.userId;

    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    // 실시간 비밀번호 검증 (영문, 숫자, 특수문자 포함 8자 이상)
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?/\\]).{8,}$/;
    const isPasswordValid = passwordRegex.test(password);

    const handleComplete = () => {
        if (!userId) {
            alert('잘못된 접근입니다. 처음부터 다시 시도해 주세요.');
            navigate('/find-pw');
            return;
        }
        if (!isPasswordValid) {
            alert('비밀번호 형식을 확인해 주세요.');
            return;
        }
        if (password !== passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        alert('비밀번호 재설정이 완료되었습니다!\n새로운 비밀번호로 로그인해 주세요.');
        navigate('/login');
    };

    // 공통 스타일
    const labelStyle = {display: 'block', fontWeight: 'bold', fontSize: '18px', marginBottom: '12px'};
    const inputStyle = {
        width: '100%',
        padding: '16px',
        backgroundColor: '#E5E7EB',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        boxSizing: 'border-box'
    };
    const statusBoxStyle = {
        marginTop: '8px',
        padding: '10px',
        color: 'white',
        borderRadius: '4px',
        fontSize: '14px',
        textAlign: 'center',
        transition: 'background-color 0.3s ease'
    };

    return (
        <div className="container" style={{display: 'flex', justifyContent: 'center', padding: '80px 20px'}}>
            <div className="card" style={{width: '100%', maxWidth: '600px', padding: '60px 40px'}}>
                <h2 style={{textAlign: 'center', marginBottom: '40px', color: 'var(--primary-color)'}}>새 비밀번호 재설정</h2>

                {/* 새 비밀번호 입력 */}
                <div style={{marginBottom: '32px'}}>
                    <label style={labelStyle}>새 비밀번호 입력</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                           style={inputStyle}/>
                    {/* 조건 검증 상태창 (와이어프레임의 주황/초록 박스) */}
                    <div style={{...statusBoxStyle, backgroundColor: isPasswordValid ? '#22C55E' : '#F97316'}}>
                        {isPasswordValid ? '사용 가능한 비밀번호입니다.' : '영문, 숫자, 특수문자 포함 8자 이상'}
                    </div>
                </div>

                {/* 새 비밀번호 확인 */}
                <div style={{marginBottom: '40px'}}>
                    <label style={labelStyle}>새 비밀번호 확인</label>
                    <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}
                           style={inputStyle}/>
                    {passwordConfirm && (
                        <div style={{
                            ...statusBoxStyle,
                            backgroundColor: password === passwordConfirm ? '#22C55E' : '#EF4444'
                        }}>
                            {password === passwordConfirm ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                        </div>
                    )}
                </div>

                {/* 완료 버튼 */}
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <button onClick={handleComplete} style={{
                        width: '100%', maxWidth: '300px', padding: '16px',
                        backgroundColor: 'var(--primary-color)', color: 'white',
                        border: 'none', borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer'
                    }}>
                        완료
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ResetPassword;