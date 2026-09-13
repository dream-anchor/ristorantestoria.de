import { Link } from "react-router-dom";
import { PhoneText } from "@/lib/linkifyPhone";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import MenuDisplay from "@/components/MenuDisplay";
import ReservationBooking from "@/components/ReservationBooking";
import LocalizedLink from "@/components/LocalizedLink";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowUp } from "lucide-react";
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

  // E4.1: `packages` (Pakete-Grid „Orientierung für Ihr Gruppen-Menü") entfernt — Gruppen-only,
  // wandert in E4.2 zu weihnachtsfeier-muenchen. Nur der Live-Menü-Zweig bleibt (siehe unten,
  // `{isActive && <MenuDisplay .../>}`).

  /**
   * „Auf einen Blick" (E1.3) — dasselbe Raster wie auf der Silvester-Seite, nur mit den
   * Weihnachts-Fakten: die zwei Wege (à la carte am Tisch vs. Gruppen-Menü), der Zeitraum
   * inklusive der beiden Ruhetage, die Kapazität und der empfohlene Anfragezeitpunkt.
   *
   * Quellen, alle bereits im Repo: `FACTS.weihnachten` (Gruppenpreis, Mindestpersonenzahl),
   * `FACTS.capacity` (100 innen / 100 Terrasse), `ReservationBooking.getClosedDays` (24. und
   * 25.12. als Ruhetage) sowie `atAGlanceRequestValue` (Anfrage ab September/Oktober — die
   * FAQ dazu ist seit E4.1 nicht mehr auf dieser Seite, sondern auf weihnachtsfeier-muenchen).
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
  // E4.1: Weg 1 bleibt eine echte Karte; Weg 2 ist kein eigener Handlungsblock mehr, sondern ein
  // Hinweis mit Link (siehe JSX unten) — deshalb kein gemeinsames `twoWays`-Array mehr, Weg 1
  // wird direkt referenziert.
  const twoWay1 = {
    badge: s.twoWay1Badge,
    title: s.twoWay1Title,
    desc: s.twoWay1Desc,
    items: [s.twoWay1Item1, s.twoWay1Item2, s.twoWay1Item3],
  };

  // E4.1: reason4 (Gruppengrößen) und reason8 (Rundum-Service) entfernt — Gruppen-only, auf
  // 6 Gründe reduziert statt mit erfundenen Fakten aufgefüllt (siehe reasonsTitle in den
  // Übersetzungen).
  const reasons = [
    { title: s.reason1Title, desc: s.reason1Desc },
    { title: s.reason2Title, desc: s.reason2Desc },
    { title: s.reason3Title, desc: s.reason3Desc },
    { title: s.reason5Title, desc: s.reason5Desc },
    { title: s.reason6Title, desc: s.reason6Desc },
    { title: s.reason7Title, desc: s.reason7Desc },
  ];

  // E4.1: Timeline „So läuft Ihre Weihnachtsfeier ab" entfernt — Gruppen-only (bedientes
  // Gruppenmenü), wandert in E4.2 zu weihnachtsfeier-muenchen.

  // E4.1: faq1 (Buchungsvorlauf), faq2 (Mindestpersonenzahl) und faq6 (Geschenke/Dekoration)
  // entfernt — Gruppen-only bzw. auf ein betreutes Gruppen-Event gemünzt. faq3/faq4 sind
  // gegen den in der E4-Recherche gefundenen Widerspruch zu weihnachtsfeier-muenchen FAQ4
  // präzisiert (siehe Übersetzungen).
  const faqs = [
    { q: s.faq8Question, a: s.faq8Answer },
    { q: s.faq3Question, a: s.faq3Answer },
    { q: s.faq5Question, a: s.faq5Answer },
    { q: s.faq4Question, a: s.faq4Answer },
    { q: s.faq7Question, a: s.faq7Answer },
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

      {/* E4.1, ENTSCHEIDUNG — FoodEvent-JSON-LD ersatzlos entfernt (nicht auf ein
          eventloses Schema reduziert):

          Das bisherige `FoodEvent`-Schema (E1.6) beschrieb laut eigenem Kommentar ausschließlich
          Weg 2 (das Weihnachtsmenü für Firmen und Gruppen ab `FACTS.weihnachten.groupMenuMinGuests`
          Personen) — Weg 1 (à la carte am Tisch) war schon damals als regulärer Restaurantbetrieb
          ohne festen Termin explizit KEIN Event im Sinne von schema.org.

          Mit E4.1 wird Weg 2 auf dieser Seite kein eigener Handlungsblock mehr (kein
          Anfrageformular, keine Timeline, keine Pakete-Grid hier — das alles wandert in E4.2 zu
          weihnachtsfeier-muenchen). Die Seite bewirbt und beschreibt das Gruppen-Event damit nicht
          mehr selbst, sondern verweist nur noch kurz mit Link darauf. Ein `FoodEvent`-Schema für
          ein Angebot zu behaupten, das die Seite gar nicht mehr im Detail beschreibt (kein
          Startdatum-Angebot, kein Preis-Grid, kein Anfrageweg hier), wäre irreführend gegenüber
          Suchmaschinen — genau das im Zielbild von docs/LOOP-SAISONSEITEN-AUSBAU.md § E4
          benannte Risiko. Das vollständige, aktuelle Event-Schema für das Gruppenmenü gehört
          stattdessen zu weihnachtsfeier-muenchen (E4.2), wo Pakete, Anfrageformular und Ablauf
          tatsächlich stehen.

          Kein Ersatz-Schema ohne Event-Charakter nötig: `Restaurant`-Schema (oben) deckt den
          reinen Gastronomiebetrieb bereits vollständig ab, `FAQPage` (unten) bleibt unverändert. */}

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
                  (Gruppen-/Firmenmenü) führt seit E4.1 nicht mehr zu einem Formular auf dieser
                  Seite (entfernt, Gegenstand von E4.2), sondern direkt zur Weihnachtsfeier-Seite. */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <a href="#reservieren">{s.heroCtaReserve}</a>
                </Button>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <LocalizedLink to="weihnachtsfeier-muenchen">{s.heroCtaInquiry}</LocalizedLink>
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

            {/* Zwei Wege (E1.4) — direkt unter „Auf einen Blick" und vor der Reservierung, damit
                der Besucher die Entscheidung trifft, bevor er weiterliest.

                E4.1 (Kannibalisierung aufgelöst, docs/LOOP-SAISONSEITEN-AUSBAU.md § E4): Weg 2 ist
                hier kein eigener Handlungsblock mit Karte mehr — nur noch ein kurzer Hinweis mit
                prominentem Link auf weihnachtsfeier-muenchen, wo Pakete, Anfrageformular und
                Ablauf tatsächlich stehen (E4.2). So werden die Gruppen-Inhalte nicht auf zwei
                Seiten parallel gepflegt. */}
            <section className="mb-16" aria-labelledby="weihnachten-zwei-wege">
              <h2 id="weihnachten-zwei-wege" className="text-3xl font-serif font-bold mb-4 text-center">{s.twoWaysTitle}</h2>
              <p className="text-muted-foreground text-center mb-8 max-w-3xl mx-auto">{s.twoWaysIntro}</p>
              <div className="max-w-xl mx-auto">
                <Card className="border-primary/30">
                  <CardHeader className="pb-2">
                    <Badge variant="secondary" className="w-fit mb-2">{twoWay1.badge}</Badge>
                    <CardTitle className="text-xl font-serif">{twoWay1.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{twoWay1.desc}</p>
                    <ul className="text-sm space-y-1">
                      {twoWay1.items.map((item, j) => (
                        <li key={j} className="text-muted-foreground">{'•'} {item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <div className="max-w-xl mx-auto mt-6 bg-secondary/40 border border-primary/20 rounded-xl p-6 text-center">
                <Badge variant="outline" className="mb-2">{s.twoWay2HintBadge}</Badge>
                <h3 className="font-semibold text-lg mb-2">{s.twoWay2HintTitle}</h3>
                <p className="text-muted-foreground text-sm mb-4">{s.twoWay2HintDesc}</p>
                <Button variant="outline" asChild>
                  <LocalizedLink to="weihnachtsfeier-muenchen">{s.twoWay2HintLinkLabel}</LocalizedLink>
                </Button>
              </div>
            </section>

            {/* Reservierung (E2.1) — das ist WEG 1 der Zwei-Wege-Logik in Handlungsform:
                Tisch buchen und à la carte von der saisonalen Karte essen. Deshalb steht der
                Block direkt hinter „Zwei Wege". Muster wie auf den anderen Landingpages:
                `headingLevel="h3"` plus `onBook`-Lead-Callback.

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

            {/* E4.1: Pakete-Grid "Orientierung für Ihr Gruppen-Menü" (Gruppen-only) entfernt —
                wandert in E4.2 zu weihnachtsfeier-muenchen. Der Live-Menü-Zweig bleibt: falls
                admin-seitig ein aktives Saison-Menü hinterlegt ist, wird es weiterhin gezeigt. */}
            {isActive && (
              <section className="mb-16">
                <MenuDisplay menuType="special" menuId={menu!.id} showTitle={false} />
              </section>
            )}

            {/* E4.1: Anfrageformular-Sektion (id="anfrage", AnlassAnfrageForm) und Kontaktbox
                ("Lieber persönlich sprechen?") entfernt — beide waren auf Weg 2 (Gruppen-/
                Firmenmenü) gemünzt und wandern in E4.2 zu weihnachtsfeier-muenchen. Die
                AnlassAnfrageForm-Komponente selbst bleibt bestehen (wird dort gebraucht), nur
                die Einbindung hier ist entfallen. */}

            {/* 6 Gründe (E4.1: von 8 auf 6 reduziert — reason4/reason8 waren Gruppen-only) */}
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

            {/* E4.1: Timeline "So läuft Ihre Weihnachtsfeier ab" entfernt — Gruppen-only
                (bedientes Gruppenmenü), wandert in E4.2 zu weihnachtsfeier-muenchen. */}

            {/* FAQ (E4.1: von 8 auf 5 privat-relevante Fragen reduziert, faq3/faq4 präzisiert) */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{s.faqTitle}</h2>
              <Accordion type="multiple" defaultValue={["faq-0","faq-1","faq-2","faq-3","faq-4"]} className="max-w-3xl mx-auto">
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
                könnte — Weg 1 ist eine Reservierung, Weg 2 ein Gespräch. Weg 1 ist als echte
                Strecke da (`#reservieren`); Weg 2 verweist seit E4.1 auf weihnachtsfeier-muenchen
                (das dortige `#anfrage`-Formular, siehe E4.2), nicht mehr auf einen Anker hier.

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

            {/* Related Links — E4.1: weihnachtsfeier-muenchen (relatedLinks[0] im
                standalone-Zweig) prominent hervorgehoben statt nur einer von sechs
                gleichwertigen Karten (Kannibalisierung, docs/LOOP-SAISONSEITEN-AUSBAU.md § E4). */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{s.relatedTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedLinks.map((link, i) => (
                  <LocalizedLink
                    key={i}
                    to={link.to}
                    className={i === 0
                      ? "bg-primary/5 border-2 border-primary rounded-lg p-6 hover:bg-primary/10 transition-colors"
                      : "bg-card border rounded-lg p-6 hover:border-primary transition-colors"}
                  >
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
                wird.

                E4.1: der zweite Button führt nicht mehr zum entfernten #anfrage-Formular dieser
                Seite, sondern direkt zur Weihnachtsfeier-Seite. */}
            <section className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-serif font-bold mb-4">{s.finalCtaTitle}</h2>
              <p className="mb-8 opacity-90">{s.finalCtaDesc}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <a href="#reservieren">{s.finalCtaButtonReserve}</a>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild>
                  <LocalizedLink to="weihnachtsfeier-muenchen">{s.finalCtaButtonInquiry}</LocalizedLink>
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
