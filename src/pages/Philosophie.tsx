import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

const Philosophie = () => {
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
        <h1 className="text-4xl font-bold mb-8">Unsere Philosophie</h1>
        
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h2 className="text-3xl font-serif font-bold mb-4 text-primary">CILENTO UND SEINE PRODUKTE</h2>
          
          <p className="text-muted-foreground mb-6">
            Das Gebiet Cilento liegt in der Region Kampanien (Provinz Salerno), im Süden Italiens. 
            1991 wurden bedeutende Teile des Gebietes zum Nationalpark (Nationalpark Cilento und Vallo di Diano), 
            1998 zum UNESCO-Welterbe der Menschheit erklärt.
          </p>

          <p className="text-muted-foreground mb-6">
            Die Dieta Mediterranea ist weltweit berühmt. Weitestgehend unbekannt hingegen ist, dass die 
            Mittelmeerdiät ihren Ursprung in der Nationalparkregion Cilento und zwar im Jahre 1954 in einer 
            kleinen Stadt von Cilento, Rofrano in der Provinz von Salerno welches der Geburtsort der Speranza 
            Brüder ist, fand. In Rofrano ließ sich einst der Vater der Mittelmeerdiät, Ancel Keys, nieder und 
            entwickelte hier die Leitlinien der heute weltberühmten Ernährungsweise, die eine reichhaltige und 
            allgemein gesündere Ernährung vorsieht. Statt Molkereiprodukte und Fleisch werden Brot, Teigwaren, 
            frisches Gemüse und Obst, Käse, Fisch und Olivenöl bevorzugt. Auch Wein zum Essen darf nicht fehlen.
          </p>

          <p className="text-muted-foreground mb-6">
            Zu den typischen Produkten in Cilento zählen u.a. Weine, Olivenöl, Büffelmozzarella, der Caciocavallo 
            und der Cacioricotta Käse, die typische Soppressata Wurst sowie Kastanien, Feigen und Zitrusfrüchte. 
            Die meisten Produkte aus Cilento weisen eine D.O.P. Qualität auf. D.O.P. bedeutet „Denominazione 
            d'Origine Protetta", kurz das D.O.P.-Siegel. Es ist die italienische Entsprechung der geschützten 
            Ursprungsbezeichnung (g. U.) und kennzeichnet Produkte, deren Herstellung u. a. auf traditionelle 
            Weise erfolgt und deren Zutaten aus einem bestimmten geografischen Raum stammen müssen.
          </p>

          <div className="bg-card p-6 rounded-lg border border-border my-8">
            <h3 className="text-2xl font-serif font-bold mb-4">Die echte neapolitanische Pizza</h3>
            <p className="text-muted-foreground">
              Die echte neapolitanische Pizza besteht aus Mehl, Wasser und Bierhefe und sie soll dünn in der 
              Mitte und dick am Rand sein. Sie muss mit frischen birnenförmigen San Marzano Tomaten, Oregano, 
              frischem Basilikum, Fior di Latte oder Mozzarella di Bufala Campana und natives Olivenöl extra 
              gewürzt und bei einer Temperatur von bei 485 °C gebacken werden. Die Garzeit darf 60 bis 90 
              Sekunden nicht überschreiten. Seit 5. Februar 2010 ist die traditionelle Zusammensetzung oder 
              das traditionelle Herstellungsverfahren des Produktes als garantiert traditionelle Spezialität 
              (g.t.S., engl. TSG) geschützt.
            </p>
          </div>

          <p className="text-muted-foreground mb-6">
            Den vollen Genuss dieser Spezialitäten können Sie bei uns erleben – Ihrem Italiener in Maxvorstadt. 
            Wir verwenden ausschließlich Produkte aus unserer Heimat und bereiten sie auf moderne, kreative Art zu. 
            Für uns ist es eine Freude und zugleich eine Ehre, Ihnen diese kulinarischen Traditionen näherzubringen.
          </p>

          <p className="text-2xl font-serif text-center mt-8 text-primary">
            Buon Appetito!
          </p>
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

export default Philosophie;
