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
import { Phone, MessageCircle, Mail, ExternalLink } from "lucide-react";
import storiaLogo from "@/assets/storia-logo.webp";
import geburtstagsfeierEvent from "@/assets/geburtstagsfeier-event.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import LocalizedLink from "@/components/LocalizedLink";

const GeburtstagsfeierMuenchen = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);
  const b = t.seo.birthday;

  const birthdayTypes = [
    { icon: "🔞", title: b.type18Title, desc: b.type18Desc, items: [b.type18Item1, b.type18Item2, b.type18Item3, b.type18Item4] },
    { icon: "🎉", title: b.type30Title, desc: b.type30Desc, items: [b.type30Item1, b.type30Item2, b.type30Item3, b.type30Item4], badge: b.type30Badge },
    { icon: "🎂", title: b.type40Title, desc: b.type40Desc, items: [b.type40Item1, b.type40Item2, b.type40Item3, b.type40Item4], badge: b.type40Badge },
    { icon: "🏆", title: b.type50Title, desc: b.type50Desc, items: [b.type50Item1, b.type50Item2, b.type50Item3, b.type50Item4] },
    { icon: "🎊", title: b.type60Title, desc: b.type60Desc, items: [b.type60Item1, b.type60Item2, b.type60Item3, b.type60Item4] },
    { icon: "🎁", title: b.typeSurpriseTitle, desc: b.typeSurpriseDesc, items: [b.typeSurpriseItem1, b.typeSurpriseItem2, b.typeSurpriseItem3, b.typeSurpriseItem4] },
  ];

  const whyFeatures = [
    { title: b.whyCuisineTitle, desc: b.whyCuisineDesc },
    { title: b.whyCakeTitle, desc: b.whyCakeDesc },
    { title: b.whyLocationTitle, desc: b.whyLocationDesc },
    { title: b.whyFlexibleTitle, desc: b.whyFlexibleDesc },
    { title: b.whyFamilyTitle, desc: b.whyFamilyDesc },
    { title: b.whyTerraceTitle, desc: b.whyTerraceDesc },
    { title: b.whySurpriseTitle, desc: b.whySurpriseDesc },
    { title: b.whyPriceTitle, desc: b.whyPriceDesc },
  ];

  const packages = [
    { title: b.package1Title, subtitle: b.package1Subtitle, items: [b.package1Item1, b.package1Item2, b.package1Item3, b.package1Item4, b.package1Item5], ideal: b.package1Ideal, price: b.package1Price },
    { title: b.package2Title, subtitle: b.package2Subtitle, items: [b.package2Item1, b.package2Item2, b.package2Item3, b.package2Item4, b.package2Item5], ideal: b.package2Ideal, price: b.package2Price, badge: b.package2Badge },
    { title: b.package3Title, subtitle: b.package3Subtitle, items: [b.package3Item1, b.package3Item2, b.package3Item3, b.package3Item4, b.package3Item5, b.package3Item6], ideal: b.package3Ideal, price: b.package3Price },
    { title: b.package4Title, subtitle: b.package4Subtitle, items: [b.package4Item1, b.package4Item2, b.package4Item3, b.package4Item4, b.package4Item5], ideal: b.package4Ideal, price: b.package4Price },
  ];

  const processSteps = [
    { title: b.processStep1Title, desc: b.processStep1Desc },
    { title: b.processStep2Title, desc: b.processStep2Desc },
    { title: b.processStep3Title, desc: b.processStep3Desc },
    { title: b.processStep4Title, desc: b.processStep4Desc },
    { title: b.processStep5Title, desc: b.processStep5Desc },
    { title: b.processStep6Title, desc: b.processStep6Desc },
  ];

  const extras = [
    { title: b.extra1Title, desc: b.extra1Desc, price: b.extra1Price },
    { title: b.extra2Title, desc: b.extra2Desc, price: b.extra2Price },
    { title: b.extra3Title, desc: b.extra3Desc, price: b.extra3Price },
    { title: b.extra4Title, desc: b.extra4Desc, price: b.extra4Price },
    { title: b.extra5Title, desc: b.extra5Desc, price: b.extra5Price },
    { title: b.extra6Title, desc: b.extra6Desc, price: b.extra6Price },
  ];

  const testimonials = [
    { quote: b.testimonial1Quote, author: b.testimonial1Author, details: b.testimonial1Details, age: b.testimonial1Age },
    { quote: b.testimonial2Quote, author: b.testimonial2Author, details: b.testimonial2Details, age: b.testimonial2Age },
    { quote: b.testimonial3Quote, author: b.testimonial3Author, details: b.testimonial3Details, age: b.testimonial3Age },
    { quote: b.testimonial4Quote, author: b.testimonial4Author, details: b.testimonial4Details, age: b.testimonial4Age },
  ];

  const faqs = [
    { q: b.faq1Question, a: b.faq1Answer },
    { q: b.faq2Question, a: b.faq2Answer },
    { q: b.faq3Question, a: b.faq3Answer },
    { q: b.faq4Question, a: b.faq4Answer },
    { q: b.faq5Question, a: b.faq5Answer },
    { q: b.faq6Question, a: b.faq6Answer },
    { q: b.faq7Question, a: b.faq7Answer },
    { q: b.faq8Question, a: b.faq8Answer },
  ];

  const benefits = [b.benefit1, b.benefit2, b.benefit3, b.benefit4, b.benefit5, b.benefit6];
  const transits = [b.transit1, b.transit2, b.transit3, b.transit4, b.transit5];

  return (
    <>
      <StaticBotContent title={b.heroTitle} description={b.heroDescription} sections={[]} />
      <SEO title={b.seoTitle} description={b.seoDescription} canonical="/geburtstagsfeier-muenchen" />
      <StructuredData type="restaurant" />
      <StructuredData type="breadcrumb" breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: t.internalLinks.eventLocation, url: '/eventlocation-muenchen-maxvorstadt' },
        { name: t.internalLinks.birthdayParty, url: '/geburtstagsfeier-muenchen' }
      ]} />
      
      {/* EventVenue Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "EventVenue",
        "name": "STORIA Geburtstagsfeier München",
        "image": "https://www.ristorantestoria.de/assets/geburtstagsfeier-storia.jpg",
        "description": b.seoDescription,
        "address": { "@type": "PostalAddress", "streetAddress": "Karlstraße 47a", "addressLocality": "München", "addressRegion": "Bayern", "postalCode": "80333", "addressCountry": "DE" },
        "geo": { "@type": "GeoCoordinates", "latitude": 48.1465, "longitude": 11.5658 },
        "telephone": "+49-89-51519696",
        "maximumAttendeeCapacity": 80,
        "priceRange": "€€",
        "amenityFeature": [
          { "@type": "LocationFeatureSpecification", "name": "Geburtstagsservice", "value": "Geburtstagskuchen, Dekoration, Überraschungen" },
          { "@type": "LocationFeatureSpecification", "name": "Terrasse", "value": "Verfügbar im Sommer" }
        ]
      })}} />
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <img src={geburtstagsfeierEvent} alt={b.heroTitle} className="absolute inset-0 w-full h-full object-cover" loading="eager" width={1200} height={800} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="relative z-10 container mx-auto px-4 py-16 text-center">
            <Link to="/"><img src={storiaLogo} alt="STORIA Logo" className="h-20 md:h-28 w-auto mx-auto mb-6" /></Link>
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-8 md:px-12 md:py-12 max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">{b.heroTitle}</h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">{b.heroSubtitle}</p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{b.heroBadge1}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{b.heroBadge2}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{b.heroBadge3}</span>
              </div>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">{b.heroDescription}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer"><ExternalLink className="w-5 h-5 mr-2" />{b.heroCta}</a>
                </Button>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <a href="tel:+498951519696"><Phone className="w-5 h-5 mr-2" />{b.heroCtaSecondary}</a>
                </Button>
              </div>
              <p className="mt-6 text-white/70 text-sm">
                {b.heroEventsNote} <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-primary">{b.heroEventsLink}</a>
              </p>
            </div>
          </div>
        </section>

        <Navigation />

        <main className="container mx-auto px-4 py-12 flex-grow">
          <article className="max-w-5xl mx-auto">
            
            {/* Intro */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">{b.introTitle}</h2>
              <p className="text-lg text-muted-foreground mb-4">{b.introP1}</p>
              <p className="text-muted-foreground mb-4">{b.introP2}</p>
              <p className="text-muted-foreground">{b.introP3}</p>
            </section>

            {/* Events CTA Block */}
            <section className="mb-16 bg-primary text-primary-foreground rounded-xl p-8 text-center">
              <h2 className="text-2xl font-serif font-bold mb-4">{b.eventsCtaTitle}</h2>
              <p className="mb-6 opacity-90">{b.eventsCtaDesc}</p>
              <Button size="lg" variant="secondary" asChild>
                <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer">{b.eventsCtaButton}</a>
              </Button>
              <p className="mt-6 opacity-80 text-sm">{b.eventsCtaContactNote}</p>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <a href="tel:+498951519696" className="flex items-center gap-2 hover:opacity-80"><Phone className="w-4 h-4" /> 089 51519696</a>
                <a href="mailto:info@ristorantestoria.de" className="flex items-center gap-2 hover:opacity-80"><Mail className="w-4 h-4" /> info@ristorantestoria.de</a>
                <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 text-[#25D366]"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
              </div>
            </section>

            {/* Birthday Types */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{b.typesTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {birthdayTypes.map((type, i) => (
                  <Card key={i} className={type.badge ? "border-primary bg-primary/5 relative" : "border-border"}>
                    {type.badge && <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">{type.badge}</span>}
                    <CardHeader className="pb-2">
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <CardTitle className="text-lg font-serif">{type.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">{type.desc}</p>
                      <ul className="text-sm space-y-1">{type.items.map((item, j) => <li key={j} className="text-muted-foreground">✓ {item}</li>)}</ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="bg-secondary/50 rounded-lg p-6 mt-6 text-center">
                <p className="font-semibold mb-2">{b.typesCtaBox}</p>
                <Button variant="outline" asChild>
                  <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer">{b.typesCtaButton}</a>
                </Button>
              </div>
            </section>

            {/* Why STORIA (8 features) */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{b.whyTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {whyFeatures.map((f, i) => (
                  <div key={i} className="bg-secondary/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">{f.title}</h3>
                    <p className="text-muted-foreground text-sm">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Packages (4) */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-4 text-center">{b.packagesTitle}</h2>
              <p className="text-muted-foreground text-center mb-8">{b.packagesIntro}</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {packages.map((pkg, i) => (
                  <Card key={i} className={pkg.badge ? "border-primary bg-primary/5 relative" : "border-border"}>
                    {pkg.badge && <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">{pkg.badge}</span>}
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-serif">{pkg.title}</CardTitle>
                      <p className="text-muted-foreground text-sm">{pkg.subtitle}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1 mb-4">{pkg.items.map((item, j) => <li key={j} className="text-muted-foreground">• {item}</li>)}</ul>
                      <p className="text-xs text-muted-foreground mb-2">{pkg.ideal}</p>
                      <p className="font-bold text-primary">{pkg.price}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="bg-secondary/50 rounded-lg p-6 mt-6 text-center">
                <h3 className="font-semibold mb-2">{b.packagesNote}</h3>
                <p className="text-muted-foreground text-sm mb-4">{b.packagesNoteDesc}</p>
                <Button variant="outline" asChild>
                  <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer">{b.packagesCtaButton}</a>
                </Button>
              </div>
            </section>

            {/* Process (6 steps) */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{b.processTitle}</h2>
              <div className="flex flex-wrap justify-center gap-6">
                {processSteps.map((step, i) => (
                  <div key={i} className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] flex flex-col items-center text-center">
                    <span className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mb-3">{i + 1}</span>
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button size="lg" asChild>
                  <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer">{b.processCtaButton}</a>
                </Button>
              </div>
            </section>

            {/* Extras (6) */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{b.extrasTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {extras.map((extra, i) => (
                  <div key={i} className="bg-card border rounded-lg p-6">
                    <h3 className="font-semibold mb-2">{extra.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{extra.desc}</p>
                    <p className="text-primary text-sm font-medium">{extra.price}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-muted-foreground mt-6">{b.extrasNote}</p>
            </section>

            {/* Testimonials */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{b.testimonialsTitle}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {testimonials.map((t, i) => (
                  <Card key={i} className="border-border relative">
                    <div className="absolute top-4 right-4 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">{t.age}</div>
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground italic mb-4">"{t.quote}"</p>
                      <p className="font-semibold">{t.author}</p>
                      <p className="text-sm text-muted-foreground">{t.details}</p>
                      <p className="text-yellow-500 mt-2">⭐⭐⭐⭐⭐</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Location */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-4 text-center">{b.locationTitle}</h2>
              <p className="text-center text-muted-foreground mb-8">{b.locationIntro}</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-3">{b.addressTitle}</h3>
                  <p className="text-muted-foreground text-sm">Ristorante STORIA<br />Karlstraße 47a<br />80333 München<br /><a href="tel:+498951519696" className="text-primary hover:underline">089 51519696</a></p>
                </div>
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-3">{b.benefitsTitle}</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">{benefits.map((b, i) => <li key={i}>✓ {b}</li>)}</ul>
                </div>
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-3">{b.transitTitle}</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">{transits.map((t, i) => <li key={i}>{t}</li>)}</ul>
                </div>
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-3">{b.afterPartyTitle}</h3>
                  <p className="text-muted-foreground text-sm">{b.afterPartyDesc}</p>
                </div>
              </div>
              <ConsentGoogleMaps src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d11.5658!3d48.1465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKarlstra%C3%9Fe%2047a%2C%2080333%20M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1" />
            </section>

            {/* FAQ */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{b.faqTitle}</h2>
              <Accordion type="single" collapsible className="max-w-3xl mx-auto">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Related */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{b.relatedTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer" className="bg-primary text-primary-foreground border rounded-lg p-6 hover:opacity-90 transition-opacity relative">
                  <span className="absolute top-2 right-2 bg-white text-primary text-xs px-2 py-1 rounded">{b.relatedEventsBadge}</span>
                  <h3 className="font-semibold mb-2">{b.relatedEventsTitle}</h3>
                  <p className="text-sm opacity-90">{b.relatedEventsDesc}</p>
                </a>
                <LocalizedLink to="eventlocation-muenchen-maxvorstadt" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{b.relatedEventlocationTitle}</h3>
                  <p className="text-muted-foreground text-sm">{b.relatedEventlocationDesc}</p>
                </LocalizedLink>
                <LocalizedLink to="speisekarte" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{b.relatedMenuTitle}</h3>
                  <p className="text-muted-foreground text-sm">{b.relatedMenuDesc}</p>
                </LocalizedLink>
                <LocalizedLink to="romantisches-dinner-muenchen" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{b.relatedRomanticTitle}</h3>
                  <p className="text-muted-foreground text-sm">{b.relatedRomanticDesc}</p>
                </LocalizedLink>
              </div>
            </section>

            <ConsentElfsightReviews />

            {/* Final CTA */}
            <section className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-serif font-bold mb-4">{b.ctaTitle}</h2>
              <p className="mb-8 opacity-90">{b.ctaDesc}</p>
              <Button size="lg" variant="secondary" asChild>
                <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer">{b.ctaButton}</a>
              </Button>
              <p className="mt-6 opacity-80 text-sm">{b.ctaAlternative}</p>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <a href="tel:+498951519696" className="flex items-center gap-2 hover:opacity-80"><Phone className="w-4 h-4" /> 089 51519696</a>
                <a href="mailto:info@ristorantestoria.de" className="flex items-center gap-2 hover:opacity-80"><Mail className="w-4 h-4" /> info@ristorantestoria.de</a>
                <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
              </div>
              <div className="mt-8 bg-white/10 rounded-lg p-6">
                <h3 className="font-semibold mb-2">{b.ctaTip}</h3>
                <p className="text-sm opacity-90">{b.ctaTipDesc}</p>
              </div>
            </section>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default GeburtstagsfeierMuenchen;
