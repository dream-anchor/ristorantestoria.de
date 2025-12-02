import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Weihnachtsmenues = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
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

      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-4xl font-serif font-bold mb-8">Weihnachtsmenüs</h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card p-8 rounded-lg border border-border mb-8">
            <h2 className="text-2xl font-serif font-bold mb-4">Buon Natale!</h2>
            <p className="text-muted-foreground mb-6">
              Feiern Sie die Weihnachtszeit im STORIA mit unseren festlichen Menüs. 
              Ob Firmenfeier, Familientreffen oder Freundesrunde – wir kreieren für Sie 
              ein unvergessliches kulinarisches Erlebnis mit italienischem Flair.
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-serif font-bold mb-3">Menü Natale</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Unser klassisches Weihnachtsmenü mit drei Gängen – 
                perfekt für festliche Abende.
              </p>
              <p className="text-sm text-muted-foreground">
                Details und Preise auf Anfrage
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-serif font-bold mb-3">Menü Grande</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Das große Festmenü mit fünf Gängen – für besonders festliche Anlässe 
                und Gruppen, die es sich richtig gut gehen lassen wollen.
              </p>
              <p className="text-sm text-muted-foreground">
                Details und Preise auf Anfrage
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-serif font-bold mb-3">Buffet Festivo</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Reichhaltiges italienisches Buffet für größere Gesellschaften – 
                ideal für Firmenfeiern ab 20 Personen.
              </p>
              <p className="text-sm text-muted-foreground">
                Details und Preise auf Anfrage
              </p>
            </div>
          </div>

          <div className="bg-secondary p-8 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-4">Jetzt reservieren!</h3>
            <p className="text-muted-foreground mb-6">
              Sichern Sie sich frühzeitig Ihren Wunschtermin für die Weihnachtszeit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="tel:+4989515196">089 51519696</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="mailto:info@ristorantestoria.de">E-Mail senden</a>
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
