import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import { Button } from "@/components/ui/button";
import storiaLogo from "@/assets/storia-logo.webp";
import tiramisuImage from "@/assets/tiramisu.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const GeburtstagsfeierMuenchen = () => {
  const { language } = useLanguage();

  const faqItems = language === 'de' ? [
    {
      question: "Kann ich meine eigene Geburtstagstorte mitbringen?",
      answer: "Ja, Sie können gerne Ihre eigene Torte mitbringen – wir stellen sie für Sie kühl und servieren sie zum gewünschten Zeitpunkt mit Tellern und Besteck. Alternativ können wir auch eine Torte für Sie organisieren oder empfehlen unser hausgemachtes Tiramisu als süßen Abschluss."
    },
    {
      question: "Gibt es spezielle Geburtstags-Rabatte oder -Angebote?",
      answer: "Das Geburtstagskind erhält bei uns ein Glas Prosecco und ein kleines Dessert-Überraschung aufs Haus. Für größere Gruppen erstellen wir gerne ein individuelles Paket-Angebot. Kontaktieren Sie uns für Details."
    },
    {
      question: "Was kostet ein Geburtstags-Menü pro Person?",
      answer: "Die Kosten hängen von Ihren Wünschen ab. Ein 3-Gang-Menü beginnt bei attraktiven Preisen, ein festliches 4-Gang-Menü mit Weinbegleitung entsprechend mehr. Wir erstellen gerne ein individuelles Angebot passend zu Ihrem Budget."
    },
    {
      question: "Kann ich das Restaurant nur für meine Feier buchen?",
      answer: "Ja, ab ca. 40 Gästen bieten wir die Möglichkeit einer Exklusiv-Buchung. Sie haben dann das gesamte Restaurant für sich – perfekt für runde Geburtstage oder größere Familienfeiern."
    },
    {
      question: "Wie weit im Voraus sollte ich für eine Geburtstagsfeier reservieren?",
      answer: "Wir empfehlen, 2-4 Wochen im Voraus zu reservieren, besonders am Wochenende. Für größere Gruppen (ab 20 Personen) oder Exklusiv-Buchungen sollten Sie 4-6 Wochen einplanen. Im Dezember empfehlen wir noch frühere Buchung."
    }
  ] : [
    {
      question: "Can I bring my own birthday cake?",
      answer: "Yes, you are welcome to bring your own cake – we will store it for you and serve it at the desired time with plates and cutlery. Alternatively, we can organize a cake for you or recommend our homemade tiramisu as a sweet finale."
    },
    {
      question: "Are there special birthday discounts or offers?",
      answer: "The birthday person receives a complimentary glass of Prosecco and a small dessert surprise on the house. For larger groups, we are happy to create an individual package offer. Contact us for details."
    },
    {
      question: "How much does a birthday menu cost per person?",
      answer: "Costs depend on your wishes. A 3-course menu starts at attractive prices, a festive 4-course menu with wine pairing accordingly more. We are happy to create an individual offer to match your budget."
    },
    {
      question: "Can I book the restaurant exclusively for my celebration?",
      answer: "Yes, from about 40 guests we offer the possibility of exclusive booking. You then have the entire restaurant to yourself – perfect for milestone birthdays or larger family celebrations."
    },
    {
      question: "How far in advance should I book for a birthday party?",
      answer: "We recommend booking 2-4 weeks in advance, especially on weekends. For larger groups (from 20 people) or exclusive bookings, you should plan 4-6 weeks. In December, we recommend booking even earlier."
    }
  ];

  return (
    <>
      <SEO 
        title={language === 'de' ? 'Geburtstag feiern München – Party im Italiener STORIA' : 'Birthday Party Munich – Celebration at Italian Restaurant STORIA'}
        description={language === 'de' 
          ? 'Geburtstag feiern München im STORIA: Italienisches Restaurant in der Maxvorstadt für 10-60 Gäste. Individuelle Menüs, Torte & Überraschungen. Jetzt Geburtstagsfeier planen!'
          : 'Birthday party Munich at STORIA: Italian restaurant in Maxvorstadt for 10-60 guests. Individual menus, cake & surprises. Plan your birthday celebration now!'}
        canonical="/geburtstagsfeier-muenchen"
      />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: language === 'de' ? 'Geburtstagsfeier München' : 'Birthday Party Munich', url: '/geburtstagsfeier-muenchen' }
        ]} 
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-8 text-center">
            <Link to="/">
              <img src={storiaLogo} alt="STORIA – Restaurant für Geburtstagsfeiern München" className="h-24 md:h-32 mx-auto mb-4 hover:opacity-80 transition-opacity cursor-pointer" />
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
              {language === 'de' ? 'Geburtstag feiern München – Ihre Party im STORIA' : 'Birthday Party Munich – Your Celebration at STORIA'}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
              {language === 'de'
                ? 'Tanti Auguri! Feiern Sie Ihren Geburtstag im STORIA – mit italienischer Herzlichkeit, exquisiter Küche und besonderem Ambiente. Unser Restaurant in der Münchner Maxvorstadt bietet den perfekten Rahmen für unvergessliche Geburtstagsfeiern von 10 bis 60 Gästen.'
                : 'Tanti Auguri! Celebrate your birthday at STORIA – with Italian warmth, exquisite cuisine and special ambiance. Our restaurant in Munich\'s Maxvorstadt offers the perfect setting for unforgettable birthday parties from 10 to 60 guests.'}
            </p>

            {/* Hero Image */}
            <div className="rounded-lg overflow-hidden mb-12">
              <img 
                src={tiramisuImage} 
                alt={language === 'de' ? 'Hausgemachtes Tiramisu – Dessert für Ihre Geburtstagsfeier im STORIA München' : 'Homemade tiramisu – Dessert for your birthday party at STORIA Munich'}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>

            {/* Tanti Auguri */}
            <section className="bg-card p-8 rounded-lg border border-border mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? 'Tanti Auguri! – Feiern auf Italienisch' : 'Tanti Auguri! – Celebrate Italian Style'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === 'de'
                  ? 'In Italien wird der Geburtstag mit Familie, Freunden und gutem Essen gefeiert – genau das möchten wir im STORIA für Sie möglich machen. Unsere italienische Herzlichkeit, die warme Atmosphäre und die Liebe zum Detail sorgen dafür, dass Ihr Ehrentag zu einem unvergesslichen Erlebnis wird.'
                  : 'In Italy, birthdays are celebrated with family, friends and good food – that\'s exactly what we want to make possible for you at STORIA. Our Italian warmth, the cozy atmosphere and attention to detail ensure that your special day becomes an unforgettable experience.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">{language === 'de' ? 'Was wir bieten' : 'What We Offer'}</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>✓ {language === 'de' ? 'Platz für 10 bis 60 Gäste' : 'Space for 10 to 60 guests'}</li>
                    <li>✓ {language === 'de' ? 'Individuelle Menügestaltung' : 'Individual menu design'}</li>
                    <li>✓ {language === 'de' ? 'Torte mitbringen oder organisieren' : 'Bring your own cake or we organize'}</li>
                    <li>✓ {language === 'de' ? 'Persönliche Grußkarte vom Team' : 'Personal greeting card from team'}</li>
                    <li>✓ {language === 'de' ? 'Dekoration nach Absprache' : 'Decoration by arrangement'}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">{language === 'de' ? 'Besondere Extras' : 'Special Extras'}</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>✓ {language === 'de' ? 'Prosecco für das Geburtstagskind' : 'Prosecco for the birthday person'}</li>
                    <li>✓ {language === 'de' ? '"Tanti Auguri"-Serenade' : '"Tanti Auguri" serenade'}</li>
                    <li>✓ {language === 'de' ? 'Dessert-Überraschung' : 'Dessert surprise'}</li>
                    <li>✓ {language === 'de' ? 'Blumen am Tisch (auf Anfrage)' : 'Flowers at table (on request)'}</li>
                    <li>✓ {language === 'de' ? 'Menükarten mit Namen' : 'Menu cards with names'}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Gruppengrößen */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6 text-center">
                {language === 'de' ? 'Die richtige Größe für Ihre Feier' : 'The Right Size for Your Celebration'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-lg border border-border text-center">
                  <p className="text-3xl font-serif font-bold text-primary mb-2">10-15</p>
                  <p className="font-semibold mb-2">{language === 'de' ? 'Personen' : 'People'}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Großer Tisch im Restaurant. Ideal für intime Feiern im Freundeskreis.'
                      : 'Large table in the restaurant. Ideal for intimate celebrations with friends.'}
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border-2 border-primary text-center">
                  <div className="text-xs text-primary font-semibold mb-1">{language === 'de' ? 'BELIEBT' : 'POPULAR'}</div>
                  <p className="text-3xl font-serif font-bold text-primary mb-2">15-30</p>
                  <p className="font-semibold mb-2">{language === 'de' ? 'Personen' : 'People'}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Separierter Bereich im Restaurant. Perfekt für Familienfeiern und runde Geburtstage.'
                      : 'Separated area in the restaurant. Perfect for family celebrations and milestone birthdays.'}
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border text-center">
                  <p className="text-3xl font-serif font-bold text-primary mb-2">30-60</p>
                  <p className="font-semibold mb-2">{language === 'de' ? 'Personen' : 'People'}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Exklusiv-Buchung möglich. Das ganze Restaurant für Ihre große Feier.'
                      : 'Exclusive booking possible. The whole restaurant for your big celebration.'}
                  </p>
                </div>
              </div>
            </section>

            {/* Beliebte Menüs */}
            <section className="bg-secondary/50 p-8 rounded-lg mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? 'Beliebte Geburtstags-Menüs' : 'Popular Birthday Menus'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === 'de'
                  ? 'Lassen Sie sich und Ihre Gäste mit exquisiter italienischer Küche verwöhnen. Hier sind einige beliebte Optionen für Ihre Geburtstagsfeier:'
                  : 'Treat yourself and your guests to exquisite Italian cuisine. Here are some popular options for your birthday celebration:'}
              </p>
              <div className="space-y-4">
                <div className="bg-background p-4 rounded-lg">
                  <h3 className="font-serif font-semibold mb-2">{language === 'de' ? 'Antipasti-Platte zum Teilen' : 'Antipasti Platter to Share'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Bruschetta, Carpaccio, Burrata, italienische Salumi – perfekt zum gemeinsamen Genießen und Anstoßen.'
                      : 'Bruschetta, carpaccio, burrata, Italian salumi – perfect for sharing and toasting together.'}
                  </p>
                </div>
                <div className="bg-background p-4 rounded-lg">
                  <h3 className="font-serif font-semibold mb-2">{language === 'de' ? 'Pizza-Party' : 'Pizza Party'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Verschiedene Pizzen aus unserem Steinofen für die ganze Runde. Locker, gesellig und lecker – ideal für entspannte Feiern.'
                      : 'Various pizzas from our stone oven for the whole group. Casual, convivial and delicious – ideal for relaxed celebrations.'}
                  </p>
                </div>
                <div className="bg-background p-4 rounded-lg">
                  <h3 className="font-serif font-semibold mb-2">{language === 'de' ? 'Klassisches 3-Gang-Menü' : 'Classic 3-Course Menu'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Antipasto, Pasta oder Hauptgang nach Wahl, Dolce – ein festliches Menü für besondere Anlässe.'
                      : 'Antipasto, pasta or main course of your choice, dolce – a festive menu for special occasions.'}
                  </p>
                </div>
                <div className="bg-background p-4 rounded-lg">
                  <h3 className="font-serif font-semibold mb-2">{language === 'de' ? 'Süßer Abschluss' : 'Sweet Finale'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Unser hausgemachtes Tiramisu, Panna Cotta oder eine Torte Ihrer Wahl – der krönende Abschluss Ihrer Feier.'
                      : 'Our homemade tiramisu, panna cotta or a cake of your choice – the crowning finale of your celebration.'}
                  </p>
                </div>
              </div>
            </section>

            {/* Tipps für Ihre Feier */}
            <section className="bg-card p-8 rounded-lg border border-border mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? 'Tipps für Ihre Geburtstagsfeier' : 'Tips for Your Birthday Party'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{language === 'de' ? 'Rechtzeitig planen' : 'Plan Ahead'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Reservieren Sie 2-4 Wochen im Voraus, besonders für Wochenenden. So können wir alles perfekt vorbereiten.'
                      : 'Book 2-4 weeks in advance, especially for weekends. This way we can prepare everything perfectly.'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{language === 'de' ? 'Gästezahl bekannt geben' : 'Confirm Guest Count'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Teilen Sie uns die finale Gästezahl spätestens 3 Tage vorher mit. Kleine Änderungen sind meist kein Problem.'
                      : 'Let us know the final guest count at least 3 days before. Small changes are usually no problem.'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{language === 'de' ? 'Menü-Vorauswahl' : 'Pre-Select Menu'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Bei größeren Gruppen empfehlen wir eine Menü-Vorauswahl. Das vereinfacht den Ablauf und Sie können entspannt genießen.'
                      : 'For larger groups, we recommend pre-selecting the menu. This simplifies the process and you can enjoy relaxed.'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{language === 'de' ? 'Besonderheiten mitteilen' : 'Communicate Special Needs'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Allergien, Unverträglichkeiten oder besondere Wünsche? Teilen Sie uns diese vorab mit – wir kümmern uns darum.'
                      : 'Allergies, intolerances or special requests? Let us know in advance – we\'ll take care of it.'}
                  </p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="bg-primary/5 p-8 rounded-lg text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                {language === 'de' ? 'Jetzt Geburtstag planen' : 'Plan Your Birthday Now'}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                {language === 'de'
                  ? 'Reservieren Sie frühzeitig für Ihre Geburtstagsfeier. Wir freuen uns, Ihren besonderen Tag unvergesslich zu machen!'
                  : 'Book early for your birthday celebration. We look forward to making your special day unforgettable!'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="tel:+498951519696">+49 89 51519696</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="mailto:info@ristorantestoria.de">{language === 'de' ? 'E-Mail senden' : 'Send Email'}</a>
                </Button>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-card p-8 rounded-lg border border-border mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
                {language === 'de' ? 'Häufige Fragen zur Geburtstagsfeier' : 'Frequently Asked Questions'}
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
                <Link to="/speisekarte" className="text-sm text-primary hover:underline">
                  {language === 'de' ? 'Speisekarte ansehen →' : 'View Menu →'}
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/eventlocation-muenchen-maxvorstadt" className="text-sm text-primary hover:underline">
                  {language === 'de' ? 'Eventlocation →' : 'Event Location →'}
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/neapolitanische-pizza-muenchen" className="text-sm text-primary hover:underline">
                  {language === 'de' ? 'Pizza-Party →' : 'Pizza Party →'}
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

export default GeburtstagsfeierMuenchen;
