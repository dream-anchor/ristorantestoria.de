import type { Language } from "@/contexts/LanguageContext";

/**
 * Alleinige Quelle der Wahrheit für die deutschen WM-2026-Spiele.
 * Aus diesem Array werden BEIDE gespeist: die wm-match-Karten UND das Event-JSON-LD.
 * So bleiben sichtbare Karten und Schema dauerhaft synchron.
 *
 * Begrenzung (manuell gepflegt, kein Filter gegen externe Daten):
 * Auf diese Seite gehören nur Deutschland-Spiele (jede Runde, inkl. Sechzehntelfinale)
 * sowie fremde Spiele erst ab Achtelfinale aufwärts.
 * Keine fremden Gruppen- oder Sechzehntelfinalspiele eintragen.
 */

/** Runde eines Spiels – dokumentiert, ob ein Eintrag für diese Seite vorgesehen ist. */
export type WmRunde = "gruppe" | "sechzehntelfinale" | "achtelfinale" | "viertelfinale" | "halbfinale" | "finale";

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
  teamA: WmTeam;
  teamB: WmTeam;
  /** Spielort (sprachneutral). */
  ort: string;
  /** TV-Sender (ARD/ZDF/…). */
  tv: string;
  runde: WmRunde;
}

/** Kurzhelfer für die vier Sprachvarianten eines Namens. */
const N = (de: string, en: string, it: string, fr: string): Record<Language, string> => ({ de, en, it, fr });

export const wmSpiele: WmSpiel[] = [
  // ===== Gruppe E · Die deutschen Spiele (feststehend) =====
  {
    id: "ger-cuw-2026-06-14",
    startISO: "2026-06-14T19:00:00+02:00",
    endISO: "2026-06-14T21:30:00+02:00",
    teamA: { name: N("Deutschland", "Germany", "Germania", "Allemagne"), flag: "🇩🇪" },
    teamB: { name: N("Curaçao", "Curaçao", "Curaçao", "Curaçao"), flag: "🇨🇼" },
    ort: "Houston",
    tv: "ARD",
    runde: "gruppe",
  },
  {
    id: "ger-civ-2026-06-20",
    startISO: "2026-06-20T22:00:00+02:00",
    endISO: "2026-06-21T00:30:00+02:00",
    teamA: { name: N("Deutschland", "Germany", "Germania", "Allemagne"), flag: "🇩🇪" },
    teamB: { name: N("Elfenbeinküste", "Ivory Coast", "Costa d'Avorio", "Côte d'Ivoire"), flag: "🇨🇮" },
    ort: "Toronto",
    tv: "ZDF",
    runde: "gruppe",
  },
  {
    id: "ecu-ger-2026-06-25",
    startISO: "2026-06-25T22:00:00+02:00",
    endISO: "2026-06-26T00:30:00+02:00",
    teamA: { name: N("Ecuador", "Ecuador", "Ecuador", "Équateur"), flag: "🇪🇨" },
    teamB: { name: N("Deutschland", "Germany", "Germania", "Allemagne"), flag: "🇩🇪" },
    ort: "New York / NJ",
    tv: "ARD",
    runde: "gruppe",
  },

  // ===== Sechzehntelfinale · Erstes K.-o.-Spiel (Gegner, Termin & Sender feststehend) =====
  // Deutschland als Gruppensieger Gruppe E; Gegner = Paraguay (Dritter Gruppe D).
  // Quelle u. a. ZDF/sportschau, Stand 27.06.2026. Free-TV: ZDF (ARD/ZDF teilen die K.-o.-Spiele).
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

  // ===== K.-o.-Spiele hier nachtragen, sobald Gegner/Termin feststehen =====
  // Nur Deutschland-Spiele bzw. Spiele ab Achtelfinale aufwärts (siehe Begrenzung oben).
  // Karten und Event-Schema aktualisieren sich automatisch. Vorlage (auskommentiert):
  // {
  //   id: "ger-xxx-2026-06-30",
  //   startISO: "2026-06-30T21:00:00+02:00",
  //   endISO: "2026-06-30T23:30:00+02:00",
  //   teamA: { name: N("Deutschland", "Germany", "Germania", "Allemagne"), flag: "🇩🇪" },
  //   teamB: { name: N("Gegner", "Opponent", "Avversario", "Adversaire"), flag: "🏳️" },
  //   ort: "—",
  //   tv: "ARD",
  //   runde: "achtelfinale",
  // },
];

/** Spiele chronologisch (ISO mit gleichem Offset sortiert lexikografisch = zeitlich). */
export const wmSpieleSorted: WmSpiel[] = [...wmSpiele].sort((a, b) => a.startISO.localeCompare(b.startISO));

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
 */
export const buildWmEventSchema = (ogImage: string) =>
  wmSpieleSorted.map((s) => {
    const paarung = `${s.teamA.name.de} – ${s.teamB.name.de}`;
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      name: `Public Viewing WM 2026: ${paarung}`,
      startDate: s.startISO,
      endDate: s.endISO,
      description: `Übertragung des WM-Spiels ${paarung} auf der überdachten Terrasse im STORIA München. Reservierung empfohlen.`,
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
