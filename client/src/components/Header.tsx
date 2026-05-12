import { Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import logoImage from "../imports/moneymate-logo.png";
import { MyAssetsDropdown } from "./MyAssetsDropdown";
import { useAuth } from "../context/AuthContext";
import { useDropdown } from "../context/DropdownContext";

type Page = "home" | "login" | "dashboard" | "my-assets" | "portfolio" | "investment-info" | "support" |
  "account-management" | "settings" | "my-robo" | "analysis" | "asset-summary" | "asset-allocation" |
  "holdings" | "returns" | "favorites" | "notifications" | "notification-settings" |
  "signup-step1" | "signup-step2" | "find-id" | "find-password" | "inquiry-list" | "customer-inquiry" | "customer-inquiry-form" | "inquiry-confirmation" |
  "notice-list" | "notice-detail";

interface HeaderProps {
  onNavigate?: (page: Page) => void;
}

export function Header({ onNavigate = () => {} }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { toggleDropdown, isDropdownOpen, closeDropdown } = useDropdown();
  const customerCenterRef = useRef<HTMLDivElement>(null);

  const showCustomerCenter = isDropdownOpen("customer-center");

  // Get user name from localStorage or use default
  const getUserName = () => {
    const users = JSON.parse(localStorage.getItem("users") || '[]');
    if (users.length > 0 && users[0].name) {
      return users[0].name;
    }
    return "사용자";
  };

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (customerCenterRef.current && !customerCenterRef.current.contains(event.target as Node)) {
        if (showCustomerCenter) {
          closeDropdown();
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCustomerCenter, closeDropdown]);

  // 로그아웃 핸들러 - 홈으로 이동 + 새로고침
  const handleLogout = () => {
    logout();
    onNavigate("home");
    window.location.reload();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-3">
            {/* MoneyMate Logo - Text Version */}
            <button onClick={() => onNavigate("home")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: "transparent"
                }}
              >
                <img
                  src={logoImage}
                  alt="MoneyMate Logo"
                  className="w-14 h-14 object-contain"
                />
              </div>
              {/* Brand Name */}
              <div>
                <div className="text-xl font-bold" style={{ color: "#3B82F6" }}>
                  MoneyMate
                </div>
                <div className="text-xs font-medium" style={{ color: "#00C896" }}>
                  머니메이트
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center" style={{ gap: "24px" }}>
            <MyAssetsDropdown onNavigate={onNavigate} />
            <button onClick={() => { onNavigate("portfolio"); closeDropdown(); }} className="hover:transition-colors" style={{ color: "#64748B" }}>포트폴리오</button>
            <button onClick={() => { onNavigate("investment-info"); closeDropdown(); }} className="hover:transition-colors" style={{ color: "#64748B" }}>투자정보</button>
            <div className="relative" ref={customerCenterRef}>
              <button
                onClick={() => toggleDropdown("customer-center")}
                className="hover:transition-colors flex items-center gap-1"
                style={{ color: showCustomerCenter ? "#3B82F6" : "#64748B", fontWeight: showCustomerCenter ? "600" : "400" }}
              >
                고객센터
              </button>

              {/* Customer Center Dropdown */}
              {showCustomerCenter && (
                <div
                  className="absolute top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-6 z-50"
                  style={{ minWidth: "600px", left: "-200px" }}
                >
                  <div className="flex gap-6">
                    {/* 문의 */}
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-500 mb-2">[문의]</div>
                      <button
                        onClick={() => {
                          closeDropdown();
                          onNavigate("inquiry-list");
                        }}
                        className="block w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        문의내역
                      </button>
                      <button
                        onClick={() => {
                          closeDropdown();
                          onNavigate("customer-inquiry-form");
                        }}
                        className="block w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        고객문의
                      </button>
                    </div>

                    <div className="border-l border-gray-200"></div>

                    {/* 정보 */}
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-500 mb-2">[정보]</div>
                      <button
                        onClick={() => {
                          closeDropdown();
                          onNavigate("support");
                        }}
                        className="block w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        자주묻는 질문
                      </button>
                      <button
                        onClick={() => {
                          closeDropdown();
                          onNavigate("notice-list");
                        }}
                        className="block w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        공지사항
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {isAuthenticated && (
              <button onClick={() => { onNavigate("settings"); closeDropdown(); }} className="hover:transition-colors" style={{ color: "#64748B" }}>설정</button>
            )}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center" style={{ gap: "24px" }}>
            {isAuthenticated ? (
              <>
                {/* User_Profile_Identity_Zone */}
                <div className="flex items-center" style={{ gap: "16px" }}>
                  <button
                    onClick={() => onNavigate("account-management")}
                    className="hover:opacity-80 transition-opacity"
                    style={{ color: "#1E40AF", fontWeight: "500" }}
                  >
                    마이페이지
                  </button>
                  <span className="text-gray-900" style={{ fontWeight: "500" }}>{getUserName()}님</span>
                  <div className="rounded-full flex items-center justify-center" style={{ width: "40px", height: "40px", backgroundColor: "#DBEAFE" }}>
                    <User className="w-5 h-5" style={{ color: "#3B82F6" }} />
                  </div>
                </div>
                {/* Logout Button - Separate */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg border transition-colors hover:bg-gray-50"
                  style={{
                    borderColor: "#E2E8F0",
                    color: "#64748B",
                  }}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigate("login")}
                style={{
                  backgroundColor: "#3B82F6",
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
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-4">
              <button onClick={() => onNavigate("my-assets")} className="text-gray-700 hover:text-blue-600 transition-colors text-left">MY 자산</button>
              <button onClick={() => onNavigate("portfolio")} className="text-gray-700 hover:text-blue-600 transition-colors text-left">포트폴리오</button>
              <button onClick={() => onNavigate("investment-info")} className="hover:text-blue-600 transition-colors text-left" style={{ color: "#64748B" }}>투자정보</button>
              <button onClick={() => onNavigate("support")} className="hover:text-blue-600 transition-colors text-left" style={{ color: "#64748B" }}>고객센터</button>
              {isAuthenticated && (
                <button onClick={() => onNavigate("settings")} className="hover:text-blue-600 transition-colors text-left" style={{ color: "#64748B" }}>설정</button>
              )}
              {isAuthenticated ? (
                <div className="flex flex-col gap-4 pt-4 border-t border-gray-200 mt-4">
                  {/* User Profile Identity Zone - Mobile */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onNavigate("account-management")}
                      className="hover:opacity-80 transition-opacity"
                      style={{ color: "#1E40AF", fontWeight: "500" }}
                    >
                      마이페이지
                    </button>
                    <span className="text-gray-900" style={{ fontWeight: "500" }}>{getUserName()}님</span>
                    <div className="rounded-full flex items-center justify-center" style={{ width: "40px", height: "40px", backgroundColor: "#DBEAFE" }}>
                      <User className="w-5 h-5" style={{ color: "#3B82F6" }} />
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-50"
                    style={{
                      borderColor: "#E2E8F0",
                      color: "#64748B",
                      width: "fit-content",
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    <span>로그아웃</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onNavigate("login")}
                  style={{
                    backgroundColor: "#3B82F6",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    fontWeight: "500",
                    border: "none",
                    cursor: "pointer",
                    width: "fit-content",
                  }}
                >
                  로그인
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}