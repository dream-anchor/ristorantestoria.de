import { de } from "@/translations/de";
import { en } from "@/translations/en";
import { it as italian } from "@/translations/it";
import { fr } from "@/translations/fr";
import type { Language } from "@/contexts/LanguageContext";

// All translation objects
const translations = { de, en, it: italian, fr };

// Supported languages
export const SUPPORTED_LANGUAGES: Language[] = ["de", "en", "it", "fr"];
export const DEFAULT_LANGUAGE: Language = "de";

// Get slugs for a specific language
export const getSlugs = (language: Language) => translations[language].slugs;

/**
 * Get the localized path for a given base slug
 * @param baseSlug - The German (base) slug without leading slash
 * @param language - Target language
 * @returns Full path with language prefix (e.g., "/en/reservation")
 */
export const getLocalizedPath = (baseSlug: string, language: Language): string => {
  const slugs = getSlugs(language);
  const localizedSlug = slugs[baseSlug as keyof typeof slugs] ?? baseSlug;
  
  // German has no prefix
  if (language === "de") {
    return localizedSlug ? `/${localizedSlug}/` : "/";
  }

  // Other languages get a prefix
  return localizedSlug ? `/${language}/${localizedSlug}/` : `/${language}/`;
};

/**
 * Get base slug from a localized path
 * @param path - Current path (e.g., "/en/reservation" or "/reservierung")
 * @returns Object with language and base slug
 */
export const parseLocalizedPath = (path: string): { language: Language; baseSlug: string } => {
  // Remove leading slash and trailing slash (consistent with slug values which have no slashes)
  const cleanPath = path.replace(/^\/|\/$/g, "");
  const segments = cleanPath.split("/").filter(Boolean);

  // Check if first segment is a language code
  const firstSegment = segments[0];
  if (SUPPORTED_LANGUAGES.includes(firstSegment as Language) && firstSegment !== "de") {
    const language = firstSegment as Language;
    const localizedSlug = segments.slice(1).join("/") || "home";
    const baseSlug = getBaseSlugFromLocalized(localizedSlug, language);
    return { language, baseSlug };
  }

  // Default: German
  const localizedSlug = cleanPath || "home";
  const baseSlug = getBaseSlugFromLocalized(localizedSlug, "de");
  return { language: "de", baseSlug };
};

/**
 * Reverse lookup: find base slug from localized slug
 */
const getBaseSlugFromLocalized = (localizedSlug: string, language: Language): string => {
  const slugs = getSlugs(language);
  
  // Find the base slug by looking up the value
  for (const [baseSlug, translated] of Object.entries(slugs)) {
    if (translated === localizedSlug) {
      return baseSlug;
    }
  }
  
  // Fallback: return as-is (might be a dynamic route)
  return localizedSlug;
};

/**
 * Get all routes for all languages (for prerendering)
 */
export const getAllLocalizedRoutes = (): Array<{ path: string; language: Language; baseSlug: string }> => {
  const routes: Array<{ path: string; language: Language; baseSlug: string }> = [];
  const baseSlugs = Object.keys(de.slugs);
  
  for (const baseSlug of baseSlugs) {
    // Skip admin routes for prerendering (handled separately)
    if (baseSlug.startsWith("admin")) continue;
    
    for (const language of SUPPORTED_LANGUAGES) {
      const path = getLocalizedPath(baseSlug, language);
      routes.push({ path, language, baseSlug });
    }
  }
  
  return routes;
};

/**
 * Build URL for the same page in a different language
 */
export const getLanguageSwitchUrl = (currentPath: string, targetLanguage: Language): string => {
  const { baseSlug } = parseLocalizedPath(currentPath);
  return getLocalizedPath(baseSlug, targetLanguage);
};
