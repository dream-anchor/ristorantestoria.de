# ristorantestoria.de

## Stack
Vite + React + TypeScript + Tailwind CSS + shadcn-ui + Supabase

## Sub-Agents
| Agent | Model | Zweck |
|-------|-------|-------|
| `architect` | sonnet | Design, Interfaces, Struktur |
| `reviewer` | sonnet | Code-Qualität, Types, Security (read-only) |
| `researcher` | haiku | Codebase-Exploration, Pattern-Suche (read-only) |

Für High-Volume-Output oder Deep Analysis immer Sub-Agent nutzen. `/plan` vor komplexen Features.

## Workflow
1. Nicht-triviale Tasks: researcher → .planning/PROJECT.md → /plan → Approval → Code
2. PascalCase Komponenten, camelCase Funktionen, strict TS (kein `any`)
3. Tailwind + shadcn exklusiv
4. Keine unused Imports, keine console.logs

## Supabase-Regel
Wenn Claude keinen Schreibzugriff hat (RLS blockiert): fertigen Lovable.dev-Prompt ausgeben mit Tabellen-/Feldnamen und exakten Werten.

---

## SEO-Regeln (verbindlich)

### URLs
- Canonical: `https://www.ristorantestoria.de` (mit www, trailing slash)
- Slugs: `src/config/slugs.json` (4 Sprachen: de, en, it, fr)
- Landing Pages: `/besondere-anlaesse/[slug]/`

### Meta & Structured Data
- Title NUR via React Helmet (nicht in index.html)
- Canonical immer absolut mit `https://www.ristorantestoria.de`
- hreflang: de, en, it, fr + x-default → de
- JSON-LD: Restaurant, FAQPage (max 10), Menu, BreadcrumbList

### Content Rendering
- Accordion: IMMER `forceMount` + `data-[state=closed]:hidden`
- SSG-prerendered, nicht client-only
- Video: `preload="none"`

### Pre-Render-Pflicht
- **KEIN `React.lazy()`** für pre-rendered Seiten (nur Admin darf lazy)
- Alle Seiten-Imports in `App.tsx` als eager imports
- `ReactDOMServer.renderToString()` ist synchron — lazy ergibt nur "Laden..."

**Checkliste neue Seite:**
1. Route in `App.tsx` (alle 4 Sprachen via `routeComponents` + `slugs.json`)
2. Slug in `slugs.json` (de, en, it, fr)
3. Eager import in `App.tsx`
4. `npm run build` — 0 Errors, HTML in `dist/` mit echtem Content
5. `<title>`, `<meta description>`, hreflang, JSON-LD vorhanden
6. Translations in de.ts, en.ts, it.ts, fr.ts

### Rechtliche Seiten — Nur Deutsch
`impressum`, `datenschutz`, `cookie-richtlinie`, `agb-restaurant`, `agb-gutscheine`, `widerrufsbelehrung`, `zahlungsinformationen`, `lebensmittelhinweise`, `haftungsausschluss`

- Keine übersetzten Slugs in slugs.json
- `noHreflang` im `<SEO>`-Tag
- `LEGAL_ONLY_DE` in routes.ts, App.tsx, generate-sitemap.mjs konsistent
- .htaccess Section 1i: 301-Redirects von alten übersetzten URLs → DE
- Sitemap: nur DE-URLs, keine hreflang-Tags

---

## Content-Architektur

### Pillar Pages
| Pillar | URL |
|--------|-----|
| Besondere Anlässe | `/besondere-anlaesse/` |
| Speisekarte | `/speisekarte/` |
| Über Uns | `/ueber-uns/` |

### Landing Pages (unter /besondere-anlaesse/)
`lunch-muenchen-maxvorstadt`, `aperitivo-muenchen`, `romantisches-dinner-muenchen`, `eventlocation-muenchen-maxvorstadt`, `firmenfeier-muenchen`, `geburtstagsfeier-muenchen`, `neapolitanische-pizza-muenchen`, `wild-essen-muenchen`

### NAP (für Structured Data)
```
Ristorante STORIA
Theresienstraße 56, 80333 München
+49 89 28806855
```

### SEO-Strategie
Vollständig in `docs/seo-strategy.md`
