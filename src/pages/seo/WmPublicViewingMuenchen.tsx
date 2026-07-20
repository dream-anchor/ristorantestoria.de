import { useEffect, useRef, useState, type ReactNode } from "react";
import EmailLink from "@/components/EmailLink";
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
import SeasonalSignupForm from "@/components/SeasonalSignupForm";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { useAlternateLinks } from "@/contexts/AlternateLinksContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedPath } from "@/config/routes";
import { trackEvent } from "@/lib/analytics";
import { buildEventsAnfrageUrl } from "@/lib/eventsLinks";
import { wmContent } from "./wmContent";
import heroImg from "@/assets/wm-2026-public-viewing-terrasse-storia-muenchen.webp";
import heroImg600 from "@/assets/wm-2026-public-viewing-terrasse-storia-muenchen-600w.webp";

const SLUG = "public-viewing-muenchen";
const OG_IMAGE = "https://www.ristorantestoria.de/wm-2026-public-viewing-muenchen-og.jpg";
const OG_IMAGE_ALT = "Public Viewing auf der überdachten Terrasse im STORIA München";
const GRUPPEN_LINK = buildEventsAnfrageUrl({ utm_campaign: "public_viewing" });

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

  // Mehrsprachige Seite: hreflang verweist für jede Sprache auf die lokalisierte Public-Viewing-URL.
  useEffect(() => {
    setAlternates(
      (["de", "en", "it", "fr"] as const).map((l) => ({
        lang: l,
        url: getLocalizedPath(SLUG, l),
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
        canonical={getLocalizedPath(SLUG, language)}
        ogImage={OG_IMAGE}
      />
      <Helmet>
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={OG_IMAGE_ALT} />
        <meta name="twitter:image:alt" content={OG_IMAGE_ALT} />
      </Helmet>
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Startseite", url: "https://www.ristorantestoria.de/" },
          { name: "Public Viewing München", url: "https://www.ristorantestoria.de/public-viewing-muenchen/" },
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
            <a href="#rueckblick">{c.nav.rueckblick}</a>
            <a href="#ausblick">{c.nav.ausblick}</a>
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
            alt="Gäste verfolgen ein Fußballspiel auf der überdachten Terrasse des STORIA in der Karlstraße in München"
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
              {c.hero.intro}
            </Reveal>
            <Reveal delay={0.24} className="wm-hero-actions">
              <a href="#reservieren" className="wm-btn wm-btn-primary" onClick={() => fireLead("wm_reservierung")}>
                {c.hero.ctaReserve}
              </a>
            </Reveal>
          </div>
        </header>

        {/* RÜCKBLICK: WM 2026 */}
        <section className="wm-sec wm-prose-sec wm-rueckblick" id="rueckblick">
          <div className="wm-wrap">
            <Reveal className="wm-sec-head">
              <span className="wm-eyebrow wm-eyebrow-line">{c.rueckblick.eyebrow}</span>
              <h2 className="wm-h2">{c.rueckblick.h2}</h2>
            </Reveal>
            <Reveal as="p" className="wm-lead wm-prose-p">
              {c.rueckblick.body}
            </Reveal>
          </div>
        </section>

        {/* AUSBLICK: EM 2028 + ganzjährig Fußball */}
        <section className="wm-sec wm-prose-sec wm-ausblick" id="ausblick">
          <div className="wm-wrap">
            <Reveal className="wm-sec-head">
              <span className="wm-eyebrow wm-eyebrow-line">{c.ausblick.eyebrow}</span>
              <h2 className="wm-h2">{c.ausblick.h2}</h2>
            </Reveal>
            <Reveal as="p" className="wm-lead wm-prose-p">
              {c.ausblick.body}
            </Reveal>
            <Reveal as="p" className="wm-lead wm-prose-p">
              {c.ausblick.ganzjahr}
            </Reveal>
            <WmBlockCta label={c.ausblick.ctaReserve} />
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="wm-sec wm-newsletter" id="newsletter">
          <div className="wm-wrap">
            <Reveal className="wm-newsletter-card">
              <h2 className="wm-h2">{c.newsletter.h2}</h2>
              <p>{c.newsletter.body}</p>
              <div className="wm-newsletter-form">
                <SeasonalSignupForm seasonalEvent="public-viewing" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* GRUPPEN & FIRMEN */}
        <section className="wm-sec wm-gruppen" id="gruppen">
          <div className="wm-wrap">
            <Reveal className="wm-sec-head">
              <h2 className="wm-h2">{c.gruppen.h2}</h2>
            </Reveal>
            <Reveal as="p" className="wm-lead wm-prose-p">
              {c.gruppen.body}{" "}
              <a
                href={GRUPPEN_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="wm-inline-link"
                onClick={() => trackEvent("events_crosssell_click", { source: "public-viewing" })}
              >
                {c.gruppen.linkLabel}
              </a>
              .
            </Reveal>
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
              <p className="wm-anfahrt-crosslink">
                {c.anfahrt.hauptbahnhof.pre}
                <LocalizedLink to="italiener-hauptbahnhof-muenchen" className="wm-inline-link">
                  {c.anfahrt.hauptbahnhof.anchor}
                </LocalizedLink>
                {c.anfahrt.hauptbahnhof.post}
              </p>
            </Reveal>
            <Reveal delay={0.1} className="wm-map-card">
              <ConsentGoogleMaps
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d11.5658!3d48.1465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKarlstra%C3%9Fe%2047a%2C%2080333%20M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1"
                title="STORIA · Karlstraße 47a, München"
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
.wm-inline-link{color:var(--amber-bright);text-decoration:underline;text-underline-offset:3px;transition:color .2s;}
.wm-inline-link:hover{color:var(--bone);}
.wm-blockcta{display:flex;justify-content:center;margin-top:clamp(40px,5vw,60px);}
/* RÜCKBLICK / AUSBLICK (Prosa-Sektionen) */
.wm-rueckblick{background:var(--ink-2);}
.wm-ausblick{background:var(--ink);}
.wm-prose-p{margin-top:20px;}
.wm-prose-p:first-of-type{margin-top:0;}
/* NEWSLETTER */
.wm-newsletter{background:var(--ink-2);}
.wm-newsletter-card{max-width:560px;margin:0 auto;background:var(--bone);color:var(--ink);border-radius:20px;padding:clamp(36px,5vw,52px) clamp(28px,5vw,44px);text-align:center;}
.wm-newsletter-card .wm-h2{color:var(--ink);font-size:clamp(1.7rem,3vw,2.2rem);}
.wm-newsletter-card p{color:rgba(26,19,13,.72);margin:14px 0 30px;max-width:44ch;margin-left:auto;margin-right:auto;}
.wm-newsletter-form{text-align:left;}
/* GRUPPEN */
.wm-gruppen{background:var(--ink);}
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
.wm-anfahrt-crosslink{margin-top:26px;font-size:1rem;color:rgba(244,236,224,.78);line-height:1.55;max-width:44ch;}
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
/* REVEAL */
.wm-reveal{opacity:0;transform:translateY(26px);transition:opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1);}
.wm-reveal.in{opacity:1;transform:none;}
@media(prefers-reduced-motion:reduce){.wm-reveal{opacity:1!important;transform:none!important;}}
`;

export default WmPublicViewingMuenchen;
