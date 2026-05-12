import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import logoImage from "../imports/머니메이트_로고-1.png";
import { MyAssetsDropdown } from "./MyAssetsDropdown";

type Page = "home" | "login" | "dashboard" | "my-assets" | "portfolio" | "investment-info" | "support" |
  "account-management" | "settings" | "my-robo" | "analysis" | "asset-summary" |
  "asset-allocation" | "holdings" | "returns" | "favorites" | "notifications" | "notification-settings" |
  "signup-step1" | "signup-step2" | "find-id" | "find-password" | "inquiry-list" | "customer-inquiry" | "customer-inquiry-form" | "inquiry-confirmation";

interface FindPasswordPageProps {
  onBack: () => void;
  onNavigate: (page: Page) => void;
}

export function FindPasswordPage({ onBack, onNavigate }: FindPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(180); // 3 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      setError("인증 시간이 만료되었습니다. 인증번호를 재전송해주세요.");
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timer]);

  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

    // 사용자 확인
    const users = JSON.parse(localStorage.getItem("users") || '[]');
    const user = users.find((u: { email: string }) => u.email === email);

    if (!user && email !== "aa@naver.com") {
      setError("일치하는 계정을 찾을 수 없습니다.");
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setIsCodeSent(true);
    setTimer(180);
    setIsTimerActive(true);
    setVerificationCode("");
    setError("");
    alert(`인증번호가 발송되었습니다: ${code}`);
  };

  const handleResendCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setTimer(180);
    setIsTimerActive(true);
    setVerificationCode("");
    setError("");
    alert(`인증번호가 재전송되었습니다: ${code}`);
  };

  const handleVerifyCode = () => {
    if (verificationCode !== generatedCode) {
      setError("인증번호가 일치하지 않습니다.");
      return;
    }
    setIsVerified(true);
    setError("");
    alert("인증이 완료되었습니다.");
  };

  const handleChangePassword = () => {
    if (!isVerified) {
      setError("이메일 인증을 완료해주세요.");
      return;
    }
    if (!newPassword) {
      setError("새 비밀번호를 입력해주세요.");
      return;
    }
    if (!validatePassword(newPassword)) {
      setError("비밀번호는 8자 이상, 영문 대소문자, 특수문자를 포함해야 합니다.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 비밀번호 변경
    const users = JSON.parse(localStorage.getItem("users") || '[]');
    const userIndex = users.findIndex((u: { email: string }) => u.email === email);

    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem("users", JSON.stringify(users));
    }

    setIsPasswordChanged(true);
    setError("");
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
              <button onClick={() => onNavigate("dashboard")} className="text-gray-700 hover:text-blue-600 transition-colors">
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
            비밀번호 재설정
          </h1>
        </div>

        {/* Card 1: Verification */}
        <div className="bg-gray-50 rounded-lg p-8 space-y-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">본인 인증</h2>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일 인증
            </label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                disabled={isCodeSent}
              />
              <Button
                onClick={handleSendCode}
                disabled={isCodeSent}
                style={{
                  backgroundColor: isCodeSent ? "#9CA3AF" : "#1D6AE5",
                  minWidth: "140px",
                }}
              >
                인증번호 발송
              </Button>
              {isCodeSent && !isVerified && (
                <button
                  onClick={handleResendCode}
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors"
                  style={{ minWidth: "140px" }}
                >
                  인증번호 재전송
                </button>
              )}
            </div>
          </div>

          {/* Verification Code */}
          {isCodeSent && !isVerified && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                인증번호
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="인증번호 6자리 입력"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    className="pr-20"
                  />
                  {isTimerActive && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: timer < 60 ? "#EF4444" : "#1D6AE5" }}>
                      {formatTimer(timer)}
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleVerifyCode}
                  style={{ backgroundColor: "#1D6AE5", minWidth: "140px" }}
                >
                  인증 확인
                </Button>
              </div>
            </div>
          )}

          {isVerified && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-600 text-sm">
              ✓ 인증이 완료되었습니다.
            </div>
          )}
        </div>

        {/* Card 2: New Password */}
        {isVerified && (
          <div className="bg-gray-50 rounded-lg p-8 space-y-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">새 비밀번호 설정</h2>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                새 비밀번호
              </label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="8자 이상, 영문 대소문자, 특수문자 포함"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {/* Password Validation Feedback */}
              <div className="mt-2 space-y-1 text-sm">
                <div className={newPassword.length >= 8 ? "text-green-600" : "text-red-600"}>
                  {newPassword.length >= 8 ? "✓" : "✗"} 8자 이상
                </div>
                <div className={/[a-z]/.test(newPassword) ? "text-green-600" : "text-red-600"}>
                  {/[a-z]/.test(newPassword) ? "✓" : "✗"} 영문 소문자 포함
                </div>
                <div className={/[A-Z]/.test(newPassword) ? "text-green-600" : "text-red-600"}>
                  {/[A-Z]/.test(newPassword) ? "✓" : "✗"} 영문 대문자 포함
                </div>
                <div className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "text-green-600" : "text-red-600"}>
                  {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "✓" : "✗"} 특수문자 포함
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 확인
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="한 번 더 입력"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {confirmPassword && (
                <div className="mt-1 text-sm">
                  {newPassword === confirmPassword ? (
                    <div className="text-green-600">✓ 비밀번호가 일치합니다</div>
                  ) : (
                    <div className="text-red-600">✗ 비밀번호가 일치하지 않습니다</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Change Password Button & Status */}
        {isVerified && (
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={handleChangePassword}
              style={{
                backgroundColor: "#1D6AE5",
                color: "white",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              비밀번호 변경
            </Button>
            {isPasswordChanged && (
              <span className="text-green-600 font-medium">
                비밀번호 변경 완료!
              </span>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => onNavigate("login")}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            로그인으로 이동
          </button>
          <button
            onClick={() => onNavigate("home")}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            홈
          </button>
        </div>
      </div>
    </div>
  );
}
