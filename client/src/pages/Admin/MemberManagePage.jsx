import React, {useState} from 'react';
import './memberManage.css';

function MemberManagePage({members, onDeleteMember, onUpdateMember}) {
    const [searchInput, setSearchInput] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);

    const [editForm, setEditForm] = useState({
        memberNo: '',
        userId: '',
        name: '',
        birthDate: '',
        joinedAt: '',
        phone: '',
        email: '',
    });

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setSearchKeyword(searchInput.trim().toLowerCase());
    };

    const filteredMembers = members.filter((member) => {
        if (!searchKeyword) {
            return true;
        }

        return (
            member.memberNo.toLowerCase().includes(searchKeyword) ||
            member.userId.toLowerCase().includes(searchKeyword) ||
            member.name.toLowerCase().includes(searchKeyword)
        );
    });

    const handleOpenEditModal = (member) => {
        setSelectedMember(member);
        setEditForm({...member});
    };

    const handleCloseEditModal = () => {
        setSelectedMember(null);
    };

    const handleEditChange = (event) => {
        const {name, value} = event.target;

        setEditForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleUpdateSubmit = (event) => {
        event.preventDefault();

        onUpdateMember(editForm);
        setSelectedMember(null);
    };

    return (
        <main className="admin-content-main">
            <section className="member-list-page">
                <div className="admin-page-label">회원정보관리 화면</div>

                <h2 className="content-title">회원정보 목록</h2>

                <div className="member-list-box">
                    <div className="member-list-top">
                        <div className="member-column-header">
                            <span>회원번호</span>
                            <span>회원 아이디</span>
                            <span>회원 이름</span>
                            <span>가입일</span>
                            <span>관리</span>
                        </div>

                        <form className="member-search-box" onSubmit={handleSearchSubmit}>
                            <input
                                className="member-search-input"
                                type="text"
                                value={searchInput}
                                onChange={(event) => setSearchInput(event.target.value)}
                                placeholder="회원번호 / 아이디 / 이름"
                            />

                            <button className="member-search-button" type="submit">
                                검색
                            </button>
                        </form>
                    </div>

                    <div className="member-table">
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => (
                                <div className="member-row" key={member.memberNo}>
                                    <span>{member.memberNo}</span>
                                    <span>{member.userId}</span>
                                    <span>{member.name}</span>
                                    <span>{member.joinedAt}</span>

                                    <div className="member-actions">
                                        <button
                                            type="button"
                                            className="edit-button"
                                            onClick={() => handleOpenEditModal(member)}
                                        >
                                            수정
                                        </button>

                                        <button
                                            type="button"
                                            className="delete-button"
                                            onClick={() => onDeleteMember(member.memberNo)}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-member-list">
                                검색 결과가 없습니다.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {selectedMember && (
                <div className="modal-backdrop">
                    <section className="member-edit-modal">
                        <div className="modal-header">
                            <h2>회원정보 수정</h2>

                            <button
                                className="modal-close-button"
                                type="button"
                                onClick={handleCloseEditModal}
                            >
                                ×
                            </button>
                        </div>

                        <form className="member-edit-form" onSubmit={handleUpdateSubmit}>
                            <div className="form-field">
                                <label>회원번호</label>
                                <input
                                    type="text"
                                    name="memberNo"
                                    value={editForm.memberNo}
                                    onChange={handleEditChange}
                                    readOnly
                                />
                            </div>

                            <div className="form-field">
                                <label>회원 이름</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleEditChange}
                                />
                            </div>

                            <div className="form-field">
                                <label>생년월일</label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={editForm.birthDate}
                                    onChange={handleEditChange}
                                />
                            </div>

                            <div className="form-field">
                                <label>회원 아이디</label>
                                <input
                                    type="text"
                                    name="userId"
                                    value={editForm.userId}
                                    onChange={handleEditChange}
                                />
                            </div>

                            <div className="form-field">
                                <label>가입일</label>
                                <input
                                    type="date"
                                    name="joinedAt"
                                    value={editForm.joinedAt}
                                    onChange={handleEditChange}
                                />
                            </div>

                            <div className="form-field">
                                <label>전화번호</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={editForm.phone}
                                    onChange={handleEditChange}
                                />
                            </div>

                            <div className="form-field">
                                <label>이메일</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editForm.email}
                                    onChange={handleEditChange}
                                />
                            </div>

                            <div className="modal-button-area">
                                <button
                                    className="modal-cancel-button"
                                    type="button"
                                    onClick={handleCloseEditModal}
                                >
                                    취소
                                </button>

                                <button className="member-update-button" type="submit">
                                    회원정보 수정
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </main>
    );
}

export default MemberManagePage;