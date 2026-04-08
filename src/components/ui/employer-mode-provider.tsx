"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface EmployerModeContextValue {
  isEmployerMode: boolean;
  toggleEmployerMode: () => void;
  setEmployerMode: (value: boolean) => void;
}

const EmployerModeContext = createContext<EmployerModeContextValue | null>(null);
const STORAGE_KEY = "portfolio-employer-mode";

export function EmployerModeProvider({ children }: { children: React.ReactNode }) {
  const [isEmployerMode, setIsEmployerMode] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "true") setIsEmployerMode(true);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(isEmployerMode));
    document.documentElement.classList.toggle("employer-mode", isEmployerMode);
  }, [isEmployerMode]);

  const value = useMemo(
    () => ({
      isEmployerMode,
      toggleEmployerMode: () => setIsEmployerMode((prev) => !prev),
      setEmployerMode: setIsEmployerMode,
    }),
    [isEmployerMode]
  );

  return <EmployerModeContext.Provider value={value}>{children}</EmployerModeContext.Provider>;
}

export function useEmployerMode() {
  const context = useContext(EmployerModeContext);
  if (!context) throw new Error("useEmployerMode must be used within EmployerModeProvider");
  return context;
}
