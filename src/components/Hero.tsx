import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import LocalizedLink from "@/components/LocalizedLink";

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-background border-b border-border" aria-labelledby="hero-heading">
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        <Link to="/" aria-label={t.common.goToHomepage}>
          <img 
            src={storiaLogo} 
            alt="STORIA – Ristorante Pizzeria Bar München Logo"
            width={192}
            height={192}
            loading="eager"
            className="h-32 md:h-48 w-auto mx-auto mb-6 hover:opacity-80 transition-opacity cursor-pointer"
          />
        </Link>
        <p className="text-lg md:text-xl text-muted-foreground mb-4 tracking-widest uppercase font-display">
          {t.hero.subtitle}
        </p>
        <h1 id="hero-heading" className="text-2xl md:text-3xl font-medium mb-3">
          {t.hero.heading}
        </h1>
        <p className="text-base md:text-lg text-muted-foreground/80 italic font-serif mb-10">
          {t.hero.claim}
        </p>
        <p className="sr-only">
          {t.common.seoDescription}
        </p>
        <Button 
          size="lg" 
          className="bg-primary text-primary-foreground hover:bg-accent transition-colors px-10 py-6 text-base tracking-widest uppercase"
          asChild
        >
          <LocalizedLink to="reservierung">{t.hero.reserveButton}</LocalizedLink>
        </Button>
      </div>
    </section>
  );
};

export default Hero;