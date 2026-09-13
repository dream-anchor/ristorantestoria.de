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
import weihnachtsfeierImage from "@/assets/weihnachtsfeier-italiener-storia-muenchen.webp";
import weihnachtsfeierImage600 from "@/assets/weihnachtsfeier-italiener-storia-muenchen-600w.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { useSeasonalMenuActive } from "@/hooks/useSeasonalMenuActive";
import { PARENT_SLUGS } from "@/config/seasonalMenus";
import type { SeasonalMenuConfig } from "@/config/seasonalMenus";
import allSlugs from "@/config/slugs.json";
import { fireLead } from "@/lib/analytics";
import { FACTS } from "@/config/facts";

/**
 * Absolute Bild-URL für das Event-JSON-LD (E1.1, Widerspruch 6).
 *
 * Vorher zeigte das `image`-Feld auf `/weihnachtsmenue-storia-muenchen.jpg` — eine Datei, die in
 * `public/` NICHT existiert (404). Statt eine zweite, thematisch nur halb passende Datei zu
 * erfinden, verweist das Schema jetzt auf das Hero-Bild der Seite selbst: dieselbe Aufnahme, die
 * Besucher oben sehen. Der Import wird von Vite auf den gehashten Build-Pfad aufgelöst, die URL
 * kann also nicht mehr von der ausgelieferten Datei abweichen.
 */
const EVENT_IMAGE_URL = `https://www.ristorantestoria.de${weihnachtsfeierImage}`;

/**
 * Autoritative Outbound-Quelle (E1.5, GEO-Regel 3 aus `docs/geo-content-guidelines.md`).
 *
 * UNESCO-Eintrag „Mediterranean diet" auf der Repräsentativen Liste des immateriellen
 * Kulturerbes. Die italienische Trägergemeinschaft dieses Eintrags ist das Cilento — genau die
 * Herkunftsregion der Familie Speranza, die auf dieser Seite im Intro genannt wird. UNESCO-URLs
 * sind institutionell stabil, die Quelle ist weder Wettbewerber noch Aggregator.
 */
const CITATION_URL = "https://ich.unesco.org/en/RL/mediterranean-diet-00884";

/**
 * Ersetzt die Zahlen-Platzhalter der Übersetzungen durch die Werte aus `FACTS`.
 *
 * Die Übersetzungen enthalten nur Satzschablonen, damit Mindestpersonenzahl, Gruppenpreis und
 * Kapazitäten auf allen vier Sprachen aus derselben einzigen Quelle kommen. Global ersetzen,
 * weil ein Platzhalter innerhalb eines Textes mehrfach vorkommen kann.
 */
const fillFacts = (text: string): string =>
  text
    .replace(/\{minGuests\}/g, String(FACTS.weihnachten.groupMenuMinGuests))
    .replace(/\{groupPrice\}/g, FACTS.weihnachten.groupMenuPriceFrom)
    .replace(/\{indoorSeats\}/g, String(FACTS.capacity.indoorSeats))
    .replace(/\{terraceSeats\}/g, String(FACTS.capacity.terraceSeats));

interface WeihnachtenMuenchenProps {
  standalone?: boolean;
  menu?: any | null;
  archivedMenu?: any | undefined;
  seasonalConfig?: SeasonalMenuConfig;
}

const WeihnachtenMuenchen = ({ standalone, menu, archivedMenu, seasonalConfig }: WeihnachtenMuenchenProps) => {
  const { t, language } = useLanguage();
  usePrerenderReady(true);
  const s = t.seo.weihnachten;
  // K2-Konsolidierung (KONZEPT-SILVESTER-WEIHNACHTEN-KONSOLIDIERUNG.md § 3b): `standalone`
  // steuert nur noch SEO-Metadaten/Breadcrumb (siehe canonicalPath/breadcrumbSchema unten) —
  // NICHT mehr, ob Event/Menu-JSON-LD oder das Live-Menü gerendert werden. Der Standalone-Mount
  // in App.tsx übergibt jetzt dieselbe echte `menu`-Prop wie zuvor nur BesondererAnlass.tsx, also
  // ist `isActive` hier immer datengetrieben. `useSeasonalMenuActive` bleibt als defensiver
  // Fallback für `effectiveConfig`, falls `seasonalConfig` doch mal nicht übergeben wird.
  const { config: hookConfig } = useSeasonalMenuActive('weihnachten');
  const effectiveConfig = seasonalConfig || hookConfig!;
  const isActive = !!menu;
  const currentYear = new Date().getFullYear();

  // --- Canonical + Hreflang ---
  const slugKey = 'weihnachten-muenchen' as const;
  const langKey = language as 'de' | 'en' | 'it' | 'fr';

  let canonicalPath: string;
  let breadcrumbSchema: Array<{ name: string; url: string }>;

  if (standalone) {
    const flatSlug = (allSlugs as any)[langKey]?.[slugKey] || slugKey;
    canonicalPath = language === 'de' ? `/${flatSlug}` : `/${language}/${flatSlug}`;
    breadcrumbSchema = [
      { name: 'Home', url: '/' },
      { name: s.standaloneBreadcrumb || 'Weihnachten M\u00fcnchen', url: canonicalPath },
    ];
  } else {
    const parentSlug = PARENT_SLUGS[language] || PARENT_SLUGS.de;
    const seasonalSlug = effectiveConfig.slugs[language] || effectiveConfig.slugs.de;
    canonicalPath = language === 'de'
      ? `/${parentSlug}/${seasonalSlug}`
      : `/${language}/${parentSlug}/${seasonalSlug}`;
    breadcrumbSchema = [
      { name: 'Home', url: '/' },
      { name: t.nav.specialOccasions, url: `/${PARENT_SLUGS[language] || PARENT_SLUGS.de}` },
      { name: effectiveConfig.titles[language] || effectiveConfig.titles.de, url: canonicalPath },
    ];
  }

  const packages = [
    { title: s.package1Title, subtitle: s.package1Subtitle, items: [s.package1Item1, s.package1Item2, s.package1Item3, s.package1Item4], ideal: s.package1Ideal, price: s.package1Price },
    { title: s.package2Title, subtitle: s.package2Subtitle, items: [s.package2Item1, s.package2Item2, s.package2Item3, s.package2Item4, s.package2Item5], ideal: s.package2Ideal, price: s.package2Price, badge: s.package2Badge },
    { title: s.package3Title, subtitle: s.package3Subtitle, items: [s.package3Item1, s.package3Item2, s.package3Item3, s.package3Item4, s.package3Item5], ideal: s.package3Ideal, price: s.package3Price },
  ];

  /**
   * „Auf einen Blick" (E1.3) — dasselbe Raster wie auf der Silvester-Seite, nur mit den
   * Weihnachts-Fakten: die zwei Wege (à la carte am Tisch vs. Gruppen-Menü), der Zeitraum
   * inklusive der beiden Ruhetage, die Kapazität und der empfohlene Anfragezeitpunkt.
   *
   * Quellen, alle bereits im Repo: `FACTS.weihnachten` (Gruppenpreis, Mindestpersonenzahl),
   * `FACTS.capacity` (100 innen / 100 Terrasse), `ReservationBooking.getClosedDays` (24. und
   * 25.12. als Ruhetage) sowie die FAQ auf dieser Seite (Anfrage ab September/Oktober).
   */
  const atAGlance = [
    { label: s.atAGlanceOptionsLabel, value: fillFacts(s.atAGlanceOptionsValue) },
    { label: s.atAGlancePeriodLabel, value: s.atAGlancePeriodValue },
    { label: s.atAGlanceCapacityLabel, value: fillFacts(s.atAGlanceCapacityValue) },
    { label: s.atAGlanceRequestLabel, value: s.atAGlanceRequestValue },
  ];

  /**
   * Die zwei Wege (E1.4) — die eigentliche Realität dieser Seite, festgelegt von Antoine am
   * 13.09.2026: Weihnachten im STORIA ist entweder ein regulärer Tisch mit à-la-carte-Essen von
   * der saisonalen Karte (ab 1 Person, keine Vorbestellung) ODER ein Weihnachtsmenü, das Firmen
   * und Gruppen direkt mit dem Restaurant absprechen. Ein festes, noch zu veröffentlichendes
   * Weihnachtsmenü — wie die Seite es bis E1.4 suggerierte — gibt es nicht.
   *
   * Bewusst ein eigener Abschnitt weit oben statt nur einer Zeile im „Auf einen Blick"-Block:
   * die Trennung der beiden Wege ist die zentrale Aussage der Seite, nicht eine Eckdate.
   */
  const twoWays = [
    {
      badge: s.twoWay1Badge,
      title: s.twoWay1Title,
      desc: s.twoWay1Desc,
      items: [s.twoWay1Item1, s.twoWay1Item2, s.twoWay1Item3],
    },
    {
      badge: s.twoWay2Badge,
      title: s.twoWay2Title,
      desc: fillFacts(s.twoWay2Desc),
      items: [fillFacts(s.twoWay2Item1), s.twoWay2Item2, fillFacts(s.twoWay2Item3)],
    },
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

  const relatedLinks = standalone ? [
    { title: s.standaloneRelated1Title, desc: s.standaloneRelated1Desc, to: "weihnachtsfeier-muenchen" },
    { title: s.standaloneRelated2Title, desc: s.standaloneRelated2Desc, to: "eventlocation-muenchen-maxvorstadt" },
    { title: s.standaloneRelated3Title, desc: s.standaloneRelated3Desc, to: "firmenfeier-muenchen" },
    { title: s.standaloneRelated4Title, desc: s.standaloneRelated4Desc, to: "speisekarte" },
    { title: s.standaloneRelated5Title, desc: s.standaloneRelated5Desc, to: "reservierung" },
    { title: s.standaloneRelated6Title, desc: s.standaloneRelated6Desc, to: "catering" },
  ] : [
    { title: s.related1Title, desc: s.related1Desc, to: "speisekarte" },
    { title: s.related2Title, desc: s.related2Desc, to: "eventlocation-muenchen-maxvorstadt" },
    { title: s.related3Title, desc: s.related3Desc, to: "besondere-anlaesse/silvester" },
    { title: s.related4Title, desc: s.related4Desc, to: "valentinstag-muenchen" },
    { title: s.related5Title, desc: s.related5Desc, to: "firmenfeier-muenchen" },
    { title: s.related6Title, desc: s.related6Desc, to: "kontakt" },
  ];

  return (
    <>
      <SEO
        title={standalone ? s.standaloneSeoTitle : s.seoTitle}
        description={standalone ? s.standaloneSeoDescription : s.seoDescription}
        canonical={canonicalPath}
      />
      <StructuredData type="restaurant" />
      <StructuredData type="breadcrumb" breadcrumbs={breadcrumbSchema} />

      {/* Event-Schema – Weihnachtsmenü für Gruppen — references #restaurant / #organization by @id.
          K2-Konsolidierung: früher an `!standalone` gebunden (nur auf der Pillar-Route sichtbar),
          jetzt unconditional, weil die Standalone-URL (weihnachten-muenchen) seit der
          Konsolidierung die kanonische, einzige URL ist (KONZEPT § 3b). Die früher hier
          eingebettete "BreadcrumbList" wurde entfernt — sie ist redundant zur bereits oben
          gerenderten <StructuredData type="breadcrumb">, die (anders als dieser hartcodierte
          Block) standalone-bewusst die korrekte 2-stufige Breadcrumb liefert. @id/offers.url
          zeigen jetzt auf die neue kanonische URL statt auf die abgeschaltete Pillar-Route.

          E1.6, Typ: `FoodEvent` statt `Event` — `docs/geo-content-guidelines.md` § Regel 8
          schreibt für Event-Seiten `FoodEvent` vor. Untertyp von `Event`, alle Felder bleiben.

          E1.6, ENTSCHEIDUNG — was dieses Event beschreibt: Seit E1.4 bildet die Seite zwei Wege
          ab. Weg 1 (à la carte am reservierten Tisch, ab 1 Person, keine Vorbestellung) ist
          regulärer Restaurantbetrieb an beliebigen Abenden der Adventszeit — er hat weder einen
          festen Termin noch ein festes Angebot und ist damit KEIN Event im Sinne von schema.org;
          er ist bereits über das `Restaurant`-Schema (oben, `<StructuredData type="restaurant">`)
          samt Öffnungszeiten abgedeckt. Das Event-Schema beschreibt deshalb ausschließlich Weg 2:
          das Weihnachtsmenü für Firmen und Gruppen ab `FACTS.weihnachten.groupMenuMinGuests`
          Personen. `name`, `description` und `eligibleQuantity` sagen das jetzt ausdrücklich —
          vorher versprach der generische Name „Weihnachtsmenü im STORIA München" ein festes,
          für jeden buchbares Menü, das es laut Faktenklärung vom 13.09.2026 gar nicht gibt.

          E1.6, `highPrice`: bisher trug das AggregateOffer nur `lowPrice`. Der obere
          Orientierungspreis ist der des Pakets „Weihnachten Premium" (`weihnachten.package2Price`
          in den Übersetzungen: „ab 65 € p.P.") — der höchste bezifferte Wert auf der Seite. Das
          dritte Paket („Weihnachten Exclusive") ist mit „Auf Anfrage" ausgewiesen und liefert
          bewusst keine Zahl; erfunden wird hier keine. `lowPrice` kommt aus `FACTS.weihnachten`,
          damit er nicht getrennt vom sichtbaren Inhalt driften kann. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FoodEvent",
        "@id": "https://www.ristorantestoria.de/weihnachten-muenchen/#event",
        "name": "Weihnachtsmenü für Gruppen im STORIA München",
        "description": `Weihnachtsmenü für Firmen und Gruppen ab ${FACTS.weihnachten.groupMenuMinGuests} Personen im Ristorante STORIA in München Maxvorstadt: süditalienische Festtagsküche, im Gespräch mit dem Restaurant auf Anlass, Vorlieben und Budget abgestimmt, ab ${FACTS.weihnachten.groupMenuPriceFrom} € pro Person. Ein festes Weihnachtsmenü zum Vorbestellen gibt es nicht. Am 24. und 25. Dezember ist das Restaurant geschlossen.`,
        "startDate": "2026-11-25T17:00:00+01:00",
        "endDate": "2026-12-23T23:30:00+01:00",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": { "@id": "https://www.ristorantestoria.de/#restaurant" },
        "organizer": { "@id": "https://www.ristorantestoria.de/#organization" },
        "image": [EVENT_IMAGE_URL],
        "offers": {
          "@type": "AggregateOffer",
          "lowPrice": `${FACTS.weihnachten.groupMenuPriceFrom}.00`,
          "highPrice": "65.00",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock",
          "url": "https://www.ristorantestoria.de/weihnachten-muenchen/",
          "eligibleQuantity": {
            "@type": "QuantitativeValue",
            "minValue": FACTS.weihnachten.groupMenuMinGuests,
            "unitText": "Personen"
          }
        }
      })}} />

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

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <img src={weihnachtsfeierImage} srcSet={`${weihnachtsfeierImage600} 600w, ${weihnachtsfeierImage} 1200w`} sizes="100vw" alt={s.heroTitle} className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" width={1200} height={800} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="relative z-10 container mx-auto px-4 py-16 text-center">
            <Link to="/"><img src={storiaLogo} alt="STORIA Logo" loading="eager" className="h-20 md:h-28 w-auto mx-auto mb-6 brightness-0 invert" /></Link>
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-8 md:px-12 md:py-12 max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
                {standalone ? s.standaloneHeroTitle || s.heroTitle : s.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">{s.heroSubtitle}</p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{s.heroBadge1}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{s.heroBadge2}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{s.heroBadge3}</span>
              </div>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">{s.heroDescription}</p>
              {/* CTA-Hierarchie (E2.3): genau ZWEI Ziele — und sie decken sich eins zu eins mit
                  den zwei Wegen aus E1.4. Weg 1 (à la carte am Tisch) = `#reservieren`, Weg 2
                  (Gruppen-/Firmenmenü) = `#anfrage`. Vorher führten hier drei konkurrierende
                  Wege weg (events-storia.de, Vormerk-Formular, E-Mail) plus eine Fußnote als
                  vierter Weg zu events-storia.de. Die Fußnote ist ersatzlos entfallen: ihre
                  Absicht („für Gruppen") ist jetzt der zweite Button. */}
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
            <BreadcrumbNav crumbs={standalone
              ? [{ label: t.breadcrumb.home, href: '/' }, { label: s.standaloneBreadcrumb || s.breadcrumb }]
              : [{ label: t.breadcrumb.home, href: '/' }, { label: s.breadcrumb }]
            } />

            {/* TL;DR (E1.5) — der fertige `tldr`-Text lag bisher ungenutzt in den Übersetzungen.
                Muster übernommen von `UeberUns.tsx` („TLDR — Citation-optimized intro"): eine
                Karte direkt unter der Breadcrumb, vor allen anderen Inhalten. Inhaltlich trägt
                sie seit E1.4 die Zwei-Wege-Realität als allererste Aussage der Seite. */}
            <div className="bg-card border rounded-2xl p-6 md:p-8 mb-12">
              <p className="text-muted-foreground leading-relaxed">{fillFacts(s.tldr)}</p>
            </div>

            {/* Intro — erster Satz ist seit E1.5 der Definition-Lead (GEO-Regel 1) und benennt
                zugleich beide Wege (E1.4); der letzte Absatz trägt die autoritative
                Outbound-Citation (GEO-Regel 3). */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">{s.introTitle}</h2>
              <p className="text-lg text-muted-foreground mb-4">{fillFacts(s.introP1)}</p>
              <p className="text-muted-foreground mb-4">{fillFacts(s.introP2)}</p>
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

            {/* Auf einen Blick (E1.3) — Definitionsliste statt Fließtext, damit die Eckdaten
                maschinenlesbar bleiben (Wettbewerbsraster: Angebot · Zeitraum · Kapazität · Frist). */}
            <section className="mb-16" aria-labelledby="weihnachten-auf-einen-blick">
              <Card className="border-primary/30 bg-secondary/30">
                <CardHeader className="pb-3">
                  <h2 id="weihnachten-auf-einen-blick" className="text-2xl font-serif font-bold">{s.atAGlanceTitle}</h2>
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

            {/* Zwei Wege (E1.4) — direkt unter „Auf einen Blick" und VOR den Paketen, damit der
                Besucher die Entscheidung trifft, bevor er Preise sieht. Die Pakete darunter sind
                nur noch Orientierung für Weg 2, nicht mehr ein Katalog fester Menüs. */}
            <section className="mb-16" aria-labelledby="weihnachten-zwei-wege">
              <h2 id="weihnachten-zwei-wege" className="text-3xl font-serif font-bold mb-4 text-center">{s.twoWaysTitle}</h2>
              <p className="text-muted-foreground text-center mb-8 max-w-3xl mx-auto">{s.twoWaysIntro}</p>
              <div className="grid md:grid-cols-2 gap-6">
                {twoWays.map((way, i) => (
                  <Card key={i} className="border-primary/30">
                    <CardHeader className="pb-2">
                      <Badge variant="secondary" className="w-fit mb-2">{way.badge}</Badge>
                      <CardTitle className="text-xl font-serif">{way.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{way.desc}</p>
                      <ul className="text-sm space-y-1">
                        {way.items.map((item, j) => (
                          <li key={j} className="text-muted-foreground">{'•'} {item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Reservierung (E2.1) — das ist WEG 1 der Zwei-Wege-Logik in Handlungsform:
                Tisch buchen und à la carte von der saisonalen Karte essen. Deshalb steht der
                Block direkt hinter „Zwei Wege" und vor den Paketen (die nur Orientierung für
                Weg 2 sind). Muster wie auf den anderen Landingpages: `headingLevel="h3"`
                plus `onBook`-Lead-Callback.

                KEINE `defaultDate`-Vorbelegung: anders als bei Silvester gibt es hier keinen
                einzelnen Termin, sondern die ganze Adventszeit — die Komponente bleibt also
                auf „heute". Der 24. und 25. Dezember sind Ruhetage und werden von
                `ReservationBooking.getClosedDays` im Kalender automatisch gesperrt; der Text
                sagt das ausdrücklich, damit es niemand vergeblich versucht. */}
            <section className="mb-16" id="reservieren" aria-labelledby="weihnachten-reservieren">
              <h2 id="weihnachten-reservieren" className="text-3xl font-serif font-bold mb-4 text-center">{s.reservationTitle}</h2>
              <p className="text-muted-foreground text-center mb-8 max-w-3xl mx-auto">{s.reservationIntro}</p>
              <ReservationBooking
                headingLevel="h3"
                onBook={() => fireLead("weihnachten_reservierung")}
              />
              <p className="text-sm text-muted-foreground text-center mt-6 max-w-3xl mx-auto">{s.reservationNote}</p>
            </section>

            {/* Packages grid (kein Live-Menü aktiv) oder Live-Menü — bis zur K2-Konsolidierung
                nur auf der Pillar-Route, jetzt auch hier (KONZEPT § 3b: nichts geht verloren,
                die Standalone-URL wird aufgewertet statt nur redirected). */}
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

            {/* Anfrage (E2.2) — das ist WEG 2 in Handlungsform: das Gruppen-/Firmenmenü, das
                direkt mit dem Restaurant abgestimmt wird. Steht bewusst DIREKT hinter den
                Paketen, die nur Orientierung für genau diesen Weg sind. Weg 1 (à la carte am
                Tisch) läuft über die Reservierungsstrecke weiter oben, nicht über dieses
                Formular. Eigenes Formular gegen den MAESTRO-Intake-Endpunkt, kein Widget. */}
            <section className="mb-16" id="anfrage" aria-labelledby="weihnachten-anfrage">
              <h2 id="weihnachten-anfrage" className="text-3xl font-serif font-bold mb-4 text-center">{s.inquiryTitle}</h2>
              <p className="text-muted-foreground text-center mb-8 max-w-3xl mx-auto">{fillFacts(s.inquiryIntro)}</p>
              <div className="max-w-2xl mx-auto">
                <AnlassAnfrageForm
                  anlass="weihnachten"
                  minGuests={FACTS.weihnachten.groupMenuMinGuests}
                />
              </div>
            </section>

            {/* Kontaktwege (E2.3) — die EINZIGE Stelle der Seite, an der Telefon, E-Mail und
                WhatsApp stehen. Vorher war dieser Block eine dritte CTA-Box, die nach
                events-storia.de führte und die Kontaktkanäle zusätzlich in Hero und Final-CTA
                wiederholte. Für Weg 2 ist das Gespräch ohnehin der Kern der Sache (das Menü wird
                besprochen, nicht bestellt) — deshalb steht der Block unmittelbar hinter dem
                Anfrageformular. */}
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
                seasonalEvent="weihnachten" />`. Auf dieser Seite war es zusätzlich sachlich
                schief: seit E1.4 gibt es gar kein Menü mehr, auf das man sich vormerken lassen
                könnte — Weg 1 ist eine Reservierung, Weg 2 ein Gespräch. Beide sind jetzt als
                echte Strecke da (`#reservieren`, `#anfrage`).

                ENTFERNT wurde ausschließlich dieser Mount-Punkt. Komponente
                (`src/components/SeasonalSignupForm.tsx`), Edge Functions (`subscribe-seasonal`,
                `confirm-seasonal`, `unsubscribe-seasonal`, `notify-seasonal-signups`), Tabelle
                `seasonal_signups`, Admin-Oberfläche (`SeasonalSignupsManager`,
                `SeasonalNotificationsManager`) und die Bestätigungsseite
                (`NewsletterBestaetigung.tsx`) bleiben unangetastet — `ValentinstagMuenchen.tsx`
                und der generische Anlass-Fallback `BesondererAnlass.tsx` rendern das Formular
                weiterhin und dürfen dabei nicht brechen (harte Regel, Antoine 13.09.2026:
                „KEIN BESTEHENDES FORMULAR DARF BRECHEN"). */}

            {/* Archived Menu (inactive) — K2: bis dahin nur non-standalone, jetzt auch hier */}
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

export default WeihnachtenMuenchen;
