import {
  Search,
  Plus,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  X,
  ChevronDown,
  BarChart3,
  Star,
  ArrowUpCircle,
  ArrowDownCircle,
  MessageCircle,
  ThumbsUp,
  Send,
  Edit2,
  Trash2,
  Check
} from "lucide-react";

import { useState, useEffect, useMemo } from "react";

import { fetchMarketSummary } from "../services/marketApi";

import { useAuth } from "../context/AuthContext";

import { useStocks } from "../context/StockContext";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  Area
} from "recharts";

import logoImage from "../imports/moneymate-logo.png";

interface StockData {
  id: string;
  name: string;
  code: string;
  market: string;
  sector: string;
  currentPrice: number;
  yesterdayPrice: number;
  changeAmount: number;
  changePercent: number;
  volume: number;
  tradingValue: number;
  isSurging: boolean;
  isPlunging: boolean;
}

interface CommunityPost {
  id: string;
  stockId: string;
  userId: string;
  authorEmail: string;
  content: string;
  isShareholder: boolean;
  likes: number;
  timestamp: Date;
  updatedAt?: Date;
  isEdited: boolean;
  likedBy: Set<string>;
}

export function DashboardPage() {
  const {
    currentUserEmail,
    isAuthenticated
  } = useAuth();

  const {
    stocks,
    favorites,
    toggleFavorite,
    isFavorite,
    getStock,
    getStockByName
  } = useStocks();

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedStock, setSelectedStock] =
    useState<StockData | null>(null);

  const stockList = useMemo(
    () => Object.values(stocks) as StockData[],
    [stocks]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* 즐겨찾기 */}
        <div className="bg-white rounded-xl border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              즐겨찾기 종목
            </h2>

            <button className="w-10 h-10 rounded-lg border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {Array.from(favorites).length === 0 ? (
            <div className="text-gray-500 text-sm">
              즐겨찾기 종목이 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {Array.from(favorites).map((id) => {
                const stock = getStock(id);

                if (!stock) return null;

                return (
                  <div
                    key={stock.id}
                    className="flex items-center justify-between border rounded-lg px-4 py-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      setSelectedStock(stock as StockData)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(stock.id);
                        }}
                      >
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      </button>

                      <div>
                        <div className="font-semibold">
                          {stock.name}
                        </div>

                        <div className="text-xs text-gray-500">
                          {stock.code}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold">
                        {stock.currentPrice.toLocaleString()}원
                      </div>

                      <div
                        className={`text-sm ${
                          stock.changePercent >= 0
                            ? "text-red-600"
                            : "text-blue-600"
                        }`}
                      >
                        {stock.changePercent >= 0 ? "+" : ""}
                        {stock.changePercent}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 전체 종목 */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-xl font-bold mb-6">
            전체 종목
          </h2>

          <div className="space-y-3">
            {stockList.map((stock) => (
              <div
                key={stock.id}
                className="flex items-center justify-between border rounded-lg px-4 py-3 hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  setSelectedStock(stock)
                }
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(stock.id);
                    }}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        isFavorite(stock.id)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  </button>

                  <div>
                    <div className="font-semibold">
                      {stock.name}
                    </div>

                    <div className="text-xs text-gray-500">
                      {stock.code} · {stock.market}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold">
                    {stock.currentPrice.toLocaleString()}원
                  </div>

                  <div
                    className={`text-sm ${
                      stock.changePercent >= 0
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {stock.changePercent >= 0 ? "+" : ""}
                    {stock.changePercent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 상세 모달 */}
        {selectedStock && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-6 relative">

              <button
                onClick={() =>
                  setSelectedStock(null)
                }
                className="absolute top-4 right-4"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedStock.name}
                </h2>

                <p className="text-gray-500">
                  {selectedStock.code}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">
                    현재가
                  </p>

                  <p className="text-2xl font-bold">
                    {selectedStock.currentPrice.toLocaleString()}원
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">
                    등락률
                  </p>

                  <p
                    className={`text-2xl font-bold ${
                      selectedStock.changePercent >= 0
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {selectedStock.changePercent >= 0
                      ? "+"
                      : ""}
                    {selectedStock.changePercent}%
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}