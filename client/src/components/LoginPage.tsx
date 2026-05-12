import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input";
import logoImage from "../imports/머니메이트_로고-1.png";
import { MyAssetsDropdown } from "./MyAssetsDropdown";

type Page = "home" | "login" | "dashboard" | "my-assets" | "portfolio" | "investment-info" | "support" |
  "account-management" | "settings" | "my-robo" | "analysis" | "asset-summary" |
  "asset-allocation" | "holdings" | "returns" | "favorites" | "notifications" | "notification-settings" |
  "signup-step1" | "signup-step2" | "find-id" | "find-password" | "inquiry-list" | "customer-inquiry" | "customer-inquiry-form" | "inquiry-confirmation";

interface LoginPageProps {
  onBack: () => void;
  onNavigate: (page: Page) => void;
  onLogin?: (email: string) => void;
}

export function LoginPage({ onBack, onNavigate, onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 시범 계정 검증
    if (email === "aa@naver.com" && password === "1234") {
      setError("");
      if (onLogin) {
        onLogin(email);
      }
      return;
    }

    // 회원가입한 사용자 검증
    const users = JSON.parse(localStorage.getItem("users") || '[]');
    const user = users.find((u: { email: string; password: string }) => u.email === email && u.password === password);

    if (user) {
      setError("");
      if (onLogin) {
        onLogin(email);
      }
    } else {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - 홈 화면과 동일한 스타일 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* MoneyMate Logo */}
            <button onClick={onBack} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img
                  src={logoImage}
                  alt="MoneyMate Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <div className="text-xl font-bold" style={{ color: "#1D6AE5" }}>
                  MoneyMate
                </div>
                <div className="text-xs font-medium" style={{ color: "#00C896" }}>
                  머니메이트
                </div>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              <MyAssetsDropdown onNavigate={onNavigate} />
              <button onClick={() => onNavigate("portfolio")} className="text-gray-700 hover:text-blue-600 transition-colors">
                포트폴리오
              </button>
              <button onClick={() => onNavigate("investment-info")} className="text-gray-700 hover:text-blue-600 transition-colors">
                투자정보
              </button>
              <button onClick={() => onNavigate("support")} className="text-gray-700 hover:text-blue-600 transition-colors">
                고객센터
              </button>
            </nav>

            {/* Login Button */}
            <button
              style={{
                backgroundColor: "#1D6AE5",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: "500",
                border: "none",
                cursor: "pointer",
              }}
            >
              로그인
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">로그인</h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 items-start mb-8">
            {/* Input Fields */}
            <div className="flex-1 space-y-4">
              {/* Email Input */}
              <Input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded"
                required
              />

              {/* Password Input */}
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 text-base border border-gray-300 rounded"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="px-12 py-3 rounded font-medium"
              style={{
                backgroundColor: email && password ? "#1D6AE5" : "#F5F5F5",
                color: email && password ? "white" : "#333",
                border: email && password ? "none" : "1px solid #D1D1D1",
                minHeight: "110px",
              }}
            >
              로그인
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* Demo Account Info */}

        {/* Bottom Links */}
        <div className="border border-gray-300 rounded p-4 text-center">
          <div className="flex items-center justify-center gap-3 text-gray-700">
            <button
              onClick={() => onNavigate("find-id")}
              className="hover:text-blue-600 transition-colors"
            >이메일 찾기</button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => onNavigate("find-password")}
              className="hover:text-blue-600 transition-colors"
            >비밀번호 재설정</button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => onNavigate("signup-step1")}
              className="hover:text-blue-600 transition-colors"
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
