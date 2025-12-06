import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import { useLanguage } from "@/contexts/LanguageContext";
import { Wine, Clock, Sun, Sparkles } from "lucide-react";
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
import cocktailsImage from "@/assets/cocktails.webp";
import weinserviceImage from "@/assets/weinservice.webp";
import aussenImage from "@/assets/aussen.webp";
import menschenAussenImage from "@/assets/menschen-aussen.jpeg";

const AperitivoMuenchen = () => {
  const { language } = useLanguage();

  const uspItems: USPItem[] = [
    {
      icon: Wine,
      title: language === 'de' ? 'Italienische Cocktails' : 'Italian Cocktails',
      description: language === 'de' ? 'Aperol Spritz, Negroni & mehr' : 'Aperol Spritz, Negroni & more',
    },
    {
      icon: Clock,
      title: language === 'de' ? 'Notturno 21-22:30' : 'Notturno 9-10:30 PM',
      description: language === 'de' ? 'Spezial-Angebot am Abend' : 'Special evening offer',
    },
    {
      icon: Sun,
      title: language === 'de' ? 'Sonnige Terrasse' : 'Sunny Terrace',
      description: language === 'de' ? 'Golden Hour genießen' : 'Enjoy golden hour',
    },
    {
      icon: Sparkles,
      title: language === 'de' ? 'Authentisch' : 'Authentic',
      description: language === 'de' ? 'Echte italienische Tradition' : 'Real Italian tradition',
    },
  ];

  const galleryImages = [
    { src: cocktailsImage, alt: language === 'de' ? 'Aperol Spritz Cocktails' : 'Aperol Spritz cocktails' },
    { src: weinserviceImage, alt: language === 'de' ? 'Italienischer Weinservice' : 'Italian wine service' },
    { src: aussenImage, alt: language === 'de' ? 'Außenbereich STORIA' : 'STORIA exterior' },
    { src: menschenAussenImage, alt: language === 'de' ? 'Gäste auf der Terrasse' : 'Guests on terrace' },
  ];

  const testimonials = [
    {
      quote: language === 'de' 
        ? "Bester After-Work-Spot in der Maxvorstadt! Toller Spritz, tolle Stimmung."
        : "Best after-work spot in Maxvorstadt! Great Spritz, great atmosphere.",
      author: "Julia R.",
    },
    {
      quote: language === 'de'
        ? "Perfekter Ort für einen Aperitivo vor dem Dinner. Echtes italienisches Flair!"
        : "Perfect place for an aperitivo before dinner. Real Italian flair!",
      author: "Marco T.",
    },
    {
      quote: language === 'de'
        ? "Die Terrasse im Sommer ist ein Traum. Wir kommen jede Woche!"
        : "The terrace in summer is a dream. We come every week!",
      author: "Lisa M.",
    },
  ];

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
        <Navigation />
        
        {/* 1. Parallax Hero */}
        <ParallaxHero
          image={cocktailsImage}
          headline={language === 'de' ? 'Aperitivo München' : 'Aperitivo Munich'}
          subheadline={language === 'de' 
            ? 'La Dolce Vita beginnt mit einem Spritz – täglich ab 17 Uhr'
            : 'La Dolce Vita starts with a Spritz – daily from 5 PM'}
          primaryCTA={{ text: language === 'de' ? 'Tisch reservieren' : 'Book a Table', href: '/reservierung' }}
          secondaryCTA={{ text: language === 'de' ? 'Getränkekarte' : 'Drinks Menu', href: '/getraenke' }}
        />

        {/* 2. USP Teaser */}
        <USPTeaser items={uspItems} />
        
        <main className="flex-grow">
          {/* 3. Main Content */}
          <section className="container mx-auto px-4 py-12">
            <article className="max-w-4xl mx-auto">
              {/* Aperitivo Culture Section */}
              <div className="bg-card p-8 rounded-lg border border-border mb-10">
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
                      ? 'Der Aperitivo (vom lateinischen "aperire" – öffnen) ist eine italienische Tradition, die den Appetit vor dem Abendessen anregen soll. Typischerweise genießt man zwischen 18 und 21 Uhr leichte, bittere Cocktails oder Wein, begleitet von kleinen Snacks – den Stuzzichini.'
                      : 'The aperitivo (from Latin "aperire" – to open) is an Italian tradition meant to stimulate the appetite before dinner. Typically enjoyed between 6 and 9 PM, it involves light, bitter cocktails or wine, accompanied by small snacks – the stuzzichini.'}
                  </p>
                </div>
              </div>

              {/* STORIA Notturno */}
              <section className="bg-primary/5 p-8 rounded-lg mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                  {language === 'de' ? 'STORIA Notturno – Late Night Aperitivo' : 'STORIA Notturno – Late Night Aperitivo'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {language === 'de'
                    ? 'Täglich von 21:00 bis 22:30 Uhr laden wir Sie ein zum STORIA Notturno – unserem Late Night Aperitivo im italienischen Stil. Genießen Sie ausgewählte Cocktails und Stuzzichini in entspannter Atmosphäre.'
                    : 'Daily from 9:00 PM to 10:30 PM, we invite you to STORIA Notturno – our Late Night Aperitivo Italian style. Enjoy selected cocktails and stuzzichini in a relaxed atmosphere.'}
                </p>
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="font-serif text-lg text-primary">STORIA Notturno</p>
                  <p className="text-2xl font-bold">21:00 – 22:30</p>
                  <p className="text-sm text-muted-foreground">{language === 'de' ? 'Täglich' : 'Daily'}</p>
                </div>
              </section>

              {/* Aperitivo Classics */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6 text-center">
                  {language === 'de' ? 'Unsere Aperitivo-Klassiker' : 'Our Aperitivo Classics'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="font-serif font-semibold text-lg mb-2">Aperol Spritz</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Der Klassiker schlechthin – Aperol, Prosecco und Soda, garniert mit einer Orangenscheibe.'
                        : 'The quintessential classic – Aperol, Prosecco and soda, garnished with an orange slice.'}
                    </p>
                  </div>
                  <div className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="font-serif font-semibold text-lg mb-2">Negroni</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Für Kenner: Gin, Campari und roter Wermut zu gleichen Teilen. Kraftvoll und elegant.'
                        : 'For connoisseurs: Gin, Campari and red vermouth in equal parts. Powerful and elegant.'}
                    </p>
                  </div>
                  <div className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="font-serif font-semibold text-lg mb-2">Hugo</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Leicht und blumig – Prosecco mit Holunderblütensirup, Minze und Soda.'
                        : 'Light and floral – Prosecco with elderflower syrup, mint and soda.'}
                    </p>
                  </div>
                  <div className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="font-serif font-semibold text-lg mb-2">Bellini</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Venezianische Eleganz – Prosecco mit frischem Pfirsichpüree.'
                        : 'Venetian elegance – Prosecco with fresh peach puree.'}
                    </p>
                  </div>
                </div>
              </section>
            </article>
          </section>

          {/* 4. CTA Intermediate */}
          <CTAIntermediate 
            headline={language === 'de' ? 'Lust auf Aperitivo?' : 'In the Mood for Aperitivo?'}
            text={language === 'de' 
              ? 'Kommen Sie vorbei oder reservieren Sie Ihren Tisch für den perfekten Feierabend.'
              : 'Drop by or book your table for the perfect evening.'}
            primaryCTA={{ text: language === 'de' ? 'Tisch reservieren' : 'Book a Table', href: '/reservierung' }}
            secondaryCTA={{ text: language === 'de' ? 'Getränkekarte' : 'Drinks Menu', href: '/getraenke' }}
          />

          {/* 5. Food Gallery */}
          <FoodGallery images={galleryImages} />

          {/* 6. Local SEO Block */}
          <LocalSEOBlock
            title={language === 'de' ? 'Ihre Aperitivo-Bar in der Maxvorstadt' : 'Your Aperitivo Bar in Maxvorstadt'}
            description={language === 'de'
              ? 'Das STORIA liegt zentral in München-Maxvorstadt, nur 3 Minuten vom Königsplatz und 5 Minuten vom Hauptbahnhof entfernt. Die perfekte Location für After-Work-Drinks mit Kollegen oder einen entspannten Aperitivo vor dem Abendessen. Unsere sonnige Terrasse lädt im Sommer zum Verweilen ein.'
              : 'STORIA is centrally located in Munich-Maxvorstadt, just 3 minutes from Königsplatz and 5 minutes from the main station. The perfect location for after-work drinks with colleagues or a relaxed aperitivo before dinner. Our sunny terrace invites you to linger in summer.'}
          />

          {/* 7. Social Proof */}
          <SocialProof testimonials={testimonials} />

          {/* 8. FAQ Section */}
          <section className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card p-8 rounded-lg border border-border mb-10">
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
              </div>

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
                  <Link to="/neapolitanische-pizza-muenchen" className="text-sm text-primary hover:underline">
                    {language === 'de' ? 'Neapolitanische Pizza →' : 'Neapolitan Pizza →'}
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link to="/eventlocation-muenchen-maxvorstadt" className="text-sm text-primary hover:underline">
                    {language === 'de' ? 'Eventlocation →' : 'Event Location →'}
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

export default AperitivoMuenchen;