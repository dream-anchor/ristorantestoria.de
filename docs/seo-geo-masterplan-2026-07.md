# SEO + GEO Masterplan — Juli 2026

**Ziel:** Mehr Gäste pro Tag über organische Suche (SEO), Local Pack (GBP) und AI-Antwortmaschinen (GEO).
**Datenbasis:** GSC-Coverage-Exporte (06.07.2026), GSC Search Analytics (90 Tage), GSC URL-Inspections (API), DataForSEO-Suchvolumina (DE), Live-Site-Verifikation, vollständiges Code-Audit.
**Status-Legende:** ⬜ offen · 🔄 in Arbeit · ✅ erledigt

---

## 1. Ausgangslage (Ist-Zustand, 06.04.–04.07.2026)

| Metrik | Wert |
|---|---|
| Klicks (90 Tage) | 3.175 (~35/Tag) |
| Impressionen | 129.290 |
| CTR | 2,46 % |
| Branded vs. Non-Branded | **1.303 vs. 252 Klicks** — ~84 % der Query-Klicks sind branded |
| Sprachen (Klicks) | DE 2.790 · EN 274 · IT 103 · FR 56 |
| Indexiert | ~133 von 162 Sitemap-URLs |

**Kernbefund:** STORIA wird gefunden von Leuten, die STORIA bereits kennen. Die Discovery über generische Money-Keywords findet praktisch nicht statt — obwohl die Nachfrage groß ist und die Seiten existieren:

| Keyword | Volumen/Monat (DE) | Aktuelle Position | Impressionen 90d |
|---|---|---|---|
| italiener münchen | **9.900** | ~25 | 366 |
| pizzeria münchen | **5.400** | ~15 | 1.520 |
| italienisches restaurant münchen | **4.400** | ~32 | 358 |
| eventlocation münchen | 1.600 (CPC 4,34 €!) | — | — |
| beste pizza münchen | 1.300 | ~11,5 | 897 |
| neapolitanische pizza münchen | 1.300 | ~11,6 | 551 |
| public viewing (wm) münchen | 590+ (saisonal hoch) | **9,6** | 1.204 |
| mittagstisch münchen | 720 | — | — |
| geburtstag feiern münchen | 720 | (P18 LP) | 6.545 (LP) |
| candle light dinner münchen | 590 | **10,5** (CTR 6,2 %!) | 227 |
| romantisches restaurant münchen | 590 | ~14,6 | 346 |
| restaurant maxvorstadt | 480 | — | — |
| pasta münchen | 480 | Orphan-Page | — |
| italiener maxvorstadt | 320 | ~11 | 234 |
| restaurant nähe hauptbahnhof münchen | 320 | P7,5 (LP läuft) | 6.005 (LP) |

Position 11–32 heißt: **Seite 2–4.** Dort klickt niemand. Der Sprung auf Seite 1 (Top 5) bei nur den vier größten Begriffen entspricht rechnerisch **+3.000–6.000 zusätzlichen Klicks/Monat** — gegen aktuell ~1.050/Monat gesamt.

---

## 2. Fehlerbild GSC → Root Causes (alle verifiziert)

### 2.1 GSC Coverage („Alle bekannten Seiten", 06.07.2026)

| GSC-Grund | Seiten | Root Cause | Bewertung |
|---|---|---|---|
| Gecrawlt – zurzeit nicht indexiert | 106 | überw. Param-/Alt-URLs **+ Canonical-Bug** (s. u.) | teils Rauschen, teils Bug |
| Seite mit Weiterleitung | 29 | Legacy-301s (http→https, non-www, WordPress, `?from=`) | erwartet, unkritisch |
| Gefunden – zurzeit nicht indexiert | 20 | **Interne Verlinkung zu schwach** (Orphans, s. 2.3) | 🔴 beheben |
| Alternative Seite mit richtigem kanonischen Tag | 8 | **Canonical-Bug** (s. 2.2) | 🔴 beheben |
| Durch noindex ausgeschlossen | 4 | Admin/404/Newsletter — gewollt | ✅ ok |
| Umleitungsfehler | 1 | vermutl. Legacy-Kette auf 4xx/410 | 🟡 beobachten |
| Duplikat – Google wählte andere kanonische | 1 | **Canonical-Bug** | 🔴 beheben |
| Wegen Zugriffsverbot (403) blockiert | 1 | `/assets/` (Verzeichnis ohne Index + `Options -Indexes`) | 🟡 beheben |
| Nicht gefunden (404) | 0 | — | ✅ sauber |

### 2.2 Root Cause #1: Hartkodierter deutscher Canonical (LIVE bestätigt)

`GET /en/pizza-munich/` liefert `<link rel="canonical" href=".../pizza-muenchen/">` — die EN/IT/FR-Seiten erklären sich selbst zum Duplikat der deutschen Seite. Gleichzeitig sendet hreflang das Gegenteil („4 eigenständige Sprachversionen") → widersprüchliche Signale, Google folgt dem Canonical und wirft die Übersetzungen raus bzw. indexiert sie nur „aus Kulanz" (googleCanonical ≠ userCanonical — fragil).

- **Betroffen:** 28 Komponenten → ~84 falsch kanonisierte non-DE-URLs.
  - 10 Kernseiten: `Index`, `Reservierung`, `Speisekarte`, `Getraenke`, `Mittagsmenu`, `BesondereAnlaesse`, `Kontakt`, `Catering`, `UeberUns`, `FAQ`
  - 18 SEO-LPs: alle außer `Filmfest`, `Wm`, `Silvester`, `Valentinstag`, `Weihnachten` (die machen es bereits richtig via `getLocalizedPath`/sprachbewusstem Pfad)
  - `ReisegruppenPage`: hreflang-Override korrekt, Canonical trotzdem falsch
- **Fix:** zentral in `src/components/SEO.tsx` — Canonical aus aktiver Route + `useLanguage()` ableiten (Reverse-Lookup über `slugs.json` existiert dort schon als `computeHreflangFromCanonical`). Ein Fix repariert alle 28 Komponenten; `canonical`-Prop bleibt als Override.
- **Direkt mitzufixen:** `prerender.js` injiziert `helmet.htmlAttributes` nicht → **jede** Seite trägt `<html lang="de">`, auch EN/IT/FR (live bestätigt).

**Erwarteter Effekt:** EN hat 29.445 Impressionen bei CTR < 1 %. Saubere Canonicals + korrektes `lang` = das größte ungenutzte Potenzial der Auslands-/Touristen-Suche (Hotel-Gäste, „best italian restaurant munich" P11 mit 249 Impressionen).

### 2.3 Root Cause #2: Interne Verlinkung — Orphans (erklärt „Gefunden – nicht indexiert")

- `InternalLinks.tsx` (18-Slug-Linkblock) rendert **nur auf der Homepage**.
- Header verlinkt keine einzige LP; Hauptnavigation nur `Terrasse`.
- Footer (`eventsGroupsLinks`) nur 7 Seiten.
- **Echte Orphans/Beinahe-Orphans:** `pasta-fresca-muenchen` (0 eingehende Links!), `oktoberfest-muenchen` (1), `silvester-/valentinstag-/weihnachten-muenchen` (je 1, verlinken selbst nur zur Homepage zurück = Dead-Ends).
- `filmfest`/`wm-2026` hängen an **saisonalen Bannern** — nach Eventende verlieren sie alle internen Links und fallen aus dem Index.

### 2.4 Weitere verifizierte Technik-Findings

| Finding | Ort | Prio |
|---|---|---|
| `/assets/` → 403 (GSC „Zugriffsverbot") | `public/.htaccess` (Dir-Passthrough + `-Indexes`) | 🟡 |
| `LEGAL_ONLY_DE`-Drift: `routes.ts` 9 Slugs, `App.tsx`/`generate-sitemap.mjs` 10 (`barrierefreiheit` fehlt in routes.ts) — verletzt CLAUDE.md-Regel | `src/config/routes.ts` | 🟡 |
| Redirect-Ketten 2 Hops (http+non-www+Slash getrennt); nur `/reisegruppen` gebündelt | `.htaccess` | 🟢 |
| `lastmod` = Build-Datum für alle URLs → Signal wertlos | `generate-sitemap.mjs` | 🟢 |
| Placeholder im Index: `/besondere-anlaesse/neuer-anlass/`, `/it/occasioni-speciali/neuer-anlass/` | dynamische Menü-Seiten | 🟡 |
| Video-Schema: `uploadDate` ungültig/ohne Zeitzone (GSC-Warnung) | Homepage-Video-JSON-LD | 🟢 |
| Event-Schema WM: `performer`/`offers` fehlen (nur Warnung) | `WmPublicViewingMuenchen` | 🟢 |
| Toter Code: `ItalienerMuenchen.tsx` importiert, nicht geroutet | `App.tsx` | 🟢 |

### 2.5 Abgleich mit bisherigen Aktionen (nichts doppelt bauen!)

Bereits vorhanden und aktiv — der Plan **erweitert**, statt neu zu bauen:
- **Automatische Pipeline:** pg_cron 06:00–06:30 UTC → `gsc-sync` → `gsc-aggregate` → `seo-pipeline` (12 Alert-Regeln, Tasks, Prompt-Packs) → `seo-crawler`; Admin-Dashboards `/admin/seo` + `/admin/gsc`
- **GBP:** AI-Auto-Poster Mo/Mi/Fr, täglicher Review-Fetch (4,5★/810), tägl. Menü-Sync, Review-Antwort-Framework
- **GEO:** `llms.txt`/`llms-full.txt`, `geo-monitor.mjs` (Mention-Rate-Probe), GEO-Audit 05/2026 (Score 50 %, Ziel 85 %), Content-Guidelines
- **Indexing:** `request-indexing.mjs` (Indexing API), `submit-indexnow.mjs`, `indexnow`-Edge-Function — **alle nur manuell**
- **Docs:** Rank-Baseline 29.06. (Recheck geplant ~27.07.), Outreach-Plan 2026 (unausgeführt), Cloudflare-CDN-Plan (nicht deployed), PageSpeed-Log (Mobile 60, JS-Chunk 2,6 MB, TTFB ~880 ms)

---

## 3. Der Plan

### Phase 0 — Sofort (Woche 1): Indexierungs-Fundament reparieren
*Effekt: ~29 nicht indexierte Sitemap-URLs + 84 fragile non-DE-URLs stabilisieren. Aufwand: 1–2 Tage.*

| # | Maßnahme | Dateien | Status |
|---|---|---|---|
| 0.1 | **Canonical zentral sprachabhängig** in `SEO.tsx` (Route + `useLanguage` + `slugs.json`-Reverse-Lookup); Prop nur noch Override | `src/components/SEO.tsx` | ⬜ |
| 0.2 | **`helmet.htmlAttributes` in Prerender injizieren** → korrektes `<html lang>` je Sprache | `prerender.js` | ⬜ |
| 0.3 | `/assets/`-403 beheben (Rewrite auf 404/Index) | `public/.htaccess` | ⬜ |
| 0.4 | `LEGAL_ONLY_DE` synchronisieren (10 Slugs überall) | `src/config/routes.ts` | ⬜ |
| 0.5 | Placeholder `neuer-anlass` entfernen/noindexen | Supabase-Daten / `BesondererAnlass` | ⬜ |
| 0.6 | Video-`uploadDate` + WM-Event-Schema (`performer`, `offers`) fixen | `Index`/`StructuredData`/`wmContent` | ⬜ |
| 0.7 | Build + Prerender-Verify (Checkliste CLAUDE.md), Deploy | — | ⬜ |
| 0.8 | **Indexing API**: alle 20 „Gefunden – nicht indexiert" + reparierte non-DE-URLs einreichen; IndexNow-Ping | `scripts/request-indexing.mjs` | ⬜ |

### Phase 1 — Woche 1–2: Interne Verlinkung (größter Index-Hebel)
*Effekt: die 20 „Gefunden – nicht indexiert" werden crawlbar + Linkequity fließt zu den LPs.*

| # | Maßnahme | Status |
|---|---|---|
| 1.1 | `InternalLinks`-Block (oder Related-Links) auf **allen** LPs rendern, nicht nur Homepage | ⬜ |
| 1.2 | Fehlende Slugs ergänzen: oktoberfest, filmfest, wm-2026, pasta-fresca, reisegruppen | ⬜ |
| 1.3 | Orphans anbinden: pasta-fresca ← NeapolitanischePizza/PizzaMuenchen/Speisekarte; oktoberfest → Footer + Cloud | ⬜ |
| 1.4 | Saisonale Dead-Ends (Silvester/Valentinstag/Weihnachten): Related-Cluster immer rendern | ⬜ |
| 1.5 | Banner-Seiten (WM/Filmfest) dauerhaft verlinken (Footer/Pillar), damit sie nach Eventende nicht kippen | ⬜ |
| 1.6 | Footer `eventsGroupsLinks` erweitern (alle 4 Sprachen) | ⬜ |

### Phase 2 — Woche 2–4: Money-Keyword-Offensive (Umsatz-Hebel)
*Ziel: die 25.000/Monat Suchvolumen von Seite 2–4 auf Seite 1 holen.*

| # | Maßnahme | Keyword (Vol.) | Status |
|---|---|---|---|
| 2.1 | **JETZT (WM läuft bis 19.07.!):** WM-Seite pushen — CTR-Title („heute", Spielplan), Event-Schema komplett, GBP-Posts je Spieltag, interne Links von Homepage | public viewing münchen (590+, saisonal ×10) | ⬜ |
| 2.2 | Kannibalisierung lösen: Homepage rankt für generische Terms auf P11–32, während die LPs dafür gebaut sind. Homepage-Title/H1 auf Brand+Ort schärfen, generische Terms konsequent auf LPs lenken (interne Anchor-Texte!) | italienisches restaurant münchen (4.400) | ⬜ |
| 2.3 | „Italiener"-Cluster differenzieren: 4 Thin-Pages (~950–1.100 Wörter, identisches Skelett) je +500 Wörter einzigartiger Content (Hbf ↔ Anreise/Hotel, Königsplatz ↔ Museen, „bester" ↔ Awards/Reviews) | italiener münchen (9.900) | ⬜ |
| 2.4 | `/pizza-muenchen/` + `/neapolitanische-pizza-muenchen/` gegenseitig differenzieren + von Speisekarte/Homepage stark verlinken | pizzeria münchen (5.400), beste pizza (1.300) | ⬜ |
| 2.5 | CTR-Sprint auf Striking-Distance: Titles/Descriptions für candle light dinner (P10,5/CTR 6,2 %!), aperol/aperitivo (P5), catering (P6), romantisch (P14) | zusammen ~1.800 | ⬜ |
| 2.6 | `/eventlocation-muenchen-maxvorstadt/`: Content-Ausbau + FAQ + Backlink-Fokus (CPC 4,34 € = hoher kommerz. Wert) | eventlocation münchen (1.600) | ⬜ |
| 2.7 | Rank-Recheck gegen Baseline 29.06. (`keyword-rank-baseline-2026-06-29.md`) am ~27.07. | — | ⬜ |

### Phase 3 — Monat 2: GEO 50 % → 85 % (AI-Sichtbarkeit)
*ChatGPT/Perplexity/AI Overviews empfehlen Restaurants — dort zitiert zu werden bringt direkte Reservierungen.*

| # | Maßnahme | Status |
|---|---|---|
| 3.1 | Schema-Lücken aus GEO-Audit: `@graph`-Verknüpfung, `dateModified`, `knowsAbout`, `sameAs` auf Person-Entitäten | ⬜ |
| 3.2 | `GoogleReviews` + `aggregateRating` auch auf Saison-Seiten (E-E-A-T-Parität) | ⬜ |
| 3.3 | IT-Lücken schließen: `weihnachten` (rendert dt. Fallback!), `reisegruppenDanke`, ~20 % IT-`seo`-Gap | ⬜ |
| 3.4 | Awards/Presse sichtbar machen (Falstaff!) auf `/ueber-uns/` + `award`-Schema | ⬜ |
| 3.5 | Wikidata-Eintrag anlegen (Entity-Anker für alle AI-Engines) | ⬜ |
| 3.6 | `geo-monitor.mjs` + PSI als GitHub Action schedulen (wöchentlich) — Mention-Rate-Ziel ≥ 20 % | ⬜ |
| 3.7 | `WebSite.inLanguage` um it/fr ergänzen; Reviews sprachlokalisiert ins Schema | ⬜ |

### Phase 4 — Monat 2–3: Performance (Ranking-Deckel entfernen)
*Mobile PSI 60, LCP 8,5 s, TTFB 880 ms — das deckelt alle Content-Arbeit.*

| # | Maßnahme | Status |
|---|---|---|
| 4.1 | Cloudflare-CDN aktivieren (Plan existiert: `cloudflare-cdn-setup.md`) → TTFB < 100 ms | ⬜ |
| 4.2 | JS-Hauptchunk 2,6 MB splitten (Admin-Code aus Public-Bundle) | ⬜ |
| 4.3 | LCP-Bilder: preload, responsive sizes, AVIF | ⬜ |
| 4.4 | Ziel: Mobile PSI ≥ 90 (Messung via `psi-batch.mjs`) | ⬜ |

### Phase 5 — laufend: Content-Engine + Off-Page + Local
| # | Maßnahme | Status |
|---|---|---|
| 5.1 | **Blog/Magazin einführen** (`/magazin/`): saisonale Guides, Rezepte, „Beste Pizza Maxvorstadt", Eventplanung — Freshness + Long-Tail + GEO-Zitierquelle (existiert bisher NICHT) | ⬜ |
| 5.2 | Outreach-Plan 2026 ausführen (Eventinc, Fiylo, Munich-Eventlocations; TripAdvisor-Fehler „seit 1995" → 2015 korrigieren); Backlinks gezielt auf LPs (aktuell 89 % auf Homepage) | ⬜ |
| 5.3 | GBP-Reviews: +5/Woche (810 → 1.000+), Antwort-Cadence nach `gbp-review-responses.md` | ⬜ |
| 5.4 | **Oktoberfest-Vorbereitung ab August** (EN „oktoberfest munich" ~22k/Monat im Sept; Audit existiert) | ⬜ |
| 5.5 | Indexing automatisieren: Post-Deploy-Hook → Indexing API + IndexNow für geänderte URLs | ⬜ |
| 5.6 | Sitemap-`lastmod` aus echten Änderungsdaten statt Build-Datum | ⬜ |

---

## 4. KPIs & Erwartung

| KPI | Ist (90d) | 3 Monate | 6 Monate |
|---|---|---|---|
| Klicks/Tag | ~35 | 70–100 | 150–250 |
| Non-Branded-Anteil | ~16 % | 35 % | 50 %+ |
| Money-KW Top 10 | 2/16 | 8/16 | 12/16 |
| Indexierte Sitemap-URLs | ~133/162 | 155+ | 160+ |
| Mobile PSI | 60 | 80 | 90+ |
| GEO-Score / AI-Mention-Rate | 50 % / ? | 70 % / 10 % | 85 % / ≥ 20 % |
| GBP-Reviews | 810 | 870 | 940+ |

**Übersetzung in Gäste:** +100 Klicks/Tag bei konservativen 3–5 % Reservierungs-Conversion ≈ **+3–5 zusätzliche Tische/Tag** allein aus organisch — plus Local-Pack- und AI-Empfehlungs-Effekte, die hier nicht mitgezählt sind.

**Reihenfolge-Logik:** Phase 0+1 sind Voraussetzung für alles (Google muss die Seiten erst sauber indexieren), Phase 2 bringt den Umsatz, Phase 3–5 bauen den Burggraben.

---

*Erstellt 06.07.2026 auf Basis: GSC-Coverage-Exporte, GSC API (URL-Inspection + Search Analytics 90d), DataForSEO Google-Ads-Volumina (DE), Live-Site-Verifikation (curl als Googlebot), Code-Audit (SEO.tsx, prerender.js, .htaccess, generate-sitemap.mjs, 25 LPs, Supabase-Pipeline).*
