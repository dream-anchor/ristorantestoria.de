# Ristorante Storia - Kontext

## Stack
- React + TS + Vite + Tailwind + shadcn/ui
- Supabase (Postgres, Auth, Edge Functions, Storage)

## Deployment
- Code → commit + push → Lovable auto-deploy
- Supabase (SQL, Edge Functions, Secrets) → Lovable-Prompt an User
- Kein CLI-Zugang zu Supabase

## Sub-Agents
| Agent | Model | Zweck |
|-------|-------|-------|
| `architect` | sonnet | Design, Interfaces, Struktur |
| `reviewer` | sonnet | Code-Qualität, Types, Security (read-only) |
| `researcher` | haiku | Codebase-Exploration, Pattern-Suche (read-only) |

Für High-Volume-Output oder Deep Analysis immer Sub-Agent nutzen. `/plan` vor komplexen Features.

## Konventionen
- PascalCase: Components | camelCase: functions/vars
- Strict TS, kein `any`
- Tailwind + shadcn bevorzugt
- Komplette Dateien, keine Snippets

## Supabase-Regel
Wenn Claude keinen Schreibzugriff hat (RLS blockiert): fertigen Lovable.dev-Prompt ausgeben mit Tabellen-/Feldnamen und exakten Werten.

## Commands
```bash
npm run dev | build | lint
npm run prerender    # SSG für SEO
```

## SEO URL-Architektur
- Canonical: `https://www.ristorantestoria.de` (mit www)
- Trailing Slash: IMMER (außer Dateien)
- Slugs: `src/config/slugs.json` (4 Sprachen: de, en, it, fr)
- Landing Pages: `/besondere-anlaesse/[slug]/`

## SEO Meta & Structured Data
- Title: NUR via React Helmet (kein statischer Title in index.html)
- Canonical: Immer absolute URLs mit `https://www.ristorantestoria.de`
- hreflang: Alle 4 Sprachen + x-default → de
- JSON-LD: Restaurant, FAQPage (max 10), Menu, BreadcrumbList

## SEO Content Rendering (KRITISCH)
- Accordion: IMMER `forceMount` + `data-[state=closed]:hidden`
- Dynamic Content: SSG-prerendered, nicht client-only
- Video: `preload="none"`

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

## Rechtliche Seiten (NUR Deutsch)
- Pages: impressum, datenschutz, cookie-richtlinie, agb-restaurant, agb-gutscheine, widerrufsbelehrung, zahlungsinformationen, lebensmittelhinweise, haftungsausschluss
- Keine übersetzten Slugs in EN/IT/FR
- `noHreflang` im `<SEO>`-Tag
- `LEGAL_ONLY_DE` konsistent in: `routes.ts`, `App.tsx`, `generate-sitemap.mjs`
- `.htaccess` 1i: 301-Redirects alter übersetzer URLs → DE
- Sitemap: nur deutsche URLs, keine hreflang-Tags

## Content-Architektur
### Pillar Pages
| Pillar | URL |
|--------|-----|
| Besondere Anlässe | `/besondere-anlaesse/` |
| Speisekarte | `/speisekarte/` |
| Über Uns | `/ueber-uns/` |

### Landing Pages (/besondere-anlaesse/)
lunch-muenchen-maxvorstadt, aperitivo-muenchen, romantisches-dinner-muenchen, eventlocation-muenchen-maxvorstadt, firmenfeier-muenchen, geburtstagsfeier-muenchen, neapolitanische-pizza-muenchen, wild-essen-muenchen

## Keywords
- Primary: "italienisches restaurant münchen", "pizza münchen maxvorstadt", "restaurant maxvorstadt", "neapolitanische pizza münchen"
- Modifiers: München, Maxvorstadt, Schwabing, Uni-Viertel, "nahe Königsplatz"
- Vollständig: `docs/seo-strategy.md` (VOR Seitenänderung prüfen!)

## Local SEO
- NAP: Ristorante STORIA, Theresienstraße 56, 80333 München, +49 89 28806855
- GMB: Italian Restaurant (Primary), Pizza Restaurant, Wine Bar
- AggregateRating Schema: erst nach Cookie-Consent-Lösung

## Sprache
- UI: Deutsch | Code: Englisch
