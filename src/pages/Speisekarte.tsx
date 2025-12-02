import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";

const Speisekarte = () => {
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
        <h1 className="text-4xl font-serif font-bold mb-8">{t.foodMenu.title}</h1>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card p-8 rounded-sm border border-border shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-serif font-semibold mb-4 tracking-wide">{t.foodMenu.antipasti}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t.foodMenu.antipastiDesc}
              </p>
            </div>

            <div className="bg-card p-8 rounded-sm border border-border shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-serif font-semibold mb-4 tracking-wide">{t.foodMenu.pizza}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t.foodMenu.pizzaDesc}
              </p>
            </div>

            <div className="bg-card p-8 rounded-sm border border-border shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-serif font-semibold mb-4 tracking-wide">{t.foodMenu.pasta}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t.foodMenu.pastaDesc}
              </p>
            </div>

            <div className="bg-card p-8 rounded-sm border border-border shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-serif font-semibold mb-4 tracking-wide">{t.foodMenu.dolci}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t.foodMenu.dolciDesc}
              </p>
            </div>
          </div>

          <div className="bg-secondary p-6 rounded-lg text-center">
            <p className="text-muted-foreground">
              {t.foodMenu.fullMenu}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Speisekarte;
