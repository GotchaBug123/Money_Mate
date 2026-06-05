import React, {useEffect, useState} from 'react';
import styles from './MyPage.module.css';

function MyPage() {
    const mockData = {
        profile: {
            name: '김수형',
            tier: 'Gold',
            email: 'bestevan01@gmail.com',
            userId: 'bestevan01'
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
    const [formData, setFormData] = useState(mockData.profile);

    useEffect(() => {
        // axios.get('/api/member/mypage').then(res => {
        //   setUserInfo(res.data.profile);
        //   setFinanceInfo(res.data.finance);
        //   setFormData(res.data.profile);
        // })
    }, []);

    const handleChange = (event) => {
        const {name, value} = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setUserInfo(formData);
        alert('회원 정보가 수정되었습니다.');
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>

                <div className={styles.heroCard}>
                    <div>
                        <h1 className={styles.heroTitle}>{userInfo.name}님, 안녕하세요!</h1>
                        <p className={styles.heroDesc}>
                            회원 정보와 재무 진단 결과를 한 화면에서 확인하고 관리할 수 있어요.
                        </p>
                    </div>

                    <div className={styles.heroTierCard}>
                        <span>{userInfo.name}님의 등급</span>
                        <strong>{userInfo.tier}</strong>
                    </div>
                </div>

                <div className={styles.contentGrid}>

                    <section className={styles.leftPanel}>
                        <div className={styles.panelHeader}>
                            <p className={styles.panelLabel}>Profile</p>
                            <h2 className={styles.sectionTitle}>회원 정보 수정</h2>
                        </div>

                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>이름</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>아이디</label>
                                <input
                                    type="text"
                                    name="userId"
                                    value={formData.userId}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>이메일</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.noticeBox}>
                                백엔드 연동 전까지는 화면에서만 임시로 수정됩니다.
                            </div>

                            <button type="submit" className={styles.saveButton}>
                                회원 정보 저장
                            </button>
                        </form>
                    </section>

                    <section className={styles.rightPanel}>
                        <div className={styles.profileCard}>
                            <span className={styles.profileTitle}>{userInfo.name}님의 등급</span>
                            <p className={styles.profileTier}>{userInfo.tier} 등급</p>
                            <span className={styles.profileDesc}>
                                꾸준한 진단과 포트폴리오 관리로 등급을 높여보세요.
                            </span>
                        </div>

                        <div className={styles.financeGrid}>
                            <div className={styles.financeCard}>
                                <span className={styles.financeIcon}>📊</span>
                                <h3 className={styles.financeTitle}>재무 점수</h3>
                                <p className={styles.financeValue}>{financeInfo.score}점</p>
                            </div>

                            <div className={styles.financeCard}>
                                <span className={styles.financeIcon}>💰</span>
                                <h3 className={styles.financeTitle}>투자 가능 금액</h3>
                                <p className={styles.financeValue}>{financeInfo.investableAmount}원</p>
                            </div>

                            <div className={styles.financeCard}>
                                <span className={styles.financeIcon}>🧭</span>
                                <h3 className={styles.financeTitle}>투자 성향</h3>
                                <p className={styles.financeValue}>{financeInfo.propensity}</p>
                            </div>

                            <div className={styles.financeCard}>
                                <span className={styles.financeIcon}>✅</span>
                                <h3 className={styles.financeTitle}>진단 진행률</h3>
                                <p className={`${styles.financeValue} ${styles.primary}`}>
                                    {financeInfo.progress}
                                </p>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}

export default MyPage;