import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import logoImage from "../imports/머니메이트_로고-1.png";
import { MyAssetsDropdown } from "./MyAssetsDropdown";

type Page = "home" | "login" | "dashboard" | "my-assets" | "portfolio" | "investment-info" | "support" |
  "account-management" | "settings" | "my-robo" | "analysis" | "asset-summary" |
  "asset-allocation" | "holdings" | "returns" | "favorites" | "notifications" | "notification-settings" |
  "signup-step1" | "signup-step2" | "find-id" | "find-password" | "inquiry-list" | "customer-inquiry" | "customer-inquiry-form" | "inquiry-confirmation";

interface SignupStep1Props {
  onBack: () => void;
  onNavigate: (page: Page) => void;
  onNext: (data: { email: string; password: string }) => void;
}

export function SignupStep1({ onBack, onNavigate, onNext }: SignupStep1Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = (pwd: string): boolean => {
    const hasMinLength = pwd.length >= 8;
    const hasLetter = /[a-z]/.test(pwd);
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    return hasMinLength && hasLetter && hasUpperCase && hasSpecialChar;
  };

  const handleSendCode = () => {
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    const registeredEmails = JSON.parse(localStorage.getItem("registeredEmails") || '["aa@naver.com"]');
    if (registeredEmails.includes(email)) {
      setError("회원가입이 된 이메일입니다.");
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setIsCodeSent(true);
    setError("");
    alert(`인증번호가 발송되었습니다: ${code}`);
  };

  const handleVerifyCode = () => {
    if (verificationCode === generatedCode) {
      setIsVerified(true);
      setError("");
      alert("인증이 완료되었습니다.");
    } else {
      setError("인증번호가 일치하지 않습니다.");
    }
  };

  const handleNext = () => {
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }
    if (!validatePassword(password)) {
      setError("비밀번호는 8자 이상, 영문 대소문자, 특수문자를 포함해야 합니다.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!isVerified) {
      setError("이메일 인증을 완료해주세요.");
      return;
    }
    setError("");
    onNext({ email, password });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
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

            <nav className="hidden md:flex space-x-8 items-center">
              <MyAssetsDropdown onNavigate={onNavigate} />
              <button onClick={() => onNavigate("portfolio")} className="text-gray-700 hover:text-blue-600 transition-colors">
                포트폴리오
              </button>
              <button onClick={() => onNavigate("home")} className="text-gray-700 hover:text-blue-600 transition-colors">
                대시보드
              </button>
              <button onClick={() => onNavigate("investment-info")} className="text-gray-700 hover:text-blue-600 transition-colors">
                투자정보
              </button>
              <button onClick={() => onNavigate("support")} className="text-gray-700 hover:text-blue-600 transition-colors">
                고객센터
              </button>
            </nav>

            <button
              onClick={() => onNavigate("login")}
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
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">
            회원가입
          </h1>
          <p className="text-gray-600 mt-2">1/2 단계</p>
        </div>

        <div className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  disabled={isVerified}
                />
                {email && (
                  <div className="mt-1 text-sm">
                    {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? (
                      <div className="text-green-600">✓ 올바른 이메일 형식입니다</div>
                    ) : (
                      <div className="text-red-600">✗ 올바른 이메일 형식이 아닙니다 (예: user@example.com)</div>
                    )}
                  </div>
                )}
              </div>
              <Button
                onClick={handleSendCode}
                disabled={isVerified}
                style={{
                  backgroundColor: isVerified ? "#9CA3AF" : "#1D6AE5",
                  minWidth: "120px",
                }}
              >
                {isVerified ? "인증완료" : (isCodeSent ? "재전송" : "인증번호 발송")}
              </Button>
            </div>
          </div>

          {/* Verification Code */}
          {isCodeSent && !isVerified && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                인증번호
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="인증번호 6자리"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="flex-1"
                />
                <Button
                  onClick={handleVerifyCode}
                  style={{ backgroundColor: "#1D6AE5", minWidth: "120px" }}
                >
                  인증 확인
                </Button>
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호 (8자 이상, 영문 대소문자, 특수문자 포함)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="mt-2 space-y-1 text-sm">
              <div className={password.length >= 8 ? "text-green-600" : "text-red-600"}>
                {password.length >= 8 ? "✓" : "✗"} 8자 이상
              </div>
              <div className={/[a-z]/.test(password) ? "text-green-600" : "text-red-600"}>
                {/[a-z]/.test(password) ? "✓" : "✗"} 영문 소문자 포함
              </div>
              <div className={/[A-Z]/.test(password) ? "text-green-600" : "text-red-600"}>
                {/[A-Z]/.test(password) ? "✓" : "✗"} 영문 대문자 포함
              </div>
              <div className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green-600" : "text-red-600"}>
                {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "✓" : "✗"} 특수문자 포함
              </div>
            </div>
          </div>

          {/* Password Confirm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호 확인
            </label>
            <div className="relative">
              <Input
                type={showPasswordConfirm ? "text" : "password"}
                placeholder="비밀번호를 다시 입력하세요"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswordConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Investment Notice */}
          <div className="border border-blue-200 bg-blue-50 rounded p-4 space-y-2">
            <p className="text-sm text-blue-700 font-medium">
              본 서비스는 투자자문이 아닌 정보 제공 목적이며, 최종 투자 결정의 책임은 본인에게 있습니다.
            </p>
            <p className="text-xs text-blue-600">
              수집된 금융 정보는 성명, 계좌번호 등이 제거된 비식별화 처리를 거쳐 분석에만 활용됩니다.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={!isVerified}
            className="w-full"
            style={{
              backgroundColor: isVerified ? "#1D6AE5" : "#9CA3AF",
              color: "white",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}