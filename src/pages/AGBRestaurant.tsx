import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { FACTS } from "@/config/facts";

/**
 * AGB-2026-10 (28.09.2026): Die früheren Restaurant-AGB sind in den gemeinsamen STORIA-AGB auf
 * events-storia.de/agb aufgegangen (Veranstaltungen, Catering, Online-Shop, Tischreservierungen).
 * /agb-restaurant leitet per 301 dorthin (public/.htaccess, Abschnitt 0). Diese Seite ist nur der
 * Rückfall, falls die Weiterleitung (noch) nicht greift: kurzer Hinweis + Link, noindex, nicht in
 * der Sitemap (scripts/generate-sitemap.mjs, EXCLUDED_ROUTES).
 */

const AGBRestaurant = () => {
  usePrerenderReady(true);
  return (
    <>
      <SEO
        title="AGB Restaurant"
        description="Die AGB von STORIA München für Veranstaltungen, Catering, Online-Shop und Tischreservierungen finden Sie gebündelt auf events-storia.de/agb."
        canonical="/agb-restaurant"
        noHreflang
        noIndex
      />
      <StructuredData type="restaurant" includeReviews={false} />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'AGB Restaurant', url: '/agb-restaurant' }
        ]}
      />
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <ol className="flex items-center gap-2">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground font-medium">AGB Restaurant</li>
            </ol>
          </nav>

          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-12 text-center">
            Allgemeine Geschäftsbedingungen
          </h1>

          <div className="prose prose-lg max-w-none space-y-6 text-foreground/90">
            <p>
              Unsere AGB für Veranstaltungen im Restaurant, Catering, den Online-Shop und
              Tischreservierungen haben wir auf einer gemeinsamen Seite zusammengeführt
              (Version AGB-2026-10, Stand 28. September 2026):
            </p>
            <p className="text-center">
              <a
                href={FACTS.agbUrl}
                className="inline-block rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground no-underline hover:opacity-90"
              >
                Zu den AGB auf events-storia.de
              </a>
            </p>
            <p>
              Für Tischreservierungen gilt dort Teil D (§§ 26–27), unter anderem: Absage oder Änderung
              bis 24 Stunden vor der reservierten Uhrzeit kostenfrei; den Tisch halten wir 15 Minuten
              ab der reservierten Uhrzeit frei; eine Ausfallpauschale von 25 € pro nicht erschienener
              Person berechnen wir nur, wenn wir bei der Reservierung ausdrücklich darauf hingewiesen
              haben.
            </p>
            <p>
              Für Gutscheine gelten weiterhin unsere{" "}
              <a href="/agb-gutscheine/" className="text-primary hover:underline">
                AGB Gutscheine
              </a>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
    </>
  );
};

export default AGBRestaurant;
