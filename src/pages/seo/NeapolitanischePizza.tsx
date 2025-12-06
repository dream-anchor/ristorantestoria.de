import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import { Button } from "@/components/ui/button";
import storiaLogo from "@/assets/storia-logo.webp";
import ravioliImage from "@/assets/ravioli.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const NeapolitanischePizza = () => {
  const { language } = useLanguage();

  const faqItems = language === 'de' ? [
    {
      question: "Ist die Pizza wirklich neapolitanisch?",
      answer: "Ja! Unsere Pizzen werden nach authentisch neapolitanischer Art zubereitet: langer Teigruhe (48-72 Stunden), italienisches Tipo-00-Mehl, San-Marzano-Tomaten und Fior di Latte aus Kampanien. Der Teig wird im Steinofen bei hoher Temperatur gebacken – genau wie in Neapel."
    },
    {
      question: "Welche Pizzen sind vegetarisch oder vegan?",
      answer: "Vegetarische Optionen: Margherita, Quattro Formaggi, Pizza Verdure und weitere. Vegane Pizza bieten wir auf Anfrage an – mit veganem Käse-Ersatz und frischem Gemüse. Sprechen Sie uns gerne an!"
    },
    {
      question: "Gibt es glutenfreie Pizza?",
      answer: "Ja, wir bieten glutenfreien Pizzateig als Alternative an. Bitte informieren Sie uns bei der Bestellung über Ihren Wunsch, damit wir entsprechende Vorkehrungen treffen können. Hinweis: Die Zubereitung erfolgt in der gleichen Küche wie unsere regulären Produkte."
    },
    {
      question: "Kann ich Pizza zum Mitnehmen bestellen?",
      answer: "Ja, selbstverständlich! Sie können telefonisch unter +49 89 51519696 vorbestellen und Ihre Pizza bei uns abholen. Die Pizza wird frisch zubereitet und ist innerhalb von 15-20 Minuten nach Bestellung abholbereit."
    },
    {
      question: "Was macht neapolitanische Pizza besonders?",
      answer: "Neapolitanische Pizza zeichnet sich durch einen weichen, luftigen Teig mit leicht verkohltem Rand (\"Cornicione\"), hochwertige Zutaten und eine kurze Backzeit von nur 60-90 Sekunden bei extremer Hitze aus. Der Boden ist weich und elastisch, der Rand knusprig – ein geschütztes kulinarisches Erbe (UNESCO Weltkulturerbe seit 2017)."
    }
  ] : [
    {
      question: "Is the pizza really Neapolitan?",
      answer: "Yes! Our pizzas are prepared in authentic Neapolitan style: long dough rest (48-72 hours), Italian Tipo 00 flour, San Marzano tomatoes and Fior di Latte from Campania. The dough is baked in a stone oven at high temperature – just like in Naples."
    },
    {
      question: "Which pizzas are vegetarian or vegan?",
      answer: "Vegetarian options: Margherita, Quattro Formaggi, Pizza Verdure and more. We offer vegan pizza on request – with vegan cheese substitute and fresh vegetables. Just ask us!"
    },
    {
      question: "Is there gluten-free pizza?",
      answer: "Yes, we offer gluten-free pizza dough as an alternative. Please let us know when ordering so we can take appropriate precautions. Note: Preparation takes place in the same kitchen as our regular products."
    },
    {
      question: "Can I order pizza to take away?",
      answer: "Yes, of course! You can pre-order by phone at +49 89 51519696 and pick up your pizza from us. The pizza is freshly prepared and ready for pickup within 15-20 minutes after ordering."
    },
    {
      question: "What makes Neapolitan pizza special?",
      answer: "Neapolitan pizza is characterized by a soft, airy dough with a slightly charred rim (\"Cornicione\"), high-quality ingredients and a short baking time of only 60-90 seconds at extreme heat. The base is soft and elastic, the rim crispy – a protected culinary heritage (UNESCO World Heritage since 2017)."
    }
  ];

  return (
    <>
      <SEO 
        title={language === 'de' ? 'Neapolitanische Pizza München – Steinofen Pizzeria STORIA' : 'Neapolitan Pizza Munich – Stone Oven Pizzeria STORIA'}
        description={language === 'de' 
          ? 'Neapolitanische Pizza München im STORIA: Authentische Steinofen-Pizza in der Maxvorstadt. San-Marzano-Tomaten, Fior di Latte, 48h Teigruhe. Pizzeria nahe Königsplatz. Jetzt reservieren!'
          : 'Neapolitan pizza Munich at STORIA: Authentic stone-oven pizza in Maxvorstadt. San Marzano tomatoes, Fior di Latte, 48h dough rest. Pizzeria near Königsplatz. Book now!'}
        canonical="/neapolitanische-pizza-muenchen"
      />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: language === 'de' ? 'Neapolitanische Pizza München' : 'Neapolitan Pizza Munich', url: '/neapolitanische-pizza-muenchen' }
        ]} 
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-8 text-center">
            <Link to="/">
              <img src={storiaLogo} alt="STORIA – Neapolitanische Pizzeria München" className="h-24 md:h-32 mx-auto mb-4 hover:opacity-80 transition-opacity cursor-pointer" />
            </Link>
            <p className="text-lg text-muted-foreground tracking-wide">
              RISTORANTE · PIZZERIA · BAR
            </p>
          </div>
        </div>
        <Navigation />
        
        <main className="container mx-auto px-4 py-12 flex-grow">
          <article className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-center">
              {language === 'de' ? 'Neapolitanische Pizza München – Steinofen Pizzeria STORIA' : 'Neapolitan Pizza Munich – Stone Oven Pizzeria STORIA'}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
              {language === 'de'
                ? 'Erleben Sie echte neapolitanische Pizza im STORIA. Traditionell im Steinofen gebacken, mit San-Marzano-Tomaten und frischem Fior di Latte – so wie in Napoli. Unsere Pizzeria in der Münchner Maxvorstadt bringt Ihnen das UNESCO-Weltkulturerbe auf den Teller.'
                : 'Experience authentic Neapolitan pizza at STORIA. Traditionally baked in a stone oven, with San Marzano tomatoes and fresh Fior di Latte – just like in Naples. Our pizzeria in Munich\'s Maxvorstadt brings you UNESCO World Heritage on your plate.'}
            </p>

            {/* Hero Image */}
            <div className="rounded-lg overflow-hidden mb-12">
              <img 
                src={ravioliImage} 
                alt={language === 'de' ? 'Neapolitanische Pizza aus dem Steinofen – Pizzeria STORIA München' : 'Neapolitan pizza from the stone oven – Pizzeria STORIA Munich'}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>

            {/* L'Arte della Pizza */}
            <section className="bg-card p-8 rounded-lg border border-border mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? "L'Arte della Pizza – Die Kunst der Pizza" : "L'Arte della Pizza – The Art of Pizza"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === 'de'
                  ? 'Die neapolitanische Pizza ist seit 2017 UNESCO-Weltkulturerbe – und das aus gutem Grund. Diese jahrhundertealte Tradition aus Neapel steht für höchste Qualität, einfache Perfektion und die Liebe zum Handwerk. Im STORIA pflegen wir diese Tradition mit Leidenschaft und Respekt vor dem Erbe der "Pizzaiuoli Napoletani".'
                  : 'Neapolitan pizza has been a UNESCO World Heritage since 2017 – and for good reason. This centuries-old tradition from Naples stands for highest quality, simple perfection and love for the craft. At STORIA, we nurture this tradition with passion and respect for the heritage of the "Pizzaiuoli Napoletani".'}
              </p>
              <div className="bg-secondary/50 p-6 rounded-lg">
                <h3 className="font-serif font-semibold text-lg mb-3">
                  {language === 'de' ? 'Was macht echte neapolitanische Pizza aus?' : 'What Makes Authentic Neapolitan Pizza?'}
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• {language === 'de' ? 'Weicher, luftiger Teig mit charakteristischem Rand ("Cornicione")' : 'Soft, airy dough with characteristic rim ("Cornicione")'}</li>
                  <li>• {language === 'de' ? 'Nur wenige, hochwertige Zutaten' : 'Only a few, high-quality ingredients'}</li>
                  <li>• {language === 'de' ? 'Backzeit von nur 60-90 Sekunden' : 'Baking time of only 60-90 seconds'}</li>
                  <li>• {language === 'de' ? 'Leicht verkohlte Blasen am Rand' : 'Slightly charred bubbles on the rim'}</li>
                  <li>• {language === 'de' ? 'Weicher, elastischer Boden' : 'Soft, elastic base'}</li>
                </ul>
              </div>
            </section>

            {/* Die Kunst des Teigs */}
            <section className="bg-secondary/50 p-8 rounded-lg mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? 'Die Kunst des Teigs' : 'The Art of Dough'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === 'de'
                  ? 'Der Teig ist das Herzstück jeder Pizza. Bei uns ruht er 48 bis 72 Stunden, um seinen charakteristischen Geschmack und die perfekte Konsistenz zu entwickeln. Wir verwenden nur italienisches Tipo-00-Mehl, Wasser, Salz und natürliche Hefe – keine Zusatzstoffe, keine Abkürzungen.'
                  : 'The dough is the heart of every pizza. With us, it rests for 48 to 72 hours to develop its characteristic taste and perfect consistency. We only use Italian Tipo 00 flour, water, salt and natural yeast – no additives, no shortcuts.'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-2xl font-serif font-bold text-primary">48-72h</p>
                  <p className="text-xs text-muted-foreground">{language === 'de' ? 'Teigruhe' : 'Dough Rest'}</p>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-2xl font-serif font-bold text-primary">Tipo 00</p>
                  <p className="text-xs text-muted-foreground">{language === 'de' ? 'Italienisches Mehl' : 'Italian Flour'}</p>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-2xl font-serif font-bold text-primary">485°C</p>
                  <p className="text-xs text-muted-foreground">{language === 'de' ? 'Steinofen-Temperatur' : 'Stone Oven Temperature'}</p>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-2xl font-serif font-bold text-primary">60-90s</p>
                  <p className="text-xs text-muted-foreground">{language === 'de' ? 'Backzeit' : 'Baking Time'}</p>
                </div>
              </div>
            </section>

            {/* Premium-Zutaten */}
            <section className="bg-card p-8 rounded-lg border border-border mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? 'Premium-Zutaten aus Italien' : 'Premium Ingredients from Italy'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === 'de'
                  ? 'Authentische neapolitanische Pizza beginnt mit den richtigen Zutaten. Wir beziehen unsere wichtigsten Produkte direkt aus Italien – für den unverfälschten Geschmack Kampaniens.'
                  : 'Authentic Neapolitan pizza starts with the right ingredients. We source our key products directly from Italy – for the unadulterated taste of Campania.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="w-2 bg-primary rounded-full"></div>
                  <div>
                    <h3 className="font-semibold mb-1">San-Marzano-Tomaten</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Aus der Vesuv-Region in Kampanien. Süßer, weniger säuerlich – die einzig wahre Tomate für Pizza.'
                        : 'From the Vesuvius region in Campania. Sweeter, less acidic – the only true tomato for pizza.'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 bg-primary rounded-full"></div>
                  <div>
                    <h3 className="font-semibold mb-1">Fior di Latte</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Frischer Kuhmilch-Mozzarella aus Agerola, Kampanien. Cremig, zart schmelzend.'
                        : 'Fresh cow\'s milk mozzarella from Agerola, Campania. Creamy, delicately melting.'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 bg-primary rounded-full"></div>
                  <div>
                    <h3 className="font-semibold mb-1">Olivenöl Extra Vergine</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Erstklassiges Olivenöl aus Apulien. Der finale Schliff für jede Pizza.'
                        : 'First-class olive oil from Apulia. The final touch for every pizza.'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 bg-primary rounded-full"></div>
                  <div>
                    <h3 className="font-semibold mb-1">Frischer Basilikum</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Aromatischer Basilikum, der erst nach dem Backen aufgelegt wird – für volles Aroma.'
                        : 'Aromatic basil, added only after baking – for full flavor.'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Unsere Pizza-Auswahl */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6 text-center">
                {language === 'de' ? 'Unsere Pizza-Klassiker' : 'Our Pizza Classics'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-serif font-semibold text-lg mb-2">Margherita</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === 'de'
                      ? 'Der Klassiker: San-Marzano-Tomaten, Fior di Latte, frischer Basilikum, Olivenöl. Die Königin der Pizza.'
                      : 'The classic: San Marzano tomatoes, Fior di Latte, fresh basil, olive oil. The queen of pizza.'}
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-serif font-semibold text-lg mb-2">Marinara</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === 'de'
                      ? 'Die Ur-Pizza: Tomaten, Knoblauch, Oregano, Olivenöl. Einfach, ehrlich, köstlich – ohne Käse.'
                      : 'The original pizza: Tomatoes, garlic, oregano, olive oil. Simple, honest, delicious – without cheese.'}
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-serif font-semibold text-lg mb-2">Diavola</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === 'de'
                      ? 'Für Liebhaber von Schärfe: Scharfe Salami, Tomaten, Mozzarella – feurig und würzig.'
                      : 'For lovers of spice: Spicy salami, tomatoes, mozzarella – fiery and flavorful.'}
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-serif font-semibold text-lg mb-2">Quattro Formaggi</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === 'de'
                      ? 'Vier italienische Käsesorten auf einem Teig – cremig, aromatisch, unwiderstehlich.'
                      : 'Four Italian cheeses on one dough – creamy, aromatic, irresistible.'}
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-serif font-semibold text-lg mb-2">Prosciutto e Rucola</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === 'de'
                      ? 'Luftgetrockneter Parmaschinken, frischer Rucola, Parmesan – nach dem Backen belegt.'
                      : 'Air-dried Parma ham, fresh arugula, parmesan – topped after baking.'}
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-serif font-semibold text-lg mb-2">Calzone</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === 'de'
                      ? 'Die gefüllte Variante: Ricotta, Mozzarella, Salami – ein Geschmackserlebnis zum Aufklappen.'
                      : 'The filled variant: Ricotta, mozzarella, salami – a taste experience to unfold.'}
                  </p>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">
                {language === 'de' ? 'Und viele weitere Variationen auf unserer Speisekarte...' : 'And many more variations on our menu...'}
              </p>
            </section>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <Button size="lg" asChild>
                <Link to="/speisekarte">{language === 'de' ? 'Speisekarte ansehen' : 'View Menu'}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/reservierung">{language === 'de' ? 'Tisch reservieren' : 'Book a Table'}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="tel:+498951519696">{language === 'de' ? 'Zum Mitnehmen bestellen' : 'Order Takeaway'}</a>
              </Button>
            </div>

            {/* FAQ Section */}
            <section className="bg-card p-8 rounded-lg border border-border mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? 'Häufige Fragen zur neapolitanischen Pizza' : 'Frequently Asked Questions'}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Cross Links */}
            <section className="text-center mb-10">
              <h3 className="font-serif text-lg mb-4 text-muted-foreground">
                {language === 'de' ? 'Entdecken Sie mehr' : 'Discover More'}
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/lunch-muenchen-maxvorstadt" className="text-sm text-primary hover:underline">
                  {language === 'de' ? 'Pizza zum Lunch →' : 'Pizza for Lunch →'}
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/geburtstagsfeier-muenchen" className="text-sm text-primary hover:underline">
                  {language === 'de' ? 'Pizza-Party feiern →' : 'Pizza Party →'}
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/mittagsmenu" className="text-sm text-primary hover:underline">
                  {language === 'de' ? 'Aktuelles Mittagsmenü →' : 'Current Lunch Menu →'}
                </Link>
              </div>
            </section>

            <ReservationCTA />
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default NeapolitanischePizza;
