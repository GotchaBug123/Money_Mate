import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './FindPassword.module.css';

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
        <div className={styles.pageWrapper}>
            <div className={styles.card}>
                <h2 className={styles.title}>비밀번호 찾기</h2>

                <div className={styles.form}>
                    {/* 아이디 입력 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>아이디</label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="아이디 입력"
                            className={styles.input}
                            disabled={isVerified}
                        />
                    </div>

                    {/* 전화번호 입력 */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>전화번호</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="010-0000-0000"
                            className={styles.input}
                            disabled={isVerified}
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
                                disabled={isVerified}
                            />
                            <button
                                onClick={handleVerify}
                                disabled={isVerified}
                                className={isVerified ? styles.verifyBtnDone : styles.verifyBtn}
                            >
                                {isVerified ? '인증완료' : '인증확인'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 다음 단계 버튼 */}
                <button
                    onClick={handleNext}
                    className={isVerified ? styles.nextBtnActive : styles.nextBtnDisabled}
                    disabled={!isVerified}
                >
                    다음
                </button>
            </div>
        </div>
    );
}

export default FindPassword;