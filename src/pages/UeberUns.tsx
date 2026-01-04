import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ReservationCTA from "@/components/ReservationCTA";
import StaticBotContent from "@/components/StaticBotContent";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

const UeberUns = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  return (
    <>
      <StaticBotContent
        title={t.about.title}
        description={t.pages.ueberUns.description}
        sections={[
          { content: t.about.p1 },
          { content: t.about.p2 },
          { content: t.about.p3 },
          { content: t.about.p4 },
          { content: t.about.p5 },
          { content: t.about.p6 },
          { content: t.about.p7 },
          { content: t.about.p8 }
        ]}
      />
      <SEO
        title={t.pages.ueberUns.title}
        description={t.pages.ueberUns.description}
        canonical="/ueber-uns"
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <Navigation />
        <main className="flex-1 py-16 md:py-24">
          <div className="container mx-auto px-6 md:px-8 max-w-4xl">
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center mb-10 md:mb-14">
              {t.about.title}
            </h1>
            
            <div className="space-y-6 text-muted-foreground font-sans text-base leading-relaxed">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>{t.about.p3}</p>
              <p>{t.about.p4}</p>
              <p>{t.about.p5}</p>
              <p>{t.about.p6}</p>
              <p>{t.about.p7}</p>
              <p>{t.about.p8}</p>
              
              {/* Unterschrift */}
              <div className="text-left">
                <p className="text-foreground/70 mb-2">
                  {t.about.greeting}
                </p>
                <span className="font-signature text-3xl md:text-4xl text-foreground/80 italic">
                  Domenico Speranza
                </span>
              </div>
            </div>
            
            <ReservationCTA />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default UeberUns;