import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { PartyPopper, Users, Cake, Star } from "lucide-react";
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
import tiramisuImage from "@/assets/tiramisu.webp";
import cocktailsImage from "@/assets/cocktails.webp";
import pastaImage from "@/assets/pasta.jpg";
import menschenAussenImage from "@/assets/menschen-aussen.jpeg";

const GeburtstagsfeierMuenchen = () => {
  const { language } = useLanguage();

  const uspItems: USPItem[] = [
    {
      icon: PartyPopper,
      title: language === 'de' ? 'Geburtstags-Specials' : 'Birthday Specials',
      description: language === 'de' ? 'Torte, Serenade, Dekoration' : 'Cake, serenade, decoration',
    },
    {
      icon: Users,
      title: language === 'de' ? '8-60 Personen' : '8-60 People',
      description: language === 'de' ? 'Kleine bis große Feiern' : 'Small to large parties',
    },
    {
      icon: Cake,
      title: language === 'de' ? 'Torte willkommen' : 'Cake Welcome',
      description: language === 'de' ? 'Mitbringen oder organisieren' : 'Bring or we organize',
    },
    {
      icon: Star,
      title: language === 'de' ? 'Persönlich betreut' : 'Personal Service',
      description: language === 'de' ? 'Individuelle Wünsche möglich' : 'Individual requests possible',
    },
  ];

  const galleryImages = [
    { src: tiramisuImage, alt: language === 'de' ? 'Hausgemachtes Tiramisu' : 'Homemade tiramisu' },
    { src: cocktailsImage, alt: language === 'de' ? 'Geburtstags-Cocktails' : 'Birthday cocktails' },
    { src: pastaImage, alt: language === 'de' ? 'Geburtstags-Menü' : 'Birthday menu' },
    { src: menschenAussenImage, alt: language === 'de' ? 'Feier auf der Terrasse' : 'Party on terrace' },
  ];

  const testimonials = [
    {
      quote: language === 'de' 
        ? "Mein 50. Geburtstag war unvergesslich! Das Team hat alles perfekt organisiert."
        : "My 50th birthday was unforgettable! The team organized everything perfectly.",
      author: "Petra S.",
    },
    {
      quote: language === 'de'
        ? "Die Überraschungsfeier für meinen Mann war ein voller Erfolg. Danke STORIA!"
        : "The surprise party for my husband was a complete success. Thank you STORIA!",
      author: "Maria K.",
    },
    {
      quote: language === 'de'
        ? "Tanti Auguri! Die italienische Geburtstagsserenade war das Highlight des Abends."
        : "Tanti Auguri! The Italian birthday serenade was the highlight of the evening.",
      author: "Familie Huber",
    },
  ];

  const faqItems = language === 'de' ? [
    {
      question: "Kann ich meine eigene Geburtstagstorte mitbringen?",
      answer: "Ja, Sie können gerne Ihre eigene Torte mitbringen – wir stellen sie für Sie kühl und servieren sie zum gewünschten Zeitpunkt mit Tellern und Besteck. Alternativ können wir auch eine Torte für Sie organisieren oder empfehlen unser hausgemachtes Tiramisu als süßen Abschluss."
    },
    {
      question: "Gibt es spezielle Geburtstags-Rabatte oder -Angebote?",
      answer: "Das Geburtstagskind erhält bei uns ein Glas Prosecco und ein kleines Dessert-Überraschung aufs Haus. Für größere Gruppen erstellen wir gerne ein individuelles Paket-Angebot. Kontaktieren Sie uns für Details."
    },
    {
      question: "Was kostet ein Geburtstags-Menü pro Person?",
      answer: "Die Kosten hängen von Ihren Wünschen ab. Ein 3-Gang-Menü beginnt bei attraktiven Preisen, ein festliches 4-Gang-Menü mit Weinbegleitung entsprechend mehr. Wir erstellen gerne ein individuelles Angebot passend zu Ihrem Budget."
    },
    {
      question: "Kann ich das Restaurant nur für meine Feier buchen?",
      answer: "Ja, ab ca. 40 Gästen bieten wir die Möglichkeit einer Exklusiv-Buchung. Sie haben dann das gesamte Restaurant für sich – perfekt für runde Geburtstage oder größere Familienfeiern."
    },
    {
      question: "Wie weit im Voraus sollte ich für eine Geburtstagsfeier reservieren?",
      answer: "Wir empfehlen, 2-4 Wochen im Voraus zu reservieren, besonders am Wochenende. Für größere Gruppen (ab 20 Personen) oder Exklusiv-Buchungen sollten Sie 4-6 Wochen einplanen."
    }
  ] : [
    {
      question: "Can I bring my own birthday cake?",
      answer: "Yes, you are welcome to bring your own cake – we will store it for you and serve it at the desired time with plates and cutlery. Alternatively, we can organize a cake for you or recommend our homemade tiramisu as a sweet finale."
    },
    {
      question: "Are there special birthday discounts or offers?",
      answer: "The birthday person receives a complimentary glass of Prosecco and a small dessert surprise on the house. For larger groups, we are happy to create an individual package offer. Contact us for details."
    },
    {
      question: "How much does a birthday menu cost per person?",
      answer: "Costs depend on your wishes. A 3-course menu starts at attractive prices, a festive 4-course menu with wine pairing accordingly more. We are happy to create an individual offer to match your budget."
    },
    {
      question: "Can I book the restaurant exclusively for my celebration?",
      answer: "Yes, from about 40 guests we offer the possibility of exclusive booking. You then have the entire restaurant to yourself – perfect for milestone birthdays or larger family celebrations."
    },
    {
      question: "How far in advance should I book for a birthday party?",
      answer: "We recommend booking 2-4 weeks in advance, especially on weekends. For larger groups (from 20 people) or exclusive bookings, you should plan 4-6 weeks."
    }
  ];

  return (
    <>
      <SEO 
        title={language === 'de' ? 'Geburtstag feiern München – Party im Italiener STORIA' : 'Birthday Party Munich – Celebration at Italian Restaurant STORIA'}
        description={language === 'de' 
          ? 'Geburtstag feiern München im STORIA: Italienisches Restaurant in der Maxvorstadt für 10-60 Gäste. Individuelle Menüs, Torte & Überraschungen. Jetzt Geburtstagsfeier planen!'
          : 'Birthday party Munich at STORIA: Italian restaurant in Maxvorstadt for 10-60 guests. Individual menus, cake & surprises. Plan your birthday celebration now!'}
        canonical="/geburtstagsfeier-muenchen"
      />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: language === 'de' ? 'Geburtstagsfeier München' : 'Birthday Party Munich', url: '/geburtstagsfeier-muenchen' }
        ]} 
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <Navigation />
        
        {/* 1. Parallax Hero */}
        <ParallaxHero
          image={tiramisuImage}
          headline={language === 'de' ? 'Geburtstag feiern München' : 'Birthday Party Munich'}
          subheadline={language === 'de' 
            ? 'Tanti Auguri! – Feiern Sie italienisch mit Familie & Freunden'
            : 'Tanti Auguri! – Celebrate Italian style with family & friends'}
          primaryCTA={{ text: language === 'de' ? 'Feier anfragen' : 'Inquire About Party', href: '/kontakt' }}
          secondaryCTA={{ text: language === 'de' ? 'Anrufen' : 'Call', href: 'tel:+498951519696' }}
        />

        {/* 2. USP Teaser */}
        <USPTeaser items={uspItems} />
        
        <main className="flex-grow">
          {/* 3. Main Content */}
          <section className="container mx-auto px-4 py-12">
            <article className="max-w-4xl mx-auto">
              {/* Tanti Auguri Section */}
              <div className="bg-card p-8 rounded-lg border border-border mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                  {language === 'de' ? 'Tanti Auguri! – Feiern auf Italienisch' : 'Tanti Auguri! – Celebrate Italian Style'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {language === 'de'
                    ? 'In Italien wird der Geburtstag mit Familie, Freunden und gutem Essen gefeiert – genau das möchten wir im STORIA für Sie möglich machen. Unsere italienische Herzlichkeit, die warme Atmosphäre und die Liebe zum Detail sorgen dafür, dass Ihr Ehrentag zu einem unvergesslichen Erlebnis wird.'
                    : 'In Italy, birthdays are celebrated with family, friends and good food – that\'s exactly what we want to make possible for you at STORIA. Our Italian warmth, the cozy atmosphere and attention to detail ensure that your special day becomes an unforgettable experience.'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">{language === 'de' ? 'Was wir bieten' : 'What We Offer'}</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>✓ {language === 'de' ? 'Platz für 10 bis 60 Gäste' : 'Space for 10 to 60 guests'}</li>
                      <li>✓ {language === 'de' ? 'Individuelle Menügestaltung' : 'Individual menu design'}</li>
                      <li>✓ {language === 'de' ? 'Torte mitbringen oder organisieren' : 'Bring your own cake or we organize'}</li>
                      <li>✓ {language === 'de' ? 'Persönliche Grußkarte vom Team' : 'Personal greeting card from team'}</li>
                      <li>✓ {language === 'de' ? 'Dekoration nach Absprache' : 'Decoration by arrangement'}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">{language === 'de' ? 'Besondere Extras' : 'Special Extras'}</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>✓ {language === 'de' ? 'Prosecco für das Geburtstagskind' : 'Prosecco for the birthday person'}</li>
                      <li>✓ {language === 'de' ? '"Tanti Auguri"-Serenade' : '"Tanti Auguri" serenade'}</li>
                      <li>✓ {language === 'de' ? 'Dessert-Überraschung' : 'Dessert surprise'}</li>
                      <li>✓ {language === 'de' ? 'Blumen am Tisch (auf Anfrage)' : 'Flowers at table (on request)'}</li>
                      <li>✓ {language === 'de' ? 'Menükarten mit Namen' : 'Menu cards with names'}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Group Sizes */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6 text-center">
                  {language === 'de' ? 'Die richtige Größe für Ihre Feier' : 'The Right Size for Your Celebration'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card p-6 rounded-lg border border-border text-center">
                    <p className="text-3xl font-serif font-bold text-primary mb-2">10-15</p>
                    <p className="font-semibold mb-2">{language === 'de' ? 'Personen' : 'People'}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Großer Tisch im Restaurant. Ideal für intime Feiern im Freundeskreis.'
                        : 'Large table in the restaurant. Ideal for intimate celebrations with friends.'}
                    </p>
                  </div>
                  <div className="bg-card p-6 rounded-lg border-2 border-primary text-center">
                    <div className="text-xs text-primary font-semibold mb-1">{language === 'de' ? 'BELIEBT' : 'POPULAR'}</div>
                    <p className="text-3xl font-serif font-bold text-primary mb-2">15-30</p>
                    <p className="font-semibold mb-2">{language === 'de' ? 'Personen' : 'People'}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Separierter Bereich. Perfekt für Familienfeiern und runde Geburtstage.'
                        : 'Separated area. Perfect for family celebrations and milestone birthdays.'}
                    </p>
                  </div>
                  <div className="bg-card p-6 rounded-lg border border-border text-center">
                    <p className="text-3xl font-serif font-bold text-primary mb-2">30-60</p>
                    <p className="font-semibold mb-2">{language === 'de' ? 'Personen' : 'People'}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Exklusiv-Buchung möglich. Das ganze Restaurant für Ihre große Feier.'
                        : 'Exclusive booking possible. The whole restaurant for your big celebration.'}
                    </p>
                  </div>
                </div>
              </section>

              {/* Popular Menus */}
              <section className="bg-secondary/50 p-8 rounded-lg mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                  {language === 'de' ? 'Beliebte Geburtstags-Menüs' : 'Popular Birthday Menus'}
                </h2>
                <div className="space-y-4">
                  <div className="bg-background p-4 rounded-lg">
                    <h3 className="font-serif font-semibold mb-2">{language === 'de' ? 'Antipasti-Platte zum Teilen' : 'Antipasti Platter to Share'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Bruschetta, Carpaccio, Burrata – perfekt zum gemeinsamen Genießen.'
                        : 'Bruschetta, carpaccio, burrata – perfect for sharing and enjoying together.'}
                    </p>
                  </div>
                  <div className="bg-background p-4 rounded-lg">
                    <h3 className="font-serif font-semibold mb-2">{language === 'de' ? 'Pizza-Party' : 'Pizza Party'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Verschiedene Pizzen aus unserem Steinofen – locker, gesellig und lecker.'
                        : 'Various pizzas from our stone oven – casual, convivial and delicious.'}
                    </p>
                  </div>
                  <div className="bg-background p-4 rounded-lg">
                    <h3 className="font-serif font-semibold mb-2">{language === 'de' ? 'Klassisches 3-Gang-Menü' : 'Classic 3-Course Menu'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Antipasto, Pasta oder Hauptgang, Dolce – ein festliches Menü für besondere Anlässe.'
                        : 'Antipasto, pasta or main course, dolce – a festive menu for special occasions.'}
                    </p>
                  </div>
                </div>
              </section>

              {/* CTA Section */}
              <section className="bg-primary/5 p-8 rounded-lg text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                  {language === 'de' ? 'Jetzt Geburtstagsfeier planen' : 'Plan Your Birthday Party Now'}
                </h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  {language === 'de'
                    ? 'Tanti Auguri! Kontaktieren Sie uns und wir machen Ihren Geburtstag unvergesslich.'
                    : 'Tanti Auguri! Contact us and we\'ll make your birthday unforgettable.'}
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
            headline={language === 'de' ? 'Bereit zu feiern?' : 'Ready to Celebrate?'}
            text={language === 'de' 
              ? 'Reservieren Sie jetzt für Ihre unvergessliche Geburtstagsfeier im STORIA.'
              : 'Book now for your unforgettable birthday party at STORIA.'}
            primaryCTA={{ text: language === 'de' ? 'Jetzt anfragen' : 'Inquire Now', href: '/kontakt' }}
            secondaryCTA={{ text: language === 'de' ? 'Speisekarte' : 'Menu', href: '/speisekarte' }}
          />

          {/* 5. Food Gallery */}
          <FoodGallery images={galleryImages} />

          {/* 6. Local SEO Block */}
          <LocalSEOBlock
            title={language === 'de' ? 'Feiern im Herzen Münchens' : 'Celebrate in the Heart of Munich'}
            description={language === 'de'
              ? 'Das STORIA in der Münchner Maxvorstadt ist perfekt erreichbar für Gäste aus der ganzen Stadt. Nur 3 Minuten vom Königsplatz und 5 Minuten vom Hauptbahnhof – ideal für Geburtstagsfeiern mit Freunden und Familie.'
              : 'STORIA in Munich\'s Maxvorstadt is perfectly accessible for guests from all over the city. Just 3 minutes from Königsplatz and 5 minutes from the main station – ideal for birthday parties with friends and family.'}
          />

          {/* 7. Social Proof */}
          <SocialProof testimonials={testimonials} />

          {/* 8. FAQ Section */}
          <section className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card p-8 rounded-lg border border-border mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                  {language === 'de' ? 'Häufige Fragen zur Geburtstagsfeier' : 'Frequently Asked Questions'}
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
                  <Link to="/firmenfeier-muenchen" className="text-sm text-primary hover:underline">
                    {language === 'de' ? 'Firmenfeiern →' : 'Corporate Events →'}
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

export default GeburtstagsfeierMuenchen;