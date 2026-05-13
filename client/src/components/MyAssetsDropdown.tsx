import { useEffect, useRef } from "react";

import { useDropdown } from "../context/DropdownContext";
import { useAuth } from "../context/AuthContext";

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

interface MyAssetsDropdownProps {
  onNavigate: (page: Page) => void;
}

export function MyAssetsDropdown({
  onNavigate,
}: MyAssetsDropdownProps) {

  const {
    toggleDropdown,
    isDropdownOpen,
    closeDropdown,
  } = useDropdown();

  const {
    isAuthenticated,
  } = useAuth();

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const isOpen =
    isDropdownOpen("my-assets");

  /* =========================
     바깥 클릭 시 닫기
  ========================= */

  useEffect(() => {

    const handleClickOutside = (
      event: MouseEvent
    ) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {

        if (isOpen) {
          closeDropdown();
        }
      }
    };

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
    isOpen,
    closeDropdown,
  ]);

  /* =========================
     페이지 이동
  ========================= */

  const handlePageMove = (
    event: React.MouseEvent<HTMLButtonElement>,
    page: Page
  ) => {

    event.preventDefault();

    event.stopPropagation();

    const protectedPages: Page[] = [
      "my-robo",
      "asset-simulation",
      "asset-summary",
      "asset-allocation",
      "holdings",
      "returns",
      "favorites",
    ];

    /* =========================
       로그인 체크
    ========================= */

    if (
      protectedPages.includes(page) &&
      !isAuthenticated
    ) {

      closeDropdown();

      onNavigate("login");

      return;
    }

    closeDropdown();

    onNavigate(page);
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >

      {/* =========================
          MY 자산 버튼
      ========================= */}

      <button
        type="button"
        onClick={(event) => {

          event.preventDefault();

          event.stopPropagation();

          toggleDropdown("my-assets");
        }}
        className="
          text-gray-700
          hover:text-blue-600
          transition-colors
          duration-200
          font-medium
        "
      >
        MY 자산
      </button>

      {/* =========================
          드롭다운
      ========================= */}

      {isOpen && (

        <div
          className="
            absolute
            top-full
            mt-3
            bg-white
            rounded-3xl
            shadow-2xl
            border
            border-gray-200
            p-8
            z-50
          "
          style={{
            minWidth: "780px",
            left: "-190px",
          }}
        >

          <div className="flex gap-8">

            {/* =========================
                로보어드바이저
            ========================= */}

            <div className="flex-1">

              <div className="
                text-sm
                font-bold
                text-gray-500
                mb-5
              ">
                [로보어드바이저]
              </div>

              {/* 로보어드바이저 */}
              <button
                type="button"
                onClick={(event) =>
                  handlePageMove(
                    event,
                    "my-robo"
                  )
                }
                className="
                  block
                  w-full
                  text-left
                  px-4
                  py-3
                  text-lg
                  text-gray-700
                  hover:bg-gray-100
                  rounded-2xl
                  transition-all
                  duration-200
                "
              >
                로보어드바이저
              </button>

              {/* 자산 시뮬레이션 */}
              <button
                type="button"
                onClick={(event) =>
                  handlePageMove(
                    event,
                    "asset-simulation"
                  )
                }
                className="
                  block
                  w-full
                  text-left
                  px-4
                  py-3
                  text-lg
                  text-gray-700
                  hover:bg-blue-50
                  hover:text-blue-600
                  rounded-2xl
                  transition-all
                  duration-200
                  mt-2
                "
              >
                자산 시뮬레이션
              </button>

            </div>

            {/* 구분선 */}
            <div className="w-px bg-gray-200" />

            {/* =========================
                자산
            ========================= */}

            <div className="flex-1">

              <div className="
                text-sm
                font-bold
                text-gray-500
                mb-5
              ">
                [자산]
              </div>

              {/* 맞춤 투자 제안 */}
              <button
                type="button"
                onClick={(event) =>
                  handlePageMove(
                    event,
                    "asset-summary"
                  )
                }
                className="
                  block
                  w-full
                  text-left
                  px-4
                  py-3
                  text-lg
                  text-gray-700
                  hover:bg-gray-100
                  rounded-2xl
                  transition-all
                  duration-200
                "
              >
                맞춤 투자 제안
              </button>

              {/* 자산 분배 */}
              <button
                type="button"
                onClick={(event) =>
                  handlePageMove(
                    event,
                    "asset-allocation"
                  )
                }
                className="
                  block
                  w-full
                  text-left
                  px-4
                  py-3
                  text-lg
                  text-gray-700
                  hover:bg-gray-100
                  rounded-2xl
                  transition-all
                  duration-200
                  mt-2
                "
              >
                자산 분배
              </button>

            </div>

            {/* 구분선 */}
            <div className="w-px bg-gray-200" />

            {/* =========================
                투자
            ========================= */}

            <div className="flex-1">

              <div className="
                text-sm
                font-bold
                text-gray-500
                mb-5
              ">
                [투자]
              </div>

              {/* 보유 종목 */}
              <button
                type="button"
                onClick={(event) =>
                  handlePageMove(
                    event,
                    "holdings"
                  )
                }
                className="
                  block
                  w-full
                  text-left
                  px-4
                  py-3
                  text-lg
                  text-gray-700
                  hover:bg-gray-100
                  rounded-2xl
                  transition-all
                  duration-200
                "
              >
                보유 종목
              </button>

              {/* 수익률 */}
              <button
                type="button"
                onClick={(event) =>
                  handlePageMove(
                    event,
                    "returns"
                  )
                }
                className="
                  block
                  w-full
                  text-left
                  px-4
                  py-3
                  text-lg
                  text-gray-700
                  hover:bg-gray-100
                  rounded-2xl
                  transition-all
                  duration-200
                  mt-2
                "
              >
                수익률
              </button>

              {/* 즐겨찾기 종목 */}
              <button
                type="button"
                onClick={(event) =>
                  handlePageMove(
                    event,
                    "favorites"
                  )
                }
                className="
                  block
                  w-full
                  text-left
                  px-4
                  py-3
                  text-lg
                  text-gray-700
                  hover:bg-gray-100
                  rounded-2xl
                  transition-all
                  duration-200
                  mt-2
                "
              >
                즐겨찾기 종목
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}