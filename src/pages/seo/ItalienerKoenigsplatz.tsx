import LocalizedLink from "@/components/LocalizedLink";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ConsentElfsightReviews from "@/components/ConsentElfsightReviews";
import ConsentGoogleMaps from "@/components/ConsentGoogleMaps";
import StaticBotContent from "@/components/StaticBotContent";
import ReservationCTA from "@/components/ReservationCTA";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { MapPin, Clock, Footprints, Building2, Landmark, UtensilsCrossed, ArrowRight } from "lucide-react";

// Images
import storiaLogo from "@/assets/storia-logo.webp";
import aussenHero from "@/assets/aussen.webp";

const ItalienerKoenigsplatz = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  const nearbyAttractions = [
    { icon: Landmark, title: t.seo.italienerKoenigsplatz.attraction1Title, distance: t.seo.italienerKoenigsplatz.attraction1Distance },
    { icon: Building2, title: t.seo.italienerKoenigsplatz.attraction2Title, distance: t.seo.italienerKoenigsplatz.attraction2Distance },
    { icon: Building2, title: t.seo.italienerKoenigsplatz.attraction3Title, distance: t.seo.italienerKoenigsplatz.attraction3Distance },
    { icon: Building2, title: t.seo.italienerKoenigsplatz.attraction4Title, distance: t.seo.italienerKoenigsplatz.attraction4Distance },
    { icon: Landmark, title: t.seo.italienerKoenigsplatz.attraction5Title, distance: t.seo.italienerKoenigsplatz.attraction5Distance },
    { icon: Building2, title: t.seo.italienerKoenigsplatz.attraction6Title, distance: t.seo.italienerKoenigsplatz.attraction6Distance },
  ];

  const highlights = [
    { icon: UtensilsCrossed, title: t.seo.italienerKoenigsplatz.highlight1Title, desc: t.seo.italienerKoenigsplatz.highlight1Desc },
    { icon: MapPin, title: t.seo.italienerKoenigsplatz.highlight2Title, desc: t.seo.italienerKoenigsplatz.highlight2Desc },
    { icon: Clock, title: t.seo.italienerKoenigsplatz.highlight3Title, desc: t.seo.italienerKoenigsplatz.highlight3Desc },
    { icon: Footprints, title: t.seo.italienerKoenigsplatz.highlight4Title, desc: t.seo.italienerKoenigsplatz.highlight4Desc },
  ];

  const faqItems = [
    { q: t.seo.italienerKoenigsplatz.faq1Question, a: t.seo.italienerKoenigsplatz.faq1Answer },
    { q: t.seo.italienerKoenigsplatz.faq2Question, a: t.seo.italienerKoenigsplatz.faq2Answer },
    { q: t.seo.italienerKoenigsplatz.faq3Question, a: t.seo.italienerKoenigsplatz.faq3Answer },
    { q: t.seo.italienerKoenigsplatz.faq4Question, a: t.seo.italienerKoenigsplatz.faq4Answer },
    { q: t.seo.italienerKoenigsplatz.faq5Question, a: t.seo.italienerKoenigsplatz.faq5Answer },
  ];

  return (
    <>
      <StaticBotContent
        title={t.seo.italienerKoenigsplatz.heroTitle}
        description={t.seo.italienerKoenigsplatz.heroDescription}
        sections={[
          { heading: t.seo.italienerKoenigsplatz.nearbyTitle, content: nearbyAttractions.map(a => a.title) },
          { heading: t.seo.italienerKoenigsplatz.highlightsTitle, content: highlights.map(h => h.title) },
        ]}
      />
      <SEO
        title={t.seo.italienerKoenigsplatz.seoTitle}
        description={t.seo.italienerKoenigsplatz.seoDescription}
        canonical="/italiener-koenigsplatz"
      />
      <StructuredData type="restaurant" />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: t.seo.italienerKoenigsplatz.breadcrumb, url: '/italiener-koenigsplatz' }
        ]}
      />
      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": { "@type": "Answer", "text": item.a }
        }))
      })}} />

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <img
            src={aussenHero}
            alt={t.seo.italienerKoenigsplatz.heroTitle}
            width={1200}
            height={800}
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <Link to="/">
              <img src={storiaLogo} alt="STORIA Logo" className="h-20 md:h-28 w-auto mx-auto mb-6 brightness-0 invert hover:opacity-80 transition-opacity" />
            </Link>
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-8 py-10 md:px-12 md:py-12">
              <p className="text-sm md:text-base mb-3 tracking-[0.3em] uppercase">
                {t.seo.italienerKoenigsplatz.heroSubtitle}
              </p>
              <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 leading-tight">
                {t.seo.italienerKoenigsplatz.heroTitle}
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                {t.seo.italienerKoenigsplatz.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  asChild
                >
                  <LocalizedLink to="reservierung">
                    {t.seo.italienerKoenigsplatz.heroButton}
                  </LocalizedLink>
                </Button>
                <Button
                  size="lg"
                  variant="outlineWhite"
                  asChild
                >
                  <LocalizedLink to="speisekarte">
                    {t.seo.italienerKoenigsplatz.menuButton}
                  </LocalizedLink>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Location Badge */}
        <section className="bg-primary text-primary-foreground py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{t.seo.italienerKoenigsplatz.locationBadge1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Footprints className="w-5 h-5" />
                <span>{t.seo.italienerKoenigsplatz.locationBadge2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{t.seo.italienerKoenigsplatz.locationBadge3}</span>
              </div>
            </div>
          </div>
        </section>

        <Navigation />

        <main className="flex-grow">

          {/* Intro Section with Pillar Link */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-6">
                {t.seo.italienerKoenigsplatz.introTitle}
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-8">
                {t.seo.italienerKoenigsplatz.introP1}
              </p>
              <p className="text-muted-foreground text-center mb-8">
                {t.seo.italienerKoenigsplatz.introP2}
              </p>
              {/* Pillar Link back to Homepage */}
              <div className="text-center">
                <LocalizedLink
                  to="home"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  {t.seo.italienerKoenigsplatz.pillarLink}
                  <ArrowRight className="w-4 h-4" />
                </LocalizedLink>
              </div>
            </div>
          </section>

          {/* Nearby Attractions */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {t.seo.italienerKoenigsplatz.nearbyTitle}
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                {t.seo.italienerKoenigsplatz.nearbySubtitle}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {nearbyAttractions.map((attraction, index) => {
                  const AttractionIcon = attraction.icon;
                  return (
                    <div key={index} className="bg-card p-6 rounded-lg border border-border text-center">
                      <AttractionIcon className="w-8 h-8 text-primary mx-auto mb-3" />
                      <h3 className="font-semibold mb-1">{attraction.title}</h3>
                      <p className="text-sm text-muted-foreground">{attraction.distance}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Restaurant Highlights */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.italienerKoenigsplatz.highlightsTitle}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
                {highlights.map((highlight, index) => {
                  const HighlightIcon = highlight.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <HighlightIcon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{highlight.title}</h3>
                      <p className="text-muted-foreground text-sm">{highlight.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Menu CTA Section */}
          <section className="py-16 md:py-20 bg-card border-y border-border">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                {t.seo.italienerKoenigsplatz.menuCtaTitle}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t.seo.italienerKoenigsplatz.menuCtaDesc}
              </p>
              <Button size="lg" asChild>
                <LocalizedLink to="speisekarte">
                  {t.seo.italienerKoenigsplatz.menuCtaButton}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </LocalizedLink>
              </Button>
            </div>
          </section>

          {/* Location & Map */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
                {t.seo.italienerKoenigsplatz.locationTitle}
              </h2>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-4">{t.seo.italienerKoenigsplatz.addressTitle}</h3>
                  <p className="text-muted-foreground mb-4">
                    Ristorante STORIA<br />
                    Karlstraße 47a<br />
                    80333 München
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t.seo.italienerKoenigsplatz.addressNote}
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-4">{t.seo.italienerKoenigsplatz.transitTitle}</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>{t.seo.italienerKoenigsplatz.transitUbahn}</li>
                    <li>{t.seo.italienerKoenigsplatz.transitTram}</li>
                    <li>{t.seo.italienerKoenigsplatz.transitSbahn}</li>
                  </ul>
                </div>
              </div>
              <ConsentGoogleMaps src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d11.5658!3d48.1465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKarlstra%C3%9Fe%2047a%2C%2080333%20M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1" />
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
                {t.seo.italienerKoenigsplatz.faqTitle}
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {faqItems.map((item, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="bg-card border border-border rounded-lg px-4">
                    <AccordionTrigger className="text-left font-medium">{item.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground data-[state=closed]:hidden">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          <ConsentElfsightReviews />

          {/* Final CTA */}
          <section className="py-16 md:py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                {t.seo.italienerKoenigsplatz.ctaTitle}
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                {t.seo.italienerKoenigsplatz.ctaDesc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <LocalizedLink to="reservierung">
                    {t.seo.italienerKoenigsplatz.ctaButton}
                  </LocalizedLink>
                </Button>
                <Button size="lg" variant="outlineWhite" asChild>
                  <a href="tel:+498951519696">
                    089 51519696
                  </a>
                </Button>
              </div>
            </div>
          </section>

          {/* Related Pages */}
          <section className="py-12 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-serif font-semibold text-center mb-8">
                {t.internalLinks.title}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <LocalizedLink
                  to="neapolitanische-pizza-muenchen"
                  className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center"
                >
                  <span className="text-2xl mb-2 block">🍕</span>
                  <span className="font-medium">{t.internalLinks.neapolitanPizza}</span>
                </LocalizedLink>
                <LocalizedLink
                  to="wild-essen-muenchen"
                  className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center"
                >
                  <span className="text-2xl mb-2 block">🦌</span>
                  <span className="font-medium">{t.internalLinks.gameDishesMunich}</span>
                </LocalizedLink>
                <LocalizedLink
                  to="aperitivo-muenchen"
                  className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center"
                >
                  <span className="text-2xl mb-2 block">🥂</span>
                  <span className="font-medium">{t.internalLinks.aperitivoMunich}</span>
                </LocalizedLink>
                <LocalizedLink
                  to="romantisches-dinner-muenchen"
                  className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center"
                >
                  <span className="text-2xl mb-2 block">❤️</span>
                  <span className="font-medium">{t.internalLinks.romanticDinner}</span>
                </LocalizedLink>
              </div>
            </div>
          </section>

          <ReservationCTA />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ItalienerKoenigsplatz;
