import React from 'react';
import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';

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

import './styles/common.css';
import './App.css';

function AppContent() {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');

    return (
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            {!isAdminPage && <Header/>}

            <main style={{minHeight: 'calc(100vh - 60px)'}}>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/mypage" element={<MyPage/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<SignUp/>}/>
                    <Route path="/signup-complete" element={<SignUpComplete/>}/>
                    <Route path="/find-id" element={<FindId/>}/>
                    <Route path="/find-pw" element={<FindPassword/>}/>
                    <Route path="/reset-pw" element={<ResetPassword/>}/>
                    <Route path="/customer-service" element={<CustomerService/>}/>
                    <Route path="/inquiry-write" element={<InquiryWrite/>}/>
                    <Route path="/inquiry-list" element={<InquiryList/>}/>
                    <Route path="/asset" element={<MyAsset/>}/>
                    <Route path="/asset-detail" element={<AssetDetail/>}/>
                    <Route path="/financial/input" element={<FinancialInput/>}/>
                    <Route path="/financial/result" element={<FinancialResult/>}/>
                    <Route path="/investment/questions" element={<InvestmentQuestions/>}/>
                    <Route path="/investment/result" element={<InvestmentResult/>}/>
                    <Route path="/portfolio" element={<PortfolioMain/>}/>
                    <Route path="/portfolio/auto" element={<PortfolioAuto/>}/>
                    <Route path="/portfolio/result" element={<PortfolioResult/>}/>
                    <Route path="/portfolio/direct" element={<PortfolioDirect/>}/>
                    <Route path="/rebalancing" element={<Rebalancing/>}/>
                    <Route path="/investment-information" element={<InvestmentInformation/>}/>
                    <Route path="/community" element={<UserCommunityPage/>}/>
                    <Route path="/admin" element={<AdminPage/>}/>
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