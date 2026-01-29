import LocalizedLink from "@/components/LocalizedLink";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import ConsentElfsightReviews from "@/components/ConsentElfsightReviews";
import ConsentGoogleMaps from "@/components/ConsentGoogleMaps";
import StaticBotContent from "@/components/StaticBotContent";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import cocktailsImage from "@/assets/cocktails.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { Phone, MessageCircle, Calendar, MapPin, Clock, Wine, Utensils, ArrowRight } from "lucide-react";

const AperitivoMuenchen = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  // Spritz drinks data
  const spritzDrinks = [
    { name: t.seo.aperitivo.aperolSpritzName, desc: t.seo.aperitivo.aperolSpritzDesc, origin: t.seo.aperitivo.aperolSpritzOrigin, price: "€ 9,90", badge: t.seo.aperitivo.badgeBestseller },
    { name: t.seo.aperitivo.hugoName, desc: t.seo.aperitivo.hugoDesc, origin: t.seo.aperitivo.hugoOrigin, price: "€ 9,90" },
    { name: t.seo.aperitivo.campariSpritzName, desc: t.seo.aperitivo.campariSpritzDesc, origin: t.seo.aperitivo.campariSpritzOrigin, price: "€ 9,90" },
    { name: t.seo.aperitivo.limoncelloSpritzName, desc: t.seo.aperitivo.limoncelloSpritzDesc, origin: t.seo.aperitivo.limoncelloSpritzOrigin, price: "€ 9,90" },
    { name: t.seo.aperitivo.sartiSpritzName, desc: t.seo.aperitivo.sartiSpritzDesc, price: "€ 9,90" },
    { name: t.seo.aperitivo.belsazarSpritzName, desc: t.seo.aperitivo.belsazarSpritzDesc, price: "€ 9,90" },
    { name: t.seo.aperitivo.rosatomioName, desc: t.seo.aperitivo.rosatomioDesc, price: "€ 9,90" },
    { name: t.seo.aperitivo.himbeerSpritzName, desc: t.seo.aperitivo.himbeerSpritzDesc, price: "€ 9,90" },
    { name: t.seo.aperitivo.greenMelonSpritzName, desc: t.seo.aperitivo.greenMelonSpritzDesc, price: "€ 9,90" },
    { name: t.seo.aperitivo.lilletBerryName, desc: t.seo.aperitivo.lilletBerryDesc, price: "€ 9,90" },
  ];

  const cocktails = [
    { name: t.seo.aperitivo.negroniName, desc: t.seo.aperitivo.negroniDesc, origin: t.seo.aperitivo.negroniOrigin, taste: t.seo.aperitivo.negroniTaste, price: "€ 14,90", badge: t.seo.aperitivo.badgeClassic },
    { name: t.seo.aperitivo.americanoName, desc: t.seo.aperitivo.americanoDesc, origin: t.seo.aperitivo.americanoOrigin, price: "€ 14,90" },
    { name: t.seo.aperitivo.belliniName, desc: t.seo.aperitivo.belliniDesc, origin: t.seo.aperitivo.belliniOrigin, price: "€ 11,50" },
  ];

  const wines = [
    { name: "Spumante DOCG", desc: t.seo.aperitivo.spumanteDesc, price: "€ 6,90" },
    { name: "Champagner Brut", desc: t.seo.aperitivo.champagnerBrutDesc, price: "€ 13,80" },
    { name: "Champagner Rosé", desc: t.seo.aperitivo.champagnerRoseDesc, price: "€ 16,80" },
    { name: "Cirò Bianco Classico DOC", desc: t.seo.aperitivo.ciroBiancoDesc, price: "€ 4,90" },
    { name: "Cirò Rosato DOC", desc: t.seo.aperitivo.ciroRosatoDesc, price: "€ 4,90" },
    { name: "Sauvignon Blanc IGT", desc: t.seo.aperitivo.sauvignonDesc, price: "€ 5,50" },
    { name: "Lugana DOC", desc: t.seo.aperitivo.luganaDesc, price: "€ 5,60" },
  ];

  const nonAlcoholic = [
    { name: t.seo.aperitivo.sanBitterSpritzName, desc: t.seo.aperitivo.sanBitterSpritzDesc, price: "€ 7,90" },
    { name: t.seo.aperitivo.crodinoSpritzName, desc: t.seo.aperitivo.crodinoSpritzDesc, price: "€ 7,90" },
    { name: "San Bitter", desc: t.seo.aperitivo.sanBitterPurDesc, price: "€ 4,70" },
    { name: "Crodino", desc: t.seo.aperitivo.crodinoPurDesc, price: "€ 4,70" },
  ];

  const whyFeatures = [
    { icon: "🇮🇹", title: t.seo.aperitivo.featureAuthenticTitle, desc: t.seo.aperitivo.featureAuthenticDesc },
    { icon: "🍸", title: t.seo.aperitivo.featurePremiumTitle, desc: t.seo.aperitivo.featurePremiumDesc },
    { icon: "📍", title: t.seo.aperitivo.featureLocationTitle, desc: t.seo.aperitivo.featureLocationDesc },
    { icon: "🌅", title: t.seo.aperitivo.featureTerraceTitle, desc: t.seo.aperitivo.featureTerraceDesc },
    { icon: "🎵", title: t.seo.aperitivo.featureAmbienceTitle, desc: t.seo.aperitivo.featureAmbienceDesc },
  ];

  const occasions = [
    { icon: t.seo.aperitivo.occasionAfterWork, desc: t.seo.aperitivo.occasionAfterWorkDesc },
    { icon: t.seo.aperitivo.occasionDate, desc: t.seo.aperitivo.occasionDateDesc },
    { icon: t.seo.aperitivo.occasionMuseum, desc: t.seo.aperitivo.occasionMuseumDesc },
    { icon: t.seo.aperitivo.occasionStudent, desc: t.seo.aperitivo.occasionStudentDesc },
    { icon: t.seo.aperitivo.occasionShopping, desc: t.seo.aperitivo.occasionShoppingDesc },
    { icon: t.seo.aperitivo.occasionDinner, desc: t.seo.aperitivo.occasionDinnerDesc },
  ];

  const faqItems = [
    { q: t.seo.aperitivo.faq1Question, a: t.seo.aperitivo.faq1Answer },
    { q: t.seo.aperitivo.faq2Question, a: t.seo.aperitivo.faq2Answer },
    { q: t.seo.aperitivo.faq3Question, a: t.seo.aperitivo.faq3Answer },
    { q: t.seo.aperitivo.faq4Question, a: t.seo.aperitivo.faq4Answer },
    { q: t.seo.aperitivo.faq5Question, a: t.seo.aperitivo.faq5Answer },
    { q: t.seo.aperitivo.faq6Question, a: t.seo.aperitivo.faq6Answer },
  ];

  return (
    <>
      <StaticBotContent
        title={t.seo.aperitivo.title}
        description={t.seo.aperitivo.seoDescription}
        sections={[
          { heading: t.seo.aperitivo.menuTitle, content: spritzDrinks.slice(0, 4).map(d => d.name) },
          { heading: t.seo.aperitivo.whyTitle, content: whyFeatures.map(f => f.title) },
        ]}
      />
      <SEO
        title={t.seo.aperitivo.seoTitle}
        description={t.seo.aperitivo.seoDescription}
        canonical="/aperitivo-muenchen"
      />
      <StructuredData type="restaurant" />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: t.nav.drinks, url: '/getraenke' },
          { name: t.seo.aperitivo.breadcrumb, url: '/aperitivo-muenchen' }
        ]} 
      />
      
      {/* BarOrPub Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BarOrPub",
        "name": "STORIA Aperitivo Bar München",
        "image": "https://www.ristorantestoria.de/assets/cocktails.webp",
        "description": t.seo.aperitivo.seoDescription,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Karlstraße 47a",
          "addressLocality": "München",
          "addressRegion": "Bayern",
          "postalCode": "80333",
          "addressCountry": "DE"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 48.1465,
          "longitude": 11.5658
        },
        "telephone": "+49 89 51519696",
        "priceRange": "€€",
        "servesCuisine": "Italienisch",
        "hasMenu": {
          "@type": "Menu",
          "name": "Aperitivo & Drinks",
          "hasMenuSection": [
            {
              "@type": "MenuSection",
              "name": "Spritz-Klassiker",
              "hasMenuItem": [
                { "@type": "MenuItem", "name": "Aperol Spritz", "description": "Aperol, Prosecco, Soda, Orange", "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "9.90" } },
                { "@type": "MenuItem", "name": "Hugo", "description": "Holunder, Prosecco, Soda, Minze", "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "9.90" } },
                { "@type": "MenuItem", "name": "Campari Spritz", "description": "Campari, Prosecco, Soda", "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "9.90" } }
              ]
            },
            {
              "@type": "MenuSection",
              "name": "Cocktail-Klassiker",
              "hasMenuItem": [
                { "@type": "MenuItem", "name": "Negroni", "description": "Dry Gin, Vermouth, Campari", "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "14.90" } },
                { "@type": "MenuItem", "name": "Bellini", "description": "Prosecco, White Peach Purée", "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "11.50" } }
              ]
            }
          ]
        },
        "openingHoursSpecification": [
          { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "17:00", "closes": "22:30", "description": "Aperitivo-Zeit" },
          { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Saturday", "Sunday"], "opens": "17:00", "closes": "22:30", "description": "Aperitivo-Zeit" }
        ]
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
            src={cocktailsImage} 
            alt="Aperitivo Cocktails STORIA München"
            width={1200}
            height={800}
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-8 py-10 md:px-12 md:py-12">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 leading-tight">
                {t.seo.aperitivo.title}
              </h1>
              <p className="text-lg md:text-xl mb-2">
                {t.seo.aperitivo.heroSubtitle}
              </p>
              <p className="text-xl md:text-2xl font-semibold mb-4">
                {t.seo.aperitivo.heroTime}
              </p>
              <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto text-white/90">
                {t.seo.aperitivo.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 text-base md:text-lg px-8 py-6"
                  asChild
                >
                  <LocalizedLink to="reservierung">
                    <Utensils className="w-5 h-5 mr-2" />
                    {t.seo.aperitivo.reserveButton}
                  </LocalizedLink>
                </Button>
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 border-2 border-white text-base md:text-lg px-8 py-6"
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
                <Clock className="w-5 h-5" />
                <span>{t.seo.aperitivo.dailyTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Wine className="w-5 h-5" />
                <span>10+ Spritz-Varianten</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>5 Min. Königsplatz</span>
              </div>
            </div>
          </div>
        </section>

        <Navigation />
        
        <main className="flex-grow">
          
          {/* Introduction */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-6">
                {t.seo.aperitivo.introTitle}
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="mb-4">{t.seo.aperitivo.introP1}</p>
                <p>{t.seo.aperitivo.introP2}</p>
              </div>
            </div>
          </section>

          {/* Aperitivo Explained */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 max-w-5xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.aperitivo.explainedTitle}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold text-lg mb-2">{t.seo.aperitivo.explainWhat}</h3>
                  <p className="text-muted-foreground text-sm">{t.seo.aperitivo.explainWhatDesc}</p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold text-lg mb-2">{t.seo.aperitivo.explainWhen}</h3>
                  <p className="text-muted-foreground text-sm">{t.seo.aperitivo.explainWhenDesc}</p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold text-lg mb-2">{t.seo.aperitivo.explainParts}</h3>
                  <p className="text-muted-foreground text-sm">{t.seo.aperitivo.explainPartsDesc}</p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold text-lg mb-2">{t.seo.aperitivo.explainVs}</h3>
                  <p className="text-muted-foreground text-sm">{t.seo.aperitivo.explainVsDesc}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Aperitivo Menu */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {t.seo.aperitivo.menuTitle}
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                {t.seo.aperitivo.menuSubtitle}
              </p>
              
              {/* Spritz Section */}
              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-6 text-center">{t.seo.aperitivo.categorySpritz}</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                  {spritzDrinks.map((drink, idx) => (
                    <div key={idx} className="bg-card p-4 rounded-lg border border-border">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{drink.name}</h4>
                        {drink.badge && <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">{drink.badge}</span>}
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">{drink.desc}</p>
                      {drink.origin && <p className="text-xs text-muted-foreground/70 mb-2">{drink.origin}</p>}
                      <p className="text-primary font-semibold">{drink.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cocktails Section */}
              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-6 text-center">{t.seo.aperitivo.categoryCocktails}</h3>
                <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  {cocktails.map((drink, idx) => (
                    <div key={idx} className="bg-card p-4 rounded-lg border border-border">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{drink.name}</h4>
                        {drink.badge && <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">{drink.badge}</span>}
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">{drink.desc}</p>
                      {drink.origin && <p className="text-xs text-muted-foreground/70 mb-1">{drink.origin}</p>}
                      {drink.taste && <p className="text-xs text-muted-foreground/70 mb-2">{drink.taste}</p>}
                      <p className="text-primary font-semibold">{drink.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wines Section */}
              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-6 text-center">{t.seo.aperitivo.categoryWines}</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                  {wines.map((wine, idx) => (
                    <div key={idx} className="bg-card p-4 rounded-lg border border-border">
                      <h4 className="font-semibold mb-2">{wine.name}</h4>
                      <p className="text-muted-foreground text-sm mb-2">{wine.desc}</p>
                      <p className="text-primary font-semibold">{wine.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Non-Alcoholic Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-6 text-center">{t.seo.aperitivo.categoryNonAlcoholic}</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  {nonAlcoholic.map((drink, idx) => (
                    <div key={idx} className="bg-card p-4 rounded-lg border border-border">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{drink.name}</h4>
                        <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">{t.seo.aperitivo.nonAlcoholicLabel}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">{drink.desc}</p>
                      <p className="text-primary font-semibold">{drink.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <Button variant="outline" asChild>
                  <LocalizedLink to="getraenke">
                    {t.seo.aperitivo.menuLink} <ArrowRight className="w-4 h-4 ml-2" />
                  </LocalizedLink>
                </Button>
              </div>
            </div>
          </section>

          {/* Aperitivo Times */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
                {t.seo.aperitivo.timesTitle}
              </h2>
              <div className="bg-card p-8 rounded-lg border border-border text-center mb-6">
                <h3 className="font-semibold text-xl mb-2">{t.seo.aperitivo.dailyAperitivo}</h3>
                <p className="text-3xl font-bold text-primary mb-4">{t.seo.aperitivo.dailyTime}</p>
                <p className="text-muted-foreground">{t.seo.aperitivo.dailyDesc}</p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-semibold mb-2">{t.seo.aperitivo.openingTitle}</h3>
                <p className="text-muted-foreground mb-2">{t.seo.aperitivo.openingHours}</p>
                <p className="text-sm text-muted-foreground/70">{t.seo.aperitivo.openingNote}</p>
              </div>
            </div>
          </section>

          {/* Why STORIA */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.aperitivo.whyTitle}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {whyFeatures.map((feature, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Occasions */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.aperitivo.occasionsTitle}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {occasions.map((occasion, idx) => (
                  <div key={idx} className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="font-semibold mb-2">{occasion.icon}</h3>
                    <p className="text-muted-foreground text-sm">{occasion.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-6">
                {t.seo.aperitivo.locationTitle}
              </h2>
              <p className="text-center text-muted-foreground mb-8">{t.seo.aperitivo.locationIntro}</p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-3">{t.seo.aperitivo.addressTitle}</h3>
                  <p className="text-muted-foreground text-sm">
                    Ristorante STORIA<br />
                    Karlstraße 47a<br />
                    80333 München<br />
                    <a href="tel:+498951519696" className="text-primary hover:underline">089 51519696</a>
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-3">{t.seo.aperitivo.nearbyTitle}</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>{t.seo.aperitivo.nearbyKoenigsplatz}</li>
                    <li>{t.seo.aperitivo.nearbyHbf}</li>
                    <li>{t.seo.aperitivo.nearbyTU}</li>
                    <li>{t.seo.aperitivo.nearbyPinakotheken}</li>
                    <li>{t.seo.aperitivo.nearbyOdeonsplatz}</li>
                  </ul>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-3">{t.seo.aperitivo.transitTitle}</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>{t.seo.aperitivo.transitUbahn}</li>
                    <li>{t.seo.aperitivo.transitTram}</li>
                    <li>{t.seo.aperitivo.transitSbahn}</li>
                  </ul>
                </div>
              </div>

              <ConsentGoogleMaps src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d11.5658!3d48.1465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRistorante+STORIA!5e0!3m2!1sde!2sde!4v1" />
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
                {t.seo.aperitivo.faqTitle}
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {faqItems.map((item, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="bg-card border border-border rounded-lg px-4">
                    <AccordionTrigger className="text-left font-medium">{item.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          {/* Related Content */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
                {t.seo.aperitivo.relatedTitle}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <LocalizedLink to="getraenke" className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1">{t.seo.aperitivo.relatedDrinks}</h3>
                  <p className="text-muted-foreground text-sm">{t.seo.aperitivo.relatedDrinksDesc}</p>
                </LocalizedLink>
                <LocalizedLink to="speisekarte" className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1">{t.seo.aperitivo.relatedFood}</h3>
                  <p className="text-muted-foreground text-sm">{t.seo.aperitivo.relatedFoodDesc}</p>
                </LocalizedLink>
                <LocalizedLink to="romantisches-dinner-muenchen" className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1">{t.seo.aperitivo.relatedRomantic}</h3>
                  <p className="text-muted-foreground text-sm">{t.seo.aperitivo.relatedRomanticDesc}</p>
                </LocalizedLink>
                <LocalizedLink to="lunch-muenchen-maxvorstadt" className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1">{t.seo.aperitivo.relatedLunch}</h3>
                  <p className="text-muted-foreground text-sm">{t.seo.aperitivo.relatedLunchDesc}</p>
                </LocalizedLink>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-16 md:py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 max-w-3xl text-center">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                {t.seo.aperitivo.ctaTitle}
              </h2>
              <p className="mb-8 text-primary-foreground/90">
                {t.seo.aperitivo.ctaDesc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <LocalizedLink to="reservierung">{t.seo.aperitivo.reserveButton}</LocalizedLink>
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

          <ConsentElfsightReviews />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AperitivoMuenchen;
