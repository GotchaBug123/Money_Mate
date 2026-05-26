import React, {useState} from 'react';

import './communityManage.css';

function CommunityManagePage({posts, onUpdatePost, onDeletePost}) {
    const [mode, setMode] = useState('list');
    const [selectedPost, setSelectedPost] = useState(null);
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

        return (
            post.postNo.toLowerCase().includes(searchKeyword) ||
            post.title.toLowerCase().includes(searchKeyword) ||
            post.writerId.toLowerCase().includes(searchKeyword) ||
            post.writerName.toLowerCase().includes(searchKeyword) ||
            post.createdAt.toLowerCase().includes(searchKeyword)
        );
    });

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
                    <div className="admin-page-label">커뮤니티관리 화면</div>

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
                                수정완료
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
                <div className="community-page-top">
                    <div className="admin-page-label">커뮤니티관리 화면</div>

                    <form className="community-search-box" onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            placeholder="게시글 번호 / 제목 / 작성자 검색"
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
                        <span>작성자 회원 ID</span>
                        <span>작성자</span>
                        <span>작성일</span>
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
                            <h2>게시글 확인</h2>

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