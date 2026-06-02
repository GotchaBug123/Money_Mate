import React from 'react';
import {Link} from 'react-router-dom';
import styles from './Footer.module.css'; // 💡 모듈 CSS 불러오기

function Footer() {
    return (
        <footer className={styles.footerWrapper}>
            <div className={styles.container}>

                {/* 상단 영역: 서비스 이름 및 바로가기 링크 */}
                <div className={styles.topArea}>
                    <div>
                        <h3 className={styles.logoTitle}>Money Mate</h3>
                        <p className={styles.logoDesc}>개인 맞춤형 종합 자산 관리 솔루션 플랫폼</p>
                    </div>

                    {/* 푸터 내부 이동 링크 */}
                    <div className={styles.navLinks}>
                        <Link to="/customer-service" className={styles.navLink}>고객센터</Link>
                        <Link to="/terms" className={styles.navLink}>이용약관</Link>
                        <Link to="/privacy" className={styles.navLink}>개인정보처리방침</Link>
                    </div>
                </div>

                {/* 중단 영역: 투자 유의사항 안전장치 문구 */}
                <div className={styles.noticeArea}>
                    * Money_Mate에서 제공하는 모든 재무 진단 결과 및 투자 성향 분석, 포트폴리오 추천, 목표 달성 시뮬레이션은 과거의 데이터와 통계적 모델에 기반한 가상의 결과이며 미래의
                    투자 수익률을 보장하지 않습니다. 모든 투자 결정의 최종 책임은 사용자 본인에게 있으며, 시장 변동성에 따라 자산의 손실이 발생할 수 있음을 유의하시기 바랍니다.
                </div>

                {/* 하단 영역: 카피라이트 및 팀 정보 */}
                <div className={styles.bottomArea}>
                    <span>© 2026 Money_Mate. All rights reserved.</span>
                    <div className={styles.teamInfo}>
                        <span>Team: 6인조 버그잡았조</span>
                        {/*<span>BE: 3명 | FE: 3명</span>*/}
                    </div>
                </div>

            </div>
        </footer>
    );
}

export default Footer;