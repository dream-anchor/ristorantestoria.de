import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import LegalDocument, { type LegalPart } from "@/components/legal/LegalDocument";
import datenschutzText from "@/content/legal/datenschutz.json";
import datenschutzEn from "@/content/legal/datenschutz.en.json";
import datenschutzIt from "@/content/legal/datenschutz.it.json";
import datenschutzFr from "@/content/legal/datenschutz.fr.json";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

// Text der Speranza GmbH, gemeinsam mit events-storia.de — siehe src/content/legal/README.md.
// Inhalt nur in der JSON-Datei ändern (und byte-gleich in events-storia.de), nicht hier.
// Die Fassungen in EN/IT/FR (datenschutz.<sprache>.json) sind unverbindliche Übersetzungen nur zur
// Information; rechtlich verbindlich ist ausschließlich die deutsche Fassung unter /datenschutz/.
type PageCopy = {
  title: string;
  description: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  canonical: string;
  parts: LegalPart[];
  /** Nur für Übersetzungen: Hinweis oben auf der Seite. */
  notice?: {
    text: string;
    linkText: string;
    german: string;
  };
};

const COPY: Record<Language, PageCopy> = {
  de: {
    title: "Datenschutzerklärung",
    description:
      "Datenschutzerklärung der Speranza GmbH (STORIA Restaurant München). Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Datenschutz",
    canonical: "/datenschutz",
    parts: datenschutzText as LegalPart[],
  },
  en: {
    title: "Privacy Policy",
    description:
      "Privacy policy of Speranza GmbH (STORIA Restaurant Munich), English translation for information purposes only. Only the German version is legally binding.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Privacy Policy",
    canonical: "/en/privacy-policy",
    parts: datenschutzEn as LegalPart[],
    notice: {
      text: "This English version is provided for information purposes only. Only the German version is legally binding:",
      linkText: "Datenschutzerklärung (German version)",
      german: "Rechtlich verbindlich ist ausschließlich die deutsche Fassung.",
    },
  },
  it: {
    title: "Informativa sulla privacy",
    description:
      "Informativa sulla privacy della Speranza GmbH (STORIA Ristorante Monaco di Baviera), traduzione italiana a solo scopo informativo. È giuridicamente vincolante esclusivamente la versione tedesca.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Privacy",
    canonical: "/it/privacy",
    parts: datenschutzIt as LegalPart[],
    notice: {
      text: "Questa versione italiana ha carattere meramente informativo. È giuridicamente vincolante esclusivamente la versione tedesca:",
      linkText: "Datenschutzerklärung (versione tedesca)",
      german: "Rechtlich verbindlich ist ausschließlich die deutsche Fassung.",
    },
  },
  fr: {
    title: "Politique de confidentialité",
    description:
      "Politique de confidentialité de Speranza GmbH (STORIA Restaurant Munich), traduction française à titre d’information uniquement. Seule la version allemande est juridiquement contraignante.",
    breadcrumbHome: "Accueil",
    breadcrumbCurrent: "Confidentialité",
    canonical: "/fr/confidentialite",
    parts: datenschutzFr as LegalPart[],
    notice: {
      text: "Cette version française est fournie à titre d’information uniquement. Seule la version allemande est juridiquement contraignante :",
      linkText: "Datenschutzerklärung (version allemande)",
      german: "Rechtlich verbindlich ist ausschließlich die deutsche Fassung.",
    },
  },
};

const Datenschutz = () => {
  const { language } = useLanguage();
  const copy = COPY[language] ?? COPY.de;
  const homePath = language === "de" ? "/" : `/${language}/`;
  usePrerenderReady(true);
  return (
    <>
      <SEO
        title={copy.title}
        description={copy.description}
        canonical={copy.canonical}
      />
      <StructuredData type="restaurant" includeReviews={false} />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: copy.breadcrumbHome, url: homePath },
          { name: copy.breadcrumbCurrent, url: copy.canonical }
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
                  <Link to={homePath} className="hover:text-foreground transition-colors">
                    {copy.breadcrumbHome}
                  </Link>
                </li>
                <li>/</li>
                <li className="text-foreground font-medium">{copy.breadcrumbCurrent}</li>
              </ol>
            </nav>

            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-12 text-center">
              {copy.title}
            </h1>

            {copy.notice && (
              <aside
                role="note"
                data-testid="datenschutz-translation-notice"
                className="mb-10 rounded-md border-l-4 border-primary bg-muted px-5 py-4 text-foreground"
              >
                <p className="font-semibold">
                  {copy.notice.text}{" "}
                  <Link to="/datenschutz/" hrefLang="de" lang="de" className="underline hover:no-underline">
                    {copy.notice.linkText}
                  </Link>
                </p>
                <p lang="de" className="mt-1 text-sm text-muted-foreground">
                  {copy.notice.german}
                </p>
              </aside>
            )}

            <LegalDocument parts={copy.parts} pageTitle={copy.title} />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Datenschutz;
