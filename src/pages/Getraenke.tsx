import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";

const Getraenke = () => {
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
        <h1 className="text-4xl font-serif font-bold mb-8">{t.drinks.title}</h1>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-2xl font-serif font-bold mb-4">{t.drinks.wines}</h2>
              <p className="text-muted-foreground">
                {t.drinks.winesDesc}
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-2xl font-serif font-bold mb-4">{t.drinks.aperitivi}</h2>
              <p className="text-muted-foreground">
                {t.drinks.aperitiviDesc}
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-2xl font-serif font-bold mb-4">{t.drinks.digestivi}</h2>
              <p className="text-muted-foreground">
                {t.drinks.digestiviDesc}
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-2xl font-serif font-bold mb-4">{t.drinks.caffe}</h2>
              <p className="text-muted-foreground">
                {t.drinks.caffeDesc}
              </p>
            </div>
          </div>

          <div className="bg-secondary p-6 rounded-lg text-center">
            <h3 className="font-serif font-bold text-lg mb-2">{t.drinks.notturno}</h3>
            <p className="text-muted-foreground">
              {t.drinks.notturnoDesc}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Getraenke;
