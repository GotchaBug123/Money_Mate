import { createContext, useContext, useState, ReactNode } from "react";

type DropdownId = string | null;

interface DropdownContextType {
  activeDropdown: DropdownId;
  openDropdown: (id: string) => void;
  closeDropdown: () => void;
  toggleDropdown: (id: string) => void;
  isDropdownOpen: (id: string) => boolean;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export function DropdownProvider({ children }: { children: ReactNode }) {
  const [activeDropdown, setActiveDropdown] = useState<DropdownId>(null);

  const openDropdown = (id: string) => {
    setActiveDropdown(id);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  const toggleDropdown = (id: string) => {
    setActiveDropdown((current) => (current === id ? null : id));
  };

  const isDropdownOpen = (id: string) => {
    return activeDropdown === id;
  };

  return (
    <DropdownContext.Provider
      value={{
        activeDropdown,
        openDropdown,
        closeDropdown,
        toggleDropdown,
        isDropdownOpen,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
}

export function useDropdown() {
  const context = useContext(DropdownContext);
  if (context === undefined) {
    throw new Error("useDropdown must be used within a DropdownProvider");
  }
  return context;
}
