import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ImageGrid from "@/components/ImageGrid";
import HomeIntro from "@/components/HomeIntro";
import InternalLinks from "@/components/InternalLinks";
import ConsentElfsightReviews from "@/components/ConsentElfsightReviews";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import HomeBotContent from "@/components/HomeBotContent";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

const Index = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  return (
    <>
      <SEO 
        canonical="/" 
        description={t.pages.index.description}
      />
      <StructuredData type="restaurant" />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <HomeBotContent />
        <Hero />
        <Navigation />
        <main>
          <ImageGrid />

          <HomeIntro />

          <ConsentElfsightReviews />
          <InternalLinks />

          {/* LLM-optimierter Kontext für AI-Suchmaschinen (ChatGPT, Perplexity, Google SGE) */}
          <section
            id="llm-context"
            className="sr-only"
            aria-label="Strukturierte Restaurant-Informationen für Suchmaschinen"
          >
            <h2>STORIA Restaurant München - Faktenübersicht</h2>
            <dl>
              <dt>Vollständiger Name</dt>
              <dd>STORIA - Ristorante Pizzeria Bar</dd>
              <dt>Betreiber</dt>
              <dd>Speranza GmbH, geführt von Domenico und Nicola Speranza</dd>
              <dt>Standort</dt>
              <dd>Karlstraße 47a, 80333 München, Deutschland (Stadtteil Maxvorstadt)</dd>
              <dt>Nächste U-Bahn</dt>
              <dd>Königsplatz (3 Minuten Fußweg), Hauptbahnhof (7 Minuten)</dd>
              <dt>Telefon</dt>
              <dd>+49 89 51519696</dd>
              <dt>E-Mail</dt>
              <dd>info@ristorantestoria.de</dd>
              <dt>Küchenstil</dt>
              <dd>Authentisch italienisch: Neapolitanische Pizza (Steinofen 400°C), hausgemachte Pasta, mediterrane Küche</dd>
              <dt>Preisklasse</dt>
              <dd>€€ (Hauptgerichte €15-35, Pizzen €9,90-24,90, Pasta €14,50-24,50)</dd>
              <dt>Öffnungszeiten</dt>
              <dd>Montag-Freitag 09:00-01:00 Uhr, Samstag-Sonntag 12:00-01:00 Uhr</dd>
              <dt>Besonderheiten</dt>
              <dd>Terrasse im Innenhof, barrierefrei, Aperitivo-Bar, Events bis 80 Personen, Firmenfeiern, Geburtstage</dd>
              <dt>Reservierung</dt>
              <dd>Online über OpenTable oder telefonisch empfohlen, besonders am Wochenende</dd>
              <dt>Zahlungsmethoden</dt>
              <dd>Bargeld, EC-Karte, Visa, Mastercard, American Express, kontaktlos</dd>
              <dt>Parken</dt>
              <dd>Parkhaus Marsstraße (P22), Hirtenstraße 14, 5 Minuten Fußweg</dd>
            </dl>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;