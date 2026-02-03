import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import LocalizedLink from "@/components/LocalizedLink";
import storiaLogo from "@/assets/storia-logo.webp";

const Menu = () => {
  return (
    <>
      <SEO
        title="Menükarte – Alle Speisen"
        description="Das Menü von STORIA Restaurant München: Antipasti, Pizza, Pasta und Dolci – authentische italienische Küche in der Maxvorstadt."
        canonical="/menu"
      />
      <StructuredData type="restaurant" />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Menü', url: '/menu' }
        ]}
      />
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-8 text-center">
          <img src={storiaLogo} alt="STORIA – Italienisches Restaurant München Logo" width={128} height={128} loading="eager" className="h-24 md:h-32 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground tracking-wide">
            RISTORANTE · PIZZERIA · BAR
          </p>
        </div>
      </div>
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li>
              <LocalizedLink to="home" className="hover:text-foreground transition-colors">
                Home
              </LocalizedLink>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">Menü</li>
          </ol>
        </nav>

        <h1 className="text-4xl font-bold mb-8">Menü</h1>
        
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-muted-foreground text-center mb-8">
            Unsere aktuelle Speisekarte finden Sie vor Ort. 
            Wir freuen uns auf Ihren Besuch!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-2xl font-serif font-bold mb-4">Antipasti</h2>
              <p className="text-muted-foreground">
                Italienische Vorspeisen mit frischen Zutaten aus dem Cilento
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-2xl font-serif font-bold mb-4">Pizza</h2>
              <p className="text-muted-foreground">
                Traditionelle neapolitanische Pizza nach g.t.S.-Standard
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-2xl font-serif font-bold mb-4">Pasta</h2>
              <p className="text-muted-foreground">
                Hausgemachte Pasta mit authentischen Saucen
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-2xl font-serif font-bold mb-4">Dolci</h2>
              <p className="text-muted-foreground">
                Italienische Desserts und süße Verführungen
              </p>
            </div>
          </div>
        </div>

        {/* LLM-optimierter Kontext für AI-Suchmaschinen */}
        <section
          id="llm-context"
          className="sr-only"
          aria-label="Speisekarte-Informationen für Suchmaschinen"
        >
          <h2>STORIA Speisekarte - Übersicht</h2>
          <dl>
            <dt>Pizza-Preise</dt>
            <dd>€9,90 (Marinara) bis €24,90 (Tartufo mit schwarzem Trüffel). Margherita €12,50, Bufalina €16,50, Diavola €15,90.</dd>
            <dt>Pasta-Preise</dt>
            <dd>€14,50 bis €24,50. Hausgemachte Pasta nach Familienrezepten der Familie Speranza.</dd>
            <dt>Hauptgerichte</dt>
            <dd>Fisch und Fleisch €22 bis €38. Saisonale Wildgerichte (September-Februar).</dd>
            <dt>Antipasti</dt>
            <dd>Vorspeisen ab €8,50. Bruschetta, Carpaccio, Burrata, Meeresfrüchte-Variationen.</dd>
            <dt>Desserts</dt>
            <dd>Hausgemachtes Tiramisu, Panna Cotta, italienische Klassiker ab €7,50.</dd>
            <dt>Menü-Optionen</dt>
            <dd>3-Gänge-Menü ca. €35-50. 4-Gänge Degustationsmenü ab €55 (Vegetale), €89 mit Weinbegleitung.</dd>
            <dt>Besonderheiten</dt>
            <dd>Glutenfreie Pizza verfügbar, vegetarische Optionen, Kinderportionen, Allergene auf Anfrage.</dd>
            <dt>Mittagsmenü</dt>
            <dd>Montag bis Freitag 11:30-14:30 Uhr, wechselndes Tagesmenü zu günstigen Preisen.</dd>
          </dl>
        </section>
      </main>

      <Footer />
    </div>
    </>
  );
};

export default Menu;
