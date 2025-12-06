import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface ParallaxHeroProps {
  image: string;
  headline: string;
  subheadline: string;
  showReservationCTA?: boolean;
  showMenuCTA?: boolean;
  menuLink?: string;
  menuLabel?: string;
  overlay?: "light" | "medium" | "dark";
}

const ParallaxHero = ({
  image,
  headline,
  subheadline,
  showReservationCTA = true,
  showMenuCTA = true,
  menuLink = "/speisekarte",
  menuLabel,
  overlay = "medium",
}: ParallaxHeroProps) => {
  const { language } = useLanguage();

  const overlayClasses = {
    light: "bg-black/30",
    medium: "bg-black/45",
    dark: "bg-black/60",
  };

  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Parallax Background - CSS-based for performance */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${image})`,
          backgroundAttachment: "fixed",
          // Fallback for iOS Safari where fixed doesn't work
          backgroundSize: "cover",
        }}
      >
        {/* Overlay */}
        <div className={`absolute inset-0 ${overlayClasses[overlay]}`} />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-primary-foreground px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 md:mb-6 max-w-4xl animate-fade-in leading-tight">
          {headline}
        </h1>
        <p className="text-base sm:text-lg md:text-xl max-w-2xl mb-6 md:mb-8 text-primary-foreground/90 leading-relaxed">
          {subheadline}
        </p>
        
        {(showReservationCTA || showMenuCTA) && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {showReservationCTA && (
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                <Link to="/reservierung">
                  {language === "de" ? "Jetzt reservieren" : "Book now"}
                </Link>
              </Button>
            )}
            {showMenuCTA && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 px-8"
              >
                <Link to={menuLink}>
                  {menuLabel || (language === "de" ? "Speisekarte ansehen" : "View menu")}
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary-foreground/70 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default ParallaxHero;
