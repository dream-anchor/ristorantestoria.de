import { Helmet } from '@/lib/helmetAsync';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedPath, parseLocalizedPath, SUPPORTED_LANGUAGES } from '@/config/routes';
import { useLocation } from 'react-router-dom';

interface AlternateUrl {
  lang: string;
  url: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'restaurant';
  image?: string;
  noIndex?: boolean;
  /** Custom hreflang alternates for dynamic pages (e.g., special menus with translated slugs) */
  alternates?: AlternateUrl[];
}

const SEO = ({
  title,
  description,
  canonical,
  type = 'website',
  image = 'https://ristorantestoria.de/og-image.jpg',
  noIndex = false,
  alternates,
}: SEOProps) => {
  const { language, t } = useLanguage();
  const location = useLocation();
  const baseUrl = 'https://www.ristorantestoria.de';

  const siteTitle = 'STORIA – Italienisches Restaurant München Maxvorstadt';
  const fullTitle = title ? `${title} | STORIA München` : siteTitle;

  const metaDescription = description || t.pages.index.description;

  // Ensure trailing slash on all paths (consistent with .htaccess rule 1c)
  const ensureTrailingSlash = (p: string) =>
    p === '/' || p.endsWith('/') ? p : `${p}/`;

  // Get the base slug for hreflang generation
  const { baseSlug } = parseLocalizedPath(location.pathname);

  // Build canonical URL for current language
  const currentPath = ensureTrailingSlash(canonical || getLocalizedPath(baseSlug, language));
  const canonicalUrl = `${baseUrl}${currentPath}`;

  // Generate hreflang URLs for all languages
  // Use custom alternates if provided (for dynamic pages with translated slugs)
  const hreflangUrls = alternates
    ? alternates.map(a => ({ ...a, url: a.url.endsWith('/') ? a.url : `${a.url}/` }))
    : SUPPORTED_LANGUAGES.map(lang => ({
      lang,
      url: `${baseUrl}${getLocalizedPath(baseSlug, lang)}`
    }));

  // x-default points to German version
  const xDefaultUrl = alternates
    ? alternates.find(a => a.lang === 'de')?.url || `${baseUrl}/`
    : `${baseUrl}${getLocalizedPath(baseSlug, 'de')}`;
  
  // Locale mapping for Open Graph
  const ogLocaleMap: Record<string, string> = {
    de: 'de_DE',
    en: 'en_US',
    it: 'it_IT',
    fr: 'fr_FR',
  };

  return (
    <Helmet>
      {/* Favicon - explizit setzen für alle Seiten mit Cache-Busting */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png?v=2" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png?v=2" />
      <link rel="shortcut icon" href="/favicon.png?v=2" type="image/png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />
      
      {/* Primary Meta Tags */}
      <html lang={language} />
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="author" content="Ristorante STORIA" />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang Tags for all languages */}
      {hreflangUrls.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={xDefaultUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={ogLocaleMap[language]} />
      {SUPPORTED_LANGUAGES.filter(l => l !== language).map(lang => (
        <meta key={lang} property="og:locale:alternate" content={ogLocaleMap[lang]} />
      ))}
      <meta property="og:site_name" content="STORIA Ristorante" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="DE-BY" />
      <meta name="geo.placename" content="München" />
      <meta name="geo.position" content="48.1456;11.5656" />
      <meta name="ICBM" content="48.1456, 11.5656" />
    </Helmet>
  );
};

export default SEO;