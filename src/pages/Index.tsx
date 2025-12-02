import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ImageGrid from "@/components/ImageGrid";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { language } = useLanguage();

  const faqItems = language === 'de' ? [
    {
      question: 'Wie kann ich einen Tisch im STORIA reservieren?',
      answer: 'Sie können einen Tisch online über unsere Reservierungsseite buchen oder telefonisch unter +49 89 515196 reservieren. Wir empfehlen besonders für Wochenenden eine vorherige Reservierung.',
    },
    {
      question: 'Was sind die Öffnungszeiten des STORIA?',
      answer: 'Wir haben Montag bis Freitag von 09:00 bis 01:00 Uhr und Samstag/Sonntag von 12:00 bis 01:00 Uhr geöffnet.',
    },
    {
      question: 'Bietet das STORIA Mittagsmenüs an?',
      answer: 'Ja, wir bieten wochentags ein wechselndes Mittagsmenü zu attraktiven Preisen an. Schauen Sie auf unserer Mittagsmenü-Seite für die aktuellen Angebote.',
    },
    {
      question: 'Gibt es vegetarische und vegane Optionen?',
      answer: 'Ja, unsere Speisekarte bietet eine Vielzahl an vegetarischen Gerichten. Vegane Optionen sind auf Anfrage ebenfalls möglich. Sprechen Sie uns gerne an.',
    },
    {
      question: 'Wo befindet sich das Restaurant STORIA?',
      answer: 'Das STORIA befindet sich in der Karlstraße 47a, 80333 München, im Herzen der Stadt nahe dem Hauptbahnhof.',
    },
  ] : [
    {
      question: 'How can I make a reservation at STORIA?',
      answer: 'You can book a table online through our reservation page or by calling +49 89 515196. We especially recommend making a reservation for weekends.',
    },
    {
      question: 'What are the opening hours of STORIA?',
      answer: 'We are open Monday to Friday from 9:00 AM to 1:00 AM and Saturday/Sunday from 12:00 PM to 1:00 AM.',
    },
    {
      question: 'Does STORIA offer lunch menus?',
      answer: 'Yes, we offer a changing lunch menu on weekdays at attractive prices. Check our lunch menu page for current offerings.',
    },
    {
      question: 'Are there vegetarian and vegan options?',
      answer: 'Yes, our menu offers a variety of vegetarian dishes. Vegan options are also available upon request. Please feel free to ask us.',
    },
    {
      question: 'Where is restaurant STORIA located?',
      answer: 'STORIA is located at Karlstraße 47a, 80333 Munich, in the heart of the city near the main train station.',
    },
  ];

  return (
    <>
      <SEO canonical="/" />
      <StructuredData type="restaurant" faqItems={faqItems} />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <Hero />
        <Navigation />
        <ImageGrid />
        <Footer />
      </div>
    </>
  );
};

export default Index;
