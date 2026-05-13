import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AuthContextType {

  isAuthenticated: boolean;

  currentUserEmail: string | null;

  login: (email: string) => void;

  logout: () => void;
}

const AuthContext =
  createContext<
    AuthContextType | undefined
  >(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  /* =========================
     로그인 상태
  ========================= */

  const [
    isAuthenticated,
    setIsAuthenticated,
  ] = useState<boolean>(() => {

    return (
      localStorage.getItem(
        "isAuthenticated"
      ) === "true"
    );
  });

  /* =========================
     현재 사용자 이메일
  ========================= */

  const [
    currentUserEmail,
    setCurrentUserEmail,
  ] = useState<string | null>(() => {

    return localStorage.getItem(
      "currentUserEmail"
    );
  });

  /* =========================
     최초 동기화
  ========================= */

  useEffect(() => {

    const savedAuth =
      localStorage.getItem(
        "isAuthenticated"
      ) === "true";

    const savedEmail =
      localStorage.getItem(
        "currentUserEmail"
      );

    setIsAuthenticated(
      savedAuth
    );

    setCurrentUserEmail(
      savedEmail
    );

  }, []);

  /* =========================
     storage 이벤트 동기화
  ========================= */

  useEffect(() => {

    const handleStorageChange = (
      event: StorageEvent
    ) => {

      if (
        event.key ===
        "isAuthenticated"
      ) {

        setIsAuthenticated(
          event.newValue === "true"
        );
      }

      if (
        event.key ===
        "currentUserEmail"
      ) {

        setCurrentUserEmail(
          event.newValue
        );
      }

      if (
        event.key ===
        "logout-event"
      ) {

        setIsAuthenticated(false);

        setCurrentUserEmail(null);
      }
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {

      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };

  }, []);

  /* =========================
     로그인
  ========================= */

  const login = (
    email: string
  ) => {

    setIsAuthenticated(true);

    setCurrentUserEmail(email);

    localStorage.setItem(
      "isAuthenticated",
      "true"
    );

    localStorage.setItem(
      "currentUserEmail",
      email
    );
  };

  /* =========================
     로그아웃
  ========================= */

  const logout = () => {

    setIsAuthenticated(false);

    setCurrentUserEmail(null);

    localStorage.removeItem(
      "isAuthenticated"
    );

    localStorage.removeItem(
      "currentUserEmail"
    );

    localStorage.setItem(
      "logout-event",
      Date.now().toString()
    );

    localStorage.removeItem(
      "logout-event"
    );

    /* 페이지 초기화 */
    localStorage.setItem(
      "currentPage",
      "home"
    );
  };

  return (

    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUserEmail,
        login,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
}

export function useAuth() {

  const context =
    useContext(AuthContext);

  if (!context) {

    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}