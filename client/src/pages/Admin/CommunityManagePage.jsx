import React, {useState} from 'react';

import './communityManage.css';

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

    const filteredPosts = posts.filter((post) => {
        if (!searchKeyword) {
            return true;
        }

        const postNo = post.postNo.toLowerCase();
        const title = post.title.toLowerCase();
        const writerId = post.writerId.toLowerCase();
        const writerName = post.writerName.toLowerCase();
        const createdAt = post.createdAt.toLowerCase();

        if (searchType === 'postNo') {
            return postNo.includes(searchKeyword);
        }

        if (searchType === 'title') {
            return title.includes(searchKeyword);
        }

        if (searchType === 'writerId') {
            return writerId.includes(searchKeyword);
        }

        if (searchType === 'writerName') {
            return writerName.includes(searchKeyword);
        }

        if (searchType === 'createdAt') {
            return createdAt.includes(searchKeyword);
        }

        return (
            postNo.includes(searchKeyword) ||
            title.includes(searchKeyword) ||
            writerId.includes(searchKeyword) ||
            writerName.includes(searchKeyword) ||
            createdAt.includes(searchKeyword)
        );
    });

    const totalLikeCount = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
    const attachmentCount = posts.filter((post) => post.attachmentName).length;

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setSearchKeyword(searchInput.trim().toLowerCase());
    };

    const handleOpenDetail = (post) => {
        setSelectedPost(post);
    };

    const handleCloseDetail = () => {
        setSelectedPost(null);
    };

    const handleEditClick = (post) => {
        setEditForm({
            ...post,
            attachmentUrl: post.attachmentUrl || '',
        });
        setMode('edit');
    };

    const handleEditChange = (event) => {
        const {name, value} = event.target;

        setEditForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        setEditForm((prevForm) => ({
            ...prevForm,
            attachmentName: file ? file.name : '',
            attachmentUrl: file ? URL.createObjectURL(file) : '',
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        onUpdatePost(editForm);
        setMode('list');
    };

    if (mode === 'edit') {
        return (
            <main className="admin-content-main community-content-main">
                <section className="community-edit-page">
                    <div className="community-page-header">
                        <div>
                            <span className="admin-section-label">Edit Community Post</span>
                            <h2>게시글 수정</h2>
                            <p>커뮤니티 게시글의 작성자 정보, 제목, 내용, 첨부파일을 수정합니다.</p>
                        </div>

                        <button
                            type="button"
                            className="community-back-button"
                            onClick={() => setMode('list')}
                        >
                            목록으로
                        </button>
                    </div>

                    <form className="community-edit-form" onSubmit={handleSubmit}>
                        <div className="community-top-fields">
                            <div className="community-form-field">
                                <label>회원 ID</label>
                                <input
                                    type="text"
                                    name="writerId"
                                    value={editForm.writerId}
                                    onChange={handleEditChange}
                                />
                            </div>

                            <div className="community-form-field">
                                <label>회원 이름</label>
                                <input
                                    type="text"
                                    name="writerName"
                                    value={editForm.writerName}
                                    onChange={handleEditChange}
                                />
                            </div>
                        </div>

                        <div className="community-form-field wide">
                            <label>게시글 제목</label>
                            <input
                                type="text"
                                name="title"
                                value={editForm.title}
                                onChange={handleEditChange}
                            />
                        </div>

                        <div className="community-form-field wide content-field">
                            <label>내용</label>
                            <textarea
                                name="content"
                                value={editForm.content}
                                onChange={handleEditChange}
                            />
                        </div>

                        <div className="community-form-field wide">
                            <label>첨부파일</label>

                            <div className="file-input-box">
                                <input
                                    type="text"
                                    value={editForm.attachmentName || '첨부파일 없음'}
                                    readOnly
                                />

                                <label className="file-select-button">
                                    파일 선택
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                </label>

                                {editForm.attachmentName && (
                                    <a
                                        className={
                                            editForm.attachmentUrl
                                                ? 'file-open-button'
                                                : 'file-open-button disabled'
                                        }
                                        href={editForm.attachmentUrl || undefined}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={(event) => {
                                            if (!editForm.attachmentUrl) {
                                                event.preventDefault();
                                            }
                                        }}
                                    >
                                        파일 확인
                                    </a>
                                )}
                            </div>

                            {editForm.attachmentName && !editForm.attachmentUrl && (
                                <p className="file-help-text">
                                    현재는 파일명만 확인 가능합니다. 실제 파일 열기는 백엔드 파일 URL 연결 후 가능합니다.
                                </p>
                            )}
                        </div>

                        <div className="community-edit-buttons">
                            <button type="button" onClick={() => setMode('list')}>
                                취소
                            </button>
                            <button type="submit">
                                저장
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        );
    }

    return (
        <main className="admin-content-main community-content-main">
            <section className="community-manage-page">
                <div className="community-page-header">
                    <div>
                        <span className="admin-section-label">Community</span>
                        <h2>커뮤니티관리</h2>
                        <p>회원 게시글을 확인하고 필요한 경우 수정 또는 삭제 처리합니다.</p>
                    </div>

                    <div className="community-summary-grid">
                        <article>
                            <span>전체 게시글</span>
                            <strong>{posts.length}</strong>
                        </article>

                        <article>
                            <span>총 좋아요</span>
                            <strong>{totalLikeCount}</strong>
                        </article>

                        <article>
                            <span>첨부파일</span>
                            <strong>{attachmentCount}</strong>
                        </article>
                    </div>
                </div>

                <div className="community-toolbar">
                    <div>
                        <h3>게시글 목록</h3>
                        <span>총 {filteredPosts.length}개의 게시글이 조회되었습니다.</span>
                    </div>

                    <form className="community-search-box" onSubmit={handleSearchSubmit}>
                        <select
                            className="community-search-select"
                            value={searchType}
                            onChange={(event) => setSearchType(event.target.value)}
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
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            placeholder="검색어 입력"
                        />

                        <button type="submit">
                            검색
                        </button>
                    </form>
                </div>

                <div className="community-list-box">
                    <div className="community-table-header">
                        <span>게시글 번호</span>
                        <span>제목</span>
                        <span>작성자 ID</span>
                        <span>작성자</span>
                        <span>작성일</span>
                        <span>좋아요</span>
                        <span>관리</span>
                    </div>

                    <div className="community-table-body">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => (
                                <div className="community-row" key={post.postNo}>
                                    <span>{post.postNo}</span>
                                    <span>{post.title}</span>
                                    <span>{post.writerId}</span>
                                    <span>{post.writerName}</span>
                                    <span>{post.createdAt}</span>
                                    <span>{post.likes || 0}</span>

                                    <div className="community-actions">
                                        <button
                                            type="button"
                                            className="check-button"
                                            onClick={() => handleOpenDetail(post)}
                                        >
                                            확인
                                        </button>
                                        <button
                                            type="button"
                                            className="edit-button"
                                            onClick={() => handleEditClick(post)}
                                        >
                                            수정
                                        </button>
                                        <button
                                            type="button"
                                            className="delete-button"
                                            onClick={() => onDeletePost(post.postNo)}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-community-list">
                                검색 결과가 없습니다.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {selectedPost && (
                <div className="modal-backdrop">
                    <section className="post-detail-modal">
                        <div className="modal-header">
                            <div>
                                <span className="admin-section-label">Post Detail</span>
                                <h2>게시글 확인</h2>
                            </div>

                            <button
                                className="modal-close-button"
                                type="button"
                                onClick={handleCloseDetail}
                            >
                                ×
                            </button>
                        </div>

                        <div className="post-detail-grid">
                            <div className="post-detail-field">
                                <label>회원 ID</label>
                                <div>{selectedPost.writerId}</div>
                            </div>

                            <div className="post-detail-field">
                                <label>회원 이름</label>
                                <div>{selectedPost.writerName}</div>
                            </div>

                            <div className="post-detail-field">
                                <label>작성일</label>
                                <div>{selectedPost.createdAt}</div>
                            </div>

                            <div className="post-detail-field">
                                <label>좋아요</label>
                                <div>{selectedPost.likes || 0}</div>
                            </div>

                            <div className="post-detail-field full">
                                <label>게시글 제목</label>
                                <div>{selectedPost.title}</div>
                            </div>

                            <div className="post-detail-field full content">
                                <label>내용</label>
                                <div>{selectedPost.content}</div>
                            </div>

                            <div className="post-detail-field full">
                                <label>첨부파일</label>
                                <div className="attachment-detail-box">
                                    <span>
                                        {selectedPost.attachmentName || '첨부파일 없음'}
                                    </span>

                                    {selectedPost.attachmentName && (
                                        <a
                                            className={
                                                selectedPost.attachmentUrl
                                                    ? 'attachment-open-link'
                                                    : 'attachment-open-link disabled'
                                            }
                                            href={selectedPost.attachmentUrl || undefined}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={(event) => {
                                                if (!selectedPost.attachmentUrl) {
                                                    event.preventDefault();
                                                }
                                            }}
                                        >
                                            파일 확인
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="post-detail-close-button"
                            onClick={handleCloseDetail}
                        >
                            닫기
                        </button>
                    </section>
                </div>
            )}
        </main>
    );
}

export default CommunityManagePage;