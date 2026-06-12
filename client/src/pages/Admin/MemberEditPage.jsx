import React, { useState } from 'react';

function MemberEditPage({ member, onUpdateMember }) {
    const [editForm, setEditForm] = useState({
        memberNo: member.memberNo,
        userId: member.userId,
        name: member.name,
        birthDate: member.birthDate,
        joinedAt: member.joinedAt,
        phone: member.phone,
        email: member.email,
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setEditForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onUpdateMember(editForm);
    };

    return (
        <main className="admin-content-main">
            <section className="member-edit-page">
                <div className="admin-page-label">회원정보수정 화면</div>

                <h2 className="content-title edit-title">회원정보 수정</h2>

                <form className="member-edit-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>회원번호</label>
                        <input
                            type="text"
                            name="memberNo"
                            value={editForm.memberNo}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>

                    <div className="form-field">
                        <label>회원 이름</label>
                        <input
                            type="text"
                            name="name"
                            value={editForm.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <label>생년월일</label>
                        <input
                            type="date"
                            name="birthDate"
                            value={editForm.birthDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <label>회원 아이디</label>
                        <input
                            type="text"
                            name="userId"
                            value={editForm.userId}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <label>가입일</label>
                        <input
                            type="date"
                            name="joinedAt"
                            value={editForm.joinedAt}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <label>전화번호</label>
                        <input
                            type="text"
                            name="phone"
                            value={editForm.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <label>이메일</label>
                        <input
                            type="email"
                            name="email"
                            value={editForm.email}
                            onChange={handleChange}
                        />
                    </div>

                    <button className="member-update-button" type="submit">
                        회원정보 수정
                    </button>
                </form>
            </section>
        </main>
    );
}

export default MemberEditPage;