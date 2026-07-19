/**
 * facts.ts — Single Source of Truth für faktische Kernwerte (NAP, Bewertungen,
 * Kapazitäten, Aperitivo-Preise).
 *
 * Ziel: KI-Zitierfähigkeit / GEO. Widersprüchliche Zahlen (abweichende
 * Bewertungsanzahlen, uneinheitliche Kapazitäts- und Hausnummer-Angaben) kosten
 * Zitierfähigkeit, weil
 * Assistenten inkonsistente Fakten abstrafen. Alle faktischen Zahlen/Werte auf
 * Live-Kundenseiten sollen aus dieser Datei (bzw. dem darunterliegenden
 * {@link STORIA}-Entity) gespeist werden.
 *
 * NAP/Öffnungszeiten werden bewusst aus {@link STORIA} abgeleitet, damit es
 * KEINE zweite, konkurrierende Quelle für dieselben Werte gibt – facts.ts ist
 * die dokumentierte SSoT-Fassade, storia-entity.ts der Datenkörper.
 *
 * Verwendet von: StructuredData (JSON-LD aggregateRating), Footer.
 */
import { STORIA } from "@/config/storia-entity";

export const FACTS = {
  // ── NAP (abgeleitet aus STORIA – einheitlich "Karlstraße 47a") ──
  name: "Ristorante STORIA",
  address: {
    street: STORIA.address.street, // "Karlstraße 47a"
    zip: STORIA.address.zip,
    city: STORIA.address.city,
    /** "Karlstraße 47a, 80333 München" */
    full: `${STORIA.address.street}, ${STORIA.address.zip} ${STORIA.address.city}`,
  },
  phone: STORIA.phone, // "+49 89 51519696"
  phoneTel: STORIA.phoneTel, // "+498951519696" (tel:-Href)
  phoneFormatted: STORIA.phoneFormatted, // "089 51519696"
  whatsapp: STORIA.whatsapp, // "+49 163 603 3912"
  whatsappTel: "491636033912", // wa.me/-Href (ohne +/Leerzeichen)
  email: STORIA.email, // "info@ristorantestoria.de"

  // ── Öffnungszeiten (abgeleitet aus STORIA) ──
  openingHours: {
    weekday: STORIA.openingHours.weekday, // Mo–Fr 09:00–01:00
    weekend: STORIA.openingHours.weekend, // Sa–So 12:00–01:00
  },

  // ── Bewertungen — SSoT für aggregateRating & Review-Blöcke ──
  reviews: {
    count: 810, // exakte Google-Bewertungsanzahl (Stand: google-reviews-*.json)
    avg: 4.5, // Durchschnittsbewertung
  },

  // ── Aperitivo-Preise (€, IST-Werte aus AperitivoMuenchen.tsx) ──
  aperitivo: {
    spritz: "9,90", // Aperol/Hugo/Campari/Limoncello Spritz etc.
    spritzAlkoholfrei: "7,90", // San Bitter / Crodino Spritz (alkoholfrei)
  },

  // ── Kapazität — Werte exakt wie auf der Startseite ──
  // "Innen und auf der Terrasse jeweils bis zu 100 Sitzplätze oder 180 Stehplätze."
  // Hinweis: An anderen Stellen (Filmfest-/Reisegruppen-/Saison-Seiten) stehen
  // abweichend "bis 300 Stehplätze" / "200 Sitzplätze gesamt". Diese sind bewusst
  // NICHT hier vereinheitlicht – siehe Follow-up im Report (Kundenklärung offen).
  capacity: {
    indoorSeats: 100, // Innenbereich, Sitzplätze
    terraceSeats: 100, // Terrasse, Sitzplätze
    standingPerArea: 180, // Stehplätze je Bereich
  },

  // ── TODO(Kundenklärung): Weihnachts-Menüpreis uneinheitlich (45 € vs. 49 €) ──
  // Wird bewusst NICHT vereinheitlicht, bis Familie Speranza die korrekte Zahl
  // bestätigt hat. Bis dahin keine der beiden Angaben als "wahr" hardcoden.
} as const;

/**
 * Bewertungsanzahl auf volle Hundert abgerundet → "über 800".
 * Abrunden hält die "über X"-Aussage wahr (810 > 800), im Gegensatz zu einem
 * naiven "über 810".
 */
export const reviewsOverRounded = Math.floor(FACTS.reviews.count / 100) * 100; // 800

export type Facts = typeof FACTS;
