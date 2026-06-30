import { useEffect, useRef, useState, type ReactNode } from "react";
import { PhoneText } from "@/lib/linkifyPhone";
import { Phone, Mail, MapPin, MessageCircle, Instagram, Beer, Utensils, Music, Users, Star, ArrowUpRight } from "lucide-react";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import ReservationBooking from "@/components/ReservationBooking";
import ConsentGoogleMaps from "@/components/ConsentGoogleMaps";
import LocalizedLink from "@/components/LocalizedLink";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import heroImage from "@/assets/gaeste-terrasse-italiener-maxvorstadt-muenchen.webp";
import heroImage600 from "@/assets/gaeste-terrasse-italiener-maxvorstadt-muenchen-600w.webp";
import storiaLogo from "@/assets/storia-logo.webp";

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
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Component = Tag as any;
  return <Component ref={ref as any} className={`okt-reveal ${visible ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}s` }}>{children}</Component>;
};

const OktoberfestMuenchen = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);
  const o = t.seo.oktoberfest;
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
    { name: o.beerMassName, desc: o.beerMassDesc, price: "€ 12,90", badge: o.badgeFass },
    { name: o.beerRadlerName, desc: o.beerRadlerDesc, price: "€ 12,90" },
    { name: o.beerRussName, desc: o.beerRussDesc, price: "€ 12,90" },
    { name: o.beerAlkoholfreiName, desc: o.beerAlkoholfreiDesc, price: "€ 6,90" },
  ];
  const aperitivi = [
    { name: o.spritzBavareseName, desc: o.spritzBavareseDesc, price: "€ 9,90", badge: o.badgeHaus },
    { name: o.spritzAperolName, desc: o.spritzAperolDesc, price: "€ 9,90" },
    { name: o.spritzHugoName, desc: o.spritzHugoDesc, price: "€ 9,90" },
  ];
  const brotzeit = [
    { name: o.brettBavareseName, desc: o.brettBavareseDesc, price: "ca. € 24,90", badge: o.badgeBestseller },
    { name: o.brettMuenchenName, desc: o.brettMuenchenDesc, price: "ca. € 19,90" },
    { name: o.brettItaliaName, desc: o.brettItaliaDesc, price: "ca. € 19,90" },
    { name: o.breznName, desc: o.breznDesc, price: "€ 4,50" },
    { name: o.obatzdaName, desc: o.obatzdaDesc, price: "€ 8,90" },
    { name: o.weisswurstName, desc: o.weisswurstDesc, price: "€ 8,90" },
  ];
  const pizzen = [
    { kind: "bay", name: o.pizzaBratwurstName, desc: o.pizzaBratwurstDesc, price: "ca. € 15,90", badge: o.badgeBayerisch },
    { kind: "bay", name: o.pizzaSpanferkelName, desc: o.pizzaSpanferkelDesc, price: "ca. € 16,90", badge: o.badgeBayerisch },
    { kind: "ita", name: o.pizzaSalamiName, desc: o.pizzaSalamiDesc, price: "ca. € 14,90", badge: o.badgeItalienisch },
    { kind: "ita", name: o.pizzaObatzdaName, desc: o.pizzaObatzdaDesc, price: "ca. € 14,90", badge: o.badgeItalienisch },
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

  const MenuCard = ({ name, desc, price, badge, kind }: { name: string; desc: string; price: string; badge?: string; kind?: string }) => (
    <div className="okt-card">
      <div className="okt-card-head">
        <h3>{name}</h3>
        {badge && <span className={`okt-tag${kind ? ` okt-tag-${kind}` : ""}`}>{badge}</span>}
      </div>
      <p>{desc}</p>
      <span className="okt-price">{price}</span>
    </div>
  );

  const CtaRow = ({ center = false }: { center?: boolean }) => (
    <Reveal className={`okt-actions${center ? " okt-actions-center" : ""}`}>
      <a href="#reservieren" className="okt-btn okt-btn-primary" onClick={() => fireLead("oktoberfest_reservierung")}>{o.reserveButton}</a>
      <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer" className="okt-btn okt-btn-ghost" onClick={() => fireLead("oktoberfest_whatsapp")}>
        <MessageCircle size={18} /> WhatsApp
      </a>
    </Reveal>
  );

  return (
    <>
      {/* TEMPORÄR: noIndex, solange die Preise Platzhalter sind. Vor Launch (echte Preise) entfernen. */}
      <SEO title={o.seoTitle} description={o.seoDescription} canonical="/oktoberfest-muenchen" noIndex />
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
        "image": "https://www.ristorantestoria.de/assets/gaeste-terrasse-italiener-maxvorstadt-muenchen.webp",
        "description": o.seoDescription,
        "location": { "@type": "Place", "name": "Ristorante STORIA", "address": { "@type": "PostalAddress", "streetAddress": "Karlstraße 47a", "addressLocality": "München", "addressRegion": "Bayern", "postalCode": "80333", "addressCountry": "DE" } },
        "organizer": { "@type": "Organization", "name": "Ristorante STORIA", "url": "https://www.ristorantestoria.de/" },
        "offers": { "@type": "Offer", "url": "https://www.ristorantestoria.de/oktoberfest-muenchen/", "availability": "https://schema.org/InStock", "price": "0", "priceCurrency": "EUR" },
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": faqItems.map((i) => ({ "@type": "Question", "name": i.q, "acceptedAnswer": { "@type": "Answer", "text": i.a } })),
      }) }} />

      <style>{oktStyles}</style>

      <div className="okt-page">
        {/* NAV */}
        <nav className={`okt-nav ${scrolled ? "scrolled" : ""}`}>
          <LocalizedLink to="home" className="okt-brand" aria-label="STORIA">STORIA<span>.</span></LocalizedLink>
          <div className="okt-nav-right">
            <a href="tel:+498951519696" className="okt-nav-icon" aria-label="Anrufen" title="+49 89 51519696"><Phone size={16} /></a>
            <a href="mailto:info@ristorantestoria.de" className="okt-nav-icon" aria-label="E-Mail" title="info@ristorantestoria.de"><Mail size={16} /></a>
            <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer" className="okt-nav-icon okt-nav-wa" aria-label="WhatsApp" title="WhatsApp" onClick={() => fireLead("oktoberfest_whatsapp")}><MessageCircle size={16} /></a>
            <a href="https://www.instagram.com/ristorante_storia/" target="_blank" rel="noopener noreferrer" className="okt-nav-icon" aria-label="Instagram" title="Instagram"><Instagram size={16} /></a>
            <span className="okt-nav-sep" aria-hidden="true" />
            <div className="okt-nav-lang"><LanguageSwitcher /></div>
            <a href="#reservieren" className="okt-nav-cta" onClick={() => fireLead("oktoberfest_reservierung")}>{o.reserveButton}</a>
          </div>
        </nav>

        {/* HERO */}
        <header className="okt-hero" id="top">
          <img src={heroImage} srcSet={`${heroImage600} 600w, ${heroImage} 1200w`} sizes="100vw"
            alt="Oktoberfest im Ristorante STORIA München – Terrasse in der Maxvorstadt"
            className="okt-hero-img" loading="eager" fetchPriority="high" />
          <div className="okt-hero-overlay" />
          <div className="okt-wrap okt-hero-inner">
            <Reveal as="span" className="okt-eyebrow okt-eyebrow-line">{o.heroTime}</Reveal>
            <Reveal as="h1" delay={0.08} className="okt-h1">{o.title}</Reveal>
            <Reveal as="p" delay={0.14} className="okt-hero-sub">{o.heroSubtitle}</Reveal>
            <Reveal as="p" delay={0.2} className="okt-hero-lead">{o.heroDescription}</Reveal>
            <Reveal delay={0.26} className="okt-actions">
              <a href="#reservieren" className="okt-btn okt-btn-primary" onClick={() => fireLead("oktoberfest_reservierung")}>{o.reserveButton}</a>
              <a href="tel:+498951519696" className="okt-btn okt-btn-ghost"><Phone size={18} /> 089 51519696</a>
            </Reveal>
            <Reveal delay={0.32} className="okt-trust"><Star size={15} className="okt-star" /><Star size={15} className="okt-star" /><Star size={15} className="okt-star" /><Star size={15} className="okt-star" /><Star size={15} className="okt-star" /><span>4,5 · 780+ Google</span></Reveal>
          </div>
          <div className="okt-rauten" aria-hidden="true" />
        </header>

        {/* SOCIAL PROOF STRIP */}
        <div className="okt-strip">
          <div className="okt-wrap okt-strip-inner">
            <span><Beer size={17} /> {o.proofBeer}</span>
            <span><Utensils size={17} /> {o.proofFood}</span>
            <span><Music size={17} /> {o.proofPeriod}</span>
          </div>
        </div>

        <main>
          {/* INTRO + BAVARESE-KONZEPT */}
          <section className="okt-sec okt-intro">
            <div className="okt-wrap">
              <Reveal className="okt-sec-head">
                <span className="okt-eyebrow okt-eyebrow-line">Bavarese</span>
                <h2 className="okt-h2">{o.introTitle}</h2>
                <p className="okt-lead">{o.introP1}</p>
                <p className="okt-lead">{o.introP2}</p>
                <p className="okt-lead okt-crosslink">{o.introLinkPre}<LocalizedLink to="besondere-anlaesse" className="okt-inline-link">{o.introLinkAnchor}</LocalizedLink>{o.introLinkPost}</p>
              </Reveal>
              <div className="okt-concept-grid">
                {conceptCards.map((c, i) => (
                  <Reveal key={c.title} delay={i * 0.07} className="okt-concept">
                    <span className="okt-concept-ic">{c.icon}</span>
                    <h3>{c.title}</h3>
                    <p>{c.desc}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ITALIENER-WOCHENENDE */}
          <section className="okt-sec okt-iweekend">
            <div className="okt-wrap">
              <Reveal className="okt-iweekend-card">
                <span className="okt-tricolore" aria-hidden="true" />
                <span className="okt-iweekend-badge">{o.italienerWeekendBadge}</span>
                <h2 className="okt-h2">{o.italienerWeekendTitle}</h2>
                <p className="okt-iweekend-date">{o.italienerWeekendSubtitle}</p>
                <p className="okt-lead">{o.italienerWeekendP1}</p>
                <p className="okt-lead">{o.italienerWeekendP2}</p>
              </Reveal>
            </div>
          </section>

          {/* BIER */}
          <section className="okt-sec okt-bier" id="bier">
            <div className="okt-wrap">
              <Reveal className="okt-sec-head">
                <span className="okt-eyebrow okt-eyebrow-line">🍺 Holzfass</span>
                <h2 className="okt-h2">{o.beerTitle}</h2>
                <p className="okt-lead">{o.beerSubtitle}</p>
              </Reveal>
              <Reveal as="h3" className="okt-subhead">{o.categoryBeer}</Reveal>
              <div className="okt-card-grid okt-card-grid-3">{biere.map((d) => <MenuCard key={d.name} {...d} />)}</div>
              <Reveal as="h3" className="okt-subhead">{o.categoryAperitivo}</Reveal>
              <div className="okt-card-grid okt-card-grid-3">{aperitivi.map((d) => <MenuCard key={d.name} {...d} />)}</div>
              <Reveal as="p" className="okt-note">{o.priceNote}</Reveal>
              <CtaRow center />
            </div>
          </section>

          {/* BROTZEIT */}
          <section className="okt-sec okt-brotzeit" id="brotzeit">
            <div className="okt-wrap">
              <Reveal className="okt-sec-head">
                <span className="okt-eyebrow okt-eyebrow-line">🥨 Brotzeit</span>
                <h2 className="okt-h2">{o.brotzeitTitle}</h2>
                <p className="okt-lead">{o.brotzeitSubtitle}</p>
              </Reveal>
              <div className="okt-card-grid okt-card-grid-3">{brotzeit.map((d) => <MenuCard key={d.name} {...d} />)}</div>
            </div>
          </section>

          {/* PIZZEN */}
          <section className="okt-sec okt-pizzen" id="pizzen">
            <div className="okt-wrap">
              <Reveal className="okt-sec-head">
                <span className="okt-eyebrow okt-eyebrow-line">🍕 Specials</span>
                <h2 className="okt-h2">{o.pizzaTitle}</h2>
                <p className="okt-lead">{o.pizzaSubtitle}</p>
              </Reveal>
              <div className="okt-card-grid okt-card-grid-2">{pizzen.map((d) => <MenuCard key={d.name} {...d} />)}</div>
              <Reveal as="p" className="okt-note">{o.pizzaNote}</Reveal>
            </div>
          </section>

          {/* BRATEN */}
          <section className="okt-sec okt-braten">
            <div className="okt-wrap">
              <Reveal className="okt-sec-head">
                <span className="okt-eyebrow okt-eyebrow-line">🍖 Hauptgang</span>
                <h2 className="okt-h2">{o.bratenTitle}</h2>
                <p className="okt-lead">{o.bratenSubtitle}</p>
              </Reveal>
              <div className="okt-card-grid okt-card-grid-3">{braten.map((d) => <MenuCard key={d.name} {...d} />)}</div>
            </div>
          </section>

          {/* ITAL. KARTE + KINDER */}
          <section className="okt-sec okt-italkarte">
            <div className="okt-wrap okt-twocol">
              <Reveal className="okt-panel">
                <h2 className="okt-h3big">{o.italKarteTitle}</h2>
                <p className="okt-lead">{o.italKarteDesc}</p>
                <LocalizedLink to="speisekarte" className="okt-btn okt-btn-ghost okt-btn-sm">{o.italKarteLink} <ArrowUpRight size={16} /></LocalizedLink>
              </Reveal>
              <Reveal delay={0.08} className="okt-panel">
                <h2 className="okt-h3big">{o.kinderTitle}</h2>
                <p className="okt-lead">{o.kinderP1}</p>
              </Reveal>
            </div>
          </section>

          {/* ATMOSPHÄRE / WHY */}
          <section className="okt-sec okt-why">
            <div className="okt-wrap">
              <Reveal className="okt-sec-head">
                <span className="okt-eyebrow okt-eyebrow-line">🎶 Stimmung</span>
                <h2 className="okt-h2">{o.whyTitle}</h2>
                <p className="okt-lead">{o.whySubtitle}</p>
              </Reveal>
              <div className="okt-why-grid">
                {whyFeatures.map((f, i) => (
                  <Reveal key={f.title} delay={(i % 3) * 0.06} className="okt-why-item">
                    <span className="okt-why-ic">{f.icon}</span>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ZIELGRUPPEN */}
          <section className="okt-sec okt-zielgruppen">
            <div className="okt-wrap">
              <Reveal className="okt-sec-head">
                <span className="okt-eyebrow okt-eyebrow-line">👥 Für wen</span>
                <h2 className="okt-h2">{o.occasionsTitle}</h2>
                <p className="okt-lead">{o.occasionsSubtitle}</p>
              </Reveal>
              <div className="okt-why-grid">
                {occasions.map((c, i) => (
                  <Reveal key={c.title} delay={(i % 3) * 0.06} className="okt-why-item">
                    <span className="okt-why-ic">{c.icon}</span>
                    <h3>{c.title}</h3>
                    <p>{c.desc}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* PAKETE */}
          <section className="okt-sec okt-pakete">
            <div className="okt-wrap">
              <Reveal className="okt-sec-head">
                <span className="okt-eyebrow okt-eyebrow-line"><Users size={15} /> Gruppen</span>
                <h2 className="okt-h2">{o.paketeTitle}</h2>
                <p className="okt-lead">{o.paketeSubtitle}</p>
              </Reveal>
              <div className="okt-card-grid okt-card-grid-3">
                {pakete.map((p, i) => (
                  <Reveal key={p.name} delay={i * 0.07} className="okt-paket">
                    <h3>{p.name}</h3>
                    <p>{p.desc}</p>
                    <span className="okt-paket-price">{p.price}</span>
                  </Reveal>
                ))}
              </div>
              <Reveal as="p" className="okt-note">{o.paketeNote}</Reveal>
              <CtaRow center />
            </div>
          </section>

          {/* RESERVIEREN */}
          <section className="okt-sec okt-reservieren" id="reservieren">
            <div className="okt-wrap">
              <Reveal className="okt-sec-head">
                <span className="okt-eyebrow okt-eyebrow-line">{o.reserveButton}</span>
                <h2 className="okt-h2">{o.ctaTitle}</h2>
                <p className="okt-lead">{o.ctaDesc}</p>
              </Reveal>
              <Reveal delay={0.08} className="okt-booking">
                <ReservationBooking headingLevel="h3" onBook={() => fireLead("oktoberfest_reservierung")} />
              </Reveal>
            </div>
          </section>

          {/* HOTELS */}
          <section className="okt-sec okt-hotels">
            <div className="okt-wrap">
              <Reveal className="okt-sec-head">
                <span className="okt-eyebrow okt-eyebrow-line">🏨 In der Nähe</span>
                <h2 className="okt-h2">{o.hotelTitle}</h2>
                <p className="okt-lead">{o.hotelSubtitle}</p>
              </Reveal>
              <div className="okt-card-grid okt-card-grid-3">
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
          <section className="okt-sec okt-route">
            <div className="okt-wrap">
              <Reveal className="okt-sec-head">
                <span className="okt-eyebrow okt-eyebrow-line">🚶 Zur Wiesn</span>
                <h2 className="okt-h2">{o.wiesnRouteTitle}</h2>
                <p className="okt-lead">{o.wiesnRouteIntro}</p>
              </Reveal>
              <div className="okt-card-grid okt-card-grid-3">
                {wiesnRoute.map((r, i) => (
                  <Reveal key={r.title} delay={i * 0.07} className="okt-route-card">
                    <span className="okt-route-ic">{r.icon}</span>
                    <h3>{r.title}</h3>
                    <p>{r.desc}</p>
                  </Reveal>
                ))}
              </div>
              <Reveal as="p" className="okt-note okt-note-center">{o.wiesnRouteNote}</Reveal>
            </div>
          </section>

          {/* ANFAHRT / LOCATION */}
          <section className="okt-sec okt-anfahrt">
            <div className="okt-wrap okt-anfahrt-grid">
              <Reveal className="okt-anfahrt-text">
                <span className="okt-eyebrow okt-eyebrow-line">📍 Standort</span>
                <h2 className="okt-h2">{o.locationTitle}</h2>
                <p className="okt-lead">{o.locationIntro}</p>
                <div className="okt-direct">
                  <a href="tel:+498951519696"><span className="ic"><Phone size={18} /></span><span><b>{o.addressTitle}</b>Ristorante STORIA · Karlstraße 47a, 80333 München</span></a>
                  <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer" onClick={() => fireLead("oktoberfest_whatsapp")}><span className="ic"><MessageCircle size={18} /></span><span><b>WhatsApp</b>089 51519696</span></a>
                  <a href="https://maps.google.com/?q=Ristorante+Storia+Karlstra%C3%9Fe+47a+M%C3%BCnchen" target="_blank" rel="noopener noreferrer"><span className="ic"><MapPin size={18} /></span><span><b>{o.nearbyWiesn}</b>{o.nearbyHbf} · {o.nearbyKoenigsplatz}</span></a>
                </div>
              </Reveal>
              <Reveal delay={0.1} className="okt-map-card">
                <ConsentGoogleMaps src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d11.5658!3d48.1465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKarlstra%C3%9Fe%2047a%2C%2080333%20M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1" title="STORIA · Karlstraße 47a, München" height={420} className="okt-map-iframe" />
              </Reveal>
            </div>
          </section>

          {/* FAQ */}
          <section className="okt-sec okt-faq">
            <div className="okt-wrap">
              <Reveal className="okt-sec-head">
                <span className="okt-eyebrow okt-eyebrow-line">FAQ</span>
                <h2 className="okt-h2">{o.faqTitle}</h2>
              </Reveal>
              <div className="okt-faq-list">
                {faqItems.map((item, i) => (
                  <Reveal key={item.q} delay={(i % 3) * 0.06} className="okt-faq-item">
                    <h3>{item.q}</h3>
                    <p><PhoneText>{item.a}</PhoneText></p>
                  </Reveal>
                ))}
              </div>
              <CtaRow center />
              <img src={storiaLogo} alt="STORIA Logo" className="okt-foot-logo" loading="lazy" />
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

const oktStyles = `
.okt-page{
  --ink:#16110a;--ink-2:#1f1810;--bone:hsl(40 42% 93%);
  --amber:#cf8a36;--gold:#eab64e;--rust:#a8431f;
  --bavaria:#1768b0;--green:#2f8f50;--red:#cf3a31;
  --line:rgba(244,236,224,.14);--maxw:1180px;--mono:ui-monospace,'SF Mono',Menlo,Consolas,monospace;
  background:var(--ink);color:var(--bone);overflow-x:hidden;
}
.okt-page ::selection{background:var(--gold);color:var(--ink);}
.okt-wrap{max-width:var(--maxw);margin:0 auto;padding:0 28px;}
.okt-page h1,.okt-page h2,.okt-page h3{font-family:'Cormorant Garamond',Georgia,serif;font-weight:600;line-height:1.06;letter-spacing:-.01em;}
.okt-eyebrow{font-size:13px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);display:inline-flex;align-items:center;gap:8px;}
.okt-eyebrow-line::before{content:"";width:30px;height:1px;background:var(--gold);}
/* NAV */
.okt-nav{position:fixed;inset:0 0 auto 0;z-index:1000;display:flex;align-items:center;justify-content:space-between;padding:18px 28px;transition:background .4s,padding .4s,border-color .4s;border-bottom:1px solid transparent;}
.okt-nav.scrolled{background:rgba(20,15,9,.93);backdrop-filter:blur(10px);padding:11px 28px;border-bottom:1px solid var(--line);}
.okt-brand{font-family:'Cormorant Garamond',serif;font-size:25px;letter-spacing:.04em;color:var(--bone);text-decoration:none;}
.okt-brand span{color:var(--gold);}
.okt-nav-right{display:flex;align-items:center;gap:16px;}
.okt-nav-icon{display:inline-flex;color:var(--bone);opacity:.78;transition:opacity .2s,color .2s;}
.okt-nav-icon:hover{opacity:1;}
.okt-nav-wa:hover{color:#25D366;}
.okt-nav-sep{width:1px;height:20px;background:var(--line);}
.okt-nav-lang{display:flex;align-items:center;}
.okt-nav-cta{background:var(--amber);color:var(--ink);padding:10px 20px;border-radius:100px;font-weight:700;font-size:14px;text-decoration:none;transition:transform .2s,background .2s;white-space:nowrap;}
.okt-nav-cta:hover{transform:translateY(-1px);background:var(--gold);}
@media(max-width:760px){.okt-nav-icon{display:none;}.okt-nav-sep{display:none;}}
/* HERO */
.okt-hero{position:relative;min-height:100vh;display:flex;align-items:flex-end;padding:128px 0 64px;overflow:hidden;background:var(--ink);}
.okt-hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.52;}
.okt-hero-overlay{position:absolute;inset:0;background:radial-gradient(120% 90% at 82% 0%,rgba(234,182,78,.22),transparent 55%),radial-gradient(90% 70% at 0% 100%,rgba(23,104,176,.28),transparent 60%),linear-gradient(180deg,rgba(16,11,7,.55),rgba(18,13,8,.82) 52%,rgba(12,8,5,.97));}
.okt-hero-inner{position:relative;z-index:3;width:100%;}
.okt-h1{font-size:clamp(2.7rem,7vw,5.6rem);max-width:16ch;margin:22px 0 18px;color:var(--bone);}
.okt-hero-sub{font-size:clamp(1.15rem,2vw,1.5rem);color:var(--gold);font-family:'Cormorant Garamond',serif;font-style:italic;margin-bottom:14px;}
.okt-hero-lead{font-size:clamp(1.02rem,1.6vw,1.18rem);max-width:58ch;color:rgba(244,236,224,.84);margin-bottom:32px;line-height:1.55;}
.okt-actions{display:flex;gap:14px;flex-wrap:wrap;}
.okt-actions-center{justify-content:center;margin-top:34px;}
.okt-btn{display:inline-flex;align-items:center;gap:10px;text-decoration:none;font-weight:700;font-size:15px;padding:15px 28px;border-radius:100px;transition:transform .2s,box-shadow .2s,background .2s,border-color .2s;cursor:pointer;}
.okt-btn-primary{background:var(--amber);color:var(--ink);box-shadow:0 12px 40px -12px rgba(207,138,54,.7);}
.okt-btn-primary:hover{transform:translateY(-2px);background:var(--gold);}
.okt-btn-ghost{color:var(--bone);border:1px solid var(--line);background:rgba(244,236,224,.04);}
.okt-btn-ghost:hover{border-color:var(--gold);transform:translateY(-2px);}
.okt-btn-sm{padding:12px 22px;font-size:14px;margin-top:22px;}
.okt-trust{display:flex;align-items:center;gap:5px;margin-top:26px;color:rgba(244,236,224,.7);font-size:.92rem;font-family:var(--mono);}
.okt-trust .okt-star{color:var(--gold);fill:var(--gold);}
.okt-trust span{margin-left:8px;}
/* RAUTEN-Band (bayerisch Blau-Weiß) */
.okt-rauten{position:absolute;left:0;right:0;bottom:0;height:16px;z-index:4;background-color:#fff;background-image:linear-gradient(135deg,var(--bavaria) 25%,transparent 25%),linear-gradient(225deg,var(--bavaria) 25%,transparent 25%),linear-gradient(315deg,var(--bavaria) 25%,transparent 25%),linear-gradient(45deg,var(--bavaria) 25%,transparent 25%);background-position:-14px 0,-14px 0,0 0,0 0;background-size:28px 28px;background-repeat:repeat;opacity:.92;}
/* STRIP */
.okt-strip{background:var(--ink-2);border-bottom:1px solid var(--line);}
.okt-strip-inner{display:flex;flex-wrap:wrap;justify-content:center;gap:18px 40px;padding:18px 28px;}
.okt-strip span{display:inline-flex;align-items:center;gap:9px;font-size:.94rem;color:rgba(244,236,224,.82);}
.okt-strip svg{color:var(--gold);}
/* SECTION */
.okt-sec{padding:clamp(60px,7.5vw,108px) 0;}
.okt-sec-head{max-width:64ch;margin-bottom:42px;}
.okt-h2{font-size:clamp(2rem,4.6vw,3.3rem);margin:14px 0 0;}
.okt-h3big{font-size:clamp(1.5rem,3vw,2.1rem);margin:0 0 14px;}
.okt-lead{font-size:1.1rem;color:rgba(244,236,224,.8);max-width:62ch;margin-top:18px;line-height:1.6;}
.okt-subhead{font-size:1.45rem;color:var(--bone);margin:40px 0 20px;}
.okt-inline-link{color:var(--gold);text-decoration:underline;text-underline-offset:3px;}
.okt-inline-link:hover{color:var(--bone);}
.okt-crosslink{font-size:1rem;color:rgba(244,236,224,.72);}
.okt-note{margin-top:26px;font-family:var(--mono);font-size:.84rem;color:rgba(244,236,224,.5);line-height:1.6;}
.okt-note-center{text-align:center;max-width:66ch;margin-left:auto;margin-right:auto;}
/* INTRO + KONZEPT */
.okt-intro{background:var(--ink);}
.okt-concept-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:44px;}
@media(max-width:760px){.okt-concept-grid{grid-template-columns:1fr;}}
.okt-concept{border:1px solid var(--line);border-radius:18px;padding:28px 26px;background:linear-gradient(180deg,rgba(244,236,224,.05),rgba(244,236,224,.02));transition:transform .3s,border-color .3s;}
.okt-concept:hover{transform:translateY(-4px);border-color:rgba(234,182,78,.5);}
.okt-concept-ic{font-size:1.9rem;}
.okt-concept h3{font-size:1.45rem;margin:14px 0 8px;color:var(--bone);}
.okt-concept p{color:rgba(244,236,224,.76);line-height:1.55;}
/* ITALIENER-WOCHENENDE */
.okt-iweekend{background:var(--ink-2);}
.okt-iweekend-card{position:relative;border:1px solid var(--line);border-radius:22px;padding:44px 40px;background:radial-gradient(90% 120% at 100% 0%,rgba(47,143,80,.12),transparent 55%),radial-gradient(80% 120% at 0% 100%,rgba(207,58,49,.12),transparent 55%),rgba(244,236,224,.03);overflow:hidden;}
.okt-tricolore{position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,var(--green) 0 33.3%,#f4ece0 33.3% 66.6%,var(--red) 66.6% 100%);}
.okt-iweekend-badge{display:inline-block;background:var(--amber);color:var(--ink);font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:6px 14px;border-radius:100px;margin-bottom:16px;}
.okt-iweekend-date{color:var(--gold);font-weight:700;margin-top:10px;font-size:1.05rem;}
/* CARD GRIDS */
.okt-card-grid{display:grid;gap:16px;}
.okt-card-grid-3{grid-template-columns:repeat(3,1fr);}
.okt-card-grid-2{grid-template-columns:repeat(2,1fr);}
@media(max-width:880px){.okt-card-grid-3{grid-template-columns:repeat(2,1fr);}}
@media(max-width:600px){.okt-card-grid-3,.okt-card-grid-2{grid-template-columns:1fr;}}
.okt-card{position:relative;border:1px solid var(--line);border-radius:16px;padding:24px 22px;background:linear-gradient(180deg,rgba(244,236,224,.05),rgba(244,236,224,.02));overflow:hidden;transition:transform .3s,border-color .3s;display:flex;flex-direction:column;}
.okt-card::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--amber),var(--gold));}
.okt-card:hover{transform:translateY(-4px);border-color:rgba(234,182,78,.5);}
.okt-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;}
.okt-card-head h3{font-size:1.32rem;color:var(--bone);}
.okt-card p{color:rgba(244,236,224,.74);line-height:1.5;margin:10px 0 16px;flex-grow:1;}
.okt-price{font-family:var(--mono);font-size:1.05rem;font-weight:600;color:var(--gold);}
.okt-tag{font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:5px 10px;border-radius:8px;white-space:nowrap;background:rgba(234,182,78,.16);color:var(--gold);border:1px solid rgba(234,182,78,.3);}
.okt-tag-bay{background:rgba(23,104,176,.18);color:#7ab6ea;border-color:rgba(23,104,176,.4);}
.okt-tag-ita{background:rgba(47,143,80,.16);color:#6fce92;border-color:rgba(47,143,80,.4);}
.okt-bier{background:var(--ink-2);}
.okt-pizzen{background:var(--ink-2);}
/* PANELS (ital. karte + kinder) */
.okt-twocol{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
@media(max-width:820px){.okt-twocol{grid-template-columns:1fr;}}
.okt-panel{border:1px solid var(--line);border-radius:20px;padding:34px 32px;background:rgba(244,236,224,.03);}
/* WHY / ZIELGRUPPEN */
.okt-why{background:var(--ink-2);}
.okt-why-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
@media(max-width:820px){.okt-why-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:560px){.okt-why-grid{grid-template-columns:1fr;}}
.okt-why-item{border:1px solid var(--line);border-radius:16px;padding:26px 24px;background:rgba(244,236,224,.025);transition:transform .3s,border-color .3s;}
.okt-why-item:hover{transform:translateY(-4px);border-color:rgba(234,182,78,.45);}
.okt-why-ic{font-size:2rem;}
.okt-why-item h3{font-size:1.32rem;margin:12px 0 8px;color:var(--bone);}
.okt-why-item p{color:rgba(244,236,224,.74);line-height:1.55;}
/* PAKETE */
.okt-paket{border:1px solid var(--line);border-radius:18px;padding:30px 28px;background:linear-gradient(180deg,rgba(234,182,78,.07),rgba(244,236,224,.02));display:flex;flex-direction:column;transition:transform .3s,border-color .3s;}
.okt-paket:hover{transform:translateY(-4px);border-color:rgba(234,182,78,.55);}
.okt-paket h3{font-size:1.5rem;color:var(--bone);margin-bottom:10px;}
.okt-paket p{color:rgba(244,236,224,.76);line-height:1.55;flex-grow:1;margin-bottom:18px;}
.okt-paket-price{font-family:var(--mono);font-size:1.2rem;font-weight:700;color:var(--gold);}
/* RESERVIEREN */
.okt-reservieren{background:var(--bone);color:var(--ink);}
.okt-reservieren .okt-eyebrow{color:var(--rust);}
.okt-reservieren .okt-eyebrow-line::before{background:var(--rust);}
.okt-reservieren .okt-h2{color:var(--ink);}
.okt-reservieren .okt-lead{color:rgba(22,17,10,.74);}
.okt-booking{margin-top:8px;}
/* HOTELS */
.okt-hotels{background:var(--ink-2);}
.okt-hotel{border:1px solid var(--line);border-radius:16px;padding:24px 22px;background:rgba(244,236,224,.025);transition:transform .3s,border-color .3s;}
.okt-hotel:hover{transform:translateY(-3px);border-color:rgba(23,104,176,.5);}
.okt-hotel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:10px;}
.okt-hotel-head h3{font-size:1.22rem;color:var(--bone);}
.okt-hotel-time{font-family:var(--mono);font-size:.72rem;font-weight:600;color:var(--ink);background:var(--gold);padding:5px 9px;border-radius:7px;white-space:nowrap;}
.okt-hotel p{color:rgba(244,236,224,.72);font-size:.95rem;line-height:1.5;}
/* ROUTE */
.okt-route-card{border:1px solid var(--line);border-radius:16px;padding:30px 26px;background:rgba(244,236,224,.03);text-align:center;transition:transform .3s,border-color .3s;}
.okt-route-card:hover{transform:translateY(-4px);border-color:rgba(234,182,78,.45);}
.okt-route-ic{font-size:2.3rem;}
.okt-route-card h3{font-size:1.35rem;margin:12px 0 8px;color:var(--bone);}
.okt-route-card p{color:rgba(244,236,224,.74);line-height:1.55;}
/* ANFAHRT */
.okt-anfahrt{background:radial-gradient(80% 120% at 100% 0%,rgba(234,182,78,.14),transparent 55%),linear-gradient(180deg,#160f0a,#1f160e);}
.okt-anfahrt-grid{display:grid;grid-template-columns:1fr 1fr;gap:52px;align-items:start;}
@media(max-width:880px){.okt-anfahrt-grid{grid-template-columns:1fr;gap:38px;}}
.okt-direct{margin-top:28px;display:flex;flex-direction:column;gap:14px;}
.okt-direct a{color:var(--bone);text-decoration:none;display:flex;align-items:center;gap:16px;font-size:1rem;line-height:1.4;}
.okt-direct a:hover{color:var(--gold);}
.okt-direct .ic{width:44px;height:44px;border-radius:12px;border:1px solid var(--line);display:grid;place-items:center;flex-shrink:0;}
.okt-direct b{display:block;font-size:.72rem;letter-spacing:.05em;text-transform:uppercase;color:rgba(244,236,224,.5);font-weight:700;margin-bottom:2px;}
.okt-map-card{border-radius:20px;overflow:hidden;border:1px solid var(--line);min-height:420px;}
.okt-map-iframe{display:block;width:100%;border-radius:20px;}
/* FAQ */
.okt-faq{background:var(--ink);}
.okt-faq-list{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
@media(max-width:780px){.okt-faq-list{grid-template-columns:1fr;}}
.okt-faq-item{border:1px solid var(--line);border-radius:16px;padding:26px 24px;background:rgba(244,236,224,.03);}
.okt-faq-item h3{font-size:1.18rem;color:var(--bone);margin-bottom:10px;}
.okt-faq-item p{font-size:.96rem;color:rgba(244,236,224,.76);line-height:1.6;}
.okt-foot-logo{display:block;height:52px;width:auto;margin:48px auto 0;opacity:.85;filter:brightness(0) invert(1);}
/* REVEAL */
.okt-reveal{opacity:0;transform:translateY(24px);transition:opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1);}
.okt-reveal.in{opacity:1;transform:none;}
@media(prefers-reduced-motion:reduce){.okt-reveal{opacity:1!important;transform:none!important;}}
`;

export default OktoberfestMuenchen;
