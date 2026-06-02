import React, {useState} from 'react';
import styles from './userCommunity.module.css'; // 💡 모듈 CSS 적용

const themes = ['반도체', 'ETF', '배당주', '성장주'];
const interestStocks = ['삼성전자', 'SK하이닉스', 'TIGER 미국S&P500'];

const defaultPosts = [
    {
        postNo: '1',
        title: '삼성전자 장기투자 어떻게 생각하시나요?',
        writerId: 'user01',
        writerName: '이회원',
        createdAt: '2026-05-20',
        content: '삼성전자를 장기적으로 담아가려고 하는데 다른 분들은 어떻게 생각하시나요?',
        attachmentName: 'samsung-analysis.pdf',
        attachmentUrl: '',
        theme: '반도체',
        stockName: '삼성전자',
        likes: 18,
        likedUserIds: [],
        comments: [
            {
                commentNo: '1',
                writerName: '김회원',
                content: '저도 장기 관점이면 괜찮다고 봅니다.',
                createdAt: '2026-05-20',
                replies: [],
            },
        ],
    },
    {
        postNo: '2',
        title: 'ETF 중심 포트폴리오 공유합니다',
        writerId: 'etf100',
        writerName: '정ETF',
        createdAt: '2026-05-21',
        content: '저는 국내 주식보다 ETF 비중을 높게 가져가고 있습니다.',
        attachmentName: '',
        attachmentUrl: '',
        theme: 'ETF',
        stockName: 'TIGER 미국S&P500',
        likes: 24,
        likedUserIds: [],
        comments: [],
    },
    {
        postNo: '3',
        title: '요즘 반도체 주식 흐름 괜찮나요?',
        writerId: 'stock77',
        writerName: '한주식',
        createdAt: '2026-05-22',
        content: '반도체 관련 종목들이 다시 올라오는 것 같아서 의견을 듣고 싶습니다.',
        attachmentName: 'semiconductor.png',
        attachmentUrl: '',
        theme: '반도체',
        stockName: 'SK하이닉스',
        likes: 31,
        likedUserIds: [],
        comments: [],
    },
];

const stockProfiles = {
    삼성전자: {name: '삼성전자', shortName: '삼', description: '국내 대표 반도체·전자 기업'},
    SK하이닉스: {name: 'SK하이닉스', shortName: 'SK', description: '메모리 반도체 대표 기업'},
    'TIGER 미국S&P500': {name: 'TIGER 미국S&P500', shortName: 'T', description: '미국 대표 지수 ETF'},
    KODEX: {name: 'KODEX', shortName: 'K', description: '국내 ETF 브랜드'},
    NAVER: {name: 'NAVER', shortName: 'N', description: '국내 대표 플랫폼 기업'},
    카카오: {name: '카카오', shortName: '카', description: '국내 대표 플랫폼 기업'},
    현대차: {name: '현대차', shortName: '현', description: '국내 대표 자동차 기업'},
    애플: {name: '애플', shortName: 'A', description: '글로벌 대표 기술 기업'},
    마이크로소프트: {name: '마이크로소프트', shortName: 'M', description: '글로벌 소프트웨어 기업'},
    테슬라: {name: '테슬라', shortName: 'T', description: '전기차·AI 성장주'},
    엔비디아: {name: '엔비디아', shortName: 'N', description: 'AI 반도체 대표 기업'},
    구글: {name: '구글', shortName: 'G', description: '글로벌 플랫폼 기업'},
};

function UserCommunityPage({
                               posts: externalPosts,
                               currentUser: externalCurrentUser,
                               onCreatePost,
                               onUpdatePost,
                               onLikePost,
                               onAddComment,
                               onAddReply,
                           }) {
    const [internalPosts, setInternalPosts] = useState(defaultPosts);
    const [view, setView] = useState('home');
    const [selectedTheme, setSelectedTheme] = useState('반도체');
    const [searchInput, setSearchInput] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [selectedCommentPost, setSelectedCommentPost] = useState(null);
    const [commentInput, setCommentInput] = useState('');
    const [replyingCommentNo, setReplyingCommentNo] = useState(null);
    const [replyInput, setReplyInput] = useState('');

    const posts = externalPosts || internalPosts;

    const currentUser = externalCurrentUser || (
        localStorage.getItem('isLoggedIn') === 'true'
            ? {
                userId: localStorage.getItem('role') === 'admin' ? 'admin' : 'test',
                name: localStorage.getItem('role') === 'admin' ? '관리자' : '테스트회원',
            }
            : null
    );

    const [writeForm, setWriteForm] = useState({
        title: '',
        content: '',
        theme: '반도체',
        stockName: '삼성전자',
        attachmentName: '',
        attachmentUrl: '',
    });

    const getCommentsCount = (post) => Array.isArray(post.comments) ? post.comments.length : 0;
    const getRepliesCount = (comment) => Array.isArray(comment.replies) ? comment.replies.length : 0;

    const isLikedPost = (post) => {
        if (!currentUser) return false;
        return (post.likedUserIds || []).includes(currentUser.userId);
    };

    const getStockProfile = (stockName) => {
        return stockProfiles[stockName] || {
            name: stockName,
            shortName: String(stockName).slice(0, 1),
            description: '투자 종목 커뮤니티',
        };
    };

    const renderStockLogo = (stockName) => {
        const profile = getStockProfile(stockName);
        return (
            <span className={styles.stockLogoBox}>
                <span className={styles.stockLogoFallback}>
                    {profile.shortName}
                </span>
            </span>
        );
    };

    const filteredPosts = posts.filter((post) => {
        const matchesSearch =
            !searchKeyword ||
            String(post.title).toLowerCase().includes(searchKeyword) ||
            String(post.content).toLowerCase().includes(searchKeyword) ||
            String(post.writerName).toLowerCase().includes(searchKeyword) ||
            String(post.stockName).toLowerCase().includes(searchKeyword);

        const matchesTheme = view !== 'board' || post.theme === selectedTheme;
        return matchesSearch && matchesTheme;
    });

    const popularPosts = [...posts]
        .sort((a, b) => (b.likes + getCommentsCount(b)) - (a.likes + getCommentsCount(a)))
        .slice(0, 4);

    const popularThemes = themes
        .map((theme) => {
            const themePosts = posts.filter((post) => post.theme === theme);
            const score = themePosts.reduce((sum, post) => sum + post.likes + getCommentsCount(post), 0);
            return {name: theme, count: themePosts.length, score};
        })
        .sort((a, b) => b.score - a.score);

    const myPosts = currentUser ? posts.filter((post) => post.writerId === currentUser.userId) : [];
    const interestPosts = currentUser ? posts.filter((post) => interestStocks.includes(post.stockName)) : [];
    const latestSelectedCommentPost = selectedCommentPost ? posts.find((post) => post.postNo === selectedCommentPost.postNo) : null;

    const updateInternalPost = (updatedPost) => {
        setInternalPosts((prevPosts) =>
            prevPosts.map((post) => post.postNo === updatedPost.postNo ? updatedPost : post)
        );
    };

    const goCommunityHome = () => {
        setView('home');
        setSearchInput('');
        setSearchKeyword('');
        setSelectedTheme('반도체');
    };

    const goBackToBoard = () => {
        setView('board');
        setSearchInput('');
        setSearchKeyword('');
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setSearchKeyword(searchInput.trim().toLowerCase());
    };

    const openWriteModal = () => {
        if (!currentUser) return alert('게시글 작성은 로그인한 회원만 가능합니다.');
        setWriteForm({
            title: '', content: '', theme: selectedTheme,
            stockName: selectedTheme === 'ETF' ? 'TIGER 미국S&P500' : '삼성전자',
            attachmentName: '', attachmentUrl: '',
        });
        setIsWriteModalOpen(true);
    };

    const handleWriteChange = (event) => {
        const {name, value} = event.target;
        setWriteForm((prev) => ({...prev, [name]: value}));
    };

    const handleEditChange = (event) => {
        const {name, value} = event.target;
        setEditingPost((prev) => ({...prev, [name]: value}));
    };

    const handleCreateSubmit = (event) => {
        event.preventDefault();
        if (!writeForm.title.trim() || !writeForm.content.trim()) return alert('게시글 제목과 내용을 입력해주세요.');

        const newPost = {
            ...writeForm, postNo: String(posts.length + 1), writerId: currentUser.userId,
            writerName: currentUser.name, createdAt: new Date().toISOString().slice(0, 10),
            likes: 0, likedUserIds: [], comments: [],
        };

        if (onCreatePost) onCreatePost(newPost);
        else setInternalPosts((prev) => [newPost, ...prev]);

        setIsWriteModalOpen(false);
        setView('board');
        setSelectedTheme(writeForm.theme);
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        if (onUpdatePost) onUpdatePost(editingPost);
        else updateInternalPost(editingPost);

        setEditingPost(null);
        setView('board');
        setSelectedTheme(editingPost.theme);
    };

    const handleLikeClick = (post) => {
        if (!currentUser) return alert('좋아요는 로그인한 회원만 가능합니다.');
        if (isLikedPost(post)) return alert('이미 좋아요를 누른 게시글입니다.');

        if (onLikePost) {
            onLikePost(post.postNo, currentUser.userId);
            return;
        }
        updateInternalPost({
            ...post, likes: post.likes + 1, likedUserIds: [...(post.likedUserIds || []), currentUser.userId],
        });
    };

    const handleReplyButtonClick = (commentNo) => {
        if (!currentUser) return alert('답글 작성은 로그인한 회원만 가능합니다.');
        setReplyingCommentNo((prev) => prev === commentNo ? null : commentNo);
        setReplyInput('');
    };

    const handleCommentSubmit = (event) => {
        event.preventDefault();
        if (!currentUser) return alert('댓글 작성은 로그인한 회원만 가능합니다.');
        if (!commentInput.trim()) return alert('댓글 내용을 입력해주세요.');

        if (onAddComment) {
            onAddComment(latestSelectedCommentPost.postNo, commentInput.trim());
        } else {
            updateInternalPost({
                ...latestSelectedCommentPost,
                comments: [...(latestSelectedCommentPost.comments || []), {
                    commentNo: String((latestSelectedCommentPost.comments || []).length + 1),
                    writerName: currentUser.name, content: commentInput.trim(),
                    createdAt: new Date().toISOString().slice(0, 10), replies: [],
                }],
            });
        }
        setCommentInput('');
    };

    const handleReplySubmit = (event, commentNo) => {
        event.preventDefault();
        if (!currentUser) return alert('답글 작성은 로그인한 회원만 가능합니다.');
        if (!replyInput.trim()) return alert('답글 내용을 입력해주세요.');

        if (onAddReply) {
            onAddReply(latestSelectedCommentPost.postNo, commentNo, replyInput.trim());
        } else {
            updateInternalPost({
                ...latestSelectedCommentPost,
                comments: (latestSelectedCommentPost.comments || []).map((comment) => {
                    if (comment.commentNo !== commentNo) return comment;
                    return {
                        ...comment, replies: [...(comment.replies || []), {
                            replyNo: String((comment.replies || []).length + 1),
                            writerName: currentUser.name, content: replyInput.trim(),
                            createdAt: new Date().toISOString().slice(0, 10),
                        }],
                    };
                }),
            });
        }
        setReplyingCommentNo(null);
        setReplyInput('');
    };

    const goBoardByTheme = (theme) => {
        setSelectedTheme(theme);
        setView('board');
        setSearchInput('');
        setSearchKeyword('');
    };

    const requireLogin = (nextView) => {
        if (!currentUser) return alert('로그인한 회원만 사용할 수 있습니다.');
        setView(nextView);
    };

    return (
        <div className={styles.pageWrapper}>
            <main className={styles.mainContainer}>
                {view !== 'home' && (
                    <div className={styles.toolbar}>
                        <button type="button" className={styles.toolbarBtn} onClick={goCommunityHome}>
                            커뮤니티 홈
                        </button>
                        <button type="button" className={styles.toolbarBtn}
                                onClick={view === 'myPosts' ? goBackToBoard : goCommunityHome}>
                            뒤로가기
                        </button>
                    </div>
                )}

                <section className={styles.topArea}>
                    <form className={styles.searchBox} onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="종목명 / 제목 / 작성자 검색"
                        />
                        <button type="submit" className={styles.searchBtn}>검색</button>
                    </form>

                    <div className={styles.quickActions}>
                        <button type="button" className={styles.secondaryBtn} onClick={() => requireLogin('myPosts')}>
                            내 게시글
                        </button>
                        <button type="button" className={styles.primaryBtn} onClick={openWriteModal}>
                            글쓰기
                        </button>
                    </div>
                </section>

                {view === 'home' && (
                    <>
                        <section className={styles.heroSection}>
                            <span className={styles.heroEyebrow}>MoneyMate Community</span>
                            <h2 className={styles.heroTitle}>투자 이야기를 나누고 종목별 의견을 확인해보세요</h2>
                            <p className={styles.heroDesc}>관심 종목, 인기 게시글, 테마별 커뮤니티를 한 화면에서 빠르게 확인할 수 있어요.</p>
                            <div className={styles.quickActions}>
                                <button type="button" className={styles.secondaryBtn}
                                        onClick={() => goBoardByTheme('반도체')}>게시글 둘러보기
                                </button>
                                <button type="button" className={styles.primaryBtn} onClick={openWriteModal}>게시글 작성
                                </button>
                            </div>
                        </section>

                        <section className={styles.themeChips}>
                            {themes.map((theme) => (
                                <button type="button" key={theme} className={styles.chipBtn}
                                        onClick={() => goBoardByTheme(theme)}>
                                    {theme}
                                </button>
                            ))}
                        </section>

                        <section className={styles.rankSection}>
                            <article className={styles.rankPanel}>
                                <div className={styles.sectionTitleRow}>
                                    <div>
                                        <span>Popular Posts</span>
                                        <h2>인기 글</h2>
                                    </div>
                                    <small>좋아요 + 댓글 기준</small>
                                </div>
                                <div className={styles.rankList}>
                                    {popularPosts.map((post, index) => (
                                        <button type="button" className={styles.rankItem} key={post.postNo}
                                                onClick={() => goBoardByTheme(post.theme)}>
                                            <strong>{index + 1}</strong>
                                            {renderStockLogo(post.stockName)}
                                            <div className={styles.rankText}>
                                                <b>{post.title}</b>
                                                <small>{post.stockName} · 좋아요 {post.likes} ·
                                                    댓글 {getCommentsCount(post)}</small>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </article>

                            <article className={styles.rankPanel}>
                                <div className={styles.sectionTitleRow}>
                                    <div>
                                        <span>Hot Themes</span>
                                        <h2>인기 커뮤니티</h2>
                                    </div>
                                    <small>활동 많은 테마</small>
                                </div>
                                <div className={styles.rankList}>
                                    {popularThemes.map((theme, index) => (
                                        <button type="button" className={styles.rankItem} key={theme.name}
                                                onClick={() => goBoardByTheme(theme.name)}>
                                            <strong>{index + 1}</strong>
                                            <div className={styles.rankText}>
                                                <b>{theme.name}</b>
                                                <small>게시글 {theme.count}개 · 반응 {theme.score}</small>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </article>
                        </section>

                        <section className={styles.themeGrid}>
                            {themes.slice(0, 3).map((theme) => {
                                const themePosts = posts.filter((post) => post.theme === theme).slice(0, 3);
                                return (
                                    <article className={styles.themeCard} key={theme}>
                                        <div className={styles.themeCardHeader}>
                                            <div>
                                                <span>Theme</span>
                                                <h3>{theme}</h3>
                                            </div>
                                            <button type="button"
                                                    onClick={() => goBoardByTheme(theme)}>더보기 &gt;</button>
                                        </div>
                                        {themePosts.length > 0 ? (
                                            themePosts.map((post) => (
                                                <button type="button" className={styles.postPreview} key={post.postNo}
                                                        onClick={() => goBoardByTheme(post.theme)}>
                                                    {renderStockLogo(post.stockName)}
                                                    <div>
                                                        <strong>{post.stockName}</strong>
                                                        <span>{post.title}</span>
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className={styles.emptyState}>아직 게시글이 없습니다.</div>
                                        )}
                                    </article>
                                );
                            })}
                        </section>
                    </>
                )}

                {view === 'board' && (
                    <section className={styles.boardLayout}>
                        <aside className={styles.themeSelect}>
                            <h2>테마 선택</h2>
                            {themes.map((theme) => (
                                <button type="button" key={theme}
                                        className={`${styles.themeSelectBtn} ${selectedTheme === theme ? styles.active : ''}`}
                                        onClick={() => goBoardByTheme(theme)}>
                                    {theme}
                                </button>
                            ))}
                        </aside>

                        <section className={styles.boardMain}>
                            <div className={styles.boardTop}>
                                <div>
                                    <span>Community Board</span>
                                    <h2 className={styles.boardTitle}>{selectedTheme} 게시글</h2>
                                </div>
                                <div className={styles.quickActions}>
                                    <button type="button" className={styles.secondaryBtn}
                                            onClick={() => requireLogin('myPosts')}>내 게시글
                                    </button>
                                    <button type="button" className={styles.primaryBtn} onClick={openWriteModal}>게시글
                                        작성
                                    </button>
                                </div>
                            </div>

                            {filteredPosts.length > 0 ? (
                                filteredPosts.map((post) => {
                                    const profile = getStockProfile(post.stockName);
                                    const isLiked = isLikedPost(post);
                                    return (
                                        <article className={styles.postCard} key={post.postNo}>
                                            <div className={styles.postStockRow}>
                                                {renderStockLogo(post.stockName)}
                                                <div>
                                                    <strong>{post.stockName}</strong>
                                                    <small>{profile.description}</small>
                                                </div>
                                                <span className={styles.themeBadge}>{post.theme}</span>
                                            </div>
                                            <div className={styles.postBody}>
                                                <h3>{post.title}</h3>
                                                <p>{post.content}</p>
                                                <span>{post.writerName} · 좋아요 {post.likes} · 댓글 {getCommentsCount(post)}</span>
                                            </div>
                                            <div className={styles.postActions}>
                                                <button type="button"
                                                        className={`${styles.actionBtn} ${isLiked ? styles.likedBtn : ''}`}
                                                        onClick={() => handleLikeClick(post)}>
                                                    {isLiked ? '♥ 좋아요 완료' : '♡ 좋아요'}
                                                </button>
                                                <button type="button" className={styles.actionBtn} onClick={() => {
                                                    setSelectedCommentPost(post);
                                                    setCommentInput('');
                                                }}>
                                                    댓글 보기
                                                </button>
                                            </div>
                                        </article>
                                    );
                                })
                            ) : (
                                <div className={`${styles.postCard} ${styles.emptyState}`}>
                                    게시글이 없습니다.
                                </div>
                            )}
                        </section>

                        <aside className={styles.interestSection}>
                            <h2>관심 종목</h2>
                            {currentUser ? (
                                interestPosts.length > 0 ? (
                                    interestPosts.map((post) => (
                                        <div className={styles.postPreview} key={post.postNo}>
                                            {renderStockLogo(post.stockName)}
                                            <div>
                                                <strong>{post.stockName}</strong>
                                                <span>{post.title}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className={styles.emptyState} style={{padding: 0}}>관심 종목 게시글이 없습니다.</p>
                                )
                            ) : (
                                <p className={styles.emptyState} style={{padding: 0}}>로그인한 회원만 확인할 수 있습니다.</p>
                            )}
                        </aside>
                    </section>
                )}

                {view === 'myPosts' && (
                    <section className={styles.myPostsSection}>
                        <div className={styles.myPostsHeader}>
                            <h2 className={styles.heroTitle}>내 게시글</h2>
                            <button type="button" className={styles.secondaryBtn} onClick={goBackToBoard}>돌아가기</button>
                        </div>
                        <div className={styles.myPostsTable}>
                            <div className={styles.myPostsHead}>
                                <span>번호</span>
                                <span>제목</span>
                                <span>내용 요약</span>
                                <span>관리</span>
                            </div>
                            {myPosts.length > 0 ? (
                                myPosts.map((post) => (
                                    <div className={styles.myPostsRow} key={post.postNo}>
                                        <span>{post.postNo}</span>
                                        <span className={styles.myPostTitle}>{post.title}</span>
                                        <span className={styles.myPostContent}>{post.content}</span>
                                        <button type="button" className={styles.toolbarBtn}
                                                onClick={() => setEditingPost({...post})}>
                                            수정
                                        </button>
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
                                    onClick={isWriteModalOpen ? () => setIsWriteModalOpen(false) : () => setEditingPost(null)}>✕
                            </button>
                        </div>
                        <form onSubmit={isWriteModalOpen ? handleCreateSubmit : handleEditSubmit}
                              className={styles.modalForm}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>게시글 제목</label>
                                <input type="text" name="title" className={styles.input}
                                       value={isWriteModalOpen ? writeForm.title : editingPost.title}
                                       onChange={isWriteModalOpen ? handleWriteChange : handleEditChange}/>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>테마</label>
                                <select name="theme" className={styles.select}
                                        value={isWriteModalOpen ? writeForm.theme : editingPost.theme}
                                        onChange={isWriteModalOpen ? handleWriteChange : handleEditChange}>
                                    {themes.map((theme) => <option key={theme} value={theme}>{theme}</option>)}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>종목명</label>
                                <input type="text" name="stockName" className={styles.input}
                                       value={isWriteModalOpen ? writeForm.stockName : editingPost.stockName}
                                       onChange={isWriteModalOpen ? handleWriteChange : handleEditChange}/>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>내용</label>
                                <textarea name="content" className={styles.textarea}
                                          value={isWriteModalOpen ? writeForm.content : editingPost.content}
                                          onChange={isWriteModalOpen ? handleWriteChange : handleEditChange}/>
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" className={styles.secondaryBtn}
                                        onClick={isWriteModalOpen ? () => setIsWriteModalOpen(false) : () => setEditingPost(null)}>취소
                                </button>
                                <button type="submit"
                                        className={styles.primaryBtn}>{isWriteModalOpen ? '올리기' : '수정하기'}</button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

            {/* 댓글 모달 */}
            {latestSelectedCommentPost && (
                <div className={styles.modalOverlay}>
                    <section className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>댓글 ({getCommentsCount(latestSelectedCommentPost)})</h2>
                            <button type="button" className={styles.modalCloseBtn}
                                    onClick={() => setSelectedCommentPost(null)}>✕
                            </button>
                        </div>
                        <div className={styles.commentPostContent}>
                            <strong
                                className={styles.commentPostWriter}>{latestSelectedCommentPost.stockName} · {latestSelectedCommentPost.writerName}</strong>
                            <p className={styles.commentPostTitle}>{latestSelectedCommentPost.title}</p>
                            <p>{latestSelectedCommentPost.content}</p>
                        </div>

                        <div className={styles.commentList}>
                            {getCommentsCount(latestSelectedCommentPost) > 0 ? (
                                latestSelectedCommentPost.comments.map((comment) => (
                                    <article className={styles.commentItem} key={comment.commentNo}>
                                        <div className={styles.commentMain}>
                                            <strong className={styles.commentWriter}>{comment.writerName}</strong>
                                            <p>{comment.content}</p>
                                            <div className={styles.commentMetaRow}>
                                                <span>{comment.createdAt}</span>
                                                <button type="button" className={styles.actionBtn}
                                                        style={{padding: '6px 12px', fontSize: '12px'}}
                                                        onClick={() => handleReplyButtonClick(comment.commentNo)}>
                                                    답글 달기
                                                </button>
                                            </div>
                                        </div>
                                        {getRepliesCount(comment) > 0 && (
                                            <div className={styles.replyList}>
                                                {comment.replies.map((reply) => (
                                                    <div className={styles.replyItem} key={reply.replyNo}>
                                                        <strong
                                                            className={styles.replyWriter}>{reply.writerName}</strong>
                                                        <p>{reply.content}</p>
                                                        <span className={styles.replyDate}>{reply.createdAt}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {replyingCommentNo === comment.commentNo && (
                                            <form onSubmit={(e) => handleReplySubmit(e, comment.commentNo)}
                                                  className={styles.replyForm}>
                                                <input type="text"
                                                       className={`${styles.input} ${styles.replyFormInput}`}
                                                       value={replyInput}
                                                       onChange={(e) => setReplyInput(e.target.value)}
                                                       placeholder="답글을 입력하세요."/>
                                                <button type="submit"
                                                        className={`${styles.primaryBtn} ${styles.replyBtnSmall}`}>등록
                                                </button>
                                            </form>
                                        )}
                                    </article>
                                ))
                            ) : (
                                <div className={styles.emptyState}>아직 댓글이 없습니다.</div>
                            )}
                        </div>

                        <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                            <input type="text" className={styles.input} value={commentInput}
                                   onChange={(e) => setCommentInput(e.target.value)}
                                   placeholder={currentUser ? '댓글을 입력하세요.' : '로그인 후 작성 가능합니다.'}
                                   disabled={!currentUser}/>
                            <button type="submit" className={styles.primaryBtn} style={{whiteSpace: 'nowrap'}}>댓글 등록
                            </button>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}

export default UserCommunityPage;