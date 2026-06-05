import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import styles from './FindId.module.css';
import {findIdApi} from "../../api/authApi.js";

function FindId() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [foundId, setFoundId] = useState(null);

    const handleVerify = async () => {
        if (!name || !email) {
            alert('이름과 이메일을 모두 입력해 주세요.');
            return;
        }

        setIsLoading(true);
        setFoundId(null);

        try {
            const response = await findIdApi(name, email);

            if (response.success && response.data) setFoundId(response.data);
            else alert(response.message || '가입된 아이디 정보를 찾을 수 없습니다.');
        } catch (error) {
            console.error('아이디 찾기 실패: ', error);
            const errorMsg = error.response?.data?.message || '일치하는 회원 정보가 없습니다. 이름과 이메일을 확인해 주세요.';
            alert(errorMsg);
        } finally {
            setIsLoading(false);
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
                            placeholder="가입 시 등록한 이름"
                            className={styles.input}
                        />
                    </div>

                    {/* 이메일 입력 (기존 전화번호/인증번호 영역 대체) */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>이메일</label>
                        <div className={styles.verifyRow}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                className={styles.verifyInput}
                            />
                            <button
                                onClick={handleVerify}
                                className={styles.verifyBtn}
                                disabled={isLoading}
                            >
                                {isLoading ? '조회중...' : '아이디 찾기'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 결과 출력 박스 */}
                <div className={`${styles.resultBox} ${foundId ? styles.resultSuccess : styles.resultEmpty}`}>
                    {foundId ? `회원님의 아이디는 [ ${foundId} ] 입니다.` : '이름과 이메일을 입력하여 조회해 주세요.'}
                </div>

                {/* 하단 이동 버튼 */}
                <div className={styles.bottomLinks}>
                    <Link to="/find-pw" className={styles.linkBtn}>
                        비밀번호 찾기
                    </Link>
                    <div className={styles.divider}/>
                    <Link to="/signup" className={styles.linkBtn}>
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default FindId;