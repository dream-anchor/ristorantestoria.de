/**
 * AlternateLinksContext - provides alternate language URLs for dynamic pages
 *
 * Used by pages with dynamic slugs (like special occasions) to inform
 * the language switcher about the correct URLs for each language.
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Language } from "@/contexts/LanguageContext";

interface AlternateLink {
  lang: Language;
  url: string;
}

interface AlternateLinksContextType {
  /** Current page's alternate links (one per language) */
  alternates: AlternateLink[];
  /** Set alternates for the current page (call from page components) */
  setAlternates: (alternates: AlternateLink[]) => void;
  /** Clear alternates (call when leaving a page with dynamic slugs) */
  clearAlternates: () => void;
  /** Get the alternate URL for a specific language */
  getAlternateUrl: (lang: Language) => string | null;
}

const AlternateLinksContext = createContext<AlternateLinksContextType | undefined>(undefined);

export const AlternateLinksProvider = ({ children }: { children: ReactNode }) => {
  const [alternates, setAlternatesState] = useState<AlternateLink[]>([]);

  const setAlternates = useCallback((newAlternates: AlternateLink[]) => {
    setAlternatesState(newAlternates);
  }, []);

  const clearAlternates = useCallback(() => {
    setAlternatesState([]);
  }, []);

  const getAlternateUrl = useCallback((lang: Language): string | null => {
    const alternate = alternates.find(a => a.lang === lang);
    if (!alternate) return null;

    // Extract path from full URL (alternates contain full URLs like https://www.ristorantestoria.de/...)
    try {
      const url = new URL(alternate.url);
      return url.pathname;
    } catch {
      // If it's already a path, return as-is
      return alternate.url;
    }
  }, [alternates]);

  return (
    <AlternateLinksContext.Provider value={{ alternates, setAlternates, clearAlternates, getAlternateUrl }}>
      {children}
    </AlternateLinksContext.Provider>
  );
};

export const useAlternateLinks = (): AlternateLinksContextType => {
  const context = useContext(AlternateLinksContext);
  if (!context) {
    throw new Error("useAlternateLinks must be used within an AlternateLinksProvider");
  }
  return context;
};
