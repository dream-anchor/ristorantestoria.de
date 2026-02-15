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
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, MessageCircle, Star } from "lucide-react";
import storiaLogo from "@/assets/storia-logo.webp";
import menschenAussen from "@/assets/menschen-aussen.jpeg";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import LocalizedLink from "@/components/LocalizedLink";
import ReservationCTA from "@/components/ReservationCTA";

const TerrasseMuenchen = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);
  const tr = t.seo.terrasse;

  const features = [
    { icon: "☀️", title: tr.feat1Title, desc: tr.feat1Desc, items: [tr.feat1Item1, tr.feat1Item2, tr.feat1Item3, tr.feat1Item4] },
    { icon: "🛋️", title: tr.feat2Title, desc: tr.feat2Desc, items: [tr.feat2Item1, tr.feat2Item2, tr.feat2Item3, tr.feat2Item4] },
    { icon: "🚬", title: tr.feat3Title, desc: tr.feat3Desc, items: [tr.feat3Item1, tr.feat3Item2, tr.feat3Item3, tr.feat3Item4], note: tr.feat3Note },
    { icon: "🍷", title: tr.feat4Title, desc: tr.feat4Desc, items: [tr.feat4Item1, tr.feat4Item2, tr.feat4Item3, tr.feat4Item4] },
    { icon: "🌙", title: tr.feat5Title, desc: tr.feat5Desc, items: [tr.feat5Item1, tr.feat5Item2, tr.feat5Item3, tr.feat5Item4] },
  ];

  const eveningSteps = [
    { time: "19:00", icon: "🍹", title: tr.evening1Title, desc: tr.evening1Desc },
    { time: "19:30", icon: "🍝", title: tr.evening2Title, desc: tr.evening2Desc },
    { time: "21:00", icon: "🍰", title: tr.evening3Title, desc: tr.evening3Desc },
    { time: "21:30", icon: "🚬", title: tr.evening4Title, desc: tr.evening4Desc },
  ];

  const occasions = [
    { icon: "🤝", title: tr.occasion1Title, desc: tr.occasion1Desc },
    { icon: "💕", title: tr.occasion2Title, desc: tr.occasion2Desc },
    { icon: "👥", title: tr.occasion3Title, desc: tr.occasion3Desc },
    { icon: "🎂", title: tr.occasion4Title, desc: tr.occasion4Desc },
  ];

  const testimonials = [
    { quote: tr.testimonial1Quote, author: tr.testimonial1Author },
    { quote: tr.testimonial2Quote, author: tr.testimonial2Author },
    { quote: tr.testimonial3Quote, author: tr.testimonial3Author },
    { quote: tr.testimonial4Quote, author: tr.testimonial4Author },
  ];

  const cigarShops = [
    { name: tr.cigar1Name, address: tr.cigar1Address, desc: tr.cigar1Desc },
    { name: tr.cigar2Name, address: tr.cigar2Address, desc: tr.cigar2Desc },
    { name: tr.cigar3Name, address: tr.cigar3Address, desc: tr.cigar3Desc },
  ];

  const faqs = [
    { q: tr.faq1Question, a: tr.faq1Answer },
    { q: tr.faq2Question, a: tr.faq2Answer },
    { q: tr.faq3Question, a: tr.faq3Answer },
    { q: tr.faq4Question, a: tr.faq4Answer },
    { q: tr.faq5Question, a: tr.faq5Answer },
    { q: tr.faq6Question, a: tr.faq6Answer },
    { q: tr.faq7Question, a: tr.faq7Answer },
    { q: tr.faq8Question, a: tr.faq8Answer },
  ];

  return (
    <>
      <StaticBotContent title={tr.heroTitle} description={tr.seoDescription} sections={[]} />
      <SEO title={tr.seoTitle} description={tr.seoDescription} canonical="/terrasse-muenchen" />
      <StructuredData type="restaurant" />
      <StructuredData type="breadcrumb" breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: tr.breadcrumb, url: '/terrasse-muenchen' }
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
          <img src={menschenAussen} alt={tr.heroTitle} className="absolute inset-0 w-full h-full object-cover" loading="eager" width={1200} height={800} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="relative z-10 container mx-auto px-4 py-16 text-center">
            <Link to="/"><img src={storiaLogo} alt="STORIA Logo" className="h-20 md:h-28 w-auto mx-auto mb-6 brightness-0 invert" /></Link>
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-8 md:px-12 md:py-12 max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">{tr.heroTitle}</h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">{tr.heroSubtitle}</p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{tr.heroBadge1}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{tr.heroBadge2}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm">{tr.heroBadge3}</span>
              </div>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">{tr.heroDescription}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <LocalizedLink to="reservierung">{tr.heroCta}</LocalizedLink>
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

            {/* Intro */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">{tr.introTitle}</h2>
              <p className="text-lg text-muted-foreground mb-4">{tr.introP1}</p>
              <p className="text-muted-foreground mb-4">{tr.introP2}</p>
              <p className="text-muted-foreground">{tr.introP3}</p>
            </section>

            {/* Features */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{tr.featuresTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((f, i) => (
                  <div key={i} className={`bg-card border rounded-lg p-6 ${i >= 3 ? 'lg:col-span-1' : ''}`}>
                    <div className="text-4xl mb-3">{f.icon}</div>
                    <h3 className="text-xl font-serif font-semibold mb-2">{f.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{f.desc}</p>
                    <ul className="text-sm space-y-1">{f.items.map((item, j) => <li key={j} className="text-muted-foreground">✓ {item}</li>)}</ul>
                    {f.note && <p className="text-xs text-primary mt-3">⚠️ {f.note}</p>}
                  </div>
                ))}
              </div>
            </section>

            {/* Zigarre vs Lounges Vergleich */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">{tr.comparisonTitle}</h2>
              <p className="text-muted-foreground mb-8 text-center max-w-3xl mx-auto">{tr.comparisonIntro}</p>
              <p className="text-muted-foreground mb-8">{tr.comparisonNote}</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-secondary/50">
                      <th className="p-3 text-left font-semibold border border-border"></th>
                      <th className="p-3 text-center font-semibold border border-border">{tr.compColLounge}</th>
                      <th className="p-3 text-center font-semibold border border-border bg-primary/10">{tr.compColStoria}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [tr.compRow1, tr.compRow1Lounge, tr.compRow1Storia],
                      [tr.compRow2, tr.compRow2Lounge, tr.compRow2Storia],
                      [tr.compRow3, tr.compRow3Lounge, tr.compRow3Storia],
                      [tr.compRow4, tr.compRow4Lounge, tr.compRow4Storia],
                      [tr.compRow5, tr.compRow5Lounge, tr.compRow5Storia],
                      [tr.compRow6, tr.compRow6Lounge, tr.compRow6Storia],
                      [tr.compRow7, tr.compRow7Lounge, tr.compRow7Storia],
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? '' : 'bg-secondary/20'}>
                        <td className="p-3 border border-border font-medium">{row[0]}</td>
                        <td className="p-3 border border-border text-center text-muted-foreground">{row[1]}</td>
                        <td className="p-3 border border-border text-center bg-primary/5 font-medium">{row[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Der perfekte Abend */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{tr.eveningTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {eveningSteps.map((step, i) => (
                  <div key={i} className="text-center">
                    <span className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mx-auto mb-3">{i + 1}</span>
                    <div className="text-3xl mb-2">{step.icon}</div>
                    <p className="text-sm text-primary font-medium mb-1">{step.time}</p>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Anlässe */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{tr.occasionsTitle}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {occasions.map((occ, i) => (
                  <Card key={i} className="border-border">
                    <CardContent className="pt-6">
                      <div className="text-3xl mb-2">{occ.icon}</div>
                      <h3 className="text-lg font-serif font-semibold mb-2">{occ.title}</h3>
                      <p className="text-muted-foreground text-sm">{occ.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Testimonials */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{tr.testimonialsTitle}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {testimonials.map((tm, i) => (
                  <Card key={i} className="border-border">
                    <CardContent className="pt-6">
                      <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-primary text-primary" />)}</div>
                      <p className="text-muted-foreground italic mb-4">"{tm.quote}"</p>
                      <p className="text-sm font-medium">— {tm.author}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Zigarrenhändler */}
            <section className="mb-16 bg-secondary/50 rounded-xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-6 text-center">{tr.cigarTitle}</h2>
              <p className="text-muted-foreground text-center mb-6">{tr.cigarIntro}</p>
              <div className="grid md:grid-cols-3 gap-6">
                {cigarShops.map((shop, i) => (
                  <div key={i} className="bg-card rounded-lg p-4 border">
                    <h3 className="font-semibold mb-1">{shop.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{shop.address}</p>
                    <p className="text-muted-foreground text-xs">{shop.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Location */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">{tr.locationTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">📍 {tr.locationAddressTitle}</h3>
                  <p className="text-muted-foreground text-sm">Ristorante STORIA<br />Karlstraße 47a<br />80333 München</p>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">🚇 {tr.locationTransitTitle}</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>{tr.locationTransit1}</li>
                    <li>{tr.locationTransit2}</li>
                    <li>{tr.locationTransit3}</li>
                  </ul>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">⏰ {tr.locationHoursTitle}</h3>
                  <p className="text-muted-foreground text-sm">{tr.locationHours1}<br />{tr.locationHours2}</p>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">🌤️ {tr.locationSeasonTitle}</h3>
                  <p className="text-muted-foreground text-sm">{tr.locationSeasonDesc}</p>
                </div>
              </div>
              <ConsentGoogleMaps src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d11.5658!3d48.1465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKarlstra%C3%9Fe%2047a%2C%2080333%20M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1" />
            </section>

            {/* FAQ */}
            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{tr.faqTitle}</h2>
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
              <h2 className="text-3xl font-serif font-bold mb-8 text-center">{tr.relatedTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <LocalizedLink to="aperitivo-muenchen" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{tr.related1Title}</h3>
                  <p className="text-muted-foreground text-sm">{tr.related1Desc}</p>
                </LocalizedLink>
                <LocalizedLink to="romantisches-dinner-muenchen" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{tr.related2Title}</h3>
                  <p className="text-muted-foreground text-sm">{tr.related2Desc}</p>
                </LocalizedLink>
                <LocalizedLink to="pizza-muenchen" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{tr.related3Title}</h3>
                  <p className="text-muted-foreground text-sm">{tr.related3Desc}</p>
                </LocalizedLink>
                <LocalizedLink to="eventlocation-muenchen-maxvorstadt" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2">{tr.related4Title}</h3>
                  <p className="text-muted-foreground text-sm">{tr.related4Desc}</p>
                </LocalizedLink>
              </div>
            </section>

            <ConsentElfsightReviews />

            {/* Final CTA */}
            <section className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-serif font-bold mb-4">{tr.ctaTitle}</h2>
              <p className="mb-8 opacity-90">{tr.ctaDesc}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <LocalizedLink to="reservierung">{tr.ctaReserve}</LocalizedLink>
                </Button>
                <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white" asChild>
                  <a href="tel:+498951519696"><Phone className="w-5 h-5 mr-2" />089 51519696</a>
                </Button>
                <Button size="lg" className="bg-[#25D366] hover:bg-[#20BD5A] text-white" asChild>
                  <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer"><MessageCircle className="w-5 h-5 mr-2" />WhatsApp</a>
                </Button>
              </div>
            </section>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TerrasseMuenchen;
