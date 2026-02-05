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
import { MessageCircle, Phone, Mail, ExternalLink, Star } from "lucide-react";
import storiaLogo from "@/assets/storia-logo.webp";
import firmenfeierEvent from "@/assets/firmenfeier-event.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import LocalizedLink from "@/components/LocalizedLink";
import { DynamicPackagesSection, DynamicCateringHighlights } from "@/components/DynamicPackagesSection";

const EventlocationMuenchen = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  const eventTypes = [
    { key: 'Birthday', icon: t.seo.eventlocation.eventTypeBirthdayIcon, title: t.seo.eventlocation.eventTypeBirthday, desc: t.seo.eventlocation.eventTypeBirthdayDesc, items: [t.seo.eventlocation.eventTypeBirthdayItem1, t.seo.eventlocation.eventTypeBirthdayItem2, t.seo.eventlocation.eventTypeBirthdayItem3, t.seo.eventlocation.eventTypeBirthdayItem4] },
    { key: 'Corporate', icon: t.seo.eventlocation.eventTypeCorporateIcon, title: t.seo.eventlocation.eventTypeCorporate, desc: t.seo.eventlocation.eventTypeCorporateDesc, items: [t.seo.eventlocation.eventTypeCorporateItem1, t.seo.eventlocation.eventTypeCorporateItem2, t.seo.eventlocation.eventTypeCorporateItem3, t.seo.eventlocation.eventTypeCorporateItem4] },
    { key: 'Wedding', icon: t.seo.eventlocation.eventTypeWeddingIcon, title: t.seo.eventlocation.eventTypeWedding, desc: t.seo.eventlocation.eventTypeWeddingDesc, items: [t.seo.eventlocation.eventTypeWeddingItem1, t.seo.eventlocation.eventTypeWeddingItem2, t.seo.eventlocation.eventTypeWeddingItem3, t.seo.eventlocation.eventTypeWeddingItem4] },
    { key: 'Christmas', icon: t.seo.eventlocation.eventTypeChristmasIcon, title: t.seo.eventlocation.eventTypeChristmas, desc: t.seo.eventlocation.eventTypeChristmasDesc, items: [t.seo.eventlocation.eventTypeChristmasItem1, t.seo.eventlocation.eventTypeChristmasItem2, t.seo.eventlocation.eventTypeChristmasItem3, t.seo.eventlocation.eventTypeChristmasItem4] },
    { key: 'Jubilee', icon: t.seo.eventlocation.eventTypeJubileeIcon, title: t.seo.eventlocation.eventTypeJubilee, desc: t.seo.eventlocation.eventTypeJubileeDesc, items: [t.seo.eventlocation.eventTypeJubileeItem1, t.seo.eventlocation.eventTypeJubileeItem2, t.seo.eventlocation.eventTypeJubileeItem3, t.seo.eventlocation.eventTypeJubileeItem4] },
    { key: 'Private', icon: t.seo.eventlocation.eventTypePrivateIcon, title: t.seo.eventlocation.eventTypePrivate, desc: t.seo.eventlocation.eventTypePrivateDesc, items: [t.seo.eventlocation.eventTypePrivateItem1, t.seo.eventlocation.eventTypePrivateItem2, t.seo.eventlocation.eventTypePrivateItem3, t.seo.eventlocation.eventTypePrivateItem4] },
  ];

  const whyFeatures = [
    { title: t.seo.eventlocation.whyCuisineTitle, desc: t.seo.eventlocation.whyCuisineDesc },
    { title: t.seo.eventlocation.whyLocationTitle, desc: t.seo.eventlocation.whyLocationDesc },
    { title: t.seo.eventlocation.whyFlexibleTitle, desc: t.seo.eventlocation.whyFlexibleDesc },
    { title: t.seo.eventlocation.whyFamilyTitle, desc: t.seo.eventlocation.whyFamilyDesc },
    { title: t.seo.eventlocation.whyTerraceTitle, desc: t.seo.eventlocation.whyTerraceDesc },
    { title: t.seo.eventlocation.whyWineTitle, desc: t.seo.eventlocation.whyWineDesc },
    { title: t.seo.eventlocation.whyServiceTitle, desc: t.seo.eventlocation.whyServiceDesc },
    { title: t.seo.eventlocation.whyFairTitle, desc: t.seo.eventlocation.whyFairDesc },
  ];

  const processSteps = [
    { title: t.seo.eventlocation.processStep1Title, desc: t.seo.eventlocation.processStep1Desc },
    { title: t.seo.eventlocation.processStep2Title, desc: t.seo.eventlocation.processStep2Desc },
    { title: t.seo.eventlocation.processStep3Title, desc: t.seo.eventlocation.processStep3Desc },
    { title: t.seo.eventlocation.processStep4Title, desc: t.seo.eventlocation.processStep4Desc },
    { title: t.seo.eventlocation.processStep5Title, desc: t.seo.eventlocation.processStep5Desc },
    { title: t.seo.eventlocation.processStep6Title, desc: t.seo.eventlocation.processStep6Desc },
  ];

  const faqs = [
    { q: t.seo.eventlocation.faq1Question, a: t.seo.eventlocation.faq1Answer },
    { q: t.seo.eventlocation.faq2Question, a: t.seo.eventlocation.faq2Answer },
    { q: t.seo.eventlocation.faq3Question, a: t.seo.eventlocation.faq3Answer },
    { q: t.seo.eventlocation.faq4Question, a: t.seo.eventlocation.faq4Answer },
    { q: t.seo.eventlocation.faq5Question, a: t.seo.eventlocation.faq5Answer },
    { q: t.seo.eventlocation.faq6Question, a: t.seo.eventlocation.faq6Answer },
    { q: t.seo.eventlocation.faq7Question, a: t.seo.eventlocation.faq7Answer },
  ];

  const testimonials = [
    { quote: t.seo.eventlocation.testimonial1Quote, author: t.seo.eventlocation.testimonial1Author },
    { quote: t.seo.eventlocation.testimonial2Quote, author: t.seo.eventlocation.testimonial2Author },
    { quote: t.seo.eventlocation.testimonial3Quote, author: t.seo.eventlocation.testimonial3Author },
  ];

  return (
    <>
      <StaticBotContent
        title={t.seo.eventlocation.heroTitle}
        description={t.seo.eventlocation.heroDescription}
        sections={[
          { heading: t.seo.eventlocation.eventTypesTitle, content: eventTypes.map(e => e.title) },
          { heading: t.seo.eventlocation.roomsTitle, content: [t.seo.eventlocation.room1Title, t.seo.eventlocation.room2Title, t.seo.eventlocation.room3Title] },
          { heading: t.seo.eventlocation.whyTitle, content: whyFeatures.map(f => f.title) },
        ]}
      />
      <SEO
        title={t.seo.eventlocation.seoTitle}
        description={t.seo.eventlocation.seoDescription}
        canonical="/eventlocation-muenchen-maxvorstadt"
      />
      <StructuredData type="restaurant" />
      <StructuredData 
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: t.internalLinks.eventLocation, url: '/eventlocation-muenchen-maxvorstadt' }
        ]}
      />
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
        
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img src={firmenfeierEvent} alt="Eventlocation STORIA München" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          </div>
          <div className="relative z-10 container mx-auto px-4 py-16 text-center">
            <Link to="/">
              <img src={storiaLogo} alt="STORIA Logo" width={128} height={128} loading="eager" className="h-20 md:h-28 w-auto mx-auto mb-6 hover:opacity-80 transition-opacity cursor-pointer brightness-0 invert" />
            </Link>
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-8 md:px-12 md:py-12 max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">{t.seo.eventlocation.heroTitle}</h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">{t.seo.eventlocation.heroSubtitle}</p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{t.seo.eventlocation.heroBadge1}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{t.seo.eventlocation.heroBadge2}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{t.seo.eventlocation.heroBadge3}</span>
              </div>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">{t.seo.eventlocation.heroDescription}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <a href="tel:+498951519696"><Phone className="w-5 h-5 mr-2" />Jetzt anrufen</a>
                </Button>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <a href="mailto:info@ristorantestoria.de"><Mail className="w-5 h-5 mr-2" />Anfrage senden</a>
                </Button>
              </div>
              <p className="text-white/60 text-sm mt-4">Oder besuchen Sie unser Event-Portal: <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white hover:underline">events-storia.de</a></p>
            </div>
          </div>
        </section>

        <Navigation />

        <main className="container mx-auto px-4 py-12 flex-grow">
          <article className="max-w-5xl mx-auto">
            
            {/* Intro Section */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">{t.seo.eventlocation.introTitle}</h2>
              <p className="text-lg text-muted-foreground mb-4">{t.seo.eventlocation.introP1}</p>
              <p className="text-muted-foreground">{t.seo.eventlocation.introP2}</p>
            </section>

            {/* Contact CTA Box */}
            <section className="bg-primary/10 border border-primary/30 rounded-xl p-8 mb-16 text-center">
              <h2 className="text-2xl font-serif font-bold mb-4">Planen Sie Ihr Event mit uns</h2>
              <p className="text-muted-foreground mb-6">Kontaktieren Sie uns direkt für eine persönliche Beratung zu Ihrem Event</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="tel:+498951519696"><Phone className="w-5 h-5 mr-2" />089 51519696</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="mailto:info@ristorantestoria.de"><Mail className="w-5 h-5 mr-2" />E-Mail senden</a>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Für Online-Anfragen: <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">events-storia.de</a>
              </p>
            </section>

            {/* Event Types */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.eventlocation.eventTypesTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventTypes.map((event) => (
                  <Card key={event.key} className="border-border">
                    <CardHeader className="pb-2">
                      <div className="text-4xl mb-2">{event.icon}</div>
                      <CardTitle className="text-xl font-serif">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">{event.desc}</p>
                      <ul className="text-sm space-y-1">
                        {event.items.map((item, i) => (
                          <li key={i} className="text-muted-foreground">• {item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-8">
                <p className="text-muted-foreground mb-4">Haben Sie Fragen zu Ihrem Event? Rufen Sie uns an!</p>
                <Button variant="outline" asChild>
                  <a href="tel:+498951519696"><Phone className="w-4 h-4 mr-2" />089 51519696</a>
                </Button>
              </div>
            </section>

            {/* Room Concepts */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-4 text-center">{t.seo.eventlocation.roomsTitle}</h2>
              <p className="text-muted-foreground text-center mb-8">{t.seo.eventlocation.roomsIntro}</p>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-border">
                  <CardHeader><CardTitle className="text-lg font-serif">{t.seo.eventlocation.room1Title}</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">{t.seo.eventlocation.room1Desc}</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>{t.seo.eventlocation.room1Feature1}</li><li>{t.seo.eventlocation.room1Feature2}</li>
                      <li>{t.seo.eventlocation.room1Feature3}</li><li>{t.seo.eventlocation.room1Feature4}</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardHeader><CardTitle className="text-lg font-serif">{t.seo.eventlocation.room2Title}</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">{t.seo.eventlocation.room2Desc}</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>{t.seo.eventlocation.room2Feature1}</li><li>{t.seo.eventlocation.room2Feature2}</li>
                      <li>{t.seo.eventlocation.room2Feature3}</li><li>{t.seo.eventlocation.room2Feature4}</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-primary bg-primary/5 relative">
                  <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">{t.seo.eventlocation.room3Badge}</span>
                  <CardHeader><CardTitle className="text-lg font-serif">{t.seo.eventlocation.room3Title}</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">{t.seo.eventlocation.room3Desc}</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>{t.seo.eventlocation.room3Feature1}</li><li>{t.seo.eventlocation.room3Feature2}</li>
                      <li>{t.seo.eventlocation.room3Feature3}</li><li>{t.seo.eventlocation.room3Feature4}</li>
                      <li>{t.seo.eventlocation.room3Feature5}</li><li>{t.seo.eventlocation.room3Feature6}</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <p className="text-center text-muted-foreground mt-6">Gerne zeigen wir Ihnen unsere Räume bei einem persönlichen Besuch. <a href="tel:+498951519696" className="text-primary hover:underline">Rufen Sie uns an</a></p>
            </section>

            {/* Dynamic Packages from Events Project */}
            <DynamicPackagesSection 
              pageSlug="eventlocation"
              title="Event-Pakete"
            />

            {/* Dynamic Catering Highlights */}
            <DynamicCateringHighlights 
              pageSlug="eventlocation" 
              title="Catering-Highlights" 
            />

            {/* Why STORIA */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.eventlocation.whyTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {whyFeatures.map((feature, i) => (
                  <div key={i} className="bg-secondary/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Process */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.eventlocation.processTitle}</h2>
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
              <div className="text-center mt-8">
                <Button size="lg" asChild>
                  <a href="tel:+498951519696"><Phone className="w-5 h-5 mr-2" />Jetzt Beratungstermin vereinbaren</a>
                </Button>
              </div>
            </section>

            {/* Testimonials */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.eventlocation.testimonialsTitle}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((t, i) => (
                  <Card key={i} className="border-border">
                    <CardContent className="pt-6">
                      <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-primary text-primary" />)}</div>
                      <p className="text-muted-foreground italic mb-4">"{t.quote}"</p>
                      <p className="text-sm font-medium">{t.author}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Location */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">{t.seo.eventlocation.locationTitle}</h2>
              <p className="text-center text-muted-foreground mb-8">{t.seo.eventlocation.locationIntro}</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{t.seo.eventlocation.addressTitle}</h3>
                  <p className="text-muted-foreground text-sm">Ristorante STORIA<br />Karlstraße 47a<br />80333 München</p>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{t.seo.eventlocation.nearbyTitle}</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>{t.seo.eventlocation.nearbyKoenigsplatz}</li>
                    <li>{t.seo.eventlocation.nearbyHbf}</li>
                    <li>{t.seo.eventlocation.nearbyTU}</li>
                  </ul>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{t.seo.eventlocation.transitTitle}</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>{t.seo.eventlocation.transitUbahn}</li>
                    <li>{t.seo.eventlocation.transitTram}</li>
                    <li>{t.seo.eventlocation.transitSbahn}</li>
                  </ul>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{t.seo.eventlocation.parkingTitle}</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>{t.seo.eventlocation.parkingItem1}</li>
                    <li>{t.seo.eventlocation.parkingItem2}</li>
                  </ul>
                </div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold mb-2">{t.seo.eventlocation.locationTip}</h3>
                <p className="text-muted-foreground text-sm">{t.seo.eventlocation.locationTipText}</p>
              </div>
              <ConsentGoogleMaps src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d11.5658!3d48.1465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKarlstra%C3%9Fe%2047a%2C%2080333%20M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1" />
            </section>

            {/* FAQ */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.eventlocation.faqTitle}</h2>
              <Accordion type="single" collapsible className="max-w-3xl mx-auto">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Internal Event Pages - Pillar Links */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-4 text-center">Feiern Sie Ihren Anlass bei uns</h2>
              <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                Entdecken Sie unsere spezialisierten Event-Seiten für Ihre perfekte Feier im STORIA München
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <LocalizedLink to="/firmenfeier-muenchen" className="group bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 rounded-xl p-8 hover:border-primary hover:shadow-lg transition-all">
                  <div className="text-4xl mb-4">🏢</div>
                  <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">Firmenfeier München</h3>
                  <p className="text-muted-foreground text-sm mb-4">Teamevents, Firmenjubiläen, Weihnachtsfeiern & Business-Dinner im stilvollen Ambiente</p>
                  <span className="text-primary font-medium text-sm">Mehr erfahren →</span>
                </LocalizedLink>
                <LocalizedLink to="/geburtstagsfeier-muenchen" className="group bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 rounded-xl p-8 hover:border-primary hover:shadow-lg transition-all">
                  <div className="text-4xl mb-4">🎂</div>
                  <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">Geburtstagsfeier München</h3>
                  <p className="text-muted-foreground text-sm mb-4">Feiern Sie Ihren Geburtstag mit Familie & Freunden bei authentischer italienischer Küche</p>
                  <span className="text-primary font-medium text-sm">Mehr erfahren →</span>
                </LocalizedLink>
                <LocalizedLink to="/romantisches-dinner-muenchen" className="group bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 rounded-xl p-8 hover:border-primary hover:shadow-lg transition-all">
                  <div className="text-4xl mb-4">💕</div>
                  <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">Romantisches Dinner</h3>
                  <p className="text-muted-foreground text-sm mb-4">Jahrestage, Verlobungen & besondere Abende zu zweit in romantischer Atmosphäre</p>
                  <span className="text-primary font-medium text-sm">Mehr erfahren →</span>
                </LocalizedLink>
              </div>
            </section>

            {/* Related Content */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.eventlocation.relatedTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <LocalizedLink to="/speisekarte" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{t.seo.eventlocation.relatedMenuTitle}</h3>
                  <p className="text-muted-foreground text-sm">{t.seo.eventlocation.relatedMenuDesc}</p>
                </LocalizedLink>
                <LocalizedLink to="/besondere-anlaesse" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">Besondere Anlässe</h3>
                  <p className="text-muted-foreground text-sm">Saisonale Menüs für Valentinstag, Ostern, Weihnachten & mehr</p>
                </LocalizedLink>
                <LocalizedLink to="/ueber-uns" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{t.seo.eventlocation.relatedAboutTitle}</h3>
                  <p className="text-muted-foreground text-sm">{t.seo.eventlocation.relatedAboutDesc}</p>
                </LocalizedLink>
              </div>
              {/* Secondary: External events portal */}
              <div className="mt-8 text-center">
                <p className="text-muted-foreground text-sm mb-3">Für große Events & Catering-Anfragen:</p>
                <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline text-sm">
                  <ExternalLink className="w-4 h-4" />
                  events-storia.de besuchen
                </a>
              </div>
            </section>

            <ConsentElfsightReviews />

            {/* Final CTA */}
            <section className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-serif font-bold mb-4">{t.seo.eventlocation.ctaTitle}</h2>
              <p className="mb-8 opacity-90">{t.seo.eventlocation.ctaDesc}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Button size="lg" variant="secondary" asChild>
                  <a href="tel:+498951519696"><Phone className="w-5 h-5 mr-2" />089 51519696</a>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
                  <a href="mailto:info@ristorantestoria.de"><Mail className="w-5 h-5 mr-2" />E-Mail senden</a>
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4 opacity-90">
                <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
                <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80"><ExternalLink className="w-4 h-4" /> Online-Anfrage</a>
              </div>
              <p className="mt-6 text-sm opacity-70">{t.seo.eventlocation.ctaHoursTitle} {t.seo.eventlocation.ctaHoursValue}<br />{t.seo.eventlocation.ctaOpeningTitle} {t.seo.eventlocation.ctaOpeningValue}</p>
            </section>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default EventlocationMuenchen;
