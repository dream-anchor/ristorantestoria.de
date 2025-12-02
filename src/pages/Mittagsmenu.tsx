import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";

const Mittagsmenu = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-8 text-center">
          <img src={storiaLogo} alt="STORIA" className="h-24 md:h-32 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground tracking-wide">
            {t.hero.subtitle}
          </p>
        </div>
      </div>
      <Navigation />

      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-4xl font-serif font-bold mb-8">{t.lunchMenu.title}</h1>

        <div className="max-w-3xl mx-auto">
          <div className="bg-card p-8 rounded-lg border border-border mb-8">
            <h2 className="text-2xl font-serif font-bold mb-4">{t.lunchMenu.ourOffer}</h2>
            <p className="text-muted-foreground mb-6">
              {t.lunchMenu.description}
            </p>
            <p className="text-sm text-muted-foreground">
              {t.lunchMenu.hours}
            </p>
          </div>

          <div className="bg-secondary p-6 rounded-lg text-center">
            <p className="text-muted-foreground">
              {t.lunchMenu.currentMenu}
            </p>
            <a href="tel:+4989515196" className="text-primary hover:underline mt-2 inline-block">
              {t.lunchMenu.callNow}: 089 51519696
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Mittagsmenu;
