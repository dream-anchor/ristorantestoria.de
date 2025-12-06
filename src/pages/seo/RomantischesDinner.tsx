import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, Wine, UtensilsCrossed, Gift } from "lucide-react";
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
import weinserviceImage from "@/assets/weinservice.webp";
import meeresfruchteImage from "@/assets/meeresfruchte.webp";
import tiramisuImage from "@/assets/tiramisu.webp";
import cocktailsImage from "@/assets/cocktails.webp";

const RomantischesDinner = () => {
  const { language } = useLanguage();

  const uspItems: USPItem[] = [
    {
      icon: Heart,
      title: language === 'de' ? 'Romantisches Ambiente' : 'Romantic Ambiance',
      description: language === 'de' ? 'Kerzen, gedämpftes Licht' : 'Candles, soft lighting',
    },
    {
      icon: Wine,
      title: language === 'de' ? 'Weinempfehlungen' : 'Wine Recommendations',
      description: language === 'de' ? 'Italienische Weine für jeden Gang' : 'Italian wines for each course',
    },
    {
      icon: UtensilsCrossed,
      title: language === 'de' ? 'Menü für Zwei' : 'Menu for Two',
      description: language === 'de' ? 'Antipasti zum Teilen' : 'Antipasti to share',
    },
    {
      icon: Gift,
      title: language === 'de' ? 'Überraschungen' : 'Surprises',
      description: language === 'de' ? 'Blumen, Dessert-Botschaft' : 'Flowers, dessert message',
    },
  ];

  const galleryImages = [
    { src: weinserviceImage, alt: language === 'de' ? 'Romantischer Weinservice' : 'Romantic wine service' },
    { src: meeresfruchteImage, alt: language === 'de' ? 'Frische Meeresfrüchte' : 'Fresh seafood' },
    { src: tiramisuImage, alt: language === 'de' ? 'Hausgemachtes Tiramisu' : 'Homemade tiramisu' },
    { src: cocktailsImage, alt: language === 'de' ? 'Aperitivo für Zwei' : 'Aperitivo for two' },
  ];

  const testimonials = [
    {
      quote: language === 'de' 
        ? "Der perfekte Ort für unseren Jahrestag! Romantisch, lecker und unvergesslich."
        : "The perfect place for our anniversary! Romantic, delicious and unforgettable.",
      author: "Anna & Stefan",
    },
    {
      quote: language === 'de'
        ? "Hier habe ich meinen Antrag gemacht – das Team hat alles perfekt organisiert!"
        : "I proposed here – the team organized everything perfectly!",
      author: "Markus L.",
    },
    {
      quote: language === 'de'
        ? "Unser Lieblingsrestaurant für Date Nights. Die Atmosphäre ist einfach magisch."
        : "Our favorite restaurant for date nights. The atmosphere is simply magical.",
      author: "Christina W.",
    },
  ];

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
        <Navigation />
        
        {/* 1. Parallax Hero */}
        <ParallaxHero
          image={weinserviceImage}
          headline={language === 'de' ? 'Romantisches Dinner München' : 'Romantic Dinner Munich'}
          subheadline={language === 'de' 
            ? 'La Dolce Vita zu zweit – Candlelight, Wein & authentische Küche'
            : 'La Dolce Vita for two – Candlelight, wine & authentic cuisine'}
          primaryCTA={{ text: language === 'de' ? 'Tisch reservieren' : 'Book a Table', href: '/reservierung' }}
          secondaryCTA={{ text: language === 'de' ? 'Speisekarte' : 'Menu', href: '/speisekarte' }}
        />

        {/* 2. USP Teaser */}
        <USPTeaser items={uspItems} />
        
        <main className="flex-grow">
          {/* 3. Main Content */}
          <section className="container mx-auto px-4 py-12">
            <article className="max-w-4xl mx-auto">
              {/* La Dolce Vita Section */}
              <div className="bg-card p-8 rounded-lg border border-border mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                  {language === 'de' ? 'La Dolce Vita zu Zweit' : 'La Dolce Vita for Two'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {language === 'de'
                    ? 'Im STORIA schaffen wir eine Atmosphäre, die Romantik und italienische Lebensfreude vereint. Gedämpftes Licht, stilvolle Einrichtung und der Duft frischer italienischer Küche bilden den perfekten Rahmen für Ihren besonderen Abend.'
                    : 'At STORIA, we create an atmosphere that combines romance and Italian joie de vivre. Soft lighting, stylish decor and the aroma of fresh Italian cuisine form the perfect setting for your special evening.'}
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
              </div>

              {/* Perfect Occasions */}
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

              {/* Culinary Seduction */}
              <section className="bg-secondary/50 p-8 rounded-lg mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                  {language === 'de' ? 'Kulinarische Verführung' : 'Culinary Seduction'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {language === 'de'
                    ? 'Ein romantisches Dinner im STORIA ist eine Reise durch die Aromen Italiens:'
                    : 'A romantic dinner at STORIA is a journey through the flavors of Italy:'}
                </p>
                <div className="space-y-4">
                  <div className="bg-background p-4 rounded-lg">
                    <h3 className="font-serif font-semibold mb-2">{language === 'de' ? '1. Antipasti zum Teilen' : '1. Antipasti to Share'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Bruschetta, Carpaccio oder Burrata – perfekt zum Teilen und gemeinsamen Genießen.'
                        : 'Bruschetta, carpaccio or burrata – perfect for sharing and enjoying together.'}
                    </p>
                  </div>
                  <div className="bg-background p-4 rounded-lg">
                    <h3 className="font-serif font-semibold mb-2">{language === 'de' ? '2. Pasta oder Pesce' : '2. Pasta or Pesce'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Hausgemachte Pasta oder frischer Fisch – zubereitet nach traditionellen Rezepten.'
                        : 'Homemade pasta or fresh fish – prepared according to traditional recipes.'}
                    </p>
                  </div>
                  <div className="bg-background p-4 rounded-lg">
                    <h3 className="font-serif font-semibold mb-2">{language === 'de' ? '3. Dolci für Verliebte' : '3. Dolci for Lovers'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Tiramisu für zwei oder Panna Cotta – der süße Abschluss eines perfekten Abends.'
                        : 'Tiramisu for two or panna cotta – the sweet ending to a perfect evening.'}
                    </p>
                  </div>
                </div>
              </section>
            </article>
          </section>

          {/* 4. CTA Intermediate */}
          <CTAIntermediate 
            headline={language === 'de' ? 'Planen Sie Ihr romantisches Dinner' : 'Plan Your Romantic Dinner'}
            text={language === 'de' 
              ? 'Reservieren Sie jetzt für einen unvergesslichen Abend zu zweit.'
              : 'Book now for an unforgettable evening for two.'}
            primaryCTA={{ text: language === 'de' ? 'Tisch reservieren' : 'Book a Table', href: '/reservierung' }}
            secondaryCTA={{ text: language === 'de' ? 'Anrufen' : 'Call', href: 'tel:+498951519696' }}
          />

          {/* 5. Food Gallery */}
          <FoodGallery images={galleryImages} />

          {/* 6. Local SEO Block */}
          <LocalSEOBlock
            title={language === 'de' ? 'Romantische Lage im Herzen Münchens' : 'Romantic Location in the Heart of Munich'}
            description={language === 'de'
              ? 'Das STORIA liegt in der Maxvorstadt – Münchens Kunst- und Kulturviertel. Verbinden Sie Ihr romantisches Dinner mit einem Besuch der Pinakotheken, des Lenbachhauses oder einem Abendspaziergang am Königsplatz. Perfekt für einen unvergesslichen Abend zu zweit.'
              : 'STORIA is located in Maxvorstadt – Munich\'s art and culture district. Combine your romantic dinner with a visit to the Pinakothek museums, the Lenbachhaus or an evening stroll at Königsplatz. Perfect for an unforgettable evening for two.'}
          />

          {/* 7. Social Proof */}
          <SocialProof testimonials={testimonials} />

          {/* 8. FAQ Section */}
          <section className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card p-8 rounded-lg border border-border mb-10">
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
              </div>

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
                  <Link to="/neapolitanische-pizza-muenchen" className="text-sm text-primary hover:underline">
                    {language === 'de' ? 'Neapolitanische Pizza →' : 'Neapolitan Pizza →'}
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link to="/geburtstagsfeier-muenchen" className="text-sm text-primary hover:underline">
                    {language === 'de' ? 'Geburtstagsfeier →' : 'Birthday Party →'}
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

export default RomantischesDinner;