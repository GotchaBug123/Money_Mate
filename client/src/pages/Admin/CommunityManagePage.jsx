import React, {useState} from 'react';
import styles from './CommunityManagePage.module.css'; // 💡 모듈 CSS 불러오기

function CommunityManagePage({posts, onUpdatePost, onDeletePost}) {
    const [mode, setMode] = useState('list');
    const [selectedPost, setSelectedPost] = useState(null);
    const [searchType, setSearchType] = useState('all');
    const [searchInput, setSearchInput] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [editForm, setEditForm] = useState({
        postNo: '',
        title: '',
        writerId: '',
        writerName: '',
        createdAt: '',
        content: '',
        attachmentName: '',
        attachmentUrl: '',
    });

    // 💡 검색 로직 유지
    const filteredPosts = posts.filter((post) => {
        if (!searchKeyword) return true;

        const postNo = post.postNo.toLowerCase();
        const title = post.title.toLowerCase();
        const writerId = post.writerId.toLowerCase();
        const writerName = post.writerName.toLowerCase();
        const createdAt = post.createdAt.toLowerCase();

        if (searchType === 'postNo') return postNo.includes(searchKeyword);
        if (searchType === 'title') return title.includes(searchKeyword);
        if (searchType === 'writerId') return writerId.includes(searchKeyword);
        if (searchType === 'writerName') return writerName.includes(searchKeyword);
        if (searchType === 'createdAt') return createdAt.includes(searchKeyword);

        return (
            postNo.includes(searchKeyword) ||
            title.includes(searchKeyword) ||
            writerId.includes(searchKeyword) ||
            writerName.includes(searchKeyword) ||
            createdAt.includes(searchKeyword)
        );
    });

    const totalPostsCount = posts.length;
    const todayPostsCount = posts.filter((post) => {
        const today = new Date().toISOString().slice(0, 10);
        return post.createdAt === today;
    }).length;

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setSearchKeyword(searchInput.trim().toLowerCase());
    };

    const handleSearchReset = () => {
        setSearchType('all');
        setSearchInput('');
        setSearchKeyword('');
    };

    // 상세, 수정, 삭제 모드 핸들러
    const handleOpenDetail = (post) => {
        setSelectedPost(post);
        setMode('detail');
    };
    const handleCloseDetail = () => {
        setSelectedPost(null);
        setMode('list');
    };

    const handleOpenEdit = (post) => {
        setEditForm({...post});
        setMode('edit');
    };
    const handleCloseEdit = () => {
        setEditForm({
            postNo: '', title: '', writerId: '', writerName: '',
            createdAt: '', content: '', attachmentName: '', attachmentUrl: '',
        });
        setMode('list');
    };

    const handleEditChange = (event) => {
        const {name, value} = event.target;
        setEditForm((prev) => ({...prev, [name]: value}));
    };
    const handleEditFileChange = (event) => {
        const file = event.target.files[0];
        setEditForm((prev) => ({
            ...prev,
            attachmentName: file ? file.name : prev.attachmentName,
            attachmentUrl: file ? URL.createObjectURL(file) : prev.attachmentUrl,
        }));
    };
    const handleEditSubmit = (event) => {
        event.preventDefault();
        if (onUpdatePost) onUpdatePost(editForm);
        alert('게시글 정보가 수정되었습니다.');
        setMode('list');
    };

    const handleDeleteClick = (postNo) => {
        const isConfirm = window.confirm('정말 이 게시글을 삭제하시겠습니까?');
        if (isConfirm) {
            if (onDeletePost) onDeletePost(postNo);
            alert('게시글이 삭제되었습니다.');
        }
    };

    return (
        <main className={styles.container}>

            {/* 상단 헤더 및 요약 정보 */}
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>커뮤니티 관리</h2>
                    <p className={styles.desc}>게시글 목록을 조회하고, 부적절한 게시글을 수정 및 삭제할 수 있습니다.</p>
                </div>
            </div>

            <div className={styles.summaryGrid}>
                <article className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>전체 게시글 수</span>
                    <span className={styles.summaryValue}>{totalPostsCount}개</span>
                </article>
                <article className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>오늘 등록된 게시글</span>
                    <span className={styles.summaryValue}>{todayPostsCount}개</span>
                </article>
                <article className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>검색된 게시글</span>
                    <span className={styles.summaryValue}>{filteredPosts.length}개</span>
                </article>
            </div>

            {/* 리스트 뷰 */}
            {mode === 'list' && (
                <>
                    <div className={styles.toolbar}>
                        <form className={styles.searchBox} onSubmit={handleSearchSubmit}>
                            <select
                                className={styles.select}
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                            >
                                <option value="all">전체</option>
                                <option value="postNo">게시글 번호</option>
                                <option value="title">제목</option>
                                <option value="writerId">작성자 ID</option>
                                <option value="writerName">작성자 이름</option>
                                <option value="createdAt">작성일</option>
                            </select>

                            <input
                                type="text"
                                className={styles.input}
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="검색어를 입력하세요"
                            />
                            <button type="submit" className={styles.primaryBtn}>
                                검색
                            </button>
                            <button type="button" className={styles.secondaryBtn} onClick={handleSearchReset}>
                                초기화
                            </button>
                        </form>
                    </div>

                    <div className={styles.tableWrapper}>
                        <div className={styles.tableHead}>
                            <span>번호</span>
                            <span>제목</span>
                            <span>작성자</span>
                            <span>작성일</span>
                            <span>첨부파일</span>
                            <span>관리</span>
                        </div>

                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => (
                                <div className={styles.tableRow} key={post.postNo}>
                                    <span>{post.postNo}</span>
                                    <span
                                        className={styles.colTitle}
                                        onClick={() => handleOpenDetail(post)}
                                    >
                                        {post.title}
                                    </span>
                                    <span>{post.writerName}<br/><small
                                        style={{color: 'var(--color-text-muted)'}}>({post.writerId})</small></span>
                                    <span>{post.createdAt}</span>
                                    <span>{post.attachmentName ? 'O' : 'X'}</span>
                                    <div className={styles.actionGroup}>
                                        <button className={styles.actionBtn} onClick={() => handleOpenEdit(post)}>수정
                                        </button>
                                        <button className={styles.dangerBtn}
                                                onClick={() => handleDeleteClick(post.postNo)}>삭제
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
                </>
            )}

            {/* 수정 모드 (기존 모달 대신 화면 전환 형식으로 변경하여 깔끔하게 표시) */}
            {mode === 'edit' && (
                <div className={styles.tableWrapper} style={{padding: '32px'}}>
                    <div className={styles.header} style={{marginBottom: '24px'}}>
                        <h2 className={styles.title}>게시글 수정</h2>
                    </div>

                    <form onSubmit={handleEditSubmit}>
                        <div className={styles.detailGrid}>
                            <div className={styles.detailField}>
                                <span className={styles.detailLabel}>게시글 번호</span>
                                <span className={styles.detailValue}>{editForm.postNo}</span>
                            </div>
                            <div className={styles.detailField}>
                                <span className={styles.detailLabel}>작성일</span>
                                <span className={styles.detailValue}>{editForm.createdAt}</span>
                            </div>
                            <div className={styles.detailField}>
                                <span className={styles.detailLabel}>작성자 이름</span>
                                <span className={styles.detailValue}>{editForm.writerName}</span>
                            </div>
                            <div className={styles.detailField}>
                                <span className={styles.detailLabel}>작성자 ID</span>
                                <span className={styles.detailValue}>{editForm.writerId}</span>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>제목</label>
                            <input
                                type="text"
                                name="title"
                                value={editForm.title}
                                onChange={handleEditChange}
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>내용</label>
                            <textarea
                                name="content"
                                value={editForm.content}
                                onChange={handleEditChange}
                                className={styles.textarea}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>첨부파일</label>
                            <div className={styles.fileBox}>
                                <input type="file" onChange={handleEditFileChange}/>
                                <span style={{fontSize: '13px', color: 'var(--color-text-muted)'}}>
                                    현재 파일: {editForm.attachmentName || '없음'}
                                </span>
                            </div>
                        </div>

                        <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px'}}>
                            <button type="button" className={styles.secondaryBtn} onClick={handleCloseEdit}>
                                취소
                            </button>
                            <button type="submit" className={styles.primaryBtn}>
                                저장
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* 상세 보기 모드 */}
            {mode === 'detail' && selectedPost && (
                <div className={styles.tableWrapper} style={{padding: '32px'}}>
                    <div className={styles.header} style={{marginBottom: '24px'}}>
                        <h2 className={styles.title}>게시글 상세 조회</h2>
                    </div>

                    <div className={styles.detailGrid}>
                        <div className={styles.detailField}>
                            <span className={styles.detailLabel}>게시글 번호</span>
                            <span className={styles.detailValue}>{selectedPost.postNo}</span>
                        </div>
                        <div className={styles.detailField}>
                            <span className={styles.detailLabel}>작성일</span>
                            <span className={styles.detailValue}>{selectedPost.createdAt}</span>
                        </div>
                        <div className={styles.detailField}>
                            <span className={styles.detailLabel}>작성자 이름</span>
                            <span className={styles.detailValue}>{selectedPost.writerName}</span>
                        </div>
                        <div className={styles.detailField}>
                            <span className={styles.detailLabel}>작성자 ID</span>
                            <span className={styles.detailValue}>{selectedPost.writerId}</span>
                        </div>
                        <div className={`${styles.detailField} ${styles.full}`}>
                            <span className={styles.detailLabel}>제목</span>
                            <span className={styles.detailValue} style={{fontSize: '18px'}}>{selectedPost.title}</span>
                        </div>
                        <div className={`${styles.detailField} ${styles.full}`}>
                            <span className={styles.detailLabel}>내용</span>
                            <div className={styles.detailValue} style={{
                                padding: '16px',
                                background: '#fff',
                                border: '1px solid var(--color-border)',
                                borderRadius: '8px',
                                minHeight: '100px',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {selectedPost.content}
                            </div>
                        </div>
                        <div className={`${styles.detailField} ${styles.full}`}>
                            <span className={styles.detailLabel}>첨부파일</span>
                            <div>
                                <a
                                    className={`${styles.attachmentLink} ${!selectedPost.attachmentUrl ? styles.disabled : ''}`}
                                    href={selectedPost.attachmentUrl || undefined}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(event) => {
                                        if (!selectedPost.attachmentUrl) event.preventDefault();
                                    }}
                                >
                                    {selectedPost.attachmentName ? `📁 ${selectedPost.attachmentName} 확인하기` : '첨부파일 없음'}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div style={{display: 'flex', justifyContent: 'center', marginTop: '24px'}}>
                        <button type="button" className={styles.primaryBtn} onClick={handleCloseDetail}
                                style={{minWidth: '200px'}}>
                            목록으로 돌아가기
                        </button>
                    </div>
                </div>
            )}

        </main>
    );
}

export default CommunityManagePage;