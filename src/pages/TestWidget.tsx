import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import LocalizedLink from "@/components/LocalizedLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Phone, UtensilsCrossed } from "lucide-react";
import storiaLogo from "@/assets/storia-logo.webp";
import heroImage from "@/assets/ristorante-storia-uebersicht.webp";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { FACTS } from "@/config/facts";

const WIDGET_API = "https://storia.schrittmacher.ai";
const WIDGET_SRC = `${WIDGET_API}/api/public/widgets/v1/maestro.js`;
const WIDGET_ID = "b61887bf-7f94-4e2c-a4cb-0615c7aa20e5";

type ScriptState = "idle" | "loading" | "loaded" | "error";

/**
 * Interne Testseite (/test, noindex) für das Maestro-Widget.
 * Layout entspricht einer normalen Landingpage, damit das Widget im echten
 * Seitenkontext getestet werden kann.
 *
 * Das Script wird bewusst erst im useEffect eingehängt (nicht als <script> im
 * JSX): beim Prerender würde renderToString den Tag ins statische HTML schreiben
 * und das Widget zweimal initialisieren.
 */
const TestWidget = () => {
  usePrerenderReady(true);
  const [scriptState, setScriptState] = useState<ScriptState>("idle");

  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${WIDGET_SRC}"]`);
    if (existing) {
      setScriptState("loaded");
      return;
    }

    setScriptState("loading");
    const script = document.createElement("script");
    script.src = WIDGET_SRC;
    script.defer = true;
    script.onload = () => setScriptState("loaded");
    script.onerror = () => setScriptState("error");
    document.body.appendChild(script);
  }, []);

  const statusLabel: Record<ScriptState, string> = {
    idle: "Script noch nicht gestartet",
    loading: "Script wird geladen …",
    loaded: "Script geladen",
    error: "Script konnte nicht geladen werden",
  };

  return (
    <>
      <SEO
        title="Widget-Test | Ristorante STORIA München"
        description="Interne Testseite für die Widget-Integration."
        canonical="/test"
        noIndex
        noHreflang
      />

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        {/* Hero */}
        <section className="relative h-[60vh] min-h-[480px] flex items-center justify-center overflow-hidden">
          <img
            src={heroImage}
            alt="Innenansicht des Ristorante STORIA in München"
            width={1920}
            height={1080}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-8 py-10 md:px-12 md:py-12 max-w-4xl mx-auto text-white">
              <Link to="/">
                <img
                  src={storiaLogo}
                  alt="STORIA – Italienisches Restaurant München Logo"
                  width={128}
                  height={128}
                  loading="eager"
                  className="h-20 md:h-28 w-auto mx-auto mb-6 hover:opacity-80 transition-opacity cursor-pointer brightness-0 invert"
                />
              </Link>

              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">Testseite</span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">{FACTS.address.street}</span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {FACTS.reviews.avg} ⭐ Google
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">Widget-Test</h1>
              <p className="text-lg text-white/80 mb-8 max-w-3xl mx-auto">
                Diese Seite dient ausschließlich dem Test der Widget-Einbindung im normalen
                Seitenlayout — mit Header, Navigation, Sektionen und Footer.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="#widget">
                    <UtensilsCrossed className="w-5 h-5 mr-2" />
                    Zum Widget
                  </a>
                </Button>
                <Button size="lg" variant="outlineWhite" asChild>
                  <LocalizedLink to="speisekarte">
                    Speisekarte
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </LocalizedLink>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Navigation />

        <main className="flex-grow">
          {/* Intro */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
                Warum diese Seite existiert
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Ein Widget verhält sich in einer leeren HTML-Datei anders als auf einer echten Seite:
                globale Styles, Tailwind-Resets, Schriftgrößen und die Container-Breite wirken auf die
                Darstellung. Deshalb steht das Widget hier im selben Layout wie auf jeder Landingpage —
                inklusive Header, Navigation, Sektionsabständen und Footer.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Die Seite ist <strong>noindex</strong> und weder in der Sitemap noch in der Navigation
                verlinkt.
              </p>
            </div>
          </section>

          {/* Widget */}
          <section id="widget" className="py-16 md:py-20 bg-muted/30 scroll-mt-24">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                Maestro-Widget
              </h2>
              <p className="text-center text-muted-foreground mb-10">
                Widget-ID <code className="text-sm">{WIDGET_ID}</code>
              </p>

              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-mono uppercase tracking-wider">
                    <span
                      className={
                        scriptState === "loaded"
                          ? "inline-block w-2.5 h-2.5 rounded-full bg-green-500"
                          : scriptState === "error"
                            ? "inline-block w-2.5 h-2.5 rounded-full bg-red-500"
                            : "inline-block w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse"
                      }
                      aria-hidden="true"
                    />
                    {statusLabel[scriptState]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Einbindungspunkt des Widgets.
                      data-maestro-api setzt die API-Basis explizit; der Loader würde sie sonst
                      aus document.currentScript.src ableiten — eine Variable weniger beim Testen. */}
                  <div data-maestro-widget={WIDGET_ID} data-maestro-api={WIDGET_API} />
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Kontext-Sektion, damit die Seite sich wie eine Landingpage anfühlt */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-5xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-10">
                Ristorante STORIA
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: "Küche", desc: "Neapolitanische Pizza, frische Pasta, italienische Klassiker." },
                  { title: "Lage", desc: `${FACTS.address.street}, ${FACTS.address.zip} ${FACTS.address.city} — Maxvorstadt, nahe Königsplatz.` },
                  { title: "Anlässe", desc: "Business-Lunch, Aperitivo, Firmenfeier, private Feiern bis 120 Personen." },
                ].map((item) => (
                  <Card key={item.title} className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">{item.desc}</CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 md:py-20 bg-muted/30">
            <div className="container mx-auto px-4 max-w-3xl text-center">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">Tisch reservieren</h2>
              <p className="text-muted-foreground mb-8">
                Telefonisch oder online — wir freuen uns auf Ihren Besuch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <LocalizedLink to="reservierung">
                    <UtensilsCrossed className="w-5 h-5 mr-2" />
                    Online reservieren
                  </LocalizedLink>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href={`tel:${FACTS.phoneTel}`}>
                    <Phone className="w-5 h-5 mr-2" />
                    {FACTS.phoneFormatted}
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TestWidget;
