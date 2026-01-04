import LocalizedLink from "@/components/LocalizedLink";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import ConsentElfsightReviews from "@/components/ConsentElfsightReviews";
import StaticBotContent from "@/components/StaticBotContent";
import { Button } from "@/components/ui/button";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

const RomantischesDinner = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  return (
    <>
      <StaticBotContent
        title={t.seo.romanticDinner.title}
        description={t.seo.romanticDinner.description}
        sections={[
          { heading: t.seo.romanticDinner.atmosphereTitle, content: t.seo.romanticDinner.atmosphereDesc },
          { heading: t.seo.romanticDinner.specialTitle, content: t.seo.romanticDinner.specialDesc }
        ]}
      />
      <SEO
        title={t.seo.romanticDinner.title}
        description={t.seo.romanticDinner.description}
        canonical="/romantisches-dinner-muenchen"
      />
      <StructuredData type="restaurant" />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: t.internalLinks.romanticDinner, url: '/romantisches-dinner-muenchen' }
        ]} 
      />
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
          <article className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-serif font-bold mb-6 text-center">
              {t.seo.romanticDinner.title}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
              {t.seo.romanticDinner.description}
            </p>

            <div className="bg-card p-8 rounded-lg border border-border mb-8">
              <h2 className="text-2xl font-serif font-semibold mb-4">
                {t.seo.romanticDinner.atmosphereTitle}
              </h2>
              <p className="text-muted-foreground mb-4">{t.seo.romanticDinner.atmosphereDesc}</p>
              
              <h3 className="text-xl font-semibold mb-3">{t.seo.romanticDinner.menuTitle}</h3>
              <p className="text-muted-foreground mb-4">{t.seo.romanticDinner.menuDesc}</p>
              
              <h3 className="text-xl font-semibold mb-3">{t.seo.romanticDinner.wineTitle}</h3>
              <p className="text-muted-foreground">{t.seo.romanticDinner.wineDesc}</p>
            </div>

            <div className="bg-secondary/50 p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-serif font-semibold mb-4">
                {t.seo.romanticDinner.specialTitle}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t.seo.romanticDinner.specialDesc}{' '}
                <LocalizedLink to="aperitivo-muenchen" className="text-primary hover:underline">{t.internalLinks.aperitivoMunich}</LocalizedLink>{' '}
                <LocalizedLink to="neapolitanische-pizza-muenchen" className="text-primary hover:underline">{t.internalLinks.neapolitanPizza}</LocalizedLink>{' '}
                <LocalizedLink to="ueber-uns" className="text-primary hover:underline">{t.footer.aboutUs}</LocalizedLink>.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <Button asChild>
                  <LocalizedLink to="reservierung">{t.seo.romanticDinner.reserveButton}</LocalizedLink>
                </Button>
                <Button variant="outline" asChild>
                  <LocalizedLink to="speisekarte">{t.seo.romanticDinner.menuButton}</LocalizedLink>
                </Button>
              </div>
            </div>

            <ReservationCTA />
            <ConsentElfsightReviews />
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default RomantischesDinner;
