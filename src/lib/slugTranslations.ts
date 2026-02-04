/**
 * Automatic slug translation for multi-language URLs
 * Used for special occasion menus (Valentinstag, Weihnachten, etc.)
 */

type Language = 'de' | 'en' | 'it' | 'fr';

// Common German → Other language translations for menu slugs
const SLUG_TRANSLATIONS: Record<string, Record<Language, string>> = {
  // Seasonal menus
  'valentinstag': { de: 'valentinstag', en: 'valentines', it: 'san-valentino', fr: 'saint-valentin' },
  'weihnachts': { de: 'weihnachts', en: 'christmas', it: 'natale', fr: 'noel' },
  'weihnachten': { de: 'weihnachten', en: 'christmas', it: 'natale', fr: 'noel' },
  'silvester': { de: 'silvester', en: 'new-years', it: 'capodanno', fr: 'nouvel-an' },
  'ostern': { de: 'ostern', en: 'easter', it: 'pasqua', fr: 'paques' },
  'muttertag': { de: 'muttertag', en: 'mothers-day', it: 'festa-mamma', fr: 'fete-meres' },
  'vatertag': { de: 'vatertag', en: 'fathers-day', it: 'festa-papa', fr: 'fete-peres' },

  // Common words
  'menue': { de: 'menue', en: 'menu', it: 'menu', fr: 'menu' },
  'menues': { de: 'menues', en: 'menus', it: 'menu', fr: 'menus' },
  'menu': { de: 'menu', en: 'menu', it: 'menu', fr: 'menu' },
  'spezial': { de: 'spezial', en: 'special', it: 'speciale', fr: 'special' },
  'fest': { de: 'fest', en: 'celebration', it: 'festa', fr: 'fete' },
  'feier': { de: 'feier', en: 'celebration', it: 'festa', fr: 'fete' },
  'abend': { de: 'abend', en: 'evening', it: 'serata', fr: 'soiree' },
  'brunch': { de: 'brunch', en: 'brunch', it: 'brunch', fr: 'brunch' },
  'dinner': { de: 'dinner', en: 'dinner', it: 'cena', fr: 'diner' },
};

/**
 * Translates a German slug to the target language
 * @param germanSlug - The original German slug (e.g., "valentinstag-menue")
 * @param targetLang - The target language ('en', 'it', 'fr')
 * @returns Translated slug (e.g., "valentines-menu" for English)
 */
export function translateSlug(germanSlug: string, targetLang: Language): string {
  if (targetLang === 'de') return germanSlug;

  let result = germanSlug;

  // Sort by length descending to match longer phrases first
  const sortedKeys = Object.keys(SLUG_TRANSLATIONS).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    const translation = SLUG_TRANSLATIONS[key]?.[targetLang];
    if (translation && result.includes(key)) {
      result = result.replace(key, translation);
    }
  }

  return result;
}

/**
 * Generates all language variants of a German slug
 * @param germanSlug - The original German slug
 * @returns Object with slugs for all 4 languages
 */
export function generateAllSlugVariants(germanSlug: string): Record<Language, string> {
  return {
    de: germanSlug,
    en: translateSlug(germanSlug, 'en'),
    it: translateSlug(germanSlug, 'it'),
    fr: translateSlug(germanSlug, 'fr'),
  };
}

/**
 * Reverse lookup: finds the German slug from any language variant
 * @param slug - A slug in any language
 * @param lang - The language of the input slug
 * @returns The German slug equivalent
 */
export function reverseTranslateSlug(slug: string, lang: Language): string {
  if (lang === 'de') return slug;

  let result = slug;

  // Reverse translation: other language → German
  const sortedKeys = Object.keys(SLUG_TRANSLATIONS).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    const foreignWord = SLUG_TRANSLATIONS[key]?.[lang];
    const germanWord = SLUG_TRANSLATIONS[key]?.de;
    if (foreignWord && germanWord && result.includes(foreignWord)) {
      result = result.replace(foreignWord, germanWord);
    }
  }

  return result;
}

/**
 * Checks if a slug matches the German slug (in any language)
 * @param inputSlug - The slug from the URL
 * @param germanSlug - The stored German slug from database
 * @returns True if they match (directly or via translation)
 */
export function slugMatchesGerman(inputSlug: string, germanSlug: string): boolean {
  if (inputSlug === germanSlug) return true;

  // Check if input matches any translated version
  const variants = generateAllSlugVariants(germanSlug);
  return Object.values(variants).includes(inputSlug);
}
