import React, {useEffect} from 'react';
import {BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate} from 'react-router-dom';
import {useAuthStore} from './store/useAuthStore.js';
import LoginModal from './components/common/LoginModal.jsx';

import Header from './components/common/Header';
import Footer from './components/common/Footer';

import Home from './pages/Home/Home';

import MyPage from './pages/Members/MyPage';
import Login from './pages/Members/Login';
import SignUp from './pages/Members/SignUp';
import SignUpComplete from './pages/Members/SignUpComplete';
import FindId from './pages/Members/FindId';
import FindPassword from './pages/Members/FindPassword';
import ResetPassword from './pages/Members/ResetPassword';

import CustomerService from './pages/Service/CustomerService';
import Notice from "./pages/Service/Notice.jsx";
import FAQ from './pages/Service/FAQ';
import StockGuide from './pages/Service/StockGuide';
import CustomerFeedback from './pages/Service/CustomerFeedback';
import InquiryWrite from './pages/Service/InquiryWrite';
import InquiryList from './pages/Service/InquiryList';

import AssetDetail from './pages/Asset/AssetDetail';
import MyAsset from './pages/Asset/MyAsset';

import AdminPage from './pages/Admin/AdminPage';

import FinancialInput from './pages/Diagnosis/FinancialDiagnosis/FinancialInput';
import FinancialResult from './pages/Diagnosis/FinancialDiagnosis/FinancialResult';
import InvestmentQuestions from './pages/Diagnosis/InvestmentDiagnosis/InvestmentQuestions';
import InvestmentResult from './pages/Diagnosis/InvestmentDiagnosis/InvestmentResult';

import PortfolioMain from './pages/Portfolio/PortfolioMain/PortfolioMain';
import PortfolioAuto from './pages/Portfolio/PortfolioAuto/PortfolioAuto';
import PortfolioResult from './pages/Portfolio/PortfolioResult/PortfolioResult';
import PortfolioDirect from './pages/Portfolio/PortfolioDirect/PortfolioDirect';

import Rebalancing from './pages/Rebalancing/Rebalancing';
import InvestmentInformation from './pages/InvestmentInformation/InvestmentInformation';
import UserCommunityPage from './pages/Community/UserCommunityPage';

import Terms from "./pages/Terms/Terms.jsx";
import Privacy from "./pages/Terms/Privacy.jsx";

import './styles/common.css';
import './App.css';

function PrivateRoute({children}) {
    const {user, openLoginModal} = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            openLoginModal(location.pathname);
            navigate('/', {replace: true});
        }
    }, [user]);

    if (!user) return null;
    return children;
}

function AdminRoute({children}) {
    const {user} = useAuthStore();
    const location = useLocation();

    if (!user || user.role !== 'ADMIN') {
        const from = location.state?.from ?? '/';
        return <Navigate to={from} replace/>;
    }
    return children;
}

function AppContent() {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');

    return (
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            {!isAdminPage && <Header/>}
            <LoginModal/>

            <main style={{minHeight: 'calc(100vh - 60px)'}}>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/mypage" element={<PrivateRoute><MyPage/></PrivateRoute>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<SignUp/>}/>
                    <Route path="/signup-complete" element={<SignUpComplete/>}/>
                    <Route path="/find-id" element={<FindId/>}/>
                    <Route path="/find-pw" element={<FindPassword/>}/>
                    <Route path="/reset-pw" element={<ResetPassword/>}/>
                    <Route path="/customer-service" element={<CustomerService/>}/>
                    <Route path="/notice" element={<Notice/>}/>
                    <Route path="/faq" element={<FAQ/>}/>
                    <Route path="/stock-guide" element={<StockGuide/>}/>
                    <Route path="/customer-feedback" element={<CustomerFeedback/>}/>
                    <Route path="/inquiry-write" element={<PrivateRoute><InquiryWrite/></PrivateRoute>}/>
                    <Route path="/inquiry-list" element={<PrivateRoute><InquiryList/></PrivateRoute>}/>
                    <Route path="/asset" element={<PrivateRoute><MyAsset/></PrivateRoute>}/>
                    <Route path="/asset-detail" element={<PrivateRoute><AssetDetail/></PrivateRoute>}/>
                    <Route path="/financial/input" element={<PrivateRoute><FinancialInput/></PrivateRoute>}/>
                    <Route path="/financial/result" element={<PrivateRoute><FinancialResult/></PrivateRoute>}/>
                    <Route path="/investment/questions" element={<PrivateRoute><InvestmentQuestions/></PrivateRoute>}/>
                    <Route path="/investment/result" element={<PrivateRoute><InvestmentResult/></PrivateRoute>}/>
                    <Route path="/portfolio" element={<PrivateRoute><PortfolioMain/></PrivateRoute>}/>
                    <Route path="/portfolio/auto" element={<PrivateRoute><PortfolioAuto/></PrivateRoute>}/>
                    <Route path="/portfolio/result" element={<PrivateRoute><PortfolioResult/></PrivateRoute>}/>
                    <Route path="/portfolio/direct" element={<PrivateRoute><PortfolioDirect/></PrivateRoute>}/>
                    <Route path="/rebalancing" element={<PrivateRoute><Rebalancing/></PrivateRoute>}/>
                    <Route path="/investment-information" element={<InvestmentInformation/>}/>
                    <Route path="/community" element={<UserCommunityPage/>}/>
                    <Route path="/admin" element={<AdminRoute><AdminPage/></AdminRoute>}/>
                    <Route path="/terms" element={<Terms/>}/>
                    <Route path="/privacy" element={<Privacy/>}/>
                </Routes>
            </main>

            {/*{!isAdminPage && <Footer/>}*/}
            <Footer/>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent/>
        </BrowserRouter>
    );
}

export default App;