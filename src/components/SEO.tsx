import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import allSlugs from "@/config/slugs.json";

const BASE_URL = "https://www.ristorantestoria.de";
const LANGUAGES = ["de", "en", "it", "fr"] as const;

/**
 * Normalisiert einen canonical-Pfad zur vollständigen kanonischen URL.
 * Regeln:
 * - Immer https://www.ristorantestoria.de als Basis
 * - Immer trailing Slash (außer bei Dateipfaden mit Extension)
 * - Keine Query-Parameter
 * - Keine Hash-Fragmente
 */
function buildCanonicalUrl(canonical: string): string {
  // Absolute URL bereits übergeben → nur Base-URL sicherstellen
  if (canonical.startsWith("http")) {
    try {
      const url = new URL(canonical);
      // Erzwinge www-Version
      const path = url.pathname;
      return BASE_URL + normalizeTrailingSlash(path);
    } catch {
      return BASE_URL + "/";
    }
  }

  // Relativer Pfad: Query-Parameter und Hash entfernen
  let path = canonical;
  const hashIndex = path.indexOf("#");
  if (hashIndex !== -1) path = path.slice(0, hashIndex);
  const queryIndex = path.indexOf("?");
  if (queryIndex !== -1) path = path.slice(0, queryIndex);

  // Leading Slash sicherstellen
  if (!path.startsWith("/")) path = "/" + path;

  return BASE_URL + normalizeTrailingSlash(path);
}

/**
 * Stellt sicher, dass der Pfad mit einem trailing Slash endet,
 * außer bei Pfaden die wie Dateien aussehen (z.B. /sitemap.xml).
 */
function normalizeTrailingSlash(path: string): string {
  // Root bleibt /
  if (path === "/") return "/";
  // Pfade mit Datei-Extension (z.B. .xml, .html, .pdf) unverändert lassen
  const lastSegment = path.split("/").pop() || "";
  if (lastSegment.includes(".")) return path;
  // Trailing Slash hinzufügen falls nicht vorhanden
  return path.endsWith("/") ? path : path + "/";
}

/**
 * Berechnet hreflang-URLs aus dem canonical-Pfad + slugs.json.
 * Ermittelt den Base-Slug per Reverse-Lookup und baut alle 4 Sprach-URLs.
 */
function computeHreflangFromCanonical(canonical: string): Record<string, string> | null {
  if (!canonical || canonical === "/") return null;

  // Pfad normalisieren: leading slash, kein trailing slash
  let path = canonical.startsWith("/") ? canonical : "/" + canonical;
  path = path.replace(/\/$/, "");

  // Sprach-Prefix und Slug extrahieren
  let currentLang = "de";
  let slug = path.slice(1); // ohne leading slash
  for (const lang of ["en", "it", "fr"]) {
    if (path.startsWith(`/${lang}/`)) {
      currentLang = lang;
      slug = path.slice(lang.length + 2); // "/{lang}/" entfernen
      break;
    }
    if (path === `/${lang}`) {
      // Root einer Sprache → Homepage
      return null;
    }
  }

  if (!slug) return null;

  // Reverse-Lookup: localizedSlug → baseSlug
  const langSlugs = (allSlugs as any)[currentLang] as Record<string, string> | undefined;
  if (!langSlugs) return null;

  let baseSlug: string | null = null;
  for (const [base, localized] of Object.entries(langSlugs)) {
    if (localized === slug) {
      baseSlug = base;
      break;
    }
  }

  if (!baseSlug) return null;

  // URLs für alle 4 Sprachen bauen
  const urls: Record<string, string> = {};
  for (const lang of LANGUAGES) {
    const localizedSlug = (allSlugs as any)[lang]?.[baseSlug];
    if (localizedSlug === undefined || localizedSlug === null) continue;
    const langPath = lang === "de"
      ? `/${localizedSlug}`
      : `/${lang}/${localizedSlug}`;
    urls[lang] = `${BASE_URL}${normalizeTrailingSlash(langPath)}`;
  }

  // Nur zurückgeben wenn mindestens DE vorhanden
  return urls.de ? urls : null;
}

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
  noHreflang?: boolean;
  ogImage?: string;
  ogType?: string;
  /** Optionale hreflang-Overrides für Seiten mit dynamischen Slugs */
  hreflangUrls?: {
    de?: string;
    en?: string;
    it?: string;
    fr?: string;
  };
}

const SEO = ({
  title,
  description,
  canonical,
  noIndex = false,
  noHreflang = false,
  ogImage,
  ogType = "website",
  hreflangUrls,
}: SEOProps) => {
  const { language } = useLanguage();

  // Vollständiger Seiten-Title
  const fullTitle = title
    ? (title.includes('STORIA') ? title : `${title} – STORIA München`)
    : "STORIA – Ristorante Pizzeria Bar München";

  // Kanonische URL normalisiert
  const canonicalUrl = canonical
    ? buildCanonicalUrl(canonical)
    : `${BASE_URL}/`;

  // OG-Image Fallback
  const ogImageUrl = ogImage || `${BASE_URL}/og-image.jpg`;

  // hreflang-URLs: explizite Overrides > automatische Berechnung aus slugs.json > Fallback auf Homepage
  const computedHreflang = !hreflangUrls && canonical ? computeHreflangFromCanonical(canonical) : null;
  const effectiveHreflang = {
    de: hreflangUrls?.de || computedHreflang?.de || `${BASE_URL}${canonical ? normalizeTrailingSlash(canonical.startsWith("/") ? canonical.split("?")[0].split("#")[0] : "/" + canonical.split("?")[0].split("#")[0]) : "/"}`,
    en: hreflangUrls?.en || computedHreflang?.en || `${BASE_URL}/en/`,
    it: hreflangUrls?.it || computedHreflang?.it || `${BASE_URL}/it/`,
    fr: hreflangUrls?.fr || computedHreflang?.fr || `${BASE_URL}/fr/`,
  };

  return (
    <Helmet>
      {/* Basis */}
      <html lang={language === "de" ? "de" : language} />
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}

      {/* Indexierung */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical — self-referencing, immer www + trailing slash */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:site_name" content="STORIA München" />
      <meta property="og:locale" content={language === "de" ? "de_DE" : language === "en" ? "en_GB" : language === "it" ? "it_IT" : "fr_FR"} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImageUrl} />

      {/* Geo-Tags für lokales SEO */}
      <meta name="geo.region" content="DE-BY" />
      <meta name="geo.placename" content="München" />
      <meta name="geo.position" content="48.1467;11.5641" />
      <meta name="ICBM" content="48.1467, 11.5641" />

      {/* hreflang — kein Fragment (react-helmet-async SSR-Kompatibilität) */}
      {!noHreflang && !noIndex && <link rel="alternate" hrefLang="de" href={effectiveHreflang.de} />}
      {!noHreflang && !noIndex && <link rel="alternate" hrefLang="en" href={effectiveHreflang.en} />}
      {!noHreflang && !noIndex && <link rel="alternate" hrefLang="it" href={effectiveHreflang.it} />}
      {!noHreflang && !noIndex && <link rel="alternate" hrefLang="fr" href={effectiveHreflang.fr} />}
      {!noHreflang && !noIndex && <link rel="alternate" hrefLang="x-default" href={effectiveHreflang.de} />}
    </Helmet>
  );
};

export default SEO;
