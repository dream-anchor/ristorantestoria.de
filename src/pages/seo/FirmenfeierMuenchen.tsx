import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import { Button } from "@/components/ui/button";
import storiaLogo from "@/assets/storia-logo.webp";
import hausAussenImage from "@/assets/haus-aussen-2.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FirmenfeierMuenchen = () => {
  const { language } = useLanguage();

  const faqItems = language === 'de' ? [
    {
      question: "Ab wie vielen Personen kann man eine Firmenfeier buchen?",
      answer: "Wir heißen Gruppen ab 10 Personen herzlich willkommen. Für kleinere Teams reservieren wir gerne einen großen Tisch, ab ca. 20 Personen können wir einen separaten Bereich einrichten. Das gesamte Restaurant steht ab ca. 40 Personen zur Exklusiv-Buchung zur Verfügung."
    },
    {
      question: "Gibt es vorgefertigte Menü-Vorschläge für Firmenfeiern?",
      answer: "Ja, wir haben mehrere bewährte Menü-Pakete für Firmenfeiern – vom Business-Lunch über das klassische 3-Gang-Menü bis zum festlichen Weihnachtsmenü. Alle Menüs können individuell angepasst werden. Gerne senden wir Ihnen unsere aktuellen Vorschläge zu."
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
      answer: "Yes, we have several proven menu packages for corporate events – from business lunch to classic 3-course menu to festive Christmas menu. All menus can be individually customized. We are happy to send you our current suggestions."
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
      answer: "For corporate events, we usually create a combined invoice in the company name. Separate invoices are possible for smaller groups. We can also invoice according to your specifications (e.g., food through the company, drinks privately)."
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
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-8 text-center">
            <Link to="/">
              <img src={storiaLogo} alt="STORIA – Restaurant für Firmenfeiern München" className="h-24 md:h-32 mx-auto mb-4 hover:opacity-80 transition-opacity cursor-pointer" />
            </Link>
            <p className="text-lg text-muted-foreground tracking-wide">
              RISTORANTE · PIZZERIA · BAR
            </p>
          </div>
        </div>
        <Navigation />
        
        <main className="container mx-auto px-4 py-12 flex-grow">
          <article className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-center">
              {language === 'de' ? 'Firmenfeier München – Team-Event im STORIA' : 'Corporate Event Munich – Team Event at STORIA'}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
              {language === 'de'
                ? 'Feiern Sie mit Ihrem Team im STORIA – dem italienischen Restaurant in der Münchner Maxvorstadt. Ob Weihnachtsfeier, Team-Building, After-Work oder Business-Dinner: Wir bieten den perfekten Rahmen für Ihre Firmenveranstaltung, nur 5 Minuten vom Hauptbahnhof entfernt.'
                : 'Celebrate with your team at STORIA – the Italian restaurant in Munich\'s Maxvorstadt. Whether Christmas party, team building, after-work or business dinner: We offer the perfect setting for your corporate event, just 5 minutes from the main station.'}
            </p>

            {/* Hero Image */}
            <div className="rounded-lg overflow-hidden mb-12">
              <img 
                src={hausAussenImage} 
                alt={language === 'de' ? 'Firmenfeier München – Restaurant STORIA Außenansicht Maxvorstadt' : 'Corporate event Munich – Restaurant STORIA exterior Maxvorstadt'}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>

            {/* Corporate Events mit italienischem Flair */}
            <section className="bg-card p-8 rounded-lg border border-border mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? 'Corporate Events mit italienischem Flair' : 'Corporate Events with Italian Flair'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === 'de'
                  ? 'Eine Firmenfeier soll Wertschätzung zeigen und das Team zusammenbringen. Im STORIA verbinden wir italienische Gastfreundschaft mit professionellem Service und schaffen so eine Atmosphäre, in der sich Ihre Mitarbeiter und Kunden wohlfühlen. Unsere zentrale Lage in der Maxvorstadt macht uns zum idealen Treffpunkt für Kollegen aus ganz München.'
                  : 'A corporate event should show appreciation and bring the team together. At STORIA, we combine Italian hospitality with professional service, creating an atmosphere where your employees and clients feel comfortable. Our central location in Maxvorstadt makes us the ideal meeting point for colleagues from all over Munich.'}
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
                    <li>✓ {language === 'de' ? 'Jubiläen & Erfolge feiern' : 'Anniversaries & celebrating success'}</li>
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
            </section>

            {/* Corporate-Pakete */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6 text-center">
                {language === 'de' ? 'Unsere Corporate-Pakete' : 'Our Corporate Packages'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-serif font-semibold text-lg mb-2">{language === 'de' ? 'Aperitivo-Paket' : 'Aperitivo Package'}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === 'de'
                      ? 'Welcome-Drink, Stuzzichini & italienische Snacks. Ideal für entspannte After-Work-Events und Empfänge.'
                      : 'Welcome drink, stuzzichini & Italian snacks. Ideal for relaxed after-work events and receptions.'}
                  </p>
                  <p className="text-xs text-muted-foreground italic">{language === 'de' ? 'Ab 10 Personen' : 'From 10 people'}</p>
                </div>
                <div className="bg-card p-6 rounded-lg border-2 border-primary">
                  <div className="text-xs text-primary font-semibold mb-2">{language === 'de' ? 'BELIEBT' : 'POPULAR'}</div>
                  <h3 className="font-serif font-semibold text-lg mb-2">{language === 'de' ? 'Business-Paket' : 'Business Package'}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === 'de'
                      ? '3-Gang-Menü mit Weinbegleitung oder Getränkepauschale. Der Klassiker für Team-Dinner und Kundeneinladungen.'
                      : '3-course menu with wine pairing or drink package. The classic for team dinners and client invitations.'}
                  </p>
                  <p className="text-xs text-muted-foreground italic">{language === 'de' ? 'Ab 15 Personen' : 'From 15 people'}</p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-serif font-semibold text-lg mb-2">{language === 'de' ? 'Premium-Paket' : 'Premium Package'}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === 'de'
                      ? '4-Gang-Menü + Aperitivo + Digestif + Premium-Weine. Das Rundum-Sorglos-Paket für besondere Anlässe.'
                      : '4-course menu + aperitivo + digestif + premium wines. The all-inclusive package for special occasions.'}
                  </p>
                  <p className="text-xs text-muted-foreground italic">{language === 'de' ? 'Ab 20 Personen' : 'From 20 people'}</p>
                </div>
              </div>
            </section>

            {/* Vorteile für Unternehmen */}
            <section className="bg-secondary/50 p-8 rounded-lg mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? 'Warum STORIA für Ihre Firmenfeier?' : 'Why STORIA for Your Corporate Event?'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{language === 'de' ? 'Zentrale Lage' : 'Central Location'}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === 'de'
                      ? 'Nur 5 Minuten vom Hauptbahnhof, direkt an der U-Bahn Königsplatz. Ideal erreichbar für Mitarbeiter aus ganz München – ob mit ÖPNV oder Auto (Parkhaus am Königsplatz).'
                      : 'Just 5 minutes from the main station, directly at Königsplatz metro. Easily accessible for employees from all over Munich – by public transport or car (parking garage at Königsplatz).'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{language === 'de' ? 'Flexible Räumlichkeiten' : 'Flexible Spaces'}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === 'de'
                      ? 'Von kleinen Team-Dinners (10-15 Personen) bis zur großen Abteilungsfeier (bis 60 Personen). Separierbare Bereiche und Exklusiv-Buchung möglich.'
                      : 'From small team dinners (10-15 people) to large department parties (up to 60 people). Separable areas and exclusive booking possible.'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{language === 'de' ? 'Individuelle Betreuung' : 'Personal Service'}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === 'de'
                      ? 'Persönliche Planung und Beratung für Ihr Event. Wir kümmern uns um Details wie Menükarten, Sitzordnung und Sonderwünsche.'
                      : 'Personal planning and consultation for your event. We take care of details like menu cards, seating arrangements and special requests.'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{language === 'de' ? 'Authentische Küche' : 'Authentic Cuisine'}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === 'de'
                      ? 'Hochwertige italienische Küche, die begeistert. Frische Zutaten, traditionelle Rezepte – ein kulinarisches Erlebnis für Ihr Team.'
                      : 'High-quality Italian cuisine that inspires. Fresh ingredients, traditional recipes – a culinary experience for your team.'}
                  </p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>{language === 'de' ? 'Gut zu wissen:' : 'Good to know:'}</strong> {language === 'de' ? 'In der Regel fällt keine Raummiete an, wenn ein Mindestbestellwert erreicht wird. Vegetarische und vegane Optionen sind selbstverständlich verfügbar. Barrierefreier Zugang gewährleistet.' : 'Usually no room rental fee when a minimum order value is reached. Vegetarian and vegan options are of course available. Wheelchair accessible.'}
                </p>
              </div>
            </section>

            {/* Weihnachtsfeiern */}
            <section className="bg-primary/5 p-8 rounded-lg mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? 'Weihnachtsfeiern im STORIA' : 'Christmas Parties at STORIA'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === 'de'
                  ? 'Die Weihnachtsfeier ist das Highlight des Jahres – der perfekte Zeitpunkt, um Danke zu sagen und gemeinsam zu feiern. Im STORIA schaffen wir eine festliche Atmosphäre mit italienischem Charme. Unsere speziellen Weihnachtsmenüs verbinden traditionelle italienische Küche mit festlichen Akzenten.'
                  : 'The Christmas party is the highlight of the year – the perfect time to say thank you and celebrate together. At STORIA, we create a festive atmosphere with Italian charm. Our special Christmas menus combine traditional Italian cuisine with festive accents.'}
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

            {/* CTA */}
            <section className="bg-card p-8 rounded-lg border border-border text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                {language === 'de' ? 'Jetzt Firmenfeier planen' : 'Plan Your Corporate Event Now'}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                {language === 'de'
                  ? 'Kontaktieren Sie uns für ein unverbindliches Angebot. Wir beraten Sie gerne persönlich und erstellen ein maßgeschneidertes Konzept für Ihre Veranstaltung.'
                  : 'Contact us for a non-binding offer. We are happy to advise you personally and create a customized concept for your event.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="tel:+498951519696">+49 89 51519696</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="mailto:info@ristorantestoria.de">{language === 'de' ? 'E-Mail senden' : 'Send Email'}</a>
                </Button>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-card p-8 rounded-lg border border-border mb-10">
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
            </section>

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
                <Link to="/besondere-anlaesse" className="text-sm text-primary hover:underline">
                  {language === 'de' ? 'Weihnachtsmenüs →' : 'Christmas Menus →'}
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/kontakt" className="text-sm text-primary hover:underline">
                  {language === 'de' ? 'Kontakt aufnehmen →' : 'Get in Touch →'}
                </Link>
              </div>
            </section>

            <ReservationCTA />
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FirmenfeierMuenchen;
