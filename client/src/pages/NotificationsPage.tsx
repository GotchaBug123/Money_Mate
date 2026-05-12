import { Bell, TrendingUp, AlertCircle, Info, CheckCircle } from "lucide-react";

export function NotificationsPage() {
  // Mock data
  const notifications = [
    {
      id: 1,
      type: "goal",
      icon: "target",
      title: "목표 달성 확률 변동",
      message: "ETF 목표 달성 확률이 75%에서 78%로 상승했습니다.",
      time: "10분 전",
      isRead: false
    },
    {
      id: 2,
      type: "stock",
      icon: "trending",
      title: "추천 종목 업데이트",
      message: "삼성전자의 재무 지표가 업데이트되었습니다. PER 12.5 → 11.8",
      time: "1시간 전",
      isRead: false
    },
    {
      id: 3,
      type: "alert",
      icon: "alert",
      title: "시장 변동성 알림",
      message: "KOSPI 지수가 전일 대비 2% 이상 하락했습니다.",
      time: "3시간 전",
      isRead: true
    },
    {
      id: 4,
      type: "marketing",
      icon: "info",
      title: "신규 이벤트 안내",
      message: "5월 신규 가입 고객 대상 수수료 할인 이벤트가 진행중입니다.",
      time: "1일 전",
      isRead: true
    },
    {
      id: 5,
      type: "goal",
      icon: "check",
      title: "자동 리밸런싱 완료",
      message: "포트폴리오 자동 리밸런싱이 완료되었습니다.",
      time: "2일 전",
      isRead: true
    },
    {
      id: 6,
      type: "stock",
      icon: "trending",
      title: "보유 종목 급등",
      message: "SK하이닉스가 전일 대비 5% 이상 상승했습니다.",
      time: "3일 전",
      isRead: true
    }
  ];

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "trending":
        return <TrendingUp className="w-5 h-5" />;
      case "alert":
        return <AlertCircle className="w-5 h-5" />;
      case "info":
        return <Info className="w-5 h-5" />;
      case "check":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "goal":
        return "text-blue-600 bg-blue-100";
      case "stock":
        return "text-green-600 bg-green-100";
      case "alert":
        return "text-red-600 bg-red-100";
      case "marketing":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">알림 목록</h1>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">
            모두 읽음으로 표시
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-5 border rounded-lg transition-all cursor-pointer ${
                  notification.isRead
                    ? "border-gray-200 hover:bg-gray-50"
                    : "border-blue-200 bg-blue-50 hover:bg-blue-100"
                }`}
              >
                <div className={`p-3 rounded-full ${getIconColor(notification.type)}`}>
                  {getIcon(notification.icon)}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-900">{notification.title}</h4>
                    <span className="text-sm text-gray-500 whitespace-nowrap ml-4">{notification.time}</span>
                  </div>
                  <p className="text-gray-700">{notification.message}</p>
                </div>

                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="mt-6 bg-gray-100 rounded-lg p-6">
          <p className="text-gray-700">
            <strong>💡 알림 설정:</strong> 알림 설정 페이지에서 받고 싶은 알림 유형을 선택할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
