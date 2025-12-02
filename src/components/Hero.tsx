import { Button } from "@/components/ui/button";
import storiaLogo from "@/assets/storia-logo.webp";

const Hero = () => {
  return (
    <section className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-12 text-center">
        <img 
          src={storiaLogo} 
          alt="STORIA" 
          className="h-32 md:h-48 mx-auto mb-4"
        />
        <p className="text-lg md:text-xl text-muted-foreground mb-8 tracking-wide">
          RISTORANTE · PIZZERIA · BAR
        </p>
        <h1 className="text-2xl md:text-3xl font-medium mb-8">
          Im Herzen von München
        </h1>
        <Button 
          size="lg" 
          className="bg-primary text-primary-foreground hover:bg-accent transition-colors px-8 py-6 text-lg"
          asChild
        >
          <a href="/reservierung">HIER RESERVIEREN</a>
        </Button>
      </div>
    </section>
  );
};

export default Hero;
