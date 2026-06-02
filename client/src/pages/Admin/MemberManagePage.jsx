import React, {useState} from 'react';
import styles from './MemberManagePage.module.css'; // 💡 모듈 CSS 적용

function MemberManagePage({members, onDeleteMember, onUpdateMember}) {
    const [searchType, setSearchType] = useState('all');
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
        if (!searchKeyword) return true;

        const memberNo = member.memberNo.toLowerCase();
        const userId = member.userId.toLowerCase();
        const name = member.name.toLowerCase();
        const email = member.email.toLowerCase();

        if (searchType === 'memberNo') return memberNo.includes(searchKeyword);
        if (searchType === 'userId') return userId.includes(searchKeyword);
        if (searchType === 'name') return name.includes(searchKeyword);
        if (searchType === 'email') return email.includes(searchKeyword);

        return (
            memberNo.includes(searchKeyword) ||
            userId.includes(searchKeyword) ||
            name.includes(searchKeyword) ||
            email.includes(searchKeyword)
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
        setEditForm((prev) => ({...prev, [name]: value}));
    };

    const handleUpdateSubmit = (event) => {
        event.preventDefault();
        onUpdateMember(editForm);
        alert('회원 정보가 성공적으로 수정되었습니다.');
        setSelectedMember(null);
    };

    return (
        <main className={styles.container}>

            {/* 상단 헤더 영역 */}
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>회원정보 관리</h2>
                    <p className={styles.desc}>가입 회원의 기본 정보와 계정 상태를 확인하고 관리합니다.</p>
                </div>
            </div>

            {/* 통계 요약 (좌측 정렬) */}
            <div className={styles.summaryGrid}>
                <article className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>전체 회원</span>
                    <span className={styles.summaryValue}>{members.length}명</span>
                </article>
                <article className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>검색된 회원</span>
                    <span className={styles.summaryValue}>{filteredMembers.length}명</span>
                </article>
            </div>

            {/* 툴바 및 검색 영역 */}
            <div className={styles.toolbar}>
                <div>
                    <h3 style={{margin: '0 0 4px', fontSize: '18px', color: 'var(--color-text-main)'}}>회원 목록</h3>
                    <span style={{fontSize: '14px', color: 'var(--color-text-muted)'}}>조건에 맞는 회원을 검색하세요.</span>
                </div>

                <form className={styles.searchBox} onSubmit={handleSearchSubmit}>
                    <select
                        className={styles.select}
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="all">전체 검색</option>
                        <option value="memberNo">회원번호</option>
                        <option value="userId">아이디</option>
                        <option value="name">이름</option>
                        <option value="email">이메일</option>
                    </select>

                    <input
                        className={styles.input}
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="검색어 입력"
                    />

                    <button className={styles.primaryBtn} type="submit">
                        검색
                    </button>
                </form>
            </div>

            {/* 리스트 테이블 영역 */}
            <div className={styles.tableWrapper}>
                <div className={styles.tableHead}>
                    <span>회원번호</span>
                    <span>아이디</span>
                    <span>이름</span>
                    <span>생년월일</span>
                    <span>가입일</span>
                    <span>연락처</span>
                    <span>이메일</span>
                    <span>관리</span>
                </div>

                <div>
                    {filteredMembers.length > 0 ? (
                        filteredMembers.map((member) => (
                            <div className={styles.tableRow} key={member.memberNo}>
                                <span>{member.memberNo}</span>
                                <span>{member.userId}</span>
                                <span style={{fontWeight: '600'}}>{member.name}</span>
                                <span>{member.birthDate}</span>
                                <span>{member.joinedAt}</span>
                                <span>{member.phone}</span>
                                <span className={styles.ellipsis} title={member.email}>{member.email}</span>

                                <div className={styles.actionGroup}>
                                    <button
                                        type="button"
                                        className={styles.actionBtn}
                                        onClick={() => handleOpenEditModal(member)}
                                    >
                                        수정
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.dangerBtn}
                                        onClick={() => onDeleteMember(member.memberNo)}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)'}}>
                            검색 결과가 없습니다.
                        </div>
                    )}
                </div>
            </div>

            {/* 💡 회원 정보 수정 모달창 */}
            {selectedMember && (
                <div className={styles.modalOverlay} onClick={handleCloseEditModal}>
                    <section className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>회원정보 수정</h2>
                            <button className={styles.modalCloseBtn} type="button" onClick={handleCloseEditModal}>
                                ✕
                            </button>
                        </div>

                        <form className={styles.formGrid} onSubmit={handleUpdateSubmit}>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>회원번호</label>
                                <input
                                    type="text"
                                    name="memberNo"
                                    value={editForm.memberNo}
                                    onChange={handleEditChange}
                                    readOnly
                                />
                            </div>

                            <div className={styles.formField}>
                                <label className={styles.formLabel}>가입일</label>
                                <input
                                    type="date"
                                    name="joinedAt"
                                    value={editForm.joinedAt}
                                    onChange={handleEditChange}
                                    readOnly
                                />
                            </div>

                            <div className={styles.formField}>
                                <label className={styles.formLabel}>아이디</label>
                                <input
                                    type="text"
                                    name="userId"
                                    value={editForm.userId}
                                    onChange={handleEditChange}
                                    required
                                />
                            </div>

                            <div className={styles.formField}>
                                <label className={styles.formLabel}>회원 이름</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleEditChange}
                                    required
                                />
                            </div>

                            <div className={styles.formField}>
                                <label className={styles.formLabel}>생년월일</label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={editForm.birthDate}
                                    onChange={handleEditChange}
                                    required
                                />
                            </div>

                            <div className={styles.formField}>
                                <label className={styles.formLabel}>전화번호</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={editForm.phone}
                                    onChange={handleEditChange}
                                    required
                                />
                            </div>

                            <div className={`${styles.formField} ${styles.full}`}>
                                <label className={styles.formLabel}>이메일</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editForm.email}
                                    onChange={handleEditChange}
                                    required
                                />
                            </div>

                            <div className={styles.modalActions}>
                                <button className={styles.secondaryBtn} type="button" onClick={handleCloseEditModal}>
                                    취소
                                </button>
                                <button className={styles.primaryBtn} type="submit" style={{padding: '12px 32px'}}>
                                    저장하기
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