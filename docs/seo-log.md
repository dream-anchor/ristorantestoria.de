# SEO Log — Ristorante STORIA München

Chronologisches Log aller SEO-Maßnahmen, Analysen und Ergebnisse.
Vor jeder Session lesen, damit nichts doppelt gemacht wird.

---

## Listings & Citations (Stand Mai 2026)

| Plattform | Status | URL |
|-----------|--------|-----|
| münchen.de Branchenbuch | ✅ Gelistet | https://www.muenchen.de/service/branchenbuch/muenchen/muenchen/maxvorstadt/G/797.html |
| münchen.de (2. Seite) | ✅ Gelistet | https://www.muenchen.de/service/branchenbuch/G/797_2.html |
| münchen.de (Kategorie) | ✅ Gelistet | https://www.muenchen.de/service/branchenbuch/G/148_14.html |
| TheFork (LaFourchette) | ✅ Gelistet | https://www.thefork.de/restaurant/storia-r748537 |
| OpenTable (15 Länder) | ✅ Gelistet | https://www.opentable.de/r/storia |
| Quandoo | ✅ Gelistet | https://www.quandoo.de/place/storia-10239/about |
| TripAdvisor | ✅ Gelistet | — |
| Falstaff (7 Sprachversionen) | ✅ Gelistet | https://www.falstaff.com/de/restaurants/storia-muenchen |
| Yelp | ✅ Gelistet | — |
| Apple Maps | ✅ Gelistet | — |
| Google Business Profile | ✅ Aktiv | — |
| wanderlog.com | ✅ Gelistet (20+ Sprachversionen) | — |
| speisekarte.de | ✅ Gelistet | — |
| speisekartenweb.de | ✅ Gelistet | — |
| Guide Michelin | ❌ Fehlt | → Einreichen |
| visitmuenchen.com | ❌ Fehlt | → Einreichen |
| Süddeutsche Zeitung / TZ | ❌ Kein Redaktionsartikel | → Pitchen |
| mitvergnuegen.com | ❌ Kein Artikel | → Blogger einladen |

---

## 2026-05 — Mai

### Analyse-Session (07.05.2026)

**Was analysiert wurde:**
- GSC Performance-Übersicht (28 Tage): 819 Klicks, 30.702 Impressionen, CTR 2,67%, Ø Pos 12,9
- Top 1.000 Queries analysiert → Keyword-Cluster identifiziert
- Backlink-Profil aus 6 GSC-CSV-Exporten ausgewertet
- .htaccess vollständig geprüft → technisch einwandfrei
- Wettbewerbslandschaft für "Italiener München": SERP von Aggregatoren dominiert (TripAdvisor, TheFork, Michelin, mitvergnügen.com) — Map Pack ist das primäre Ziel
- GA4 Traffic-Mix: 678 Organic / 265 Direct / 31 Referral / 20 Social (28 Tage)

**Wichtigste Erkenntnisse:**
- 89% aller Backlinks gehen auf Homepage → Landing Pages haben kaum externe Authority
- CTR-Killer: /aperitivo-muenchen/ (Pos 9.1, 2.735 Imp, nur 0,9% CTR) — Descriptions nicht klickstark genug
- /geburtstagsfeier-muenchen/ + /firmenfeier-muenchen/: Descriptions zu lang (truncated)
- "aperitivo bar münchen" Pos 10.2 / "aperol bar münchen" Pos 9.0 — Seite 1, aber 0 Klicks
- Fehlende Verlinkung von events-storia.de auf spezifische Landing Pages (nur Homepage verlinkt)

### Umsetzungen (07.05.2026)

| Datei | Was geändert | Grund |
|-------|-------------|-------|
| `src/translations/de.ts` | seoDescription firmenfeier: 183→144 Zeichen | Truncation fix |
| `src/translations/de.ts` | seoDescription aperitivo: Cicchetti + CTA hinzugefügt | CTR-Verbesserung |
| `src/translations/de.ts` | seoDescription geburtstagsfeier: 171→134 Zeichen | Truncation fix |
| `src/translations/en.ts` | seoDescription corporate: 185→149 Zeichen | Truncation fix |
| `src/translations/en.ts` | seoDescription aperitivo: Cicchetti + CTA | CTR-Verbesserung |
| `src/translations/en.ts` | seoDescription birthday: 156→128 Zeichen | Truncation fix |
| `src/translations/it.ts` | seoDescription aperitivo: Cicchetti + CTA | CTR-Verbesserung |
| `src/translations/fr.ts` | seoDescription aperitivo: Cicchetti + CTA | CTR-Verbesserung |
| `src/translations/fr.ts` | seoDescription entreprise: 174→141 Zeichen | Truncation fix |
| `src/translations/fr.ts` | seoDescription anniversaire: 165→137 Zeichen | Truncation fix |

### Offene Maßnahmen (priorisiert)

- [ ] **HOCH** — events-storia.de: Links auf Landing Pages ergänzen (/aperitivo/, /catering/, /firmenfeier/, /neapolitanische-pizza/)
- [ ] **HOCH** — Google Business Profile: Kategorien, Fotos (20+), wöchentliche Posts starten
- [ ] **HOCH** — Review-System einführen (QR-Code auf Rechnung, Follow-up-Mail)
- [ ] **MITTEL** — Guide Michelin Eintrag einreichen
- [ ] **MITTEL** — visitmuenchen.com Eintrag beantragen
- [ ] **MITTEL** — /italiener-koenigsplatz/ DE-Version prüfen/live stellen
- [ ] **MITTEL** — /pasta-fresca-muenchen/ erstellen (Pasta = zweite Kernkompetenz)
- [ ] **NIEDRIG** — mitvergnuegen.com Food-Blogger einladen
- [ ] **NIEDRIG** — Süddeutsche / TZ Aperitivo-Trend-Story pitchen
- [ ] **SAISONAL** — /weihnachtsfeier-muenchen/ vor Oktober live stellen

---

---

## 2026-09 — September

### Striking-Distance-Audit + KONZEPT/LOOP (12.09.2026)

**Auslöser:** Antoine legte frischen GSC-Export vor (`ristorantestoria.de-Performance-on-Search-
2026-09-12.zip`, 92-Tage-Fenster) mit der Frage, ob die „Striking-Distance"-Theorie (Seite-2-
Keywords Pos. 8–20 durch Title/H2/Content-Ergänzung auf Seite 1 heben) hier greift.

**Was analysiert wurde:**
- `Suchanfragen.csv` (1.000 Queries) + `Seiten.csv` (163 URLs) ausgewertet, Filter Pos. 7–20 /
  Impr. ≥ 25 → 331 Rohkandidaten.
- 15 wichtigste SEO-Landingpages live im Repo gelesen (Title/H1/H2-Ist-Zustand gegen die Queries
  abgeglichen) — keine Annahme aus dem CSV allein übernommen.
- Externe Zweitmeinung (Gemini) zur Striking-Distance-Methodik eingeholt und gegengeprüft, nicht
  blind übernommen: additive statt ersetzende Title-Änderungen (2 Vorschläge korrigiert), Search-
  Intent-Check per Web-Suche für die 2 größten Cluster (Ergebnis: beide SERPs Aggregator-dominiert
  — TripAdvisor/TheFork/Falstaff/OpenTable, kein Einzelrestaurant sichtbar → Erwartung gedämpft,
  Fix trotzdem durchgeführt, da kostenlos/risikofrei).

**Wichtigste Erkenntnisse:**
- Systematisches Muster: auf praktisch jeder Zielseite fehlt die exakte Kopf-Keyword-Phrase in
  Title/H1/H2 wegen Wortstellung („Pizza München" statt „Beste Pizza München", „Restaurant **in**
  München" statt „Restaurant München") — kein Einzelfall, ein wiederkehrender Root Cause.
  Auffälligster Fall: `italienisches-restaurant-muenchen/` rankt im Schnitt Pos. 6,95, für das
  exakte Kopf-Keyword selbst aber nur Pos. 20,88.
  Zweitauffälligster Fall: die IT-Seite `it/miglior-ristorante-italiano-monaco/` matcht bei 1.145
  Impr. keines der drei Top-Keywords.
- Adressierbares Volumen nach Noise-Bereinigung: **~23.400 Impr./92 Tage über 12 Cluster**
  (ausgeschlossen: WM-2026-Queries — Finale war 19.07.2026, ~2 Monate vorbei —, Marken-
  verwechslungen „Storia Stadeln"/„La Storia"/„La Famiglia München" — andere Unternehmen —,
  Near-me-Queries — GBP-Thema, nicht On-Page).
- **Wichtige Korrektur während der Umsetzung (Antoine, 12.09.2026): STORIA hat einen Steinofen,
  keinen Holzofen (offene Flamme) — nicht austauschbar.** Ursprünglicher Plan, „Holzofenpizza
  München" (149+209 Impr.) als Synonym-Lücke zu schließen, zurückgezogen — wäre eine falsche
  Tatsachenbehauptung gewesen. Für künftige Pizza-/Ofen-bezogene Texte: **immer Steinofen, nie
  Holzofen.**
- Mögliche Kannibalisierung entdeckt (noch nicht geklärt): `silvester-muenchen/` und
  `besondere-anlaesse/silvester/` sind dieselbe Komponente mit unterschiedlichem Title/H1 für
  denselben Intent, beide aktuell `isActive=false`. Analog bei Weihnachten. Klärung mit Antoine
  aussteht (siehe „Offene Maßnahmen" unten, Kriterium D1).

**Dokumente (Bauplan bleibt bestehen, nicht duplizieren):**
- `docs/striking-distance-audit-2026-09-12.md` — Rohanalyse, Theorie-Einordnung, Noise-Liste.
- `docs/KONZEPT-STRIKING-DISTANCE.md` — alle 12 Kriterien mit Datei/Zeile, Baseline-Zahlen,
  konkretem Vor-/Nach-Text.
- `docs/LOOP-STRIKING-DISTANCE.md` — Umsetzungsstand (Checkboxen + Beweiszeilen, lebendes
  Dokument — dort steht der aktuelle Fortschritt, hier im Log nur die Zusammenfassung).
- `.claude/commands/striking-distance-loop.md` — Subagenten-Protokoll für die Umsetzung.

**Umsetzungsstand (12.09.2026):** Einheit A (4 Kriterien, größte Volumen-Cluster) von Antoine
freigegeben („Ja, setz alles um"). A1 (EN Romantic Dinner) umgesetzt und committet (Branch
`striking-distance-a`, noch nicht gemergt/live) — Details/Beweiszeile in
`docs/LOOP-STRIKING-DISTANCE.md`. A2–A4 sowie Einheiten B/C/D zum Zeitpunkt dieses Log-Eintrags
noch offen — aktuellen Stand immer in `docs/LOOP-STRIKING-DISTANCE.md` prüfen, nicht hier (dieser
Log-Eintrag wird nicht laufend nachgepflegt, nur bei Abschluss/Review aktualisiert).

**Baseline für die Erfolgsmessung** (GSC-Export 12.09.2026, 92-Tage-Fenster — vollständige Tabelle
mit allen Einzel-Queries in `docs/KONZEPT-STRIKING-DISTANCE.md` § 3):

| Cluster | Zielseite | Impr. (Top-Query) | Pos. (Top-Query) |
|---|---|---|---|
| Romantic Dinner (EN) | `en/romantic-dinner-munich/` | 4.864 (`best restaurants romantic`) | 9,28 |
| Pizza München | `pizza-muenchen/` | 1.751 (`beste pizza münchen`) | 9,79 |
| Catering | `catering/` | 474 (`hochzeit catering münchen`) | 17,23 |
| Best Italian Restaurant (EN) | `en/best-italian-restaurant-munich/` | 734 (`best italian restaurant munich`) | 8,90 |
| Firmenfeier | `firmenfeier-muenchen/` | 1.144 (`firmenfeier münchen`) | 15,12 |
| Italienisches Restaurant (DE) | `italienisches-restaurant-muenchen/` | 81 (`italienisches restaurant münchen`) | 20,88 |
| Italiener Königsplatz | `italiener-koenigsplatz/` | 265 (`italiener maxvorstadt`) | 9,50 |
| Italiener Hauptbahnhof | `italiener-hauptbahnhof-muenchen/` | 210 (`münchen hauptbahnhof essen`) | 12,46 |
| Neapolitanische Pizza | `neapolitanische-pizza-muenchen/` | 1.083 (`neapolitanische pizza münchen`) | 10,23 |
| Aperitivo | `aperitivo-muenchen/` | 207 (`aperitivo bar münchen`) | 11,02 |
| Geburtstagsfeier | `geburtstagsfeier-muenchen/` | 206 (`geburtstag feiern restaurant münchen`) | 7,30 |
| IT Ristorante | `it/miglior-ristorante-italiano-monaco/` | 585 (`ristoranti italiani a monaco di baviera`) | 13,07 |

**Review-Termin: zwischen 07.10.2026 und 04.11.2026** (4–8 Wochen nach dem letzten Einheit-Deploy —
Datum beim Deploy jeder Einheit in `docs/LOOP-STRIKING-DISTANCE.md` fortschreiben, hier erst bei
der tatsächlichen Review nachtragen). **Review-Vorgehen:** neuen GSC-Export ziehen (gleiche zwei
CSVs, gleiches Verfahren), obige Tabelle mit denselben Queries neu abfragen, Delta eintragen. Bei
Queries ohne Bewegung: nicht nachjustieren (Gefahr Keyword-Stuffing), als „braucht Autorität statt
Text" einordnen (siehe KONZEPT § „Erfolgsmessung").

**Umsetzungsstand, Ende Session 12.09.2026:** Einheiten A+B+C vollständig gemergt, deployt, live
verifiziert (12 Kriterien, PR #67/#70/#73). D1 (Silvester/Weihnachten/Valentinstag-Struktur) mit
Antoine geklärt: bestätigte Dublette (historisch gewachsen — „Besondere Anlässe"-Pillar zuerst,
später eigenständige Landingpages), Konsolidierung gewünscht. Deep-Dive-Analyse als Senior-SEO+GEO-
Rolle durchgeführt → `docs/KONZEPT-SILVESTER-WEIHNACHTEN-KONSOLIDIERUNG.md`: Kernbefund, alle drei
Paare (Silvester/Weihnachten/Valentinstag) sind technisch **dieselbe Komponente** an zwei URLs
(`standalone`-Prop), Intro/Gründe/Timeline/FAQ bereits wortidentisch — kein Content-Merge nötig, nur
301-Redirect der schwächeren Standalone-URL auf die Pillar-URL (bessere interne Verlinkung + Event-
JSON-LD + Live-Menü). Nebenbefunde: Silvester-JSON-LD-Preis widerspricht sichtbarem Seiteninhalt
(65,90/99€ vs. 99–150€), `SeasonalBanner.tsx` verlinkt Silvester-CTA fälschlich auf
`weihnachtsfeier-muenchen`. **Umsetzung noch nicht freigegeben** — Freigabe-Frage steht im Chat,
siehe KONZEPT § 7. Nächste Session: dort weiterlesen, nicht neu recherchieren.

---

## Monatliche Ziele & Review

### Juni 2026 — Ziele (bis 07.06.2026 messen)

| KPI | Aktuell (Mai) | Ziel Juni | Wie messen |
|-----|--------------|-----------|------------|
| Klicks/28 Tage | 819 | 950+ | GSC Performance |
| Impressionen/28 Tage | 30.702 | 32.000+ | GSC Performance |
| CTR gesamt | 2,67% | 3,0%+ | GSC Performance |
| Ø Position | 12,9 | 12,0 oder besser | GSC Performance |
| /aperitivo-muenchen/ CTR | 0,9% | 1,5%+ | GSC → nach Seite filtern |
| /geburtstagsfeier/ Pos | 20,7 | 18,0 oder besser | GSC → nach Seite filtern |
| /firmenfeier/ Pos | 21,5 | 18,0 oder besser | GSC → nach Seite filtern |

**Review-Fragen Juni:**
- Haben die Description-Fixes CTR messbar verbessert?
- Sind neue Seiten gerankt? (/italiener-koenigsplatz/, etc.)
- Wie viele neue Google Reviews seit Mai?
- Sind events-storia.de Links auf Landing Pages gesetzt?

### Jahresziele 2026

| Ziel | Zeitrahmen | Status |
|------|-----------|--------|
| Top-3 Local Pack "Italiener München" | Q3–Q4 2026 | 🔄 In Arbeit |
| 500+ Google Reviews | Q3 2026 | ⬜ Offen |
| /aperitivo-muenchen/ Pos <5 | Q3 2026 | ⬜ Offen |
| "Italiener Maxvorstadt" Pos <5 | Q2 2026 | ⬜ Offen |
| /pasta-fresca-muenchen/ live | Q2 2026 | ⬜ Offen |
| /weihnachtsfeier-muenchen/ live | Okt 2026 | ⬜ Offen |

---

## SEO-Kontext

- **Domain:** ristorantestoria.de (seit ~2015, 10 Jahre alt)
- **Relaunch:** Dezember 2025 (neue Tech-Stack, 301-Redirects vollständig)
- **SEO aktiv seit:** Januar 2026
- **Aktueller Status:** Google Sandbox-Phase läuft aus (~Mai–Aug 2026 → Positionssprünge erwartet)
- **Ziel:** Top-3 Local Pack für "Italienisches Restaurant München" / "Italiener München"
- **Branded Keywords:** ranken bereits auf Pos 1–2 (storia münchen, storia munich etc.)
- **Nächste GSC-Review:** 07.10.–04.11.2026 (Striking-Distance-Ergebnis, Vergleich mit
  12.09.2026-Baseline — siehe § „2026-09 — September" oben)
