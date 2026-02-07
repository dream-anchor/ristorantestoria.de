import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import StaticBotContent from "@/components/StaticBotContent";
import MenuDisplay from "@/components/MenuDisplay";
import SeasonalSignupForm from "@/components/SeasonalSignupForm";
import LocalizedLink from "@/components/LocalizedLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, MessageCircle, Mail, ExternalLink, ArrowUp } from "lucide-react";
import storiaLogo from "@/assets/storia-logo.webp";
import sommerfestImage from "@/assets/sommerfest-event.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { PARENT_SLUGS } from "@/config/seasonalMenus";
import type { SeasonalMenuConfig } from "@/config/seasonalMenus";

interface SilvesterMuenchenProps {
  menu: any | null;
  archivedMenu: any | undefined;
  seasonalConfig: SeasonalMenuConfig;
}

const SilvesterMuenchen = ({ menu, archivedMenu, seasonalConfig }: SilvesterMuenchenProps) => {
  const { t, language } = useLanguage();
  usePrerenderReady(true);
  const s = t.seo.silvester;
  const isActive = !!menu;
  const currentYear = new Date().getFullYear();

  const parentSlug = PARENT_SLUGS[language] || PARENT_SLUGS.de;
  const seasonalSlug = seasonalConfig.slugs[language] || seasonalConfig.slugs.de;
  const canonicalPath = language === 'de'
    ? `/${parentSlug}/${seasonalSlug}`
    : `/${language}/${parentSlug}/${seasonalSlug}`;

  const packages = [
    { title: s.package1Title, subtitle: s.package1Subtitle, items: [s.package1Item1, s.package1Item2, s.package1Item3, s.package1Item4, s.package1Item5], ideal: s.package1Ideal, price: s.package1Price },
    { title: s.package2Title, subtitle: s.package2Subtitle, items: [s.package2Item1, s.package2Item2, s.package2Item3, s.package2Item4, s.package2Item5, s.package2Item6, s.package2Item7], ideal: s.package2Ideal, price: s.package2Price, badge: s.package2Badge },
    { title: s.package3Title, subtitle: s.package3Subtitle, items: [s.package3Item1, s.package3Item2, s.package3Item3, s.package3Item4, s.package3Item5], ideal: s.package3Ideal, price: s.package3Price },
  ];

  const reasons = [
    { title: s.reason1Title, desc: s.reason1Desc },
    { title: s.reason2Title, desc: s.reason2Desc },
    { title: s.reason3Title, desc: s.reason3Desc },
    { title: s.reason4Title, desc: s.reason4Desc },
    { title: s.reason5Title, desc: s.reason5Desc },
    { title: s.reason6Title, desc: s.reason6Desc },
    { title: s.reason7Title, desc: s.reason7Desc },
    { title: s.reason8Title, desc: s.reason8Desc },
  ];

  const steps = [
    { title: s.step1Title, desc: s.step1Desc },
    { title: s.step2Title, desc: s.step2Desc },
    { title: s.step3Title, desc: s.step3Desc },
    { title: s.step4Title, desc: s.step4Desc },
    { title: s.step5Title, desc: s.step5Desc },
    { title: s.step6Title, desc: s.step6Desc },
  ];

  const faqs = [
    { q: s.faq1Question, a: s.faq1Answer },
    { q: s.faq2Question, a: s.faq2Answer },
    { q: s.faq3Question, a: s.faq3Answer },
    { q: s.faq4Question, a: s.faq4Answer },
    { q: s.faq5Question, a: s.faq5Answer },
    { q: s.faq6Question, a: s.faq6Answer },
    { q: s.faq7Question, a: s.faq7Answer },
    { q: s.faq8Question, a: s.faq8Answer },
  ];

  const relatedLinks = [
    { title: s.related1Title, desc: s.related1Desc, to: "speisekarte" },
    { title: s.related2Title, desc: s.related2Desc, to: "eventlocation-muenchen-maxvorstadt" },
    { title: s.related3Title, desc: s.related3Desc, to: "besondere-anlaesse/weihnachtsmenue" },
    { title: s.related4Title, desc: s.related4Desc, to: "besondere-anlaesse/valentinstag-menue" },
    { title: s.related5Title, desc: s.related5Desc, to: "firmenfeier-muenchen" },
    { title: s.related6Title, desc: s.related6Desc, to: "kontakt" },
  ];

  return (
    <>
      <StaticBotContent title={s.heroTitle} description={s.heroDescription} sections={[]} />
      <SEO title={s.seoTitle} description={s.seoDescription} canonical={canonicalPath} />
      <StructuredData type="restaurant" />
      <StructuredData type="breadcrumb" breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: t.nav.besondereAnlaesse, url: `/${PARENT_SLUGS[language] || PARENT_SLUGS.de}` },
        { name: seasonalConfig.titles[language] || seasonalConfig.titles.de, url: canonicalPath }
      ]} />

      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": { "@type": "Answer", "text": faq.a }
        }))
      })}} />

      {/* Event Schema (active only) */}
      {isActive && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Event",
          "name": s.seoTitle,
          "description": s.seoDescription,
          "startDate": `${currentYear}-12-31T19:00:00+01:00`,
          "endDate": `${currentYear + 1}-01-01T02:00:00+01:00`,
          "eventStatus": "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "location": {
            "@type": "Place",
            "name": "Ristorante STORIA",
            "address": { "@type": "PostalAddress", "streetAddress": "Theresienstraße 56", "addressLocality": "München", "addressRegion": "Bayern", "postalCode": "80333", "addressCountry": "DE" }
          },
          "organizer": { "@type": "Restaurant", "name": "Ristorante STORIA", "url": "https://www.ristorantestoria.de" },
          "offers": [
            { "@type": "Offer", "name": "Classic", "price": "99", "priceCurrency": "EUR", "availability": "https://schema.org/InStock" },
            { "@type": "Offer", "name": "Premium", "price": "150", "priceCurrency": "EUR", "availability": "https://schema.org/InStock" }
          ]
        })}} />
      )}

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <img src={sommerfestImage} alt={s.heroTitle} className="absolute inset-0 w-full h-full object-cover" loading="eager" width={1200} height={800} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="relative z-10 container mx-auto px-4 py-16 text-center">
            <Link to="/"><img src={storiaLogo} alt="STORIA Logo" className="h-20 md:h-28 w-auto mx-auto mb-6 brightness-0 invert" /></Link>
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-8 md:px-12 md:py-12 max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">{s.heroTitle}</h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">{s.heroSubtitle}</p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{s.heroBadge1}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{s.heroBadge2}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{s.heroBadge3}</span>
              </div>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">{s.heroDescription}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isActive ? (
                  <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                    <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer"><ExternalLink className="w-5 h-5 mr-2" />{s.heroCta}</a>
                  </Button>
                ) : (
                  <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                    <a href="#signup-form">{s.heroCtaInactive}</a>
                  </Button>
                )}
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <a href="tel:+498951519696"><Phone className="w-5 h-5 mr-2" />{s.heroCtaPhone}</a>
                </Button>
              </div>
              <p className="mt-6 text-white/70 text-sm">
                {s.heroEventsNote} <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-primary">{s.heroEventsLink}</a>
              </p>
            </div>
          </div>
        </section>

        <Navigation />

        <main className="container mx-auto px-4 py-12 flex-grow">
          <article className="max-w-5xl mx-auto">

            {/* Intro */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">{s.introTitle}</h2>
              <p className="text-lg text-muted-foreground mb-4">{s.introP1}</p>
              <p className="text-muted-foreground mb-4">{s.introP2}</p>
              <p className="text-muted-foreground">{s.introP3}</p>
            </section>

            {/* Packages (inactive) OR Live Menu (active) */}
            {!isActive ? (
              <section className="mb-16">
                <h2 className="text-3xl font-serif font-bold mb-4 text-center">{s.packagesTitle}</h2>
                <p className="text-muted-foreground text-center mb-8">{s.packagesIntro}</p>
                <div className="grid md:grid-cols-3 gap-6">
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
              </section>
            ) : (
              <section className="mb-16">
                <MenuDisplay menuType="special" menuId={menu.id} showTitle={false} />
              </section>
            )}

            {/* CTA Box */}
            <section className="mb-16 bg-primary text-primary-foreground rounded-xl p-8 text-center">
              <h2 className="text-2xl font-serif font-bold mb-4">{s.ctaBoxTitle}</h2>
              <p className="mb-6 opacity-90">{s.ctaBoxDesc}</p>
              <Button size="lg" variant="secondary" asChild>
                <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer">{s.ctaBoxButton}</a>
              </Button>
              <p className="mt-6 opacity-80 text-sm">{s.ctaBoxNote}</p>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <a href="tel:+498951519696" className="flex items-center gap-2 hover:opacity-80"><Phone className="w-4 h-4" /> 089 51519696</a>
                <a href="mailto:info@ristorantestoria.de" className="flex items-center gap-2 hover:opacity-80"><Mail className="w-4 h-4" /> info@ristorantestoria.de</a>
                <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 text-[#25D366]"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
              </div>
            </section>

            {/* 8 Reasons */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{s.reasonsTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reasons.map((r, i) => (
                  <div key={i} className="bg-secondary/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">{r.title}</h3>
                    <p className="text-muted-foreground text-sm">{r.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Timeline */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{s.timelineTitle}</h2>
              <div className="flex flex-wrap justify-center gap-6">
                {steps.map((step, i) => (
                  <div key={i} className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] flex flex-col items-center text-center">
                    <span className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mb-3">{i + 1}</span>
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{s.faqTitle}</h2>
              <Accordion type="single" collapsible className="max-w-3xl mx-auto">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent forceMount className="text-muted-foreground data-[state=closed]:hidden">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Email Signup (inactive only) */}
            {!isActive && (
              <section id="signup-form" className="mb-16 scroll-mt-24">
                <div className="bg-card rounded-lg border border-border p-8 md:p-12 text-center">
                  <h2 className="text-2xl font-serif font-bold mb-3">{s.signupTitle}</h2>
                  <p className="text-muted-foreground mb-6">{s.signupDesc}</p>
                  <div className="max-w-md mx-auto">
                    <SeasonalSignupForm seasonalEvent="silvester" />
                  </div>
                </div>
              </section>
            )}

            {/* Archived Menu (inactive only, when exists) */}
            {!isActive && archivedMenu && (
              <section className="mb-16">
                <div className="border-2 border-dashed border-border rounded-lg p-6 md:p-8 opacity-90">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <h2 className="text-2xl font-serif font-bold text-center">
                      {s.archivedTitle.replace('{year}', String(archivedMenu.archive_year || currentYear - 1))}
                    </h2>
                    <Badge variant="secondary">{archivedMenu.archive_year || currentYear - 1}</Badge>
                  </div>
                  <MenuDisplay menuType="special" menuId={archivedMenu.id} showTitle={false} />
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-3">{s.archivedDisclaimer}</p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="#signup-form"><ArrowUp className="w-4 h-4 mr-2" />{s.heroCtaInactive}</a>
                    </Button>
                  </div>
                </div>
              </section>
            )}

            {/* Related Links */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{s.relatedTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedLinks.map((link, i) => (
                  <LocalizedLink key={i} to={link.to} className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                    <h3 className="font-semibold mb-2">{link.title}</h3>
                    <p className="text-muted-foreground text-sm">{link.desc}</p>
                  </LocalizedLink>
                ))}
              </div>
            </section>

            {/* Final CTA */}
            <section className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-serif font-bold mb-4">{s.finalCtaTitle}</h2>
              <p className="mb-8 opacity-90">{s.finalCtaDesc}</p>
              {isActive ? (
                <Button size="lg" variant="secondary" asChild>
                  <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer">{s.finalCtaButton}</a>
                </Button>
              ) : (
                <Button size="lg" variant="secondary" asChild>
                  <a href="#signup-form">{s.finalCtaButtonInactive}</a>
                </Button>
              )}
              <p className="mt-6 opacity-80 text-sm">{s.finalCtaAlt}</p>
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

export default SilvesterMuenchen;
