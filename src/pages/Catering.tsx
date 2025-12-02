import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import storiaLogo from "@/assets/storia-logo.webp";

const Catering = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-8 text-center">
          <img src={storiaLogo} alt="STORIA" className="h-24 md:h-32 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground tracking-wide">
            RISTORANTE · PIZZERIA · BAR
          </p>
        </div>
      </div>
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-4xl font-bold mb-8">Catering & Events</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-card p-8 rounded-lg border border-border mb-8">
            <h2 className="text-3xl font-serif font-bold mb-4">Ihre Veranstaltung bei uns</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Feiern Sie Ihre besonderen Momente im STORIA. Ob Geburtstag, Firmenfeier, Hochzeit oder 
              private Veranstaltung – wir sorgen für einen unvergesslichen Abend mit authentischer 
              italienischer Küche und herzlichem Service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-2xl font-serif font-bold mb-4">Catering</h3>
              <p className="text-muted-foreground mb-4">
                Bringen Sie den Geschmack Italiens zu Ihrer Veranstaltung. Unser Catering-Service 
                bietet authentische italienische Speisen für jeden Anlass.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Antipasti-Platten</li>
                <li>Frische Pizza und Pasta</li>
                <li>Italienische Buffets</li>
                <li>Dolci und Desserts</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-2xl font-serif font-bold mb-4">Privatveranstaltungen</h3>
              <p className="text-muted-foreground mb-4">
                Unser Restaurant bietet den perfekten Rahmen für Ihre private Feier in 
                stilvollem Ambiente.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Geburtstagsfeiern</li>
                <li>Firmenevents</li>
                <li>Hochzeiten</li>
                <li>Familienfeiern</li>
              </ul>
            </div>
          </div>

          <div className="bg-secondary p-8 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Interessiert?</h3>
            <p className="text-muted-foreground mb-6">
              Kontaktieren Sie uns für ein individuelles Angebot für Ihre Veranstaltung oder Catering-Anfrage.
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

export default Catering;
