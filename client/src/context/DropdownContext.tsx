import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

type DropdownId =
  string | null;

interface DropdownContextType {

  activeDropdown: DropdownId;

  openDropdown: (
    id: string
  ) => void;

  closeDropdown: () => void;

  toggleDropdown: (
    id: string
  ) => void;

  isDropdownOpen: (
    id: string
  ) => boolean;
}

const DropdownContext =
  createContext<
    DropdownContextType | undefined
  >(undefined);

export function DropdownProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [
    activeDropdown,
    setActiveDropdown,
  ] = useState<DropdownId>(null);

  /* =========================
     드롭다운 열기
  ========================= */

  const openDropdown =
    useCallback(
      (id: string) => {

        setActiveDropdown(id);

      },
      []
    );

  /* =========================
     드롭다운 닫기
  ========================= */

  const closeDropdown =
    useCallback(() => {

      setActiveDropdown(null);

    }, []);

  /* =========================
     토글
  ========================= */

  const toggleDropdown =
    useCallback(
      (id: string) => {

        setActiveDropdown(
          (current) => {

            if (current === id) {
              return null;
            }

            return id;
          }
        );

      },
      []
    );

  /* =========================
     열림 여부 확인
  ========================= */

  const isDropdownOpen =
    useCallback(
      (id: string) => {

        return activeDropdown === id;

      },
      [activeDropdown]
    );

  /* =========================
     Context 최적화
  ========================= */

  const value =
    useMemo(() => {

      return {
        activeDropdown,
        openDropdown,
        closeDropdown,
        toggleDropdown,
        isDropdownOpen,
      };

    }, [
      activeDropdown,
      openDropdown,
      closeDropdown,
      toggleDropdown,
      isDropdownOpen,
    ]);

  return (

    <DropdownContext.Provider
      value={value}
    >

      {children}

    </DropdownContext.Provider>
  );
}

export function useDropdown() {

  const context =
    useContext(DropdownContext);

  if (!context) {

    throw new Error(
      "useDropdown must be used within a DropdownProvider"
    );
  }

  return context;
}