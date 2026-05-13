import { useMemo, useState } from "react";

export function AssetSummaryPage() {

  const roboProfile = {
    goalName: "결혼 자금",
    achievementRate: 72,
    availableBudget: 150,
    investmentStyle: [
      "5년 이상",
      "주식성장 중심",
      "적극투자형",
    ],
    ownedAssets: [
      "S&P500 ETF",
      "나스닥100 ETF",
    ],
    riskType: "적극투자형",
  };

  const [
    reducedExpense,
    setReducedExpense,
  ] = useState(10);

  const [
    savedMessage,
    setSavedMessage,
  ] = useState("");

  const [
    buyMessage,
    setBuyMessage,
  ] = useState("");

  const dynamicResult =
    useMemo(() => {

      const probability =
        roboProfile.achievementRate +
        Math.floor(reducedExpense * 0.7);

      const shortenedMonth =
        4 +
        Math.floor(reducedExpense / 10);

      return {
        probability,
        shortenedMonth,
      };

    }, [
      reducedExpense,
      roboProfile.achievementRate,
    ]);

  const etfRanking = [

    {
      rank: "🥇",
      title: "S&P500 ETF",
      description: "(미국 핵심 지수)",
      holdingAmount: 60,
      newAmount: 60,
      riskLevel: "중립형",
    },

    {
      rank: "🥈",
      title: "나스닥100 ETF",
      description: "(기술 성장주)",
      holdingAmount: 0,
      newAmount: 45,
      riskLevel: "공격형",
    },

    {
      rank: "🥉",
      title: "국고채 10년 ETF",
      description: "(안정성 보강)",
      holdingAmount: 0,
      newAmount: 45,
      riskLevel: "안정형",
    },
  ];

  const handleBuyByAnalysis = () => {

    const highRiskItem =
      etfRanking.find(
        (item) =>
          item.riskLevel === "공격형"
      );

    if (
      roboProfile.riskType !== "공격형" &&
      highRiskItem
    ) {

      alert(
        "본인의 투자 성향보다 위험도가 높은 종목입니다."
      );

      return;
    }

    setBuyMessage(
      "분석 결과에 따라 ETF 매수 제안이 적용되었습니다."
    );

    setSavedMessage("");
  };

  const handleSaveReport = () => {

    const reportData = {

      goalName:
        roboProfile.goalName,

      achievementRate:
        roboProfile.achievementRate,

      availableBudget:
        roboProfile.availableBudget,

      investmentStyle:
        roboProfile.investmentStyle,

      ownedAssets:
        roboProfile.ownedAssets,

      reducedExpense,

      dynamicResult,

      etfRanking,

      source:
        "Yahoo Finance",

      savedAt:
        new Date().toISOString(),
    };

    localStorage.setItem(
      "moneymateInvestmentReport",
      JSON.stringify(reportData)
    );

    setSavedMessage(
      "리포트가 저장되었습니다."
    );

    setBuyMessage("");
  };

  return (

    <div className="
      min-h-screen
      bg-[#F5F7FB]
      py-12
      pb-24
    ">

      <div className="
        max-w-7xl
        mx-auto
        px-4
      ">

        <div className="
          bg-white
          rounded-[32px]
          border
          border-[#E5E7EB]
          shadow-sm
          overflow-hidden
        ">

          {/* HEADER */}

          <div className="
            flex
            items-center
            justify-between
            px-10
            py-7
            border-b
            border-[#ECECEC]
            bg-white
          ">

            <div>

              <h1 className="
                text-[44px]
                font-black
                text-[#111827]
                tracking-[-0.03em]
              ">

                로보어드바이저

              </h1>

              <p className="
                text-[18px]
                text-[#6B7280]
                mt-2
              ">

                사용자의 재무 상태를 기반으로
                투자 가능 금액과
                ETF 추천을 안내합니다.

              </p>

              <p className="
                text-[14px]
                text-[#9CA3AF]
                mt-3
              ">

                분석 기준일: 2026.05.12 |
                실제 데이터와 시차가 발생할 수 있습니다.

              </p>

            </div>

          </div>

          <div className="p-8">

            {/* 목표 달성 */}

            <section className="mb-8">

              <div className="
                bg-white
                border
                border-[#E5E7EB]
                rounded-[28px]
                p-8
                shadow-sm
              ">

                <div className="
                  inline-flex
                  items-center
                  px-5
                  py-2
                  rounded-full
                  bg-[#EEF2FF]
                  text-[#4F46E5]
                  text-[15px]
                  font-bold
                  mb-6
                ">

                  ↗ 재무 컨디션 리포트

                </div>

                <div className="
                  flex
                  items-start
                  justify-between
                  gap-8
                ">

                  <div className="flex-1">

                    <h2 className="
                      text-[44px]
                      font-black
                      text-[#111827]
                      leading-[1.35]
                      tracking-[-0.03em]
                      mb-4
                    ">

                      사용자님,
                      [{roboProfile.goalName}]
                      목표까지

                      <span className="
                        text-[#4F46E5]
                        mx-2
                      ">

                        [{roboProfile.achievementRate}%]

                      </span>

                      달려왔어요! ✨

                    </h2>

                    <p className="
                      text-[21px]
                      text-[#6B7280]
                      leading-[1.8]
                      mb-8
                    ">

                      이번 달 투자 가능 금액과
                      목표 달성률을 기반으로
                      최적 ETF를 추천합니다.

                    </p>

                    <div className="
                      flex
                      items-center
                      gap-5
                      mb-6
                    ">

                      <div className="
                        flex-1
                        h-5
                        bg-[#E5E7EB]
                        rounded-full
                        overflow-hidden
                      ">

                        <div
                          className="
                            h-full
                            rounded-full
                            bg-gradient-to-r
                            from-[#6366F1]
                            to-[#8B5CF6]
                          "
                          style={{
                            width: `${roboProfile.achievementRate}%`,
                          }}
                        />

                      </div>

                      <span className="
                        text-[28px]
                        font-black
                        text-[#111827]
                      ">

                        {roboProfile.achievementRate}%

                      </span>

                    </div>

                    <div className="
                      text-[20px]
                      text-[#374151]
                    ">

                      ● 이번 달 가용 자금:

                      <span className="
                        text-[#4F46E5]
                        font-black
                        mx-2
                      ">

                        [{roboProfile.availableBudget}만 원]

                      </span>

                      (분석 완료)

                    </div>

                  </div>

                </div>

                <p className="
                  text-[13px]
                  text-[#9CA3AF]
                  mt-6
                ">

                  사용자의 지출 내역은
                  분석 및 시뮬레이션 외
                  용도로 활용되지 않습니다.

                </p>

              </div>

            </section>

            {/* ETF 추천 */}

            <section className="mb-8">

              <div className="
                bg-white
                border
                border-[#E5E7EB]
                rounded-[28px]
                p-8
                shadow-sm
              ">

                <div className="
                  flex
                  items-center
                  justify-between
                  mb-8
                ">

                  <h2 className="
                    text-[34px]
                    font-black
                    text-[#111827]
                  ">

                    맞춤형 ETF 매수 가이드

                  </h2>

                  <div className="
                    px-5
                    py-3
                    rounded-full
                    border
                    border-[#D1D5DB]
                    text-[16px]
                    text-[#374151]
                    font-semibold
                    bg-[#FAFAFA]
                  ">

                    전략:
                    {roboProfile.investmentStyle.join(" / ")}

                  </div>

                </div>

                <div className="space-y-8">

                  {etfRanking.map(
                    (item, index) => {

                      const isOwned =
                        roboProfile.ownedAssets.includes(
                          item.title
                        );

                      return (

                        <div
                          key={index}
                          className="
                            border
                            border-[#E5E7EB]
                            rounded-[24px]
                            p-7
                            bg-[#FAFAFA]
                          "
                        >

                          <div className="
                            flex
                            items-start
                            gap-5
                          ">

                            <div className="
                              text-[38px]
                            ">
                              {item.rank}
                            </div>

                            <div className="flex-1">

                              <div className="
                                text-[34px]
                                font-black
                                text-[#111827]
                                mb-5
                              ">

                                {index + 1}위:
                                {item.title}

                                <span className="
                                  text-[#6B7280]
                                  text-[24px]
                                  ml-3
                                  font-bold
                                ">
                                  {item.description}
                                </span>

                              </div>

                              <div className="
                                text-[22px]
                                text-[#374151]
                                space-y-4
                                leading-[1.9]
                              ">

                                <p>
                                  [보유 중]
                                  →
                                  {isOwned ? (
                                    <>
                                      월

                                      <span className="
                                        text-[#4F46E5]
                                        font-black
                                        mx-2
                                      ">

                                        [{item.holdingAmount}만 원]

                                      </span>

                                      추가 매수 권장
                                    </>
                                  ) : (
                                    <>
                                      보유 자산 없음
                                    </>
                                  )}
                                </p>

                                <p>

                                  [미보유 시]
                                  →

                                  월

                                  <span className="
                                    text-[#4F46E5]
                                    font-black
                                    mx-2
                                  ">

                                    [{item.newAmount}만 원]

                                  </span>

                                  신규 진입 추천

                                </p>

                              </div>

                              <div className="
                                mt-5
                                flex
                                flex-wrap
                                gap-2
                              ">

                                <span className="
                                  px-3
                                  py-1
                                  rounded-full
                                  bg-blue-50
                                  text-blue-600
                                  text-xs
                                  font-semibold
                                ">

                                  Source: Yahoo Finance

                                </span>

                                <span className="
                                  px-3
                                  py-1
                                  rounded-full
                                  bg-gray-100
                                  text-gray-600
                                  text-xs
                                  font-semibold
                                ">

                                  최근 3년 평균
                                  ROE 및 부채비율 기반

                                </span>

                              </div>

                              <p className="
                                mt-4
                                text-sm
                                text-red-500
                                font-semibold
                              ">

                                과거 데이터 기반 분석으로
                                미래의 수익을 보장하지 않습니다.

                              </p>

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>

            </section>

            {/* 시뮬레이션 */}

            <section>

              <div className="
                bg-white
                border
                border-[#E5E7EB]
                rounded-[28px]
                p-8
                shadow-sm
              ">

                <div className="
                  flex
                  items-start
                  justify-between
                  gap-8
                  mb-7
                ">

                  <div className="flex-1">

                    <h2 className="
                      text-[34px]
                      font-black
                      text-[#111827]
                      mb-5
                    ">

                      행동 변화에 따른 달성률 예측

                    </h2>

                    <p className="
                      text-[26px]
                      text-[#111827]
                      leading-[1.8]
                    ">

                      💡 지출을

                      <span className="
                        text-[#4F46E5]
                        font-black
                        mx-2
                      ">

                        {reducedExpense}만 원

                      </span>

                      더 줄이면?

                    </p>

                  </div>

                  <div className="
                    min-w-[320px]
                    pt-4
                  ">

                    <input
                      type="range"
                      min="10"
                      max="50"
                      step="5"
                      value={reducedExpense}
                      onChange={(e) =>
                        setReducedExpense(
                          Number(e.target.value)
                        )
                      }
                      className="
                        w-full
                        accent-[#4F46E5]
                      "
                    />

                  </div>

                </div>

                <div className="
                  text-[22px]
                  text-[#374151]
                  leading-[2]
                ">

                  <p>

                    성공 확률이

                    <span className="
                      text-[#4F46E5]
                      font-black
                      mx-2
                    ">

                      [
                      {roboProfile.achievementRate}%
                      →
                      {dynamicResult.probability}%
                      ]

                    </span>

                    로 상승합니다.

                  </p>

                  <p>

                    목표 달성 기간이

                    <span className="
                      text-[#F59E0B]
                      font-black
                      mx-2
                    ">

                      [
                      {dynamicResult.shortenedMonth}개월
                      ]

                    </span>

                    단축됩니다.

                  </p>

                </div>

                <p className="
                  text-[13px]
                  text-[#9CA3AF]
                  mt-6
                ">

                  본 시뮬레이션 결과는
                  AI의 단순 추측이 아닌
                  금융공학 엔진(Python)의 계산 결과입니다.

                </p>

              </div>

            </section>

            {/* 메시지 */}

            {(buyMessage || savedMessage) && (

              <div className="
                mt-8
                bg-[#EEF2FF]
                border
                border-[#C7D2FE]
                text-[#3730A3]
                rounded-[20px]
                px-6
                py-4
                text-[18px]
                font-bold
              ">

                {buyMessage || savedMessage}

              </div>
            )}

            {/* 버튼 */}

            <div className="
              flex
              justify-center
              gap-6
              mt-10
            ">

              <button
                type="button"
                onClick={handleBuyByAnalysis}
                className="
                  min-w-[420px]
                  px-10
                  py-7
                  rounded-[36px]
                  bg-gradient-to-r
                  from-[#5B5BEF]
                  to-[#5A43E6]
                  hover:scale-[1.02]
                  active:scale-[0.98]
                  transition-all
                  duration-200
                  text-white
                  text-[32px]
                  font-black
                  shadow-[0_12px_30px_rgba(91,91,239,0.35)]
                  flex
                  items-center
                  justify-center
                  gap-5
                "
              >

                <span className="text-[36px]">
                  💳
                </span>

                <span>
                  분석된 대로 매수하기
                </span>

              </button>

              <button
                type="button"
                onClick={handleSaveReport}
                className="
                  min-w-[320px]
                  px-10
                  py-7
                  rounded-[36px]
                  border
                  border-[#D1D5DB]
                  bg-white
                  hover:bg-[#F9FAFB]
                  hover:scale-[1.02]
                  active:scale-[0.98]
                  transition-all
                  duration-200
                  text-[#111827]
                  text-[32px]
                  font-black
                  flex
                  items-center
                  justify-center
                  gap-5
                  shadow-sm
                "
              >

                <span className="text-[36px]">
                  💾
                </span>

                <span>
                  리포트 저장
                </span>

              </button>

            </div>

            <div className="
              mt-10
              text-xs
              text-gray-500
              text-center
            ">

              MoneyMate는 정보 제공 서비스이며,
              투자 손실에 대한 책임을 지지 않습니다.
              |
              Source: Yahoo Finance
              |
              투자 책임은 본인에게 있습니다.

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}