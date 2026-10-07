import type { Language } from "@/contexts/LanguageContext";
import { FACTS } from "@/config/facts";

/**
 * Inhalte /public-viewing-muenchen/ (Phase „Vorlauf“ bis zum EM-2028-Spielplan).
 * Konzept: entwuerfe/konzept-em2028-wm2030.md, Mockup v3 freigegeben 07.10.2026.
 * Fakten (Termine, Stadien, Ergebnisse) geprüft 07.10.2026, siehe src/config/turniere.ts.
 * Kapazität nur aus FACTS.
 */

const STAND = FACTS.capacity.standing; // 200
const SITZ = FACTS.capacity.indoorSeats; // 100
const AUSSEN = FACTS.publicViewing.terrasseAussen; // 100

interface FaqItem {
  question: string;
  answer: string;
}
type Row = [string, string];

export interface PvContent {
  seo: { title: string; description: string; ogAlt: string };
  breadcrumb: string;
  hero: { eyebrow: string; h1Pre: string; h1Em: string; intro: string; ctaReserve: string; ctaWhatsapp: string };
  toc: { label: string; items: Row[] };
  wm2026: { kicker: string; h2: string; body: string; figcaption: string; h3: string; results: Row[]; grazie: string };
  y2027: { kicker: string; h2: string; body: string; facts: Row[]; src: string };
  em2028: {
    kicker: string;
    h2: string;
    cd: { label: string; range: string; daysLeft: string; running: string };
    body: string;
    fans?: { title: string; text: string };
    h3Hosts: string;
    hosts: Row[];
    h3Dates: string;
    dates: Row[];
    h3Venues: string;
    venues: Row[];
    src: string;
    ctaText: string;
    ctaButton: string;
  };
  wm2030: { kicker: string; h2: string; body: string; hosts: Row[]; src: string };
  restaurant: {
    h2: string;
    body: string;
    h3Reserve: string;
    reserveHint: string;
    h3Groups: string;
    groups: string;
    groupsLink: string;
  };
  newsletter: { h2: string; body: string };
  anfahrt: { h2: string; body: string; hbfPre: string; hbfAnchor: string; hbfPost: string };
  kurz: { h2: string; items: string[] };
  faq: { h2: string; items: FaqItem[]; disclaimer: string };
}

const VENUES: Row[] = [
  ["Cardiff", "National Stadium of Wales"],
  ["Dublin", "Dublin Arena"],
  ["Glasgow", "Hampden Park"],
  ["Newcastle", "St James' Park"],
  ["Manchester", "Manchester City Stadium"],
  ["Liverpool", "Everton Stadium"],
  ["Birmingham", "Villa Park"],
  ["London", "Tottenham Hotspur Stadium"],
  ["London", "Wembley-Stadion"],
];
const venues = (london: string, wembley: string, dublin = "Dublin"): Row[] =>
  VENUES.map(([c, s]) => [
    c === "London" ? london : c === "Dublin" ? dublin : c,
    s === "Wembley-Stadion" ? wembley : s,
  ]);

const de: PvContent = {
  seo: {
    title: "Public Viewing München – Fußball live im STORIA",
    description:
      "Public Viewing in der Maxvorstadt, wenige Minuten vom Königsplatz: alle Spiele der EM 2028 (9.6.–9.7.) und WM 2030 live im italienischen Restaurant.",
    ogAlt: "Public Viewing auf der Terrasse des STORIA München (Leinwand per KI ins Foto eingefügt)",
  },
  breadcrumb: "Public Viewing München",
  hero: {
    eyebrow: "EM 2028 · 9. Juni – 9. Juli · Maxvorstadt",
    h1Pre: "Public Viewing in München – EM 2028 und WM 2030 im ",
    h1Em: "STORIA",
    intro:
      "Das STORIA ist ein italienisches Restaurant in der Karlstraße 47a in der Maxvorstadt, wenige Gehminuten vom Königsplatz. Wir zeigen alle Spiele der EM 2028 und der WM 2030 live, im Restaurant und im Sommer auf der Terrasse. Dazu Pizza, Pasta und Aperitivo. An Spieltagen wird es voll, reservieren Sie also besser vorher.",
    ctaReserve: "Tisch reservieren →",
    ctaWhatsapp: "WhatsApp",
  },
  toc: {
    label: "Auf dieser Seite",
    items: [
      ["wm-2026", "WM 2026"],
      ["fussball-2027", "2027"],
      ["em-2028", "EM 2028"],
      ["wm-2030", "WM 2030"],
      ["reservieren", "Reservieren"],
      ["anfahrt", "Anfahrt"],
      ["fragen", "Fragen"],
    ],
  },
  wm2026: {
    kicker: "Rückblick",
    h2: "So war die WM 2026 im STORIA",
    body:
      "Die Fußball-Weltmeisterschaft 2026 in den USA, Kanada und Mexiko war die erste mit 48 Mannschaften. Wegen der Zeitverschiebung liefen viele Spiele am späten Abend oder in der Nacht. Im STORIA liefen bei der WM 2026 alle Spiele live, vom Eröffnungsspiel bis zum Finale.",
    figcaption: "WM 2026 im STORIA: Übertragung im Restaurant.",
    h3: "Das Finale: Spanien wird Weltmeister",
    results: [
      ["Spanien – Argentinien 1:0 n. V.", "Finale am 19. Juli 2026. Ferran Torres traf in der 106. Minute, Spanien gewann seinen zweiten WM-Titel."],
      ["Deutschland – Paraguay 1:1 n. V., 3:4 i. E.", "Für die deutsche Mannschaft endete das Turnier am 29. Juni 2026 im Sechzehntelfinale."],
    ],
    grazie: "Grazie a tutti, die mit uns gefiebert haben.",
  },
  y2027: {
    kicker: "Ausblick",
    h2: "2027: Fußball schauen in München ohne großes Turnier",
    body:
      "2027 gibt es keine Welt- oder Europameisterschaft der Männer. Langweilig wird es trotzdem nicht. Im STORIA zeigen wir auch zwischen den Turnieren Fußball, zum Beispiel Champions League, DFB-Pokal und Länderspiele.",
    facts: [
      ["Champions League", "Finale am Samstag, 5. Juni 2027, im Estadio Metropolitano in Madrid"],
      ["Nations League", "Finalrunde vom 9. bis 13. Juni 2027, Gastgeber noch offen"],
      ["Weg zur EM 2028", "Die Auslosung der Qualifikation ist am 6. Dezember 2026 in Belfast"],
    ],
    src: "Quellen: UEFA (Champions-League-Finale 2027, EM-Qualifikation), Wikipedia (Nations League Finals 2027).",
  },
  em2028: {
    kicker: "Nächstes Turnier",
    h2: "EM 2028 Public Viewing in München",
    cd: { label: "EM 2028:", range: "9. Juni bis 9. Juli 2028", daysLeft: "noch {n} Tage", running: "läuft" },
    body:
      "Die Fußball-Europameisterschaft 2028 findet in England, Schottland, Wales und Irland statt. 24 Mannschaften bestreiten 51 Spiele. Im STORIA zeigen wir alle 51 Spiele live.",
    h3Hosts: "Die Gastgeberländer",
    hosts: [
      ["England", "London, Manchester, Liverpool, Birmingham, Newcastle"],
      ["Schottland", "Glasgow"],
      ["Wales", "Cardiff, Eröffnungsspiel"],
      ["Irland", "Dublin"],
    ],
    h3Dates: "Die Termine",
    dates: [
      ["Turnierzeitraum", "9. Juni bis 9. Juli 2028"],
      ["Eröffnungsspiel", "Cardiff, National Stadium of Wales"],
      ["Halbfinals", "4. und 5. Juli 2028, Wembley-Stadion, London"],
      ["Finale", "Sonntag, 9. Juli 2028, Wembley-Stadion, London"],
    ],
    h3Venues: "Die neun Stadien",
    venues: VENUES,
    src: "Quelle: UEFA. Der Spielplan mit Anstoßzeiten folgt nach der Auslosung; dann ergänzen wir ihn hier.",
    ctaText: "Sobald die Vorreservierung öffnet, sagen wir Bescheid.",
    ctaButton: "Newsletter eintragen",
  },
  wm2030: {
    kicker: "Ausblick",
    h2: "WM 2030 in München schauen: 100 Jahre Weltmeisterschaft",
    body:
      "Die Fußball-Weltmeisterschaft 2030 wird in Spanien, Portugal und Marokko ausgetragen. Zum 100-jährigen Jubiläum der ersten WM 1930 in Uruguay gibt es zum Auftakt je ein Spiel in Uruguay, Argentinien und Paraguay. Gespielt wird im Juni und Juli 2030. Im STORIA zeigen wir alle Spiele der WM 2030 live.",
    hosts: [
      ["Spanien", "u. a. Madrid, Barcelona, Sevilla, Bilbao, Málaga"],
      ["Portugal", "Lissabon, Porto"],
      ["Marokko", "u. a. Casablanca, Rabat, Marrakesch, Tanger"],
      ["Südamerika", "Jubiläumsspiele in Uruguay, Argentinien, Paraguay"],
    ],
    src: "Quellen: FIFA, Wikipedia „2030 FIFA World Cup“. Die Stadionliste ist vorläufig; die endgültigen Spielorte nennen wir, sobald die FIFA sie bestätigt.",
  },
  restaurant: {
    h2: "Fußball schauen im italienischen Restaurant",
    body: `Im STORIA gibt es zum Spiel echte italienische Küche: Pizza, Pasta und Aperitivo. Die Spiele laufen im Restaurant und im Sommer auf der Terrasse (bis ${AUSSEN} Personen außen). Die Terrasse ist fest überdacht; wird es zu ungemütlich, zeigen wir drinnen weiter.`,
    h3Reserve: "Tisch reservieren",
    reserveHint:
      "Die Reservierung für die EM-Spiele öffnet mit dem Spielplan. Einen Tisch für jeden anderen Abend können Sie jetzt schon anfragen.",
    h3Groups: "Für Gruppen und Firmen",
    groups: `Im Restaurant bis ${STAND} stehend / ${SITZ} sitzend, im Sommer auf der Terrasse bis ${AUSSEN} Personen außen.`,
    groupsLink: "Gruppenanfrage über events-storia.de",
  },
  newsletter: {
    h2: "Rechtzeitig Bescheid bekommen",
    body: "Wir melden uns, sobald die Vorreservierung für die EM 2028 öffnet. Kein Spam, nur dieser eine Anlass.",
  },
  anfahrt: {
    h2: "Anfahrt: Maxvorstadt, nahe Königsplatz",
    body:
      "Das STORIA liegt in der Karlstraße 47a, 80333 München. Die Tramhaltestelle Karlstraße (Linien 20 und 21) ist direkt vor der Tür, eine Station vom Münchner Hauptbahnhof. Zum Königsplatz sind es wenige Gehminuten.",
    hbfPre: "Auch praktisch, wenn Sie mit dem Zug kommen: ",
    hbfAnchor: "Italiener nahe Hauptbahnhof",
    hbfPost: ".",
  },
  kurz: {
    h2: "Das Wichtigste in Kürze",
    items: [
      "Das STORIA ist ein italienisches Restaurant in der Karlstraße 47a, 80333 München (Maxvorstadt), wenige Gehminuten vom Königsplatz.",
      "Das STORIA zeigt alle Spiele der EM 2028 und der WM 2030 live.",
      "Bei der WM 2026 liefen im STORIA alle Spiele.",
      "Die EM 2028 findet vom 9. Juni bis 9. Juli 2028 in England, Schottland, Wales und Irland statt; das Finale ist im Wembley-Stadion.",
      "Die WM 2030 findet im Juni und Juli 2030 in Spanien, Portugal und Marokko statt, mit Jubiläumsspielen in Uruguay, Argentinien und Paraguay.",
      `Das STORIA zeigt die Spiele im Restaurant und im Sommer auf der überdachten Terrasse (bis ${AUSSEN} Personen außen).`,
      `Für Gruppen bietet das STORIA im Restaurant Platz für bis zu ${STAND} Gäste stehend oder ${SITZ} sitzend.`,
    ],
  },
  faq: {
    h2: "Häufige Fragen zum Public Viewing in München",
    items: [
      { question: "Wo kann man in München Public Viewing schauen?", answer: "Zum Beispiel im STORIA in der Maxvorstadt, wenige Gehminuten vom Königsplatz. Das italienische Restaurant zeigt alle Spiele der EM 2028 und der WM 2030." },
      { question: "Wann ist die EM 2028?", answer: "Vom 9. Juni bis 9. Juli 2028. Das Eröffnungsspiel ist in Cardiff, das Finale im Wembley-Stadion in London." },
      { question: "Wo findet die EM 2028 statt?", answer: "In England, Schottland, Wales und Irland, in neun Stadien in Cardiff, Dublin, Glasgow, Newcastle, Manchester, Liverpool, Birmingham und London." },
      { question: "Zeigt das STORIA alle Spiele der EM 2028?", answer: "Ja, alle 51 Spiele laufen live." },
      { question: "Wann und wo ist die WM 2030?", answer: "Im Juni und Juli 2030 in Spanien, Portugal und Marokko. Die ersten Spiele finden zum 100-jährigen WM-Jubiläum in Uruguay, Argentinien und Paraguay statt." },
      { question: "Zeigt das STORIA die WM 2030?", answer: "Ja, alle Spiele der WM 2030 laufen live." },
      { question: "Wer wurde Weltmeister 2026?", answer: "Spanien, mit 1:0 nach Verlängerung gegen Argentinien im Finale am 19. Juli 2026." },
      { question: "Wo ist das Champions-League-Finale 2027?", answer: "Am 5. Juni 2027 im Estadio Metropolitano in Madrid." },
      { question: "Kann man für Public Viewing reservieren? Ab wann?", answer: "Die Vorreservierung öffnet voraussichtlich mit dem EM-Spielplan. Wer sich in den Newsletter einträgt, erfährt es zuerst." },
      { question: "Wie viele Gäste passen hinein, auch für Gruppen?", answer: `Im Restaurant bis ${STAND} stehend / ${SITZ} sitzend, im Sommer auf der Terrasse bis ${AUSSEN} Personen außen. Gruppenanfragen laufen über events-storia.de.` },
      { question: "Was passiert bei schlechtem Wetter?", answer: "Die Terrasse ist fest überdacht: Das Haus setzt sich über ihr fort wie ein richtiges Dach. Ein kurzer Schauer ist also kein Problem. Wird es doch zu ungemütlich, zeigen wir die Spiele drinnen." },
      { question: "Wie kommt man hin?", answer: "Mit der Tram 20 oder 21 bis Karlstraße, eine Station vom Hauptbahnhof." },
      { question: "Kostet das Public Viewing Eintritt?", answer: "Kein Eintritt." },
    ],
    disclaimer:
      "Das STORIA steht in keiner Verbindung zu UEFA oder FIFA. „EM 2028“ und „WM 2030“ dienen nur der Beschreibung der übertragenen Turniere.",
  },
};

const en: PvContent = {
  seo: {
    title: "Public Viewing Munich – Live Football at STORIA",
    description:
      "Public viewing in Munich's Maxvorstadt near Königsplatz: every EURO 2028 (9 June–9 July) and 2030 World Cup match live. England, Scotland, Wales & Ireland fans welcome.",
    ogAlt: "Public viewing on the terrace at STORIA Munich (screen added to the photo using AI)",
  },
  breadcrumb: "Public Viewing Munich",
  hero: {
    eyebrow: "EURO 2028 · 9 June – 9 July · Maxvorstadt",
    h1Pre: "Public Viewing in Munich – EURO 2028 and the 2030 World Cup at ",
    h1Em: "STORIA",
    intro:
      "STORIA is an Italian restaurant at Karlstraße 47a in Munich's Maxvorstadt, a few minutes' walk from Königsplatz. We show every match of EURO 2028 and the 2030 World Cup live, inside and in summer on the terrace. With pizza, pasta and aperitivo. Match days get busy, so it's best to book ahead.",
    ctaReserve: "Book a table →",
    ctaWhatsapp: "WhatsApp",
  },
  toc: {
    label: "On this page",
    items: [
      ["wm-2026", "World Cup 2026"],
      ["fussball-2027", "2027"],
      ["em-2028", "EURO 2028"],
      ["wm-2030", "World Cup 2030"],
      ["reservieren", "Book"],
      ["anfahrt", "Getting here"],
      ["fragen", "FAQ"],
    ],
  },
  wm2026: {
    kicker: "Looking back",
    h2: "The 2026 World Cup at STORIA",
    body:
      "The 2026 World Cup in the USA, Canada and Mexico was the first with 48 teams. Because of the time difference, many matches kicked off late in the evening or at night. At STORIA we showed every match of the 2026 World Cup live, from the opening game to the final.",
    figcaption: "World Cup 2026 at STORIA: the broadcast inside the restaurant.",
    h3: "The final: Spain are world champions",
    results: [
      ["Spain – Argentina 1–0 a.e.t.", "Final on 19 July 2026. Ferran Torres scored in the 106th minute and Spain won their second World Cup."],
      ["Germany – Paraguay 1–1 a.e.t., 3–4 on penalties", "Germany went out in the round of 32 on 29 June 2026."],
    ],
    grazie: "Grazie a tutti – thanks to everyone who cheered with us.",
  },
  y2027: {
    kicker: "Looking ahead",
    h2: "2027: watching football in Munich without a major tournament",
    body:
      "There is no men's World Cup or European Championship in 2027. It won't be boring, though. Between tournaments STORIA shows football too, such as the Champions League, the DFB-Pokal and international matches.",
    facts: [
      ["Champions League", "Final on Saturday 5 June 2027 at the Estadio Metropolitano in Madrid"],
      ["Nations League", "Finals from 9 to 13 June 2027, host still to be confirmed"],
      ["Road to EURO 2028", "The qualifying draw takes place on 6 December 2026 in Belfast"],
    ],
    src: "Sources: UEFA (2027 Champions League final, EURO qualifying), Wikipedia (2027 Nations League Finals).",
  },
  em2028: {
    kicker: "Next tournament",
    h2: "EURO 2028 public viewing in Munich",
    cd: { label: "EURO 2028:", range: "9 June to 9 July 2028", daysLeft: "{n} days to go", running: "under way" },
    body:
      "UEFA EURO 2028 takes place in England, Scotland, Wales and Ireland. 24 teams play 51 matches. At STORIA we show all 51 matches live.",
    fans: {
      title: "EURO 2028 in Munich: England, Scotland, Wales and Ireland fans welcome.",
      text: "Every EURO 2028 match live at STORIA, an Italian restaurant in Munich's Maxvorstadt near Königsplatz. Inside, and in summer on our covered terrace. Pizza, pasta and aperitivo, no entry fee.",
    },
    h3Hosts: "The host nations",
    hosts: [
      ["England", "London, Manchester, Liverpool, Birmingham, Newcastle"],
      ["Scotland", "Glasgow"],
      ["Wales", "Cardiff, opening match"],
      ["Ireland", "Dublin"],
    ],
    h3Dates: "Key dates",
    dates: [
      ["Tournament", "9 June to 9 July 2028"],
      ["Opening match", "Cardiff, National Stadium of Wales"],
      ["Semi-finals", "4 and 5 July 2028, Wembley Stadium, London"],
      ["Final", "Sunday 9 July 2028, Wembley Stadium, London"],
    ],
    h3Venues: "The nine stadiums",
    venues: venues("London", "Wembley Stadium"),
    src: "Source: UEFA. The match schedule with kick-off times follows the draw; we'll add it here then.",
    ctaText: "We'll let you know as soon as advance booking opens.",
    ctaButton: "Join the newsletter",
  },
  wm2030: {
    kicker: "Looking ahead",
    h2: "Watch the 2030 World Cup in Munich: 100 years of the World Cup",
    body:
      "The 2030 World Cup will be held in Spain, Portugal and Morocco. To mark 100 years since the first World Cup in Uruguay in 1930, the tournament opens with one match each in Uruguay, Argentina and Paraguay. It is played in June and July 2030. At STORIA we show every match of the 2030 World Cup live.",
    hosts: [
      ["Spain", "incl. Madrid, Barcelona, Seville, Bilbao, Málaga"],
      ["Portugal", "Lisbon, Porto"],
      ["Morocco", "incl. Casablanca, Rabat, Marrakesh, Tangier"],
      ["South America", "Centenary matches in Uruguay, Argentina, Paraguay"],
    ],
    src: "Sources: FIFA, Wikipedia “2030 FIFA World Cup”. The stadium list is provisional; we'll name the final venues once FIFA confirms them.",
  },
  restaurant: {
    h2: "Watching football in an Italian restaurant",
    body: `At STORIA the match comes with real Italian food: pizza, pasta and aperitivo. Matches are shown inside and in summer on the terrace (up to ${AUSSEN} people outside). The terrace is permanently covered; if it gets too uncomfortable, we carry on inside.`,
    h3Reserve: "Book a table",
    reserveHint: "Booking for the EURO matches opens with the match schedule. You can already request a table for any other evening.",
    h3Groups: "For groups and companies",
    groups: `Inside up to ${STAND} standing / ${SITZ} seated, in summer on the terrace up to ${AUSSEN} people outside.`,
    groupsLink: "Group enquiry via events-storia.de",
  },
  newsletter: {
    h2: "Be the first to know",
    body: "We'll get in touch as soon as advance booking for EURO 2028 opens. No spam, just this one occasion.",
  },
  anfahrt: {
    h2: "Getting here: Maxvorstadt, near Königsplatz",
    body:
      "STORIA is at Karlstraße 47a, 80333 Munich. The Karlstraße tram stop (lines 20 and 21) is right outside, one stop from Munich Central Station. Königsplatz is a few minutes' walk away.",
    hbfPre: "Handy if you arrive by train: ",
    hbfAnchor: "Italian restaurant near Munich Central Station",
    hbfPost: ".",
  },
  kurz: {
    h2: "Key facts",
    items: [
      "STORIA is an Italian restaurant at Karlstraße 47a, 80333 Munich (Maxvorstadt), a few minutes' walk from Königsplatz.",
      "STORIA shows every match of EURO 2028 and the 2030 World Cup live.",
      "STORIA showed every match of the 2026 World Cup.",
      "EURO 2028 runs from 9 June to 9 July 2028 in England, Scotland, Wales and Ireland; the final is at Wembley Stadium.",
      "The 2030 World Cup takes place in June and July 2030 in Spain, Portugal and Morocco, with centenary matches in Uruguay, Argentina and Paraguay.",
      `STORIA shows the matches inside and in summer on the covered terrace (up to ${AUSSEN} people outside).`,
      `For groups, STORIA has room inside for up to ${STAND} guests standing or ${SITZ} seated.`,
    ],
  },
  faq: {
    h2: "Frequently asked questions about public viewing in Munich",
    items: [
      { question: "Where can I watch public viewing in Munich?", answer: "For example at STORIA in the Maxvorstadt, a few minutes' walk from Königsplatz. The Italian restaurant shows every match of EURO 2028 and the 2030 World Cup." },
      { question: "When is EURO 2028?", answer: "From 9 June to 9 July 2028. The opening match is in Cardiff, the final at Wembley Stadium in London." },
      { question: "Where is EURO 2028 held?", answer: "In England, Scotland, Wales and Ireland, at nine stadiums in Cardiff, Dublin, Glasgow, Newcastle, Manchester, Liverpool, Birmingham and London." },
      { question: "Does STORIA show every EURO 2028 match?", answer: "Yes, all 51 matches are shown live." },
      { question: "When and where is the 2030 World Cup?", answer: "In June and July 2030 in Spain, Portugal and Morocco. The first matches are played in Uruguay, Argentina and Paraguay to mark 100 years of the World Cup." },
      { question: "Does STORIA show the 2030 World Cup?", answer: "Yes, every match of the 2030 World Cup is shown live." },
      { question: "Who won the 2026 World Cup?", answer: "Spain, beating Argentina 1–0 after extra time in the final on 19 July 2026." },
      { question: "Where is the 2027 Champions League final?", answer: "On 5 June 2027 at the Estadio Metropolitano in Madrid." },
      { question: "Can I book for public viewing? From when?", answer: "Advance booking is expected to open with the EURO match schedule. Newsletter subscribers hear about it first." },
      { question: "How many guests fit in, including groups?", answer: `Inside up to ${STAND} standing / ${SITZ} seated, in summer on the terrace up to ${AUSSEN} people outside. Group enquiries go through events-storia.de.` },
      { question: "What happens if the weather is bad?", answer: "The terrace is permanently covered: the building extends over it like a proper roof, so a short shower is no problem. If it does get too uncomfortable, we show the matches inside." },
      { question: "How do I get there?", answer: "Take tram 20 or 21 to Karlstraße, one stop from Munich Central Station." },
      { question: "Is there an entry fee for public viewing?", answer: "No entry fee." },
    ],
    disclaimer:
      "STORIA is not affiliated with UEFA or FIFA. “EURO 2028” and “World Cup 2030” are used only to describe the tournaments being shown.",
  },
};

const it: PvContent = {
  seo: {
    title: "Public Viewing Monaco – Calcio in diretta allo STORIA",
    description:
      "Public viewing nella Maxvorstadt, a pochi minuti da Königsplatz: tutte le partite di EURO 2028 (9.6.–9.7.) e dei Mondiali 2030 in diretta nel ristorante italiano.",
    ogAlt: "Public viewing sulla terrazza dello STORIA Monaco (schermo inserito nella foto con l'IA)",
  },
  breadcrumb: "Public Viewing Monaco",
  hero: {
    eyebrow: "EURO 2028 · 9 giugno – 9 luglio · Maxvorstadt",
    h1Pre: "Public Viewing a Monaco – EURO 2028 e Mondiali 2030 allo ",
    h1Em: "STORIA",
    intro:
      "Lo STORIA è un ristorante italiano in Karlstraße 47a, nella Maxvorstadt, a pochi minuti a piedi da Königsplatz. Trasmettiamo in diretta tutte le partite di EURO 2028 e dei Mondiali 2030, in sala e d'estate in terrazza. Con pizza, pasta e aperitivo. Nei giorni di partita c'è molta gente: meglio prenotare.",
    ctaReserve: "Prenota un tavolo →",
    ctaWhatsapp: "WhatsApp",
  },
  toc: {
    label: "In questa pagina",
    items: [
      ["wm-2026", "Mondiali 2026"],
      ["fussball-2027", "2027"],
      ["em-2028", "EURO 2028"],
      ["wm-2030", "Mondiali 2030"],
      ["reservieren", "Prenotare"],
      ["anfahrt", "Come arrivare"],
      ["fragen", "Domande"],
    ],
  },
  wm2026: {
    kicker: "Uno sguardo indietro",
    h2: "Così sono stati i Mondiali 2026 allo STORIA",
    body:
      "I Mondiali 2026 in USA, Canada e Messico sono stati i primi con 48 squadre. Per via del fuso orario molte partite si giocavano in tarda serata o di notte. Allo STORIA abbiamo trasmesso in diretta tutte le partite dei Mondiali 2026, dalla gara d'apertura alla finale.",
    figcaption: "Mondiali 2026 allo STORIA: la diretta in sala.",
    h3: "La finale: la Spagna è campione del mondo",
    results: [
      ["Spagna – Argentina 1:0 d.t.s.", "Finale del 19 luglio 2026. Ferran Torres ha segnato al 106° minuto, la Spagna ha vinto il suo secondo titolo mondiale."],
      ["Germania – Paraguay 1:1 d.t.s., 3:4 ai rigori", "Per la Germania il torneo si è chiuso il 29 giugno 2026 nei sedicesimi di finale."],
    ],
    grazie: "Grazie a tutti quelli che hanno tifato con noi.",
  },
  y2027: {
    kicker: "Uno sguardo avanti",
    h2: "2027: guardare il calcio a Monaco senza un grande torneo",
    body:
      "Nel 2027 non ci sono Mondiali né Europei maschili. Ma non ci si annoia. Anche tra un torneo e l'altro allo STORIA trasmettiamo calcio, per esempio Champions League, DFB-Pokal e partite delle nazionali.",
    facts: [
      ["Champions League", "Finale sabato 5 giugno 2027 all'Estadio Metropolitano di Madrid"],
      ["Nations League", "Fase finale dal 9 al 13 giugno 2027, sede ancora da definire"],
      ["Verso EURO 2028", "Il sorteggio delle qualificazioni è il 6 dicembre 2026 a Belfast"],
    ],
    src: "Fonti: UEFA (finale di Champions League 2027, qualificazioni EURO), Wikipedia (Nations League Finals 2027).",
  },
  em2028: {
    kicker: "Prossimo torneo",
    h2: "EURO 2028 in public viewing a Monaco",
    cd: { label: "EURO 2028:", range: "dal 9 giugno al 9 luglio 2028", daysLeft: "ancora {n} giorni", running: "in corso" },
    body:
      "Il Campionato europeo 2028 si gioca in Inghilterra, Scozia, Galles e Irlanda. 24 squadre disputano 51 partite. Allo STORIA le trasmettiamo tutte e 51 in diretta.",
    h3Hosts: "I paesi ospitanti",
    hosts: [
      ["Inghilterra", "Londra, Manchester, Liverpool, Birmingham, Newcastle"],
      ["Scozia", "Glasgow"],
      ["Galles", "Cardiff, partita d'apertura"],
      ["Irlanda", "Dublino"],
    ],
    h3Dates: "Le date",
    dates: [
      ["Torneo", "dal 9 giugno al 9 luglio 2028"],
      ["Partita d'apertura", "Cardiff, National Stadium of Wales"],
      ["Semifinali", "4 e 5 luglio 2028, stadio di Wembley, Londra"],
      ["Finale", "domenica 9 luglio 2028, stadio di Wembley, Londra"],
    ],
    h3Venues: "I nove stadi",
    venues: venues("Londra", "Stadio di Wembley", "Dublino"),
    src: "Fonte: UEFA. Il calendario con gli orari segue dopo il sorteggio; lo aggiungeremo qui.",
    ctaText: "Appena si apre la prenotazione anticipata, vi avvisiamo.",
    ctaButton: "Iscriviti alla newsletter",
  },
  wm2030: {
    kicker: "Uno sguardo avanti",
    h2: "Guardare i Mondiali 2030 a Monaco: 100 anni di Coppa del Mondo",
    body:
      "I Mondiali 2030 si giocano in Spagna, Portogallo e Marocco. Per i 100 anni del primo Mondiale del 1930 in Uruguay, il torneo si apre con una partita ciascuno in Uruguay, Argentina e Paraguay. Si gioca a giugno e luglio 2030. Allo STORIA trasmettiamo in diretta tutte le partite dei Mondiali 2030.",
    hosts: [
      ["Spagna", "tra cui Madrid, Barcellona, Siviglia, Bilbao, Malaga"],
      ["Portogallo", "Lisbona, Porto"],
      ["Marocco", "tra cui Casablanca, Rabat, Marrakech, Tangeri"],
      ["Sudamerica", "Partite del centenario in Uruguay, Argentina, Paraguay"],
    ],
    src: "Fonti: FIFA, Wikipedia „2030 FIFA World Cup“. L'elenco degli stadi è provvisorio; indicheremo le sedi definitive appena la FIFA le conferma.",
  },
  restaurant: {
    h2: "Guardare il calcio in un ristorante italiano",
    body: `Allo STORIA la partita si guarda con vera cucina italiana: pizza, pasta e aperitivo. Le partite vanno in onda in sala e d'estate in terrazza (fino a ${AUSSEN} persone all'aperto). La terrazza è coperta in modo fisso; se diventa troppo scomodo, continuiamo dentro.`,
    h3Reserve: "Prenota un tavolo",
    reserveHint: "La prenotazione per le partite di EURO 2028 si apre con il calendario. Per qualsiasi altra sera potete già richiedere un tavolo.",
    h3Groups: "Per gruppi e aziende",
    groups: `In sala fino a ${STAND} persone in piedi / ${SITZ} sedute, d'estate in terrazza fino a ${AUSSEN} persone all'aperto.`,
    groupsLink: "Richiesta per gruppi su events-storia.de",
  },
  newsletter: {
    h2: "Essere avvisati in tempo",
    body: "Vi scriviamo appena si apre la prenotazione anticipata per EURO 2028. Niente spam, solo questa occasione.",
  },
  anfahrt: {
    h2: "Come arrivare: Maxvorstadt, vicino a Königsplatz",
    body:
      "Lo STORIA si trova in Karlstraße 47a, 80333 Monaco. La fermata del tram Karlstraße (linee 20 e 21) è davanti alla porta, a una fermata dalla stazione centrale. Königsplatz è a pochi minuti a piedi.",
    hbfPre: "Comodo anche se arrivate in treno: ",
    hbfAnchor: "ristorante italiano vicino alla stazione centrale",
    hbfPost: ".",
  },
  kurz: {
    h2: "In breve",
    items: [
      "Lo STORIA è un ristorante italiano in Karlstraße 47a, 80333 Monaco (Maxvorstadt), a pochi minuti a piedi da Königsplatz.",
      "Lo STORIA trasmette in diretta tutte le partite di EURO 2028 e dei Mondiali 2030.",
      "Ai Mondiali 2026 lo STORIA ha trasmesso tutte le partite.",
      "EURO 2028 si gioca dal 9 giugno al 9 luglio 2028 in Inghilterra, Scozia, Galles e Irlanda; la finale è a Wembley.",
      "I Mondiali 2030 si giocano a giugno e luglio 2030 in Spagna, Portogallo e Marocco, con partite del centenario in Uruguay, Argentina e Paraguay.",
      `Lo STORIA trasmette le partite in sala e d'estate sulla terrazza coperta (fino a ${AUSSEN} persone all'aperto).`,
      `Per i gruppi lo STORIA offre in sala posto per fino a ${STAND} ospiti in piedi o ${SITZ} seduti.`,
    ],
  },
  faq: {
    h2: "Domande frequenti sul public viewing a Monaco",
    items: [
      { question: "Dove si può guardare il public viewing a Monaco?", answer: "Per esempio allo STORIA nella Maxvorstadt, a pochi minuti a piedi da Königsplatz. Il ristorante italiano trasmette tutte le partite di EURO 2028 e dei Mondiali 2030." },
      { question: "Quando si gioca EURO 2028?", answer: "Dal 9 giugno al 9 luglio 2028. La partita d'apertura è a Cardiff, la finale allo stadio di Wembley a Londra." },
      { question: "Dove si gioca EURO 2028?", answer: "In Inghilterra, Scozia, Galles e Irlanda, in nove stadi a Cardiff, Dublino, Glasgow, Newcastle, Manchester, Liverpool, Birmingham e Londra." },
      { question: "Lo STORIA trasmette tutte le partite di EURO 2028?", answer: "Sì, tutte le 51 partite in diretta." },
      { question: "Quando e dove si giocano i Mondiali 2030?", answer: "A giugno e luglio 2030 in Spagna, Portogallo e Marocco. Le prime partite si giocano in Uruguay, Argentina e Paraguay per i 100 anni dei Mondiali." },
      { question: "Lo STORIA trasmette i Mondiali 2030?", answer: "Sì, tutte le partite dei Mondiali 2030 in diretta." },
      { question: "Chi ha vinto i Mondiali 2026?", answer: "La Spagna, 1:0 dopo i tempi supplementari contro l'Argentina nella finale del 19 luglio 2026." },
      { question: "Dove si gioca la finale di Champions League 2027?", answer: "Il 5 giugno 2027 all'Estadio Metropolitano di Madrid." },
      { question: "Si può prenotare per il public viewing? Da quando?", answer: "La prenotazione anticipata si apre presumibilmente con il calendario di EURO 2028. Chi si iscrive alla newsletter lo sa per primo." },
      { question: "Quante persone ci stanno, anche per gruppi?", answer: `In sala fino a ${STAND} persone in piedi / ${SITZ} sedute, d'estate in terrazza fino a ${AUSSEN} persone all'aperto. Le richieste per gruppi passano da events-storia.de.` },
      { question: "Cosa succede se il tempo è brutto?", answer: "La terrazza è coperta in modo fisso: l'edificio prosegue sopra di essa come un vero tetto. Un breve acquazzone non è un problema. Se diventa troppo scomodo, trasmettiamo le partite dentro." },
      { question: "Come si arriva?", answer: "Con il tram 20 o 21 fino a Karlstraße, a una fermata dalla stazione centrale." },
      { question: "Il public viewing ha un biglietto d'ingresso?", answer: "Nessun biglietto d'ingresso." },
    ],
    disclaimer:
      "Lo STORIA non ha alcun legame con UEFA o FIFA. „EURO 2028“ e „Mondiali 2030“ servono solo a descrivere i tornei trasmessi.",
  },
};

const fr: PvContent = {
  seo: {
    title: "Public Viewing Munich – Football en direct au STORIA",
    description:
      "Public viewing dans la Maxvorstadt, à quelques minutes de Königsplatz : tous les matchs de l'EURO 2028 (9.6–9.7) et de la Coupe du monde 2030 en direct au restaurant italien.",
    ogAlt: "Public viewing sur la terrasse du STORIA Munich (écran ajouté à la photo par IA)",
  },
  breadcrumb: "Public Viewing Munich",
  hero: {
    eyebrow: "EURO 2028 · 9 juin – 9 juillet · Maxvorstadt",
    h1Pre: "Public Viewing à Munich – EURO 2028 et Coupe du monde 2030 au ",
    h1Em: "STORIA",
    intro:
      "Le STORIA est un restaurant italien au 47a Karlstraße, dans la Maxvorstadt, à quelques minutes à pied de Königsplatz. Nous diffusons en direct tous les matchs de l'EURO 2028 et de la Coupe du monde 2030, en salle et l'été en terrasse. Avec pizza, pâtes et aperitivo. Les jours de match, il y a du monde : mieux vaut réserver.",
    ctaReserve: "Réserver une table →",
    ctaWhatsapp: "WhatsApp",
  },
  toc: {
    label: "Sur cette page",
    items: [
      ["wm-2026", "Coupe du monde 2026"],
      ["fussball-2027", "2027"],
      ["em-2028", "EURO 2028"],
      ["wm-2030", "Coupe du monde 2030"],
      ["reservieren", "Réserver"],
      ["anfahrt", "Accès"],
      ["fragen", "Questions"],
    ],
  },
  wm2026: {
    kicker: "Rétrospective",
    h2: "La Coupe du monde 2026 au STORIA",
    body:
      "La Coupe du monde 2026 aux États-Unis, au Canada et au Mexique a été la première à 48 équipes. À cause du décalage horaire, beaucoup de matchs se jouaient tard le soir ou la nuit. Au STORIA, tous les matchs de la Coupe du monde 2026 ont été diffusés en direct, du match d'ouverture à la finale.",
    figcaption: "Coupe du monde 2026 au STORIA : la retransmission en salle.",
    h3: "La finale : l'Espagne championne du monde",
    results: [
      ["Espagne – Argentine 1-0 a.p.", "Finale du 19 juillet 2026. Ferran Torres a marqué à la 106e minute, l'Espagne a remporté son deuxième titre mondial."],
      ["Allemagne – Paraguay 1-1 a.p., 3-4 t.a.b.", "Pour l'Allemagne, le tournoi s'est arrêté le 29 juin 2026 en seizièmes de finale."],
    ],
    grazie: "Grazie a tutti – merci à tous ceux qui ont vibré avec nous.",
  },
  y2027: {
    kicker: "Perspectives",
    h2: "2027 : regarder le football à Munich sans grand tournoi",
    body:
      "En 2027, il n'y a ni Coupe du monde ni Euro masculins. On ne s'ennuiera pas pour autant. Entre les tournois, le STORIA diffuse aussi du football, par exemple la Ligue des champions, la DFB-Pokal et les matchs internationaux.",
    facts: [
      ["Ligue des champions", "Finale le samedi 5 juin 2027 à l'Estadio Metropolitano de Madrid"],
      ["Ligue des nations", "Phase finale du 9 au 13 juin 2027, pays hôte encore à désigner"],
      ["En route vers l'EURO 2028", "Le tirage des qualifications a lieu le 6 décembre 2026 à Belfast"],
    ],
    src: "Sources : UEFA (finale de la Ligue des champions 2027, qualifications EURO), Wikipedia (Nations League Finals 2027).",
  },
  em2028: {
    kicker: "Prochain tournoi",
    h2: "EURO 2028 en public viewing à Munich",
    cd: { label: "EURO 2028 :", range: "du 9 juin au 9 juillet 2028", daysLeft: "encore {n} jours", running: "en cours" },
    body:
      "Le Championnat d'Europe 2028 se joue en Angleterre, en Écosse, au pays de Galles et en Irlande. 24 équipes disputent 51 matchs. Au STORIA, nous diffusons les 51 matchs en direct.",
    h3Hosts: "Les pays hôtes",
    hosts: [
      ["Angleterre", "Londres, Manchester, Liverpool, Birmingham, Newcastle"],
      ["Écosse", "Glasgow"],
      ["Pays de Galles", "Cardiff, match d'ouverture"],
      ["Irlande", "Dublin"],
    ],
    h3Dates: "Les dates",
    dates: [
      ["Tournoi", "du 9 juin au 9 juillet 2028"],
      ["Match d'ouverture", "Cardiff, National Stadium of Wales"],
      ["Demi-finales", "4 et 5 juillet 2028, stade de Wembley, Londres"],
      ["Finale", "dimanche 9 juillet 2028, stade de Wembley, Londres"],
    ],
    h3Venues: "Les neuf stades",
    venues: venues("Londres", "Stade de Wembley"),
    src: "Source : UEFA. Le calendrier avec les heures de coup d'envoi suivra le tirage au sort ; nous l'ajouterons ici.",
    ctaText: "Nous vous prévenons dès l'ouverture des pré-réservations.",
    ctaButton: "S'inscrire à la newsletter",
  },
  wm2030: {
    kicker: "Perspectives",
    h2: "Regarder la Coupe du monde 2030 à Munich : 100 ans de Coupe du monde",
    body:
      "La Coupe du monde 2030 se jouera en Espagne, au Portugal et au Maroc. Pour les 100 ans de la première Coupe du monde, en 1930 en Uruguay, le tournoi s'ouvre avec un match chacun en Uruguay, en Argentine et au Paraguay. Elle se joue en juin et juillet 2030. Au STORIA, nous diffusons en direct tous les matchs de la Coupe du monde 2030.",
    hosts: [
      ["Espagne", "notamment Madrid, Barcelone, Séville, Bilbao, Malaga"],
      ["Portugal", "Lisbonne, Porto"],
      ["Maroc", "notamment Casablanca, Rabat, Marrakech, Tanger"],
      ["Amérique du Sud", "Matchs du centenaire en Uruguay, Argentine, Paraguay"],
    ],
    src: "Sources : FIFA, Wikipedia « 2030 FIFA World Cup ». La liste des stades est provisoire ; nous indiquerons les sites définitifs dès que la FIFA les confirmera.",
  },
  restaurant: {
    h2: "Regarder le football dans un restaurant italien",
    body: `Au STORIA, le match se regarde avec une vraie cuisine italienne : pizza, pâtes et aperitivo. Les matchs sont diffusés en salle et l'été en terrasse (jusqu'à ${AUSSEN} personnes dehors). La terrasse est couverte en dur ; si cela devient trop inconfortable, on continue à l'intérieur.`,
    h3Reserve: "Réserver une table",
    reserveHint: "La réservation pour les matchs de l'EURO ouvre avec le calendrier. Pour tout autre soir, vous pouvez déjà demander une table.",
    h3Groups: "Pour les groupes et entreprises",
    groups: `En salle jusqu'à ${STAND} personnes debout / ${SITZ} assises, l'été en terrasse jusqu'à ${AUSSEN} personnes dehors.`,
    groupsLink: "Demande de groupe via events-storia.de",
  },
  newsletter: {
    h2: "Être prévenu à temps",
    body: "Nous vous écrivons dès l'ouverture des pré-réservations pour l'EURO 2028. Pas de spam, seulement cette occasion.",
  },
  anfahrt: {
    h2: "Accès : Maxvorstadt, près de Königsplatz",
    body:
      "Le STORIA se trouve au 47a Karlstraße, 80333 Munich. L'arrêt de tram Karlstraße (lignes 20 et 21) est juste devant la porte, à un arrêt de la gare centrale de Munich. Königsplatz est à quelques minutes à pied.",
    hbfPre: "Pratique si vous arrivez en train : ",
    hbfAnchor: "restaurant italien près de la gare centrale",
    hbfPost: ".",
  },
  kurz: {
    h2: "L'essentiel en bref",
    items: [
      "Le STORIA est un restaurant italien au 47a Karlstraße, 80333 Munich (Maxvorstadt), à quelques minutes à pied de Königsplatz.",
      "Le STORIA diffuse en direct tous les matchs de l'EURO 2028 et de la Coupe du monde 2030.",
      "Pendant la Coupe du monde 2026, le STORIA a diffusé tous les matchs.",
      "L'EURO 2028 a lieu du 9 juin au 9 juillet 2028 en Angleterre, en Écosse, au pays de Galles et en Irlande ; la finale se joue à Wembley.",
      "La Coupe du monde 2030 a lieu en juin et juillet 2030 en Espagne, au Portugal et au Maroc, avec des matchs du centenaire en Uruguay, en Argentine et au Paraguay.",
      `Le STORIA diffuse les matchs en salle et l'été sur la terrasse couverte (jusqu'à ${AUSSEN} personnes dehors).`,
      `Pour les groupes, le STORIA accueille en salle jusqu'à ${STAND} personnes debout ou ${SITZ} assises.`,
    ],
  },
  faq: {
    h2: "Questions fréquentes sur le public viewing à Munich",
    items: [
      { question: "Où regarder un public viewing à Munich ?", answer: "Par exemple au STORIA, dans la Maxvorstadt, à quelques minutes à pied de Königsplatz. Le restaurant italien diffuse tous les matchs de l'EURO 2028 et de la Coupe du monde 2030." },
      { question: "Quand a lieu l'EURO 2028 ?", answer: "Du 9 juin au 9 juillet 2028. Le match d'ouverture a lieu à Cardiff, la finale au stade de Wembley à Londres." },
      { question: "Où se joue l'EURO 2028 ?", answer: "En Angleterre, en Écosse, au pays de Galles et en Irlande, dans neuf stades à Cardiff, Dublin, Glasgow, Newcastle, Manchester, Liverpool, Birmingham et Londres." },
      { question: "Le STORIA diffuse-t-il tous les matchs de l'EURO 2028 ?", answer: "Oui, les 51 matchs sont diffusés en direct." },
      { question: "Quand et où a lieu la Coupe du monde 2030 ?", answer: "En juin et juillet 2030 en Espagne, au Portugal et au Maroc. Les premiers matchs se jouent en Uruguay, en Argentine et au Paraguay pour les 100 ans de la Coupe du monde." },
      { question: "Le STORIA diffuse-t-il la Coupe du monde 2030 ?", answer: "Oui, tous les matchs de la Coupe du monde 2030 sont diffusés en direct." },
      { question: "Qui a gagné la Coupe du monde 2026 ?", answer: "L'Espagne, victorieuse 1-0 après prolongation contre l'Argentine en finale le 19 juillet 2026." },
      { question: "Où se joue la finale de la Ligue des champions 2027 ?", answer: "Le 5 juin 2027 à l'Estadio Metropolitano de Madrid." },
      { question: "Peut-on réserver pour le public viewing ? À partir de quand ?", answer: "Les pré-réservations ouvriront probablement avec le calendrier de l'EURO. Les abonnés à la newsletter seront prévenus en premier." },
      { question: "Combien de personnes peuvent venir, y compris en groupe ?", answer: `En salle jusqu'à ${STAND} personnes debout / ${SITZ} assises, l'été en terrasse jusqu'à ${AUSSEN} personnes dehors. Les demandes de groupe passent par events-storia.de.` },
      { question: "Que se passe-t-il en cas de mauvais temps ?", answer: "La terrasse est couverte en dur : le bâtiment se prolonge au-dessus comme un vrai toit. Une averse n'est donc pas un problème. Si cela devient trop inconfortable, nous diffusons les matchs à l'intérieur." },
      { question: "Comment venir ?", answer: "Avec le tram 20 ou 21 jusqu'à l'arrêt Karlstraße, à un arrêt de la gare centrale." },
      { question: "Le public viewing est-il payant ?", answer: "Entrée gratuite." },
    ],
    disclaimer:
      "Le STORIA n'a aucun lien avec l'UEFA ou la FIFA. « EURO 2028 » et « Coupe du monde 2030 » servent uniquement à désigner les tournois diffusés.",
  },
};

export const wmContent: Record<Language, PvContent> = { de, en, it, fr };
