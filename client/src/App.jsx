import React from 'react';
import './App.css'; // 필요에 따라 주석 처리 또는 유지

function App() {
    return (
        <div className="app-container">
            <header>
                <h1>Money_Mate</h1>
            </header>

            <main>
                <section className="hero-section">
                    <h2>내 지갑 속 현실부터 미래의 목표까지,<br/>데이터로 연결하는 나만의 금융 비서</h2>
                    <p>
                        단순한 투자 상품 추천이 아닙니다.<br/>
                        당신의 실제 수입과 지출 데이터를 분석해 현실적인 투자 가능 금액을 찾아내고,<br/>
                        몬테카를로 시뮬레이션을 통해 목표 달성 확률을 예측합니다.
                    </p>
                    <button>내 소비 진단하기</button>
                </section>
            </main>
        </div>
    );
}

export default App;