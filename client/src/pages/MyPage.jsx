// src/pages/MyPage.jsx
import React, {useState, useEffect} from 'react';

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
        <div className="container" style={{padding: '40px 20px', display: 'flex', gap: '24px'}}>

            {/* 왼쪽: 회원 정보 수정 영역 */}
            <div className="card" style={{flex: 1, minHeight: '500px'}}>
                <h2>회원 정보 수정</h2>
                <div style={{marginTop: '20px', color: 'var(--text-muted)'}}>
                    <p>이름: {userInfo.name}</p>
                    <p>이메일: {userInfo.email}</p>
                    {/* 여기에 나중에 <input> 태그들을 넣어서 폼을 만들면 됩니다. */}
                </div>
            </div>

            {/* 오른쪽: 프로필 및 진단 정보 영역 */}
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '24px'}}>

                {/* 우측 상단 프로필 박스 */}
                <div className="card" style={{alignSelf: 'flex-end', width: '200px', textAlign: 'center'}}>
                    <h3>프로필</h3>
                    <p style={{color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '24px'}}>
                        {userInfo.tier} 등급
                    </p>
                </div>

                {/* 4개의 네모 박스 그리드 영역 */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flex: 1}}>
                    <div className="card" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <h3 style={{margin: 0, color: 'var(--text-muted)'}}>재무 점수</h3>
                        <p style={{fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0'}}>{financeInfo.score}점</p>
                    </div>

                    <div className="card" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <h3 style={{margin: 0, color: 'var(--text-muted)'}}>투자 가능 금액</h3>
                        <p style={{
                            fontSize: '28px',
                            fontWeight: 'bold',
                            margin: '10px 0 0'
                        }}>{financeInfo.investableAmount}원</p>
                    </div>

                    <div className="card" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <h3 style={{margin: 0, color: 'var(--text-muted)'}}>투자 성향</h3>
                        <p style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            margin: '10px 0 0'
                        }}>{financeInfo.propensity}</p>
                    </div>

                    <div className="card" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <h3 style={{margin: 0, color: 'var(--text-muted)'}}>진단 진행률</h3>
                        <p style={{
                            fontSize: '32px',
                            fontWeight: 'bold',
                            margin: '10px 0 0',
                            color: 'var(--primary-color)'
                        }}>{financeInfo.progress}</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default MyPage;