import LocalizedLink from "@/components/LocalizedLink";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import ConsentElfsightReviews from "@/components/ConsentElfsightReviews";
import ConsentGoogleMaps from "@/components/ConsentGoogleMaps";
import StaticBotContent from "@/components/StaticBotContent";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { Phone, MessageCircle, MapPin, Clock, Star, Utensils, ArrowRight } from "lucide-react";

const NeapolitanischePizza = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  const pizzaHighlights = [
    { name: t.seo.neapolitanPizza.pizzaMargherita, desc: t.seo.neapolitanPizza.pizzaMargheritaDesc, price: "€ 12,50", badge: t.seo.neapolitanPizza.badgeClassic },
    { name: t.seo.neapolitanPizza.pizzaBufalina, desc: t.seo.neapolitanPizza.pizzaBufalinaDesc, price: "€ 16,50", badge: t.seo.neapolitanPizza.badgeBestseller },
    { name: t.seo.neapolitanPizza.pizzaTartufo, desc: t.seo.neapolitanPizza.pizzaTartufoDesc, price: "€ 24,90", badge: t.seo.neapolitanPizza.badgePremium },
    { name: t.seo.neapolitanPizza.pizzaMare, desc: t.seo.neapolitanPizza.pizzaMareDesc, price: "€ 22,90", badge: t.seo.neapolitanPizza.badgePremium },
  ];

  const whyFeatures = [
    { icon: "🔥", title: t.seo.neapolitanPizza.whyOvenTitle, desc: t.seo.neapolitanPizza.whyOvenDesc },
    { icon: "⏱️", title: t.seo.neapolitanPizza.whyDoughTitle, desc: t.seo.neapolitanPizza.whyDoughDesc },
    { icon: "🍅", title: t.seo.neapolitanPizza.whyTomatoTitle, desc: t.seo.neapolitanPizza.whyTomatoDesc },
    { icon: "🧀", title: t.seo.neapolitanPizza.whyMozzarellaTitle, desc: t.seo.neapolitanPizza.whyMozzarellaDesc },
    { icon: "👨‍🍳", title: t.seo.neapolitanPizza.whyFamilyTitle, desc: t.seo.neapolitanPizza.whyFamilyDesc },
    { icon: "📍", title: t.seo.neapolitanPizza.whyLocationTitle, desc: t.seo.neapolitanPizza.whyLocationDesc },
  ];

  const occasions = [
    { title: t.seo.neapolitanPizza.occasionHunger, desc: t.seo.neapolitanPizza.occasionHungerDesc },
    { title: t.seo.neapolitanPizza.occasionFamily, desc: t.seo.neapolitanPizza.occasionFamilyDesc },
    { title: t.seo.neapolitanPizza.occasionDate, desc: t.seo.neapolitanPizza.occasionDateDesc },
    { title: t.seo.neapolitanPizza.occasionBusiness, desc: t.seo.neapolitanPizza.occasionBusinessDesc },
    { title: t.seo.neapolitanPizza.occasionMuseum, desc: t.seo.neapolitanPizza.occasionMuseumDesc },
    { title: t.seo.neapolitanPizza.occasionStation, desc: t.seo.neapolitanPizza.occasionStationDesc },
  ];

  const faqItems = [
    { q: t.seo.neapolitanPizza.faq1Question, a: t.seo.neapolitanPizza.faq1Answer },
    { q: t.seo.neapolitanPizza.faq2Question, a: t.seo.neapolitanPizza.faq2Answer },
    { q: t.seo.neapolitanPizza.faq3Question, a: t.seo.neapolitanPizza.faq3Answer },
    { q: t.seo.neapolitanPizza.faq4Question, a: t.seo.neapolitanPizza.faq4Answer },
    { q: t.seo.neapolitanPizza.faq5Question, a: t.seo.neapolitanPizza.faq5Answer },
    { q: t.seo.neapolitanPizza.faq6Question, a: t.seo.neapolitanPizza.faq6Answer },
    { q: t.seo.neapolitanPizza.faq7Question, a: t.seo.neapolitanPizza.faq7Answer },
  ];

  return (
    <>
      <StaticBotContent
        title={t.seo.neapolitanPizza.heroTitle}
        description={t.seo.neapolitanPizza.seoDescription}
        sections={[
          { heading: t.seo.neapolitanPizza.introTitle, content: t.seo.neapolitanPizza.introP1 },
          { heading: t.seo.neapolitanPizza.menuTitle, content: pizzaHighlights.map(p => `${p.name} – ${p.price}`) },
          { heading: t.seo.neapolitanPizza.whyTitle, content: whyFeatures.map(f => f.title) },
        ]}
      />
      <SEO
        title={t.seo.neapolitanPizza.seoTitle}
        description={t.seo.neapolitanPizza.seoDescription}
        canonical="/neapolitanische-pizza-muenchen"
      />
      <StructuredData type="restaurant" />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: t.nav.foodMenu, url: '/speisekarte' },
          { name: t.internalLinks.neapolitanPizza, url: '/neapolitanische-pizza-muenchen' }
        ]} 
      />

      {/* Pizza Menu JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Menu",
        "name": "Pizza Karte",
        "description": "Neapolitanische Pizza im Steinofen bei 400°C gebacken",
        "hasMenuSection": [
          {
            "@type": "MenuSection",
            "name": "Le Pizze Classiche",
            "hasMenuItem": [
              { "@type": "MenuItem", "name": "Pizza Margherita", "description": "San Marzano-Tomaten, Fior di Latte-Mozzarella, Basilikum", "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "12.50" }},
              { "@type": "MenuItem", "name": "Pizza Marinara", "description": "Crovarese Tomaten, Knoblauch, Oregano", "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "9.90" }}
            ]
          },
          {
            "@type": "MenuSection",
            "name": "Le Pizze preferite",
            "hasMenuItem": [
              { "@type": "MenuItem", "name": "Pizza Bufalina", "description": "San Marzano Tomaten, Büffelmozzarella, Basilikum", "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "16.50" }},
              { "@type": "MenuItem", "name": "Pizza Tartufo", "description": "San Marzano Tomaten, Fior di Latte, schwarzer Trüffel", "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "24.90" }}
            ]
          }
        ]
      })}} />

      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <Link to="/">
              <img src={storiaLogo} alt="STORIA – Italienisches Restaurant München Logo" width={128} height={128} loading="eager" className="h-24 md:h-32 w-auto mx-auto mb-6 hover:opacity-80 transition-opacity cursor-pointer" />
            </Link>
            
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">{t.seo.neapolitanPizza.heroBadge1}</span>
              <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">{t.seo.neapolitanPizza.heroBadge2}</span>
              <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">{t.seo.neapolitanPizza.heroBadge3}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">
              {t.seo.neapolitanPizza.heroTitle}
            </h1>
            <p className="text-lg text-muted-foreground mb-2">{t.seo.neapolitanPizza.heroSubtitle}</p>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
              {t.seo.neapolitanPizza.heroDescription}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <LocalizedLink to="reservierung">
                  <Utensils className="w-5 h-5 mr-2" />
                  {t.seo.neapolitanPizza.heroReserveBtn}
                </LocalizedLink>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <LocalizedLink to="speisekarte">
                  {t.seo.neapolitanPizza.heroMenuBtn}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </LocalizedLink>
              </Button>
            </div>
          </div>
        </section>

        {/* Social Proof Bar */}
        <section className="bg-primary text-primary-foreground py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-current" />
                <span>{t.seo.neapolitanPizza.socialProofRating}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{t.seo.neapolitanPizza.socialProofSince}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{t.seo.neapolitanPizza.socialProofLocation}</span>
              </div>
            </div>
          </div>
        </section>

        <Navigation />
        
        <main className="flex-grow">
          {/* Intro Section */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
                {t.seo.neapolitanPizza.introTitle}
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>{t.seo.neapolitanPizza.introP1}</p>
                <p>{t.seo.neapolitanPizza.introP2}</p>
              </div>
            </div>
          </section>

          {/* Explained Section */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.neapolitanPizza.explainedTitle}
              </h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold mb-3">{t.seo.neapolitanPizza.explainedWhatTitle}</h3>
                  <p className="text-muted-foreground">{t.seo.neapolitanPizza.explainedWhatDesc}</p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold mb-3">{t.seo.neapolitanPizza.explainedDoughTitle}</h3>
                  <p className="text-muted-foreground">{t.seo.neapolitanPizza.explainedDoughDesc}</p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold mb-3">{t.seo.neapolitanPizza.explainedOvenTitle}</h3>
                  <p className="text-muted-foreground">{t.seo.neapolitanPizza.explainedOvenDesc}</p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold mb-3">{t.seo.neapolitanPizza.explainedTomatoTitle}</h3>
                  <p className="text-muted-foreground">{t.seo.neapolitanPizza.explainedTomatoDesc}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Pizza Highlights */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {t.seo.neapolitanPizza.menuTitle}
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                {t.seo.neapolitanPizza.menuIntro}
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {pizzaHighlights.map((pizza, index) => (
                  <div key={index} className="bg-card p-6 rounded-lg border border-border relative">
                    {pizza.badge && (
                      <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        {pizza.badge}
                      </span>
                    )}
                    <h3 className="text-lg font-semibold mb-2">{pizza.name}</h3>
                    <p className="text-muted-foreground mb-3">{pizza.desc}</p>
                    <p className="text-primary font-semibold">{pizza.price}</p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button asChild>
                  <LocalizedLink to="speisekarte">
                    {t.seo.neapolitanPizza.menuLink}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </LocalizedLink>
                </Button>
              </div>
            </div>
          </section>

          {/* Why STORIA */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.neapolitanPizza.whyTitle}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {whyFeatures.map((feature, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Occasions */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.neapolitanPizza.occasionsTitle}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {occasions.map((occasion, index) => (
                  <div key={index} className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="font-semibold mb-2">{occasion.title}</h3>
                    <p className="text-muted-foreground">{occasion.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.neapolitanPizza.faqTitle}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          {/* Location */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {t.seo.neapolitanPizza.locationTitle}
              </h2>
              <p className="text-center text-muted-foreground mb-12">
                {t.seo.neapolitanPizza.locationIntro}
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-3">📍 {t.seo.neapolitanPizza.locationAddress}</h3>
                  <p className="text-muted-foreground">
                    Ristorante STORIA<br />
                    Karlstraße 47a<br />
                    80333 München
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-3">🚶 {t.seo.neapolitanPizza.locationNearby}</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>{t.seo.neapolitanPizza.locationNearby1}</li>
                    <li>{t.seo.neapolitanPizza.locationNearby2}</li>
                    <li>{t.seo.neapolitanPizza.locationNearby3}</li>
                  </ul>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-3">🕐 {t.seo.neapolitanPizza.locationHoursTitle}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t.contact.monFri}: 09:00 - 01:00<br />
                    {t.contact.satSun}: 12:00 - 01:00
                  </p>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <ConsentGoogleMaps
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.063!2d11.5628!3d48.1447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479e75f0a0c3c6e7%3A0x8c0b2b0b0b0b0b0b!2sKarlstra%C3%9Fe%2047a%2C%2080333%20M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1700000000000!5m2!1sde!2sde"
                  height={300}
                  title="STORIA Ristorante Standort"
                  className="w-full"
                />
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 md:py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                {t.seo.neapolitanPizza.ctaTitle}
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                {t.seo.neapolitanPizza.ctaDesc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" variant="secondary" asChild>
                  <LocalizedLink to="reservierung">
                    {t.seo.neapolitanPizza.ctaReserve}
                  </LocalizedLink>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <a href="tel:+498951519696">
                    <Phone className="w-5 h-5 mr-2" />
                    {t.seo.neapolitanPizza.ctaCall}
                  </a>
                </Button>
                <Button size="lg" className="bg-[#25D366] hover:bg-[#20BD5A] text-white" asChild>
                  <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {t.seo.neapolitanPizza.ctaWhatsapp}
                  </a>
                </Button>
              </div>
              <div className="space-y-2 text-sm opacity-80">
                <p>⭐⭐⭐⭐⭐ {t.seo.neapolitanPizza.ctaProof1}</p>
                <p>⭐⭐⭐⭐⭐ {t.seo.neapolitanPizza.ctaProof2}</p>
              </div>
            </div>
          </section>

          <ConsentElfsightReviews />
          <ReservationCTA />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default NeapolitanischePizza;
