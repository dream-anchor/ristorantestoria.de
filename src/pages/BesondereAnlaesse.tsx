import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";

const BesondereAnlaesse = () => {
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
        <h1 className="text-4xl font-serif font-bold mb-8">{t.specialOccasions.title}</h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card p-8 rounded-lg border border-border mb-8">
            <h2 className="text-2xl font-serif font-bold mb-4">{t.specialOccasions.celebrateTitle}</h2>
            <p className="text-muted-foreground mb-6">
              {t.specialOccasions.celebrateDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link to="/weihnachtsmenues" className="group">
              <div className="bg-card p-6 rounded-lg border border-border hover:border-primary transition-colors h-full">
                <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">
                  {t.specialOccasions.christmasMenus}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t.specialOccasions.christmasMenusDesc}
                </p>
              </div>
            </Link>

            <Link to="/catering" className="group">
              <div className="bg-card p-6 rounded-lg border border-border hover:border-primary transition-colors h-full">
                <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">
                  {t.specialOccasions.cateringEvents}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t.specialOccasions.cateringEventsDesc}
                </p>
              </div>
            </Link>
          </div>

          <div className="bg-secondary p-8 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-4">{t.specialOccasions.interested}</h3>
            <p className="text-muted-foreground mb-6">
              {t.specialOccasions.contactUs}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="tel:+4989515196">089 51519696</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="mailto:info@ristorantestoria.de">{t.specialOccasions.sendEmail}</a>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BesondereAnlaesse;
