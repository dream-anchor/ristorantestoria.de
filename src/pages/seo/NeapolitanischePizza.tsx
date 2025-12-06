import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Flame, Clock, Leaf, Award } from "lucide-react";
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
import ravioliImage from "@/assets/ravioli.webp";
import pastaImage from "@/assets/pasta.jpg";
import meeresfruchteImage from "@/assets/meeresfruchte.webp";
import tiramisuImage from "@/assets/tiramisu.webp";

const NeapolitanischePizza = () => {
  const { language } = useLanguage();

  const uspItems: USPItem[] = [
    {
      icon: Flame,
      title: language === 'de' ? 'Steinofen 485°C' : 'Stone Oven 900°F',
      description: language === 'de' ? 'Traditionell holzbefeuert' : 'Traditionally wood-fired',
    },
    {
      icon: Clock,
      title: language === 'de' ? '48h Teigruhe' : '48h Dough Rest',
      description: language === 'de' ? 'Perfekte Fermentation' : 'Perfect fermentation',
    },
    {
      icon: Leaf,
      title: 'San-Marzano',
      description: language === 'de' ? 'Originale Zutaten aus Italien' : 'Original ingredients from Italy',
    },
    {
      icon: Award,
      title: 'UNESCO-Erbe',
      description: language === 'de' ? 'Neapolitanische Tradition' : 'Neapolitan tradition',
    },
  ];

  const galleryImages = [
    { src: ravioliImage, alt: language === 'de' ? 'Italienische Küche' : 'Italian cuisine' },
    { src: pastaImage, alt: language === 'de' ? 'Frische Pasta' : 'Fresh pasta' },
    { src: meeresfruchteImage, alt: language === 'de' ? 'Meeresfrüchte' : 'Seafood' },
    { src: tiramisuImage, alt: language === 'de' ? 'Tiramisu Dessert' : 'Tiramisu dessert' },
  ];

  const testimonials = [
    {
      quote: language === 'de' 
        ? "Beste neapolitanische Pizza in München! Der Teig ist perfekt – weich und knusprig zugleich."
        : "Best Neapolitan pizza in Munich! The dough is perfect – soft and crispy at the same time.",
      author: "Michael K.",
    },
    {
      quote: language === 'de'
        ? "Endlich echte Pizza wie in Napoli. Die San-Marzano-Tomaten machen den Unterschied!"
        : "Finally real pizza like in Naples. The San Marzano tomatoes make the difference!",
      author: "Sofia R.",
    },
    {
      quote: language === 'de'
        ? "Wir kommen jede Woche – die Margherita ist einfach unschlagbar."
        : "We come every week – the Margherita is simply unbeatable.",
      author: "Familie Wagner",
    },
  ];

  const faqItems = language === 'de' ? [
    {
      question: "Ist die Pizza wirklich neapolitanisch?",
      answer: "Ja! Unsere Pizzen werden nach authentisch neapolitanischer Art zubereitet: langer Teigruhe (48-72 Stunden), italienisches Tipo-00-Mehl, San-Marzano-Tomaten und Fior di Latte aus Kampanien. Der Teig wird im Steinofen bei hoher Temperatur gebacken – genau wie in Neapel."
    },
    {
      question: "Welche Pizzen sind vegetarisch oder vegan?",
      answer: "Vegetarische Optionen: Margherita, Quattro Formaggi, Pizza Verdure und weitere. Vegane Pizza bieten wir auf Anfrage an – mit veganem Käse-Ersatz und frischem Gemüse. Sprechen Sie uns gerne an!"
    },
    {
      question: "Gibt es glutenfreie Pizza?",
      answer: "Ja, wir bieten glutenfreien Pizzateig als Alternative an. Bitte informieren Sie uns bei der Bestellung über Ihren Wunsch. Hinweis: Die Zubereitung erfolgt in der gleichen Küche wie unsere regulären Produkte."
    },
    {
      question: "Kann ich Pizza zum Mitnehmen bestellen?",
      answer: "Ja, selbstverständlich! Sie können telefonisch unter +49 89 51519696 vorbestellen und Ihre Pizza bei uns abholen. Die Pizza wird frisch zubereitet und ist innerhalb von 15-20 Minuten nach Bestellung abholbereit."
    },
    {
      question: "Was macht neapolitanische Pizza besonders?",
      answer: "Neapolitanische Pizza zeichnet sich durch einen weichen, luftigen Teig mit leicht verkohltem Rand (\"Cornicione\"), hochwertige Zutaten und eine kurze Backzeit von nur 60-90 Sekunden bei extremer Hitze aus. Der Boden ist weich und elastisch, der Rand knusprig – ein geschütztes kulinarisches Erbe (UNESCO Weltkulturerbe seit 2017)."
    }
  ] : [
    {
      question: "Is the pizza really Neapolitan?",
      answer: "Yes! Our pizzas are prepared in authentic Neapolitan style: long dough rest (48-72 hours), Italian Tipo 00 flour, San Marzano tomatoes and Fior di Latte from Campania. The dough is baked in a stone oven at high temperature – just like in Naples."
    },
    {
      question: "Which pizzas are vegetarian or vegan?",
      answer: "Vegetarian options: Margherita, Quattro Formaggi, Pizza Verdure and more. We offer vegan pizza on request – with vegan cheese substitute and fresh vegetables. Just ask us!"
    },
    {
      question: "Is there gluten-free pizza?",
      answer: "Yes, we offer gluten-free pizza dough as an alternative. Please let us know when ordering. Note: Preparation takes place in the same kitchen as our regular products."
    },
    {
      question: "Can I order pizza to take away?",
      answer: "Yes, of course! You can pre-order by phone at +49 89 51519696 and pick up your pizza from us. The pizza is freshly prepared and ready for pickup within 15-20 minutes after ordering."
    },
    {
      question: "What makes Neapolitan pizza special?",
      answer: "Neapolitan pizza is characterized by a soft, airy dough with a slightly charred rim (\"Cornicione\"), high-quality ingredients and a short baking time of only 60-90 seconds at extreme heat. The base is soft and elastic, the rim crispy – a protected culinary heritage (UNESCO World Heritage since 2017)."
    }
  ];

  return (
    <>
      <SEO 
        title={language === 'de' ? 'Neapolitanische Pizza München – Steinofen Pizzeria STORIA' : 'Neapolitan Pizza Munich – Stone Oven Pizzeria STORIA'}
        description={language === 'de' 
          ? 'Neapolitanische Pizza München im STORIA: Authentische Steinofen-Pizza in der Maxvorstadt. San-Marzano-Tomaten, Fior di Latte, 48h Teigruhe. Pizzeria nahe Königsplatz. Jetzt reservieren!'
          : 'Neapolitan pizza Munich at STORIA: Authentic stone-oven pizza in Maxvorstadt. San Marzano tomatoes, Fior di Latte, 48h dough rest. Pizzeria near Königsplatz. Book now!'}
        canonical="/neapolitanische-pizza-muenchen"
      />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: language === 'de' ? 'Neapolitanische Pizza München' : 'Neapolitan Pizza Munich', url: '/neapolitanische-pizza-muenchen' }
        ]} 
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <Navigation />
        
        {/* 1. Parallax Hero */}
        <ParallaxHero
          image={ravioliImage}
          headline={language === 'de' ? 'Neapolitanische Pizza München' : 'Neapolitan Pizza Munich'}
          subheadline={language === 'de' 
            ? 'UNESCO-Weltkulturerbe – 60 Sekunden, 485°C, pures Glück'
            : 'UNESCO World Heritage – 60 seconds, 900°F, pure happiness'}
          primaryCTA={{ text: language === 'de' ? 'Tisch reservieren' : 'Book a Table', href: '/reservierung' }}
          secondaryCTA={{ text: language === 'de' ? 'Speisekarte' : 'Menu', href: '/speisekarte' }}
        />

        {/* 2. USP Teaser */}
        <USPTeaser items={uspItems} />
        
        <main className="flex-grow">
          {/* 3. Main Content */}
          <section className="container mx-auto px-4 py-12">
            <article className="max-w-4xl mx-auto">
              {/* L'Arte della Pizza Section */}
              <div className="bg-card p-8 rounded-lg border border-border mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                  {language === 'de' ? "L'Arte della Pizza – Die Kunst der Pizza" : "L'Arte della Pizza – The Art of Pizza"}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {language === 'de'
                    ? 'Die neapolitanische Pizza ist seit 2017 UNESCO-Weltkulturerbe – und das aus gutem Grund. Diese jahrhundertealte Tradition aus Neapel steht für höchste Qualität, einfache Perfektion und die Liebe zum Handwerk. Im STORIA pflegen wir diese Tradition mit Leidenschaft.'
                    : 'Neapolitan pizza has been a UNESCO World Heritage since 2017 – and for good reason. This centuries-old tradition from Naples stands for highest quality, simple perfection and love for the craft. At STORIA, we nurture this tradition with passion.'}
                </p>
                <div className="bg-secondary/50 p-6 rounded-lg">
                  <h3 className="font-serif font-semibold text-lg mb-3">
                    {language === 'de' ? 'Was macht echte neapolitanische Pizza aus?' : 'What Makes Authentic Neapolitan Pizza?'}
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• {language === 'de' ? 'Weicher, luftiger Teig mit charakteristischem Rand ("Cornicione")' : 'Soft, airy dough with characteristic rim ("Cornicione")'}</li>
                    <li>• {language === 'de' ? 'Nur wenige, hochwertige Zutaten' : 'Only a few, high-quality ingredients'}</li>
                    <li>• {language === 'de' ? 'Backzeit von nur 60-90 Sekunden' : 'Baking time of only 60-90 seconds'}</li>
                    <li>• {language === 'de' ? 'Leicht verkohlte Blasen am Rand' : 'Slightly charred bubbles on the rim'}</li>
                    <li>• {language === 'de' ? 'Weicher, elastischer Boden' : 'Soft, elastic base'}</li>
                  </ul>
                </div>
              </div>

              {/* Dough Art Section */}
              <section className="bg-secondary/50 p-8 rounded-lg mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                  {language === 'de' ? 'Die Kunst des Teigs' : 'The Art of Dough'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {language === 'de'
                    ? 'Der Teig ist das Herzstück jeder Pizza. Bei uns ruht er 48 bis 72 Stunden, um seinen charakteristischen Geschmack zu entwickeln. Wir verwenden nur italienisches Tipo-00-Mehl, Wasser, Salz und natürliche Hefe.'
                    : 'The dough is the heart of every pizza. With us, it rests for 48 to 72 hours to develop its characteristic taste. We only use Italian Tipo 00 flour, water, salt and natural yeast.'}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-background rounded-lg">
                    <p className="text-2xl font-serif font-bold text-primary">48-72h</p>
                    <p className="text-xs text-muted-foreground">{language === 'de' ? 'Teigruhe' : 'Dough Rest'}</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <p className="text-2xl font-serif font-bold text-primary">Tipo 00</p>
                    <p className="text-xs text-muted-foreground">{language === 'de' ? 'Italienisches Mehl' : 'Italian Flour'}</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <p className="text-2xl font-serif font-bold text-primary">485°C</p>
                    <p className="text-xs text-muted-foreground">{language === 'de' ? 'Steinofen' : 'Stone Oven'}</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <p className="text-2xl font-serif font-bold text-primary">60-90s</p>
                    <p className="text-xs text-muted-foreground">{language === 'de' ? 'Backzeit' : 'Baking Time'}</p>
                  </div>
                </div>
              </section>

              {/* Pizza Classics */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6 text-center">
                  {language === 'de' ? 'Unsere Pizza-Klassiker' : 'Our Pizza Classics'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="font-serif font-semibold text-lg mb-2">Margherita</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Der Klassiker: San-Marzano-Tomaten, Fior di Latte, frischer Basilikum, Olivenöl.'
                        : 'The classic: San Marzano tomatoes, Fior di Latte, fresh basil, olive oil.'}
                    </p>
                  </div>
                  <div className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="font-serif font-semibold text-lg mb-2">Marinara</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Die Ur-Pizza: Tomaten, Knoblauch, Oregano, Olivenöl – ohne Käse.'
                        : 'The original: Tomatoes, garlic, oregano, olive oil – without cheese.'}
                    </p>
                  </div>
                  <div className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="font-serif font-semibold text-lg mb-2">Diavola</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Für Liebhaber von Schärfe: Scharfe Salami, Tomaten, Mozzarella.'
                        : 'For lovers of spice: Spicy salami, tomatoes, mozzarella.'}
                    </p>
                  </div>
                  <div className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="font-serif font-semibold text-lg mb-2">Quattro Formaggi</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Vier italienische Käsesorten – cremig, aromatisch, unwiderstehlich.'
                        : 'Four Italian cheeses – creamy, aromatic, irresistible.'}
                    </p>
                  </div>
                </div>
              </section>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 justify-center mb-12">
                <Button size="lg" asChild>
                  <Link to="/speisekarte">{language === 'de' ? 'Speisekarte ansehen' : 'View Menu'}</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/reservierung">{language === 'de' ? 'Tisch reservieren' : 'Book a Table'}</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="tel:+498951519696">{language === 'de' ? 'Zum Mitnehmen' : 'Takeaway'}</a>
                </Button>
              </div>
            </article>
          </section>

          {/* 4. CTA Intermediate */}
          <CTAIntermediate 
            headline={language === 'de' ? 'Lust auf echte Pizza?' : 'Craving Real Pizza?'}
            text={language === 'de' 
              ? 'Reservieren Sie jetzt und genießen Sie authentische neapolitanische Pizza.'
              : 'Book now and enjoy authentic Neapolitan pizza.'}
            primaryCTA={{ text: language === 'de' ? 'Tisch reservieren' : 'Book a Table', href: '/reservierung' }}
            secondaryCTA={{ text: language === 'de' ? 'Anrufen' : 'Call', href: 'tel:+498951519696' }}
          />

          {/* 5. Food Gallery */}
          <FoodGallery images={galleryImages} />

          {/* 6. Local SEO Block */}
          <LocalSEOBlock
            title={language === 'de' ? 'Ihre Pizzeria in der Maxvorstadt' : 'Your Pizzeria in Maxvorstadt'}
            description={language === 'de'
              ? 'Das STORIA liegt zentral in der Münchner Maxvorstadt, nur 3 Minuten vom Königsplatz und 5 Minuten vom Hauptbahnhof entfernt. Genießen Sie authentische neapolitanische Pizza in entspannter Atmosphäre – oder bestellen Sie zum Mitnehmen.'
              : 'STORIA is centrally located in Munich\'s Maxvorstadt, just 3 minutes from Königsplatz and 5 minutes from the main station. Enjoy authentic Neapolitan pizza in a relaxed atmosphere – or order takeaway.'}
          />

          {/* 7. Social Proof */}
          <SocialProof testimonials={testimonials} />

          {/* 8. FAQ Section */}
          <section className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card p-8 rounded-lg border border-border mb-10">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                  {language === 'de' ? 'Häufige Fragen zur Pizza' : 'Frequently Asked Questions'}
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
                  <Link to="/lunch-muenchen-maxvorstadt" className="text-sm text-primary hover:underline">
                    {language === 'de' ? 'Pizza zum Lunch →' : 'Pizza for Lunch →'}
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link to="/aperitivo-muenchen" className="text-sm text-primary hover:underline">
                    {language === 'de' ? 'Aperitivo dazu →' : 'Aperitivo with it →'}
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link to="/geburtstagsfeier-muenchen" className="text-sm text-primary hover:underline">
                    {language === 'de' ? 'Pizza-Party →' : 'Pizza Party →'}
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

export default NeapolitanischePizza;