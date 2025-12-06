import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface CTAIntermediateProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  variant?: "default" | "subtle" | "accent";
}

const CTAIntermediate = ({
  title,
  subtitle,
  buttonText,
  buttonLink = "/reservierung",
  variant = "default",
}: CTAIntermediateProps) => {
  const { language } = useLanguage();

  const defaultTitle = language === "de" 
    ? "Bereit für ein unvergessliches Erlebnis?"
    : "Ready for an unforgettable experience?";
  
  const defaultSubtitle = language === "de"
    ? "Nur wenige Minuten vom Königsplatz entfernt erwartet Sie authentische italienische Küche."
    : "Just minutes from Königsplatz, authentic Italian cuisine awaits you.";
  
  const defaultButtonText = language === "de" ? "Jetzt Tisch reservieren" : "Book a table now";

  const bgClasses = {
    default: "bg-primary text-primary-foreground",
    subtle: "bg-secondary/50 text-foreground",
    accent: "bg-accent text-accent-foreground",
  };

  const buttonVariant = variant === "default" || variant === "accent" ? "secondary" : "default";

  return (
    <section className={`py-10 md:py-12 ${bgClasses[variant]}`}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-xl md:text-2xl font-serif font-semibold mb-2">
          {title || defaultTitle}
        </h2>
        <p className={`text-sm md:text-base mb-6 max-w-xl mx-auto ${
          variant === "subtle" ? "text-muted-foreground" : "opacity-90"
        }`}>
          {subtitle || defaultSubtitle}
        </p>
        <Button asChild size="lg" variant={buttonVariant}>
          <Link to={buttonLink}>
            {buttonText || defaultButtonText}
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CTAIntermediate;
