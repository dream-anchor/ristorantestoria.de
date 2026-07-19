import { useEffect, useRef, useState, type ReactNode } from "react";
import EmailLink, { EmailAddress } from "@/components/EmailLink";
import { PhoneText } from "@/lib/linkifyPhone";
import { Phone, Mail, MapPin, MessageCircle, Instagram, ArrowUpRight } from "lucide-react";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import ReservationBooking from "@/components/ReservationBooking";
import ConsentGoogleMaps from "@/components/ConsentGoogleMaps";
import LocalizedLink from "@/components/LocalizedLink";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { useSpecialMenuBySlug, useMenuContent } from "@/hooks/useSpecialMenus";
import heroImage from "@/assets/italiener-koenigsplatz-terrasse-storia-muenchen.webp";
import heroImage600 from "@/assets/italiener-koenigsplatz-terrasse-storia-muenchen-600w.webp";
import heroImage900 from "@/assets/italiener-koenigsplatz-terrasse-storia-muenchen-900w.webp";
import { Helmet } from "react-helmet-async";

// Responsive Hero-Quellen: Mobil (DPR2 ≈ 780px) lädt die 900er (~56 KB) statt der
// 1400er Vollversion (~121 KB) → kleineres LCP-Bild, schnelleres Laden.
const heroSrcSet = `${heroImage600} 600w, ${heroImage900} 900w, ${heroImage} 1400w`;

/** Extrahiert den ersten €-Betrag als Zahl (z. B. "ca. € 24,90" → "24.90"), sonst null. */
const parsePrice = (s: string): string | null => {
  const m = (s || "").replace(/\./g, "").match(/(\d+(?:,\d{1,2})?)/);
  return m ? m[1].replace(",", ".") : null;
};

/** GA4 Conversion-Event. */
const fireLead = (formName: string) => {
  if (typeof window !== "undefined" && typeof (window as Window & { gtag?: (...a: unknown[]) => void }).gtag === "function") {
    (window as Window & { gtag: (...a: unknown[]) => void }).gtag("event", "generate_lead", {
      form_name: formName, page_path: window.location.pathname, value: 80, currency: "EUR",
    });
  }
};

/** Scroll-Reveal — SSR-safe (Inhalt immer im DOM). */
const Reveal = ({ children, delay = 0, as: Tag = "div", className = "" }: {
  children: ReactNode; delay?: number; as?: keyof JSX.IntrinsicElements; className?: string;
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setVisible(true); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Component = Tag as any;
  return <Component ref={ref as any} className={`okt-reveal ${visible ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}s` }}>{children}</Component>;
};

/** Blau-weiß-goldene Wimpelkette (SVG, deterministisch). */
const Bunting = ({ h = 64 }: { h?: number }) => {
  const W = 1440, N = 24, sp = W / N, topY = 6, sag = 26, pw = sp * 0.82, ph = 30;
  const yAt = (x: number) => topY + sag * Math.sin(Math.PI * (x / W));
  const cols = ["#1b6bb0", "#ffffff", "#dca62b", "#ffffff"];
  const pts: string[] = [];
  for (let x = 0; x <= W; x += 8) pts.push(`${x},${yAt(x).toFixed(1)}`);
  const pennants = [];
  for (let i = 0; i < N; i++) {
    const x = i * sp + sp * 0.09;
    const y = yAt(x + pw / 2);
    const c = cols[i % cols.length];
    const stroke = c === "#ffffff" ? "#ccd6e0" : "none";
    pennants.push(<polygon key={i} points={`${x},${y} ${x + pw},${y} ${x + pw / 2},${y + ph}`} fill={c} stroke={stroke} strokeWidth="0.6" />);
  }
  return (
    <svg className="okt-bunting-svg" width={W} height={h} viewBox={`0 0 ${W} 72`} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d={`M ${pts.join(" L ")}`} fill="none" stroke="#3a2a18" strokeWidth="2" opacity="0.8" />
      {pennants}
    </svg>
  );
};

/** Lebkuchenherz-Badge mit Zuckerschrift. */
const Herz = ({ label }: { label: string }) => (
  <div className="okt-herz">
    <svg width="128" height="120" viewBox="0 0 128 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M64 112 C 20 78, 6 48, 22 28 C 34 12, 56 14, 64 32 C 72 14, 94 12, 106 28 C 122 48, 108 78, 64 112 Z" fill="#a8451f" />
      <path d="M64 112 C 20 78, 6 48, 22 28 C 34 12, 56 14, 64 32 C 72 14, 94 12, 106 28 C 122 48, 108 78, 64 112 Z" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="2 6" strokeLinecap="round" transform="scale(0.9) translate(7,6)" />
    </svg>
    <span className="okt-herz-lbl">{label}</span>
  </div>
);

const OktoberfestMuenchen = () => {
  const { t, language } = useLanguage();
  usePrerenderReady(true);
  const o = t.seo.oktoberfest;
  // Editierbarer Menü-Teil: DB-Sondermenü (Admin „Besondere Anlässe", Slug oktoberfest-menue)
  const { data: liveMenu } = useSpecialMenuBySlug("oktoberfest-menue");
  const { data: menuContent } = useMenuContent(liveMenu?.id);
  const pickL = (obj: any, field: string) =>
    obj ? ((language === "de" ? obj[field] : obj[`${field}_${language}`]) || obj[field] || "") : "";
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const conceptCards = [
    { icon: "👥", title: o.conceptGruppenTitle, desc: o.conceptGruppenDesc },
    { icon: "🍻", title: o.conceptMittagTitle, desc: o.conceptMittagDesc },
    { icon: "🌆", title: o.conceptAbendTitle, desc: o.conceptAbendDesc },
    { icon: "🤝", title: o.conceptBavareseTitle, desc: o.conceptBavareseDesc },
  ];
  const biere = [
    { name: o.beerMassName, desc: o.beerMassDesc, price: "€ 12,90", badge: o.badgeFass, kind: "fass" },
    { name: o.beerRadlerName, desc: o.beerRadlerDesc, price: "€ 12,90" },
    { name: o.beerRussName, desc: o.beerRussDesc, price: "€ 12,90" },
    { name: o.beerAlkoholfreiName, desc: o.beerAlkoholfreiDesc, price: "€ 6,90" },
  ];
  const aperitivi = [
    { name: o.spritzBavareseName, desc: o.spritzBavareseDesc, price: "€ 9,90", badge: o.badgeHaus, kind: "ita" },
    { name: o.spritzAperolName, desc: o.spritzAperolDesc, price: "€ 9,90" },
    { name: o.spritzHugoName, desc: o.spritzHugoDesc, price: "€ 9,90" },
  ];
  const brotzeit = [
    { name: o.brettBavareseName, desc: o.brettBavareseDesc, price: "ca. € 24,90", badge: o.badgeBestseller, kind: "bay" },
    { name: o.brettMuenchenName, desc: o.brettMuenchenDesc, price: "ca. € 19,90" },
    { name: o.brettItaliaName, desc: o.brettItaliaDesc, price: "ca. € 19,90" },
    { name: o.breznName, desc: o.breznDesc, price: "€ 4,50" },
    { name: o.obatzdaName, desc: o.obatzdaDesc, price: "€ 8,90" },
    { name: o.weisswurstName, desc: o.weisswurstDesc, price: "€ 8,90" },
  ];
  const pizzen = [
    { name: o.pizzaBratwurstName, desc: o.pizzaBratwurstDesc, price: "ca. € 15,90", badge: o.badgeBayerisch, kind: "bay" },
    { name: o.pizzaSpanferkelName, desc: o.pizzaSpanferkelDesc, price: "ca. € 16,90", badge: o.badgeBayerisch, kind: "bay" },
    { name: o.pizzaSalamiName, desc: o.pizzaSalamiDesc, price: "ca. € 14,90", badge: o.badgeItalienisch, kind: "ita" },
    { name: o.pizzaObatzdaName, desc: o.pizzaObatzdaDesc, price: "ca. € 14,90", badge: o.badgeItalienisch, kind: "ita" },
  ];
  const braten = [
    { name: o.schweinsbratenName, desc: o.schweinsbratenDesc, price: "ca. € 19,90" },
    { name: o.rinderbratenName, desc: o.rinderbratenDesc, price: "ca. € 22,90" },
    { name: o.vegetarischName, desc: o.vegetarischDesc, price: "ca. € 16,90" },
  ];
  const whyFeatures = [
    { icon: "🍺", title: o.featureHolzfassTitle, desc: o.featureHolzfassDesc },
    { icon: "🌥️", title: o.featureTerraceTitle, desc: o.featureTerraceDesc },
    { icon: "🎶", title: o.featureMusikTitle, desc: o.featureMusikDesc },
    { icon: "🥨", title: o.featureDekoTitle, desc: o.featureDekoDesc },
    { icon: "🇮🇹", title: o.featureBavareseTitle, desc: o.featureBavareseDesc },
    { icon: "📍", title: o.featureLocationTitle, desc: o.featureLocationDesc },
  ];
  const occasions = [
    { icon: "👥", title: o.occasionGruppenName, desc: o.occasionGruppenDesc },
    { icon: "🏢", title: o.occasionFirmaName, desc: o.occasionFirmaDesc },
    { icon: "🚌", title: o.occasionReiseName, desc: o.occasionReiseDesc },
    { icon: "🎉", title: o.occasionFeiernName, desc: o.occasionFeiernDesc },
    { icon: "🍻", title: o.occasionVorgluehenName, desc: o.occasionVorgluehenDesc },
    { icon: "👨‍👩‍👧", title: o.occasionFamilieName, desc: o.occasionFamilieDesc },
  ];
  const pakete = [
    { name: o.paketBrotzeitName, desc: o.paketBrotzeitDesc, price: o.paketBrotzeitPrice },
    { name: o.paketBavareseName, desc: o.paketBavareseDesc, price: o.paketBavarasePrice },
    { name: o.paketFirmaName, desc: o.paketFirmaDesc, price: o.paketFirmaPrice },
  ];

  // Menü-Sektionen: aus DB-Sondermenü (im Admin editierbar) – sonst der aktuelle Inhalt als Fallback
  const menuSections = (menuContent?.categories?.length)
    ? menuContent.categories.map((c: any) => ({
        title: pickL(c, "name"),
        subtitle: pickL(c, "description"),
        items: (c.items || []).map((it: any) => ({ name: pickL(it, "name"), desc: pickL(it, "description"), price: pickL(it, "price_display") })),
      }))
    : [
        { title: o.categoryBeer, subtitle: o.beerSubtitle, items: biere.map((d) => ({ name: d.name, desc: d.desc, price: d.price })) },
        { title: o.categoryAperitivo, subtitle: "", items: aperitivi.map((d) => ({ name: d.name, desc: d.desc, price: d.price })) },
        { title: o.brotzeitTitle, subtitle: o.brotzeitSubtitle, items: brotzeit.map((d) => ({ name: d.name, desc: d.desc, price: d.price })) },
        { title: o.pizzaTitle, subtitle: o.pizzaSubtitle, items: pizzen.map((d) => ({ name: d.name, desc: d.desc, price: d.price })) },
        { title: o.bratenTitle, subtitle: o.bratenSubtitle, items: braten.map((d) => ({ name: d.name, desc: d.desc, price: d.price })) },
        { title: o.paketeTitle, subtitle: o.paketeSubtitle, items: pakete.map((p) => ({ name: p.name, desc: p.desc, price: p.price })) },
      ];
  const hotels = [
    { name: "ibis München City", time: o.hotelIbisTime, note: o.hotelIbisNote },
    { name: "Ruby Lilly Hotel", time: o.hotelLillyTime, note: o.hotelLillyNote },
    { name: "Augusten Hotel", time: o.hotelAugustenTime, note: o.hotelAugustenNote },
    { name: "25hours The Royal Bavarian", time: o.hotel25hTime, note: o.hotel25hNote },
    { name: "Koenigshof – Luxury Collection", time: o.hotelKoenigshofTime, note: o.hotelKoenigshofNote },
    { name: "Ruby Rosi Hotel", time: o.hotelRosiTime, note: o.hotelRosiNote },
    { name: "Eurostars Grand Central", time: o.hotelEurostarsTime, note: o.hotelEurostarsNote },
  ];
  const wiesnRoute = [
    { icon: "🚶", title: o.wiesnRouteFussTitle, desc: o.wiesnRouteFussDesc },
    { icon: "🚇", title: o.wiesnRouteUbahnTitle, desc: o.wiesnRouteUbahnDesc },
    { icon: "🚕", title: o.wiesnRouteTaxiTitle, desc: o.wiesnRouteTaxiDesc },
  ];
  const faqItems = [
    { q: o.faq1Question, a: o.faq1Answer }, { q: o.faq2Question, a: o.faq2Answer },
    { q: o.faq3Question, a: o.faq3Answer }, { q: o.faq4Question, a: o.faq4Answer },
    { q: o.faq5Question, a: o.faq5Answer }, { q: o.faq6Question, a: o.faq6Answer },
    { q: o.faq7Question, a: o.faq7Answer }, { q: o.faq8Question, a: o.faq8Answer },
  ];

  const Card = ({ name, desc, price, badge, kind }: { name: string; desc: string; price: string; badge?: string; kind?: string }) => (
    <div className="okt-card">
      <div className="okt-gingham" />
      <div className="okt-card-b">
        <div className="okt-card-head">
          <h3>{name}</h3>
          {badge && <span className={`okt-tag${kind ? ` okt-tag-${kind}` : ""}`}>{badge}</span>}
        </div>
        <p>{desc}</p>
        <span className="okt-price">{price}</span>
      </div>
    </div>
  );

  const CtaRow = () => (
    <Reveal className="okt-actions okt-actions-center">
      <a href="#reservieren" className="okt-btn okt-btn-p" onClick={() => fireLead("oktoberfest_reservierung")}>{o.reserveButton}</a>
      <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer" className="okt-btn okt-btn-g" onClick={() => fireLead("oktoberfest_whatsapp")}><MessageCircle size={18} /> WhatsApp</a>
    </Reveal>
  );

  const SecHead = ({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) => (
    <Reveal className="okt-sec-head">
      <span className="okt-eyebrow">{eyebrow}</span>
      <h2 className="okt-h2">{title}</h2>
      {lead && <p className="okt-lead">{lead}</p>}
    </Reveal>
  );

  return (
    <>
      <SEO title={o.seoTitle} description={o.seoDescription} canonical="/oktoberfest-muenchen" />
      {/* Hero (LCP-Element) vorladen: startet den Download parallel zum CSS,
          statt erst nach dessen Parsing → schnelleres LCP. Responsive über
          imageSrcSet/imageSizes, damit derselbe Kandidat wie im <img> geladen wird. */}
      <Helmet>
        {/* Attribute bewusst klein geschrieben: Helmet reicht sie 1:1 durch, und
            der Browser erkennt nur das HTML-Attribut `imagesrcset`/`imagesizes`
            (camelCase würde ignoriert → responsive Preload liefe ins Leere). */}
        <link
          {...({
            rel: "preload",
            as: "image",
            href: heroImage900,
            imagesrcset: heroSrcSet,
            imagesizes: "100vw",
            fetchpriority: "high",
          } as Record<string, string>)}
        />
      </Helmet>
      <StructuredData type="restaurant" />
      <StructuredData type="breadcrumb" breadcrumbs={[
        { name: "Home", url: "/" },
        { name: o.breadcrumbParent, url: "/besondere-anlaesse" },
        { name: o.breadcrumb, url: "/oktoberfest-muenchen" },
      ]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Event",
        "name": "Oktoberfest im STORIA München – Bavarese",
        "startDate": "2026-09-19", "endDate": "2026-10-04",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "image": "https://www.ristorantestoria.de/assets/italiener-koenigsplatz-terrasse-storia-muenchen.webp",
        "description": o.seoDescription,
        "location": { "@type": "Place", "name": "Ristorante STORIA", "address": { "@type": "PostalAddress", "streetAddress": "Karlstraße 47a", "addressLocality": "München", "addressRegion": "Bayern", "postalCode": "80333", "addressCountry": "DE" } },
        "organizer": { "@type": "Organization", "name": "Ristorante STORIA", "url": "https://www.ristorantestoria.de/" },
        "offers": { "@type": "Offer", "url": "https://www.ristorantestoria.de/oktoberfest-muenchen/", "availability": "https://schema.org/InStock", "price": "0", "priceCurrency": "EUR" },
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": faqItems.map((i) => ({ "@type": "Question", "name": i.q, "acceptedAnswer": { "@type": "Answer", "text": i.a } })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Menu",
        "name": language === "de" ? "Oktoberfest – Speisen & Getränke" : "Oktoberfest – Food & Drinks",
        "inLanguage": language,
        "provider": { "@type": "Restaurant", "name": "Ristorante STORIA", "url": "https://www.ristorantestoria.de/" },
        "hasMenuSection": menuSections.map((sec) => ({
          "@type": "MenuSection", "name": sec.title,
          ...(sec.subtitle ? { "description": sec.subtitle } : {}),
          "hasMenuItem": sec.items.map((it) => {
            const num = parsePrice(it.price);
            return {
              "@type": "MenuItem", "name": it.name,
              ...(it.desc ? { "description": it.desc } : {}),
              ...(num != null ? { "offers": { "@type": "Offer", "price": num, "priceCurrency": "EUR" } } : {}),
            };
          }),
        })),
      }) }} />

      {/* dangerouslySetInnerHTML statt {children}: sonst escaped der SSR-Renderer
          die Quotes im CSS (' → &#x27;), was im <style>-Rawtext einen
          Hydration-Mismatch (#425/#422) auslöst. */}
      <style dangerouslySetInnerHTML={{ __html: oktStyles }} />

      <div className="okt-page">
        {/* NAV */}
        <nav className={`okt-nav ${scrolled ? "scrolled" : ""}`}>
          <LocalizedLink to="home" className="okt-brand" aria-label="STORIA">STORIA<span>.</span></LocalizedLink>
          <div className="okt-nav-right">
            <a href="tel:+498951519696" className="okt-nav-icon" aria-label="Anrufen" title="+49 89 51519696"><Phone size={16} /></a>
            <EmailLink className="okt-nav-icon" aria-label="E-Mail" title="info@ristorantestoria.de"><Mail size={16} /></EmailLink>
            <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer" className="okt-nav-icon okt-nav-wa" aria-label="WhatsApp" title="WhatsApp" onClick={() => fireLead("oktoberfest_whatsapp")}><MessageCircle size={16} /></a>
            <a href="https://www.instagram.com/ristorante_storia/" target="_blank" rel="noopener noreferrer" className="okt-nav-icon" aria-label="Instagram" title="Instagram"><Instagram size={16} /></a>
            <span className="okt-nav-sep" aria-hidden="true" />
            <div className="okt-nav-lang"><LanguageSwitcher /></div>
            <a href="#reservieren" className="okt-nav-cta" onClick={() => fireLead("oktoberfest_reservierung")}>{o.reserveButton}</a>
          </div>
        </nav>

        {/* HERO */}
        <header className="okt-hero" id="top">
          <img src={heroImage} srcSet={heroSrcSet} sizes="100vw"
            alt="Oktoberfest im Ristorante STORIA München – festlich geschmückte Terrasse in der Maxvorstadt"
            className="okt-hero-img" loading="eager" fetchPriority="high" />
          <div className="okt-hero-scrim" />
          <div className="okt-bunting"><Bunting /></div>
          <Herz label="Bavarese" />
          <div className="okt-hero-in">
            <Reveal as="span" className="okt-hero-eyebrow">{o.heroTime}</Reveal>
            <Reveal as="h1" delay={0.06} className="okt-h1">
              <span className="okt-frak">Oktoberfest</span>
              <span className="okt-h1-serif">{o.heroSubtitle}</span>
            </Reveal>
            <Reveal as="p" delay={0.16} className="okt-hero-sub">{o.heroDescription}</Reveal>
            <Reveal delay={0.26} className="okt-actions">
              <a href="#reservieren" className="okt-btn okt-btn-p" onClick={() => fireLead("oktoberfest_reservierung")}>{o.reserveButton}</a>
              <a href="tel:+498951519696" className="okt-btn okt-btn-g"><Phone size={18} /> 089 51519696</a>
            </Reveal>
            <Reveal delay={0.32} className="okt-trust"><span className="okt-stars">★★★★★</span> 4,5 · 800+ Google-Bewertungen</Reveal>
          </div>
        </header>
        <div className="okt-raute" aria-hidden="true" />

        {/* SOCIAL PROOF STRIP */}
        <div className="okt-strip">
          <div className="okt-wrap okt-strip-inner">
            <span>🍺 {o.proofBeer}</span>
            <span>🥨 {o.proofFood}</span>
            <span>🕐 {o.proofPeriod}</span>
          </div>
        </div>

        <main>
          {/* INTRO + KONZEPT */}
          <section className="okt-sec okt-sec-cream">
            <div className="okt-wrap">
              <Reveal className="okt-sec-head">
                <span className="okt-eyebrow">Bavarese</span>
                <h2 className="okt-h2">{o.introTitle}</h2>
                <p className="okt-lead">{o.introP1}</p>
                <p className="okt-lead">{o.introP2}</p>
                <p className="okt-lead">{o.introLinkPre}<LocalizedLink to="besondere-anlaesse" className="okt-inline-link">{o.introLinkAnchor}</LocalizedLink>{o.introLinkPost}</p>
              </Reveal>
              <div className="okt-concept-grid">
                {conceptCards.map((c, i) => (
                  <Reveal key={c.title} delay={i * 0.06} className="okt-concept">
                    <span className="okt-concept-ic">{c.icon}</span>
                    <h3>{c.title}</h3>
                    <p>{c.desc}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ITALIENER-WOCHENENDE */}
          <section className="okt-sec okt-sec-white">
            <div className="okt-wrap">
              <Reveal className="okt-iweekend">
                <span className="okt-tricolore" aria-hidden="true" />
                <span className="okt-iweekend-badge">{o.italienerWeekendBadge}</span>
                <h2 className="okt-h2">{o.italienerWeekendTitle}</h2>
                <p className="okt-iweekend-date">{o.italienerWeekendSubtitle}</p>
                <p className="okt-lead">{o.italienerWeekendP1}</p>
                <p className="okt-lead">{o.italienerWeekendP2}</p>
              </Reveal>
            </div>
          </section>

          {/* SPEISEN, GETRÄNKE & PAKETE — im Admin editierbar via „Besondere Anlässe" (Sondermenü oktoberfest-menue) */}
          {menuSections.map((sec, i) => (
            <section key={i} className={`okt-sec ${i % 2 === 0 ? "okt-sec-cream" : "okt-sec-white"}`} id={i === 0 ? "bier" : undefined}>
              <div className="okt-wrap">
                {i === 0 && (
                  <Reveal className="okt-partner">
                    <span className="okt-partner-lbl">{o.partnerLabel}</span>
                    <span className="okt-partner-name">PAULANER</span>
                    <span className="okt-partner-note">{o.partnerNote}</span>
                  </Reveal>
                )}
                <SecHead eyebrow="Bavarese" title={sec.title} lead={sec.subtitle} />
                <div className="okt-cards okt-cards-3">
                  {sec.items.map((it, j) => <Card key={j} name={it.name} desc={it.desc} price={it.price} />)}
                </div>
                {i === menuSections.length - 1 && (
                  <>
                    <Reveal as="p" className="okt-note okt-note-center">{o.priceNote}</Reveal>
                    <CtaRow />
                  </>
                )}
              </div>
            </section>
          ))}

          {/* ITAL. KARTE + KINDER */}
          <section className="okt-sec okt-sec-cream">
            <div className="okt-wrap okt-twocol">
              <Reveal className="okt-panel">
                <h2 className="okt-h3big">{o.italKarteTitle}</h2>
                <p className="okt-lead">{o.italKarteDesc}</p>
                <LocalizedLink to="speisekarte" className="okt-btn okt-btn-g okt-btn-sm">{o.italKarteLink} <ArrowUpRight size={16} /></LocalizedLink>
              </Reveal>
              <Reveal delay={0.08} className="okt-panel">
                <h2 className="okt-h3big">{o.kinderTitle}</h2>
                <p className="okt-lead">{o.kinderP1}</p>
              </Reveal>
            </div>
          </section>

          {/* ATMOSPHÄRE / WHY */}
          <section className="okt-sec okt-sec-white">
            <div className="okt-wrap">
              <SecHead eyebrow={o.eyebrowStimmung} title={o.whyTitle} lead={o.whySubtitle} />
              <div className="okt-features">
                {whyFeatures.map((f, i) => (
                  <Reveal key={f.title} delay={(i % 3) * 0.06} className="okt-feature">
                    <span className="okt-feature-ic">{f.icon}</span>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ZIELGRUPPEN */}
          <section className="okt-sec okt-sec-cream">
            <div className="okt-wrap">
              <SecHead eyebrow={o.eyebrowFuerWen} title={o.occasionsTitle} lead={o.occasionsSubtitle} />
              <div className="okt-features">
                {occasions.map((c, i) => (
                  <Reveal key={c.title} delay={(i % 3) * 0.06} className="okt-feature">
                    <span className="okt-feature-ic">{c.icon}</span>
                    <h3>{c.title}</h3>
                    <p>{c.desc}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* RESERVIEREN */}
          <section className="okt-sec okt-sec-blue" id="reservieren">
            <div className="okt-wrap">
              <SecHead eyebrow={o.reserveButton} title={o.ctaTitle} lead={o.ctaDesc} />
              <Reveal delay={0.08} className="okt-booking">
                <ReservationBooking headingLevel="h3" onBook={() => fireLead("oktoberfest_reservierung")} />
              </Reveal>
            </div>
          </section>

          {/* HOTELS */}
          <section className="okt-sec okt-sec-cream">
            <div className="okt-wrap">
              <SecHead eyebrow={o.eyebrowInDerNaehe} title={o.hotelTitle} lead={o.hotelSubtitle} />
              <div className="okt-cards okt-cards-3">
                {hotels.map((h, i) => (
                  <Reveal key={h.name} delay={(i % 3) * 0.06} className="okt-hotel">
                    <div className="okt-hotel-head"><h3>{h.name}</h3><span className="okt-hotel-time">{h.time}</span></div>
                    <p>{h.note}</p>
                  </Reveal>
                ))}
              </div>
              <Reveal as="p" className="okt-note okt-note-center">{o.hotelOutro}</Reveal>
            </div>
          </section>

          {/* SCHNELL ZUR WIESN */}
          <section className="okt-sec okt-sec-white">
            <div className="okt-wrap">
              <SecHead eyebrow={o.eyebrowZurWiesn} title={o.wiesnRouteTitle} lead={o.wiesnRouteIntro} />
              <div className="okt-cards okt-cards-3">
                {wiesnRoute.map((r, i) => (
                  <Reveal key={r.title} delay={i * 0.06} className="okt-route">
                    <span className="okt-route-ic">{r.icon}</span>
                    <h3>{r.title}</h3>
                    <p>{r.desc}</p>
                  </Reveal>
                ))}
              </div>
              <Reveal as="p" className="okt-note okt-note-center">{o.wiesnRouteNote}</Reveal>
            </div>
          </section>

          {/* ANFAHRT */}
          <section className="okt-sec okt-sec-cream">
            <div className="okt-wrap okt-anfahrt-grid">
              <Reveal className="okt-anfahrt-text">
                <span className="okt-eyebrow">{o.eyebrowStandort}</span>
                <h2 className="okt-h2">{o.locationTitle}</h2>
                <p className="okt-lead">{o.locationIntro}</p>
                <div className="okt-direct">
                  <a href="tel:+498951519696"><span className="ic"><Phone size={18} /></span><span><b>{o.addressTitle}</b>Ristorante STORIA · Karlstraße 47a, 80333 München</span></a>
                  <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer" onClick={() => fireLead("oktoberfest_whatsapp")}><span className="ic"><MessageCircle size={18} /></span><span><b>WhatsApp</b>089 51519696</span></a>
                  <a href="https://maps.google.com/?q=Ristorante+Storia+Karlstra%C3%9Fe+47a+M%C3%BCnchen" target="_blank" rel="noopener noreferrer"><span className="ic"><MapPin size={18} /></span><span><b>{o.nearbyWiesn}</b>{o.nearbyHbf} · {o.nearbyKoenigsplatz}</span></a>
                </div>
              </Reveal>
              <Reveal delay={0.1} className="okt-map-card">
                <ConsentGoogleMaps src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d11.5658!3d48.1465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKarlstra%C3%9Fe%2047a%2C%2080333%20M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1" title="STORIA · Karlstraße 47a, München" height={400} className="okt-map-iframe" />
              </Reveal>
            </div>
          </section>

          {/* FAQ */}
          <section className="okt-sec okt-sec-white">
            <div className="okt-wrap">
              <SecHead eyebrow="FAQ" title={o.faqTitle} />
              <div className="okt-faq-list">
                {faqItems.map((item, i) => (
                  <Reveal key={item.q} delay={(i % 3) * 0.05} className="okt-faq-item">
                    <h3>{item.q}</h3>
                    <p><PhoneText>{item.a}</PhoneText></p>
                  </Reveal>
                ))}
              </div>
              <CtaRow />
            </div>
          </section>
        </main>

        <div className="okt-raute" aria-hidden="true" />
        <Footer />
      </div>
    </>
  );
};

const oktStyles = `
@font-face{font-family:'WiesnFrak';src:url('/fonts/UnifrakturCook-Bold.woff2') format('woff2');font-weight:700;font-display:swap;}
@font-face{font-family:'HerzVibes';src:url('/fonts/GreatVibes-Regular-latin.woff2') format('woff2');font-display:swap;}
.okt-page{
  --blau:#1b6bb0;--blaud:#134f86;--gold:#dca62b;--amber:#b9822a;
  --creme:#f8f1e3;--creme2:#fdf9f0;--ink:#2c1e12;--muted:#6a5942;
  --gruen:#2f8f50;--rot:#c0392b;--line:#ecdfca;--maxw:1180px;
  --serif:'Cormorant Garamond',Georgia,serif;--mono:ui-monospace,'SF Mono',Menlo,Consolas,monospace;
  background:var(--creme2);color:var(--ink);overflow-x:hidden;font-family:'Inter',system-ui,sans-serif;
}
.okt-page ::selection{background:var(--gold);color:#2a1c0d;}
.okt-wrap{max-width:var(--maxw);margin:0 auto;padding:0 28px;}
.okt-page h1,.okt-page h2,.okt-page h3{font-family:var(--serif);font-weight:700;line-height:1.05;}
.okt-eyebrow{display:inline-flex;align-items:center;gap:12px;color:var(--amber);font-weight:600;font-size:13px;letter-spacing:.2em;text-transform:uppercase;}
.okt-eyebrow::before{content:"";width:32px;height:2px;background:var(--amber);}
/* NAV */
.okt-nav{position:fixed;inset:0 0 auto 0;z-index:1000;display:flex;align-items:center;justify-content:space-between;padding:16px 30px;transition:background .4s,padding .4s,box-shadow .4s;}
.okt-nav.scrolled{background:rgba(253,249,240,.94);backdrop-filter:blur(10px);padding:10px 30px;box-shadow:0 1px 0 var(--line);}
.okt-brand{font-family:var(--serif);font-weight:700;font-size:26px;letter-spacing:.03em;color:#fff;text-decoration:none;text-shadow:0 1px 8px rgba(0,0,0,.4);}
.okt-nav.scrolled .okt-brand{color:var(--ink);text-shadow:none;}
.okt-brand span{color:var(--gold);}
.okt-nav-right{display:flex;align-items:center;gap:15px;}
.okt-nav-icon{display:inline-flex;color:#fff;opacity:.9;transition:opacity .2s,color .2s;text-shadow:0 1px 6px rgba(0,0,0,.4);}
.okt-nav.scrolled .okt-nav-icon{color:var(--ink);text-shadow:none;opacity:.75;}
.okt-nav-icon:hover{opacity:1;}
.okt-nav-wa:hover{color:#25D366;}
.okt-nav-sep{width:1px;height:20px;background:rgba(255,255,255,.4);}
.okt-nav.scrolled .okt-nav-sep{background:var(--line);}
.okt-nav-cta{background:var(--gold);color:#2a1c0d;padding:10px 20px;border-radius:100px;font-weight:600;font-size:14px;text-decoration:none;transition:transform .2s,background .2s;white-space:nowrap;}
.okt-nav-cta:hover{transform:translateY(-1px);background:#e8b74a;}
@media(max-width:760px){.okt-nav-icon,.okt-nav-sep{display:none;}}
/* HERO */
.okt-hero{position:relative;min-height:100vh;display:flex;align-items:flex-end;padding:120px 0 68px;overflow:hidden;background:#1a120a;}
.okt-hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
.okt-hero-scrim{position:absolute;inset:0;background:linear-gradient(90deg,rgba(24,15,8,.8),rgba(24,15,8,.32) 46%,rgba(24,15,8,.04) 72%),linear-gradient(0deg,rgba(20,12,6,.76),rgba(20,12,6,.1) 42%,rgba(20,12,6,.26));}
.okt-bunting{position:absolute;top:62px;left:0;right:0;z-index:5;line-height:0;filter:drop-shadow(0 3px 3px rgba(0,0,0,.28));pointer-events:none;}
@media(max-width:760px){.okt-bunting{top:54px;}}
.okt-bunting-svg{display:block;width:100%;height:64px;}
.okt-herz{position:absolute;right:56px;bottom:118px;z-index:6;width:128px;height:120px;filter:drop-shadow(0 8px 18px rgba(0,0,0,.4));}
.okt-herz-lbl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'HerzVibes',cursive;color:#fff;font-size:30px;transform:translateY(-4px) rotate(-8deg);}
@media(max-width:820px){.okt-herz{display:none;}}
.okt-hero-in{position:relative;z-index:4;width:100%;max-width:var(--maxw);margin:0 auto;padding:0 30px;}
.okt-hero-eyebrow{display:inline-flex;align-items:center;gap:12px;color:var(--gold);font-weight:600;font-size:13.5px;letter-spacing:.1em;margin-bottom:16px;}
.okt-hero-eyebrow::before{content:"";width:34px;height:2px;background:var(--gold);}
.okt-h1{line-height:.92;margin-bottom:18px;color:#fbf3e0;}
.okt-frak{font-family:'WiesnFrak',var(--serif);font-weight:700;font-size:clamp(3.4rem,9vw,7.4rem);display:block;text-shadow:0 3px 24px rgba(0,0,0,.45);}
.okt-h1-serif{font-family:var(--serif);font-weight:600;font-style:italic;font-size:clamp(1.7rem,3.4vw,3.1rem);color:#f0e7d6;display:block;margin-top:4px;}
.okt-hero-sub{font-size:clamp(1rem,1.5vw,1.16rem);color:#e9dfce;max-width:54ch;line-height:1.55;margin-bottom:30px;}
.okt-actions{display:flex;gap:14px;flex-wrap:wrap;align-items:center;}
.okt-actions-center{justify-content:center;margin-top:36px;}
.okt-btn{display:inline-flex;align-items:center;gap:9px;text-decoration:none;font-weight:600;font-size:15px;padding:15px 28px;border-radius:100px;transition:transform .2s,box-shadow .2s,background .2s,border-color .2s;cursor:pointer;}
.okt-btn-p{background:var(--gold);color:#2a1c0d;box-shadow:0 14px 40px -16px rgba(220,166,43,.85);}
.okt-btn-p:hover{transform:translateY(-2px);background:#e8b74a;}
.okt-btn-g{color:#f4ece0;border:1.5px solid rgba(255,255,255,.42);}
.okt-btn-g:hover{transform:translateY(-2px);border-color:var(--gold);}
.okt-btn-sm{padding:12px 22px;font-size:14px;margin-top:20px;color:var(--blaud);border-color:rgba(27,107,176,.4);}
.okt-btn-sm:hover{border-color:var(--blau);}
.okt-trust{margin-top:22px;color:#e8dcc8;font-size:14px;}
.okt-stars{color:var(--gold);letter-spacing:2px;}
/* RAUTE band */
.okt-raute{height:24px;background-color:#fff;background-image:linear-gradient(135deg,var(--blau) 25%,transparent 25%),linear-gradient(225deg,var(--blau) 25%,transparent 25%),linear-gradient(315deg,var(--blau) 25%,transparent 25%),linear-gradient(45deg,var(--blau) 25%,transparent 25%);background-position:-21px 0,-21px 0,0 0,0 0;background-size:42px 42px;background-repeat:repeat;}
/* STRIP */
.okt-strip{background:var(--blaud);color:#fff;}
.okt-strip-inner{display:flex;flex-wrap:wrap;justify-content:center;gap:14px 40px;padding:16px 28px;}
.okt-strip span{display:inline-flex;align-items:center;gap:9px;font-size:.95rem;font-weight:500;}
/* SECTIONS */
.okt-sec{padding:clamp(58px,7vw,100px) 0;}
.okt-sec-cream{background:var(--creme2);}
.okt-sec-white{background:#fff;}
.okt-sec-head{max-width:64ch;margin-bottom:40px;}
.okt-h2{font-size:clamp(2rem,4.4vw,3.2rem);color:var(--ink);margin-top:12px;}
.okt-h3big{font-size:clamp(1.5rem,3vw,2.05rem);color:var(--ink);margin-bottom:12px;}
.okt-lead{font-size:1.08rem;color:var(--muted);max-width:64ch;margin-top:16px;line-height:1.62;}
.okt-subhead{font-family:var(--serif);font-size:1.5rem;color:var(--ink);margin:38px 0 20px;}
.okt-inline-link{color:var(--blau);text-decoration:underline;text-underline-offset:3px;}
.okt-inline-link:hover{color:var(--blaud);}
.okt-note{margin-top:24px;font-size:.86rem;color:#8a795f;line-height:1.6;}
.okt-note-center{text-align:center;max-width:66ch;margin-left:auto;margin-right:auto;}
/* KONZEPT */
.okt-concept-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:44px;}
@media(max-width:760px){.okt-concept-grid{grid-template-columns:1fr;}}
.okt-concept{background:#fff;border:1px solid var(--line);border-radius:16px;padding:28px 26px;box-shadow:0 16px 36px -30px rgba(80,50,10,.4);transition:transform .3s,box-shadow .3s;}
.okt-concept:hover{transform:translateY(-4px);box-shadow:0 22px 44px -26px rgba(80,50,10,.45);}
.okt-concept-ic{font-size:1.9rem;}
.okt-concept h3{font-size:1.42rem;margin:12px 0 8px;color:var(--ink);}
.okt-concept p{color:var(--muted);line-height:1.55;}
/* ITALIENER-WOCHENENDE */
.okt-iweekend{position:relative;border:1px solid var(--line);border-radius:22px;padding:46px 42px;background:radial-gradient(90% 130% at 100% 0%,rgba(47,143,80,.09),transparent 55%),radial-gradient(80% 130% at 0% 100%,rgba(192,57,43,.08),transparent 55%),#fff;overflow:hidden;box-shadow:0 20px 50px -34px rgba(80,50,10,.5);}
.okt-tricolore{position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,var(--gruen) 0 33.3%,#f6f0e6 33.3% 66.6%,var(--rot) 66.6% 100%);}
.okt-iweekend-badge{display:inline-block;background:var(--gold);color:#2a1c0d;font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:6px 14px;border-radius:100px;margin-bottom:14px;}
.okt-iweekend-date{color:var(--amber);font-weight:700;font-family:var(--serif);font-size:1.4rem;margin-top:8px;}
/* CARDS */
.okt-cards{display:grid;gap:20px;}
.okt-cards-3{grid-template-columns:repeat(3,1fr);}
.okt-cards-2{grid-template-columns:repeat(2,1fr);}
@media(max-width:880px){.okt-cards-3{grid-template-columns:repeat(2,1fr);}}
@media(max-width:600px){.okt-cards-3,.okt-cards-2{grid-template-columns:1fr;}}
.okt-card{background:#fff;border:1px solid var(--line);border-radius:16px;overflow:hidden;box-shadow:0 16px 38px -30px rgba(80,50,10,.4);display:flex;flex-direction:column;transition:transform .3s,box-shadow .3s;}
.okt-card:hover{transform:translateY(-4px);box-shadow:0 24px 46px -26px rgba(80,50,10,.45);}
.okt-gingham{height:12px;background-color:#fff;background-image:repeating-linear-gradient(0deg,rgba(27,107,176,.5) 0 6px,transparent 6px 12px),repeating-linear-gradient(90deg,rgba(27,107,176,.5) 0 6px,transparent 6px 12px);}
.okt-card-b{padding:22px 22px 24px;display:flex;flex-direction:column;flex-grow:1;}
.okt-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;}
.okt-card-head h3{font-size:1.3rem;color:var(--ink);}
.okt-card p{color:var(--muted);line-height:1.5;margin:10px 0 16px;flex-grow:1;font-size:.98rem;}
.okt-price{font-family:var(--serif);font-weight:700;font-size:1.25rem;color:var(--amber);}
.okt-tag{font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;padding:5px 9px;border-radius:7px;white-space:nowrap;background:rgba(220,166,43,.16);color:var(--amber);}
.okt-tag-fass{background:rgba(220,166,43,.18);color:var(--amber);}
.okt-tag-bay{background:rgba(27,107,176,.14);color:var(--blaud);}
.okt-tag-ita{background:rgba(47,143,80,.14);color:var(--gruen);}
/* PARTNER */
.okt-partner{display:inline-flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--line);border-radius:100px;padding:9px 20px;margin-bottom:8px;box-shadow:0 12px 30px -24px rgba(80,50,10,.5);}
.okt-partner-lbl{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8a795f;font-weight:600;}
.okt-partner-name{font-family:var(--serif);font-weight:700;font-size:1.25rem;color:var(--blaud);letter-spacing:.06em;}
.okt-partner-note{color:var(--muted);font-size:.92rem;}
/* PANELS */
.okt-twocol{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
@media(max-width:820px){.okt-twocol{grid-template-columns:1fr;}}
.okt-panel{background:#fff;border:1px solid var(--line);border-radius:20px;padding:34px 32px;box-shadow:0 16px 40px -32px rgba(80,50,10,.45);}
/* FEATURES */
.okt-features{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
@media(max-width:820px){.okt-features{grid-template-columns:repeat(2,1fr);}}
@media(max-width:560px){.okt-features{grid-template-columns:1fr;}}
.okt-feature{background:#fff;border:1px solid var(--line);border-radius:16px;padding:26px 24px;box-shadow:0 14px 34px -30px rgba(80,50,10,.4);transition:transform .3s;}
.okt-feature:hover{transform:translateY(-4px);}
.okt-feature-ic{font-size:2rem;}
.okt-feature h3{font-size:1.3rem;margin:12px 0 8px;color:var(--ink);}
.okt-feature p{color:var(--muted);line-height:1.55;}
/* PAKETE */
.okt-paket{border:1px solid var(--line);border-radius:18px;padding:30px 28px;background:linear-gradient(180deg,rgba(220,166,43,.08),#fff);display:flex;flex-direction:column;box-shadow:0 16px 40px -30px rgba(80,50,10,.45);transition:transform .3s;}
.okt-paket:hover{transform:translateY(-4px);}
.okt-paket h3{font-size:1.5rem;color:var(--ink);margin-bottom:10px;}
.okt-paket p{color:var(--muted);line-height:1.55;flex-grow:1;margin-bottom:16px;}
.okt-paket-price{font-family:var(--serif);font-weight:700;font-size:1.3rem;color:var(--amber);}
/* RESERVIEREN (blau) */
.okt-sec-blue{background:linear-gradient(180deg,var(--blau),var(--blaud));color:#fff;}
.okt-sec-blue .okt-eyebrow{color:#ffe6a8;}
.okt-sec-blue .okt-eyebrow::before{background:#ffe6a8;}
.okt-sec-blue .okt-h2{color:#fff;}
.okt-sec-blue .okt-lead{color:rgba(255,255,255,.9);}
.okt-booking{margin-top:8px;background:#fff;border-radius:20px;padding:8px;box-shadow:0 30px 60px -30px rgba(0,0,0,.5);}
/* HOTELS */
.okt-hotel{background:#fff;border:1px solid var(--line);border-radius:16px;padding:24px 22px;box-shadow:0 14px 34px -30px rgba(80,50,10,.4);transition:transform .3s;}
.okt-hotel:hover{transform:translateY(-3px);}
.okt-hotel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:10px;}
.okt-hotel-head h3{font-size:1.2rem;color:var(--ink);}
.okt-hotel-time{font-family:var(--mono);font-size:.7rem;font-weight:600;color:#fff;background:var(--blau);padding:5px 9px;border-radius:7px;white-space:nowrap;}
.okt-hotel p{color:var(--muted);font-size:.94rem;line-height:1.5;}
/* ROUTE */
.okt-route{background:#fff;border:1px solid var(--line);border-radius:16px;padding:30px 26px;text-align:center;box-shadow:0 14px 34px -30px rgba(80,50,10,.4);transition:transform .3s;}
.okt-route:hover{transform:translateY(-4px);}
.okt-route-ic{font-size:2.3rem;}
.okt-route h3{font-size:1.32rem;margin:12px 0 8px;color:var(--ink);}
.okt-route p{color:var(--muted);line-height:1.55;}
/* ANFAHRT */
.okt-anfahrt-grid{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:start;}
@media(max-width:880px){.okt-anfahrt-grid{grid-template-columns:1fr;gap:36px;}}
.okt-direct{margin-top:26px;display:flex;flex-direction:column;gap:14px;}
.okt-direct a{color:var(--ink);text-decoration:none;display:flex;align-items:center;gap:16px;font-size:1rem;line-height:1.4;}
.okt-direct a:hover{color:var(--blau);}
.okt-direct .ic{width:44px;height:44px;border-radius:12px;border:1px solid var(--line);background:#fff;display:grid;place-items:center;flex-shrink:0;color:var(--blau);}
.okt-direct b{display:block;font-size:.72rem;letter-spacing:.05em;text-transform:uppercase;color:#8a795f;font-weight:700;margin-bottom:2px;}
.okt-map-card{border-radius:20px;overflow:hidden;border:1px solid var(--line);min-height:400px;box-shadow:0 20px 46px -34px rgba(80,50,10,.5);}
.okt-map-iframe{display:block;width:100%;border-radius:20px;}
/* FAQ */
.okt-faq-list{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
@media(max-width:780px){.okt-faq-list{grid-template-columns:1fr;}}
.okt-faq-item{background:var(--creme2);border:1px solid var(--line);border-radius:16px;padding:26px 24px;}
.okt-faq-item h3{font-size:1.16rem;color:var(--ink);margin-bottom:10px;}
.okt-faq-item p{font-size:.96rem;color:var(--muted);line-height:1.6;}
/* REVEAL */
.okt-reveal{opacity:0;transform:translateY(22px);transition:opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1);}
.okt-reveal.in{opacity:1;transform:none;}
@media(prefers-reduced-motion:reduce){.okt-reveal{opacity:1!important;transform:none!important;}}
`;

export default OktoberfestMuenchen;
