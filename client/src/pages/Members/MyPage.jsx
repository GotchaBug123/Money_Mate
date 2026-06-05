import React, {useEffect, useState} from 'react';
import styles from './MyPage.module.css';
import {
    getFinanceDiagnosisApi,
    getFinancialProfileApi,
    getMyInfoApi,
    getMyInvestmentApi,
    updateMyInfoApi
} from "../../api/myPageApi.js";
import {useAuthStore} from "../../store/useAuthStore.js";

function MyPage() {
    const {user, login} = useAuthStore();

    const [userInfo, setUserInfo] = useState({
        name: user?.name || '회원',
        tier: '일반',
        email: user?.email || '',
        loginId: user?.loginId || '',
        birthDate: ''
    });

    const [financeInfo, setFinanceInfo] = useState({
        score: 0,
        investableAmount: '0',
        propensity: '진단 전',
        progress: '0%'
    });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birthDate: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchMyData = async () => {
            try {
                const res = await getMyInfoApi();
                if (res.success) {
                    const data = res.data;
                    setUserInfo(prev => ({
                        ...prev,
                        name: data.name,
                        email: data.email,
                        loginId: data.loginId,
                        birthDate: data.birthDate
                    }));
                    setFormData({
                        name: data.name,
                        email: data.email,
                        birthDate: data.birthDate
                    });
                }

                const [diagnosisRes, profileRes, investmentRes] = await Promise.all([
                    getFinanceDiagnosisApi().catch(() => null),
                    getFinancialProfileApi().catch(() => null),
                    getMyInvestmentApi().catch(() => null)
                ]);

                if (diagnosisRes) {
                    setUserInfo(prev => ({...prev, tier: diagnosisRes.grade || '일반'}));
                    setFinanceInfo(prev => ({...prev, score: diagnosisRes.totalScore || 0}));
                }

                if (profileRes) {
                    const formattedAmount = (profileRes.investableAmount || 0).toLocaleString();
                    setFinanceInfo(prev => ({...prev, investableAmount: formattedAmount}));
                }

                if (investmentRes && investmentRes.riskResult) {
                    setFinanceInfo(prev => ({...prev, propensity: investmentRes.riskResult.resultType || '진단 전'}));
                }

                let progressPercent = 0;
                if (profileRes) progressPercent += 50;
                if (diagnosisRes) progressPercent += 50;
                setFinanceInfo(prev => ({...prev, progress: `${progressPercent}%`}));
            } catch (error) {
                console.error('마이페이지 정보 로드 실패: ', error);
            }
        };
        fetchMyData();
    }, []);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.name || !formData.email) {
            return alert('이름과 이메일은 필수 입력 항목입니다.');
        }

        setIsLoading(true);

        try {
            await updateMyInfoApi({
                name: formData.name,
                email: formData.email,
                birthDate: formData.birthDate
            });

            setUserInfo(prev => ({
                ...prev,
                name: formData.name,
                email: formData.email
            }));

            login({...user, name: formData.name, email: formData.email});

            alert('회원 정보가 성공적으로 수정되었습니다.');
        } catch (error) {
            console.error('회원 정보 수정 실패: ', error);
            alert('회원 정보 수정에 실패했습니다. 다시 시도해 주세요.');
        } finally {
            setIsLoading(false);
        }
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
                            {/* 아이디 - 읽기 전용 (disabled) */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>아이디</label>
                                <input
                                    type="text"
                                    name="loginId"
                                    value={userInfo.loginId}
                                    className={styles.input}
                                    disabled
                                    style={{backgroundColor: 'var(--color-bg-input)', color: 'var(--color-text-muted)'}}
                                />
                            </div>

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
                                <label className={styles.label}>이메일</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>

                            <button type="submit" className={styles.saveButton} disabled={isLoading}>
                                {isLoading ? '저장 중...' : '회원 정보 저장'}
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