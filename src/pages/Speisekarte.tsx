import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MenuDisplay from "@/components/MenuDisplay";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import MenuStructuredData from "@/components/MenuStructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import BackToLandingPage from "@/components/BackToLandingPage";
import BotContent from "@/components/BotContent";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMenu } from "@/hooks/useMenu";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

const Speisekarte = () => {
  const { t, language } = useLanguage();
  const { data: menu, isLoading } = useMenu('food');
  usePrerenderReady(!isLoading && !!menu);

  return (
    <>
      <SEO 
        title={language === 'de' ? 'Speisekarte – Neapolitanische Pizza & Pasta' : 'Menu – Neapolitan Pizza & Pasta'}
        description={language === 'de' 
          ? 'Speisekarte STORIA München: Neapolitanische Pizza aus dem Steinofen, hausgemachte Pasta & Antipasti. Ristorante Maxvorstadt nahe Königsplatz. Jetzt Tisch reservieren!'
          : 'STORIA Munich menu: Neapolitan stone-oven pizza, homemade pasta & antipasti. Italian restaurant Maxvorstadt near Königsplatz. Book your table now!'}
        canonical="/speisekarte"
      />
      <StructuredData type="restaurant" />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: language === 'de' ? 'Speisekarte' : 'Menu', url: '/speisekarte' }
        ]} 
      />
      <MenuStructuredData menuType="food" />
      <BotContent menuType="food" />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-8 text-center">
            <Link to="/">
              <img src={storiaLogo} alt="STORIA – Italienisches Restaurant München" className="h-24 md:h-32 mx-auto mb-4 hover:opacity-80 transition-opacity cursor-pointer" />
            </Link>
            <p className="text-lg text-muted-foreground tracking-wide">
              {t.hero.subtitle}
            </p>
          </div>
        </div>
        <Navigation />

        <main className="container mx-auto px-4 py-12 flex-grow">
          <BackToLandingPage />
          <h1 className="text-4xl font-serif font-bold mb-4 text-center">
            {language === 'de' ? 'Speisekarte – Ristorante München Maxvorstadt' : 'Menu – Italian Restaurant Munich Maxvorstadt'}
          </h1>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            {language === 'de' 
              ? <>Authentische italienische Küche – <Link to="/neapolitanische-pizza-muenchen" className="text-primary hover:underline">neapolitanische Pizza aus dem Steinofen</Link>, hausgemachte Pasta und frische Antipasti. Genießen Sie dazu unsere <Link to="/getraenke" className="text-primary hover:underline">erlesenen italienischen Weine</Link>. Unter der Woche empfehlen wir unser <Link to="/mittags-menu" className="text-primary hover:underline">günstiges Mittagsmenü</Link>.</>
              : <>Authentic Italian cuisine – <Link to="/neapolitanische-pizza-muenchen" className="text-primary hover:underline">Neapolitan stone-oven pizza</Link>, homemade pasta and fresh antipasti. Enjoy our <Link to="/getraenke" className="text-primary hover:underline">fine Italian wines</Link> with your meal. On weekdays, we recommend our <Link to="/mittags-menu" className="text-primary hover:underline">affordable lunch menu</Link>.</>
            }
          </p>

          <MenuDisplay menuType="food" />
          
          <ReservationCTA />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Speisekarte;
