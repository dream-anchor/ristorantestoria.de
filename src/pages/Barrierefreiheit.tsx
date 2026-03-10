import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

const Barrierefreiheit = () => {
  usePrerenderReady(true);
  return (
    <>
      <SEO
        title="Barrierefreiheit – STORIA M\u00fcnchen"
        description="Erkl\u00e4rung zur Barrierefreiheit des Ristorante STORIA gem\u00e4\u00df BFSG. Kontakt bei Problemen und Hinweis auf die Schlichtungsstelle."
        canonical="/barrierefreiheit/"
        noHreflang
        noIndex={false}
      />

      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <Navigation />

        <main id="main-content" className="flex-grow">
          <div className="container mx-auto px-4 py-24 md:py-32 max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">
              Erkl\u00e4rung zur Barrierefreiheit
            </h1>

            <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
              <p>
                Das Ristorante STORIA (Speranza GmbH) ist bem\u00fcht, seine Website
                barrierefrei zug\u00e4nglich zu machen, gem\u00e4\u00df dem Barrierefreiheitst\u00e4rkungsgesetz
                (BFSG) und der europ\u00e4ischen Norm EN 301 549.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8">
                Stand der Vereinbarkeit
              </h2>
              <p>
                Diese Website ist mit den Anforderungen der WCAG 2.1 auf Stufe AA teilweise
                vereinbar. Die nachfolgend aufgef\u00fchrten Bereiche sind noch nicht vollst\u00e4ndig
                barrierefrei:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Eingebettete Karten (Google Maps) erfordern Cookie-Zustimmung und sind ohne diese nicht zug\u00e4nglich.</li>
                <li>Einige \u00e4ltere PDF-Dokumente sind m\u00f6glicherweise nicht vollst\u00e4ndig barrierefrei.</li>
              </ul>

              <h2 className="text-xl font-semibold text-foreground mt-8">
                Erstellung dieser Erkl\u00e4rung
              </h2>
              <p>
                Diese Erkl\u00e4rung wurde am 10. M\u00e4rz 2026 erstellt. Die Einsch\u00e4tzung basiert auf
                einer Selbstbewertung.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8">
                Feedback und Kontakt
              </h2>
              <p>
                Wenn Sie Barrieren auf unserer Website bemerken oder Informationen in
                barrierefreier Form ben\u00f6tigen, wenden Sie sich bitte an uns:
              </p>
              <address className="not-italic space-y-1">
                <p><strong>Speranza GmbH</strong></p>
                <p>Theresienstra\u00dfe 56, 80333 M\u00fcnchen</p>
                <p>
                  E-Mail:{" "}
                  <a href="mailto:info@ristorantestoria.de" className="text-primary hover:underline">
                    info@ristorantestoria.de
                  </a>
                </p>
                <p>
                  Telefon:{" "}
                  <a href="tel:+498928806855" className="text-primary hover:underline">
                    +49 89 28806855
                  </a>
                </p>
              </address>
              <p>
                Wir bem\u00fchen uns, auf Ihre Anfrage innerhalb von 6 Wochen zu antworten.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8">
                Schlichtungsverfahren
              </h2>
              <p>
                Wenn Sie der Ansicht sind, dass unsere Antwort auf Ihre Meldung oder Anfrage
                nicht zufriedenstellend ist, k\u00f6nnen Sie die Schlichtungsstelle gem\u00e4\u00df \u00a7 16
                BFSG einschalten:
              </p>
              <address className="not-italic space-y-1">
                <p><strong>Schlichtungsstelle nach dem Barrierefreiheitst\u00e4rkungsgesetz</strong></p>
                <p>beim Bundeszentrum f\u00fcr barrierefreie Informationstechnik (BIK)</p>
                <p>Augustenstra\u00dfe 1, 80333 M\u00fcnchen</p>
                <p>
                  Website:{" "}
                  <a
                    href="https://www.schlichtungsstelle-bgg.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    www.schlichtungsstelle-bgg.de
                  </a>
                </p>
              </address>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Barrierefreiheit;
