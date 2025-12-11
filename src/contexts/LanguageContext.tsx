import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { de } from "@/translations/de";
import { en } from "@/translations/en";
import { it } from "@/translations/it";
import { fr } from "@/translations/fr";

export type Language = "de" | "en" | "it" | "fr";
type Translations = typeof de;

const STORAGE_KEY = "storia-language";
const SUPPORTED_LANGUAGES: Language[] = ["de", "en", "it", "fr"];

const detectBrowserLanguage = (): Language => {
  // Check localStorage first
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && SUPPORTED_LANGUAGES.includes(saved as Language)) {
    return saved as Language;
  }

  // Detect from browser
  const browserLanguages = navigator.languages || [navigator.language];
  for (const lang of browserLanguages) {
    const code = lang.split("-")[0].toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(code as Language)) {
      return code as Language;
    }
  }

  // Fallback to English
  return "en";
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(detectBrowserLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }, []);

  const translations = {
    de,
    en,
    it,
    fr,
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
