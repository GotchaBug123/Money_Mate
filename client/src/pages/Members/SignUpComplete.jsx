import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import './SignUpComplete.css';

function SignUpComplete() {
    const navigate = useNavigate();
    const location = useLocation();

    // 회원가입 페이지에서 보낸 이름 데이터를 가져옵니다.
    // 데이터가 없을 경우를 대비해 '회원'을 기본값으로 설정합니다.
    const userName = location.state?.userName || '회원';

    const handleFinish = () => {
        // '완료' 버튼 클릭 시 로그인 페이지로 이동합니다.
        navigate('/login');
    };

    return (
        <div className="container signup-complete-wrapper">
            <div className="card signup-complete-card">

                {/* 환영 메시지 영역 */}
                <div className="welcome-message-box">
                    <h1 className="welcome-title">
                        <span className="welcome-name">{userName}</span>님<br/>
                        환영합니다!
                    </h1>
                </div>

                {/* 완료 버튼 영역 */}
                <div className="finish-btn-wrapper">
                    <button
                        onClick={handleFinish}
                        className="finish-btn"
                    >
                        완료
                    </button>
                </div>

            </div>
        </div>
    );
}

export default SignUpComplete;