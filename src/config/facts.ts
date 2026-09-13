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
  // Sitzplätze: 100 innen + 100 auf der Terrasse (unverändert).
  // Stehempfang: einheitlich bis zu 300 Gäste – unabhängig davon, ob innen,
  // außen oder gemischt (Fakten-Klärung Antoine, 2026-09-02). Die zuvor hier
  // dokumentierte, uneinheitliche "180 pro Bereich"-Angabe war falsch und
  // wurde branchweit auf 300 korrigiert (siehe PR fix-standing-capacity-300).
  capacity: {
    indoorSeats: STORIA.capacity.indoor.seats, // Innenbereich, Sitzplätze
    terraceSeats: STORIA.capacity.terrace.seats, // Terrasse, Sitzplätze
    standing: STORIA.capacity.indoor.standing, // Stehempfang, einheitlich (innen/außen/gemischt)
  },

  // ── Silvester Gala-Dinner — SSoT (Fakten-Festlegung Antoine, 2026-09-13) ──
  // Es gibt EIN Gala-Menü mit VIER Gängen. Es kostet 99 € pro Person, mit
  // Weinbegleitung 150 € pro Person. Der Unterschied zwischen den beiden
  // Preisen ist AUSSCHLIESSLICH die Weinbegleitung – nicht die Gangzahl.
  // Die frühere Darstellung (Classic mit vier, Premium mit fünf Gängen) war in
  // der Gangzahl falsch und wurde branchweit korrigiert
  // (KONZEPT-SAISONSEITEN-AUSBAU.md § Faktenwidersprüche, Nr. 2).
  // Preise als Anzeige-Strings (ganze Euro); im JSON-LD als "99.00"/"150.00".
  silvester: {
    courses: 4, // Gangzahl – identisch mit und ohne Weinbegleitung
    price: "99", // € pro Person, ohne Weinbegleitung
    priceWithWine: "150", // € pro Person, inkl. Weinbegleitung
  },

  // ── Weihnachten ──
  // Historie (recherchiert 13.09.2026): Der früher hier vermerkte Widerspruch
  // „45 € vs. 49 €" ist AUFGELÖST. Die 49 € stammten aus einem Paket
  // „Menü C – Tradizione (ab 49 €)" und der zugehörigen FAQ auf
  // weihnachtsfeier-muenchen (Commits Feb–Mai 2026) und wurden seitdem überall
  // auf 45 € vereinheitlicht. Im gesamten Repo steht heute kein 49-€-Wert mehr.
  // Verbleibende offene Frage war NICHT mehr „welcher der beiden Werte", sondern nur noch, ob
  // 45 € betrieblich korrekt ist — von Antoine am 13.09.2026 bestätigt ("Faktenfragen = stimmen").
  //
  // Fakt (Antoine, 13.09.2026): Es gibt KEIN festes, vorgegebenes Weihnachtsmenü
  // für Gruppen/Firmen — das wird individuell mit dem Betreiber besprochen (siehe
  // AnlassAnfrageForm-Weg). Für Einzelgäste gilt: innerhalb der regulären
  // saisonalen à-la-carte-Karte gibt es zusätzlich EIN Weihnachtsmenü in drei
  // Varianten (Fleisch / Fisch / vegetarisch), das jeder Gast individuell
  // bestellen kann — ohne Vorbestellung, ohne Gruppenzwang.
  weihnachten: {
    groupMenuPriceFrom: "45", // € pro Person, Gruppen-Menü ab 6 Personen (individuell besprochen, kein festes Paket)
    groupMenuMinGuests: 6, // ab 6 Personen wird ein Gruppen-Menü individuell abgesprochen
    altaCarteMenuVariants: ["Fleisch", "Fisch", "vegetarisch"], // Weihnachtsmenü auf der saisonalen à-la-carte-Karte, einzeln bestellbar
  },

  // ── Valentinstag — SSoT (GEO-Lücken-Loop V3.5, 13.09.2026) ──
  // Zwei Pakete: Classic ab 55 € p.P. (3-Gang-Menü), Premium ab 85 € p.P. (4-Gang-Menü mit
  // Weinbegleitung). Vorher an vier unabhängigen Stellen hart kodiert (JSON-LD-Description, zwei
  // JSON-LD-Offers, package1Price/package2Price, seoDescription) — reine Konsolidierung der
  // bereits angezeigten Werte. 55 €/85 € von Antoine am 13.09.2026 als betrieblich aktuell
  // bestätigt ("Faktenfragen = stimmen").
  valentinstag: {
    price: "55", // € pro Person, Classic-Paket (3-Gang-Menü)
    pricePremium: "85", // € pro Person, Premium-Paket (4-Gang-Menü mit Weinbegleitung)
  },
} as const;

/**
 * Bewertungsanzahl auf volle Hundert abgerundet → "über 800".
 * Abrunden hält die "über X"-Aussage wahr (810 > 800), im Gegensatz zu einem
 * naiven "über 810".
 */
export const reviewsOverRounded = Math.floor(FACTS.reviews.count / 100) * 100; // 800

export type Facts = typeof FACTS;
