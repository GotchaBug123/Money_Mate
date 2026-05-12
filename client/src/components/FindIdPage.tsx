import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import logoImage from "../imports/머니메이트_로고-1.png";
import { MyAssetsDropdown } from "./MyAssetsDropdown";

type Page = "home" | "login" | "dashboard" | "my-assets" | "portfolio" | "investment-info" | "support" |
  "account-management" | "settings" | "my-robo" | "analysis" | "asset-summary" |
  "asset-allocation" | "holdings" | "returns" | "favorites" | "notifications" | "notification-settings" |
  "signup-step1" | "signup-step2" | "find-id" | "find-password" | "inquiry-list" | "customer-inquiry" | "customer-inquiry-form" | "inquiry-confirmation";

interface FindIdPageProps {
  onBack: () => void;
  onNavigate: (page: Page) => void;
}

export function FindIdPage({ onBack, onNavigate }: FindIdPageProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [foundId, setFoundId] = useState("");
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 11) {
      setPhone(value);
    }
  };

  const formatPhoneNumber = (value: string): string => {
    if (value.length === 0) return "";
    if (value.length <= 3) return value;
    if (value.length <= 7) return `${value.slice(0, 3)}-${value.slice(3)}`;
    return `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
  };

  const handleSendCode = () => {
    if (!phone) {
      setError("전화번호를 입력해주세요.");
      return;
    }
    if (phone.length !== 11) {
      setError("올바른 전화번호를 입력해주세요.");
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
    setError("");
    alert("인증이 완료되었습니다.");
  };

  const handleFindId = () => {
    if (!name) {
      setError("이름을 입력해주세요.");
      return;
    }
    if (!phone) {
      setError("전화번호를 입력해주세요.");
      return;
    }
    if (verificationCode !== generatedCode) {
      setError("전화번호 인증을 완료해주세요.");
      return;
    }

    // 사용자 검색
    const users = JSON.parse(localStorage.getItem("users") || '[]');
    const user = users.find((u: { phone: string; name: string }) => u.phone === phone && u.name === name);

    if (user) {
      setFoundId(user.email);
      setError("");
    } else if (phone === "01012345678" && name === "시범계정") {
      setFoundId("aa@naver.com");
      setError("");
    } else {
      setError("일치하는 계정을 찾을 수 없습니다.");
      setFoundId("");
    }
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
          <h1 className="text-3xl font-bold text-gray-900">이메일 찾기</h1>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <Input
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">전화번호 인증</label>
            <div className="flex gap-2">
              <Input
                type="tel"
                placeholder="전화번호"
                value={formatPhoneNumber(phone)}
                onChange={handlePhoneChange}
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
              {isCodeSent && (
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
          {isCodeSent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                인증번호
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="인증번호 6자리"
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

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Find ID Button */}
          <Button
            onClick={handleFindId}
            className="w-full"
            style={{
              backgroundColor: "#1D6AE5",
              color: "white",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >이메일 찾기</Button>

          {/* Result Area */}
          {foundId && (
            <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">회원님의 아이디는</p>
                <p className="text-xl font-bold text-gray-900">{foundId}</p>
                <p className="text-sm text-gray-600 mt-2">입니다.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => onNavigate("login")}
            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            로그인으로 이동
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => onNavigate("find-password")}
            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            비밀번호 찾기
          </button>
        </div>
      </div>
    </div>
  );
}
