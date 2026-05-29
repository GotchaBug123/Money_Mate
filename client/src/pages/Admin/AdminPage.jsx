import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Header from '../../components/common/Header';
import MemberManagePage from './MemberManagePage';
import InvestmentManagePage from './InvestmentManagePage';
import CommunityManagePage from './CommunityManagePage';
import CustomerInquiryManagePage from './CustomerInquiryManagePage';

import './admin.css';

function AdminPage({
                       onLogout,
                       posts: externalPosts,
                       onUpdatePost,
                       onDeletePost,
                   }) {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('dashboard');

    const [members, setMembers] = useState([
        {
            memberNo: '1',
            userId: 'admin01',
            name: '김관리',
            birthDate: '1998-03-15',
            joinedAt: '2026-05-01',
            phone: '010-1234-5678',
            email: 'admin01@moneymate.com',
        },
        {
            memberNo: '2',
            userId: 'user01',
            name: '이회원',
            birthDate: '2000-07-22',
            joinedAt: '2026-05-10',
            phone: '010-2222-3333',
            email: 'user01@moneymate.com',
        },
        {
            memberNo: '3',
            userId: 'money123',
            name: '박머니',
            birthDate: '1999-11-02',
            joinedAt: '2026-05-18',
            phone: '010-5555-7777',
            email: 'money123@moneymate.com',
        },
    ]);

    const [localPosts, setLocalPosts] = useState([
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
            comments: [],
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
    ]);

    const [inquiries, setInquiries] = useState([
        {
            inquiryNo: '1',
            title: '포트폴리오 추천 결과가 이상합니다',
            writerId: 'user01',
            writerName: '이회원',
            email: '',
            createdAt: '2026-05-23',
            status: '답변 전',
            content: '제 투자 성향과 다르게 공격적인 포트폴리오가 추천된 것 같습니다.',
            attachmentName: 'portfolio-question.png',
            attachmentUrl: '',
            answer: '',
        },
        {
            inquiryNo: '2',
            title: '비회원 문의 답변은 어디서 확인하나요?',
            writerId: '비회원',
            writerName: '비회원',
            email: 'guest@example.com',
            createdAt: '2026-05-24',
            status: '답변 전',
            content: '비회원으로 문의를 남겼는데 답변은 이메일로 오는지 궁금합니다.',
            attachmentName: '',
            attachmentUrl: '',
            answer: '',
        },
        {
            inquiryNo: '3',
            title: '회원가입 인증 메일이 오지 않습니다',
            writerId: 'money123',
            writerName: '박머니',
            email: '',
            createdAt: '2026-05-25',
            status: '답변 완료',
            content: '회원가입 인증 메일이 오지 않아서 로그인을 할 수 없습니다.',
            attachmentName: '',
            attachmentUrl: '',
            answer: '스팸함 확인 후에도 메일이 없다면 다시 인증 메일 발송을 눌러주세요.',
        },
    ]);

    const posts = externalPosts || localPosts;
    const memberCount = members.length;
    const postCount = posts.length;
    const inquiryCount = inquiries.length;
    const waitingInquiryCount = inquiries.filter((inquiry) => inquiry.status === '답변 전').length;

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');

        if (onLogout) {
            onLogout();
            return;
        }

        navigate('/');
    };

    const handleDeleteMember = (memberNo) => {
        const isDelete = window.confirm('해당 회원 정보를 삭제하시겠습니까?');

        if (!isDelete) {
            return;
        }

        setMembers((prevMembers) =>
            prevMembers.filter((member) => member.memberNo !== memberNo)
        );
    };

    const handleUpdateMember = (updatedMember) => {
        setMembers((prevMembers) =>
            prevMembers.map((member) =>
                member.memberNo === updatedMember.memberNo ? updatedMember : member
            )
        );
    };

    const handleUpdatePost = (updatedPost) => {
        if (onUpdatePost) {
            onUpdatePost(updatedPost);
            return;
        }

        setLocalPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.postNo === updatedPost.postNo ? updatedPost : post
            )
        );
    };

    const handleDeletePost = (postNo) => {
        const isDelete = window.confirm('해당 게시글을 삭제하시겠습니까?');

        if (!isDelete) {
            return;
        }

        if (onDeletePost) {
            onDeletePost(postNo);
            return;
        }

        setLocalPosts((prevPosts) =>
            prevPosts.filter((post) => post.postNo !== postNo)
        );
    };

    const handleAnswerInquiry = (updatedInquiry) => {
        setInquiries((prevInquiries) =>
            prevInquiries.map((inquiry) =>
                inquiry.inquiryNo === updatedInquiry.inquiryNo
                    ? {
                        ...updatedInquiry,
                        status: '답변 완료',
                    }
                    : inquiry
            )
        );
    };

    const handleDeleteInquiry = (inquiryNo) => {
        const isDelete = window.confirm('해당 문의를 삭제 조치하시겠습니까?');

        if (!isDelete) {
            return;
        }

        setInquiries((prevInquiries) =>
            prevInquiries.map((inquiry) =>
                inquiry.inquiryNo === inquiryNo
                    ? {
                        ...inquiry,
                        status: '삭제 조치',
                    }
                    : inquiry
            )
        );
    };

    return (
        <div className="admin-page">
           <Header
               logoTo="/admin"
               logoOnClick={() => setActiveMenu('dashboard')}
               menuItems={[
                   {label: '회원정보관리', onClick: () => setActiveMenu('memberManage')},
                   {label: '투자정보관리', onClick: () => setActiveMenu('investmentManage')},
                   {label: '커뮤니티관리', onClick: () => setActiveMenu('communityManage')},
                   {label: '고객문의관리', onClick: () => setActiveMenu('customerInquiryManage')},
               ]}
               rightButtons={[
                   {
                       label: '로그아웃',
                       onClick: handleLogout,
                   },
               ]}
           />

            {activeMenu === 'dashboard' && (
                <main className="admin-main">
                    <section className="admin-hero">
                        <div>
                            <span className="admin-eyebrow">MoneyMate Admin</span>
                            <h1>관리자 대시보드</h1>
                            <p>회원, 투자정보, 커뮤니티, 고객문의를 한 곳에서 관리합니다.</p>
                        </div>

                        <button type="button" onClick={() => setActiveMenu('memberManage')}>
                            관리 시작하기
                        </button>
                    </section>

                    <section className="admin-summary-grid">
                        <article className="admin-summary-card">
                            <span>전체 회원</span>
                            <strong>{memberCount}</strong>
                            <p>가입 회원 관리</p>
                        </article>

                        <article className="admin-summary-card">
                            <span>커뮤니티 글</span>
                            <strong>{postCount}</strong>
                            <p>게시글 관리</p>
                        </article>

                        <article className="admin-summary-card">
                            <span>고객 문의</span>
                            <strong>{inquiryCount}</strong>
                            <p>문의 내역 관리</p>
                        </article>

                        <article className="admin-summary-card warning">
                            <span>답변 대기</span>
                            <strong>{waitingInquiryCount}</strong>
                            <p>빠른 확인 필요</p>
                        </article>
                    </section>

                    <section className="admin-dashboard">
                        <button
                            type="button"
                            className="admin-card member-card"
                            onClick={() => setActiveMenu('memberManage')}
                        >
                            <span className="admin-card-icon">👤</span>
                            <h2>회원정보관리</h2>
                            <p>회원 정보 조회, 수정, 삭제를 관리합니다.</p>
                            <strong>회원 {memberCount}명</strong>
                        </button>

                        <button
                            type="button"
                            className="admin-card invest-card"
                            onClick={() => setActiveMenu('investmentManage')}
                        >
                            <span className="admin-card-icon">📈</span>
                            <h2>투자정보관리</h2>
                            <p>회원별 보유 주식과 투자 통계를 확인합니다.</p>
                            <strong>투자 데이터 보기</strong>
                        </button>

                        <button
                            type="button"
                            className="admin-card community-card"
                            onClick={() => setActiveMenu('communityManage')}
                        >
                            <span className="admin-card-icon">💬</span>
                            <h2>커뮤니티관리</h2>
                            <p>게시글 수정, 삭제 및 커뮤니티 상태를 관리합니다.</p>
                            <strong>게시글 {postCount}개</strong>
                        </button>

                        <button
                            type="button"
                            className="admin-card inquiry-card"
                            onClick={() => setActiveMenu('customerInquiryManage')}
                        >
                            <span className="admin-card-icon">🎧</span>
                            <h2>고객문의관리</h2>
                            <p>문의 답변, 삭제 조치, 처리 상태를 관리합니다.</p>
                            <strong>대기 {waitingInquiryCount}건</strong>
                        </button>
                    </section>
                </main>
            )}

            {activeMenu === 'memberManage' && (
                <MemberManagePage
                    members={members}
                    onDeleteMember={handleDeleteMember}
                    onUpdateMember={handleUpdateMember}
                />
            )}

            {activeMenu === 'investmentManage' && (
                <InvestmentManagePage/>
            )}

            {activeMenu === 'communityManage' && (
                <CommunityManagePage
                    posts={posts}
                    onUpdatePost={handleUpdatePost}
                    onDeletePost={handleDeletePost}
                />
            )}

            {activeMenu === 'customerInquiryManage' && (
                <CustomerInquiryManagePage
                    inquiries={inquiries}
                    onAnswerInquiry={handleAnswerInquiry}
                    onDeleteInquiry={handleDeleteInquiry}
                />
            )}
        </div>
    );
}

export default AdminPage;