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
import weihnachtsfeierEvent from "@/assets/weihnachtsfeier-event.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import LocalizedLink from "@/components/LocalizedLink";

const WeihnachtsfeierMuenchen = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);
  const w = t.seo.weihnachtsfeier;

  const eventTypes = [
    { icon: "🏢", title: w.type1Title, desc: w.type1Desc, items: [w.type1Item1, w.type1Item2, w.type1Item3, w.type1Item4], note: w.type1Note },
    { icon: "👨‍👩‍👧‍👦", title: w.type2Title, desc: w.type2Desc, items: [w.type2Item1, w.type2Item2, w.type2Item3, w.type2Item4] },
    { icon: "💕", title: w.type3Title, desc: w.type3Desc, items: [w.type3Item1, w.type3Item2, w.type3Item3, w.type3Item4] },
    { icon: "🤝", title: w.type4Title, desc: w.type4Desc, items: [w.type4Item1, w.type4Item2, w.type4Item3, w.type4Item4] },
  ];

  const menus = [
    { title: w.menu1Title, subtitle: w.menu1Subtitle, desc: w.menu1Desc },
    { title: w.menu2Title, subtitle: w.menu2Subtitle, desc: w.menu2Desc, badge: w.menu2Badge },
    { title: w.menu3Title, subtitle: w.menu3Subtitle, desc: w.menu3Desc },
  ];

  const reasons = [
    { title: w.reason1Title, desc: w.reason1Desc },
    { title: w.reason2Title, desc: w.reason2Desc },
    { title: w.reason3Title, desc: w.reason3Desc },
    { title: w.reason4Title, desc: w.reason4Desc },
    { title: w.reason5Title, desc: w.reason5Desc },
    { title: w.reason6Title, desc: w.reason6Desc },
    { title: w.reason7Title, desc: w.reason7Desc },
    { title: w.reason8Title, desc: w.reason8Desc },
  ];

  const processSteps = [
    { title: w.step1Title, desc: w.step1Desc },
    { title: w.step2Title, desc: w.step2Desc },
    { title: w.step3Title, desc: w.step3Desc },
    { title: w.step4Title, desc: w.step4Desc },
    { title: w.step5Title, desc: w.step5Desc },
  ];

  const testimonials = [
    { quote: w.testimonial1Quote, author: w.testimonial1Author, details: w.testimonial1Details },
    { quote: w.testimonial2Quote, author: w.testimonial2Author, details: w.testimonial2Details },
    { quote: w.testimonial3Quote, author: w.testimonial3Author, details: w.testimonial3Details },
  ];

  const faqs = [
    { q: w.faq1Question, a: w.faq1Answer },
    { q: w.faq2Question, a: w.faq2Answer },
    { q: w.faq3Question, a: w.faq3Answer },
    { q: w.faq4Question, a: w.faq4Answer },
    { q: w.faq5Question, a: w.faq5Answer },
    { q: w.faq6Question, a: w.faq6Answer },
    { q: w.faq7Question, a: w.faq7Answer },
    { q: w.faq8Question, a: w.faq8Answer },
  ];

  return (
    <>
      <StaticBotContent title={w.heroTitle} description={w.heroDescription} sections={[]} />
      <SEO title={w.seoTitle} description={w.seoDescription} canonical="/weihnachtsfeier-muenchen" />
      <StructuredData type="restaurant" />
      <StructuredData type="breadcrumb" breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: t.internalLinks.eventLocation, url: '/eventlocation-muenchen-maxvorstadt' },
        { name: t.internalLinks.christmasParty, url: '/weihnachtsfeier-muenchen' }
      ]} />
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
          <img src={weihnachtsfeierEvent} alt={w.heroTitle} className="absolute inset-0 w-full h-full object-cover" loading="eager" width={1200} height={800} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="relative z-10 container mx-auto px-4 py-16 text-center">
            <Link to="/"><img src={storiaLogo} alt="STORIA Logo" className="h-20 md:h-28 w-auto mx-auto mb-6 brightness-0 invert" /></Link>
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-8 md:px-12 md:py-12 max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">{w.heroTitle}</h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">{w.heroSubtitle}</p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{w.heroBadge1}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{w.heroBadge2}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{w.heroBadge3}</span>
              </div>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">{w.heroDescription}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer"><ExternalLink className="w-5 h-5 mr-2" />{w.heroCta}</a>
                </Button>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <a href="tel:+498951519696"><Phone className="w-5 h-5 mr-2" />089 51519696</a>
                </Button>
              </div>
              <p className="text-white/60 text-sm mt-4">{w.heroEventsNote} <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">events-storia.de</a></p>
            </div>
          </div>
        </section>

        <Navigation />

        <main className="container mx-auto px-4 py-12 flex-grow">
          <article className="max-w-5xl mx-auto">

            {/* Intro */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">{w.introTitle}</h2>
              <p className="text-lg text-muted-foreground mb-4">{w.introP1}</p>
            </section>

            {/* Event Types */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{w.typesTitle}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {eventTypes.map((ev, i) => (
                  <Card key={i} className="border-border">
                    <CardHeader className="pb-2">
                      <div className="text-4xl mb-2">{ev.icon}</div>
                      <CardTitle className="text-xl font-serif">{ev.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">{ev.desc}</p>
                      <ul className="text-sm space-y-1">{ev.items.map((item, j) => <li key={j} className="text-muted-foreground">✓ {item}</li>)}</ul>
                      {ev.note && <p className="text-xs text-primary mt-3">⚠️ {ev.note}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Weihnachtsmenü */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-4 text-center">{w.menuTitle}</h2>
              <p className="text-muted-foreground text-center mb-8">{w.menuIntro}</p>
              <div className="grid md:grid-cols-3 gap-6">
                {menus.map((menu, i) => (
                  <Card key={i} className={menu.badge ? "border-primary bg-primary/5 relative" : "border-border"}>
                    {menu.badge && <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">{menu.badge}</span>}
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-serif">{menu.title}</CardTitle>
                      <p className="text-muted-foreground text-sm">{menu.subtitle}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">{menu.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-center text-muted-foreground mt-6 text-sm">{w.menuPriceNote}</p>
            </section>

            {/* 8 Gründe */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{w.reasonsTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reasons.map((r, i) => (
                  <div key={i} className="bg-secondary/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">{r.title}</h3>
                    <p className="text-muted-foreground text-sm">{r.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Ablauf */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{w.processTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processSteps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">{i + 1}</span>
                    <div>
                      <h3 className="font-semibold mb-1">{step.title}</h3>
                      <p className="text-muted-foreground text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonials */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{w.testimonialsTitle}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((tm, i) => (
                  <Card key={i} className="border-border">
                    <CardContent className="pt-6">
                      <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-primary text-primary" />)}</div>
                      <p className="text-muted-foreground italic mb-4">"{tm.quote}"</p>
                      <p className="text-sm font-medium">{tm.author}</p>
                      <p className="text-xs text-muted-foreground">{tm.details}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Wann buchen */}
            <section className="mb-16 bg-secondary/50 rounded-xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4 text-center">{w.bookingTitle}</h2>
              <p className="text-muted-foreground mb-4">{w.bookingP1}</p>
              <p className="text-muted-foreground mb-4"><strong>{w.bookingTip}</strong></p>
              <p className="text-muted-foreground">{w.bookingShortNotice}</p>
            </section>

            {/* Location */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">{w.locationTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{w.locationAddressTitle}</h3>
                  <p className="text-muted-foreground text-sm">Ristorante STORIA<br />Karlstraße 47a<br />80333 München</p>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{w.locationTransitTitle}</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>{w.locationTransit1}</li>
                    <li>{w.locationTransit2}</li>
                    <li>{w.locationTransit3}</li>
                  </ul>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{w.locationHotelsTitle}</h3>
                  <p className="text-muted-foreground text-sm">{w.locationHotelsDesc}</p>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{w.locationTipTitle}</h3>
                  <p className="text-muted-foreground text-sm">{w.locationTipDesc}</p>
                </div>
              </div>
              <ConsentGoogleMaps src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d11.5658!3d48.1465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKarlstra%C3%9Fe%2047a%2C%2080333%20M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1" />
            </section>

            {/* FAQ */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{w.faqTitle}</h2>
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
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{w.relatedTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <LocalizedLink to="firmenfeier-muenchen" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{w.related1Title}</h3>
                  <p className="text-muted-foreground text-sm">{w.related1Desc}</p>
                </LocalizedLink>
                <LocalizedLink to="eventlocation-muenchen-maxvorstadt" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{w.related2Title}</h3>
                  <p className="text-muted-foreground text-sm">{w.related2Desc}</p>
                </LocalizedLink>
                <LocalizedLink to="romantisches-dinner-muenchen" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{w.related3Title}</h3>
                  <p className="text-muted-foreground text-sm">{w.related3Desc}</p>
                </LocalizedLink>
                <LocalizedLink to="pizza-muenchen" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{w.related4Title}</h3>
                  <p className="text-muted-foreground text-sm">{w.related4Desc}</p>
                </LocalizedLink>
              </div>
            </section>

            <ConsentElfsightReviews />

            {/* Final CTA */}
            <section className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-serif font-bold mb-4">{w.ctaTitle}</h2>
              <p className="mb-8 opacity-90">{w.ctaDesc}</p>
              <Button size="lg" variant="secondary" asChild>
                <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer"><ExternalLink className="w-5 h-5 mr-2" />{w.ctaButton}</a>
              </Button>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <a href="tel:+498951519696" className="flex items-center gap-2 hover:opacity-80"><Phone className="w-4 h-4" /> 089 51519696</a>
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

export default WeihnachtsfeierMuenchen;
