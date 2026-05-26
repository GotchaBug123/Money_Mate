import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

function InquiryWrite() {
    const navigate = useNavigate();

    // 폼 상태 관리
    const [formData, setFormData] = useState({
        title: '',
        type: '',
        content: '',
        file: null
    });

    const handleChange = (e) => {
        const {name, value, files} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 필수 입력값 검증
        if (!formData.title || !formData.type || !formData.content) {
            alert('제목, 문의 유형, 내용을 모두 입력해 주세요.');
            return;
        }

        // 백엔드 연동 전 임시 성공 처리
        alert('문의가 성공적으로 등록되었습니다.');
        navigate('/customer-service'); // 등록 완료 후 고객센터 메인으로 복귀
    };

    // 공통 입력창 스타일
    const inputStyle = {
        width: '100%',
        padding: '16px',
        border: '1px solid var(--border-color)',
        borderRadius: '4px',
        fontSize: '16px',
        boxSizing: 'border-box',
        backgroundColor: 'white'
    };

    return (
        <div className="container" style={{display: 'flex', justifyContent: 'center', padding: '60px 20px'}}>
            <div style={{width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px'}}>

                <h2 style={{textAlign: 'center', marginBottom: '24px', color: 'var(--text-main)'}}>고객센터 문의하기</h2>

                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>

                    {/* 1. 제목 입력 */}
                    <input
                        type="text"
                        name="title"
                        placeholder="제목"
                        value={formData.title}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    {/* 2. 문의 유형 선택 (Select) */}
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        style={{...inputStyle, cursor: 'pointer', appearance: 'auto'}}
                    >
                        <option value="" disabled>문의 유형 선택</option>
                        <option value="account">계정/로그인 문의</option>
                        <option value="service">서비스 이용 문의</option>
                        <option value="error">오류 신고</option>
                        <option value="other">기타</option>
                    </select>

                    {/* 3. 문의 내용 입력 (Textarea) - 와이어프레임의 오타 수정 반영 */}
                    <textarea
                        name="content"
                        placeholder="문의 내용"
                        value={formData.content}
                        onChange={handleChange}
                        style={{...inputStyle, minHeight: '300px', resize: 'vertical'}}
                    />

                    {/* 4. 파일 첨부 */}
                    <div style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        padding: '16px',
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <input
                            type="file"
                            name="file"
                            onChange={handleChange}
                            style={{fontSize: '16px', color: 'var(--text-muted)'}}
                        />
                    </div>

                    {/* 5. 문의 등록 버튼 */}
                    <div style={{display: 'flex', justifyContent: 'center', marginTop: '24px'}}>
                        <button
                            type="submit"
                            style={{
                                padding: '16px 60px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                fontSize: '18px',
                                cursor: 'pointer'
                            }}
                        >
                            문의 등록
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}

export default InquiryWrite;