import React, {useState, useEffect} from 'react';
import styles from './userCommunity.module.css';
import {useAuthStore} from '../../store/useAuthStore.js';
import {
    getCommunityMainApi,
    getCommunityThemesApi,
    getCommunityPostsApi,
    createCommunityPostApi,
    updateCommunityPostApi,
    deleteCommunityPostApi,
    likeCommunityPostApi,
    unlikeCommunityPostApi,
    getCommunityCommentsApi,
    createCommunityCommentApi,
    getMyPostsApi,
} from '../../api/communityApi.js';

const renderStockLogo = (name) => (
    <span className={styles.stockLogoBox}>
        <span className={styles.stockLogoFallback}>{name ? name.slice(0, 1) : '?'}</span>
    </span>
);

const getThemeName = (theme) => {
    return theme?.themeName ?? theme?.name ?? theme?.title ?? '테마';
};

const extractThemes = (payload) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (Array.isArray(payload?.themes)) {
        return payload.themes;
    }

    if (Array.isArray(payload?.data?.themes)) {
        return payload.data.themes;
    }

    if (Array.isArray(payload?.data)) {
        return payload.data;
    }

    return [];
};

function UserCommunityPage() {
    const {user, openLoginModal} = useAuthStore();

    const [themes, setThemes] = useState([]);
    const [mainData, setMainData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [myPosts, setMyPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);

    const [view, setView] = useState('home');
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');

    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [commentPost, setCommentPost] = useState(null);
    const [commentInput, setCommentInput] = useState('');

    const [writeForm, setWriteForm] = useState({
        themeId: '', category: 'STOCK', title: '', content: '', stockName: '', stockSymbol: '',
    });

    // 홈 데이터 로드
    useEffect(() => {
        const loadMain = async () => {
            setLoading(true);
            try {
                const data = await getCommunityMainApi();
                setMainData(data);
                let fetchedThemes = extractThemes(data);

                if (fetchedThemes.length === 0) {
                    const themeData = await getCommunityThemesApi();
                    fetchedThemes = extractThemes(themeData);
                }

                setThemes(fetchedThemes);
                if (fetchedThemes.length > 0) setSelectedTheme(fetchedThemes[0]);
            } catch (error) {
                console.error('커뮤니티 메인 조회 실패:', error);
            } finally {
                setLoading(false);
            }
        };
        loadMain();
    }, []);

    // 게시판 뷰 게시글 로드
    useEffect(() => {
        if (view !== 'board') return;
        const loadPosts = async () => {
            setLoading(true);
            try {
                const data = await getCommunityPostsApi({
                    themeId: selectedTheme?.themeId,
                    keyword: searchKeyword || undefined,
                    size: 20,
                });
                setPosts(data.posts || []);
            } catch (error) {
                console.error('게시글 조회 실패:', error);
                alert('게시글을 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        loadPosts();
    }, [view, selectedTheme, searchKeyword]);

    // 내 게시글 로드
    useEffect(() => {
        if (view !== 'myPosts') return;
        const loadMyPosts = async () => {
            setLoading(true);
            try {
                const data = await getMyPostsApi();
                setMyPosts(data.posts || []);
            } catch (error) {
                console.error('내 게시글 조회 실패:', error);
                alert('내 게시글을 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        loadMyPosts();
    }, [view]);

    const goCommunityHome = () => {
        setView('home');
        setSearchInput('');
        setSearchKeyword('');
    };

    const goBoardByTheme = (theme) => {
        setSelectedTheme(theme);
        setView('board');
        setSearchInput('');
        setSearchKeyword('');
    };

    const requireLogin = (nextView) => {
        if (!user) return openLoginModal();
        setView(nextView);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchKeyword(searchInput.trim());
    };

    // 게시글 작성
    const openWriteModal = () => {
        if (!user) return openLoginModal();
        setWriteForm({
            themeId: selectedTheme?.themeId || themes[0]?.themeId || '',
            category: 'STOCK', title: '', content: '', stockName: '', stockSymbol: '',
        });
        setIsWriteModalOpen(true);
    };

    const handleWriteChange = (e) => {
        const {name, value} = e.target;
        setWriteForm(prev => ({...prev, [name]: value}));
    };

    const handleEditChange = (e) => {
        const {name, value} = e.target;
        setEditingPost(prev => ({...prev, [name]: value}));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        if (!writeForm.title.trim() || !writeForm.content.trim()) return alert('제목과 내용을 입력해주세요.');
        try {
            await createCommunityPostApi({
                themeId: writeForm.themeId || undefined,
                category: writeForm.category,
                title: writeForm.title,
                content: writeForm.content,
                stockName: writeForm.stockName || undefined,
                stockSymbol: writeForm.stockSymbol || undefined,
            });
            setIsWriteModalOpen(false);
            setView('board');
            setSearchKeyword('');
        } catch (error) {
            console.error('게시글 작성 실패:', error);
            alert('게시글 작성에 실패했습니다.');
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!editingPost.title?.trim() || !editingPost.content?.trim()) return alert('제목과 내용을 입력해주세요.');
        try {
            await updateCommunityPostApi(editingPost.postId, {
                category: editingPost.category || 'STOCK',
                title: editingPost.title,
                content: editingPost.content,
                stockName: editingPost.stockName || undefined,
            });
            setPosts(prev => prev.map(p => p.postId === editingPost.postId
                ? {...p, title: editingPost.title, content: editingPost.contentPreview}
                : p
            ));
            setMyPosts(prev => prev.map(p => p.postId === editingPost.postId
                ? {...p, title: editingPost.title}
                : p
            ));
            setEditingPost(null);
        } catch (error) {
            console.error('게시글 수정 실패:', error);
            alert('게시글 수정에 실패했습니다.');
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm('게시글을 삭제하시겠습니까?')) return;
        try {
            await deleteCommunityPostApi(postId);
            setMyPosts(prev => prev.filter(p => p.postId !== postId));
            setPosts(prev => prev.filter(p => p.postId !== postId));
        } catch (error) {
            console.error('게시글 삭제 실패:', error);
            alert('게시글 삭제에 실패했습니다.');
        }
    };

    // 좋아요
    const handleLikeClick = async (post) => {
        if (!user) return openLoginModal();
        try {
            if (post.liked) {
                await unlikeCommunityPostApi(post.postId);
                setPosts(prev => prev.map(p => p.postId === post.postId
                    ? {...p, liked: false, likeCount: p.likeCount - 1} : p));
            } else {
                await likeCommunityPostApi(post.postId);
                setPosts(prev => prev.map(p => p.postId === post.postId
                    ? {...p, liked: true, likeCount: p.likeCount + 1} : p));
            }
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
            alert('좋아요 처리에 실패했습니다.');
        }
    };

    // 댓글
    const handleOpenComments = async (post) => {
        setCommentPost(post);
        setCommentInput('');
        try {
            const data = await getCommunityCommentsApi(post.postId);
            setComments(data || []);
        } catch (error) {
            console.error('댓글 조회 실패:', error);
            setComments([]);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user) return openLoginModal();
        if (!commentInput.trim()) return alert('댓글 내용을 입력해주세요.');
        try {
            const newComment = await createCommunityCommentApi(commentPost.postId, commentInput.trim());
            setComments(prev => [...prev, newComment]);
            setCommentInput('');
        } catch (error) {
            console.error('댓글 작성 실패:', error);
            alert('댓글 작성에 실패했습니다.');
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <main className={styles.mainContainer}>
                {view !== 'home' && (
                    <div className={styles.toolbar}>
                        <button type="button" className={styles.toolbarBtn} onClick={goCommunityHome}>커뮤니티 홈</button>
                        <button type="button" className={styles.toolbarBtn}
                                onClick={view === 'myPosts' ? () => setView('board') : goCommunityHome}>
                            뒤로가기
                        </button>
                    </div>
                )}

                <section className={styles.topArea}>
                    <form className={styles.searchBox} onSubmit={handleSearchSubmit}>
                        <input
                            type="text" className={styles.searchInput} value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="종목명 / 제목 / 작성자 검색"
                        />
                        <button type="submit" className={styles.searchBtn}>검색</button>
                    </form>
                    <div className={styles.quickActions}>
                        <button type="button" className={styles.secondaryBtn} onClick={() => requireLogin('myPosts')}>내 게시글</button>
                        <button type="button" className={styles.primaryBtn} onClick={openWriteModal}>글쓰기</button>
                    </div>
                </section>

                {/* ── 홈 뷰 ── */}
                {view === 'home' && (
                    <>
                        <section className={styles.heroSection}>
                            <h2 className={styles.heroTitle}>투자 이야기를 나누고 종목별 의견을 확인해보세요</h2>
                            <p className={styles.heroDesc}>관심 종목, 인기 게시글, 테마별 커뮤니티를 한 화면에서 빠르게 확인할 수 있어요.</p>
                            <div className={styles.quickActions}>
                                <button type="button" className={styles.secondaryBtn}
                                        onClick={() => {
                                            if (themes.length > 0) goBoardByTheme(themes[0]);
                                            else setView('board');
                                        }}>
                                    게시글 둘러보기
                                </button>
                                <button type="button" className={styles.primaryBtn} onClick={openWriteModal}>게시글 작성</button>
                            </div>
                        </section>

                        <section className={styles.themeChips}>
                            {themes.map((theme) => (
                                <button type="button" key={theme.themeId} className={styles.chipBtn}
                                        onClick={() => goBoardByTheme(theme)}>
                                    {getThemeName(theme)}
                                </button>
                            ))}
                        </section>

                        {loading ? (
                            <p style={{color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px 0'}}>불러오는 중...</p>
                        ) : mainData && (
                            <section className={styles.rankSection}>
                                <article className={styles.rankPanel}>
                                    <div className={styles.sectionTitleRow}>
                                        <h2>인기 글</h2>
                                        <small>좋아요 기준</small>
                                    </div>
                                    <div className={styles.rankList}>
                                        {(mainData.popularPosts || []).map((post, index) => (
                                            <button type="button" className={styles.rankItem} key={post.postId}
                                                    onClick={() => {
                                                        const t = themes.find(th => String(th.themeId) === String(post.themeId));
                                                        goBoardByTheme(t || themes[0]);
                                                    }}>
                                                <strong>{index + 1}</strong>
                                                {renderStockLogo(post.stockName)}
                                                <div className={styles.rankText}>
                                                    <b>{post.title}</b>
                                                    <small>{post.stockName} · 좋아요 {post.likeCount}</small>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </article>

                                <article className={styles.rankPanel}>
                                    <div className={styles.sectionTitleRow}>
                                        <h2>인기 커뮤니티</h2>
                                        <small>활동 많은 테마</small>
                                    </div>
                                    <div className={styles.rankList}>
                                        {(mainData.popularCommunities || []).map((theme, index) => (
                                            <button type="button" className={styles.rankItem} key={theme.themeId}
                                                    onClick={() => goBoardByTheme(theme)}>
                                                <strong>{index + 1}</strong>
                                                <div className={styles.rankText}>
                                                    <b>{getThemeName(theme)}</b>
                                                    <small>{theme.description}</small>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </article>
                            </section>
                        )}

                        {mainData && (
                            <section className={styles.themeGrid}>
                                {themes.slice(0, 3).map((theme) => (
                                    <article className={styles.themeCard} key={theme.themeId}>
                                        <div className={styles.themeCardHeader}>
                                            <h3>{getThemeName(theme)}</h3>
                                            <button type="button" onClick={() => goBoardByTheme(theme)}>더보기 &gt;</button>
                                        </div>
                                        <div className={styles.emptyState} style={{cursor: 'pointer'}}
                                             onClick={() => goBoardByTheme(theme)}>
                                            게시글 보러가기 →
                                        </div>
                                    </article>
                                ))}
                            </section>
                        )}
                    </>
                )}

                {/* ── 게시판 뷰 ── */}
                {view === 'board' && (
                    <section className={styles.boardLayout}>
                        <aside className={styles.themeSelect}>
                            <h2>테마 선택</h2>
                            {themes.map((theme) => (
                                <button type="button" key={theme.themeId}
                                        className={`${styles.themeSelectBtn} ${selectedTheme?.themeId === theme.themeId ? styles.active : ''}`}
                                        onClick={() => goBoardByTheme(theme)}>
                                    {getThemeName(theme)}
                                </button>
                            ))}
                        </aside>

                        <section className={styles.boardMain}>
                            <div className={styles.boardTop}>
                                <h2 className={styles.boardTitle}>{getThemeName(selectedTheme)} 게시글</h2>
                                <div className={styles.quickActions}>
                                    <button type="button" className={styles.secondaryBtn}
                                            onClick={() => requireLogin('myPosts')}>내 게시글
                                    </button>
                                    <button type="button" className={styles.primaryBtn} onClick={openWriteModal}>게시글 작성</button>
                                </div>
                            </div>

                            {loading ? (
                                <p style={{color: 'var(--color-text-muted)', padding: '20px 0'}}>불러오는 중...</p>
                            ) : posts.length > 0 ? (
                                posts.map((post) => (
                                    <article className={styles.postCard} key={post.postId}>
                                        <div className={styles.postStockRow}>
                                            {renderStockLogo(post.stockName)}
                                            <div>
                                                <strong>{post.stockName || '종목 없음'}</strong>
                                                <small>{post.themeName ?? post.theme?.themeName ?? post.theme?.name ?? '테마'}</small>
                                            </div>
                                            <span className={styles.themeBadge}>{post.category}</span>
                                        </div>
                                        <div className={styles.postBody}>
                                            <h3>{post.title}</h3>
                                            <p>{post.contentPreview}</p>
                                            <span>{post.authorName} · 좋아요 {post.likeCount} · 조회 {post.viewCount}</span>
                                        </div>
                                        <div className={styles.postActions}>
                                            <button
                                                type="button"
                                                className={`${styles.actionBtn} ${post.liked ? styles.likedBtn : ''}`}
                                                onClick={() => handleLikeClick(post)}
                                            >
                                                {post.liked ? '♥ 좋아요 완료' : '♡ 좋아요'}
                                            </button>
                                            <button type="button" className={styles.actionBtn}
                                                    onClick={() => handleOpenComments(post)}>
                                                댓글 보기
                                            </button>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <div className={`${styles.postCard} ${styles.emptyState}`}>게시글이 없습니다.</div>
                            )}
                        </section>
                    </section>
                )}

                {/* ── 내 게시글 뷰 ── */}
                {view === 'myPosts' && (
                    <section className={styles.myPostsSection}>
                        <div className={styles.myPostsHeader}>
                            <h2 className={styles.heroTitle}>내 게시글</h2>
                            <button type="button" className={styles.secondaryBtn}
                                    onClick={() => setView('board')}>돌아가기</button>
                        </div>
                        <div className={styles.myPostsTable}>
                            <div className={styles.myPostsHead}>
                                <span>번호</span>
                                <span>제목</span>
                                <span>내용 요약</span>
                                <span>관리</span>
                            </div>
                            {loading ? (
                                <div className={styles.emptyState}>불러오는 중...</div>
                            ) : myPosts.length > 0 ? (
                                myPosts.map((post, idx) => (
                                    <div className={styles.myPostsRow} key={post.postId}>
                                        <span>{idx + 1}</span>
                                        <span className={styles.myPostTitle}>{post.title}</span>
                                        <span className={styles.myPostContent}>{post.contentPreview}</span>
                                        <div style={{display: 'flex', gap: '6px'}}>
                                            <button type="button" className={styles.toolbarBtn}
                                                    onClick={() => setEditingPost({...post, content: post.content ?? post.contentPreview ?? ''})}>수정</button>
                                            <button type="button" className={styles.toolbarBtn}
                                                    onClick={() => handleDeletePost(post.postId)}
                                                    style={{color: 'var(--color-error)'}}>삭제</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.emptyState}>작성한 게시글이 없습니다.</div>
                            )}
                        </div>
                    </section>
                )}
            </main>

            {/* 작성 / 수정 모달 */}
            {(isWriteModalOpen || editingPost) && (
                <div className={styles.modalOverlay}>
                    <section className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>{isWriteModalOpen ? '게시글 작성' : '게시글 수정'}</h2>
                            <button type="button" className={styles.modalCloseBtn}
                                    onClick={isWriteModalOpen ? () => setIsWriteModalOpen(false) : () => setEditingPost(null)}>✕</button>
                        </div>
                        <form onSubmit={isWriteModalOpen ? handleCreateSubmit : handleUpdateSubmit}
                              className={styles.modalForm}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>테마</label>
                                <select name="themeId" className={styles.select}
                                        value={isWriteModalOpen ? writeForm.themeId : (editingPost?.themeId || '')}
                                        onChange={isWriteModalOpen ? handleWriteChange : handleEditChange}>
                                    <option value="">테마 없음</option>
                                    {themes.map(t => <option key={t.themeId} value={t.themeId}>{getThemeName(t)}</option>)}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>게시글 제목</label>
                                <input type="text" name="title" className={styles.input}
                                       value={isWriteModalOpen ? writeForm.title : editingPost?.title}
                                       onChange={isWriteModalOpen ? handleWriteChange : handleEditChange}/>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>종목명</label>
                                <input type="text" name="stockName" className={styles.input}
                                       value={isWriteModalOpen ? writeForm.stockName : (editingPost?.stockName || '')}
                                       onChange={isWriteModalOpen ? handleWriteChange : handleEditChange}
                                       placeholder="삼성전자, AAPL 등 (선택)"/>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>내용</label>
                                <textarea name="content" className={styles.textarea}
                                          value={isWriteModalOpen ? writeForm.content : editingPost?.content}
                                          onChange={isWriteModalOpen ? handleWriteChange : handleEditChange}/>
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" className={styles.secondaryBtn}
                                        onClick={isWriteModalOpen ? () => setIsWriteModalOpen(false) : () => setEditingPost(null)}>취소</button>
                                <button type="submit" className={styles.primaryBtn}>
                                    {isWriteModalOpen ? '올리기' : '수정하기'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

            {/* 댓글 모달 */}
            {commentPost && (
                <div className={styles.modalOverlay}>
                    <section className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>댓글 ({comments.length})</h2>
                            <button type="button" className={styles.modalCloseBtn}
                                    onClick={() => setCommentPost(null)}>✕</button>
                        </div>
                        <div className={styles.commentPostContent}>
                            <strong className={styles.commentPostWriter}>
                                {commentPost.stockName} · {commentPost.authorName}
                            </strong>
                            <p className={styles.commentPostTitle}>{commentPost.title}</p>
                            <p>{commentPost.contentPreview}</p>
                        </div>

                        <div className={styles.commentList}>
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <article className={styles.commentItem} key={comment.commentId}>
                                        <div className={styles.commentMain}>
                                            <strong className={styles.commentWriter}>{comment.authorName}</strong>
                                            <p>{comment.content}</p>
                                            <div className={styles.commentMetaRow}>
                                                <span>{new Date(comment.createdAt).toLocaleDateString('ko-KR')}</span>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <div className={styles.emptyState}>아직 댓글이 없습니다.</div>
                            )}
                        </div>

                        <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                            <input
                                type="text" className={styles.input} value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                placeholder={user ? '댓글을 입력하세요.' : '로그인 후 작성 가능합니다.'}
                                disabled={!user}
                            />
                            <button type="submit" className={styles.primaryBtn} style={{whiteSpace: 'nowrap'}}>
                                댓글 등록
                            </button>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}

export default UserCommunityPage;
