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
import geburtstagsfeierEvent from "@/assets/geburtstagsfeier-restaurant-storia-muenchen.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import LocalizedLink from "@/components/LocalizedLink";

const GeburtstagsfeierMuenchen = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);
  const b = t.seo.birthday;

  const birthdayTypes = [
    { icon: b.type1Icon, title: b.type1Title, desc: b.type1Desc, items: [b.type1Item1, b.type1Item2, b.type1Item3, b.type1Item4] },
    { icon: b.type2Icon, title: b.type2Title, desc: b.type2Desc, items: [b.type2Item1, b.type2Item2, b.type2Item3, b.type2Item4] },
    { icon: b.type3Icon, title: b.type3Title, desc: b.type3Desc, items: [b.type3Item1, b.type3Item2, b.type3Item3, b.type3Item4] },
    { icon: b.type4Icon, title: b.type4Title, desc: b.type4Desc, items: [b.type4Item1, b.type4Item2, b.type4Item3, b.type4Item4] },
    { icon: b.type5Icon, title: b.type5Title, desc: b.type5Desc, items: [b.type5Item1, b.type5Item2, b.type5Item3, b.type5Item4] },
  ];

  const packages = [
    { title: b.package1Title, desc: b.package1Desc },
    { title: b.package2Title, desc: b.package2Desc },
    { title: b.package3Title, desc: b.package3Desc },
  ];

  const testimonials = [
    { quote: b.testimonial1Quote, author: b.testimonial1Author },
    { quote: b.testimonial2Quote, author: b.testimonial2Author },
    { quote: b.testimonial3Quote, author: b.testimonial3Author },
  ];

  const extras = [b.extra1, b.extra2, b.extra3, b.extra4, b.extra5, b.extra6];

  const faqs = [
    { q: b.faq1Question, a: b.faq1Answer },
    { q: b.faq2Question, a: b.faq2Answer },
    { q: b.faq3Question, a: b.faq3Answer },
    { q: b.faq4Question, a: b.faq4Answer },
    { q: b.faq5Question, a: b.faq5Answer },
    { q: b.faq6Question, a: b.faq6Answer },
  ];

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
      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(item => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": { "@type": "Answer", "text": item.a }
        }))
      })}} />

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <img src={geburtstagsfeierEvent} alt={b.heroTitle} className="absolute inset-0 w-full h-full object-cover" loading="eager" width={1200} height={800} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="relative z-10 container mx-auto px-4 py-16 text-center">
            <Link to="/"><img src={storiaLogo} alt="STORIA Logo" className="h-20 md:h-28 w-auto mx-auto mb-6 brightness-0 invert" /></Link>
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
              <p className="text-muted-foreground">{b.introP2}</p>
            </section>

            {/* Birthday Types (5 event-based) */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{b.typesTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {birthdayTypes.map((type, i) => (
                  <Card key={i} className="border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-serif">{type.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">{type.desc}</p>
                      <ul className="text-sm space-y-1">{type.items.map((item, j) => <li key={j} className="text-muted-foreground">✓ {item}</li>)}</ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Packages (3: Classico, Premium, Deluxe) */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{b.packagesTitle}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {packages.map((pkg, i) => (
                  <Card key={i} className={i === 2 ? "border-primary bg-primary/5" : "border-border"}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-serif">{pkg.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">{pkg.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-center text-muted-foreground mt-6">{b.packagesNote}</p>
              <div className="text-center mt-4">
                <Button variant="outline" asChild>
                  <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer">{b.packagesCtaButton}</a>
                </Button>
              </div>
            </section>

            {/* Testimonials (3, no age badges) */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{b.testimonialsTitle}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, i) => (
                  <Card key={i} className="border-border">
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground italic mb-4">"{testimonial.quote}"</p>
                      <p className="font-semibold text-sm">{testimonial.author}</p>
                      <p className="text-yellow-500 mt-2">⭐⭐⭐⭐⭐</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Extras (bullet list) */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{b.extrasTitle}</h2>
              <ul className="max-w-2xl mx-auto space-y-3">
                {extras.map((extra, i) => (
                  <li key={i} className="text-muted-foreground">{extra}</li>
                ))}
              </ul>
            </section>

            {/* Location */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{b.locationTitle}</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-3">{b.addressTitle}</h3>
                  <p className="text-muted-foreground text-sm">Ristorante STORIA<br />Karlstraße 47a, 80333 München<br /><a href="tel:+498951519696" className="text-primary hover:underline">089 51519696</a></p>
                </div>
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-3">{b.transitTitle}</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>{b.transit1}</li>
                    <li>{b.transit2}</li>
                    <li>{b.transit3}</li>
                  </ul>
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
                    <AccordionContent forceMount className="text-muted-foreground data-[state=closed]:hidden">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Related */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{b.relatedTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <LocalizedLink to="eventlocation-muenchen-maxvorstadt" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{b.relatedEventlocationTitle}</h3>
                  <p className="text-muted-foreground text-sm">{b.relatedEventlocationDesc}</p>
                </LocalizedLink>
                <LocalizedLink to="romantisches-dinner-muenchen" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{b.relatedRomanticTitle}</h3>
                  <p className="text-muted-foreground text-sm">{b.relatedRomanticDesc}</p>
                </LocalizedLink>
                <LocalizedLink to="pizza-muenchen" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{b.relatedPizzaTitle}</h3>
                  <p className="text-muted-foreground text-sm">{b.relatedPizzaDesc}</p>
                </LocalizedLink>
                <LocalizedLink to="aperitivo-muenchen" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{b.relatedAperitivoTitle}</h3>
                  <p className="text-muted-foreground text-sm">{b.relatedAperitivoDesc}</p>
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
            </section>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default GeburtstagsfeierMuenchen;
