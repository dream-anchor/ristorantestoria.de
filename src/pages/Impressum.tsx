import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import LegalDocument, { type LegalPart } from "@/components/legal/LegalDocument";
import impressumText from "@/content/legal/impressum.json";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

// Text der Speranza GmbH, gemeinsam mit events-storia.de — siehe src/content/legal/README.md.
// Inhalt nur in der JSON-Datei ändern (und byte-gleich in events-storia.de), nicht hier.
const Impressum = () => {
  usePrerenderReady(true);
  return (
    <>
      <SEO
        title="Impressum"
        description="Impressum der Speranza GmbH (Ristorante STORIA und events-storia.de, München): Anbieterkennzeichnung, Kontakt, Registereintrag und Haftungshinweise."
        canonical="/impressum"
        noHreflang
        noIndex={false}
      />
      <StructuredData type="restaurant" includeReviews={false} />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Impressum', url: '/impressum' }
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
                <li className="text-foreground font-medium">Impressum</li>
              </ol>
            </nav>

            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-12 text-center">
              Impressum
            </h1>

            <LegalDocument parts={impressumText as LegalPart[]} pageTitle="Impressum" />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Impressum;
