import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import styles from './SignUpComplete.module.css';

function SignUpComplete() {
    const navigate = useNavigate();
    const location = useLocation();

    // 회원가입 페이지에서 보낸 이름 데이터를 가져옵니다.
    // 데이터가 없을 경우를 대비해 '회원'을 기본값으로 설정합니다.
    const userName = location.state?.userName || '회원';

    const handleFinish = () => {
        // '완료' 버튼 클릭 시 로그인 페이지로 이동합니다.
        navigate('/login');
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.card}>

                {/* 축하 일러스트 영역 */}
                <div className={styles.illust}>🎉</div>

                {/* 환영 메시지 영역 */}
                <div>
                    <h1 className={styles.title}>
                        <span className={styles.highlight}>{userName}</span>님<br/>
                        환영합니다!
                    </h1>
                    <p className={styles.desc}>
                        머니메이트의 모든 서비스를 이용해보세요.
                    </p>
                </div>

                {/* 완료 버튼 영역 */}
                <button
                    onClick={handleFinish}
                    className={styles.submitBtn}
                >
                    로그인하러 가기
                </button>

            </div>
        </div>
    );
}

export default SignUpComplete;