import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import styles from './FindId.module.css';

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

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.findIdCard}>
                <h2 className={styles.title}>아이디 찾기</h2>

                <div className={styles.form}>
                    {/* 이름 입력 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>이름</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                            placeholder="이름을 입력해주세요"
                        />
                    </div>

                    {/* 전화번호 입력 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>전화번호</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={styles.input}
                            placeholder="010-0000-0000"
                        />
                    </div>

                    {/* 인증번호 입력 및 확인 버튼 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>인증번호</label>
                        <div className={styles.verifyRow}>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="6자리"
                                className={styles.verifyInput}
                                maxLength={6}
                            />
                            <button
                                onClick={handleVerify}
                                className={styles.verifyBtn}
                            >
                                인증확인
                            </button>
                        </div>
                    </div>
                </div>

                {/* 💡 아이디 결과 출력 박스 (조건부 스타일 적용) */}
                <div className={`${styles.resultBox} ${foundId ? styles.resultSuccess : styles.resultEmpty}`}>
                    {foundId ? `당신의 아이디는 ${foundId} 입니다.` : '인증을 완료하면 아이디가 표시됩니다.'}
                </div>

                {/* 하단 이동 버튼 (비밀번호 찾기, 회원가입) */}
                <div className={styles.bottomLinks}>
                    <Link to="/find-pw" className={styles.linkBtn}>
                        비밀번호 찾기
                    </Link>
                    <Link to="/signup" className={styles.linkBtn}>
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default FindId;