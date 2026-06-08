import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './FinancialDiagnosis.module.css';
import {saveFinancialProfile, getFinancialDiagnosis} from '../../../api/financialDiagnosisApi.js';

const fields = [
    {
        key: 'income',
        label: '월 수입',
        desc: '세후 월 평균 수입을 입력해주세요.',
        placeholder: '월 수입을 입력하세요',
        icon: '💰',
    },
    {
        key: 'fixedExpense',
        label: '월 고정지출',
        desc: '매월 고정적으로 지출되는 금액을 입력해주세요.',
        placeholder: '월 고정지출을 입력하세요',
        icon: '📋',
    },
    {
        key: 'variableExpense',
        label: '월 변동지출',
        desc: '식비, 교통비 등 변동적인 지출을 입력해주세요.',
        placeholder: '월 변동지출을 입력하세요',
        icon: '🛒',
    },
    {
        key: 'totalAsset',
        label: '총 자산',
        desc: '부동산, 금융자산 등 보유한 총 자산 금액을 입력해주세요.',
        placeholder: '총 자산을 입력하세요',
        icon: '🏦',
    },
    {
        key: 'debt',
        label: '총 부채',
        desc: '대출, 카드빚 등 총 부채 금액을 입력해주세요.',
        placeholder: '총 부채를 입력하세요',
        icon: '📊',
    },
    {
        key: 'cash',
        label: '보유 현금',
        desc: '현재 보유하고 있는 현금 및 예금 금액을 입력해주세요.',
        placeholder: '보유 현금을 입력하세요',
        icon: '💳',
    },
];

const FinancialInput = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        income: '', fixedExpense: '', variableExpense: '', totalAsset: '', debt: '', cash: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (key) => (e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        setForm((prev) => ({...prev, [key]: val}));
    };

    const isValid = Object.values(form).every((v) => v !== '');

    const handleSubmit = async () => {
        if (!isValid) return alert('모든 항목을 입력해주세요.');
        setLoading(true);
        try {
            const toWon = (manwon) => Number(manwon) * 10000;
            await saveFinancialProfile({
                monthlyIncome: toWon(form.income),
                monthlyFixedExpense: toWon(form.fixedExpense),
                monthlyVariableExpense: toWon(form.variableExpense),
                totalAsset: toWon(form.totalAsset),
                totalLiability: toWon(form.debt),
                cashAsset: toWon(form.cash),
            });
            const diagnosisData = await getFinancialDiagnosis();
            navigate('/financial/result', {state: {diagnosisData, form}});
        } catch (error) {
            console.error('재무진단 실패:', error);
            alert('재무진단 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            {/* 페이지 헤더 */}
            <div className={styles.pageHeader}>
                <div className={styles.headerIllust}>
                    <span style={{fontSize: 40}}>📋</span>
                </div>
                <div className={styles.headerText}>
                    <h1 className={styles.headerTitle}>
                        <span className={styles.headerHighlight}>재무진단</span>을 위한 정보를 입력해주세요
                    </h1>
                    <p className={styles.headerDesc}>
                        정확한 재무진단을 위해 현재 상황을 자세히 입력해주세요.<br/>
                        입력하신 정보는 <strong>안전하게 보호되며</strong>, 맞춤형 투자 전략 수립에 활용됩니다.
                    </p>
                </div>
            </div>

            {/* 폼 컨테이너 */}
            <div className={styles.formContainer}>
                {fields.map((f) => (
                    <div key={f.key} className={styles.fieldRow}>
                        <div className={styles.fieldLeft}>
                            <div className={styles.fieldIconWrap}>
                                <span className={styles.fieldIconEmoji}>{f.icon}</span>
                            </div>
                            <div>
                                <p className={styles.fieldLabel}>{f.label}</p>
                                <p className={styles.fieldDesc}>{f.desc}</p>
                            </div>
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                inputMode="numeric"
                                className={`${styles.textInput} ${form[f.key] ? styles.inputFilled : ''}`}
                                placeholder={f.placeholder}
                                value={form[f.key] ? Number(form[f.key]).toLocaleString() : ''}
                                onChange={handleChange(f.key)}
                            />
                            <span className={styles.inputUnit}>만원</span>
                        </div>
                    </div>
                ))}

                {/* 보안 안내 배너 */}
                <div className={styles.securityBanner}>
                    <span className={styles.securityIcon}>🔒</span>
                    <div>
                        <p className={styles.securityTitle}>입력하신 정보는 암호화되어 <span className={styles.securityHighlight}>안전하게 보호됩니다.</span>
                        </p>
                        <p className={styles.securityDesc}>개인정보는 재무진단 및 맞춤형 투자 전략 수립 목적 외에는 사용되지 않습니다.</p>
                    </div>
                </div>

                {/* 제출 버튼 */}
                <div className={styles.submitRow}>
                    <button
                        className={`${styles.submitBtn} ${(!isValid || loading) ? styles.submitBtnDisabled : ''}`}
                        onClick={handleSubmit}
                        disabled={!isValid || loading}
                    >
                        {loading ? '분석 중...' : '✦ 재무진단 시작하기'}
                    </button>
                    <p className={styles.submitHint}>입력하신 정보를 바탕으로 맞춤형 재무진단을 시작합니다.</p>
                </div>
            </div>
        </div>
    );
};

export default FinancialInput;