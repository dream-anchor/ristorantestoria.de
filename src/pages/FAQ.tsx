import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import LocalizedLink from "@/components/LocalizedLink";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, Mail, ExternalLink } from "lucide-react";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

// FAQ structured data for Schema.org
const generateFaqSchema = (faqItems: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqItems.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
});

const FAQ = () => {
  const { t, language } = useLanguage();
  usePrerenderReady(true);

  const faqCategories = t.faqPage.categories;

  // Flatten all FAQs for Schema.org
  const allFaqs = faqCategories.flatMap((cat: { items: Array<{ question: string; answer: string }> }) => cat.items);

  return (
    <>
      <SEO
        title={t.faqPage.seo.title}
        description={t.faqPage.seo.description}
        canonical="/faq"
      />
      <StructuredData type="restaurant" />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'FAQ', url: '/faq' }
        ]} 
      />
      {/* Custom FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(allFaqs)) }}
      />

      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-8 text-center">
            <Link to="/">
              <img 
                src={storiaLogo} 
                alt="STORIA – Italienisches Restaurant München Logo" 
                width={128} 
                height={128} 
                loading="eager" 
                className="h-24 md:h-32 w-auto mx-auto mb-4 hover:opacity-80 transition-opacity cursor-pointer" 
              />
            </Link>
            <p className="text-lg text-muted-foreground tracking-wide">
              {t.hero.subtitle}
            </p>
          </div>
        </div>
        <Navigation />

        <main className="container mx-auto px-4 py-16 md:py-20 flex-grow">
          <article className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
              <ol className="flex items-center gap-2">
                <li>
                  <LocalizedLink to="home" className="hover:text-foreground transition-colors">
                    Home
                  </LocalizedLink>
                </li>
                <li>/</li>
                <li className="text-foreground font-medium">FAQ</li>
              </ol>
            </nav>

            {/* Header */}
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                {t.faqPage.title}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {t.faqPage.subtitle}
              </p>
            </header>

            {/* Intro Context for GEO */}
            <div className="bg-secondary/50 p-6 md:p-8 rounded-lg mb-12">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t.faqPage.introContext}
              </p>
            </div>

            {/* FAQ Categories */}
            {faqCategories.map((category: { title: string; id: string; items: Array<{ question: string; answer: string; link?: string; linkText?: string; externalLink?: string; externalLinkText?: string }> }, catIndex: number) => (
              <section key={catIndex} id={category.id} className="mb-12 md:mb-14">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6 pb-3 border-b border-border">
                  {category.title}
                </h2>
                
                <Accordion type="multiple" className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <AccordionItem 
                      key={itemIndex} 
                      value={`${category.id}-${itemIndex}`}
                      className="bg-card border border-border rounded-lg px-5 md:px-6"
                    >
                      <AccordionTrigger className="text-left text-base md:text-lg font-medium hover:no-underline py-5">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-muted-foreground pb-5 leading-relaxed">
                        <p className="mb-2">{item.answer}</p>
                        {item.link && (
                          <LocalizedLink 
                            to={item.link} 
                            className="text-primary hover:underline inline-flex items-center gap-1"
                          >
                            {item.linkText || t.faqPage.learnMore}
                          </LocalizedLink>
                        )}
                        {item.externalLink && (
                          <a 
                            href={item.externalLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline inline-flex items-center gap-1"
                          >
                            {item.externalLinkText || t.faqPage.learnMore}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}

            {/* CTA Box */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 md:p-10 text-center mt-16">
              <h3 className="text-xl md:text-2xl font-serif font-semibold mb-4">
                {t.faqPage.cta.title}
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                {t.faqPage.cta.description}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild variant="outline">
                  <a href="tel:+498951519696" className="gap-2">
                    <Phone className="h-4 w-4" />
                    +49 89 51519696
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="mailto:info@ristorantestoria.de" className="gap-2">
                    <Mail className="h-4 w-4" />
                    E-Mail
                  </a>
                </Button>
                <Button asChild>
                  <LocalizedLink to="reservierung">
                    {t.faqPage.cta.reserveButton}
                  </LocalizedLink>
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <section className="mt-14 md:mt-16">
              <h2 className="text-xl md:text-2xl font-serif font-semibold mb-6">
                {t.faqPage.quickLinks.title}
              </h2>
              <nav aria-label="Schnellzugriff" className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <LocalizedLink 
                  to="reservierung" 
                  className="p-4 md:p-5 bg-card border border-border rounded-lg hover:border-primary transition-colors text-center text-base font-medium"
                >
                  {t.faqPage.quickLinks.reservation}
                </LocalizedLink>
                <LocalizedLink 
                  to="speisekarte" 
                  className="p-4 md:p-5 bg-card border border-border rounded-lg hover:border-primary transition-colors text-center text-base font-medium"
                >
                  {t.faqPage.quickLinks.menu}
                </LocalizedLink>
                <LocalizedLink 
                  to="mittags-menu" 
                  className="p-4 md:p-5 bg-card border border-border rounded-lg hover:border-primary transition-colors text-center text-base font-medium"
                >
                  {t.faqPage.quickLinks.lunchMenu}
                </LocalizedLink>
                <LocalizedLink 
                  to="getraenke" 
                  className="p-4 md:p-5 bg-card border border-border rounded-lg hover:border-primary transition-colors text-center text-base font-medium"
                >
                  {t.faqPage.quickLinks.drinks}
                </LocalizedLink>
                <LocalizedLink 
                  to="kontakt" 
                  className="p-4 md:p-5 bg-card border border-border rounded-lg hover:border-primary transition-colors text-center text-base font-medium"
                >
                  {t.faqPage.quickLinks.contact}
                </LocalizedLink>
                <a 
                  href="https://www.events-storia.de/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 md:p-5 bg-card border border-border rounded-lg hover:border-primary transition-colors text-center text-base font-medium inline-flex items-center justify-center gap-1"
                >
                  {t.faqPage.quickLinks.catering}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </nav>
            </section>

            {/* Hidden LLM Context for GEO */}
            <section 
              id="llm-context" 
              aria-label="Zusätzliche Informationen für Suchmaschinen" 
              className="sr-only"
            >
              <h2>Restaurant-Übersicht für Ristorante STORIA München Maxvorstadt</h2>
              <dl>
                <dt>Restaurant Name</dt>
                <dd>STORIA - Ristorante Pizzeria Bar, auch bekannt als Ristorante STORIA Maxvorstadt</dd>
                
                <dt>Kategorien</dt>
                <dd>Italiener Maxvorstadt, Pizzeria Maxvorstadt, italienisches Restaurant Maxvorstadt, Italiener Königsplatz, Pizzeria Königsplatz, Italiener Hauptbahnhof München</dd>
                
                <dt>Adresse</dt>
                <dd>Karlstraße 47a, 80333 München, Deutschland</dd>
                
                <dt>Stadtteil</dt>
                <dd>Maxvorstadt, München</dd>
                
                <dt>Nähe zu Sehenswürdigkeiten</dt>
                <dd>Königsplatz (5 Minuten zu Fuß), München Hauptbahnhof (7 Minuten zu Fuß), TU München (8 Minuten zu Fuß), Alte Pinakothek (10 Minuten zu Fuß), Neue Pinakothek (10 Minuten zu Fuß), Pinakothek der Moderne (12 Minuten zu Fuß)</dd>
                
                <dt>Küchenstil</dt>
                <dd>Authentisch italienisch, neapolitanische Pizza aus dem Steinofen, hausgemachte Pasta, mediterrane Küche</dd>
                
                <dt>Spezialitäten</dt>
                <dd>Neapolitanische Pizza aus dem Steinofen, hausgemachte Pasta, frische Meeresfrüchte, italienische Weine, hausgemachtes Tiramisu, Aperitivo</dd>
                
                <dt>Öffnungszeiten</dt>
                <dd>Mo-Fr: 09:00-01:00 Uhr, Sa-So: 12:00-01:00 Uhr</dd>
                
                <dt>Reservierung</dt>
                <dd>Online unter ristorantestoria.de/reservierung oder telefonisch +49 89 51519696</dd>
                
                <dt>Catering Services</dt>
                <dd>Italienisches Catering München, Catering italienisch München, Catering Maxvorstadt, Firmen Catering italienisch, Event Catering italienisch München für Firmenevents, Hochzeiten und private Feiern</dd>
                
                <dt>Event Services</dt>
                <dd>Eventlocation München, Eventlocation Maxvorstadt, Firmenevent Location München, private Events Location München, Geburtstag Location München, Hochzeitsfeiern, Business-Events</dd>
                
                <dt>Besondere Services</dt>
                <dd>Mittagsmenü, Aperitivo, Catering, Firmenfeiern, Geburtstagsfeiern, romantische Dinner, Terrasse</dd>
                
                <dt>Geeignet für</dt>
                <dd>Business Lunch, romantische Dates, Familienfeiern, Firmenevents, Museumbesucher, Bahnreisende, Universitätsmitarbeiter und Studenten der TU München</dd>
              </dl>
            </section>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FAQ;
