import { Shield, X } from "lucide-react";
import { useState, useEffect } from "react";

export function AccountManagementPage() {
  // State management
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [accountNumber, setAccountNumber] = useState<string | null>(null);

  // 계좌 등록 플로우 상태
  const [selectedBank, setSelectedBank] = useState("");
  const [inputAccountNumber, setInputAccountNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  // 편집 가능한 사용자 정보
  const [editableName, setEditableName] = useState("");
  const [editableEmail, setEditableEmail] = useState("");

  // 비밀번호 인증
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordPurpose, setPasswordPurpose] = useState<'edit' | 'save' | 'detail'>('edit');

  // 로그인 사용자 정보 가져오기
  const getUserInfo = () => {
    const users = JSON.parse(localStorage.getItem("users") || '[]');
    if (users.length > 0) {
      return {
        name: users[0].name || "사용자",
        email: users[0].email || "user@example.com"
      };
    }
    return {
      name: "사용자",
      email: "user@example.com"
    };
  };

  const userInfo = getUserInfo();

  useEffect(() => {
    setEditableName(userInfo.name);
    setEditableEmail(userInfo.email);

    // localStorage에서 계좌 정보 불러오기
    const savedAccount = localStorage.getItem("userAccount");
    if (savedAccount) {
      setAccountNumber(savedAccount);
    }
  }, []);

  // 은행 목록
  const banks = [
    "KB국민은행", "신한은행", "우리은행", "하나은행", "NH농협은행",
    "IBK기업은행", "카카오뱅크", "토스뱅크", "케이뱅크"
  ];

  // 계좌 등록 핸들러
  const handleSend1Won = () => {
    if (!selectedBank || !inputAccountNumber) {
      alert("은행과 계좌번호를 입력해주세요.");
      return;
    }
    const code = Math.floor(100 + Math.random() * 900).toString();
    setGeneratedCode(code);
    setIsVerificationSent(true);
    alert(`1원이 송금되었습니다. 입금자명 끝 3자리: ${code}`);
  };

  const handleVerifyAccount = () => {
    if (verificationCode !== generatedCode) {
      alert("인증번호가 일치하지 않습니다.");
      return;
    }
    const maskedAccount = `${selectedBank} ${inputAccountNumber.slice(0, 4)}-**-****${inputAccountNumber.slice(-2)}`;
    setAccountNumber(maskedAccount);
    localStorage.setItem("userAccount", maskedAccount);
    setShowAccountModal(false);
    setSelectedBank("");
    setInputAccountNumber("");
    setVerificationCode("");
    setIsVerificationSent(false);
    alert("계좌가 성공적으로 등록되었습니다!");
  };

  // 비밀번호 인증
  const handlePasswordVerify = () => {
    const users = JSON.parse(localStorage.getItem("users") || '[]');
    let isValid = false;

    // 시범 계정 체크
    if (users.length > 0 && users[0].password === passwordInput) {
      isValid = true;
    } else if (passwordInput === "1234") {
      isValid = true;
    }

    if (isValid) {
      setPasswordError("");
      setShowPasswordModal(false);
      setPasswordInput("");

      if (passwordPurpose === 'edit') {
        setIsEditMode(true);
      } else if (passwordPurpose === 'save') {
        // 저장
        const users = JSON.parse(localStorage.getItem("users") || '[]');
        if (users.length > 0) {
          users[0].name = editableName;
          users[0].email = editableEmail;
          localStorage.setItem("users", JSON.stringify(users));
        }
        setIsEditMode(false);
        alert("개인정보가 수정되었습니다.");
        window.location.reload();
      } else if (passwordPurpose === 'detail') {
        // 상세 정보 보기
        setShowDetailModal(true);
      }
    } else {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    }
  };

  // 개인정보 수정 시작 (비밀번호 확인 필요)
  const handleStartEdit = () => {
    setPasswordPurpose('edit');
    setShowPasswordModal(true);
  };

  // 개인정보 수정 저장 (비밀번호 확인 필요)
  const handleSaveEdit = () => {
    setPasswordPurpose('save');
    setShowPasswordModal(true);
  };

  // 상세 정보 보기 (비밀번호 확인 필요)
  const handleShowDetail = () => {
    setPasswordPurpose('detail');
    setShowPasswordModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">계정관리</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          {/* 보안등급 */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">보안등급</div>
              <div className="text-xl font-bold text-gray-900">중급</div>
            </div>
          </div>

          {/* 등록된 계좌 정보 */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">등록된 계좌 정보</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              {accountNumber ? (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">계좌번호</div>
                    <div className="text-xl font-mono font-bold text-gray-900">{accountNumber}</div>
                  </div>
                  <button
                    onClick={() => setShowAccountModal(true)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    계좌번호 변경
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="text-gray-500 mb-6 text-center">
                    <p className="text-lg font-medium mb-2">등록된 계좌가 없습니다</p>
                    <p className="text-sm">본인 명의 계좌를 등록하고 인증을 완료해주세요</p>
                  </div>
                  <button
                    onClick={() => setShowAccountModal(true)}
                    className="px-8 py-3 rounded-lg font-medium text-white transition-colors"
                    style={{ backgroundColor: "#1D6AE5" }}
                  >
                    계좌 등록하기
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 개인 정보 */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">개인 정보</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div className="text-gray-600">이름</div>
                {isEditMode ? (
                  <input
                    type="text"
                    value={editableName}
                    onChange={(e) => setEditableName(e.target.value)}
                    className="font-medium text-gray-900 border border-gray-300 rounded px-3 py-1"
                  />
                ) : (
                  <div className="font-medium text-gray-900">{userInfo.name}</div>
                )}
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div className="text-gray-600">이메일</div>
                {isEditMode ? (
                  <input
                    type="email"
                    value={editableEmail}
                    onChange={(e) => setEditableEmail(e.target.value)}
                    className="font-medium text-gray-900 border border-gray-300 rounded px-3 py-1"
                  />
                ) : (
                  <div className="font-medium text-gray-900">{userInfo.email}</div>
                )}
              </div>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-4">
            {isEditMode ? (
              <>
                <button
                  onClick={() => setIsEditMode(false)}
                  className="flex-1 px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-6 py-3 rounded-lg font-medium text-white transition-colors"
                  style={{ backgroundColor: "#1D6AE5" }}
                >
                  저장
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleShowDetail}
                  className="flex-1 px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  상세 정보
                </button>
                <button
                  onClick={handleStartEdit}
                  className="flex-1 px-6 py-3 rounded-lg font-medium text-white transition-colors"
                  style={{ backgroundColor: "#1D6AE5" }}
                >
                  개인정보 수정하기
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 계좌 등록 모달 */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">계좌 등록</h2>
              <button onClick={() => setShowAccountModal(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* 은행 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">은행 선택</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">은행을 선택하세요</option>
                  {banks.map((bank) => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>

              {/* 계좌번호 입력 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">계좌번호</label>
                <input
                  type="text"
                  value={inputAccountNumber}
                  onChange={(e) => setInputAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="숫자만 입력"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  disabled={isVerificationSent}
                />
              </div>

              {/* 1원 송금 버튼 */}
              {!isVerificationSent && (
                <button
                  onClick={handleSend1Won}
                  className="w-full py-3 rounded-lg font-medium text-white"
                  style={{ backgroundColor: "#1D6AE5" }}
                >
                  1원 송금
                </button>
              )}

              {/* 인증번호 입력 */}
              {isVerificationSent && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      인증번호 (입금자명 끝 3자리)
                    </label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                      placeholder="3자리 숫자"
                      maxLength={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                  <button
                    onClick={handleVerifyAccount}
                    className="w-full py-3 rounded-lg font-medium text-white"
                    style={{ backgroundColor: "#1D6AE5" }}
                  >
                    인증 완료
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 상세 정보 모달 */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">상세 정보</h2>
              <button onClick={() => setShowDetailModal(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div className="text-gray-600">이름</div>
                <div className="font-medium text-gray-900">{userInfo.name}</div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div className="text-gray-600">이메일</div>
                <div className="font-medium text-gray-900">{userInfo.email}</div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div className="text-gray-600">가입일</div>
                <div className="font-medium text-gray-900">2026년 5월 4일</div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div className="text-gray-600">계좌 등록 여부</div>
                <div className="font-medium text-gray-900">{accountNumber ? "등록 완료" : "미등록"}</div>
              </div>
            </div>

            <button
              onClick={() => setShowDetailModal(false)}
              className="w-full mt-6 py-3 bg-gray-100 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 비밀번호 인증 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {passwordPurpose === 'edit' ? '본인 인증' : passwordPurpose === 'save' ? '변경 사항 저장' : '본인 인증'}
              </h2>
              <button onClick={() => {
                setShowPasswordModal(false);
                setPasswordInput("");
                setPasswordError("");
              }}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {passwordPurpose === 'edit'
                    ? '개인정보 수정을 위해 비밀번호를 입력해주세요'
                    : passwordPurpose === 'save'
                    ? '변경사항을 저장하기 위해 비밀번호를 입력해주세요'
                    : '상세 정보 확인을 위해 비밀번호를 입력해주세요'}
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePasswordVerify()}
                  placeholder="비밀번호"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-red-600 text-sm mt-2">{passwordError}</p>
                )}
              </div>

              <button
                onClick={handlePasswordVerify}
                className="w-full py-3 rounded-lg font-medium text-white"
                style={{ backgroundColor: "#1D6AE5" }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
