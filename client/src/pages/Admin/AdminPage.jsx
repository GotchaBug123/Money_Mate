import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import logo from '../../assets/moneymate_logo.png';
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

    const handleLogout = () => {
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
            <header className="admin-header">
                <div className="admin-brand" onClick={() => setActiveMenu('dashboard')}>
                    <img src={logo} alt="머니메이트 로고"/>
                    <h1>관리자 화면</h1>
                </div>

                <nav className="admin-nav">
                    <button type="button" onClick={() => setActiveMenu('memberManage')}>
                        회원정보관리
                    </button>

                    <button type="button" onClick={() => setActiveMenu('investmentManage')}>
                        투자정보관리
                    </button>

                    <button type="button" onClick={() => setActiveMenu('communityManage')}>
                        커뮤니티관리
                    </button>

                    <button type="button" onClick={() => setActiveMenu('customerInquiryManage')}>
                        고객문의관리
                    </button>
                </nav>

                <button className="logout-button" type="button" onClick={handleLogout}>
                    로그아웃
                </button>
            </header>

            {activeMenu === 'dashboard' && (
                <main className="admin-main">
                    <section className="admin-dashboard">
                        <article className="admin-card member-card">
                            <h2>회원정보</h2>

                            <div className="count-box">
                                <span>회원 수</span>
                                <strong>{memberCount}</strong>
                            </div>
                        </article>

                        <article className="admin-card community-card">
                            <h2>커뮤니티글</h2>

                            <div className="count-box">
                                <span>게시글 수</span>
                                <strong>{postCount}</strong>
                            </div>
                        </article>

                        <article className="admin-card invest-card">
                            <h2>투자정보</h2>
                        </article>

                        <article className="admin-card inquiry-card">
                            <h2>고객 문의</h2>
                        </article>
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

            <footer className="admin-footer">
                Footer 영역
            </footer>
        </div>
    );
}

export default AdminPage;