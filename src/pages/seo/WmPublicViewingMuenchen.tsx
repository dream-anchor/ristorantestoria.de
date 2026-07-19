import { useEffect, useRef, useState, type ReactNode } from "react";
import EmailLink, { EmailAddress } from "@/components/EmailLink";
import { PhoneText } from "@/lib/linkifyPhone";
import { Phone, Mail, MapPin, ArrowUpRight, Instagram, MessageCircle } from "lucide-react";
import { Helmet } from "@/lib/helmetAsync";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import ReservationBooking from "@/components/ReservationBooking";
import ConsentGoogleMaps from "@/components/ConsentGoogleMaps";
import LocalizedLink from "@/components/LocalizedLink";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { useAlternateLinks } from "@/contexts/AlternateLinksContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedPath } from "@/config/routes";
import { isWmActive, isWmFilmfestOverlap } from "@/config/seasonalFlags";
import { wmContent } from "./wmContent";
import { wmSpieleUpcoming, wmSpielePast, wmWeekday, wmDateLabel, wmKickoff, wmRundeLabel, wmHinweisLabel, wmErgebnisLabel, buildWmEventSchema } from "./wmSpiele";
import storiaLogo from "@/assets/storia-logo.webp";
import heroImg from "@/assets/wm-2026-public-viewing-terrasse-storia-muenchen.webp";
import heroImg600 from "@/assets/wm-2026-public-viewing-terrasse-storia-muenchen-600w.webp";
import innenImg from "@/assets/wm-2026-fussball-uebertragung-innen-storia-muenchen.webp";
import innenImg600 from "@/assets/wm-2026-fussball-uebertragung-innen-storia-muenchen-600w.webp";

const OG_IMAGE = "https://www.ristorantestoria.de/wm-2026-public-viewing-muenchen-og.jpg";
const OG_IMAGE_ALT = "Public Viewing auf der überdachten Terrasse im STORIA München";

/**
 * Public-Viewing-Event-Knoten, abgeleitet aus der einzigen Datenquelle wmSpiele.ts.
 * Damit sind Karten und Schema dauerhaft synchron. FIFA-neutral, Teamnamen deutsch.
 */
const WM_EVENTS = buildWmEventSchema(OG_IMAGE);

/** GA4 Conversion-Event: generate_lead — gleiche Implementierung wie FilmfestInquiryForm. */
const fireLead = (formName: string) => {
  if (
    typeof window !== "undefined" &&
    typeof (window as Window & { gtag?: (...args: unknown[]) => void }).gtag === "function"
  ) {
    (window as Window & { gtag: (...args: unknown[]) => void }).gtag("event", "generate_lead", {
      form_name: formName,
      page_path: window.location.pathname,
      value: 80,
      currency: "EUR",
    });
  }
};

/** Lightweight scroll reveal — SSR-safe (content always in DOM). */
const Reveal = ({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = Tag as any;
  return (
    <Component
      ref={ref as any}
      className={`wm-reveal ${visible ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </Component>
  );
};

/** Kompakter Reservierungs-CTA nach den einzelnen Inhaltsblöcken – springt zum Buchungsbereich. */
const WmBlockCta = ({ label }: { label: string }) => (
  <Reveal className="wm-blockcta">
    <a href="#reservieren" className="wm-btn wm-btn-primary" onClick={() => fireLead("wm_reservierung")}>
      {label}
    </a>
  </Reveal>
);

const WmPublicViewingMuenchen = () => {
  usePrerenderReady(true);
  const [scrolled, setScrolled] = useState(false);
  const { setAlternates, clearAlternates } = useAlternateLinks();
  const { language } = useLanguage();
  const c = wmContent[language];
  // Cross-Link zur Filmfest-Seite nur im Überschneidungszeitraum (26.6.–5.7.2026).
  const showFilmfestCrossLink = isWmFilmfestOverlap();
  // Nach dem Finale (19.7.2026): Turnier vorbei → Spielplan durch Hinweis ersetzen,
  // Abschluss-Block einblenden, Event-JSON-LD nicht mehr ausgeben (BreadcrumbList bleibt).
  const wmActive = isWmActive();

  // Nächstes Spiel = erstes kommendes (Ergebnis gesetzt = gespielt, siehe wmSpiele.ts).
  // Rein datengetrieben (kein „jetzt"-Vergleich) → identisch bei SSR und Client, kein Hydration-Risiko.
  const nextId = wmSpieleUpcoming[0]?.id ?? null;

  // Mehrsprachige Seite: hreflang verweist für jede Sprache auf die lokalisierte WM-URL.
  useEffect(() => {
    setAlternates(
      (["de", "en", "it", "fr"] as const).map((l) => ({
        lang: l,
        url: getLocalizedPath("wm-2026-public-viewing-muenchen", l),
      }))
    );
    return () => clearAlternates();
  }, [setAlternates, clearAlternates]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <SEO
        title={c.seo.title}
        description={c.seo.description}
        canonical={getLocalizedPath("wm-2026-public-viewing-muenchen", language)}
        ogImage={OG_IMAGE}
      />
      <Helmet>
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={OG_IMAGE_ALT} />
        <meta name="twitter:image:alt" content={OG_IMAGE_ALT} />
        {/* Event-JSON-LD nur während des Turniers – nach dem Finale nicht mehr ausgeben. */}
        {wmActive &&
          WM_EVENTS.map((ev) => (
            <script type="application/ld+json" key={ev.name}>
              {JSON.stringify(ev)}
            </script>
          ))}
      </Helmet>
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Startseite", url: "https://www.ristorantestoria.de/" },
          { name: "WM 2026 Public Viewing München", url: "https://www.ristorantestoria.de/wm-2026-public-viewing-muenchen/" },
        ]}
      />
      <StructuredData type="faq" faqItems={c.faq.items} />

      {/* dangerouslySetInnerHTML statt {children}: verhindert SSR-Quote-Escaping
          im <style>-Rawtext → sonst Hydration-Mismatch (#425/#422). */}
      <style dangerouslySetInnerHTML={{ __html: wmStyles }} />

      <div className="wm-page">
        {/* NAV */}
        <nav className={`wm-nav ${scrolled ? "scrolled" : ""}`}>
          <LocalizedLink to="home" className="wm-brand" aria-label="STORIA">
            STORIA<span>.</span>
          </LocalizedLink>
          <div className="wm-nav-links">
            <a href="#angebot">{c.nav.angebot}</a>
            <a href="#spiele">{c.nav.spiele}</a>
            <a href="#turnier">{c.nav.turnier}</a>
            <a href="#reservieren" className="wm-nav-cta">{c.nav.reservieren}</a>
            <span className="wm-nav-sep" aria-hidden="true" />
            <a href="tel:+498951519696" className="wm-nav-icon" aria-label="Anrufen +49 89 51519696" title="+49 89 51519696">
              <Phone size={16} />
            </a>
            <EmailLink className="wm-nav-icon" aria-label="E-Mail an info@ristorantestoria.de" title="info@ristorantestoria.de">
              <Mail size={16} />
            </EmailLink>
            <a
              href="https://wa.me/491636033912"
              target="_blank"
              rel="noopener noreferrer"
              className="wm-nav-icon wm-nav-icon-wa"
              aria-label="WhatsApp"
              title="WhatsApp"
              onClick={() => fireLead("wm_whatsapp")}
            >
              <MessageCircle size={16} />
            </a>
            <a
              href="https://www.instagram.com/ristorante_storia/"
              target="_blank"
              rel="noopener noreferrer"
              className="wm-nav-icon"
              aria-label="Instagram @ristorante_storia"
              title="Instagram @ristorante_storia"
            >
              <Instagram size={16} />
            </a>
          </div>
          <div className="wm-nav-lang">
            <LanguageSwitcher />
          </div>
        </nav>

        {/* HERO */}
        <header className="wm-hero" id="top">
          <img
            src={heroImg}
            srcSet={`${heroImg600} 600w, ${heroImg} 1672w`}
            sizes="100vw"
            alt="Gäste verfolgen ein WM-Spiel auf der überdachten Terrasse des STORIA in der Karlstraße in München"
            className="wm-hero-img"
            loading="eager"
            fetchPriority="high"
          />
          <div className="wm-hero-overlay" />
          <div className="wm-wrap wm-hero-inner">
            <Reveal as="span" className="wm-eyebrow wm-eyebrow-line">
              {c.hero.eyebrow}
            </Reveal>
            <Reveal as="h1" delay={0.08} className="wm-h1">
              {c.hero.h1.pre}<em>{c.hero.h1.em}</em>{c.hero.h1.post}
            </Reveal>
            <Reveal as="p" delay={0.16} className="wm-hero-sub">
              {c.hero.sub}
            </Reveal>
            <Reveal delay={0.24} className="wm-hero-actions">
              <a href="#reservieren" className="wm-btn wm-btn-primary" onClick={() => fireLead("wm_reservierung")}>
                {c.hero.ctaReserve}
              </a>
              <a
                href="https://wa.me/491636033912"
                target="_blank"
                rel="noopener noreferrer"
                className="wm-btn wm-btn-ghost"
                onClick={() => fireLead("wm_whatsapp")}
              >
                <MessageCircle size={18} /> {c.hero.ctaWhatsapp}
              </a>
            </Reveal>
          </div>
        </header>

        {/* ABSCHLUSS – nur nach dem Finale (19.7.2026). Title/H1 der Seite bleiben unberührt. */}
        {!wmActive && (
          <section className="wm-sec wm-abschluss" id="abschluss">
            <div className="wm-wrap">
              <Reveal className="wm-sec-head">
                <span className="wm-eyebrow wm-eyebrow-line">{c.abschluss.eyebrow}</span>
                <h2 className="wm-h2">{c.abschluss.h2}</h2>
              </Reveal>
              <Reveal as="p" className="wm-lead">
                {c.abschluss.body}
              </Reveal>
              <Reveal className="wm-abschluss-links">
                <span className="wm-abschluss-lead">{c.abschluss.linksLead}</span>
                <LocalizedLink to="oktoberfest-muenchen" className="wm-inline-link">
                  {c.abschluss.linkOktoberfest}
                </LocalizedLink>
                <span className="wm-abschluss-sep" aria-hidden="true">·</span>
                <LocalizedLink to="terrasse-muenchen" className="wm-inline-link">
                  {c.abschluss.linkTerrasse}
                </LocalizedLink>
              </Reveal>
            </div>
          </section>
        )}

        {/* WAS LÄUFT */}
        <section className="wm-sec wm-angebot" id="angebot">
          <div className="wm-wrap wm-angebot-grid">
            <Reveal className="wm-angebot-text">
              <span className="wm-eyebrow wm-eyebrow-line">{c.angebot.eyebrow}</span>
              <h2 className="wm-h2">{c.angebot.h2}</h2>
              <ul className="wm-list">
                {c.angebot.items.map((a) => {
                  const idx = a.indexOf(c.angebot.menuPhrase);
                  if (idx === -1) return <li key={a}>{a}</li>;
                  return (
                    <li key={a}>
                      {a.slice(0, idx)}
                      <LocalizedLink to="speisekarte" className="wm-inline-link">
                        {c.angebot.menuPhrase}
                      </LocalizedLink>
                      {a.slice(idx + c.angebot.menuPhrase.length)}
                    </li>
                  );
                })}
              </ul>
              {showFilmfestCrossLink && (
                <p className="wm-crosslink">
                  {c.crossFilmfest.pre}
                  <LocalizedLink to="filmfest-muenchen" className="wm-inline-link">
                    {c.crossFilmfest.anchor}
                  </LocalizedLink>
                  {c.crossFilmfest.post}
                </p>
              )}
            </Reveal>
            <Reveal delay={0.1} className="wm-angebot-img">
              <img
                src={innenImg}
                srcSet={`${innenImg600} 600w, ${innenImg} 1672w`}
                sizes="(max-width: 900px) 100vw, 50vw"
                alt="WM-Übertragung im Innenraum des STORIA München mit Großbildleinwand"
                loading="lazy"
              />
            </Reveal>
          </div>
          <div className="wm-wrap">
            <WmBlockCta label={c.reservieren.ctaReserve} />
          </div>
        </section>

        {/* LONG-TAIL PROSA (public viewing maxvorstadt + Spieltag-Intent) */}
        {c.longtail && (
          <section className="wm-sec wm-longtail" id="public-viewing">
            <div className="wm-wrap">
              <Reveal className="wm-sec-head">
                <span className="wm-eyebrow wm-eyebrow-line">{c.longtail.eyebrow}</span>
                <h2 className="wm-h2">{c.longtail.h2}</h2>
              </Reveal>
              {c.longtail.blocks.map((b) => (
                <Reveal as="p" key={b.lead} className="wm-lead wm-longtail-p">
                  <strong>{b.lead}</strong> {b.body}
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* DIE GRÖSSTEN SPIELE · K.-O.-SLOTS */}
        <section className="wm-sec wm-spiele" id="spiele">
          <div className="wm-wrap">
            <Reveal className="wm-sec-head">
              <span className="wm-eyebrow wm-eyebrow-line">{c.spiele.eyebrow}</span>
              <h2 className="wm-h2">{c.spiele.h2}</h2>
            </Reveal>
            {wmActive ? (
              <>
            <div className="wm-match-grid">
              {wmSpieleUpcoming.map((s, i) => {
                const isNext = nextId === s.id;
                const cls = `wm-match${isNext ? " is-next" : ""}`;
                return (
                  <Reveal key={s.id} delay={i * 0.08} className={cls}>
                    <span className="wm-match-date">{wmWeekday(s.startISO, language)} · {wmDateLabel(s.startISO, language)}</span>
                    {s.teamA && s.teamB ? (
                      <div className="wm-match-teams">
                        <div className="wm-team">
                          <span className="flag" aria-hidden="true">{s.teamA.flag}</span>
                          <span className="name">{s.teamA.name[language]}</span>
                        </div>
                        <span className="wm-vs">{c.spiele.vs}</span>
                        <div className="wm-team">
                          <span className="flag" aria-hidden="true">{s.teamB.flag}</span>
                          <span className="name">{s.teamB.name[language]}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="wm-match-teams wm-match-round">
                        <span className="wm-round-label">{wmRundeLabel(s.runde, language)}</span>
                        <span className="wm-round-open">{c.spiele.offen}</span>
                      </div>
                    )}
                    <div className="wm-match-foot">
                      <span className="wm-kick">{wmKickoff(s.startISO)}<small>{c.spiele.mesz}</small></span>
                      <span className="wm-match-foot-r">
                        <span className="wm-where">{s.ort}</span>
                        {s.tv ? <span className="wm-tv">{s.tv}</span> : null}
                      </span>
                    </div>
                    {s.hinweis ? (
                      <p className="wm-match-hint">{wmHinweisLabel(s.hinweis, language)}</p>
                    ) : null}
                  </Reveal>
                );
              })}
            </div>
            <Reveal as="p" className="wm-note">
              {c.spiele.note}
            </Reveal>

            {wmSpielePast.length > 0 && (
              <Reveal className="wm-results">
                <h3 className="wm-results-head">{c.spiele.ergebnisseHead}</h3>
                <ul className="wm-results-list">
                  {wmSpielePast.map((s) => (
                    <li key={s.id} className="wm-result-row">
                      <span className="wm-result-date">{wmDateLabel(s.startISO, language)}</span>
                      <span className="wm-result-runde">{wmRundeLabel(s.runde, language)}</span>
                      {s.teamA && s.teamB && s.ergebnis ? (
                        <span className="wm-result-match">
                          <span className="flag" aria-hidden="true">{s.teamA.flag}</span>
                          {s.teamA.name[language]}
                          <span className="wm-result-score">{wmErgebnisLabel(s.ergebnis, language)}</span>
                          {s.teamB.name[language]}
                          <span className="flag" aria-hidden="true">{s.teamB.flag}</span>
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
              </>
            ) : (
              <Reveal as="p" className="wm-note wm-spiele-closed">
                {c.spieleClosed}
              </Reveal>
            )}
            <WmBlockCta label={c.reservieren.ctaReserve} />
          </div>
        </section>

        {/* TURNIER */}
        <section className="wm-sec wm-turnier" id="turnier">
          <div className="wm-wrap">
            <Reveal className="wm-sec-head">
              <span className="wm-eyebrow wm-eyebrow-line">{c.turnier.eyebrow}</span>
              <h2 className="wm-h2">{c.turnier.h2}</h2>
            </Reveal>
            <Reveal className="wm-timeline">
              <div className="wm-timeline-track" aria-hidden="true" />
              <ol className="wm-timeline-list">
                {c.turnier.items.map((t, i) => (
                  <li key={t.phase} className={i === c.turnier.items.length - 1 ? "is-final" : ""}>
                    <span className="dot" aria-hidden="true" />
                    <span className="phase">{t.phase}</span>
                    <span className="zeit">{t.zeit}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
            <WmBlockCta label={c.reservieren.ctaReserve} />
          </div>
        </section>

        {/* WM/EM-RHYTHMUS (evergreen, zahlt auf die spätere EM-2028-Umwidmung der Seite ein) */}
        <section className="wm-sec wm-zyklus" id="wm-em-zyklus">
          <div className="wm-wrap">
            <Reveal className="wm-sec-head">
              <span className="wm-eyebrow wm-eyebrow-line">{c.zyklus.eyebrow}</span>
              <h2 className="wm-h2">{c.zyklus.h2}</h2>
            </Reveal>
            {c.zyklus.blocks.map((b) => (
              <Reveal as="p" key={b.lead} className="wm-lead wm-zyklus-p">
                <strong>{b.lead}</strong> {b.body}
              </Reveal>
            ))}
          </div>
        </section>

        {/* RESERVIEREN */}
        <section className="wm-sec wm-reservieren" id="reservieren">
          <div className="wm-wrap">
            <Reveal className="wm-sec-head">
              <span className="wm-eyebrow wm-eyebrow-line">{c.reservieren.eyebrow}</span>
              <h2 className="wm-h2">{c.reservieren.h2}</h2>
              <p className="wm-lead">
                {c.reservieren.lead}
              </p>
            </Reveal>
            <Reveal delay={0.1} className="wm-booking">
              <ReservationBooking headingLevel="h3" onBook={() => fireLead("wm_reservierung")} />
            </Reveal>
            <Reveal delay={0.16} className="wm-hero-actions wm-actions-center">
              <LocalizedLink
                to="reservierung"
                className="wm-btn wm-btn-primary"
                onClick={() => fireLead("wm_reservierung")}
              >
                {c.reservieren.ctaReserve}
              </LocalizedLink>
              <a
                href="https://wa.me/491636033912"
                target="_blank"
                rel="noopener noreferrer"
                className="wm-btn wm-btn-ghost"
                onClick={() => fireLead("wm_whatsapp")}
              >
                <MessageCircle size={18} /> {c.reservieren.ctaWhatsapp}
              </a>
            </Reveal>
          </div>
        </section>

        {/* ANFAHRT */}
        <section className="wm-sec wm-anfahrt" id="anfahrt">
          <div className="wm-wrap wm-anfahrt-grid">
            <Reveal className="wm-anfahrt-text">
              <span className="wm-eyebrow wm-eyebrow-line">{c.anfahrt.eyebrow}</span>
              <h2 className="wm-h2">{c.anfahrt.h2}</h2>
              <p className="wm-lead">
                <PhoneText>{c.anfahrt.lead}</PhoneText>
              </p>
              <div className="wm-direct">
                <a href="tel:+498951519696">
                  <span className="ic"><Phone size={18} /></span>
                  <span><b>{c.anfahrt.callLabel}</b>{c.anfahrt.callSub}</span>
                </a>
                <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer" onClick={() => fireLead("wm_whatsapp")}>
                  <span className="ic"><MessageCircle size={18} /></span>
                  <span><b>{c.anfahrt.whatsappLabel}</b>{c.anfahrt.whatsappSub}</span>
                </a>
                <a href="https://maps.google.com/?q=Ristorante+Storia+Karlstra%C3%9Fe+47a+M%C3%BCnchen" target="_blank" rel="noopener noreferrer">
                  <span className="ic"><MapPin size={18} /></span>
                  <span><b>{c.anfahrt.directionsLabel}</b>{c.anfahrt.directionsSub}</span>
                </a>
                <a href="https://www.ristorantestoria.de" target="_blank" rel="noopener noreferrer">
                  <span className="ic"><ArrowUpRight size={18} /></span>
                  <span><b>{c.anfahrt.restaurantLabel}</b>{c.anfahrt.restaurantSub}</span>
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="wm-map-card">
              <ConsentGoogleMaps
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d11.5658!3d48.1465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKarlstra%C3%9Fe%2047a%2C%2080333%20M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1"
                title="STORIA · Karlstraße 47A, München"
                height={420}
                className="wm-map-iframe"
              />
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="wm-sec wm-faq-sec" id="faq">
          <div className="wm-wrap">
            <Reveal className="wm-sec-head">
              <span className="wm-eyebrow wm-eyebrow-line">{c.faq.eyebrow}</span>
              <h2 className="wm-h2">{c.faq.h2}</h2>
            </Reveal>
            <div className="wm-faq-list">
              {c.faq.items.map((item, i) => (
                <Reveal key={item.question} delay={(i % 3) * 0.06} className="wm-faq-item">
                  <h3>{item.question}</h3>
                  <p><PhoneText>{item.answer}</PhoneText></p>
                </Reveal>
              ))}
            </div>
            <p className="wm-disclaimer">
              {c.faq.disclaimer}
            </p>
            <img src={storiaLogo} alt="STORIA Logo" className="wm-foot-logo" loading="lazy" />
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

const wmStyles = `
.wm-page{
  --ink:#1a130d;--ink-2:#241a12;--bone:hsl(36 38% 92%);--amber:#d6892f;--amber-bright:#e8a14a;
  --rust:#a8431f;--line:rgba(244,236,224,.16);--line-dark:rgba(26,19,13,.14);--maxw:1200px;
  --green:#3fb950;--green-soft:#79d397;--mono:ui-monospace,'SF Mono',Menlo,Consolas,monospace;
  background:var(--ink);color:var(--bone);overflow-x:hidden;
}
.wm-page ::selection{background:var(--amber);color:var(--ink);}
.wm-wrap{max-width:var(--maxw);margin:0 auto;padding:0 28px;}
.wm-page h1,.wm-page h2,.wm-page h3{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;line-height:1.05;letter-spacing:-.01em;}
.wm-eyebrow{font-size:13px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--amber-bright);}
.wm-eyebrow-line{display:inline-flex;align-items:center;gap:12px;}
.wm-eyebrow-line::before{content:"";width:32px;height:1px;background:var(--amber-bright);}
/* NAV */
.wm-nav{position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;padding:18px 28px;background:rgba(26,19,13,0);transition:background .4s,padding .4s,border-color .4s;border-bottom:1px solid transparent;}
.wm-nav.scrolled{background:rgba(22,16,11,.92);backdrop-filter:blur(10px);padding:12px 28px;border-bottom:1px solid var(--line);}
.wm-brand{font-family:'Cormorant Garamond',serif;font-size:24px;letter-spacing:.04em;color:var(--bone);text-decoration:none;}
.wm-brand span{color:var(--amber-bright);}
.wm-nav-links{display:flex;gap:28px;align-items:center;}
.wm-nav-links a{color:var(--bone);text-decoration:none;font-size:14px;font-weight:500;opacity:.82;transition:opacity .2s;}
.wm-nav-links a:hover{opacity:1;}
.wm-nav-cta{background:var(--amber);color:var(--ink)!important;padding:10px 20px;border-radius:100px;font-weight:700;opacity:1!important;transition:transform .2s,background .2s;}
.wm-nav-cta:hover{transform:translateY(-1px);background:var(--amber-bright);}
.wm-nav-sep{width:1px;height:20px;background:var(--line);opacity:.6;}
.wm-nav-icon{display:inline-flex;align-items:center;justify-content:center;color:var(--bone);opacity:.78;transition:opacity .2s,color .2s;}
.wm-nav-icon:hover{opacity:1;}
.wm-nav-icon-wa:hover{color:#25D366;}
.wm-nav-lang{display:flex;align-items:center;margin-left:18px;}
@media(max-width:820px){.wm-nav-links a:not(.wm-nav-cta),.wm-nav-sep,.wm-nav-icon{display:none;}.wm-nav-lang{margin-left:12px;}}
/* HERO */
.wm-hero{position:relative;min-height:100vh;display:flex;align-items:flex-end;padding:120px 0 72px;overflow:hidden;background:var(--ink);}
.wm-hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.5;}
.wm-hero-overlay{position:absolute;inset:0;background:radial-gradient(120% 90% at 80% 0%,rgba(214,137,47,.2),transparent 55%),radial-gradient(90% 70% at 0% 100%,rgba(168,67,31,.32),transparent 60%),linear-gradient(180deg,rgba(16,11,7,.58),rgba(20,14,9,.82) 52%,rgba(12,8,5,.97));}
.wm-hero-inner{position:relative;z-index:3;width:100%;}
.wm-h1{font-size:clamp(2.6rem,6.6vw,5.4rem);max-width:18ch;margin:26px 0;color:var(--bone);}
.wm-h1 em{font-style:italic;color:var(--amber-bright);}
.wm-hero-sub{font-size:clamp(1.05rem,1.7vw,1.3rem);max-width:60ch;color:rgba(244,236,224,.85);margin-bottom:36px;}
.wm-hero-actions{display:flex;gap:16px;flex-wrap:wrap;}
.wm-actions-center{justify-content:center;margin-top:34px;}
.wm-btn{display:inline-flex;align-items:center;gap:10px;text-decoration:none;font-weight:700;font-size:15px;padding:16px 30px;border-radius:100px;transition:transform .2s,box-shadow .2s,background .2s;cursor:pointer;}
.wm-btn-primary{background:var(--amber);color:var(--ink);box-shadow:0 12px 40px -12px rgba(214,137,47,.6);}
.wm-btn-primary:hover{transform:translateY(-2px);background:var(--amber-bright);}
.wm-btn-ghost{color:var(--bone);border:1px solid var(--line);background:rgba(244,236,224,.04);}
.wm-btn-ghost:hover{border-color:var(--amber-bright);transform:translateY(-2px);}
/* SECTION */
.wm-sec{padding:clamp(64px,8vw,116px) 0;}
.wm-sec-head{max-width:62ch;margin-bottom:44px;}
.wm-h2{font-size:clamp(2rem,4.6vw,3.4rem);margin:16px 0 0;}
.wm-lead{font-size:1.12rem;color:rgba(244,236,224,.8);max-width:60ch;margin-top:20px;}
/* WAS LÄUFT */
.wm-angebot{background:var(--ink-2);}
.wm-angebot-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:center;}
@media(max-width:900px){.wm-angebot-grid{grid-template-columns:1fr;gap:36px;}}
.wm-list{list-style:none;margin:26px 0 0;padding:0;display:flex;flex-direction:column;gap:16px;}
.wm-list li{position:relative;padding-left:30px;font-size:1.06rem;color:rgba(244,236,224,.82);line-height:1.5;}
.wm-list li::before{content:"";position:absolute;left:0;top:.55em;width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at 30% 30%,var(--amber-bright),var(--rust));}
.wm-angebot-img{border-radius:20px;overflow:hidden;border:1px solid var(--line);}
.wm-angebot-img img{display:block;width:100%;height:100%;object-fit:cover;}
.wm-inline-link{color:var(--amber-bright);text-decoration:underline;text-underline-offset:3px;transition:color .2s;}
.wm-inline-link:hover{color:var(--bone);}
.wm-crosslink{margin-top:26px;font-size:1.02rem;color:rgba(244,236,224,.78);line-height:1.55;max-width:60ch;}
.wm-blockcta{display:flex;justify-content:center;margin-top:clamp(40px,5vw,60px);}
/* LONG-TAIL PROSA */
.wm-longtail{background:var(--ink);}
.wm-longtail-p{margin-top:24px;}
.wm-longtail-p:first-of-type{margin-top:8px;}
.wm-longtail-p strong{color:var(--amber-bright);font-weight:600;}
/* WM/EM-RHYTHMUS */
.wm-zyklus{background:var(--ink-2);}
.wm-zyklus-p{margin-top:24px;}
.wm-zyklus-p:first-of-type{margin-top:8px;}
.wm-zyklus-p strong{color:var(--amber-bright);font-weight:600;}
/* DEUTSCHE SPIELE */
.wm-spiele{background:var(--ink-2);}
.wm-match-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
@media(max-width:900px){.wm-match-grid{grid-template-columns:1fr;}}
.wm-match{position:relative;border:1px solid var(--line);border-radius:18px;padding:30px 28px 26px;background:linear-gradient(180deg,rgba(244,236,224,.05),rgba(244,236,224,.02));overflow:hidden;transition:transform .3s,border-color .3s;}
.wm-match::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--amber),var(--green));}
.wm-match:hover{transform:translateY(-4px);border-color:rgba(63,185,80,.5);}
.wm-match-date{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--amber-bright);}
.wm-match-teams{margin:22px 0 0;display:flex;flex-direction:column;gap:10px;}
.wm-team{display:flex;align-items:center;gap:12px;}
.wm-team .flag{font-size:1.7rem;line-height:1;}
.wm-team .name{font-size:1.4rem;font-weight:700;color:var(--bone);font-family:'Cormorant Garamond',serif;}
.wm-vs{font-size:.92rem;color:rgba(244,236,224,.45);padding-left:6px;}
.wm-match-round{gap:6px;}
.wm-round-label{font-size:1.7rem;font-weight:700;color:var(--bone);font-family:'Cormorant Garamond',serif;line-height:1.05;}
.wm-round-open{font-family:var(--mono);font-size:.74rem;letter-spacing:.05em;color:rgba(244,236,224,.5);}
.wm-match-foot{margin-top:24px;padding-top:20px;border-top:1px solid var(--line);display:flex;align-items:flex-end;justify-content:space-between;gap:14px;}
.wm-kick{font-family:var(--mono);font-size:1.9rem;font-weight:600;color:var(--green-soft);line-height:1;display:inline-flex;align-items:baseline;gap:7px;}
.wm-kick small{font-size:.66rem;letter-spacing:.1em;color:rgba(244,236,224,.45);font-weight:500;}
.wm-match-foot-r{display:flex;flex-direction:column;align-items:flex-end;gap:9px;}
.wm-where{font-family:var(--mono);font-size:.82rem;color:rgba(244,236,224,.6);}
.wm-tv{display:inline-block;font-family:var(--mono);font-size:.72rem;letter-spacing:.06em;color:rgba(244,236,224,.82);border:1px solid var(--line);border-radius:7px;padding:4px 10px;}
.wm-note{margin-top:26px;font-family:var(--mono);font-size:.86rem;color:rgba(244,236,224,.5);}
/* Karten-Hinweis (z. B. Anstoß außerhalb der Öffnungszeiten) */
.wm-match-hint{margin:14px 0 0;display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:.72rem;letter-spacing:.03em;color:var(--amber-bright);border-top:1px solid var(--line);padding-top:14px;}
.wm-match-hint::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--amber-bright);flex-shrink:0;box-shadow:0 0 8px 1px rgba(232,161,74,.6);}
/* Nächstes Spiel hervorgehoben (rein datengetrieben, kein "jetzt"-Vergleich) */
.wm-match.is-next{border-color:rgba(63,185,80,.6);box-shadow:0 0 0 1px rgba(63,185,80,.35),0 18px 50px -22px rgba(63,185,80,.55);}
/* Bereits gespielte Spiele: kompakte Ergebnisliste, klar abgesetzt von den kommenden Spielen */
.wm-results{margin-top:clamp(48px,6vw,72px);padding-top:32px;border-top:1px solid var(--line);}
.wm-results-head{font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:rgba(244,236,224,.5);margin:0 0 16px;}
.wm-results-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:1px;background:var(--line);border-radius:12px;overflow:hidden;}
.wm-result-row{display:flex;align-items:center;gap:14px;flex-wrap:wrap;background:rgba(244,236,224,.03);padding:11px 18px;font-size:.86rem;}
.wm-result-date{font-family:var(--mono);font-size:.72rem;color:rgba(244,236,224,.45);min-width:6.5em;}
.wm-result-runde{font-family:var(--mono);font-size:.68rem;letter-spacing:.04em;text-transform:uppercase;color:rgba(244,236,224,.4);min-width:9em;}
.wm-result-match{display:inline-flex;align-items:center;gap:8px;color:rgba(244,236,224,.85);font-weight:600;}
.wm-result-match .flag{font-size:1rem;}
.wm-result-score{font-family:var(--mono);font-weight:700;color:var(--green-soft);padding:0 2px;}
@media(max-width:640px){.wm-result-row{gap:6px 12px;}.wm-result-runde{min-width:0;}}
/* TURNIER */
.wm-turnier{background:var(--ink);}
.wm-timeline{position:relative;margin-top:14px;overflow-x:auto;padding-bottom:6px;}
.wm-timeline-track{position:absolute;top:7px;left:0;right:0;height:1px;background:var(--line);min-width:760px;}
.wm-timeline-list{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(7,minmax(118px,1fr));gap:0 18px;min-width:760px;}
.wm-timeline-list li{position:relative;padding-top:32px;}
.wm-timeline-list .dot{position:absolute;top:0;left:0;width:15px;height:15px;border-radius:50%;border:2px solid var(--rust);background:var(--ink);box-sizing:border-box;}
.wm-timeline-list .phase{display:block;font-family:'Cormorant Garamond',serif;font-size:1.4rem;color:var(--bone);line-height:1.1;}
.wm-timeline-list .zeit{display:block;margin-top:7px;font-family:var(--mono);font-size:.82rem;color:rgba(244,236,224,.55);}
.wm-timeline-list li.is-final .dot{border-color:var(--green);background:var(--green);box-shadow:0 0 14px 2px rgba(63,185,80,.7);}
.wm-timeline-list li.is-final .phase,.wm-timeline-list li.is-final .zeit{color:var(--green-soft);}
/* RESERVIEREN */
.wm-reservieren{background:var(--bone);color:var(--ink);}
.wm-reservieren .wm-eyebrow{color:var(--rust);}
.wm-reservieren .wm-eyebrow-line::before{background:var(--rust);}
.wm-reservieren .wm-h2{color:var(--ink);}
.wm-reservieren .wm-lead{color:rgba(26,19,13,.76);}
.wm-booking{margin-top:8px;}
.wm-reservieren .wm-btn-ghost{color:var(--rust);border-color:rgba(168,67,31,.4);background:rgba(168,67,31,.06);}
.wm-reservieren .wm-btn-ghost:hover{border-color:var(--rust);}
/* ANFAHRT */
.wm-anfahrt{background:radial-gradient(80% 120% at 100% 0%,rgba(214,137,47,.16),transparent 55%),linear-gradient(180deg,#160f0a,#1f160e);}
.wm-anfahrt-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start;}
@media(max-width:880px){.wm-anfahrt-grid{grid-template-columns:1fr;gap:40px;}}
.wm-direct{margin-top:30px;display:flex;flex-direction:column;gap:16px;}
.wm-direct a{color:var(--bone);text-decoration:none;display:flex;align-items:center;gap:16px;font-size:1.05rem;}
.wm-direct a:hover{color:var(--amber-bright);}
.wm-direct .ic{width:44px;height:44px;border-radius:12px;border:1px solid var(--line);display:grid;place-items:center;flex-shrink:0;}
.wm-direct b{display:block;font-size:.74rem;letter-spacing:.06em;text-transform:uppercase;color:rgba(244,236,224,.5);font-weight:600;}
.wm-map-card{border-radius:20px;overflow:hidden;border:1px solid var(--line);min-height:420px;position:relative;}
.wm-map-iframe{display:block;width:100%;border-radius:20px;}
/* FAQ */
.wm-faq-sec{background:var(--ink);}
.wm-faq-list{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
@media(max-width:780px){.wm-faq-list{grid-template-columns:1fr;}}
.wm-faq-item{border:1px solid var(--line);border-radius:18px;padding:28px 26px;background:rgba(244,236,224,.03);}
.wm-faq-item h3{font-size:1.2rem;color:var(--bone);margin-bottom:10px;}
.wm-faq-item p{font-size:.96rem;color:rgba(244,236,224,.76);line-height:1.6;}
.wm-disclaimer{margin-top:48px;padding-top:28px;border-top:1px solid var(--line);font-size:.82rem;color:rgba(244,236,224,.45);max-width:80ch;}
.wm-foot-logo{height:54px;width:auto;margin-top:24px;opacity:.85;filter:brightness(0) invert(1);}
/* ABSCHLUSS (nach dem Finale) */
.wm-abschluss{background:var(--ink-2);}
.wm-abschluss-links{margin-top:28px;display:flex;flex-wrap:wrap;align-items:center;gap:12px;}
.wm-abschluss-lead{font-size:1.02rem;color:rgba(244,236,224,.7);}
.wm-abschluss-sep{color:rgba(244,236,224,.35);}
.wm-spiele-closed{max-width:62ch;}
/* REVEAL */
.wm-reveal{opacity:0;transform:translateY(26px);transition:opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1);}
.wm-reveal.in{opacity:1;transform:none;}
@media(prefers-reduced-motion:reduce){.wm-reveal{opacity:1!important;transform:none!important;}}
`;

export default WmPublicViewingMuenchen;
