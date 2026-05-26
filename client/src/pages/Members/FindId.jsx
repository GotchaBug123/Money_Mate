import React, {useState} from 'react';
import {Link} from 'react-router-dom';

function FindId() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');

    // 찾은 아이디를 저장할 상태 (초기값은 null)
    const [foundId, setFoundId] = useState(null);

    // 인증 확인 및 아이디 찾기 로직
    const handleVerify = () => {
        if (!name || !phone || !code) {
            alert('이름, 전화번호, 인증번호를 모두 입력해 주세요.');
            return;
        }

        // 백엔드 연동 전 임시 테스트 로직 (인증번호가 123456일 때 성공)
        if (code === '123456') {
            setFoundId('bestevan01');
        } else {
            alert('인증번호가 일치하지 않습니다.\n(테스트용 인증번호: 123456)');
            setFoundId(null);
        }
    };

    // 공통 스타일 세팅
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

                {/* 이름 입력 */}
                <div style={rowStyle}>
                    <label style={labelStyle}>이름</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                {/* 전화번호 입력 */}
                <div style={rowStyle}>
                    <label style={labelStyle}>전화번호</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                {/* 인증번호 입력 및 확인 버튼 */}
                <div style={rowStyle}>
                    <label style={labelStyle}>인증번호</label>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="6자리"
                        style={{...inputStyle, textAlign: 'center'}}
                        maxLength={6}
                    />
                    <button
                        onClick={handleVerify}
                        style={{
                            padding: '16px 32px',
                            backgroundColor: '#D1D5DB',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        인증확인
                    </button>
                </div>

                {/* 아이디 결과 출력 박스 */}
                <div style={{
                    marginTop: '32px',
                    padding: '30px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    textAlign: 'center',
                    minHeight: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: foundId ? 'var(--primary-color)' : 'var(--text-muted)'
                }}>
                    {foundId ? `당신의 아이디는 ${foundId} 입니다.` : '인증을 완료하면 아이디가 표시됩니다.'}
                </div>

                {/* 하단 이동 버튼 (비밀번호 찾기, 회원가입) */}
                <div style={{display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '40px'}}>
                    <Link to="/find-pw" style={{
                        flex: 1,
                        maxWidth: '200px',
                        padding: '16px',
                        backgroundColor: '#E5E7EB',
                        textAlign: 'center',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        color: 'var(--text-main)',
                        fontWeight: '500'
                    }}>
                        비밀번호 찾기
                    </Link>
                    <Link to="/signup" style={{
                        flex: 1,
                        maxWidth: '200px',
                        padding: '16px',
                        backgroundColor: '#E5E7EB',
                        textAlign: 'center',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        color: 'var(--text-main)',
                        fontWeight: '500'
                    }}>
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default FindId;