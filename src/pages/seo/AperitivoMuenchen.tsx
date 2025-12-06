import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import { Button } from "@/components/ui/button";
import storiaLogo from "@/assets/storia-logo.webp";
import cocktailsImage from "@/assets/cocktails.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AperitivoMuenchen = () => {
  const { language } = useLanguage();

  const faqItems = language === 'de' ? [
    {
      question: "Was ist STORIA Notturno?",
      answer: "STORIA Notturno ist unser Late Night Aperitivo-Angebot, täglich von 21:00 bis 22:30 Uhr. Genießen Sie klassische italienische Cocktails wie Aperol Spritz, Negroni oder Hugo zu vergünstigten Preisen, begleitet von feinen Stuzzichini."
    },
    {
      question: "Gibt es Happy Hour im STORIA?",
      answer: "Unser STORIA Notturno ist unsere Version der Happy Hour – italienisch interpretiert. Täglich ab 21:00 Uhr genießen Sie ausgewählte Aperitivo-Cocktails und kleine italienische Snacks in entspannter Atmosphäre."
    },
    {
      question: "Kann man nur auf einen Drink vorbeikommen?",
      answer: "Selbstverständlich! Sie sind herzlich willkommen, auch nur für einen Aperitif oder Wein an unserer Bar Platz zu nehmen. Keine Reservierung nötig – kommen Sie einfach vorbei."
    },
    {
      question: "Welche Aperitivo-Cocktails empfehlen Sie?",
      answer: "Unsere Klassiker sind Aperol Spritz, Negroni und Hugo. Für Kenner empfehlen wir den Negroni Sbagliato oder einen Bellini mit frischem Pfirsichpüree. Alle Cocktails werden mit hochwertigen italienischen Spirituosen zubereitet."
    },
    {
      question: "Haben Sie auch italienische Weine?",
      answer: "Ja! Unsere Weinkarte umfasst ausgewählte Weine aus ganz Italien – vom frischen Pinot Grigio aus dem Veneto über toskanische Chianti bis zu vollmundigen Rotweinen aus Sizilien und Apulien."
    }
  ] : [
    {
      question: "What is STORIA Notturno?",
      answer: "STORIA Notturno is our Late Night Aperitivo offer, daily from 9:00 PM to 10:30 PM. Enjoy classic Italian cocktails like Aperol Spritz, Negroni or Hugo at special prices, accompanied by fine stuzzichini."
    },
    {
      question: "Is there Happy Hour at STORIA?",
      answer: "Our STORIA Notturno is our version of Happy Hour – Italian style. Daily from 9:00 PM, enjoy selected aperitivo cocktails and small Italian snacks in a relaxed atmosphere."
    },
    {
      question: "Can I just come for a drink?",
      answer: "Of course! You are welcome to just have an aperitif or wine at our bar. No reservation needed – just drop by."
    },
    {
      question: "Which aperitivo cocktails do you recommend?",
      answer: "Our classics are Aperol Spritz, Negroni and Hugo. For connoisseurs, we recommend the Negroni Sbagliato or a Bellini with fresh peach puree. All cocktails are prepared with high-quality Italian spirits."
    },
    {
      question: "Do you also have Italian wines?",
      answer: "Yes! Our wine list includes selected wines from all over Italy – from fresh Pinot Grigio from Veneto to Tuscan Chianti to full-bodied reds from Sicily and Apulia."
    }
  ];

  return (
    <>
      <SEO 
        title={language === 'de' ? 'Aperitivo München – Italienische Bar & Cocktails in der Maxvorstadt' : 'Aperitivo Munich – Italian Bar & Cocktails in Maxvorstadt'}
        description={language === 'de' 
          ? 'Aperitivo München im STORIA: Aperol Spritz, Negroni & italienische Weine in der Maxvorstadt. STORIA Notturno täglich 21-22:30 Uhr. Bar nahe Königsplatz. Jetzt vorbeikommen!'
          : 'Aperitivo Munich at STORIA: Aperol Spritz, Negroni & Italian wines in Maxvorstadt. STORIA Notturno daily 9-10:30 PM. Bar near Königsplatz. Visit us now!'}
        canonical="/aperitivo-muenchen"
      />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: language === 'de' ? 'Aperitivo München' : 'Aperitivo Munich', url: '/aperitivo-muenchen' }
        ]} 
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-8 text-center">
            <Link to="/">
              <img src={storiaLogo} alt="STORIA – Italienische Bar München Maxvorstadt" className="h-24 md:h-32 mx-auto mb-4 hover:opacity-80 transition-opacity cursor-pointer" />
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
              {language === 'de' ? 'Aperitivo München – Italienische Bar in der Maxvorstadt' : 'Aperitivo Munich – Italian Bar in Maxvorstadt'}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
              {language === 'de'
                ? 'Erleben Sie authentischen italienischen Aperitivo im STORIA. Klassische Cocktails wie Aperol Spritz und Negroni, erlesene Weine aus Italien und das gewisse italienische Flair – mitten in Münchens Maxvorstadt, nur wenige Schritte vom Königsplatz entfernt.'
                : 'Experience authentic Italian aperitivo at STORIA. Classic cocktails like Aperol Spritz and Negroni, fine wines from Italy and that special Italian flair – in the heart of Munich\'s Maxvorstadt, just steps from Königsplatz.'}
            </p>

            {/* Hero Image */}
            <div className="rounded-lg overflow-hidden mb-12">
              <img 
                src={cocktailsImage} 
                alt={language === 'de' ? 'Aperol Spritz Aperitivo an der Bar STORIA München' : 'Aperol Spritz Aperitivo at STORIA Bar Munich'}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>

            {/* Die Aperitivo-Kultur */}
            <section className="bg-card p-8 rounded-lg border border-border mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? 'Die Aperitivo-Kultur im STORIA' : 'The Aperitivo Culture at STORIA'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === 'de'
                  ? 'Der Aperitivo ist mehr als nur ein Drink vor dem Essen – er ist ein italienisches Ritual, das den Übergang vom Arbeitstag zum Feierabend zelebriert. Im STORIA pflegen wir diese Tradition mit Leidenschaft. Nehmen Sie Platz an unserer Bar, genießen Sie einen perfekt zubereiteten Cocktail und lassen Sie den Tag entspannt ausklingen.'
                  : 'The aperitivo is more than just a drink before dinner – it\'s an Italian ritual that celebrates the transition from work to leisure. At STORIA, we nurture this tradition with passion. Take a seat at our bar, enjoy a perfectly crafted cocktail and let the day wind down in relaxation.'}
              </p>
              <div className="bg-secondary/50 p-6 rounded-lg">
                <h3 className="font-serif font-semibold text-xl mb-3">
                  {language === 'de' ? 'Was ist Aperitivo?' : 'What is Aperitivo?'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'de'
                    ? 'Der Aperitivo (vom lateinischen "aperire" – öffnen) ist eine italienische Tradition, die den Appetit vor dem Abendessen anregen soll. Typischerweise genießt man zwischen 18 und 21 Uhr leichte, bittere Cocktails oder Wein, begleitet von kleinen Snacks – den Stuzzichini. Im STORIA erleben Sie diese Tradition authentisch und ungezwungen.'
                    : 'The aperitivo (from Latin "aperire" – to open) is an Italian tradition meant to stimulate the appetite before dinner. Typically enjoyed between 6 and 9 PM, it involves light, bitter cocktails or wine, accompanied by small snacks – the stuzzichini. At STORIA, you experience this tradition authentically and casually.'}
                </p>
              </div>
            </section>

            {/* STORIA Notturno */}
            <section className="bg-primary/5 p-8 rounded-lg mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? 'STORIA Notturno – Late Night Aperitivo' : 'STORIA Notturno – Late Night Aperitivo'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === 'de'
                  ? 'Täglich von 21:00 bis 22:30 Uhr laden wir Sie ein zum STORIA Notturno – unserem Late Night Aperitivo im italienischen Stil. Genießen Sie ausgewählte Cocktails und Stuzzichini in entspannter Atmosphäre. Die perfekte Art, den Abend ausklingen zu lassen oder den Digestif nach dem Dinner zu genießen.'
                  : 'Daily from 9:00 PM to 10:30 PM, we invite you to STORIA Notturno – our Late Night Aperitivo Italian style. Enjoy selected cocktails and stuzzichini in a relaxed atmosphere. The perfect way to end the evening or enjoy a digestif after dinner.'}
              </p>
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="font-serif text-lg text-primary">{language === 'de' ? 'STORIA Notturno' : 'STORIA Notturno'}</p>
                <p className="text-2xl font-bold">21:00 – 22:30</p>
                <p className="text-sm text-muted-foreground">{language === 'de' ? 'Täglich' : 'Daily'}</p>
              </div>
            </section>

            {/* Unsere Aperitivo-Klassiker */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6 text-center">
                {language === 'de' ? 'Unsere Aperitivo-Klassiker' : 'Our Aperitivo Classics'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-serif font-semibold text-lg mb-2">Aperol Spritz</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Der Klassiker schlechthin – Aperol, Prosecco und Soda, garniert mit einer Orangenscheibe. Erfrischend bitter-süß, perfekt für den Sommerabend.'
                      : 'The quintessential classic – Aperol, Prosecco and soda, garnished with an orange slice. Refreshingly bittersweet, perfect for summer evenings.'}
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-serif font-semibold text-lg mb-2">Negroni</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Für Kenner: Gin, Campari und roter Wermut zu gleichen Teilen. Ein kraftvoller, eleganter Cocktail mit jahrhundertealter Geschichte.'
                      : 'For connoisseurs: Gin, Campari and red vermouth in equal parts. A powerful, elegant cocktail with centuries of history.'}
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-serif font-semibold text-lg mb-2">Hugo</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Leicht und blumig – Prosecco mit Holunderblütensirup, Minze und Soda. Die frische Alternative aus Südtirol.'
                      : 'Light and floral – Prosecco with elderflower syrup, mint and soda. The fresh alternative from South Tyrol.'}
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-serif font-semibold text-lg mb-2">Bellini</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Venezianische Eleganz – Prosecco mit frischem Pfirsichpüree. Erfunden in Harry\'s Bar in Venedig, perfekt für besondere Anlässe.'
                      : 'Venetian elegance – Prosecco with fresh peach puree. Invented at Harry\'s Bar in Venice, perfect for special occasions.'}
                  </p>
                </div>
              </div>
            </section>

            {/* Italienische Weine */}
            <section className="bg-secondary/50 p-8 rounded-lg mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? 'Italienische Weine' : 'Italian Wines'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === 'de'
                  ? 'Unsere Weinkarte ist eine Reise durch Italien. Von frischen Weißweinen aus dem Norden bis zu kraftvollen Rotweinen aus dem Süden – wir haben für jeden Geschmack den passenden Tropfen.'
                  : 'Our wine list is a journey through Italy. From fresh white wines from the north to powerful red wines from the south – we have the perfect drop for every taste.'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="font-serif font-semibold">Piemont</p>
                  <p className="text-xs text-muted-foreground">Barolo, Barbaresco</p>
                </div>
                <div className="text-center">
                  <p className="font-serif font-semibold">Toskana</p>
                  <p className="text-xs text-muted-foreground">Chianti, Brunello</p>
                </div>
                <div className="text-center">
                  <p className="font-serif font-semibold">Veneto</p>
                  <p className="text-xs text-muted-foreground">Prosecco, Amarone</p>
                </div>
                <div className="text-center">
                  <p className="font-serif font-semibold">Sizilien</p>
                  <p className="text-xs text-muted-foreground">Nero d'Avola</p>
                </div>
              </div>
            </section>

            {/* Perfekt für */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6 text-center">
                {language === 'de' ? 'Perfekt für jeden Anlass' : 'Perfect for Every Occasion'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-serif font-semibold mb-2">{language === 'de' ? 'After Work' : 'After Work'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Lassen Sie den Arbeitstag mit Kollegen bei einem Aperol Spritz ausklingen. Unsere zentrale Lage nahe Hauptbahnhof macht uns ideal für Feierabend-Drinks.'
                      : 'Wind down the workday with colleagues over an Aperol Spritz. Our central location near the main station makes us ideal for after-work drinks.'}
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-serif font-semibold mb-2">{language === 'de' ? 'Date Night' : 'Date Night'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Der perfekte Start für einen romantischen Abend. Ein Bellini an der Bar, bevor es zum Dinner geht – la dolce vita in München.'
                      : 'The perfect start to a romantic evening. A Bellini at the bar before dinner – la dolce vita in Munich.'}
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-serif font-semibold mb-2">{language === 'de' ? 'Nach dem Museum' : 'After the Museum'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Die Pinakotheken und das Lenbachhaus sind nur wenige Gehminuten entfernt. Verarbeiten Sie Ihre Kunsteindrücke bei einem Glas Wein im STORIA.'
                      : 'The Pinakothek museums and Lenbachhaus are just a few minutes walk away. Process your art impressions over a glass of wine at STORIA.'}
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-serif font-semibold mb-2">{language === 'de' ? 'Sommerabende' : 'Summer Evenings'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Genießen Sie Ihren Aperitivo auf unserer Terrasse im Herzen der Maxvorstadt. Italienisches Flair unter Münchner Abendhimmel.'
                      : 'Enjoy your aperitivo on our terrace in the heart of Maxvorstadt. Italian flair under Munich\'s evening sky.'}
                  </p>
                </div>
              </div>
            </section>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <Button size="lg" asChild>
                <Link to="/getraenke">{language === 'de' ? 'Getränkekarte ansehen' : 'View Drinks Menu'}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/reservierung">{language === 'de' ? 'Tisch reservieren' : 'Book a Table'}</Link>
              </Button>
            </div>

            {/* FAQ Section */}
            <section className="bg-card p-8 rounded-lg border border-border mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? 'Häufige Fragen zum Aperitivo' : 'Frequently Asked Questions'}
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
                <Link to="/romantisches-dinner-muenchen" className="text-sm text-primary hover:underline">
                  {language === 'de' ? 'Romantisches Dinner →' : 'Romantic Dinner →'}
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/lunch-muenchen-maxvorstadt" className="text-sm text-primary hover:underline">
                  {language === 'de' ? 'Italienischer Lunch →' : 'Italian Lunch →'}
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/speisekarte" className="text-sm text-primary hover:underline">
                  {language === 'de' ? 'Unsere Speisekarte →' : 'Our Menu →'}
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

export default AperitivoMuenchen;
