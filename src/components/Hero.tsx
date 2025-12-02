import { Button } from "@/components/ui/button";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        <img 
          src={storiaLogo} 
          alt="STORIA" 
          className="h-32 md:h-48 mx-auto mb-6"
        />
        <p className="text-lg md:text-xl text-muted-foreground mb-8 tracking-widest uppercase">
          {t.hero.subtitle}
        </p>
        <h1 className="text-2xl md:text-3xl font-medium mb-10 italic">
          {t.hero.location}
        </h1>
        <Button 
          size="lg" 
          className="bg-primary text-primary-foreground hover:bg-accent transition-colors px-10 py-6 text-base tracking-widest uppercase"
          asChild
        >
          <a href="/reservierung">{t.hero.reserveButton}</a>
        </Button>
      </div>
    </section>
  );
};

export default Hero;
