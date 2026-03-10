import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import LocalizedLink from "@/components/LocalizedLink";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { Phone, Mail, CheckCircle, ExternalLink } from "lucide-react";

const Catering = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": t.catering.faq1Q,
        "acceptedAnswer": { "@type": "Answer", "text": t.catering.faq1A },
      },
      {
        "@type": "Question",
        "name": t.catering.faq2Q,
        "acceptedAnswer": { "@type": "Answer", "text": t.catering.faq2A },
      },
      {
        "@type": "Question",
        "name": t.catering.faq3Q,
        "acceptedAnswer": { "@type": "Answer", "text": t.catering.faq3A },
      },
      {
        "@type": "Question",
        "name": t.catering.faq4Q,
        "acceptedAnswer": { "@type": "Answer", "text": t.catering.faq4A },
      },
      {
        "@type": "Question",
        "name": t.catering.faq5Q,
        "acceptedAnswer": { "@type": "Answer", "text": t.catering.faq5A },
      },
    ],
  };

  const packages = [
    {
      title: t.catering.package1Title,
      price: t.catering.package1Price,
      desc: t.catering.package1Desc,
    },
    {
      title: t.catering.package2Title,
      price: t.catering.package2Price,
      desc: t.catering.package2Desc,
    },
    {
      title: t.catering.package3Title,
      price: t.catering.package3Price,
      desc: t.catering.package3Desc,
      badge: true,
    },
    {
      title: t.catering.package4Title,
      price: t.catering.package4Price,
      desc: t.catering.package4Desc,
    },
  ];

  const deliveryItems = [
    t.catering.delivery1,
    t.catering.delivery2,
    t.catering.delivery3,
    t.catering.delivery4,
    t.catering.delivery5,
  ];

  const processSteps = [
    { title: t.catering.step1Title, desc: t.catering.step1Desc },
    { title: t.catering.step2Title, desc: t.catering.step2Desc },
    { title: t.catering.step3Title, desc: t.catering.step3Desc },
    { title: t.catering.step4Title, desc: t.catering.step4Desc },
  ];

  return (
    <>
      <SEO
        title={t.pages.catering.title}
        description={t.pages.catering.description}
        canonical="/catering"
      />
      <StructuredData type="restaurant" />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: t.pages.catering.breadcrumb, url: '/catering' }
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-8 text-center">
            <Link to="/">
              <img src={storiaLogo} alt="STORIA – Italienisches Restaurant München Logo" width={128} height={128} loading="eager" className="h-24 md:h-32 w-auto mx-auto mb-4 hover:opacity-80 transition-opacity cursor-pointer" />
            </Link>
            <p className="text-lg text-muted-foreground tracking-wide">
              {t.hero.subtitle}
            </p>
          </div>
        </div>
        <Navigation />

        <main id="main-content" className="flex-grow">

          {/* Hero */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center mb-8">
                <span className="inline-block text-xs font-mono uppercase tracking-widest text-muted-foreground border border-border rounded-full px-4 py-1 mb-4">
                  München &amp; Umgebung
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  {t.pages.catering.h1}
                </h1>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                  <Button size="lg" asChild>
                    <a href="tel:+498951519696">
                      <Phone className="w-4 h-4 mr-2" />
                      +49 89 51519696
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="mailto:info@ristorantestoria.de">
                      <Mail className="w-4 h-4 mr-2" />
                      {t.catering.sendEmail}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Intro Text */}
          <section className="pb-12">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="bg-card border border-border rounded-2xl px-8 py-7 shadow-sm space-y-4 text-muted-foreground">
                <p>{t.pages.catering.intro}</p>
                {t.pages.catering.introP2 && <p>{t.pages.catering.introP2}</p>}
              </div>
            </div>
          </section>

          {/* Packages */}
          <section className="py-12 bg-secondary/20">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl font-serif font-bold mb-8 text-center">{t.catering.packagesTitle}</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {packages.map((pkg) => (
                  <div key={pkg.title} className={`relative bg-card border rounded-2xl p-6 ${pkg.badge ? 'border-primary/50' : 'border-border'}`}>
                    {pkg.badge && (
                      <span className="absolute -top-3 left-6 text-xs font-mono uppercase tracking-wider bg-primary text-primary-foreground rounded-full px-3 py-1">
                        Popular
                      </span>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{pkg.title}</h3>
                      <span className="text-sm font-mono text-primary whitespace-nowrap ml-2">{pkg.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{pkg.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground italic">{t.catering.packageNote}</p>
            </div>
          </section>

          {/* What we deliver */}
          <section className="py-12">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl font-serif font-bold mb-6 text-center">{t.catering.deliveryTitle}</h2>
              <div className="bg-card border border-border rounded-2xl p-6 grid sm:grid-cols-2 gap-3">
                {deliveryItems.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="py-12 bg-secondary/20">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl font-serif font-bold mb-8 text-center">{t.catering.processTitle}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {processSteps.map((step, i) => (
                  <div key={step.title} className="bg-card border border-border rounded-2xl p-6 flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Events Portal CTA */}
          <section className="py-12">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <h2 className="text-xl font-bold mb-3">{t.catering.eventsPortalTitle}</h2>
                <p className="text-muted-foreground mb-5">{t.catering.eventsPortalDesc}</p>
                <Button variant="outline" asChild>
                  <a href="https://events-storia.de" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t.catering.eventsPortalCta}
                  </a>
                </Button>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-12 bg-secondary/20">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl font-serif font-bold mb-8 text-center">{t.catering.faqTitle}</h2>
              <Accordion type="single" collapsible>
                {[
                  { q: t.catering.faq1Q, a: t.catering.faq1A },
                  { q: t.catering.faq2Q, a: t.catering.faq2A },
                  { q: t.catering.faq3Q, a: t.catering.faq3A },
                  { q: t.catering.faq4Q, a: t.catering.faq4A },
                  { q: t.catering.faq5Q, a: t.catering.faq5A },
                ].map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent forceMount className="text-base text-muted-foreground pb-5 leading-relaxed data-[state=closed]:hidden">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="py-12">
            <div className="container mx-auto px-4 max-w-2xl">
              <div className="bg-secondary p-8 rounded-2xl text-center">
                <h2 className="text-xl font-bold mb-4">{t.catering.interested}</h2>
                <p className="text-muted-foreground mb-6">{t.catering.contactUs}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <a href="tel:+498951519696">
                      <Phone className="w-4 h-4 mr-2" />
                      +49 89 51519696
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="mailto:info@ristorantestoria.de">
                      <Mail className="w-4 h-4 mr-2" />
                      {t.catering.sendEmail}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Related Links */}
          <section className="py-12 bg-secondary/20">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl font-serif font-bold mb-6 text-center">{t.catering.relatedTitle}</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <LocalizedLink to="firmenfeier-muenchen" className="bg-card border border-border rounded-xl p-5 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1 text-sm">{t.catering.relatedFirmenfeierTitle}</h3>
                  <p className="text-muted-foreground text-xs">{t.catering.relatedFirmenfeierDesc}</p>
                </LocalizedLink>
                <LocalizedLink to="eventlocation-muenchen-maxvorstadt" className="bg-card border border-border rounded-xl p-5 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1 text-sm">{t.catering.relatedEventlocationTitle}</h3>
                  <p className="text-muted-foreground text-xs">{t.catering.relatedEventlocationDesc}</p>
                </LocalizedLink>
                <LocalizedLink to="hochzeitsfeier-muenchen" className="bg-card border border-border rounded-xl p-5 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1 text-sm">{t.catering.relatedHochzeitsfeierTitle}</h3>
                  <p className="text-muted-foreground text-xs">{t.catering.relatedHochzeitsfeierDesc}</p>
                </LocalizedLink>
                <LocalizedLink to="geburtstagsfeier-muenchen" className="bg-card border border-border rounded-xl p-5 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1 text-sm">{t.catering.relatedGeburtstagsfeierTitle}</h3>
                  <p className="text-muted-foreground text-xs">{t.catering.relatedGeburtstagsfeierDesc}</p>
                </LocalizedLink>
              </div>
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </>
  );
};

export default Catering;
