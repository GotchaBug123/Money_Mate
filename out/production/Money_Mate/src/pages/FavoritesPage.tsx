import { useState, useMemo } from "react";

import {
  Star,
  TrendingUp,
  TrendingDown,
  Plus,
  X,
  BarChart3,
  AlertCircle,
  ArrowUpCircle,
  ArrowDownCircle
} from "lucide-react";

import { useStocks } from "../context/StockContext";

import logoImage from "../imports/moneymate-logo.png";

interface StockData {
  id: string;
  name: string;
  code: string;
  market: string;
  currentPrice: number;
  changeAmount: number;
  changePercent: number;
  tradingValue: number;
  volume: number;
  isSurging: boolean;
  isPlunging: boolean;
  trend?: "up" | "down";
  changeRate?: number;
}

export function FavoritesPage() {
  const {
    stocks,
    favorites,
    toggleFavorite,
    isFavorite,
    getStock
  } = useStocks();

  const [selectedStock, setSelectedStock] =
    useState<StockData | null>(null);

  const [isDetailOpen, setIsDetailOpen] =
    useState(false);

  const [showStockList, setShowStockList] =
    useState(false);

  const stockList = useMemo(
    () =>
      Object.values(stocks) as StockData[],
    [stocks]
  );

  const favoriteStocks = useMemo(() => {
    return Array.from(favorites)
      .map((id) => getStock(id))
      .filter(
        (s): s is StockData =>
          s !== undefined
      );
  }, [favorites, stocks]);

  const handleViewDetail = (
    stock: StockData
  ) => {
    setSelectedStock(stock);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedStock(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            즐겨찾기 종목
          </h1>

          <button
            onClick={() =>
              setShowStockList(true)
            }
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white"
            style={{
              backgroundColor: "#1D6AE5"
            }}
          >
            <Plus className="w-5 h-5" />
            종목 추가
          </button>
        </div>

        {/* Favorite Stocks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />

            <h3 className="text-lg font-bold text-gray-900">
              관심 종목 (
              {favoriteStocks.length})
            </h3>
          </div>

          <div className="space-y-3">
            {favoriteStocks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                즐겨찾기한 종목이 없습니다.
              </div>
            ) : (
              favoriteStocks.map((stock) => (
                <div
                  key={stock.id}
                  className="flex items-center justify-between p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Star
                      className="w-5 h-5 text-yellow-500 fill-yellow-500 cursor-pointer"
                      onClick={() =>
                        toggleFavorite(
                          stock.id
                        )
                      }
                    />

                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-lg font-bold text-gray-900">
                          {stock.name}
                        </h4>
                      </div>

                      <p className="text-sm text-gray-600">
                        {stock.code}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900 mb-1">
                        {stock.currentPrice.toLocaleString(
                          "ko-KR"
                        )}
                        원
                      </div>

                      <div className="flex items-center gap-2 justify-end">
                        {stock.changePercent >=
                        0 ? (
                          <TrendingUp className="w-4 h-4 text-red-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-blue-600" />
                        )}

                        <span
                          className={`text-sm font-medium ${
                            stock.changePercent >=
                            0
                              ? "text-red-600"
                              : "text-blue-600"
                          }`}
                        >
                          {stock.changeAmount >=
                          0
                            ? "+"
                            : ""}
                          {stock.changeAmount.toLocaleString(
                            "ko-KR"
                          )}
                          원 (
                          {stock.changePercent >=
                          0
                            ? "+"
                            : ""}
                          {
                            stock.changePercent
                          }
                          %)
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleViewDetail(
                          stock
                        )
                      }
                      className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      상세보기
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tip */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <p className="text-gray-800">
            <strong>💡 Tip:</strong>
            관심있는 종목을 즐겨찾기에
            추가하여 빠르게 시세를
            확인하세요.
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailOpen &&
        selectedStock && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={
              handleCloseDetail
            }
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-3xl w-full"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {
                      selectedStock.name
                    }
                  </h2>

                  <p className="text-sm text-gray-500">
                    {
                      selectedStock.code
                    }
                  </p>
                </div>

                <button
                  onClick={
                    handleCloseDetail
                  }
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">
                      현재가
                    </p>

                    <p className="text-2xl font-bold">
                      {selectedStock.currentPrice.toLocaleString()}
                      원
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">
                      등락률
                    </p>

                    <p
                      className={`text-2xl font-bold ${
                        selectedStock.changePercent >=
                        0
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                    >
                      {selectedStock.changePercent >=
                      0
                        ? "+"
                        : ""}
                      {
                        selectedStock.changePercent
                      }
                      %
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

      {/* Stock List Modal */}
      {showStockList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">

              <div className="flex items-center gap-4">
                <img
                  src={logoImage}
                  alt="MoneyMate"
                  className="w-10 h-10"
                />

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    주식 시장
                  </h2>

                  <p className="text-sm text-gray-600">
                    실시간 시세 정보
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  setShowStockList(
                    false
                  )
                }
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                        별
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                        항목이름
                      </th>

                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">
                        현재가
                      </th>

                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">
                        등락률
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {stockList.map(
                      (stock) => (
                        <tr
                          key={
                            stock.id
                          }
                          className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        >
                          <td className="px-4 py-4">
                            <Star
                              className={`w-5 h-5 cursor-pointer ${
                                isFavorite(
                                  stock.id
                                )
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }`}
                              onClick={() =>
                                toggleFavorite(
                                  stock.id
                                )
                              }
                            />
                          </td>

                          <td className="px-4 py-4">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {
                                  stock.name
                                }
                              </p>

                              <p className="text-xs text-gray-500">
                                {
                                  stock.code
                                }
                              </p>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-right">
                            <p className="font-bold text-gray-900">
                              {stock.currentPrice.toLocaleString()}
                              원
                            </p>
                          </td>

                          <td className="px-4 py-4 text-right">
                            <span
                              className={`font-semibold ${
                                stock.changePercent >=
                                0
                                  ? "text-red-600"
                                  : "text-blue-600"
                              }`}
                            >
                              {stock.changePercent >=
                              0
                                ? "+"
                                : ""}
                              {
                                stock.changePercent
                              }
                              %
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>

              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}