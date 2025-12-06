import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Building, Receipt, CalendarCheck, MapPin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// New SEO components
import ParallaxHero from "@/components/seo/ParallaxHero";
import USPTeaser, { USPItem } from "@/components/seo/USPTeaser";
import FoodGallery from "@/components/seo/FoodGallery";
import LocalSEOBlock from "@/components/seo/LocalSEOBlock";
import SocialProof from "@/components/seo/SocialProof";
import CTAIntermediate from "@/components/seo/CTAIntermediate";

// Images
import hausAussenImage from "@/assets/haus-aussen-2.webp";
import menschenAussenImage from "@/assets/menschen-aussen.jpeg";
import weinserviceImage from "@/assets/weinservice.webp";
import pastaImage from "@/assets/pasta.jpg";

const FirmenfeierMuenchen = () => {
  const { language } = useLanguage();

  const uspItems: USPItem[] = [
    {
      icon: Building,
      title: language === 'de' ? 'Corporate-Pakete' : 'Corporate Packages',
      description: language === 'de' ? 'Aperitivo, Business, Premium' : 'Aperitivo, Business, Premium',
    },
    {
      icon: Receipt,
      title: language === 'de' ? 'Firmenrechnung' : 'Company Invoice',
      description: language === 'de' ? 'Unkomplizierte Abrechnung' : 'Easy invoicing',
    },
    {
      icon: CalendarCheck,
      title: language === 'de' ? 'Schnelle Bestätigung' : 'Quick Confirmation',
      description: language === 'de' ? 'Kurzfristig buchbar' : 'Short-notice booking',
    },
    {
      icon: MapPin,
      title: language === 'de' ? 'Zentral für alle' : 'Central for All',
      description: language === 'de' ? 'Ideal erreichbar für Teams' : 'Easily accessible for teams',
    },
  ];

  const galleryImages = [
    { src: hausAussenImage, alt: language === 'de' ? 'STORIA Außenansicht' : 'STORIA exterior' },
    { src: menschenAussenImage, alt: language === 'de' ? 'Team-Event auf der Terrasse' : 'Team event on terrace' },
    { src: weinserviceImage, alt: language === 'de' ? 'Weinservice bei Firmenfeier' : 'Wine service at corporate event' },
    { src: pastaImage, alt: language === 'de' ? 'Business-Dinner Menü' : 'Business dinner menu' },
  ];

  const testimonials = [
    {
      quote: language === 'de' 
        ? "Perfekt für unsere Weihnachtsfeier! Alles war bestens organisiert."
        : "Perfect for our Christmas party! Everything was perfectly organized.",
      author: "BMW Group",
    },
    {
      quote: language === 'de'
        ? "Unkompliziert, professionell, exzellentes Essen. Unser Team war begeistert!"
        : "Straightforward, professional, excellent food. Our team was delighted!",
      author: "Allianz SE",
    },
    {
      quote: language === 'de'
        ? "Seit 3 Jahren unser Stammlokal für Team-Events. Immer wieder gerne!"
        : "Our regular venue for team events for 3 years. Always happy to return!",
      author: "McKinsey & Company",
    },
  ];

  const faqItems = language === 'de' ? [
    {
      question: "Ab wie vielen Personen kann man eine Firmenfeier buchen?",
      answer: "Wir heißen Gruppen ab 10 Personen herzlich willkommen. Für kleinere Teams reservieren wir gerne einen großen Tisch, ab ca. 20 Personen können wir einen separaten Bereich einrichten. Das gesamte Restaurant steht ab ca. 40 Personen zur Exklusiv-Buchung zur Verfügung."
    },
    {
      question: "Gibt es vorgefertigte Menü-Vorschläge für Firmenfeiern?",
      answer: "Ja, wir haben mehrere bewährte Menü-Pakete für Firmenfeiern – vom Business-Lunch über das klassische 3-Gang-Menü bis zum festlichen Weihnachtsmenü. Alle Menüs können individuell angepasst werden."
    },
    {
      question: "Kann man das Restaurant exklusiv für eine Firmenfeier buchen?",
      answer: "Ja, ab ca. 40 Gästen bieten wir die Möglichkeit einer Exklusiv-Buchung. Sie haben dann das gesamte Restaurant für sich – ideal für vertrauliche Events, Incentives oder besondere Firmenfeiern."
    },
    {
      question: "Wie früh sollte man für Weihnachtsfeiern buchen?",
      answer: "Für Weihnachtsfeiern empfehlen wir eine Buchung mindestens 6-8 Wochen im Voraus, idealerweise bereits im September/Oktober. Die Wochen vor Weihnachten sind sehr beliebt und schnell ausgebucht."
    },
    {
      question: "Bieten Sie getrennte Rechnungen oder Sammelrechnung?",
      answer: "Für Firmenfeiern erstellen wir standardmäßig eine Sammelrechnung auf den Firmennamen. Getrennte Rechnungen sind bei kleineren Gruppen möglich. Wir können auch nach Vorgabe abrechnen (z.B. Essen über die Firma, Getränke privat)."
    }
  ] : [
    {
      question: "What is the minimum group size for a corporate event?",
      answer: "We welcome groups from 10 people. For smaller teams, we are happy to reserve a large table, from about 20 people we can set up a separate area. The entire restaurant is available for exclusive booking from about 40 people."
    },
    {
      question: "Are there pre-made menu suggestions for corporate events?",
      answer: "Yes, we have several proven menu packages for corporate events – from business lunch to classic 3-course menu to festive Christmas menu. All menus can be individually customized."
    },
    {
      question: "Can you book the restaurant exclusively for a corporate event?",
      answer: "Yes, from about 40 guests we offer the possibility of exclusive booking. You then have the entire restaurant to yourself – ideal for confidential events, incentives or special corporate celebrations."
    },
    {
      question: "How early should you book for Christmas parties?",
      answer: "For Christmas parties, we recommend booking at least 6-8 weeks in advance, ideally in September/October. The weeks before Christmas are very popular and fill up quickly."
    },
    {
      question: "Do you offer separate or combined invoices?",
      answer: "For corporate events, we usually create a combined invoice in the company name. Separate invoices are possible for smaller groups. We can also invoice according to your specifications."
    }
  ];

  return (
    <>
      <SEO 
        title={language === 'de' ? 'Firmenfeier München – Team-Event & Weihnachtsfeier im Italiener' : 'Corporate Event Munich – Team Event & Christmas Party at Italian Restaurant'}
        description={language === 'de' 
          ? 'Firmenfeier München im STORIA: Team-Events, Weihnachtsfeiern & Business-Dinner in der Maxvorstadt. Italienisches Restaurant nahe Hauptbahnhof für 10-60 Personen. Jetzt anfragen!'
          : 'Corporate event Munich at STORIA: Team events, Christmas parties & business dinners in Maxvorstadt. Italian restaurant near main station for 10-60 people. Inquire now!'}
        canonical="/firmenfeier-muenchen"
      />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: language === 'de' ? 'Firmenfeier München' : 'Corporate Event Munich', url: '/firmenfeier-muenchen' }
        ]} 
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <Navigation />
        
        {/* 1. Parallax Hero */}
        <ParallaxHero
          image={hausAussenImage}
          headline={language === 'de' ? 'Firmenfeier München' : 'Corporate Event Munich'}
          subheadline={language === 'de' 
            ? 'Weihnachtsfeier, Kick-Off, After-Work – stilvoll & unkompliziert'
            : 'Christmas party, kick-off, after-work – stylish & easy'}
          primaryCTA={{ text: language === 'de' ? 'Event anfragen' : 'Inquire About Event', href: '/kontakt' }}
          secondaryCTA={{ text: language === 'de' ? 'Anrufen' : 'Call', href: 'tel:+498951519696' }}
        />

        {/* 2. USP Teaser */}
        <USPTeaser items={uspItems} />
        
        <main className="flex-grow">
          {/* 3. Main Content */}
          <section className="container mx-auto px-4 py-12">
            <article className="max-w-4xl mx-auto">
              {/* Corporate Events Section */}
              <div className="bg-card p-8 rounded-lg border border-border mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                  {language === 'de' ? 'Corporate Events mit italienischem Flair' : 'Corporate Events with Italian Flair'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {language === 'de'
                    ? 'Eine Firmenfeier soll Wertschätzung zeigen und das Team zusammenbringen. Im STORIA verbinden wir italienische Gastfreundschaft mit professionellem Service und schaffen so eine Atmosphäre, in der sich Ihre Mitarbeiter und Kunden wohlfühlen.'
                    : 'A corporate event should show appreciation and bring the team together. At STORIA, we combine Italian hospitality with professional service, creating an atmosphere where your employees and clients feel comfortable.'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">{language === 'de' ? 'Unsere Firmen-Angebote' : 'Our Corporate Offerings'}</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>✓ {language === 'de' ? 'Weihnachtsfeiern mit Festmenüs' : 'Christmas parties with festive menus'}</li>
                      <li>✓ {language === 'de' ? 'Team-Events & Team-Building' : 'Team events & team building'}</li>
                      <li>✓ {language === 'de' ? 'After-Work-Events' : 'After-work events'}</li>
                      <li>✓ {language === 'de' ? 'Business-Dinner & Meetings' : 'Business dinners & meetings'}</li>
                      <li>✓ {language === 'de' ? 'Kundeneinladungen' : 'Client invitations'}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">{language === 'de' ? 'Sommerfeste auf der Terrasse' : 'Summer Parties on the Terrace'}</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>✓ {language === 'de' ? 'Sonnige Außenterrasse' : 'Sunny outdoor terrace'}</li>
                      <li>✓ {language === 'de' ? 'Aperitivo im Freien' : 'Aperitivo outdoors'}</li>
                      <li>✓ {language === 'de' ? 'BBQ-Optionen (saisonal)' : 'BBQ options (seasonal)'}</li>
                      <li>✓ {language === 'de' ? 'Entspannte Atmosphäre' : 'Relaxed atmosphere'}</li>
                      <li>✓ {language === 'de' ? 'Perfekt für warme Abende' : 'Perfect for warm evenings'}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Corporate Packages */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6 text-center">
                  {language === 'de' ? 'Unsere Corporate-Pakete' : 'Our Corporate Packages'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="font-serif font-semibold text-lg mb-2">{language === 'de' ? 'Aperitivo-Paket' : 'Aperitivo Package'}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === 'de'
                        ? 'Welcome-Drink, Stuzzichini & italienische Snacks. Ideal für After-Work-Events.'
                        : 'Welcome drink, stuzzichini & Italian snacks. Ideal for after-work events.'}
                    </p>
                    <p className="text-xs text-muted-foreground italic">{language === 'de' ? 'Ab 10 Personen' : 'From 10 people'}</p>
                  </div>
                  <div className="bg-card p-6 rounded-lg border-2 border-primary">
                    <div className="text-xs text-primary font-semibold mb-2">{language === 'de' ? 'BELIEBT' : 'POPULAR'}</div>
                    <h3 className="font-serif font-semibold text-lg mb-2">{language === 'de' ? 'Business-Paket' : 'Business Package'}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === 'de'
                        ? '3-Gang-Menü mit Weinbegleitung. Der Klassiker für Team-Dinner.'
                        : '3-course menu with wine pairing. The classic for team dinners.'}
                    </p>
                    <p className="text-xs text-muted-foreground italic">{language === 'de' ? 'Ab 15 Personen' : 'From 15 people'}</p>
                  </div>
                  <div className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="font-serif font-semibold text-lg mb-2">{language === 'de' ? 'Premium-Paket' : 'Premium Package'}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === 'de'
                        ? '4-Gang-Menü + Aperitivo + Digestif. Das Rundum-Sorglos-Paket.'
                        : '4-course menu + aperitivo + digestif. The all-inclusive package.'}
                    </p>
                    <p className="text-xs text-muted-foreground italic">{language === 'de' ? 'Ab 20 Personen' : 'From 20 people'}</p>
                  </div>
                </div>
              </section>

              {/* Christmas Section */}
              <section className="bg-primary/5 p-8 rounded-lg mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                  {language === 'de' ? 'Weihnachtsfeiern im STORIA' : 'Christmas Parties at STORIA'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {language === 'de'
                    ? 'Die Weihnachtsfeier ist das Highlight des Jahres – der perfekte Zeitpunkt, um Danke zu sagen und gemeinsam zu feiern. Im STORIA schaffen wir eine festliche Atmosphäre mit italienischem Charme.'
                    : 'The Christmas party is the highlight of the year – the perfect time to say thank you and celebrate together. At STORIA, we create a festive atmosphere with Italian charm.'}
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button asChild>
                    <Link to="/besondere-anlaesse">{language === 'de' ? 'Aktuelle Weihnachtsmenüs' : 'Current Christmas Menus'}</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="tel:+498951519696">{language === 'de' ? 'Jetzt anfragen' : 'Inquire Now'}</a>
                  </Button>
                </div>
              </section>
            </article>
          </section>

          {/* 4. CTA Intermediate */}
          <CTAIntermediate 
            headline={language === 'de' ? 'Planen Sie Ihre Firmenfeier' : 'Plan Your Corporate Event'}
            text={language === 'de' 
              ? 'Kontaktieren Sie uns für ein individuelles Angebot – wir beraten Sie gerne persönlich.'
              : 'Contact us for a personalized offer – we are happy to advise you personally.'}
            primaryCTA={{ text: language === 'de' ? 'Jetzt anfragen' : 'Inquire Now', href: '/kontakt' }}
            secondaryCTA={{ text: language === 'de' ? 'Anrufen' : 'Call', href: 'tel:+498951519696' }}
          />

          {/* 5. Food Gallery */}
          <FoodGallery images={galleryImages} />

          {/* 6. Local SEO Block */}
          <LocalSEOBlock
            title={language === 'de' ? 'Zentral für Ihr Team' : 'Central for Your Team'}
            description={language === 'de'
              ? 'Das STORIA liegt nur 5 Minuten vom Hauptbahnhof, direkt an der U-Bahn Königsplatz. Ideal erreichbar für Mitarbeiter aus ganz München – ob mit ÖPNV oder Auto (Parkhaus am Königsplatz). Die perfekte Location für Ihre nächste Firmenfeier.'
              : 'STORIA is just 5 minutes from the main station, directly at Königsplatz metro. Easily accessible for employees from all over Munich – by public transport or car (parking garage at Königsplatz). The perfect location for your next corporate event.'}
          />

          {/* 7. Social Proof */}
          <SocialProof testimonials={testimonials} />

          {/* 8. FAQ Section */}
          <section className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card p-8 rounded-lg border border-border mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                  {language === 'de' ? 'Häufige Fragen zu Firmenfeiern' : 'Frequently Asked Questions'}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Cross Links */}
              <section className="text-center mb-10">
                <h3 className="font-serif text-lg mb-4 text-muted-foreground">
                  {language === 'de' ? 'Entdecken Sie mehr' : 'Discover More'}
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link to="/eventlocation-muenchen-maxvorstadt" className="text-sm text-primary hover:underline">
                    {language === 'de' ? 'Eventlocation →' : 'Event Location →'}
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link to="/geburtstagsfeier-muenchen" className="text-sm text-primary hover:underline">
                    {language === 'de' ? 'Geburtstagsfeiern →' : 'Birthday Parties →'}
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link to="/speisekarte" className="text-sm text-primary hover:underline">
                    {language === 'de' ? 'Speisekarte →' : 'Menu →'}
                  </Link>
                </div>
              </section>

              <ReservationCTA />
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FirmenfeierMuenchen;