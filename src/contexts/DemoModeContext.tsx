import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "storia-demo-mode";

interface DemoModeContextValue {
  hidden: boolean;
  toggle: () => void;
  setHidden: (value: boolean) => void;
}

const DemoModeContext = createContext<DemoModeContextValue | undefined>(undefined);

const readInitial = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

export const DemoModeProvider = ({ children }: { children: ReactNode }) => {
  const [hidden, setHiddenState] = useState<boolean>(readInitial);

  const setHidden = useCallback((value: boolean) => {
    setHiddenState(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => setHidden(!hidden), [hidden, setHidden]);

  // Sync across tabs/windows on the same device
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setHiddenState(e.newValue === "1");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <DemoModeContext.Provider value={{ hidden, toggle, setHidden }}>
      {children}
    </DemoModeContext.Provider>
  );
};

export const useDemoMode = (): DemoModeContextValue => {
  const ctx = useContext(DemoModeContext);
  if (!ctx) {
    // Safe fallback if used outside provider (e.g. isolated tests)
    return { hidden: false, toggle: () => {}, setHidden: () => {} };
  }
  return ctx;
};