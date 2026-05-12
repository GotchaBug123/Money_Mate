import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface StockData {
  id: string;
  name: string;
  code: string;
  market: string;
  currentPrice: number;
  changePercent: number;
}

interface StockContextType {
  stocks: Record<string, StockData>;
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const StockContext = createContext<StockContextType | null>(
  null
);

interface StockProviderProps {
  children: ReactNode;
}

export function StockProvider({
  children,
}: StockProviderProps) {
  const [stocks, setStocks] = useState<
    Record<string, StockData>
  >({
    samsung: {
      id: "samsung",
      name: "삼성전자",
      code: "005930",
      market: "KOSPI",
      currentPrice: 72800,
      changePercent: 1.24,
    },

    skhynix: {
      id: "skhynix",
      name: "SK하이닉스",
      code: "000660",
      market: "KOSPI",
      currentPrice: 214500,
      changePercent: -0.84,
    },

    naver: {
      id: "naver",
      name: "NAVER",
      code: "035420",
      market: "KOSPI",
      currentPrice: 188000,
      changePercent: 2.11,
    },
  });

  const [favorites, setFavorites] = useState<
    Set<string>
  >(new Set());

  useEffect(() => {
    const savedFavorites =
      localStorage.getItem("favorites");

    if (savedFavorites) {
      setFavorites(
        new Set(JSON.parse(savedFavorites))
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "favorites",
      JSON.stringify(Array.from(favorites))
    );
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updated = new Set(prev);

      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }

      return updated;
    });
  };

  const isFavorite = (id: string) => {
    return favorites.has(id);
  };

  return (
    <StockContext.Provider
      value={{
        stocks,
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </StockContext.Provider>
  );
}

export const useStocks = () => {
  const context = useContext(StockContext);

  if (!context) {
    throw new Error(
      "useStocks must be used within StockProvider"
    );
  }

  return context;
};