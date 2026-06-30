import LocalizedLink from "@/components/LocalizedLink";
import { PhoneText } from "@/lib/linkifyPhone";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import GoogleReviews from "@/components/GoogleReviews";
import ConsentGoogleMaps from "@/components/ConsentGoogleMaps";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroImage from "@/assets/gaeste-terrasse-italiener-maxvorstadt-muenchen.webp";
import heroImage600 from "@/assets/gaeste-terrasse-italiener-maxvorstadt-muenchen-600w.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { Phone, MessageCircle, MapPin, Clock, Utensils, ArrowRight, Beer, Music, Users } from "lucide-react";
import BreadcrumbNav from "@/components/BreadcrumbNav";

const OktoberfestMuenchen = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);
  const o = t.seo.oktoberfest;

  // Bayerisch-italienische Freundschaft – die vier Leit-Ideen
  const conceptCards = [
    { title: o.conceptGruppenTitle, desc: o.conceptGruppenDesc },
    { title: o.conceptMittagTitle, desc: o.conceptMittagDesc },
    { title: o.conceptAbendTitle, desc: o.conceptAbendDesc },
    { title: o.conceptBavareseTitle, desc: o.conceptBavareseDesc },
  ];

  // Wiesnbier vom Holzfass (Maß)
  const biere = [
    { name: o.beerMassName, desc: o.beerMassDesc, price: "€ 12,90", badge: o.badgeFass },
    { name: o.beerRadlerName, desc: o.beerRadlerDesc, price: "€ 12,90" },
    { name: o.beerRussName, desc: o.beerRussDesc, price: "€ 12,90" },
    { name: o.beerAlkoholfreiName, desc: o.beerAlkoholfreiDesc, price: "€ 6,90" },
  ];

  // Bayerisch-italienische Aperitivo-Brücke
  const aperitivi = [
    { name: o.spritzBavareseName, desc: o.spritzBavareseDesc, price: "€ 9,90", badge: o.badgeHaus },
    { name: o.spritzAperolName, desc: o.spritzAperolDesc, price: "€ 9,90" },
    { name: o.spritzHugoName, desc: o.spritzHugoDesc, price: "€ 9,90" },
  ];

  // Brotzeit & Brezn – Bavarese Bretter
  const brotzeit = [
    { name: o.brettBavareseName, desc: o.brettBavareseDesc, price: "ca. € 24,90", badge: o.badgeBestseller },
    { name: o.brettMuenchenName, desc: o.brettMuenchenDesc, price: "ca. € 19,90" },
    { name: o.brettItaliaName, desc: o.brettItaliaDesc, price: "ca. € 19,90" },
    { name: o.breznName, desc: o.breznDesc, price: "€ 4,50" },
    { name: o.obatzdaName, desc: o.obatzdaDesc, price: "€ 8,90" },
    { name: o.weisswurstName, desc: o.weisswurstDesc, price: "€ 8,90" },
  ];

  // Oktoberfest-Pizzen (Sonderkarte – 2 bayerisch, 2 italienisch)
  const pizzen = [
    { name: o.pizzaBratwurstName, desc: o.pizzaBratwurstDesc, price: "ca. € 15,90", badge: o.badgeBayerisch },
    { name: o.pizzaSpanferkelName, desc: o.pizzaSpanferkelDesc, price: "ca. € 16,90", badge: o.badgeBayerisch },
    { name: o.pizzaSalamiName, desc: o.pizzaSalamiDesc, price: "ca. € 14,90", badge: o.badgeItalienisch },
    { name: o.pizzaObatzdaName, desc: o.pizzaObatzdaDesc, price: "ca. € 14,90", badge: o.badgeItalienisch },
  ];

  // Braten & Hauptgerichte
  const braten = [
    { name: o.schweinsbratenName, desc: o.schweinsbratenDesc, price: "ca. € 19,90" },
    { name: o.rinderbratenName, desc: o.rinderbratenDesc, price: "ca. € 22,90" },
    { name: o.vegetarischName, desc: o.vegetarischDesc, price: "ca. € 16,90" },
  ];

  // Atmosphäre / Warum STORIA
  const whyFeatures = [
    { icon: "🍺", title: o.featureHolzfassTitle, desc: o.featureHolzfassDesc },
    { icon: "🌥️", title: o.featureTerraceTitle, desc: o.featureTerraceDesc },
    { icon: "🎶", title: o.featureMusikTitle, desc: o.featureMusikDesc },
    { icon: "🥨", title: o.featureDekoTitle, desc: o.featureDekoDesc },
    { icon: "🇮🇹", title: o.featureBavareseTitle, desc: o.featureBavareseDesc },
    { icon: "📍", title: o.featureLocationTitle, desc: o.featureLocationDesc },
  ];

  // Zielgruppen / Anlässe – Fokus Gruppen
  const occasions = [
    { icon: "👥", title: o.occasionGruppenName, desc: o.occasionGruppenDesc },
    { icon: "🏢", title: o.occasionFirmaName, desc: o.occasionFirmaDesc },
    { icon: "🚌", title: o.occasionReiseName, desc: o.occasionReiseDesc },
    { icon: "🎉", title: o.occasionFeiernName, desc: o.occasionFeiernDesc },
    { icon: "🍻", title: o.occasionVorgluehenName, desc: o.occasionVorgluehenDesc },
    { icon: "👨‍👩‍👧", title: o.occasionFamilieName, desc: o.occasionFamilieDesc },
  ];

  // Gruppen- & Firmen-Pakete
  const pakete = [
    { name: o.paketBrotzeitName, desc: o.paketBrotzeitDesc, price: o.paketBrotzeitPrice },
    { name: o.paketBavareseName, desc: o.paketBavareseDesc, price: o.paketBavarasePrice },
    { name: o.paketFirmaName, desc: o.paketFirmaDesc, price: o.paketFirmaPrice },
  ];

  // Hotels in der Nähe
  const hotels = [
    { name: "ibis München City", time: o.hotelIbisTime, note: o.hotelIbisNote },
    { name: "Ruby Lilly Hotel", time: o.hotelLillyTime, note: o.hotelLillyNote },
    { name: "Augusten Hotel", time: o.hotelAugustenTime, note: o.hotelAugustenNote },
    { name: "25hours The Royal Bavarian", time: o.hotel25hTime, note: o.hotel25hNote },
    { name: "Koenigshof – Luxury Collection", time: o.hotelKoenigshofTime, note: o.hotelKoenigshofNote },
    { name: "Ruby Rosi Hotel", time: o.hotelRosiTime, note: o.hotelRosiNote },
    { name: "Eurostars Grand Central", time: o.hotelEurostarsTime, note: o.hotelEurostarsNote },
  ];

  // Schnell zur Wiesn
  const wiesnRoute = [
    { icon: "🚶", title: o.wiesnRouteFussTitle, desc: o.wiesnRouteFussDesc },
    { icon: "🚇", title: o.wiesnRouteUbahnTitle, desc: o.wiesnRouteUbahnDesc },
    { icon: "🚕", title: o.wiesnRouteTaxiTitle, desc: o.wiesnRouteTaxiDesc },
  ];

  const faqItems = [
    { q: o.faq1Question, a: o.faq1Answer },
    { q: o.faq2Question, a: o.faq2Answer },
    { q: o.faq3Question, a: o.faq3Answer },
    { q: o.faq4Question, a: o.faq4Answer },
    { q: o.faq5Question, a: o.faq5Answer },
    { q: o.faq6Question, a: o.faq6Answer },
    { q: o.faq7Question, a: o.faq7Answer },
    { q: o.faq8Question, a: o.faq8Answer },
  ];

  return (
    <>
      <SEO
        title={o.seoTitle}
        description={o.seoDescription}
        canonical="/oktoberfest-muenchen"
      />
      <StructuredData type="restaurant" />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: o.breadcrumbParent, url: '/besondere-anlaesse' },
          { name: o.breadcrumb, url: '/oktoberfest-muenchen' }
        ]}
      />

      {/* Event Schema – Oktoberfest-Zeitraum inkl. Italiener-Wochenende */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "Oktoberfest im STORIA München – Bavarese",
        "startDate": "2026-09-19",
        "endDate": "2026-10-04",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "image": "https://www.ristorantestoria.de/assets/gaeste-terrasse-italiener-maxvorstadt-muenchen.webp",
        "description": o.seoDescription,
        "location": {
          "@type": "Place",
          "name": "Ristorante STORIA",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Karlstraße 47a",
            "addressLocality": "München",
            "addressRegion": "Bayern",
            "postalCode": "80333",
            "addressCountry": "DE"
          }
        },
        "organizer": {
          "@type": "Organization",
          "name": "Ristorante STORIA",
          "url": "https://www.ristorantestoria.de/"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://www.ristorantestoria.de/oktoberfest-muenchen/",
          "availability": "https://schema.org/InStock",
          "price": "0",
          "priceCurrency": "EUR"
        }
      })}} />

      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": { "@type": "Answer", "text": item.a }
        }))
      })}} />

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <img
            src={heroImage}
            srcSet={`${heroImage600} 600w, ${heroImage} 1200w`}
            sizes="100vw"
            alt="Oktoberfest im Ristorante STORIA München – Terrasse Maxvorstadt"
            width={1200}
            height={800}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-8 py-10 md:px-12 md:py-12">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 leading-tight">
                {o.title}
              </h1>
              <p className="text-lg md:text-xl mb-2">
                {o.heroSubtitle}
              </p>
              <p className="text-xl md:text-2xl font-semibold mb-4">
                {o.heroTime}
              </p>
              <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto text-white/90">
                {o.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 text-base md:text-lg px-8 py-6"
                  asChild
                >
                  <LocalizedLink to="reservierung">
                    <Utensils className="w-5 h-5 mr-2" />
                    {o.reserveButton}
                  </LocalizedLink>
                </Button>
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 text-base md:text-lg px-8 py-6"
                  asChild
                >
                  <a href="tel:+498951519696">
                    <Phone className="w-5 h-5 mr-2" />
                    089 51519696
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Bar */}
        <section className="bg-primary text-primary-foreground py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Beer className="w-5 h-5" />
                <span>{o.proofBeer}</span>
              </div>
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5" />
                <span>{o.proofFood}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{o.proofPeriod}</span>
              </div>
            </div>
          </div>
        </section>

        <Navigation />

        <main className="flex-grow">

          {/* Introduction */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <BreadcrumbNav crumbs={[{ label: t.breadcrumb.home, href: '/' }, { label: o.breadcrumb }]} />
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-6">
                {o.introTitle}
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="mb-4">{o.introP1}</p>
                <p>{o.introP2}</p>
                <p className="mt-4">
                  {o.introLinkPre}
                  <LocalizedLink
                    to="besondere-anlaesse"
                    className="text-primary underline hover:no-underline"
                  >
                    {o.introLinkAnchor}
                  </LocalizedLink>
                  {o.introLinkPost}
                </p>
              </div>
            </div>
          </section>

          {/* Bavarese – Konzept erklärt */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 max-w-5xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {o.conceptTitle}
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                {o.conceptSubtitle}
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {conceptCards.map((card, idx) => (
                  <div key={idx} className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                    <p className="text-muted-foreground">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Italiener-Wochenende */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="bg-gradient-to-r from-green-700 via-white to-red-600 p-[2px] rounded-2xl">
                <div className="bg-card rounded-2xl p-8 md:p-10">
                  <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    {o.italienerWeekendBadge}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-2">
                    {o.italienerWeekendTitle}
                  </h2>
                  <p className="text-primary font-semibold mb-4">{o.italienerWeekendSubtitle}</p>
                  <p className="text-muted-foreground mb-4">{o.italienerWeekendP1}</p>
                  <p className="text-muted-foreground">{o.italienerWeekendP2}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Wiesnbier vom Holzfass */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {o.beerTitle}
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                {o.beerSubtitle}
              </p>

              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-6 text-center">{o.categoryBeer}</h3>
                <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
                  {biere.map((drink, idx) => (
                    <div key={idx} className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] bg-card p-4 rounded-lg border border-border">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{drink.name}</h4>
                        {drink.badge && <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">{drink.badge}</span>}
                      </div>
                      <p className="text-muted-foreground mb-2">{drink.desc}</p>
                      <p className="text-primary font-semibold">{drink.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-6 text-center">{o.categoryAperitivo}</h3>
                <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  {aperitivi.map((drink, idx) => (
                    <div key={idx} className="bg-card p-4 rounded-lg border border-border">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{drink.name}</h4>
                        {drink.badge && <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">{drink.badge}</span>}
                      </div>
                      <p className="text-muted-foreground mb-2">{drink.desc}</p>
                      <p className="text-primary font-semibold">{drink.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground/70 max-w-2xl mx-auto">{o.priceNote}</p>
            </div>
          </section>

          {/* Brotzeit & Brezn */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {o.brotzeitTitle}
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                {o.brotzeitSubtitle}
              </p>
              <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
                {brotzeit.map((item, idx) => (
                  <div key={idx} className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] bg-card p-4 rounded-lg border border-border">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{item.name}</h4>
                      {item.badge && <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">{item.badge}</span>}
                    </div>
                    <p className="text-muted-foreground mb-2">{item.desc}</p>
                    <p className="text-primary font-semibold">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Oktoberfest-Pizzen */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {o.pizzaTitle}
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                {o.pizzaSubtitle}
              </p>
              <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {pizzen.map((item, idx) => (
                  <div key={idx} className="bg-card p-4 rounded-lg border border-border">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{item.name}</h4>
                      {item.badge && <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">{item.badge}</span>}
                    </div>
                    <p className="text-muted-foreground mb-2">{item.desc}</p>
                    <p className="text-primary font-semibold">{item.price}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground/70 mt-8 max-w-2xl mx-auto">{o.pizzaNote}</p>
            </div>
          </section>

          {/* Braten & Hauptgerichte */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {o.bratenTitle}
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                {o.bratenSubtitle}
              </p>
              <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {braten.map((item, idx) => (
                  <div key={idx} className="bg-card p-4 rounded-lg border border-border">
                    <h4 className="font-semibold mb-2">{item.name}</h4>
                    <p className="text-muted-foreground mb-2">{item.desc}</p>
                    <p className="text-primary font-semibold">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Hinweis: ganze italienische Karte */}
          <section className="py-12 md:py-16 bg-secondary/30">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="bg-card p-8 rounded-lg border border-border text-center">
                <h2 className="text-xl md:text-2xl font-serif font-semibold mb-3">{o.italKarteTitle}</h2>
                <p className="text-muted-foreground mb-6">{o.italKarteDesc}</p>
                <Button variant="outline" asChild>
                  <LocalizedLink to="speisekarte">
                    {o.italKarteLink} <ArrowRight className="w-4 h-4 ml-2" />
                  </LocalizedLink>
                </Button>
              </div>
            </div>
          </section>

          {/* Familien & Kinder (kurz) */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-3xl text-center">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                {o.kinderTitle}
              </h2>
              <p className="text-muted-foreground">{o.kinderP1}</p>
            </div>
          </section>

          {/* Zeiten – Mittags & Früher Abend */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
                {o.timesTitle}
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-card p-8 rounded-lg border border-border text-center">
                  <h3 className="font-semibold text-xl mb-2">{o.timesMittagTitle}</h3>
                  <p className="text-2xl font-bold text-primary mb-4">{o.timesMittagTime}</p>
                  <p className="text-muted-foreground">{o.timesMittagDesc}</p>
                </div>
                <div className="bg-card p-8 rounded-lg border border-border text-center">
                  <h3 className="font-semibold text-xl mb-2">{o.timesAbendTitle}</h3>
                  <p className="text-2xl font-bold text-primary mb-4">{o.timesAbendTime}</p>
                  <p className="text-muted-foreground">{o.timesAbendDesc}</p>
                </div>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-semibold mb-2">{o.openingTitle}</h3>
                <p className="text-muted-foreground mb-2">{o.openingHours}</p>
                <p className="text-muted-foreground/70">{o.openingNote}</p>
              </div>
            </div>
          </section>

          {/* Atmosphäre / Warum STORIA */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {o.whyTitle}
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto flex items-center justify-center gap-2">
                <Music className="w-5 h-5" /> {o.whySubtitle}
              </p>
              <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
                {whyFeatures.map((feature, idx) => (
                  <div key={idx} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] text-center">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Zielgruppen / Anlässe */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {o.occasionsTitle}
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                {o.occasionsSubtitle}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {occasions.map((occasion, idx) => (
                  <div key={idx} className="bg-card p-6 rounded-lg border border-border">
                    <div className="text-3xl mb-3">{occasion.icon}</div>
                    <h3 className="font-semibold mb-2">{occasion.title}</h3>
                    <p className="text-muted-foreground">{occasion.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Gruppen- & Firmen-Pakete */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4 flex items-center justify-center gap-2">
                <Users className="w-7 h-7" /> {o.paketeTitle}
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                {o.paketeSubtitle}
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {pakete.map((paket, idx) => (
                  <div key={idx} className="bg-card p-6 rounded-lg border border-border flex flex-col">
                    <h3 className="font-semibold text-lg mb-2">{paket.name}</h3>
                    <p className="text-muted-foreground mb-4 flex-grow">{paket.desc}</p>
                    <p className="text-primary font-bold text-lg">{paket.price}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground/70 mt-8 max-w-2xl mx-auto">{o.paketeNote}</p>
            </div>
          </section>

          {/* Location */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-6">
                {o.locationTitle}
              </h2>
              <p className="text-center text-muted-foreground mb-8">{o.locationIntro}</p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><MapPin className="w-5 h-5" /> {o.addressTitle}</h3>
                  <p className="text-muted-foreground">
                    Ristorante STORIA<br />
                    Karlstraße 47a<br />
                    80333 München<br />
                    <a href="tel:+498951519696" className="text-primary hover:underline">089 51519696</a>
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-3">{o.nearbyTitle}</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>{o.nearbyWiesn}</li>
                    <li>{o.nearbyHbf}</li>
                    <li>{o.nearbyKoenigsplatz}</li>
                    <li>{o.nearbyPinakotheken}</li>
                  </ul>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-3">{o.transitTitle}</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>{o.transitUbahn}</li>
                    <li>{o.transitTram}</li>
                    <li>{o.transitSbahn}</li>
                  </ul>
                </div>
              </div>

              <ConsentGoogleMaps src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d11.5658!3d48.1465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRistorante+STORIA!5e0!3m2!1sde!2sde!4v1" />
            </div>
          </section>

          {/* Hotels in der Nähe */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-5xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {o.hotelTitle}
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                {o.hotelSubtitle}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hotels.map((hotel, idx) => (
                  <div key={idx} className="bg-card p-5 rounded-lg border border-border">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold">{hotel.name}</h3>
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded whitespace-nowrap">{hotel.time}</span>
                    </div>
                    <p className="text-muted-foreground text-sm">{hotel.note}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-muted-foreground mt-8 max-w-2xl mx-auto">{o.hotelOutro}</p>
            </div>
          </section>

          {/* Schnell zur Wiesn */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {o.wiesnRouteTitle}
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                {o.wiesnRouteIntro}
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {wiesnRoute.map((item, idx) => (
                  <div key={idx} className="bg-card p-6 rounded-lg border border-border text-center">
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-muted-foreground mt-8 max-w-2xl mx-auto">{o.wiesnRouteNote}</p>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
                {o.faqTitle}
              </h2>
              <Accordion type="multiple" defaultValue={["faq-0","faq-1","faq-2","faq-3","faq-4","faq-5","faq-6","faq-7"]} className="space-y-4">
                {faqItems.map((item, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="bg-card border border-border rounded-lg px-4">
                    <AccordionTrigger className="text-left font-medium">{item.q}</AccordionTrigger>
                    <AccordionContent forceMount className="text-muted-foreground data-[state=closed]:hidden"><PhoneText>{item.a}</PhoneText></AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          {/* Related Content */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
                {o.relatedTitle}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <LocalizedLink to="firmenfeier-muenchen" className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1">{o.relatedFirma}</h3>
                  <p className="text-muted-foreground">{o.relatedFirmaDesc}</p>
                </LocalizedLink>
                <LocalizedLink to="eventlocation-muenchen-maxvorstadt" className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1">{o.relatedEvent}</h3>
                  <p className="text-muted-foreground">{o.relatedEventDesc}</p>
                </LocalizedLink>
                <LocalizedLink to="aperitivo-muenchen" className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1">{o.relatedAperitivo}</h3>
                  <p className="text-muted-foreground">{o.relatedAperitivoDesc}</p>
                </LocalizedLink>
                <LocalizedLink to="speisekarte" className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1">{o.relatedSpeisekarte}</h3>
                  <p className="text-muted-foreground">{o.relatedSpeisekarteDesc}</p>
                </LocalizedLink>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-16 md:py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 max-w-3xl text-center">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                {o.ctaTitle}
              </h2>
              <p className="mb-8 text-primary-foreground/90">
                {o.ctaDesc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <LocalizedLink to="reservierung">{o.reserveButton}</LocalizedLink>
                </Button>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <a href="tel:+498951519696">
                    <Phone className="w-5 h-5 mr-2" />
                    089 51519696
                  </a>
                </Button>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </section>

          <GoogleReviews />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default OktoberfestMuenchen;
