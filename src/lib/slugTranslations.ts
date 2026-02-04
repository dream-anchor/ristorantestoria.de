/**
 * Automatic slug translation for multi-language URLs
 * Used for special occasion menus (Valentinstag, Weihnachten, etc.)
 */

type Language = 'de' | 'en' | 'it' | 'fr';

/**
 * RECURRING MENU SLUGS (SEO-permanent)
 * These slugs are reused every year for the same theme.
 * IMPORTANT: Never change these slugs - they have SEO authority!
 */
export const RECURRING_MENU_SLUGS: Record<string, Record<Language, string>> = {
  // Valentinstag - reused every February
  valentinstag: {
    de: 'valentinstag-menue',
    en: 'valentines-menu',
    it: 'san-valentino-menu',
    fr: 'saint-valentin-menu',
  },
  // Weihnachten - reused every December
  weihnachten: {
    de: 'weihnachtsmenues',
    en: 'christmas-menus',
    it: 'natale-menu',
    fr: 'noel-menus',
  },
  // Silvester - reused every December/January
  silvester: {
    de: 'silvesterparty',
    en: 'new-years-party',
    it: 'capodanno-party',
    fr: 'nouvel-an-party',
  },
  // Ostern - reused every spring
  ostern: {
    de: 'ostern-menue',
    en: 'easter-menu',
    it: 'pasqua-menu',
    fr: 'paques-menu',
  },
  // Muttertag - reused every May
  muttertag: {
    de: 'muttertag-menue',
    en: 'mothers-day-menu',
    it: 'festa-mamma-menu',
    fr: 'fete-meres-menu',
  },
  // Vatertag - reused every year
  vatertag: {
    de: 'vatertag-menue',
    en: 'fathers-day-menu',
    it: 'festa-papa-menu',
    fr: 'fete-peres-menu',
  },
};

/**
 * Pattern matching for recurring menu themes
 * Each theme has multiple variations (typos, abbreviations, translations)
 */
const THEME_PATTERNS: Record<string, RegExp> = {
  // Valentinstag: Valentins-, Valentine-, Valentin-, San Valentino, Saint-Valentin
  valentinstag: /valentin|valentine|san.?valentino|saint.?valentin/i,

  // Weihnachten: Weihnachts-, Christmas, Natale, Noël
  weihnachten: /weihnacht|christmas|x-?mas|natale|no[eë]l/i,

  // Silvester: Silvester, Sylvester, New Year, Neujahr, Capodanno, Nouvel An
  silvester: /silvester|sylvester|new.?year|neujahr|capodanno|nouvel.?an|jahreswechsel/i,

  // Ostern: Ostern, Easter, Pasqua, Pâques
  ostern: /ostern|easter|pasqua|p[aâ]ques/i,

  // Muttertag: Muttertag, Mother's Day, Festa della Mamma, Fête des Mères
  muttertag: /mutter|mother|mamma|m[eè]re/i,

  // Vatertag: Vatertag, Father's Day, Festa del Papà, Fête des Pères
  vatertag: /vater|father|pap[aà]|p[eè]re/i,
};

/**
 * Detects if a menu title matches a recurring theme
 * Uses fuzzy matching to handle variations like:
 * - "Valentins-Menü", "Valentinstags-Menü", "Valentine's Menu"
 * - "Weihnachtsmenü", "Christmas Menu", "X-Mas Special"
 *
 * @param title - The menu title (e.g., "Valentinstag-Menü 2026")
 * @returns The theme key if matched, or null
 */
export function detectRecurringTheme(title: string): string | null {
  // Check against all theme patterns
  for (const [theme, pattern] of Object.entries(THEME_PATTERNS)) {
    if (pattern.test(title)) {
      return theme;
    }
  }

  return null;
}

/**
 * Gets predefined slugs for a recurring menu theme
 * @param title - The menu title
 * @returns Predefined slugs if recurring theme, or null
 */
export function getRecurringMenuSlugs(title: string): Record<Language, string> | null {
  const theme = detectRecurringTheme(title);
  if (theme && RECURRING_MENU_SLUGS[theme]) {
    return RECURRING_MENU_SLUGS[theme];
  }
  return null;
}

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
