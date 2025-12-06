import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, ChefHat, MapPin, Headphones } from "lucide-react";
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
import menschenAussenImage from "@/assets/menschen-aussen.jpeg";
import hausAussenImage from "@/assets/haus-aussen-2.webp";
import weinserviceImage from "@/assets/weinservice.webp";
import pastaImage from "@/assets/pasta.jpg";

const EventlocationMuenchen = () => {
  const { language } = useLanguage();

  const uspItems: USPItem[] = [
    {
      icon: Users,
      title: language === 'de' ? 'Bis 60 Personen' : 'Up to 60 People',
      description: language === 'de' ? 'Flexible Raumgestaltung' : 'Flexible room design',
    },
    {
      icon: ChefHat,
      title: language === 'de' ? 'Individuelle Menüs' : 'Custom Menus',
      description: language === 'de' ? 'Buffet oder Menü nach Wahl' : 'Buffet or menu of choice',
    },
    {
      icon: MapPin,
      title: language === 'de' ? 'Zentrale Lage' : 'Central Location',
      description: language === 'de' ? 'Maxvorstadt, nahe ÖPNV' : 'Maxvorstadt, near transit',
    },
    {
      icon: Headphones,
      title: language === 'de' ? 'Full-Service' : 'Full Service',
      description: language === 'de' ? 'Komplettbetreuung vor Ort' : 'Complete on-site support',
    },
  ];

  const galleryImages = [
    { src: menschenAussenImage, alt: language === 'de' ? 'Event auf der Terrasse' : 'Event on terrace' },
    { src: hausAussenImage, alt: language === 'de' ? 'STORIA Außenansicht' : 'STORIA exterior' },
    { src: weinserviceImage, alt: language === 'de' ? 'Weinservice bei Events' : 'Wine service at events' },
    { src: pastaImage, alt: language === 'de' ? 'Catering-Küche' : 'Catering kitchen' },
  ];

  const testimonials = [
    {
      quote: language === 'de' 
        ? "Unsere Firmenweihnachtsfeier war ein voller Erfolg! Perfekte Organisation."
        : "Our company Christmas party was a complete success! Perfect organization.",
      author: "Siemens AG",
    },
    {
      quote: language === 'de'
        ? "Die beste Eventlocation in der Maxvorstadt. Wir kommen jedes Jahr wieder!"
        : "The best event location in Maxvorstadt. We come back every year!",
      author: "Rechtsanwälte Müller & Partner",
    },
    {
      quote: language === 'de'
        ? "Hochzeitsfeier mit 50 Gästen – alles war perfekt, vom Aperitivo bis zum Dessert."
        : "Wedding celebration with 50 guests – everything was perfect, from aperitivo to dessert.",
      author: "Familie Schneider",
    },
  ];

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
        <Navigation />
        
        {/* 1. Parallax Hero */}
        <ParallaxHero
          image={menschenAussenImage}
          headline={language === 'de' ? 'Eventlocation München' : 'Event Location Munich'}
          subheadline={language === 'de' 
            ? 'Bis 60 Personen – italienisches Flair für unvergessliche Feiern'
            : 'Up to 60 people – Italian flair for unforgettable celebrations'}
          primaryCTA={{ text: language === 'de' ? 'Event anfragen' : 'Inquire About Event', href: '/kontakt' }}
          secondaryCTA={{ text: language === 'de' ? 'Anrufen' : 'Call', href: 'tel:+498951519696' }}
        />

        {/* 2. USP Teaser */}
        <USPTeaser items={uspItems} />
        
        <main className="flex-grow">
          {/* 3. Main Content */}
          <section className="container mx-auto px-4 py-12">
            <article className="max-w-4xl mx-auto">
              {/* Event Section */}
              <div className="bg-card p-8 rounded-lg border border-border mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                  {language === 'de' ? 'Ihr Event im Herzen Münchens' : 'Your Event in the Heart of Munich'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {language === 'de'
                    ? 'Seit Jahren ist das STORIA eine der beliebtesten Eventlocations in der Münchner Maxvorstadt. Unser Restaurant verbindet authentisches italienisches Flair mit moderner Ausstattung und bietet damit den perfekten Rahmen für Veranstaltungen aller Art.'
                    : 'For years, STORIA has been one of the most popular event locations in Munich\'s Maxvorstadt. Our restaurant combines authentic Italian flair with modern facilities, providing the perfect setting for events of all kinds.'}
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
              </div>

              {/* Event Types */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6 text-center">
                  {language === 'de' ? 'Ideal für Ihre Veranstaltung' : 'Ideal for Your Event'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="font-serif font-semibold text-lg mb-3">{language === 'de' ? 'Firmenfeiern' : 'Corporate Events'}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {language === 'de'
                        ? 'Weihnachtsfeiern, Team-Events, After-Work, Business-Dinner und Kundeneinladungen.'
                        : 'Christmas parties, team events, after-work, business dinners and client invitations.'}
                    </p>
                    <Link to="/firmenfeier-muenchen" className="text-sm text-primary hover:underline">
                      {language === 'de' ? 'Mehr erfahren →' : 'Learn more →'}
                    </Link>
                  </div>
                  <div className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="font-serif font-semibold text-lg mb-3">{language === 'de' ? 'Private Feiern' : 'Private Celebrations'}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {language === 'de'
                        ? 'Geburtstage, Jubiläen, Taufen und Familienfeiern mit persönlicher Note.'
                        : 'Birthdays, anniversaries, baptisms and family celebrations with a personal touch.'}
                    </p>
                    <Link to="/geburtstagsfeier-muenchen" className="text-sm text-primary hover:underline">
                      {language === 'de' ? 'Mehr erfahren →' : 'Learn more →'}
                    </Link>
                  </div>
                  <div className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="font-serif font-semibold text-lg mb-3">{language === 'de' ? 'Hochzeiten' : 'Weddings'}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {language === 'de'
                        ? 'Hochzeitsfeiern in romantischer Atmosphäre. Perfekt für Feiern bis 60 Gäste.'
                        : 'Wedding celebrations in romantic atmosphere. Perfect for up to 60 guests.'}
                    </p>
                    <Link to="/kontakt" className="text-sm text-primary hover:underline">
                      {language === 'de' ? 'Anfrage senden →' : 'Send inquiry →'}
                    </Link>
                  </div>
                </div>
              </section>

              {/* CTA Section */}
              <section className="bg-primary/5 p-8 rounded-lg text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                  {language === 'de' ? 'Jetzt Ihr Event anfragen' : 'Inquire About Your Event Now'}
                </h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  {language === 'de'
                    ? 'Kontaktieren Sie uns für ein individuelles Angebot. Wir beraten Sie gerne persönlich.'
                    : 'Contact us for a personalized offer. We are happy to advise you personally.'}
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" asChild>
                    <a href="tel:+498951519696">+49 89 51519696</a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="mailto:info@ristorantestoria.de">{language === 'de' ? 'E-Mail senden' : 'Send Email'}</a>
                  </Button>
                </div>
              </section>
            </article>
          </section>

          {/* 4. CTA Intermediate */}
          <CTAIntermediate 
            headline={language === 'de' ? 'Ihr Event im STORIA' : 'Your Event at STORIA'}
            text={language === 'de' 
              ? 'Planen Sie jetzt Ihre Veranstaltung – wir beraten Sie gerne persönlich.'
              : 'Plan your event now – we are happy to advise you personally.'}
            primaryCTA={{ text: language === 'de' ? 'Jetzt anfragen' : 'Inquire Now', href: '/kontakt' }}
            secondaryCTA={{ text: language === 'de' ? 'Speisekarte' : 'Menu', href: '/speisekarte' }}
          />

          {/* 5. Food Gallery */}
          <FoodGallery images={galleryImages} />

          {/* 6. Local SEO Block */}
          <LocalSEOBlock
            title={language === 'de' ? 'Zentrale Eventlocation in München' : 'Central Event Location in Munich'}
            description={language === 'de'
              ? 'Das STORIA liegt zentral in der Münchner Maxvorstadt – perfekt erreichbar für Gäste aus ganz München. Die optimale Anbindung an öffentliche Verkehrsmittel (U-Bahn Königsplatz, Hauptbahnhof) und ausreichend Parkmöglichkeiten in der Nähe machen die Anreise für Ihre Gäste unkompliziert.'
              : 'STORIA is centrally located in Munich\'s Maxvorstadt – perfectly accessible for guests from all over Munich. The optimal connection to public transport (Königsplatz metro, main station) and sufficient parking options nearby make arrival easy for your guests.'}
          />

          {/* 7. Social Proof */}
          <SocialProof testimonials={testimonials} />

          {/* 8. FAQ Section */}
          <section className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card p-8 rounded-lg border border-border mb-10">
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
              </div>

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

export default EventlocationMuenchen;