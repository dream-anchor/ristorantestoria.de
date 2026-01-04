import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ReservationBooking from "@/components/ReservationBooking";
import ConsentElfsightReviews from "@/components/ConsentElfsightReviews";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import BackToLandingPage from "@/components/BackToLandingPage";
import StaticBotContent from "@/components/StaticBotContent";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

const Reservierung = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  return (
    <>
      <StaticBotContent
        title={t.pages.reservierung.h1}
        description={t.pages.reservierung.description}
        sections={[
          { heading: t.reservationBooking.title, content: t.reservationBooking.openTableNote },
          { heading: t.contact.phone, content: '+49 89 51519696' }
        ]}
      />
      <SEO
        title={t.pages.reservierung.title}
        description={t.pages.reservierung.description}
        canonical="/reservierung"
      />
      <StructuredData type="restaurant" />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: t.pages.reservierung.breadcrumb, url: '/reservierung' }
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
            {t.pages.reservierung.h1}
          </h1>
          <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            {t.reservationBooking.subtitle}
          </p>
          
          <ReservationBooking />

          <ConsentElfsightReviews />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Reservierung;