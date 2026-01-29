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

const AperitivoMuenchen = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  return (
    <>
      <StaticBotContent
        title={t.seo.aperitivo.title}
        description={t.seo.aperitivo.description}
        sections={[
          { heading: t.seo.aperitivo.aperitivoTitle, content: [
            t.seo.aperitivo.aperitivoItem1,
            t.seo.aperitivo.aperitivoItem2,
            t.seo.aperitivo.aperitivoItem3,
            t.seo.aperitivo.aperitivoItem4,
          ]},
          { heading: t.seo.aperitivo.dolceVitaTitle, content: t.seo.aperitivo.dolceVitaDesc }
        ]}
      />
      <SEO
        title={t.seo.aperitivo.title}
        description={t.seo.aperitivo.description}
        canonical="/aperitivo-muenchen"
      />
      <StructuredData type="restaurant" />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: t.internalLinks.aperitivoMunich, url: '/aperitivo-muenchen' }
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
              {t.seo.aperitivo.title}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
              {t.seo.aperitivo.description}
            </p>

            <div className="bg-card p-8 rounded-lg border border-border mb-8">
              <h2 className="text-2xl font-serif font-semibold mb-4">
                {t.seo.aperitivo.aperitivoTitle}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t.seo.aperitivo.aperitivoDesc}
              </p>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li>✓ {t.seo.aperitivo.aperitivoItem1}</li>
                <li>✓ {t.seo.aperitivo.aperitivoItem2}</li>
                <li>✓ {t.seo.aperitivo.aperitivoItem3}</li>
                <li>✓ {t.seo.aperitivo.aperitivoItem4}</li>
              </ul>
            </div>

            <div className="bg-secondary/50 p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-serif font-semibold mb-4">
                {t.seo.aperitivo.dolceVitaTitle}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t.seo.aperitivo.dolceVitaDesc}{' '}
                <LocalizedLink to="romantisches-dinner-muenchen" className="text-primary hover:underline">{t.seo.aperitivo.dolceVitaLink1}</LocalizedLink>{' '}
                <LocalizedLink to="speisekarte" className="text-primary hover:underline">{t.seo.aperitivo.dolceVitaLink2}</LocalizedLink>.{' '}
                {t.seo.aperitivo.dolceVitaLocation}
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <Button asChild>
                  <LocalizedLink to="getraenke">{t.seo.aperitivo.drinksButton}</LocalizedLink>
                </Button>
                <Button variant="outline" asChild>
                  <LocalizedLink to="reservierung">{t.seo.aperitivo.reserveButton}</LocalizedLink>
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

export default AperitivoMuenchen;
