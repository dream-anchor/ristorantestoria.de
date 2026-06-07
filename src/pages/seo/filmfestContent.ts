import type { Language } from "@/contexts/LanguageContext";

/**
 * Lokalisierte Inhalte der Filmfest-München-Kampagnenseite.
 * `de` = 1:1 die ursprünglichen deutschen Texte. en/it/fr = marketing-taugliche
 * Übersetzungen im selben Ton (kein wörtliches Übersetzen).
 */

export interface FilmfestFormat {
  num: string;
  title: string;
  text: string;
}

export interface FilmfestRoute {
  min: string;
  place: string;
  sub: string;
}

export interface FilmfestRoom {
  /** Bild-Key — wird in der Komponente auf den Import gemappt. */
  key: "innenraum" | "terrasse" | "bar";
  title: string;
  cap: string;
  text: string;
  alt: string;
}

export interface FilmfestStep {
  n: string;
  title: string;
  text: string;
}

export interface FilmfestFaqItem {
  question: string;
  answer: string;
}

export interface FilmfestMenuCard {
  tag: string;
  title: string;
  items: string[];
}

export interface FilmfestContent {
  seo: { title: string; description: string };
  breadcrumbLabel: string;
  structuredEvent: { name: string; description: string; services: string[] };

  nav: {
    formate: string;
    lage: string;
    raeume: string;
    catering: string;
    cta: string;
    brandAria: string;
  };

  hero: {
    eyebrow: string;
    /** h1: Vorlauftext + kursiv hervorgehobener Teil. */
    h1Pre: string;
    h1Em: string;
    sub: string;
    btnPrimary: string;
    btnGhost: string;
    heroImgAlt: string;
  };

  stats: { n: string; l: string }[];

  intro: {
    /** Fließtext-Teile rund um den verlinkten Festivalnamen. */
    pre: string;
    linkLabel: string;
    post: string;
  };

  formateSection: { eyebrow: string; h2: string; lead: string };
  formate: FilmfestFormat[];

  lageSection: { eyebrow: string; h2: string; lead: string };
  route: FilmfestRoute[];
  minLabel: string;
  mapTitle: string;

  raeumeSection: { eyebrow: string; h2: string; lead: string };
  rooms: FilmfestRoom[];
  scenarioHead: { format: string; seating: string; guests: string };
  scenario: string[][];

  cateringSection: { eyebrow: string; h2: string; lead: string };
  menuCards: FilmfestMenuCard[];
  chips: string[];

  ablaufSection: { eyebrow: string; h2: string };
  steps: FilmfestStep[];

  kontakt: {
    urgency: string;
    h2: string;
    lead: string;
    callLabel: string;
    mailLabel: string;
    platformLabel: string;
    directionsLabel: string;
    directionsValue: string;
    mailSubject: string;
  };

  faqSection: { eyebrow: string; h2: string };
  faqItems: FilmfestFaqItem[];

  disclaimerPre: string;
  disclaimerLinkLabel: string;
  disclaimerPost: string;
}

const de: FilmfestContent = {
  seo: {
    title: "Filmfest München 2026 — Eventlocation STORIA",
    description:
      "Eventlocation 6 Gehminuten vom Festivalzentrum: Premierendinner, Empfänge & Cast-Dinner im STORIA München beim Filmfest 2026 (26.6.–5.7.). Bis 300 Gäste.",
  },
  breadcrumbLabel: "Filmfest München 2026",
  structuredEvent: {
    name: "Filmfest München 2026 — Eventabende im Ristorante STORIA",
    description:
      "Premierendinner, Verleiher-Empfänge, Cast-&-Crew-Dinner und Branchen-Networking im Ristorante STORIA München, sechs Gehminuten vom Festivalzentrum Amerikahaus, während des Filmfest München 2026 (26. Juni bis 5. Juli 2026).",
    services: [
      "Premierendinner",
      "Verleiher- & Sales-Empfang",
      "Cast & Crew Dinner",
      "Presse-Lunch & Junket",
      "Branchen-Networking",
      "Exklusiv-Anmietung",
    ],
  },

  nav: {
    formate: "Formate",
    lage: "Lage",
    raeume: "Räume",
    catering: "Catering",
    cta: "Termin anfragen",
    brandAria: "STORIA – zur Startseite",
  },

  hero: {
    eyebrow: "Filmfest München 2026 · 26. Juni – 5. Juli",
    h1Pre: "Vom Roten Teppich zum Tisch in ",
    h1Em: "sechs Minuten.",
    sub: "Während das Festivalzentrum um die Ecke pulsiert, ist das STORIA Ihre Bühne danach: für Premierendinner, Verleiher-Empfänge, Cast-&-Crew-Abende und Branchen-Networking. Eigene Küche, überdachte Terrasse, alles aus einer Hand — mitten in der Maxvorstadt.",
    btnPrimary: "Verfügbarkeit sichern →",
    btnGhost: "Was wir ausrichten",
    heroImgAlt: "Cineastischer Dinner-Abend bei Kerzenlicht im Ristorante STORIA München",
  },

  stats: [
    { n: "6 Min.", l: "Fußweg zum Festivalzentrum Amerikahaus" },
    { n: "bis 300", l: "Plätze stehend · 200 Sitzplätze gesamt (Innen und außen)" },
    { n: "aus einer Hand", l: "Küche, Service & Eventplanung im Haus" },
    { n: "seit 2015", l: "Familie Speranza · 4,5★ aus 810 Google-Bewertungen" },
  ],

  intro: {
    pre: "Das Ristorante STORIA ist ein familiengeführtes italienisches Restaurant in der Karlstraße 47a, München Maxvorstadt — sechs Gehminuten vom Festivalzentrum Amerikahaus und damit eine Eventlocation für Premierendinner, Verleiher-Empfänge, Cast-&-Crew-Dinner und Branchen-Networking während des ",
    linkLabel: "Filmfest München 2026",
    post: " (26. Juni – 5. Juli 2026). Küche, Service und Eventplanung kommen aus einer Hand; bis zu 200 Gäste sitzend und 300 beim Stehempfang finden hier Platz.",
  },

  formateSection: {
    eyebrow: "Für die Branche gemacht",
    h2: "Zehn Festivaltage, ein Ort, an dem man sich trifft.",
    lead: "Premieren, Pitches, Pressetage, Empfänge — und der Hunger danach. Produktion, Verleih, Sales, Casting, Förderer und Redaktionen finden im STORIA den diskreten, repräsentativen Rahmen, der sich kurzfristig auf Ihre Festivalwoche abstimmen lässt.",
  },
  formate: [
    { num: "01", title: "Premierendinner", text: "Das gesetzte Dinner direkt nach dem Screening. Mehrgängiges Menü, eigener Bereich, Service, der den Abend trägt — ohne dass jemand auf die Uhr schaut." },
    { num: "02", title: "Verleiher- & Sales-Empfang", text: "Stehempfang mit Flying Buffet und Aperitivo-Bar. Raum für Gespräche, Deals und das Wiedersehen mit der halben Branche." },
    { num: "03", title: "Cast & Crew Dinner", text: "Das Team feiert seinen Film. Lange Tafel, italienische Herzlichkeit, späte Küche und ein Abend, der nach Festival schmeckt." },
    { num: "04", title: "Presse-Lunch & Junket", text: "Konzentriertes Mittagsformat zwischen zwei Terminen. Schnell, ruhig, mit separatem Bereich für Interviews und O-Töne." },
    { num: "05", title: "Branchen-Networking", text: "Förderer, Redaktionen, Allianzen, Nachwuchs — ein Empfang, zu dem man gern kommt, weil er nicht im Konferenzsaal stattfindet." },
    { num: "06", title: "Exklusiv-Anmietung", text: "Das ganze Haus für einen Abend. Innen, Terrasse, Bar — Ihr Logo, Ihr Ablauf, Ihre Gäste. Diskret und vollständig auf Sie zugeschnitten." },
  ],

  lageSection: {
    eyebrow: "Der eigentliche Hauptdarsteller",
    h2: "Mitten im Geschehen — nicht am Rand davon.",
    lead: "Das STORIA liegt in der Karlstraße 47a, im Kunstareal der Maxvorstadt. Vom Festivalzentrum, von den Pinakotheken und vom Königsplatz sind Sie in Minuten da. Internationale Gäste steigen am Hauptbahnhof aus und stehen fünf Minuten später bei Ihnen am Tisch.",
  },
  route: [
    { min: "6", place: "Festivalzentrum Amerikahaus", sub: "Karolinenplatz 3 — Herz der FilmTalks & Festival-Lounge" },
    { min: "3", place: "Königsplatz (U2)", sub: "Direktanbindung in die ganze Stadt" },
    { min: "5", place: "Hauptbahnhof München", sub: "S-Bahn, Fernverkehr, Flughafen-Anbindung" },
    { min: "0", place: "Tram Karlstraße (20/21/22/N20)", sub: "Hält direkt vor dem Haus — auch nachts" },
    { min: "7", place: "Pinakotheken & Kunstareal", sub: "Das kulturelle Umfeld des Festivals" },
  ],
  minLabel: " Min.",
  mapTitle: "STORIA · Karlstraße 47a, München",

  raeumeSection: {
    eyebrow: "Räume & Kapazitäten",
    h2: "Vom intimen Tisch bis zum großen Empfang.",
    lead: "Drei Bereiche, frei kombinierbar — teilexklusiv im laufenden Betrieb oder das ganze Haus für sich allein. Die überdachte Terrasse macht Sie unabhängig vom Münchner Sommerwetter.",
  },
  rooms: [
    { key: "innenraum", title: "Innenraum", cap: "bis 100 Sitzplätze", text: "Warmes Licht, italienisches Ambiente, ruhig genug fürs gesetzte Dinner. Ideal für Premieren- und Crew-Abende.", alt: "Innenraum des Ristorante STORIA München mit warmem Licht und italienischem Ambiente" },
    { key: "terrasse", title: "Innenhof-Terrasse", cap: "bis 100 Sitzplätze · überdacht", text: "Der Sommerabend draußen — wettergeschützt. Perfekt für Aperitivo-Empfänge und entspanntes Networking.", alt: "Überdachte Innenhof-Terrasse des STORIA München mit Gästen" },
    { key: "bar", title: "Bar & Private Room", cap: "separierbarer Bereich", text: "Eigene Bar für Aperitivo und Drinks, abtrennbarer Bereich für Interviews, Pitches oder die diskrete Runde.", alt: "Italienische Bar im STORIA München für Aperitivo und Drinks" },
  ],
  scenarioHead: { format: "Format", seating: "Bestuhlung", guests: "Empfohlene Gästezahl" },
  scenario: [
    ["Gesetztes Premierendinner", "Tafel / Bankett", "20 – 120 Gäste"],
    ["Stehempfang mit Flying Buffet", "Steh / Lounge", "bis 300 Gäste"],
    ["Presse-Lunch / Junket", "separierter Bereich", "10 – 40 Gäste"],
    ["Intimes Cast-Dinner", "Private Room", "6 – 24 Gäste"],
    ["Exklusiv-Anmietung (ganzes Haus)", "kombiniert", "bis 200 sitzend / 300 stehend"],
  ],

  cateringSection: {
    eyebrow: "Catering & Küche",
    h2: "Süditalien, das man im Raum riecht.",
    lead: "Küchenchef Domenico Speranza und sein Team kochen nach Familienrezepten aus dem Cilento. Keine Catering-Logistik von außen — alles entsteht im Haus und kommt frisch an den Tisch. Zwei Wege, Ihren Abend zu erzählen:",
  },
  menuCards: [
    {
      tag: "Für den Empfang",
      title: "Flying Buffet & Stationen",
      items: [
        "Antipasti-Stationen mit Burrata, Vitello, mariniertem Gemüse",
        "Neapolitanische Steinofenpizza, live aus dem 400°-Ofen",
        "Flying Finger Food — Arancini, Crostini, Fritto Misto",
        "Aperitivo-Bar: Spritz, italienische Weine, alkoholfrei",
      ],
    },
    {
      tag: "Für das Dinner",
      title: "Mehrgängiges Menü",
      items: [
        "Individuell abgestimmte 3- bis 5-Gang-Menüs",
        "Hausgemachte Gragnano-Pasta, Mittelmeerfisch, regionales Fleisch",
        "Kuratierte italienische Weinbegleitung",
        "Service, der den Takt des Abends hält — bis spät",
      ],
    },
  ],
  chips: ["Vegan auf Wunsch", "Glutenfreie Optionen", "Mehrsprachiger Service", "Späte Küche", "Menüs auf Englisch"],

  ablaufSection: {
    eyebrow: "So einfach wird es Ihrer",
    h2: "Vier Schritte bis zu Ihrem Festivalabend.",
  },
  steps: [
    { n: "1", title: "Anfrage", text: "Datum, Format, Gästezahl — kurz ins Formular oder direkt anrufen. Wir melden uns im Festivalzeitraum besonders schnell zurück." },
    { n: "2", title: "Beratung", text: "Wir klären Bereich, Exklusivität und Ablauf und schlagen die passende Raumlösung vor." },
    { n: "3", title: "Menü", text: "Gemeinsam stellen wir Buffet oder Menü zusammen — inklusive Wein, Diätwünschen und Timing." },
    { n: "4", title: "Ihr Abend", text: "Sie sind Gast auf der eigenen Veranstaltung. Wir kümmern uns um den Rest." },
  ],

  kontakt: {
    urgency: "Festivalzeitraum 26.6.–5.7. — Termine sind begehrt",
    h2: "Sichern Sie Ihren Abend, bevor es jemand anderes tut.",
    lead: "Zehn Tage, in denen die ganze Branche in München ist und jeder gute Tisch zählt. Sagen Sie uns Datum und Anlass — wir halten Ihnen den Bereich frei.",
    callLabel: "Direkt anrufen",
    mailLabel: "E-Mail",
    platformLabel: "Eventplattform",
    directionsLabel: "Anfahrt",
    directionsValue: "Karlstraße 47a · 80333 München",
    mailSubject: "Filmfest%20M%C3%BCnchen%202026%20%E2%80%93%20Eventanfrage",
  },

  faqSection: {
    eyebrow: "Häufige Fragen",
    h2: "Filmfest München 2026 im STORIA — kurz erklärt.",
  },
  faqItems: [
    {
      question: "Wo finde ich eine Eventlocation in der Nähe des Filmfest-Festivalzentrums?",
      answer:
        "Das Ristorante STORIA in der Karlstraße 47a, 80333 München, liegt nur sechs Gehminuten vom Festivalzentrum Amerikahaus (Karolinenplatz 3) entfernt — mitten im Kunstareal der Maxvorstadt. Königsplatz (U2) und Hauptbahnhof sind in drei bis fünf Minuten erreichbar, die Tram Karlstraße hält direkt vor dem Haus.",
    },
    {
      question: "Welche Veranstaltungsformate richtet das STORIA während des Filmfest München aus?",
      answer:
        "Das STORIA richtet sechs Festivalformate aus: Premierendinner, Verleiher- und Sales-Empfänge, Cast-&-Crew-Dinner, Presse-Lunch und Junkets, Branchen-Networking sowie die Exklusiv-Anmietung des gesamten Hauses. Küche, Service und Eventplanung kommen aus einer Hand.",
    },
    {
      question: "Für wie viele Gäste ist das STORIA geeignet?",
      answer:
        "Das STORIA bietet 100 Sitzplätze im Innenraum und 100 auf der überdachten Innenhof-Terrasse — insgesamt bis zu 200 sitzende Gäste. Beim Stehempfang mit Flying Buffet sind bis zu 300 Gäste möglich. Intime Cast-Dinner im Private Room funktionieren ab sechs Personen.",
    },
    {
      question: "Bietet das STORIA Catering für Cast-&-Crew-Dinner an?",
      answer:
        "Ja. Küchenchef Domenico Speranza und sein Team kochen süditalienisch nach Familienrezepten aus dem Cilento — alles entsteht im Haus, ohne externe Catering-Logistik. Zur Wahl stehen Flying Buffets mit Stationen (inkl. neapolitanischer Steinofenpizza aus dem 400-°C-Ofen) oder mehrgängige 3- bis 5-Gang-Menüs mit italienischer Weinbegleitung. Vegane und glutenfreie Optionen sind möglich.",
    },
    {
      question: "Wie kurzfristig kann ich im Festivalzeitraum einen Termin anfragen?",
      answer:
        "Im Festivalzeitraum vom 26. Juni bis 5. Juli 2026 reagiert das STORIA besonders schnell auf Anfragen. Geben Sie Datum, Format und Gästezahl über das Formular an oder rufen Sie direkt unter +49 89 51519696 an — der gewünschte Bereich wird kurzfristig freigehalten.",
    },
    {
      question: "Wann findet das Filmfest München 2026 statt?",
      answer:
        "Das Filmfest München 2026 findet vom 26. Juni bis 5. Juli 2026 statt — zehn Festivaltage mit Premieren, Pressetagen und Branchenempfängen. Das STORIA ist als Eventlocation in Gehweite des Festivalzentrums die Bühne für den Abend danach.",
    },
  ],

  disclaimerPre:
    "Eine Sonderseite zum Filmfest München (26. Juni – 5. Juli 2026). Filmfest München ist eine Veranstaltung der Internationale Münchner Filmwochen GmbH; diese Seite steht in keiner offiziellen Verbindung zum Festival. Offizielle Festivalinformationen unter ",
  disclaimerLinkLabel: "filmfest-muenchen.de",
  disclaimerPost: ".",
};

const en: FilmfestContent = {
  seo: {
    title: "Filmfest München 2026 — STORIA Event Venue",
    description:
      "Event venue 6 minutes' walk from the festival centre: premiere dinners, receptions & cast dinners at STORIA Munich during Filmfest 2026 (26 Jun–5 Jul). Up to 300 guests.",
  },
  breadcrumbLabel: "Filmfest München 2026",
  structuredEvent: {
    name: "Filmfest München 2026 — Event Evenings at Ristorante STORIA",
    description:
      "Premiere dinners, distributor & sales receptions, cast & crew dinners and industry networking at Ristorante STORIA Munich, six minutes' walk from the Amerikahaus festival centre, during Filmfest München 2026 (26 June to 5 July 2026).",
    services: [
      "Premiere Dinner",
      "Distributor & Sales Reception",
      "Cast & Crew Dinner",
      "Press Lunch & Junket",
      "Industry Networking",
      "Exclusive Hire",
    ],
  },

  nav: {
    formate: "Formats",
    lage: "Location",
    raeume: "Spaces",
    catering: "Catering",
    cta: "Request a date",
    brandAria: "STORIA – to the homepage",
  },

  hero: {
    eyebrow: "Filmfest München 2026 · 26 June – 5 July",
    h1Pre: "From the red carpet to the table in ",
    h1Em: "six minutes.",
    sub: "While the festival centre buzzes around the corner, STORIA is your stage for the evening after: premiere dinners, distributor receptions, cast & crew evenings and industry networking. Our own kitchen, a covered terrace, everything from a single hand — right in the heart of Maxvorstadt.",
    btnPrimary: "Secure availability →",
    btnGhost: "What we host",
    heroImgAlt: "Cinematic candlelit dinner evening at Ristorante STORIA Munich",
  },

  stats: [
    { n: "6 min", l: "Walk to the Amerikahaus festival centre" },
    { n: "up to 300", l: "Standing places · 200 seats in total (indoors and out)" },
    { n: "single hand", l: "Kitchen, service & event planning all in-house" },
    { n: "since 2015", l: "The Speranza family · 4.5★ from 810 Google reviews" },
  ],

  intro: {
    pre: "Ristorante STORIA is a family-run Italian restaurant at Karlstraße 47a, Munich Maxvorstadt — six minutes' walk from the Amerikahaus festival centre, and thus an event venue for premiere dinners, distributor receptions, cast & crew dinners and industry networking during ",
    linkLabel: "Filmfest München 2026",
    post: " (26 June – 5 July 2026). Kitchen, service and event planning come from a single hand; up to 200 guests seated and 300 for a standing reception find their place here.",
  },

  formateSection: {
    eyebrow: "Made for the industry",
    h2: "Ten festival days, one place where the industry meets.",
    lead: "Premieres, pitches, press days, receptions — and the appetite that follows. Production, distribution, sales, casting, funders and editorial teams find at STORIA the discreet, representative setting that adapts to your festival week at short notice.",
  },
  formate: [
    { num: "01", title: "Premiere Dinner", text: "The seated dinner straight after the screening. A multi-course menu, your own area, service that carries the whole evening — without anyone watching the clock." },
    { num: "02", title: "Distributor & Sales Reception", text: "A standing reception with flying buffet and aperitivo bar. Room for conversations, deals and reuniting with half the industry." },
    { num: "03", title: "Cast & Crew Dinner", text: "The team celebrates its film. One long table, Italian warmth, a late kitchen and an evening that tastes of the festival." },
    { num: "04", title: "Press Lunch & Junket", text: "A focused midday format between two appointments. Quick, calm, with a separate area for interviews and soundbites." },
    { num: "05", title: "Industry Networking", text: "Funders, editors, alliances, emerging talent — a reception people are glad to attend, precisely because it isn't held in a conference hall." },
    { num: "06", title: "Exclusive Hire", text: "The whole house for one evening. Indoors, terrace, bar — your logo, your running order, your guests. Discreet and tailored entirely to you." },
  ],

  lageSection: {
    eyebrow: "The real leading role",
    h2: "In the thick of it — not on the sidelines.",
    lead: "STORIA sits at Karlstraße 47a, in the Kunstareal arts district of Maxvorstadt. The festival centre, the Pinakotheken and Königsplatz are all minutes away. International guests step off at the Hauptbahnhof and are at your table five minutes later.",
  },
  route: [
    { min: "6", place: "Amerikahaus festival centre", sub: "Karolinenplatz 3 — heart of the FilmTalks & festival lounge" },
    { min: "3", place: "Königsplatz (U2)", sub: "Direct connection across the whole city" },
    { min: "5", place: "Munich Hauptbahnhof", sub: "S-Bahn, long-distance trains, airport link" },
    { min: "0", place: "Karlstraße tram (20/21/22/N20)", sub: "Stops right outside the door — even at night" },
    { min: "7", place: "Pinakotheken & Kunstareal", sub: "The festival's cultural surroundings" },
  ],
  minLabel: " min",
  mapTitle: "STORIA · Karlstraße 47a, Munich",

  raeumeSection: {
    eyebrow: "Spaces & capacities",
    h2: "From the intimate table to the grand reception.",
    lead: "Three areas, freely combined — semi-exclusive during regular service, or the whole house to yourself. The covered terrace keeps you independent of Munich's summer weather.",
  },
  rooms: [
    { key: "innenraum", title: "Indoor Room", cap: "up to 100 seats", text: "Warm light, Italian ambience, quiet enough for a seated dinner. Ideal for premiere and crew evenings.", alt: "Interior of Ristorante STORIA Munich with warm light and Italian ambience" },
    { key: "terrasse", title: "Courtyard Terrace", cap: "up to 100 seats · covered", text: "The summer evening outdoors — sheltered from the weather. Perfect for aperitivo receptions and relaxed networking.", alt: "Covered courtyard terrace at STORIA Munich with guests" },
    { key: "bar", title: "Bar & Private Room", cap: "separable area", text: "A dedicated bar for aperitivo and drinks, a partitionable area for interviews, pitches or the discreet inner circle.", alt: "Italian bar at STORIA Munich for aperitivo and drinks" },
  ],
  scenarioHead: { format: "Format", seating: "Seating", guests: "Recommended guests" },
  scenario: [
    ["Seated premiere dinner", "Banquet table", "20 – 120 guests"],
    ["Standing reception with flying buffet", "Standing / lounge", "up to 300 guests"],
    ["Press lunch / junket", "separate area", "10 – 40 guests"],
    ["Intimate cast dinner", "Private Room", "6 – 24 guests"],
    ["Exclusive hire (whole house)", "combined", "up to 200 seated / 300 standing"],
  ],

  cateringSection: {
    eyebrow: "Catering & kitchen",
    h2: "Southern Italy you can smell across the room.",
    lead: "Head chef Domenico Speranza and his team cook to family recipes from the Cilento. No outside catering logistics — everything is made in-house and reaches the table fresh. Two ways to tell the story of your evening:",
  },
  menuCards: [
    {
      tag: "For the reception",
      title: "Flying Buffet & Stations",
      items: [
        "Antipasti stations with burrata, vitello, marinated vegetables",
        "Neapolitan wood-fired pizza, live from the 400° oven",
        "Flying finger food — arancini, crostini, fritto misto",
        "Aperitivo bar: spritz, Italian wines, alcohol-free options",
      ],
    },
    {
      tag: "For the dinner",
      title: "Multi-course Menu",
      items: [
        "Individually tailored 3- to 5-course menus",
        "House-made Gragnano pasta, Mediterranean fish, regional meat",
        "Curated Italian wine pairing",
        "Service that keeps the evening's rhythm — until late",
      ],
    },
  ],
  chips: ["Vegan on request", "Gluten-free options", "Multilingual service", "Late kitchen", "Menus in English"],

  ablaufSection: {
    eyebrow: "This is how it becomes yours",
    h2: "Four steps to your festival evening.",
  },
  steps: [
    { n: "1", title: "Enquiry", text: "Date, format, number of guests — a quick note via the form or a direct call. During the festival we reply especially fast." },
    { n: "2", title: "Consultation", text: "We clarify the area, exclusivity and running order, and propose the right room solution." },
    { n: "3", title: "Menu", text: "Together we put together the buffet or menu — including wine, dietary wishes and timing." },
    { n: "4", title: "Your evening", text: "You are a guest at your own event. We take care of the rest." },
  ],

  kontakt: {
    urgency: "Festival period 26 Jun–5 Jul — dates are in demand",
    h2: "Secure your evening before someone else does.",
    lead: "Ten days in which the whole industry is in Munich and every good table counts. Tell us the date and the occasion — we'll hold the area for you.",
    callLabel: "Call us directly",
    mailLabel: "Email",
    platformLabel: "Event platform",
    directionsLabel: "Getting here",
    directionsValue: "Karlstraße 47a · 80333 Munich",
    mailSubject: "Filmfest%20M%C3%BCnchen%202026%20%E2%80%93%20Event%20enquiry",
  },

  faqSection: {
    eyebrow: "Frequently asked",
    h2: "Filmfest München 2026 at STORIA — briefly explained.",
  },
  faqItems: [
    {
      question: "Where can I find an event venue near the Filmfest festival centre?",
      answer:
        "Ristorante STORIA at Karlstraße 47a, 80333 Munich, is just six minutes' walk from the Amerikahaus festival centre (Karolinenplatz 3) — right in the Kunstareal arts district of Maxvorstadt. Königsplatz (U2) and the Hauptbahnhof are three to five minutes away, and the Karlstraße tram stops right outside the door.",
    },
    {
      question: "Which event formats does STORIA host during Filmfest München?",
      answer:
        "STORIA hosts six festival formats: premiere dinners, distributor and sales receptions, cast & crew dinners, press lunches and junkets, industry networking, and the exclusive hire of the entire house. Kitchen, service and event planning all come from a single hand.",
    },
    {
      question: "How many guests can STORIA accommodate?",
      answer:
        "STORIA offers 100 seats indoors and 100 on the covered courtyard terrace — up to 200 seated guests in total. For a standing reception with a flying buffet, up to 300 guests are possible. Intimate cast dinners in the Private Room work from six people upwards.",
    },
    {
      question: "Does STORIA offer catering for cast & crew dinners?",
      answer:
        "Yes. Head chef Domenico Speranza and his team cook southern Italian food to family recipes from the Cilento — everything is made in-house, without external catering logistics. The choice ranges from flying buffets with stations (including Neapolitan wood-fired pizza from the 400 °C oven) to multi-course 3- to 5-course menus with Italian wine pairing. Vegan and gluten-free options are available.",
    },
    {
      question: "How short-notice can I request a date during the festival period?",
      answer:
        "During the festival period from 26 June to 5 July 2026, STORIA responds especially quickly to enquiries. Give us the date, format and number of guests via the form, or call directly on +49 89 51519696 — the desired area can be held at short notice.",
    },
    {
      question: "When does Filmfest München 2026 take place?",
      answer:
        "Filmfest München 2026 runs from 26 June to 5 July 2026 — ten festival days of premieres, press days and industry receptions. As an event venue within walking distance of the festival centre, STORIA is the stage for the evening after.",
    },
  ],

  disclaimerPre:
    "A special page for Filmfest München (26 June – 5 July 2026). Filmfest München is an event organised by Internationale Münchner Filmwochen GmbH; this page has no official affiliation with the festival. Official festival information at ",
  disclaimerLinkLabel: "filmfest-muenchen.de",
  disclaimerPost: ".",
};

const it: FilmfestContent = {
  seo: {
    title: "Filmfest München 2026 — Location Eventi STORIA",
    description:
      "Location a 6 minuti a piedi dal centro del festival: cene di premiere, ricevimenti e cene per cast allo STORIA di Monaco durante il Filmfest 2026 (26.6–5.7). Fino a 300 ospiti.",
  },
  breadcrumbLabel: "Filmfest München 2026",
  structuredEvent: {
    name: "Filmfest München 2026 — Serate-evento al Ristorante STORIA",
    description:
      "Cene di premiere, ricevimenti per distributori e sales, cene per cast & crew e networking di settore al Ristorante STORIA di Monaco di Baviera, a sei minuti a piedi dal centro del festival Amerikahaus, durante il Filmfest München 2026 (dal 26 giugno al 5 luglio 2026).",
    services: [
      "Cena di premiere",
      "Ricevimento distributori & sales",
      "Cena cast & crew",
      "Pranzo stampa & junket",
      "Networking di settore",
      "Affitto esclusivo",
    ],
  },

  nav: {
    formate: "Formati",
    lage: "Posizione",
    raeume: "Spazi",
    catering: "Catering",
    cta: "Richiedi una data",
    brandAria: "STORIA – alla homepage",
  },

  hero: {
    eyebrow: "Filmfest München 2026 · 26 giugno – 5 luglio",
    h1Pre: "Dal red carpet alla tavola in ",
    h1Em: "sei minuti.",
    sub: "Mentre il centro del festival pulsa dietro l'angolo, lo STORIA è il vostro palcoscenico per la serata che segue: cene di premiere, ricevimenti per distributori, serate per cast & crew e networking di settore. Cucina propria, terrazza coperta, tutto da un'unica regia — nel cuore della Maxvorstadt.",
    btnPrimary: "Assicurati la disponibilità →",
    btnGhost: "Cosa organizziamo",
    heroImgAlt: "Serata cinematografica a lume di candela al Ristorante STORIA di Monaco",
  },

  stats: [
    { n: "6 min", l: "A piedi fino al centro del festival Amerikahaus" },
    { n: "fino a 300", l: "Posti in piedi · 200 posti a sedere in totale (interno ed esterno)" },
    { n: "un'unica regia", l: "Cucina, servizio e organizzazione eventi in casa" },
    { n: "dal 2015", l: "Famiglia Speranza · 4,5★ su 810 recensioni Google" },
  ],

  intro: {
    pre: "Il Ristorante STORIA è un ristorante italiano a conduzione familiare in Karlstraße 47a, nella Maxvorstadt di Monaco di Baviera — a sei minuti a piedi dal centro del festival Amerikahaus, e quindi una location per cene di premiere, ricevimenti per distributori, cene per cast & crew e networking di settore durante il ",
    linkLabel: "Filmfest München 2026",
    post: " (26 giugno – 5 luglio 2026). Cucina, servizio e organizzazione eventi arrivano da un'unica regia; trovano posto fino a 200 ospiti seduti e 300 con ricevimento in piedi.",
  },

  formateSection: {
    eyebrow: "Pensato per il settore",
    h2: "Dieci giorni di festival, un luogo dove ci si incontra.",
    lead: "Premiere, pitch, giornate stampa, ricevimenti — e la fame che ne segue. Produzione, distribuzione, sales, casting, finanziatori e redazioni trovano allo STORIA la cornice discreta e rappresentativa, modulabile con breve preavviso sulla vostra settimana di festival.",
  },
  formate: [
    { num: "01", title: "Cena di premiere", text: "La cena seduta subito dopo la proiezione. Menu a più portate, area riservata, un servizio che regge tutta la serata — senza che nessuno guardi l'orologio." },
    { num: "02", title: "Ricevimento distributori & sales", text: "Ricevimento in piedi con flying buffet e bar aperitivo. Spazio per conversazioni, accordi e per ritrovare metà del settore." },
    { num: "03", title: "Cena cast & crew", text: "La squadra festeggia il suo film. Una lunga tavolata, calore italiano, cucina fino a tardi e una serata che sa di festival." },
    { num: "04", title: "Pranzo stampa & junket", text: "Un formato di mezzogiorno concentrato tra due appuntamenti. Veloce, tranquillo, con un'area separata per interviste e dichiarazioni." },
    { num: "05", title: "Networking di settore", text: "Finanziatori, redazioni, alleanze, nuovi talenti — un ricevimento a cui si viene volentieri, proprio perché non si tiene in una sala conferenze." },
    { num: "06", title: "Affitto esclusivo", text: "Tutta la casa per una serata. Interno, terrazza, bar — il vostro logo, il vostro programma, i vostri ospiti. Discreto e interamente su misura per voi." },
  ],

  lageSection: {
    eyebrow: "Il vero protagonista",
    h2: "Nel cuore dell'azione — non ai suoi margini.",
    lead: "Lo STORIA si trova in Karlstraße 47a, nel distretto artistico Kunstareal della Maxvorstadt. Dal centro del festival, dalle Pinakotheken e dal Königsplatz siete qui in pochi minuti. Gli ospiti internazionali scendono alla stazione centrale e cinque minuti dopo sono alla vostra tavola.",
  },
  route: [
    { min: "6", place: "Centro del festival Amerikahaus", sub: "Karolinenplatz 3 — cuore dei FilmTalks & della festival lounge" },
    { min: "3", place: "Königsplatz (U2)", sub: "Collegamento diretto con tutta la città" },
    { min: "5", place: "Stazione centrale di Monaco", sub: "S-Bahn, alta velocità, collegamento aeroporto" },
    { min: "0", place: "Tram Karlstraße (20/21/22/N20)", sub: "Ferma proprio davanti alla porta — anche di notte" },
    { min: "7", place: "Pinakotheken & Kunstareal", sub: "Il contesto culturale del festival" },
  ],
  minLabel: " min",
  mapTitle: "STORIA · Karlstraße 47a, Monaco di Baviera",

  raeumeSection: {
    eyebrow: "Spazi & capienze",
    h2: "Dalla tavola intima al grande ricevimento.",
    lead: "Tre aree, liberamente combinabili — in semi-esclusiva durante il servizio o tutta la casa solo per voi. La terrazza coperta vi rende indipendenti dal clima estivo di Monaco.",
  },
  rooms: [
    { key: "innenraum", title: "Sala interna", cap: "fino a 100 posti", text: "Luce calda, atmosfera italiana, abbastanza tranquilla per una cena seduta. Ideale per serate di premiere e crew.", alt: "Sala interna del Ristorante STORIA di Monaco con luce calda e atmosfera italiana" },
    { key: "terrasse", title: "Terrazza nel cortile", cap: "fino a 100 posti · coperta", text: "La serata estiva all'aperto — al riparo dal meteo. Perfetta per ricevimenti aperitivo e networking rilassato.", alt: "Terrazza coperta nel cortile dello STORIA di Monaco con ospiti" },
    { key: "bar", title: "Bar & Private Room", cap: "area separabile", text: "Un bar dedicato per aperitivi e drink, un'area divisibile per interviste, pitch o il giro più riservato.", alt: "Bar italiano allo STORIA di Monaco per aperitivi e drink" },
  ],
  scenarioHead: { format: "Formato", seating: "Disposizione", guests: "Ospiti consigliati" },
  scenario: [
    ["Cena di premiere seduta", "Tavolata / banchetto", "20 – 120 ospiti"],
    ["Ricevimento in piedi con flying buffet", "In piedi / lounge", "fino a 300 ospiti"],
    ["Pranzo stampa / junket", "area separata", "10 – 40 ospiti"],
    ["Cena cast intima", "Private Room", "6 – 24 ospiti"],
    ["Affitto esclusivo (tutta la casa)", "combinato", "fino a 200 seduti / 300 in piedi"],
  ],

  cateringSection: {
    eyebrow: "Catering & cucina",
    h2: "Il Sud Italia che si sente nell'aria.",
    lead: "Lo chef Domenico Speranza e il suo team cucinano secondo ricette di famiglia del Cilento. Nessuna logistica di catering esterna — tutto nasce in casa e arriva fresco in tavola. Due modi per raccontare la vostra serata:",
  },
  menuCards: [
    {
      tag: "Per il ricevimento",
      title: "Flying buffet & postazioni",
      items: [
        "Postazioni di antipasti con burrata, vitello, verdure marinate",
        "Pizza napoletana nel forno a legna, dal vivo dal forno a 400°",
        "Flying finger food — arancini, crostini, fritto misto",
        "Bar aperitivo: spritz, vini italiani, analcolici",
      ],
    },
    {
      tag: "Per la cena",
      title: "Menu a più portate",
      items: [
        "Menu da 3 a 5 portate, su misura",
        "Pasta di Gragnano fatta in casa, pesce del Mediterraneo, carne regionale",
        "Abbinamento di vini italiani curato",
        "Un servizio che tiene il ritmo della serata — fino a tardi",
      ],
    },
  ],
  chips: ["Vegano su richiesta", "Opzioni senza glutine", "Servizio multilingue", "Cucina fino a tardi", "Menu in inglese"],

  ablaufSection: {
    eyebrow: "Così diventa la vostra",
    h2: "Quattro passi verso la vostra serata di festival.",
  },
  steps: [
    { n: "1", title: "Richiesta", text: "Data, formato, numero di ospiti — due righe nel modulo o una telefonata diretta. Nel periodo del festival rispondiamo con particolare rapidità." },
    { n: "2", title: "Consulenza", text: "Definiamo area, esclusività e svolgimento e proponiamo la soluzione di spazio più adatta." },
    { n: "3", title: "Menu", text: "Insieme componiamo buffet o menu — inclusi vino, esigenze alimentari e tempistiche." },
    { n: "4", title: "La vostra serata", text: "Siete ospiti al vostro stesso evento. Al resto pensiamo noi." },
  ],

  kontakt: {
    urgency: "Periodo del festival 26.6–5.7 — le date sono richieste",
    h2: "Assicuratevi la vostra serata prima che lo faccia qualcun altro.",
    lead: "Dieci giorni in cui tutto il settore è a Monaco e ogni buon tavolo conta. Diteci data e occasione — vi terremo libera l'area.",
    callLabel: "Chiama direttamente",
    mailLabel: "E-mail",
    platformLabel: "Piattaforma eventi",
    directionsLabel: "Come arrivare",
    directionsValue: "Karlstraße 47a · 80333 Monaco di Baviera",
    mailSubject: "Filmfest%20M%C3%BCnchen%202026%20%E2%80%93%20Richiesta%20evento",
  },

  faqSection: {
    eyebrow: "Domande frequenti",
    h2: "Filmfest München 2026 allo STORIA — in breve.",
  },
  faqItems: [
    {
      question: "Dove trovo una location per eventi vicino al centro del Filmfest?",
      answer:
        "Il Ristorante STORIA in Karlstraße 47a, 80333 Monaco di Baviera, si trova a soli sei minuti a piedi dal centro del festival Amerikahaus (Karolinenplatz 3) — nel cuore del distretto artistico Kunstareal della Maxvorstadt. Königsplatz (U2) e la stazione centrale sono raggiungibili in tre-cinque minuti, e il tram della Karlstraße ferma proprio davanti alla porta.",
    },
    {
      question: "Quali formati di evento organizza lo STORIA durante il Filmfest München?",
      answer:
        "Lo STORIA organizza sei formati di festival: cene di premiere, ricevimenti per distributori e sales, cene cast & crew, pranzi stampa e junket, networking di settore e l'affitto esclusivo dell'intera casa. Cucina, servizio e organizzazione eventi arrivano da un'unica regia.",
    },
    {
      question: "Per quanti ospiti è adatto lo STORIA?",
      answer:
        "Lo STORIA offre 100 posti a sedere nella sala interna e 100 sulla terrazza coperta del cortile — in totale fino a 200 ospiti seduti. Con il ricevimento in piedi e flying buffet sono possibili fino a 300 ospiti. Le cene cast intime nel Private Room funzionano a partire da sei persone.",
    },
    {
      question: "Lo STORIA offre catering per cene cast & crew?",
      answer:
        "Sì. Lo chef Domenico Speranza e il suo team cucinano piatti del Sud Italia secondo ricette di famiglia del Cilento — tutto nasce in casa, senza logistica di catering esterna. Si può scegliere tra flying buffet con postazioni (inclusa la pizza napoletana nel forno a legna a 400 °C) o menu a più portate da 3 a 5 portate con abbinamento di vini italiani. Sono disponibili opzioni vegane e senza glutine.",
    },
    {
      question: "Con quanto anticipo posso richiedere una data nel periodo del festival?",
      answer:
        "Nel periodo del festival, dal 26 giugno al 5 luglio 2026, lo STORIA risponde con particolare rapidità alle richieste. Indicate data, formato e numero di ospiti tramite il modulo oppure chiamate direttamente al +49 89 51519696 — l'area desiderata viene tenuta libera con breve preavviso.",
    },
    {
      question: "Quando si svolge il Filmfest München 2026?",
      answer:
        "Il Filmfest München 2026 si svolge dal 26 giugno al 5 luglio 2026 — dieci giorni di festival con premiere, giornate stampa e ricevimenti di settore. Come location a pochi passi dal centro del festival, lo STORIA è il palcoscenico per la serata che segue.",
    },
  ],

  disclaimerPre:
    "Una pagina speciale dedicata al Filmfest München (26 giugno – 5 luglio 2026). Il Filmfest München è un evento della Internationale Münchner Filmwochen GmbH; questa pagina non ha alcun legame ufficiale con il festival. Informazioni ufficiali sul festival su ",
  disclaimerLinkLabel: "filmfest-muenchen.de",
  disclaimerPost: ".",
};

const fr: FilmfestContent = {
  seo: {
    title: "Filmfest München 2026 — Lieu d'Événement STORIA",
    description:
      "Lieu à 6 minutes à pied du centre du festival : dîners de première, réceptions et dîners d'équipe au STORIA Munich pendant le Filmfest 2026 (26.6–5.7). Jusqu'à 300 invités.",
  },
  breadcrumbLabel: "Filmfest München 2026",
  structuredEvent: {
    name: "Filmfest München 2026 — Soirées-événements au Ristorante STORIA",
    description:
      "Dîners de première, réceptions distributeurs & sales, dîners cast & crew et networking professionnel au Ristorante STORIA Munich, à six minutes à pied du centre du festival Amerikahaus, pendant le Filmfest München 2026 (du 26 juin au 5 juillet 2026).",
    services: [
      "Dîner de première",
      "Réception distributeurs & sales",
      "Dîner cast & crew",
      "Déjeuner presse & junket",
      "Networking professionnel",
      "Privatisation exclusive",
    ],
  },

  nav: {
    formate: "Formats",
    lage: "Emplacement",
    raeume: "Espaces",
    catering: "Traiteur",
    cta: "Demander une date",
    brandAria: "STORIA – vers la page d'accueil",
  },

  hero: {
    eyebrow: "Filmfest München 2026 · 26 juin – 5 juillet",
    h1Pre: "Du tapis rouge à la table en ",
    h1Em: "six minutes.",
    sub: "Tandis que le centre du festival vibre au coin de la rue, le STORIA est votre scène pour la soirée d'après : dîners de première, réceptions distributeurs, soirées cast & crew et networking professionnel. Cuisine maison, terrasse couverte, tout d'une seule main — au cœur de la Maxvorstadt.",
    btnPrimary: "Réserver la disponibilité →",
    btnGhost: "Ce que nous organisons",
    heroImgAlt: "Soirée dîner cinématographique aux chandelles au Ristorante STORIA Munich",
  },

  stats: [
    { n: "6 min", l: "À pied jusqu'au centre du festival Amerikahaus" },
    { n: "jusqu'à 300", l: "Places debout · 200 places assises au total (intérieur et extérieur)" },
    { n: "d'une seule main", l: "Cuisine, service & organisation d'événements en interne" },
    { n: "depuis 2015", l: "Famille Speranza · 4,5★ sur 810 avis Google" },
  ],

  intro: {
    pre: "Le Ristorante STORIA est un restaurant italien familial situé Karlstraße 47a, dans la Maxvorstadt de Munich — à six minutes à pied du centre du festival Amerikahaus, et donc un lieu d'événement pour dîners de première, réceptions distributeurs, dîners cast & crew et networking professionnel pendant le ",
    linkLabel: "Filmfest München 2026",
    post: " (26 juin – 5 juillet 2026). Cuisine, service et organisation viennent d'une seule main ; jusqu'à 200 invités assis et 300 en réception debout trouvent ici leur place.",
  },

  formateSection: {
    eyebrow: "Pensé pour la profession",
    h2: "Dix jours de festival, un lieu où l'on se retrouve.",
    lead: "Premières, pitchs, journées presse, réceptions — et l'appétit qui suit. Production, distribution, sales, casting, financeurs et rédactions trouvent au STORIA le cadre discret et représentatif, ajustable à court terme à votre semaine de festival.",
  },
  formate: [
    { num: "01", title: "Dîner de première", text: "Le dîner assis juste après la projection. Menu à plusieurs services, espace dédié, un service qui porte toute la soirée — sans que personne ne regarde l'horloge." },
    { num: "02", title: "Réception distributeurs & sales", text: "Réception debout avec flying buffet et bar à aperitivo. De l'espace pour les conversations, les accords et les retrouvailles avec la moitié de la profession." },
    { num: "03", title: "Dîner cast & crew", text: "L'équipe célèbre son film. Une longue tablée, la chaleur italienne, une cuisine tardive et une soirée au goût de festival." },
    { num: "04", title: "Déjeuner presse & junket", text: "Un format de midi concentré entre deux rendez-vous. Rapide, calme, avec un espace séparé pour les interviews et les déclarations." },
    { num: "05", title: "Networking professionnel", text: "Financeurs, rédactions, alliances, jeunes talents — une réception à laquelle on vient volontiers, justement parce qu'elle n'a pas lieu dans une salle de conférence." },
    { num: "06", title: "Privatisation exclusive", text: "Toute la maison pour une soirée. Intérieur, terrasse, bar — votre logo, votre déroulé, vos invités. Discret et entièrement taillé pour vous." },
  ],

  lageSection: {
    eyebrow: "Le véritable premier rôle",
    h2: "Au cœur de l'action — pas en marge.",
    lead: "Le STORIA se situe Karlstraße 47a, dans le quartier des arts Kunstareal de la Maxvorstadt. Du centre du festival, des Pinakotheken et du Königsplatz, vous y êtes en quelques minutes. Les invités internationaux descendent à la gare centrale et sont à votre table cinq minutes plus tard.",
  },
  route: [
    { min: "6", place: "Centre du festival Amerikahaus", sub: "Karolinenplatz 3 — cœur des FilmTalks & du festival lounge" },
    { min: "3", place: "Königsplatz (U2)", sub: "Liaison directe vers toute la ville" },
    { min: "5", place: "Gare centrale de Munich", sub: "S-Bahn, grandes lignes, liaison aéroport" },
    { min: "0", place: "Tram Karlstraße (20/21/22/N20)", sub: "S'arrête juste devant la porte — même la nuit" },
    { min: "7", place: "Pinakotheken & Kunstareal", sub: "L'environnement culturel du festival" },
  ],
  minLabel: " min",
  mapTitle: "STORIA · Karlstraße 47a, Munich",

  raeumeSection: {
    eyebrow: "Espaces & capacités",
    h2: "De la table intime à la grande réception.",
    lead: "Trois espaces, librement combinables — en semi-exclusivité pendant le service ou toute la maison rien que pour vous. La terrasse couverte vous rend indépendant de la météo estivale munichoise.",
  },
  rooms: [
    { key: "innenraum", title: "Salle intérieure", cap: "jusqu'à 100 places", text: "Lumière chaude, ambiance italienne, assez calme pour un dîner assis. Idéale pour les soirées de première et d'équipe.", alt: "Salle intérieure du Ristorante STORIA Munich avec lumière chaude et ambiance italienne" },
    { key: "terrasse", title: "Terrasse de la cour", cap: "jusqu'à 100 places · couverte", text: "La soirée d'été en plein air — à l'abri des intempéries. Parfaite pour les réceptions aperitivo et un networking détendu.", alt: "Terrasse couverte de la cour du STORIA Munich avec des invités" },
    { key: "bar", title: "Bar & Private Room", cap: "espace séparable", text: "Un bar dédié à l'aperitivo et aux cocktails, un espace cloisonnable pour les interviews, les pitchs ou le cercle plus discret.", alt: "Bar italien au STORIA Munich pour aperitivo et cocktails" },
  ],
  scenarioHead: { format: "Format", seating: "Disposition", guests: "Nombre d'invités conseillé" },
  scenario: [
    ["Dîner de première assis", "Tablée / banquet", "20 – 120 invités"],
    ["Réception debout avec flying buffet", "Debout / lounge", "jusqu'à 300 invités"],
    ["Déjeuner presse / junket", "espace séparé", "10 – 40 invités"],
    ["Dîner cast intime", "Private Room", "6 – 24 invités"],
    ["Privatisation exclusive (toute la maison)", "combiné", "jusqu'à 200 assis / 300 debout"],
  ],

  cateringSection: {
    eyebrow: "Traiteur & cuisine",
    h2: "Le Sud de l'Italie qui embaume la salle.",
    lead: "Le chef Domenico Speranza et son équipe cuisinent selon des recettes de famille du Cilento. Aucune logistique traiteur externe — tout est préparé en interne et arrive frais à table. Deux façons de raconter votre soirée :",
  },
  menuCards: [
    {
      tag: "Pour la réception",
      title: "Flying buffet & stations",
      items: [
        "Stations d'antipasti avec burrata, vitello, légumes marinés",
        "Pizza napolitaine au four à bois, en direct du four à 400°",
        "Flying finger food — arancini, crostini, fritto misto",
        "Bar à aperitivo : spritz, vins italiens, sans alcool",
      ],
    },
    {
      tag: "Pour le dîner",
      title: "Menu à plusieurs services",
      items: [
        "Menus de 3 à 5 services, composés sur mesure",
        "Pâtes de Gragnano maison, poisson de Méditerranée, viande régionale",
        "Accord de vins italiens soigneusement choisi",
        "Un service qui tient le tempo de la soirée — jusque tard",
      ],
    },
  ],
  chips: ["Végan sur demande", "Options sans gluten", "Service multilingue", "Cuisine tardive", "Menus en anglais"],

  ablaufSection: {
    eyebrow: "Voilà comment elle devient la vôtre",
    h2: "Quatre étapes jusqu'à votre soirée de festival.",
  },
  steps: [
    { n: "1", title: "Demande", text: "Date, format, nombre d'invités — un mot rapide via le formulaire ou un appel direct. Pendant le festival, nous répondons particulièrement vite." },
    { n: "2", title: "Conseil", text: "Nous précisons l'espace, l'exclusivité et le déroulé, et proposons la solution d'espace adaptée." },
    { n: "3", title: "Menu", text: "Ensemble, nous composons le buffet ou le menu — vin, exigences alimentaires et timing inclus." },
    { n: "4", title: "Votre soirée", text: "Vous êtes invité à votre propre événement. Nous nous occupons du reste." },
  ],

  kontakt: {
    urgency: "Période du festival 26.6–5.7 — les dates sont prisées",
    h2: "Réservez votre soirée avant que quelqu'un d'autre ne le fasse.",
    lead: "Dix jours pendant lesquels toute la profession est à Munich et où chaque bonne table compte. Dites-nous la date et l'occasion — nous vous gardons l'espace.",
    callLabel: "Appeler directement",
    mailLabel: "E-mail",
    platformLabel: "Plateforme d'événements",
    directionsLabel: "Accès",
    directionsValue: "Karlstraße 47a · 80333 Munich",
    mailSubject: "Filmfest%20M%C3%BCnchen%202026%20%E2%80%93%20Demande%20d%27%C3%A9v%C3%A9nement",
  },

  faqSection: {
    eyebrow: "Questions fréquentes",
    h2: "Filmfest München 2026 au STORIA — en bref.",
  },
  faqItems: [
    {
      question: "Où trouver un lieu d'événement près du centre du Filmfest ?",
      answer:
        "Le Ristorante STORIA, Karlstraße 47a, 80333 Munich, se trouve à seulement six minutes à pied du centre du festival Amerikahaus (Karolinenplatz 3) — au cœur du quartier des arts Kunstareal de la Maxvorstadt. Le Königsplatz (U2) et la gare centrale sont accessibles en trois à cinq minutes, et le tram de la Karlstraße s'arrête juste devant la porte.",
    },
    {
      question: "Quels formats d'événement le STORIA organise-t-il pendant le Filmfest München ?",
      answer:
        "Le STORIA organise six formats de festival : dîners de première, réceptions distributeurs et sales, dîners cast & crew, déjeuners presse et junkets, networking professionnel ainsi que la privatisation exclusive de toute la maison. Cuisine, service et organisation viennent d'une seule main.",
    },
    {
      question: "Pour combien d'invités le STORIA est-il adapté ?",
      answer:
        "Le STORIA offre 100 places assises en salle intérieure et 100 sur la terrasse couverte de la cour — soit jusqu'à 200 invités assis au total. Pour une réception debout avec flying buffet, jusqu'à 300 invités sont possibles. Les dîners cast intimes dans le Private Room fonctionnent à partir de six personnes.",
    },
    {
      question: "Le STORIA propose-t-il un traiteur pour les dîners cast & crew ?",
      answer:
        "Oui. Le chef Domenico Speranza et son équipe cuisinent une cuisine du Sud de l'Italie selon des recettes de famille du Cilento — tout est préparé en interne, sans logistique traiteur externe. Au choix : des flying buffets avec stations (dont la pizza napolitaine au four à bois à 400 °C) ou des menus de 3 à 5 services avec accord de vins italiens. Des options véganes et sans gluten sont possibles.",
    },
    {
      question: "Avec quel délai puis-je demander une date pendant la période du festival ?",
      answer:
        "Pendant la période du festival, du 26 juin au 5 juillet 2026, le STORIA répond particulièrement vite aux demandes. Indiquez la date, le format et le nombre d'invités via le formulaire ou appelez directement au +49 89 51519696 — l'espace souhaité est réservé à court terme.",
    },
    {
      question: "Quand a lieu le Filmfest München 2026 ?",
      answer:
        "Le Filmfest München 2026 se déroule du 26 juin au 5 juillet 2026 — dix jours de festival avec premières, journées presse et réceptions professionnelles. En tant que lieu d'événement à quelques pas du centre du festival, le STORIA est la scène de la soirée d'après.",
    },
  ],

  disclaimerPre:
    "Une page spéciale consacrée au Filmfest München (26 juin – 5 juillet 2026). Le Filmfest München est un événement organisé par Internationale Münchner Filmwochen GmbH ; cette page n'a aucun lien officiel avec le festival. Informations officielles sur le festival sur ",
  disclaimerLinkLabel: "filmfest-muenchen.de",
  disclaimerPost: ".",
};

export const filmfestContent = { de, en, it, fr } satisfies Record<Language, FilmfestContent>;
