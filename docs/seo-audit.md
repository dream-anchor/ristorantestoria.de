# SEO-Audit: ristorantestoria.de

**Letztes Update:** 2026-05-08
**SEO-Reife:** ~87/100

---

## Status-Übersicht

| Bereich | Status | Details |
|---------|--------|---------|
| Landing Pages | ✅ | 21 SEO-LPs in `src/pages/seo/` |
| FAQ JSON-LD | ✅ | Auf allen 21 LPs + `/faq/` (25+ FAQPage-Instanzen) |
| BreadcrumbList | ✅ | Auf allen Seiten |
| Restaurant-Schema | ✅ | servesCuisine, openingHours, geo, AggregateRating, Review, amenityFeature |
| Menu/MenuItem-Schema | ✅ | Speisekarte + Mittags-Menü + Getränke mit Preisen |
| ALT-Texte | ✅ | Vorhanden, beschreibend |
| WebP | ✅ | Alle Hero-Bilder |
| srcSet (Responsive Images) | ✅ | Implementiert Mai 2026 — 600w-Varianten für alle Hero-Images |
| fetchPriority="high" | ✅ | Implementiert Mai 2026 — alle Full-Bleed-Heroes |
| Internal Links | ✅ | 18 LP-Links auf Homepage, Breadcrumbs überall, Footer |
| hreflang | ✅ | 4 Sprachen + x-default auf 145 URLs |
| Sitemap | ✅ | 145 URLs, mit hreflang-Links |
| Redirects | ✅ | Kannibalisierungs-Fixes + Legacy-URLs |

---

## Architektur

### Seiten-Struktur (145 URLs)
- **21 SEO Landing Pages** — `src/pages/seo/` (alle eager geladen, kein lazy)
- **10 Legal Pages** — nur Deutsch (`noHreflang`, `noIndex` für nicht-DE)
- **10 Core Pages** — Homepage, Reservierung, Speisekarte, Mittags-Menü etc.
- **4 Sprachen** — DE (kein Prefix) / EN (`/en/`) / IT (`/it/`) / FR (`/fr/`)

### Alle SEO Landing Pages
| URL | Ziel-Keyword |
|-----|-------------|
| `/lunch-muenchen-maxvorstadt/` | "mittagessen münchen maxvorstadt" |
| `/aperitivo-muenchen/` | "aperitivo münchen" |
| `/romantisches-dinner-muenchen/` | "romantisches restaurant münchen" |
| `/eventlocation-muenchen-maxvorstadt/` | "eventlocation münchen" |
| `/firmenfeier-muenchen/` | "firmenfeier münchen" |
| `/geburtstagsfeier-muenchen/` | "geburtstagsfeier münchen" |
| `/neapolitanische-pizza-muenchen/` | "neapolitanische pizza münchen" |
| `/wild-essen-muenchen/` | "wild essen münchen" |
| `/pizza-muenchen/` | "pizza münchen" |
| `/italiener-koenigsplatz/` | "italiener königsplatz münchen" |
| `/pasta-fresca-muenchen/` | "pasta fresca münchen" |
| `/weihnachtsfeier-muenchen/` | "weihnachtsfeier münchen" |
| `/terrasse-muenchen/` | "restaurant mit terrasse münchen" |
| `/italienisches-restaurant-muenchen/` | "italienisches restaurant münchen" |
| `/italiener-hauptbahnhof-muenchen/` | "italiener hauptbahnhof münchen" |
| `/hochzeitsfeier-muenchen/` | "hochzeitsfeier münchen restaurant" |
| `/valentinstag-muenchen/` | "valentinstag restaurant münchen" |
| `/silvester-muenchen/` | "silvester restaurant münchen" |
| `/weihnachten-muenchen/` | "weihnachten restaurant münchen" |
| `/reisegruppen-muenchen/` | "reisegruppen restaurant münchen" |
| `/faq/` | Long-tail FAQ |

---

## Implementierte Maßnahmen

### Mai 2026

#### fetchPriority="high" auf alle Hero-Images
- **Dateien:** Alle 21 SEO-LPs + Catering.tsx + BesondererAnlass.tsx
- **Impact:** Direkte LCP-Verbesserung — Browser priorisiert das Hauptbild vor anderen Ressourcen
- **Pattern:** `<img loading="eager" fetchPriority="high" className="absolute inset-0 w-full h-full object-cover" />`

#### Responsive Images (srcSet 600w + 1200w)
- **Dateien:** 20 Landing Pages + Catering.tsx
- **Varianten generiert:** 600w WebP für alle Hero-Bilder (cwebp -q 82)
- **Einsparung Mobile:** 70–80% weniger Daten auf kleinen Screens
  - Beispiel: `sommerfest-event.webp` 276K → `sommerfest-event-600w.webp` 56K
- **Sizes:** `sizes="100vw"` (Hero immer vollbreit)
- **Ausgelassen:** `BesondererAnlass.tsx` (dynamisch gewählte Images — manuell nachrüsten)

---

## Offene Maßnahmen (priorisiert)

### 🔴 Hohe Priorität

#### 1. Event-Schema für Saisonseiten
**Betroffene Seiten:**
- `/besondere-anlaesse/weihnachtsmenue/`
- `/besondere-anlaesse/silvester/`
- `/valentinstag-muenchen/`

**Was fehlt:** `Event`-Schema — würde für saisonale Suchen Rich Results ermöglichen.
```json
{
  "@type": "Event",
  "name": "Silvester-Dinner im STORIA München 2026",
  "startDate": "2026-12-31T19:00",
  "endDate": "2027-01-01T02:00",
  "location": { "@type": "Place", "name": "STORIA", "address": "Karlstraße 47a, 80333 München" },
  "offers": { "@type": "Offer", "price": "89", "priceCurrency": "EUR", "availability": "https://schema.org/InStock" }
}
```

#### 2. Reviews-Widget Consent-Prüfung
**Problem:** Falls Google-Reviews-Widget hinter Cookie-Consent liegt → Google kann AggregateRating-Rich-Results deaktivieren (Bewertungen müssen ohne Consent sichtbar sein).
**Fix:** Reviews statisch einbinden (aus GBP-API gecachte Daten, kein Drittanbieter-JS nötig).

### 🟡 Mittlere Priorität

#### 3. GBP-Posts wöchentlich
- **Was:** 1 Post/Woche über Google Business Profile API
- **Warum:** Posts erscheinen im Knowledge Panel, direktes Engagement-Signal
- **Wie:** GBP-API-Zugang aktiv (`scripts/gbp-auth-test.ts`), Token in Neon DB

#### 4. OfferCatalog für Catering & Events
**Betroffene Seiten:** `/catering/`, `/eventlocation-muenchen-maxvorstadt/`, `/firmenfeier-muenchen/`
```json
{
  "@type": "OfferCatalog",
  "name": "STORIA Eventpakete",
  "itemListElement": [
    { "@type": "Offer", "name": "Firmenfeier ab 20 Personen", "price": "45", "priceCurrency": "EUR" }
  ]
}
```

#### 5. BesondererAnlass.tsx — srcSet nachrüsten
Dynamisch gewählte Hero-Images (Weihnachten, Silvester, Valentinstag). Alle 600w-Varianten existieren bereits. Manuell die srcSet-Logik für das dynamische Image-Mapping einbauen.

### 🟢 Niedrige Priorität

#### 6. Externe NAP-Konsistenz sicherstellen
Prüfen: Yelp, TripAdvisor, meinestadt.de, Apple Maps, OpenStreetMap.
Korrekte Adresse: **Karlstraße 47a, 80333 München**

#### 7. Video-Schema
Falls Videos auf Seiten vorhanden: `VideoObject`-Schema ergänzen.

---

## Structured Data — Vollständige Inventur

| Schema-Type | Implementiert | Datei |
|-------------|-------------|-------|
| `Restaurant` | ✅ | `src/components/StructuredData.tsx` |
| `Organization` | ✅ | `src/components/StructuredData.tsx` |
| `WebSite` | ✅ | `src/components/StructuredData.tsx` |
| `BreadcrumbList` | ✅ | Alle Seiten via `BreadcrumbNav.tsx` |
| `FAQPage` | ✅ | Alle 21 LPs inline |
| `Menu` + `MenuItem` | ✅ | `src/components/MenuStructuredData.tsx` |
| `Person` | ✅ | `src/pages/UeberUns.tsx` |
| `AggregateRating` | ✅ | `src/components/StructuredData.tsx` (dynamisch) |
| `Review` | ✅ | `src/components/StructuredData.tsx` (Top 5) |
| `Event` | ❌ | Noch nicht implementiert |
| `OfferCatalog` | ❌ | Noch nicht implementiert |
| `VideoObject` | ❌ | Noch nicht implementiert |

---

## Core Web Vitals — Maßnahmen-Log

| Metrik | Maßnahme | Status |
|--------|----------|--------|
| LCP | `fetchPriority="high"` auf Hero-Images | ✅ Mai 2026 |
| LCP | `srcSet` 600w/1200w auf Hero-Images | ✅ Mai 2026 |
| LCP | `loading="eager"` auf Hero-Images | ✅ (war bereits vorhanden) |
| CLS | `width`/`height` auf Hero-Images | ✅ (war bereits vorhanden) |
| CLS | `decoding="async"` auf Below-fold | ✅ (war bereits vorhanden) |

---

## SEO-Kennzahlen (Stand Mai 2026)

- **Gesamtbewertungen:** 807 (Google), Ø 4,5 Sterne
- **Unbeantwortete Reviews:** ~207 (Stand nach Albin Hedin-Antwort Mai 2026)
- **Sitemap-URLs:** 145 (40 Routen × 4 Sprachen, minus legals)
- **Google Sandbox:** aktiv seit Jan 2026 — Ende Sandbox erwartet ca. Jun/Jul 2026
- **Branded Keywords:** Pos. 1–2 für "storia münchen" ✅
- **Generische Keywords:** "italiener münchen" aktuell ~Pos. 31

---

## Referenz-Dateien

| Datei | Zweck |
|-------|-------|
| `docs/seo-strategy.md` | Keyword-Mapping, Content-Cluster, Roadmap |
| `src/components/SEO.tsx` | Title, Meta, Canonical, hreflang |
| `src/components/StructuredData.tsx` | Restaurant, FAQPage, AggregateRating |
| `src/components/MenuStructuredData.tsx` | Menu, MenuItem mit Preisen |
| `src/config/slugs.json` | Slug-Mapping alle 4 Sprachen |
| `scripts/generate-sitemap.mjs` | Sitemap-Generator |
| `public/robots.txt` | Crawler-Steuerung |
