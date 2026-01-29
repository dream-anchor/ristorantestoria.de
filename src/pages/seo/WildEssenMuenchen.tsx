import LocalizedLink from "@/components/LocalizedLink";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ConsentElfsightReviews from "@/components/ConsentElfsightReviews";
import ConsentGoogleMaps from "@/components/ConsentGoogleMaps";
import StaticBotContent from "@/components/StaticBotContent";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { 
  Phone, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  Leaf, 
  ChefHat, 
  Wine, 
  Clock, 
  ArrowRight,
  Star,
  Utensils
} from "lucide-react";

// Wild game hero image
import wildVenisonHero from "@/assets/wild-venison-hero.webp";

const WildEssenMuenchen = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  const wildDishes = [
    {
      title: t.seo.wild.dishDuckCarpaccio,
      description: t.seo.wild.dishDuckCarpaccioDesc,
      price: "€ 19,50",
      category: t.seo.wild.categoryAntipasti,
    },
    {
      title: t.seo.wild.dishPappardelle,
      description: t.seo.wild.dishPappardelleDesc,
      price: "€ 22,50",
      category: t.seo.wild.categoryPasta,
      badge: t.seo.wild.badgeAutumn,
    },
    {
      title: t.seo.wild.dishVenison,
      description: t.seo.wild.dishVenisonDesc,
      price: "€ 44,00",
      category: t.seo.wild.categorySecondi,
      badge: t.seo.wild.badgeChefSpecial,
    },
    {
      title: t.seo.wild.dishDeerRagout,
      description: t.seo.wild.dishDeerRagoutDesc,
      price: "€ 27,50",
      category: t.seo.wild.categorySecondi,
    },
  ];

  const whyStoriaFeatures = [
    {
      icon: "🇮🇹",
      title: t.seo.wild.featureTraditionTitle,
      description: t.seo.wild.featureTraditionDesc,
    },
    {
      icon: "🌿",
      title: t.seo.wild.featureSustainableTitle,
      description: t.seo.wild.featureSustainableDesc,
    },
    {
      icon: "👨‍🍳",
      title: t.seo.wild.featureHandcraftedTitle,
      description: t.seo.wild.featureHandcraftedDesc,
    },
    {
      icon: "🍷",
      title: t.seo.wild.featureWineTitle,
      description: t.seo.wild.featureWineDesc,
    },
  ];

  const wildLexikon = [
    {
      term: t.seo.wild.lexikonDeer,
      termItalian: "Capriolo",
      description: t.seo.wild.lexikonDeerDesc,
    },
    {
      term: t.seo.wild.lexikonStag,
      termItalian: "Cervo",
      description: t.seo.wild.lexikonStagDesc,
    },
    {
      term: t.seo.wild.lexikonDuck,
      termItalian: "Anatra",
      description: t.seo.wild.lexikonDuckDesc,
    },
  ];

  const faqItems = [
    { question: t.seo.wild.faq1Question, answer: t.seo.wild.faq1Answer },
    { question: t.seo.wild.faq2Question, answer: t.seo.wild.faq2Answer },
    { question: t.seo.wild.faq3Question, answer: t.seo.wild.faq3Answer },
    { question: t.seo.wild.faq4Question, answer: t.seo.wild.faq4Answer },
    { question: t.seo.wild.faq5Question, answer: t.seo.wild.faq5Answer },
    { question: t.seo.wild.faq6Question, answer: t.seo.wild.faq6Answer },
  ];

  const wineRecommendations = [
    { name: "Barolo DOCG", description: t.seo.wild.wineBaroloDesc },
    { name: "Brunello di Montalcino", description: t.seo.wild.wineBrunelloDesc },
    { name: "Amarone della Valpolicella", description: t.seo.wild.wineAmaroneDesc },
    { name: "Primitivo di Manduria", description: t.seo.wild.winePrimitivoDesc },
  ];

  return (
    <>
      <StaticBotContent
        title={t.seo.wild.heroTitle}
        description={t.seo.wild.heroDescription}
        sections={[
          { heading: t.seo.wild.menuTitle, content: wildDishes.map(d => d.title) },
          { heading: t.seo.wild.whyStoriaTitle, content: whyStoriaFeatures.map(f => f.title) },
        ]}
      />
      <SEO
        title={t.seo.wild.seoTitle}
        description={t.seo.wild.seoDescription}
        canonical="/wild-essen-muenchen"
      />
      <StructuredData type="restaurant" />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: t.nav.foodMenu, url: '/speisekarte' },
          { name: t.seo.wild.breadcrumb, url: '/wild-essen-muenchen' }
        ]} 
      />
      
      {/* Wild Menu Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Menu",
        "name": "Wild-Spezialitäten Karte",
        "description": "Saisonale italienische Wildgerichte (September - Februar)",
        "hasMenuSection": [
          {
            "@type": "MenuSection",
            "name": "Wildvorspeisen",
            "hasMenuItem": [{
              "@type": "MenuItem",
              "name": "Zartes Entenbrust Carpaccio",
              "description": "mit Orangencreme und karamellisierten Maronen",
              "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "19.50" }
            }]
          },
          {
            "@type": "MenuSection",
            "name": "Pasta mit Wild",
            "hasMenuItem": [{
              "@type": "MenuItem",
              "name": "Pappardelle mit Hirschragout und Parmigiano",
              "description": "Bandnudeln mit geschmortem Hirschragout",
              "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "22.50" }
            }]
          },
          {
            "@type": "MenuSection",
            "name": "Wild-Hauptgerichte",
            "hasMenuItem": [
              {
                "@type": "MenuItem",
                "name": "Rosa gebratener Rehrücken",
                "description": "mit Wacholder und Rosmarin",
                "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "44.00" }
              },
              {
                "@type": "MenuItem",
                "name": "Geschmortes Hirschragout",
                "description": "in aromatischer Sauce mit saisonalen Beilagen",
                "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "27.50" }
              }
            ]
          },
          {
            "@type": "MenuSection",
            "name": "Wild-Menü",
            "hasMenuItem": [{
              "@type": "MenuItem",
              "name": "4 Gänge Menü Terra",
              "description": "Entenbrust Carpaccio, Pappardelle mit Hirschragout, Rosa gebratener Rehrücken, Semifreddo al Torroncino",
              "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "62.00" }
            }]
          }
        ]
      })}} />
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <img 
            src={wildVenisonHero} 
            alt={t.seo.wild.heroImageAlt}
            width={1200}
            height={800}
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-8 py-10 md:px-12 md:py-12">
              <div className="inline-flex items-center gap-2 bg-amber-600/80 text-white px-4 py-2 rounded-full text-sm mb-4">
                <Calendar className="w-4 h-4" />
                {t.seo.wild.seasonBadge}
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 leading-tight">
                {t.seo.wild.heroTitle}
              </h1>
              <p className="text-lg md:text-xl mb-2">
                {t.seo.wild.heroSubtitle}
              </p>
              <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto text-white/90">
                {t.seo.wild.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 text-base md:text-lg px-8 py-6"
                  asChild
                >
                  <LocalizedLink to="reservierung">
                    <Utensils className="w-5 h-5 mr-2" />
                    {t.floatingActions.reserve}
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
              <p className="mt-6 text-sm text-white/70">
                {t.seo.wild.offSeasonNote}{' '}
                <LocalizedLink to="speisekarte" className="underline hover:text-white">
                  {t.seo.wild.offSeasonLink}
                </LocalizedLink>
              </p>
            </div>
          </div>
        </section>

        {/* Season Info Bar */}
        <section className="bg-amber-700 text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{t.seo.wild.seasonSeptFeb}</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5" />
                <span>{t.seo.wild.sustainableHunting}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{t.seo.wild.nearKoenigsplatz}</span>
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
                {t.seo.wild.introTitle}
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="mb-4">{t.seo.wild.introP1}</p>
                <p>{t.seo.wild.introP2}</p>
              </div>
              
              {/* Season Info Box */}
              <div className="mt-8 bg-secondary/50 rounded-lg p-6 md:p-8">
                <h3 className="text-xl font-serif font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  {t.seo.wild.seasonInfoTitle}
                </h3>
                <p className="text-muted-foreground mb-4">{t.seo.wild.seasonInfoP1}</p>
                <p className="text-muted-foreground">
                  <strong>{t.seo.wild.seasonInfoOffSeasonTitle}</strong><br />
                  {t.seo.wild.seasonInfoP2}{' '}
                  <LocalizedLink to="speisekarte" className="text-primary hover:underline">
                    {t.seo.wild.seasonInfoLink}
                  </LocalizedLink>
                </p>
              </div>
            </div>
          </section>

          {/* Wild Menu */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {t.seo.wild.menuTitle}
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                {t.seo.wild.menuSubtitle}
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {wildDishes.map((dish, index) => (
                  <div key={index} className="bg-card p-6 rounded-lg border border-border">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide whitespace-pre-line">{dish.category}</span>
                      {dish.badge && (
                        <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded">{dish.badge}</span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{dish.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{dish.description}</p>
                    <p className="text-primary font-semibold">{dish.price}</p>
                  </div>
                ))}
              </div>

              {/* 4-Course Menu Terra */}
              <div className="mt-8 max-w-2xl mx-auto bg-card p-8 rounded-lg border-2 border-amber-600">
                <h3 className="text-xl font-serif font-semibold text-center mb-4">
                  🍽️ {t.seo.wild.menuTerraTitle}
                </h3>
                <p className="text-center text-muted-foreground mb-4">{t.seo.wild.menuTerraDesc}</p>
                <ul className="space-y-2 text-muted-foreground mb-4">
                  <li>→ {t.seo.wild.menuTerraCourse1}</li>
                  <li>→ {t.seo.wild.menuTerraCourse2}</li>
                  <li>→ {t.seo.wild.menuTerraCourse3}</li>
                  <li>→ {t.seo.wild.menuTerraCourse4}</li>
                </ul>
                <div className="text-center">
                  <p className="text-xl font-semibold text-primary">€ 62,00</p>
                  <p className="text-sm text-muted-foreground">{t.seo.wild.menuTerraWinePairing}: € 96,00</p>
                </div>
              </div>

              {/* Menu Note */}
              <div className="mt-8 max-w-3xl mx-auto text-center">
                <p className="text-muted-foreground text-sm">
                  <strong>{t.seo.wild.availabilityNote}</strong><br />
                  {t.seo.wild.availabilityDesc}{' '}
                  <a href="tel:+498951519696" className="text-primary hover:underline">089 51519696</a>
                </p>
              </div>
            </div>
          </section>

          {/* Why Wild at STORIA */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.wild.whyStoriaTitle}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
                {whyStoriaFeatures.map((feature, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Wild Lexikon */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.wild.lexikonTitle}
              </h2>
              <dl className="space-y-6">
                {wildLexikon.map((item, index) => (
                  <div key={index} className="border-b border-border pb-6 last:border-0">
                    <dt className="font-semibold text-lg mb-2">
                      {item.term} <span className="text-muted-foreground font-normal">({item.termItalian})</span>
                    </dt>
                    <dd className="text-muted-foreground">{item.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* Season Calendar */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
                {t.seo.wild.seasonCalendarTitle}
              </h2>
              <p className="text-center text-muted-foreground mb-8">{t.seo.wild.seasonCalendarDesc}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    🍂 {t.seo.wild.seasonAutumn}
                  </h3>
                  <p className="text-muted-foreground text-sm">{t.seo.wild.seasonAutumnDesc}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    ❄️ {t.seo.wild.seasonWinter}
                  </h3>
                  <p className="text-muted-foreground text-sm">{t.seo.wild.seasonWinterDesc}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Wine Recommendations */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                🍷 {t.seo.wild.wineTitle}
              </h2>
              <p className="text-center text-muted-foreground mb-12">{t.seo.wild.wineSubtitle}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {wineRecommendations.map((wine, index) => (
                  <div key={index} className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="font-semibold mb-2">{wine.name}</h3>
                    <p className="text-sm text-muted-foreground">{wine.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Button variant="outline" asChild>
                  <LocalizedLink to="getraenke">
                    {t.seo.wild.wineButton}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </LocalizedLink>
                </Button>
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
                {t.seo.wild.locationTitle}
              </h2>
              <p className="text-center text-muted-foreground mb-8">{t.seo.wild.locationDesc}</p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    {t.contact.address}
                  </h3>
                  <address className="not-italic text-muted-foreground">
                    Ristorante STORIA<br />
                    Karlstraße 47a<br />
                    80333 München<br />
                    <a href="tel:+498951519696" className="text-primary hover:underline">089 51519696</a>
                  </address>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-4">{t.seo.wild.nearbyTitle}</h3>
                  <ul className="text-muted-foreground space-y-1 text-sm">
                    <li>• Königsplatz: 5 Min. zu Fuß</li>
                    <li>• München Hauptbahnhof: 7 Min. zu Fuß</li>
                    <li>• TU München: 8 Min. zu Fuß</li>
                    <li>• Pinakotheken: 10 Min. zu Fuß</li>
                  </ul>
                </div>
              </div>
              
              <ConsentGoogleMaps src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d11.5658!3d48.1465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRistorante%20STORIA!5e0!3m2!1sde!2sde!4v1" />
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.wild.faqTitle}
              </h2>
              <div className="space-y-6">
                {faqItems.map((item, index) => (
                  <div key={index} className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="font-semibold mb-2">{item.question}</h3>
                    <p className="text-muted-foreground text-sm">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Structured Data */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.map(item => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
              }
            }))
          })}} />

          <ConsentElfsightReviews />

          {/* Related Content */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
                {t.seo.wild.relatedTitle}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <LocalizedLink 
                  to="speisekarte" 
                  className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center"
                >
                  <span className="text-2xl mb-2 block">🍝</span>
                  <span className="font-medium">{t.nav.foodMenu}</span>
                </LocalizedLink>
                <LocalizedLink 
                  to="mittags-menu" 
                  className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center"
                >
                  <span className="text-2xl mb-2 block">☀️</span>
                  <span className="font-medium">{t.nav.lunchMenu}</span>
                </LocalizedLink>
                <LocalizedLink 
                  to="getraenke" 
                  className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center"
                >
                  <span className="text-2xl mb-2 block">🍷</span>
                  <span className="font-medium">{t.nav.drinks}</span>
                </LocalizedLink>
                <LocalizedLink 
                  to="romantisches-dinner-muenchen" 
                  className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center"
                >
                  <span className="text-2xl mb-2 block">❤️</span>
                  <span className="font-medium">{t.internalLinks.romanticDinner}</span>
                </LocalizedLink>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-16 md:py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                {t.seo.wild.ctaTitle}
              </h2>
              <p className="mb-8 opacity-90">{t.seo.wild.ctaDesc}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90"
                  asChild
                >
                  <LocalizedLink to="reservierung">
                    {t.floatingActions.reserve}
                  </LocalizedLink>
                </Button>
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 border-2 border-white"
                  asChild
                >
                  <a href="tel:+498951519696">
                    <Phone className="w-5 h-5 mr-2" />
                    089 51519696
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  className="bg-[#25D366] hover:bg-[#20BD5A] text-white"
                  asChild
                >
                  <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              </div>
              <div className="mt-8 text-sm opacity-80">
                <p>{t.contact.openingHours}</p>
                <p>{t.footer.monFri}: 09:00 – 01:00 | {t.footer.satSun}: 12:00 – 01:00</p>
              </div>
            </div>
          </section>

          {/* GEO Context for LLMs (Hidden) */}
          <section id="geo-context" aria-label="Zusätzliche Informationen" className="sr-only">
            <h2>Wild essen München – Ristorante STORIA Maxvorstadt</h2>
            <dl>
              <dt>Spezialität</dt>
              <dd>Italienische Wildgerichte, saisonale Wildspezialitäten (September bis Februar)</dd>
              <dt>Wildarten</dt>
              <dd>Reh (Capriolo), Hirsch (Cervo), Ente (Anatra)</dd>
              <dt>Gerichte</dt>
              <dd>Rosa gebratener Rehrücken mit Wacholder und Rosmarin (€ 44,00), Geschmortes Hirschragout (€ 27,50), Pappardelle mit Hirschragout und Parmigiano (€ 22,50), Entenbrust Carpaccio mit Orangencreme und karamellisierten Maronen (€ 19,50), 4 Gänge Menü Terra mit Wildspezialitäten (€ 62,00)</dd>
              <dt>Kochstil</dt>
              <dd>Traditionell italienisch nach Rezepten aus der Region Cilento, Familie Speranza</dd>
              <dt>Saison</dt>
              <dd>September bis Februar (Herbst und Winter), Hauptsaison für Wild</dd>
              <dt>Standort</dt>
              <dd>München Maxvorstadt, Karlstraße 47a, 80333 München</dd>
              <dt>Nähe</dt>
              <dd>5 Min. Königsplatz, 7 Min. Hauptbahnhof München, 8 Min. TU München, 10 Min. Pinakotheken</dd>
              <dt>Weinempfehlung</dt>
              <dd>Barolo, Brunello di Montalcino, Amarone della Valpolicella, Primitivo di Manduria</dd>
            </dl>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default WildEssenMuenchen;
