import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="font-serif text-6xl md:text-8xl font-bold mb-4 tracking-tight">
          STORIA
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 tracking-wide">
          RISTORANTE · PIZZERIA · BAR
        </p>
        <h2 className="text-2xl md:text-3xl font-medium mb-8">
          Im Herzen von München
        </h2>
        <Button 
          size="lg" 
          className="bg-primary text-primary-foreground hover:bg-accent transition-colors px-8 py-6 text-lg"
          asChild
        >
          <a href="#reservation">HIER RESERVIEREN</a>
        </Button>
      </div>
    </section>
  );
};

export default Hero;
