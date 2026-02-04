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
import { Phone, MessageCircle, Heart, Clock } from "lucide-react";
import storiaLogo from "@/assets/storia-logo.webp";
import romanticDinnerHero from "@/assets/romantisches-dinner-hero.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import LocalizedLink from "@/components/LocalizedLink";

const RomantischesDinner = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  const whyFeatures = [
    { title: t.seo.romanticDinner.whyCandleTitle, desc: t.seo.romanticDinner.whyCandleDesc },
    { title: t.seo.romanticDinner.whyCuisineTitle, desc: t.seo.romanticDinner.whyCuisineDesc },
    { title: t.seo.romanticDinner.whyWineTitle, desc: t.seo.romanticDinner.whyWineDesc },
    { title: t.seo.romanticDinner.whyServiceTitle, desc: t.seo.romanticDinner.whyServiceDesc },
    { title: t.seo.romanticDinner.whyExtrasTitle, desc: t.seo.romanticDinner.whyExtrasDesc },
    { title: t.seo.romanticDinner.whyLocationTitle, desc: t.seo.romanticDinner.whyLocationDesc },
  ];

  const menus = [
    {
      title: t.seo.romanticDinner.menuMareTitle,
      badge: t.seo.romanticDinner.menuMareBadge,
      courses: [t.seo.romanticDinner.menuMareCourse1, t.seo.romanticDinner.menuMareCourse2, t.seo.romanticDinner.menuMareCourse3, t.seo.romanticDinner.menuMareCourse4],
      price: t.seo.romanticDinner.menuMarePrice,
      wine: t.seo.romanticDinner.menuMareWine,
      highlight: false,
    },
    {
      title: t.seo.romanticDinner.menuTerraTitle,
      badge: t.seo.romanticDinner.menuTerraBadge,
      courses: [t.seo.romanticDinner.menuTerraCourse1, t.seo.romanticDinner.menuTerraCourse2, t.seo.romanticDinner.menuTerraCourse3, t.seo.romanticDinner.menuTerraCourse4],
      price: t.seo.romanticDinner.menuTerraPrice,
      wine: t.seo.romanticDinner.menuTerraWine,
      highlight: false,
    },
    {
      title: t.seo.romanticDinner.menuVegetaleTitle,
      badge: t.seo.romanticDinner.menuVegetaleBadge,
      courses: [t.seo.romanticDinner.menuVegetaleCourse1, t.seo.romanticDinner.menuVegetaleCourse2, t.seo.romanticDinner.menuVegetaleCourse3, t.seo.romanticDinner.menuVegetaleCourse4],
      price: t.seo.romanticDinner.menuVegetalePrice,
      wine: t.seo.romanticDinner.menuVegetaleWine,
      highlight: false,
    },
  ];

  const occasions = [
    { title: t.seo.romanticDinner.occasion1Title, desc: t.seo.romanticDinner.occasion1Desc },
    { title: t.seo.romanticDinner.occasion2Title, desc: t.seo.romanticDinner.occasion2Desc },
    { title: t.seo.romanticDinner.occasion3Title, desc: t.seo.romanticDinner.occasion3Desc },
    { title: t.seo.romanticDinner.occasion4Title, desc: t.seo.romanticDinner.occasion4Desc },
    { title: t.seo.romanticDinner.occasion5Title, desc: t.seo.romanticDinner.occasion5Desc },
    { title: t.seo.romanticDinner.occasion6Title, desc: t.seo.romanticDinner.occasion6Desc },
  ];

  const guideSteps = [
    { time: t.seo.romanticDinner.guideStep1Time, title: t.seo.romanticDinner.guideStep1Title, desc: t.seo.romanticDinner.guideStep1Desc },
    { time: t.seo.romanticDinner.guideStep2Time, title: t.seo.romanticDinner.guideStep2Title, desc: t.seo.romanticDinner.guideStep2Desc },
    { time: t.seo.romanticDinner.guideStep3Time, title: t.seo.romanticDinner.guideStep3Title, desc: t.seo.romanticDinner.guideStep3Desc },
    { time: t.seo.romanticDinner.guideStep4Time, title: t.seo.romanticDinner.guideStep4Title, desc: t.seo.romanticDinner.guideStep4Desc },
    { time: t.seo.romanticDinner.guideStep5Time, title: t.seo.romanticDinner.guideStep5Title, desc: t.seo.romanticDinner.guideStep5Desc },
    { time: t.seo.romanticDinner.guideStep6Time, title: t.seo.romanticDinner.guideStep6Title, desc: t.seo.romanticDinner.guideStep6Desc },
  ];

  const tips = [
    { title: t.seo.romanticDinner.tip1Title, desc: t.seo.romanticDinner.tip1Desc },
    { title: t.seo.romanticDinner.tip2Title, desc: t.seo.romanticDinner.tip2Desc },
    { title: t.seo.romanticDinner.tip3Title, desc: t.seo.romanticDinner.tip3Desc },
    { title: t.seo.romanticDinner.tip4Title, desc: t.seo.romanticDinner.tip4Desc },
    { title: t.seo.romanticDinner.tip5Title, desc: t.seo.romanticDinner.tip5Desc },
    { title: t.seo.romanticDinner.tip6Title, desc: t.seo.romanticDinner.tip6Desc },
  ];

  const faqs = [
    { q: t.seo.romanticDinner.faq1Question, a: t.seo.romanticDinner.faq1Answer },
    { q: t.seo.romanticDinner.faq2Question, a: t.seo.romanticDinner.faq2Answer },
    { q: t.seo.romanticDinner.faq3Question, a: t.seo.romanticDinner.faq3Answer },
    { q: t.seo.romanticDinner.faq4Question, a: t.seo.romanticDinner.faq4Answer },
    { q: t.seo.romanticDinner.faq5Question, a: t.seo.romanticDinner.faq5Answer },
    { q: t.seo.romanticDinner.faq6Question, a: t.seo.romanticDinner.faq6Answer },
    { q: t.seo.romanticDinner.faq7Question, a: t.seo.romanticDinner.faq7Answer },
  ];

  return (
    <>
      <StaticBotContent
        title={t.seo.romanticDinner.heroTitle}
        description={t.seo.romanticDinner.heroDescription}
        sections={[
          { heading: t.seo.romanticDinner.whyTitle, content: whyFeatures.map(f => f.title) },
          { heading: t.seo.romanticDinner.menuSectionTitle, content: menus.map(m => m.title) },
          { heading: t.seo.romanticDinner.occasionsTitle, content: occasions.map(o => o.title) },
        ]}
      />
      <SEO
        title={t.seo.romanticDinner.seoTitle}
        description={t.seo.romanticDinner.seoDescription}
        canonical="/romantisches-dinner-muenchen"
      />
      <StructuredData type="restaurant" />
      <StructuredData 
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: t.internalLinks.romanticDinner, url: '/romantisches-dinner-muenchen' }
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
          <img 
            src={romanticDinnerHero} 
            alt={t.seo.romanticDinner.heroTitle}
            width={1920}
            height={1080}
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="relative z-10 container mx-auto px-4 py-16 text-center">
            <Link to="/">
              <img src={storiaLogo} alt="STORIA Logo" width={128} height={128} loading="eager" className="h-20 md:h-28 w-auto mx-auto mb-6 hover:opacity-80 transition-opacity cursor-pointer brightness-0 invert" />
            </Link>
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-8 md:px-12 md:py-12 max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">{t.seo.romanticDinner.heroTitle}</h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">{t.seo.romanticDinner.heroSubtitle}</p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{t.seo.romanticDinner.heroBadge1}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{t.seo.romanticDinner.heroBadge2}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{t.seo.romanticDinner.heroBadge3}</span>
              </div>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">{t.seo.romanticDinner.heroDescription}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <LocalizedLink to="reservierung"><Heart className="w-5 h-5 mr-2" />{t.seo.romanticDinner.heroCta}</LocalizedLink>
                </Button>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <a href="tel:+498951519696"><Phone className="w-5 h-5 mr-2" />089 51519696</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Navigation />

        <main className="container mx-auto px-4 py-12 flex-grow">
          <article className="max-w-5xl mx-auto">
            
            {/* Intro Section */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">{t.seo.romanticDinner.introTitle}</h2>
              <p className="text-lg text-muted-foreground mb-4">{t.seo.romanticDinner.introP1}</p>
              <p className="text-muted-foreground">{t.seo.romanticDinner.introP2}</p>
            </section>

            {/* Why STORIA */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.romanticDinner.whyTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {whyFeatures.map((feature, i) => (
                  <div key={i} className="bg-secondary/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Menus */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-4 text-center">{t.seo.romanticDinner.menuSectionTitle}</h2>
              <p className="text-muted-foreground text-center mb-8">{t.seo.romanticDinner.menuSectionIntro}</p>
              <div className="grid lg:grid-cols-3 gap-6">
                {menus.map((menu, i) => (
                  <Card key={i} className="border-border">
                    <CardHeader className="pb-2">
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded w-fit mb-2">{menu.badge}</span>
                      <CardTitle className="text-lg font-serif">{menu.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-2 mb-4">
                        {menu.courses.map((course, j) => (
                          <li key={j} className="text-muted-foreground border-b border-border/50 pb-2 last:border-0">{j + 1}. {course}</li>
                        ))}
                      </ul>
                      <div className="border-t pt-4 space-y-1">
                        <p className="font-semibold">{menu.price}</p>
                        <p className="text-sm text-primary">{menu.wine}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-center text-muted-foreground text-sm mt-6">{t.seo.romanticDinner.menuNote}</p>
            </section>

            {/* Valentinstag Special */}
            <section className="mb-16 bg-primary/10 border border-primary/30 rounded-xl p-8">
              <span className="inline-block bg-primary text-primary-foreground text-xs px-3 py-1 rounded mb-4">{t.seo.romanticDinner.valentineBadge}</span>
              <h2 className="text-2xl font-serif font-bold mb-4">{t.seo.romanticDinner.valentineTitle}</h2>
              <p className="text-muted-foreground mb-4">{t.seo.romanticDinner.valentineIntro}</p>
              <p className="text-sm text-primary mb-6">{t.seo.romanticDinner.valentineDates}</p>
              
              <h3 className="text-xl font-semibold mb-4">{t.seo.romanticDinner.valentineMenuTitle}</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-background rounded-lg p-4">
                  <p className="font-medium">{t.seo.romanticDinner.valentineCourse1Title}</p>
                  <p className="text-muted-foreground text-sm">{t.seo.romanticDinner.valentineCourse1Desc}</p>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <p className="font-medium">{t.seo.romanticDinner.valentineCourse2Title}</p>
                  <p className="text-muted-foreground text-sm">{t.seo.romanticDinner.valentineCourse2Desc}</p>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <p className="font-medium">{t.seo.romanticDinner.valentineCourse3Title}</p>
                  <p className="text-muted-foreground text-sm">{t.seo.romanticDinner.valentineCourse3Desc}</p>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <p className="font-medium">{t.seo.romanticDinner.valentineCourse4Title}</p>
                  <p className="text-muted-foreground text-sm">{t.seo.romanticDinner.valentineCourse4Desc}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 items-center mb-6">
                <span className="text-xl font-bold">{t.seo.romanticDinner.valentinePrice}</span>
                <span className="text-muted-foreground text-sm">{t.seo.romanticDinner.valentinePriceNote}</span>
              </div>
              <div className="mb-6">
                <p className="font-medium mb-2">{t.seo.romanticDinner.valentineExtrasTitle}</p>
                <ul className="text-muted-foreground text-sm space-y-1">
                  <li>{t.seo.romanticDinner.valentineExtra1}</li>
                  <li>{t.seo.romanticDinner.valentineExtra2}</li>
                  <li>{t.seo.romanticDinner.valentineExtra3}</li>
                </ul>
              </div>
              <div className="bg-background rounded-lg p-4">
                <h4 className="font-semibold mb-2">{t.seo.romanticDinner.valentineReserveTitle}</h4>
                <p className="text-muted-foreground text-sm mb-4">{t.seo.romanticDinner.valentineReserveNote}</p>
                <Button asChild><LocalizedLink to="reservierung">{t.seo.romanticDinner.heroCta}</LocalizedLink></Button>
              </div>
              <p className="text-muted-foreground text-xs mt-4 italic">{t.seo.romanticDinner.valentineFuture}</p>
            </section>

            {/* Occasions */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.romanticDinner.occasionsTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {occasions.map((occ, i) => (
                  <Card key={i} className="border-border">
                    <CardHeader className="pb-2"><CardTitle className="text-lg">{occ.title}</CardTitle></CardHeader>
                    <CardContent><p className="text-muted-foreground text-sm">{occ.desc}</p></CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Guide */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.romanticDinner.guideTitle}</h2>
              <div className="space-y-4 max-w-3xl mx-auto">
                {guideSteps.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-20 text-right">
                      <span className="text-sm font-medium text-primary flex items-center justify-end gap-1"><Clock className="w-3 h-3" />{step.time}</span>
                    </div>
                    <div className="flex-grow bg-card border rounded-lg p-4">
                      <h3 className="font-semibold mb-1">{step.title}</h3>
                      <p className="text-muted-foreground text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Tips */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.romanticDinner.tipsTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tips.map((tip, i) => (
                  <div key={i} className="bg-secondary/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">{tip.title}</h3>
                    <p className="text-muted-foreground text-sm">{tip.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Location */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">{t.seo.romanticDinner.locationTitle}</h2>
              <p className="text-center text-muted-foreground mb-8">{t.seo.romanticDinner.locationIntro}</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{t.seo.romanticDinner.locationAddressTitle}</h3>
                  <p className="text-muted-foreground text-sm">Ristorante STORIA<br />Karlstraße 47a<br />80333 München</p>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{t.seo.romanticDinner.locationNearbyTitle}</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>{t.seo.romanticDinner.locationNearbyKoenigsplatz}</li>
                    <li>{t.seo.romanticDinner.locationNearbyHbf}</li>
                    <li>{t.seo.romanticDinner.locationNearbyTU}</li>
                  </ul>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{t.seo.romanticDinner.locationTransitTitle}</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>{t.seo.romanticDinner.locationTransitUbahn}</li>
                    <li>{t.seo.romanticDinner.locationTransitTram}</li>
                    <li>{t.seo.romanticDinner.locationTransitSbahn}</li>
                  </ul>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{t.seo.romanticDinner.locationHoursTitle}</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>{t.seo.romanticDinner.locationHoursWeekday}</li>
                    <li>{t.seo.romanticDinner.locationHoursWeekend}</li>
                  </ul>
                </div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold mb-2">{t.seo.romanticDinner.locationTipTitle}</h3>
                <p className="text-muted-foreground text-sm">{t.seo.romanticDinner.locationTipDesc}</p>
              </div>
              <p className="text-muted-foreground text-sm text-center mb-4">{t.seo.romanticDinner.locationHoursNote}</p>
              <ConsentGoogleMaps src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d11.5658!3d48.1465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKarlstra%C3%9Fe%2047a%2C%2080333%20M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1" />
            </section>

            {/* FAQ */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.romanticDinner.faqTitle}</h2>
              <Accordion type="single" collapsible className="max-w-3xl mx-auto">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Social Proof */}
            <div className="text-center text-muted-foreground text-sm mb-8 space-y-2">
              <p>{t.seo.romanticDinner.socialProof1}</p>
              <p>{t.seo.romanticDinner.socialProof2}</p>
            </div>

            {/* Related Content */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.romanticDinner.relatedTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <LocalizedLink to="speisekarte" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{t.seo.romanticDinner.relatedMenuTitle}</h3>
                  <p className="text-muted-foreground text-sm">{t.seo.romanticDinner.relatedMenuDesc}</p>
                </LocalizedLink>
                <LocalizedLink to="aperitivo-muenchen" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{t.seo.romanticDinner.relatedAperitivoTitle}</h3>
                  <p className="text-muted-foreground text-sm">{t.seo.romanticDinner.relatedAperitivoDesc}</p>
                </LocalizedLink>
                <LocalizedLink to="eventlocation-muenchen-maxvorstadt" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{t.seo.romanticDinner.relatedEventTitle}</h3>
                  <p className="text-muted-foreground text-sm">{t.seo.romanticDinner.relatedEventDesc}</p>
                </LocalizedLink>
                <LocalizedLink to="neapolitanische-pizza-muenchen" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{t.seo.romanticDinner.relatedPizzaTitle}</h3>
                  <p className="text-muted-foreground text-sm">{t.seo.romanticDinner.relatedPizzaDesc}</p>
                </LocalizedLink>
              </div>
            </section>

            <ConsentElfsightReviews />

            {/* Final CTA */}
            <section className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-serif font-bold mb-4">{t.seo.romanticDinner.ctaTitle}</h2>
              <p className="mb-8 opacity-90">{t.seo.romanticDinner.ctaDescription}</p>
              <Button size="lg" variant="secondary" asChild>
                <LocalizedLink to="reservierung">{t.seo.romanticDinner.ctaButton}</LocalizedLink>
              </Button>
              <p className="mt-6 opacity-80 text-sm">{t.seo.romanticDinner.ctaTip}</p>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <a href="tel:+4989515196" className="flex items-center gap-2 hover:opacity-80"><Phone className="w-4 h-4" /> 089 515196</a>
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

export default RomantischesDinner;
