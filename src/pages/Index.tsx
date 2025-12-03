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
      question: 'Wo befindet sich das Ristorante STORIA?',
      answer: 'Das STORIA – Ihr Italiener in der Maxvorstadt – befindet sich in der Karlstraße 47a, 80333 München, im Herzen der Stadt nahe dem Hauptbahnhof.',
    },
    {
      question: 'Wie kann ich einen Tisch im STORIA reservieren?',
      answer: 'Sie können einen Tisch online über unsere Reservierungsseite buchen oder telefonisch unter +49 89 515196 reservieren. Als beliebte Pizzeria Maxvorstadt empfehlen wir besonders für Wochenenden eine vorherige Reservierung.',
    },
    {
      question: 'Was bietet La Storia an?',
      answer: 'La Storia bietet authentische italienische Küche: Pizza München Innenstadt aus dem Steinofen, hausgemachte Pasta, frische Antipasti, feiner Fisch sowie erlesene Weine und Cocktails.',
    },
    {
      question: 'Was sind die Öffnungszeiten des STORIA?',
      answer: 'Unsere Trattoria München hat Montag bis Freitag von 09:00 bis 01:00 Uhr und Samstag/Sonntag von 12:00 bis 01:00 Uhr geöffnet.',
    },
    {
      question: 'Bietet das Ristorante Pizzeria STORIA Mittagsmenüs an?',
      answer: 'Ja, wir bieten wochentags ein wechselndes Mittagsmenü zu attraktiven Preisen an. Schauen Sie auf unserer Mittagsmenü-Seite für die aktuellen Angebote.',
    },
  ] : [
    {
      question: 'Where is Ristorante STORIA located?',
      answer: 'STORIA – your Italian restaurant in Maxvorstadt – is located at Karlstraße 47a, 80333 Munich, in the heart of the city near the main train station.',
    },
    {
      question: 'How can I make a reservation at STORIA?',
      answer: 'You can book a table online through our reservation page or by calling +49 89 515196. As a popular pizzeria in Maxvorstadt, we especially recommend making a reservation for weekends.',
    },
    {
      question: 'What does La Storia offer?',
      answer: 'La Storia offers authentic Italian cuisine: stone-oven pizza, homemade pasta, fresh antipasti, fine fish, as well as exquisite wines and cocktails.',
    },
    {
      question: 'What are the opening hours of STORIA?',
      answer: 'Our Italian trattoria in Munich is open Monday to Friday from 9:00 AM to 1:00 AM and Saturday/Sunday from 12:00 PM to 1:00 AM.',
    },
    {
      question: 'Does Ristorante Pizzeria STORIA offer lunch menus?',
      answer: 'Yes, we offer a changing lunch menu on weekdays at attractive prices. Check our lunch menu page for current offerings.',
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
