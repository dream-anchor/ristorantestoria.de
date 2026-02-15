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
import { MapPin, Clock, CalendarDays, UtensilsCrossed, Wine, GlassWater, ArrowRight } from "lucide-react";

import storiaLogo from "@/assets/storia-logo.webp";
import heroImage from "@/assets/gaeste-terrasse-italiener-maxvorstadt-muenchen.webp";

const ItalienerMuenchen = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  const occasions = [
    { icon: UtensilsCrossed, title: t.seo.italienerMuenchen.occasionLunch, desc: t.seo.italienerMuenchen.occasionLunchDesc, link: "lunch-muenchen-maxvorstadt" },
    { icon: Wine, title: t.seo.italienerMuenchen.occasionDinner, desc: t.seo.italienerMuenchen.occasionDinnerDesc, link: "romantisches-dinner-muenchen" },
    { icon: CalendarDays, title: t.seo.italienerMuenchen.occasionEvents, desc: t.seo.italienerMuenchen.occasionEventsDesc, link: "eventlocation-muenchen-maxvorstadt" },
    { icon: GlassWater, title: t.seo.italienerMuenchen.occasionAperitivo, desc: t.seo.italienerMuenchen.occasionAperitivoDesc, link: "aperitivo-muenchen" },
  ];

  const faqItems = [
    { q: t.seo.italienerMuenchen.faq1Question, a: t.seo.italienerMuenchen.faq1Answer },
    { q: t.seo.italienerMuenchen.faq2Question, a: t.seo.italienerMuenchen.faq2Answer },
    { q: t.seo.italienerMuenchen.faq3Question, a: t.seo.italienerMuenchen.faq3Answer },
    { q: t.seo.italienerMuenchen.faq4Question, a: t.seo.italienerMuenchen.faq4Answer },
    { q: t.seo.italienerMuenchen.faq5Question, a: t.seo.italienerMuenchen.faq5Answer },
    { q: t.seo.italienerMuenchen.faq6Question, a: t.seo.italienerMuenchen.faq6Answer },
    { q: t.seo.italienerMuenchen.faq7Question, a: t.seo.italienerMuenchen.faq7Answer },
  ];

  return (
    <>
      <StaticBotContent
        title={t.seo.italienerMuenchen.heroTitle}
        description={t.seo.italienerMuenchen.heroDescription}
        sections={[
          { heading: t.seo.italienerMuenchen.kitchenTitle, content: [t.seo.italienerMuenchen.kitchenP1, t.seo.italienerMuenchen.kitchenP2] },
          { heading: t.seo.italienerMuenchen.occasionTitle, content: occasions.map(o => o.title) },
        ]}
      />
      <SEO
        title={t.seo.italienerMuenchen.seoTitle}
        description={t.seo.italienerMuenchen.seoDescription}
        canonical="/italiener-muenchen"
      />
      <StructuredData type="restaurant" />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: t.seo.italienerMuenchen.breadcrumb, url: '/italiener-muenchen' }
        ]}
      />
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
            src={heroImage}
            alt={t.seo.italienerMuenchen.heroTitle}
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
                {t.seo.italienerMuenchen.heroSubtitle}
              </p>
              <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 leading-tight">
                {t.seo.italienerMuenchen.heroTitle}
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                {t.seo.italienerMuenchen.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <LocalizedLink to="reservierung">{t.seo.italienerMuenchen.heroButton}</LocalizedLink>
                </Button>
                <Button size="lg" variant="outlineWhite" asChild>
                  <LocalizedLink to="speisekarte">{t.seo.italienerMuenchen.menuButton}</LocalizedLink>
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
                <span>{t.seo.italienerMuenchen.locationBadge1}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                <span>{t.seo.italienerMuenchen.locationBadge2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{t.seo.italienerMuenchen.locationBadge3}</span>
              </div>
            </div>
          </div>
        </section>

        <Navigation />

        <main className="flex-grow">

          {/* Intro Section */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-6">
                {t.seo.italienerMuenchen.introTitle}
              </h2>
              <div className="space-y-4 text-muted-foreground text-center">
                <p className="text-lg">{t.seo.italienerMuenchen.introP1}</p>
                <p>{t.seo.italienerMuenchen.introP2}</p>
                <p>{t.seo.italienerMuenchen.introP3}</p>
              </div>
              <div className="text-center mt-6">
                <LocalizedLink
                  to="ueber-uns"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  {t.seo.italienerMuenchen.pillarLink}
                  <ArrowRight className="w-4 h-4" />
                </LocalizedLink>
              </div>
            </div>
          </section>

          {/* Kitchen Section */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
                {t.seo.italienerMuenchen.kitchenTitle}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{t.seo.italienerMuenchen.kitchenP1}</p>
                <p>{t.seo.italienerMuenchen.kitchenP2}</p>
                <p>{t.seo.italienerMuenchen.kitchenP3}</p>
              </div>
            </div>
          </section>

          {/* Occasions */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.italienerMuenchen.occasionTitle}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
                {occasions.map((occasion, index) => {
                  const OccasionIcon = occasion.icon;
                  return (
                    <LocalizedLink key={index} to={occasion.link} className="text-center group">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                        <OccasionIcon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{occasion.title}</h3>
                      <p className="text-muted-foreground text-sm">{occasion.desc}</p>
                    </LocalizedLink>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Menu CTA */}
          <section className="py-16 md:py-20 bg-card border-y border-border">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                {t.seo.italienerMuenchen.menuCtaTitle}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t.seo.italienerMuenchen.menuCtaDesc}
              </p>
              <Button size="lg" asChild>
                <LocalizedLink to="speisekarte">
                  {t.seo.italienerMuenchen.menuCtaButton}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </LocalizedLink>
              </Button>
            </div>
          </section>

          {/* Location & Map */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
                {t.seo.italienerMuenchen.locationTitle}
              </h2>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-4">{t.seo.italienerMuenchen.addressTitle}</h3>
                  <p className="text-muted-foreground mb-4">
                    Ristorante STORIA<br />
                    Karlstraße 47a<br />
                    80333 München
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t.seo.italienerMuenchen.addressNote}
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-4">{t.seo.italienerMuenchen.transitTitle}</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>{t.seo.italienerMuenchen.transitUbahn}</li>
                    <li>{t.seo.italienerMuenchen.transitTram}</li>
                    <li>{t.seo.italienerMuenchen.transitSbahn}</li>
                    <li>{t.seo.italienerMuenchen.transitParking}</li>
                  </ul>
                </div>
              </div>
              <ConsentGoogleMaps src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d11.5658!3d48.1465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKarlstra%C3%9Fe%2047a%2C%2080333%20M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1" />
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
                {t.seo.italienerMuenchen.faqTitle}
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {faqItems.map((item, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="bg-card border border-border rounded-lg px-4">
                    <AccordionTrigger className="text-left font-medium">{item.q}</AccordionTrigger>
                    <AccordionContent forceMount className="text-muted-foreground data-[state=closed]:hidden">{item.a}</AccordionContent>
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
                {t.seo.italienerMuenchen.ctaTitle}
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                {t.seo.italienerMuenchen.ctaDesc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <LocalizedLink to="reservierung">{t.seo.italienerMuenchen.ctaButton}</LocalizedLink>
                </Button>
                <Button size="lg" variant="outlineWhite" asChild>
                  <a href="tel:+498951519696">089 51519696</a>
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
                <LocalizedLink to="neapolitanische-pizza-muenchen" className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center">
                  <span className="font-medium">{t.internalLinks.neapolitanPizza}</span>
                </LocalizedLink>
                <LocalizedLink to="lunch-muenchen-maxvorstadt" className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center">
                  <span className="font-medium">{t.internalLinks.lunchMunich}</span>
                </LocalizedLink>
                <LocalizedLink to="aperitivo-muenchen" className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center">
                  <span className="font-medium">{t.internalLinks.aperitivoMunich}</span>
                </LocalizedLink>
                <LocalizedLink to="italiener-koenigsplatz" className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center">
                  <span className="font-medium">{t.internalLinks.italienerKoenigsplatz}</span>
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

export default ItalienerMuenchen;
