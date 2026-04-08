import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import LocalizedLink from "@/components/LocalizedLink";
import GoogleReviews from "@/components/GoogleReviews";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import storiaLogo from "@/assets/storia-logo.webp";
import sommerfestEvent from "@/assets/sommerfest-event.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { Phone, Mail, ExternalLink, Star, CheckCircle } from "lucide-react";

const cateringServiceSchema = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  "additionalType": "CateringService",
  "name": "STORIA Catering München",
  "description": "Italienisches Event-Catering in München – von Fingerfood bis Full-Service-Buffet. Pizza, Pasta, Antipasti für Firmenevents, Hochzeiten und private Feiern.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Karlstraße 47A",
    "addressLocality": "München",
    "postalCode": "80333",
    "addressCountry": "DE"
  },
  "telephone": "+498951519696",
  "url": "https://www.ristorantestoria.de/catering/",
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": { "@type": "GeoCoordinates", "latitude": 48.1451, "longitude": 11.5654 },
    "geoRadius": "50000"
  },
  "priceRange": "€€",
  "servesCuisine": "Italienisch",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "700"
  }
};

const anlassCards = [
  {
    icon: "🏢",
    title: "Firmen-Catering",
    desc: "Mittagscatering, Konferenz-Lunch, After-Work, Firmenjubiläum",
    items: [
      "Business-Lunch-Pakete ab 25 € p.P.",
      "Lieferung ins Büro oder zur Eventlocation",
      "Rechnungsstellung an Firma",
      "Regelmäßige Bestellungen möglich",
    ],
  },
  {
    icon: "💍",
    title: "Hochzeits-Catering",
    desc: "Italienisches Hochzeitsbuffet, Antipasti-Empfang, Dessert-Station",
    items: [
      "Individuelle Menü-Zusammenstellung",
      "Verkostungstermin möglich",
      "Full-Service mit Personal",
      "Aufbau & Abbau inklusive",
    ],
  },
  {
    icon: "🎂",
    title: "Geburtstag & Privatfeier",
    desc: "Geburtstagsfeier, Gartenparty, Familienfeier",
    items: [
      "Pizza-Buffet für Kinder & Erwachsene",
      "Flexible Portionsgrößen",
      "Lieferung am Wochenende",
      "Ab 20 Personen",
    ],
  },
  {
    icon: "☀️",
    title: "Sommerfest & Outdoor",
    desc: "Firmensommerfest, Gartenparty, BBQ-Event",
    items: [
      "Pizza-Station im Freien",
      "Aperitivo-Bar",
      "Salat- und Antipasti-Buffet",
      "Auch ohne Stromanschluss möglich",
    ],
  },
  {
    icon: "🎪",
    title: "Messe & Kongress",
    desc: "Messe-Catering, Konferenz-Lunch, VIP-Empfang",
    items: [
      "Fingerfood für Standbetreiber",
      "Zeitgenaue Lieferung",
      "Tägliches Catering über mehrere Tage",
      "Abrechnung über Auftraggeber",
    ],
  },
  {
    icon: "🎄",
    title: "Weihnachtsfeier-Catering",
    desc: "Italienisches Weihnachtsbuffet, außer Haus",
    items: [
      "Festliche Antipasti & Hauptgänge",
      "Dolci-Station (Panettone, Tiramisú)",
      "Glühwein & Weihnachts-Aperitivo",
    ],
    note: "⚠️ Frühzeitig buchen – Nov/Dez sehr beliebt!",
  },
];

const whyReasons = [
  {
    icon: "📍",
    title: "Frisch aus München",
    desc: "Keine Tiefkühlware, keine lange Anfahrt. Alles wird frisch in unserer Küche in der Maxvorstadt zubereitet und warm geliefert.",
  },
  {
    icon: "🍕",
    title: "Echte neapolitanische Pizza",
    desc: "Steinofen-Pizza, kein Standard-Catering. Unsere Pizzaioli backen auf Wunsch auch vor Ort live.",
  },
  {
    icon: "🍝",
    title: "Hausgemachte Pasta",
    desc: "Tagliatelle, Ravioli, Gnocchi – täglich frisch in unserer Küche hergestellt. Keine Industrieware.",
  },
  {
    icon: "👨‍👩‍👧‍👦",
    title: "Familienunternehmen",
    desc: "Die Familie Speranza kocht seit über 20 Jahren. Persönliche Beratung, kein Call-Center.",
  },
  {
    icon: "💰",
    title: "Transparente Preise",
    desc: "Detailliertes Angebot vorab, keine versteckten Kosten. Pakete für jedes Budget.",
  },
  {
    icon: "🚚",
    title: "Eigene Lieferung",
    desc: "Wir liefern mit eigenem Team – keine externen Lieferdienste. München + 50 km Umkreis.",
  },
  {
    icon: "🥗",
    title: "Für alle Ernährungsformen",
    desc: "Vegetarisch, vegan, glutenfrei, laktosefrei – wir passen jedes Menü an.",
  },
  {
    icon: "🏆",
    title: "Bewährt & beliebt",
    desc: "Über 4.8 Sterne bei Google mit 700+ Bewertungen. Zahlreiche Stammkunden buchen jährlich.",
  },
];

const detailedPackages = [
  {
    title: "Antipasti-Buffet",
    price: "ab 25 € p.P.",
    items: [
      "Bruschetta Classica & Bruschetta mit Burrata",
      "Carpaccio di Manzo mit Rucola und Parmigiano",
      "Gegrilltes Gemüse (Zucchini, Aubergine, Paprika)",
      "Italienische Aufschnittplatte (Prosciutto, Salami, Mortadella)",
      "Focaccia frisch gebacken",
    ],
    ideal: "Mindestbestellung: 20 Personen",
  },
  {
    title: "Flying Dinner / Fingerfood",
    price: "ab 30 € p.P.",
    items: [
      "Mini-Arancini (Reisball mit Ragù)",
      "Crostini mit Thunfisch-Tatar",
      "Prosciutto-Melone-Spieße",
      "Bruschetta-Variationen",
      "Mini-Caprese auf Löffeln",
    ],
    ideal: "Ideal für: Empfänge, Vernissagen, Stehempfang",
  },
  {
    title: "Pizza & Pasta Buffet",
    price: "ab 35 € p.P.",
    badge: "Popular",
    items: [
      "Steinofen-Pizza (3 Sorten, auf Wunsch live gebacken)",
      "Hausgemachte Pasta-Station (Tagliatelle, Penne, Gnocchi)",
      "3 Saucen zur Auswahl (Ragù, Pesto, Arrabbiata)",
      "Beilagensalat",
    ],
    ideal: "Ideal für: Sommerfeste, Geburtstage, lockere Events",
  },
  {
    title: "Premium Italienisches Buffet",
    price: "ab 55 € p.P.",
    items: [
      "Antipasti-Selektion (6 Sorten)",
      "Pasta-Station mit frischer Pasta",
      "Hauptgang (Ossobuco, Saltimbocca oder Fisch)",
      "Contorni (Beilagen)",
      "Dolci-Station (Tiramisú, Panna Cotta, Cannoli)",
      "Weinbegleitung (Prosecco, Weiß- & Rotwein)",
      "Full-Service mit Personal",
    ],
    ideal: "Ideal für: Hochzeiten, Firmenjubiläen, Premium-Events",
  },
  {
    title: "Dolci / Dessert-Station",
    price: "ab 12 € p.P.",
    items: [
      "Tiramisú",
      "Panna Cotta",
      "Cannoli Siciliani",
      "Italienische Kekse (Amaretti, Cantuccini)",
      "Frisches Obst",
    ],
    ideal: "Perfekt als Ergänzung oder eigenständig",
  },
];

const deliveryGrid = [
  { icon: "🍕", title: "Pizza Napoletana", desc: "Vorgebacken, vor Ort fertiggestellt oder live aus dem mobilen Ofen" },
  { icon: "🍝", title: "Frische Pasta", desc: "Tagliatelle, Ravioli, Gnocchi – hausgemacht, mit 3+ Saucen" },
  { icon: "🥗", title: "Antipasti & Salate", desc: "Von Bruschetta bis Carpaccio, kunstvoll angerichtet auf Platten" },
  { icon: "🥩", title: "Warme Hauptgänge", desc: "Ossobuco, Saltimbocca, gegrillter Fisch – für gehobene Events" },
  { icon: "🍰", title: "Dolci-Buffet", desc: "Tiramisú, Panna Cotta, Cannoli – der süße Abschluss" },
  { icon: "🍷", title: "Getränke", desc: "Prosecco, italienische Weine, Aperitivo, Softdrinks, Wasser" },
  { icon: "🍽️", title: "Equipment", desc: "Geschirr, Besteck, Servietten, Warmhaltebehälter auf Anfrage" },
  { icon: "👨‍🍳", title: "Personal", desc: "Servicekräfte für Aufbau, Betreuung und Abbau buchbar" },
];

const testimonials = [
  {
    quote: "Das Catering war perfekt – die Pizza frisch, der Service professionell. Alle Gäste waren begeistert!",
    author: "Markus T.",
    details: "Firmenjubiläum, 80 Personen",
  },
  {
    quote: "Wir haben das Antipasti-Buffet für unsere Hochzeit gebucht. Einfach wunderschön angerichtet und unglaublich lecker.",
    author: "Sandra & Michael",
    details: "Hochzeits-Catering, München",
  },
  {
    quote: "Seit drei Jahren buchen wir STORIA für unser Sommerfest. Immer pünktlich, immer frisch, immer ein Highlight.",
    author: "HR-Team, IT-Unternehmen München",
    details: "Wiederkehrender Stammkunde",
  },
];

const extendedFaqs = [
  {
    q: "Ab wie vielen Personen bieten Sie Catering an?",
    a: "Unser Catering-Service beginnt ab 20 Personen. Für kleinere Gruppen empfehlen wir die Buchung unserer Eventlocation direkt im Restaurant.",
  },
  {
    q: "In welchem Umkreis liefern Sie in München?",
    a: "Wir liefern innerhalb von München und im Umkreis von bis zu 50 km. Für größere Entfernungen sprechen Sie uns an.",
  },
  {
    q: "Können einzelne Gänge separat gebucht werden?",
    a: "Ja, Sie können einzelne Komponenten buchen – z.B. nur Antipasti-Buffet oder nur Dolci. Wir erstellen Ihnen gerne ein individuelles Paket.",
  },
  {
    q: "Welche Vorlaufzeit benötigen Sie für ein Catering?",
    a: "Wir empfehlen eine Vorlaufzeit von mindestens 2 Wochen. Bei kurzfristigen Anfragen sprechen Sie uns an – wir versuchen immer zu helfen.",
  },
  {
    q: "Ist Full-Service (Personal & Equipment) möglich?",
    a: "Ja, wir bieten Full-Service mit Personal, Geschirr, Besteck und Aufbau/Abbau. Details können bei der Anfrage besprochen werden.",
  },
  {
    q: "Bieten Sie vegetarisches / veganes Catering an?",
    a: "Ja, wir bieten umfangreiche vegetarische und vegane Optionen. Von Antipasti über Pasta bis Dessert – alles anpassbar. Teilen Sie uns Ihre Wünsche bei der Anfrage mit.",
  },
  {
    q: "Wie gehen Sie mit Allergien und Unverträglichkeiten um?",
    a: "Wir kennzeichnen alle Allergene gemäß EU-Verordnung und passen Gerichte auf Wunsch an (glutenfrei, laktosefrei etc.). Bitte informieren Sie uns spätestens 5 Tage vor dem Event.",
  },
  {
    q: "Stellen Sie auch Geschirr und Besteck?",
    a: "Ja, auf Wunsch liefern wir hochwertiges Geschirr, Besteck, Gläser, Servietten und Tischdecken. Die Kosten werden im Angebot transparent aufgeführt.",
  },
  {
    q: "Kann ich einzelne Gerichte auch ohne Paket bestellen?",
    a: "Ja, Sie können einzelne Komponenten frei zusammenstellen – z.B. nur Antipasti-Platten, nur Pizza oder nur Desserts. Wir erstellen Ihnen ein individuelles Angebot.",
  },
  {
    q: "Bieten Sie auch Getränke-Catering an?",
    a: "Ja, wir bieten Getränkepakete mit italienischen Weinen, Prosecco, Aperitivo, Softdrinks und Wasser. Auch eine Weinbegleitung zum Menü ist möglich.",
  },
  {
    q: "Was kosten Aufbau und Abbau?",
    a: "Bei Full-Service-Paketen (ab Premium) sind Aufbau und Abbau inklusive. Bei kleineren Bestellungen können Aufbau-Service und Personal separat gebucht werden.",
  },
  {
    q: "Welche Stornobedingungen gelten?",
    a: "Bis 30 Tage vorher: kostenlos · 14–30 Tage: 25 % · 7–14 Tage: 50 % · 2–7 Tage: 80 % · Unter 48 Std.: 100 % abzgl. ersparter Aufwendungen. Dem Kunden steht der Nachweis frei, dass ein geringerer Schaden entstanden ist (§ 309 Nr. 5b BGB). Vollständige AGB: events-storia.de/agb",
  },
];

const Catering = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": extendedFaqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a },
    })),
  };

  const processSteps = [
    { title: t.catering.step1Title, desc: t.catering.step1Desc },
    { title: t.catering.step2Title, desc: t.catering.step2Desc },
    { title: t.catering.step3Title, desc: t.catering.step3Desc },
    { title: t.catering.step4Title, desc: t.catering.step4Desc },
  ];

  return (
    <>
      <SEO
        title="Catering München | Italienisches Event-Catering ab 25€ – STORIA"
        description="Italienisches Catering in München: Pizza, Pasta, Antipasti-Buffets für Firmenfeiern, Hochzeiten & Events. Ab 25 € p.P. Lieferung München + 50 km. ☎ 089 51519696"
        canonical="/catering"
      />
      <StructuredData type="restaurant" includeReviews={false} />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Catering & Events', url: '/catering' }
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cateringServiceSchema) }}
      />

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <img
            src={sommerfestEvent}
            alt="STORIA Catering München – Italienisches Event-Catering"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="relative z-10 container mx-auto px-4 py-16 text-center">
            <Link to="/">
              <img
                src={storiaLogo}
                alt="STORIA Logo"
                loading="eager"
                className="h-20 md:h-28 w-auto mx-auto mb-6 brightness-0 invert"
              />
            </Link>
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-8 md:px-12 md:py-12 max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
                Catering München – Italienisches Event-Catering vom STORIA
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Authentische italienische Küche für Ihr Event – von Fingerfood bis Full-Service-Buffet
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">🍕 Pizza-Station</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">🍝 Pasta frisch</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">📍 München & 50 km</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">👥 20–200 Personen</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <a href="https://events-storia.de" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Catering anfragen
                  </a>
                </Button>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <a href="tel:+498951519696">
                    <Phone className="w-5 h-5 mr-2" />
                    089 51519696
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Navigation />

        <main id="main-content" className="flex-grow">
          <div className="container mx-auto px-4 py-8 max-w-5xl">
            <BreadcrumbNav crumbs={[{ label: 'Home', href: '/' }, { label: 'Catering & Events' }]} />
          </div>

          {/* Intro */}
          <section className="pb-12">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="bg-card border border-border rounded-2xl px-8 py-7 shadow-sm space-y-4 text-muted-foreground">
                <p>{t.pages.catering.intro}</p>
                {t.pages.catering.introP2 && <p>{t.pages.catering.introP2}</p>}
              </div>
            </div>
          </section>

          {/* Anlass Cards */}
          <section className="py-16 bg-secondary/20">
            <div className="container mx-auto px-4 max-w-5xl">
              <h2 className="text-3xl font-serif font-bold mb-4 text-center">Catering für jeden Anlass</h2>
              <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
                Von der kleinen Geburtstagsfeier bis zum großen Firmenevent – wir liefern frisches italienisches Catering für jeden Rahmen.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {anlassCards.map((card, i) => (
                  <Card key={i} className="border-border">
                    <CardHeader className="pb-2">
                      <div className="text-4xl mb-2">{card.icon}</div>
                      <CardTitle className="text-xl font-serif">{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">{card.desc}</p>
                      <ul className="text-sm space-y-1">
                        {card.items.map((item, j) => (
                          <li key={j} className="text-muted-foreground">✓ {item}</li>
                        ))}
                      </ul>
                      {card.note && <p className="text-xs text-primary mt-3">{card.note}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* 8 Gründe */}
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-5xl">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">8 Gründe für STORIA Catering</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {whyReasons.map((reason, i) => (
                  <div key={i} className="bg-secondary/50 rounded-lg p-6">
                    <div className="text-3xl mb-3">{reason.icon}</div>
                    <h3 className="font-semibold mb-2">{reason.title}</h3>
                    <p className="text-muted-foreground text-sm">{reason.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Packages */}
          <section className="py-16 bg-secondary/20">
            <div className="container mx-auto px-4 max-w-5xl">
              <h2 className="text-3xl font-serif font-bold mb-4 text-center">Unsere Catering-Pakete</h2>
              <p className="text-muted-foreground text-center mb-10">Alle Preise als Richtwerte – individuelles Angebot auf Anfrage</p>
              <div className="grid md:grid-cols-2 gap-6">
                {detailedPackages.map((pkg, i) => (
                  <Card key={i} className={`relative border-border ${pkg.badge ? 'border-primary/50 bg-primary/5' : ''}`}>
                    {pkg.badge && (
                      <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-mono uppercase tracking-wider">
                        {pkg.badge}
                      </span>
                    )}
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-serif">{pkg.title}</CardTitle>
                      <p className="text-primary font-bold">{pkg.price}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1 mb-4">
                        {pkg.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-muted-foreground italic">{pkg.ideal}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button size="lg" asChild>
                  <a href="https://events-storia.de" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Individuelles Angebot anfragen
                  </a>
                </Button>
              </div>
            </div>
          </section>

          {/* What we deliver – Grid */}
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-3xl font-serif font-bold mb-10 text-center">Was wir liefern</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
                {deliveryGrid.map((item, i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl p-5 text-center">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h3 className="font-semibold text-sm mb-2">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="py-16 bg-secondary/20">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl font-serif font-bold mb-8 text-center">{t.catering.processTitle}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {processSteps.map((step, i) => (
                  <div key={step.title} className="bg-card border border-border rounded-2xl p-6 flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Events Portal CTA */}
          <section className="py-12">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="bg-primary/10 border border-primary/30 rounded-2xl p-8 text-center">
                <h2 className="text-xl font-bold mb-3">{t.catering.eventsPortalTitle}</h2>
                <p className="text-muted-foreground mb-5">{t.catering.eventsPortalDesc}</p>
                <Button asChild>
                  <a href="https://events-storia.de" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t.catering.eventsPortalCta}
                  </a>
                </Button>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-16 bg-secondary/20">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">Das sagen unsere Kunden</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {testimonials.map((tm, i) => (
                  <Card key={i} className="border-border">
                    <CardContent className="pt-6">
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <p className="text-muted-foreground italic mb-4 text-sm">"{tm.quote}"</p>
                      <p className="text-sm font-medium">{tm.author}</p>
                      <p className="text-xs text-muted-foreground">{tm.details}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <GoogleReviews compact />
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.catering.faqTitle}</h2>
              <Accordion
                type="multiple"
                defaultValue={extendedFaqs.map((_, i) => `faq-${i}`)}
              >
                {extendedFaqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent forceMount className="text-base text-muted-foreground pb-5 leading-relaxed data-[state=closed]:hidden">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="py-12 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 max-w-2xl text-center">
              <h2 className="text-2xl font-serif font-bold mb-4">{t.catering.interested}</h2>
              <p className="opacity-90 mb-6">{t.catering.contactUs}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <a href="https://events-storia.de" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Catering anfragen
                  </a>
                </Button>
                <Button size="lg" className="bg-white/20 hover:bg-white/30 border border-white/30 text-white" asChild>
                  <a href="tel:+498951519696">
                    <Phone className="w-4 h-4 mr-2" />
                    089 51519696
                  </a>
                </Button>
              </div>
              <p className="mt-4 opacity-70 text-sm">
                Oder per E-Mail:{" "}
                <a href="mailto:info@ristorantestoria.de" className="underline hover:opacity-80">
                  info@ristorantestoria.de
                </a>
              </p>
            </div>
          </section>

          {/* Related Links */}
          <section className="py-16 bg-secondary/20">
            <div className="container mx-auto px-4 max-w-5xl">
              <h2 className="text-2xl font-serif font-bold mb-6 text-center">{t.catering.relatedTitle}</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <LocalizedLink to="firmenfeier-muenchen" className="bg-card border border-border rounded-xl p-5 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1 text-sm">{t.catering.relatedFirmenfeierTitle}</h3>
                  <p className="text-muted-foreground text-xs">{t.catering.relatedFirmenfeierDesc}</p>
                </LocalizedLink>
                <LocalizedLink to="eventlocation-muenchen-maxvorstadt" className="bg-card border border-border rounded-xl p-5 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1 text-sm">{t.catering.relatedEventlocationTitle}</h3>
                  <p className="text-muted-foreground text-xs">{t.catering.relatedEventlocationDesc}</p>
                </LocalizedLink>
                <LocalizedLink to="hochzeitsfeier-muenchen" className="bg-card border border-border rounded-xl p-5 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1 text-sm">{t.catering.relatedHochzeitsfeierTitle}</h3>
                  <p className="text-muted-foreground text-xs">{t.catering.relatedHochzeitsfeierDesc}</p>
                </LocalizedLink>
                <LocalizedLink to="geburtstagsfeier-muenchen" className="bg-card border border-border rounded-xl p-5 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1 text-sm">{t.catering.relatedGeburtstagsfeierTitle}</h3>
                  <p className="text-muted-foreground text-xs">{t.catering.relatedGeburtstagsfeierDesc}</p>
                </LocalizedLink>
                <LocalizedLink to="terrasse-muenchen" className="bg-card border border-border rounded-xl p-5 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1 text-sm">🌿 Terrasse München</h3>
                  <p className="text-muted-foreground text-xs">Catering mit eigener Außenterrasse kombinieren</p>
                </LocalizedLink>
                <LocalizedLink to="pizza-muenchen" className="bg-card border border-border rounded-xl p-5 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1 text-sm">🍕 Pizza München</h3>
                  <p className="text-muted-foreground text-xs">Neapolitanische Pizza – unser Catering-Highlight</p>
                </LocalizedLink>
                <LocalizedLink to="lunch-muenchen-maxvorstadt" className="bg-card border border-border rounded-xl p-5 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1 text-sm">🍱 Business Lunch</h3>
                  <p className="text-muted-foreground text-xs">Regelmäßiges Firmen-Catering & Mittagslunch</p>
                </LocalizedLink>
              </div>
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </>
  );
};

export default Catering;
