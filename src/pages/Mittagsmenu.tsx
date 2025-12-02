import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Mittagsmenu = () => {
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
        <h1 className="text-4xl font-serif font-bold mb-8">Mittagsmenü</h1>

        <div className="max-w-3xl mx-auto">
          <div className="bg-card p-8 rounded-lg border border-border mb-8">
            <h2 className="text-2xl font-serif font-bold mb-4">Unser Mittagsangebot</h2>
            <p className="text-muted-foreground mb-6">
              Genießen Sie unsere täglich wechselnden Mittagsgerichte – frisch zubereitet 
              mit Liebe und Leidenschaft. Schnell, lecker und perfekt für die Mittagspause.
            </p>
            <p className="text-sm text-muted-foreground">
              Montag bis Freitag von 11:30 bis 14:30 Uhr
            </p>
          </div>

          <div className="bg-secondary p-6 rounded-lg text-center">
            <p className="text-muted-foreground">
              Das aktuelle Mittagsmenü erhalten Sie vor Ort oder auf Anfrage.
            </p>
            <a href="tel:+4989515196" className="text-primary hover:underline mt-2 inline-block">
              Jetzt anrufen: 089 51519696
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Mittagsmenu;
