import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from './components/common/Header';
import Home from './pages/Home';
import MyPage from './pages/MyPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import SignUpComplete from './pages/SignUpComplete';
import FindId from "./pages/FindId";
import FindPassword from "./pages/FindPassword";
import ResetPassword from "./pages/ResetPassword";
import CustomerService from "./pages/CustomerService";
import Footer from "./components/common/Footer";
import InquiryWrite from "./pages/InquiryWrite";
import InquiryList from "./pages/InquiryList";
import AssetDetail from "./pages/AssetDetail";
import MyAsset from "./pages/MyAsset";

function App() {
    return (
        <BrowserRouter>
            <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
                {/* 공통 상단 헤더 */}
                <Header/>

                {/* 페이지 전환 영역 */}
                <main style={{minHeight: 'calc(100vh - 60px)'}}>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/mypage" element={<MyPage/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/signup" element={<SignUp/>}/>
                        <Route path="/signup-complete" element={<SignUpComplete/>}/>
                        <Route path="find-id" element={<FindId/>}/>
                        <Route path="/find-pw" element={<FindPassword/>}/>
                        <Route path="/reset-pw" element={<ResetPassword/>}/>
                        <Route path="/customer-service" element={<CustomerService/>}/>
                        <Route path="/inquiry-write" element={<InquiryWrite/>}/>
                        <Route path="/inquiry-list" element={<InquiryList/>}/>
                        <Route path="/asset" element={<MyAsset/>}/>
                        <Route path="/asset-detail" element={<AssetDetail/>}/>
                    </Routes>
                </main>
                <Footer/>
            </div>
        </BrowserRouter>
    );
}

export default App;