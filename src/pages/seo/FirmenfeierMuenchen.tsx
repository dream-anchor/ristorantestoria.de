import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ConsentElfsightReviews from "@/components/ConsentElfsightReviews";
import ConsentGoogleMaps from "@/components/ConsentGoogleMaps";
import StaticBotContent from "@/components/StaticBotContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, MessageCircle, ExternalLink, Star } from "lucide-react";
import storiaLogo from "@/assets/storia-logo.webp";
import firmenfeierEvent from "@/assets/firmenfeier-event.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import LocalizedLink from "@/components/LocalizedLink";

const FirmenfeierMuenchen = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  const eventTypes = [
    { icon: t.seo.firmenfeier.eventTypeChristmasIcon, title: t.seo.firmenfeier.eventTypeChristmas, desc: t.seo.firmenfeier.eventTypeChristmasDesc, items: [t.seo.firmenfeier.eventTypeChristmasItem1, t.seo.firmenfeier.eventTypeChristmasItem2, t.seo.firmenfeier.eventTypeChristmasItem3, t.seo.firmenfeier.eventTypeChristmasItem4], note: t.seo.firmenfeier.eventTypeChristmasNote },
    { icon: t.seo.firmenfeier.eventTypeTeamIcon, title: t.seo.firmenfeier.eventTypeTeam, desc: t.seo.firmenfeier.eventTypeTeamDesc, items: [t.seo.firmenfeier.eventTypeTeamItem1, t.seo.firmenfeier.eventTypeTeamItem2, t.seo.firmenfeier.eventTypeTeamItem3, t.seo.firmenfeier.eventTypeTeamItem4] },
    { icon: t.seo.firmenfeier.eventTypeSummerIcon, title: t.seo.firmenfeier.eventTypeSummer, desc: t.seo.firmenfeier.eventTypeSummerDesc, items: [t.seo.firmenfeier.eventTypeSummerItem1, t.seo.firmenfeier.eventTypeSummerItem2, t.seo.firmenfeier.eventTypeSummerItem3, t.seo.firmenfeier.eventTypeSummerItem4] },
    { icon: t.seo.firmenfeier.eventTypeJubileeIcon, title: t.seo.firmenfeier.eventTypeJubilee, desc: t.seo.firmenfeier.eventTypeJubileeDesc, items: [t.seo.firmenfeier.eventTypeJubileeItem1, t.seo.firmenfeier.eventTypeJubileeItem2, t.seo.firmenfeier.eventTypeJubileeItem3, t.seo.firmenfeier.eventTypeJubileeItem4] },
    { icon: t.seo.firmenfeier.eventTypeBusinessIcon, title: t.seo.firmenfeier.eventTypeBusiness, desc: t.seo.firmenfeier.eventTypeBusinessDesc, items: [t.seo.firmenfeier.eventTypeBusinessItem1, t.seo.firmenfeier.eventTypeBusinessItem2, t.seo.firmenfeier.eventTypeBusinessItem3, t.seo.firmenfeier.eventTypeBusinessItem4] },
    { icon: t.seo.firmenfeier.eventTypeEmployeeIcon, title: t.seo.firmenfeier.eventTypeEmployee, desc: t.seo.firmenfeier.eventTypeEmployeeDesc, items: [t.seo.firmenfeier.eventTypeEmployeeItem1, t.seo.firmenfeier.eventTypeEmployeeItem2, t.seo.firmenfeier.eventTypeEmployeeItem3, t.seo.firmenfeier.eventTypeEmployeeItem4] },
  ];

  const whyFeatures = [
    { title: t.seo.firmenfeier.whyLocationTitle, desc: t.seo.firmenfeier.whyLocationDesc },
    { title: t.seo.firmenfeier.whyPriceTitle, desc: t.seo.firmenfeier.whyPriceDesc },
    { title: t.seo.firmenfeier.whyCuisineTitle, desc: t.seo.firmenfeier.whyCuisineDesc },
    { title: t.seo.firmenfeier.whyFlexibleTitle, desc: t.seo.firmenfeier.whyFlexibleDesc },
    { title: t.seo.firmenfeier.whyServiceTitle, desc: t.seo.firmenfeier.whyServiceDesc },
    { title: t.seo.firmenfeier.whyRepeatTitle, desc: t.seo.firmenfeier.whyRepeatDesc },
    { title: t.seo.firmenfeier.whyTerraceTitle, desc: t.seo.firmenfeier.whyTerraceDesc },
    { title: t.seo.firmenfeier.whyWineTitle, desc: t.seo.firmenfeier.whyWineDesc },
  ];

  const packages = [
    { title: t.seo.firmenfeier.package1Title, subtitle: t.seo.firmenfeier.package1Subtitle, items: [t.seo.firmenfeier.package1Item1, t.seo.firmenfeier.package1Item2, t.seo.firmenfeier.package1Item3, t.seo.firmenfeier.package1Item4], ideal: t.seo.firmenfeier.package1Ideal, price: t.seo.firmenfeier.package1Price },
    { title: t.seo.firmenfeier.package2Title, subtitle: t.seo.firmenfeier.package2Subtitle, items: [t.seo.firmenfeier.package2Item1, t.seo.firmenfeier.package2Item2, t.seo.firmenfeier.package2Item3, t.seo.firmenfeier.package2Item4], ideal: t.seo.firmenfeier.package2Ideal, price: t.seo.firmenfeier.package2Price, badge: t.seo.firmenfeier.package2Badge },
    { title: t.seo.firmenfeier.package3Title, subtitle: t.seo.firmenfeier.package3Subtitle, items: [t.seo.firmenfeier.package3Item1, t.seo.firmenfeier.package3Item2, t.seo.firmenfeier.package3Item3, t.seo.firmenfeier.package3Item4], ideal: t.seo.firmenfeier.package3Ideal, price: t.seo.firmenfeier.package3Price },
    { title: t.seo.firmenfeier.package4Title, subtitle: t.seo.firmenfeier.package4Subtitle, items: [t.seo.firmenfeier.package4Item1, t.seo.firmenfeier.package4Item2, t.seo.firmenfeier.package4Item3, t.seo.firmenfeier.package4Item4], ideal: t.seo.firmenfeier.package4Ideal, price: t.seo.firmenfeier.package4Price },
  ];

  const processSteps = [
    { title: t.seo.firmenfeier.processStep1Title, desc: t.seo.firmenfeier.processStep1Desc },
    { title: t.seo.firmenfeier.processStep2Title, desc: t.seo.firmenfeier.processStep2Desc },
    { title: t.seo.firmenfeier.processStep3Title, desc: t.seo.firmenfeier.processStep3Desc },
    { title: t.seo.firmenfeier.processStep4Title, desc: t.seo.firmenfeier.processStep4Desc },
    { title: t.seo.firmenfeier.processStep5Title, desc: t.seo.firmenfeier.processStep5Desc },
    { title: t.seo.firmenfeier.processStep6Title, desc: t.seo.firmenfeier.processStep6Desc },
  ];

  const testimonials = [
    { quote: t.seo.firmenfeier.testimonial1Quote, author: t.seo.firmenfeier.testimonial1Author, details: t.seo.firmenfeier.testimonial1Details },
    { quote: t.seo.firmenfeier.testimonial2Quote, author: t.seo.firmenfeier.testimonial2Author, details: t.seo.firmenfeier.testimonial2Details },
    { quote: t.seo.firmenfeier.testimonial3Quote, author: t.seo.firmenfeier.testimonial3Author, details: t.seo.firmenfeier.testimonial3Details },
    { quote: t.seo.firmenfeier.testimonial4Quote, author: t.seo.firmenfeier.testimonial4Author, details: t.seo.firmenfeier.testimonial4Details },
  ];

  const faqs = [
    { q: t.seo.firmenfeier.faq1Question, a: t.seo.firmenfeier.faq1Answer },
    { q: t.seo.firmenfeier.faq2Question, a: t.seo.firmenfeier.faq2Answer },
    { q: t.seo.firmenfeier.faq3Question, a: t.seo.firmenfeier.faq3Answer },
    { q: t.seo.firmenfeier.faq4Question, a: t.seo.firmenfeier.faq4Answer },
    { q: t.seo.firmenfeier.faq5Question, a: t.seo.firmenfeier.faq5Answer },
    { q: t.seo.firmenfeier.faq6Question, a: t.seo.firmenfeier.faq6Answer },
    { q: t.seo.firmenfeier.faq7Question, a: t.seo.firmenfeier.faq7Answer },
    { q: t.seo.firmenfeier.faq8Question, a: t.seo.firmenfeier.faq8Answer },
  ];

  return (
    <>
      <StaticBotContent title={t.seo.firmenfeier.heroTitle} description={t.seo.firmenfeier.heroDescription} sections={[]} />
      <SEO title={t.seo.firmenfeier.seoTitle} description={t.seo.firmenfeier.seoDescription} canonical="/firmenfeier-muenchen" />
      <StructuredData type="restaurant" />
      <StructuredData type="breadcrumb" breadcrumbs={[{ name: 'Home', url: '/' }, { name: t.internalLinks.corporateEvent, url: '/firmenfeier-muenchen' }]} />
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <img src={firmenfeierEvent} alt={t.seo.firmenfeier.heroTitle} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="relative z-10 container mx-auto px-4 py-16 text-center">
            <Link to="/"><img src={storiaLogo} alt="STORIA Logo" className="h-20 md:h-28 w-auto mx-auto mb-6" /></Link>
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-8 md:px-12 md:py-12 max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">{t.seo.firmenfeier.heroTitle}</h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">{t.seo.firmenfeier.heroSubtitle}</p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{t.seo.firmenfeier.heroBadge1}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{t.seo.firmenfeier.heroBadge2}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{t.seo.firmenfeier.heroBadge3}</span>
              </div>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">{t.seo.firmenfeier.heroDescription}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer"><ExternalLink className="w-5 h-5 mr-2" />{t.seo.firmenfeier.heroCta}</a>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <a href="tel:+498951519696"><Phone className="w-5 h-5 mr-2" />089 51519696</a>
                </Button>
              </div>
              <p className="text-white/60 text-sm mt-4">{t.seo.firmenfeier.heroEventsNote} <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">events-storia.de</a></p>
            </div>
          </div>
        </section>

        <Navigation />

        <main className="container mx-auto px-4 py-12 flex-grow">
          <article className="max-w-5xl mx-auto">
            
            {/* Intro */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">{t.seo.firmenfeier.introTitle}</h2>
              <p className="text-lg text-muted-foreground mb-4">{t.seo.firmenfeier.introP1}</p>
              <p className="text-muted-foreground">{t.seo.firmenfeier.introP2}</p>
            </section>

            {/* Events CTA */}
            <section className="bg-primary/10 border border-primary/30 rounded-xl p-8 mb-16 text-center">
              <h2 className="text-2xl font-serif font-bold mb-4">{t.seo.firmenfeier.eventsCta}</h2>
              <p className="text-muted-foreground mb-6">{t.seo.firmenfeier.eventsCtaDesc}</p>
              <Button size="lg" asChild><a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer"><ExternalLink className="w-5 h-5 mr-2" />{t.seo.firmenfeier.eventsCtaButton}</a></Button>
              <p className="text-sm text-muted-foreground mt-6">{t.seo.firmenfeier.eventsContactNote}<br /><a href="tel:+498951519696" className="text-foreground hover:text-primary">089 51519696</a> · <a href="mailto:info@ristorantestoria.de" className="text-foreground hover:text-primary">info@ristorantestoria.de</a></p>
            </section>

            {/* Event Types */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.firmenfeier.eventTypesTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventTypes.map((ev, i) => (
                  <Card key={i} className="border-border">
                    <CardHeader className="pb-2">
                      <div className="text-4xl mb-2">{ev.icon}</div>
                      <CardTitle className="text-xl font-serif">{ev.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">{ev.desc}</p>
                      <ul className="text-sm space-y-1">{ev.items.map((item, j) => <li key={j} className="text-muted-foreground">✓ {item}</li>)}</ul>
                      {ev.note && <p className="text-xs text-primary mt-3">{ev.note}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Why STORIA */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.firmenfeier.whyTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {whyFeatures.map((f, i) => (<div key={i} className="bg-secondary/50 rounded-lg p-6"><h3 className="font-semibold mb-2">{f.title}</h3><p className="text-muted-foreground text-sm">{f.desc}</p></div>))}
              </div>
            </section>

            {/* Packages */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-4 text-center">{t.seo.firmenfeier.packagesTitle}</h2>
              <p className="text-muted-foreground text-center mb-8">{t.seo.firmenfeier.packagesIntro}</p>
              <div className="grid md:grid-cols-2 gap-6">
                {packages.map((pkg, i) => (
                  <Card key={i} className={pkg.badge ? "border-primary bg-primary/5 relative" : "border-border"}>
                    {pkg.badge && <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">{pkg.badge}</span>}
                    <CardHeader className="pb-2"><CardTitle className="text-lg font-serif">{pkg.title}</CardTitle><p className="text-muted-foreground text-sm">{pkg.subtitle}</p></CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1 mb-4">{pkg.items.map((item, j) => <li key={j} className="text-muted-foreground">• {item}</li>)}</ul>
                      <p className="text-xs text-muted-foreground mb-2">{pkg.ideal}</p>
                      <p className="font-bold text-primary">{pkg.price}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Process */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.firmenfeier.processTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processSteps.map((step, i) => (<div key={i} className="flex gap-4"><span className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">{i + 1}</span><div><h3 className="font-semibold mb-1">{step.title}</h3><p className="text-muted-foreground text-sm">{step.desc}</p></div></div>))}
              </div>
              <div className="text-center mt-8"><Button size="lg" asChild><a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer">{t.seo.firmenfeier.processCtaButton}</a></Button></div>
            </section>

            {/* Testimonials */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.firmenfeier.testimonialsTitle}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {testimonials.map((tm, i) => (<Card key={i} className="border-border"><CardContent className="pt-6"><div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-primary text-primary" />)}</div><p className="text-muted-foreground italic mb-4">"{tm.quote}"</p><p className="text-sm font-medium">{tm.author}</p><p className="text-xs text-muted-foreground">{tm.details}</p></CardContent></Card>))}
              </div>
            </section>

            {/* Location */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">{t.seo.firmenfeier.locationTitle}</h2>
              <p className="text-center text-muted-foreground mb-8">{t.seo.firmenfeier.locationIntro}</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-card border rounded-lg p-4"><h3 className="font-semibold mb-2">{t.seo.firmenfeier.locationAddressTitle}</h3><p className="text-muted-foreground text-sm">Ristorante STORIA<br />Karlstraße 47a<br />80333 München</p></div>
                <div className="bg-card border rounded-lg p-4"><h3 className="font-semibold mb-2">{t.seo.firmenfeier.locationBusinessTitle}</h3><ul className="text-muted-foreground text-sm space-y-1"><li>{t.seo.firmenfeier.locationBusinessItem1}</li><li>{t.seo.firmenfeier.locationBusinessItem2}</li><li>{t.seo.firmenfeier.locationBusinessItem3}</li></ul></div>
                <div className="bg-card border rounded-lg p-4"><h3 className="font-semibold mb-2">{t.seo.firmenfeier.locationTransitTitle}</h3><ul className="text-muted-foreground text-sm space-y-1"><li>{t.seo.firmenfeier.locationTransitUbahn}</li><li>{t.seo.firmenfeier.locationTransitTram}</li><li>{t.seo.firmenfeier.locationTransitSbahn}</li></ul></div>
                <div className="bg-card border rounded-lg p-4"><h3 className="font-semibold mb-2">{t.seo.firmenfeier.locationHotelsTitle}</h3><p className="text-muted-foreground text-sm">{t.seo.firmenfeier.locationHotelsDesc}</p></div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-6 mb-8"><h3 className="font-semibold mb-2">{t.seo.firmenfeier.locationTip}</h3><p className="text-muted-foreground text-sm">{t.seo.firmenfeier.locationTipText}</p></div>
              <ConsentGoogleMaps src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d11.5658!3d48.1465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKarlstra%C3%9Fe%2047a%2C%2080333%20M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1" />
            </section>

            {/* FAQ */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.firmenfeier.faqTitle}</h2>
              <Accordion type="single" collapsible className="max-w-3xl mx-auto">{faqs.map((faq, i) => (<AccordionItem key={i} value={`faq-${i}`}><AccordionTrigger className="text-left">{faq.q}</AccordionTrigger><AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent></AccordionItem>))}</Accordion>
            </section>

            {/* Related */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.firmenfeier.relatedTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer" className="bg-primary/10 border border-primary/30 rounded-lg p-6 hover:bg-primary/20 transition-colors"><h3 className="font-semibold mb-2">{t.seo.firmenfeier.relatedEventsTitle}</h3><p className="text-muted-foreground text-sm mb-2">{t.seo.firmenfeier.relatedEventsDesc}</p><span className="text-primary text-sm">{t.seo.firmenfeier.relatedEventsButton} →</span></a>
                <LocalizedLink to="eventlocation-muenchen-maxvorstadt" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors"><h3 className="font-semibold mb-2">{t.seo.firmenfeier.relatedEventlocationTitle}</h3><p className="text-muted-foreground text-sm">{t.seo.firmenfeier.relatedEventlocationDesc}</p></LocalizedLink>
                <LocalizedLink to="speisekarte" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors"><h3 className="font-semibold mb-2">{t.seo.firmenfeier.relatedMenuTitle}</h3><p className="text-muted-foreground text-sm">{t.seo.firmenfeier.relatedMenuDesc}</p></LocalizedLink>
                <LocalizedLink to="lunch-muenchen-maxvorstadt" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors"><h3 className="font-semibold mb-2">{t.seo.firmenfeier.relatedLunchTitle}</h3><p className="text-muted-foreground text-sm">{t.seo.firmenfeier.relatedLunchDesc}</p></LocalizedLink>
              </div>
            </section>

            <ConsentElfsightReviews />

            {/* Final CTA */}
            <section className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-serif font-bold mb-4">{t.seo.firmenfeier.ctaTitle}</h2>
              <p className="mb-8 opacity-90">{t.seo.firmenfeier.ctaDesc}</p>
              <Button size="lg" variant="secondary" asChild><a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer"><ExternalLink className="w-5 h-5 mr-2" />{t.seo.firmenfeier.ctaButton}</a></Button>
              <p className="mt-6 opacity-80 text-sm">{t.seo.firmenfeier.ctaAlternative}</p>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <a href="tel:+498951519696" className="flex items-center gap-2 hover:opacity-80"><Phone className="w-4 h-4" /> 089 51519696</a>
                <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
              </div>
              <p className="mt-6 text-sm opacity-70">{t.seo.firmenfeier.ctaHoursTitle} {t.seo.firmenfeier.ctaHoursValue}<br />{t.seo.firmenfeier.ctaOpeningTitle} {t.seo.firmenfeier.ctaOpeningValue}</p>
            </section>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FirmenfeierMuenchen;
