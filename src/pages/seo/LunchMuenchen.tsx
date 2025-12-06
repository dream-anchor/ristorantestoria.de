import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import { Button } from "@/components/ui/button";
import storiaLogo from "@/assets/storia-logo.webp";
import pastaImage from "@/assets/pasta.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LunchMuenchen = () => {
  const { language } = useLanguage();

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
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-8 text-center">
            <Link to="/">
              <img src={storiaLogo} alt="STORIA – Italienisches Restaurant München Maxvorstadt" className="h-24 md:h-32 mx-auto mb-4 hover:opacity-80 transition-opacity cursor-pointer" />
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
              {language === 'de' ? 'Lunch München Maxvorstadt – Italienischer Mittagstisch im STORIA' : 'Lunch Munich Maxvorstadt – Italian Lunch at STORIA'}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
              {language === 'de'
                ? 'Genießen Sie Ihre Mittagspause im STORIA – Ihrem Italiener in der Münchner Maxvorstadt. Frisch zubereitete Pasta, authentische Pizza aus dem Steinofen und wechselnde Tagesgerichte erwarten Sie nur wenige Gehminuten vom Hauptbahnhof, der TU München und dem Königsplatz entfernt.'
                : 'Enjoy your lunch break at STORIA – your Italian restaurant in Munich\'s Maxvorstadt. Freshly prepared pasta, authentic stone-oven pizza and changing daily specials await you just a few minutes walk from the main station, TU Munich and Königsplatz.'}
            </p>

            {/* Hero Image */}
            <div className="rounded-lg overflow-hidden mb-12">
              <img 
                src={pastaImage} 
                alt={language === 'de' ? 'Frische Pasta zum Lunch im STORIA München Maxvorstadt' : 'Fresh pasta for lunch at STORIA Munich Maxvorstadt'}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>

            {/* Mittagsangebot */}
            <section className="bg-card p-8 rounded-lg border border-border mb-10">
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
            </section>

            {/* Perfekte Lage */}
            <section className="bg-secondary/50 p-8 rounded-lg mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? 'Perfekte Lage für Ihren Lunch' : 'Perfect Location for Your Lunch'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === 'de'
                  ? 'Ob Sie an der TU München studieren, im Königsplatz-Viertel arbeiten oder geschäftlich am Hauptbahnhof unterwegs sind – das STORIA liegt ideal für Ihre Mittagspause. Unsere zentrale Lage in der Karlstraße 47a macht uns zur perfekten Wahl für alle, die authentische italienische Küche in München suchen.'
                  : 'Whether you study at TU Munich, work in the Königsplatz district or are on business at the main station – STORIA is ideally located for your lunch break. Our central location at Karlstraße 47a makes us the perfect choice for anyone looking for authentic Italian cuisine in Munich.'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-2xl font-serif font-bold text-primary">3 Min.</p>
                  <p className="text-sm text-muted-foreground">{language === 'de' ? 'zum Königsplatz' : 'to Königsplatz'}</p>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-2xl font-serif font-bold text-primary">5 Min.</p>
                  <p className="text-sm text-muted-foreground">{language === 'de' ? 'zum Hauptbahnhof' : 'to Main Station'}</p>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-2xl font-serif font-bold text-primary">8 Min.</p>
                  <p className="text-sm text-muted-foreground">{language === 'de' ? 'zur TU München' : 'to TU Munich'}</p>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-2xl font-serif font-bold text-primary">7 Min.</p>
                  <p className="text-sm text-muted-foreground">{language === 'de' ? 'zu den Pinakotheken' : 'to Pinakothek museums'}</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                {language === 'de'
                  ? 'Die Maxvorstadt ist Münchens Universitäts- und Kulturviertel. Mit unserer Lage zwischen Hauptbahnhof und Königsplatz sind wir ideal erreichbar – ob mit U-Bahn (U2/U8 Königsplatz, U1/U2/U4/U5 Hauptbahnhof), S-Bahn oder zu Fuß aus den umliegenden Büros in der Karlstraße, Brienner Straße und Gabelsbergerstraße.'
                  : 'Maxvorstadt is Munich\'s university and cultural district. With our location between the main station and Königsplatz, we are easily accessible – whether by U-Bahn (U2/U8 Königsplatz, U1/U2/U4/U5 Main Station), S-Bahn or on foot from the surrounding offices on Karlstraße, Brienner Straße and Gabelsbergerstraße.'}
              </p>
            </section>

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

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <Button size="lg" asChild>
                <Link to="/mittagsmenu">{language === 'de' ? 'Aktuelles Mittagsmenü' : 'Current Lunch Menu'}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/speisekarte">{language === 'de' ? 'Vollständige Speisekarte' : 'Full Menu'}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/reservierung">{language === 'de' ? 'Tisch reservieren' : 'Book a Table'}</Link>
              </Button>
            </div>

            {/* FAQ Section */}
            <section className="bg-card p-8 rounded-lg border border-border mb-10">
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
            </section>

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
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default LunchMuenchen;
