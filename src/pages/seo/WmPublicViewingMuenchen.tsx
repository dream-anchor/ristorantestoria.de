import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Helmet } from "@/lib/helmetAsync";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ReservationBooking from "@/components/ReservationBooking";
import ConsentGoogleMaps from "@/components/ConsentGoogleMaps";
import LocalizedLink from "@/components/LocalizedLink";
import SeasonalSignupForm from "@/components/SeasonalSignupForm";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { useAlternateLinks } from "@/contexts/AlternateLinksContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedPath } from "@/config/routes";
import { TURNIERE } from "@/config/turniere";
import { trackEvent } from "@/lib/analytics";
import { buildEventsAnfrageUrl } from "@/lib/eventsLinks";
import KiBild from "@/components/KiBild";
import { wmContent } from "./wmContent";
import heroImg from "@/assets/wm-2026-public-viewing-terrasse-storia-muenchen.webp";
import heroImg600 from "@/assets/wm-2026-public-viewing-terrasse-storia-muenchen-600w.webp";
import innenImg from "@/assets/wm-2026-fussball-uebertragung-innen-storia-muenchen.webp";
import innenImg600 from "@/assets/wm-2026-fussball-uebertragung-innen-storia-muenchen-600w.webp";

const SLUG = "public-viewing-muenchen";
const OG_IMAGE = "https://www.ristorantestoria.de/wm-2026-public-viewing-muenchen-og.jpg";
const GRUPPEN_LINK = buildEventsAnfrageUrl({ utm_campaign: "public_viewing" });
const WHATSAPP = "https://wa.me/491636033912";
const EM = TURNIERE.em2028;

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

/**
 * Tageszahl NUR im Browser: das vorgerenderte HTML enthält bewusst keine Zahl,
 * sonst stünde dort eine veraltete. Nach dem Finale verschwindet der Zusatz.
 */
const Countdown = ({ daysLeft, running }: { daysLeft: string; running: string }) => {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    const now = Date.now();
    const start = new Date(`${EM.start}T00:00:00+02:00`).getTime();
    const end = new Date(`${EM.end}T23:59:59+02:00`).getTime();
    if (now < start) setText(daysLeft.replace("{n}", String(Math.ceil((start - now) / 86_400_000))));
    else if (now <= end) setText(running);
  }, [daysLeft, running]);
  return text ? <span className="pv-cd-n" aria-hidden="true">– {text}</span> : null;
};

const WmPublicViewingMuenchen = () => {
  usePrerenderReady(true);
  const { setAlternates, clearAlternates } = useAlternateLinks();
  const { language, t } = useLanguage();
  const c = wmContent[language];

  // hreflang: jede Sprache verweist auf ihre eigene Public-Viewing-URL.
  useEffect(() => {
    setAlternates(
      (["de", "en", "it", "fr"] as const).map((l) => ({ lang: l, url: getLocalizedPath(SLUG, l) }))
    );
    return () => clearAlternates();
  }, [setAlternates, clearAlternates]);

  const em = c.em2028;

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
        <meta property="og:image:alt" content={c.seo.ogAlt} />
        <meta name="twitter:image:alt" content={c.seo.ogAlt} />
      </Helmet>
      <StructuredData type="restaurant" />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: t.breadcrumb.home, url: getLocalizedPath("home", language) },
          { name: c.breadcrumb, url: getLocalizedPath(SLUG, language) },
        ]}
      />
      <StructuredData type="faq" faqItems={c.faq.items} />

      {/* dangerouslySetInnerHTML statt {children}: verhindert SSR-Quote-Escaping
          im <style>-Rawtext → sonst Hydration-Mismatch (#425/#422). */}
      <style dangerouslySetInnerHTML={{ __html: pvStyles }} />

      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <Navigation />

        {/* HERO */}
        <section className="wm-hero" id="top">
          <img
            src={heroImg}
            srcSet={`${heroImg600} 600w, ${heroImg} 1672w`}
            sizes="100vw"
            alt={c.heroAlt}
            className="wm-hero-img"
            loading="eager"
            fetchPriority="high"
          />
          <div className="wm-hero-overlay" />
          <div className="wm-wrap wm-hero-inner">
            <span className="wm-eyebrow">{c.hero.eyebrow}</span>
            <h1 className="wm-h1">
              {c.hero.h1Pre}
              <em>{c.hero.h1Em}</em>
            </h1>
            <p className="wm-hero-sub">{c.hero.intro}</p>
            <div className="wm-hero-actions">
              <a href="#reservieren" className="wm-btn wm-btn-primary" onClick={() => fireLead("public_viewing_reservierung")}>
                {c.hero.ctaReserve}
              </a>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="wm-btn wm-btn-ghost"
                onClick={() => fireLead("public_viewing_whatsapp")}
              >
                <MessageCircle size={18} /> {c.hero.ctaWhatsapp}
              </a>
            </div>
          </div>
        </section>

        <nav className="pv-toc" aria-label={c.toc.label}>
          <div className="container mx-auto px-4">
            {c.toc.items.map(([id, label]) => (
              <a key={id} href={`#${id}`}>{label}</a>
            ))}
          </div>
        </nav>

        <main className="pv flex-grow">
          <div className="container mx-auto px-4 pt-8">
            <BreadcrumbNav crumbs={[{ label: t.breadcrumb.home, href: getLocalizedPath("home", language) }, { label: c.breadcrumb }]} />
          </div>

          {/* WM 2026 */}
          <section className="pv-s" id="wm-2026">
            <div className="pv-wrap">
              <p className="pv-kicker">{c.wm2026.kicker}</p>
              <h2>{c.wm2026.h2}</h2>
              <p>{c.wm2026.body}</p>
              <figure className="pv-pic">
                <div className="pv-pic-frame">
                  <KiBild
                    datei="wm-2026-fussball-uebertragung-innen-storia-muenchen.webp"
                    src={innenImg}
                    srcSet={`${innenImg600} 600w, ${innenImg} 1672w`}
                    sizes="(max-width: 860px) 100vw, 820px"
                    loading="lazy"
                  />
                </div>
                <figcaption>
                  {c.wm2026.figcaption}
                </figcaption>
              </figure>
              <h3>{c.wm2026.h3}</h3>
              <div className="pv-res">
                {c.wm2026.results.map(([head, text]) => (
                  <div key={head}>
                    <b>{head}</b>
                    {text}
                  </div>
                ))}
              </div>
              <p className="pv-cap">{c.wm2026.grazie}</p>
            </div>
          </section>

          {/* 2027 */}
          <section className="pv-s alt" id="fussball-2027">
            <div className="pv-wrap">
              <p className="pv-kicker">{c.y2027.kicker}</p>
              <h2>{c.y2027.h2}</h2>
              <p>{c.y2027.body}</p>
              <ul className="pv-facts">
                {c.y2027.facts.map(([k, v]) => (
                  <li key={k}><span>{k}</span><span>{v}</span></li>
                ))}
              </ul>
              <p className="pv-src">{c.y2027.src}</p>
            </div>
          </section>

          {/* EM 2028 */}
          <section className="pv-s" id="em-2028">
            <div className="pv-wrap">
              <p className="pv-kicker">{em.kicker}</p>
              <h2>{em.h2}</h2>
              <div className="pv-cd">
                <span>{em.cd.label}</span>
                <time dateTime={`${EM.start}/${EM.end}`}>{em.cd.range}</time>
                <Countdown daysLeft={em.cd.daysLeft} running={em.cd.running} />
              </div>
              <p>{em.body}</p>
              {em.fans && (
                <div className="pv-en">
                  <p><strong>{em.fans.title}</strong></p>
                  <p>{em.fans.text}</p>
                </div>
              )}
              <h3>{em.h3Hosts}</h3>
              <div className="pv-countries">
                {em.hosts.map(([land, orte]) => (
                  <div key={land}><b>{land}</b><small>{orte}</small></div>
                ))}
              </div>
              <h3>{em.h3Dates}</h3>
              <ul className="pv-facts">
                {em.dates.map(([k, v]) => (
                  <li key={k}><span>{k}</span><span>{v}</span></li>
                ))}
              </ul>
              <h3>{em.h3Venues}</h3>
              <ul className="pv-venues">
                {em.venues.map(([stadt, stadion]) => (
                  <li key={stadion}>{stadt} <small>· {stadion}</small></li>
                ))}
              </ul>
              <p className="pv-src">{em.src}</p>
              <div className="pv-cta">
                <p>{em.ctaText}</p>
                <a href="#newsletter" className="pv-btn">{em.ctaButton}</a>
              </div>
            </div>
          </section>

          {/* WM 2030 */}
          <section className="pv-s alt" id="wm-2030">
            <div className="pv-wrap">
              <p className="pv-kicker">{c.wm2030.kicker}</p>
              <h2>{c.wm2030.h2}</h2>
              <p>{c.wm2030.body}</p>
              <div className="pv-countries">
                {c.wm2030.hosts.map(([land, orte]) => (
                  <div key={land}><b>{land}</b><small>{orte}</small></div>
                ))}
              </div>
              <p className="pv-src">{c.wm2030.src}</p>
            </div>
          </section>

          {/* RESTAURANT + RESERVIEREN */}
          <section className="pv-s" id="reservieren">
            <div className="pv-wrap">
              <h2>{c.restaurant.h2}</h2>
              <p>{c.restaurant.body}</p>
              <h3>{c.restaurant.h3Reserve}</h3>
              <p className="pv-hint">{c.restaurant.reserveHint}</p>
              <ReservationBooking headingLevel="h3" onBook={() => fireLead("public_viewing_reservierung")} />
              <h3>{c.restaurant.h3Groups}</h3>
              <p className="pv-cap">{c.restaurant.groups}</p>
              <p>
                <a
                  href={GRUPPEN_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pv-link"
                  onClick={() => trackEvent("events_crosssell_click", { source: "public-viewing" })}
                >
                  {c.restaurant.groupsLink}
                </a>
              </p>
            </div>
          </section>

          {/* NEWSLETTER */}
          <section className="pv-s alt" id="newsletter">
            <div className="pv-wrap">
              <h2>{c.newsletter.h2}</h2>
              <p>{c.newsletter.body}</p>
              <SeasonalSignupForm seasonalEvent="public-viewing" />
            </div>
          </section>

          {/* ANFAHRT */}
          <section className="pv-s" id="anfahrt">
            <div className="pv-wrap">
              <h2>{c.anfahrt.h2}</h2>
              <p>{c.anfahrt.body}</p>
              <p>
                {c.anfahrt.hbfPre}
                <LocalizedLink to="italiener-hauptbahnhof-muenchen" className="pv-link">
                  {c.anfahrt.hbfAnchor}
                </LocalizedLink>
                {c.anfahrt.hbfPost}
              </p>
              <ConsentGoogleMaps
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d11.5658!3d48.1465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKarlstra%C3%9Fe%2047a%2C%2080333%20M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1"
                title="STORIA · Karlstraße 47a, München"
                height={380}
              />
            </div>
          </section>

          {/* KURZ */}
          <section className="pv-s alt" id="kurz">
            <div className="pv-wrap">
              <h2>{c.kurz.h2}</h2>
              <ul className="pv-cite">
                {c.kurz.items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* FAQ – immer aufgeklappt */}
          <section className="pv-s pv-faq" id="fragen">
            <div className="pv-wrap">
              <h2>{c.faq.h2}</h2>
              {c.faq.items.map((item) => (
                <div key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
              <p className="pv-legal">{c.faq.disclaimer}</p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

const pvStyles = `
/* HERO (dunkel, wie WM-2026-Seite) */
.wm-hero{--bone:hsl(36 38% 92%);--amber:#d6892f;--amber-bright:#e8a14a;--line:rgba(244,236,224,.16);
  position:relative;min-height:70vh;display:flex;align-items:flex-end;padding:96px 0 40px;overflow:hidden;background:#1a130d;color:var(--bone);}
.wm-wrap{max-width:1200px;margin:0 auto;padding:0 16px;}
.wm-hero h1{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;line-height:1.05;letter-spacing:-.01em;}
.wm-hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.5;}
.wm-hero-overlay{position:absolute;inset:0;background:radial-gradient(120% 90% at 80% 0%,rgba(214,137,47,.2),transparent 55%),radial-gradient(90% 70% at 0% 100%,rgba(168,67,31,.32),transparent 60%),linear-gradient(180deg,rgba(16,11,7,.58),rgba(20,14,9,.82) 52%,rgba(12,8,5,.97));}
.wm-hero-inner{position:relative;z-index:3;width:100%;}
.wm-eyebrow{font-size:13px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--amber-bright);}
.wm-h1{font-size:clamp(2.2rem,6vw,4.6rem);max-width:20ch;margin:20px 0;color:var(--bone);}
.wm-h1 em{font-style:italic;color:var(--amber-bright);}
.wm-hero-sub{font-size:clamp(1.05rem,1.7vw,1.25rem);max-width:60ch;color:rgba(244,236,224,.85);margin-bottom:28px;}
.wm-hero-actions{display:flex;gap:14px;flex-wrap:wrap;}
.wm-btn{display:inline-flex;align-items:center;gap:10px;text-decoration:none;font-weight:700;font-size:15px;padding:14px 26px;border-radius:100px;transition:transform .2s,background .2s;}
.wm-btn-primary{background:var(--amber);color:#1a130d;}
.wm-btn-primary:hover{transform:translateY(-2px);background:var(--amber-bright);}
.wm-btn-ghost{color:var(--bone);border:1px solid var(--line);background:rgba(244,236,224,.04);}
.wm-btn-ghost:hover{border-color:var(--amber-bright);}
/* KI-Kennzeichnung */
/* Inhaltsverzeichnis */
.pv-toc{border-bottom:1px solid hsl(var(--border));font-size:13px;padding:12px 0;}
.pv-toc .container{display:flex;gap:8px;flex-wrap:wrap;}
.pv-toc a{border:1px solid hsl(var(--border));border-radius:999px;padding:4px 12px;background:hsl(var(--card));color:hsl(var(--foreground));text-decoration:none;}
.pv-toc a:hover{border-color:hsl(var(--primary));}
/* Abschnitte (hell, wie Mockup) */
.pv-wrap{max-width:820px;margin:0 auto;padding:0 16px;}
.pv-s{padding:40px 0;}
.pv-s.alt{background:hsl(var(--secondary));}
.pv h2,.pv h3{font-family:'Cormorant Garamond',Georgia,serif;font-weight:600;line-height:1.15;}
.pv h2{font-size:clamp(26px,5vw,32px);margin-bottom:12px;}
.pv h3{font-size:21px;margin:22px 0 6px;}
.pv p{margin:0 0 12px;max-width:64ch;}
.pv-kicker{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:hsl(var(--muted-foreground));margin-bottom:8px!important;}
.pv-pic{margin:16px 0;}
.pv-pic-frame{position:relative;}
.pv-pic img{display:block;width:100%;height:auto;}
.pv-pic figcaption{font-size:13px;color:hsl(var(--muted-foreground));margin-top:6px;}
.pv-res{display:grid;gap:8px;margin:12px 0;}
.pv-res div{padding:12px 14px;border:1px solid hsl(var(--border));background:hsl(var(--card));}
.pv-res b{font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;display:block;}
.pv-cap{font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;font-style:italic;color:hsl(var(--primary));margin:12px 0;}
.pv-facts{list-style:none;padding:0;margin:0;}
.pv-facts li{display:flex;gap:14px;padding:9px 0;border-bottom:1px solid hsl(var(--border));flex-wrap:wrap;}
.pv-facts li>span:first-child{min-width:150px;color:hsl(var(--muted-foreground));font-size:14px;}
.pv-facts li>span:last-child{flex:1;min-width:0;}
.pv-cd{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin:6px 0 16px;padding:14px 16px;border:1px solid hsl(var(--border));background:hsl(var(--card));border-left:3px solid hsl(var(--primary));}
.pv-cd time{font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;font-weight:600;}
.pv-cd-n{color:hsl(var(--primary));font-weight:600;}
.pv-en{border:1px solid hsl(var(--border));border-left:3px solid hsl(var(--primary));background:hsl(var(--card));padding:14px 16px;margin:16px 0;}
.pv-en p{margin-bottom:6px;}
.pv-countries{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin:12px 0;}
.pv-countries div{border:1px solid hsl(var(--border));background:hsl(var(--card));padding:12px 14px;}
.pv-countries b{font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;display:block;}
.pv-countries small,.pv-venues small{color:hsl(var(--muted-foreground));}
.pv-venues{columns:2 220px;column-gap:24px;list-style:none;padding:0;margin:0 0 12px;}
.pv-venues li{padding:5px 0;break-inside:avoid;border-bottom:1px dotted hsl(var(--border));}
.pv-src,.pv-legal{font-size:13px;color:hsl(var(--muted-foreground));}
.pv-legal{margin-top:18px!important;}
.pv-cta{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:16px;border:1px solid hsl(var(--border));background:hsl(var(--card));margin-top:16px;}
.pv-cta p{margin:0;}
.pv-btn{display:inline-block;background:hsl(var(--primary));color:hsl(var(--primary-foreground));padding:10px 18px;text-decoration:none;font-weight:600;}
.pv-hint{color:hsl(var(--muted-foreground));}
.pv-link{color:hsl(var(--primary));text-decoration:underline;text-underline-offset:3px;}
.pv-cite{list-style:none;padding:0;margin:0;display:grid;gap:8px;}
.pv-cite li{background:hsl(var(--card));border:1px solid hsl(var(--border));padding:10px 14px;}
.pv-faq h3{font-size:20px;margin:18px 0 4px;}
.pv-faq p{margin:0;}
`;

export default WmPublicViewingMuenchen;
