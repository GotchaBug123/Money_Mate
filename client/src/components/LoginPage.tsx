import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import { Input } from "./ui/input";

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
  | "inquiry-confirmation";

interface LoginPageProps {

  onBack: () => void;

  onNavigate: (
    page: Page
  ) => void;

  onLogin?: (
    email: string
  ) => void;
}

export function LoginPage({
  onBack,
  onNavigate,
  onLogin,
}: LoginPageProps) {

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  /* =========================
     로그인 처리
  ========================= */

  const handleSubmit = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    /* =========================
       테스트 계정
    ========================= */

    if (
      email === "aa@naver.com" &&
      password === "1234"
    ) {

      setError("");

      localStorage.setItem(
        "isAuthenticated",
        "true"
      );

      localStorage.setItem(
        "currentUserEmail",
        email
      );

      if (onLogin) {

        onLogin(email);
      }

      return;
    }

    /* =========================
       회원가입 계정 확인
    ========================= */

    const users = JSON.parse(
      localStorage.getItem(
        "users"
      ) || "[]"
    );

    const user = users.find(
      (
        u: {
          email: string;
          password: string;
        }
      ) =>
        u.email === email &&
        u.password === password
    );

    if (user) {

      setError("");

      localStorage.setItem(
        "isAuthenticated",
        "true"
      );

      localStorage.setItem(
        "currentUserEmail",
        email
      );

      if (onLogin) {

        onLogin(email);
      }

    } else {

      setError(
        "이메일 또는 비밀번호가 올바르지 않습니다."
      );
    }
  };

  return (
    <div className="
      min-h-[calc(100vh-80px)]
      bg-white
    ">

      {/* =========================
          메인 영역
      ========================= */}

      <div className="
        max-w-2xl
        mx-auto
        px-4
        py-16
      ">

        {/* 제목 */}
        <div className="
          text-center
          mb-12
        ">

          <h1 className="
            text-3xl
            font-bold
            text-gray-900
          ">
            로그인
          </h1>

        </div>

        {/* =========================
            로그인 폼
        ========================= */}

        <form
          onSubmit={handleSubmit}
        >

          <div className="
            flex
            gap-4
            items-start
            mb-8
          ">

            {/* 입력 영역 */}
            <div className="
              flex-1
              space-y-4
            ">

              {/* 이메일 */}
              <Input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="
                  w-full
                  px-4
                  py-3
                  text-base
                  border
                  border-gray-300
                  rounded
                "
                required
              />

              {/* 비밀번호 */}
              <div className="relative">

                <Input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    px-4
                    py-3
                    pr-12
                    text-base
                    border
                    border-gray-300
                    rounded
                  "
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                    hover:text-gray-600
                  "
                >

                  {showPassword ? (

                    <EyeOff className="
                      h-5
                      w-5
                    " />

                  ) : (

                    <Eye className="
                      h-5
                      w-5
                    " />

                  )}

                </button>

              </div>

            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="
                px-12
                py-3
                rounded
                font-medium
              "
              style={{
                backgroundColor:
                  email && password
                    ? "#1D6AE5"
                    : "#F5F5F5",

                color:
                  email && password
                    ? "white"
                    : "#333",

                border:
                  email && password
                    ? "none"
                    : "1px solid #D1D1D1",

                minHeight: "110px",
              }}
            >
              로그인
            </button>

          </div>

        </form>

        {/* =========================
            에러 메시지
        ========================= */}

        {error && (

          <div className="
            mb-4
            p-3
            bg-red-50
            border
            border-red-200
            rounded
            text-red-600
            text-sm
            text-center
          ">
            {error}
          </div>
        )}

        {/* =========================
            하단 링크
        ========================= */}

        <div className="
          border
          border-gray-300
          rounded
          p-4
          text-center
        ">

          <div className="
            flex
            items-center
            justify-center
            gap-3
            text-gray-700
          ">

            {/* 이메일 찾기 */}
            <button
              type="button"
              onClick={() =>
                onNavigate(
                  "find-id"
                )
              }
              className="
                hover:text-blue-600
                transition-colors
              "
            >
              이메일 찾기
            </button>

            <span className="
              text-gray-300
            ">
              |
            </span>

            {/* 비밀번호 재설정 */}
            <button
              type="button"
              onClick={() =>
                onNavigate(
                  "find-password"
                )
              }
              className="
                hover:text-blue-600
                transition-colors
              "
            >
              비밀번호 재설정
            </button>

            <span className="
              text-gray-300
            ">
              |
            </span>

            {/* 회원가입 */}
            <button
              type="button"
              onClick={() =>
                onNavigate(
                  "signup-step1"
                )
              }
              className="
                hover:text-blue-600
                transition-colors
              "
            >
              회원가입
            </button>

          </div>

        </div>

        {/* =========================
            뒤로가기
        ========================= */}

        <div className="
          flex
          justify-center
          mt-8
        ">

          <button
            type="button"
            onClick={onBack}
            className="
              text-gray-500
              hover:text-blue-600
              transition-colors
            "
          >
            홈으로 돌아가기
          </button>

        </div>

      </div>

    </div>
  );
}