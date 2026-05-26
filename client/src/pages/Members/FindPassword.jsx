import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

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

    // 공통 스타일
    const rowStyle = {display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px'};
    const labelStyle = {width: '80px', fontWeight: 'bold', fontSize: '18px', textAlign: 'center'};
    const inputStyle = {
        flex: 1,
        padding: '16px',
        backgroundColor: '#E5E7EB',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px'
    };

    return (
        <div className="container" style={{display: 'flex', justifyContent: 'center', padding: '80px 20px'}}>
            <div className="card" style={{width: '100%', maxWidth: '600px', padding: '60px 40px'}}>
                <h2 style={{textAlign: 'center', marginBottom: '40px', color: 'var(--primary-color)'}}>비밀번호 찾기</h2>

                <div style={rowStyle}>
                    <label style={labelStyle}>아이디</label>
                    <input type="text" value={id} onChange={(e) => setId(e.target.value)} style={inputStyle}
                           disabled={isVerified}/>
                </div>

                <div style={rowStyle}>
                    <label style={labelStyle}>전화번호</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle}
                           disabled={isVerified}/>
                </div>

                <div style={rowStyle}>
                    <label style={labelStyle}>인증번호</label>
                    <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="6자리"
                           style={{...inputStyle, textAlign: 'center'}} maxLength={6} disabled={isVerified}/>
                    <button onClick={handleVerify} disabled={isVerified} style={{
                        padding: '16px 32px',
                        backgroundColor: isVerified ? '#9CA3AF' : '#D1D5DB',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: isVerified ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap'
                    }}>
                        {isVerified ? '인증완료' : '인증확인'}
                    </button>
                </div>

                {/* 다음 단계 버튼 */}
                <div style={{display: 'flex', justifyContent: 'center', marginTop: '40px'}}>
                    <button onClick={handleNext} style={{
                        width: '100%',
                        maxWidth: '300px',
                        padding: '16px',
                        backgroundColor: isVerified ? 'var(--primary-color)' : '#E5E7EB',
                        color: isVerified ? 'white' : 'var(--text-muted)',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        cursor: isVerified ? 'pointer' : 'not-allowed'
                    }}>
                        다음
                    </button>
                </div>

            </div>
        </div>
    );
}

export default FindPassword;