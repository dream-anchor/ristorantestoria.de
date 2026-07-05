# Full SEO / GEO Audit — Juli 2026 (inkl. Google Business Profile)

**Stand:** 2026-07-05 | **Ziel:** Mehr zahlende Gäste (Reservierungen, Anrufe, Laufkundschaft)
**Methodik:** Live-Site-Checks (HTML, robots.txt, sitemap.xml, llms.txt), Codebase-Analyse, GSC-Baseline (`keyword-rank-baseline-2026-06-29.md`), PSI-Snapshots (26.06.), gecachte GBP-Reviews, Web-Recherche (Listicles, Verzeichnisse). Baut auf `geo-audit-2026-05.md`, `seo-strategy.md`, `seo-log.md`, `outreach-listings-2026.md` auf — dieses Audit berichtet **Deltas + neue Befunde**.

**Nicht prüfbar in dieser Session:** GBP-API live (kein `.env`/Token im Container), GSC live, Semrush (Plan ohne MCP-Zugang). Betroffene Punkte sind als „manuell prüfen" markiert.

---

## Executive Summary

| Bereich | Score | Kritischster Befund |
|---------|-------|---------------------|
| Technical SEO | 🔴 6/10 | **P0: Canonical-Bug — alle EN/IT/FR-Seiten zeigen per Canonical auf die DE-URL** |
| On-Page / Content | 🟢 9/10 | Sehr stark (Titles, Descriptions, Schema, Landing-Page-Architektur) |
| Performance | 🟡 7/10 | Mobile LCP 3,5 s; 1,4 MB Haupt-JS-Bundle; Cache-Header fehlen |
| Local SEO / GBP | 🟡 7/10 | 4,5★/810 stark; TripAdvisor 3,5★ + Faktenfehler; GBP-Basics offen (Fotos/Posts/Q&A) |
| GEO (AI-Sichtbarkeit) | 🟡 6/10 | On-Site top (llms.txt, robots, SSR) — aber **in keinem relevanten Listicle vertreten** |

**Die 3 Hebel mit dem größten Effekt auf zahlende Gäste:**
1. **Canonical-Bug fixen (P0, Code, ~1 h)** — 75 % aller 162 Sitemap-URLs (EN/IT/FR) signalisieren Google aktuell „indexiere mich nicht, nimm die DE-Seite". München-Touristen suchen englisch/italienisch/französisch — genau diese Gäste gehen verloren.
2. **Listicle-Outreach JETZT versenden** (`outreach-listings-2026.md` liegt fertig vor) — ChatGPT, Perplexity und Google AI Overviews zitieren fast ausschließlich diese Listen. STORIA fehlt in **allen** (heute verifiziert). WM-Public-Viewing-Fenster schließt am **19.07.2026**.
3. **GBP-Betrieb starten** (Fotos, wöchentliche Posts, Q&A, Review-QR) — die „in der Nähe"-Keywords haben laut GSC-Baseline null Impressionen; das ist fast reines GBP-/Local-Pack-Terrain.

---

## 1. Technical SEO

### 1.1 🔴 P0 — Canonical-Bug auf allen nicht-deutschen Seiten (NEU entdeckt)

**Befund (live verifiziert am 05.07.2026):**

| Seite | Canonical zeigt auf | Korrekt wäre |
|-------|--------------------|--------------|
| `/en/` | `https://www.ristorantestoria.de/` | `/en/` |
| `/it/` | `https://www.ristorantestoria.de/` | `/it/` |
| `/en/reservation/` | `https://www.ristorantestoria.de/reservierung/` | `/en/reservation/` |

Auch `og:url` ist auf den EN/IT/FR-Seiten falsch (zeigt auf die DE-URL).

**Ursache:** Seiten übergeben den DE-Pfad statisch als Prop (z. B. `src/pages/Index.tsx:27` → `canonical="/"`). `src/components/SEO.tsx` übernimmt ihn unverändert, statt ihn für die aktive Sprache zu lokalisieren. Die hreflang-Berechnung (`computeHreflangFromCanonical`) macht den Reverse-Lookup über `slugs.json` bereits korrekt — dieselbe Logik muss das Canonical setzen.

**Impact:** Canonical und hreflang widersprechen sich. Google verlangt selbstreferenzierende Canonicals innerhalb eines hreflang-Clusters; bei Konflikt wird häufig die kanonisierte (DE-)Seite konsolidiert → EN/IT/FR-Seiten fallen aus dem Index oder ranken nie. Das betrifft ~120 von 162 Sitemap-URLs. Touristen-Suchen („italian restaurant munich", „pizzeria napoletana monaco di baviera") laufen ins Leere bzw. auf die DE-Seite.

**Fix:** In `SEO.tsx` das Canonical aus aktueller Sprache + `slugs.json` ableiten (analoge Logik zu hreflang), `og:url` mitziehen. Danach: Sitemap neu einreichen, Priority-URLs über `request-indexing.mjs` pushen.

### 1.2 🟡 Sitemap: `lastmod` = Build-Datum für alle URLs

`scripts/generate-sitemap.mjs:33` stempelt **jede** der 162 URLs mit dem heutigen Datum (`new Date()`) + `changefreq daily`. Google erkennt das Muster (alles „heute geändert") und ignoriert lastmod dann komplett — das Freshness-Signal ist entwertet und echte Änderungen werden langsamer gecrawlt.
**Fix:** lastmod pro Route aus letztem Git-Commit der Seiten-/Content-Datei ableiten (oder mind. statisch pro Seitentyp pflegen); `changefreq` realistisch setzen (Landing Pages: monthly).

### 1.3 🟡 Geo-Koordinaten-Mismatch

Meta-Tags (`SEO.tsx`): `48.1467;11.5641` vs. JSON-LD (`storia-entity.ts`): `48.1456;11.5656`. Kleine, aber unnötige NAP-Inkonsistenz — auf einen Wert (den GBP-Wert) vereinheitlichen.

### 1.4 ✅ Stark

- Selbstreferenzierende Canonicals auf DE-Seiten, www + Trailing-Slash konsequent.
- hreflang vollständig (4 Sprachen + x-default→de) in HTML **und** Sitemap, Legal-Seiten korrekt DE-only ohne hreflang.
- SSR-Prerender liefert echten Content an Crawler (Öffnungszeiten, Menü, NAP im HTML verifiziert); CSS inline (kein Render-Blocking); robots.txt sauber (admin/functions disallowed).
- JSON-LD außergewöhnlich vollständig: Restaurant (+AggregateRating 4,5/810 + 5 Reviews auf Startseite), WebSite, Organization, Menu/MenuSection/MenuItem, FAQPage, BreadcrumbList, ReserveAction/OrderAction, GeoCoordinates, OpeningHoursSpecification, ParkingFacility, areaServed.

---

## 2. Performance (Conversion-relevant: mobile Gäste)

**PSI 26.06.2026 (Startseite):** Desktop 100 | **Mobile 88** — Mobile-LCP **3,5 s** (Ziel < 2,5 s), FCP 2,3 s, CLS 0,002 (top), TBT 100 ms.

| Problem | Messwert | Fix |
|---------|----------|-----|
| Haupt-JS-Bundle | `index-*.js` **1,39 MB raw / 405 KB gzip** (heute gemessen); dazu Supabase-Chunk 174 KB auf Marketing-Seiten | Admin-/Supabase-Code aus dem Public-Bundle splitten (Admin darf lazy sein — Pre-Render-Regeln erlauben das explizit) |
| Cache-Lifetimes | Est. Savings **1.088 KiB** (PSI) | `.htaccess`: `Cache-Control: public, max-age=31536000, immutable` für `/assets/*` (gehashte Dateinamen) |
| Image Delivery | Est. Savings 678 KiB (Desktop-PSI) | AVIF-Varianten ergänzen (aktuell nur WebP, 0× AVIF im Code), responsive `srcset` prüfen |
| Unused JS | 320 KiB | Folgt aus Bundle-Split |

Mobile-LCP ist der einzige CWV-Ausreißer — bei einem Restaurant kommt der Großteil der „jetzt essen gehen"-Zugriffe mobil. LCP < 2,5 s ist zugleich Local-Ranking-Hygiene.

---

## 3. On-Page / Content — Zustand: sehr gut

- Titles/Descriptions mit USPs, Preisen, CTAs (z. B. „3 Gänge ab 14,90 €", „90 Sek. bei 400 °C") — CTR-optimiert, korrekt pro Seite differenziert.
- Landing-Page-Architektur deckt alle Money-Intents ab (Lunch, Aperitivo, Firmenfeier, Geburtstag, romantisches Dinner, Pizza, Hauptbahnhof/Königsplatz-Geo-Cluster).
- **Kannibalisierungs-Watchpoints** (aus Baseline 29.06., Recheck 27.07.): Homepage rankt noch für „italiener maxvorstadt"/„pizzeria münchen" statt der dedizierten Seiten → interne Anker-Texte konsequent auf die Zielseiten ausrichten („pizzeria münchen" → `/pizza-muenchen/`, „italienisches restaurant maxvorstadt" → `/italienisches-restaurant-muenchen/`).
- Seite-1-Kandidaten mit hohem Volumen: `beste pizza münchen` (Pos 11, 613 Impr.), `pizzeria münchen` (Pos 10,8, 833 Impr.), `neapolitanische pizza münchen` (Pos 11,2, 275 Impr.) — Push über Canonical-Fix, interne Links, frisches Bildmaterial und Listicle-Backlinks (§5).
- GSC-Basis (Mai): 819 Klicks / 30.702 Impr. / CTR 2,67 % / Ø-Pos 12,9. Sandbox-Phase läuft laut `seo-log.md` ~Mai–Aug aus → Positionssprünge realistisch, wenn P0 gefixt ist.

---

## 4. Local SEO / Google Business Profile

### 4.1 Ist-Zustand (aus Cache + Web-Recherche; API live nicht prüfbar)

| Plattform | Rating | Reviews | Status |
|-----------|--------|---------|--------|
| **Google** | **4,5★** | **810** (Stand 05.07.) | Stark. Top-50-relevante Reviews: nur 4–5★, keine ≤3★ sichtbar |
| TripAdvisor | 3,5★ | 289 | 🔴 **Faktenfehler in Beschreibung („Seit 1995…") — STORIA existiert seit 2015.** Owner-Login nötig |
| Yelp | — | 24 (31 Fotos) | Dünn; für US-Touristen & AI-Antworten relevant |
| TheFork | 9,3/10 | — | Gut |
| Restaurant Guru | 4,3 | 1.409 | Aggregator, ok |

- Jahresziel „500+ Google Reviews Q3" ist mit 810 **längst übertroffen** → `seo-log.md` aktualisieren, neues Ziel setzen (z. B. 1.000 + Halten der 4,5★).
- UTM-Tracking vom GBP-Profil ist aktiv (GSC zeigt `/?utm_source=gmb&utm_medium=organic&utm_campaign=profile`) ✅
- Review-Antwort-Playbook (`gbp-review-responses.md`) existiert und ist hochwertig ✅

### 4.2 Offene GBP-Maßnahmen (aus `seo-log.md`, weiterhin unerledigt)

1. **Kategorien/Attribute prüfen** (Primary: Italian Restaurant; Pizza Restaurant, Wine Bar als Sekundär), Attribute: Terrasse, Reservierung, Mittagstisch.
2. **20+ aktuelle Fotos** (Gerichte, Terrasse, Innenraum, Team) — Fotos sind der stärkste GBP-CTR-Hebel.
3. **Wöchentliche GBP-Posts** (Mittagsmenü, Aperitivo, Events, WM-Public-Viewing solange die WM läuft).
4. **Q&A proaktiv befüllen** (Parken, Reservierung, Terrasse, glutenfreie Pizza, Hunde erlaubt).
5. **Review-System am Tisch/auf Rechnung** (QR-Code) — Velocity halten; im 50er-Review-Cache stammen nur ~8 aus den letzten 90 Tagen (Sortierung „relevance", tatsächliche Velocity via GBP-Insights prüfen).
6. **Menü-Sync ins GBP** (`sync-gbp-menu.ts` existiert) — regelmäßig laufen lassen, damit Google-Menü und Website nie divergieren.

**Warum das direkt zahlende Gäste bringt:** Die komplette „in der Nähe"-Keyword-Gruppe (italienisch in der nähe, restaurant in der nähe jetzt geöffnet, …) hat laut Baseline **0 Impressionen auf der Website** — diese Nachfrage wird fast ausschließlich über das Local Pack / Maps bedient. GBP-Aktivität (Fotos, Posts, Reviews, Kategorien) ist dort der Rankingfaktor, nicht die Website.

### 4.3 Manuell prüfen (API/Owner-Login nötig)

- [ ] GBP-Insights: Anrufe, Wegbeschreibungen, Website-Klicks, Reservierungen (Baseline für KPI-Messung!)
- [ ] TripAdvisor-Beschreibung korrigieren („seit 2015", Pizza-Kategorie)
- [ ] Öffnungszeiten/Sonderöffnungszeiten (Feiertage) aktuell?
- [ ] GBP-Reservierungslink zeigt auf `/reservierung/` mit UTM?

---

## 5. GEO — Sichtbarkeit in AI-Antworten (ChatGPT, Perplexity, AI Overviews)

### 5.1 On-Site: Deltas seit Mai-Audit — weitgehend behoben ✅

| Mai-Befund | Status Juli |
|------------|-------------|
| OAI-SearchBot, Claude-SearchBot fehlen in robots.txt | ✅ behoben (live verifiziert) |
| Kein dateModified | ✅ vorhanden (`StructuredData.tsx:63`) |
| Kein knowsAbout | ✅ vorhanden (`StructuredData.tsx:179`) |
| Person sameAs fehlt | ✅ vorhanden (`storia-entity.ts`) |
| Kein @graph | ⚪ weiterhin offen (nice-to-have, geringer Impact) |

Dazu: `llms.txt` (6 KB, kuratiert) + `llms-full.txt` (25 KB) + `llm-de/en.html` live und verlinkt (`<link rel="alternate" type="text/plain">`). **On-Site-GEO ist überdurchschnittlich gut.**

### 5.2 🔴 Off-Page: Die eigentliche GEO-Lücke — Zitierquellen

Heute verifiziert: Bei Suchen wie „beste neapolitanische Pizza München" dominieren Listicles (Mit Vergnügen, Mia san Foodies, MUCBOOK, Jäger & Sammler, mrmuenchen, FACES) — **STORIA kommt in keinem einzigen vor** (Mit-Vergnügen-Liste mit 11 Restaurants explizit geprüft: Forza Napoli, 60 Secondi, Soul Kitchen … kein STORIA). Genau diese Artikel sind die Quellen, die AI-Assistenten zitieren, wenn Gäste fragen „Wo gibt's die beste Pizza in München?".

Positiv: Bei „italienisches Restaurant Maxvorstadt" erscheint STORIA bereits in Suchergebnissen und AI-Zusammenfassungen (eigene Site rankt + speisekarte.de/TheFork-Zitate). Der Engpass ist die **Kategorie-Ebene München-weit** („beste Pizza", „bester Italiener").

**Maßnahme:** `outreach-listings-2026.md` ist fertig vorbereitet (Ziel-Publisher, Artikel-URLs, Mail-Vorlagen). **Versand ist der einzige fehlende Schritt.** Priorität:
1. **WM Public Viewing — zeitkritisch, Turnier endet 19.07.2026** (in-muenchen.de, Abendzeitung, Radio Gong, Mr. München, Mit Vergnügen, HolidayCheck)
2. Neapolitanische Pizza (Mit Vergnügen, Mia san Foodies, Jäger & Sammler) — ggf. Blogger-Einladung zum Essen statt kalter Mail
3. Firmenfeier (heycater, Eventinc, Fiylo, Munich-Eventlocations) — Q4-Weihnachtsfeier-Geschäft beginnt im September

### 5.3 Messung

`scripts/geo-monitor.mjs` existiert → monatlich laufen lassen und Ergebnisse in `seo-log.md` tracken: Erscheint STORIA in AI-Antworten für die 10 wichtigsten Queries (beste Pizza München, Italiener Maxvorstadt, romantisches Dinner München, Firmenfeier Location München, …)?

---

## 6. Maßnahmenplan (priorisiert nach Effekt auf zahlende Gäste)

### Sofort (Woche 1)
| # | Maßnahme | Aufwand | Typ |
|---|----------|---------|-----|
| 1 | **Canonical-Fix EN/IT/FR** (`SEO.tsx`) + Deploy + Re-Indexing der Priority-URLs | ~1–2 h Code | P0 Bug |
| 2 | **WM-Outreach-Mails versenden** (Fenster bis 19.07.!) | 1 h | Owner |
| 3 | TripAdvisor-Faktenfehler korrigieren | 15 min | Owner-Login |
| 4 | Cache-Header für `/assets/*` in `.htaccess` | 30 min | Code |

### 30 Tage
| # | Maßnahme | Aufwand | Typ |
|---|----------|---------|-----|
| 5 | Pizza- + Firmenfeier-Listicle-Outreach (inkl. Blogger-Einladung) | 2–3 h | Owner |
| 6 | GBP: 20+ Fotos, wöchentliche Posts starten, Q&A befüllen | laufend | Owner |
| 7 | Review-QR auf Rechnung/Tisch | 1 h | Owner |
| 8 | JS-Bundle-Split (Supabase/Admin raus aus Public-Bundle) → Mobile-LCP < 2,5 s | 0,5–1 Tag | Code |
| 9 | Interne Anker-Fixes gegen Kannibalisierung (home ↔ pizza-muenchen ↔ italienisches-restaurant-muenchen) | 2 h | Code |
| 10 | Rank-Recheck 27.07. gegen Baseline (`tx-local-2026`, 77 Keywords) | 1 h | Ops |

### 60–90 Tage
| # | Maßnahme | Aufwand | Typ |
|---|----------|---------|-----|
| 11 | AVIF-Bildvarianten + `srcset` | 0,5 Tag | Code |
| 12 | Sitemap-lastmod pro Route (Git-Datum) | 2 h | Code |
| 13 | Geo-Koordinaten vereinheitlichen | 15 min | Code |
| 14 | `/weihnachtsfeier-muenchen/` Content-Refresh + GBP-Posts ab September (Q4 = umsatzstärkstes Event-Geschäft) | 0,5 Tag | Code+Owner |
| 15 | `geo-monitor.mjs` monatlich + KPI-Review in `seo-log.md` | laufend | Ops |

### KPIs (messen, was Gäste bringt — nicht nur Rankings)
- GBP-Insights: Anrufe, Wegbeschreibungen, Reservierungs-Klicks / Woche (Baseline jetzt ziehen!)
- GSC: Klicks auf Money-Pages (`/reservierung/`, `/lunch-…/`, `/firmenfeier-…/`)
- Reservierungen mit UTM-Quelle gmb/organic
- Review-Velocity + Rating-Stabilität (4,5★ halten)
- GEO: STORIA in AI-Antworten für Top-10-Queries (monatlich via geo-monitor)

---

## Anhang: Verbesserter Audit-Prompt (für Wiederholung)

Der Prompt „Full SEO/GEO Audit inkl. GBP, Ziel: mehr zahlende Gäste" ist gut, aber vier Dinge machen das Ergebnis deutlich schärfer:

1. **KPI statt Proxy definieren:** „Mehr zahlende Gäste" → messbar machen: „Steigere Reservierungen/Anrufe/Wegbeschreibungen (GBP-Insights) und Klicks auf Money-Pages (GSC) um X % in 90 Tagen. Baseline: [Zahlen beilegen]."
2. **Datenzugänge in die Session geben:** GBP-Token (`.env` mit `GBP_TOKEN_ENCRYPTION_KEY` + `DATABASE_URL`) und GSC-Zugang verfügbar machen — sonst bleibt der GBP-Teil auf Cache/Recherche beschränkt. (Semrush-MCP ist im aktuellen Plan nicht enthalten.)
3. **Output festlegen:** „Audit als Doc + Top-10-Maßnahmen mit Aufwand/Impact + P0-Fixes direkt als PR umsetzen" — sonst entsteht nur ein Dokument statt Wirkung.
4. **Constraints nennen:** Wer setzt um (Code vs. Owner-Logins TripAdvisor/GBP)? Budget für Fotos/Blogger-Einladungen? Ads ja/nein? GEO-Ziel konkret: „STORIA soll in ChatGPT/Perplexity/AI Overviews bei ‚beste Pizza München' als Empfehlung erscheinen."

Beispiel-Prompt:
> „Führe das monatliche SEO/GEO/GBP-Audit durch (Vergleich zu docs/seo-geo-audit-2026-07.md und keyword-rank-baseline). KPI: Reservierungen + GBP-Aktionen + Money-Page-Klicks. Setze alle reinen Code-Fixes (P0/P1) direkt als PR um, liste Owner-Aufgaben separat mit Anleitung. Zugänge: GSC ✓, GBP-API ✓. Kein Ads-Budget. Ergebnis: aktualisiertes Audit-Doc + PR + 5 wichtigste Owner-To-dos."
