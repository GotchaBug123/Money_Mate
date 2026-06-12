// src/pages/Terms.jsx
import React from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './Terms.module.css';
import {TermsContent} from '../../components/policies/PolicyContents'; // 💡 공통 약관 불러오기

function Terms() {
    const navigate = useNavigate();

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>서비스 이용약관</h1>
                        <p className={styles.lastUpdated}>시행일자: 2026년 06월 01일</p>
                    </div>

                    {/* 💡 공통 컴포넌트 하나로 본문 퉁치기! */}
                    <div className={styles.content}>
                        <TermsContent/>
                    </div>

                    <div className={styles.footer}>
                        <button className={styles.backBtn} onClick={() => navigate(-1)}>
                            이전 페이지로 돌아가기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Terms;