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
import { Phone, MessageCircle } from "lucide-react";
import storiaLogo from "@/assets/storia-logo.webp";
import geburtstagsfeierEvent from "@/assets/geburtstagsfeier-event.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import LocalizedLink from "@/components/LocalizedLink";

const GeburtstagsfeierMuenchen = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  const whyFeatures = [
    { title: t.seo.birthday.whyAtmosphereTitle, desc: t.seo.birthday.whyAtmosphereDesc },
    { title: t.seo.birthday.whyCuisineTitle, desc: t.seo.birthday.whyCuisineDesc },
    { title: t.seo.birthday.whyFlexibleTitle, desc: t.seo.birthday.whyFlexibleDesc },
    { title: t.seo.birthday.whyServiceTitle, desc: t.seo.birthday.whyServiceDesc },
    { title: t.seo.birthday.whyExtrasTitle, desc: t.seo.birthday.whyExtrasDesc },
    { title: t.seo.birthday.whyLocationTitle, desc: t.seo.birthday.whyLocationDesc },
  ];

  const packages = [
    { title: t.seo.birthday.package1Title, subtitle: t.seo.birthday.package1Subtitle, items: [t.seo.birthday.package1Item1, t.seo.birthday.package1Item2, t.seo.birthday.package1Item3, t.seo.birthday.package1Item4], ideal: t.seo.birthday.package1Ideal, price: t.seo.birthday.package1Price },
    { title: t.seo.birthday.package2Title, subtitle: t.seo.birthday.package2Subtitle, items: [t.seo.birthday.package2Item1, t.seo.birthday.package2Item2, t.seo.birthday.package2Item3, t.seo.birthday.package2Item4], ideal: t.seo.birthday.package2Ideal, price: t.seo.birthday.package2Price, badge: t.seo.birthday.package2Badge },
    { title: t.seo.birthday.package3Title, subtitle: t.seo.birthday.package3Subtitle, items: [t.seo.birthday.package3Item1, t.seo.birthday.package3Item2, t.seo.birthday.package3Item3, t.seo.birthday.package3Item4], ideal: t.seo.birthday.package3Ideal, price: t.seo.birthday.package3Price },
  ];

  const occasions = [
    { title: t.seo.birthday.occasion1Title, desc: t.seo.birthday.occasion1Desc },
    { title: t.seo.birthday.occasion2Title, desc: t.seo.birthday.occasion2Desc },
    { title: t.seo.birthday.occasion3Title, desc: t.seo.birthday.occasion3Desc },
    { title: t.seo.birthday.occasion4Title, desc: t.seo.birthday.occasion4Desc },
    { title: t.seo.birthday.occasion5Title, desc: t.seo.birthday.occasion5Desc },
    { title: t.seo.birthday.occasion6Title, desc: t.seo.birthday.occasion6Desc },
  ];

  const processSteps = [
    { title: t.seo.birthday.processStep1Title, desc: t.seo.birthday.processStep1Desc },
    { title: t.seo.birthday.processStep2Title, desc: t.seo.birthday.processStep2Desc },
    { title: t.seo.birthday.processStep3Title, desc: t.seo.birthday.processStep3Desc },
    { title: t.seo.birthday.processStep4Title, desc: t.seo.birthday.processStep4Desc },
    { title: t.seo.birthday.processStep5Title, desc: t.seo.birthday.processStep5Desc },
  ];

  const faqs = [
    { q: t.seo.birthday.faq1Question, a: t.seo.birthday.faq1Answer },
    { q: t.seo.birthday.faq2Question, a: t.seo.birthday.faq2Answer },
    { q: t.seo.birthday.faq3Question, a: t.seo.birthday.faq3Answer },
    { q: t.seo.birthday.faq4Question, a: t.seo.birthday.faq4Answer },
    { q: t.seo.birthday.faq5Question, a: t.seo.birthday.faq5Answer },
    { q: t.seo.birthday.faq6Question, a: t.seo.birthday.faq6Answer },
  ];

  return (
    <>
      <StaticBotContent title={t.seo.birthday.heroTitle} description={t.seo.birthday.heroDescription} sections={[]} />
      <SEO title={t.seo.birthday.seoTitle} description={t.seo.birthday.seoDescription} canonical="/geburtstagsfeier-muenchen" />
      <StructuredData type="restaurant" />
      <StructuredData type="breadcrumb" breadcrumbs={[{ name: 'Home', url: '/' }, { name: t.internalLinks.birthdayParty, url: '/geburtstagsfeier-muenchen' }]} />
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <img src={geburtstagsfeierEvent} alt={t.seo.birthday.heroTitle} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="relative z-10 container mx-auto px-4 py-16 text-center">
            <Link to="/"><img src={storiaLogo} alt="STORIA Logo" className="h-20 md:h-28 w-auto mx-auto mb-6" /></Link>
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-8 md:px-12 md:py-12 max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">{t.seo.birthday.heroTitle}</h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">{t.seo.birthday.heroSubtitle}</p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{t.seo.birthday.heroBadge1}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{t.seo.birthday.heroBadge2}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{t.seo.birthday.heroBadge3}</span>
              </div>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">{t.seo.birthday.heroDescription}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <a href="tel:+498951519696"><Phone className="w-5 h-5 mr-2" />{t.seo.birthday.heroCta}</a>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer"><MessageCircle className="w-5 h-5 mr-2" />WhatsApp</a>
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
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">{t.seo.birthday.introTitle}</h2>
              <p className="text-lg text-muted-foreground mb-4">{t.seo.birthday.introP1}</p>
              <p className="text-muted-foreground">{t.seo.birthday.introP2}</p>
            </section>

            {/* Why STORIA */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.birthday.whyTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {whyFeatures.map((f, i) => (<div key={i} className="bg-secondary/50 rounded-lg p-6"><h3 className="font-semibold mb-2">{f.title}</h3><p className="text-muted-foreground text-sm">{f.desc}</p></div>))}
              </div>
            </section>

            {/* Packages */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-4 text-center">{t.seo.birthday.packagesTitle}</h2>
              <p className="text-muted-foreground text-center mb-8">{t.seo.birthday.packagesIntro}</p>
              <div className="grid md:grid-cols-3 gap-6">
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
              <div className="bg-secondary/50 rounded-lg p-6 mt-6 text-center">
                <h3 className="font-semibold mb-2">{t.seo.birthday.packagesNote}</h3>
                <p className="text-muted-foreground text-sm">{t.seo.birthday.packagesNoteDesc}</p>
              </div>
            </section>

            {/* Occasions */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.birthday.occasionsTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {occasions.map((occ, i) => (<Card key={i} className="border-border"><CardHeader className="pb-2"><CardTitle className="text-lg">{occ.title}</CardTitle></CardHeader><CardContent><p className="text-muted-foreground text-sm">{occ.desc}</p></CardContent></Card>))}
              </div>
            </section>

            {/* Process */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.birthday.processTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                {processSteps.map((step, i) => (<div key={i} className="flex flex-col items-center text-center"><span className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mb-3">{i + 1}</span><h3 className="font-semibold mb-1">{step.title}</h3><p className="text-muted-foreground text-sm">{step.desc}</p></div>))}
              </div>
            </section>

            {/* FAQ */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.birthday.faqTitle}</h2>
              <Accordion type="single" collapsible className="max-w-3xl mx-auto">{faqs.map((faq, i) => (<AccordionItem key={i} value={`faq-${i}`}><AccordionTrigger className="text-left">{faq.q}</AccordionTrigger><AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent></AccordionItem>))}</Accordion>
            </section>

            {/* Location */}
            <section className="mb-16">
              <ConsentGoogleMaps src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d11.5658!3d48.1465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKarlstra%C3%9Fe%2047a%2C%2080333%20M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1" />
            </section>

            {/* Related */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{t.seo.birthday.relatedTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <LocalizedLink to="firmenfeier-muenchen" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors"><h3 className="font-semibold mb-2">{t.seo.birthday.relatedFirmenfeierTitle}</h3><p className="text-muted-foreground text-sm">{t.seo.birthday.relatedFirmenfeierDesc}</p></LocalizedLink>
                <LocalizedLink to="eventlocation-muenchen-maxvorstadt" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors"><h3 className="font-semibold mb-2">{t.seo.birthday.relatedEventlocationTitle}</h3><p className="text-muted-foreground text-sm">{t.seo.birthday.relatedEventlocationDesc}</p></LocalizedLink>
                <LocalizedLink to="speisekarte" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors"><h3 className="font-semibold mb-2">{t.seo.birthday.relatedMenuTitle}</h3><p className="text-muted-foreground text-sm">{t.seo.birthday.relatedMenuDesc}</p></LocalizedLink>
                <LocalizedLink to="romantisches-dinner-muenchen" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors"><h3 className="font-semibold mb-2">{t.seo.birthday.relatedRomanticTitle}</h3><p className="text-muted-foreground text-sm">{t.seo.birthday.relatedRomanticDesc}</p></LocalizedLink>
              </div>
            </section>

            <ConsentElfsightReviews />

            {/* Final CTA */}
            <section className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-serif font-bold mb-4">{t.seo.birthday.ctaTitle}</h2>
              <p className="mb-8 opacity-90">{t.seo.birthday.ctaDesc}</p>
              <Button size="lg" variant="secondary" asChild><a href="tel:+498951519696">{t.seo.birthday.ctaButton}</a></Button>
              <p className="mt-6 opacity-80 text-sm">{t.seo.birthday.ctaAlternative}</p>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
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

export default GeburtstagsfeierMuenchen;
