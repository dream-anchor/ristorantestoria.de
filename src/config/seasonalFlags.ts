/**
 * Zentrale Datums-Flags für saisonale Event-Verlinkung (WM 2026 + Filmfest München).
 *
 * Eine einzige Quelle für alle Saison-Banner, Reservierungs-Hinweise, Cross-Links
 * und den Footer-Auto-Hide. Alle Komponenten teilen sich diese Logik, damit
 * sich Saison-Inhalte nach dem jeweiligen Enddatum überall gleichzeitig ausblenden.
 *
 * Die Flags werden serverseitig (Prerender) UND im Client ausgewertet (Date.now()).
 * Solange ein Build im aktiven Zeitraum läuft, steht der interne Link crawlbar im HTML;
 * nach dem Enddatum blendet ihn der Client beim Rendern automatisch aus.
 *
 * ▸ AUFRÄUMEN NACH DER SAISON: WmBanner + der WM-Zweig von ReservationSeasonalHints
 *   wurden nach dem WM-2026-Finale bereits entfernt (die Zielseite public-viewing-muenchen
 *   ist seitdem evergreen und läuft ohne Datums-Gate weiter). Der Filmfest-Zweig kann
 *   analog entfernt werden, sobald auch dessen Saison endgültig vorbei ist.
 */

// WM 2026: Eröffnung 11. Juni, Finale 19. Juli 2026 → Banner/Hinweise bis einschließlich 19.7.2026.
export const WM_END = new Date("2026-07-20T00:00:00+02:00").getTime();

// Filmfest München 2026: 26. Juni – 5. Juli 2026 → sichtbar im Festivalzeitraum.
// TODO: Bei offiziell bestätigten Festivaldaten hier final verifizieren.
export const FILMFEST_START = new Date("2026-06-26T00:00:00+02:00").getTime();
export const FILMFEST_END = new Date("2026-07-06T00:00:00+02:00").getTime(); // bis einschließlich 5.7.2026

// Oktoberfest-Push 2026: Marketing-Fenster ab 15. August (Vorlauf) bis zum letzten
// Wiesn-Tag 4. Oktober 2026. Bewusst früher als der eigentliche Wiesn-Zeitraum
// (19.9.–4.10.), damit Gruppen/Reisegruppen rechtzeitig reservieren. Steuert die
// Oktoberfest-Teaser-Kachel; die Seite /oktoberfest-muenchen/ selbst bleibt evergreen.
export const OKTOBERFEST_START = new Date("2026-08-15T00:00:00+02:00").getTime();
export const OKTOBERFEST_END = new Date("2026-10-05T00:00:00+02:00").getTime(); // bis einschließlich 4.10.2026

/** Interne Slugs der beiden Saison-Event-Seiten (für Footer-Filter etc.). */
export const WM_SLUG = "public-viewing-muenchen";
export const FILMFEST_SLUG = "filmfest-muenchen";
export const OKTOBERFEST_SLUG = "oktoberfest-muenchen";

/** WM-Saison aktiv (bis einschließlich 19.7.2026). */
export const isWmActive = (now: number = Date.now()): boolean => now < WM_END;

/** Filmfest-Saison aktiv (26.6.–5.7.2026). */
export const isFilmfestActive = (now: number = Date.now()): boolean =>
  now >= FILMFEST_START && now < FILMFEST_END;

/** Oktoberfest-Saison aktiv (Vorlauf ab 15.8. bis einschließlich 4.10.2026). */
export const isOktoberfestActive = (now: number = Date.now()): boolean =>
  now >= OKTOBERFEST_START && now < OKTOBERFEST_END;

/** Überschneidung WM ↔ Filmfest aktiv (Ende Juni / Anfang Juli) – steuert die Cross-Links. */
export const isWmFilmfestOverlap = (now: number = Date.now()): boolean =>
  isWmActive(now) && isFilmfestActive(now);
