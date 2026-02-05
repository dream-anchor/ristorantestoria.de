import LocalizedLink from "@/components/LocalizedLink";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ConsentElfsightReviews from "@/components/ConsentElfsightReviews";
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
import { MapPin, Clock, Utensils, ChefHat, Euro, ArrowRight, Salad, Pizza, Users, Receipt, Building, CalendarClock, BadgeCheck, MessageCircle } from "lucide-react";

// Images
import businessLunchAtmosphere from "@/assets/business-lunch-atmosphere.webp";
import businessLunchFood from "@/assets/business-lunch-food.webp";

const LunchMuenchen = () => {
  const { t } = useLanguage();
  const location = useLocation();
  usePrerenderReady(true);

  // Scroll position restoration
  useEffect(() => {
    const savedPosition = sessionStorage.getItem('lunchScrollPosition');
    if (savedPosition && location.state?.fromLunch) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition));
        sessionStorage.removeItem('lunchScrollPosition');
      }, 100);
    }
  }, [location]);

  const handleMenuClick = () => {
    sessionStorage.setItem('lunchScrollPosition', String(window.scrollY));
  };

  const benefits = [
    { icon: Clock, title: t.seo.lunch.benefit1Title, description: t.seo.lunch.benefit1Desc },
    { icon: MapPin, title: t.seo.lunch.benefit2Title, description: t.seo.lunch.benefit2Desc },
    { icon: Utensils, title: t.seo.lunch.benefit3Title, description: t.seo.lunch.benefit3Desc },
    { icon: Euro, title: t.seo.lunch.benefit4Title, description: t.seo.lunch.benefit4Desc },
  ];

  const businessBenefits = [
    { icon: Receipt, title: t.seo.lunch.businessInvoice, description: t.seo.lunch.businessInvoiceDesc },
    { icon: Users, title: t.seo.lunch.businessTeam, description: t.seo.lunch.businessTeamDesc },
    { icon: Clock, title: t.seo.lunch.businessService, description: t.seo.lunch.businessServiceDesc },
    { icon: Building, title: t.seo.lunch.businessLocation, description: t.seo.lunch.businessLocationDesc },
  ];

  const lunchOffers = [
    { title: t.seo.lunch.pastaTitle, description: t.seo.lunch.pastaDesc, icon: ChefHat, badge: null },
    { title: t.seo.lunch.pizzaTitle, description: t.seo.lunch.pizzaDesc, icon: Pizza, badge: t.seo.lunch.pizzaPopular },
    { title: t.seo.lunch.saladTitle, description: t.seo.lunch.saladDesc, icon: Salad, badge: null },
  ];

  const faqItems = [
    { q: t.seo.lunch.faq1Question, a: t.seo.lunch.faq1Answer },
    { q: t.seo.lunch.faq2Question, a: t.seo.lunch.faq2Answer },
    { q: t.seo.lunch.faq3Question, a: t.seo.lunch.faq3Answer },
    { q: t.seo.lunch.faq4Question, a: t.seo.lunch.faq4Answer },
    { q: t.seo.lunch.faq5Question, a: t.seo.lunch.faq5Answer },
  ];

  return (
    <>
      <StaticBotContent
        title={t.seo.lunch.heroTitle}
        description={t.seo.lunch.heroDescription}
        sections={[
          { heading: t.seo.lunch.benefitsTitle, content: [t.seo.lunch.benefit1Title, t.seo.lunch.benefit2Title, t.seo.lunch.benefit3Title, t.seo.lunch.benefit4Title] },
          { heading: t.seo.lunch.businessTitle, content: [t.seo.lunch.businessInvoice, t.seo.lunch.businessTeam, t.seo.lunch.businessService] },
          { heading: t.seo.lunch.monFri, content: '11:30-14:30' }
        ]}
      />
      <SEO
        title={t.seo.lunch.heroTitle}
        description={t.seo.lunch.heroDescription}
        canonical="/lunch-muenchen-maxvorstadt"
      />
      <StructuredData type="restaurant" />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: t.internalLinks.lunchMunich, url: '/lunch-muenchen-maxvorstadt' }
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
        
        {/* Hero Section with Full Image */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <img 
            src={businessLunchAtmosphere} 
            alt={t.seo.lunch.heroTitle}
            width={1200}
            height={800}
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-8 py-10 md:px-12 md:py-12">
              <p className="text-sm md:text-base mb-3 tracking-[0.3em] uppercase">
                {t.seo.lunch.heroSubtitle}
              </p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
                {t.seo.lunch.heroTitle}
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                {t.seo.lunch.heroDescription}
              </p>
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-base md:text-lg px-8 py-6 shadow-lg"
                asChild
              >
                <LocalizedLink to="reservierung?from=lunch-muenchen-maxvorstadt">
                  {t.seo.lunch.urgencyButton}
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
                <BadgeCheck className="w-5 h-5" />
                <span>{t.seo.lunch.since1995}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{t.seo.lunch.centralLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{t.seo.lunch.monFri}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Urgency Banner */}
          <section className="bg-muted/50 border-b border-border py-3">
            <div className="container mx-auto px-4">
              <LocalizedLink 
                to="reservierung?from=lunch-muenchen-maxvorstadt" 
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <CalendarClock className="w-4 h-4 text-primary" />
                <span className="underline-offset-2 group-hover:underline">
                  {t.seo.lunch.urgencyTitle}
                </span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </LocalizedLink>
            </div>
          </section>

        <Navigation />
        
        <main className="flex-grow">

          {/* 3-Gänge Mittagsmenü Highlight */}
          <section className="py-12 md:py-16 bg-card border-b border-border">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                {t.seo.lunch.menuTitle}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {t.seo.lunch.menuDesc}
              </p>
              <Button variant="default" size="lg" asChild>
                <LocalizedLink to="mittags-menu?from=lunch-muenchen-maxvorstadt" onClick={handleMenuClick}>
                  {t.seo.lunch.menuButton}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </LocalizedLink>
              </Button>
            </div>
          </section>

          {/* Business Benefits */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.lunch.businessTitle}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
                {businessBenefits.map((benefit, index) => {
                  const BenefitIcon = benefit.icon;
                  return (
                    <div key={index} className="text-center p-4">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <BenefitIcon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Benefits Grid */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.lunch.benefitsTitle}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
                {benefits.map((benefit, index) => {
                  const BenefitIcon = benefit.icon;
                  return (
                    <div key={index} className="text-center p-4">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <BenefitIcon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  );
                })}
              </div>
              
              {/* CTA after Benefits */}
              <div className="text-center mt-12">
                <Button size="lg" variant="outline" asChild>
                  <LocalizedLink to="reservierung?from=lunch-muenchen-maxvorstadt">
                    {t.seo.lunch.urgencyButton}
                  </LocalizedLink>
                </Button>
              </div>
            </div>
          </section>

          {/* Lunch Offers */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.lunch.offersTitle}
              </h2>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {lunchOffers.map((offer, index) => {
                  const OfferIcon = offer.icon;
                  return (
                    <div key={index} className="bg-card p-6 rounded-lg border border-border relative">
                      {offer.badge && (
                        <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          {offer.badge}
                        </span>
                      )}
                      <OfferIcon className="w-10 h-10 text-primary mb-4" />
                      <h3 className="text-lg font-semibold mb-2">{offer.title}</h3>
                      <p className="text-muted-foreground">{offer.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Menu Teaser */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                    {t.seo.lunch.menuTeaser}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {t.seo.lunch.menuTeaserDesc}
                  </p>
                  <Button asChild>
                    <LocalizedLink to="speisekarte?from=lunch-muenchen-maxvorstadt">
                      {t.seo.lunch.menuTeaserButton}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </LocalizedLink>
                  </Button>
                </div>
                <img 
                  src={businessLunchFood} 
                  alt={t.seo.lunch.menuTeaser}
                  width={600}
                  height={400}
                  loading="lazy"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </section>

          {/* Cross-Sell */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.lunch.crossSellTitle}
              </h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold mb-2">{t.seo.lunch.crossSellCatering}</h3>
                  <p className="text-muted-foreground mb-4">{t.seo.lunch.crossSellCateringDesc}</p>
                  <Button variant="outline" size="sm" asChild>
                    <LocalizedLink to="catering">{t.seo.lunch.crossSellCateringButton}</LocalizedLink>
                  </Button>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold mb-2">{t.seo.lunch.crossSellEvent}</h3>
                  <p className="text-muted-foreground mb-4">{t.seo.lunch.crossSellEventDesc}</p>
                  <Button variant="outline" size="sm" asChild>
                    <LocalizedLink to="firmenfeier-muenchen">{t.seo.lunch.crossSellEventButton}</LocalizedLink>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonial */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <blockquote className="text-xl md:text-2xl font-serif italic mb-4">
                "{t.seo.lunch.testimonialQuote}"
              </blockquote>
              <p className="text-muted-foreground">– {t.seo.lunch.testimonialAuthor}</p>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
                {t.seo.lunch.faqTitle}
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {faqItems.map((item, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="bg-card border border-border rounded-lg px-4">
                    <AccordionTrigger className="text-left font-medium">{item.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
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
                {t.seo.lunch.ctaTitle}
              </h2>
              <p className="text-lg mb-8 opacity-90">
                {t.seo.lunch.ctaDesc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <LocalizedLink to="reservierung?from=lunch-muenchen-maxvorstadt">
                    {t.seo.lunch.ctaReserve}
                  </LocalizedLink>
                </Button>
                <Button size="lg" variant="outlineWhite" asChild>
                  <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {t.seo.lunch.ctaWhatsapp}
                  </a>
                </Button>
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

export default LunchMuenchen;