import { Menu, X, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import logoImage from "../imports/moneymate-logo.png";

import { MyAssetsDropdown } from "./MyAssetsDropdown";

import { useAuth } from "../context/AuthContext";
import { useDropdown } from "../context/DropdownContext";

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
  | "notice-list"
  | "notice-detail";

interface HeaderProps {
  onNavigate?: (page: Page) => void;
}

export function Header({
  onNavigate = () => {},
}: HeaderProps) {

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const {
    isAuthenticated,
    logout,
  } = useAuth();

  const {
    toggleDropdown,
    isDropdownOpen,
    closeDropdown,
  } = useDropdown();

  const customerCenterRef =
    useRef<HTMLDivElement>(null);

  const showCustomerCenter =
    isDropdownOpen("customer-center");

  /* =========================
     사용자 이름
  ========================= */

  const getUserName = () => {

    const users = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    if (
      users.length > 0 &&
      users[0].name
    ) {
      return users[0].name;
    }

    return "사용자";
  };

  /* =========================
     외부 클릭 감지
  ========================= */

  useEffect(() => {

    function handleClickOutside(
      event: MouseEvent
    ) {

      if (
        customerCenterRef.current &&
        !customerCenterRef.current.contains(
          event.target as Node
        )
      ) {

        if (showCustomerCenter) {
          closeDropdown();
        }
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, [
    showCustomerCenter,
    closeDropdown,
  ]);

  /* =========================
     공통 페이지 이동
  ========================= */

  const handleMove = (
    event: React.MouseEvent<HTMLButtonElement>,
    page: Page
  ) => {

    event.preventDefault();

    event.stopPropagation();

    onNavigate(page);
  };

  /* =========================
     로그아웃
  ========================= */

  const handleLogout = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {

    event.preventDefault();

    event.stopPropagation();

    logout();

    onNavigate("home");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center py-4">

          {/* =========================
              로고
          ========================= */}

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={(event) =>
                handleMove(
                  event,
                  "home"
                )
              }
              className="
                flex
                items-center
                gap-2
                hover:opacity-80
                transition-opacity
              "
            >

              <div
                className="
                  w-10
                  h-10
                  rounded-lg
                  flex
                  items-center
                  justify-center
                "
              >

                <img
                  src={logoImage}
                  alt="MoneyMate Logo"
                  className="
                    w-14
                    h-14
                    object-contain
                  "
                />

              </div>

              <div>

                <div
                  className="
                    text-xl
                    font-bold
                  "
                  style={{
                    color: "#3B82F6",
                  }}
                >
                  MoneyMate
                </div>

                <div
                  className="
                    text-xs
                    font-medium
                  "
                  style={{
                    color: "#00C896",
                  }}
                >
                  머니메이트
                </div>

              </div>

            </button>

          </div>

          {/* =========================
              데스크탑 메뉴
          ========================= */}

          <nav
            className="
              hidden
              md:flex
              items-center
            "
            style={{
              gap: "24px",
            }}
          >

            {/* MY 자산 */}
            <MyAssetsDropdown
              onNavigate={onNavigate}
            />

            {/* 포트폴리오 */}
            <button
              type="button"
              onClick={(event) =>
                handleMove(
                  event,
                  "portfolio"
                )
              }
              className="
                text-gray-700
                hover:text-blue-600
                transition-colors
              "
            >
              포트폴리오
            </button>

            {/* 투자정보 */}
            <button
              type="button"
              onClick={(event) =>
                handleMove(
                  event,
                  "investment-info"
                )
              }
              className="
                text-gray-700
                hover:text-blue-600
                transition-colors
              "
            >
              투자정보
            </button>

            {/* =========================
                고객센터
            ========================= */}

            <div
              className="relative"
              ref={customerCenterRef}
            >

              <button
                type="button"
                onClick={(event) => {

                  event.preventDefault();

                  event.stopPropagation();

                  toggleDropdown(
                    "customer-center"
                  );
                }}
                className="
                  flex
                  items-center
                  gap-1
                  transition-colors
                "
                style={{
                  color: showCustomerCenter
                    ? "#3B82F6"
                    : "#64748B",

                  fontWeight:
                    showCustomerCenter
                      ? "600"
                      : "400",
                }}
              >
                고객센터
              </button>

              {showCustomerCenter && (

                <div
                  className="
                    absolute
                    top-full
                    mt-2
                    bg-white
                    rounded-lg
                    shadow-lg
                    border
                    border-gray-200
                    p-6
                    z-50
                  "
                  style={{
                    minWidth: "600px",
                    left: "-200px",
                  }}
                >

                  <div className="flex gap-6">

                    {/* 문의 */}
                    <div className="flex-1">

                      <div className="
                        text-xs
                        font-semibold
                        text-gray-500
                        mb-2
                      ">
                        [문의]
                      </div>

                      <button
                        type="button"
                        onClick={(event) =>
                          handleMove(
                            event,
                            "inquiry-list"
                          )
                        }
                        className="
                          block
                          w-full
                          text-left
                          px-2
                          py-1.5
                          text-sm
                          text-gray-700
                          hover:bg-gray-100
                          rounded
                        "
                      >
                        문의내역
                      </button>

                      <button
                        type="button"
                        onClick={(event) =>
                          handleMove(
                            event,
                            "customer-inquiry-form"
                          )
                        }
                        className="
                          block
                          w-full
                          text-left
                          px-2
                          py-1.5
                          text-sm
                          text-gray-700
                          hover:bg-gray-100
                          rounded
                        "
                      >
                        고객문의
                      </button>

                    </div>

                    <div className="
                      border-l
                      border-gray-200
                    " />

                    {/* 정보 */}
                    <div className="flex-1">

                      <div className="
                        text-xs
                        font-semibold
                        text-gray-500
                        mb-2
                      ">
                        [정보]
                      </div>

                      <button
                        type="button"
                        onClick={(event) =>
                          handleMove(
                            event,
                            "support"
                          )
                        }
                        className="
                          block
                          w-full
                          text-left
                          px-2
                          py-1.5
                          text-sm
                          text-gray-700
                          hover:bg-gray-100
                          rounded
                        "
                      >
                        자주묻는 질문
                      </button>

                      <button
                        type="button"
                        onClick={(event) =>
                          handleMove(
                            event,
                            "notice-list"
                          )
                        }
                        className="
                          block
                          w-full
                          text-left
                          px-2
                          py-1.5
                          text-sm
                          text-gray-700
                          hover:bg-gray-100
                          rounded
                        "
                      >
                        공지사항
                      </button>

                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* 설정 */}
            {isAuthenticated && (

              <button
                type="button"
                onClick={(event) =>
                  handleMove(
                    event,
                    "settings"
                  )
                }
                className="
                  text-gray-700
                  hover:text-blue-600
                  transition-colors
                "
              >
                설정
              </button>
            )}

          </nav>

          {/* =========================
              사용자 영역
          ========================= */}

          <div
            className="
              hidden
              md:flex
              items-center
            "
            style={{
              gap: "24px",
            }}
          >

            {isAuthenticated ? (

              <>

                <div
                  className="
                    flex
                    items-center
                  "
                  style={{
                    gap: "16px",
                  }}
                >

                  {/* 마이페이지 */}
                  <button
                    type="button"
                    onClick={(event) =>
                      handleMove(
                        event,
                        "account-management"
                      )
                    }
                    className="
                      hover:opacity-80
                      transition-opacity
                    "
                    style={{
                      color: "#1E40AF",
                      fontWeight: "500",
                    }}
                  >
                    마이페이지
                  </button>

                  {/* 사용자 이름 */}
                  <span
                    className="
                      text-gray-900
                    "
                    style={{
                      fontWeight: "500",
                    }}
                  >
                    {getUserName()}님
                  </span>

                  {/* 프로필 */}
                  <div
                    className="
                      rounded-full
                      flex
                      items-center
                      justify-center
                    "
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor:
                        "#DBEAFE",
                    }}
                  >

                    <User
                      className="
                        w-5
                        h-5
                      "
                      style={{
                        color: "#3B82F6",
                      }}
                    />

                  </div>

                </div>

                {/* 로그아웃 */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    px-4
                    py-2
                    rounded-lg
                    border
                    transition-colors
                    hover:bg-gray-50
                  "
                  style={{
                    borderColor:
                      "#E2E8F0",

                    color: "#64748B",
                  }}
                >
                  로그아웃
                </button>

              </>

            ) : (

              <button
                type="button"
                onClick={(event) =>
                  handleMove(
                    event,
                    "login"
                  )
                }
                style={{
                  backgroundColor:
                    "#3B82F6",

                  color: "white",

                  padding:
                    "10px 20px",

                  borderRadius: "8px",

                  fontWeight: "500",

                  border: "none",

                  cursor: "pointer",
                }}
              >
                로그인
              </button>

            )}

          </div>

          {/* =========================
              모바일 메뉴 버튼
          ========================= */}

          <button
            type="button"
            className="md:hidden"
            onClick={(event) => {

              event.preventDefault();

              event.stopPropagation();

              setIsMenuOpen(
                !isMenuOpen
              );
            }}
          >

            {isMenuOpen ? (

              <X className="h-6 w-6" />

            ) : (

              <Menu className="h-6 w-6" />

            )}

          </button>

        </div>

      </div>

    </header>
  );
}