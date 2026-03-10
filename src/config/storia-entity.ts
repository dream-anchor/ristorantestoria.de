/**
 * Zentrales Entity-Daten-Modul für STORIA
 *
 * Single Source of Truth für alle Restaurant-Daten.
 * Wird verwendet von: StructuredData, Footer, UeberUns, TLDR-Content, llms.txt
 */

export const STORIA = {
  // Brand
  name: "STORIA – Ristorante Pizzeria Bar",
  schemaName: "STORIA - Ristorante \u2022 Pizzeria \u2022 Bar",
  alternateName: ["Ristorante STORIA", "STORIA München", "Restaurant Storia"],

  // Adresse (NAP)
  address: {
    street: "Karlstraße 47a",
    zip: "80333",
    city: "München",
    state: "Bayern",
    country: "DE",
    neighborhood: "Maxvorstadt",
  },
  geo: { lat: 48.1456, lng: 11.5656 },

  // Kontakt
  phone: "+49 89 51519696",
  phoneFormatted: "089 51519696",
  phoneTel: "+498951519696",
  whatsapp: "+49 163 603 3912",
  email: "info@ristorantestoria.de",

  // URLs
  url: "https://www.ristorantestoria.de",
  sameAs: [
    "https://www.instagram.com/ristorante_storia/",
    "https://www.opentable.de/r/storia-ristorante-pizzeria-bar-munchen",
    "https://maps.google.com/?cid=3761590175870856939",
    "https://www.quandoo.de/place/storia-10239",
  ],
  instagram: "https://www.instagram.com/ristorante_storia/",
  googleMaps: "https://maps.google.com/?cid=3761590175870856939",

  // Geschichte
  founded: "2015",
  foundedISO: "2015-01-01",
  founderInGermanySince: "1995",

  // Gründer
  founders: [
    {
      name: "Domenico Speranza",
      alternateName: "Mimmo",
      role: "Gründer & Küchenchef",
      roleEN: "Founder & Head Chef",
      origin: "Rofrano, Provinz Salerno",
      background: "Seit 1995 in Deutschland. Restaurant Cinema in Rosenheim, 6 Jahre Betriebsleiter im H'ugo's München.",
    },
    {
      name: "Nicola Speranza",
      role: "Restaurantleitung",
      roleEN: "Restaurant Manager",
      origin: "Rofrano, Provinz Salerno",
    },
  ],

  // Öffnungszeiten
  openingHours: {
    weekday: { label: "Mo–Fr", open: "09:00", close: "01:00" },
    weekend: { label: "Sa–So", open: "12:00", close: "01:00" },
  },
  // Schema.org OpeningHoursSpecification
  openingHoursSpec: [
    { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "01:00" },
    { dayOfWeek: ["Saturday", "Sunday"], opens: "12:00", closes: "01:00" },
  ],

  // Kapazität
  capacity: {
    indoor: { seats: 100, standing: 180 },
    terrace: { seats: 100, note: "überdacht & beheizt" },
    events: { min: 6, max: 300 },
  },

  // Küche & Highlights
  cuisine: ["Italian", "Pizza", "Pasta", "Mediterranean"],
  cuisineDE: ["Italienisch", "Neapolitanisch", "Pizza", "Pasta", "Meeresfrüchte"],
  priceRange: "€€",
  highlights: [
    "Steinofen-Pizza bei über 400 °C",
    "48-Stunden Teigführung",
    "Hausgemachte Pasta",
    "Über 60 italienische Weine",
    "Familienbetrieb seit 2015",
    "Terrasse mit 100 Plätzen",
  ],

  // Nähe & Lage
  nearbyLandmarks: ["Königsplatz", "TU München", "Pinakotheken", "Hauptbahnhof München"],
  parking: { name: "Parkhaus Marsstraße (P22)", address: "Hirtenstraße 14", walkMinutes: 5 },

  // Firma
  companyName: "Speranza GmbH",

  // Zahlungsmethoden
  paymentAccepted: ["Cash", "Credit Card", "EC Card", "Visa", "Mastercard", "American Express"],

  // Amenities
  amenities: [
    { name: "Terrasse", value: true },
    { name: "Barrierefrei", value: true },
    { name: "WLAN", value: true },
    { name: "Klimaanlage", value: true },
    { name: "Privaträume", value: true },
  ],
} as const;

export type StoriaEntity = typeof STORIA;
