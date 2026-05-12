// Pure context + hook module — separated from Provider component
// so React Fast Refresh doesn't duplicate the context identity on HMR.
import { createContext, useContext } from "react";
import { de } from "@/translations/de";

export type Language = "de" | "en" | "it" | "fr";
type Translations = typeof de;

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  switchLanguage: (lang: Language) => void;
  getPath: (baseSlug: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
