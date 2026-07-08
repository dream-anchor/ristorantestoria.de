import type { Language } from "@/contexts/LanguageContext";
import wmSlotsData from "./wmSlots.json";
import wmTeamsData from "./wmTeams.json";

/**
 * Quelle der Wahrheit für die WM-2026-Spiele auf der Public-Viewing-Seite.
 * Der hier erzeugte `wmSpiele`-Array speist BEIDES: die wm-match-Karten UND das
 * Event-JSON-LD. So bleiben sichtbare Karten und Schema dauerhaft synchron.
 *
 * Aufbau (entkoppelt, damit die Automatik gefahrlos schreiben kann):
 *  - `wmSlots.json`  → Basis-Spielplan (Termine/Orte/Runden). Ändert sich praktisch nie.
 *  - `wmTeams.json`  → Team-Paarungen je Slot. Wird von der GitHub Action
 *                      „Update WM Fixtures" automatisch gefüllt (football-data.org),
 *                      sobald eine K.-o.-Paarung feststeht. TV-Sender bleibt manuell.
 *
 * Begrenzung (über die Slot-Liste gepflegt): Auf diese Seite gehören nur
 * Deutschland-Spiele (jede Runde) sowie fremde Spiele ab Achtelfinale aufwärts.
 *
 * Offene K.-o.-Slots: Solange für einen Slot keine beiden Teams in wmTeams.json
 * stehen, ist `offen: true` und die Karte zeigt die Runde groß statt zwei leerer
 * Team-Zeilen. Sobald beide Teams gesetzt sind, erscheint die Paarung automatisch.
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

/** Optionaler Hinweis auf einer Karte (z. B. Anstoß außerhalb der STORIA-Öffnungszeiten). */
export type WmHinweis = "ausserhalb-oeffnungszeiten";

interface WmTeam {
  /** Lokalisierter Mannschaftsname je Sprache. */
  name: Record<Language, string>;
  /** Flaggen-Emoji. */
  flag: string;
}

/** Endergebnis eines bereits gespielten Spiels (Toren nach 90 bzw. 120 Minuten). */
export interface WmErgebnis {
  teamA: number;
  teamB: number;
  /** Nur bei Entscheidung im Elfmeterschießen (z. B. nach 0:0 n. V.). */
  elfmeter?: { teamA: number; teamB: number };
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
  /** Optionaler Hinweis (z. B. Anstoß außerhalb der Öffnungszeiten). */
  hinweis?: WmHinweis;
  /** Endergebnis – nur gesetzt, wenn das Spiel bereits gespielt wurde. */
  ergebnis?: WmErgebnis;
}

/** Kurzhelfer für die vier Sprachvarianten eines Namens. */
const N = (de: string, en: string, it: string, fr: string): Record<Language, string> => ({ de, en, it, fr });

/** Basis-Spielplan (Termine/Orte/Runden) aus wmSlots.json. */
type WmSlot = Pick<WmSpiel, "id" | "startISO" | "endISO" | "ort" | "runde" | "hinweis">;
const wmSlots = (wmSlotsData as { slots: WmSlot[] }).slots;

/** Team-Zuordnung je Slot aus wmTeams.json (automatisch/manuell gepflegt). */
interface WmTeamsEntry {
  teamA?: WmTeam;
  teamB?: WmTeam;
  tv?: string;
  ergebnis?: WmErgebnis;
}
const wmTeams = (wmTeamsData as { teams: Record<string, WmTeamsEntry> }).teams;

/**
 * Zusammengeführter Spielplan: Basis-Slot + (falls vorhanden) Team-Paarung.
 * Stehen für einen Slot beide Teams in wmTeams.json, wird die Paarung gezeigt;
 * sonst `offen: true` (Runden-Slot ohne Gegner).
 */
export const wmSpiele: WmSpiel[] = wmSlots.map((slot) => {
  const t = wmTeams[slot.id];
  const hasTeams = Boolean(t?.teamA && t?.teamB);
  return {
    ...slot,
    teamA: t?.teamA,
    teamB: t?.teamB,
    tv: t?.tv,
    offen: !hasTeams,
    hinweis: slot.hinweis,
    ergebnis: t?.ergebnis,
  };
});

/** Spiele chronologisch (ISO mit gleichem Offset sortiert lexikografisch = zeitlich). */
export const wmSpieleSorted: WmSpiel[] = [...wmSpiele].sort((a, b) => a.startISO.localeCompare(b.startISO));

/**
 * Kommende/laufende Spiele (noch kein Ergebnis) – chronologisch, nächstes zuerst.
 * Rein datengetrieben (kein „jetzt"-Vergleich nötig): Ergebnis gesetzt = gespielt.
 */
export const wmSpieleUpcoming: WmSpiel[] = wmSpieleSorted.filter((s) => !s.ergebnis);

/** Bereits gespielte Spiele – neuestes Ergebnis zuerst. */
export const wmSpielePast: WmSpiel[] = [...wmSpieleSorted].filter((s) => s.ergebnis).reverse();

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

const HINWEIS_LABEL: Record<WmHinweis, Record<Language, string>> = {
  "ausserhalb-oeffnungszeiten": N(
    "Außerhalb unserer Öffnungszeiten",
    "Outside our opening hours",
    "Fuori dai nostri orari di apertura",
    "En dehors de nos heures d'ouverture"
  ),
};

/** Lokalisierter Karten-Hinweis, z. B. „Außerhalb unserer Öffnungszeiten". */
export const wmHinweisLabel = (hinweis: WmHinweis, lang: Language): string => HINWEIS_LABEL[hinweis][lang];

/** Lokalisiertes Kürzel für „nach Elfmeterschießen". */
const ELFMETER_SUFFIX: Record<Language, string> = {
  de: "n. E.",
  en: "on pens.",
  it: "ai rigori",
  fr: "t.a.b.",
};

/** Formatiertes Endergebnis, z. B. „0:1" oder „0:0 (4:3 n. E.)". */
export const wmErgebnisLabel = (ergebnis: WmErgebnis, lang: Language): string => {
  const basis = `${ergebnis.teamA}:${ergebnis.teamB}`;
  if (!ergebnis.elfmeter) return basis;
  return `${basis} (${ergebnis.elfmeter.teamA}:${ergebnis.elfmeter.teamB} ${ELFMETER_SUFFIX[lang]})`;
};

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
