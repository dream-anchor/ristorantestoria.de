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
- **Nächste GSC-Review:** Juni 2026 (Vergleich mit Mai-Werten)
