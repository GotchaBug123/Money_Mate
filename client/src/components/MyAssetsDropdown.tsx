import { useEffect, useRef } from "react";
import { useDropdown } from "../context/DropdownContext";

type Page = "home" | "login" | "dashboard" | "my-assets" | "portfolio" | "investment-info" | "support" |
  "account-management" | "settings" | "my-robo" | "analysis" | "asset-summary" | "asset-allocation" |
  "holdings" | "returns" | "favorites" | "notifications" | "notification-settings" |
  "signup-step1" | "signup-step2" | "find-id" | "find-password" | "inquiry-list" | "customer-inquiry" | "customer-inquiry-form" | "inquiry-confirmation";

interface MyAssetsDropdownProps {
  onNavigate: (page: Page) => void;
}

export function MyAssetsDropdown({ onNavigate }: MyAssetsDropdownProps) {
  const { toggleDropdown, isDropdownOpen, closeDropdown } = useDropdown();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isOpen = isDropdownOpen("my-assets");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) {
          closeDropdown();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => toggleDropdown("my-assets")}
        className="text-gray-700 hover:text-blue-600 transition-colors"
      >
        MY 자산
      </button>

      {isOpen && (
        <div
          className="absolute top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-6 z-50"
          style={{ minWidth: "600px", left: "-150px" }}
        >
          <div className="flex gap-6">
            {/* 로보어드바이저 */}
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-500 mb-2">[로보어드바이저]</div>
              <button
                onClick={() => {
                  closeDropdown();
                  onNavigate("my-robo");
                }}
                className="block w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                로보어드바이저
              </button>
            </div>

            <div className="border-l border-gray-200"></div>

            {/* 자산 */}
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-500 mb-2">[자산]</div>
              <button
                onClick={() => {
                  closeDropdown();
                  onNavigate("asset-summary");
                }}
                className="block w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                자산 요약
              </button>
              <button
                onClick={() => {
                  closeDropdown();
                  onNavigate("asset-allocation");
                }}
                className="block w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                자산 분배
              </button>
            </div>

            <div className="border-l border-gray-200"></div>

            {/* 투자 */}
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-500 mb-2">[투자]</div>
              <button
                onClick={() => {
                  closeDropdown();
                  onNavigate("holdings");
                }}
                className="block w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                보유 종목
              </button>
              <button
                onClick={() => {
                  closeDropdown();
                  onNavigate("returns");
                }}
                className="block w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                수익률
              </button>
              <button
                onClick={() => {
                  closeDropdown();
                  onNavigate("favorites");
                }}
                className="block w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
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
