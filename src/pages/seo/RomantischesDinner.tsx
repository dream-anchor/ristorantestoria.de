import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import { Button } from "@/components/ui/button";
import storiaLogo from "@/assets/storia-logo.webp";
import weinserviceImage from "@/assets/weinservice.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const RomantischesDinner = () => {
  const { language } = useLanguage();

  const faqItems = language === 'de' ? [
    {
      question: "Kann ich einen speziellen Tisch reservieren?",
      answer: "Ja, gerne! Teilen Sie uns bei Ihrer Reservierung mit, ob Sie einen ruhigeren Tisch, einen Platz am Fenster oder auf der Terrasse bevorzugen. Wir tun unser Bestes, um Ihre Wünsche zu erfüllen."
    },
    {
      question: "Bieten Sie Menü-Empfehlungen für Date Night?",
      answer: "Absolut! Für ein romantisches Dinner empfehlen wir: Starten Sie mit Antipasti zum Teilen (Bruschetta, Carpaccio), gefolgt von frischer Pasta oder Fisch als Hauptgang. Krönen Sie den Abend mit unserem hausgemachten Tiramisu für zwei."
    },
    {
      question: "Kann ich Blumen oder Überraschungen organisieren?",
      answer: "Ja! Kontaktieren Sie uns vorab telefonisch oder per E-Mail. Wir können Blumen am Tisch arrangieren, eine persönliche Botschaft auf dem Dessert platzieren oder andere Überraschungen für Ihren besonderen Anlass vorbereiten."
    },
    {
      question: "Welche Weine empfehlen Sie für ein romantisches Dinner?",
      answer: "Für ein romantisches Dinner empfehlen wir einen eleganten Chianti Classico oder Barolo zum Fleisch, einen frischen Vermentino oder Gavi zu Fisch. Unser Team berät Sie gerne passend zu Ihrer Menüauswahl."
    },
    {
      question: "Gibt es vegetarische Optionen für ein romantisches Dinner?",
      answer: "Selbstverständlich! Unsere Speisekarte bietet viele vegetarische Gerichte – von hausgemachter Pasta mit saisonalem Gemüse bis zu Risotto-Variationen. Sprechen Sie uns an, und wir stellen gerne ein vegetarisches Menü zusammen."
    }
  ] : [
    {
      question: "Can I reserve a special table?",
      answer: "Yes, of course! Let us know when making your reservation if you prefer a quieter table, a window seat or a spot on the terrace. We'll do our best to accommodate your wishes."
    },
    {
      question: "Do you offer menu recommendations for date night?",
      answer: "Absolutely! For a romantic dinner, we recommend: Start with antipasti to share (bruschetta, carpaccio), followed by fresh pasta or fish as a main course. Crown the evening with our homemade tiramisu for two."
    },
    {
      question: "Can I organize flowers or surprises?",
      answer: "Yes! Contact us in advance by phone or email. We can arrange flowers at your table, place a personal message on the dessert or prepare other surprises for your special occasion."
    },
    {
      question: "Which wines do you recommend for a romantic dinner?",
      answer: "For a romantic dinner, we recommend an elegant Chianti Classico or Barolo with meat, a fresh Vermentino or Gavi with fish. Our team will be happy to advise you to match your menu selection."
    },
    {
      question: "Are there vegetarian options for a romantic dinner?",
      answer: "Of course! Our menu offers many vegetarian dishes – from homemade pasta with seasonal vegetables to risotto variations. Talk to us and we'll be happy to put together a vegetarian menu."
    }
  ];

  return (
    <>
      <SEO 
        title={language === 'de' ? 'Romantisches Dinner München – Date Night im Italiener STORIA' : 'Romantic Dinner Munich – Date Night at Italian Restaurant STORIA'}
        description={language === 'de' 
          ? 'Romantisches Dinner München im STORIA: Date Night im italienischen Ambiente. Candlelight, exquisite Küche & erlesene Weine in der Maxvorstadt nahe Pinakotheken. Jetzt Tisch reservieren!'
          : 'Romantic dinner Munich at STORIA: Date night in Italian ambiance. Candlelight, exquisite cuisine & fine wines in Maxvorstadt near Pinakothek museums. Book your table now!'}
        canonical="/romantisches-dinner-muenchen"
      />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: language === 'de' ? 'Romantisches Dinner' : 'Romantic Dinner', url: '/romantisches-dinner-muenchen' }
        ]} 
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-8 text-center">
            <Link to="/">
              <img src={storiaLogo} alt="STORIA – Italienisches Restaurant München für romantisches Dinner" className="h-24 md:h-32 mx-auto mb-4 hover:opacity-80 transition-opacity cursor-pointer" />
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
              {language === 'de' ? 'Romantisches Dinner München – Date Night im STORIA' : 'Romantic Dinner Munich – Date Night at STORIA'}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
              {language === 'de'
                ? 'Verbringen Sie einen unvergesslichen Abend zu zweit im STORIA. Italienische Romantik, exquisite Küche und erlesene Weine – der perfekte Rahmen für Ihre Date Night in München. Zentral gelegen in der Maxvorstadt, nur wenige Gehminuten von den Pinakotheken entfernt.'
                : 'Spend an unforgettable evening for two at STORIA. Italian romance, exquisite cuisine and fine wines – the perfect setting for your date night in Munich. Centrally located in Maxvorstadt, just a few minutes walk from the Pinakothek museums.'}
            </p>

            {/* Hero Image */}
            <div className="rounded-lg overflow-hidden mb-12">
              <img 
                src={weinserviceImage} 
                alt={language === 'de' ? 'Romantisches Dinner mit Weinservice im STORIA München' : 'Romantic dinner with wine service at STORIA Munich'}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>

            {/* La Dolce Vita zu Zweit */}
            <section className="bg-card p-8 rounded-lg border border-border mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? 'La Dolce Vita zu Zweit' : 'La Dolce Vita for Two'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === 'de'
                  ? 'Im STORIA schaffen wir eine Atmosphäre, die Romantik und italienische Lebensfreude vereint. Gedämpftes Licht, stilvolle Einrichtung und der Duft frischer italienischer Küche bilden den perfekten Rahmen für Ihren besonderen Abend. Unser aufmerksames, aber diskretes Team sorgt dafür, dass Sie sich ganz auf Ihr Gegenüber konzentrieren können.'
                  : 'At STORIA, we create an atmosphere that combines romance and Italian joie de vivre. Soft lighting, stylish decor and the aroma of fresh Italian cuisine form the perfect setting for your special evening. Our attentive yet discreet team ensures you can focus entirely on each other.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">{language === 'de' ? 'Das erwartet Sie' : 'What Awaits You'}</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>✓ {language === 'de' ? 'Stilvolles italienisches Ambiente' : 'Stylish Italian ambiance'}</li>
                    <li>✓ {language === 'de' ? 'Gedämpftes, romantisches Licht' : 'Soft, romantic lighting'}</li>
                    <li>✓ {language === 'de' ? 'Ausgewählte Weine aus Italien' : 'Selected wines from Italy'}</li>
                    <li>✓ {language === 'de' ? 'Frische Pasta & Meeresfrüchte' : 'Fresh pasta & seafood'}</li>
                    <li>✓ {language === 'de' ? 'Hausgemachte Dolci' : 'Homemade dolci'}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">{language === 'de' ? 'Unser Service' : 'Our Service'}</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>✓ {language === 'de' ? 'Aufmerksamer, diskreter Service' : 'Attentive, discreet service'}</li>
                    <li>✓ {language === 'de' ? 'Persönliche Weinempfehlungen' : 'Personal wine recommendations'}</li>
                    <li>✓ {language === 'de' ? 'Sonderwünsche auf Anfrage' : 'Special requests on request'}</li>
                    <li>✓ {language === 'de' ? 'Überraschungen organisierbar' : 'Surprises can be arranged'}</li>
                    <li>✓ {language === 'de' ? 'Tischreservierung nach Wunsch' : 'Table reservation as requested'}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Kulinarische Verführung */}
            <section className="bg-secondary/50 p-8 rounded-lg mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? 'Kulinarische Verführung' : 'Culinary Seduction'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === 'de'
                  ? 'Ein romantisches Dinner im STORIA ist eine Reise durch die Aromen Italiens. Lassen Sie sich von unseren Empfehlungen für einen unvergesslichen Abend inspirieren:'
                  : 'A romantic dinner at STORIA is a journey through the flavors of Italy. Let our recommendations inspire you for an unforgettable evening:'}
              </p>
              <div className="space-y-4">
                <div className="bg-background p-4 rounded-lg">
                  <h3 className="font-serif font-semibold mb-2">{language === 'de' ? '1. Antipasti zum Teilen' : '1. Antipasti to Share'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Beginnen Sie mit einer Auswahl an Bruschetta, Carpaccio oder Burrata – perfekt zum Teilen und gemeinsamen Genießen.'
                      : 'Start with a selection of bruschetta, carpaccio or burrata – perfect for sharing and enjoying together.'}
                  </p>
                </div>
                <div className="bg-background p-4 rounded-lg">
                  <h3 className="font-serif font-semibold mb-2">{language === 'de' ? '2. Pasta oder Pesce' : '2. Pasta or Pesce'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Hausgemachte Pasta wie unsere Ravioli oder frischer Fisch des Tages – zubereitet nach traditionellen italienischen Rezepten.'
                      : 'Homemade pasta like our ravioli or fresh fish of the day – prepared according to traditional Italian recipes.'}
                  </p>
                </div>
                <div className="bg-background p-4 rounded-lg">
                  <h3 className="font-serif font-semibold mb-2">{language === 'de' ? '3. Dolci für Verliebte' : '3. Dolci for Lovers'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Krönen Sie den Abend mit unserem hausgemachten Tiramisu für zwei oder einem Panna Cotta mit Beeren.'
                      : 'Crown the evening with our homemade tiramisu for two or a panna cotta with berries.'}
                  </p>
                </div>
              </div>
            </section>

            {/* Perfekte Anlässe */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6 text-center">
                {language === 'de' ? 'Perfekt für besondere Anlässe' : 'Perfect for Special Occasions'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-card p-4 rounded-lg border border-border text-center">
                  <p className="font-serif font-semibold">{language === 'de' ? 'Jahrestag' : 'Anniversary'}</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border text-center">
                  <p className="font-serif font-semibold">{language === 'de' ? 'Verlobung' : 'Engagement'}</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border text-center">
                  <p className="font-serif font-semibold">{language === 'de' ? 'Valentinstag' : "Valentine's Day"}</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border text-center">
                  <p className="font-serif font-semibold">{language === 'de' ? 'Hochzeitstag' : 'Wedding Anniversary'}</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border text-center">
                  <p className="font-serif font-semibold">{language === 'de' ? 'Erstes Date' : 'First Date'}</p>
                </div>
              </div>
            </section>

            {/* Romantische Lage */}
            <section className="bg-card p-8 rounded-lg border border-border mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? 'Romantische Lage im Herzen Münchens' : 'Romantic Location in the Heart of Munich'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === 'de'
                  ? 'Das STORIA liegt in der Maxvorstadt – Münchens Kunst- und Kulturviertel. Verbinden Sie Ihr romantisches Dinner mit einem Besuch der Pinakotheken, des Lenbachhauses oder einem Abendspaziergang am Königsplatz. Für Gäste von außerhalb: Mehrere Hotels befinden sich in unmittelbarer Nähe.'
                  : 'STORIA is located in Maxvorstadt – Munich\'s art and culture district. Combine your romantic dinner with a visit to the Pinakothek museums, the Lenbachhaus or an evening stroll at Königsplatz. For guests from out of town: Several hotels are in the immediate vicinity.'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-xl font-serif font-bold text-primary">7 Min.</p>
                  <p className="text-xs text-muted-foreground">{language === 'de' ? 'Pinakotheken' : 'Pinakothek museums'}</p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-xl font-serif font-bold text-primary">3 Min.</p>
                  <p className="text-xs text-muted-foreground">{language === 'de' ? 'Königsplatz' : 'Königsplatz'}</p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-xl font-serif font-bold text-primary">10 Min.</p>
                  <p className="text-xs text-muted-foreground">{language === 'de' ? 'Lenbachhaus' : 'Lenbachhaus'}</p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-xl font-serif font-bold text-primary">5 Min.</p>
                  <p className="text-xs text-muted-foreground">{language === 'de' ? 'Hauptbahnhof' : 'Main Station'}</p>
                </div>
              </div>
            </section>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <Button size="lg" asChild>
                <Link to="/reservierung">{language === 'de' ? 'Tisch reservieren' : 'Book a Table'}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/speisekarte">{language === 'de' ? 'Speisekarte ansehen' : 'View Menu'}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/getraenke">{language === 'de' ? 'Weinkarte' : 'Wine List'}</Link>
              </Button>
            </div>

            {/* FAQ Section */}
            <section className="bg-card p-8 rounded-lg border border-border mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? 'Häufige Fragen zum romantischen Dinner' : 'Frequently Asked Questions'}
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
                  {language === 'de' ? 'Aperitivo vor dem Dinner →' : 'Aperitivo before dinner →'}
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/getraenke" className="text-sm text-primary hover:underline">
                  {language === 'de' ? 'Unsere Weinkarte →' : 'Our wine list →'}
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/geburtstagsfeier-muenchen" className="text-sm text-primary hover:underline">
                  {language === 'de' ? 'Besondere Anlässe feiern →' : 'Celebrate special occasions →'}
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

export default RomantischesDinner;
