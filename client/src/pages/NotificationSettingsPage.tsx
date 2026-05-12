import { useState } from "react";
import { Mail, Bell, TrendingUp, Target, Gift } from "lucide-react";

export function NotificationSettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState({
    goalAchievement: true,
    stockRecommendation: true,
    marketAlert: false,
    marketing: false
  });

  const [pushNotifications, setPushNotifications] = useState({
    goalAchievement: true,
    stockRecommendation: true,
    marketAlert: true,
    marketing: false
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">알림 설정</h1>

        {/* 이메일 알림 설정 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">이메일 알림</h3>
          </div>

          <div className="space-y-4">
            {/* 목표 달성 알림 */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">목표 달성 알림</div>
                  <div className="text-sm text-gray-600">ETF 목표 달성 확률 변동 시 이메일로 알림을 받습니다</div>
                </div>
              </div>
              <button
                onClick={() => setEmailNotifications(prev => ({ ...prev, goalAchievement: !prev.goalAchievement }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications.goalAchievement ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications.goalAchievement ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* 추천 종목 알림 */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">추천 종목 알림</div>
                  <div className="text-sm text-gray-600">추천 종목 재무 지표 업데이트 시 이메일로 알림을 받습니다</div>
                </div>
              </div>
              <button
                onClick={() => setEmailNotifications(prev => ({ ...prev, stockRecommendation: !prev.stockRecommendation }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications.stockRecommendation ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications.stockRecommendation ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* 시장 변동 알림 */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-red-600" />
                <div>
                  <div className="font-medium text-gray-900">시장 변동 알림</div>
                  <div className="text-sm text-gray-600">급격한 시장 변동 시 이메일로 알림을 받습니다</div>
                </div>
              </div>
              <button
                onClick={() => setEmailNotifications(prev => ({ ...prev, marketAlert: !prev.marketAlert }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications.marketAlert ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications.marketAlert ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* 마케팅 알림 */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900">마케팅 알림</div>
                  <div className="text-sm text-gray-600">이벤트 및 프로모션 정보를 이메일로 받습니다</div>
                </div>
              </div>
              <button
                onClick={() => setEmailNotifications(prev => ({ ...prev, marketing: !prev.marketing }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications.marketing ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications.marketing ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 푸시 알림 설정 (웹) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">웹 푸시 알림</h3>
          </div>

          <div className="space-y-4">
            {/* 목표 달성 알림 */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">목표 달성 알림</div>
                  <div className="text-sm text-gray-600">ETF 목표 달성 확률 변동 시 브라우저 알림을 받습니다</div>
                </div>
              </div>
              <button
                onClick={() => setPushNotifications(prev => ({ ...prev, goalAchievement: !prev.goalAchievement }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  pushNotifications.goalAchievement ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    pushNotifications.goalAchievement ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* 추천 종목 알림 */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">추천 종목 알림</div>
                  <div className="text-sm text-gray-600">추천 종목 재무 지표 업데이트 시 브라우저 알림을 받습니다</div>
                </div>
              </div>
              <button
                onClick={() => setPushNotifications(prev => ({ ...prev, stockRecommendation: !prev.stockRecommendation }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  pushNotifications.stockRecommendation ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    pushNotifications.stockRecommendation ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* 시장 변동 알림 */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-red-600" />
                <div>
                  <div className="font-medium text-gray-900">시장 변동 알림</div>
                  <div className="text-sm text-gray-600">급격한 시장 변동 시 브라우저 알림을 받습니다</div>
                </div>
              </div>
              <button
                onClick={() => setPushNotifications(prev => ({ ...prev, marketAlert: !prev.marketAlert }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  pushNotifications.marketAlert ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    pushNotifications.marketAlert ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* 마케팅 알림 */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900">마케팅 알림</div>
                  <div className="text-sm text-gray-600">이벤트 및 프로모션 정보를 브라우저 알림으로 받습니다</div>
                </div>
              </div>
              <button
                onClick={() => setPushNotifications(prev => ({ ...prev, marketing: !prev.marketing }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  pushNotifications.marketing ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    pushNotifications.marketing ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end">
          <button className="px-8 py-3 rounded-lg font-medium text-white transition-colors" style={{ backgroundColor: "#1D6AE5" }}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
