import type { Language } from "@/contexts/LanguageContext";

/**
 * Alleinige Quelle der Wahrheit für die WM-2026-Spiele auf der Public-Viewing-Seite.
 * Aus diesem Array werden BEIDE gespeist: die wm-match-Karten UND das Event-JSON-LD.
 * So bleiben sichtbare Karten und Schema dauerhaft synchron.
 *
 * Begrenzung (manuell gepflegt, kein Filter gegen externe Daten):
 * Auf diese Seite gehören nur Deutschland-Spiele (jede Runde, inkl. Sechzehntelfinale)
 * sowie fremde Spiele erst ab Achtelfinale aufwärts.
 * Keine fremden Gruppen- oder Sechzehntelfinalspiele eintragen.
 *
 * Offene K.-o.-Slots: Solange der Gegner/die Teams nicht feststehen, wird `offen: true`
 * gesetzt und teamA/teamB weggelassen. Die Karte zeigt dann die Runde groß statt zwei
 * leerer Team-Zeilen. Sobald die Paarung feststeht: teamA/teamB ergänzen, `offen` entfernen.
 */

/** Runde eines Spiels – dokumentiert, ob ein Eintrag für diese Seite vorgesehen ist. */
export type WmRunde =
  | "gruppe"
  | "sechzehntelfinale"
  | "achtelfinale"
  | "viertelfinale"
  | "halbfinale"
  | "spiel-um-platz-3"
  | "finale";

interface WmTeam {
  /** Lokalisierter Mannschaftsname je Sprache. */
  name: Record<Language, string>;
  /** Flaggen-Emoji. */
  flag: string;
}

/** Ein WM-Spiel. Datum/Wochentag/Uhrzeit werden aus startISO abgeleitet (lokalisiert). */
export interface WmSpiel {
  id: string;
  /** Anstoß als ISO mit MESZ-Offset (+02:00). Quelle für Datum, Wochentag und Uhrzeit. */
  startISO: string;
  /** Voraussichtliches Spielende (für endDate im Schema + Ausgrau-Logik). */
  endISO: string;
  /** Teams – nur wenn die Paarung feststeht. Offene Slots lassen beide weg (siehe `offen`). */
  teamA?: WmTeam;
  teamB?: WmTeam;
  /** true = Gegner/Teams stehen noch nicht fest. Karte rendert dann als Runden-Slot. */
  offen?: boolean;
  /** Spielort (sprachneutral). */
  ort: string;
  /** TV-Sender (ARD/ZDF/…). Leer lassen, solange (noch) nicht gesichert. */
  tv?: string;
  runde: WmRunde;
}

/** Kurzhelfer für die vier Sprachvarianten eines Namens. */
const N = (de: string, en: string, it: string, fr: string): Record<Language, string> => ({ de, en, it, fr });

export const wmSpiele: WmSpiel[] = [
  // ===== Sechzehntelfinale · Erstes K.-o.-Spiel (Gegner, Termin & Sender feststehend) =====
  // Deutschland als Gruppensieger Gruppe E; Gegner = Paraguay (Dritter Gruppe D).
  // Quelle u. a. ZDF/sportschau, Stand 27.06.2026. Free-TV: ZDF.
  {
    id: "ger-par-2026-06-29",
    startISO: "2026-06-29T22:30:00+02:00",
    endISO: "2026-06-30T01:00:00+02:00",
    teamA: { name: N("Deutschland", "Germany", "Germania", "Allemagne"), flag: "🇩🇪" },
    teamB: { name: N("Paraguay", "Paraguay", "Paraguay", "Paraguay"), flag: "🇵🇾" },
    ort: "Boston",
    tv: "ZDF",
    runde: "sechzehntelfinale",
  },

  // ===== K.-o.-Slots ab Achtelfinale · Termine/Orte fix, Gegner offen =====
  // Quelle Termine/Orte/Anstoßzeiten: FIFA-Spielplan (fifa.com), Stand 27.06.2026.
  // Sobald Paarungen feststehen: teamA/teamB ergänzen, `offen` und ggf. tv setzen.
  {
    // Achtelfinale Deutschland-Pfad (Sieger Spiel 74 – Sieger Spiel 77), Spiel 89.
    id: "af-2026-07-04",
    startISO: "2026-07-04T23:00:00+02:00",
    endISO: "2026-07-05T01:30:00+02:00",
    offen: true,
    ort: "Philadelphia",
    runde: "achtelfinale",
  },
  {
    // Achtelfinale, Spiel 91.
    id: "af-2026-07-05",
    startISO: "2026-07-05T22:00:00+02:00",
    endISO: "2026-07-06T00:30:00+02:00",
    offen: true,
    ort: "New York / NJ",
    runde: "achtelfinale",
  },
  {
    // Viertelfinale Deutschland-Pfad (Boston).
    id: "vf-2026-07-09",
    startISO: "2026-07-09T22:00:00+02:00",
    endISO: "2026-07-10T00:30:00+02:00",
    offen: true,
    ort: "Boston",
    runde: "viertelfinale",
  },
  {
    // Viertelfinale (Miami).
    id: "vf-2026-07-11",
    startISO: "2026-07-11T23:00:00+02:00",
    endISO: "2026-07-12T01:30:00+02:00",
    offen: true,
    ort: "Miami",
    runde: "viertelfinale",
  },
  {
    // Halbfinale 1 (Dallas), Spiel 101.
    id: "hf-2026-07-14",
    startISO: "2026-07-14T21:00:00+02:00",
    endISO: "2026-07-14T23:30:00+02:00",
    offen: true,
    ort: "Dallas",
    runde: "halbfinale",
  },
  {
    // Halbfinale 2 (Atlanta), Spiel 102.
    id: "hf-2026-07-15",
    startISO: "2026-07-15T21:00:00+02:00",
    endISO: "2026-07-15T23:30:00+02:00",
    offen: true,
    ort: "Atlanta",
    runde: "halbfinale",
  },
  {
    // Spiel um Platz 3 (Miami), Spiel 103.
    id: "p3-2026-07-18",
    startISO: "2026-07-18T23:00:00+02:00",
    endISO: "2026-07-19T01:00:00+02:00",
    offen: true,
    ort: "Miami",
    runde: "spiel-um-platz-3",
  },
  {
    // Finale (New York / New Jersey), Spiel 104.
    id: "finale-2026-07-19",
    startISO: "2026-07-19T21:00:00+02:00",
    endISO: "2026-07-19T23:30:00+02:00",
    offen: true,
    ort: "New York / NJ",
    runde: "finale",
  },
];

/** Spiele chronologisch (ISO mit gleichem Offset sortiert lexikografisch = zeitlich). */
export const wmSpieleSorted: WmSpiel[] = [...wmSpiele].sort((a, b) => a.startISO.localeCompare(b.startISO));

// ---- Lokalisierte Runden-Bezeichnungen (für offene Slot-Karten + Schema) ----

const RUNDE_LABEL: Record<WmRunde, Record<Language, string>> = {
  gruppe: N("Gruppenspiel", "Group match", "Partita del girone", "Match de groupe"),
  sechzehntelfinale: N("Sechzehntelfinale", "Round of 32", "Sedicesimi di finale", "Seizièmes de finale"),
  achtelfinale: N("Achtelfinale", "Round of 16", "Ottavi di finale", "Huitièmes de finale"),
  viertelfinale: N("Viertelfinale", "Quarter-final", "Quarti di finale", "Quart de finale"),
  halbfinale: N("Halbfinale", "Semi-final", "Semifinale", "Demi-finale"),
  "spiel-um-platz-3": N("Spiel um Platz 3", "Third-place play-off", "Finale 3º posto", "Match pour la 3e place"),
  finale: N("Finale", "Final", "Finale", "Finale"),
};

/** Lokalisierte Bezeichnung der Runde, z. B. „Achtelfinale" / „Round of 16". */
export const wmRundeLabel = (runde: WmRunde, lang: Language): string => RUNDE_LABEL[runde][lang];

// ---- Lokalisierte Datums-/Zeit-Formatierung (Intl, Zeitzone Europe/Berlin = MESZ) ----

const LOCALE_TAG: Record<Language, string> = { de: "de-DE", en: "en-GB", it: "it-IT", fr: "fr-FR" };
const TZ = "Europe/Berlin";

/** Wochentag, z. B. „Sonntag" / „Sunday" / „domenica" / „dimanche". */
export const wmWeekday = (iso: string, lang: Language): string =>
  new Intl.DateTimeFormat(LOCALE_TAG[lang], { weekday: "long", timeZone: TZ }).format(new Date(iso));

/** Datum ohne Jahr, z. B. „14. Juni" / „14 June" / „14 giugno" / „14 juin". */
export const wmDateLabel = (iso: string, lang: Language): string =>
  new Intl.DateTimeFormat(LOCALE_TAG[lang], { day: "numeric", month: "long", timeZone: TZ }).format(new Date(iso));

/** Anstoßzeit HH:MM in MESZ, z. B. „19:00". */
export const wmKickoff = (iso: string): string =>
  new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(new Date(iso));

// ---- Event-JSON-LD aus derselben Liste ----

/**
 * Inline-Restaurant-Place (die Seite rendert keinen Restaurant-@id-Knoten).
 * Adresse wie bestehend: Karlstraße 47A.
 */
const WM_EVENT_LOCATION = {
  "@type": "Restaurant",
  name: "STORIA",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Karlstraße 47A",
    postalCode: "80333",
    addressLocality: "München",
    addressCountry: "DE",
  },
};

/**
 * Erzeugt die Event-Knoten aus wmSpiele – FIFA-neutral.
 * Teamnamen bewusst deutsch für alle Sprachversionen (sprachneutrale Veranstaltungsdaten).
 * Offene Slots laufen über die deutsche Runden-Bezeichnung.
 */
export const buildWmEventSchema = (ogImage: string) =>
  wmSpieleSorted.map((s) => {
    const paarung =
      s.teamA && s.teamB ? `${s.teamA.name.de} – ${s.teamB.name.de}` : RUNDE_LABEL[s.runde].de;
    const beschreibung =
      s.teamA && s.teamB
        ? `Übertragung des WM-Spiels ${paarung} auf der überdachten Terrasse im STORIA München. Reservierung empfohlen.`
        : `${paarung} der WM 2026 live auf der überdachten Terrasse im STORIA München. Gegner stehen noch nicht fest. Reservierung empfohlen.`;
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      name: `Public Viewing WM 2026: ${paarung}`,
      startDate: s.startISO,
      endDate: s.endISO,
      description: beschreibung,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      image: ogImage,
      location: WM_EVENT_LOCATION,
      organizer: {
        "@type": "Restaurant",
        name: "STORIA",
        url: "https://www.ristorantestoria.de/",
      },
    };
  });
