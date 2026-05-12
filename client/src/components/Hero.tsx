import { Shield, Clock, Wrench, BarChart3, ShieldCheck, Settings } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import robotImage from "../imports/image-1.png";

interface HeroProps {
  onNavigate?: (page: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  return (
    <section id="home" className="bg-gradient-to-br from-blue-50 to-sky-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl text-gray-900 font-bold mb-6 leading-tight">
              나의 소비와 취향을 담은,<br />
              목표 달성형 스마트<br />
              <span style={{ color: "#1D6AE5" }}>
                로보어드바이저
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              지출 분석부터 재무제표 팩터 투자까지.<br />
              초보 투자자, 사회초년생, 바쁜 직장인을 위한<br />
              커스텀 포트폴리오 관리를 경험하세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* 메인 버튼 */}
              <button
                onClick={() => onNavigate?.("onboarding")}
                style={{
                  backgroundColor: "#1D6AE5",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontWeight: "500",
                  border: "none",
                  cursor: "pointer",
                }}
              >무료 진단 시작하기</button>

              {/* 보조 버튼 */}
              <button
                style={{
                  border: "1px solid #1D6AE5",
                  color: "#1D6AE5",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontWeight: "500",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                서비스 안내
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 border-t border-gray-200 pt-8">
              <div className="text-center">
                <ShieldCheck
                  style={{ color: "#00C896" }}
                  className="h-8 w-8 mx-auto mb-2"
                />
                <p className="text-sm font-medium text-gray-700">
                  개인 맞춤형<br />재무 진단
                </p>
              </div>

              <div className="text-center">
                <Clock
                  style={{ color: "#00C896" }}
                  className="h-8 w-8 mx-auto mb-2"
                />
                <p className="text-sm font-medium text-gray-700">
                  목표 달성<br />시뮬레이션
                </p>
              </div>

              <div className="text-center">
                <Settings
                  style={{ color: "#00C896" }}
                  className="h-8 w-8 mx-auto mb-2"
                />
                <p className="text-sm font-medium text-gray-700">
                  관심 섹터 기반<br />종목 추천
                </p>
              </div>
            </div>
          </div>

          {/* Robot Character Container with Floating Icons */}
          <div className="lg:text-center relative">
            {/* Seamlessly Integrated Robot and Icon Cluster */}
            <div 
              className="relative flex items-center justify-center"
              style={{
                minHeight: "600px",
                position: "relative"
              }}
            >
              {/* Central Robot Image - Borderless, floating naturally on gradient */}
              <div 
                className="relative z-10 flex items-center justify-center" 
                style={{ 
                  maxWidth: "420px",
                  filter: "drop-shadow(0 12px 32px rgba(29, 106, 229, 0.18)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.06))",
                  WebkitFilter: "drop-shadow(0 12px 32px rgba(29, 106, 229, 0.18)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.06))"
                }}
              >
                
              </div>

              {/* Floating Finance Icon 1: Shield - Top Left - Integrated Design */}
              <div 
                className="absolute"
                style={{ 
                  top: "45px",
                  left: "25px",
                  animationName: "float",
                  animationDuration: "3.2s",
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                  animationDelay: "0s",
                  filter: "drop-shadow(0 6px 18px rgba(29, 106, 229, 0.14)) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.04))",
                  WebkitFilter: "drop-shadow(0 6px 18px rgba(29, 106, 229, 0.14)) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.04))"
                }}
              >
                <div 
                  className="rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.92)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    width: "68px",
                    height: "68px",
                    border: "1px solid rgba(255, 255, 255, 0.3)"
                  }}
                >
                  <ShieldCheck style={{ color: "#1D6AE5", width: "34px", height: "34px", strokeWidth: 2 }} />
                </div>
              </div>

              {/* Floating Finance Icon 2: Bar Chart - Top Right - Integrated Design */}
              <div 
                className="absolute"
                style={{ 
                  top: "70px",
                  right: "35px",
                  animationName: "float",
                  animationDuration: "3.5s",
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                  animationDelay: "0.8s",
                  filter: "drop-shadow(0 6px 18px rgba(0, 200, 150, 0.14)) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.04))",
                  WebkitFilter: "drop-shadow(0 6px 18px rgba(0, 200, 150, 0.14)) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.04))"
                }}
              >
                <div 
                  className="rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.92)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    width: "68px",
                    height: "68px",
                    border: "1px solid rgba(255, 255, 255, 0.3)"
                  }}
                >
                  <BarChart3 style={{ color: "#00C896", width: "34px", height: "34px", strokeWidth: 2 }} />
                </div>
              </div>

              {/* Floating Finance Icon 3: Settings Gear - Bottom Left - Integrated Design */}
              <div 
                className="absolute"
                style={{ 
                  bottom: "90px",
                  left: "50px",
                  animationName: "float",
                  animationDuration: "3s",
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                  animationDelay: "1.5s",
                  filter: "drop-shadow(0 6px 18px rgba(29, 106, 229, 0.12)) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.04))",
                  WebkitFilter: "drop-shadow(0 6px 18px rgba(29, 106, 229, 0.12)) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.04))"
                }}
              >
                <div 
                  className="rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.92)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    width: "64px",
                    height: "64px",
                    border: "1px solid rgba(255, 255, 255, 0.3)"
                  }}
                >
                  <Settings style={{ color: "#1D6AE5", width: "32px", height: "32px", strokeWidth: 2 }} />
                </div>
              </div>

              {/* Ambient light orbs for professional depth - very subtle */}
              <div 
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: "180px",
                  height: "180px",
                  background: "radial-gradient(circle at center, rgba(29, 106, 229, 0.05) 0%, transparent 65%)",
                  bottom: "50px",
                  right: "70px",
                  zIndex: 0,
                  filter: "blur(30px)"
                }}
              />

              <div 
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: "160px",
                  height: "160px",
                  background: "radial-gradient(circle at center, rgba(0, 200, 150, 0.04) 0%, transparent 65%)",
                  top: "30px",
                  left: "50px",
                  zIndex: 0,
                  filter: "blur(30px)"
                }}
              />

              {/* Subtle circular accent behind robot for depth */}
              
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Animation Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes robotFloat {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-20px);
          }
        }
      `}</style>
    </section>
  );
}