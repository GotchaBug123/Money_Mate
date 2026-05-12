import { useState } from "react";
import { X } from "lucide-react";

export function SettingsPage() {
  const [notifications, setNotifications] = useState({
    goalProbability: true,
    stockIndicators: true,
    marketing: false
  });

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsType, setTermsType] = useState<'terms' | 'privacy' | 'investment' | 'electronic'>('terms');

  const appVersion = "1.0.0";

  const handleShowTerms = (type: 'terms' | 'privacy' | 'investment' | 'electronic') => {
    setTermsType(type);
    setShowTermsModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">설정</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          {/* 알림 설정 */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">알림 설정</h3>

            <div className="space-y-4">
              {/* 목표 달성 확률 변동 알림 */}
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">목표 달성 확률 변동 알림</div>
                  <div className="text-sm text-gray-600">목표 달성 확률이 변동될 때 알림을 받습니다</div>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, goalProbability: !prev.goalProbability }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.goalProbability ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.goalProbability ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* 추천 종목 재무 지표 업데이트 알림 */}
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">추천 종목 재무 지표 업데이트 알림</div>
                  <div className="text-sm text-gray-600">추천 종목의 재무 지표가 업데이트될 때 알림을 받습니다</div>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, stockIndicators: !prev.stockIndicators }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.stockIndicators ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.stockIndicators ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* 마케팅 및 혜택 알림 */}
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">마케팅 및 혜택 알림</div>
                  <div className="text-sm text-gray-600">이벤트, 프로모션 등 마케팅 정보를 받습니다</div>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, marketing: !prev.marketing }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.marketing ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.marketing ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 약관 */}
          <div className="mb-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">약관 및 정책</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleShowTerms('terms')}
                className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-900">이용약관</span>
              </button>
              <button
                onClick={() => handleShowTerms('privacy')}
                className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-900">개인정보 처리방침</span>
              </button>
              <button
                onClick={() => handleShowTerms('investment')}
                className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-900">투자유의사항</span>
              </button>
              <button
                onClick={() => handleShowTerms('electronic')}
                className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-900">전자금융거래약관</span>
              </button>
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

      {/* 약관 모달 */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] shadow-2xl border border-gray-100 flex flex-col">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {termsType === 'terms' && '서비스 이용약관'}
                {termsType === 'privacy' && '개인정보 처리방침'}
                {termsType === 'investment' && '투자유의사항'}
                {termsType === 'electronic' && '전자금융거래약관'}
              </h2>
              <button onClick={() => setShowTermsModal(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* 내용 */}
            <div className="overflow-y-auto p-6 flex-1">
              {termsType === 'terms' && (
                <div className="space-y-6" style={{ color: "#000" }}>
                  <section>
                    <h3 className="font-bold text-lg mb-3">제1조 (목적)</h3>
                    <div className="space-y-2 text-sm">
                      <p>본 약관은 MoneyMate(이하 "회사")가 제공하는 로보어드바이저 투자자문 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">제2조 (정의)</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원을 말합니다.</p>
                      <p>2. "회원"이란 회사와 서비스 이용계약을 체결하고 계정을 부여받은 자를 말합니다.</p>
                      <p>3. "로보어드바이저"란 인공지능 알고리즘을 활용하여 투자 포트폴리오 구성 및 자문 서비스를 제공하는 시스템을 말합니다.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">제3조 (서비스 이용계약의 성립)</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. 서비스 이용계약은 이용 희망자가 본 약관에 동의하고 회원가입 신청을 완료하며, 회사가 이를 승낙함으로써 성립됩니다.</p>
                      <p>2. 회사는 다음 각 호에 해당하는 경우 승낙을 거부할 수 있습니다:</p>
                      <p>   가. 타인의 명의를 도용하여 신청한 경우</p>
                      <p>   나. 만 19세 미만인 경우</p>
                      <p>   다. 허위 정보를 기재하거나 본인인증을 완료하지 않은 경우</p>
                      <p>   라. 이전에 회원 자격을 상실한 경우 (단, 재가입 승인을 받은 경우 제외)</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">제4조 (서비스의 내용)</h3>
                    <div className="space-y-2 text-sm">
                      <p>회사는 다음 각 호의 서비스를 제공합니다:</p>
                      <p>1. AI 기반 투자성향 분석 및 맞춤형 포트폴리오 추천</p>
                      <p>2. 실시간 자산 현황 및 수익률 모니터링</p>
                      <p>3. 자동 리밸런싱 제안 서비스</p>
                      <p>4. 금융시장 분석 및 투자정보 제공</p>
                      <p>5. 기타 회사가 추가로 제공하는 금융 관련 서비스</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">제5조 (서비스 이용 제한)</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. 서비스는 연중무휴 1일 24시간 제공함을 원칙으로 합니다.</p>
                      <p>2. 다만, 다음 각 호의 경우 서비스 제공을 일시 중단할 수 있습니다:</p>
                      <p>   가. 시스템 점검, 보수, 교체 등이 필요한 경우</p>
                      <p>   나. 정전, 통신장애 등 불가항력적 사유가 발생한 경우</p>
                      <p>   다. 서비스 이용의 폭주 등으로 정상적인 서비스 제공이 어려운 경우</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">제6조 (회원의 의무)</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. 회원은 계정정보를 안전하게 관리할 책임이 있으며, 이를 제3자에게 양도, 대여할 수 없습니다.</p>
                      <p>2. 회원은 등록정보가 변경된 경우 즉시 수정하여야 합니다.</p>
                      <p>3. 회원은 관계법령 및 본 약관의 규정을 준수하여야 합니다.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">제7조 (회사의 의무)</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. 회사는 안정적인 서비스 제공을 위해 최선을 다합니다.</p>
                      <p>2. 회사는 회원의 개인정보를 보호하기 위해 개인정보처리방침을 수립하고 준수합니다.</p>
                      <p>3. 회사는 서비스와 관련한 회원의 불만사항을 신속하게 처리합니다.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">제8조 (계약 해지 및 서비스 이용 제한)</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. 회원은 언제든지 서비스 이용계약을 해지(탈퇴)할 수 있습니다.</p>
                      <p>2. 회사는 회원이 다음 각 호에 해당하는 경우 사전 통지 후 이용계약을 해지하거나 서비스 이용을 제한할 수 있습니다:</p>
                      <p>   가. 타인의 명의나 정보를 도용한 경우</p>
                      <p>   나. 서비스 운영을 고의로 방해한 경우</p>
                      <p>   다. 관계법령을 위반한 경우</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">제9조 (면책 조항)</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. 회사는 천재지변, 전쟁, 시스템 장애 등 불가항력적 사유로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.</p>
                      <p>2. 회사는 회원의 투자 판단 및 그 결과에 대해 책임을 지지 않습니다.</p>
                      <p>3. 회사가 제공하는 정보는 참고용이며, 투자 최종 결정은 회원 본인의 책임입니다.</p>
                    </div>
                  </section>

                  <p className="text-xs text-gray-600 mt-6">시행일: 2026년 1월 1일</p>
                </div>
              )}

              {termsType === 'privacy' && (
                <div className="space-y-6" style={{ color: "#000" }}>
                  <section>
                    <h3 className="font-bold text-lg mb-3">1. 수집하는 개인정보 항목</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>필수 항목:</strong></p>
                      <p>- 성명, 생년월일, 성별, 이메일 주소</p>
                      <p>- 휴대전화번호, 본인인증정보(CI/DI)</p>
                      <p>- 투자계좌번호, 은행명, 예금주명</p>

                      <p className="mt-4"><strong>선택 항목:</strong></p>
                      <p>- 직업, 연소득, 투자경험</p>
                      <p>- 투자성향 분석 결과</p>
                      <p>- 관심 종목 및 선호 투자 전략</p>

                      <p className="mt-4"><strong>자동 수집 항목:</strong></p>
                      <p>- 접속 로그, IP 주소, 쿠키, 방문 일시</p>
                      <p>- 서비스 이용 기록, 불량 이용 기록</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">2. 개인정보 이용 목적</h3>
                    <div className="space-y-2 text-sm">
                      <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다:</p>
                      <p>1. 회원 가입, 본인 확인, 회원 식별</p>
                      <p>2. 투자자문 서비스 제공, 포트폴리오 관리</p>
                      <p>3. 입출금 처리, 거래 내역 관리</p>
                      <p>4. 고객 문의 응대, 공지사항 전달</p>
                      <p>5. 신규 서비스 개발 및 맞춤형 서비스 제공</p>
                      <p>6. 법령 및 약관 위반 회원에 대한 이용 제한 조치</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">3. 개인정보 보유 및 이용 기간</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. 회원 탈퇴 시까지 보유 및 이용</p>
                      <p>2. 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관:</p>
                      <p>   - 계약 또는 청약철회 등 기록: 5년 (전자상거래법)</p>
                      <p>   - 대금결제 및 재화 공급 기록: 5년 (전자상거래법)</p>
                      <p>   - 소비자 불만 또는 분쟁처리 기록: 3년 (전자상거래법)</p>
                      <p>   - 금융거래 관련 기록: 5년 (금융실명법)</p>
                      <p>   - 접속 로그 기록: 3개월 (통신비밀보호법)</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">4. 개인정보 파기 절차 및 방법</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. 파기 절차: 보유기간이 경과하거나 처리 목적이 달성된 개인정보는 지체없이 파기합니다.</p>
                      <p>2. 파기 방법:</p>
                      <p>   - 전자적 파일: 복원 불가능한 방법으로 영구 삭제</p>
                      <p>   - 종이 문서: 분쇄 또는 소각</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">5. 개인정보 제3자 제공</h3>
                    <div className="space-y-2 text-sm">
                      <p>회사는 원칙적으로 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.</p>
                      <p>다만, 다음의 경우에는 예외로 합니다:</p>
                      <p>1. 법령에 의해 요구되는 경우</p>
                      <p>2. 수사 목적으로 법령에 정해진 절차에 따라 요구받은 경우</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">6. 개인정보 처리 위탁</h3>
                    <div className="space-y-2 text-sm">
                      <p>회사는 서비스 제공을 위해 아래와 같이 개인정보 처리 업무를 위탁하고 있습니다:</p>
                      <table className="w-full border-collapse border border-gray-300 mt-2">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2">수탁업체</th>
                            <th className="border border-gray-300 p-2">위탁 업무</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 p-2">클라우드 서비스 제공업체</td>
                            <td className="border border-gray-300 p-2">시스템 운영 및 데이터 보관</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2">본인인증기관</td>
                            <td className="border border-gray-300 p-2">본인확인 서비스 제공</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">7. 정보주체의 권리</h3>
                    <div className="space-y-2 text-sm">
                      <p>이용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다:</p>
                      <p>1. 개인정보 열람 요구</p>
                      <p>2. 개인정보 정정·삭제 요구</p>
                      <p>3. 개인정보 처리정지 요구</p>
                      <p>4. 개인정보 제공 동의 철회</p>
                      <p>요청 방법: 고객센터(1588-0000) 또는 이메일(privacy@moneymate.kr)</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">8. 쿠키 및 로그데이터 사용</h3>
                    <div className="space-y-2 text-sm">
                      <p>회사는 서비스 개선 및 맞춤형 정보 제공을 위해 쿠키를 사용합니다.</p>
                      <p>이용자는 웹브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 일부 서비스 이용에 제한이 있을 수 있습니다.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">9. 개인정보 보호책임자</h3>
                    <div className="space-y-2 text-sm">
                      <p>성명: 홍길동</p>
                      <p>직책: 개인정보보호책임자</p>
                      <p>이메일: privacy@moneymate.kr</p>
                      <p>전화: 1588-0000</p>
                    </div>
                  </section>

                  <p className="text-xs text-gray-600 mt-6">시행일: 2026년 1월 1일</p>
                </div>
              )}

              {termsType === 'investment' && (
                <div className="space-y-6 text-gray-800">
                  <div className="bg-red-50 border border-red-300 rounded p-4 mb-4">
                    <p className="text-red-700 font-bold">⚠️ 투자 위험 고지</p>
                    <p className="text-red-600 text-sm mt-2">투자는 원금 손실의 위험이 있으며, 과거 수익률이 미래 수익을 보장하지 않습니다.</p>
                  </div>

                  <section>
                    <h3 className="font-bold text-lg mb-3">1. 투자원금 손실 위험</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. 본 서비스를 통한 투자는 예금자보호법에 따라 보호되지 않으며, 투자 원금의 전부 또는 일부에 대한 손실 위험이 존재합니다.</p>
                      <p>2. 투자수익률은 시장 상황, 경제 환경, 기업 실적 등에 따라 변동될 수 있으며, 마이너스 수익률을 기록할 수 있습니다.</p>
                      <p>3. 과거의 투자실적이나 수익률이 미래의 투자성과를 보장하지 않습니다.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">2. 시장 위험</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>주식시장 위험:</strong> 경기변동, 정치적 불안정, 기업실적 악화 등으로 인해 주가가 하락하여 손실이 발생할 수 있습니다.</p>
                      <p><strong>금리 위험:</strong> 시장금리 변동에 따라 채권 가격이 변동될 수 있으며, 금리 상승 시 채권 가격이 하락합니다.</p>
                      <p><strong>환율 위험:</strong> 해외 투자자산의 경우 환율 변동에 따른 손실이 발생할 수 있습니다.</p>
                      <p><strong>유동성 위험:</strong> 시장 상황에 따라 원하는 시점에 매도가 어렵거나 불리한 가격에 거래될 수 있습니다.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">3. 로보어드바이저 서비스의 특성</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. 본 서비스는 알고리즘 기반 자동화 투자자문으로, 급격한 시장 변동 상황에 즉각 대응하지 못할 수 있습니다.</p>
                      <p>2. 투자 알고리즘은 과거 데이터를 기반으로 하므로, 미래 시장 상황을 정확히 예측하지 못할 수 있습니다.</p>
                      <p>3. 시스템 오류, 통신 장애 등 기술적 문제로 인한 서비스 중단 가능성이 있습니다.</p>
                      <p>4. AI가 제공하는 포트폴리오 추천은 참고용이며, 최종 투자 결정은 투자자 본인의 판단과 책임 하에 이루어져야 합니다.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">4. 투자자 유의사항</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>투자 전 충분한 검토:</strong> 본인의 재무상태, 투자목적, 위험감수능력을 고려하여 투자하시기 바랍니다.</p>
                      <p><strong>분산투자 원칙:</strong> 특정 자산이나 종목에 집중 투자하지 말고 여러 자산에 분산 투자하십시오.</p>
                      <p><strong>장기투자 관점:</strong> 단기 수익에 집착하지 말고 장기적 관점에서 투자하십시오.</p>
                      <p><strong>정기적 포트폴리오 점검:</strong> 시장 상황과 본인의 재무 상태 변화에 따라 포트폴리오를 정기적으로 점검하고 조정하십시오.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">5. 수수료 및 비용</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. 서비스 이용 시 투자자문 수수료, 거래 수수료, 관리 보수 등이 부과될 수 있습니다.</p>
                      <p>2. 수수료 및 비용은 투자 수익률에 직접적인 영향을 미칩니다.</p>
                      <p>3. 자세한 수수료 안내는 서비스 화면에서 확인하시기 바랍니다.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">6. 세금 관련 유의사항</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. 투자 수익에 대해 배당소득세, 양도소득세 등이 부과될 수 있습니다.</p>
                      <p>2. 세법 개정에 따라 세금 부담이 변경될 수 있습니다.</p>
                      <p>3. 세금 관련 사항은 세무 전문가와 상담하시기 바랍니다.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">7. 투자 판단 책임</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. 회사가 제공하는 정보 및 추천은 투자 판단의 참고자료일 뿐이며, 최종 투자 결정 및 그 결과에 대한 책임은 투자자 본인에게 있습니다.</p>
                      <p>2. 회사는 투자 손실에 대해 책임을 지지 않습니다.</p>
                    </div>
                  </section>

                  <div className="bg-yellow-50 border border-yellow-300 rounded p-4 mt-4">
                    <p className="text-yellow-800 font-bold">📌 투자자 확인사항</p>
                    <p className="text-yellow-700 text-sm mt-2">본 투자유의사항을 충분히 숙지하였으며, 투자에 따른 위험을 이해하고 투자 결정에 대한 책임은 본인에게 있음을 확인합니다.</p>
                  </div>

                  <p className="text-xs text-gray-600 mt-6">작성일: 2026년 1월 1일</p>
                </div>
              )}

              {termsType === 'electronic' && (
                <div className="space-y-6 text-gray-800">
                  <section>
                    <h3 className="font-bold text-lg mb-3">제1조 (목적)</h3>
                    <div className="space-y-2 text-sm">
                      <p>이 약관은 MoneyMate(이하 "회사")가 제공하는 전자금융거래 서비스를 이용함에 있어 회사와 이용자 간의 권리·의무 및 책임사항, 기타 필요한 사항을 정함을 목적으로 합니다.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">제2조 (용어의 정의)</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. "전자금융거래"란 회사가 전자적 장치를 통하여 제공하는 금융상품 및 서비스를 이용자가 전자적 장치를 통하여 이용하는 거래를 말합니다.</p>
                      <p>2. "접근매체"란 전자금융거래에 있어서 거래지시를 하거나 이용자 및 거래내용의 진실성과 정확성을 확보하기 위하여 사용되는 수단 또는 정보로서 이용자번호, 비밀번호, 생체정보 등을 말합니다.</p>
                      <p>3. "거래지시"란 이용자가 전자금융거래계약에 따라 회사에 대하여 전자금융거래의 처리를 지시하는 것을 말합니다.</p>
                      <p>4. "전자적 장치"란 전자금융거래정보를 전자적 방법으로 전송하거나 처리하는데 이용되는 장치로서 현금자동지급기, 자동입출금기, 지급용단말기, 컴퓨터, 전화기 등을 말합니다.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">제3조 (적용범위)</h3>
                    <div className="space-y-2 text-sm">
                      <p>회사와 이용자 간에 체결하는 전자금융거래에 관하여 다른 약정이 없는 한 이 약관이 적용됩니다.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">제4조 (접근매체의 관리)</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. 이용자는 접근매체를 제3자에게 대여하거나 사용을 위임하거나 양도 또는 담보 목적으로 제공할 수 없습니다.</p>
                      <p>2. 이용자는 접근매체의 도용이나 위조 또는 변조를 방지하기 위하여 충분한 주의를 기울여야 합니다.</p>
                      <p>3. 이용자는 접근매체의 분실, 도난, 유출 등을 인지한 경우 즉시 회사에 통지하여야 합니다.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">제5조 (계좌 등록 및 인증)</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. 이용자는 본인 명의의 계좌만 등록할 수 있으며, 타인 명의 계좌 등록 시 서비스 이용이 제한됩니다.</p>
                      <p>2. 계좌 등록 시 1원 인증 절차를 거쳐야 하며, 인증 완료 후 서비스 이용이 가능합니다.</p>
                      <p>3. 등록된 계좌 정보는 암호화되어 안전하게 보관됩니다.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">제6조 (거래내용의 확인)</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. 회사는 이용자가 전자금융거래의 내용을 추적, 검색하거나 그 내용에 오류가 있는 경우 정정할 수 있는 방법을 제공합니다.</p>
                      <p>2. 이용자는 거래내용을 수시로 확인하고 오류가 있는 경우 즉시 회사에 통지하여야 합니다.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">제7조 (오류의 정정)</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. 이용자는 전자금융거래에 오류가 있음을 안 때에는 회사에 대하여 그 정정을 요구할 수 있습니다.</p>
                      <p>2. 회사는 전항의 규정에 따른 오류의 정정요구를 받은 때에는 이를 즉시 조사하여 처리 결과를 이용자에게 알려 드립니다.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">제8조 (전자금융거래 기록의 보존)</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. 회사는 전자금융거래의 내용을 추적·검색하거나 그 내용에 오류가 있는 경우에 이를 확인하거나 정정할 수 있는 기록을 생성하여 보존합니다.</p>
                      <p>2. 제1항의 규정에 따라 회사가 보존하여야 하는 기록의 종류 및 보존기간은 5년으로 합니다.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">제9조 (거래 제한 사항)</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. 1일 이체 한도는 서비스 화면에서 확인할 수 있습니다.</p>
                      <p>2. 회사는 보안상의 이유로 거래 한도를 제한할 수 있습니다.</p>
                      <p>3. 이상 거래 탐지 시 거래가 일시 중단될 수 있으며, 본인 확인 후 해제됩니다.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">제10조 (시스템 장애 대응)</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. 시스템 장애 발생 시 회사는 즉시 복구 조치를 취합니다.</p>
                      <p>2. 장애로 인한 거래 지연 또는 불가 시 고객센터를 통해 안내합니다.</p>
                      <p>3. 회사의 귀책사유가 없는 장애에 대해서는 책임을 지지 않습니다.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">제11조 (손해배상 책임)</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. 회사는 접근매체의 위조나 변조로 발생한 사고로 인하여 이용자에게 손해가 발생한 경우 그 손해를 배상할 책임을 집니다.</p>
                      <p>2. 다만, 이용자가 접근매체를 제3자에게 대여하거나 그 사용을 위임한 경우, 이용자의 고의 또는 중대한 과실로 인한 경우에는 책임을 지지 않습니다.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-lg mb-3">제12조 (분쟁처리 및 분쟁조정)</h3>
                    <div className="space-y-2 text-sm">
                      <p>1. 이용자는 다음의 분쟁처리 담당자에 대하여 전자금융거래 서비스 이용과 관련한 의견 및 불만의 제기, 손해배상의 청구 등의 분쟁처리를 요구할 수 있습니다:</p>
                      <p>   - 담당자: 고객지원팀</p>
                      <p>   - 연락처: 1588-0000</p>
                      <p>   - 이메일: support@moneymate.kr</p>

                      <p className="mt-4">2. 이용자가 회사에 대하여 분쟁처리를 신청한 경우에는 회사는 15일 이내에 이에 대한 조사 또는 처리 결과를 이용자에게 안내합니다.</p>
                    </div>
                  </section>

                  <p className="text-xs text-gray-600 mt-6">시행일: 2026년 1월 1일</p>
                </div>
              )}
            </div>

            {/* 푸터 */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-full py-3 rounded-lg font-medium text-white transition-colors"
                style={{ backgroundColor: "#1D6AE5" }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
