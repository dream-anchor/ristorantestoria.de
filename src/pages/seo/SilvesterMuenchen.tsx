import { Link } from "react-router-dom";
import EmailLink, { EmailAddress } from "@/components/EmailLink";
import { PhoneText } from "@/lib/linkifyPhone";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import MenuDisplay from "@/components/MenuDisplay";
import ReservationBooking from "@/components/ReservationBooking";
import AnlassAnfrageForm from "@/components/AnlassAnfrageForm";
import LocalizedLink from "@/components/LocalizedLink";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, MessageCircle, Mail, ArrowUp } from "lucide-react";
import storiaLogo from "@/assets/storia-logo.webp";
import silvesterHeroImage from "@/assets/silvester-dinner-gala-storia-muenchen.webp";
import silvesterHeroImage600 from "@/assets/silvester-dinner-gala-storia-muenchen-600w.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { useSeasonalMenuActive } from "@/hooks/useSeasonalMenuActive";
import { PARENT_SLUGS } from "@/config/seasonalMenus";
import type { SeasonalMenuConfig } from "@/config/seasonalMenus";
import { fireLead } from "@/lib/analytics";
import { FACTS } from "@/config/facts";

/**
 * Absolute Bild-URL für das Event-JSON-LD (E1.1, Widerspruch 6).
 *
 * Vorher zeigte das `image`-Feld auf `/silvester-gala-storia-muenchen.jpg` — eine Datei, die in
 * `public/` NICHT existiert (404). Statt eine zweite, thematisch nur halb passende Datei zu
 * erfinden, verweist das Schema jetzt auf das Hero-Bild der Seite selbst: dieselbe Aufnahme, die
 * Besucher oben sehen. Der Import wird von Vite auf den gehashten Build-Pfad aufgelöst, die URL
 * kann also nicht mehr von der ausgelieferten Datei abweichen.
 */
const EVENT_IMAGE_URL = `https://www.ristorantestoria.de${silvesterHeroImage}`;

/**
 * Die drei Degustationsmenüs der vergangenen Silvester-Saison (E1.2).
 *
 * EINZIGE Quelle für diese Gerichte: sie speist sowohl den sichtbaren Menü-Abschnitt auf der
 * Seite als auch das Menu-JSON-LD weiter unten. Vorher standen die Gänge ausschließlich im
 * JSON-LD — Suchmaschinen und KI-Systeme sahen das vollständige Menü, Besucher nicht
 * (KONZEPT-SAISONSEITEN-AUSBAU.md § „Der größte sofort hebbare Fund"). Beide Darstellungen aus
 * derselben Konstante zu speisen ist der einzige Weg, der garantiert, dass sie nicht auseinander
 * laufen.
 *
 * Die Gerichtsnamen bleiben in ALLEN vier Sprachen deutsch: es sind die Eigennamen der Speisen,
 * genau wie sie auf der Karte stehen. Übersetzt werden nur Überschrift, Kennzeichnung und Hinweis
 * (`t.seo.silvester.previousMenu*`).
 *
 * Es sind ausdrücklich KEINE buchbaren Menüs, sondern ein Eindruck aus der letzten Saison — die
 * Kennzeichnung im UI (Badge + Hinweiszeile) ist Teil des Kriteriums, nicht Dekoration.
 */
const PREVIOUS_SEASON_MENUS = [
  {
    variant: "Vegetale",
    courses: [
      "Champagner-Kastaniencremesuppe mit getrüffelter Crème Fraîche",
      "Auberginenkaviar, Parmesanpraline und Avocadocreme, Basilikumessenz",
      "Gnocconi gefüllt mit Steinpilzen, gehobeltem Parmigiano und schwarzem Trüffel",
      "Schokoladentarte mit hausgemachtem Zimt-Vanille-Eis",
    ],
  },
  {
    variant: "Mare",
    courses: [
      "Carpaccio vom Octopus mit Jakobsmuscheln in feiner Kräuter-Zitrus-Marinade",
      "Tagliolini mit Scampi im Hummerfond",
      "Seeteufel auf einer sanften Gelbtomaten-Basilikum-Sauce, serviert mit cremigem Safranrisotto",
      "Schokoladentarte mit hausgemachtem Zimt-Vanille-Eis",
    ],
  },
  {
    variant: "Terra",
    courses: [
      "Vitello Tonnato, Auberginenkaviar und Parmesanpraline",
      "Gnocconi gefüllt mit Steinpilzen, gehobeltem Parmigiano und schwarzem Trüffel",
      "Brasato di manzo al Barolo „Rinderschmorbraten in Barolo“ mit getrüffelter Petersilienwurzelcreme",
      "Schokoladentarte mit hausgemachtem Zimt-Vanille-Eis",
    ],
  },
] as const;

/**
 * Autoritative Outbound-Quelle (E1.5, GEO-Regel 3 aus `docs/geo-content-guidelines.md`).
 *
 * Das Comité Champagne ist der offizielle Branchenverband der geschützten Ursprungsbezeichnung
 * Champagne — eine Institution, keine Redaktion: die URL ist auf Jahre stabil, es ist weder ein
 * Wettbewerber noch ein Aggregator. Thematisch hängt sie am Mitternachts-Champagner, der auf
 * dieser Seite an vier Stellen vorkommt (Hero-Badge, Paket, Timeline, „8 Gründe").
 */
const CITATION_URL = "https://www.champagne.fr/";

/**
 * Ersetzt die Zahlen-Platzhalter der Übersetzungen durch die Werte aus `FACTS.silvester`.
 *
 * Die Übersetzungen enthalten bewusst nur Satzschablonen ({courses}/{price}/{priceWine}), damit
 * Gangzahl und Preise auf allen vier Sprachen aus derselben einzigen Quelle kommen. Global
 * ersetzen, weil ein Platzhalter (z. B. {price} im TL;DR) mehrfach vorkommen kann;
 * `{price}` matcht dabei nicht `{priceWine}`, weil die schließende Klammer Teil des Musters ist.
 */
const fillFacts = (text: string): string =>
  text
    .replace(/\{courses\}/g, String(FACTS.silvester.courses))
    .replace(/\{price\}/g, FACTS.silvester.price)
    .replace(/\{priceWine\}/g, FACTS.silvester.priceWithWine);

/**
 * Props — bewusst OHNE `standalone` (E1.7).
 *
 * Bis zur URL-Konsolidierung vom 12.09.2026 gab es eine zweite, flache Route
 * (`/silvester-muenchen/`), die diese Komponente mit `standalone` rendern ließ. Seit der
 * Konsolidierung existiert dieser Mount nicht mehr: `src/App.tsx` hat keinen
 * `"silvester-muenchen"`-Eintrag in `routeComponents` (und `slugs.json` keinen solchen Slug), die
 * einzige Aufrufstelle im gesamten Repo ist `BesondererAnlass.tsx` — und die übergibt `standalone`
 * NICHT. Der Prop war damit dauerhaft `undefined`, sein kompletter Zweig toter Code: eine zweite
 * Canonical-Berechnung, ein zweiter Breadcrumb, eigene SEO-Texte, ein eigener Hero-Titel, eine
 * Teaser- und eine Inaktiv-Sektion, eine zweite Related-Links-Liste und die Unterdrückung des
 * Event/Menu-JSON-LD — alles unerreichbar, aber bei jeder Änderung mitzupflegen und mitzulesen.
 *
 * Gegenprobe vor dem Entfernen: `grep -rn "SilvesterMuenchen" src/ scripts/ prerender.js` →
 * Definition, Default-Export und genau ein `<SilvesterMuenchen menu=… archivedMenu=…
 * seasonalConfig=… />` ohne `standalone`.
 *
 * ACHTUNG bei Übertragung auf die Schwesterseite: `WeihnachtenMuenchen.tsx` wird sehr wohl mit
 * `standalone` gerendert (`App.tsx` → `WeihnachtenMuenchenStandalone`). Dort darf nichts entfernt
 * werden.
 */
interface SilvesterMuenchenProps {
  menu?: any | null;
  archivedMenu?: any | undefined;
  seasonalConfig?: SeasonalMenuConfig;
}

const SilvesterMuenchen = ({ menu, archivedMenu, seasonalConfig }: SilvesterMuenchenProps) => {
  const { t, language } = useLanguage();
  usePrerenderReady(true);
  const s = t.seo.silvester;
  // `useSeasonalMenuActive` liefert nur noch den defensiven Fallback für `effectiveConfig`, falls
  // `seasonalConfig` nicht übergeben wird. Sein `isActive` speiste ausschließlich den
  // standalone-Zweig (E1.7) — `isActive` ist hier jetzt rein datengetrieben, wie bei Weihnachten.
  const { config: hookConfig } = useSeasonalMenuActive('silvester');
  const effectiveConfig = seasonalConfig || hookConfig!;
  const isActive = !!menu;
  const currentYear = new Date().getFullYear();

  /**
   * Vorbelegung der Buchungsstrecke auf den 31. Dezember (E2.1).
   *
   * Bewusst aus dem laufenden Jahr berechnet statt hart „2026" zu schreiben — die Seite
   * soll in den Folgejahren ohne Codeänderung weiter das richtige Datum vorbelegen.
   * Monat 11 = Dezember (0-indiziert). `ReservationBooking` bietet an diesem Datum von
   * sich aus nur die Slots 19:00–20:00 an (`isNewYearsEve`), passend zum Gala-Abend.
   */
  const newYearsEveDate = new Date(currentYear, 11, 31);

  // --- Canonical + Hreflang ---
  const parentSlug = PARENT_SLUGS[language] || PARENT_SLUGS.de;
  const seasonalSlug = effectiveConfig.slugs[language] || effectiveConfig.slugs.de;
  const canonicalPath = language === 'de'
    ? `/${parentSlug}/${seasonalSlug}`
    : `/${language}/${parentSlug}/${seasonalSlug}`;
  const breadcrumbSchema: Array<{ name: string; url: string }> = [
    { name: 'Home', url: '/' },
    { name: t.nav.specialOccasions, url: `/${parentSlug}` },
    { name: effectiveConfig.titles[language] || effectiveConfig.titles.de, url: canonicalPath },
  ];

  const packages = [
    { title: s.package1Title, subtitle: s.package1Subtitle, items: [s.package1Item1, s.package1Item2, s.package1Item3, s.package1Item4, s.package1Item5], ideal: s.package1Ideal, price: s.package1Price },
    { title: s.package2Title, subtitle: s.package2Subtitle, items: [s.package2Item1, s.package2Item2, s.package2Item3, s.package2Item4, s.package2Item5, s.package2Item6, s.package2Item7], ideal: s.package2Ideal, price: s.package2Price, badge: s.package2Badge },
    { title: s.package3Title, subtitle: s.package3Subtitle, items: [s.package3Item1, s.package3Item2, s.package3Item3, s.package3Item4, s.package3Item5], ideal: s.package3Ideal, price: s.package3Price },
  ];

  /**
   * „Auf einen Blick" (E1.3) — Gangzahl · Preis · Beginn · Kapazität · Reservierungsfrist.
   *
   * Alle Wettbewerber im Ranking-Artikel werden nach genau diesem Raster verglichen; der Block
   * ist außerdem das, was KI-Systeme aus einer Seite extrahieren. Die Zahlen kommen aus
   * `FACTS.silvester` (SSoT) bzw. aus bereits vorhandenem Seiteninhalt (19:00-Empfang aus der
   * Timeline, 2–100 Gäste und „Ende November" aus der FAQ) — neu erfunden wird nichts. Die
   * Übersetzungen liefern nur die Satzschablone, die Werte werden hier eingesetzt.
   */
  const atAGlance = [
    { label: s.atAGlanceMenuLabel, value: fillFacts(s.atAGlanceMenuValue) },
    { label: s.atAGlanceStartLabel, value: s.atAGlanceStartValue },
    { label: s.atAGlanceCapacityLabel, value: s.atAGlanceCapacityValue },
    { label: s.atAGlanceReservationLabel, value: s.atAGlanceReservationValue },
  ];

  const reasons = [
    { title: s.reason1Title, desc: s.reason1Desc },
    { title: s.reason2Title, desc: s.reason2Desc },
    { title: s.reason3Title, desc: s.reason3Desc },
    { title: s.reason4Title, desc: s.reason4Desc },
    { title: s.reason5Title, desc: s.reason5Desc },
    { title: s.reason6Title, desc: s.reason6Desc },
    { title: s.reason7Title, desc: s.reason7Desc },
    { title: s.reason8Title, desc: s.reason8Desc },
  ];

  const steps = [
    { title: s.step1Title, desc: s.step1Desc },
    { title: s.step2Title, desc: s.step2Desc },
    { title: s.step3Title, desc: s.step3Desc },
    { title: s.step4Title, desc: s.step4Desc },
    { title: s.step5Title, desc: s.step5Desc },
    { title: s.step6Title, desc: s.step6Desc },
  ];

  const faqs = [
    { q: s.faq1Question, a: s.faq1Answer },
    { q: s.faq2Question, a: s.faq2Answer },
    { q: s.faq3Question, a: s.faq3Answer },
    { q: s.faq4Question, a: s.faq4Answer },
    { q: s.faq5Question, a: s.faq5Answer },
    { q: s.faq6Question, a: s.faq6Answer },
    { q: s.faq7Question, a: s.faq7Answer },
    { q: s.faq8Question, a: s.faq8Answer },
  ];

  const relatedLinks = [
    { title: s.related1Title, desc: s.related1Desc, to: "speisekarte" },
    { title: s.related2Title, desc: s.related2Desc, to: "eventlocation-muenchen-maxvorstadt" },
    { title: s.related3Title, desc: s.related3Desc, to: "weihnachten-muenchen" },
    { title: s.related4Title, desc: s.related4Desc, to: "valentinstag-muenchen" },
    { title: s.related5Title, desc: s.related5Desc, to: "firmenfeier-muenchen" },
    { title: s.related6Title, desc: s.related6Desc, to: "kontakt" },
  ];

  return (
    <>
      <SEO
        title={s.seoTitle}
        description={s.seoDescription}
        canonical={canonicalPath}
      />
      <StructuredData type="restaurant" />
      <StructuredData type="breadcrumb" breadcrumbs={breadcrumbSchema} />

      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": { "@type": "Answer", "text": faq.a }
        }))
      })}} />

      {/* Event + Menu @graph — references #restaurant / #organization by @id.
          Die früher hier eingebettete "BreadcrumbList" wurde entfernt (E1.1, Widerspruch 7): sie war
          redundant zur bereits oben gerenderten <StructuredData type="breadcrumb">. Die Seite
          rendert damit genau EINE BreadcrumbList — wie bei Weihnachten seit der K2-Konsolidierung.

          E1.7: der frühere `!standalone`-Guard ist entfallen — der standalone-Mount existiert seit
          der URL-Konsolidierung vom 12.09.2026 nicht mehr, der Guard war immer wahr.

          E1.6: `FoodEvent` statt `Event`. `docs/geo-content-guidelines.md` § Regel 8 schreibt für
          Event-Seiten ausdrücklich `FoodEvent` vor; der Typ ist ein Untertyp von `Event`, alle
          bisherigen Felder bleiben gültig, aber der Anlass wird als Essens-Event erkennbar.

          E1.6: Gangzahl und beide Preise kommen jetzt aus `FACTS.silvester` statt als Literale im
          Schema zu stehen — dieselbe Quelle, aus der auch „Auf einen Blick", TL;DR, Intro und die
          Menü-Karten gespeist werden. Damit kann das Schema nicht mehr vom sichtbaren Inhalt
          abweichen (das war Widerspruch 2 aus E1.1: fünf Gänge im Text, vier im Schema). */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "FoodEvent",
              "@id": "https://www.ristorantestoria.de/besondere-anlaesse/silvester/#event",
              "name": "Silvester Gala-Dinner im STORIA München",
              "description": `Italienisches Gala-Dinner zum Jahreswechsel in der Maxvorstadt: Champagner-Aperitif und ${FACTS.silvester.courses}-Gänge-Degustationsmenü zur Wahl (Vegetale, Mare oder Terra). Ab ${FACTS.silvester.price} € pro Person, mit Weinbegleitung ${FACTS.silvester.priceWithWine} € pro Person — dasselbe Menü, der Unterschied ist nur die Weinbegleitung.`,
              "startDate": "2026-12-31T19:00:00+01:00",
              "endDate": "2027-01-01T02:00:00+01:00",
              "eventStatus": "https://schema.org/EventScheduled",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
              "location": { "@id": "https://www.ristorantestoria.de/#restaurant" },
              "organizer": { "@id": "https://www.ristorantestoria.de/#organization" },
              "performer": { "@id": "https://www.ristorantestoria.de/#restaurant" },
              "image": [EVENT_IMAGE_URL],
              "offers": [
                { "@type": "Offer", "name": `${FACTS.silvester.courses}-Gänge-Degustationsmenü`, "price": `${FACTS.silvester.price}.00`, "priceCurrency": "EUR", "availability": "https://schema.org/InStock", "url": "https://www.ristorantestoria.de/besondere-anlaesse/silvester/", "validFrom": "2026-11-01" },
                { "@type": "Offer", "name": `${FACTS.silvester.courses}-Gänge-Degustationsmenü mit Weinbegleitung`, "price": `${FACTS.silvester.priceWithWine}.00`, "priceCurrency": "EUR", "availability": "https://schema.org/InStock", "url": "https://www.ristorantestoria.de/besondere-anlaesse/silvester/", "validFrom": "2026-11-01" }
              ]
            },
            {
              "@type": "Menu",
              "@id": "https://www.ristorantestoria.de/besondere-anlaesse/silvester/#menu",
              "name": "Degustationsmenüs",
              "inLanguage": "de-DE",
              "hasMenuSection": [
                // E1.2: dieselben drei Menüs, die die Seite jetzt auch sichtbar rendert —
                // erzeugt aus PREVIOUS_SEASON_MENUS, damit Schema und Sichtbares nie abweichen.
                ...PREVIOUS_SEASON_MENUS.map((menuVariant) => ({
                  "@type": "MenuSection",
                  "name": `${FACTS.silvester.courses} Gänge Menü «${menuVariant.variant}»`,
                  "offers": [
                    { "@type": "Offer", "price": `${FACTS.silvester.price}.00`, "priceCurrency": "EUR" },
                    { "@type": "Offer", "name": "mit Weinbegleitung", "price": `${FACTS.silvester.priceWithWine}.00`, "priceCurrency": "EUR" }
                  ],
                  "hasMenuItem": menuVariant.courses.map((course) => ({ "@type": "MenuItem", "name": course }))
                })),
                {
                  "@type": "MenuSection",
                  "name": "À la carte",
                  "hasMenuSection": [
                    {
                      "@type": "MenuSection", "name": "Aperitif-Empfehlung",
                      "hasMenuItem": [{ "@type": "MenuItem", "name": "Glas Champagner – Rossini mit frischen Erdbeeren 0,1 l", "offers": { "@type": "Offer", "price": "15.90", "priceCurrency": "EUR" } }]
                    },
                    {
                      "@type": "MenuSection", "name": "Vorspeisen",
                      "hasMenuItem": [
                        { "@type": "MenuItem", "name": "Champagner-Kastaniencremesuppe mit getrüffelter Crème Fraîche", "offers": { "@type": "Offer", "price": "15.90", "priceCurrency": "EUR" } },
                        { "@type": "MenuItem", "name": "Carpaccio vom Octopus mit Jakobsmuscheln in feiner Kräuter-Zitrus-Marinade", "offers": { "@type": "Offer", "price": "24.50", "priceCurrency": "EUR" } },
                        { "@type": "MenuItem", "name": "Vitello Tonnato, Auberginenkaviar und Parmesanpraline", "offers": { "@type": "Offer", "price": "22.50", "priceCurrency": "EUR" } }
                      ]
                    },
                    {
                      "@type": "MenuSection", "name": "Pasta",
                      "hasMenuItem": [
                        { "@type": "MenuItem", "name": "Gnocconi gefüllt mit Steinpilzen, gehobeltem Parmigiano und schwarzem Trüffel", "offers": { "@type": "Offer", "price": "24.00", "priceCurrency": "EUR" } },
                        { "@type": "MenuItem", "name": "Tagliolini mit Garnelen in feinem Hummerfond", "offers": { "@type": "Offer", "price": "24.00", "priceCurrency": "EUR" } }
                      ]
                    },
                    {
                      "@type": "MenuSection", "name": "Hauptgang",
                      "hasMenuItem": [
                        { "@type": "MenuItem", "name": "Seeteufel auf einer sanften Gelbtomaten-Basilikum-Sauce, serviert mit cremigem Safranrisotto", "offers": { "@type": "Offer", "price": "42.00", "priceCurrency": "EUR" } },
                        { "@type": "MenuItem", "name": "Brasato di manzo al Barolo „Rinderschmorbraten in Barolo“ mit getrüffelter Petersilienwurzelcreme", "offers": { "@type": "Offer", "price": "42.00", "priceCurrency": "EUR" } }
                      ]
                    },
                    {
                      "@type": "MenuSection", "name": "Dessert",
                      "hasMenuItem": [{ "@type": "MenuItem", "name": "Schokoladentarte mit hausgemachtem Zimt-Vanille-Eis", "offers": { "@type": "Offer", "price": "12.90", "priceCurrency": "EUR" } }]
                    }
                  ]
                }
              ]
            }
          ]
        })}} />

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <img src={silvesterHeroImage} srcSet={`${silvesterHeroImage600} 600w, ${silvesterHeroImage} 1200w`} sizes="100vw" alt={s.heroTitle} className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" width={1200} height={800} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="relative z-10 container mx-auto px-4 py-16 text-center">
            <Link to="/"><img src={storiaLogo} alt="STORIA Logo" loading="eager" className="h-20 md:h-28 w-auto mx-auto mb-6 brightness-0 invert" /></Link>
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-8 md:px-12 md:py-12 max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
                {s.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">{s.heroSubtitle}</p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{s.heroBadge1}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{s.heroBadge2}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{s.heroBadge3}</span>
              </div>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">{s.heroDescription}</p>
              {/* CTA-Hierarchie (E2.3): genau ZWEI Ziele, je Absicht eines — Tisch reservieren
                  (OpenTable-Strecke `#reservieren`) oder Gruppe/Firma anfragen (Formular
                  `#anfrage`). Vorher standen hier drei konkurrierende Wege nebeneinander
                  (events-storia.de, Vormerk-Formular, E-Mail) plus eine Fußnote, die ein viertes
                  Mal nach events-storia.de führte. Die Fußnote ist ersatzlos entfallen: ihre
                  Absicht („für Gruppen") ist jetzt der zweite Button. Telefon, E-Mail und WhatsApp
                  stehen gebündelt an genau einer Stelle, direkt beim Anfrageformular. */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <a href="#reservieren">{s.heroCtaReserve}</a>
                </Button>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <a href="#anfrage">{s.heroCtaInquiry}</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Navigation />

        <main className="container mx-auto px-4 py-12 flex-grow">
          <article className="max-w-5xl mx-auto">
            <BreadcrumbNav crumbs={[{ label: t.breadcrumb.home, href: '/' }, { label: s.breadcrumb }]} />

            {/* TL;DR (E1.5) — der fertige `tldr`-Text lag bisher ungenutzt in den Übersetzungen.
                Muster übernommen von `UeberUns.tsx` („TLDR — Citation-optimized intro"): eine
                Karte direkt unter der Breadcrumb, vor allen anderen Inhalten, damit KI-Systeme
                die Kernaussage der Seite in einem einzigen Chunk vorfinden. */}
            <div className="bg-card border rounded-2xl p-6 md:p-8 mb-12">
              <p className="text-muted-foreground leading-relaxed">{fillFacts(s.tldr)}</p>
            </div>

            {/* Intro — erster Satz ist seit E1.5 der Definition-Lead (GEO-Regel 1), der letzte
                Absatz trägt die autoritative Outbound-Citation (GEO-Regel 3). */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">{s.introTitle}</h2>
              <p className="text-lg text-muted-foreground mb-4">{fillFacts(s.introP1)}</p>
              <p className="text-muted-foreground mb-4">{s.introP2}</p>
              <p className="text-muted-foreground mb-4">{s.introP3}</p>
              <p className="text-muted-foreground">
                {s.citationPre}
                <a
                  href={CITATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline decoration-muted-foreground hover:decoration-foreground transition-colors"
                >
                  {s.citationAnchor}
                </a>
                {s.citationPost}
              </p>
            </section>

            {/* Auf einen Blick (E1.3) — bewusst als Definitionsliste, nicht als Fließtext:
                Gangzahl · Preis · Beginn · Kapazität · Frist sollen maschinenlesbar bleiben. */}
            <section className="mb-16" aria-labelledby="silvester-auf-einen-blick">
              <Card className="border-primary/30 bg-secondary/30">
                <CardHeader className="pb-3">
                  <h2 id="silvester-auf-einen-blick" className="text-2xl font-serif font-bold">{s.atAGlanceTitle}</h2>
                </CardHeader>
                <CardContent>
                  <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                    {atAGlance.map((item, i) => (
                      <div key={i}>
                        <dt className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">{item.label}</dt>
                        <dd className="font-medium">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            </section>

            {/* Packages (kein Live-Menü aktiv) oder Live-Menü */}
            {!isActive ? (
              <section className="mb-16">
                <h2 className="text-3xl font-serif font-bold mb-4 text-center">{s.packagesTitle}</h2>
                <p className="text-muted-foreground text-center mb-8">{s.packagesIntro}</p>
                <div className="grid md:grid-cols-3 gap-6">
                  {packages.map((pkg, i) => (
                    <Card key={i} className={pkg.badge ? "border-primary bg-primary/5 relative" : "border-border"}>
                      {pkg.badge && <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">{pkg.badge}</span>}
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-serif">{pkg.title}</CardTitle>
                        <p className="text-muted-foreground text-sm">{pkg.subtitle}</p>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1 mb-4">{pkg.items.map((item, j) => <li key={j} className="text-muted-foreground">{'\u2022'} {item}</li>)}</ul>
                        <p className="text-xs text-muted-foreground mb-2">{pkg.ideal}</p>
                        <p className="font-bold text-primary">{pkg.price}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ) : (
              <section className="mb-16">
                <MenuDisplay menuType="special" menuId={menu!.id} showTitle={false} />
              </section>
            )}

            {/* Menü der vergangenen Saison (E1.2) — nur solange kein aktuelles Menü live ist.
                Sobald `isActive`, zeigt die Seite oben das echte Menü; ein Vorjahres-Beispiel
                daneben wäre dann nur noch verwirrend. */}
            {!isActive && (
              <section className="mb-16" aria-labelledby="silvester-vorjahresmenue">
                <div className="text-center mb-8">
                  <Badge variant="secondary" className="mb-3">{s.previousMenuBadge}</Badge>
                  <h2 id="silvester-vorjahresmenue" className="text-3xl font-serif font-bold mb-4">{s.previousMenuTitle}</h2>
                  <p className="text-muted-foreground max-w-3xl mx-auto">{s.previousMenuIntro}</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {PREVIOUS_SEASON_MENUS.map((menuVariant) => (
                    <Card key={menuVariant.variant} className="border-border">
                      <CardHeader className="pb-2">
                        {/* Titel bewusst als EIN Ausdruck: React würde sonst zwischen den
                            Textknoten SSR-Kommentare setzen und „4 Gänge Menü «Vegetale»" im
                            ausgelieferten HTML zerstückeln — schlecht für Extraktion durch
                            Suchmaschinen und KI-Systeme. */}
                        <CardTitle className="text-lg font-serif">
                          {`${s.previousMenuCoursesLabel.replace('{courses}', String(FACTS.silvester.courses))} «${menuVariant.variant}»`}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="text-sm space-y-3 list-decimal list-inside marker:text-primary marker:font-semibold">
                          {menuVariant.courses.map((course, j) => (
                            <li key={j} className="text-muted-foreground">{course}</li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground text-center mt-6 max-w-3xl mx-auto">{s.previousMenuNote}</p>
              </section>
            )}

            {/* Reservierung (E2.1) — OpenTable-Strecke im etablierten Landingpage-Muster
                (`headingLevel="h3"` + `onBook`-Lead-Callback, wie OktoberfestMuenchen.tsx:460
                und WmPublicViewingMuenchen.tsx:477).

                Der Text darüber muss die Betriebsrealität aussprechen (Festlegung Antoine,
                13.09.2026): am 31.12. gibt es AUSSCHLIESSLICH das Gala-Menü, kein à la carte.
                Wer hier einen Tisch bucht, bucht damit das Gala-Menü — das darf niemand erst
                am Abend erfahren. Gangzahl und Preise kommen über `fillFacts` aus
                `FACTS.silvester`, damit sie nicht neben „Auf einen Blick" driften können. */}
            <section className="mb-16" id="reservieren" aria-labelledby="silvester-reservieren">
              <h2 id="silvester-reservieren" className="text-3xl font-serif font-bold mb-4 text-center">{s.reservationTitle}</h2>
              <p className="text-muted-foreground text-center mb-8 max-w-3xl mx-auto">{fillFacts(s.reservationIntro)}</p>
              <ReservationBooking
                headingLevel="h3"
                defaultDate={newYearsEveDate}
                onBook={() => fireLead("silvester_reservierung")}
              />
              <p className="text-sm text-muted-foreground text-center mt-6 max-w-3xl mx-auto">{s.reservationNote}</p>
            </section>

            {/* Anfrage (E2.2) — eigenes Formular gegen den MAESTRO-Intake-Endpunkt, KEIN
                MAESTRO-Widget (Festlegung Antoine, 13.09.2026). Für alles, was über eine
                Tischbuchung hinausgeht: größere Gruppen, Fragen zum Gala-Menü, Sonderwünsche.

                Wunschtermin auf den 31.12. vorbelegt (im Formular erst nach dem Mount, damit
                das prerenderte HTML stabil bleibt) — an diesem Abend gibt es nur diesen einen
                Termin. `minGuests` bleibt bei 1: Silvester ist ausdrücklich auch für Paare da
                („2 bis 100 Gäste", Auf einen Blick). */}
            <section className="mb-16" id="anfrage" aria-labelledby="silvester-anfrage">
              <h2 id="silvester-anfrage" className="text-3xl font-serif font-bold mb-4 text-center">{s.inquiryTitle}</h2>
              <p className="text-muted-foreground text-center mb-8 max-w-3xl mx-auto">{s.inquiryIntro}</p>
              <div className="max-w-2xl mx-auto">
                <AnlassAnfrageForm
                  anlass="silvester"
                  defaultEventDate={`${currentYear}-12-31`}
                />
              </div>
            </section>

            {/* Kontaktwege (E2.3) — die EINZIGE Stelle der Seite, an der Telefon, E-Mail und
                WhatsApp stehen. Vorher war dieser Block eine dritte CTA-Box, die nach
                events-storia.de führte und die Kontaktkanäle zusätzlich in Hero und Final-CTA
                wiederholte. Jetzt ist er der Ausweichweg für alle, die lieber sprechen als ein
                Formular auszufüllen — und steht deshalb unmittelbar hinter dem Formular. */}
            <section className="mb-16 bg-primary text-primary-foreground rounded-xl p-8 text-center">
              <h2 className="text-2xl font-serif font-bold mb-4">{s.contactBoxTitle}</h2>
              <p className="mb-6 opacity-90">{s.contactBoxDesc}</p>
              <div className="flex flex-wrap justify-center gap-6">
                <a href="tel:+498951519696" className="flex items-center gap-2 hover:opacity-80"><Phone className="w-4 h-4" /> 089 51519696</a>
                <EmailLink className="flex items-center gap-2 hover:opacity-80"><Mail className="w-4 h-4" /> <EmailAddress /></EmailLink>
                <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
              </div>
            </section>

            {/* 8 Reasons */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{s.reasonsTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reasons.map((r, i) => (
                  <div key={i} className="bg-secondary/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">{r.title}</h3>
                    <p className="text-muted-foreground text-sm">{r.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Timeline */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{s.timelineTitle}</h2>
              <div className="flex flex-wrap justify-center gap-6">
                {steps.map((step, i) => (
                  <div key={i} className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] flex flex-col items-center text-center">
                    <span className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mb-3">{i + 1}</span>
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{s.faqTitle}</h2>
              <Accordion type="multiple" defaultValue={["faq-0","faq-1","faq-2","faq-3","faq-4","faq-5","faq-6","faq-7","faq-8","faq-9"]} className="max-w-3xl mx-auto">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent forceMount className="text-muted-foreground data-[state=closed]:hidden"><PhoneText>{faq.a}</PhoneText></AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Vormerk-Formular AUSGEHÄNGT (E2.3), nicht abgebaut.
                Hier stand bis E2.3 ein `<section id="signup-form">` mit `<SeasonalSignupForm
                seasonalEvent="silvester" />`. Seit die Seite eine echte Reservierungsstrecke
                (`#reservieren`, E2.1) und ein echtes Anfrageformular (`#anfrage`, E2.2) hat, ist
                „Ich lasse mich vormerken" der schwächste von drei Wegen und nimmt den beiden
                starken die Aufmerksamkeit weg.

                ENTFERNT wurde ausschließlich dieser Mount-Punkt. Komponente
                (`src/components/SeasonalSignupForm.tsx`), Edge Functions (`subscribe-seasonal`,
                `confirm-seasonal`, `unsubscribe-seasonal`, `notify-seasonal-signups`), Tabelle
                `seasonal_signups`, Admin-Oberfläche (`SeasonalSignupsManager`,
                `SeasonalNotificationsManager`) und die Bestätigungsseite
                (`NewsletterBestaetigung.tsx`) bleiben unangetastet — `ValentinstagMuenchen.tsx`
                und der generische Anlass-Fallback `BesondererAnlass.tsx` rendern das Formular
                weiterhin und dürfen dabei nicht brechen (harte Regel, Antoine 13.09.2026:
                „KEIN BESTEHENDES FORMULAR DARF BRECHEN"). */}

            {/* Archived Menu (nur wenn kein Live-Menü aktiv) */}
            {!isActive && archivedMenu && (
              <section className="mb-16">
                <div className="border-2 border-dashed border-border rounded-lg p-6 md:p-8 opacity-90">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <h2 className="text-2xl font-serif font-bold text-center">
                      {s.archivedTitle.replace('{year}', String(archivedMenu.archive_year || currentYear - 1))}
                    </h2>
                    <Badge variant="secondary">{archivedMenu.archive_year || currentYear - 1}</Badge>
                  </div>
                  <MenuDisplay menuType="special" menuId={archivedMenu.id} showTitle={false} />
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-3">{s.archivedDisclaimer}</p>
                    {/* E2.3: zeigte auf das entfernte `#signup-form`. Der Anker führt jetzt
                        zurück zur Reservierungsstrecke weiter oben — der ArrowUp stimmt also
                        weiterhin. */}
                    <Button variant="outline" size="sm" asChild>
                      <a href="#reservieren"><ArrowUp className="w-4 h-4 mr-2" />{s.heroCtaReserve}</a>
                    </Button>
                  </div>
                </div>
              </section>
            )}

            {/* Related Links */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{s.relatedTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedLinks.map((link, i) => (
                  <LocalizedLink key={i} to={link.to} className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                    <h3 className="font-semibold mb-2">{link.title}</h3>
                    <p className="text-muted-foreground text-sm">{link.desc}</p>
                  </LocalizedLink>
                ))}
              </div>
            </section>

            {/* Final CTA (E2.3) — dieselben zwei Ziele wie im Hero, am Fuß der Seite noch einmal
                angeboten; die Kontaktkanäle stehen NICHT mehr auch hier (einmal gebündelt beim
                Formular reicht). Die `isActive`-Verzweigung ist entfallen: ob ein Live-Menü
                hinterlegt ist oder nicht, ändert nichts daran, wie reserviert und angefragt
                wird. */}
            <section className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-serif font-bold mb-4">{s.finalCtaTitle}</h2>
              <p className="mb-8 opacity-90">{s.finalCtaDesc}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <a href="#reservieren">{s.finalCtaButtonReserve}</a>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild>
                  <a href="#anfrage">{s.finalCtaButtonInquiry}</a>
                </Button>
              </div>
            </section>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SilvesterMuenchen;
