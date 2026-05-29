import React, {useState} from 'react';

import './userCommunity.css';

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
    삼성전자: {
        name: '삼성전자',
        shortName: '삼',
        description: '국내 대표 반도체·전자 기업',
    },
    SK하이닉스: {
        name: 'SK하이닉스',
        shortName: 'SK',
        description: '메모리 반도체 대표 기업',
    },
    'TIGER 미국S&P500': {
        name: 'TIGER 미국S&P500',
        shortName: 'T',
        description: '미국 대표 지수 ETF',
    },
    KODEX: {
        name: 'KODEX',
        shortName: 'K',
        description: '국내 ETF 브랜드',
    },
    NAVER: {
        name: 'NAVER',
        shortName: 'N',
        description: '국내 대표 플랫폼 기업',
    },
    카카오: {
        name: '카카오',
        shortName: '카',
        description: '국내 대표 플랫폼 기업',
    },
    현대차: {
        name: '현대차',
        shortName: '현',
        description: '국내 대표 자동차 기업',
    },
    애플: {
        name: '애플',
        shortName: 'A',
        description: '글로벌 대표 기술 기업',
    },
    마이크로소프트: {
        name: '마이크로소프트',
        shortName: 'M',
        description: '글로벌 소프트웨어 기업',
    },
    테슬라: {
        name: '테슬라',
        shortName: 'T',
        description: '전기차·AI 성장주',
    },
    엔비디아: {
        name: '엔비디아',
        shortName: 'N',
        description: 'AI 반도체 대표 기업',
    },
    구글: {
        name: '구글',
        shortName: 'G',
        description: '글로벌 플랫폼 기업',
    },
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

    const getCommentsCount = (post) => {
        return Array.isArray(post.comments) ? post.comments.length : 0;
    };

    const getRepliesCount = (comment) => {
        return Array.isArray(comment.replies) ? comment.replies.length : 0;
    };

    const isLikedPost = (post) => {
        if (!currentUser) {
            return false;
        }

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
            <span className="stock-logo-box">
                <span className="stock-logo-fallback">
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
        .sort((a, b) => {
            const aScore = a.likes + getCommentsCount(a);
            const bScore = b.likes + getCommentsCount(b);

            return bScore - aScore;
        })
        .slice(0, 4);

    const popularThemes = themes
        .map((theme) => {
            const themePosts = posts.filter((post) => post.theme === theme);
            const score = themePosts.reduce(
                (sum, post) => sum + post.likes + getCommentsCount(post),
                0
            );

            return {
                name: theme,
                count: themePosts.length,
                score,
            };
        })
        .sort((a, b) => b.score - a.score);

    const myPosts = currentUser
        ? posts.filter((post) => post.writerId === currentUser.userId)
        : [];

    const interestPosts = currentUser
        ? posts.filter((post) => interestStocks.includes(post.stockName))
        : [];

    const latestSelectedCommentPost = selectedCommentPost
        ? posts.find((post) => post.postNo === selectedCommentPost.postNo)
        : null;

    const updateInternalPost = (updatedPost) => {
        setInternalPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.postNo === updatedPost.postNo ? updatedPost : post
            )
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
        if (!currentUser) {
            alert('게시글 작성은 로그인한 회원만 가능합니다.');
            return;
        }

        setWriteForm({
            title: '',
            content: '',
            theme: selectedTheme,
            stockName: selectedTheme === 'ETF' ? 'TIGER 미국S&P500' : '삼성전자',
            attachmentName: '',
            attachmentUrl: '',
        });
        setIsWriteModalOpen(true);
    };

    const closeWriteModal = () => {
        setIsWriteModalOpen(false);
    };

    const handleWriteChange = (event) => {
        const {name, value} = event.target;

        setWriteForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleWriteFileChange = (event) => {
        const file = event.target.files[0];

        setWriteForm((prevForm) => ({
            ...prevForm,
            attachmentName: file ? file.name : '',
            attachmentUrl: file ? URL.createObjectURL(file) : '',
        }));
    };

    const handleCreateSubmit = (event) => {
        event.preventDefault();

        if (!writeForm.title.trim() || !writeForm.content.trim()) {
            alert('게시글 제목과 내용을 입력해주세요.');
            return;
        }

        const newPost = {
            ...writeForm,
            postNo: String(posts.length + 1),
            writerId: currentUser.userId,
            writerName: currentUser.name,
            createdAt: new Date().toISOString().slice(0, 10),
            likes: 0,
            likedUserIds: [],
            comments: [],
        };

        if (onCreatePost) {
            onCreatePost(newPost);
        } else {
            setInternalPosts((prevPosts) => [newPost, ...prevPosts]);
        }

        setIsWriteModalOpen(false);
        setView('board');
        setSelectedTheme(writeForm.theme);
    };

    const openEditModal = (post) => {
        setEditingPost({...post});
    };

    const closeEditModal = () => {
        setEditingPost(null);
    };

    const handleEditChange = (event) => {
        const {name, value} = event.target;

        setEditingPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    };

    const handleEditFileChange = (event) => {
        const file = event.target.files[0];

        setEditingPost((prevPost) => ({
            ...prevPost,
            attachmentName: file ? file.name : prevPost.attachmentName,
            attachmentUrl: file ? URL.createObjectURL(file) : prevPost.attachmentUrl,
        }));
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();

        if (onUpdatePost) {
            onUpdatePost(editingPost);
        } else {
            updateInternalPost(editingPost);
        }

        setEditingPost(null);
        setView('board');
        setSelectedTheme(editingPost.theme);
    };

    const handleLikeClick = (post) => {
        if (!currentUser) {
            alert('좋아요는 로그인한 회원만 가능합니다.');
            return;
        }

        if (isLikedPost(post)) {
            alert('이미 좋아요를 누른 게시글입니다.');
            return;
        }

        if (onLikePost) {
            onLikePost(post.postNo, currentUser.userId);
            return;
        }

        updateInternalPost({
            ...post,
            likes: post.likes + 1,
            likedUserIds: [...(post.likedUserIds || []), currentUser.userId],
        });
    };

    const openCommentModal = (post) => {
        setSelectedCommentPost(post);
        setCommentInput('');
        setReplyingCommentNo(null);
        setReplyInput('');
    };

    const closeCommentModal = () => {
        setSelectedCommentPost(null);
        setCommentInput('');
        setReplyingCommentNo(null);
        setReplyInput('');
    };

    const handleCommentSubmit = (event) => {
        event.preventDefault();

        if (!currentUser) {
            alert('댓글 작성은 로그인한 회원만 가능합니다.');
            return;
        }

        if (!commentInput.trim()) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        if (onAddComment) {
            onAddComment(latestSelectedCommentPost.postNo, commentInput.trim());
        } else {
            updateInternalPost({
                ...latestSelectedCommentPost,
                comments: [
                    ...(latestSelectedCommentPost.comments || []),
                    {
                        commentNo: String((latestSelectedCommentPost.comments || []).length + 1),
                        writerName: currentUser.name,
                        content: commentInput.trim(),
                        createdAt: new Date().toISOString().slice(0, 10),
                        replies: [],
                    },
                ],
            });
        }

        setCommentInput('');
    };

    const handleReplyButtonClick = (commentNo) => {
        if (!currentUser) {
            alert('답글 작성은 로그인한 회원만 가능합니다.');
            return;
        }

        setReplyingCommentNo((prevCommentNo) =>
            prevCommentNo === commentNo ? null : commentNo
        );
        setReplyInput('');
    };

    const handleReplySubmit = (event, commentNo) => {
        event.preventDefault();

        if (!currentUser) {
            alert('답글 작성은 로그인한 회원만 가능합니다.');
            return;
        }

        if (!replyInput.trim()) {
            alert('답글 내용을 입력해주세요.');
            return;
        }

        if (onAddReply) {
            onAddReply(latestSelectedCommentPost.postNo, commentNo, replyInput.trim());
        } else {
            updateInternalPost({
                ...latestSelectedCommentPost,
                comments: (latestSelectedCommentPost.comments || []).map((comment) => {
                    if (comment.commentNo !== commentNo) {
                        return comment;
                    }

                    return {
                        ...comment,
                        replies: [
                            ...(comment.replies || []),
                            {
                                replyNo: String((comment.replies || []).length + 1),
                                writerName: currentUser.name,
                                content: replyInput.trim(),
                                createdAt: new Date().toISOString().slice(0, 10),
                            },
                        ],
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
        if (!currentUser) {
            alert('로그인한 회원만 사용할 수 있습니다.');
            return;
        }

        setView(nextView);
    };

    const showCommunityToolbar = view !== 'home';

    return (
        <div className="user-community-page">
            <main className="user-community-main">
                {showCommunityToolbar && (
                    <div className="community-page-toolbar">
                        <button type="button" onClick={goCommunityHome}>
                            커뮤니티 홈
                        </button>

                        <button
                            type="button"
                            onClick={view === 'myPosts' ? goBackToBoard : goCommunityHome}
                        >
                            뒤로가기
                        </button>
                    </div>
                )}

                <section className="community-top-area">
                    <form className="user-community-search" onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            placeholder="종목명 / 제목 / 작성자 검색"
                        />
                        <button type="submit">검색</button>
                    </form>

                    <div className="community-quick-actions">
                        <button type="button" onClick={() => requireLogin('myPosts')}>
                            내 게시글
                        </button>
                        <button type="button" onClick={openWriteModal}>
                            글쓰기
                        </button>
                    </div>
                </section>

                {view === 'home' && (
                    <>
                        <section className="community-hero-section">
                            <div>
                                <span>Money_Mate 커뮤니티</span>
                                <h2>투자 이야기를 나누고 종목별 의견을 확인해보세요</h2>
                                <p>
                                    관심 종목, 인기 게시글, 테마별 커뮤니티를 한 화면에서 빠르게 확인할 수 있어요.
                                </p>

                                <div className="community-hero-buttons">
                                    <button type="button" onClick={() => goBoardByTheme('반도체')}>
                                        게시글 둘러보기
                                    </button>
                                    <button type="button" onClick={openWriteModal}>
                                        게시글 작성
                                    </button>
                                </div>
                            </div>
                        </section>

                        <section className="community-theme-chips">
                            {themes.map((theme) => (
                                <button
                                    type="button"
                                    key={theme}
                                    onClick={() => goBoardByTheme(theme)}
                                >
                                    {theme}
                                </button>
                            ))}
                        </section>

                        <section className="community-rank-section">
                            <article className="popular-post-panel">
                                <div className="section-title-row">
                                    <div>
                                        <span>Popular Posts</span>
                                        <h2>인기 글</h2>
                                    </div>
                                    <small>좋아요 + 댓글 기준</small>
                                </div>

                                {popularPosts.map((post, index) => (
                                    <button
                                        type="button"
                                        className="popular-post-item"
                                        key={post.postNo}
                                        onClick={() => goBoardByTheme(post.theme)}
                                    >
                                        <strong>{index + 1}</strong>

                                        {renderStockLogo(post.stockName)}

                                        <span className="popular-post-text">
                                            <b>{post.title}</b>
                                            <small>
                                                {post.stockName} · 좋아요 {post.likes} · 댓글 {getCommentsCount(post)}
                                            </small>
                                        </span>
                                    </button>
                                ))}
                            </article>

                            <article className="popular-community-panel">
                                <div className="section-title-row">
                                    <div>
                                        <span>Hot Themes</span>
                                        <h2>인기 커뮤니티</h2>
                                    </div>
                                    <small>활동 많은 테마</small>
                                </div>

                                <div className="popular-community-list">
                                    {popularThemes.map((theme, index) => (
                                        <button
                                            type="button"
                                            key={theme.name}
                                            onClick={() => goBoardByTheme(theme.name)}
                                        >
                                            <strong>{index + 1}</strong>
                                            <span>
                                                <b>{theme.name}</b>
                                                <small>게시글 {theme.count}개 · 반응 {theme.score}</small>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </article>
                        </section>

                        <section className="community-theme-grid">
                            {themes.slice(0, 3).map((theme) => {
                                const themePosts = posts
                                    .filter((post) => post.theme === theme)
                                    .slice(0, 3);

                                return (
                                    <article className="community-theme-card" key={theme}>
                                        <div className="theme-card-header">
                                            <div>
                                                <span>Theme</span>
                                                <h3>{theme}</h3>
                                            </div>
                                            <button type="button" onClick={() => goBoardByTheme(theme)}>
                                                더보기
                                            </button>
                                        </div>

                                        {themePosts.length > 0 ? (
                                            themePosts.map((post) => (
                                                <button
                                                    type="button"
                                                    className="theme-post-preview"
                                                    key={post.postNo}
                                                    onClick={() => goBoardByTheme(post.theme)}
                                                >
                                                    {renderStockLogo(post.stockName)}

                                                    <div>
                                                        <strong>{post.stockName}</strong>
                                                        <span>{post.title}</span>
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="theme-empty-preview">
                                                아직 게시글이 없습니다.
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </section>
                    </>
                )}

                {view === 'themeList' && (
                    <section className="community-all-layout">
                        <aside>
                            <h2>테마 리스트</h2>
                            {themes.map((theme) => (
                                <button
                                    type="button"
                                    key={theme}
                                    onClick={() => goBoardByTheme(theme)}
                                >
                                    {theme}
                                </button>
                            ))}
                        </aside>

                        <section>
                            <h2>게시글 리스트</h2>
                            {posts.map((post) => (
                                <article key={post.postNo}>
                                    <strong>{post.title}</strong>
                                    <span>
                                        {post.theme} · {post.writerName}
                                    </span>
                                </article>
                            ))}
                        </section>
                    </section>
                )}

                {view === 'board' && (
                    <section className="community-board-layout">
                        <aside className="community-theme-select">
                            <h2>테마 선택</h2>
                            {themes.map((theme) => (
                                <button
                                    type="button"
                                    key={theme}
                                    className={selectedTheme === theme ? 'active' : ''}
                                    onClick={() => goBoardByTheme(theme)}
                                >
                                    {theme}
                                </button>
                            ))}
                            <button type="button" onClick={() => setView('themeList')}>
                                전체 테마 보기
                            </button>
                        </aside>

                        <section className="community-board">
                            <div className="community-board-top">
                                <div>
                                    <span>Community Board</span>
                                    <h2>{selectedTheme} 게시글</h2>
                                </div>

                                <div>
                                    <button type="button" onClick={() => requireLogin('myPosts')}>
                                        내 게시글
                                    </button>
                                    <button type="button" onClick={openWriteModal}>
                                        게시글 작성
                                    </button>
                                </div>
                            </div>

                            {filteredPosts.length > 0 ? (
                                filteredPosts.map((post) => {
                                    const profile = getStockProfile(post.stockName);
                                    const isLiked = isLikedPost(post);

                                    return (
                                        <article className="community-post-card" key={post.postNo}>
                                            <div className="post-card-stock-row">
                                                {renderStockLogo(post.stockName)}

                                                <div>
                                                    <strong>{post.stockName}</strong>
                                                    <small>{profile.description}</small>
                                                </div>

                                                <span className="post-theme-badge">{post.theme}</span>
                                            </div>

                                            <div className="post-card-body">
                                                <h3>{post.title}</h3>
                                                <p>{post.content}</p>

                                                <span>
                                                    {post.writerName} · 좋아요 {post.likes} · 댓글 {getCommentsCount(post)}
                                                </span>
                                            </div>

                                            <div className="community-post-actions">
                                                <button
                                                    type="button"
                                                    className={isLiked ? 'liked' : ''}
                                                    onClick={() => handleLikeClick(post)}
                                                >
                                                    {isLiked ? '좋아요 완료' : '좋아요'}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => openCommentModal(post)}
                                                >
                                                    댓글 보기
                                                </button>
                                            </div>
                                        </article>
                                    );
                                })
                            ) : (
                                <div className="empty-user-community">
                                    게시글이 없습니다.
                                </div>
                            )}
                        </section>

                        <aside className="community-interest">
                            <h2>관심 종목</h2>

                            {currentUser ? (
                                interestPosts.length > 0 ? (
                                    interestPosts.map((post) => (
                                        <article key={post.postNo}>
                                            {renderStockLogo(post.stockName)}

                                            <div>
                                                <strong>{post.stockName}</strong>
                                                <small>{post.title}</small>
                                            </div>
                                        </article>
                                    ))
                                ) : (
                                    <p>관심 종목 게시글이 없습니다.</p>
                                )
                            ) : (
                                <p>로그인한 회원만 사용할 수 있습니다.</p>
                            )}
                        </aside>
                    </section>
                )}

                {view === 'myPosts' && (
                    <section className="my-posts-section">
                        <div className="my-posts-header">
                            <div>
                                <span>My Posts</span>
                                <h2>내 게시글</h2>
                            </div>
                            <button type="button" onClick={goBackToBoard}>
                                돌아가기
                            </button>
                        </div>

                        <div className="my-posts-table">
                            <div className="my-posts-table-head">
                                <span>게시글 번호</span>
                                <span>게시글 제목</span>
                                <span>게시글 내용</span>
                                <span>관리</span>
                            </div>

                            {myPosts.length > 0 ? (
                                myPosts.map((post) => (
                                    <div className="my-posts-row" key={post.postNo}>
                                        <span>{post.postNo}</span>
                                        <span>{post.title}</span>
                                        <span>{post.content}</span>
                                        <button type="button" onClick={() => openEditModal(post)}>
                                            수정하기
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-user-community">
                                    작성한 게시글이 없습니다.
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </main>

            {isWriteModalOpen && (
                <div className="user-modal-backdrop">
                    <section className="user-post-modal">
                        <div className="user-modal-header">
                            <h2>게시글 작성</h2>
                            <button type="button" onClick={closeWriteModal}>
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit}>
                            <label>
                                게시글 제목
                                <input
                                    type="text"
                                    name="title"
                                    value={writeForm.title}
                                    onChange={handleWriteChange}
                                />
                            </label>

                            <label>
                                테마
                                <select
                                    name="theme"
                                    value={writeForm.theme}
                                    onChange={handleWriteChange}
                                >
                                    {themes.map((theme) => (
                                        <option key={theme} value={theme}>
                                            {theme}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                종목명
                                <input
                                    type="text"
                                    name="stockName"
                                    value={writeForm.stockName}
                                    onChange={handleWriteChange}
                                />
                            </label>

                            <label>
                                내용
                                <textarea
                                    name="content"
                                    value={writeForm.content}
                                    onChange={handleWriteChange}
                                />
                            </label>

                            <label>
                                첨부파일
                                <input type="file" onChange={handleWriteFileChange}/>
                                <span>{writeForm.attachmentName || '첨부파일 없음'}</span>
                            </label>

                            <div>
                                <button type="button" onClick={closeWriteModal}>
                                    취소
                                </button>
                                <button type="submit">
                                    올리기
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

            {editingPost && (
                <div className="user-modal-backdrop">
                    <section className="user-post-modal">
                        <div className="user-modal-header">
                            <h2>게시글 수정</h2>
                            <button type="button" onClick={closeEditModal}>
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit}>
                            <label>
                                게시글 제목
                                <input
                                    type="text"
                                    name="title"
                                    value={editingPost.title}
                                    onChange={handleEditChange}
                                />
                            </label>

                            <label>
                                테마
                                <select
                                    name="theme"
                                    value={editingPost.theme}
                                    onChange={handleEditChange}
                                >
                                    {themes.map((theme) => (
                                        <option key={theme} value={theme}>
                                            {theme}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                종목명
                                <input
                                    type="text"
                                    name="stockName"
                                    value={editingPost.stockName}
                                    onChange={handleEditChange}
                                />
                            </label>

                            <label>
                                내용
                                <textarea
                                    name="content"
                                    value={editingPost.content}
                                    onChange={handleEditChange}
                                />
                            </label>

                            <label>
                                첨부파일
                                <input type="file" onChange={handleEditFileChange}/>
                                <span>{editingPost.attachmentName || '첨부파일 없음'}</span>
                            </label>

                            <div>
                                <button type="button" onClick={closeEditModal}>
                                    취소
                                </button>
                                <button type="submit">
                                    수정하기
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

            {latestSelectedCommentPost && (
                <div className="user-modal-backdrop">
                    <section className="comment-modal">
                        <div className="comment-modal-header">
                            <h2>{latestSelectedCommentPost.title}</h2>
                            <button type="button" onClick={closeCommentModal}>
                                ×
                            </button>
                        </div>

                        <div className="comment-post-content">
                            <strong>
                                {latestSelectedCommentPost.stockName} · {latestSelectedCommentPost.writerName}
                            </strong>
                            <p>{latestSelectedCommentPost.content}</p>
                            <span>
                                좋아요 {latestSelectedCommentPost.likes} · 댓글 {getCommentsCount(latestSelectedCommentPost)}
                            </span>
                        </div>

                        <div className="comment-list">
                            <h3>댓글</h3>

                            {getCommentsCount(latestSelectedCommentPost) > 0 ? (
                                latestSelectedCommentPost.comments.map((comment) => (
                                    <article className="comment-item" key={comment.commentNo}>
                                        <div className="comment-main">
                                            <strong>{comment.writerName}</strong>
                                            <p>{comment.content}</p>
                                            <span>
                                                {comment.createdAt} · 답글 {getRepliesCount(comment)}
                                            </span>

                                            <button
                                                type="button"
                                                className="reply-open-button"
                                                onClick={() => handleReplyButtonClick(comment.commentNo)}
                                            >
                                                답글
                                            </button>
                                        </div>

                                        {getRepliesCount(comment) > 0 && (
                                            <div className="reply-list">
                                                {comment.replies.map((reply) => (
                                                    <div className="reply-item" key={reply.replyNo}>
                                                        <strong>{reply.writerName}</strong>
                                                        <p>{reply.content}</p>
                                                        <span>{reply.createdAt}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {replyingCommentNo === comment.commentNo && (
                                            <form
                                                className="reply-write-form"
                                                onSubmit={(event) =>
                                                    handleReplySubmit(event, comment.commentNo)
                                                }
                                            >
                                                <textarea
                                                    value={replyInput}
                                                    onChange={(event) => setReplyInput(event.target.value)}
                                                    placeholder="답글을 입력하세요."
                                                />

                                                <div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setReplyingCommentNo(null);
                                                            setReplyInput('');
                                                        }}
                                                    >
                                                        취소
                                                    </button>
                                                    <button type="submit">
                                                        답글 등록
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </article>
                                ))
                            ) : (
                                <div className="empty-comment-list">
                                    아직 댓글이 없습니다.
                                </div>
                            )}
                        </div>

                        <form className="comment-write-form" onSubmit={handleCommentSubmit}>
                            <textarea
                                value={commentInput}
                                onChange={(event) => setCommentInput(event.target.value)}
                                placeholder={
                                    currentUser
                                        ? '댓글을 입력하세요.'
                                        : '댓글 작성은 로그인한 회원만 가능합니다.'
                                }
                                readOnly={!currentUser}
                                onClick={() => {
                                    if (!currentUser) {
                                        alert('댓글 작성은 로그인한 회원만 가능합니다.');
                                    }
                                }}
                            />

                            <button type="submit">
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