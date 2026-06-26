# PageSpeed-Fixes — ristorantestoria.de

Ziel: **Mobile Performance ≥ 90, Accessibility = 100, Seitengewicht < 2 MB.**
Desktop ist bereits 92/92 — Fokus = Mobile (gedrosseltes 4G).
Messen: `npm run psi` (Mobile) / `npm run psi:both` (speichert JSON nach `docs/psi/`).

## Baseline 26.06.2026 (live)
| Strategie | Perf | A11y | BP | SEO | LCP | FCP | TBT | CLS | Payload |
|-----------|------|------|----|----|-----|-----|-----|-----|---------|
| Mobile    | 60   | 83   | 100| 100| 8,5 s | 6,5 s | 50 ms | 0 | 4.054 KiB |
| Desktop   | 92   | 92   | 100| 100| 1,5 s | 1,2 s | 50 ms | 0,003 | 4.102 KiB |

## ⚠️ Kernerkenntnis 26.06.
Die Fixes lagen alle auf Branch `perf-a11y-fixes` (Abzweig 07.06.), die aber NIE deployt (Deploy = nur `main`). `main` war 19 Tage + 100+ Lovable-Commits voraus. Lösung: 13 Fix-Commits per Cherry-Pick auf aktuelles `main` aufgesetzt (nur Footer.tsx/index.html Auto-Merge) → Build grün → Fast-Forward-Push nach `main` → Deploy. Kein Lovable-Code zurückgerollt.

## Checkliste (Reihenfolge = Priorität)

### Tier 1 — Performance (Mobile 60 → ≥ 90)
- [x] P1 LCP-Grid-Bild `weinservice.webp`: eager + `fetchpriority="high"` — deployed 2026-06-26
- [ ] P2 Render-blocking CSS reduzieren — critical inline / Rest deferren (~1.150 ms) — OFFEN
- [x] P3 Preconnect Supabase im `<head>` — deployed 2026-06-26
- [x] P4 Cache-Control `immutable` für js/css/woff2 in `.htaccess` — deployed. ⚠️ mp4/jpg-TTL nach Deploy prüfen
- [ ] P5 Image delivery: responsive srcset/AVIF (474 KiB) — OFFEN (Komprimierung erfolgt, srcset nicht)
- [~] P6 Seitengewicht: Cinemagraph+Poster komprimiert (mamma 854→75 KB, Animation intakt). Video `preload="none"` prüfen, mp4 ggf. weiter
- [ ] P7 Reduce unused CSS — Tailwind-Purge prüfen (19 KiB) — OFFEN
- [x] P8 Vendor-Chunks (supabase+react) — deployed 2026-06-26

### Tier 2 — Accessibility (Mobile 83 → 100)
- [x] A1 Sterne-Rating: `role="img"` ergänzt — deployed 2026-06-26
- [x] A2 Menü-Toggle-Button `aria-label` — deployed 2026-06-26
- [x] A3 `tel:`/`mailto:`-Icon-Links `aria-label` + Icons `aria-hidden` — deployed 2026-06-26
- [x] A4 Kontrast (Footer + restliche Befunde) WCAG AA — deployed 2026-06-26

### Tier 3 — Hardening (Best Practices schon 100, alles nicht bewertet — nur nach Freigabe)
- [ ] H1 CSP Report-Only → Enforce
- [ ] H2 COOP-Header, HSTS `preload`, Trusted Types in `.htaccess`
- [ ] H3 Source Maps für großes First-Party-JS (Vite-Build)

## Harte Regeln
- Prerender: KEIN `React.lazy()` für SSG-Seiten, eager imports in `App.tsx`. Build: 117 Routen, 0 Errors.
- Nach Build: `find dist -name "index.html" -exec grep -l "Laden\.\.\." {} \;` muss leer sein.
- 4 Sprachen (de/en/it/fr). Deutsche Anführungszeichen in Translations als Unicode-Escapes.
- `mamma-…webp` ist ANIMIERT → nicht flatten/neu encodieren.
- IONOS = Apache → Cache-/Security-Header in `.htaccess`.
- Deploy = commit + push auf `perf-a11y-fixes` → GitHub Actions → SFTP/IONOS (~1–3 Min Verzug bis PSI es sieht).

## Ergebnis 2026-06-26 (nach Deploy)
| | Mobile vorher | Mobile nachher | Desktop |
|---|---|---|---|
| Performance | 60 | 56–88 (bistabil) | 92–100 |
| Accessibility | 83 | **100** ✅ | **100** ✅ |
| Best Practices | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 |

**Mobile-Perf-Deckel = 2,6 MB Haupt-JS-Chunk** (`index-*.js`). Auf gedrosseltem 4G konkurriert
das Bundle mit dem LCP-Bild → Lighthouse-„Netzwerk-Rennen" macht den Score bistabil (56↔88).
NICHT durch meine Änderungen verursacht — Bundle war schon im Baseline-60-Zustand da.
Zusammensetzung: 52 eager-Seiten + 4 Übersetzungssätze (14.717 Zeilen) + recharts/react-day-picker-Leak.

### Offen für stabiles Mobile ≥ 90 (echtes Bundle-Projekt, Prerender-Restriktion beachten)
- [ ] B1 rollup-plugin-visualizer einbauen → exakte Chunk-Zusammensetzung
- [ ] B2 recharts (~400 KB) aus Haupt-Chunk lösen (nur ui/chart→Admin; Leak via manualChunks/Import-Pfad)
- [ ] B3 react-day-picker/date-fns: nur in ReservationBooking → eigener Chunk
- [ ] B4 Übersetzungen pro Sprache splitten (nur aktive Sprache laden) — größter, aber komplexester Win
- [ ] P2 Render-blocking CSS (Critical-CSS-Inlining) — erst nach Bundle-Reduktion sinnvoll

## Log
- 2026-06-26 — Baseline (Mobile 60/83, Desktop 92/92). PSI-Runner + Tracking angelegt.
- 2026-06-26 — Kernproblem: 13 Fix-Commits lagen undeployed auf stale Branch `perf-a11y-fixes` (Abzweig 07.06.). Per Cherry-Pick auf aktuelles `main` aufgesetzt, deployed. A11y 83→100, Desktop→100, LCP-Bild eager.
- 2026-06-26 — Kontrast (Footer-Gutschein /60→/80) → A11y 100. Media-Cache-TTL (.htaccess) → mp4/jpg gecacht.
- 2026-06-26 — Diagnose Mobile-Deckel: 2,6 MB Haupt-Chunk. Bundle-Projekt (B1–B4) offen.
