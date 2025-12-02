import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BesondereAnlaesse = () => {
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
        <h1 className="text-4xl font-serif font-bold mb-8">Besondere Anlässe</h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card p-8 rounded-lg border border-border mb-8">
            <h2 className="text-2xl font-serif font-bold mb-4">Feiern Sie mit uns</h2>
            <p className="text-muted-foreground mb-6">
              Im STORIA schaffen wir den perfekten Rahmen für Ihre besonderen Momente. 
              Ob Geburtstag, Jubiläum, Verlobung oder Firmenevent – wir machen Ihren 
              Anlass zu einem unvergesslichen Erlebnis mit authentischer italienischer 
              Gastfreundschaft.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link to="/weihnachtsmenues" className="group">
              <div className="bg-card p-6 rounded-lg border border-border hover:border-primary transition-colors h-full">
                <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">
                  Weihnachtsmenüs
                </h3>
                <p className="text-muted-foreground text-sm">
                  Festliche Menüs für die schönste Zeit des Jahres – 
                  perfekt für Weihnachtsfeiern mit Familie, Freunden oder Kollegen.
                </p>
              </div>
            </Link>

            <Link to="/catering" className="group">
              <div className="bg-card p-6 rounded-lg border border-border hover:border-primary transition-colors h-full">
                <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">
                  Catering & Events
                </h3>
                <p className="text-muted-foreground text-sm">
                  Individuelle Catering-Lösungen und Veranstaltungen 
                  ganz nach Ihren Wünschen.
                </p>
              </div>
            </Link>
          </div>

          <div className="bg-secondary p-8 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-4">Interesse?</h3>
            <p className="text-muted-foreground mb-6">
              Kontaktieren Sie uns für ein individuelles Angebot.
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

export default BesondereAnlaesse;
