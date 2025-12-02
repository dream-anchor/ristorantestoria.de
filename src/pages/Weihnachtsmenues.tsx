import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import MenuDisplay from "@/components/MenuDisplay";
import { useMenu } from "@/hooks/useMenu";

const Weihnachtsmenues = () => {
  const { t } = useLanguage();
  const { data: christmasMenu, isLoading } = useMenu('christmas');

  const hasPublishedMenu = christmasMenu && christmasMenu.categories.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-8 text-center">
          <Link to="/">
            <img src={storiaLogo} alt="STORIA" className="h-24 md:h-32 mx-auto mb-4 hover:opacity-80 transition-opacity cursor-pointer" />
          </Link>
          <p className="text-lg text-muted-foreground tracking-wide">
            {t.hero.subtitle}
          </p>
        </div>
      </div>
      <Navigation />

      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-4xl font-serif font-bold mb-8">{t.christmas.title}</h1>

        <div className="max-w-4xl mx-auto">
          {/* Intro Card */}
          <div className="bg-card p-8 rounded-lg border border-border mb-8">
            <h2 className="text-2xl font-serif font-bold mb-4">{t.christmas.greeting}</h2>
            <p className="text-muted-foreground mb-6">
              {t.christmas.intro}
            </p>
          </div>

          {/* Dynamic Menu from Database */}
          {hasPublishedMenu ? (
            <div className="mb-8">
              <MenuDisplay menuType="christmas" />
            </div>
          ) : !isLoading && (
            /* Fallback Static Content when no menu is published */
            <div className="space-y-6 mb-8">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-xl font-serif font-bold mb-3">{t.christmas.menuNatale}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {t.christmas.menuNataleDesc}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t.christmas.detailsOnRequest}
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-xl font-serif font-bold mb-3">{t.christmas.menuGrande}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {t.christmas.menuGrandeDesc}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t.christmas.detailsOnRequest}
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-xl font-serif font-bold mb-3">{t.christmas.buffetFestivo}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {t.christmas.buffetFestivoDesc}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t.christmas.detailsOnRequest}
                </p>
              </div>
            </div>
          )}

          {/* Reservation CTA */}
          <div className="bg-secondary p-8 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-4">{t.christmas.reserveNow}</h3>
            <p className="text-muted-foreground mb-6">
              {t.christmas.secureDate}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="tel:+4989515196">089 51519696</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="mailto:info@ristorantestoria.de">{t.christmas.sendEmail}</a>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Weihnachtsmenues;
