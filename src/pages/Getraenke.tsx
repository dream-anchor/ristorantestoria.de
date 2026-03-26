import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MenuDisplay from "@/components/MenuDisplay";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import MenuStructuredData from "@/components/MenuStructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMenu } from "@/hooks/useMenu";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

const Getraenke = () => {
  const { t } = useLanguage();
  const { data: menu, isLoading } = useMenu('drinks');
  usePrerenderReady(!isLoading && !!menu);

  return (
    <>
      <SEO 
        title={t.pages.getraenke.title}
        description={t.pages.getraenke.description}
        canonical="/getraenke"
      />
      <StructuredData type="restaurant" includeReviews={false} />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: t.pages.getraenke.breadcrumb, url: '/getraenke' }
        ]} 
      />
      <MenuStructuredData menuType="drinks" />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-8 text-center">
            <Link to="/">
              <img src={storiaLogo} alt="STORIA – Italienisches Restaurant München Logo" width={128} height={128} loading="eager" className="h-24 md:h-32 w-auto mx-auto mb-4 hover:opacity-80 transition-opacity cursor-pointer" />
            </Link>
            <p className="text-lg text-muted-foreground tracking-wide">
              {t.hero.subtitle}
            </p>
          </div>
        </div>
        <Navigation />

        <main id="main-content" className="container mx-auto px-4 py-12 flex-grow">
          <h1 className="text-4xl font-serif font-bold mb-8 text-center">
            {t.pages.getraenke.h1}
          </h1>
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-card border border-border rounded-2xl px-8 py-7 shadow-sm text-center space-y-4 text-muted-foreground">
              <p>{t.pages.getraenke.intro}</p>
              {t.pages.getraenke.introP2 && <p>{t.pages.getraenke.introP2}</p>}
            </div>
          </div>

          <MenuDisplay menuType="drinks" />
          
          <ReservationCTA />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Getraenke;