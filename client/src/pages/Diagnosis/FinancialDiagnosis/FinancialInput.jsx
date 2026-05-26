import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FinancialDiagnosis.module.css';

const fields = [
    { key: 'income',          label: '월 수입',    placeholder: '월 수입을 입력하세요 (만원)' },
    { key: 'fixedExpense',    label: '월 고정지출', placeholder: '월 고정지출을 입력하세요 (만원)' },
    { key: 'variableExpense', label: '월 변동지출', placeholder: '월 변동지출을 입력하세요 (만원)' },
    { key: 'debt',            label: '부채',       placeholder: '총 부채를 입력하세요 (만원)' },
    { key: 'cash',            label: '보유 현금',   placeholder: '보유 현금을 입력하세요 (만원)' },
];

const FinancialInput = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        income: '', fixedExpense: '', variableExpense: '', debt: '', cash: '',
    });

    const handleChange = (key) => (e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        setForm((prev) => ({ ...prev, [key]: val }));
    };

    const isValid = Object.values(form).every((v) => v !== '');

    const handleSubmit = () => {
        if (isValid) navigate('/financial/result', { state: form });
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.formContainer}>
                {fields.map((f) => (
                    <div key={f.key} className={styles.fieldRow}>
                        <label className={styles.fieldLabel}>{f.label}</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                inputMode="numeric"
                                className={`${styles.textInput} ${form[f.key] ? styles.inputFilled : ''}`}
                                placeholder={f.placeholder}
                                value={form[f.key] ? Number(form[f.key]).toLocaleString() : ''}
                                onChange={handleChange(f.key)}
                            />
                            {form[f.key] && <span className={styles.inputUnit}>만원</span>}
                        </div>
                    </div>
                ))}

                <div className={styles.submitRow}>
                    <button
                        className={`${styles.submitBtn} ${!isValid ? styles.submitBtnDisabled : ''}`}
                        onClick={handleSubmit}
                        disabled={!isValid}
                    >
                        재무진단 시작
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinancialInput;