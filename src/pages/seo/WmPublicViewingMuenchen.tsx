import { useEffect, useRef, useState, type ReactNode } from "react";
import { PhoneText } from "@/lib/linkifyPhone";
import { Phone, Mail, MapPin, ArrowUpRight, Instagram, MessageCircle } from "lucide-react";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import ReservationBooking from "@/components/ReservationBooking";
import ConsentGoogleMaps from "@/components/ConsentGoogleMaps";
import LocalizedLink from "@/components/LocalizedLink";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { useAlternateLinks } from "@/contexts/AlternateLinksContext";
import { getLocalizedPath } from "@/config/routes";
import storiaLogo from "@/assets/storia-logo.webp";
import heroImg from "@/assets/wm-2026-public-viewing-terrasse-storia-muenchen.webp";
import heroImg600 from "@/assets/wm-2026-public-viewing-terrasse-storia-muenchen-600w.webp";
import innenImg from "@/assets/wm-2026-fussball-uebertragung-innen-storia-muenchen.webp";
import innenImg600 from "@/assets/wm-2026-fussball-uebertragung-innen-storia-muenchen-600w.webp";

const OG_IMAGE = "https://www.ristorantestoria.de/wm-2026-public-viewing-muenchen-og.jpg";

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

const angebot = [
  "Alle Spiele der WM 2026, von der Gruppenphase bis zum Finale.",
  "Übertragung auf der überdachten Terrasse. Bei schlechtem Wetter zeigen wir drinnen weiter.",
  "Keine Sportkneipe: süditalienische Küche, eigene Weinkarte, Aperitivo zum Anstoß.",
  "Reservierung empfohlen, gerade an den Abenden mit deutscher Beteiligung.",
];

const deutscheSpiele = [
  { tag: "Sonntag", datum: "14. Juni", heimFlag: "🇩🇪", heim: "Deutschland", gastFlag: "🇨🇼", gast: "Curaçao", anstoss: "19:00", ort: "Houston", tv: "ARD" },
  { tag: "Samstag", datum: "20. Juni", heimFlag: "🇩🇪", heim: "Deutschland", gastFlag: "🇨🇮", gast: "Elfenbeinküste", anstoss: "22:00", ort: "Toronto", tv: "ZDF" },
  { tag: "Donnerstag", datum: "25. Juni", heimFlag: "🇪🇨", heim: "Ecuador", gastFlag: "🇩🇪", gast: "Deutschland", anstoss: "22:00", ort: "New York / NJ", tv: "ARD" },
];

const turnier = [
  { phase: "Eröffnung", zeit: "11. Juni · 21:00" },
  { phase: "Gruppenphase", zeit: "11. – 27. Juni" },
  { phase: "Sechzehntelfinale", zeit: "28.6. – 3.7." },
  { phase: "Achtelfinale", zeit: "4. – 7. Juli" },
  { phase: "Viertelfinale", zeit: "9. – 11. Juli" },
  { phase: "Halbfinale", zeit: "14. / 15. Juli" },
  { phase: "Finale", zeit: "19. Juli · 21:00" },
];

const faqItems = [
  {
    question: "Werden alle Spiele gezeigt?",
    answer: "Ja. Wir übertragen alle Spiele der WM 2026, von der Gruppenphase bis zum Finale.",
  },
  {
    question: "Muss ich reservieren?",
    answer:
      "Empfohlen, vor allem an Spieltagen und bei den deutschen Spielen. Reservieren geht über das Formular oder per WhatsApp.",
  },
  {
    question: "Was passiert bei schlechtem Wetter?",
    answer: "Die Terrasse ist überdacht. Wird es zu ungemütlich, zeigen wir die Spiele drinnen.",
  },
  {
    question: "Zeigt ihr auch die Deutschland-Spiele?",
    answer: "Ja, alle drei Gruppenspiele. Kommt Deutschland weiter, auch die K.-o.-Runde.",
  },
  {
    question: "Kann ich auch nur etwas trinken kommen?",
    answer:
      "Ja. Aperitivo, Wein oder ein Bier zum Spiel sind kein Problem. Plätze sind an Spieltagen gefragt, darum besser kurz reservieren.",
  },
  {
    question: "Wo genau ist STORIA?",
    answer:
      "In der Maxvorstadt, Karlstraße 47a, 80333 München. Tram 20 und 21, Haltestelle Karlstraße, direkt vor dem Restaurant.",
  },
];

const WmPublicViewingMuenchen = () => {
  usePrerenderReady(true);
  const [scrolled, setScrolled] = useState(false);
  const { setAlternates, clearAlternates } = useAlternateLinks();

  // Deutschsprachige Seite: EN/IT/FR-Sprachwechsel führen auf die lokalisierte
  // Startseite, damit keine tote WM-URL entsteht; DE bleibt auf dieser Seite.
  useEffect(() => {
    setAlternates([
      { lang: "de", url: getLocalizedPath("wm-2026-public-viewing-muenchen", "de") },
      { lang: "en", url: getLocalizedPath("home", "en") },
      { lang: "it", url: getLocalizedPath("home", "it") },
      { lang: "fr", url: getLocalizedPath("home", "fr") },
    ]);
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
        title="WM 2026 Public Viewing München – alle Spiele live | STORIA"
        description="Alle Spiele der WM 2026 live auf der überdachten Terrasse in der Maxvorstadt. Süditalienische Küche, Aperitivo, bei schlechtem Wetter drinnen. Tisch reservieren."
        canonical="/wm-2026-public-viewing-muenchen"
        ogImage={OG_IMAGE}
        noHreflang
      />
      <StructuredData type="faq" faqItems={faqItems} />

      <style>{wmStyles}</style>

      <div className="wm-page">
        {/* NAV */}
        <nav className={`wm-nav ${scrolled ? "scrolled" : ""}`}>
          <LocalizedLink to="home" className="wm-brand" aria-label="STORIA – zur Startseite">
            STORIA<span>.</span>
          </LocalizedLink>
          <div className="wm-nav-links">
            <a href="#angebot">Was läuft</a>
            <a href="#spiele">Deutsche Spiele</a>
            <a href="#turnier">Turnier</a>
            <a href="#reservieren" className="wm-nav-cta">Tisch reservieren</a>
            <span className="wm-nav-sep" aria-hidden="true" />
            <a href="tel:+498951519696" className="wm-nav-icon" aria-label="Anrufen +49 89 51519696" title="+49 89 51519696">
              <Phone size={16} />
            </a>
            <a href="mailto:info@ristorantestoria.de" className="wm-nav-icon" aria-label="E-Mail an info@ristorantestoria.de" title="info@ristorantestoria.de">
              <Mail size={16} />
            </a>
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
              WM 2026 · 11. Juni – 19. Juli · Maxvorstadt
            </Reveal>
            <Reveal as="h1" delay={0.08} className="wm-h1">
              WM 2026 Public Viewing in der Maxvorstadt – alle Spiele im <em>STORIA</em>
            </Reveal>
            <Reveal as="p" delay={0.16} className="wm-hero-sub">
              Italien ist 2026 nicht dabei, zum dritten Mal in Folge. Bei uns läuft die WM trotzdem – von der
              Eröffnung am 11. Juni bis zum Finale am 19. Juli. Alle Spiele, auf der überdachten Terrasse in der
              Karlstraße. Dazu süditalienische Küche, ein Glas Wein, ein Aperitivo. An Spieltagen wird es voll,
              reserviert also besser vorher.
            </Reveal>
            <Reveal delay={0.24} className="wm-hero-actions">
              <a href="#reservieren" className="wm-btn wm-btn-primary" onClick={() => fireLead("wm_reservierung")}>
                Tisch reservieren →
              </a>
              <a
                href="https://wa.me/491636033912"
                target="_blank"
                rel="noopener noreferrer"
                className="wm-btn wm-btn-ghost"
                onClick={() => fireLead("wm_whatsapp")}
              >
                <MessageCircle size={18} /> WhatsApp
              </a>
            </Reveal>
          </div>
        </header>

        {/* WAS LÄUFT */}
        <section className="wm-sec wm-angebot" id="angebot">
          <div className="wm-wrap wm-angebot-grid">
            <Reveal className="wm-angebot-text">
              <span className="wm-eyebrow wm-eyebrow-line">Was bei uns läuft</span>
              <h2 className="wm-h2">Fußball schauen, italienisch genießen.</h2>
              <ul className="wm-list">
                {angebot.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
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
        </section>

        {/* DEUTSCHE SPIELE */}
        <section className="wm-sec wm-spiele" id="spiele">
          <div className="wm-wrap">
            <Reveal className="wm-sec-head">
              <span className="wm-eyebrow wm-eyebrow-line">Gruppe E · Die deutschen Spiele</span>
              <h2 className="wm-h2">Wenn Deutschland spielt, ist hier was los.</h2>
            </Reveal>
            <div className="wm-match-grid">
              {deutscheSpiele.map((s, i) => (
                <Reveal key={s.datum} delay={i * 0.08} className="wm-match">
                  <span className="wm-match-date">{s.tag} · {s.datum}</span>
                  <div className="wm-match-teams">
                    <div className="wm-team">
                      <span className="flag" aria-hidden="true">{s.heimFlag}</span>
                      <span className="name">{s.heim}</span>
                    </div>
                    <span className="wm-vs">gegen</span>
                    <div className="wm-team">
                      <span className="flag" aria-hidden="true">{s.gastFlag}</span>
                      <span className="name">{s.gast}</span>
                    </div>
                  </div>
                  <div className="wm-match-foot">
                    <span className="wm-kick">{s.anstoss}<small>MESZ</small></span>
                    <span className="wm-match-foot-r">
                      <span className="wm-where">{s.ort}</span>
                      <span className="wm-tv">{s.tv}</span>
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal as="p" className="wm-note">
              Alle Zeiten in MESZ. Kommt Deutschland weiter, zeigen wir auch die K.-o.-Spiele.
            </Reveal>
          </div>
        </section>

        {/* TURNIER */}
        <section className="wm-sec wm-turnier" id="turnier">
          <div className="wm-wrap">
            <Reveal className="wm-sec-head">
              <span className="wm-eyebrow wm-eyebrow-line">So läuft das Turnier</span>
              <h2 className="wm-h2">Von Mexiko-Stadt bis New Jersey.</h2>
            </Reveal>
            <Reveal className="wm-timeline">
              <div className="wm-timeline-track" aria-hidden="true" />
              <ol className="wm-timeline-list">
                {turnier.map((t, i) => (
                  <li key={t.phase} className={i === turnier.length - 1 ? "is-final" : ""}>
                    <span className="dot" aria-hidden="true" />
                    <span className="phase">{t.phase}</span>
                    <span className="zeit">{t.zeit}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        {/* RESERVIEREN */}
        <section className="wm-sec wm-reservieren" id="reservieren">
          <div className="wm-wrap">
            <Reveal className="wm-sec-head">
              <span className="wm-eyebrow wm-eyebrow-line">Platz sichern</span>
              <h2 className="wm-h2">Reservieren</h2>
              <p className="wm-lead">
                An Spieltagen sind die Tische schnell vergeben, bei den deutschen Spielen besonders. Sichert euch
                euren Platz auf der Terrasse oder drinnen – eine kurze Reservierung genügt.
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
                Tisch reservieren →
              </LocalizedLink>
              <a
                href="https://wa.me/491636033912"
                target="_blank"
                rel="noopener noreferrer"
                className="wm-btn wm-btn-ghost"
                onClick={() => fireLead("wm_whatsapp")}
              >
                <MessageCircle size={18} /> WhatsApp
              </a>
            </Reveal>
          </div>
        </section>

        {/* ANFAHRT */}
        <section className="wm-sec wm-anfahrt" id="anfahrt">
          <div className="wm-wrap wm-anfahrt-grid">
            <Reveal className="wm-anfahrt-text">
              <span className="wm-eyebrow wm-eyebrow-line">Anfahrt</span>
              <h2 className="wm-h2">Mitten in der Maxvorstadt.</h2>
              <p className="wm-lead">
                STORIA, Karlstraße 47a, 80333 München. Telefon <PhoneText>+49 89 51519696</PhoneText>. Die Tram 20
                und 21 hält an der Karlstraße direkt vor der Tür.
              </p>
              <div className="wm-direct">
                <a href="tel:+498951519696">
                  <span className="ic"><Phone size={18} /></span>
                  <span><b>Direkt anrufen</b>+49 89 51519696</span>
                </a>
                <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer" onClick={() => fireLead("wm_whatsapp")}>
                  <span className="ic"><MessageCircle size={18} /></span>
                  <span><b>WhatsApp</b>Schnelle Reservierungsanfrage</span>
                </a>
                <a href="https://maps.google.com/?q=Ristorante+Storia+Karlstra%C3%9Fe+47a+M%C3%BCnchen" target="_blank" rel="noopener noreferrer">
                  <span className="ic"><MapPin size={18} /></span>
                  <span><b>Anfahrt</b>Karlstraße 47a · 80333 München</span>
                </a>
                <a href="https://www.ristorantestoria.de" target="_blank" rel="noopener noreferrer">
                  <span className="ic"><ArrowUpRight size={18} /></span>
                  <span><b>Restaurant</b>ristorantestoria.de</span>
                </a>
              </div>
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
              <span className="wm-eyebrow wm-eyebrow-line">Häufige Fragen</span>
              <h2 className="wm-h2">WM 2026 im STORIA – kurz erklärt.</h2>
            </Reveal>
            <div className="wm-faq-list">
              {faqItems.map((item, i) => (
                <Reveal key={item.question} delay={(i % 3) * 0.06} className="wm-faq-item">
                  <h3>{item.question}</h3>
                  <p><PhoneText>{item.answer}</PhoneText></p>
                </Reveal>
              ))}
            </div>
            <p className="wm-disclaimer">
              Eine Sonderseite zur Fußball-Weltmeisterschaft 2026 (11. Juni – 19. Juli). Diese Seite steht in keiner
              offiziellen Verbindung zur FIFA. Spielzeiten und Übertragungen ohne Gewähr.
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
.wm-match-foot{margin-top:24px;padding-top:20px;border-top:1px solid var(--line);display:flex;align-items:flex-end;justify-content:space-between;gap:14px;}
.wm-kick{font-family:var(--mono);font-size:1.9rem;font-weight:600;color:var(--green-soft);line-height:1;display:inline-flex;align-items:baseline;gap:7px;}
.wm-kick small{font-size:.66rem;letter-spacing:.1em;color:rgba(244,236,224,.45);font-weight:500;}
.wm-match-foot-r{display:flex;flex-direction:column;align-items:flex-end;gap:9px;}
.wm-where{font-family:var(--mono);font-size:.82rem;color:rgba(244,236,224,.6);}
.wm-tv{display:inline-block;font-family:var(--mono);font-size:.72rem;letter-spacing:.06em;color:rgba(244,236,224,.82);border:1px solid var(--line);border-radius:7px;padding:4px 10px;}
.wm-note{margin-top:26px;font-family:var(--mono);font-size:.86rem;color:rgba(244,236,224,.5);}
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
/* REVEAL */
.wm-reveal{opacity:0;transform:translateY(26px);transition:opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1);}
.wm-reveal.in{opacity:1;transform:none;}
@media(prefers-reduced-motion:reduce){.wm-reveal{opacity:1!important;transform:none!important;}}
`;

export default WmPublicViewingMuenchen;
