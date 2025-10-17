import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

const Menu = () => {
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
        <h1 className="text-4xl font-bold mb-8">Menü</h1>
        
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-muted-foreground text-center mb-8">
            Unsere aktuelle Speisekarte finden Sie vor Ort. 
            Wir freuen uns auf Ihren Besuch!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-2xl font-serif font-bold mb-4">Antipasti</h3>
              <p className="text-muted-foreground">
                Italienische Vorspeisen mit frischen Zutaten aus dem Cilento
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-2xl font-serif font-bold mb-4">Pizza</h3>
              <p className="text-muted-foreground">
                Traditionelle neapolitanische Pizza nach g.t.S.-Standard
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-2xl font-serif font-bold mb-4">Pasta</h3>
              <p className="text-muted-foreground">
                Hausgemachte Pasta mit authentischen Saucen
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-2xl font-serif font-bold mb-4">Dolci</h3>
              <p className="text-muted-foreground">
                Italienische Desserts und süße Verführungen
              </p>
            </div>
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

export default Menu;
