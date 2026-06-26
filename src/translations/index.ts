// Per-Sprache Lazy-Loader für die Übersetzungen.
//
// Hintergrund: de/en/it/fr sind zusammen ~1,2 MB. Statisch importiert landeten
// alle 4 im Haupt-Bundle und wurden auf JEDER Seite geladen — der Großteil des
// "unused JavaScript". Hier werden sie pro Sprache als eigener Chunk dynamisch
// geladen. en/it/fr spreaden de (siehe translations/*.ts), daher ist de eine
// gemeinsame Basis, die fremdsprachige Chunks mitziehen.
//
// SSR/Prerender (entry-server) und Client-Bootstrap (main.tsx) rufen
// loadTranslations(activeLang) VOR dem Render auf → getCached() ist dann synchron
// verfügbar. Sprachwechsel (LanguageContext.switchLanguage) lädt die Zielsprache
// vor der Navigation nach.
import type { de } from "./de";
import type { Language } from "@/contexts/language-context";

export type Translations = typeof de;

const cache = {} as Record<Language, Translations>;

const loaders: Record<Language, () => Promise<Translations>> = {
  de: () => import("./de").then((m) => m.de),
  en: () => import("./en").then((m) => m.en),
  it: () => import("./it").then((m) => m.it),
  fr: () => import("./fr").then((m) => m.fr),
};

/** Lädt (einmalig) die Übersetzungen einer Sprache und legt sie im Cache ab. */
export async function loadTranslations(lang: Language): Promise<Translations> {
  if (!cache[lang]) {
    cache[lang] = await loaders[lang]();
  }
  return cache[lang];
}

/** Synchroner Zugriff auf bereits geladene Übersetzungen (undefined wenn noch nicht geladen). */
export function getCachedTranslations(lang: Language): Translations | undefined {
  return cache[lang];
}
