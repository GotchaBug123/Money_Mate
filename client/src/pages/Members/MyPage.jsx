import React, {useState, useEffect} from 'react';
import styles from './MyPage.module.css';

function MyPage() {
    // 💡 백엔드 연동 전 임시로 사용할 Mock 데이터
    const mockData = {
        profile: {
            name: '김수형',
            tier: 'Gold',
            email: 'bestevan01@gmail.com'
        },
        finance: {
            score: 85,
            investableAmount: '500,000',
            propensity: '위험중립형',
            progress: '80%'
        }
    };

    const [userInfo, setUserInfo] = useState(mockData.profile);
    const [financeInfo, setFinanceInfo] = useState(mockData.finance);

    // 나중에 백엔드 API를 호출할 자리입니다.
    useEffect(() => {
        // axios.get('/api/member/mypage').then(res => {
        //   setUserInfo(res.data.profile);
        //   setFinanceInfo(res.data.finance);
        // })
    }, []);

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>

                {/* 왼쪽: 회원 정보 수정 영역 */}
                <div className={styles.leftPanel}>
                    <h2 className={styles.sectionTitle}>회원 정보 수정</h2>
                    <div className={styles.infoContent}>
                        <p>이름: {userInfo.name}</p>
                        <p>이메일: {userInfo.email}</p>
                        {/* 여기에 나중에 <input> 태그들을 넣어서 폼을 만들면 됩니다. */}
                    </div>
                </div>

                {/* 오른쪽: 프로필 및 진단 정보 영역 */}
                <div className={styles.rightPanel}>

                    {/* 우측 상단 프로필 박스 */}
                    <div className={styles.profileCard}>
                        <h3 className={styles.profileTitle}>프로필</h3>
                        <p className={styles.profileTier}>
                            {userInfo.tier} 등급
                        </p>
                    </div>

                    {/* 4개의 네모 박스 그리드 영역 */}
                    <div className={styles.financeGrid}>
                        <div className={styles.financeCard}>
                            <h3 className={styles.financeTitle}>재무 점수</h3>
                            <p className={`${styles.financeValue} ${styles.large}`}>{financeInfo.score}점</p>
                        </div>

                        <div className={styles.financeCard}>
                            <h3 className={styles.financeTitle}>투자 가능 금액</h3>
                            <p className={`${styles.financeValue} ${styles.medium}`}>{financeInfo.investableAmount}원</p>
                        </div>

                        <div className={styles.financeCard}>
                            <h3 className={styles.financeTitle}>투자 성향</h3>
                            <p className={`${styles.financeValue} ${styles.small}`}>{financeInfo.propensity}</p>
                        </div>

                        <div className={styles.financeCard}>
                            <h3 className={styles.financeTitle}>진단 진행률</h3>
                            <p className={`${styles.financeValue} ${styles.large} ${styles.primary}`}>{financeInfo.progress}</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default MyPage;