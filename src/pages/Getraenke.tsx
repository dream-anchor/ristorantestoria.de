import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MenuDisplay from "@/components/MenuDisplay";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import MenuStructuredData from "@/components/MenuStructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import BotContent from "@/components/BotContent";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMenu } from "@/hooks/useMenu";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

const Getraenke = () => {
  const { t, language } = useLanguage();
  const { data: menu, isLoading } = useMenu('drinks');
  usePrerenderReady(!isLoading && !!menu);

  return (
    <>
      <SEO 
        title={language === 'de' ? 'Getränkekarte – Aperitivo München' : 'Drinks Menu – Aperitivo Munich'}
        description={language === 'de' 
          ? 'STORIA Getränkekarte: Aperitivo, italienische Weine & Cocktails in München. Late Night Bar 21-22:30 Uhr. Maxvorstadt. Jetzt reservieren!'
          : 'STORIA drinks menu: Aperitivo, Italian wines & cocktails in Munich. Late Night Bar 9-10:30 PM. Maxvorstadt. Book now!'}
        canonical="/getraenke"
      />
      <StructuredData type="restaurant" />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: language === 'de' ? 'Getränke' : 'Drinks', url: '/getraenke' }
        ]} 
      />
      <MenuStructuredData menuType="drinks" />
      <BotContent menuType="drinks" />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-8 text-center">
            <Link to="/">
              <img src={storiaLogo} alt="STORIA – Italienisches Restaurant München Logo" width={128} height={128} loading="eager" className="h-24 md:h-32 mx-auto mb-4 hover:opacity-80 transition-opacity cursor-pointer" />
            </Link>
            <p className="text-lg text-muted-foreground tracking-wide">
              {t.hero.subtitle}
            </p>
          </div>
        </div>
        <Navigation />

        <main className="container mx-auto px-4 py-12 flex-grow">
          <h1 className="text-4xl font-serif font-bold mb-4 text-center">
            {language === 'de' ? 'Getränkekarte – Aperitivo & Weine in München' : 'Drinks Menu – Aperitivo & Wines in Munich'}
          </h1>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            {language === 'de'
              ? 'Erlesene italienische Weine, klassische Cocktails und Late Night Aperitivo in stilvollem Ambiente.'
              : 'Exquisite Italian wines, classic cocktails and Late Night Aperitivo in a stylish atmosphere.'}
          </p>

          <MenuDisplay menuType="drinks" />
          
          <ReservationCTA />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Getraenke;
