import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import logoImage from "../imports/머니메이트_로고-1.png";
import { MyAssetsDropdown } from "./MyAssetsDropdown";

type Page = "home" | "login" | "dashboard" | "my-assets" | "portfolio" | "investment-info" | "support" |
  "account-management" | "settings" | "my-robo" | "analysis" | "asset-summary" |
  "asset-allocation" | "holdings" | "returns" | "favorites" | "notifications" | "notification-settings" |
  "signup-step1" | "signup-step2" | "find-id" | "find-password" | "inquiry-list" | "customer-inquiry" | "customer-inquiry-form" | "inquiry-confirmation";

interface SignupStep2Props {
  onBack: () => void;
  onNavigate: (page: Page) => void;
  signupData: { email: string; password: string };
}

export function SignupStep2({ onBack, onNavigate, signupData }: SignupStep2Props) {
  const [name, setName] = useState("");
  const [idNumber1, setIdNumber1] = useState("");
  const [idNumber2, setIdNumber2] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [agreeRequired, setAgreeRequired] = useState(false);
  const [agreeInvestmentNotice, setAgreeInvestmentNotice] = useState(false);
  const [agreeOptional, setAgreeOptional] = useState(false);
  const [error, setError] = useState("");
  const [isIdNumber2Focused, setIsIdNumber2Focused] = useState(false);

  const handleIdNumber1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 6) {
      setIdNumber1(value);
    }
  };

  const handleIdNumber2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 1) {
      setIdNumber2(value);
    }
  };

  const getIdNumber2DisplayValue = (): string => {
    if (isIdNumber2Focused) {
      return idNumber2;
    }
    if (idNumber2.length === 0) return "";
    return idNumber2 + "*****";
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

  const handleComplete = () => {
    if (!name) {
      setError("이름을 입력해주세요.");
      return;
    }
    if (idNumber1.length !== 6 || idNumber2.length !== 1) {
      setError("주민번호를 올바르게 입력해주세요.");
      return;
    }
    if (!phone) {
      setError("전화번호를 입력해주세요.");
      return;
    }
    if (!isVerified) {
      setError("전화번호 인증을 완료해주세요.");
      return;
    }
    if (!agreeRequired) {
      setError("필수 약관에 동의해주세요.");
      return;
    }
    if (!agreeInvestmentNotice) {
      setError("투자 책임 고지에 동의해주세요.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || '[]');
    const newUser = {
      email: signupData.email,
      password: signupData.password,
      name: name,
      idNumber: idNumber1 + idNumber2,
      phone: phone,
      marketingAgreed: agreeOptional,
      investmentNoticeAgreed: agreeInvestmentNotice,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    const registeredEmails = JSON.parse(localStorage.getItem("registeredEmails") || '["aa@naver.com"]');
    if (!registeredEmails.includes(signupData.email)) {
      registeredEmails.push(signupData.email);
      localStorage.setItem("registeredEmails", JSON.stringify(registeredEmails));
    }

    setError("");
    alert("회원가입이 완료되었습니다!");
    onNavigate("login");
  };

  const canComplete =
    name &&
    idNumber1.length === 6 &&
    idNumber2.length === 1 &&
    phone.length === 11 &&
    isVerified &&
    agreeRequired &&
    agreeInvestmentNotice;

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
          <p className="text-gray-600 mt-2">2/2 단계</p>
        </div>

        <div className="space-y-6">
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

          {/* ID Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주민번호
            </label>
            <div className="flex items-center gap-3">
              <Input
                type="text"
                placeholder="6자리"
                value={idNumber1}
                onChange={handleIdNumber1Change}
                maxLength={6}
                className="flex-1"
              />
              <span className="text-gray-400">—</span>
              <Input
                type="text"
                placeholder="앞 1자리(*****)"
                value={getIdNumber2DisplayValue()}
                onChange={handleIdNumber2Change}
                onFocus={() => setIsIdNumber2Focused(true)}
                onBlur={() => setIsIdNumber2Focused(false)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              전화번호
            </label>
            <div className="flex gap-2">
              <Input
                type="tel"
                placeholder="000-0000-0000"
                value={formatPhoneNumber(phone)}
                onChange={handlePhoneChange}
                className="flex-1"
                disabled={isVerified}
              />
              <Button
                onClick={handleSendCode}
                disabled={isVerified}
                style={{
                  backgroundColor: isVerified ? "#9CA3AF" : "#1D6AE5",
                  minWidth: "120px",
                }}
              >
                {isVerified ? "인증완료" : (isCodeSent ? "재전송" : "전화번호 인증")}
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

          {/* Terms */}
          <div className="border border-gray-300 rounded p-4 space-y-3">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="agreeRequired"
                checked={agreeRequired}
                onChange={(e) => setAgreeRequired(e.target.checked)}
                className="w-4 h-4 mt-1"
              />
              <label htmlFor="agreeRequired" className="text-sm text-gray-700">
                [필수] 이용약관 및 개인정보 처리방침에 동의합니다
              </label>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="agreeInvestmentNotice"
                checked={agreeInvestmentNotice}
                onChange={(e) => setAgreeInvestmentNotice(e.target.checked)}
                className="w-4 h-4 mt-1"
              />
              <label htmlFor="agreeInvestmentNotice" className="text-sm text-gray-700 leading-relaxed">
                [필수] 본 서비스는 투자자문이 아닌 정보 제공 목적이며, 최종 투자 결정의 책임은 본인에게 있습니다.
              </label>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-600 text-sm leading-relaxed">
              수집된 금융 정보는 성명, 계좌번호 등이 제거된 비식별화 처리를 거쳐 분석에만 활용됩니다.
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="agreeOptional"
                checked={agreeOptional}
                onChange={(e) => setAgreeOptional(e.target.checked)}
                className="w-4 h-4 mt-1"
              />
              <label htmlFor="agreeOptional" className="text-sm text-gray-700">
                [선택] 마케팅 정보 수신에 동의합니다
              </label>
            </div>
          </div>

          {/* Marketing Info Notice */}
          {!agreeOptional && agreeRequired && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-600 text-sm">
              마케팅 정보 수신 미동의 시 이벤트 및 혜택 안내를 받지 못할 수 있습니다.
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Complete Button */}
          <Button
            onClick={handleComplete}
            disabled={!canComplete}
            className="w-full"
            style={{
              backgroundColor: canComplete ? "#1D6AE5" : "#9CA3AF",
              color: "white",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            회원가입 완료
          </Button>
        </div>
      </div>
    </div>
  );
}