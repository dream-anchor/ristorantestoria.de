import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

const Events = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            STORIA
          </h1>
          <p className="text-lg text-muted-foreground tracking-wide">
            RISTORANTE · PIZZERIA · BAR
          </p>
        </div>
      </div>
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Events</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-card p-8 rounded-lg border border-border mb-8">
            <h2 className="text-3xl font-serif font-bold mb-4 text-primary">STORIA Notturno</h2>
            <p className="text-xl mb-4">Late Night Aperitivo – stile italiano</p>
            <p className="text-lg text-muted-foreground mb-4">21.00-22.30 Uhr</p>
            <p className="text-muted-foreground">
              Genießen Sie unseren italienischen Aperitivo am Abend. 
              Erleben Sie authentische italienische Kultur mit köstlichen Cocktails 
              und traditionellen Häppchen in entspannter Atmosphäre.
            </p>
          </div>

          <div className="bg-card p-8 rounded-lg border border-border">
            <h2 className="text-3xl font-serif font-bold mb-4 text-primary">Frühstück im STORIA</h2>
            <p className="text-lg text-muted-foreground mb-4">Mo-So ab 9.00 Uhr</p>
            <p className="text-muted-foreground">
              Starten Sie Ihren Tag mit einem italienischen Frühstück. 
              Frischer Espresso, Cornetti und vieles mehr erwarten Sie.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-muted border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p className="mb-2">STORIA - Ristorante · Pizzeria · Bar</p>
          <p>Im Herzen von München</p>
        </div>
      </footer>
    </div>
  );
};

export default Events;
