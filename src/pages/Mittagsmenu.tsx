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
import BackToLandingPage from "@/components/BackToLandingPage";
import LocalizedLink from "@/components/LocalizedLink";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMenu } from "@/hooks/useMenu";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

const Mittagsmenu = () => {
  const { t } = useLanguage();
  const { data: menu, isLoading } = useMenu('lunch');
  usePrerenderReady(!isLoading && !!menu);

  return (
    <>
      <SEO 
        title={t.pages.mittagsmenu.title}
        description={t.pages.mittagsmenu.description}
        canonical="/mittags-menu"
      />
      <StructuredData type="restaurant" />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: t.pages.mittagsmenu.breadcrumb, url: '/mittags-menu' }
        ]} 
      />
      <MenuStructuredData menuType="lunch" />
      <BotContent menuType="lunch" />
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

        <main className="container mx-auto px-4 py-12 flex-grow">
          <BackToLandingPage />
          <h1 className="text-4xl font-serif font-bold mb-6 text-center">
            {t.pages.mittagsmenu.h1}
          </h1>
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-xl font-serif italic text-primary mb-4">{t.lunchMenu.greeting}</p>
            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
              {t.lunchMenu.description}
            </p>
          </div>

          <MenuDisplay menuType="lunch" />

          {/* SEO Internal Link to Lunch Landing Page */}
          <div className="mt-12 max-w-xl mx-auto">
            <LocalizedLink
              to="lunch-muenchen-maxvorstadt"
              className="block bg-card border rounded-lg p-6 hover:border-primary transition-colors text-center"
            >
              <h3 className="font-semibold mb-2">{t.pages.mittagsmenu.seoLinkTitle}</h3>
              <p className="text-muted-foreground text-sm">{t.pages.mittagsmenu.seoLinkDesc}</p>
            </LocalizedLink>
          </div>

          <ReservationCTA />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Mittagsmenu;