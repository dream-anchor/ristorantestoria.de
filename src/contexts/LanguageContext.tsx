import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { de } from "@/translations/de";
import { en } from "@/translations/en";
import { it as italian } from "@/translations/it";
import { fr } from "@/translations/fr";
import { parseLocalizedPath, getLocalizedPath, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/config/routes";

export type Language = "de" | "en" | "it" | "fr";
type Translations = typeof de;

const STORAGE_KEY = "storia-language";

const detectBrowserLanguage = (): Language => {
  // SSR-safe: return default language on server
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  // Check localStorage first
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.includes(saved as Language)) {
      return saved as Language;
    }
  } catch {
    // localStorage may be blocked
  }

  // Detect from browser
  try {
    const browserLanguages = navigator.languages || [navigator.language];
    for (const lang of browserLanguages) {
      const code = lang.split("-")[0].toLowerCase();
      if (SUPPORTED_LANGUAGES.includes(code as Language)) {
        return code as Language;
      }
    }
  } catch {
    // navigator may not be available
  }

  // Fallback to default
  return DEFAULT_LANGUAGE;
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  /** Navigate to the same page in another language */
  switchLanguage: (lang: Language) => void;
  /** Get localized path for a base slug */
  getPath: (baseSlug: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Initialize language from URL - works in both SSR and client
  const [language, setLanguageState] = useState<Language>(() => {
    const { language: urlLanguage } = parseLocalizedPath(location.pathname);
    return urlLanguage;
  });

  // Sync language from URL changes
  useEffect(() => {
    const { language: urlLanguage } = parseLocalizedPath(location.pathname);
    if (urlLanguage !== language) {
      setLanguageState(urlLanguage);
    }
  }, [location.pathname]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // localStorage may be blocked
      }
    }
  }, []);

  /**
   * Switch to another language and navigate to the same page
   */
  const switchLanguage = useCallback((targetLang: Language) => {
    const { baseSlug } = parseLocalizedPath(location.pathname);
    const newPath = getLocalizedPath(baseSlug, targetLang);
    
    // Preserve hash if present
    const hash = location.hash || "";
    
    setLanguage(targetLang);
    navigate(newPath + hash);
  }, [location.pathname, location.hash, setLanguage, navigate]);

  /**
   * Get localized path for a base slug
   */
  const getPath = useCallback((baseSlug: string): string => {
    return getLocalizedPath(baseSlug, language);
  }, [language]);

  const translations = {
    de,
    en,
    it: italian,
    fr,
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, switchLanguage, getPath }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
