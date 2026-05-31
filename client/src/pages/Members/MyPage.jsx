import React, {useState, useEffect} from 'react';
import './MyPage.css';

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
        <div className="container mypage-wrapper">

            {/* 왼쪽: 회원 정보 수정 영역 */}
            <div className="card mypage-left-panel">
                <h2>회원 정보 수정</h2>
                <div className="mypage-info-content">
                    <p>이름: {userInfo.name}</p>
                    <p>이메일: {userInfo.email}</p>
                    {/* 여기에 나중에 <input> 태그들을 넣어서 폼을 만들면 됩니다. */}
                </div>
            </div>

            {/* 오른쪽: 프로필 및 진단 정보 영역 */}
            <div className="mypage-right-panel">

                {/* 우측 상단 프로필 박스 */}
                <div className="card profile-card">
                    <h3>프로필</h3>
                    <p className="profile-tier">
                        {userInfo.tier} 등급
                    </p>
                </div>

                {/* 4개의 네모 박스 그리드 영역 */}
                <div className="finance-grid">
                    <div className="card finance-card">
                        <h3 className="finance-title">재무 점수</h3>
                        <p className="finance-value large">{financeInfo.score}점</p>
                    </div>

                    <div className="card finance-card">
                        <h3 className="finance-title">투자 가능 금액</h3>
                        <p className="finance-value medium">{financeInfo.investableAmount}원</p>
                    </div>

                    <div className="card finance-card">
                        <h3 className="finance-title">투자 성향</h3>
                        <p className="finance-value small">{financeInfo.propensity}</p>
                    </div>

                    <div className="card finance-card">
                        <h3 className="finance-title">진단 진행률</h3>
                        {/* 💡 primary 클래스를 추가해 색상을 다르게 적용 */}
                        <p className="finance-value large primary">{financeInfo.progress}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyPage;