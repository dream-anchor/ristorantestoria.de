# ristorantestoria.de

## Sub-Agents
| Agent | Model | Zweck |
|-------|-------|-------|
| `architect` | sonnet | Design, Interfaces, Struktur |
| `reviewer` | sonnet | Code-Qualität, Types, Security (read-only) |
| `researcher` | haiku | Codebase-Exploration, Pattern-Suche (read-only) |

Für High-Volume-Output oder Deep Analysis immer Sub-Agent nutzen. `/plan` vor komplexen Features.

## Commands (zusätzlich)
```bash
npm run prerender    # SSG für SEO — KRITISCH
```

## Mehrsprachigkeit (4 Sprachen)
- DE, EN, IT, FR via `src/config/slugs.json` + Translation-Dateien
- hreflang: Alle 4 Sprachen + x-default → de

## SEO URL-Architektur
- Canonical: `https://www.ristorantestoria.de` (mit www, trailing slash IMMER)
- Slugs: `src/config/slugs.json`
- Landing Pages: `/besondere-anlaesse/[slug]/`
- Keyword-Mapping: `docs/seo-strategy.md` (VOR Seitenänderung prüfen!)

## Pre-Render-Regeln (MANDATORY)
- **KEIN `React.lazy()`** für pre-rendered Seiten (nur Admin darf lazy)
- Alle Seiten-Imports in `App.tsx`: eager imports
- Checkliste neue Seite:
  1. Route in `App.tsx` (alle 4 Sprachen via `routeComponents` + `slugs.json`)
  2. Slug in `src/config/slugs.json` (de, en, it, fr)
  3. Slug in Translation-Dateien (`de.ts`, `en.ts`, `it.ts`, `fr.ts` → `slugs`-Objekt)
  4. Eager import (kein `lazy()`)
  5. `npm run build` ok (105+ Routen, 0 Errors)
  6. HTML in `dist/` hat echten Content (kein "Laden...")
  7. `<title>`, `<meta description>`, hreflang, JSON-LD vorhanden
  8. Translations in allen 4 Sprachen
- Verify: `find dist -name "index.html" -exec grep -l "Laden\.\.\." {} \;` → muss leer sein

## SEO Content Rendering
- Accordion: IMMER `forceMount` + `data-[state=closed]:hidden`
- Dynamic Content: SSG-prerendered, nicht client-only
- Video: `preload="none"`

## Rechtliche Seiten (NUR Deutsch)
- impressum, datenschutz, cookie-richtlinie, agb-restaurant, agb-gutscheine, widerrufsbelehrung, zahlungsinformationen, lebensmittelhinweise, haftungsausschluss
- `noHreflang` im `<SEO>`-Tag
- `LEGAL_ONLY_DE` konsistent in: `routes.ts`, `App.tsx`, `generate-sitemap.mjs`
- `.htaccess`: 301-Redirects alter übersetzter URLs → DE

## Local SEO
- NAP: Ristorante STORIA, Theresienstraße 56, 80333 München
- Tel: +49 89 28806855
- GMB: Italian Restaurant (Primary), Pizza Restaurant, Wine Bar
- Keywords: "italienisches restaurant münchen", "pizza münchen maxvorstadt", "neapolitanische pizza münchen"

## Content-Architektur
### Pillar Pages
| Pillar | URL |
|--------|-----|
| Besondere Anlässe | `/besondere-anlaesse/` |
| Speisekarte | `/speisekarte/` |
| Über Uns | `/ueber-uns/` |

### Landing Pages
lunch-muenchen-maxvorstadt, aperitivo-muenchen, romantisches-dinner-muenchen, eventlocation-muenchen-maxvorstadt, firmenfeier-muenchen, geburtstagsfeier-muenchen, neapolitanische-pizza-muenchen, wild-essen-muenchen

## SEO Indexing Tool

Google Indexing API Script zum Einreichen von URLs zur Indexierung (200/Tag kostenlos).
Service Account JSON liegt in `scripts/service-account.json` im seo.schrittmacher.ai Repo.

```bash
# Optionen
node scripts/request-indexing.mjs --de-only        # Nur DE-URLs aus Sitemap
node scripts/request-indexing.mjs --priority        # Nicht-indexierte Priority-URLs
node scripts/request-indexing.mjs --dry-run         # Preview ohne Submit
node scripts/request-indexing.mjs --url https://www.ristorantestoria.de/page/  # Einzelne URL
```

**Service Account:** `gsc-auditor-storia@evocative-shore-486623-v4.iam.gserviceaccount.com`
Muss in GSC als **Inhaber** für `www.ristorantestoria.de` eingetragen sein.
