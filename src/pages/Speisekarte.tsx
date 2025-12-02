import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Speisekarte = () => {
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
        <h1 className="text-4xl font-serif font-bold mb-8">Speisekarte</h1>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-2xl font-serif font-bold mb-4">Antipasti</h2>
              <p className="text-muted-foreground">
                Klassische italienische Vorspeisen – von Bruschetta bis Carpaccio.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-2xl font-serif font-bold mb-4">Pizza</h2>
              <p className="text-muted-foreground">
                Traditionell im Holzofen gebacken, mit frischen Zutaten.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-2xl font-serif font-bold mb-4">Pasta</h2>
              <p className="text-muted-foreground">
                Hausgemachte Pasta nach original italienischen Rezepten.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-2xl font-serif font-bold mb-4">Dolci</h2>
              <p className="text-muted-foreground">
                Süße Versuchungen aus der italienischen Patisserie.
              </p>
            </div>
          </div>

          <div className="bg-secondary p-6 rounded-lg text-center">
            <p className="text-muted-foreground">
              Die vollständige Speisekarte mit allen Gerichten und Preisen erhalten Sie vor Ort.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Speisekarte;
