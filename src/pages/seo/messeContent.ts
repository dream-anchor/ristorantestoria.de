import type { Language } from "@/contexts/LanguageContext";

/**
 * Inhalte der Messe-Seiten (/messe-muenchen/ und /messe-muenchen/bauma/), Fassung 4 aus dem
 * freigegebenen Mockup (Artifact 8CkTiNifjyybEyx842ZJ3f), Platzhalter aufgelöst durch Antoine am 06.10.2026.
 * Belege (Stand 10/2026):
 * - Fahrzeiten U2 Königsplatz → Messestadt West 23 Min., Ost 24 Min. (MVG-Aushangfahrplan U2, gültig ab 14.12.2025).
 * - U8 hält am Königsplatz nur samstags (Zusatzlinie) → bewusst nicht genannt.
 * - BAU 2025 „deutlich über 180.000“ Besucher (Schlussbericht bau-muenchen.com); Hallen 9:30–18:00 Uhr.
 * - IAA MOBILITY 2025 „über 500.000“ Besucher (VDA-Pressemitteilung 14.09.2025).
 * - bauma 2025 rund 600.000 Besucher aus über 200 Ländern, 3.601 Aussteller aus 57 Nationen (Schlussbericht bauma.de).
 * - Turnus iba und drinktec: alle 3 Jahre (iba-tradefair.com, drinktec.com); opti jährlich (opti.de).
 * Preise: es gelten immer die Menüpreise der aktuellen Speisekarte (Antoine, 06.10.2026).
 */

export const PREISE = {
  vegetale: { menue: 59, wein: 89 },
  mare: { menue: 68, wein: 96 },
  terra: { menue: 68, wein: 96 },
} as const;

export const eur = (n: number, lang: Language) => (lang === "en" ? `€${n}` : `${n} €`);

const ca: Record<Language, string> = { de: "ca.", en: "approx.", it: "ca.", fr: "env." };
const minE: Record<Language, string> = { de: "Min.", en: "min", it: "min", fr: "min" };
export const dauer = (lang: Language, wert: string, ungefaehr = true) =>
  `${ungefaehr ? ca[lang] + " " : ""}${wert} ${minE[lang]}`;

/** Hotels am Hauptbahnhof: Name, Adresse, Fußweg (m), Fußweg (Min.), Taxi (Min., null = nicht sinnvoll). */
export const HOTELS_ZENTRAL: [string, string, string, string, string | null][] = [
  ["ibis München City", "Dachauer Str. 21", "100 m", "2", null],
  ["The Charles Hotel", "Sophienstr. 28", "490 m", "7", "3–5"],
  ["NH Collection München Bavaria", "Arnulfstr. 2", "440 m", "6", "3–5"],
  ["Eden Hotel Wolff", "Arnulfstr. 4", "490 m", "7", "3–5"],
  ["25hours The Royal Bavarian", "Bahnhofplatz 1", "630 m", "8", "3–5"],
  ["Europäischer Hof", "Bayerstr. 31", "750 m", "10", "5–8"],
  ["Le Méridien München", "Bayerstr. 41", "810 m", "11", "5–8"],
  ["Sofitel Munich Bayerpost", "Bayerstr. 12", "880 m", "11", "5"],
];

/** Hotels an der Messe: Name, Adresse, ÖPNV (Min.), Linie, Taxi (Min.). */
export const HOTELS_MESSE: [string, string, string, string, string][] = [
  ["Novotel München Messe", "Willy-Brandt-Platz 1", "34–36", "U2", "20–30"],
  ["Motel One München-Messe", "Willy-Brandt-Platz 8", "34–36", "U2", "20–30"],
  ["H4 Hotel München Messe", "Konrad-Zuse-Platz 14", "39–41", "U2", "20–30"],
  ["H2 Hotel München Messe", "Olof-Palme-Str. 12", "38–40", "U2", "20–30"],
  ["Hotel Am Moosfeld", "Am Moosfeld, U2 Moosfeld", "36–38", "U2", "20–30"],
  ["Hotel Prinzregent Messe", "Riemer Str. 350", "37–41", "", "18–25"],
  ["NH München Messe", "Eggenfeldener Str. 100", "35–41", "Bus + S4", "15–20"],
  ["Moxy München Messe", "Otto-Hahn-Str. 21, Aschheim", "39", "S2", "20–30"],
  ["NH München Ost Conference Center", "Einsteinring 20, Aschheim", "42", "S2", "20–30"],
];

type Turnus = "j" | "2u" | "2g" | "3";
const TURNUS: Record<Language, Record<Turnus, string>> = {
  de: { j: "jährlich", "2u": "alle 2 Jahre (ungerade)", "2g": "alle 2 Jahre (gerade)", "3": "alle 3 Jahre" },
  en: { j: "annual", "2u": "every 2 years (odd)", "2g": "every 2 years (even)", "3": "every 3 years" },
  it: { j: "annuale", "2u": "ogni 2 anni (dispari)", "2g": "ogni 2 anni (pari)", "3": "ogni 3 anni" },
  fr: { j: "annuel", "2u": "tous les 2 ans (impairs)", "2g": "tous les 2 ans (pairs)", "3": "tous les 3 ans" },
};

/** Messekalender: Monat [de,en,it,fr], Messe, Branche [de,en,it,fr], Turnus. */
const KALENDER: [string[], string, string[], Turnus][] = [
  [["Januar", "January", "Gennaio", "Janvier"], "BAU", ["Architektur, Bau", "Architecture, construction", "Architettura, edilizia", "Architecture, construction"], "2u"],
  [["Januar", "January", "Gennaio", "Janvier"], "opti", ["Augenoptik", "Optics, eyewear", "Ottica", "Optique"], "j"],
  [["Februar", "February", "Febbraio", "Février"], "f.re.e", ["Reisen, Freizeit (Publikumsmesse)", "Travel, leisure (consumer fair)", "Viaggi, tempo libero (fiera per il pubblico)", "Voyages, loisirs (salon grand public)"], "j"],
  [["Februar", "February", "Febbraio", "Février"], "INHORGENTA", ["Schmuck, Uhren", "Jewellery, watches", "Gioielli, orologi", "Bijoux, montres"], "j"],
  [["März", "March", "Marzo", "Mars"], "IHM Internationale Handwerksmesse", ["Handwerk", "Crafts and trades", "Artigianato", "Artisanat"], "j"],
  [["April", "April", "Aprile", "Avril"], "analytica", ["Labor, Biotech", "Laboratory, biotech", "Laboratorio, biotech", "Laboratoire, biotech"], "2g"],
  [["April", "April", "Aprile", "Avril"], "bauma", ["Baumaschinen", "Construction machinery", "Macchine edili", "Engins de chantier"], "3"],
  [["April", "April", "Aprile", "Avril"], "ceramitec", ["Keramik", "Ceramics", "Ceramica", "Céramique"], "2g"],
  [["April", "April", "Aprile", "Avril"], "transport logistic", ["Logistik", "Logistics", "Logistica", "Logistique"], "2u"],
  [["Mai/Juni", "May/June", "Maggio/giugno", "Mai/juin"], "IFAT", ["Umwelt, Wasser", "Environment, water", "Ambiente, acqua", "Environnement, eau"], "2g"],
  [["Juni", "June", "Giugno", "Juin"], "The smarter E / Intersolar", ["Solar, Energie", "Solar, energy", "Solare, energia", "Solaire, énergie"], "j"],
  [["Juni", "June", "Giugno", "Juin"], "automatica", ["Robotik, Automation", "Robotics, automation", "Robotica, automazione", "Robotique, automatisation"], "2u"],
  [["Juni", "June", "Giugno", "Juin"], "LASER World of Photonics", ["Photonik", "Photonics", "Fotonica", "Photonique"], "2u"],
  [["September", "September", "Settembre", "Septembre"], "drinktec", ["Getränke, Lebensmittel", "Beverages, liquid food", "Bevande, alimenti", "Boissons, alimentation"], "3"],
  [["September", "September", "Settembre", "Septembre"], "IAA MOBILITY", ["Mobilität", "Mobility", "Mobilità", "Mobilité"], "2u"],
  [["Sept./Okt.", "Sept./Oct.", "Sett./ott.", "Sept./oct."], "Oktoberfest", ["Volksfest, viele Firmengäste", "Folk festival, many corporate guests", "Festa popolare, molti ospiti aziendali", "Fête populaire, nombreux invités d'entreprise"], "j"],
  [["Oktober", "October", "Ottobre", "Octobre"], "EXPO REAL", ["Immobilien", "Real estate", "Immobiliare", "Immobilier"], "j"],
  [["Oktober", "October", "Ottobre", "Octobre"], "inter airport Europe", ["Flughafentechnik", "Airport equipment", "Tecnologia aeroportuale", "Équipements aéroportuaires"], "2u"],
  [["Oktober", "October", "Ottobre", "Octobre"], "iba", ["Bäckerei, Konditorei", "Bakery, confectionery", "Panificazione, pasticceria", "Boulangerie, pâtisserie"], "3"],
  [["November", "November", "Novembre", "Novembre"], "electronica", ["Elektronik", "Electronics", "Elettronica", "Électronique"], "2g"],
  [["November", "November", "Novembre", "Novembre"], "productronica", ["Elektronikfertigung", "Electronics manufacturing", "Produzione elettronica", "Production électronique"], "2u"],
];

const LI: Record<Language, number> = { de: 0, en: 1, it: 2, fr: 3 };
export const kalender = (lang: Language) =>
  KALENDER.map(([monat, name, branche, turnus]) => ({
    monat: monat[LI[lang]],
    name,
    branche: branche[LI[lang]],
    turnus: TURNUS[lang][turnus],
  }));

type Menue = { key: "vegetale" | "mare" | "terra"; name: string; art: string; gaenge: string[] };

const de = {
  hub: {
    seoTitle: "Messe-Dinner München – Firmenessen im STORIA, Innenstadt",
    seoDescription:
      "Firmenessen zur Messe München: mit der U2 ohne Umstieg ins STORIA, Karlstraße 47a. Degustationsmenüs ab 59 € p. P., sitzend bis 200, stehend bis 400 Gäste.",
    breadcrumb: "Messe München",
    kicker: "Messe-Dinner München",
    h1: "Firmenessen zur Messe München – in der Innenstadt, eine U-Bahn-Linie entfernt",
    intro:
      "Das STORIA liegt in der Karlstraße 47a in der Maxvorstadt. Von der Messe München in Riem fahren Sie mit der U2 ohne Umsteigen bis Königsplatz, von dort sind es drei bis vier Minuten zu Fuß. Wir richten Ihr Gruppenessen für bis zu 400 Gäste im Stehen aus, sitzend für 100 Gäste im Winter und 200 im Sommer mit Terrasse.",
    ctaAnfrage: "Messeabend anfragen",
    ctaMenues: "Menüs ansehen",
    blickTitel: "Auf einen Blick",
    blick: [
      ["Restaurant", "STORIA – Ristorante Pizzeria Bar, italienische Küche, geführt von Familie Speranza seit 2015"],
      ["Adresse", "Karlstraße 47a, 80333 München (Maxvorstadt)"],
      ["Von der Messe München", "U2 ab Messestadt West oder Ost bis Königsplatz, ohne Umsteigen, 23–24 Min. Fahrt plus 3–4 Min. Fußweg"],
      ["In der Nähe", "U-Bahn Königsplatz (U2) · Tram 20/21, Haltestelle Karlstraße, 1 Min. · Hauptbahnhof 5–8 Min. zu Fuß"],
      ["Plätze", "stehend bis 400 Gäste (innen und außen) · sitzend 100 im Winter, 200 im Sommer mit Terrasse"],
      ["Menüs", "4 Gänge «Vegetale» 59 €, «Mare» und «Terra» je 68 € p. P. inkl. MwSt.; mit Weinbegleitung 89 € bzw. 96 €"],
      ["Öffnungszeiten", "Mo–Fr 9–1 Uhr, Sa–So 12–1 Uhr · Küche bis 22 Uhr, später nach Vereinbarung"],
      ["Sprachen", "Service auf Deutsch, Englisch und Italienisch"],
      ["Rechnung", "auf Ihre Firmenadresse, mit ausgewiesener Mehrwertsteuer"],
    ] as [string, string][],
    menuesTitel: "Menüs für Ihr Messe-Dinner",
    menuesIntro:
      "Unsere Degustationsmenüs aus der Speisekarte: vier Gänge zum festen Preis pro Person, inklusive Mehrwertsteuer, direkt beim Restaurant gebucht.",
    allergene: "Informationen zu Allergenen und Zusatzstoffen erhalten Sie auf Anfrage. Alle Gerichte à la carte finden Sie in unserer",
    speisekarteLink: "vollständigen Speisekarte",
    platzTitel: "Platz für Ihre Gruppe",
    platzP1:
      "Im Winter decken wir innen für bis zu 100 Gäste an Tischen ein. Im Sommer kommt die Terrasse dazu, dann sitzen bis zu 200 Gäste. Für einen Empfang im Stehen haben innen und außen zusammen bis zu 400 Gäste Platz.",
    platzP2:
      "Bei kaltem oder nassem Wetter stellen wir gegen Aufpreis gern ein Zelt auf. Dafür erstellen wir Ihnen ein individuelles Angebot nach Ihren Wünschen.",
    hausTitel: "Das ganze Haus für Ihre Firma",
    hausP: "Das ganze STORIA können Sie auf Anfrage exklusiv mieten; den Preis nennen wir Ihnen im Angebot.",
    ablaufTitel: "So läuft Ihr Messeabend",
    ablauf: [
      ["Anfrage", "Sie nennen uns Datum, Gästezahl und Messe – per Telefon, E-Mail oder WhatsApp."],
      ["Angebot", "Sie erhalten ein persönliches Angebot mit Menü, Getränken, Anzahlung und Stornobedingungen."],
      ["Bestätigung", "Sobald Sie zusagen, ist Ihr Abend fest reserviert."],
      ["Der Abend", "Ihre Gäste kommen mit der U2 (3–4 Min. ab Königsplatz) oder mit dem Reisebus direkt vor die Tür."],
    ] as [string, string][],
    anfahrtTitel: "Gruppenessen nach der Messe Riem: so kommen Sie zu uns",
    anfahrtLead: "Mit der U2, ohne Umsteigen.",
    schritte: [
      ["1", "Messe München", "U2 ab Messestadt West oder Ost"],
      ["2", "Königsplatz", "23 Min. ab West, 24 Min. ab Ost, alle 5 Min."],
      ["S", "STORIA", "Karlstraße 47a, 3–4 Min. zu Fuß"],
      ["H", "Hotel am Hauptbahnhof", "5–8 Min. zu Fuß"],
    ] as [string, string, string][],
    anfahrtSatz:
      "Von der Messe München fahren Sie mit der U2 ohne Umsteigen in rund 30 Minuten ins STORIA in der Karlstraße 47a; nach dem Essen sind Sie in 5 bis 8 Minuten zu Fuß am Hauptbahnhof.",
    anfahrtHinweis: "Fahrzeiten ohne Gewähr, Stand Oktober 2026.",
    wegKopf: ["Weg", "Dauer", "Hinweis"],
    wege: [
      ["Messe → STORIA mit der U2", "ca. 26–30 Min.", "U2 Messestadt West → Königsplatz 23 Min. (ab Ost 24 Min.), dann 3–4 Min. zu Fuß"],
      ["ICM → STORIA mit der U2", "ca. 26–30 Min.", "Das ICM liegt an der Station Messestadt West, gleiche Linie"],
      ["Messe → STORIA mit dem Taxi", "ca. 20–30 Min.", "rund 12 km; bei freier Straße etwa 16 Min."],
      ["Hauptbahnhof → STORIA", "5–8 Min. zu Fuß", "ab Ausgang Nord/Arnulfstraße; Tram ab Hauptbahnhof Nord 4 Min."],
      ["Flughafen → STORIA", "ca. 45–50 Min.", "S8 bis Hauptbahnhof und U2 bis Königsplatz, oder S8 bis Karlsplatz (Stachus) und Tram 21"],
      ["Tram 20/21, Haltestelle Karlstraße", "1 Min. zu Fuß", "direkt vor der Tür; nachts N20"],
      ["Parkhaus Marsstraße, Hirtenstraße 14", "ca. 6 Min. zu Fuß (450 m)", "rund um die Uhr geöffnet, Einfahrtshöhe 2,00 m"],
      ["Tiefgarage Neue Hopfenpost, Hopfenstraße 6", "ca. 10 Min. zu Fuß (710 m)", "Einfahrt Mo–Sa 6:30–21 Uhr, So geschlossen, Ausfahrt jederzeit"],
      ["Reisebus", "–", "hält direkt vor der Tür"],
    ] as [string, string, string][],
    hotelStand: "Stand: Oktober 2026. Die Angaben dienen nur der Orientierung; wir arbeiten mit keinem der Häuser zusammen.",
    hotelsZentralTitel: "Hotels am Hauptbahnhof: nach dem Essen zu Fuß zurück",
    hotelsZentralKopf: ["Hotel", "Adresse", "Zu Fuß", "Taxi"],
    hotelsMesseTitel: "Hotels an der Messe: mit der U2 zu uns",
    hotelsMesseLead: "Wer in einem Hotel an der Messe wohnt, ist mit der U-Bahn oder S-Bahn in 34 bis 42 Minuten bei uns und auf demselben Weg wieder zurück.",
    hotelsMesseKopf: ["Hotel", "Adresse", "U-Bahn/S-Bahn", "Taxi"],
    nachTitel: "Nach Messeschluss ins STORIA",
    nachP:
      "Bei der BAU schließen die Hallen laut Veranstalter um 18:00 Uhr. Mit der U2 sind Sie gegen 19 Uhr bei uns. Unsere Küche ist bis 22:00 Uhr geöffnet, auf Vereinbarung auch länger.",
    planTitel: "Rechtzeitig planen",
    planP: "Firmen fragen bei uns im Mittel rund zehn Wochen vor dem Termin an. So bleibt Zeit, Menü und Ablauf in Ruhe abzustimmen.",
    naechsteTitel: "Die nächsten großen Messen in München",
    naechsteStand: "Stand: Oktober 2026 · Termine laut Veranstalter, ohne Gewähr",
    naechste: [
      { id: "bau", name: "BAU", branche: "Architektur, Bau", termin: "11.–15. Januar 2027", text: "Hallen geöffnet 9:30–18:00 Uhr. 2025 kamen laut Veranstalter mehr als 180.000 Besucher.", link: "BAU im Messekalender" },
      { id: "iaa", name: "IAA Mobility", branche: "Mobilität", termin: "7.–12. September 2027", text: "2025 kamen laut Veranstalter VDA mehr als 500.000 Besucher.", link: "IAA Mobility im Messekalender" },
      { id: "bauma", name: "bauma", branche: "Baumaschinen", termin: "3.–9. April 2028", text: "Nur alle drei Jahre; 2025 kamen laut Veranstalter rund 600.000 Besucher.", link: "Kundenabend zur bauma planen" },
    ],
    kalenderTitel: "Messekalender München",
    kalenderLead: "Welche Messe wann in München stattfindet – nach Monat und Turnus. Die genauen Termine nennt der jeweilige Veranstalter.",
    kalenderKopf: ["Monat", "Messe", "Branche", "Turnus"],
    kalenderCta: "Tisch zur Messe anfragen",
    faqTitel: "Häufige Fragen zum Firmenessen während der Messe",
    faq: [
      { q: "Wie kommen wir von der Messe München ins STORIA?", a: "Von der Messe München fahren Sie mit der U2 ohne Umsteigen bis Königsplatz (23 Min. ab Messestadt West, 24 Min. ab Messestadt Ost) und gehen von dort 3–4 Minuten zur Karlstraße 47a. Mit dem Taxi brauchen Sie je nach Verkehr 20–30 Minuten." },
      { q: "Wie viele Gäste passen ins STORIA?", a: "Im STORIA haben bis zu 400 Gäste im Stehen Platz, innen und außen zusammen. Sitzend sind es im Winter 100 Gäste innen, im Sommer mit Terrasse 200." },
      { q: "Was kostet ein Firmenessen im STORIA?", a: "Unsere Menüs mit vier Gängen kosten 59 € («Vegetale») oder 68 € («Mare», «Terra») pro Person inklusive Mehrwertsteuer, mit Weinbegleitung 89 € bzw. 96 €. Weitere Getränke berechnen wir nach Karte; alles Weitere steht in Ihrem persönlichen Angebot." },
      { q: "Gibt es eine Getränkepauschale?", a: "Eine Getränkepauschale stellen wir Ihnen auf Anfrage zusammen. Zu jedem Menü bieten wir außerdem eine passende Weinbegleitung an." },
      { q: "Gibt es vegetarische und vegane Gerichte? Wie gehen Sie mit Allergien um?", a: "Das Menü «Vegetale» ist vegetarisch; eine vegane Variante bereiten wir auf Anfrage zu. Informationen zu Allergenen und Zusatzstoffen erhalten Sie auf Anfrage; nennen Sie uns Allergien und Unverträglichkeiten Ihrer Gäste bitte schon bei der Anfrage." },
      { q: "Wie spät können wir nach Messeschluss beginnen?", a: "Unsere Küche ist bis 22:00 Uhr geöffnet, auf Vereinbarung auch länger; das Restaurant hat täglich bis 1 Uhr geöffnet. Wer um 18 Uhr die Messe verlässt, ist mit der U2 gegen 19 Uhr bei uns." },
      { q: "Können wir das ganze STORIA exklusiv mieten?", a: "Das ganze STORIA können Sie auf Anfrage exklusiv mieten; den Preis nennen wir Ihnen im Angebot." },
      { q: "Können wir auf die Firma bezahlen?", a: "Sie erhalten eine Rechnung auf Ihre Firmenadresse mit ausgewiesener Mehrwertsteuer. Bezahlen können Sie per Überweisung auf Rechnung oder online mit Karte." },
      { q: "Wie hoch ist die Anzahlung, und bis wann können wir stornieren?", a: "Anzahlung und Stornobedingungen stehen in Ihrem persönlichen Angebot, bevor Sie verbindlich zusagen." },
      { q: "Gibt es Service und Speisekarten auf Englisch?", a: "Unser Team bedient Sie auf Deutsch, Englisch und Italienisch. Auch unsere Speisekarte gibt es auf Englisch." },
      { q: "Können wir auch draußen feiern, wenn es kalt ist?", a: "Bei kaltem oder nassem Wetter stellen wir gegen Aufpreis gern ein Zelt auf. Dafür erstellen wir Ihnen ein individuelles Angebot nach Ihren Wünschen." },
      { q: "Gibt es Technik für eine Rede, etwa ein Mikrofon?", a: "Für Reden und Präsentationen stehen im STORIA ein Mikrofon, Lautsprecher und ein Bildschirm bereit." },
      { q: "Können wir das Restaurant vorher besichtigen?", a: "Gern zeigen wir Ihnen das STORIA vorab; den Termin vereinbaren wir nach Absprache." },
      { q: "Ist das STORIA barrierefrei?", a: "Das STORIA hat einen stufenlosen Zugang und ein barrierefreies WC." },
      { q: "Wo können unsere Gäste parken, und kann ein Reisebus halten?", a: "Das nächste Parkhaus ist das Parkhaus Marsstraße in der Hirtenstraße 14, rund um die Uhr geöffnet und etwa 6 Minuten zu Fuß entfernt. Ein Reisebus kann direkt vor der Tür halten." },
    ],
    formTitel: "Ihr Messeabend im STORIA",
    formLead: "Nennen Sie uns Datum, Gästezahl und Messe. Wir schicken Ihnen ein persönliches Angebot.",
    disclaimer:
      "STORIA steht in keiner Verbindung zur Messe München GmbH oder zu anderen Messeveranstaltern. Messenamen sind Marken ihrer Inhaber und dienen hier nur der Beschreibung. Termine ohne Gewähr; maßgeblich sind die Angaben der Veranstalter.",
    weiter: "Weiterlesen",
    links: [
      ["firmenfeier-muenchen", "Firmenfeier im STORIA"],
      ["speisekarte", "Speisekarte"],
      ["messe-muenchen/bauma", "Restaurant zur bauma"],
    ] as [string, string][],
  },
  menue: {
    gaenge4: "4 Gänge",
    proPerson: "p. P. inkl. MwSt.",
    mitWein: "Mit Weinbegleitung",
    anfragen: "Anfragen",
    menues: [
      { key: "vegetale", name: "«Vegetale»", art: "4 Gänge, vegetarisch", gaenge: ["Pfifferlinge, frische Artischocken und Ofenpaprika mit Erbsen-Minz-Creme", "Paccheri mit Burratacreme und Pistazien", "Risotto mit Steinpilzen", "Amalfi-Tortino al Limone"] },
      { key: "mare", name: "«Mare»", art: "4 Gänge, Fisch und Meeresfrüchte", gaenge: ["Oktopus-Carpaccio mit Zitrusvinaigrette, Babyspinat und Scampi", "Tagliolini mit Scampi in Hummerfond", "Gegrillte Tagliata vom Gelbflossen-Thunfisch mit Kräuterkruste auf Erbsen-Minz-Creme", "Amalfi-Tortino al Limone"] },
      { key: "terra", name: "«Terra»", art: "4 Gänge, Fleisch", gaenge: ["Roastbeef mit grüner Kräutersauce, gegrillten Artischocken und Butterkartoffeln", "Hausgemachte Ravioli mit Steinpilz-Ricotta-Füllung «alla Vaccinara» und Ochsenschwanzragout", "Zarte Kalbsrückenmedaillons mit sautierten Kräuterseitlingen in Marsalasauce", "Amalfi-Tortino al Limone"] },
    ] as Menue[],
  },
  bauma: {
    seoTitle: "Restaurant zur bauma München – Kundenabend im STORIA",
    seoDescription: "Kundenabend zur bauma: Mit der U2 von der Messe Riem in rund 30 Minuten ins STORIA, Karlstraße 47a. Menüs ab 59 € p. P. inkl. MwSt.",
    breadcrumb: "bauma",
    kicker: "bauma · alle drei Jahre in München",
    h1: "Restaurant zur bauma München: Kundenabend in der Innenstadt",
    intro:
      "Die bauma ist laut Messe München die Weltleitmesse für Baumaschinen; 2025 kamen rund 600.000 Besucher aus mehr als 200 Ländern. Ihren Kundenabend richten wir im STORIA in der Karlstraße 47a aus – mit der U2 ohne Umsteigen von der Messe Riem erreichbar.",
    ctaAnfrage: "bauma-Abend anfragen",
    ctaMenues: "Menüs ansehen",
    zahlen: [
      ["3.–9. April 2028", "nächste bauma (Stand 10/2026)"],
      ["rund 600.000", "Besucher 2025 laut Veranstalter"],
      ["U2", "ohne Umsteigen, rund 30 Min. bis zu uns"],
      ["bis 400", "Gäste stehend · sitzend 100 im Winter, 200 im Sommer"],
    ] as [string, string][],
    andersTitel: "Was bei der bauma anders ist",
    andersP1:
      "2025 stellten laut Messe München 3.601 Unternehmen aus 57 Nationen aus. Viele bringen internationale Kunden mit; Ihr Abend sollte deshalb auf Englisch funktionieren – bei uns bedient Sie das Team auf Deutsch, Englisch und Italienisch.",
    andersP2: "Die bauma findet nur alle drei Jahre statt, zuletzt im April 2025, das nächste Mal vom 3. bis 9. April 2028.",
    wegTitel: "Von der bauma ins STORIA",
    wegKopf: ["Ab", "Weg", "Dauer"],
    wege: [
      ["Eingang West / ICM", "U2 Messestadt West → Königsplatz, dann 3–4 Min. zu Fuß", "ca. 26–27 Min."],
      ["Eingang Ost", "U2 Messestadt Ost → Königsplatz, dann 3–4 Min. zu Fuß", "ca. 27–28 Min."],
      ["Gruppe mit Reisebus", "hält direkt vor der Tür", "–"],
    ] as [string, string, string][],
    wegSatz: "Von der bauma fahren Sie mit der U2 ohne Umsteigen in rund 30 Minuten ins STORIA, Karlstraße 47a in München.",
    menuesTitel: "Menüs für Ihren bauma-Abend",
    menuesHinweis: "Alle Gänge finden Sie auf der Seite zum",
    menuesHubLink: "Firmenessen während der Messe",
    menuesUnd: "und in unserer",
    faqTitel: "Fragen zur bauma",
    faq: [
      { q: "Wann ist die nächste bauma?", a: "Die nächste bauma findet laut Messe München vom 3. bis 9. April 2028 auf dem Messegelände in München-Riem statt; sie ist alle drei Jahre (Stand 10/2026)." },
      { q: "Wie kommen wir von der bauma ins STORIA?", a: "Von der bauma fahren Sie mit der U2 ohne Umsteigen bis Königsplatz (23 Min. ab West, 24 Min. ab Ost) und gehen dann 3–4 Minuten zur Karlstraße 47a." },
      { q: "Gibt es Service und Speisekarten auf Englisch?", a: "Unser Team bedient Sie auf Deutsch, Englisch und Italienisch, und unsere Speisekarte gibt es auch auf Englisch." },
      { q: "Kann ein Reisebus vor dem Restaurant halten?", a: "Ein Reisebus kann direkt vor dem STORIA in der Karlstraße halten." },
      { q: "Was kostet ein Kundenabend zur bauma?", a: "Es gelten die Preise unserer aktuellen Speisekarte, auch während der bauma. Derzeit kosten die Menüs mit vier Gängen 59 € oder 68 € pro Person inklusive Mehrwertsteuer, mit Weinbegleitung 89 € bzw. 96 €." },
    ],
    formTitel: "Ihr Kundenabend zur bauma",
    formLead: "Nennen Sie uns Datum und Gästezahl. Wir schicken Ihnen ein persönliches Angebot.",
    disclaimer:
      "bauma ist eine Marke der Messe München GmbH. STORIA steht in keiner Verbindung zur Messe München oder zur bauma; der Name dient nur der Beschreibung. Termine ohne Gewähr.",
    eventName: "bauma 2028",
  },
};

export type MesseTexte = typeof de;

const en: MesseTexte = {
  hub: {
    seoTitle: "Trade Fair Dinner Munich – Group Dining at STORIA, City Centre",
    seoDescription:
      "Corporate dinner during Messe München: take the U2 with no change to STORIA, Karlstraße 47a. Tasting menus from €59 p.p., up to 200 seated, 400 standing.",
    breadcrumb: "Messe München",
    kicker: "Trade fair dinner Munich",
    h1: "Corporate dinner during Messe München – in the city centre, one metro line away",
    intro:
      "STORIA is at Karlstraße 47a in Munich's Maxvorstadt district. From Messe München in Riem, take the U2 with no change to Königsplatz; from there it is a three to four minute walk. We host your group for up to 400 guests standing, and seated for 100 guests in winter and 200 in summer including the terrace.",
    ctaAnfrage: "Request a trade fair dinner",
    ctaMenues: "See the menus",
    blickTitel: "At a glance",
    blick: [
      ["Restaurant", "STORIA – Ristorante Pizzeria Bar, Italian cuisine, run by the Speranza family since 2015"],
      ["Address", "Karlstraße 47a, 80333 Munich (Maxvorstadt)"],
      ["From Messe München", "U2 from Messestadt West or Ost to Königsplatz, no change, 23–24 min ride plus a 3–4 min walk"],
      ["Nearby", "U-Bahn Königsplatz (U2) · Tram 20/21, Karlstraße stop, 1 min · Munich Central Station 5–8 min on foot"],
      ["Capacity", "up to 400 guests standing (indoors and outdoors combined) · seated: 100 in winter, 200 in summer including the terrace"],
      ["Menus", "4 courses «Vegetale» €59, «Sea» and «Land» €68 each per person incl. VAT; with wine pairing €89 or €96"],
      ["Opening hours", "Mon–Fri 9 am–1 am, Sat–Sun 12 pm–1 am · kitchen until 10 pm, later by arrangement"],
      ["Languages", "Service in German, English and Italian"],
      ["Invoice", "to your company address, with VAT shown separately"],
    ],
    menuesTitel: "Menus for your trade fair dinner",
    menuesIntro:
      "Our tasting menus from the menu card: four courses at a fixed price per person, including VAT, booked directly with the restaurant.",
    allergene: "Information on allergens and additives is available on request. All à la carte dishes are on our",
    speisekarteLink: "full menu",
    platzTitel: "Room for your group",
    platzP1:
      "In winter we set tables indoors for up to 100 guests. In summer the terrace is added, seating up to 200 guests. For a standing reception, indoors and outdoors together hold up to 400 guests.",
    platzP2:
      "In cold or wet weather we are happy to put up a marquee for an additional charge – we will prepare an individual quote tailored to your needs.",
    hausTitel: "The whole restaurant for your company",
    hausP: "You can hire the whole of STORIA exclusively on request; we will state the price in your quote.",
    ablaufTitel: "How your trade fair evening works",
    ablauf: [
      ["Request", "Tell us the date, number of guests and trade fair – by phone, email or WhatsApp."],
      ["Quote", "You receive a personal quote with menu, drinks, deposit and cancellation terms."],
      ["Confirmation", "As soon as you accept, your evening is firmly reserved."],
      ["The evening", "Your guests arrive by U2 (3–4 min walk from Königsplatz) or by coach right to the door."],
    ],
    anfahrtTitel: "Group dinner after the Riem trade fair: how to get here",
    anfahrtLead: "By U2, no change.",
    schritte: [
      ["1", "Messe München", "U2 from Messestadt West or Ost"],
      ["2", "Königsplatz", "23 min from West, 24 min from Ost, every 5 min"],
      ["S", "STORIA", "Karlstraße 47a, 3–4 min on foot"],
      ["H", "Hotel at Central Station", "5–8 min on foot"],
    ],
    anfahrtSatz:
      "From Messe München, the U2 takes you to STORIA at Karlstraße 47a with no change in about 30 minutes; after dinner, Munich Central Station is a 5 to 8 minute walk away.",
    anfahrtHinweis: "Travel times without guarantee, as of October 2026.",
    wegKopf: ["Route", "Time", "Note"],
    wege: [
      ["Trade fair → STORIA by U2", "approx. 26–30 min", "U2 Messestadt West → Königsplatz 23 min (from Ost 24 min), then 3–4 min on foot"],
      ["ICM → STORIA by U2", "approx. 26–30 min", "The ICM is at Messestadt West station, same line"],
      ["Trade fair → STORIA by taxi", "approx. 20–30 min", "about 12 km; around 16 min in light traffic"],
      ["Central Station → STORIA", "5–8 min on foot", "from the north exit/Arnulfstraße; tram from Hauptbahnhof Nord 4 min"],
      ["Airport → STORIA", "approx. 45–50 min", "S8 to Central Station and U2 to Königsplatz, or S8 to Karlsplatz (Stachus) and tram 21"],
      ["Tram 20/21, Karlstraße stop", "1 min on foot", "right outside the door; at night N20"],
      ["Parkhaus Marsstraße, Hirtenstraße 14", "approx. 6 min on foot (450 m)", "open 24/7, entrance height 2.00 m"],
      ["Underground car park Neue Hopfenpost, Hopfenstraße 6", "approx. 10 min on foot (710 m)", "entry Mon–Sat 6:30 am–9 pm, closed Sun, exit at any time"],
      ["Coach", "–", "stops right outside the door"],
    ],
    hotelStand: "As of October 2026. For orientation only; we do not work with any of these hotels.",
    hotelsZentralTitel: "Hotels at Central Station: walk back after dinner",
    hotelsZentralKopf: ["Hotel", "Address", "On foot", "Taxi"],
    hotelsMesseTitel: "Hotels at the trade fair: reach us by U2",
    hotelsMesseLead: "If you are staying at a hotel near the trade fair, the U-Bahn or S-Bahn brings you to us in 34 to 42 minutes, and back the same way.",
    hotelsMesseKopf: ["Hotel", "Address", "U-Bahn/S-Bahn", "Taxi"],
    nachTitel: "From the trade fair to STORIA",
    nachP:
      "At BAU, the halls close at 6 pm according to the organiser. Taking the U2, you will be with us at around 7 pm. Our kitchen is open until 10 pm, later by arrangement.",
    planTitel: "Plan ahead",
    planP: "Companies typically send us their request around ten weeks before the date. That leaves time to agree on the menu and schedule at leisure.",
    naechsteTitel: "The next major trade fairs in Munich",
    naechsteStand: "As of October 2026 · dates according to the organisers, without guarantee",
    naechste: [
      { id: "bau", name: "BAU", branche: "Architecture, construction", termin: "11–15 January 2027", text: "Halls open 9:30 am–6 pm. In 2025, more than 180,000 visitors attended according to the organiser.", link: "BAU in the trade fair calendar" },
      { id: "iaa", name: "IAA Mobility", branche: "Mobility", termin: "7–12 September 2027", text: "In 2025, more than 500,000 visitors attended according to the organiser VDA.", link: "IAA Mobility in the trade fair calendar" },
      { id: "bauma", name: "bauma", branche: "Construction machinery", termin: "3–9 April 2028", text: "Only every three years; around 600,000 visitors attended in 2025 according to the organiser.", link: "Plan a client evening at bauma" },
    ],
    kalenderTitel: "Munich trade fair calendar",
    kalenderLead: "Which trade fair takes place in Munich and when – by month and frequency. Exact dates are published by each organiser.",
    kalenderKopf: ["Month", "Trade fair", "Sector", "Frequency"],
    kalenderCta: "Request a table for your trade fair",
    faqTitel: "Frequently asked questions about corporate dining during trade fairs",
    faq: [
      { q: "How do we get from Messe München to STORIA?", a: "From Messe München, take the U2 with no change to Königsplatz (23 min from Messestadt West, 24 min from Messestadt Ost) and walk 3–4 minutes to Karlstraße 47a. By taxi it takes 20–30 minutes depending on traffic." },
      { q: "How many guests does STORIA hold?", a: "STORIA holds up to 400 guests standing, indoors and outdoors combined. Seated, it is 100 guests indoors in winter and 200 in summer including the terrace." },
      { q: "How much does a corporate dinner at STORIA cost?", a: "Our four-course menus cost €59 («Vegetale») or €68 («Sea», «Land») per person including VAT, with wine pairing €89 or €96. Other drinks are charged as per the menu; everything else is set out in your personal quote." },
      { q: "Do you offer a drinks package?", a: "We put together a drinks package for you on request. We also offer a matching wine pairing with every menu." },
      { q: "Are there vegetarian and vegan dishes? How do you handle allergies?", a: "The «Vegetale» menu is vegetarian; a vegan version is available on request. Information on allergens and additives is available on request; please let us know about your guests' allergies and intolerances when you send your request." },
      { q: "How late can we start after the trade fair closes?", a: "Our kitchen is open until 10 pm, later by arrangement; the restaurant is open daily until 1 am. If you leave the trade fair at 6 pm, the U2 gets you to us at around 7 pm." },
      { q: "Can we hire the whole of STORIA exclusively?", a: "You can hire the whole of STORIA exclusively on request; we will state the price in your quote." },
      { q: "Can we pay on the company account?", a: "You receive an invoice to your company address with VAT shown separately. You can pay by bank transfer on invoice or online by card." },
      { q: "How much is the deposit, and until when can we cancel?", a: "The deposit and cancellation terms are set out in your personal quote before you confirm." },
      { q: "Is service and the menu available in English?", a: "Our team serves you in German, English and Italian. Our menu is also available in English." },
      { q: "Can we celebrate outdoors when it is cold?", a: "In cold or wet weather we are happy to put up a marquee for an additional charge – we will prepare an individual quote tailored to your needs." },
      { q: "Is there equipment for a speech, such as a microphone?", a: "For speeches and presentations, STORIA provides a microphone, speakers and a screen." },
      { q: "Can we view the restaurant beforehand?", a: "We are happy to show you around STORIA in advance; we will arrange a time with you." },
      { q: "Is STORIA accessible?", a: "STORIA has step-free access and an accessible toilet." },
      { q: "Where can our guests park, and can a coach stop?", a: "The nearest car park is Parkhaus Marsstraße at Hirtenstraße 14, open 24/7 and about a 6 minute walk away. A coach can stop right outside the door." },
    ],
    formTitel: "Your trade fair evening at STORIA",
    formLead: "Tell us the date, number of guests and trade fair. We will send you a personal quote.",
    disclaimer:
      "STORIA is not affiliated with Messe München GmbH or any other trade fair organiser. Trade fair names are trademarks of their owners and are used here for descriptive purposes only. Dates without guarantee; the organisers' information is authoritative.",
    weiter: "Read more",
    links: [
      ["firmenfeier-muenchen", "Corporate events at STORIA"],
      ["speisekarte", "Menu"],
      ["messe-muenchen/bauma", "Restaurant for bauma"],
    ],
  },
  menue: {
    gaenge4: "4 courses",
    proPerson: "p.p. incl. VAT",
    mitWein: "With wine pairing",
    anfragen: "Enquire",
    menues: [
      { key: "vegetale", name: "«Vegetale»", art: "4 courses, vegetarian", gaenge: ["Chanterelles, fresh artichokes and oven-baked peppers with pea-mint cream", "Paccheri with burrata cream and pistachios", "Risotto with porcini mushrooms", "Amalfi Lemon Cake"] },
      { key: "mare", name: "«Sea»", art: "4 courses, fish and seafood", gaenge: ["Octopus carpaccio dressed with citrus vinaigrette, baby spinach and scampi", "Tagliolini with scampi in lobster stock", "Grilled yellowfin tuna tagliata with herb crust on pea-mint cream", "Amalfi Lemon Cake"] },
      { key: "terra", name: "«Land»", art: "4 courses, meat", gaenge: ["Roast beef with green herb sauce, served with grilled artichokes and buttered potatoes", "Homemade ravioli filled with porcini mushroom and ricotta \"a la Vaccinara\" with oxtail ragout", "Tender veal loin medallions with sautéed king oyster mushrooms in Marsala sauce", "Amalfi Lemon Cake"] },
    ],
  },
  bauma: {
    seoTitle: "Restaurant for bauma Munich – Client Evening at STORIA",
    seoDescription: "Client evening during bauma: take the U2 from the Riem trade fair to STORIA, Karlstraße 47a, in about 30 minutes. Menus from €59 p.p. incl. VAT.",
    breadcrumb: "bauma",
    kicker: "bauma · every three years in Munich",
    h1: "Restaurant for bauma Munich: client evening in the city centre",
    intro:
      "According to Messe München, bauma is the world's leading trade fair for construction machinery; in 2025 around 600,000 visitors came from more than 200 countries. We host your client evening at STORIA, Karlstraße 47a – reachable from the Riem trade fair by U2 with no change.",
    ctaAnfrage: "Request a bauma evening",
    ctaMenues: "See the menus",
    zahlen: [
      ["3–9 April 2028", "next bauma (as of 10/2026)"],
      ["around 600,000", "visitors in 2025 according to the organiser"],
      ["U2", "no change, about 30 min to us"],
      ["up to 400", "guests standing · seated 100 in winter, 200 in summer"],
    ],
    andersTitel: "What is different about bauma",
    andersP1:
      "In 2025, according to Messe München, 3,601 companies from 57 nations exhibited. Many bring international clients, so your evening should work in English – our team serves you in German, English and Italian.",
    andersP2: "bauma takes place only every three years – last in April 2025, next from 3 to 9 April 2028.",
    wegTitel: "From bauma to STORIA",
    wegKopf: ["From", "Route", "Time"],
    wege: [
      ["West entrance / ICM", "U2 Messestadt West → Königsplatz, then 3–4 min on foot", "approx. 26–27 min"],
      ["East entrance", "U2 Messestadt Ost → Königsplatz, then 3–4 min on foot", "approx. 27–28 min"],
      ["Group by coach", "stops right outside the door", "–"],
    ],
    wegSatz: "From bauma, the U2 takes you with no change to STORIA, Karlstraße 47a in Munich, in about 30 minutes.",
    menuesTitel: "Menus for your bauma evening",
    menuesHinweis: "All courses are listed on the page about",
    menuesHubLink: "corporate dining during trade fairs",
    menuesUnd: "and on our",
    faqTitel: "Questions about bauma",
    faq: [
      { q: "When is the next bauma?", a: "According to Messe München, the next bauma takes place from 3 to 9 April 2028 at the trade fair centre in Munich-Riem; it is held every three years (as of 10/2026)." },
      { q: "How do we get from bauma to STORIA?", a: "From bauma, take the U2 with no change to Königsplatz (23 min from West, 24 min from Ost) and walk 3–4 minutes to Karlstraße 47a." },
      { q: "Is service and the menu available in English?", a: "Our team serves you in German, English and Italian, and our menu is also available in English." },
      { q: "Can a coach stop outside the restaurant?", a: "A coach can stop right outside STORIA on Karlstraße." },
      { q: "How much does a client evening during bauma cost?", a: "The prices of our current menu apply, also during bauma. Our four-course menus currently cost €59 or €68 per person including VAT, with wine pairing €89 or €96." },
    ],
    formTitel: "Your client evening during bauma",
    formLead: "Tell us the date and number of guests. We will send you a personal quote.",
    disclaimer:
      "bauma is a trademark of Messe München GmbH. STORIA is not affiliated with Messe München or bauma; the name is used for descriptive purposes only. Dates without guarantee.",
    eventName: "bauma 2028",
  },
};

const it: MesseTexte = {
  hub: {
    seoTitle: "Cena in fiera a Monaco – cena aziendale allo STORIA, in centro",
    seoDescription:
      "Cena aziendale durante la Messe München: con la U2 senza cambi allo STORIA, Karlstraße 47a. Menu degustazione da 59 € a persona, fino a 200 seduti, 400 in piedi.",
    breadcrumb: "Messe München",
    kicker: "Cena in fiera a Monaco",
    h1: "Cena aziendale durante la Messe München – in centro, a una sola linea di metropolitana",
    intro:
      "Lo STORIA si trova in Karlstraße 47a, nel quartiere Maxvorstadt. Dalla Messe München a Riem prendete la U2 senza cambi fino a Königsplatz; da lì sono tre-quattro minuti a piedi. Organizziamo la vostra cena di gruppo per fino a 400 ospiti in piedi, seduti per 100 ospiti in inverno e 200 in estate con la terrazza.",
    ctaAnfrage: "Richiedi una serata in fiera",
    ctaMenues: "Vedi i menu",
    blickTitel: "In breve",
    blick: [
      ["Ristorante", "STORIA – Ristorante Pizzeria Bar, cucina italiana, gestito dalla famiglia Speranza dal 2015"],
      ["Indirizzo", "Karlstraße 47a, 80333 Monaco di Baviera (Maxvorstadt)"],
      ["Dalla Messe München", "U2 da Messestadt West o Ost fino a Königsplatz, senza cambi, 23–24 min di viaggio più 3–4 min a piedi"],
      ["Nelle vicinanze", "Metro Königsplatz (U2) · Tram 20/21, fermata Karlstraße, 1 min · Stazione centrale 5–8 min a piedi"],
      ["Posti", "fino a 400 ospiti in piedi (interno ed esterno insieme) · seduti 100 in inverno, 200 in estate con la terrazza"],
      ["Menu", "4 portate «Vegetale» 59 €, «Mare» e «Terra» 68 € ciascuno a persona IVA inclusa; con abbinamento vini 89 € o 96 €"],
      ["Orari", "lun–ven 9–1, sab–dom 12–1 · cucina fino alle 22, più tardi su accordo"],
      ["Lingue", "servizio in tedesco, inglese e italiano"],
      ["Fattura", "intestata alla vostra azienda, con IVA indicata"],
    ],
    menuesTitel: "Menu per la vostra cena in fiera",
    menuesIntro:
      "I nostri menu degustazione dalla carta: quattro portate a prezzo fisso a persona, IVA inclusa, prenotati direttamente presso il ristorante.",
    allergene: "Informazioni su allergeni e additivi sono disponibili su richiesta. Tutti i piatti alla carta sono nel nostro",
    speisekarteLink: "menu completo",
    platzTitel: "Spazio per il vostro gruppo",
    platzP1:
      "In inverno apparecchiamo all'interno per fino a 100 ospiti. In estate si aggiunge la terrazza e i posti a sedere diventano 200. Per un ricevimento in piedi, interno ed esterno insieme accolgono fino a 400 ospiti.",
    platzP2:
      "In caso di freddo o maltempo possiamo allestire una tensostruttura con un supplemento: le prepariamo volentieri un'offerta personalizzata in base alle sue esigenze.",
    hausTitel: "Tutto il ristorante per la vostra azienda",
    hausP: "Su richiesta potete affittare in esclusiva tutto lo STORIA; il prezzo è indicato nell'offerta.",
    ablaufTitel: "Come si svolge la vostra serata in fiera",
    ablauf: [
      ["Richiesta", "Indicateci data, numero di ospiti e fiera – per telefono, e-mail o WhatsApp."],
      ["Offerta", "Ricevete un'offerta personale con menu, bevande, acconto e condizioni di cancellazione."],
      ["Conferma", "Appena confermate, la vostra serata è prenotata."],
      ["La serata", "I vostri ospiti arrivano con la U2 (3–4 min a piedi da Königsplatz) o in pullman fino alla porta."],
    ],
    anfahrtTitel: "Cena di gruppo dopo la fiera di Riem: come raggiungerci",
    anfahrtLead: "Con la U2, senza cambi.",
    schritte: [
      ["1", "Messe München", "U2 da Messestadt West o Ost"],
      ["2", "Königsplatz", "23 min da West, 24 min da Ost, ogni 5 min"],
      ["S", "STORIA", "Karlstraße 47a, 3–4 min a piedi"],
      ["H", "Hotel alla stazione centrale", "5–8 min a piedi"],
    ],
    anfahrtSatz:
      "Dalla Messe München la U2 vi porta senza cambi allo STORIA in Karlstraße 47a in circa 30 minuti; dopo cena la stazione centrale è a 5–8 minuti a piedi.",
    anfahrtHinweis: "Tempi di percorrenza senza garanzia, aggiornati a ottobre 2026.",
    wegKopf: ["Percorso", "Durata", "Nota"],
    wege: [
      ["Fiera → STORIA con la U2", "ca. 26–30 min", "U2 Messestadt West → Königsplatz 23 min (da Ost 24 min), poi 3–4 min a piedi"],
      ["ICM → STORIA con la U2", "ca. 26–30 min", "L'ICM si trova alla stazione Messestadt West, stessa linea"],
      ["Fiera → STORIA in taxi", "ca. 20–30 min", "circa 12 km; con strada libera circa 16 min"],
      ["Stazione centrale → STORIA", "5–8 min a piedi", "dall'uscita nord/Arnulfstraße; tram da Hauptbahnhof Nord 4 min"],
      ["Aeroporto → STORIA", "ca. 45–50 min", "S8 fino alla stazione centrale e U2 fino a Königsplatz, oppure S8 fino a Karlsplatz (Stachus) e tram 21"],
      ["Tram 20/21, fermata Karlstraße", "1 min a piedi", "davanti alla porta; di notte N20"],
      ["Parkhaus Marsstraße, Hirtenstraße 14", "ca. 6 min a piedi (450 m)", "aperto 24 ore su 24, altezza d'ingresso 2,00 m"],
      ["Garage sotterraneo Neue Hopfenpost, Hopfenstraße 6", "ca. 10 min a piedi (710 m)", "ingresso lun–sab 6:30–21, domenica chiuso, uscita sempre possibile"],
      ["Pullman", "–", "si ferma davanti alla porta"],
    ],
    hotelStand: "Aggiornato a ottobre 2026. Indicazioni solo orientative; non collaboriamo con nessuno di questi hotel.",
    hotelsZentralTitel: "Hotel alla stazione centrale: dopo cena si torna a piedi",
    hotelsZentralKopf: ["Hotel", "Indirizzo", "A piedi", "Taxi"],
    hotelsMesseTitel: "Hotel in fiera: da noi con la U2",
    hotelsMesseLead: "Chi alloggia in un hotel vicino alla fiera ci raggiunge in metropolitana o S-Bahn in 34–42 minuti e rientra per la stessa strada.",
    hotelsMesseKopf: ["Hotel", "Indirizzo", "U-Bahn/S-Bahn", "Taxi"],
    nachTitel: "Dopo la chiusura della fiera allo STORIA",
    nachP:
      "Alla BAU i padiglioni chiudono alle 18:00 secondo l'organizzatore. Con la U2 siete da noi verso le 19. La nostra cucina è aperta fino alle 22:00, su accordo anche più a lungo.",
    planTitel: "Pianificate per tempo",
    planP: "Le aziende ci inviano la richiesta in media circa dieci settimane prima della data. Così c'è tempo per definire con calma menu e programma.",
    naechsteTitel: "Le prossime grandi fiere a Monaco",
    naechsteStand: "Aggiornato a ottobre 2026 · date secondo gli organizzatori, senza garanzia",
    naechste: [
      { id: "bau", name: "BAU", branche: "Architettura, edilizia", termin: "11–15 gennaio 2027", text: "Padiglioni aperti 9:30–18:00. Nel 2025 i visitatori sono stati oltre 180.000 secondo l'organizzatore.", link: "BAU nel calendario fieristico" },
      { id: "iaa", name: "IAA Mobility", branche: "Mobilità", termin: "7–12 settembre 2027", text: "Nel 2025 i visitatori sono stati oltre 500.000 secondo l'organizzatore VDA.", link: "IAA Mobility nel calendario fieristico" },
      { id: "bauma", name: "bauma", branche: "Macchine edili", termin: "3–9 aprile 2028", text: "Solo ogni tre anni; nel 2025 circa 600.000 visitatori secondo l'organizzatore.", link: "Organizzare una serata clienti alla bauma" },
    ],
    kalenderTitel: "Calendario fieristico di Monaco",
    kalenderLead: "Quale fiera si svolge a Monaco e quando – per mese e cadenza. Le date esatte sono pubblicate dai rispettivi organizzatori.",
    kalenderKopf: ["Mese", "Fiera", "Settore", "Cadenza"],
    kalenderCta: "Richiedi un tavolo per la fiera",
    faqTitel: "Domande frequenti sulla cena aziendale durante la fiera",
    faq: [
      { q: "Come arriviamo dalla Messe München allo STORIA?", a: "Dalla Messe München prendete la U2 senza cambi fino a Königsplatz (23 min da Messestadt West, 24 min da Messestadt Ost) e da lì sono 3–4 minuti a piedi fino a Karlstraße 47a. In taxi servono 20–30 minuti a seconda del traffico." },
      { q: "Quanti ospiti può accogliere lo STORIA?", a: "Lo STORIA accoglie fino a 400 ospiti in piedi, interno ed esterno insieme. Seduti sono 100 ospiti all'interno in inverno e 200 in estate con la terrazza." },
      { q: "Quanto costa una cena aziendale allo STORIA?", a: "I nostri menu di quattro portate costano 59 € («Vegetale») o 68 € («Mare», «Terra») a persona IVA inclusa, con abbinamento vini 89 € o 96 €. Le altre bevande sono conteggiate secondo la carta; tutto il resto è indicato nella vostra offerta personale." },
      { q: "C'è un forfait bevande?", a: "Su richiesta vi prepariamo un forfait bevande. Per ogni menu offriamo inoltre un abbinamento vini adatto." },
      { q: "Ci sono piatti vegetariani e vegani? Come gestite le allergie?", a: "Il menu «Vegetale» è vegetariano; una variante vegana è disponibile su richiesta. Informazioni su allergeni e additivi sono disponibili su richiesta; vi preghiamo di indicarci allergie e intolleranze dei vostri ospiti già nella richiesta." },
      { q: "Quanto tardi possiamo iniziare dopo la chiusura della fiera?", a: "La nostra cucina è aperta fino alle 22:00, su accordo anche più a lungo; il ristorante è aperto tutti i giorni fino all'1. Chi lascia la fiera alle 18 è da noi con la U2 verso le 19." },
      { q: "Possiamo affittare in esclusiva tutto lo STORIA?", a: "Su richiesta potete affittare in esclusiva tutto lo STORIA; il prezzo è indicato nell'offerta." },
      { q: "Possiamo pagare a carico dell'azienda?", a: "Ricevete una fattura intestata alla vostra azienda con IVA indicata. Potete pagare con bonifico su fattura oppure online con carta." },
      { q: "A quanto ammonta l'acconto e fino a quando possiamo cancellare?", a: "Acconto e condizioni di cancellazione sono indicati nella vostra offerta personale, prima della conferma vincolante." },
      { q: "Il servizio e il menu sono disponibili in inglese?", a: "Il nostro team vi serve in tedesco, inglese e italiano. Anche il nostro menu è disponibile in inglese." },
      { q: "Possiamo festeggiare all'aperto anche quando fa freddo?", a: "In caso di freddo o maltempo possiamo allestire una tensostruttura con un supplemento: le prepariamo volentieri un'offerta personalizzata in base alle sue esigenze." },
      { q: "C'è l'attrezzatura per un discorso, ad esempio un microfono?", a: "Per discorsi e presentazioni lo STORIA mette a disposizione microfono, altoparlanti e uno schermo." },
      { q: "Possiamo visitare il ristorante in anticipo?", a: "Vi mostriamo volentieri lo STORIA in anticipo; concordiamo l'appuntamento insieme." },
      { q: "Lo STORIA è accessibile?", a: "Lo STORIA ha un accesso senza gradini e un bagno accessibile." },
      { q: "Dove possono parcheggiare i nostri ospiti e può fermarsi un pullman?", a: "Il parcheggio più vicino è il Parkhaus Marsstraße in Hirtenstraße 14, aperto 24 ore su 24 e a circa 6 minuti a piedi. Un pullman può fermarsi davanti alla porta." },
    ],
    formTitel: "La vostra serata in fiera allo STORIA",
    formLead: "Indicateci data, numero di ospiti e fiera. Vi inviamo un'offerta personale.",
    disclaimer:
      "Lo STORIA non ha alcun legame con Messe München GmbH o con altri organizzatori fieristici. I nomi delle fiere sono marchi dei rispettivi titolari e sono usati qui solo a scopo descrittivo. Date senza garanzia; fanno fede le indicazioni degli organizzatori.",
    weiter: "Per saperne di più",
    links: [
      ["firmenfeier-muenchen", "Eventi aziendali allo STORIA"],
      ["speisekarte", "Menu"],
      ["messe-muenchen/bauma", "Ristorante per la bauma"],
    ],
  },
  menue: {
    gaenge4: "4 portate",
    proPerson: "a persona, IVA incl.",
    mitWein: "Con abbinamento vini",
    anfragen: "Richiedi",
    menues: [
      { key: "vegetale", name: "«Vegetale»", art: "4 portate, vegetariano", gaenge: ["Finferli, carciofi freschi e peperoni al forno con crema di piselli e menta", "Paccheri con crema di burrata e pistacchi", "Risotto ai funghi porcini", "Tortino al Limone Amalfitano"] },
      { key: "mare", name: "«Mare»", art: "4 portate, pesce e frutti di mare", gaenge: ["Carpaccio di polpo condito con vinaigrette agli agrumi, spinacino e scampi", "Tagliolini con scampi in brodo di astice", "Tagliata di tonno pinna gialla alla griglia con crosta di erbe su crema di piselli e menta", "Tortino al Limone Amalfitano"] },
      { key: "terra", name: "«Terra»", art: "4 portate, carne", gaenge: ["Roast beef con salsa alle erbe verdi, servito con carciofi alla griglia e patate al burro", "Ravioli fatti in casa ripieni di funghi porcini e ricotta \"a la Vaccinara\" con ragù di coda di bue", "Medaglioni di filetto di vitello teneri con cardoncelli saltati in salsa Marsala", "Tortino al Limone Amalfitano"] },
    ],
  },
  bauma: {
    seoTitle: "Ristorante per la bauma Monaco – serata clienti allo STORIA",
    seoDescription: "Serata clienti alla bauma: con la U2 dalla fiera di Riem allo STORIA, Karlstraße 47a, in circa 30 minuti. Menu da 59 € a persona IVA inclusa.",
    breadcrumb: "bauma",
    kicker: "bauma · ogni tre anni a Monaco",
    h1: "Ristorante per la bauma Monaco: serata clienti in centro",
    intro:
      "Secondo la Messe München la bauma è la fiera leader mondiale delle macchine edili; nel 2025 sono arrivati circa 600.000 visitatori da oltre 200 paesi. Organizziamo la vostra serata clienti allo STORIA in Karlstraße 47a, raggiungibile dalla fiera di Riem con la U2 senza cambi.",
    ctaAnfrage: "Richiedi una serata bauma",
    ctaMenues: "Vedi i menu",
    zahlen: [
      ["3–9 aprile 2028", "prossima bauma (aggiornato a 10/2026)"],
      ["circa 600.000", "visitatori nel 2025 secondo l'organizzatore"],
      ["U2", "senza cambi, circa 30 min fino a noi"],
      ["fino a 400", "ospiti in piedi · seduti 100 in inverno, 200 in estate"],
    ],
    andersTitel: "Cosa rende diversa la bauma",
    andersP1:
      "Nel 2025, secondo la Messe München, hanno esposto 3.601 aziende da 57 nazioni. Molte portano clienti internazionali; la vostra serata dovrebbe quindi funzionare anche in inglese – da noi il team vi serve in tedesco, inglese e italiano.",
    andersP2: "La bauma si svolge solo ogni tre anni, l'ultima volta ad aprile 2025, la prossima dal 3 al 9 aprile 2028.",
    wegTitel: "Dalla bauma allo STORIA",
    wegKopf: ["Da", "Percorso", "Durata"],
    wege: [
      ["Ingresso ovest / ICM", "U2 Messestadt West → Königsplatz, poi 3–4 min a piedi", "ca. 26–27 min"],
      ["Ingresso est", "U2 Messestadt Ost → Königsplatz, poi 3–4 min a piedi", "ca. 27–28 min"],
      ["Gruppo in pullman", "si ferma davanti alla porta", "–"],
    ],
    wegSatz: "Dalla bauma la U2 vi porta senza cambi in circa 30 minuti allo STORIA, Karlstraße 47a a Monaco.",
    menuesTitel: "Menu per la vostra serata bauma",
    menuesHinweis: "Tutte le portate sono nella pagina sulla",
    menuesHubLink: "cena aziendale durante la fiera",
    menuesUnd: "e nel nostro",
    faqTitel: "Domande sulla bauma",
    faq: [
      { q: "Quando si svolge la prossima bauma?", a: "Secondo la Messe München la prossima bauma si svolge dal 3 al 9 aprile 2028 nel quartiere fieristico di Monaco-Riem; si tiene ogni tre anni (aggiornato a 10/2026)." },
      { q: "Come arriviamo dalla bauma allo STORIA?", a: "Dalla bauma prendete la U2 senza cambi fino a Königsplatz (23 min da West, 24 min da Ost) e poi 3–4 minuti a piedi fino a Karlstraße 47a." },
      { q: "Il servizio e il menu sono disponibili in inglese?", a: "Il nostro team vi serve in tedesco, inglese e italiano, e il nostro menu è disponibile anche in inglese." },
      { q: "Un pullman può fermarsi davanti al ristorante?", a: "Un pullman può fermarsi direttamente davanti allo STORIA in Karlstraße." },
      { q: "Quanto costa una serata clienti alla bauma?", a: "Valgono i prezzi del nostro menu attuale, anche durante la bauma. Attualmente i menu di quattro portate costano 59 € o 68 € a persona IVA inclusa, con abbinamento vini 89 € o 96 €." },
    ],
    formTitel: "La vostra serata clienti alla bauma",
    formLead: "Indicateci data e numero di ospiti. Vi inviamo un'offerta personale.",
    disclaimer:
      "bauma è un marchio della Messe München GmbH. Lo STORIA non ha alcun legame con la Messe München o con la bauma; il nome è usato solo a scopo descrittivo. Date senza garanzia.",
    eventName: "bauma 2028",
  },
};

const fr: MesseTexte = {
  hub: {
    seoTitle: "Dîner salon Munich – repas d'entreprise au STORIA, centre-ville",
    seoDescription:
      "Repas d'entreprise pendant un salon à la Messe München : en U2 sans changement jusqu'au STORIA, Karlstraße 47a. Menus dégustation dès 59 € p. p., jusqu'à 200 assis, 400 debout.",
    breadcrumb: "Messe München",
    kicker: "Dîner salon Munich",
    h1: "Repas d'entreprise pendant la Messe München – au centre-ville, à une ligne de métro",
    intro:
      "Le STORIA se trouve Karlstraße 47a, dans le quartier de Maxvorstadt. Depuis la Messe München à Riem, prenez la U2 sans changement jusqu'à Königsplatz ; de là, il reste trois à quatre minutes à pied. Nous accueillons votre groupe jusqu'à 400 personnes debout, et assis 100 personnes en hiver, 200 en été avec la terrasse.",
    ctaAnfrage: "Demander une soirée salon",
    ctaMenues: "Voir les menus",
    blickTitel: "En bref",
    blick: [
      ["Restaurant", "STORIA – Ristorante Pizzeria Bar, cuisine italienne, tenu par la famille Speranza depuis 2015"],
      ["Adresse", "Karlstraße 47a, 80333 Munich (Maxvorstadt)"],
      ["Depuis la Messe München", "U2 depuis Messestadt West ou Ost jusqu'à Königsplatz, sans changement, 23–24 min de trajet plus 3–4 min à pied"],
      ["À proximité", "Métro Königsplatz (U2) · Tram 20/21, arrêt Karlstraße, 1 min · Gare centrale 5–8 min à pied"],
      ["Capacité", "jusqu'à 400 personnes debout (intérieur et extérieur ensemble) · assis 100 en hiver, 200 en été avec la terrasse"],
      ["Menus", "4 plats «Végétal» 59 €, «Mer» et «Terre» 68 € chacun par personne TVA incluse ; avec accord mets et vins 89 € ou 96 €"],
      ["Horaires", "lun–ven 9 h–1 h, sam–dim 12 h–1 h · cuisine jusqu'à 22 h, plus tard sur accord"],
      ["Langues", "service en allemand, anglais et italien"],
      ["Facture", "à l'adresse de votre entreprise, TVA indiquée"],
    ],
    menuesTitel: "Menus pour votre dîner salon",
    menuesIntro:
      "Nos menus dégustation de la carte : quatre plats à prix fixe par personne, TVA incluse, réservés directement auprès du restaurant.",
    allergene: "Les informations sur les allergènes et additifs sont disponibles sur demande. Tous les plats à la carte figurent sur notre",
    speisekarteLink: "carte complète",
    platzTitel: "De la place pour votre groupe",
    platzP1:
      "En hiver, nous dressons les tables à l'intérieur pour 100 personnes maximum. En été, la terrasse s'y ajoute et jusqu'à 200 personnes peuvent s'asseoir. Pour une réception debout, l'intérieur et l'extérieur accueillent ensemble jusqu'à 400 personnes.",
    platzP2:
      "Par temps froid ou humide, nous installons volontiers une tente moyennant supplément ; nous vous préparons une offre personnalisée selon vos souhaits.",
    hausTitel: "Tout le restaurant pour votre entreprise",
    hausP: "Vous pouvez privatiser l'ensemble du STORIA sur demande ; le prix figure dans votre offre.",
    ablaufTitel: "Le déroulement de votre soirée salon",
    ablauf: [
      ["Demande", "Indiquez-nous la date, le nombre de personnes et le salon – par téléphone, e-mail ou WhatsApp."],
      ["Offre", "Vous recevez une offre personnelle avec menu, boissons, acompte et conditions d'annulation."],
      ["Confirmation", "Dès votre accord, votre soirée est réservée."],
      ["La soirée", "Vos invités arrivent en U2 (3–4 min à pied depuis Königsplatz) ou en autocar jusqu'à la porte."],
    ],
    anfahrtTitel: "Repas de groupe après le salon à Riem : comment venir",
    anfahrtLead: "En U2, sans changement.",
    schritte: [
      ["1", "Messe München", "U2 depuis Messestadt West ou Ost"],
      ["2", "Königsplatz", "23 min depuis West, 24 min depuis Ost, toutes les 5 min"],
      ["S", "STORIA", "Karlstraße 47a, 3–4 min à pied"],
      ["H", "Hôtel à la gare centrale", "5–8 min à pied"],
    ],
    anfahrtSatz:
      "Depuis la Messe München, la U2 vous conduit sans changement au STORIA, Karlstraße 47a, en 30 minutes environ ; après le repas, la gare centrale est à 5–8 minutes à pied.",
    anfahrtHinweis: "Temps de trajet sans garantie, état octobre 2026.",
    wegKopf: ["Trajet", "Durée", "Remarque"],
    wege: [
      ["Salon → STORIA en U2", "env. 26–30 min", "U2 Messestadt West → Königsplatz 23 min (depuis Ost 24 min), puis 3–4 min à pied"],
      ["ICM → STORIA en U2", "env. 26–30 min", "L'ICM se trouve à la station Messestadt West, même ligne"],
      ["Salon → STORIA en taxi", "env. 20–30 min", "environ 12 km ; env. 16 min sans circulation"],
      ["Gare centrale → STORIA", "5–8 min à pied", "depuis la sortie nord/Arnulfstraße ; tram depuis Hauptbahnhof Nord 4 min"],
      ["Aéroport → STORIA", "env. 45–50 min", "S8 jusqu'à la gare centrale et U2 jusqu'à Königsplatz, ou S8 jusqu'à Karlsplatz (Stachus) et tram 21"],
      ["Tram 20/21, arrêt Karlstraße", "1 min à pied", "devant la porte ; la nuit N20"],
      ["Parkhaus Marsstraße, Hirtenstraße 14", "env. 6 min à pied (450 m)", "ouvert 24 h/24, hauteur d'entrée 2,00 m"],
      ["Parking souterrain Neue Hopfenpost, Hopfenstraße 6", "env. 10 min à pied (710 m)", "entrée lun–sam 6 h 30–21 h, fermé le dimanche, sortie à toute heure"],
      ["Autocar", "–", "s'arrête devant la porte"],
    ],
    hotelStand: "État : octobre 2026. Informations données à titre indicatif ; nous ne collaborons avec aucun de ces hôtels.",
    hotelsZentralTitel: "Hôtels à la gare centrale : retour à pied après le repas",
    hotelsZentralKopf: ["Hôtel", "Adresse", "À pied", "Taxi"],
    hotelsMesseTitel: "Hôtels au parc des expositions : jusqu'à nous en U2",
    hotelsMesseLead: "Depuis un hôtel près du parc des expositions, le métro ou le S-Bahn vous amène chez nous en 34 à 42 minutes, et vous ramène par le même chemin.",
    hotelsMesseKopf: ["Hôtel", "Adresse", "U-Bahn/S-Bahn", "Taxi"],
    nachTitel: "Après la fermeture du salon, au STORIA",
    nachP:
      "À la BAU, les halls ferment à 18 h selon l'organisateur. Avec la U2, vous êtes chez nous vers 19 h. Notre cuisine est ouverte jusqu'à 22 h, plus tard sur accord.",
    planTitel: "Planifier à temps",
    planP: "Les entreprises nous contactent en moyenne environ dix semaines avant la date. Cela laisse le temps de définir sereinement le menu et le déroulement.",
    naechsteTitel: "Les prochains grands salons à Munich",
    naechsteStand: "État : octobre 2026 · dates selon les organisateurs, sans garantie",
    naechste: [
      { id: "bau", name: "BAU", branche: "Architecture, construction", termin: "11–15 janvier 2027", text: "Halls ouverts de 9 h 30 à 18 h. En 2025, plus de 180 000 visiteurs selon l'organisateur.", link: "BAU dans le calendrier des salons" },
      { id: "iaa", name: "IAA Mobility", branche: "Mobilité", termin: "7–12 septembre 2027", text: "En 2025, plus de 500 000 visiteurs selon l'organisateur VDA.", link: "IAA Mobility dans le calendrier des salons" },
      { id: "bauma", name: "bauma", branche: "Engins de chantier", termin: "3–9 avril 2028", text: "Seulement tous les trois ans ; environ 600 000 visiteurs en 2025 selon l'organisateur.", link: "Organiser une soirée clients pendant la bauma" },
    ],
    kalenderTitel: "Calendrier des salons à Munich",
    kalenderLead: "Quel salon a lieu à Munich et quand – par mois et par fréquence. Les dates exactes sont publiées par chaque organisateur.",
    kalenderKopf: ["Mois", "Salon", "Secteur", "Fréquence"],
    kalenderCta: "Demander une table pour le salon",
    faqTitel: "Questions fréquentes sur le repas d'entreprise pendant un salon",
    faq: [
      { q: "Comment aller de la Messe München au STORIA ?", a: "Depuis la Messe München, prenez la U2 sans changement jusqu'à Königsplatz (23 min depuis Messestadt West, 24 min depuis Messestadt Ost), puis marchez 3–4 minutes jusqu'à la Karlstraße 47a. En taxi, comptez 20–30 minutes selon la circulation." },
      { q: "Combien de personnes le STORIA peut-il accueillir ?", a: "Le STORIA accueille jusqu'à 400 personnes debout, intérieur et extérieur ensemble. Assis, ce sont 100 personnes à l'intérieur en hiver et 200 en été avec la terrasse." },
      { q: "Combien coûte un repas d'entreprise au STORIA ?", a: "Nos menus de quatre plats coûtent 59 € («Végétal») ou 68 € («Mer», «Terre») par personne TVA incluse, avec accord mets et vins 89 € ou 96 €. Les autres boissons sont facturées selon la carte ; tout le reste figure dans votre offre personnelle." },
      { q: "Proposez-vous un forfait boissons ?", a: "Nous composons un forfait boissons sur demande. Nous proposons aussi un accord mets et vins pour chaque menu." },
      { q: "Y a-t-il des plats végétariens et végans ? Comment gérez-vous les allergies ?", a: "Le menu «Végétal» est végétarien ; une version végane est possible sur demande. Les informations sur les allergènes et additifs sont disponibles sur demande ; merci de nous indiquer les allergies et intolérances de vos invités dès votre demande." },
      { q: "Jusqu'à quelle heure pouvons-nous commencer après la fermeture du salon ?", a: "Notre cuisine est ouverte jusqu'à 22 h, plus tard sur accord ; le restaurant est ouvert tous les jours jusqu'à 1 h. En quittant le salon à 18 h, vous êtes chez nous en U2 vers 19 h." },
      { q: "Pouvons-nous privatiser l'ensemble du STORIA ?", a: "Vous pouvez privatiser l'ensemble du STORIA sur demande ; le prix figure dans votre offre." },
      { q: "Pouvons-nous payer au nom de l'entreprise ?", a: "Vous recevez une facture à l'adresse de votre entreprise, TVA indiquée. Vous pouvez payer par virement sur facture ou en ligne par carte." },
      { q: "Quel est le montant de l'acompte et jusqu'à quand pouvons-nous annuler ?", a: "L'acompte et les conditions d'annulation figurent dans votre offre personnelle, avant votre engagement définitif." },
      { q: "Le service et la carte sont-ils disponibles en anglais ?", a: "Notre équipe vous sert en allemand, en anglais et en italien. Notre carte existe aussi en anglais." },
      { q: "Pouvons-nous faire la fête dehors quand il fait froid ?", a: "Par temps froid ou humide, nous installons volontiers une tente moyennant supplément ; nous vous préparons une offre personnalisée selon vos souhaits." },
      { q: "Y a-t-il du matériel pour un discours, par exemple un micro ?", a: "Pour les discours et présentations, le STORIA met à disposition un micro, des haut-parleurs et un écran." },
      { q: "Pouvons-nous visiter le restaurant avant ?", a: "Nous vous faisons volontiers visiter le STORIA à l'avance ; nous convenons ensemble d'un rendez-vous." },
      { q: "Le STORIA est-il accessible ?", a: "Le STORIA dispose d'un accès de plain-pied et de toilettes accessibles." },
      { q: "Où nos invités peuvent-ils se garer, et un autocar peut-il s'arrêter ?", a: "Le parking le plus proche est le Parkhaus Marsstraße, Hirtenstraße 14, ouvert 24 h/24 et à environ 6 minutes à pied. Un autocar peut s'arrêter devant la porte." },
    ],
    formTitel: "Votre soirée salon au STORIA",
    formLead: "Indiquez-nous la date, le nombre de personnes et le salon. Nous vous envoyons une offre personnelle.",
    disclaimer:
      "Le STORIA n'a aucun lien avec Messe München GmbH ni avec d'autres organisateurs de salons. Les noms des salons sont des marques de leurs titulaires et ne sont utilisés ici qu'à titre descriptif. Dates sans garantie ; seules les indications des organisateurs font foi.",
    weiter: "En savoir plus",
    links: [
      ["firmenfeier-muenchen", "Événements d'entreprise au STORIA"],
      ["speisekarte", "Carte"],
      ["messe-muenchen/bauma", "Restaurant pour la bauma"],
    ],
  },
  menue: {
    gaenge4: "4 plats",
    proPerson: "p. p. TVA incl.",
    mitWein: "Avec accord mets et vins",
    anfragen: "Demander",
    menues: [
      { key: "vegetale", name: "«Végétal»", art: "4 plats, végétarien", gaenge: ["Chanterelles, artichauts frais et poivrons rôtis au four avec crème de pois et menthe", "Paccheri à la crème de burrata et pistaches", "Risotto aux cèpes", "Gâteau au citron d'Amalfi"] },
      { key: "mare", name: "«Mer»", art: "4 plats, poisson et fruits de mer", gaenge: ["Carpaccio de poulpe assaisonné à la vinaigrette d'agrumes, jeunes pousses d'épinards et scampi", "Tagliolini aux scampi dans un bouillon de homard", "Tagliata de thon albacore grillé avec croûte d'herbes sur crème de pois et menthe", "Gâteau au citron d'Amalfi"] },
      { key: "terra", name: "«Terre»", art: "4 plats, viande", gaenge: ["Rôti de bœuf à la sauce aux herbes vertes, servi avec artichauts grillés et pommes de terre au beurre", "Raviolis maison farcis aux cèpes et ricotta \"a la Vaccinara\" avec ragoût de queue de bœuf", "Médaillons tendres de longe de veau aux pleurotes du panicaut sautés à la sauce Marsala", "Gâteau au citron d'Amalfi"] },
    ],
  },
  bauma: {
    seoTitle: "Restaurant pour la bauma Munich – soirée clients au STORIA",
    seoDescription: "Soirée clients pendant la bauma : en U2 depuis le parc des expositions de Riem jusqu'au STORIA, Karlstraße 47a, en 30 minutes environ. Menus dès 59 € p. p. TVA incluse.",
    breadcrumb: "bauma",
    kicker: "bauma · tous les trois ans à Munich",
    h1: "Restaurant pour la bauma Munich : soirée clients au centre-ville",
    intro:
      "Selon la Messe München, la bauma est le salon leader mondial des engins de chantier ; en 2025, environ 600 000 visiteurs sont venus de plus de 200 pays. Nous organisons votre soirée clients au STORIA, Karlstraße 47a, accessible depuis le parc des expositions de Riem en U2 sans changement.",
    ctaAnfrage: "Demander une soirée bauma",
    ctaMenues: "Voir les menus",
    zahlen: [
      ["3–9 avril 2028", "prochaine bauma (état 10/2026)"],
      ["environ 600 000", "visiteurs en 2025 selon l'organisateur"],
      ["U2", "sans changement, env. 30 min jusqu'à nous"],
      ["jusqu'à 400", "personnes debout · assis 100 en hiver, 200 en été"],
    ],
    andersTitel: "Ce qui distingue la bauma",
    andersP1:
      "En 2025, selon la Messe München, 3 601 entreprises de 57 pays ont exposé. Beaucoup viennent avec des clients internationaux ; votre soirée doit donc fonctionner en anglais – chez nous, l'équipe vous sert en allemand, en anglais et en italien.",
    andersP2: "La bauma n'a lieu que tous les trois ans, la dernière fois en avril 2025, la prochaine du 3 au 9 avril 2028.",
    wegTitel: "De la bauma au STORIA",
    wegKopf: ["Depuis", "Trajet", "Durée"],
    wege: [
      ["Entrée ouest / ICM", "U2 Messestadt West → Königsplatz, puis 3–4 min à pied", "env. 26–27 min"],
      ["Entrée est", "U2 Messestadt Ost → Königsplatz, puis 3–4 min à pied", "env. 27–28 min"],
      ["Groupe en autocar", "s'arrête devant la porte", "–"],
    ],
    wegSatz: "Depuis la bauma, la U2 vous conduit sans changement en 30 minutes environ au STORIA, Karlstraße 47a à Munich.",
    menuesTitel: "Menus pour votre soirée bauma",
    menuesHinweis: "Tous les plats figurent sur la page consacrée au",
    menuesHubLink: "repas d'entreprise pendant un salon",
    menuesUnd: "et sur notre",
    faqTitel: "Questions sur la bauma",
    faq: [
      { q: "Quand a lieu la prochaine bauma ?", a: "Selon la Messe München, la prochaine bauma aura lieu du 3 au 9 avril 2028 au parc des expositions de Munich-Riem ; elle se tient tous les trois ans (état 10/2026)." },
      { q: "Comment aller de la bauma au STORIA ?", a: "Depuis la bauma, prenez la U2 sans changement jusqu'à Königsplatz (23 min depuis West, 24 min depuis Ost), puis marchez 3–4 minutes jusqu'à la Karlstraße 47a." },
      { q: "Le service et la carte sont-ils disponibles en anglais ?", a: "Notre équipe vous sert en allemand, en anglais et en italien, et notre carte existe aussi en anglais." },
      { q: "Un autocar peut-il s'arrêter devant le restaurant ?", a: "Un autocar peut s'arrêter directement devant le STORIA, dans la Karlstraße." },
      { q: "Combien coûte une soirée clients pendant la bauma ?", a: "Les prix de notre carte actuelle s'appliquent, y compris pendant la bauma. Actuellement, les menus de quatre plats coûtent 59 € ou 68 € par personne TVA incluse, avec accord mets et vins 89 € ou 96 €." },
    ],
    formTitel: "Votre soirée clients pendant la bauma",
    formLead: "Indiquez-nous la date et le nombre de personnes. Nous vous envoyons une offre personnelle.",
    disclaimer:
      "bauma est une marque de Messe München GmbH. Le STORIA n'a aucun lien avec la Messe München ni avec la bauma ; le nom n'est utilisé qu'à titre descriptif. Dates sans garantie.",
    eventName: "bauma 2028",
  },
};

export const messeContent: Record<Language, MesseTexte> = { de, en, it, fr };
