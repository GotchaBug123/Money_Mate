import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  currentUserEmail: string | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // localStorage에서 로그인 상태 및 사용자 이메일 확인
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('currentUserEmail');
  });

  const login = (email: string) => {
    setIsAuthenticated(true);
    setCurrentUserEmail(email);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUserEmail', email);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUserEmail(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUserEmail');
    // localStorage 이벤트 발생시켜 모든 탭에서 동기화
    localStorage.setItem('logout-event', Date.now().toString());
    localStorage.removeItem('logout-event');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUserEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
