import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Clock, Leaf, MapPin, Euro } from "lucide-react";
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
import pastaImage from "@/assets/pasta.jpg";
import ravioliImage from "@/assets/ravioli.webp";
import tiramisuImage from "@/assets/tiramisu.webp";
import weinserviceImage from "@/assets/weinservice.webp";

const LunchMuenchen = () => {
  const { language } = useLanguage();

  const uspItems: USPItem[] = [
    {
      icon: Clock,
      title: language === 'de' ? 'Schnell (30 Min.)' : 'Quick (30 min)',
      description: language === 'de' ? 'Perfekt für die Mittagspause' : 'Perfect for lunch break',
    },
    {
      icon: Leaf,
      title: language === 'de' ? 'Frische Zutaten' : 'Fresh Ingredients',
      description: language === 'de' ? 'Täglich frisch zubereitet' : 'Freshly prepared daily',
    },
    {
      icon: MapPin,
      title: language === 'de' ? 'Nahe Hbf & TU' : 'Near Station & TU',
      description: language === 'de' ? '5 Min. vom Hauptbahnhof' : '5 min from main station',
    },
    {
      icon: Euro,
      title: language === 'de' ? 'Faire Preise' : 'Fair Prices',
      description: language === 'de' ? 'Qualität zum fairen Preis' : 'Quality at fair prices',
    },
  ];

  const galleryImages = [
    { src: pastaImage, alt: language === 'de' ? 'Frische Pasta zum Lunch' : 'Fresh pasta for lunch' },
    { src: ravioliImage, alt: language === 'de' ? 'Hausgemachte Ravioli' : 'Homemade ravioli' },
    { src: tiramisuImage, alt: language === 'de' ? 'Tiramisu zum Dessert' : 'Tiramisu for dessert' },
    { src: weinserviceImage, alt: language === 'de' ? 'Weinservice am Tisch' : 'Wine service at table' },
  ];

  const testimonials = [
    {
      quote: language === 'de' 
        ? "Bester Lunch-Spot in der Maxvorstadt! Schnell, lecker, authentisch."
        : "Best lunch spot in Maxvorstadt! Quick, delicious, authentic.",
      author: "Thomas M.",
    },
    {
      quote: language === 'de'
        ? "Perfekt für die Mittagspause – frische Pasta und super Service."
        : "Perfect for lunch break – fresh pasta and great service.",
      author: "Sandra K.",
    },
    {
      quote: language === 'de'
        ? "Unser Team-Lieblingsplatz für Business-Lunch. Immer wieder gerne!"
        : "Our team's favorite place for business lunch. Always happy to return!",
      author: "Michael B.",
    },
  ];

  const faqItems = language === 'de' ? [
    {
      question: "Was kostet ein Mittagsmenü im STORIA?",
      answer: "Unsere Mittagsgerichte beginnen bei attraktiven Preisen. Das wechselnde Tagesmenü bietet ein ausgezeichnetes Preis-Leistungs-Verhältnis mit frisch zubereiteter italienischer Küche. Schauen Sie auf unsere aktuelle Mittagskarte für genaue Preise."
    },
    {
      question: "Kann ich für den Lunch reservieren?",
      answer: "Ja, wir empfehlen eine Reservierung, besonders für Gruppen. Rufen Sie uns an unter +49 89 51519696 oder reservieren Sie online über OpenTable. Walk-ins sind ebenfalls willkommen, sofern Plätze verfügbar sind."
    },
    {
      question: "Gibt es vegetarische und vegane Optionen?",
      answer: "Absolut! Wir bieten täglich vegetarische Pasta- und Pizzagerichte an. Vegane Optionen sind auf Anfrage verfügbar. Sprechen Sie uns einfach an – wir beraten Sie gerne."
    },
    {
      question: "Wie lange dauert ein Lunch im STORIA?",
      answer: "Wir verstehen, dass Ihre Mittagspause kostbar ist. Bei Zeitdruck servieren wir schnell – ein komplettes Mittagessen ist in 30-45 Minuten möglich. Wenn Sie mehr Zeit haben, genießen Sie in Ruhe."
    },
    {
      question: "Ist das STORIA barrierefrei zugänglich?",
      answer: "Ja, unser Restaurant in der Karlstraße 47a ist ebenerdig und barrierefrei zugänglich. Die Toiletten sind ebenfalls barrierefrei."
    }
  ] : [
    {
      question: "How much does a lunch menu cost at STORIA?",
      answer: "Our lunch dishes start at attractive prices. The changing daily menu offers excellent value with freshly prepared Italian cuisine. Check our current lunch menu for exact prices."
    },
    {
      question: "Can I make a reservation for lunch?",
      answer: "Yes, we recommend making a reservation, especially for groups. Call us at +49 89 51519696 or book online via OpenTable. Walk-ins are also welcome when seats are available."
    },
    {
      question: "Are there vegetarian and vegan options?",
      answer: "Absolutely! We offer vegetarian pasta and pizza dishes daily. Vegan options are available upon request. Just ask us – we're happy to help."
    },
    {
      question: "How long does lunch take at STORIA?",
      answer: "We understand your lunch break is precious. If you're in a hurry, we serve quickly – a complete lunch is possible in 30-45 minutes. If you have more time, enjoy at your leisure."
    },
    {
      question: "Is STORIA wheelchair accessible?",
      answer: "Yes, our restaurant at Karlstraße 47a is on ground level and wheelchair accessible. The restrooms are also accessible."
    }
  ];

  return (
    <>
      <SEO 
        title={language === 'de' ? 'Lunch München Maxvorstadt – Italienischer Mittagstisch im STORIA' : 'Lunch Munich Maxvorstadt – Italian Lunch at STORIA'}
        description={language === 'de' 
          ? 'Lunch München Maxvorstadt im STORIA: Italienischer Mittagstisch Mo-Fr ab 11:30 Uhr. Frische Pasta, Pizza & Tagesgerichte nahe Hauptbahnhof, TU München & Königsplatz. Jetzt reservieren!'
          : 'Lunch Munich Maxvorstadt at STORIA: Italian lunch Mon-Fri from 11:30 AM. Fresh pasta, pizza & daily specials near main station, TU Munich & Königsplatz. Book now!'}
        canonical="/lunch-muenchen-maxvorstadt"
      />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: language === 'de' ? 'Lunch München' : 'Lunch Munich', url: '/lunch-muenchen-maxvorstadt' }
        ]} 
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <Navigation />
        
        {/* 1. Parallax Hero */}
        <ParallaxHero
          image={pastaImage}
          headline={language === 'de' ? 'Lunch München Maxvorstadt' : 'Lunch Munich Maxvorstadt'}
          subheadline={language === 'de' 
            ? 'Frisch, schnell & authentisch italienisch – nur 3 Minuten vom Königsplatz'
            : 'Fresh, quick & authentically Italian – just 3 minutes from Königsplatz'}
          primaryCTA={{ text: language === 'de' ? 'Tisch reservieren' : 'Book a Table', href: '/reservierung' }}
          secondaryCTA={{ text: language === 'de' ? 'Mittagsmenü ansehen' : 'View Lunch Menu', href: '/mittagsmenu' }}
        />

        {/* 2. USP Teaser */}
        <USPTeaser items={uspItems} />
        
        <main className="flex-grow">
          {/* 3. Main Content */}
          <section className="container mx-auto px-4 py-12">
            <article className="max-w-4xl mx-auto">
              {/* Business Lunch Section */}
              <div className="bg-card p-8 rounded-lg border border-border mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                  {language === 'de' ? 'Ihr Business Lunch in der Maxvorstadt' : 'Your Business Lunch in Maxvorstadt'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {language === 'de'
                    ? 'Das STORIA ist seit Jahren die erste Wahl für Berufstätige, Studenten und Anwohner der Maxvorstadt, die einen qualitativ hochwertigen Mittagstisch in entspannter Atmosphäre suchen. Unsere Küche bereitet jeden Tag frische italienische Gerichte zu – von klassischer Pasta bis zur neapolitanischen Pizza.'
                    : 'STORIA has been the first choice for professionals, students and residents of Maxvorstadt for years who are looking for a high-quality lunch in a relaxed atmosphere. Our kitchen prepares fresh Italian dishes every day – from classic pasta to Neapolitan pizza.'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">{language === 'de' ? 'Unser Mittagsangebot' : 'Our Lunch Offer'}</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>✓ {language === 'de' ? 'Wechselndes Tagesmenü Mo-Fr' : 'Changing daily menu Mon-Fri'}</li>
                      <li>✓ {language === 'de' ? 'Frische Pasta & Risotto' : 'Fresh pasta & risotto'}</li>
                      <li>✓ {language === 'de' ? 'Pizza aus dem Steinofen' : 'Stone-oven pizza'}</li>
                      <li>✓ {language === 'de' ? 'Leichte Salate & Antipasti' : 'Light salads & antipasti'}</li>
                      <li>✓ {language === 'de' ? 'Italienischer Espresso' : 'Italian espresso'}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">{language === 'de' ? 'Warum STORIA?' : 'Why STORIA?'}</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>✓ {language === 'de' ? 'Schneller Service (30-45 Min.)' : 'Quick service (30-45 min)'}</li>
                      <li>✓ {language === 'de' ? 'Frische Zubereitung à la minute' : 'Fresh preparation à la minute'}</li>
                      <li>✓ {language === 'de' ? 'Attraktive Mittagspreise' : 'Attractive lunch prices'}</li>
                      <li>✓ {language === 'de' ? 'Vegetarische & vegane Optionen' : 'Vegetarian & vegan options'}</li>
                      <li>✓ {language === 'de' ? 'Gemütliches Ambiente' : 'Cozy atmosphere'}</li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground/70 italic border-t border-border pt-4">
                  {language === 'de' ? 'Mittagszeit: Montag bis Freitag, 11:30 – 14:30 Uhr | Samstag & Sonntag: 12:00 – 15:00 Uhr' : 'Lunch hours: Monday to Friday, 11:30 AM – 2:30 PM | Saturday & Sunday: 12:00 – 3:00 PM'}
                </p>
              </div>

              {/* Für wen ideal */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6 text-center">
                  {language === 'de' ? 'Der perfekte Lunch für...' : 'The Perfect Lunch for...'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card p-6 rounded-lg border border-border text-center">
                    <h3 className="font-serif font-semibold text-lg mb-3">{language === 'de' ? 'Berufstätige' : 'Professionals'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Schneller, qualitativ hochwertiger Mittagstisch für die Pause zwischen Meetings. Ideal für Teams aus den umliegenden Büros und Kanzleien.'
                        : 'Quick, high-quality lunch for the break between meetings. Ideal for teams from surrounding offices and law firms.'}
                    </p>
                  </div>
                  <div className="bg-card p-6 rounded-lg border border-border text-center">
                    <h3 className="font-serif font-semibold text-lg mb-3">{language === 'de' ? 'Studenten' : 'Students'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Faire Preise und großzügige Portionen. Die perfekte Alternative zur Mensa für Studenten der TU München und LMU.'
                        : 'Fair prices and generous portions. The perfect alternative to the cafeteria for students of TU Munich and LMU.'}
                    </p>
                  </div>
                  <div className="bg-card p-6 rounded-lg border border-border text-center">
                    <h3 className="font-serif font-semibold text-lg mb-3">{language === 'de' ? 'Kulturfreunde' : 'Culture Enthusiasts'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Stärken Sie sich vor oder nach dem Museumsbesuch. Die Pinakotheken und das Lenbachhaus sind nur wenige Gehminuten entfernt.'
                        : 'Fuel up before or after your museum visit. The Pinakothek museums and Lenbachhaus are just a few minutes walk away.'}
                    </p>
                  </div>
                </div>
              </section>
            </article>
          </section>

          {/* 4. CTA Intermediate */}
          <CTAIntermediate 
            headline={language === 'de' ? 'Bereit für Ihren Lunch?' : 'Ready for Your Lunch?'}
            text={language === 'de' 
              ? 'Reservieren Sie jetzt Ihren Tisch – nur wenige Minuten vom Königsplatz entfernt.'
              : 'Book your table now – just a few minutes from Königsplatz.'}
            primaryCTA={{ text: language === 'de' ? 'Jetzt reservieren' : 'Book Now', href: '/reservierung' }}
            secondaryCTA={{ text: language === 'de' ? 'Mittagsmenü' : 'Lunch Menu', href: '/mittagsmenu' }}
          />

          {/* 5. Food Gallery */}
          <FoodGallery images={galleryImages} />

          {/* 6. Local SEO Block */}
          <LocalSEOBlock
            title={language === 'de' ? 'Ihr Italiener in der Maxvorstadt' : 'Your Italian in Maxvorstadt'}
            description={language === 'de'
              ? 'Das STORIA liegt im Herzen von München, in der Karlstraße 47a. Nur 3 Minuten vom Königsplatz, 5 Minuten vom Hauptbahnhof und 8 Minuten von der TU München entfernt. Perfekt erreichbar mit U2/U8 (Königsplatz) oder zu Fuß aus den umliegenden Büros der Brienner Straße und Gabelsbergerstraße.'
              : 'STORIA is located in the heart of Munich, at Karlstraße 47a. Just 3 minutes from Königsplatz, 5 minutes from the main station and 8 minutes from TU Munich. Perfectly accessible by U2/U8 (Königsplatz) or on foot from surrounding offices on Brienner Straße and Gabelsbergerstraße.'}
          />

          {/* 7. Social Proof */}
          <SocialProof testimonials={testimonials} />

          {/* 8. FAQ Section */}
          <section className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card p-8 rounded-lg border border-border mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                  {language === 'de' ? 'Häufige Fragen zum Lunch' : 'Frequently Asked Questions'}
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
                  <Link to="/aperitivo-muenchen" className="text-sm text-primary hover:underline">
                    {language === 'de' ? 'Aperitivo nach dem Lunch →' : 'Aperitivo after lunch →'}
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link to="/neapolitanische-pizza-muenchen" className="text-sm text-primary hover:underline">
                    {language === 'de' ? 'Unsere Steinofen-Pizza →' : 'Our stone-oven pizza →'}
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link to="/firmenfeier-muenchen" className="text-sm text-primary hover:underline">
                    {language === 'de' ? 'Team-Lunch für Firmen →' : 'Team lunch for companies →'}
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

export default LunchMuenchen;