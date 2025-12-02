import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import domenicoImage from "@/assets/domenico-speranza.webp";
import nicolaImage from "@/assets/nicola-speranza.webp";
import storiaLogo from "@/assets/storia-logo.webp";

const UeberUns = () => {
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
        <h1 className="text-4xl font-serif font-bold mb-8">Über uns</h1>

        <div className="max-w-4xl mx-auto">
          {/* Philosophie */}
          <div className="bg-card p-8 rounded-lg border border-border mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">Unsere Philosophie</h2>
            <p className="text-muted-foreground mb-4">
              STORIA – das bedeutet Geschichte. Und genau das möchten wir mit jedem Gast 
              schreiben: Eine Geschichte voller Genuss, Herzlichkeit und authentischer 
              italienischer Lebensfreude.
            </p>
            <p className="text-muted-foreground mb-4">
              Im Herzen von München, in der lebendigen Maxvorstadt, haben wir einen Ort 
              geschaffen, an dem Italien lebendig wird. Von früh bis spät, vom ersten 
              Espresso am Morgen bis zum letzten Aperitivo in der Nacht.
            </p>
            <p className="text-muted-foreground">
              Unsere Küche ist ehrlich, unsere Zutaten sind frisch, und unsere 
              Gastfreundschaft kommt von Herzen. Denn wir glauben: Gutes Essen ist mehr 
              als nur Nahrung – es ist ein Erlebnis, das Menschen zusammenbringt.
            </p>
          </div>

          {/* Die Fratelli */}
          <h2 className="text-3xl font-serif font-bold mb-8 text-center">Die Fratelli</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Domenico */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                <img
                  src={domenicoImage}
                  alt="Domenico Speranza"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-serif font-bold mb-2 text-center">
                Domenico Speranza
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Das Herz von STORIA
              </p>
              <p className="text-muted-foreground text-sm">
                Wo Domenico sich zeigt, scheint die Sonne. Er ist der Sonnenschein im 
                Service, die gute Seele des Hauses – das Herz von STORIA. Mit seiner 
                warmherzigen Art und seinem ansteckenden Lächeln sorgt er dafür, dass 
                sich jeder Gast wie ein Freund der Familie fühlt.
              </p>
            </div>

            {/* Nicola */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                <img
                  src={nicolaImage}
                  alt="Nicola Speranza"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-serif font-bold mb-2 text-center">
                Nicola Speranza
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Das Feuer von STORIA
              </p>
              <p className="text-muted-foreground text-sm">
                Nicola kreiert magische Gerichte, die allesamt ein Ziel haben: Den Gast 
                in unser geliebtes Italien zu entführen. Er ist die Leidenschaft in der 
                Küche – das Feuer von STORIA. Mit jedem Gericht erzählt er eine 
                Geschichte von Tradition, Handwerk und purer Liebe zum Kochen.
              </p>
            </div>
          </div>

          {/* Geschichte */}
          <div className="bg-secondary p-8 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-4">Benvenuti!</h3>
            <p className="text-muted-foreground">
              Wir freuen uns darauf, mit Ihnen gemeinsam neue Geschichten zu schreiben. 
              Kommen Sie vorbei und werden Sie Teil der STORIA-Familie.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UeberUns;
