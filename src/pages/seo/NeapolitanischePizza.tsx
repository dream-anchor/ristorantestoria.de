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

const NeapolitanischePizza = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  return (
    <>
      <StaticBotContent
        title={t.seo.neapolitanPizza.title}
        description={t.seo.neapolitanPizza.description}
        sections={[
          { heading: t.seo.neapolitanPizza.traditionTitle, content: t.seo.neapolitanPizza.traditionDesc },
          { heading: t.seo.neapolitanPizza.varietyTitle, content: [
            `${t.seo.neapolitanPizza.pizza1} – ${t.seo.neapolitanPizza.pizza1Desc}`,
            `${t.seo.neapolitanPizza.pizza2} – ${t.seo.neapolitanPizza.pizza2Desc}`,
            `${t.seo.neapolitanPizza.pizza3} – ${t.seo.neapolitanPizza.pizza3Desc}`,
            `${t.seo.neapolitanPizza.pizza4} – ${t.seo.neapolitanPizza.pizza4Desc}`,
          ]}
        ]}
      />
      <SEO
        title={t.seo.neapolitanPizza.title}
        description={t.seo.neapolitanPizza.description}
        canonical="/neapolitanische-pizza-muenchen"
      />
      <StructuredData type="restaurant" />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: t.internalLinks.neapolitanPizza, url: '/neapolitanische-pizza-muenchen' }
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
              {t.seo.neapolitanPizza.title}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
              {t.seo.neapolitanPizza.description}
            </p>

            <div className="bg-card p-8 rounded-lg border border-border mb-8">
              <h2 className="text-2xl font-serif font-semibold mb-4">
                {t.seo.neapolitanPizza.traditionTitle}
              </h2>
              <p className="text-muted-foreground mb-4">{t.seo.neapolitanPizza.traditionDesc}</p>
              <h3 className="text-xl font-semibold mb-3">{t.seo.neapolitanPizza.ingredientsTitle}</h3>
              <p className="text-muted-foreground mb-4">{t.seo.neapolitanPizza.ingredientsDesc}</p>
              <h3 className="text-xl font-semibold mb-3">{t.seo.neapolitanPizza.ovenTitle}</h3>
              <p className="text-muted-foreground">{t.seo.neapolitanPizza.ovenDesc}</p>
            </div>

            <div className="bg-secondary/50 p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-serif font-semibold mb-4">
                {t.seo.neapolitanPizza.varietyTitle}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground">{t.seo.neapolitanPizza.pizza1}</h3>
                  <p className="text-sm">{t.seo.neapolitanPizza.pizza1Desc}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t.seo.neapolitanPizza.pizza2}</h3>
                  <p className="text-sm">{t.seo.neapolitanPizza.pizza2Desc}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t.seo.neapolitanPizza.pizza3}</h3>
                  <p className="text-sm">{t.seo.neapolitanPizza.pizza3Desc}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t.seo.neapolitanPizza.pizza4}</h3>
                  <p className="text-sm">{t.seo.neapolitanPizza.pizza4Desc}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-6">
                <Button asChild>
                  <LocalizedLink to="speisekarte">{t.seo.neapolitanPizza.menuButton}</LocalizedLink>
                </Button>
                <Button variant="outline" asChild>
                  <LocalizedLink to="reservierung">{t.seo.neapolitanPizza.reserveButton}</LocalizedLink>
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

export default NeapolitanischePizza;
