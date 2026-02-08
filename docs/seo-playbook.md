# SEO-Playbook: Von ristorantestoria.de zu events-storia.de

> Vollstandige Dokumentation aller SEO-Optimierungen als Referenz fur Claude Code.
> Ziel: 1:1 Ubertragung auf events-storia.de (DE + EN, gleicher Stack).

**Quelle:** ristorantestoria.de (Vite + React + TS + Tailwind + shadcn + Supabase + IONOS Apache)
**Ziel:** events-storia.de (identischer Stack, nur DE + EN statt DE/EN/IT/FR)

---

## Inhaltsverzeichnis

1. [Build-Pipeline & SSG](#1-build-pipeline--ssg)
2. [SEO-Komponente & Meta-Tags](#2-seo-komponente--meta-tags)
3. [Structured Data / JSON-LD](#3-structured-data--json-ld)
4. [i18n-URL-Architektur & Routing](#4-i18n-url-architektur--routing)
5. [Translation-System](#5-translation-system)
6. [.htaccess — Server-Konfiguration](#6-htaccess--server-konfiguration)
7. [Sitemap-Generierung](#7-sitemap-generierung)
8. [robots.txt](#8-robotstxt)
9. [FAQ-Pattern fur SEO](#9-faq-pattern-fur-seo)
10. [Bild- & Video-Optimierung](#10-bild---video-optimierung)
11. [Landing-Page-Blueprint](#11-landing-page-blueprint)
12. [SEO-Operations-System](#12-seo-operations-system)
13. [PWA & Web App Manifest](#13-pwa--web-app-manifest)
14. [Performance & Core Web Vitals](#14-performance--core-web-vitals)
15. [Checkliste: Neue Seite SEO-ready machen](#15-checkliste-neue-seite-seo-ready-machen)

---

## 1. Build-Pipeline & SSG

### Zweck
Jede Seite wird zur Build-Zeit als statisches HTML vorgerendert (SSG). Suchmaschinen erhalten vollstandiges HTML mit Meta-Tags, JSON-LD und Content — kein Client-Side-Only Rendering.

### Vorlage-Dateien (ristorantestoria.de)
- `vite.config.ts`
- `package.json` (Zeile 6-13)
- `src/entry-server.tsx`
- `prerender.js`
- `src/hooks/usePrerenderReady.ts`

### Build-Reihenfolge

```json
{
  "build": "npm run build:client && npm run build:server && npm run build:prerender && npm run generate:sitemap",
  "build:client": "vite build",
  "build:server": "vite build --ssr src/entry-server.tsx --outDir dist/server",
  "build:prerender": "node prerender.js",
  "generate:sitemap": "node scripts/generate-sitemap.mjs"
}
```

**Ablauf:**
1. **build:client** — Vite erstellt Client-Bundle (JS, CSS, Assets) in `dist/`
2. **build:server** — Vite erstellt SSR-Bundle in `dist/server/entry-server.js`
3. **build:prerender** — Node-Script rendert alle Routen zu statischem HTML
4. **generate:sitemap** — Erzeugt `dist/sitemap.xml` mit allen URLs + hreflang

### vite.config.ts — Kritische SSR-Einstellungen

```ts
export default defineConfig(({ mode, isSsrBuild }) => ({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: [
      // SSR-safe Supabase Client (kein Browser-APIs im Server-Build)
      ...(isSsrBuild ? [{
        find: /^@\/integrations\/supabase\/client$/,
        replacement: path.resolve(__dirname, "./src/integrations/supabase/client.ssr.ts"),
      }] : []),
      { find: /^@\//, replacement: path.resolve(__dirname, "./src") + "/" },
    ],
  },
  ssr: {
    // KRITISCH: react-helmet-async muss gebundelt werden (CJS/ESM Interop)
    noExternal: ["react-helmet-async"],
  },
}));
```

### entry-server.tsx — SSR-Rendering

```tsx
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider, dehydrate } from '@tanstack/react-query'
import App from './App'

export function render(url: string, context = {}) {
  const helmetContext = {} as any
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity, retry: false } },
  })

  // Optional: Cache mit Server-Daten vorfullen
  if (context.menuData && context.menuType) {
    queryClient.setQueryData(['menu', context.menuType], context.menuData)
  }

  const html = ReactDOMServer.renderToString(
    <QueryClientProvider client={queryClient}>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </QueryClientProvider>
  )

  const { helmet } = helmetContext
  const dehydratedState = dehydrate(queryClient)
  return { html, helmet, dehydratedState }
}
```

### prerender.js — HTML-Generierung (Kernlogik)

```js
// Fur jede Route:
const { html, helmet, dehydratedState } = render(url, { menuData, menuType });

// 1. App-HTML in Template injizieren
let finalHtml = template.replace(
  /<div id="root">(?:<!--app-html-->|\s)*<\/div>/,
  `<div id="root">${html}</div>`
);

// 2. React Query State fur Hydration injizieren
if (dehydratedState?.queries?.length > 0) {
  const stateScript = `<script>window.__REACT_QUERY_STATE__=${JSON.stringify(dehydratedState)}</script>`;
  finalHtml = finalHtml.replace("</head>", `${stateScript}</head>`);
}

// 3. Helmet SEO-Tags injizieren (title, meta, link, script)
if (helmet) {
  const helmetHtml = [
    helmet.title?.toString(),
    helmet.meta?.toString(),
    helmet.link?.toString(),
    helmet.script?.toString(),
  ].filter(Boolean).join('\n');
  finalHtml = finalHtml.replace("</head>", `${helmetHtml}</head>`);
}

// 4. Ordnerstruktur fur IONOS (verhindert 403)
// /en/ -> dist/en/index.html
const cleanUrl = url === '/' ? '' : url.replace(/\/$/, '');
const filePath = `dist${cleanUrl}/index.html`;
fs.writeFileSync(filePath, finalHtml);
```

### Anpassung fur events-storia.de
- `LANGUAGES` auf `["de", "en"]` reduzieren
- Supabase-Credentials anpassen
- Route-Discovery aus eigenem `slugs.json` lesen
- SSR-safe Supabase Client erstellen (`client.ssr.ts` — verwendet `createClient` ohne localStorage)

---

## 2. SEO-Komponente & Meta-Tags

### Zweck
Zentrale Komponente die pro Seite Title, Description, Canonical, hreflang, Open Graph, Twitter Cards und Geo-Tags via React Helmet rendert.

### Vorlage-Datei
- `src/components/SEO.tsx`

### Interface

```tsx
interface SEOProps {
  title?: string;           // Seitentitel (wird zu "Title | BRAND")
  description?: string;     // Meta-Description
  canonical?: string;       // Kanonischer Pfad (z.B. "/events")
  type?: 'website' | 'article' | 'restaurant';
  image?: string;           // OG-Image URL
  noIndex?: boolean;        // Fur Admin-Seiten
  alternates?: AlternateUrl[];  // Custom hreflang fur dynamische Seiten
  noHreflang?: boolean;     // Legal Pages (nur DE)
}
```

### Kernlogik

```tsx
const SEO = ({ title, description, canonical, noHreflang, alternates, ...props }: SEOProps) => {
  const { language, t } = useLanguage();
  const location = useLocation();
  const baseUrl = 'https://www.DEINE-DOMAIN.de';  // ANPASSEN

  // Title-Format: "Seitentitel | BRAND"
  const fullTitle = title ? `${title} | BRAND` : 'Default Title';

  // Trailing Slash erzwingen (konsistent mit .htaccess)
  const ensureTrailingSlash = (p: string) =>
    p === '/' || p.endsWith('/') ? p : `${p}/`;

  // Base-Slug fur hreflang extrahieren
  const { baseSlug } = parseLocalizedPath(location.pathname);

  // Canonical URL bauen
  const currentPath = noHreflang
    ? ensureTrailingSlash(canonical || getLocalizedPath(baseSlug, 'de'))
    : ensureTrailingSlash(canonical || getLocalizedPath(baseSlug, language));
  const canonicalUrl = `${baseUrl}${currentPath}`;

  // hreflang fur alle Sprachen (auSer Legal Pages)
  const hreflangUrls = noHreflang ? [] : alternates
    ? alternates.map(a => ({ ...a, url: a.url.endsWith('/') ? a.url : `${a.url}/` }))
    : SUPPORTED_LANGUAGES.map(lang => ({
        lang,
        url: `${baseUrl}${getLocalizedPath(baseSlug, lang)}`
      }));

  return (
    <Helmet>
      <html lang={language} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* hreflang Tags */}
      {!noHreflang && hreflangUrls.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      {!noHreflang && <link rel="alternate" hrefLang="x-default" href={xDefaultUrl} />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={ogLocaleMap[language]} />
      <meta property="og:site_name" content="BRAND" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />

      {/* Geo Tags (Local SEO) */}
      <meta name="geo.region" content="DE-BY" />
      <meta name="geo.placename" content="Munchen" />
      <meta name="geo.position" content="LAT;LNG" />   {/* ANPASSEN */}
      <meta name="ICBM" content="LAT, LNG" />           {/* ANPASSEN */}
    </Helmet>
  );
};
```

### Anpassung fur events-storia.de
- `baseUrl` andern: `https://www.events-storia.de`
- `siteTitle` und `fullTitle` Format anpassen
- `image` Default auf eigenes OG-Image
- Geo-Tags: Eigene Koordinaten + Adresse
- `ogLocaleMap`: Nur `{ de: 'de_DE', en: 'en_US' }`
- `SUPPORTED_LANGUAGES`: Nur `["de", "en"]`

---

## 3. Structured Data / JSON-LD

### Zweck
Schema.org Structured Data fur Google Rich Results. Wird via React Helmet in den `<head>` injiziert.

### Vorlage-Dateien
- `src/components/StructuredData.tsx`
- `src/components/MenuStructuredData.tsx`

### Schemas

| Schema | Wann | Methode |
|--------|------|---------|
| Restaurant | Jede Seite | `<StructuredData type="restaurant" />` via Helmet |
| WebSite | Jede Seite (mit Restaurant) | Automatisch mit Restaurant |
| Organization | Jede Seite (mit Restaurant) | Automatisch mit Restaurant |
| BreadcrumbList | Seiten mit Breadcrumbs | `<StructuredData type="breadcrumb" breadcrumbs={[...]} />` |
| FAQPage | Seiten mit FAQ | Inline `<script dangerouslySetInnerHTML>` |
| FoodEvent | Saisonale Events | `<StructuredData type="event" eventData={...} />` |
| Menu | Speisekarten-Seiten | `<MenuStructuredData menu={...} />` |
| EventVenue | Landing Pages | Inline `<script dangerouslySetInnerHTML>` |

### Restaurant Schema (Kern)

```tsx
const restaurantSchema = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',              // ODER: 'EventVenue' fur events-storia.de
  '@id': 'https://www.DOMAIN.de/#restaurant',
  name: 'FIRMENNAME',                 // ANPASSEN
  alternateName: 'KURZNAME',          // ANPASSEN
  description: t.pages.index.description,
  url: 'https://www.DOMAIN.de',
  telephone: '+49 89 XXXXXXXX',       // ANPASSEN
  email: 'info@DOMAIN.de',            // ANPASSEN
  priceRange: 'EUR-EUR',                  // ANPASSEN
  servesCuisine: ['Italian', ...],    // ANPASSEN
  acceptsReservations: true,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'StraSSe Nr',       // ANPASSEN
    addressLocality: 'Munchen',
    postalCode: '80XXX',               // ANPASSEN
    addressRegion: 'Bayern',
    addressCountry: 'DE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: XX.XXXX,                // ANPASSEN
    longitude: XX.XXXX,               // ANPASSEN
  },
  openingHoursSpecification: [...],   // ANPASSEN
  sameAs: ['Instagram', 'Google Maps CID', ...],  // ANPASSEN
  founder: [...],                     // ANPASSEN
  amenityFeature: [...],              // ANPASSEN
  areaServed: [                       // ANPASSEN
    { '@type': 'City', name: 'Munchen' },
    { '@type': 'AdministrativeArea', name: 'Maxvorstadt' },
  ],
  potentialAction: [
    { '@type': 'ReserveAction', target: { urlTemplate: 'https://www.DOMAIN.de/reservierung' }},
  ],
};
```

### Breadcrumb Schema

```tsx
<StructuredData type="breadcrumb" breadcrumbs={[
  { name: 'Home', url: '/' },
  { name: 'Events', url: '/events' },
  { name: 'Aktuelle Seite', url: '/events/silvester' }
]} />
```

### FAQ Schema (Inline — NICHT uber Helmet)

```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.slice(0, 10).map(faq => ({
    "@type": "Question",
    "name": faq.q,
    "acceptedAnswer": { "@type": "Answer", "text": faq.a }
  }))
})}} />
```

**Wichtig:** Max 10 FAQ-Items pro Seite (Google-Limit). Genau 1x FAQPage pro URL.

### Anpassung fur events-storia.de
- `@type` moglicherweise `EventVenue` statt `Restaurant`
- Alle NAP-Daten (Name, Adresse, Telefon) anpassen
- Koordinaten, Offnungszeiten, sameAs-Links anpassen
- Amenities passend fur Eventlocation
- `inLanguage`: Nur `['de-DE', 'en-US']`

---

## 4. i18n-URL-Architektur & Routing

### Zweck
Zweisprachige URLs mit ubersetzten Slugs. DE ist Standardsprache ohne Prefix, EN bekommt `/en/` Prefix.

### Vorlage-Dateien
- `src/config/slugs.json`
- `src/config/routes.ts`
- `src/components/LocalizedLink.tsx`
- `src/contexts/LanguageContext.tsx`

### URL-Schema

| Sprache | Muster | Beispiel |
|---------|--------|----------|
| Deutsch | `/{slug}/` | `/veranstaltungen/` |
| Englisch | `/en/{slug}/` | `/en/events/` |

### slugs.json — Single Source of Truth

```json
{
  "de": {
    "home": "",
    "veranstaltungen": "veranstaltungen",
    "kontakt": "kontakt",
    "ueber-uns": "ueber-uns",
    "impressum": "impressum",
    "datenschutz": "datenschutz"
  },
  "en": {
    "home": "",
    "veranstaltungen": "events",
    "kontakt": "contact",
    "ueber-uns": "about-us",
    "impressum": "imprint",
    "datenschutz": "privacy-policy"
  },
  "parentSlugs": {
    "de": "veranstaltungen",
    "en": "events"
  }
}
```

### Language Type (WICHTIG bei Reduktion auf 2 Sprachen)

```ts
// In LanguageContext.tsx — MUSS angepasst werden:
export type Language = "de" | "en";  // Statt "de" | "en" | "it" | "fr"
```

### routes.ts — Hilfsfunktionen

```ts
export const SUPPORTED_LANGUAGES: Language[] = ["de", "en"];
export const DEFAULT_LANGUAGE: Language = "de";

// Slug -> Pfad: getLocalizedPath("kontakt", "en") -> "/en/contact/"
export const getLocalizedPath = (baseSlug: string, language: Language): string => {
  const slugs = getSlugs(language);
  const localizedSlug = slugs[baseSlug] ?? baseSlug;
  if (language === "de") return localizedSlug ? `/${localizedSlug}/` : "/";
  return localizedSlug ? `/${language}/${localizedSlug}/` : `/${language}/`;
};

// Pfad -> Slug: parseLocalizedPath("/en/contact/") -> { language: "en", baseSlug: "kontakt" }
export const parseLocalizedPath = (path: string) => { ... };

// Alle Routen fur Prerendering
export const getAllLocalizedRoutes = () => { ... };

// Sprachswitch: gleiche Seite, andere Sprache
export const getLanguageSwitchUrl = (currentPath: string, targetLanguage: Language) => { ... };
```

### LocalizedLink — Automatische URL-Ubersetzung

```tsx
// Verwendung: <LocalizedLink to="kontakt">Kontakt</LocalizedLink>
// DE -> /kontakt/   EN -> /en/contact/
const LocalizedLink = ({ to, children, ...props }) => {
  const { language } = useLanguage();

  // Externe URLs, Hash-Links, mailto:, tel: durchlassen
  if (to.startsWith("http") || to.startsWith("#") || to.startsWith("mailto:") || to.startsWith("tel:")) {
    return <Link to={to} {...props}>{children}</Link>;
  }

  // Hash und Query-Params extrahieren, Slug ubersetzen
  const localizedPath = getLocalizedPath(baseSlug, language) + queryString + hash;
  return <Link to={localizedPath} {...props}>{children}</Link>;
};
```

### LanguageContext — Spracherkennung

```tsx
// Spracherkennung: URL > localStorage > Browser > Default (DE)
// SSR-safe: typeof window === "undefined" -> DEFAULT_LANGUAGE
// Sync: Sprache andert sich automatisch wenn URL wechselt
```

### LanguageContext — SSR-Safety (KRITISCH)

```tsx
// Sprache wird SSR-safe erkannt:
const detectBrowserLanguage = (): Language => {
  // Server: Kein window -> Default-Sprache
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  // 1. localStorage prufen
  const saved = localStorage.getItem("storia-language");
  if (saved && SUPPORTED_LANGUAGES.includes(saved as Language)) return saved as Language;

  // 2. Browser-Sprache erkennen
  const browserLangs = navigator.languages || [navigator.language];
  for (const lang of browserLangs) {
    const code = lang.split("-")[0].toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(code as Language)) return code as Language;
  }

  return DEFAULT_LANGUAGE;
};
```

### usePrerenderReady Hook

```tsx
// In jeder SSG-gerunderten Seite aufrufen:
usePrerenderReady(true);
// Setzt data-prerender-ready Attribut auf <html> und dispatcht Event
// prerender.js wartet auf dieses Signal bevor es den HTML-Snapshot nimmt
```

### Anpassung fur events-storia.de
- `SUPPORTED_LANGUAGES`: `["de", "en"]` (IT/FR entfernen)
- `Language` Type in LanguageContext.tsx: `"de" | "en"` (statt 4)
- `slugs.json`: Nur `de` + `en` Objekte + `parentSlugs`
- Translations: Nur `de.ts` + `en.ts` importieren
- localStorage Key anpassen (z.B. `"events-storia-language"`)

---

## 5. Translation-System

### Zweck
TypeScript-typisierte Ubersetzungen fur alle Texte inkl. SEO-relevanter Titles, Descriptions und FAQ-Inhalte.

### Vorlage-Dateien
- `src/translations/de.ts` (Referenz-Datei, definiert TypeScript-Typen)
- `src/translations/en.ts`

### Struktur

```ts
// de.ts (Hauptdatei — TypeScript leitet alle Typen hieraus ab)
export const de = {
  slugs: { home: "", kontakt: "kontakt", ... },
  nav: { home: "Home", contact: "Kontakt", ... },
  pages: {
    index: { title: "...", description: "..." },
  },
  seo: {
    eventName: {
      seoTitle: "Titel fur Google (max 60 Zeichen)",
      seoDescription: "Description fur Google (max 160 Zeichen)",
      heroTitle: "H1 Uberschrift",
      introP1: "Erster SEO-Absatz...",
      faq1Question: "Frage 1?",
      faq1Answer: "Antwort 1...",
      // ... bis faq8Question/faq8Answer
    },
  },
  footer: { ... },
  legal: { ... },
};
```

```ts
// en.ts — MUSS exakt die gleichen Keys haben wie de.ts
export const en: typeof import('./de').de = {
  slugs: { home: "", kontakt: "contact", ... },
  seo: {
    eventName: {
      seoTitle: "English title for Google",
      seoDescription: "English description",
      faq1Question: "Question 1?",
      faq1Answer: "Answer 1...",
    },
  },
};
```

**TypeScript-Sicherheit:** Wenn ein Key in `de.ts` existiert aber in `en.ts` fehlt, gibt es einen Build-Fehler.

### Anpassung fur events-storia.de
- Nur `de.ts` + `en.ts` erstellen
- IT/FR Dateien und Imports komplett entfernen
- SEO-Keys passend fur Event-Seiten benennen

---

## 6. .htaccess — Server-Konfiguration

### Zweck
Apache-Konfiguration fur IONOS-Hosting: Redirects, Caching, Komprimierung, SPA-Fallback.

### Vorlage-Datei
- `public/.htaccess` (281 Zeilen)

### Komplette Struktur (zum Anpassen)

```apache
# UTF-8
AddDefaultCharset UTF-8

# ============================================
# 0. SSG-Fix: Ordner -> index.html (verhindert 403 auf IONOS)
# ============================================
DirectoryIndex index.html

RewriteEngine On
RewriteBase /

# ============================================
# 1a. Subdomain Redirects
# ============================================
# newsletter.DOMAIN.de -> www.DOMAIN.de
RewriteCond %{HTTP_HOST} ^newsletter\.DOMAIN\.de$ [NC]
RewriteRule ^ https://www.DOMAIN.de/ [R=301,L]

# ============================================
# 1b. HTTPS + WWW + Trailing Slash — ein 301-Hop
# ============================================
# Nicht-kanonisch OHNE Slash -> https://www. MIT Slash
RewriteCond %{HTTPS} off [OR]
RewriteCond %{HTTP_HOST} !^www\. [NC]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_URI} !^/$
RewriteCond %{REQUEST_URI} !/$
RewriteCond %{REQUEST_URI} !\.[a-zA-Z0-9]+$
RewriteRule ^(.*)$ https://www.DOMAIN.de/$1/ [R=301,L]

# Nicht-kanonisch MIT Slash -> https://www.
RewriteCond %{HTTPS} off [OR]
RewriteCond %{HTTP_HOST} !^www\. [NC]
RewriteRule ^ https://www.DOMAIN.de%{REQUEST_URI} [R=301,L]

# Bereits https://www. aber ohne Slash -> Slash hinzufugen
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_URI} !^/$
RewriteCond %{REQUEST_URI} !/$
RewriteCond %{REQUEST_URI} !\.[a-zA-Z0-9]+$
RewriteRule ^(.*)$ /$1/ [R=301,L]

# ============================================
# 1d. Multi-Language Slug Redirects
# ============================================
# DE-Slugs auf EN-Pfaden -> korrekte EN-Slugs
# RewriteRule ^en/veranstaltungen/?$ /en/events/ [R=301,L]
# ... (fur jeden ubersetzten Slug)

# ============================================
# 1i. Legal Pages — Nur DE
# ============================================
# Fremdsprachige Legal URLs -> DE Version
RewriteRule ^en/imprint/?$ /impressum/ [R=301,L]
RewriteRule ^en/privacy-policy/?$ /datenschutz/ [R=301,L]
# ... (fur jede Legal Page)

# ============================================
# 2. Error Documents
# ============================================
ErrorDocument 404 /index.html
ErrorDocument 500 /index.html

# ============================================
# 3. SPA-Routing & SSG Support
# ============================================
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]

RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

RewriteRule ^ index.html [L]

# ============================================
# 4. MIME-Types
# ============================================
<IfModule mod_mime.c>
  AddType application/javascript .js
  AddType text/css .css
  AddType image/webp .webp
  AddType image/svg+xml .svg
  AddType font/woff2 .woff2
  AddType application/xml .xml
  AddType text/plain .txt
</IfModule>

# ============================================
# 5. GZIP
# ============================================
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>

# ============================================
# 6. Browser-Caching
# ============================================
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# ============================================
# 7. Sitemap XML
# ============================================
<Files "sitemap.xml">
  ForceType application/xml
  <IfModule mod_headers.c>
    Header set Content-Type "application/xml; charset=UTF-8"
    Header set Cache-Control "no-cache, no-store, must-revalidate"
  </IfModule>
</Files>
AddCharset UTF-8 .xml
```

### Anpassung fur events-storia.de
- Domain uberall ersetzen: `DOMAIN.de` -> `events-storia.de`
- Nur EN-Redirects (IT/FR komplett entfernen)
- Legacy-CMS-Redirects: eigene alte URLs eintragen
- Subdomain-Redirects anpassen

---

## 7. Sitemap-Generierung

### Zweck
Dynamische XML-Sitemap mit allen Seiten + hreflang fur DE + EN. Wird bei jedem Build neu generiert.

### Vorlage-Datei
- `scripts/generate-sitemap.mjs`

### Konfiguration

```js
const BASE_URL = "https://www.events-storia.de";   // ANPASSEN
const LANGUAGES = ["de", "en"];                     // Nur 2 Sprachen
const EXCLUDED_ROUTES = ["admin", "admin/login"];
const LEGAL_ONLY_DE = ["impressum", "datenschutz", "cookie-richtlinie", ...];
```

### Priority-Regeln

| Seitentyp | Priority | changefreq |
|-----------|----------|------------|
| Homepage | 1.0 | daily |
| Hauptseiten (Events, Kontakt) | 0.9 | weekly |
| Content-Seiten (Uber uns, Catering) | 0.8 | monthly |
| SEO Landing Pages | 0.7 | monthly |
| Legal Pages | 0.3 | monthly |
| Default | 0.6 | monthly |

### hreflang in Sitemap

```xml
<url>
  <loc>https://www.events-storia.de/veranstaltungen/</loc>
  <lastmod>2026-02-08</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
  <xhtml:link rel="alternate" hreflang="de" href="https://www.events-storia.de/veranstaltungen/" />
  <xhtml:link rel="alternate" hreflang="en" href="https://www.events-storia.de/en/events/" />
  <xhtml:link rel="alternate" hreflang="x-default" href="https://www.events-storia.de/veranstaltungen/" />
</url>
```

### Deduplication (WICHTIG)

Wenn saisonale Menus sowohl hardcoded (SEASONAL_MENUS) als auch in Supabase existieren,
mussen Duplikate verhindert werden:

```js
// Bereits bekannte saisonale Slugs sammeln
const seasonalDeSlugs = new Set(SEASONAL_MENUS.map(s => s.de.split('/').pop()));

// Dynamische Routen: Skip wenn bereits als Seasonal vorhanden
for (const route of dynamicRoutes) {
  const menuSlug = route.slugs.de.split('/').pop();
  if (seasonalDeSlugs.has(menuSlug)) {
    console.log(`Skipping "${menuSlug}" (already in seasonal routes)`);
    continue;
  }
  // ... URL generieren
}
```

### Anpassung fur events-storia.de
- `LANGUAGES` auf `["de", "en"]`
- `BASE_URL` anpassen
- Priority-Regeln fur Event-Seiten anpassen
- Dynamische Routen aus eigenem Supabase-Projekt
- Deduplication-Logik beibehalten

---

## 8. robots.txt

### Zweck
Steuert welche Bots crawlen durfen. Erlaubt Suchmaschinen + Social Media + nutzliche AI-Bots. Blockiert AI-Training-Bots und SEO-Scraper.

### Vorlage-Datei
- `public/robots.txt`

### Struktur (1:1 ubertragbar)

```txt
Sitemap: https://www.events-storia.de/sitemap.xml   # ANPASSEN

# ERLAUBT: Suchmaschinen
User-agent: Googlebot
Allow: /
# ... (Bing, DuckDuckBot, Ecosia, Applebot)

# ERLAUBT: Social Media Previews
User-agent: facebookexternalhit
Allow: /
# ... (Twitterbot, LinkedInBot, WhatsApp, Telegram)

# ERLAUBT: Review-Plattformen
User-agent: YelpBot
Allow: /
# ... (TripAdvisorBot, OpenTableBot)

# ERLAUBT: AI-Assistenten (Empfehlungen)
User-agent: GPTBot
Allow: /
# ... (ChatGPT-User, Claude-Web, PerplexityBot)

# BLOCKIERT: AI-Training-Bots
User-agent: Google-Extended
Disallow: /
# ... (CCBot, Amazonbot, Bytespider, ClaudeBot, Anthropic-AI)

# BLOCKIERT: SEO-Scraper
User-agent: AhrefsBot
Disallow: /
# ... (SemrushBot, MJ12bot, DotBot)

# Allgemein
User-agent: *
Allow: /
Disallow: /admin
Disallow: /assets/*.js$
Disallow: /assets/*.css$
Disallow: /functions/
```

### LLMs.txt (AI-Crawler-Optimierung)

```txt
# Am Anfang der robots.txt:
LLMs-Txt: https://www.events-storia.de/llms.txt

# Optional: Strukturierte HTML-Versionen fur AI-Assistenten
# German: https://www.events-storia.de/llm-de.html
# English: https://www.events-storia.de/llm-en.html
```

Diese Dateien (`public/llms.txt`, `public/llm-de.html`, `public/llm-en.html`) enthalten
aufbereitete Infos (Offnungszeiten, Menue, Adresse) damit ChatGPT/Claude/Perplexity
korrekte Empfehlungen geben.

### Anpassung fur events-storia.de
- Sitemap-URL anpassen
- Header-Kommentar anpassen
- Gleiche Bot-Liste verwenden
- Eigene llms.txt und llm-*.html erstellen

---

## 9. FAQ-Pattern fur SEO

### Zweck
FAQ-Inhalte mussen auch bei geschlossenem Accordion im DOM sein, damit Suchmaschinen sie crawlen konnen.

### Vorlage-Dateien
- Alle Dateien in `src/pages/seo/*.tsx`
- `src/pages/FAQ.tsx`

### Pattern: forceMount + data-[state=closed]:hidden

```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// FAQ-Daten aus Translations
const faqs = [
  { q: t.seo.eventName.faq1Question, a: t.seo.eventName.faq1Answer },
  // ... bis faq8
];

// Rendering
<Accordion type="single" collapsible className="w-full">
  {faqs.map((faq, i) => (
    <AccordionItem key={i} value={`faq-${i}`}>
      <AccordionTrigger className="text-left font-semibold">
        {faq.q}
      </AccordionTrigger>
      <AccordionContent
        forceMount                                          // KRITISCH: Immer im DOM
        className="text-muted-foreground data-[state=closed]:hidden"  // Visuell versteckt wenn zu
      >
        {faq.a}
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
```

**Warum?** Ohne `forceMount` rendert shadcn den Content erst bei Klick — Googlebot sieht ihn nicht.
Mit `forceMount` ist der Text immer im HTML, wird aber via CSS versteckt wenn das Accordion geschlossen ist.

### FAQPage JSON-LD dazu

```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.slice(0, 10).map(faq => ({
    "@type": "Question",
    "name": faq.q,
    "acceptedAnswer": { "@type": "Answer", "text": faq.a }
  }))
})}} />
```

**Regel:** Genau 1x FAQPage pro URL. Max 10 Items. Inline (nicht uber Helmet), um Hydration-Duplikate zu vermeiden.

### Anpassung fur events-storia.de
- 1:1 ubertragbar, keine Anpassung notig

---

## 10. Bild- & Video-Optimierung

### Zweck
Optimale Ladezeit und Core Web Vitals durch WebP, Lazy Loading und explizite Dimensionen.

### Patterns

| Element | Pattern | Beispiel |
|---------|---------|---------|
| Hero-Bild | `loading="eager"` | LCP-Optimierung |
| Alle anderen | `loading="lazy"` | Lazy Loading |
| Alle Bilder | `width` + `height` | CLS-Vermeidung |
| Format | `.webp` | Optimale Kompression |
| Alt-Text | Aus i18n | Ubersetzt, beschreibend |
| Video | `preload="none"` | Kein Auto-Download |

### Beispiel

```tsx
// Hero (LCP-kritisch)
<img
  src={heroImage}
  alt={t.seo.eventName.heroTitle}
  width={1200}
  height={800}
  loading="eager"
  className="w-full h-full object-cover"
/>

// Regulares Bild
<img
  src={eventImage}
  alt={t.imageGrid.altEvent}
  width={400}
  height={400}
  loading="lazy"
  className="w-full h-full object-cover"
/>

// Video (Footer oder Dekor)
<video
  src={mammaVideo}
  autoPlay muted loop playsInline
  preload="none"
  className="w-full h-full object-cover"
/>
```

### Anpassung fur events-storia.de
- 1:1 ubertragbar
- Eigene Bilder im WebP-Format bereitstellen
- Alt-Texte in DE + EN Translations

---

## 11. Landing-Page-Blueprint

### Zweck
Template fur SEO-optimierte Landing Pages. Vorlage: `GeburtstagsfeierMuenchen.tsx`.

### Vorlage-Datei
- `src/pages/seo/GeburtstagsfeierMuenchen.tsx`

### Sektionen-Aufbau

```
1. StaticBotContent (versteckter Content fur Bots)
2. SEO-Komponente (title, description, canonical)
3. StructuredData Restaurant + Breadcrumbs
4. Inline JSON-LD (EventVenue, FAQPage)
5. Header + Navigation
6. Hero (H1, Subtitle, Badges, CTA)
7. Intro (2-3 SEO-Absatze)
8. Pakete/Angebote (Cards)
9. CTA-Box (Telefon, E-Mail, WhatsApp, Booking)
10. Grunde-Grid (8 Features, 4-spaltig)
11. Timeline/Ablauf (6 Schritte)
12. Extras (Zusatzleistungen)
13. Testimonials (Kundenstimmen)
14. FAQ-Accordion (8 Fragen, forceMount)
15. ONVB/Benefits (6 Vorteile)
16. Verwandte Seiten (6 interne Links)
17. Google Maps (Consent-basiert)
18. Final CTA
19. Footer
```

### Code-Skeleton

```tsx
const EventLandingPage = () => {
  const { t, language } = useLanguage();
  usePrerenderReady(true);
  const s = t.seo.eventName;

  const faqs = [
    { q: s.faq1Question, a: s.faq1Answer },
    // ... 8 FAQs
  ];

  return (
    <>
      {/* SEO */}
      <SEO title={s.seoTitle} description={s.seoDescription} canonical="/event-slug" />
      <StructuredData type="restaurant" />
      <StructuredData type="breadcrumb" breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Events', url: '/events' },
        { name: s.heroTitle, url: '/events/event-slug' }
      ]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
          "@type": "Question", "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
      })}} />

      <Header />
      <Navigation />

      {/* Hero */}
      <section className="relative h-[70vh] overflow-hidden">
        <img src={heroImage} alt={s.heroTitle} width={1920} height={1080}
             loading="eager" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 ...">
          <h1 className="text-3xl md:text-5xl font-serif font-bold">{s.heroTitle}</h1>
          <p>{s.heroSubtitle}</p>
          <Button asChild><a href="tel:+49...">{s.heroCta}</a></Button>
        </div>
      </section>

      {/* Intro SEO-Content */}
      <section className="py-16 container max-w-4xl">
        <h2>{s.introTitle}</h2>
        <p>{s.introP1}</p>
        <p>{s.introP2}</p>
      </section>

      {/* CTA-Box */}
      <section className="bg-primary text-primary-foreground py-12">
        <a href="tel:+49..."><Phone /> Anrufen</a>
        <a href="mailto:..."><Mail /> E-Mail</a>
        <a href="https://wa.me/..."><MessageCircle /> WhatsApp</a>
      </section>

      {/* FAQ mit forceMount */}
      <section>
        <h2>{s.faqTitle}</h2>
        <Accordion type="single" collapsible>
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent forceMount className="data-[state=closed]:hidden">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Verwandte Seiten (Interne Verlinkung) */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {relatedLinks.map((link, i) => (
            <LocalizedLink key={i} to={link.to} className="border rounded-lg p-6 hover:border-primary">
              <h3>{link.title}</h3>
              <p>{link.desc}</p>
            </LocalizedLink>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
};
```

### Anpassung fur events-storia.de
- Eigene Event-Slugs und Keywords
- NAP-Daten (Telefon, E-Mail, WhatsApp) anpassen
- Hero-Bilder und Assets anpassen
- CTA-Links auf eigene Buchungsseite

---

## 12. SEO-Operations-System

### Zweck
Automatisiertes SEO-Monitoring: GSC-Daten analysieren, Alerts generieren, Tasks erstellen, Claude-Code-Prompts ausgeben.

### Vorlage-Dateien
- `supabase/functions/seo-api/index.ts`
- `supabase/functions/seo-pipeline/index.ts`
- `supabase/functions/seo-crawler/index.ts`
- `supabase/functions/gsc-sync/index.ts`
- `supabase/functions/gsc-aggregate/index.ts`
- `supabase/migrations/20260206_seo_ops_schema.sql`
- `supabase/migrations/20260208_seo_crawler_schema.sql`
- `supabase/migrations/20260208_seo_cron_jobs.sql`
- `src/hooks/useSEOOps.ts`
- `src/hooks/useSEOCrawler.ts`
- `src/components/admin/seo-ops/SEODashboard.tsx`
- `src/components/admin/seo-ops/SEOCrawlerPanel.tsx`

### Architektur

```
Cron-Jobs (taglich):
  06:00 gsc-sync      -> GSC-Daten holen
  06:10 gsc-aggregate  -> Metriken aggregieren
  06:15 seo-pipeline   -> Alerts + Tasks + Prompts
  06:30 seo-crawler    -> Alle URLs crawlen

API (seo-api):
  GET /briefing, /alerts, /tasks, /prompts, /stats
  GET /crawl-runs, /crawl-results
  PATCH /alerts/:id, /tasks/:id

Admin UI:
  SEODashboard (60/40 Split-View)
  -> SEOBriefingCard, SEOAlertsPanel, SEOTasksPanel
  -> SEOPromptsPanel, SEOCrawlerPanel
```

### Datenbank-Tabellen

| Tabelle | Zweck |
|---------|-------|
| `seo_page_catalog` | Katalog aller Seiten mit Typ + Keywords |
| `seo_alert_rule` | Konfigurierbare Regeln (12+ Stuck) |
| `seo_alert_event` | Erkannte Probleme/Chancen |
| `seo_task` | Aufgaben aus Alerts |
| `seo_prompt_pack` | Claude-Code Prompts |
| `seo_daily_briefing` | Tagliche Zusammenfassung |
| `seo_baseline_cache` | Berechnete Normwerte |
| `seo_crawl_run` | Crawl-Durchlaufe |
| `seo_crawl_result` | Ergebnisse pro URL |

### Anpassung fur events-storia.de
- Neues Supabase-Projekt
- Eigene GSC-Service-Account-Credentials (`.env`)
- `GSC_SITE_URL` auf `sc-domain:events-storia.de`
- Migrationen 1:1 ubernehmen (Schema ist domain-unabhangig)
- Edge Functions 1:1 kopieren (lesen Domain aus Sitemap)
- Admin UI: 1:1 ubertragbar (liest aus eigenem Supabase)

---

## 13. PWA & Web App Manifest

### Zweck
Progressive Web App Metadaten fur installierbare App-Erfahrung.

### Vorlage-Datei
- `public/manifest.json`

### Struktur

```json
{
  "name": "EVENTS STORIA - Eventlocation Munchen",
  "short_name": "EVENTS STORIA",
  "description": "Eventlocation in Munchen fur Firmenfeiern, Hochzeiten und private Feiern",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#722F37",
  "background_color": "#FAF8F5",
  "icons": [
    { "src": "/favicon.png", "sizes": "64x64", "type": "image/png" },
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "categories": ["events", "restaurant", "lifestyle"],
  "lang": "de",
  "scope": "/"
}
```

### Anpassung fur events-storia.de
- Name, Beschreibung, Kategorien anpassen
- Eigene Icons und Farben
- Theme Color passend zum Branding

---

## 14. Performance & Core Web Vitals

### Zweck
Optimale Ladezeiten fur Google Page Experience Signal.

### Patterns

| Optimierung | Implementierung | Datei |
|-------------|----------------|-------|
| Font Preload | `<link rel="preload" as="font">` | `index.html` |
| Code Splitting | `React.lazy()` + dynamic imports | Router-Config |
| GZIP | Apache `mod_deflate` | `.htaccess` |
| Asset Caching | Vite Hash-Filenames + Cache Headers | `.htaccess` |
| Consent Embeds | Lazy-load nach Cookie-Zustimmung | `ConsentGoogleMaps.tsx` |
| React Query Hydration | Dehydrated State vom Server | `entry-server.tsx` |
| Preconnect | Google Fonts DNS prefetch | `index.html` |

### index.html Template

```html
<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Google Consent Mode v2 (VOR gtag!) -->
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('consent', 'default', {
        'ad_storage': 'denied',
        'analytics_storage': 'denied',
        'wait_for_update': 500
      });
    </script>

    <!-- GA4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');   <!-- ANPASSEN -->
    </script>

    <!-- Preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <!-- Critical Font Preload -->
    <link rel="preload" href="/fonts/CormorantGaramond-Regular.woff2" as="font" type="font/woff2" crossorigin />

    <!-- PWA -->
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#722F37" />

    <!-- LLMs.txt fur AI-Crawler -->
    <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable content" />
  </head>
  <body>
    <div id="root"><!--app-html--></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Anpassung fur events-storia.de
- GA4 Measurement ID anpassen
- Theme Color anpassen
- Eigene Fonts (oder gleiche)

---

## 15. Checkliste: Neue Seite SEO-ready machen

### Fur jede neue Seite auf events-storia.de:

```
[ ] 1. SLUG DEFINIEREN
    - DE-Slug in slugs.json eintragen
    - EN-Slug in slugs.json eintragen
    - Slug in Router registrieren

[ ] 2. TRANSLATIONS
    - t.seo.pageName in de.ts anlegen (seoTitle, seoDescription, heroTitle, faq1-8)
    - Gleiche Keys in en.ts ubersetzen

[ ] 3. KOMPONENTE ERSTELLEN
    - SEO-Komponente mit title + description + canonical
    - StructuredData type="restaurant"
    - StructuredData type="breadcrumb"
    - H1 im Hero (nur 1x pro Seite!)
    - FAQPage JSON-LD inline (max 10 Items)
    - FAQ-Accordion mit forceMount + data-[state=closed]:hidden
    - Related Pages (min. 3 interne Links)
    - Alle Bilder: WebP, width/height, lazy/eager, alt-Text

[ ] 4. PRERENDER
    - Route in prerender.js prufen (wird automatisch aus slugs.json gelesen)
    - npm run build ausfuhren
    - Prerendered HTML in dist/ prufen: Title, Description, JSON-LD vorhanden?

[ ] 5. SITEMAP
    - Route erscheint automatisch in sitemap.xml (uber slugs.json)
    - Priority und changefreq in generate-sitemap.mjs anpassen wenn notig

[ ] 6. .HTACCESS
    - Falls alte URL existiert: 301-Redirect in .htaccess eintragen
    - Falls Legal Page: Nur DE (EN-Redirect auf DE-Version)

[ ] 7. VERIFIZIERUNG
    - npm run build -> 0 Fehler
    - curl der URL: <title>, <meta description>, <link canonical> korrekt?
    - JSON-LD im HTML vorhanden? (FAQPage, Restaurant, Breadcrumb)
    - hreflang fur DE + EN vorhanden?
    - Google Rich Results Test: keine Fehler
    - Mobile-freundlich (responsive Tailwind)

[ ] 8. NACH DEPLOY
    - Google Search Console: URL prufen -> Indexierung beantragen
    - Sitemap in GSC aktualisieren
    - robots.txt erreichbar?
```

---

## Zusammenfassung: Was muss angepasst werden

| Element | Wert fur events-storia.de |
|---------|--------------------------|
| Domain | `https://www.events-storia.de` |
| Sprachen | `["de", "en"]` |
| x-default | DE |
| GA4 ID | Eigene Measurement ID |
| Supabase Project | Eigenes Projekt |
| GSC Site | `sc-domain:events-storia.de` |
| Name | EVENTS STORIA (oder passend) |
| Adresse | Eigene Adresse |
| Telefon | Eigene Nummer |
| E-Mail | Eigene E-Mail |
| Koordinaten | Eigene Geo-Position |
| Offnungszeiten | Eigene Zeiten |
| Google Maps CID | Eigene CID |
| Instagram | Eigener Account |
| OG-Image | Eigenes Bild (1200x630) |
| Theme Color | Eigene Markenfarbe |
| Schema @type | `EventVenue` statt `Restaurant`? |

---

**Letzte Aktualisierung:** 2026-02-08
