import { Link } from "react-router-dom";
import { PhoneText } from "@/lib/linkifyPhone";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import GoogleReviews from "@/components/GoogleReviews";
import ConsentGoogleMaps from "@/components/ConsentGoogleMaps";
import AnlassAnfrageForm from "@/components/AnlassAnfrageForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, MessageCircle, Star } from "lucide-react";
import storiaLogo from "@/assets/storia-logo.webp";
import weihnachtsfeierEvent from "@/assets/weihnachtsfeier-event.webp";
import weihnachtsfeierEvent600 from "@/assets/weihnachtsfeier-event-600w.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import LocalizedLink from "@/components/LocalizedLink";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { EVENTS_LINKS } from "@/lib/eventsLinks";
import { FACTS } from "@/config/facts";

/**
 * Autoritative Outbound-Quelle (V2.3, GEO-Lücken-Loop, GEO-Regel 3 aus
 * docs/geo-content-guidelines.md). Accademia Italiana della Cucina, 1953 gegründet, offizielle
 * italienische Institution zur Dokumentation/Bewahrung regionaler Kochtraditionen (Sitz Mailand,
 * staatlich als Kultureinrichtung anerkannt) — eigene Quelle, nicht dieselbe wie
 * SilvesterMuenchen.tsx (champagne.fr) oder WeihnachtenMuenchen.tsx (UNESCO Mediterranean Diet).
 */
const CITATION_URL = "https://www.accademiaitalianadellacucina.it/en";

/**
 * Ersetzt die Zahlen-Platzhalter der Übersetzungen durch die Werte aus FACTS (Muster wie
 * WeihnachtenMuenchen.tsx) — damit Preis und Kapazität im "Auf einen Blick"-Block aus derselben
 * einzigen Quelle kommen statt hartkodiert zu sein.
 */
const fillFacts = (text: string): string =>
  text
    .replace(/\{groupPrice\}/g, FACTS.weihnachten.groupMenuPriceFrom)
    .replace(/\{indoorSeats\}/g, String(FACTS.capacity.indoorSeats))
    .replace(/\{terraceSeats\}/g, String(FACTS.capacity.terraceSeats))
    .replace(/\{standing\}/g, String(FACTS.capacity.standing));

const WeihnachtsfeierMuenchen = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);
  const w = t.seo.weihnachtsfeier;

  // "Auf einen Blick" (V2.3) — Muster wie WeihnachtenMuenchen.tsx/SilvesterMuenchen.tsx.
  const atAGlance = [
    { label: w.atAGlanceCapacityLabel, value: fillFacts(w.atAGlanceCapacityValue) },
    { label: w.atAGlancePriceLabel, value: fillFacts(w.atAGlancePriceValue) },
    { label: w.atAGlanceMinGuestsLabel, value: w.atAGlanceMinGuestsValue },
    { label: w.atAGlanceRequestLabel, value: w.atAGlanceRequestValue },
  ];

  const eventTypes = [
    { icon: "🏢", title: w.type1Title, desc: w.type1Desc, items: [w.type1Item1, w.type1Item2, w.type1Item3, w.type1Item4], note: w.type1Note },
    { icon: "👨‍👩‍👧‍👦", title: w.type2Title, desc: w.type2Desc, items: [w.type2Item1, w.type2Item2, w.type2Item3, w.type2Item4] },
    { icon: "💕", title: w.type3Title, desc: w.type3Desc, items: [w.type3Item1, w.type3Item2, w.type3Item3, w.type3Item4] },
    { icon: "🤝", title: w.type4Title, desc: w.type4Desc, items: [w.type4Item1, w.type4Item2, w.type4Item3, w.type4Item4] },
  ];

  const menus = [
    { title: w.menu1Title, subtitle: w.menu1Subtitle, desc: w.menu1Desc },
    { title: w.menu2Title, subtitle: w.menu2Subtitle, desc: w.menu2Desc, badge: w.menu2Badge },
    { title: w.menu3Title, subtitle: w.menu3Subtitle, desc: w.menu3Desc },
  ];

  const reasons = [
    { title: w.reason1Title, desc: w.reason1Desc },
    { title: w.reason2Title, desc: w.reason2Desc },
    { title: w.reason3Title, desc: w.reason3Desc },
    { title: w.reason4Title, desc: w.reason4Desc },
    // V2.4 (GEO-Lücken-Loop, 13.09.2026): FACTS.capacity.* statt hartkodierter Zahlen, siehe
    // fillFacts() oben — dieselben Werte standen unabhängig auch in faq2Answer.
    { title: w.reason5Title, desc: fillFacts(w.reason5Desc) },
    { title: w.reason6Title, desc: w.reason6Desc },
    { title: w.reason7Title, desc: w.reason7Desc },
    { title: w.reason8Title, desc: w.reason8Desc },
  ];

  const processSteps = [
    { title: w.step1Title, desc: w.step1Desc },
    { title: w.step2Title, desc: w.step2Desc },
    { title: w.step3Title, desc: w.step3Desc },
    { title: w.step4Title, desc: w.step4Desc },
    { title: w.step5Title, desc: w.step5Desc },
  ];

  const testimonials = [
    { quote: w.testimonial1Quote, author: w.testimonial1Author, details: w.testimonial1Details },
    { quote: w.testimonial2Quote, author: w.testimonial2Author, details: w.testimonial2Details },
    { quote: w.testimonial3Quote, author: w.testimonial3Author, details: w.testimonial3Details },
  ];

  const faqs = [
    // V2.4 (GEO-Lücken-Loop, 13.09.2026): FACTS.weihnachten.groupMenuPriceFrom /
    // FACTS.capacity.* statt hartkodierter "45 €"/Kapazitätszahlen, siehe fillFacts() oben.
    { q: w.faq1Question, a: fillFacts(w.faq1Answer) },
    { q: w.faq2Question, a: fillFacts(w.faq2Answer) },
    { q: w.faq3Question, a: w.faq3Answer },
    { q: w.faq4Question, a: w.faq4Answer },
    { q: w.faq5Question, a: w.faq5Answer },
    { q: w.faq6Question, a: w.faq6Answer },
    { q: w.faq7Question, a: w.faq7Answer },
    { q: w.faq8Question, a: w.faq8Answer },
    // E3.3: neue FAQ, entstanden aus E3.1 (Stornostaffel) — schließt an step3Desc an.
    { q: w.faq9Question, a: w.faq9Answer },
    // V2.2 (GEO-Lücken-Loop, 13.09.2026): "Betriebsweihnachtsfeier" deckt eine eigene Query ab,
    // die bisher auf dieser Seite nicht vorkam.
    { q: w.faq10Question, a: w.faq10Answer },
  ];

  /**
   * Stornobedingungen (E3.1) — Stornostaffel Antoine, 13.09.2026. Schließt die Lücke, dass
   * `step3Desc` bereits "Anzahlung (30%) sichert Ihren Termin" erwähnt, ohne dass bisher eine
   * begleitende Stornoregel dazu auf der Seite stand.
   */
  const cancellationTiers = [
    { period: w.cancellationTier1Period, fee: w.cancellationTier1Fee },
    { period: w.cancellationTier2Period, fee: w.cancellationTier2Fee },
    { period: w.cancellationTier3Period, fee: w.cancellationTier3Fee },
    { period: w.cancellationTier4Period, fee: w.cancellationTier4Fee },
    { period: w.cancellationTier5Period, fee: w.cancellationTier5Fee },
  ];

  return (
    <>
      <SEO title={fillFacts(w.seoTitle)} description={fillFacts(w.seoDescription)} canonical="/weihnachtsfeier-muenchen" />
      <StructuredData type="restaurant" />
      <StructuredData type="breadcrumb" breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: t.internalLinks.eventLocation, url: '/eventlocation-muenchen-maxvorstadt' },
        { name: t.internalLinks.christmasParty, url: '/weihnachtsfeier-muenchen' }
      ]} />
      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(item => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": { "@type": "Answer", "text": item.a }
        }))
      })}} />

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <img src={weihnachtsfeierEvent} srcSet={`${weihnachtsfeierEvent600} 600w, ${weihnachtsfeierEvent} 1200w`} sizes="100vw" alt={w.heroTitle} className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" width={1200} height={800} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="relative z-10 container mx-auto px-4 py-16 text-center">
            <Link to="/"><img src={storiaLogo} alt="STORIA Logo" loading="eager" className="h-20 md:h-28 w-auto mx-auto mb-6 brightness-0 invert" /></Link>
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-8 md:px-12 md:py-12 max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">{w.heroTitle}</h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">{w.heroSubtitle}</p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{w.heroBadge1}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{w.heroBadge2}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{w.heroBadge3}</span>
              </div>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">{w.heroDescription}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <a href="tel:+498951519696"><Phone className="w-5 h-5 mr-2" />089 51519696</a>
                </Button>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <LocalizedLink to="reservierung">{w.heroCta}</LocalizedLink>
                </Button>
              </div>
              <p className="text-white/60 text-sm mt-4">{w.heroEventsNote} <a href={EVENTS_LINKS.weihnachtsfeier} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">events-storia.de</a></p>
            </div>
          </div>
        </section>

        <Navigation />

        <main className="container mx-auto px-4 py-12 flex-grow">
          <article className="max-w-5xl mx-auto">
            <BreadcrumbNav crumbs={[{ label: t.breadcrumb.home, href: '/' }, { label: t.internalLinks.eventLocation, href: '/eventlocation-muenchen-maxvorstadt' }, { label: w.breadcrumb }]} />

            {/* TL;DR (V2.3, GEO-Lücken-Loop) — der fertige `tldr`-Text lag bisher ungenutzt in den
                Übersetzungen. Muster wie WeihnachtenMuenchen.tsx: eine Karte direkt unter der
                Breadcrumb, vor allen anderen Inhalten. */}
            <div className="bg-card border rounded-2xl p-6 md:p-8 mb-12">
              <p className="text-muted-foreground leading-relaxed">{fillFacts(w.tldr)}</p>
            </div>

            {/* Intro — erster Satz ist seit V2.3 der Definition-Lead (GEO-Regel 1); der letzte
                Absatz trägt die autoritative Outbound-Citation (GEO-Regel 3). */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">{w.introTitle}</h2>
              <p className="text-lg text-muted-foreground mb-4">{w.introP1}</p>
              <p className="text-muted-foreground">
                {w.citationPre}
                <a
                  href={CITATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline decoration-muted-foreground hover:decoration-foreground transition-colors"
                >
                  {w.citationAnchor}
                </a>
                {w.citationPost}
              </p>
            </section>

            {/* Auf einen Blick (V2.3, GEO-Lücken-Loop) — Definitionsliste statt Fließtext, Muster
                wie WeihnachtenMuenchen.tsx/SilvesterMuenchen.tsx. */}
            <section className="mb-16" aria-labelledby="weihnachtsfeier-auf-einen-blick">
              <Card className="border-primary/30 bg-secondary/30">
                <CardHeader className="pb-3">
                  <h2 id="weihnachtsfeier-auf-einen-blick" className="text-2xl font-serif font-bold">{w.atAGlanceTitle}</h2>
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

            {/* Event Types */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{w.typesTitle}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {eventTypes.map((ev, i) => (
                  <Card key={i} className="border-border">
                    <CardHeader className="pb-2">
                      <div className="text-4xl mb-2">{ev.icon}</div>
                      <CardTitle className="text-xl font-serif">{ev.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">{ev.desc}</p>
                      <ul className="text-sm space-y-1">{ev.items.map((item, j) => <li key={j} className="text-muted-foreground">✓ {item}</li>)}</ul>
                      {ev.note && <p className="text-xs text-primary mt-3">⚠️ {ev.note}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Weihnachtsmenü — E4.2, Fakt (Antoine, 13.09.2026, gilt hier genauso wie auf
                weihnachten-muenchen): es gibt KEIN festes, vorgegebenes Weihnachtsmenü, auch nicht
                für Firmen/Gruppen. Die drei Karten (Natale Classico/Grande/Buffet) bleiben in
                Preis und Struktur unverändert (Geschäftsfakt), sind aber laut `menuIntro` jetzt
                ausdrücklich Orientierungsbeispiele für das gemeinsame Gespräch, kein
                Bestellmenü von der Karte — siehe auch `faq4Answer` und die Anfrage-Sektion
                direkt darunter. */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-4 text-center">{w.menuTitle}</h2>
              <p className="text-muted-foreground text-center mb-8">{w.menuIntro}</p>
              <div className="grid md:grid-cols-3 gap-6">
                {menus.map((menu, i) => (
                  <Card key={i} className={menu.badge ? "border-primary bg-primary/5 relative" : "border-border"}>
                    {menu.badge && <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">{menu.badge}</span>}
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-serif">{menu.title}</CardTitle>
                      <p className="text-muted-foreground text-sm">{menu.subtitle}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">{menu.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-center text-muted-foreground mt-6 text-sm"><PhoneText>{w.menuPriceNote}</PhoneText></p>
            </section>

            {/* Anfrage (E4.2, docs/LOOP-SAISONSEITEN-AUSBAU.md § E4) — der Gruppen-/Firmen-Weg,
                der bei der Kannibalisierungs-Auflösung von weihnachten-muenchen zu dieser Seite
                gewandert ist. Eigener `anlass="weihnachtsfeier"` (nicht "weihnachten"), damit
                `sourceDetail` als `ristorante_weihnachtsfeier` unterscheidbar bleibt — siehe
                AnlassAnfrageForm.tsx. Steht bewusst direkt hinter den Menü-Beispielen: wer die
                Orientierung oben gesehen hat, kann hier sofort anfragen.

                Events-storia-CTAs (Hero, Final-CTA) bleiben unverändert bestehen — diese Seite ist
                NICHT Teil des MAESTRO-Ersatzes aus E2.3 (dort war ausdrücklich nur
                weihnachten-muenchen gemeint). Das Formular ist ein zusätzlicher Weg, kein Ersatz. */}
            <section className="mb-16" id="anfrage" aria-labelledby="weihnachtsfeier-anfrage">
              <h2 id="weihnachtsfeier-anfrage" className="text-3xl font-serif font-bold mb-4 text-center">{w.inquiryTitle}</h2>
              <p className="text-muted-foreground text-center mb-8 max-w-3xl mx-auto">{w.inquiryIntro}</p>
              <div className="max-w-2xl mx-auto">
                <AnlassAnfrageForm
                  anlass="weihnachtsfeier"
                  minGuests={FACTS.weihnachten.groupMenuMinGuests}
                />
              </div>
            </section>

            {/* Stornobedingungen (E3.1) — Stornostaffel Antoine, 13.09.2026. Bewusst OHNE Verweis
                auf eine "AGB für Veranstaltungen"-Seite: die gibt es im Repo nicht (nur
                agb-restaurant, agb-gutscheine in slugs.json), ein Link darauf wäre eine 404 bzw.
                eine falsche Erwartung — siehe `cancellationDepositNote`, die stattdessen auf die
                Buchungsbestätigung verweist. Schließt die Lücke zu `step3Desc` ("Anzahlung
                (30%) sichert Ihren Termin"), die bisher ohne begleitende Stornoregel stand. */}
            <section className="mb-16" aria-labelledby="weihnachtsfeier-storno">
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <h2 id="weihnachtsfeier-storno" className="text-2xl font-serif font-bold">{w.cancellationTitle}</h2>
                  <p className="text-muted-foreground text-sm">{w.cancellationIntro}</p>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{w.cancellationColPeriod}</TableHead>
                        <TableHead>{w.cancellationColFee}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cancellationTiers.map((tier, i) => (
                        <TableRow key={i}>
                          <TableCell>{tier.period}</TableCell>
                          <TableCell className="font-medium">{tier.fee}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <p className="text-sm text-muted-foreground mt-4">{w.cancellationBasisNote}</p>
                  <p className="text-sm text-muted-foreground mt-2">{w.cancellationDepositNote}</p>
                </CardContent>
              </Card>
            </section>

            {/* 8 Gründe */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{w.reasonsTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reasons.map((r, i) => (
                  <div key={i} className="bg-secondary/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">{r.title}</h3>
                    <p className="text-muted-foreground text-sm">{r.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Ablauf */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{w.processTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processSteps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">{i + 1}</span>
                    <div>
                      <h3 className="font-semibold mb-1">{step.title}</h3>
                      <p className="text-muted-foreground text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonials */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{w.testimonialsTitle}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((tm, i) => (
                  <Card key={i} className="border-border">
                    <CardContent className="pt-6">
                      <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-primary text-primary" />)}</div>
                      <p className="text-muted-foreground italic mb-4">"{tm.quote}"</p>
                      <p className="text-sm font-medium">{tm.author}</p>
                      <p className="text-xs text-muted-foreground">{tm.details}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Wann buchen */}
            <section className="mb-16 bg-secondary/50 rounded-xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4 text-center">{w.bookingTitle}</h2>
              <p className="text-muted-foreground mb-4">{w.bookingP1}</p>
              <p className="text-muted-foreground mb-4"><strong>{w.bookingTip}</strong></p>
              <p className="text-muted-foreground">{w.bookingShortNotice}</p>
            </section>

            {/* Location */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">{w.locationTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{w.locationAddressTitle}</h3>
                  <p className="text-muted-foreground text-sm">Ristorante STORIA<br />Karlstraße 47a<br />80333 München</p>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{w.locationTransitTitle}</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>{w.locationTransit1}</li>
                    <li>{w.locationTransit2}</li>
                    <li>{w.locationTransit3}</li>
                  </ul>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{w.locationHotelsTitle}</h3>
                  <p className="text-muted-foreground text-sm">{w.locationHotelsDesc}</p>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{w.locationTipTitle}</h3>
                  <p className="text-muted-foreground text-sm">{w.locationTipDesc}</p>
                </div>
              </div>
              <ConsentGoogleMaps src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d11.5658!3d48.1465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKarlstra%C3%9Fe%2047a%2C%2080333%20M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1" />
            </section>

            {/* FAQ */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{w.faqTitle}</h2>
              <Accordion type="multiple" defaultValue={["faq-0","faq-1","faq-2","faq-3","faq-4","faq-5","faq-6","faq-7","faq-8","faq-9"]} className="max-w-3xl mx-auto">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent forceMount className="text-muted-foreground data-[state=closed]:hidden"><PhoneText>{faq.a}</PhoneText></AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Related — E4.2: weihnachten-muenchen ergänzt (fehlte bisher komplett, obwohl
                weihnachten-muenchen umgekehrt schon seit E4.1 prominent hierher verlinkt).
                Gegenrichtung für Einzelgäste/Familien, die eigentlich nur à la carte am Tisch
                essen wollen und hier fälschlich gelandet sind. */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{w.relatedTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <LocalizedLink to="weihnachten-muenchen" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{w.related5Title}</h3>
                  <p className="text-muted-foreground text-sm">{w.related5Desc}</p>
                </LocalizedLink>
                <LocalizedLink to="firmenfeier-muenchen" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{w.related1Title}</h3>
                  <p className="text-muted-foreground text-sm">{w.related1Desc}</p>
                </LocalizedLink>
                <LocalizedLink to="eventlocation-muenchen-maxvorstadt" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{w.related2Title}</h3>
                  <p className="text-muted-foreground text-sm">{w.related2Desc}</p>
                </LocalizedLink>
                <LocalizedLink to="romantisches-dinner-muenchen" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{w.related3Title}</h3>
                  <p className="text-muted-foreground text-sm">{w.related3Desc}</p>
                </LocalizedLink>
                <LocalizedLink to="pizza-muenchen" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{w.related4Title}</h3>
                  <p className="text-muted-foreground text-sm">{w.related4Desc}</p>
                </LocalizedLink>
                <LocalizedLink to="lunch-muenchen-maxvorstadt" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{t.internalLinks.lunchMunich}</h3>
                  <p className="text-muted-foreground text-sm">Auch als Business-Lunch beliebt – täglich wechselndes Mittagsmenü.</p>
                </LocalizedLink>
                <LocalizedLink to="faq" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{t.internalLinks.faqLink}</h3>
                  <p className="text-muted-foreground text-sm">{t.internalLinks.faqLinkDesc}</p>
                </LocalizedLink>
              </div>
            </section>

            <GoogleReviews />

            {/* Final CTA */}
            <section className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-serif font-bold mb-4">{w.ctaTitle}</h2>
              <p className="mb-8 opacity-90">{w.ctaDesc}</p>
              <Button size="lg" variant="secondary" asChild>
                <LocalizedLink to="reservierung">{w.ctaButton}</LocalizedLink>
              </Button>
              <p className="mt-4 opacity-70 text-sm">F\u00fcr Rundum-Event-Planung: <a href={EVENTS_LINKS.weihnachtsfeier} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">events-storia.de</a></p>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <a href="tel:+498951519696" className="flex items-center gap-2 hover:opacity-80"><Phone className="w-4 h-4" /> 089 51519696</a>
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

export default WeihnachtsfeierMuenchen;
