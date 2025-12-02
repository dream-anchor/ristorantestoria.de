import { useEffect } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePublishedSpecialMenus } from "@/hooks/useSpecialMenus";
import MenuDisplay from "@/components/MenuDisplay";

const BesondereAnlaesse = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const { data: specialMenus, isLoading } = usePublishedSpecialMenus();

  const hasPublishedMenus = specialMenus && specialMenus.length > 0;

  // Smooth scroll to anchor when navigating with hash
  useEffect(() => {
    if (location.hash && !isLoading) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash, isLoading, specialMenus]);

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
        <h1 className="text-4xl font-serif font-bold mb-8">{t.specialOccasions.title}</h1>

        <div className="max-w-4xl mx-auto">
          {/* Dynamic Menus from Database */}
          {isLoading ? (
            <div className="space-y-8 mb-12">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          ) : hasPublishedMenus ? (
            <div className="space-y-12 mb-12">
              {specialMenus.map((menu) => (
                <div 
                  key={menu.id} 
                  id={menu.id}
                  className="bg-card p-8 rounded-lg border border-border scroll-mt-24"
                >
                  <MenuDisplay menuType="special" menuId={menu.id} />
                </div>
              ))}
            </div>
          ) : (
            /* Fallback static content when no menus are published */
            <>
              <div className="bg-card p-8 rounded-lg border border-border mb-8">
                <h2 className="text-2xl font-serif font-bold mb-4">{t.specialOccasions.celebrateTitle}</h2>
                <p className="text-muted-foreground mb-6">
                  {t.specialOccasions.celebrateDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
            </>
          )}

          {/* Contact CTA - Always visible */}
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
