import LocalizedLink from "@/components/LocalizedLink";
import { Link } from "react-router-dom";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import GoogleReviews from "@/components/GoogleReviews";
import ConsentGoogleMaps from "@/components/ConsentGoogleMaps";
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
import { MapPin, Clock, UtensilsCrossed, Leaf, Wine, ArrowRight, Phone, MessageCircle } from "lucide-react";

import storiaLogo from "@/assets/storia-logo.webp";
import pastaHero from "@/assets/pasta.webp";

const PastaFrescaMuenchen = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  const highlights = [
    { icon: UtensilsCrossed, title: t.seo.pastaFrescaMuenchen.highlight1Title, desc: t.seo.pastaFrescaMuenchen.highlight1Desc },
    { icon: Leaf, title: t.seo.pastaFrescaMuenchen.highlight2Title, desc: t.seo.pastaFrescaMuenchen.highlight2Desc },
    { icon: Wine, title: t.seo.pastaFrescaMuenchen.highlight3Title, desc: t.seo.pastaFrescaMuenchen.highlight3Desc },
    { icon: MapPin, title: t.seo.pastaFrescaMuenchen.highlight4Title, desc: t.seo.pastaFrescaMuenchen.highlight4Desc },
  ];

  const faqItems = [
    { q: t.seo.pastaFrescaMuenchen.faq1Question, a: t.seo.pastaFrescaMuenchen.faq1Answer },
    { q: t.seo.pastaFrescaMuenchen.faq2Question, a: t.seo.pastaFrescaMuenchen.faq2Answer },
    { q: t.seo.pastaFrescaMuenchen.faq3Question, a: t.seo.pastaFrescaMuenchen.faq3Answer },
    { q: t.seo.pastaFrescaMuenchen.faq4Question, a: t.seo.pastaFrescaMuenchen.faq4Answer },
    { q: t.seo.pastaFrescaMuenchen.faq5Question, a: t.seo.pastaFrescaMuenchen.faq5Answer },
  ];

  return (
    <>
      <SEO
        title={t.seo.pastaFrescaMuenchen.seoTitle}
        description={t.seo.pastaFrescaMuenchen.seoDescription}
        canonical="/pasta-fresca-muenchen"
      />
      <StructuredData type="restaurant" />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: t.seo.pastaFrescaMuenchen.breadcrumb, url: '/pasta-fresca-muenchen' }
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

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <img
            src={pastaHero}
            alt="Hausgemachte frische Pasta im Ristorante STORIA München"
            width={1920}
            height={1080}
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-8 py-10 md:px-12 md:py-12 max-w-4xl mx-auto text-white">
              <Link to="/">
                <img src={storiaLogo} alt="STORIA – Italienisches Restaurant München Logo" width={128} height={128} loading="eager" className="h-24 md:h-32 w-auto mx-auto mb-6 hover:opacity-80 transition-opacity cursor-pointer brightness-0 invert" />
              </Link>

              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">{t.seo.pastaFrescaMuenchen.heroSubtitle}</span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">Karlstraße 47a</span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">4,5 ⭐ Google</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">
                {t.seo.pastaFrescaMuenchen.heroTitle}
              </h1>
              <p className="text-lg text-white/80 mb-8 max-w-3xl mx-auto">
                {t.seo.pastaFrescaMuenchen.heroDescription}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <LocalizedLink to="reservierung">
                    <UtensilsCrossed className="w-5 h-5 mr-2" />
                    {t.seo.pastaFrescaMuenchen.heroButton}
                  </LocalizedLink>
                </Button>
                <Button size="lg" variant="outlineWhite" asChild>
                  <LocalizedLink to="speisekarte">
                    {t.seo.pastaFrescaMuenchen.menuButton}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </LocalizedLink>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Navigation />

        <main className="flex-grow">
          {/* Intro Section */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <BreadcrumbNav crumbs={[{ label: t.breadcrumb.home, href: '/' }, { label: t.seo.pastaFrescaMuenchen.breadcrumb }]} />
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
                {t.seo.pastaFrescaMuenchen.introTitle}
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>{t.seo.pastaFrescaMuenchen.introP1}</p>
                <p>{t.seo.pastaFrescaMuenchen.introP2}</p>
                <p>{t.seo.pastaFrescaMuenchen.introP3}</p>
              </div>
            </div>
          </section>

          {/* Highlights */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.pastaFrescaMuenchen.highlightsTitle}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
                {highlights.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Menu CTA */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-3xl text-center">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                {t.seo.pastaFrescaMuenchen.menuCtaTitle}
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                {t.seo.pastaFrescaMuenchen.menuCtaDesc}
              </p>
              <Button asChild>
                <LocalizedLink to="speisekarte">
                  {t.seo.pastaFrescaMuenchen.menuCtaButton}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </LocalizedLink>
              </Button>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.pastaFrescaMuenchen.faqTitle}
              </h2>
              <Accordion type="multiple" defaultValue={["faq-0","faq-1","faq-2","faq-3","faq-4"]} className="w-full">
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
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.pastaFrescaMuenchen.locationTitle}
              </h2>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-3">📍 {t.seo.pastaFrescaMuenchen.addressTitle}</h3>
                  <p className="text-muted-foreground text-sm">
                    Ristorante STORIA<br />
                    Karlstraße 47a<br />
                    80333 München<br />
                    <span className="mt-2 block">{t.seo.pastaFrescaMuenchen.addressNote}</span>
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-3">🚶 {t.seo.pastaFrescaMuenchen.transitTitle}</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>{t.seo.pastaFrescaMuenchen.transitUbahn}</li>
                    <li>{t.seo.pastaFrescaMuenchen.transitTram}</li>
                    <li>{t.seo.pastaFrescaMuenchen.transitSbahn}</li>
                  </ul>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-3">🕐 Öffnungszeiten</h3>
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
                {t.seo.pastaFrescaMuenchen.ctaTitle}
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                {t.seo.pastaFrescaMuenchen.ctaDesc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <LocalizedLink to="reservierung">
                    {t.seo.pastaFrescaMuenchen.ctaButton}
                  </LocalizedLink>
                </Button>
                <Button size="lg" variant="outlineWhite" asChild>
                  <a href="tel:+498951519696">
                    <Phone className="w-5 h-5 mr-2" />
                    089 51519696
                  </a>
                </Button>
                <Button size="lg" className="bg-[#25D366] hover:bg-[#20BD5A] text-white" asChild>
                  <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
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
                  to="aperitivo-muenchen"
                  className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center"
                >
                  <span className="text-2xl mb-2 block">🍸</span>
                  <span className="font-medium">{t.internalLinks.aperitivoMunich}</span>
                </LocalizedLink>
                <LocalizedLink
                  to="lunch-muenchen-maxvorstadt"
                  className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center"
                >
                  <span className="text-2xl mb-2 block">☀️</span>
                  <span className="font-medium">{t.internalLinks.lunchMunich}</span>
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

          <GoogleReviews />
          <ReservationCTA />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PastaFrescaMuenchen;
