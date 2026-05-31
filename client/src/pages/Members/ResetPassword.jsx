import React, {useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import './ResetPassword.css';

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

    return (
        <div className="container reset-pw-wrapper">
            <div className="card reset-pw-card">
                <h2 className="reset-pw-title">새 비밀번호 재설정</h2>

                {/* 새 비밀번호 입력 */}
                <div className="input-group">
                    <label className="form-label">새 비밀번호 입력</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                    />
                    {/* 조건 검증 상태창 (와이어프레임의 주황/초록 박스) */}
                    <div className={`status-box ${isPasswordValid ? 'success' : 'warning'}`}>
                        {isPasswordValid ? '사용 가능한 비밀번호입니다.' : '영문, 숫자, 특수문자 포함 8자 이상'}
                    </div>
                </div>

                {/* 새 비밀번호 확인 */}
                <div className="input-group last">
                    <label className="form-label">새 비밀번호 확인</label>
                    <input
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        className="form-input"
                    />
                    {passwordConfirm && (
                        <div className={`status-box ${password === passwordConfirm ? 'success' : 'error'}`}>
                            {password === passwordConfirm ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                        </div>
                    )}
                </div>

                {/* 완료 버튼 */}
                <div className="submit-btn-wrapper">
                    <button onClick={handleComplete} className="submit-btn">
                        완료
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;