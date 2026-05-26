import React from 'react';
import {Link} from 'react-router-dom';

function Footer() {
    return (
        <footer style={{
            backgroundColor: 'white',
            borderTop: '1px solid var(--border-color)',
            padding: '40px 0',
            color: 'var(--text-muted)',
            fontSize: '14px',
            marginTop: 'auto' // 부모가 flex일 때 아래로 밀어내는 역할
        }}>
            <div className="container" style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>

                {/* 상단 영역: 서비스 이름 및 바로가기 링크 */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <div>
                        <h3 style={{
                            margin: '0 0 8px 0',
                            color: 'var(--primary-color)',
                            fontSize: '18px',
                            fontWeight: 'bold'
                        }}>
                            Money_Mate
                        </h3>
                        <p style={{margin: 0, fontSize: '13px'}}>개인 맞춤형 종합 자산 관리 솔루션 플랫폼</p>
                    </div>

                    {/* 푸터 내부 이동 링크 */}
                    <div style={{display: 'flex', gap: '24px', fontWeight: '500'}}>
                        <Link to="/customer-service" style={{color: 'var(--text-muted)'}}>고객센터</Link>
                        <Link to="/terms" style={{color: 'var(--text-muted)'}}>이용약관</Link>
                        <Link to="/privacy" style={{color: 'var(--text-muted)'}}>개인정보처리방침</Link>
                    </div>
                </div>

                {/* 중단 영역: 투자 유의사항 안전장치 문구 */}
                <div style={{
                    borderTop: '1px solid var(--border-color)',
                    borderBottom: '1px solid var(--border-color)',
                    padding: '16px 0',
                    fontSize: '12px',
                    lineHeight: '1.6',
                    textAlign: 'justify'
                }}>
                    * Money_Mate에서 제공하는 모든 재무 진단 결과 및 투자 성향 분석, 포트폴리오 추천, 목표 달성 시뮬레이션은 과거의 데이터와 통계적 모델에 기반한 가상의 결과이며 미래의
                    투자 수익률을 보장하지 않습니다. 모든 투자 결정의 최종 책임은 사용자 본인에게 있으며, 시장 변동성에 따라 자산의 손실이 발생할 수 있음을 유의하시기 바랍니다.
                </div>

                {/* 하단 영역: 카피라이트 및 팀 정보 */}
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px'}}>
                    <span>© 2026 Money_Mate. All rights reserved.</span>
                    <span style={{fontWeight: '500'}}>버그잡았조 Team Project</span>
                </div>

            </div>
        </footer>
    );
}

export default Footer;