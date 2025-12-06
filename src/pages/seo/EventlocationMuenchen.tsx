import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import { Button } from "@/components/ui/button";
import storiaLogo from "@/assets/storia-logo.webp";
import menschenAussenImage from "@/assets/menschen-aussen.jpeg";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const EventlocationMuenchen = () => {
  const { language } = useLanguage();

  const faqItems = language === 'de' ? [
    {
      question: "Wie viele Personen passen ins STORIA?",
      answer: "Unser Restaurant bietet Platz für bis zu 60 Personen. Für kleinere Gruppen (10-25 Personen) können wir einen separaten Bereich reservieren. Bei größeren Gruppen ist auch eine exklusive Anmietung des gesamten Restaurants möglich."
    },
    {
      question: "Kann ich das Restaurant exklusiv mieten?",
      answer: "Ja, für Veranstaltungen ab ca. 40 Personen bieten wir die Möglichkeit einer Exklusiv-Buchung. Kontaktieren Sie uns für ein individuelles Angebot – wir planen Ihr Event ganz nach Ihren Wünschen."
    },
    {
      question: "Wie läuft die Planung eines Events ab?",
      answer: "Nach Ihrer ersten Anfrage vereinbaren wir gerne einen Besichtigungstermin. Wir besprechen Ihre Wünsche bezüglich Menü, Getränke, Dekoration und Ablauf. Anschließend erhalten Sie ein detailliertes Angebot. Wir empfehlen, größere Events 4-8 Wochen im Voraus zu planen."
    },
    {
      question: "Was kostet eine Veranstaltung im STORIA?",
      answer: "Die Kosten hängen von der Anzahl der Gäste, dem gewählten Menü und den zusätzlichen Services ab. Wir erstellen gerne ein individuelles Angebot. In der Regel fällt keine Raummiete an, wenn ein Mindestbestellwert erreicht wird."
    },
    {
      question: "Bieten Sie auch Catering außer Haus an?",
      answer: "Ja! Über unseren Partner events-storia.de bieten wir professionelles Catering für Veranstaltungen außerhalb unseres Restaurants an – von kleinen Empfängen bis zu großen Firmenfeiern."
    }
  ] : [
    {
      question: "How many people can STORIA accommodate?",
      answer: "Our restaurant can accommodate up to 60 people. For smaller groups (10-25 people), we can reserve a separate area. For larger groups, exclusive rental of the entire restaurant is also possible."
    },
    {
      question: "Can I rent the restaurant exclusively?",
      answer: "Yes, for events with approximately 40+ guests, we offer the possibility of exclusive booking. Contact us for a customized offer – we plan your event according to your wishes."
    },
    {
      question: "How does event planning work?",
      answer: "After your initial inquiry, we are happy to arrange a viewing appointment. We discuss your wishes regarding menu, drinks, decoration and schedule. You will then receive a detailed offer. We recommend planning larger events 4-8 weeks in advance."
    },
    {
      question: "How much does an event at STORIA cost?",
      answer: "Costs depend on the number of guests, the chosen menu and additional services. We are happy to create an individual offer. Usually, there is no room rental fee when a minimum order value is reached."
    },
    {
      question: "Do you also offer off-site catering?",
      answer: "Yes! Through our partner events-storia.de, we offer professional catering for events outside our restaurant – from small receptions to large corporate celebrations."
    }
  ];

  return (
    <>
      <SEO 
        title={language === 'de' ? 'Eventlocation München Maxvorstadt – Restaurant für Veranstaltungen' : 'Event Location Munich Maxvorstadt – Restaurant for Events'}
        description={language === 'de' 
          ? 'Eventlocation München im STORIA: Italienisches Restaurant in der Maxvorstadt für Feiern bis 60 Personen. Firmenevents, Hochzeiten & private Feiern nahe Königsplatz. Jetzt anfragen!'
          : 'Event location Munich at STORIA: Italian restaurant in Maxvorstadt for celebrations up to 60 people. Corporate events, weddings & private parties near Königsplatz. Inquire now!'}
        canonical="/eventlocation-muenchen-maxvorstadt"
      />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: language === 'de' ? 'Eventlocation München' : 'Event Location Munich', url: '/eventlocation-muenchen-maxvorstadt' }
        ]} 
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-8 text-center">
            <Link to="/">
              <img src={storiaLogo} alt="STORIA – Eventlocation München Maxvorstadt" className="h-24 md:h-32 mx-auto mb-4 hover:opacity-80 transition-opacity cursor-pointer" />
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
              {language === 'de' ? 'Eventlocation München Maxvorstadt – Ihr Restaurant für Events' : 'Event Location Munich Maxvorstadt – Your Restaurant for Events'}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
              {language === 'de'
                ? 'Das STORIA bietet den idealen Rahmen für Ihre Veranstaltung in München. Stilvolles italienisches Ambiente, exzellente Küche und professioneller Service – zentral in der Maxvorstadt, nur wenige Gehminuten vom Königsplatz und Hauptbahnhof entfernt.'
                : 'STORIA offers the ideal setting for your event in Munich. Stylish Italian ambiance, excellent cuisine and professional service – central in Maxvorstadt, just a few minutes walk from Königsplatz and the main station.'}
            </p>

            {/* Hero Image */}
            <div className="rounded-lg overflow-hidden mb-12">
              <img 
                src={menschenAussenImage} 
                alt={language === 'de' ? 'Eventlocation STORIA – Terrasse für Ihre Feier in München Maxvorstadt' : 'Event location STORIA – Terrace for your celebration in Munich Maxvorstadt'}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>

            {/* Ihr Event im Herzen Münchens */}
            <section className="bg-card p-8 rounded-lg border border-border mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? 'Ihr Event im Herzen Münchens' : 'Your Event in the Heart of Munich'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === 'de'
                  ? 'Seit Jahren ist das STORIA eine der beliebtesten Eventlocations in der Münchner Maxvorstadt. Unser Restaurant verbindet authentisches italienisches Flair mit moderner Ausstattung und bietet damit den perfekten Rahmen für Veranstaltungen aller Art – von der intimen Feier bis zum großen Firmenevent.'
                  : 'For years, STORIA has been one of the most popular event locations in Munich\'s Maxvorstadt. Our restaurant combines authentic Italian flair with modern facilities, providing the perfect setting for events of all kinds – from intimate celebrations to large corporate events.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">{language === 'de' ? 'Unsere Räumlichkeiten' : 'Our Facilities'}</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>✓ {language === 'de' ? 'Platz für bis zu 60 Personen' : 'Space for up to 60 people'}</li>
                    <li>✓ {language === 'de' ? 'Separierbare Bereiche möglich' : 'Separable areas possible'}</li>
                    <li>✓ {language === 'de' ? 'Sonnige Terrasse (saisonal)' : 'Sunny terrace (seasonal)'}</li>
                    <li>✓ {language === 'de' ? 'Klimatisierte Innenräume' : 'Air-conditioned interior'}</li>
                    <li>✓ {language === 'de' ? 'Barrierefreier Zugang' : 'Wheelchair accessible'}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">{language === 'de' ? 'Unser Service' : 'Our Service'}</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>✓ {language === 'de' ? 'Individuelle Menügestaltung' : 'Individual menu design'}</li>
                    <li>✓ {language === 'de' ? 'Erfahrenes Service-Team' : 'Experienced service team'}</li>
                    <li>✓ {language === 'de' ? 'Persönliche Eventplanung' : 'Personal event planning'}</li>
                    <li>✓ {language === 'de' ? 'Getränkepauschalen möglich' : 'Drink packages available'}</li>
                    <li>✓ {language === 'de' ? 'Dekoration nach Absprache' : 'Decoration by arrangement'}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Event-Arten */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6 text-center">
                {language === 'de' ? 'Ideal für Ihre Veranstaltung' : 'Ideal for Your Event'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-serif font-semibold text-lg mb-3">{language === 'de' ? 'Firmenfeiern' : 'Corporate Events'}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {language === 'de'
                      ? 'Weihnachtsfeiern, Team-Events, After-Work, Business-Dinner und Kundeneinladungen in stilvollem Ambiente.'
                      : 'Christmas parties, team events, after-work, business dinners and client invitations in stylish ambiance.'}
                  </p>
                  <Link to="/firmenfeier-muenchen" className="text-sm text-primary hover:underline">
                    {language === 'de' ? 'Mehr erfahren →' : 'Learn more →'}
                  </Link>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-serif font-semibold text-lg mb-3">{language === 'de' ? 'Private Feiern' : 'Private Celebrations'}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {language === 'de'
                      ? 'Geburtstage, Jubiläen, Taufen, Kommunion/Konfirmation und Familienfeiern mit persönlicher Note.'
                      : 'Birthdays, anniversaries, baptisms, communion/confirmation and family celebrations with a personal touch.'}
                  </p>
                  <Link to="/geburtstagsfeier-muenchen" className="text-sm text-primary hover:underline">
                    {language === 'de' ? 'Mehr erfahren →' : 'Learn more →'}
                  </Link>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-serif font-semibold text-lg mb-3">{language === 'de' ? 'Hochzeiten' : 'Weddings'}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {language === 'de'
                      ? 'Hochzeitsfeiern und Hochzeitsessen in romantischer Atmosphäre. Perfekt für Feiern bis 60 Gäste.'
                      : 'Wedding celebrations and wedding dinners in romantic atmosphere. Perfect for celebrations up to 60 guests.'}
                  </p>
                  <Link to="/kontakt" className="text-sm text-primary hover:underline">
                    {language === 'de' ? 'Anfrage senden →' : 'Send inquiry →'}
                  </Link>
                </div>
              </div>
            </section>

            {/* Catering & Menü */}
            <section className="bg-secondary/50 p-8 rounded-lg mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? 'Catering & Menü-Optionen' : 'Catering & Menu Options'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === 'de'
                  ? 'Unsere Küche stellt für Ihre Veranstaltung individuelle Menüs zusammen – von der klassischen italienischen Küche bis zu Flying Buffets. Alle Speisen werden frisch zubereitet und können an Ihre Wünsche angepasst werden.'
                  : 'Our kitchen creates individual menus for your event – from classic Italian cuisine to flying buffets. All dishes are freshly prepared and can be adapted to your wishes.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-background p-6 rounded-lg">
                  <h3 className="font-serif font-semibold mb-3">{language === 'de' ? 'Menü-Varianten' : 'Menu Variants'}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• {language === 'de' ? '3- bis 5-Gang-Menüs' : '3- to 5-course menus'}</li>
                    <li>• {language === 'de' ? 'Flying Buffet / Fingerfood' : 'Flying buffet / finger food'}</li>
                    <li>• {language === 'de' ? 'Pizza-Party-Buffet' : 'Pizza party buffet'}</li>
                    <li>• {language === 'de' ? 'Italienisches Antipasti-Buffet' : 'Italian antipasti buffet'}</li>
                    <li>• {language === 'de' ? 'BBQ auf der Terrasse (saisonal)' : 'BBQ on the terrace (seasonal)'}</li>
                  </ul>
                </div>
                <div className="bg-background p-6 rounded-lg">
                  <h3 className="font-serif font-semibold mb-3">{language === 'de' ? 'Besondere Anforderungen' : 'Special Requirements'}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• {language === 'de' ? 'Vegetarische & vegane Menüs' : 'Vegetarian & vegan menus'}</li>
                    <li>• {language === 'de' ? 'Glutenfreie Optionen' : 'Gluten-free options'}</li>
                    <li>• {language === 'de' ? 'Kindermenüs' : 'Children\'s menus'}</li>
                    <li>• {language === 'de' ? 'Allergiker-freundlich' : 'Allergy-friendly'}</li>
                    <li>• {language === 'de' ? 'Individuelle Wünsche' : 'Individual requests'}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Lage & Erreichbarkeit */}
            <section className="bg-card p-8 rounded-lg border border-border mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? 'Lage & Erreichbarkeit' : 'Location & Accessibility'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === 'de'
                  ? 'Das STORIA liegt zentral in der Münchner Maxvorstadt – perfekt erreichbar für Gäste aus ganz München und darüber hinaus. Die optimale Anbindung an öffentliche Verkehrsmittel und ausreichend Parkmöglichkeiten in der Nähe machen die Anreise für Ihre Gäste unkompliziert.'
                  : 'STORIA is centrally located in Munich\'s Maxvorstadt – perfectly accessible for guests from all over Munich and beyond. The optimal connection to public transport and sufficient parking options nearby make arrival easy for your guests.'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-xl font-serif font-bold text-primary">3 Min.</p>
                  <p className="text-xs text-muted-foreground">U2/U8 Königsplatz</p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-xl font-serif font-bold text-primary">5 Min.</p>
                  <p className="text-xs text-muted-foreground">{language === 'de' ? 'Hauptbahnhof' : 'Main Station'}</p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-xl font-serif font-bold text-primary">15 Min.</p>
                  <p className="text-xs text-muted-foreground">{language === 'de' ? 'Autobahn A9/A96' : 'Highway A9/A96'}</p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-xl font-serif font-bold text-primary">40 Min.</p>
                  <p className="text-xs text-muted-foreground">{language === 'de' ? 'Flughafen (S-Bahn)' : 'Airport (S-Bahn)'}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>{language === 'de' ? 'Adresse:' : 'Address:'}</strong> Karlstraße 47a, 80333 München | <strong>{language === 'de' ? 'Parken:' : 'Parking:'}</strong> {language === 'de' ? 'Parkhaus am Königsplatz (5 Min. Fußweg)' : 'Parking garage at Königsplatz (5 min walk)'}
              </p>
            </section>

            {/* CTA */}
            <section className="bg-primary/5 p-8 rounded-lg text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                {language === 'de' ? 'Jetzt Ihr Event anfragen' : 'Inquire About Your Event Now'}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                {language === 'de'
                  ? 'Kontaktieren Sie uns für ein individuelles Angebot. Wir beraten Sie gerne persönlich und zeigen Ihnen unsere Räumlichkeiten bei einem Besichtigungstermin.'
                  : 'Contact us for a customized offer. We are happy to advise you personally and show you our facilities during a viewing appointment.'}
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
                {language === 'de' ? 'Häufige Fragen zur Eventlocation' : 'Frequently Asked Questions'}
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
                <Link to="/firmenfeier-muenchen" className="text-sm text-primary hover:underline">
                  {language === 'de' ? 'Firmenfeiern →' : 'Corporate Events →'}
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/geburtstagsfeier-muenchen" className="text-sm text-primary hover:underline">
                  {language === 'de' ? 'Geburtstagsfeiern →' : 'Birthday Parties →'}
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/besondere-anlaesse" className="text-sm text-primary hover:underline">
                  {language === 'de' ? 'Aktuelle Festmenüs →' : 'Current festive menus →'}
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

export default EventlocationMuenchen;
