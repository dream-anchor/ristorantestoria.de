import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ReservationBooking from "@/components/ReservationBooking";
import ElfsightReviews from "@/components/ElfsightReviews";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import BackToLandingPage from "@/components/BackToLandingPage";
import StaticBotContent from "@/components/StaticBotContent";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

const Reservierung = () => {
  const { t, language } = useLanguage();
  usePrerenderReady(true);

  return (
    <>
      <StaticBotContent
        title={language === 'de' ? 'Tisch reservieren – STORIA München Maxvorstadt' : 'Book a Table – STORIA Munich Maxvorstadt'}
        description={language === 'de' 
          ? 'Reservieren Sie Ihren Tisch im STORIA München Maxvorstadt. Italienisches Restaurant nahe Königsplatz & Pinakotheken. Online-Reservierung über OpenTable oder telefonisch unter +49 89 51519696.'
          : 'Book your table at STORIA Munich Maxvorstadt. Italian restaurant near Königsplatz & Pinakothek museums. Online booking via OpenTable or call +49 89 51519696.'}
        sections={[
          { heading: language === 'de' ? 'Online reservieren' : 'Book online', content: language === 'de' ? 'Nutzen Sie unser OpenTable-Widget für schnelle Online-Reservierungen.' : 'Use our OpenTable widget for quick online reservations.' },
          { heading: language === 'de' ? 'Telefonisch reservieren' : 'Phone reservation', content: '+49 89 51519696' }
        ]}
      />
      <SEO
        title={language === 'de' ? 'Tisch reservieren – Ristorante München' : 'Book a Table – Italian Restaurant Munich'}
        description={language === 'de' 
          ? 'Tisch reservieren im STORIA München: Italiener in der Maxvorstadt nahe Königsplatz. Online über OpenTable oder telefonisch buchen!'
          : 'Book a table at STORIA Munich: Italian restaurant in Maxvorstadt near Königsplatz. Reserve online via OpenTable or by phone!'}
        canonical="/reservierung"
      />
      <StructuredData type="restaurant" />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: language === 'de' ? 'Reservierung' : 'Reservation', url: '/reservierung' }
        ]} 
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-8 text-center">
            <Link to="/">
              <img src={storiaLogo} alt="STORIA – Italienisches Restaurant München Logo" width={128} height={128} loading="eager" className="h-24 md:h-32 w-auto mx-auto mb-4 hover:opacity-80 transition-opacity cursor-pointer" />
            </Link>
            <p className="text-lg text-muted-foreground tracking-wide font-sans">
              {t.hero.subtitle}
            </p>
          </div>
        </div>
        <Navigation />
        
        <main className="container mx-auto px-4 py-12 flex-grow">
          <BackToLandingPage />
          <h1 className="text-4xl font-bold mb-4 text-center">
            {language === 'de' ? 'Tisch reservieren – Ristorante München Maxvorstadt' : 'Book a Table – Italian Restaurant Munich Maxvorstadt'}
          </h1>
          <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            {language === 'de' 
              ? 'Wählen Sie Ihre Wunschzeit und reservieren Sie bequem über OpenTable.'
              : language === 'it'
              ? 'Scegliete l\'orario desiderato e prenotate comodamente tramite OpenTable.'
              : language === 'fr'
              ? 'Choisissez votre horaire et réservez facilement via OpenTable.'
              : 'Choose your preferred time and book conveniently via OpenTable.'}
          </p>
          
          <ReservationBooking />

          <ElfsightReviews />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Reservierung;
