// LanguageContext - provides i18n support for DE/EN/IT/FR
import { useState, useCallback, useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadTranslations, getCachedTranslations, type Translations } from "@/translations";
import { parseLocalizedPath, getLocalizedPath, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/config/routes";
import { LanguageContext, type Language } from "./language-context";
export { useLanguage, type Language } from "./language-context";

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

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Initialize language from URL - works in both SSR and client
  const [language, setLanguageState] = useState<Language>(() => {
    const { language: urlLanguage } = parseLocalizedPath(location.pathname);
    return urlLanguage;
  });

  // Übersetzungen der aktiven Sprache. Sind durch entry-server (SSR) bzw.
  // main.tsx (Client-Bootstrap) VOR dem ersten Render geladen → Cache-Hit.
  const [t, setT] = useState<Translations>(() => getCachedTranslations(language)!);

  // Sync language from URL changes
  useEffect(() => {
    const { language: urlLanguage } = parseLocalizedPath(location.pathname);
    if (urlLanguage !== language) {
      setLanguageState(urlLanguage);
    }
  }, [location.pathname]);

  // Übersetzungen nachladen, wenn die Sprache wechselt (z. B. SPA-Navigation).
  useEffect(() => {
    const cached = getCachedTranslations(language);
    if (cached) {
      setT(cached);
      return;
    }
    let active = true;
    loadTranslations(language).then((loaded) => {
      if (active) setT(loaded);
    });
    return () => {
      active = false;
    };
  }, [language]);

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

    // Zielsprache vorab laden, damit beim Wechsel kein leerer Render entsteht.
    void loadTranslations(targetLang).then(() => {
      setLanguage(targetLang);
      navigate(newPath + hash);
    });
  }, [location.pathname, location.hash, setLanguage, navigate]);

  /**
   * Get localized path for a base slug
   */
  const getPath = useCallback((baseSlug: string): string => {
    return getLocalizedPath(baseSlug, language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, switchLanguage, getPath }}>
      {children}
    </LanguageContext.Provider>
  );
};