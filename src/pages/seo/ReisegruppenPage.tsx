import LocalizedLink from "@/components/LocalizedLink";
import { Link } from "react-router-dom";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import GoogleReviews from "@/components/GoogleReviews";
import ConsentGoogleMaps from "@/components/ConsentGoogleMaps";
import ReservationCTA from "@/components/ReservationCTA";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { useGroupMenus, getLocalizedText, getLocalizedArray } from "@/hooks/useGroupMenus";
import type { GroupMenu } from "@/hooks/useGroupMenus";
import {
  MapPin,
  Clock,
  Users,
  UtensilsCrossed,
  Award,
  CreditCard,
  Landmark,
  Building2,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

// Images
import storiaLogo from "@/assets/storia-logo.webp";
import groupHero from "@/assets/firmenfeier-eventlocation-storia-muenchen.webp";

const ReisegruppenPage = () => {
  const { t, language } = useLanguage();
  usePrerenderReady(true);

  const rg = t.reisegruppen;
  const { menus, settings } = useGroupMenus();

  // SSG fallback: hardcoded translations used when Supabase data is unavailable
  const fallbackMenus: GroupMenu[] = [
    {
      id: "fallback-A", menu_key: "A",
      title: { de: rg.menuATitle, en: rg.menuATitle, it: rg.menuATitle, fr: rg.menuATitle },
      subtitle: { de: rg.menuASubtitle, en: rg.menuASubtitle, it: rg.menuASubtitle, fr: rg.menuASubtitle },
      badge: null,
      items: { de: rg.menuAItems, en: rg.menuAItems, it: rg.menuAItems, fr: rg.menuAItems },
      duration: { de: rg.menuADuration, en: rg.menuADuration, it: rg.menuADuration, fr: rg.menuADuration },
      price_label: { de: rg.menuAPrice, en: rg.menuAPrice, it: rg.menuAPrice, fr: rg.menuAPrice },
      price_note: { de: rg.menuAPriceNote, en: rg.menuAPriceNote, it: rg.menuAPriceNote, fr: rg.menuAPriceNote },
      price_amount: 25, sort_order: 0, is_active: true, created_at: "", updated_at: "",
    },
    {
      id: "fallback-B", menu_key: "B",
      title: { de: rg.menuBTitle, en: rg.menuBTitle, it: rg.menuBTitle, fr: rg.menuBTitle },
      subtitle: { de: rg.menuBSubtitle, en: rg.menuBSubtitle, it: rg.menuBSubtitle, fr: rg.menuBSubtitle },
      badge: { de: rg.menuBBadge, en: rg.menuBBadge, it: rg.menuBBadge, fr: rg.menuBBadge },
      items: { de: rg.menuBItems, en: rg.menuBItems, it: rg.menuBItems, fr: rg.menuBItems },
      duration: { de: rg.menuBDuration, en: rg.menuBDuration, it: rg.menuBDuration, fr: rg.menuBDuration },
      price_label: { de: rg.menuBPrice, en: rg.menuBPrice, it: rg.menuBPrice, fr: rg.menuBPrice },
      price_note: { de: rg.menuBPriceNote, en: rg.menuBPriceNote, it: rg.menuBPriceNote, fr: rg.menuBPriceNote },
      price_amount: 35, sort_order: 1, is_active: true, created_at: "", updated_at: "",
    },
    {
      id: "fallback-C", menu_key: "C",
      title: { de: rg.menuCTitle, en: rg.menuCTitle, it: rg.menuCTitle, fr: rg.menuCTitle },
      subtitle: { de: rg.menuCSubtitle, en: rg.menuCSubtitle, it: rg.menuCSubtitle, fr: rg.menuCSubtitle },
      badge: null,
      items: { de: rg.menuCItems, en: rg.menuCItems, it: rg.menuCItems, fr: rg.menuCItems },
      duration: { de: rg.menuCDuration, en: rg.menuCDuration, it: rg.menuCDuration, fr: rg.menuCDuration },
      price_label: { de: rg.menuCPrice, en: rg.menuCPrice, it: rg.menuCPrice, fr: rg.menuCPrice },
      price_note: { de: rg.menuCPriceNote, en: rg.menuCPriceNote, it: rg.menuCPriceNote, fr: rg.menuCPriceNote },
      price_amount: 49, sort_order: 2, is_active: true, created_at: "", updated_at: "",
    },
  ];

  const displayMenus = menus.length > 0 ? menus : fallbackMenus;
  const menuNote = settings["general_note"]
    ? getLocalizedText(settings["general_note"] as Record<string, string>, language)
    : rg.menuNote;

  const advantages = [
    { icon: MapPin, title: rg.adv1Title, desc: rg.adv1Desc },
    { icon: Users, title: rg.adv2Title, desc: rg.adv2Desc },
    { icon: UtensilsCrossed, title: rg.adv3Title, desc: rg.adv3Desc },
    { icon: Award, title: rg.adv4Title, desc: rg.adv4Desc },
    { icon: Clock, title: rg.adv5Title, desc: rg.adv5Desc },
    { icon: CreditCard, title: rg.adv6Title, desc: rg.adv6Desc },
  ];

  const attractions = [
    { icon: Building2, title: rg.attr1Title, distance: rg.attr1Distance },
    { icon: Landmark, title: rg.attr2Title, distance: rg.attr2Distance },
    { icon: Building2, title: rg.attr3Title, distance: rg.attr3Distance },
    { icon: Building2, title: rg.attr4Title, distance: rg.attr4Distance },
    { icon: Building2, title: rg.attr5Title, distance: rg.attr5Distance },
    { icon: Landmark, title: rg.attr6Title, distance: rg.attr6Distance },
    { icon: Landmark, title: rg.attr7Title, distance: rg.attr7Distance },
    { icon: MapPin, title: rg.attr8Title, distance: rg.attr8Distance },
    { icon: Building2, title: rg.attr9Title, distance: rg.attr9Distance },
  ];

  const steps = [
    { num: "1", title: rg.step1Title, desc: rg.step1Desc },
    { num: "2", title: rg.step2Title, desc: rg.step2Desc },
    { num: "3", title: rg.step3Title, desc: rg.step3Desc },
    { num: "4", title: rg.step4Title, desc: rg.step4Desc },
  ];

  const faqItems = [
    { q: rg.faq1Question, a: rg.faq1Answer },
    { q: rg.faq2Question, a: rg.faq2Answer },
    { q: rg.faq3Question, a: rg.faq3Answer },
    { q: rg.faq4Question, a: rg.faq4Answer },
    { q: rg.faq5Question, a: rg.faq5Answer },
    { q: rg.faq6Question, a: rg.faq6Answer },
    { q: rg.faq7Question, a: rg.faq7Answer },
    { q: rg.faq8Question, a: rg.faq8Answer },
    { q: rg.faq9Question, a: rg.faq9Answer },
    { q: rg.faq10Question, a: rg.faq10Answer },
  ];

  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Ristorante STORIA",
    url: "https://www.ristorantestoria.de/reisegruppen/",
    description:
      "Italienisches Restaurant für Reisegruppen in München Maxvorstadt. Bis 100 Sitzplätze, Gruppenmenüs ab 25 € pro Person, 5 Minuten vom Hauptbahnhof.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Karlstraße 47a",
      addressLocality: "München",
      addressRegion: "Bayern",
      postalCode: "80333",
      addressCountry: "DE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 48.1448,
      longitude: 11.563,
    },
    telephone: "+498951519696",
    email: "info@ristorantestoria.de",
    servesCuisine: ["Italienisch", "Neapolitanisch", "Pizza", "Pasta"],
    priceRange: "€€-€€€",
    founder: { "@type": "Person", name: "Domenico Speranza" },
    foundingDate: "2015",
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Gruppenessen bis 100 Personen",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Überdachte Terrasse (100 Plätze)",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Barrierefreier Zugang",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Rollstuhlgerechte Toilette",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Kinderstühle",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Kostenloses WLAN",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Busparkplatz in der Nähe (ZOB, 750 m)",
        value: true,
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "01:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "12:00",
        closes: "01:00",
      },
    ],
    makesOffer: displayMenus.map((menu) => ({
      "@type": "Offer",
      name: getLocalizedText(menu.title, "de"),
      description: [
        ...getLocalizedArray(menu.items, "de"),
        getLocalizedText(menu.duration, "de"),
      ].filter(Boolean).join(". "),
      price: String(menu.price_amount),
      priceCurrency: "EUR",
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.ristorantestoria.de/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: rg.breadcrumb,
        item: "https://www.ristorantestoria.de/reisegruppen/",
      },
    ],
  };

  return (
    <>
      <SEO
        title={rg.seoTitle}
        description={rg.seoDescription}
        canonical="/reisegruppen"
        hreflangUrls={{
          de: "https://www.ristorantestoria.de/reisegruppen/",
          en: "https://www.ristorantestoria.de/en/group-dining/",
          it: "https://www.ristorantestoria.de/it/ristorazione-gruppi-monaco/",
          fr: "https://www.ristorantestoria.de/fr/restauration-groupes-munich/",
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        {/* SECTION 1: Hero */}
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <img
            src={groupHero}
            alt="Gedeckter Tisch für Reisegruppe im Ristorante STORIA München"
            width={1200}
            height={800}
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <Link to="/">
              <img
                src={storiaLogo}
                alt="STORIA Logo"
                loading="eager"
                className="h-20 md:h-28 w-auto mx-auto mb-6 brightness-0 invert hover:opacity-80 transition-opacity"
              />
            </Link>
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-8 py-10 md:px-12 md:py-12">
              <p className="text-sm md:text-base mb-3 tracking-[0.3em] uppercase">
                {rg.heroTagline}
              </p>
              <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 leading-tight">
                {rg.heroTitle}
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                {rg.heroSubline}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  asChild
                >
                  <a href={`mailto:info@ristorantestoria.de?subject=${encodeURIComponent(rg.emailSubject)}`}>
                    {rg.heroCta1}
                  </a>
                </Button>
                <Button size="lg" variant="outlineWhite" asChild>
                  <a href="#gruppenmenus">{rg.heroCta2}</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Location Badge */}
        <section className="bg-primary text-primary-foreground py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{rg.badge1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{rg.badge2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>{rg.badge3}</span>
              </div>
            </div>
          </div>
        </section>

        <Navigation />

        <main className="flex-grow">

          {/* SECTION 2: Einleitungstext */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <BreadcrumbNav
                crumbs={[
                  { label: t.breadcrumb.home, href: "/" },
                  { label: rg.breadcrumb },
                ]}
              />
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-6">
                {rg.introTitle}
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-8">
                {rg.introP1}
              </p>
              <p className="text-muted-foreground text-center mb-8">
                {rg.introP2}
              </p>
              <p className="text-muted-foreground text-center mb-8">
                {rg.introP3}
              </p>
              <div className="text-center">
                <LocalizedLink
                  to="ueber-uns"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  {rg.introPillarLink}
                  <ArrowRight className="w-4 h-4" />
                </LocalizedLink>
              </div>
            </div>
          </section>

          {/* SECTION 3: Vorteile für Reiseveranstalter */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {rg.advTitle}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {advantages.map((adv, index) => {
                  const AdvIcon = adv.icon;
                  return (
                    <div
                      key={index}
                      className="bg-card p-6 rounded-lg border border-border"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <AdvIcon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{adv.title}</h3>
                      <p className="text-sm text-muted-foreground">{adv.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* SECTION 4: Gruppenmenüs */}
          <section id="gruppenmenus" className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-5xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {rg.menuTitle}
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                {rg.menuIntro}
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                {displayMenus.map((menu) => {
                  const badgeText = menu.badge
                    ? getLocalizedText(menu.badge, language)
                    : null;
                  const isFeatured = !!badgeText;
                  const items = getLocalizedArray(menu.items, language);
                  return (
                    <div
                      key={menu.id}
                      className={`bg-card ${isFeatured ? "border-2 border-primary" : "border border-border"} rounded-2xl overflow-hidden flex flex-col relative`}
                    >
                      {isFeatured && (
                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                          {badgeText}
                        </div>
                      )}
                      <div className={`${isFeatured ? "bg-primary/15" : "bg-primary/10"} px-6 py-5 border-b ${isFeatured ? "border-primary/20" : "border-border"}`}>
                        <p className="text-xs uppercase tracking-widest text-primary font-medium mb-1">
                          {`Menü ${menu.menu_key}`}
                        </p>
                        <h3 className="text-xl font-serif font-bold">
                          {getLocalizedText(menu.title, language)}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {getLocalizedText(menu.subtitle, language)}
                        </p>
                      </div>
                      <div className="px-6 py-5 flex-grow">
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs text-muted-foreground mt-4">
                          {getLocalizedText(menu.duration, language)}
                        </p>
                      </div>
                      <div className={`px-6 py-4 border-t ${isFeatured ? "border-primary/20 bg-primary/5" : "border-border bg-secondary/20"}`}>
                        <p className="text-2xl font-bold text-primary">
                          {getLocalizedText(menu.price_label, language)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getLocalizedText(menu.price_note, language)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hinweisblock */}
              <div className="mt-10 bg-secondary/30 border border-border rounded-xl p-6 max-w-3xl mx-auto">
                <p className="text-sm text-muted-foreground whitespace-pre-line">{menuNote}</p>
              </div>
            </div>
          </section>

          {/* SECTION 5: Sehenswürdigkeiten */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {rg.attrTitle}
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                {rg.attrSubtitle}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {attractions.map((attr, index) => {
                  const AttrIcon = attr.icon;
                  return (
                    <div
                      key={index}
                      className="bg-card p-6 rounded-lg border border-border text-center"
                    >
                      <AttrIcon className="w-8 h-8 text-primary mx-auto mb-3" />
                      <h3 className="font-semibold mb-1">{attr.title}</h3>
                      <p className="text-sm text-muted-foreground">{attr.distance}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* SECTION 6: Anfahrt & Logistik */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
                {rg.locationTitle}
              </h2>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-4">{rg.addressTitle}</h3>
                  <p className="text-muted-foreground mb-4">
                    Ristorante STORIA
                    <br />
                    Karlstraße 47a
                    <br />
                    80333 München
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {rg.transitItems.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-4">{rg.busTitle}</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {rg.busText}
                  </p>
                </div>
              </div>
              <ConsentGoogleMaps src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d11.5658!3d48.1465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKarlstra%C3%9Fe%2047a%2C%2080333%20M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1" />
            </div>
          </section>

          {/* SECTION 7: Ablauf Gruppenbuchung */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {rg.processTitle}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {steps.map((step) => (
                  <div key={step.num} className="bg-card p-6 rounded-lg border border-border text-center">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary-foreground font-bold text-lg">{step.num}</span>
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 8: FAQ */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
                {rg.faqTitle}
              </h2>
              <Accordion
                type="multiple"
                defaultValue={faqItems.map((_, i) => `faq-${i}`)}
                className="space-y-4"
              >
                {faqItems.map((item, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`faq-${idx}`}
                    className="bg-card border border-border rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-left font-medium">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent
                      forceMount
                      className="text-muted-foreground data-[state=closed]:hidden"
                    >
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          {/* SECTION 9: Google Reviews */}
          <GoogleReviews />

          {/* SECTION 10: CTA Kontakt */}
          <section className="py-16 md:py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                {rg.ctaTitle}
              </h2>
              <p className="text-lg mb-4 opacity-90 max-w-2xl mx-auto">
                {rg.ctaIntro}
              </p>
              <p className="text-sm opacity-80 mb-8 max-w-2xl mx-auto">
                {rg.ctaHint}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <a href={`mailto:info@ristorantestoria.de?subject=${encodeURIComponent(rg.emailSubject)}`}>
                    {rg.ctaEmail}
                  </a>
                </Button>
                <Button size="lg" variant="outlineWhite" asChild>
                  <a href="tel:+498951519696">{rg.ctaPhone}</a>
                </Button>
                <Button size="lg" variant="outlineWhite" asChild>
                  <a
                    href="https://wa.me/491636033912"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {rg.ctaWhatsapp}
                  </a>
                </Button>
              </div>
            </div>
          </section>

          {/* SECTION 11: Crosslinks */}
          <section className="py-12 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-serif font-semibold text-center mb-8">
                {t.internalLinks.title}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <LocalizedLink
                  to="neapolitanische-pizza-muenchen"
                  className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center"
                >
                  <span className="text-2xl mb-2 block">🍕</span>
                  <span className="font-medium">{t.internalLinks.neapolitanPizza}</span>
                </LocalizedLink>
                <LocalizedLink
                  to="italiener-koenigsplatz"
                  className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center"
                >
                  <span className="text-2xl mb-2 block">🏛️</span>
                  <span className="font-medium">{t.internalLinks.italienerKoenigsplatz}</span>
                </LocalizedLink>
                <LocalizedLink
                  to="terrasse-muenchen"
                  className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center"
                >
                  <span className="text-2xl mb-2 block">☀️</span>
                  <span className="font-medium">{t.internalLinks.terraceMunich}</span>
                </LocalizedLink>
                <LocalizedLink
                  to="aperitivo-muenchen"
                  className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center"
                >
                  <span className="text-2xl mb-2 block">🥂</span>
                  <span className="font-medium">{t.internalLinks.aperitivoMunich}</span>
                </LocalizedLink>
                <LocalizedLink
                  to="firmenfeier-muenchen"
                  className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center"
                >
                  <span className="text-2xl mb-2 block">🎉</span>
                  <span className="font-medium">{t.internalLinks.corporateEvent}</span>
                </LocalizedLink>
                <LocalizedLink
                  to="faq"
                  className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors text-center"
                >
                  <span className="text-2xl mb-2 block">❓</span>
                  <span className="font-medium">{t.internalLinks.faqLink}</span>
                </LocalizedLink>
              </div>
            </div>
          </section>

          {/* SECTION 12: ReservationCTA */}
          <ReservationCTA />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ReisegruppenPage;
