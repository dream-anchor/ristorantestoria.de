/**
 * TERMINOLOGY GLOSSARY - Verbindliches Wörterbuch für Übersetzungen
 *
 * WICHTIG: Diese Übersetzungen sind verbindlich und dürfen NICHT abweichen!
 * Die KI/Claude MUSS diese Tabelle bei jeder Übersetzung konsultieren.
 *
 * Verwendung: Dieses Regelwerk gilt für:
 * - PDF-Menü-Parser (Supabase Edge Function)
 * - Slug-Übersetzungen
 * - UI-Texte
 * - SEO Meta-Tags
 */

type Language = 'de' | 'en' | 'it' | 'fr';

/**
 * VERBINDLICHE ÜBERSETZUNGEN
 * Format: deutsches_wort → { en: '...', it: '...', fr: '...' }
 *
 * ⚠️ FALSCHE ÜBERSETZUNGEN (Bekannte Fehler):
 * - "Menü" → it: "Carta" ❌ FALSCH! → "Menù" ✓
 * - "Karte" → it: "Menu" ❌ (wenn Speisekarte gemeint) → "Carta" ✓
 */
export const TERMINOLOGY: Record<string, Record<Language, string>> = {
  // === GRUNDBEGRIFFE (SEHR WICHTIG) ===

  // Menü (als zusammengestelltes Menü/Menüfolge)
  'menü': {
    de: 'Menü',
    en: 'Menu',
    it: 'Menù',  // ⚠️ NICHT "Carta"! Carta = Speisekarte
    fr: 'Menu',
  },

  // Speisekarte (die gesamte Karte)
  'speisekarte': {
    de: 'Speisekarte',
    en: 'Menu',
    it: 'Carta',  // Hier ist Carta richtig!
    fr: 'Carte',
  },

  // Weinkarte
  'weinkarte': {
    de: 'Weinkarte',
    en: 'Wine List',
    it: 'Carta dei Vini',
    fr: 'Carte des Vins',
  },

  // === RESTAURANT-TERMINOLOGIE ===

  'vorspeisen': {
    de: 'Vorspeisen',
    en: 'Starters',
    it: 'Antipasti',
    fr: 'Entrées',
  },

  'hauptspeisen': {
    de: 'Hauptspeisen',
    en: 'Main Courses',
    it: 'Secondi Piatti',
    fr: 'Plats Principaux',
  },

  'hauptgerichte': {
    de: 'Hauptgerichte',
    en: 'Main Courses',
    it: 'Secondi Piatti',
    fr: 'Plats Principaux',
  },

  'nachspeisen': {
    de: 'Nachspeisen',
    en: 'Desserts',
    it: 'Dolci',
    fr: 'Desserts',
  },

  'desserts': {
    de: 'Desserts',
    en: 'Desserts',
    it: 'Dolci',
    fr: 'Desserts',
  },

  'getränke': {
    de: 'Getränke',
    en: 'Beverages',
    it: 'Bevande',
    fr: 'Boissons',
  },

  'weine': {
    de: 'Weine',
    en: 'Wines',
    it: 'Vini',
    fr: 'Vins',
  },

  // === SAISONALE ANLÄSSE ===

  'valentinstag': {
    de: 'Valentinstag',
    en: "Valentine's Day",
    it: 'San Valentino',
    fr: 'Saint-Valentin',
  },

  'weihnachten': {
    de: 'Weihnachten',
    en: 'Christmas',
    it: 'Natale',
    fr: 'Noël',
  },

  'silvester': {
    de: 'Silvester',
    en: "New Year's Eve",
    it: 'Capodanno',
    fr: 'Réveillon',
  },

  'ostern': {
    de: 'Ostern',
    en: 'Easter',
    it: 'Pasqua',
    fr: 'Pâques',
  },

  'muttertag': {
    de: 'Muttertag',
    en: "Mother's Day",
    it: 'Festa della Mamma',
    fr: 'Fête des Mères',
  },

  'vatertag': {
    de: 'Vatertag',
    en: "Father's Day",
    it: 'Festa del Papà',
    fr: 'Fête des Pères',
  },

  // === SEITENNAVIGATION ===

  'besondere-anlaesse': {
    de: 'Besondere Anlässe',
    en: 'Special Occasions',
    it: 'Occasioni Speciali',
    fr: 'Occasions Spéciales',
  },

  'reservierung': {
    de: 'Reservierung',
    en: 'Reservation',
    it: 'Prenotazione',
    fr: 'Réservation',
  },

  'kontakt': {
    de: 'Kontakt',
    en: 'Contact',
    it: 'Contatto',
    fr: 'Contact',
  },

  'impressum': {
    de: 'Impressum',
    en: 'Legal Notice',
    it: 'Note Legali',
    fr: 'Mentions Légales',
  },

  'datenschutz': {
    de: 'Datenschutz',
    en: 'Privacy Policy',
    it: 'Privacy',
    fr: 'Confidentialité',
  },

  // === ZUTATEN & GERICHTE ===

  'pasta': {
    de: 'Pasta',
    en: 'Pasta',
    it: 'Pasta',
    fr: 'Pâtes',
  },

  'pizza': {
    de: 'Pizza',
    en: 'Pizza',
    it: 'Pizza',
    fr: 'Pizza',
  },

  'risotto': {
    de: 'Risotto',
    en: 'Risotto',
    it: 'Risotto',
    fr: 'Risotto',
  },

  'fisch': {
    de: 'Fisch',
    en: 'Fish',
    it: 'Pesce',
    fr: 'Poisson',
  },

  'fleisch': {
    de: 'Fleisch',
    en: 'Meat',
    it: 'Carne',
    fr: 'Viande',
  },

  'vegetarisch': {
    de: 'Vegetarisch',
    en: 'Vegetarian',
    it: 'Vegetariano',
    fr: 'Végétarien',
  },

  'vegan': {
    de: 'Vegan',
    en: 'Vegan',
    it: 'Vegano',
    fr: 'Végan',
  },
};

/**
 * Übersetzt ein deutsches Wort in die Zielsprache
 * Verwendet das verbindliche Terminologie-Wörterbuch
 */
export function translateTerm(germanTerm: string, targetLang: Language): string {
  const normalizedTerm = germanTerm.toLowerCase().trim();
  const entry = TERMINOLOGY[normalizedTerm];

  if (entry) {
    return entry[targetLang];
  }

  // Fallback: Original zurückgeben
  return germanTerm;
}

/**
 * Prüft ob ein Begriff im Wörterbuch existiert
 */
export function hasTerminology(term: string): boolean {
  return term.toLowerCase().trim() in TERMINOLOGY;
}

/**
 * Gibt alle Übersetzungen für einen Begriff zurück
 */
export function getAllTranslations(germanTerm: string): Record<Language, string> | null {
  const normalizedTerm = germanTerm.toLowerCase().trim();
  return TERMINOLOGY[normalizedTerm] || null;
}

/**
 * BEKANNTE FALSCHE ÜBERSETZUNGEN
 * Diese Liste dient zur Fehlererkennung und -korrektur
 */
export const KNOWN_WRONG_TRANSLATIONS: Record<string, { wrong: string; correct: string; lang: Language }[]> = {
  'menü': [
    { wrong: 'Carta', correct: 'Menù', lang: 'it' },
    { wrong: 'carta', correct: 'menù', lang: 'it' },
  ],
  'menu': [
    { wrong: 'Carta', correct: 'Menù', lang: 'it' },
  ],
};

/**
 * Korrigiert bekannte falsche Übersetzungen
 */
export function correctKnownErrors(text: string, lang: Language): string {
  if (lang !== 'it') return text; // Aktuell nur IT-Korrekturen

  let corrected = text;

  // Korrigiere "Carta" → "Menù" wenn es sich um ein Menü handelt
  // Aber NICHT wenn es "Carta dei Vini" ist (Weinkarte)
  corrected = corrected.replace(/\bCarta\b(?!\s+dei\s+Vini)/gi, 'Menù');

  return corrected;
}
