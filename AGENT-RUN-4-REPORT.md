# AGENT-RUN-4 — Zentrale `facts.ts` als Single Source of Truth

**Datum:** 2026-07-19
**Commit:** `refactor(seo): zentrale facts.ts als single source of truth`
**Ziel:** Fakten-Inkonsistenzen sitewide beseitigen (GEO/KI-Zitierfähigkeit).

---

## 1. Was wurde gemacht

### Neue Datei: `src/config/facts.ts`
Dokumentierte SSoT-Fassade für die faktischen Kernwerte. NAP/Öffnungszeiten werden
bewusst aus dem bestehenden `storia-entity.ts` **abgeleitet** (kein zweiter,
konkurrierender Wertekörper). Neu ergänzt: Bewertungen, Aperitivo-Preise,
homepage-konforme Kapazität.

| Feld | Wert (IST aus Repo) |
|------|---------------------|
| `address.street` | `Karlstraße 47a` (einheitlich) |
| `phone` / `phoneTel` | `+49 89 51519696` / `+498951519696` |
| `whatsapp` / `whatsappTel` | `+49 163 603 3912` / `491636033912` |
| `email` | `info@ristorantestoria.de` |
| `openingHours` | Mo–Fr 09:00–01:00 · Sa–So 12:00–01:00 |
| `reviews` | `{ count: 810, avg: 4.5 }` |
| `aperitivo` | Spritz `9,90` · alkoholfrei `7,90` |
| `capacity` | innen 100 Sitz · Terrasse 100 Sitz · 180 Steh je Bereich |
| `reviewsOverRounded` | `800` (abgerundet, hält „über X" wahr: 810 > 800) |

**Weihnachts-Menüpreis (45 € vs. 49 €):** bewusst **NICHT** vereinheitlicht —
als `TODO(Kundenklärung)`-Kommentar in `facts.ts` vermerkt (Klärung mit Familie
Speranza steht aus).

### Komponenten auf `facts.ts` umgestellt
- **`StructuredData.tsx`** — `aggregateRating` (ratingValue/ratingCount) jetzt aus
  `FACTS.reviews` statt aus der (driftenden) Fetch-JSON. Gilt für ~104 prerenderte
  JSON-LD-Blöcke.
- **`Footer.tsx`** — Telefon, WhatsApp, Adresse, Öffnungszeiten aus `FACTS`.
- **`Catering.tsx`** — eigenes JSON-LD (`FoodEstablishment`): NAP + `aggregateRating`
  aus `FACTS`. Korrigiert von **falsch `4.8` / `700`** → `4.5` / `810`.

### Bewertungszahl vereinheitlicht (810 exakt / „über 800" gerundet / 4,5)
- **GoogleReviews-Block:** JSON-Summaries + `summaryLabel` in allen 4 Sprachen
  `über 780` → `über 800` (`google-reviews-{de,en,it,fr}.json`). `totalReviews`
  bleibt exakt `810`.
- **`scripts/fetch-google-reviews.mjs`:** die hardcodeten Summary-Texte/Labels
  ebenfalls `780` → `800` — sonst schleppt der nächste Review-Fetch die alte Zahl
  wieder ein.
- **TLDR-/Trust-Strings** (`de/en/it/fr.ts`), `UeberUns.tsx`, `OktoberfestMuenchen.tsx`:
  alle `über/over/oltre/plus de 780` → `800`.
- **Weitere aufgedeckte Widersprüche mitkorrigiert:**
  - `ValentineEmotionalSections.tsx`: `über/over/oltre/plus de 810` (falsch: 810 ist
    nicht > 810) → `800`.
  - `NeapolitanischePizza`-Badge `socialProofRating`: **falsch `4.8 Google Rating`**
    (de/en/fr) → `4.5`.
  - `PizzaMuenchen`-Badge `socialProofRating`: **`1.000+ Bewertungen`** (widerspricht
    810) → `800+` (de/en/it/fr).

### `llms.txt` / `llms-full.txt`
Manuell synchronisiert (nicht Teil der `npm run build`-Pipeline — daher nicht
generiert, sondern direkt gepflegt):
- `public/llms.txt`: `über 810` → `über 800 Google-Bewertungen`
- `public/llms-full.txt`: `über 780` → `über 800 Google-Bewertungen`

### Adress-Schreibweise `47A` → `47a`
Vereinheitlicht (nur Schreibweise, keine Adressänderung) in: `wmSpiele.ts`,
`WmPublicViewingMuenchen.tsx`, `wmContent.ts` (12×), `Catering.tsx`.

---

## 2. Verifikation (vor Push)

| Gate | Ergebnis |
|------|----------|
| `npm run build` | ✅ grün — 168/168 prerendered, 0 Errors |
| `tsc --noEmit` (tsconfig.app) | ✅ exit 0 |
| `dist/`: `über 780` / over / oltre / plus de | ✅ **0 Treffer** |
| `dist/`: `47A` | ✅ **0 Treffer** |
| `dist/`: `Laden...` | ✅ **0 Treffer** |
| `dist/`: `4.8 Google` / `4,8 Sterne` / `ratingValue":"4.8"` | ✅ **0 Treffer** |
| JSON-LD `ratingCount` | ✅ einheitlich **810** (104×) |
| JSON-LD `ratingValue` (aggregate) | ✅ einheitlich **4.5** (104 num + 8 string) |
| JSON-LD parsebar | ✅ 162 Blöcke, **0 Parse-Fehler** |
| `llms.txt` / `llms-full.txt` | ✅ `über 800` |

`aggregateRating` wurde **nicht** auf neue Seiten ausgerollt — nur die Datenquelle
(facts.ts statt JSON) geändert; die Menge der Seiten mit aggregateRating ist
identisch zum Vorzustand.

---

## 3. Follow-ups (NICHT aus facts.ts gespeist / offen)

### A. `aggregateRating` ohne sichtbar gerenderten Review-Block (PRE-EXISTING, GEO-Risiko)
Diese Seiten emittieren `aggregateRating` (via `<StructuredData type="restaurant">`,
Default `includeReviews`), rendern aber **keinen** `<GoogleReviews>`-Block:
`OktoberfestMuenchen`, `ValentinstagMuenchen`, `SilvesterMuenchen`,
`WeihnachtenMuenchen`, `WeihnachtsfeierMuenchen (breadcrumb-only?)`,
`FilmfestMuenchen` (bewusst `includeReviewList={false}`).
→ Google verlangt sichtbare Reviews für `aggregateRating`. Empfehlung: entweder
`<GoogleReviews compact />` ergänzen **oder** `includeReviews={false}` setzen.
Bewusst **nicht** angefasst (Scope „aggregateRating nicht ausrollen/entfernen"
ohne Kundenfreigabe; könnte gewollte Rich Snippets kosten).

### B. Statische Strings, die (noch) NICHT aus `facts.ts` gespeist werden
Aus diesen Werten wird der Fakt **hartkodiert** gepflegt (in Translation-/Content-
Dateien), inhaltlich aber jetzt konsistent mit `facts.ts`:
- **TLDR-/Trust-/Badge-Strings** in `src/translations/{de,en,it,fr}.ts`
  (Review-Zahl, Kapazitäten, NAP in Fließtext). Technisch nicht ohne größeren
  Refactor an `facts.ts` bindbar (reine Datenobjekte).
- **`ReisegruppenPage.tsx`** — hand-gebautes JSON-LD `aggregateRating`
  (`ratingValue: "4.5"`, `reviewCount: "810"`): Werte **korrekt/konsistent**, aber
  noch hardcoded (nicht via `FACTS`). Kandidat zum Nachziehen.
- **`google-reviews-*.json`** `summary`/`summaryLabel`: synchronisiert, aber es
  bleibt **Fetch-Datenquelle** — die Zahl-Synchronität hängt an
  `fetch-google-reviews.mjs` (dort ebenfalls gefixt).
- **`generate-llms-full.ts`** — nicht Teil der Build-Pipeline; `llms*.txt` werden
  manuell gepflegt.

### C. Kapazität 180 vs. 300 (Fakten-Widerspruch bleibt bestehen)
`facts.ts` kodiert die **Startseiten-Werte** (innen 100 / Terrasse 100 / 180 Steh
je Bereich). Abweichend stehen weiterhin **300 Steh / 200 Sitz gesamt** in:
- `src/config/storia-entity.ts` (`capacity.indoor.standing: 300`, `events.max: 300`)
- `src/config/seasonalMenus.ts` (FAQ: „Stehempfänge bis 300")
- `src/pages/seo/filmfestContent.ts` (mehrfach „bis 300 Gäste", „200 Sitzplätze gesamt")
- `src/translations/de.ts` (u. a. `faq11Answer`: „bis zu 300 Gäste beim Stehempfang";
  Hochzeits-TLDRs „6–300 Gäste")
→ **Bewusst nicht geändert** (kein Raten, CLAUDE.md-Faktenprüfung): unklar, ob 300
eine legitime Sonder-Kapazität (Filmfest/exklusiv) oder ein Fehler ist. **Kundenklärung
nötig**, dann zentral in `facts.ts` auflösen.

### D. Weihnachts-Menüpreis 45 € vs. 49 €
Wie beauftragt **nicht** vereinheitlicht — `TODO`-Kommentar in `facts.ts`.

---

## 4. Geänderte Dateien
`src/config/facts.ts` (neu), `src/components/StructuredData.tsx`,
`src/components/Footer.tsx`, `src/components/ValentineEmotionalSections.tsx`,
`src/pages/Catering.tsx`, `src/pages/UeberUns.tsx`,
`src/pages/seo/OktoberfestMuenchen.tsx`, `src/pages/seo/WmPublicViewingMuenchen.tsx`,
`src/pages/seo/wmContent.ts`, `src/pages/seo/wmSpiele.ts`,
`src/translations/{de,en,it,fr}.ts`, `src/data/google-reviews-{de,en,it,fr}.json`,
`scripts/fetch-google-reviews.mjs`, `public/llms.txt`, `public/llms-full.txt`.
