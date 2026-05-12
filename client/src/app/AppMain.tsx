import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import { About } from "../components/About";
import { Testimonials } from "../components/Testimonials";
import { Contact } from "../components/Contact";
import { Support } from "../components/Support";
import { Footer } from "../components/Footer";
import { LoginPage } from "../components/LoginPage";
import { SignupStep1 } from "../components/SignupStep1";
import { SignupStep2 } from "../components/SignupStep2";
import { MyAssetsPage } from "../pages/MyAssetsPage";
import { DashboardPage } from "../pages/DashboardPage";
import { PortfolioPage } from "../pages/PortfolioPage";
import { InvestmentInfoPage } from "../pages/InvestmentInfoPage";
import { SupportPage } from "../pages/SupportPage";
import { AccountManagementPage } from "../pages/AccountManagementPage";
import { SettingsPage } from "../pages/SettingsPage";
import { MyRoboPage } from "../pages/MyRoboPage";
import { AnalysisPage } from "../pages/AnalysisPage";
import { AssetSummaryPage } from "../pages/AssetSummaryPage";
import { AssetAllocationPage } from "../pages/AssetAllocationPage";
import { HoldingsPage } from "../pages/HoldingsPage";
import { ReturnsPage } from "../pages/ReturnsPage";
import { FavoritesPage } from "../pages/FavoritesPage";
import { NotificationsPage } from "../pages/NotificationsPage";
import { NotificationSettingsPage } from "../pages/NotificationSettingsPage";
import { FindIdPage } from "../components/FindIdPage";
import { FindPasswordPage } from "../components/FindPasswordPage";
import { InquiryListPage } from "../pages/InquiryListPage";
import { CustomerInquiryFormPage } from "../pages/CustomerInquiryFormPage";
import { InquiryConfirmationPage } from "../pages/InquiryConfirmationPage";
import { InquiryDetailPage } from "../pages/InquiryDetailPage";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { StockProvider } from "../context/StockContext";
import { DropdownProvider } from "../context/DropdownContext";

type Page = "home" | "login" | "dashboard" | "my-assets" | "portfolio" | "investment-info" | "support" |
  "account-management" | "settings" | "my-robo" | "analysis" | "asset-summary" |
  "asset-allocation" | "holdings" | "returns" | "favorites" | "notifications" | "notification-settings" |
  "signup-step1" | "signup-step2" | "find-id" | "find-password" | "inquiry-list" | "customer-inquiry-form" | "inquiry-confirmation" | "inquiry-detail";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [signupData, setSignupData] = useState<{ email: string; password: string } | null>(null);
  const [selectedInquiryId, setSelectedInquiryId] = useState<number | undefined>(undefined);
  const { isAuthenticated, login, logout } = useAuth();

  // 다른 탭에서 로그아웃 시 현재 탭도 동기화
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'logout-event') {
        logout();
        setCurrentPage("home");
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [logout]);

  const navigateTo = (page: Page) => {
    // Protected pages - require authentication
    const protectedPages: Page[] = [
      "dashboard", "my-assets", "account-management", "settings", "my-robo", "analysis",
      "asset-summary", "asset-allocation", "holdings", "returns", "favorites",
      "notifications", "notification-settings"
    ];

    if (protectedPages.includes(page) && !isAuthenticated) {
      setCurrentPage("login");
      return;
    }

    setCurrentPage(page);
  };

  const handleLogin = (email: string) => {
    login(email);
    setCurrentPage("home");
  };

  if (currentPage === "login") {
    return <LoginPage onBack={() => navigateTo("home")} onNavigate={navigateTo} onLogin={handleLogin} />;
  }

  if (currentPage === "signup-step1") {
    return (
      <SignupStep1
        onBack={() => navigateTo("home")}
        onNavigate={navigateTo}
        onNext={(data) => {
          setSignupData(data);
          setCurrentPage("signup-step2");
        }}
      />
    );
  }

  if (currentPage === "signup-step2") {
    return (
      <SignupStep2
        onBack={() => setCurrentPage("signup-step1")}
        onNavigate={navigateTo}
        signupData={signupData || { email: "", password: "" }}
      />
    );
  }

  if (currentPage === "find-id") {
    return <FindIdPage onBack={() => navigateTo("home")} onNavigate={navigateTo} />;
  }

  if (currentPage === "find-password") {
    return <FindPasswordPage onBack={() => navigateTo("home")} onNavigate={navigateTo} />;
  }

  if (currentPage === "dashboard") {
    return (
      <>
        <Header onNavigate={navigateTo} />
        <DashboardPage />
        <Footer onNavigate={navigateTo} />
      </>
    );
  }

  // MY 자산 메뉴 페이지들
  if (currentPage === "account-management") {
    return (
      <>
        <Header onNavigate={navigateTo} />
        <AccountManagementPage />
        <Footer onNavigate={navigateTo} />
      </>
    );
  }

  if (currentPage === "settings") {
    return (
      <>
        <Header onNavigate={navigateTo} />
        <SettingsPage />
        <Footer onNavigate={navigateTo} />
      </>
    );
  }

  if (currentPage === "my-robo") {
    return (
      <>
        <Header onNavigate={navigateTo} />
        <MyRoboPage />
        <Footer onNavigate={navigateTo} />
      </>
    );
  }

  if (currentPage === "analysis") {
    return (
      <>
        <Header onNavigate={navigateTo} />
        <AnalysisPage />
        <Footer onNavigate={navigateTo} />
      </>
    );
  }

  if (currentPage === "asset-summary") {
    return (
      <>
        <Header onNavigate={navigateTo} />
        <AssetSummaryPage />
        <Footer onNavigate={navigateTo} />
      </>
    );
  }

  if (currentPage === "asset-allocation") {
    return (
      <>
        <Header onNavigate={navigateTo} />
        <AssetAllocationPage />
        <Footer onNavigate={navigateTo} />
      </>
    );
  }

  if (currentPage === "holdings") {
    return (
      <>
        <Header onNavigate={navigateTo} />
        <HoldingsPage />
        <Footer onNavigate={navigateTo} />
      </>
    );
  }

  if (currentPage === "returns") {
    return (
      <>
        <Header onNavigate={navigateTo} />
        <ReturnsPage />
        <Footer onNavigate={navigateTo} />
      </>
    );
  }

  if (currentPage === "favorites") {
    return (
      <>
        <Header onNavigate={navigateTo} />
        <FavoritesPage />
        <Footer onNavigate={navigateTo} />
      </>
    );
  }

  if (currentPage === "notifications") {
    return (
      <>
        <Header onNavigate={navigateTo} />
        <NotificationsPage />
        <Footer onNavigate={navigateTo} />
      </>
    );
  }

  if (currentPage === "notification-settings") {
    return (
      <>
        <Header onNavigate={navigateTo} />
        <NotificationSettingsPage />
        <Footer onNavigate={navigateTo} />
      </>
    );
  }

  if (currentPage === "my-assets") {
    return (
      <>
        <Header onNavigate={navigateTo} />
        <MyAssetsPage />
        <Footer onNavigate={navigateTo} />
      </>
    );
  }

  if (currentPage === "portfolio") {
    return (
      <>
        <Header onNavigate={navigateTo} />
        <PortfolioPage />
        <Footer onNavigate={navigateTo} />
      </>
    );
  }

  if (currentPage === "investment-info") {
    return (
      <>
        <Header onNavigate={navigateTo} />
        <InvestmentInfoPage onNavigate={navigateTo} />
        <Footer onNavigate={navigateTo} />
      </>
    );
  }

  if (currentPage === "support") {
    return (
      <>
        <Header onNavigate={navigateTo} />
        <SupportPage />
        <Footer onNavigate={navigateTo} />
      </>
    );
  }

  if (currentPage === "inquiry-list") {
    return (
      <>
        <Header onNavigate={navigateTo} />
        <InquiryListPage
          onNavigate={navigateTo}
          onViewDetail={(id) => {
            setSelectedInquiryId(id);
            setCurrentPage("inquiry-detail");
          }}
        />
        <Footer onNavigate={navigateTo} />
      </>
    );
  }

  if (currentPage === "inquiry-detail") {
    return (
      <>
        <Header onNavigate={navigateTo} />
        <InquiryDetailPage onNavigate={navigateTo} inquiryId={selectedInquiryId} />
        <Footer onNavigate={navigateTo} />
      </>
    );
  }

  if (currentPage === "customer-inquiry-form") {
    return (
      <>
        <Header onNavigate={navigateTo} />
        <CustomerInquiryFormPage onNavigate={navigateTo} />
        <Footer onNavigate={navigateTo} />
      </>
    );
  }

  if (currentPage === "inquiry-confirmation") {
    return (
      <>
        <Header onNavigate={navigateTo} />
        <InquiryConfirmationPage onNavigate={navigateTo} />
        <Footer onNavigate={navigateTo} />
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <Header onNavigate={navigateTo} />
      <main>
        <Hero />
        <Services />
        <About />
        <Testimonials />
        <Support />
      </main>
      <Footer onNavigate={navigateTo} />
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
