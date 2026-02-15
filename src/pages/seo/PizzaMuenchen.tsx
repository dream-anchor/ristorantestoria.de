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
import neapolitanPizzaHero from "@/assets/neapolitan-pizza-hero.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { Phone, MessageCircle, MapPin, Clock, Star, Utensils, ArrowRight } from "lucide-react";

const PizzaMuenchen = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  const pizzaHighlights = [
    { name: t.seo.pizzaMuenchen.pizzaMargherita, desc: t.seo.pizzaMuenchen.pizzaMargheritaDesc, price: "\u20ac 12,50", badge: t.seo.pizzaMuenchen.badgeClassic },
    { name: t.seo.pizzaMuenchen.pizzaBufalina, desc: t.seo.pizzaMuenchen.pizzaBufalinaDesc, price: "\u20ac 16,50", badge: t.seo.pizzaMuenchen.badgeBestseller },
    { name: t.seo.pizzaMuenchen.pizzaTartufo, desc: t.seo.pizzaMuenchen.pizzaTartufoDesc, price: "\u20ac 24,90", badge: t.seo.pizzaMuenchen.badgePremium },
    { name: t.seo.pizzaMuenchen.pizzaDiavola, desc: t.seo.pizzaMuenchen.pizzaDiavolaDesc, price: "\u20ac 14,50", badge: t.seo.pizzaMuenchen.badgeSpicy },
  ];

  const whyFeatures = [
    { icon: "\ud83d\udd25", title: t.seo.pizzaMuenchen.why1Title, desc: t.seo.pizzaMuenchen.why1Desc },
    { icon: "\u23f1\ufe0f", title: t.seo.pizzaMuenchen.why2Title, desc: t.seo.pizzaMuenchen.why2Desc },
    { icon: "\ud83c\udf45", title: t.seo.pizzaMuenchen.why3Title, desc: t.seo.pizzaMuenchen.why3Desc },
    { icon: "\ud83d\udc68\u200d\ud83c\udf73", title: t.seo.pizzaMuenchen.why4Title, desc: t.seo.pizzaMuenchen.why4Desc },
    { icon: "\ud83d\udccd", title: t.seo.pizzaMuenchen.why5Title, desc: t.seo.pizzaMuenchen.why5Desc },
    { icon: "\u2b50", title: t.seo.pizzaMuenchen.why6Title, desc: t.seo.pizzaMuenchen.why6Desc },
  ];

  const occasions = [
    { title: t.seo.pizzaMuenchen.occasion1Title, desc: t.seo.pizzaMuenchen.occasion1Desc },
    { title: t.seo.pizzaMuenchen.occasion2Title, desc: t.seo.pizzaMuenchen.occasion2Desc },
    { title: t.seo.pizzaMuenchen.occasion3Title, desc: t.seo.pizzaMuenchen.occasion3Desc },
    { title: t.seo.pizzaMuenchen.occasion4Title, desc: t.seo.pizzaMuenchen.occasion4Desc },
  ];

  const faqItems = [
    { q: t.seo.pizzaMuenchen.faq1Question, a: t.seo.pizzaMuenchen.faq1Answer },
    { q: t.seo.pizzaMuenchen.faq2Question, a: t.seo.pizzaMuenchen.faq2Answer },
    { q: t.seo.pizzaMuenchen.faq3Question, a: t.seo.pizzaMuenchen.faq3Answer },
    { q: t.seo.pizzaMuenchen.faq4Question, a: t.seo.pizzaMuenchen.faq4Answer },
    { q: t.seo.pizzaMuenchen.faq5Question, a: t.seo.pizzaMuenchen.faq5Answer },
  ];

  return (
    <>
      <StaticBotContent
        title={t.seo.pizzaMuenchen.heroTitle}
        description={t.seo.pizzaMuenchen.seoDescription}
        sections={[
          { heading: t.seo.pizzaMuenchen.introTitle, content: t.seo.pizzaMuenchen.introP1 },
          { heading: t.seo.pizzaMuenchen.menuTitle, content: pizzaHighlights.map(p => `${p.name} \u2013 ${p.price}`) },
          { heading: t.seo.pizzaMuenchen.whyTitle, content: whyFeatures.map(f => f.title) },
        ]}
      />
      <SEO
        title={t.seo.pizzaMuenchen.seoTitle}
        description={t.seo.pizzaMuenchen.seoDescription}
        canonical="/pizza-muenchen"
      />
      <StructuredData type="restaurant" />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: t.nav.foodMenu, url: '/speisekarte' },
          { name: t.seo.pizzaMuenchen.breadcrumb, url: '/pizza-muenchen' }
        ]}
      />

      {/* FAQPage JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      })}} />

      {/* Pizza Menu JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Menu",
        "name": "Pizza Karte",
        "description": "Steinofen-Pizza bei 400\u00b0C gebacken",
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
              { "@type": "MenuItem", "name": "Pizza Bufalina", "description": "San Marzano Tomaten, B\u00fcffelmozzarella, Basilikum", "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "16.50" }},
              { "@type": "MenuItem", "name": "Pizza Tartufo", "description": "San Marzano Tomaten, Fior di Latte, schwarzer Tr\u00fcffel", "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "24.90" }}
            ]
          }
        ]
      })}} />

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <img
            src={neapolitanPizzaHero}
            alt="Steinofen-Pizza M\u00fcnchen im STORIA Maxvorstadt"
            width={1920}
            height={1080}
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-8 py-10 md:px-12 md:py-12 max-w-4xl mx-auto text-white">
              <Link to="/">
                <img src={storiaLogo} alt="STORIA \u2013 Italienisches Restaurant M\u00fcnchen Logo" width={128} height={128} loading="eager" className="h-24 md:h-32 w-auto mx-auto mb-6 hover:opacity-80 transition-opacity cursor-pointer brightness-0 invert" />
              </Link>

              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">{t.seo.pizzaMuenchen.heroBadge1}</span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">{t.seo.pizzaMuenchen.heroBadge2}</span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">{t.seo.pizzaMuenchen.heroBadge3}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">
                {t.seo.pizzaMuenchen.heroTitle}
              </h1>
              <p className="text-lg text-white/80 mb-2">{t.seo.pizzaMuenchen.heroSubtitle}</p>
              <p className="text-lg text-white/80 mb-8 max-w-3xl mx-auto">
                {t.seo.pizzaMuenchen.heroDescription}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <LocalizedLink to="reservierung">
                    <Utensils className="w-5 h-5 mr-2" />
                    {t.seo.pizzaMuenchen.heroReserveBtn}
                  </LocalizedLink>
                </Button>
                <Button size="lg" variant="outlineWhite" asChild>
                  <LocalizedLink to="speisekarte#pizza">
                    {t.seo.pizzaMuenchen.heroMenuBtn}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </LocalizedLink>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Bar */}
        <section className="bg-primary text-primary-foreground py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-current" />
                <span>{t.seo.pizzaMuenchen.socialProofRating}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{t.seo.pizzaMuenchen.socialProofSince}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{t.seo.pizzaMuenchen.socialProofLocation}</span>
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
                {t.seo.pizzaMuenchen.introTitle}
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>{t.seo.pizzaMuenchen.introP1}</p>
                <p>{t.seo.pizzaMuenchen.introP2}</p>
              </div>
            </div>
          </section>

          {/* Pizza Highlights */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {t.seo.pizzaMuenchen.menuTitle}
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                {t.seo.pizzaMuenchen.menuIntro}
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
                  <LocalizedLink to="speisekarte#pizza">
                    {t.seo.pizzaMuenchen.menuLink}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </LocalizedLink>
                </Button>
              </div>
            </div>
          </section>

          {/* Why STORIA */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.pizzaMuenchen.whyTitle}
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
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.pizzaMuenchen.occasionsTitle}
              </h2>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.pizzaMuenchen.faqTitle}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent forceMount className="text-muted-foreground data-[state=closed]:hidden">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          {/* Location */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {t.seo.pizzaMuenchen.locationTitle}
              </h2>
              <p className="text-center text-muted-foreground mb-12">
                {t.seo.pizzaMuenchen.locationIntro}
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-3">{"\ud83d\udccd"} {t.seo.pizzaMuenchen.locationAddress}</h3>
                  <p className="text-muted-foreground">
                    Ristorante STORIA<br />
                    Karlstra\u00dfe 47a<br />
                    80333 M\u00fcnchen
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-3">{"\ud83d\udeb6"} {t.seo.pizzaMuenchen.locationNearby}</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>{t.seo.pizzaMuenchen.locationNearby1}</li>
                    <li>{t.seo.pizzaMuenchen.locationNearby2}</li>
                    <li>{t.seo.pizzaMuenchen.locationNearby3}</li>
                  </ul>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-3">{"\ud83d\udd50"} {t.seo.pizzaMuenchen.locationHoursTitle}</h3>
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
                {t.seo.pizzaMuenchen.ctaTitle}
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                {t.seo.pizzaMuenchen.ctaDesc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <LocalizedLink to="reservierung">
                    {t.seo.pizzaMuenchen.ctaReserve}
                  </LocalizedLink>
                </Button>
                <Button size="lg" variant="outlineWhite" asChild>
                  <a href="tel:+498951519696">
                    <Phone className="w-5 h-5 mr-2" />
                    {t.seo.pizzaMuenchen.ctaCall}
                  </a>
                </Button>
                <Button size="lg" className="bg-[#25D366] hover:bg-[#20BD5A] text-white" asChild>
                  <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {t.seo.pizzaMuenchen.ctaWhatsapp}
                  </a>
                </Button>
              </div>
            </div>
          </section>

          {/* Related Pages */}
          <section className="py-12 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-serif font-semibold text-center mb-8">
                {t.seo.pizzaMuenchen.relatedTitle}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <LocalizedLink
                  to="neapolitanische-pizza-muenchen"
                  className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center"
                >
                  <span className="text-2xl mb-2 block">{"\ud83c\udf55"}</span>
                  <span className="font-medium">{t.internalLinks.neapolitanPizza}</span>
                </LocalizedLink>
                <LocalizedLink
                  to="lunch-muenchen-maxvorstadt"
                  className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center"
                >
                  <span className="text-2xl mb-2 block">{"\u2600\ufe0f"}</span>
                  <span className="font-medium">{t.internalLinks.lunchMunich}</span>
                </LocalizedLink>
                <LocalizedLink
                  to="italiener-muenchen"
                  className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center"
                >
                  <span className="text-2xl mb-2 block">{"\ud83c\uddee\ud83c\uddf9"}</span>
                  <span className="font-medium">{t.internalLinks.italienerMuenchen}</span>
                </LocalizedLink>
                <LocalizedLink
                  to="aperitivo-muenchen"
                  className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center"
                >
                  <span className="text-2xl mb-2 block">{"\ud83c\udf78"}</span>
                  <span className="font-medium">{t.internalLinks.aperitivoMunich}</span>
                </LocalizedLink>
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

export default PizzaMuenchen;
