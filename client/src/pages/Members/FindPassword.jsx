import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './FindPassword.css';

function FindPassword() {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');

    // 인증 완료 여부 상태
    const [isVerified, setIsVerified] = useState(false);

    // 인증 확인 로직 (테스트 번호: 123456)
    const handleVerify = () => {
        if (!id || !phone || !code) {
            alert('아이디, 전화번호, 인증번호를 모두 입력해 주세요.');
            return;
        }

        if (code === '123456') {
            setIsVerified(true);
            alert('인증이 완료되었습니다.\n[다음] 버튼을 눌러 비밀번호를 재설정해 주세요.');
        } else {
            setIsVerified(false);
            alert('인증번호가 일치하지 않습니다.\n(테스트용 인증번호: 123456)');
        }
    };

    // 다음 페이지 이동 로직
    const handleNext = () => {
        if (!isVerified) {
            alert('먼저 휴대폰 인증을 완료해 주세요.');
            return;
        }
        // 인증이 완료되면 다음 화면으로 넘어갑니다. (이때 누구의 비밀번호를 바꿀지 id를 같이 넘겨줍니다)
        navigate('/reset-pw', {state: {userId: id}});
    };

    return (
        <div className="container find-pw-wrapper">
            <div className="card find-pw-card">
                <h2 className="find-pw-title">비밀번호 찾기</h2>

                <div className="form-row">
                    <label className="form-label">아이디</label>
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        className="form-input"
                        disabled={isVerified}
                    />
                </div>

                <div className="form-row">
                    <label className="form-label">전화번호</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-input"
                        disabled={isVerified}
                    />
                </div>

                <div className="form-row">
                    <label className="form-label">인증번호</label>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="6자리"
                        className="form-input code-input"
                        maxLength={6}
                        disabled={isVerified}
                    />
                    <button
                        onClick={handleVerify}
                        disabled={isVerified}
                        className={`verify-btn ${isVerified ? 'verified' : ''}`}
                    >
                        {isVerified ? '인증완료' : '인증확인'}
                    </button>
                </div>

                {/* 다음 단계 버튼 */}
                <div className="next-btn-wrapper">
                    <button
                        onClick={handleNext}
                        className={`next-btn ${isVerified ? 'active' : 'disabled'}`}
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FindPassword;