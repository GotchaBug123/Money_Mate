import React, {useState, useEffect} from 'react';
import styles from './CommunityManagePage.module.css';
import {getAdminPostsApi, deleteAdminPostApi} from '../../api/adminApi.js';

function CommunityManagePage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState('list');
    const [selectedPost, setSelectedPost] = useState(null);
    const [searchType, setSearchType] = useState('all');
    const [searchInput, setSearchInput] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await getAdminPostsApi();
                setPosts(Array.isArray(data) ? data : (data.posts ?? []));
            } catch (error) {
                console.error('게시글 목록 조회 실패:', error);
                alert('게시글 목록을 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filteredPosts = posts.filter((post) => {
        if (!searchKeyword) return true;
        const postId = String(post.postId ?? post.postNo ?? '').toLowerCase();
        const title = (post.title ?? '').toLowerCase();
        const authorId = (post.authorId ?? post.writerId ?? '').toLowerCase();
        const authorName = (post.authorName ?? post.writerName ?? '').toLowerCase();
        const createdAt = (post.createdAt ?? '').toLowerCase();
        if (searchType === 'postNo') return postId.includes(searchKeyword);
        if (searchType === 'title') return title.includes(searchKeyword);
        if (searchType === 'writerId') return authorId.includes(searchKeyword);
        if (searchType === 'writerName') return authorName.includes(searchKeyword);
        if (searchType === 'createdAt') return createdAt.includes(searchKeyword);
        return postId.includes(searchKeyword) || title.includes(searchKeyword) ||
            authorId.includes(searchKeyword) || authorName.includes(searchKeyword) ||
            createdAt.includes(searchKeyword);
    });

    const totalCount = posts.length;
    const todayCount = posts.filter(p => (p.createdAt ?? '').startsWith(new Date().toISOString().slice(0, 10))).length;

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchKeyword(searchInput.trim().toLowerCase());
    };

    const handleSearchReset = () => {
        setSearchType('all');
        setSearchInput('');
        setSearchKeyword('');
    };

    const handleOpenDetail = (post) => { setSelectedPost(post); setMode('detail'); };
    const handleCloseDetail = () => { setSelectedPost(null); setMode('list'); };

    const handleDeleteClick = async (postId) => {
        if (!window.confirm('정말 이 게시글을 삭제하시겠습니까?')) return;
        try {
            await deleteAdminPostApi(postId);
            setPosts(prev => prev.filter(p => (p.postId ?? p.postNo) !== postId));
            if (selectedPost && (selectedPost.postId ?? selectedPost.postNo) === postId) {
                setSelectedPost(null);
                setMode('list');
            }
        } catch (error) {
            console.error('게시글 삭제 실패:', error);
            alert('게시글 삭제에 실패했습니다.');
        }
    };

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>커뮤니티 관리</h2>
                    <p className={styles.desc}>게시글 목록을 조회하고, 부적절한 게시글을 삭제할 수 있습니다.</p>
                </div>
            </div>

            <div className={styles.summaryGrid}>
                <article className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>전체 게시글 수</span>
                    <span className={styles.summaryValue}>{totalCount}개</span>
                </article>
                <article className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>오늘 등록된 게시글</span>
                    <span className={styles.summaryValue}>{todayCount}개</span>
                </article>
                <article className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>검색된 게시글</span>
                    <span className={styles.summaryValue}>{filteredPosts.length}개</span>
                </article>
            </div>

            {mode === 'list' && (
                <>
                    <div className={styles.toolbar}>
                        <form className={styles.searchBox} onSubmit={handleSearchSubmit}>
                            <select className={styles.select} value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                                <option value="all">전체</option>
                                <option value="postNo">게시글 번호</option>
                                <option value="title">제목</option>
                                <option value="writerId">작성자 ID</option>
                                <option value="writerName">작성자 이름</option>
                                <option value="createdAt">작성일</option>
                            </select>
                            <input type="text" className={styles.input} value={searchInput}
                                   onChange={(e) => setSearchInput(e.target.value)} placeholder="검색어를 입력하세요"/>
                            <button type="submit" className={styles.primaryBtn}>검색</button>
                            <button type="button" className={styles.secondaryBtn} onClick={handleSearchReset}>초기화</button>
                        </form>
                    </div>

                    <div className={styles.tableWrapper}>
                        <div className={styles.tableHead}>
                            <span>번호</span>
                            <span>제목</span>
                            <span>작성자</span>
                            <span>작성일</span>
                            <span>테마</span>
                            <span>관리</span>
                        </div>
                        {loading ? (
                            <div style={{padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)'}}>불러오는 중...</div>
                        ) : filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => {
                                const postId = post.postId ?? post.postNo;
                                const authorName = post.authorName ?? post.writerName ?? '-';
                                const authorId = post.authorId ?? post.writerId ?? '';
                                return (
                                    <div className={styles.tableRow} key={postId}>
                                        <span>{postId}</span>
                                        <span className={styles.colTitle} onClick={() => handleOpenDetail(post)}>
                                            {post.title}
                                        </span>
                                        <span>{authorName}<br/><small style={{color: 'var(--color-text-muted)'}}>({authorId})</small></span>
                                        <span>{(post.createdAt ?? '').slice(0, 10)}</span>
                                        <span>{post.themeName ?? '-'}</span>
                                        <div className={styles.actionGroup}>
                                            <button className={styles.actionBtn} onClick={() => handleOpenDetail(post)}>상세</button>
                                            <button className={styles.dangerBtn} onClick={() => handleDeleteClick(postId)}>삭제</button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div style={{padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)'}}>
                                검색 결과가 없습니다.
                            </div>
                        )}
                    </div>
                </>
            )}

            {mode === 'detail' && selectedPost && (
                <div className={styles.tableWrapper} style={{padding: '32px'}}>
                    <div className={styles.header} style={{marginBottom: '24px'}}>
                        <h2 className={styles.title}>게시글 상세 조회</h2>
                    </div>
                    <div className={styles.detailGrid}>
                        <div className={styles.detailField}>
                            <span className={styles.detailLabel}>게시글 번호</span>
                            <span className={styles.detailValue}>{selectedPost.postId ?? selectedPost.postNo}</span>
                        </div>
                        <div className={styles.detailField}>
                            <span className={styles.detailLabel}>작성일</span>
                            <span className={styles.detailValue}>{(selectedPost.createdAt ?? '').slice(0, 10)}</span>
                        </div>
                        <div className={styles.detailField}>
                            <span className={styles.detailLabel}>작성자 이름</span>
                            <span className={styles.detailValue}>{selectedPost.authorName ?? selectedPost.writerName}</span>
                        </div>
                        <div className={styles.detailField}>
                            <span className={styles.detailLabel}>테마</span>
                            <span className={styles.detailValue}>{selectedPost.themeName ?? '-'}</span>
                        </div>
                        <div className={`${styles.detailField} ${styles.full}`}>
                            <span className={styles.detailLabel}>제목</span>
                            <span className={styles.detailValue} style={{fontSize: '18px'}}>{selectedPost.title}</span>
                        </div>
                        <div className={`${styles.detailField} ${styles.full}`}>
                            <span className={styles.detailLabel}>내용</span>
                            <div className={styles.detailValue} style={{
                                padding: '16px', background: '#fff', border: '1px solid var(--color-border)',
                                borderRadius: '8px', minHeight: '100px', whiteSpace: 'pre-wrap'
                            }}>
                                {selectedPost.content ?? selectedPost.contentPreview}
                            </div>
                        </div>
                    </div>
                    <div style={{display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px'}}>
                        <button type="button" className={styles.secondaryBtn} onClick={handleCloseDetail}
                                style={{minWidth: '160px'}}>
                            목록으로 돌아가기
                        </button>
                        <button type="button" className={styles.dangerBtn}
                                onClick={() => handleDeleteClick(selectedPost.postId ?? selectedPost.postNo)}
                                style={{minWidth: '160px'}}>
                            게시글 삭제
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}

export default CommunityManagePage;
