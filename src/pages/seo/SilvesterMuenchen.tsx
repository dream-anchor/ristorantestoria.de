import { Link } from "react-router-dom";
import EmailLink, { EmailAddress } from "@/components/EmailLink";
import { PhoneText } from "@/lib/linkifyPhone";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import MenuDisplay from "@/components/MenuDisplay";
import SeasonalSignupForm from "@/components/SeasonalSignupForm";
import LocalizedLink from "@/components/LocalizedLink";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, MessageCircle, Mail, ExternalLink, ArrowUp, ArrowRight } from "lucide-react";
import storiaLogo from "@/assets/storia-logo.webp";
import silvesterHeroImage from "@/assets/silvester-dinner-gala-storia-muenchen.webp";
import silvesterHeroImage600 from "@/assets/silvester-dinner-gala-storia-muenchen-600w.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { useSeasonalMenuActive } from "@/hooks/useSeasonalMenuActive";
import { PARENT_SLUGS } from "@/config/seasonalMenus";
import type { SeasonalMenuConfig } from "@/config/seasonalMenus";
import allSlugs from "@/config/slugs.json";
import { EVENTS_LINKS } from "@/lib/eventsLinks";
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

interface SilvesterMuenchenProps {
  standalone?: boolean;
  menu?: any | null;
  archivedMenu?: any | undefined;
  seasonalConfig?: SeasonalMenuConfig;
}

const SilvesterMuenchen = ({ standalone, menu, archivedMenu, seasonalConfig }: SilvesterMuenchenProps) => {
  const { t, language } = useLanguage();
  usePrerenderReady(true);
  const s = t.seo.silvester;
  const { isActive: configActive, config: hookConfig } = useSeasonalMenuActive('silvester');
  const effectiveConfig = seasonalConfig || hookConfig!;
  const isActive = standalone ? configActive : !!menu;
  const currentYear = new Date().getFullYear();

  // --- Canonical + Hreflang ---
  const slugKey = 'silvester-muenchen' as const;
  const langKey = language as 'de' | 'en' | 'it' | 'fr';

  let canonicalPath: string;
  let breadcrumbSchema: Array<{ name: string; url: string }>;

  if (standalone) {
    const flatSlug = (allSlugs as any)[langKey]?.[slugKey] || slugKey;
    canonicalPath = language === 'de' ? `/${flatSlug}` : `/${language}/${flatSlug}`;
    breadcrumbSchema = [
      { name: 'Home', url: '/' },
      { name: s.standaloneBreadcrumb || 'Silvester M\u00fcnchen', url: canonicalPath },
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
    { title: s.package1Title, subtitle: s.package1Subtitle, items: [s.package1Item1, s.package1Item2, s.package1Item3, s.package1Item4, s.package1Item5], ideal: s.package1Ideal, price: s.package1Price },
    { title: s.package2Title, subtitle: s.package2Subtitle, items: [s.package2Item1, s.package2Item2, s.package2Item3, s.package2Item4, s.package2Item5, s.package2Item6, s.package2Item7], ideal: s.package2Ideal, price: s.package2Price, badge: s.package2Badge },
    { title: s.package3Title, subtitle: s.package3Subtitle, items: [s.package3Item1, s.package3Item2, s.package3Item3, s.package3Item4, s.package3Item5], ideal: s.package3Ideal, price: s.package3Price },
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

  const relatedLinks = standalone ? [
    { title: s.standaloneRelated1Title, desc: s.standaloneRelated1Desc, to: "eventlocation-muenchen-maxvorstadt" },
    { title: s.standaloneRelated2Title, desc: s.standaloneRelated2Desc, to: "aperitivo-muenchen" },
    { title: s.standaloneRelated3Title, desc: s.standaloneRelated3Desc, to: "firmenfeier-muenchen" },
    { title: s.standaloneRelated4Title, desc: s.standaloneRelated4Desc, to: "speisekarte" },
    { title: s.standaloneRelated5Title, desc: s.standaloneRelated5Desc, to: "reservierung" },
    { title: s.standaloneRelated6Title, desc: s.standaloneRelated6Desc, to: "terrasse-muenchen" },
  ] : [
    { title: s.related1Title, desc: s.related1Desc, to: "speisekarte" },
    { title: s.related2Title, desc: s.related2Desc, to: "eventlocation-muenchen-maxvorstadt" },
    { title: s.related3Title, desc: s.related3Desc, to: "weihnachten-muenchen" },
    { title: s.related4Title, desc: s.related4Desc, to: "valentinstag-muenchen" },
    { title: s.related5Title, desc: s.related5Desc, to: "firmenfeier-muenchen" },
    { title: s.related6Title, desc: s.related6Desc, to: "kontakt" },
  ];

  // Standalone: link to the besondere-anlaesse page when menu is active
  const menuPagePath = (() => {
    if (!standalone) return '';
    const parentSlug = PARENT_SLUGS[language] || PARENT_SLUGS.de;
    const seasonalSlug = effectiveConfig.slugs[language] || effectiveConfig.slugs.de;
    return language === 'de' ? `/${parentSlug}/${seasonalSlug}/` : `/${language}/${parentSlug}/${seasonalSlug}/`;
  })();

  return (
    <>
      <SEO
        title={standalone ? s.standaloneSeoTitle : s.seoTitle}
        description={standalone ? s.standaloneSeoDescription : s.seoDescription}
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

      {/* Event + Menu @graph (non-standalone only) — references #restaurant / #organization by @id.
          Die früher hier eingebettete "BreadcrumbList" wurde entfernt (E1.1, Widerspruch 7): sie war
          redundant zur bereits oben gerenderten <StructuredData type="breadcrumb">, die (anders als
          dieser hartcodierte Block) standalone-bewusst die korrekte Breadcrumb liefert. Die Seite
          rendert damit genau EINE BreadcrumbList — wie bei Weihnachten seit der K2-Konsolidierung. */}
      {!standalone && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Event",
              "@id": "https://www.ristorantestoria.de/besondere-anlaesse/silvester/#event",
              "name": "Silvester Gala-Dinner im STORIA München",
              "description": "Italienisches Gala-Dinner zum Jahreswechsel in der Maxvorstadt: Champagner-Aperitif und 4-Gänge-Degustationsmenü zur Wahl (Vegetale, Mare oder Terra). Ab 99 € pro Person, mit Weinbegleitung 150 €.",
              "startDate": "2026-12-31T19:00:00+01:00",
              "endDate": "2027-01-01T02:00:00+01:00",
              "eventStatus": "https://schema.org/EventScheduled",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
              "location": { "@id": "https://www.ristorantestoria.de/#restaurant" },
              "organizer": { "@id": "https://www.ristorantestoria.de/#organization" },
              "performer": { "@id": "https://www.ristorantestoria.de/#restaurant" },
              "image": [EVENT_IMAGE_URL],
              "offers": [
                { "@type": "Offer", "name": "4-Gänge-Degustationsmenü", "price": "99.00", "priceCurrency": "EUR", "availability": "https://schema.org/InStock", "url": "https://www.ristorantestoria.de/besondere-anlaesse/silvester/", "validFrom": "2026-11-01" },
                { "@type": "Offer", "name": "4-Gänge-Degustationsmenü mit Weinbegleitung", "price": "150.00", "priceCurrency": "EUR", "availability": "https://schema.org/InStock", "url": "https://www.ristorantestoria.de/besondere-anlaesse/silvester/", "validFrom": "2026-11-01" }
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
                    { "@type": "Offer", "price": "99.00", "priceCurrency": "EUR" },
                    { "@type": "Offer", "name": "mit Weinbegleitung", "price": "150.00", "priceCurrency": "EUR" }
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
      )}

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
                {standalone ? s.standaloneHeroTitle || s.heroTitle : s.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">{s.heroSubtitle}</p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{s.heroBadge1}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{s.heroBadge2}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{s.heroBadge3}</span>
              </div>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">{s.heroDescription}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {standalone ? (
                  <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                    <a href="tel:+498951519696"><Phone className="w-5 h-5 mr-2" />{s.heroCtaPhone}</a>
                  </Button>
                ) : isActive ? (
                  <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                    <a href={EVENTS_LINKS.silvester} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-5 h-5 mr-2" />{s.heroCta}</a>
                  </Button>
                ) : (
                  <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                    <a href="#signup-form">{s.heroCtaInactive}</a>
                  </Button>
                )}
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <EmailLink><Mail className="w-5 h-5 mr-2" /> <EmailAddress /></EmailLink>
                </Button>
              </div>
              <p className="mt-6 text-white/70 text-sm">
                {s.heroEventsNote} <a href={EVENTS_LINKS.silvester} target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-primary">{s.heroEventsLink}</a>
              </p>
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

            {/* Intro */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">{s.introTitle}</h2>
              <p className="text-lg text-muted-foreground mb-4">{s.introP1}</p>
              <p className="text-muted-foreground mb-4">{s.introP2}</p>
              <p className="text-muted-foreground">{s.introP3}</p>
            </section>

            {/* Standalone: Teaser or CTA — Non-standalone: Packages or Live Menu */}
            {standalone ? (
              isActive ? (
                <section className="mb-16">
                  <Card className="border-primary bg-primary/5">
                    <CardContent className="p-8 text-center">
                      <h2 className="text-2xl font-serif font-bold mb-3">{s.standaloneTeaserTitle}</h2>
                      <p className="text-muted-foreground mb-6">{s.standaloneTeaserDesc}</p>
                      <Button size="lg" asChild>
                        <Link to={menuPagePath}><ArrowRight className="w-5 h-5 mr-2" />{s.standaloneTeaserButton}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </section>
              ) : (
                <section className="mb-16 bg-card rounded-lg border border-border p-8 md:p-12 text-center">
                  <h2 className="text-2xl font-serif font-bold mb-3">{s.standaloneInactiveTitle}</h2>
                  <p className="text-muted-foreground mb-6">{s.standaloneInactiveDesc}</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button asChild><a href="tel:+498951519696"><Phone className="w-4 h-4 mr-2" /> 089 51519696</a></Button>
                    <Button variant="outline" asChild><EmailLink><Mail className="w-4 h-4 mr-2" /> E-Mail</EmailLink></Button>
                    <Button variant="outline" asChild>
                      <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer"><MessageCircle className="w-4 h-4 mr-2" /> WhatsApp</a>
                    </Button>
                  </div>
                </section>
              )
            ) : !isActive ? (
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
            {!standalone && !isActive && (
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

            {/* CTA Box */}
            <section className="mb-16 bg-primary text-primary-foreground rounded-xl p-8 text-center">
              <h2 className="text-2xl font-serif font-bold mb-4">{s.ctaBoxTitle}</h2>
              <p className="mb-6 opacity-90">{s.ctaBoxDesc}</p>
              <Button size="lg" variant="secondary" asChild>
                <a href={EVENTS_LINKS.silvester} target="_blank" rel="noopener noreferrer">{s.ctaBoxButton}</a>
              </Button>
              <p className="mt-6 opacity-80 text-sm"><PhoneText>{s.ctaBoxNote}</PhoneText></p>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <a href="tel:+498951519696" className="flex items-center gap-2 hover:opacity-80"><Phone className="w-4 h-4" /> 089 51519696</a>
                <EmailLink className="flex items-center gap-2 hover:opacity-80"><Mail className="w-4 h-4" /> <EmailAddress /></EmailLink>
                <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 text-[#25D366]"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
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

            {/* Email Signup (inactive + non-standalone only) */}
            {!isActive && !standalone && (
              <section id="signup-form" className="mb-16 scroll-mt-24">
                <div className="bg-card rounded-lg border border-border p-8 md:p-12 text-center">
                  <h2 className="text-2xl font-serif font-bold mb-3">{s.signupTitle}</h2>
                  <p className="text-muted-foreground mb-6">{s.signupDesc}</p>
                  <div className="max-w-md mx-auto">
                    <SeasonalSignupForm seasonalEvent="silvester" />
                  </div>
                </div>
              </section>
            )}

            {/* Archived Menu (inactive + non-standalone only) */}
            {!isActive && !standalone && archivedMenu && (
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
                    <Button variant="outline" size="sm" asChild>
                      <a href="#signup-form"><ArrowUp className="w-4 h-4 mr-2" />{s.heroCtaInactive}</a>
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

            {/* Final CTA */}
            <section className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-serif font-bold mb-4">{s.finalCtaTitle}</h2>
              <p className="mb-8 opacity-90">{s.finalCtaDesc}</p>
              {standalone ? (
                <Button size="lg" variant="secondary" asChild>
                  <a href="tel:+498951519696"><Phone className="w-5 h-5 mr-2" />{s.finalCtaButton}</a>
                </Button>
              ) : isActive ? (
                <Button size="lg" variant="secondary" asChild>
                  <a href={EVENTS_LINKS.silvester} target="_blank" rel="noopener noreferrer">{s.finalCtaButton}</a>
                </Button>
              ) : (
                <Button size="lg" variant="secondary" asChild>
                  <a href="#signup-form">{s.finalCtaButtonInactive}</a>
                </Button>
              )}
              <p className="mt-6 opacity-80 text-sm">{s.finalCtaAlt}</p>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <a href="tel:+498951519696" className="flex items-center gap-2 hover:opacity-80"><Phone className="w-4 h-4" /> 089 51519696</a>
                <EmailLink className="flex items-center gap-2 hover:opacity-80"><Mail className="w-4 h-4" /> <EmailAddress /></EmailLink>
                <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
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
