import { useEffect, useState } from "react";

import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { About } from "./components/About";
import { Testimonials } from "./components/Testimonials";
import { Support } from "./components/Support";
import { Footer } from "./components/Footer";

import { LoginPage } from "./components/LoginPage";
import { SignupStep1 } from "./components/SignupStep1";
import { SignupStep2 } from "./components/SignupStep2";
import { FindIdPage } from "./components/FindIdPage";
import { FindPasswordPage } from "./components/FindPasswordPage";

import { MyAssetsPage } from "./pages/MyAssetsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { InvestmentInfoPage } from "./pages/InvestmentInfoPage";
import { SupportPage } from "./pages/SupportPage";
import { AccountManagementPage } from "./pages/AccountManagementPage";
import { SettingsPage } from "./pages/SettingsPage";
import { MyRoboPage } from "./pages/MyRoboPage";
import { RoboSimulationPage } from "./pages/RoboSimulationPage";
import { AssetSimulationPage } from "./pages/AssetSimulationPage";
import { AssetPage } from "./pages/AssetPage";
import { AssetSummaryPage } from "./pages/AssetSummaryPage";
import { AssetAllocationPage } from "./pages/AssetAllocationPage";
import { HoldingsPage } from "./pages/HoldingsPage";
import { ReturnsPage } from "./pages/ReturnsPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { NotificationSettingsPage } from "./pages/NotificationSettingsPage";
import { InquiryListPage } from "./pages/InquiryListPage";
import { CustomerInquiryFormPage } from "./pages/CustomerInquiryFormPage";
import { InquiryConfirmationPage } from "./pages/InquiryConfirmationPage";
import { InquiryDetailPage } from "./pages/InquiryDetailPage";
import { NoticeListPage } from "./pages/NoticeListPage";
import { NoticeDetailPage } from "./pages/NoticeDetailPage";
import { SurveyPage } from "./pages/SurveyPage";
import { SurveyResultPage } from "./pages/SurveyResultPage";
import { OnboardingPage } from "./pages/OnboardingPage";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { StockProvider } from "./context/StockContext";
import { DropdownProvider } from "./context/DropdownContext";

type Page =
  | "home"
  | "login"
  | "dashboard"
  | "my-assets"
  | "portfolio"
  | "investment-info"
  | "support"
  | "account-management"
  | "settings"
  | "my-robo"
  | "robo-simulation"
  | "asset-simulation"
  | "analysis"
  | "asset-summary"
  | "asset-allocation"
  | "holdings"
  | "returns"
  | "favorites"
  | "notifications"
  | "notification-settings"
  | "signup-step1"
  | "signup-step2"
  | "find-id"
  | "find-password"
  | "inquiry-list"
  | "customer-inquiry"
  | "customer-inquiry-form"
  | "inquiry-confirmation"
  | "inquiry-detail"
  | "survey"
  | "survey-result"
  | "onboarding"
  | "notice-list"
  | "notice-detail";

interface SurveyAnswers {
  objective?: string;
  timeHorizon?: string;
  knowledge?: string;
  riskReward?: string;
  marketReaction?: string;
  financialSituation?: string;
}

function AppContent() {

  const [
    currentPage,
    setCurrentPage,
  ] = useState<Page>("home");

  const [
    pendingPage,
    setPendingPage,
  ] = useState<Page | null>(null);

  const [
    signupData,
    setSignupData,
  ] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const [
    selectedInquiryId,
    setSelectedInquiryId,
  ] = useState<number | undefined>(undefined);

  const [
    selectedNoticeId,
    setSelectedNoticeId,
  ] = useState<number | undefined>(undefined);

  const [
    surveyAnswers,
    setSurveyAnswers,
  ] = useState<SurveyAnswers | null>(null);

  const [
    surveyReturnPage,
    setSurveyReturnPage,
  ] = useState<Page | null>(null);

  const {
    isAuthenticated,
    login,
    logout,
  } = useAuth();

  useEffect(() => {

    const handleStorageChange = (
      e: StorageEvent
    ) => {

      if (
        e.key === "logout-event"
      ) {

        logout();

        setCurrentPage("home");
      }
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {

      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };

  }, [logout]);

  const navigateTo = (
    page: Page
  ) => {

    const protectedPages: Page[] = [
      "dashboard",
      "my-assets",
      "account-management",
      "settings",
      "my-robo",
      "robo-simulation",
      "asset-simulation",
      "analysis",
      "asset-summary",
      "asset-allocation",
      "holdings",
      "returns",
      "favorites",
      "notifications",
      "notification-settings",
    ];

    if (
      protectedPages.includes(page) &&
      !isAuthenticated
    ) {

      setPendingPage(page);

      setCurrentPage("login");

      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleLogin = (
    email: string
  ) => {

    login(email);

    if (pendingPage) {

      setCurrentPage(
        pendingPage
      );

      setPendingPage(null);

      return;
    }

    setCurrentPage("home");
  };

  /* =========================
     로그인
  ========================= */

  if (currentPage === "login") {

    return (
      <LoginPage
        onBack={() =>
          navigateTo("home")
        }
        onNavigate={navigateTo}
        onLogin={handleLogin}
      />
    );
  }

  /* =========================
     회원가입 1단계
  ========================= */

  if (currentPage === "signup-step1") {

    return (
      <SignupStep1
        onBack={() =>
          navigateTo("home")
        }
        onNavigate={navigateTo}
        onNext={(data) => {

          setSignupData(data);

          setCurrentPage(
            "signup-step2"
          );
        }}
      />
    );
  }

  /* =========================
     회원가입 2단계
  ========================= */

  if (currentPage === "signup-step2") {

    return (
      <SignupStep2
        onBack={() =>
          setCurrentPage(
            "signup-step1"
          )
        }
        onNavigate={navigateTo}
        signupData={
          signupData || {
            email: "",
            password: "",
          }
        }
      />
    );
  }

  /* =========================
     아이디 찾기
  ========================= */

  if (currentPage === "find-id") {

    return (
      <FindIdPage
        onBack={() =>
          navigateTo("home")
        }
        onNavigate={navigateTo}
      />
    );
  }

  /* =========================
     비밀번호 찾기
  ========================= */

  if (currentPage === "find-password") {

    return (
      <FindPasswordPage
        onBack={() =>
          navigateTo("home")
        }
        onNavigate={navigateTo}
      />
    );
  }

  /* =========================
     대시보드
  ========================= */

  if (currentPage === "dashboard") {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <DashboardPage />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     계정관리
  ========================= */

  if (
    currentPage ===
    "account-management"
  ) {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <AccountManagementPage />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     설정
  ========================= */

  if (currentPage === "settings") {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <SettingsPage />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     로보어드바이저
  ========================= */

  if (currentPage === "my-robo") {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <MyRoboPage
          onNavigate={navigateTo}
          surveyAnswers={
            surveyAnswers
          }
          onStartSurvey={() => {

            setSurveyReturnPage(
              "my-robo"
            );

            setCurrentPage(
              "survey"
            );
          }}
        />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     로보 시뮬레이션
  ========================= */

  if (
    currentPage ===
    "robo-simulation"
  ) {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <RoboSimulationPage
          onBack={() =>
            navigateTo("my-robo")
          }
        />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     자산 시뮬레이션
  ========================= */

  if (
    currentPage ===
    "asset-simulation"
  ) {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <AssetSimulationPage
          onBack={() =>
            navigateTo("my-robo")
          }
        />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     분석
  ========================= */

  if (currentPage === "analysis") {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <MyRoboPage
          onNavigate={navigateTo}
          surveyAnswers={
            surveyAnswers
          }
          onStartSurvey={() => {

            setSurveyReturnPage(
              "my-robo"
            );

            setCurrentPage(
              "survey"
            );
          }}
        />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     MY 자산
  ========================= */

  if (currentPage === "my-assets") {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <MyAssetsPage />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     맞춤 투자 제안
  ========================= */

  if (
    currentPage ===
    "asset-summary"
  ) {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <AssetSummaryPage />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     자산 분배
  ========================= */

  if (
    currentPage ===
    "asset-allocation"
  ) {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <AssetAllocationPage />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     보유 종목
  ========================= */

  if (currentPage === "holdings") {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <HoldingsPage />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     수익률
  ========================= */

  if (currentPage === "returns") {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <ReturnsPage />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     즐겨찾기
  ========================= */

  if (currentPage === "favorites") {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <FavoritesPage />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     알림
  ========================= */

  if (
    currentPage ===
    "notifications"
  ) {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <NotificationsPage />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     알림 설정
  ========================= */

  if (
    currentPage ===
    "notification-settings"
  ) {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <NotificationSettingsPage />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     포트폴리오
  ========================= */

  if (currentPage === "portfolio") {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <PortfolioPage />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     투자정보
  ========================= */

  if (
    currentPage ===
    "investment-info"
  ) {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <InvestmentInfoPage
          onNavigate={navigateTo}
        />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     고객센터
  ========================= */

  if (currentPage === "support") {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <SupportPage />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     문의 목록
  ========================= */

  if (
    currentPage ===
    "inquiry-list"
  ) {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <InquiryListPage
          onNavigate={navigateTo}
          onViewDetail={(id) => {

            setSelectedInquiryId(id);

            setCurrentPage(
              "inquiry-detail"
            );
          }}
        />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     문의 상세
  ========================= */

  if (
    currentPage ===
    "inquiry-detail"
  ) {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <InquiryDetailPage
          onNavigate={navigateTo}
          inquiryId={
            selectedInquiryId
          }
        />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     문의 작성
  ========================= */

  if (
    currentPage ===
      "customer-inquiry" ||
    currentPage ===
      "customer-inquiry-form"
  ) {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <CustomerInquiryFormPage
          onNavigate={navigateTo}
        />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     문의 완료
  ========================= */

  if (
    currentPage ===
    "inquiry-confirmation"
  ) {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <InquiryConfirmationPage
          onNavigate={navigateTo}
        />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     공지 목록
  ========================= */

  if (
    currentPage ===
    "notice-list"
  ) {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <NoticeListPage
          onNavigate={navigateTo}
          onViewDetail={(id) => {

            setSelectedNoticeId(id);

            setCurrentPage(
              "notice-detail"
            );
          }}
        />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     공지 상세
  ========================= */

  if (
    currentPage ===
    "notice-detail"
  ) {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <NoticeDetailPage
          onNavigate={navigateTo}
          noticeId={
            selectedNoticeId
          }
        />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     설문
  ========================= */

  if (currentPage === "survey") {

    return (
      <SurveyPage
        onComplete={(answers) => {

          setSurveyAnswers(
            answers
          );

          if (surveyReturnPage) {

            setCurrentPage(
              surveyReturnPage
            );

            setSurveyReturnPage(
              null
            );

            return;
          }

          setCurrentPage(
            "survey-result"
          );
        }}
        onBack={() => {

          if (surveyReturnPage) {

            setCurrentPage(
              surveyReturnPage
            );

            setSurveyReturnPage(
              null
            );

            return;
          }

          navigateTo("home");
        }}
      />
    );
  }

  /* =========================
     설문 결과
  ========================= */

  if (
    currentPage ===
    "survey-result"
  ) {

    return (
      <SurveyResultPage
        answers={
          surveyAnswers || {}
        }
        onNavigate={navigateTo}
      />
    );
  }

  /* =========================
     온보딩
  ========================= */

  if (
    currentPage ===
    "onboarding"
  ) {

    return (
      <>
        <Header
          onNavigate={navigateTo}
        />

        <OnboardingPage
          onNavigate={navigateTo}
        />

        <Footer
          onNavigate={navigateTo}
        />
      </>
    );
  }

  /* =========================
     홈
  ========================= */

  if (currentPage === "home") {

    if (isAuthenticated) {

      return (
        <>
          <Header
            onNavigate={navigateTo}
          />

          <DashboardPage />

          <Footer
            onNavigate={navigateTo}
          />
        </>
      );
    }

    return (
      <div className="min-h-screen">

        <Header
          onNavigate={navigateTo}
        />

        <main>

          <Hero
            onNavigate={navigateTo}
          />

          <Services />

          <About />

          <Testimonials />

        </main>

        <Footer
          onNavigate={navigateTo}
        />

      </div>
    );
  }

  /* =========================
     기본
  ========================= */

  return (
    <div className="min-h-screen">

      <Header
        onNavigate={navigateTo}
      />

      <main>

        <Hero
          onNavigate={navigateTo}
        />

        <Services />

        <About />

        <Testimonials />

        <Support />

      </main>

      <Footer
        onNavigate={navigateTo}
      />

    </div>
  );
}

export default function App() {

  return (
    <AuthProvider>

      <StockProvider>

        <DropdownProvider>

          <AppContent />

        </DropdownProvider>

      </StockProvider>

    </AuthProvider>
  );
}