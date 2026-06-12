import React, {useState, useEffect} from 'react';
import styles from './MemberManagePage.module.css';
import {getAdminMembersApi, updateAdminMemberApi, deleteAdminMemberApi} from '../../api/adminApi.js';

function MemberManagePage() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchType, setSearchType] = useState('all');
    const [searchInput, setSearchInput] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await getAdminMembersApi();
                setMembers(Array.isArray(data) ? data : (data.members ?? []));
            } catch (error) {
                console.error('회원 목록 조회 실패:', error);
                alert('회원 목록을 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchKeyword(searchInput.trim().toLowerCase());
    };

    const filteredMembers = members.filter((m) => {
        if (!searchKeyword) return true;
        const no = String(m.memberId ?? m.memberNo ?? '').toLowerCase();
        const id = (m.loginId ?? m.userId ?? '').toLowerCase();
        const name = (m.name ?? '').toLowerCase();
        const email = (m.email ?? '').toLowerCase();
        if (searchType === 'memberNo') return no.includes(searchKeyword);
        if (searchType === 'userId') return id.includes(searchKeyword);
        if (searchType === 'name') return name.includes(searchKeyword);
        if (searchType === 'email') return email.includes(searchKeyword);
        return no.includes(searchKeyword) || id.includes(searchKeyword) ||
            name.includes(searchKeyword) || email.includes(searchKeyword);
    });

    const handleOpenEditModal = (member) => {
        setSelectedMember(member);
        setEditForm({...member});
    };

    const handleCloseEditModal = () => setSelectedMember(null);

    const handleEditChange = (e) => {
        const {name, value} = e.target;
        setEditForm(prev => ({...prev, [name]: value}));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const memberId = editForm.memberId;
        try {
            await updateAdminMemberApi(memberId, {
                name: editForm.name,
                email: editForm.email,
                role: editForm.role,
                signupStatus: editForm.signupStatus,
            });
            setMembers(prev => prev.map(m =>
                (m.memberId ?? m.memberNo) === memberId ? {...m, ...editForm} : m
            ));
            alert('회원 정보가 성공적으로 수정되었습니다.');
            setSelectedMember(null);
        } catch (error) {
            console.error('회원 수정 실패:', error);
            alert('회원 정보 수정에 실패했습니다.');
        }
    };

    const handleDeleteMember = async (memberId) => {
        if (!window.confirm('정말 이 회원을 삭제하시겠습니까?')) return;
        try {
            await deleteAdminMemberApi(memberId);
            setMembers(prev => prev.filter(m => m.memberId !== memberId));
            alert('회원이 삭제되었습니다.');
        } catch (error) {
            console.error('회원 삭제 실패:', error);
            alert('회원 삭제에 실패했습니다.');
        }
    };

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>회원정보 관리</h2>
                    <p className={styles.desc}>가입 회원의 기본 정보와 계정 상태를 확인하고 관리합니다.</p>
                </div>
            </div>

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

            <div className={styles.toolbar}>
                <div>
                    <h3 style={{margin: '0 0 4px', fontSize: '18px', color: 'var(--color-text-main)'}}>회원 목록</h3>
                    <span style={{fontSize: '14px', color: 'var(--color-text-muted)'}}>조건에 맞는 회원을 검색하세요.</span>
                </div>
                <form className={styles.searchBox} onSubmit={handleSearchSubmit}>
                    <select className={styles.select} value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                        <option value="all">전체 검색</option>
                        <option value="memberNo">회원번호</option>
                        <option value="userId">아이디</option>
                        <option value="name">이름</option>
                        <option value="email">이메일</option>
                    </select>
                    <input className={styles.input} type="text" value={searchInput}
                           onChange={(e) => setSearchInput(e.target.value)} placeholder="검색어 입력"/>
                    <button className={styles.primaryBtn} type="submit">검색</button>
                </form>
            </div>

            <div className={styles.tableWrapper}>
                <div className={styles.tableHead}>
                    <span>회원번호</span>
                    <span>아이디</span>
                    <span>이름</span>
                    <span>생년월일</span>
                    <span>가입일</span>
                    <span>권한</span>
                    <span>이메일</span>
                    <span>관리</span>
                </div>
                {loading ? (
                    <div style={{padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)'}}>불러오는 중...</div>
                ) : filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                        <div className={styles.tableRow} key={member.memberId}>
                            <span>{member.memberId}</span>
                            <span>{member.loginId}</span>
                            <span style={{fontWeight: '600'}}>{member.name}</span>
                            <span>{member.birthDate ?? '-'}</span>
                            <span>{member.createdAt ? String(member.createdAt).slice(0, 10) : '-'}</span>
                            <span>{member.role ?? '-'}</span>
                            <span className={styles.ellipsis} title={member.email}>{member.email}</span>
                            <div className={styles.actionGroup}>
                                <button type="button" className={styles.actionBtn}
                                        onClick={() => handleOpenEditModal(member)}>수정</button>
                                <button type="button" className={styles.dangerBtn}
                                        onClick={() => handleDeleteMember(member.memberId)}>삭제</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)'}}>
                        검색 결과가 없습니다.
                    </div>
                )}
            </div>

            {selectedMember && (
                <div className={styles.modalOverlay} onClick={handleCloseEditModal}>
                    <section className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>회원정보 수정</h2>
                            <button className={styles.modalCloseBtn} type="button" onClick={handleCloseEditModal}>✕</button>
                        </div>
                        <form className={styles.formGrid} onSubmit={handleUpdateSubmit}>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>회원번호</label>
                                <input type="text" name="memberId" value={editForm.memberId ?? editForm.memberNo ?? ''} readOnly/>
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>가입일</label>
                                <input type="text" name="joinedAt" value={editForm.joinedAt ?? editForm.createdAt ?? ''} readOnly/>
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>아이디</label>
                                <input type="text" name="loginId" value={editForm.loginId ?? editForm.userId ?? ''} onChange={handleEditChange} required/>
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>회원 이름</label>
                                <input type="text" name="name" value={editForm.name ?? ''} onChange={handleEditChange} required/>
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>생년월일</label>
                                <input type="date" name="birthDate" value={editForm.birthDate ?? ''} onChange={handleEditChange}/>
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>전화번호</label>
                                <input type="tel" name="phone" value={editForm.phone ?? ''} onChange={handleEditChange}/>
                            </div>
                            <div className={`${styles.formField} ${styles.full}`}>
                                <label className={styles.formLabel}>이메일</label>
                                <input type="email" name="email" value={editForm.email ?? ''} onChange={handleEditChange} required/>
                            </div>
                            <div className={styles.modalActions}>
                                <button className={styles.secondaryBtn} type="button" onClick={handleCloseEditModal}>취소</button>
                                <button className={styles.primaryBtn} type="submit" style={{padding: '12px 32px'}}>저장하기</button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </main>
    );
}

export default MemberManagePage;
