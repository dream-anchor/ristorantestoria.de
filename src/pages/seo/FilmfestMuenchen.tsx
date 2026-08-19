import { useEffect, useRef, useState, type ReactNode } from "react";
import EmailLink, { EmailAddress } from "@/components/EmailLink";
import { PhoneText } from "@/lib/linkifyPhone";
import { Phone, Mail, MapPin, ArrowUpRight, Instagram, MessageCircle } from "lucide-react";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import MaestroWidget from "@/components/MaestroWidget";
import ConsentGoogleMaps from "@/components/ConsentGoogleMaps";
import LocalizedLink from "@/components/LocalizedLink";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { useAlternateLinks } from "@/contexts/AlternateLinksContext";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { getLocalizedPath } from "@/config/routes";
import { isWmFilmfestOverlap } from "@/config/seasonalFlags";
import { filmfestContent } from "./filmfestContent";
import storiaLogo from "@/assets/storia-logo.webp";
import heroImg from "@/assets/romantisches-dinner-kerzenlicht-storia-muenchen.webp";
import heroImg600 from "@/assets/romantisches-dinner-kerzenlicht-storia-muenchen-600w.webp";
import innenraumImg from "@/assets/ristorante-storia-uebersicht.webp";
import innenraumImg600 from "@/assets/ristorante-storia-uebersicht-600w.webp";
import terrasseImg from "@/assets/gaeste-terrasse-italiener-maxvorstadt-muenchen.webp";
import terrasseImg600 from "@/assets/gaeste-terrasse-italiener-maxvorstadt-muenchen-600w.webp";
import barImg from "@/assets/aperitivo-muenchen-italienische-bar-storia.webp";
import barImg600 from "@/assets/aperitivo-muenchen-italienische-bar-storia-600w.webp";

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
      className={`ff-reveal ${visible ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </Component>
  );
};

/** Mappt die Raum-Keys aus dem Content-Modul auf die Bild-Importe. */
const roomImages = {
  innenraum: { img: innenraumImg, img600: innenraumImg600 },
  terrasse: { img: terrasseImg, img600: terrasseImg600 },
  bar: { img: barImg, img600: barImg600 },
} as const;

const FilmfestMuenchen = () => {
  usePrerenderReady(true);
  const [scrolled, setScrolled] = useState(false);
  const { setAlternates, clearAlternates } = useAlternateLinks();
  const { language } = useLanguage();
  const c = filmfestContent[language];
  // WM-Cross-Link nur im Überschneidungszeitraum (26.6.–5.7.2026).
  const showWmCrossLink = isWmFilmfestOverlap();

  // Mehrsprachige Seite: alle vier Sprachen verweisen auf ihre lokalisierte
  // Filmfest-URL (self-referencing hreflang-Alternates).
  useEffect(() => {
    setAlternates(
      (["de", "en", "it", "fr"] as const).map((l: Language) => ({
        lang: l,
        url: getLocalizedPath("filmfest-muenchen", l),
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
        canonical={getLocalizedPath("filmfest-muenchen", language)}
      />
      <StructuredData type="restaurant" includeReviewList={false} />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Home", url: getLocalizedPath("home", language) },
          { name: c.breadcrumbLabel, url: getLocalizedPath("filmfest-muenchen", language) },
        ]}
      />
      <StructuredData type="faq" faqItems={c.faqItems} />
      <StructuredData
        type="event"
        eventData={{
          name: c.structuredEvent.name,
          description: c.structuredEvent.description,
          services: c.structuredEvent.services,
        }}
      />

      {/* dangerouslySetInnerHTML statt {children}: verhindert SSR-Quote-Escaping
          im <style>-Rawtext → sonst Hydration-Mismatch (#425/#422). */}
      <style dangerouslySetInnerHTML={{ __html: ffStyles }} />

      <div className="ff-page">
        {/* NAV */}
        <nav className={`ff-nav ${scrolled ? "scrolled" : ""}`}>
          <LocalizedLink to="home" className="ff-brand" aria-label={c.nav.brandAria}>
            STORIA<span>.</span>
          </LocalizedLink>
          <div className="ff-nav-links">
            <a href="#formate">{c.nav.formate}</a>
            <a href="#lage">{c.nav.lage}</a>
            <a href="#raeume">{c.nav.raeume}</a>
            <a href="#catering">{c.nav.catering}</a>
            <a href="#kontakt" className="ff-nav-cta">{c.nav.cta}</a>
            <span className="ff-nav-sep" aria-hidden="true" />
            <a
              href="tel:+498951519696"
              className="ff-nav-icon"
              aria-label="Anrufen +49 89 51519696"
              title="+49 89 51519696"
            >
              <Phone size={16} />
            </a>
            <EmailLink
              className="ff-nav-icon"
              aria-label="E-Mail an info@ristorantestoria.de"
              title="info@ristorantestoria.de"
            >
              <Mail size={16} />
            </EmailLink>
            <a
              href="https://wa.me/491636033912"
              target="_blank"
              rel="noopener noreferrer"
              className="ff-nav-icon ff-nav-icon-wa"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <MessageCircle size={16} />
            </a>
            <a
              href="https://www.instagram.com/ristorante_storia/"
              target="_blank"
              rel="noopener noreferrer"
              className="ff-nav-icon"
              aria-label="Instagram @ristorante_storia"
              title="Instagram @ristorante_storia"
            >
              <Instagram size={16} />
            </a>
          </div>
          <div className="ff-nav-lang">
            <LanguageSwitcher />
          </div>
        </nav>

        {/* HERO */}
        <header className="ff-hero" id="top">
          <img
            src={heroImg}
            srcSet={`${heroImg600} 600w, ${heroImg} 1400w`}
            sizes="100vw"
            alt={c.hero.heroImgAlt}
            className="ff-hero-img"
            loading="eager"
            fetchPriority="high"
          />
          <div className="ff-hero-overlay" />
          <div className="ff-sprocket l" aria-hidden="true" />
          <div className="ff-sprocket r" aria-hidden="true" />
          <div className="ff-wrap ff-hero-inner">
            <Reveal as="span" className="ff-eyebrow ff-eyebrow-line">
              {c.hero.eyebrow}
            </Reveal>
            <Reveal as="h1" delay={0.08} className="ff-h1">
              {c.hero.h1Pre}<em>{c.hero.h1Em}</em>
            </Reveal>
            <Reveal as="p" delay={0.16} className="ff-hero-sub">
              {c.hero.sub}
            </Reveal>
            <Reveal delay={0.24} className="ff-hero-actions">
              <a href="#kontakt" className="ff-btn ff-btn-primary">{c.hero.btnPrimary}</a>
              <a href="#formate" className="ff-btn ff-btn-ghost">{c.hero.btnGhost}</a>
            </Reveal>
          </div>
        </header>

        {/* STATS */}
        <section className="ff-stats">
          <div className="ff-stats-grid">
            {c.stats.map((s, i) => (
              <Reveal key={s.n + i} delay={i * 0.08} className="ff-stat">
                <div className="n">{s.n}</div>
                <div className="l">{s.l}</div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* DEFINITION-LEAD (GEO) */}
        <section className="ff-sec ff-intro">
          <div className="ff-wrap">
            <Reveal as="p" className="ff-intro-lead">
              {c.intro.pre}
              <a href="https://www.filmfest-muenchen.de/" target="_blank" rel="noopener noreferrer">
                {c.intro.linkLabel}
              </a>
              {c.intro.post}
            </Reveal>
          </div>
        </section>

        {/* FORMATE */}
        <section className="ff-sec ff-formate" id="formate">
          <div className="ff-wrap">
            <Reveal className="ff-sec-head">
              <span className="ff-eyebrow ff-eyebrow-line">{c.formateSection.eyebrow}</span>
              <h2 className="ff-h2">{c.formateSection.h2}</h2>
              <p className="ff-lead">{c.formateSection.lead}</p>
            </Reveal>
            <div className="ff-cards">
              {c.formate.map((f, i) => (
                <Reveal key={f.num} delay={(i % 3) * 0.08} className="ff-card">
                  <span className="ff-card-num">{f.num}</span>
                  <h3 className="ff-card-h">{f.title}</h3>
                  <p>{f.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* LAGE */}
        <section className="ff-sec ff-lage" id="lage">
          <div className="ff-wrap">
            <Reveal className="ff-sec-head">
              <span className="ff-eyebrow ff-eyebrow-line">{c.lageSection.eyebrow}</span>
              <h2 className="ff-h2">{c.lageSection.h2}</h2>
              <p className="ff-lead">{c.lageSection.lead}</p>
            </Reveal>
            <div className="ff-lage-grid">
              <Reveal as="ul" className="ff-route">
                {c.route.map((r) => (
                  <li key={r.place}>
                    <div className="min">{r.min}<small>{c.minLabel}</small></div>
                    <div className="place"><b>{r.place}</b><span>{r.sub}</span></div>
                  </li>
                ))}
              </Reveal>
              <Reveal delay={0.1} className="ff-map-card">
                <ConsentGoogleMaps
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d11.5658!3d48.1465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKarlstra%C3%9Fe%2047a%2C%2080333%20M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1"
                  title={c.mapTitle}
                  height={420}
                  className="ff-map-iframe"
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* RÄUME */}
        <section className="ff-sec ff-raeume" id="raeume">
          <div className="ff-wrap">
            <Reveal className="ff-sec-head">
              <span className="ff-eyebrow ff-eyebrow-line">{c.raeumeSection.eyebrow}</span>
              <h2 className="ff-h2">{c.raeumeSection.h2}</h2>
              <p className="ff-lead">{c.raeumeSection.lead}</p>
            </Reveal>
            <div className="ff-room-grid">
              {c.rooms.map((room, i) => {
                const imgs = roomImages[room.key];
                return (
                  <Reveal key={room.key} delay={i * 0.08} className="ff-room">
                    <div className="ff-room-img">
                      <img
                        src={imgs.img}
                        srcSet={`${imgs.img600} 600w, ${imgs.img} 1400w`}
                        sizes="(max-width: 900px) 100vw, 33vw"
                        alt={room.alt}
                        loading="lazy"
                      />
                    </div>
                    <div className="ff-room-body">
                      <h3>{room.title}</h3>
                      <div className="cap">{room.cap}</div>
                      <p>{room.text}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
            <Reveal className="ff-scenario">
              <table>
                <thead>
                  <tr><th>{c.scenarioHead.format}</th><th>{c.scenarioHead.seating}</th><th>{c.scenarioHead.guests}</th></tr>
                </thead>
                <tbody>
                  {c.scenario.map((row) => (
                    <tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </div>
        </section>

        {/* CATERING */}
        <section className="ff-sec ff-cater" id="catering">
          <div className="ff-wrap">
            <Reveal className="ff-sec-head">
              <span className="ff-eyebrow ff-eyebrow-line">{c.cateringSection.eyebrow}</span>
              <h2 className="ff-h2">{c.cateringSection.h2}</h2>
              <p className="ff-lead">{c.cateringSection.lead}</p>
            </Reveal>
            <div className="ff-menu-grid">
              {c.menuCards.map((card, i) => (
                <Reveal key={card.title} delay={i * 0.08} className="ff-menu-card">
                  <span className="tag">{card.tag}</span>
                  <h3>{card.title}</h3>
                  <ul>
                    {card.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.12} className="ff-chips">
              {c.chips.map((chip) => (
                <span key={chip} className="ff-chip">{chip}</span>
              ))}
            </Reveal>
            <Reveal as="p" delay={0.16} className="ff-outbound">
              {c.outbound.menuPre}
              <LocalizedLink to="speisekarte">{c.outbound.menuAnchor}</LocalizedLink>
              {c.outbound.menuMid}
              <LocalizedLink to="reservierung">{c.outbound.reservAnchor}</LocalizedLink>
              {c.outbound.reservPost}
              {showWmCrossLink && (
                <>
                  {" "}
                  {c.outbound.crossWmPre}
                  <LocalizedLink to="wm-2026-public-viewing-muenchen">
                    {c.outbound.crossWmAnchor}
                  </LocalizedLink>
                  {c.outbound.crossWmPost}
                </>
              )}
            </Reveal>
          </div>
        </section>

        {/* ABLAUF */}
        <section className="ff-sec ff-ablauf">
          <div className="ff-wrap">
            <Reveal className="ff-sec-head">
              <span className="ff-eyebrow ff-eyebrow-line">{c.ablaufSection.eyebrow}</span>
              <h2 className="ff-h2">{c.ablaufSection.h2}</h2>
            </Reveal>
            <div className="ff-steps">
              {c.steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.08} className="ff-step">
                  <div className="n">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* KONTAKT */}
        <section className="ff-sec ff-kontakt" id="kontakt">
          <div className="ff-wrap ff-k-grid">
            <Reveal className="ff-k-left">
              <span className="ff-urgency"><span className="pulse" />{c.kontakt.urgency}</span>
              <h2 className="ff-h2">{c.kontakt.h2}</h2>
              <p className="ff-lead">{c.kontakt.lead}</p>
              <div className="ff-direct">
                <a href="tel:+498951519696"><span className="ic"><Phone size={18} /></span><span><b>{c.kontakt.callLabel}</b>+49 89 51519696</span></a>
                <EmailLink subject={c.kontakt.mailSubject}><span className="ic"><Mail size={18} /></span><span><b>{c.kontakt.mailLabel}</b><EmailAddress /></span></EmailLink>
                <a href="https://www.events-storia.de" target="_blank" rel="noopener noreferrer"><span className="ic"><ArrowUpRight size={18} /></span><span><b>{c.kontakt.platformLabel}</b>events-storia.de</span></a>
                <a href="https://maps.google.com/?q=Ristorante+Storia+Karlstra%C3%9Fe+47a+M%C3%BCnchen" target="_blank" rel="noopener noreferrer"><span className="ic"><MapPin size={18} /></span><span><b>{c.kontakt.directionsLabel}</b>{c.kontakt.directionsValue}</span></a>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <MaestroWidget widgetId="54621f68-6849-485a-92e4-04ad9a69524e" />
            </Reveal>
          </div>
          <div className="ff-wrap ff-faq" id="faq">
            <Reveal className="ff-sec-head">
              <span className="ff-eyebrow ff-eyebrow-line">{c.faqSection.eyebrow}</span>
              <h2 className="ff-h2">{c.faqSection.h2}</h2>
            </Reveal>
            <div className="ff-faq-list">
              {c.faqItems.map((item, i) => (
                <Reveal key={item.question} delay={(i % 3) * 0.06} className="ff-faq-item">
                  <h3>{item.question}</h3>
                  <p><PhoneText>{item.answer}</PhoneText></p>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="ff-wrap">
            <p className="ff-disclaimer">
              {c.disclaimerPre}
              <a href="https://www.filmfest-muenchen.de/" target="_blank" rel="noopener noreferrer">
                {c.disclaimerLinkLabel}
              </a>
              {c.disclaimerPost}
            </p>
            <img src={storiaLogo} alt="STORIA Logo" className="ff-foot-logo" loading="lazy" />
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

const ffStyles = `
.ff-page{
  --ink:#1a130d;--ink-2:#241a12;--bone:hsl(36 38% 92%);--amber:#d6892f;--amber-bright:#e8a14a;
  --rust:#a8431f;--line:rgba(244,236,224,.16);--line-dark:rgba(26,19,13,.14);--maxw:1200px;
  background:var(--ink);color:var(--bone);overflow-x:hidden;
}
.ff-page ::selection{background:var(--amber);color:var(--ink);}
.ff-wrap{max-width:var(--maxw);margin:0 auto;padding:0 28px;}
.ff-page h1,.ff-page h2,.ff-page h3{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;line-height:1.05;letter-spacing:-.01em;}
.ff-eyebrow{font-size:13px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--amber-bright);}
.ff-eyebrow-line{display:inline-flex;align-items:center;gap:12px;}
.ff-eyebrow-line::before{content:"";width:32px;height:1px;background:var(--amber-bright);}
/* NAV */
.ff-nav{position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;padding:18px 28px;background:rgba(26,19,13,0);transition:background .4s,padding .4s,border-color .4s;border-bottom:1px solid transparent;}
.ff-nav.scrolled{background:rgba(22,16,11,.92);backdrop-filter:blur(10px);padding:12px 28px;border-bottom:1px solid var(--line);}
.ff-brand{font-family:'Cormorant Garamond',serif;font-size:24px;letter-spacing:.04em;color:var(--bone);text-decoration:none;}
.ff-brand span{color:var(--amber-bright);}
.ff-nav-links{display:flex;gap:28px;align-items:center;}
.ff-nav-links a{color:var(--bone);text-decoration:none;font-size:14px;font-weight:500;opacity:.82;transition:opacity .2s;}
.ff-nav-links a:hover{opacity:1;}
.ff-nav-cta{background:var(--amber);color:var(--ink)!important;padding:10px 20px;border-radius:100px;font-weight:700;opacity:1!important;transition:transform .2s,background .2s;}
.ff-nav-cta:hover{transform:translateY(-1px);background:var(--amber-bright);}
.ff-nav-sep{width:1px;height:20px;background:var(--line);opacity:.6;}
.ff-nav-icon{display:inline-flex;align-items:center;justify-content:center;color:var(--bone);opacity:.78;transition:opacity .2s,color .2s;}
.ff-nav-icon:hover{opacity:1;}
.ff-nav-icon-wa:hover{color:#25D366;}
.ff-nav-lang{display:flex;align-items:center;margin-left:18px;}
@media(max-width:820px){.ff-nav-links a:not(.ff-nav-cta),.ff-nav-sep,.ff-nav-icon{display:none;}.ff-nav-lang{margin-left:12px;}}
/* HERO */
.ff-hero{position:relative;min-height:100vh;display:flex;align-items:flex-end;padding:120px 0 72px;overflow:hidden;background:var(--ink);}
.ff-hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.5;}
.ff-hero-overlay{position:absolute;inset:0;background:radial-gradient(120% 90% at 80% 0%,rgba(214,137,47,.22),transparent 55%),radial-gradient(90% 70% at 0% 100%,rgba(168,67,31,.34),transparent 60%),linear-gradient(180deg,rgba(18,12,8,.5),rgba(26,19,13,.78) 60%,rgba(22,15,10,.92));}
.ff-sprocket{position:absolute;top:0;bottom:0;width:26px;z-index:2;-webkit-mask:repeating-linear-gradient(180deg,#000 0 22px,transparent 22px 36px);mask:repeating-linear-gradient(180deg,#000 0 22px,transparent 22px 36px);background:rgba(244,236,224,.08);}
.ff-sprocket.l{left:0;}.ff-sprocket.r{right:0;}
@media(max-width:900px){.ff-sprocket{display:none;}}
.ff-hero-inner{position:relative;z-index:3;width:100%;}
.ff-h1{font-size:clamp(2.7rem,7.4vw,6rem);max-width:15ch;margin:26px 0;color:var(--bone);}
.ff-h1 em{font-style:italic;color:var(--amber-bright);}
.ff-hero-sub{font-size:clamp(1.05rem,1.7vw,1.3rem);max-width:54ch;color:rgba(244,236,224,.85);margin-bottom:36px;}
.ff-hero-actions{display:flex;gap:16px;flex-wrap:wrap;}
.ff-btn{display:inline-flex;align-items:center;gap:10px;text-decoration:none;font-weight:700;font-size:15px;padding:16px 30px;border-radius:100px;transition:transform .2s,box-shadow .2s,background .2s;}
.ff-btn-primary{background:var(--amber);color:var(--ink);box-shadow:0 12px 40px -12px rgba(214,137,47,.6);}
.ff-btn-primary:hover{transform:translateY(-2px);background:var(--amber-bright);}
.ff-btn-ghost{color:var(--bone);border:1px solid var(--line);background:rgba(244,236,224,.04);}
.ff-btn-ghost:hover{border-color:var(--amber-bright);transform:translateY(-2px);}
/* STATS */
.ff-stats{background:var(--bone);color:var(--ink);}
.ff-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);}
.ff-stat{padding:42px 28px;border-right:1px solid var(--line-dark);}
.ff-stat:last-child{border-right:none;}
.ff-stat .n{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,4vw,3rem);color:var(--rust);line-height:1;}
.ff-stat .l{font-size:13.5px;margin-top:10px;color:rgba(26,19,13,.7);font-weight:500;}
@media(max-width:780px){.ff-stats-grid{grid-template-columns:1fr 1fr;}.ff-stat:nth-child(2){border-right:none;}.ff-stat{border-bottom:1px solid var(--line-dark);}}
/* SECTION */
.ff-sec{padding:clamp(72px,9vw,128px) 0;}
.ff-sec-head{max-width:62ch;margin-bottom:52px;}
.ff-h2{font-size:clamp(2rem,4.6vw,3.4rem);margin:16px 0 0;}
.ff-lead{font-size:1.12rem;color:rgba(244,236,224,.8);max-width:60ch;margin-top:20px;}
/* FORMATE */
.ff-formate{background:var(--ink-2);}
.ff-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
@media(max-width:900px){.ff-cards{grid-template-columns:1fr 1fr;}}
@media(max-width:600px){.ff-cards{grid-template-columns:1fr;}}
.ff-card{background:linear-gradient(180deg,rgba(244,236,224,.05),rgba(244,236,224,.02));border:1px solid var(--line);border-radius:18px;padding:32px 28px;transition:transform .3s,border-color .3s,background .3s;}
.ff-card:hover{transform:translateY(-4px);border-color:rgba(232,161,74,.5);background:rgba(244,236,224,.06);}
.ff-card-num{font-family:'Cormorant Garamond',serif;font-size:16px;color:var(--amber-bright);opacity:.7;}
.ff-card-h{font-size:1.5rem;margin:14px 0 12px;color:var(--bone);}
.ff-card p{font-size:.97rem;color:rgba(244,236,224,.74);}
/* LAGE */
.ff-lage{background:var(--bone);color:var(--ink);}
.ff-lage .ff-eyebrow{color:var(--rust);}
.ff-lage .ff-eyebrow-line::before{background:var(--rust);}
.ff-lage .ff-h2{color:var(--ink);}
.ff-lage .ff-lead{color:rgba(26,19,13,.76);}
.ff-lage-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:center;margin-top:8px;}
@media(max-width:900px){.ff-lage-grid{grid-template-columns:1fr;gap:36px;}}
.ff-route{list-style:none;display:flex;flex-direction:column;gap:2px;margin:0;padding:0;}
.ff-route li{display:flex;align-items:baseline;gap:18px;padding:18px 0;border-bottom:1px solid var(--line-dark);}
.ff-route li:last-child{border-bottom:none;}
.ff-route .min{font-family:'Cormorant Garamond',serif;font-size:2rem;color:var(--rust);min-width:108px;line-height:1;}
.ff-route .min small{font-size:.85rem;color:rgba(26,19,13,.55);font-weight:600;}
.ff-route .place b{display:block;font-weight:700;font-size:1.08rem;}
.ff-route .place span{font-size:.92rem;color:rgba(26,19,13,.6);}
.ff-map-card{border-radius:20px;overflow:hidden;border:1px solid var(--line-dark);min-height:420px;position:relative;}
.ff-map-iframe{display:block;width:100%;border-radius:20px;}
/* RÄUME */
.ff-raeume{background:var(--ink);}
.ff-room-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:46px;}
@media(max-width:900px){.ff-room-grid{grid-template-columns:1fr;}}
.ff-room{border:1px solid var(--line);border-radius:18px;overflow:hidden;background:var(--ink-2);}
.ff-room-img{height:210px;overflow:hidden;}
.ff-room-img img{width:100%;height:100%;object-fit:cover;transition:transform .5s;}
.ff-room:hover .ff-room-img img{transform:scale(1.05);}
.ff-room-body{padding:26px;}
.ff-room-body h3{font-size:1.5rem;color:var(--bone);margin-bottom:8px;}
.ff-room-body .cap{color:var(--amber-bright);font-weight:600;font-size:.95rem;margin-bottom:12px;}
.ff-room-body p{font-size:.96rem;color:rgba(244,236,224,.74);}
.ff-scenario{border:1px solid var(--line);border-radius:18px;overflow:hidden;overflow-x:auto;}
.ff-scenario table{width:100%;border-collapse:collapse;min-width:560px;}
.ff-scenario th,.ff-scenario td{text-align:left;padding:18px 26px;border-bottom:1px solid var(--line);font-size:.98rem;}
.ff-scenario th{font-weight:600;color:var(--amber-bright);font-size:13px;letter-spacing:.04em;text-transform:uppercase;}
.ff-scenario td:first-child{font-weight:600;color:var(--bone);}
.ff-scenario td{color:rgba(244,236,224,.8);}
.ff-scenario tr:last-child td{border-bottom:none;}
/* CATERING */
.ff-cater{background:var(--bone);color:var(--ink);}
.ff-cater .ff-eyebrow{color:var(--rust);}
.ff-cater .ff-eyebrow-line::before{background:var(--rust);}
.ff-cater .ff-h2{color:var(--ink);}
.ff-cater .ff-lead{color:rgba(26,19,13,.76);}
.ff-menu-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-top:8px;}
@media(max-width:780px){.ff-menu-grid{grid-template-columns:1fr;}}
.ff-menu-card{background:#fff;border:1px solid var(--line-dark);border-radius:18px;padding:32px;}
.ff-menu-card h3{font-size:1.55rem;color:var(--rust);margin-bottom:6px;}
.ff-menu-card .tag{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--amber);margin-bottom:18px;display:block;}
.ff-menu-card ul{list-style:none;display:flex;flex-direction:column;gap:11px;margin:0;padding:0;}
.ff-menu-card li{display:flex;gap:12px;font-size:.98rem;color:rgba(26,19,13,.84);align-items:baseline;}
.ff-menu-card li::before{content:"—";color:var(--amber);font-weight:700;}
.ff-chips{margin-top:32px;display:flex;gap:12px;flex-wrap:wrap;}
.ff-chip{background:rgba(168,67,31,.08);border:1px solid rgba(168,67,31,.25);color:var(--rust);padding:8px 16px;border-radius:100px;font-size:13.5px;font-weight:600;}
.ff-outbound{margin-top:32px;font-size:1.05rem;line-height:1.6;color:rgba(26,19,13,.78);max-width:64ch;}
.ff-outbound a{color:var(--rust);text-decoration:underline;text-underline-offset:3px;font-weight:600;transition:color .2s;}
.ff-outbound a:hover{color:var(--amber);}
/* ABLAUF */
.ff-ablauf{background:var(--ink-2);}
.ff-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
@media(max-width:900px){.ff-steps{grid-template-columns:1fr 1fr;}}
@media(max-width:520px){.ff-steps{grid-template-columns:1fr;}}
.ff-step{padding:30px 26px;border:1px solid var(--line);border-radius:18px;background:rgba(244,236,224,.03);}
.ff-step .n{font-family:'Cormorant Garamond',serif;font-size:2.6rem;color:var(--amber-bright);line-height:1;}
.ff-step h3{font-size:1.25rem;margin:12px 0 8px;color:var(--bone);}
.ff-step p{font-size:.94rem;color:rgba(244,236,224,.74);}
/* KONTAKT */
.ff-kontakt{background:radial-gradient(80% 120% at 100% 0%,rgba(214,137,47,.18),transparent 55%),linear-gradient(180deg,#160f0a,#1f160e);}
.ff-k-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start;}
@media(max-width:880px){.ff-k-grid{grid-template-columns:1fr;gap:40px;}}
.ff-k-left .ff-h2{margin:18px 0;color:var(--bone);}
.ff-k-left .ff-lead{margin-bottom:30px;}
.ff-urgency{display:inline-flex;align-items:center;gap:10px;background:rgba(168,67,31,.2);border:1px solid rgba(232,161,74,.4);color:var(--amber-bright);padding:9px 18px;border-radius:100px;font-size:13.5px;font-weight:600;}
.ff-urgency .pulse{width:8px;height:8px;border-radius:50%;background:var(--amber-bright);animation:ffpulse 1.8s infinite;}
@keyframes ffpulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.4;transform:scale(1.4);}}
.ff-direct{margin-top:30px;display:flex;flex-direction:column;gap:16px;}
.ff-direct a{color:var(--bone);text-decoration:none;display:flex;align-items:center;gap:16px;font-size:1.05rem;}
.ff-direct a:hover{color:var(--amber-bright);}
.ff-direct .ic{width:44px;height:44px;border-radius:12px;border:1px solid var(--line);display:grid;place-items:center;flex-shrink:0;}
.ff-direct b{display:block;font-size:.74rem;letter-spacing:.06em;text-transform:uppercase;color:rgba(244,236,224,.5);font-weight:600;}
/* FORM */
.ff-form{background:rgba(244,236,224,.04);border:1px solid var(--line);border-radius:22px;padding:36px;}
.ff-field{margin-bottom:18px;display:flex;flex-direction:column;}
.ff-field label{font-size:13px;font-weight:600;letter-spacing:.04em;color:rgba(244,236,224,.72);margin-bottom:7px;text-transform:uppercase;}
.ff-field input,.ff-field select,.ff-field textarea{width:100%;background:rgba(26,19,13,.5);border:1px solid var(--line);border-radius:12px;padding:14px 16px;color:var(--bone);font-size:15px;font-family:inherit;transition:border-color .2s,background .2s;}
.ff-field input::placeholder,.ff-field textarea::placeholder{color:rgba(244,236,224,.4);}
.ff-field input:focus,.ff-field select:focus,.ff-field textarea:focus{outline:none;border-color:var(--amber-bright);background:rgba(26,19,13,.7);}
.ff-field select option{background:var(--ink-2);color:var(--bone);}
.ff-field textarea{resize:vertical;min-height:90px;}
.ff-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
@media(max-width:520px){.ff-row{grid-template-columns:1fr;}}
.ff-error{color:var(--amber-bright);font-size:12.5px;margin-top:6px;}
.ff-submit{background:var(--amber)!important;color:var(--ink)!important;border:none!important;border-radius:100px!important;font-weight:700!important;height:auto!important;padding:16px 30px!important;font-size:15px!important;}
.ff-submit:hover{background:var(--amber-bright)!important;}
.ff-disclaimer{margin-top:54px;padding-top:28px;border-top:1px solid var(--line);font-size:.82rem;color:rgba(244,236,224,.45);max-width:80ch;}
.ff-disclaimer a{color:rgba(244,236,224,.7);text-decoration:underline;}
/* INTRO / DEFINITION-LEAD */
.ff-intro{background:var(--ink);padding-top:clamp(48px,6vw,80px);padding-bottom:clamp(48px,6vw,80px);}
.ff-intro-lead{font-size:clamp(1.15rem,2vw,1.5rem);line-height:1.55;color:rgba(244,236,224,.86);max-width:70ch;font-family:'Cormorant Garamond',Georgia,serif;}
.ff-intro-lead a{color:var(--amber-bright);text-decoration:underline;text-underline-offset:3px;}
/* FAQ */
.ff-faq{margin-top:clamp(56px,7vw,96px);}
.ff-faq-list{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:8px;}
@media(max-width:780px){.ff-faq-list{grid-template-columns:1fr;}}
.ff-faq-item{border:1px solid var(--line);border-radius:18px;padding:28px 26px;background:rgba(244,236,224,.03);}
.ff-faq-item h3{font-size:1.2rem;color:var(--bone);margin-bottom:10px;}
.ff-faq-item p{font-size:.96rem;color:rgba(244,236,224,.76);line-height:1.6;}
.ff-foot-logo{height:54px;width:auto;margin-top:24px;opacity:.85;filter:brightness(0) invert(1);}
/* REVEAL */
.ff-reveal{opacity:0;transform:translateY(26px);transition:opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1);}
.ff-reveal.in{opacity:1;transform:none;}
@media(prefers-reduced-motion:reduce){.ff-reveal{opacity:1!important;transform:none!important;}}
`;

export default FilmfestMuenchen;