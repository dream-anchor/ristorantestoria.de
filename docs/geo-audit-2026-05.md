# GEO Audit — ristorantestoria.de
**Stand:** Mai 2026 | **Auditor:** Claude Code (Senior GEO Role)
**Referenz:** [geo-content-guidelines.md](./geo-content-guidelines.md)

---

## Executive Summary

| Schicht | Score | Kritischstes Problem |
|---------|-------|---------------------|
| **1 – Crawl Access** | 🟡 7/10 | robots.txt: OAI-SearchBot + Claude-SearchBot fehlen; Claude-Web statt Claude-User |
| **2 – Maschinenstruktur** | 🔴 4/10 | Person sameAs fehlt, kein knowsAbout, kein @graph, kein dateModified |
| **3 – Zitierfähiger Content** | 🟡 6/10 | Kein Freshness-Header, keine externen Quellen/Zitate, Definition-Lead nur auf Über-Uns stark |
| **4 – Off-Page Authority** | 🔴 3/10 | Keine Wikipedia-Einträge, keine lokalen Blog-Mentions, keine Earned Media |
| **Gesamt** | 🟡 **50 %** | Gute Basis, kritische Lücken in Schema-Tiefe und Off-Page |

---

## Schicht 1 — Crawl Access

### robots.txt ✅ PASS (mit Lücken)

**Datei:** `public/robots.txt`

| Bot | Typ | Status |
|-----|-----|--------|
| GPTBot | Training | ✅ Allow |
| Google-Extended | Training | ✅ Allow |
| ClaudeBot | Training | ✅ Allow |
| ChatGPT-User | Retrieval | ✅ Allow |
| PerplexityBot | Retrieval | ✅ Allow |
| Claude-Web | Retrieval | ⚠️ Allow — aber **veraltet**: richtig wäre `Claude-User` |
| **OAI-SearchBot** | Retrieval | ❌ **FEHLT** — das ist der primäre OpenAI-Such-Bot |
| **Claude-SearchBot** | Retrieval | ❌ **FEHLT** |
| CCBot | Training | ⚠️ Allow — GEO-Guide empfiehlt Disallow; für Restaurant irrelevant |
| Bytespider, Ai2Bot | Scraper | ✅ Disallow |
| Sitemap-URL | — | ✅ Vorhanden |

**Fix (robots.txt, Section AI-Assistenten):**
```
User-agent: OAI-SearchBot
Allow: /
User-agent: Claude-User
Allow: /
User-agent: Claude-SearchBot
Allow: /
```
Claude-Web durch Claude-User ersetzen oder beide eintragen.

### SSR / JavaScript-Rendering ✅ PASS

154 Routen vollständig pre-rendered via `prerender.js`. Kein client-only Content. AI-Crawler sehen vollständiges HTML ohne JS-Ausführung.

### llms.txt ✅ PASS

**Datei:** `public/llms.txt` — vorhanden und gut strukturiert:
- Definition-Lead im ersten Absatz: ✅ `STORIA ist ein authentisches italienisches Restaurant im Herzen von München...`
- Kontakt / Öffnungszeiten / Menü komplett: ✅
- Famiglia Speranza Bio: ✅ (Mimmo, Nicola, Mamma)
- Zahlen: ✅ 4,5 Sterne, 780+ Bewertungen, 400°C, 48–72h Teigreife
- Interne Links vollständig: ✅

**Lücken in llms.txt:**
- Kein `llms-full.txt` (flat Markdown aller Seiten)
- EN-Version ist `llm-en.html` — sollte auch `llms-en.txt` sein (Markdown-Standard)
- Keine direkten Wikipedia/Wikidata-Links für Entities

### Cloudflare Bot Fight Mode

**Status:** ⚠️ Ungeprüft — Site deployed via GitHub → SFTP IONOS, kein Cloudflare CDN auf dem Haupt-Traffic-Pfad. Falls Cloudflare Proxy irgendwo aktiv ist, prüfen. Wahrscheinlich kein Problem.

---

## Schicht 2 — Maschinenlesbare Struktur

### Schema-Stack-Übersicht

**Datei:** `src/components/StructuredData.tsx`, `src/config/storia-entity.ts`

| Schema-Typ | Status | Details |
|-----------|--------|---------|
| Restaurant | ✅ | Vollständig: hours, geo, cuisine, amenities, reviews, parking |
| WebSite | ✅ | Name, URL, Publisher |
| Organization | ✅ (unvollständig) | sameAs vorhanden, aber nur 4 Links |
| BreadcrumbList | ✅ | Dynamisch pro Seite |
| FAQPage | ✅ | FAQ-Seite + alle Landing Pages |
| FoodEvent | ✅ | Conditional für Sondermenüs |
| **Person (sameAs)** | ❌ | Gründer haben KEIN sameAs — keine Wikipedia/Wikidata/LinkedIn-Links |
| **knowsAbout** | ❌ | Fehlt auf Organization |
| **dateModified** | ❌ | Fehlt überall — kein Freshness-Signal im Schema |
| **@graph** | ❌ | Schema-Blöcke fragmentiert statt vernetzt |

### sameAs — kritische Lücke

**Aktuell in `storia-entity.ts`:**
```js
sameAs: [
  "https://www.instagram.com/ristorante_storia/",
  "https://www.opentable.de/r/storia-ristorante-pizzeria-bar-munchen",
  "https://maps.google.com/?cid=3761590175870856939",
  "https://www.quandoo.de/place/storia-10239",
]
```
4 Links. Ziel: **8–10 Links** für solide Entity-Verknüpfung.

**Fehlende High-Value sameAs:**
- TripAdvisor-Seite (wenn vorhanden)
- TheFork / The Fork Deutschland
- Yelp München (wenn vorhanden)
- Facebook-Seite (wenn aktiv)
- Wikidata-Eintrag (neu anlegen falls nicht vorhanden)
- Lokale München-Verzeichnisse (muenchen.de, bavariafood.de)

### Person-Entities — kritischste Lücke

**Aktuell in `StructuredData.tsx:63-68`:**
```js
founder: STORIA.founders.map(f => ({
  '@type': 'Person',
  name: f.name,
  alternateName: f.alternateName,
  jobTitle: f.role,
}))
```

**Fehlt:** `sameAs` für Personen. LLMs identifizieren Personen über ihre Knowledge-Graph-ID. Ohne sameAs → Entity-Splitting → keine Authority.

**Sofortmaßnahme:**
```js
founder: STORIA.founders.map(f => ({
  '@type': 'Person',
  name: f.name,
  jobTitle: f.role,
  birthPlace: { '@type': 'Place', name: 'Rofrano, Provinz Salerno' },
  sameAs: f.sameAs ?? [],  // In storia-entity.ts befüllen
}))
```

Für `storia-entity.ts` — `founders`-Array erweitern:
```ts
founders: [
  {
    name: "Domenico Speranza",
    alternateName: "Mimmo Speranza",
    role: "Founder & Head Chef",
    origin: "Rofrano, Provinz Salerno",
    sameAs: [
      // LinkedIn-Profil URL (wenn vorhanden)
      // Instagram-Profil (wenn vorhanden)
    ]
  },
  ...
]
```

### knowsAbout — fehlt

**Empfehlung für Organization-Schema:**
```js
knowsAbout: [
  "Neapolitanische Pizza",
  "Cucina del Cilento",
  "Hausgemachte Pasta",
  "Süditalienische Küche",
  "Weinberatung – Italienische Weine",
  "Eventcatering München",
  "Steinofenpizza",
  "48-Stunden-Teigführung",
]
```

### dateModified — fehlt

Kein `dateModified`-Feld auf Restaurant-, Organization- oder Seitenebene. AI-Modelle depriorisieren Content ohne Freshness-Signal. Citation-Decay tritt nach ca. 13 Wochen ein.

**Fix in `StructuredData.tsx`:**
```js
const restaurantSchema = {
  ...
  dateModified: new Date().toISOString().split('T')[0], // '2026-05-09'
  ...
}
```

Oder besser: `lastBuildDate` aus der Build-Pipeline injizieren.

---

## Schicht 3 — Zitierfähiger Content

### Definition-Lead-Analyse

| Seite | Status | Erster Satz |
|-------|--------|-------------|
| `UeberUns.tsx` | ✅ PASS | "Das STORIA in der Münchner Maxvorstadt... ist ein seit 2015 von der Familie Speranza geführtes italienisches Restaurant." |
| `llms.txt` | ✅ PASS | "STORIA ist ein authentisches italienisches Restaurant im Herzen von München..." |
| `FAQ.tsx introContext` | ✅ PASS | "Das Ristorante STORIA ist ein familiengeführtes italienisches Restaurant in der Karlstraße 47a..." |
| `Index.tsx Hero` | ⚠️ PARTIAL | Kein klarer Definition-Lead, narrative/emotionale Sprache |
| SEO Landing Pages | ⚠️ PARTIAL | Haben Intros, aber nicht strikt nach Muster `[Entity] ist ein [Kategorie]` |

**Muster das fehlt auf Index:**
Aktuell: *"La cucina italiana..."* (emotionaler Einstieg)
Soll: *"Ristorante STORIA ist ein familiengeführtes italienisches Restaurant in München Maxvorstadt, seit 2015 bekannt für neapolitanische Pizza aus dem Steinofen und hausgemachte Pasta nach Rezepten der Familie Speranza aus dem Cilento."*

### Statistiken im Content ✅ PASS

Sehr gut — spezifische Zahlen vorhanden:
- 400 °C Steinofen-Temperatur
- 48h Teig-Fermentation (llms.txt: 48–72h)
- 4,5 Sterne bei 780+ Google-Bewertungen
- 100 + 100 Sitzplätze (Innen + Terrasse)
- 60+ italienische Weine
- Seit 2015 (Gründungsjahr)
- 1995 (Mimmo Speranzas erster Tag in der deutschen Gastronomie)

### Externe Zitate / Citations ❌ FAIL

**Kein einziger externer Outbound-Link** in Seitentext auf autoritative Quellen. GEO-Studie (Princeton KDD 2024): Citation Addition = +30–40 % AI-Sichtbarkeit.

**Was fehlt:**
- Kein Link auf Neapolitan Pizza UNESCO-Seite
- Kein Link auf San Marzano DOP-Beschreibung
- Kein Link auf München-Restaurantführer-Erwähnung
- Keine Pressestimmen verlinkt

**Sofort umsetzbar:** 2–3 Zitate auf stark autoritären Quellen in `UeberUns.tsx` und in der FAQ-Seite ergänzen:
> *"Neapolitanische Pizza ist seit 2017 UNESCO-Immaterielles Kulturerbe ([UNESCO](https://ich.unesco.org/...))."*

### Freshness-Signale ❌ FAIL

- Kein sichtbarer "Zuletzt aktualisiert"-Header auf Seiten
- Kein `dateModified` im Schema (siehe Schicht 2)
- Kein Versions-Block in Page-Content

**Fix:** Minimaler Update-Marker im Footer oder in der FAQ-Seite:
```tsx
<p className="text-xs text-muted-foreground">
  Zuletzt aktualisiert: {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
</p>
```

### Semantic Chunking / Self-Contained Sections ✅ PASS

- Keine "wie oben erwähnt"-Verweise gefunden
- Jede FAQ-Antwort vollständig und standalone
- H2/H3-Hierarchie sauber

### FAQPage-Schema-Abdeckung ✅ PASS

- `/faq` — FAQPage mit 20 schema-eligible Items (erste 20 der 60+ Items)
- Alle geprüften Landing Pages (NeapolitanischePizza, Aperitivo, Hochzeitsfeier) — FAQPage vorhanden

---

## Schicht 4 — Off-Page Authority

### Wikipedia ❌ FEHLT

- Kein Wikipedia-Eintrag für "Ristorante STORIA" nachweisbar
- Kein Wikipedia-Eintrag für "Domenico Speranza" (Gastronom)
- ChatGPT zitiert Wikipedia für 29,74 % aller Faktenfragen → kritischster Off-Page-Hebel

**Handlungsempfehlung:**
1. Wikidata-Eintrag anlegen (Q-Nummer) für das Restaurant
2. Wikipedia-Artikel (de.wikipedia.org) — Voraussetzung: externe Quellen die über das STORIA berichten

### Lokale Earned Media ⚠️ UNKLAR

- Münchner Stadtmagazin / TZ München / Süddeutsche: Erwähnungen unbekannt
- München-Foodblogs: Unbekannt
- Google-News-Coverage: Nicht geprüft

**Empfehlung:** Einmalige Recherche: Wer hat über das STORIA berichtet? Alle Erwähnungen sammeln → sameAs-Kandidaten prüfen → Outreach für aktive Links.

### Aggregatoren & Branchenverzeichnisse

| Plattform | Status |
|-----------|--------|
| Google Maps | ✅ 4,5★, 780+ Reviews, sameAs vorhanden |
| OpenTable | ✅ sameAs vorhanden |
| Quandoo | ✅ sameAs vorhanden |
| TripAdvisor | ⚠️ Profil existiert? sameAs fehlt |
| TheFork | ⚠️ Profil? sameAs fehlt |
| Yelp | ⚠️ Unbekannt |
| Michelin Guide | ⚠️ Gelistet? |

---

## Priorisierte Sofortmaßnahmen

### Quick Wins (< 1 Stunde)

1. **robots.txt** — OAI-SearchBot + Claude-SearchBot + Claude-User hinzufügen, Claude-Web ersetzen
2. **sameAs Restaurant** — TripAdvisor, TheFork, Yelp, Facebook ergänzen (in `storia-entity.ts`)
3. **dateModified** — Dynamisch in `StructuredData.tsx` ergänzen (3 Zeilen)
4. **knowsAbout** — Array in Organization-Schema ergänzen (10 Begriffe)

### Mittelfristig (< 1 Woche)

5. **Person sameAs** — Gründer mit LinkedIn + ggf. weiteren Profilen verlinken
6. **Definition-Lead auf Index.tsx** — Ersten Textblock nach dem Muster anpassen
7. **2–3 externe Citations** — auf UeberUns und FAQ einbauen (UNESCO Pizza, San Marzano DOP, etc.)
8. **Freshness-Header** — Sichtbares "Zuletzt aktualisiert" auf FAQ-Seite und Über-Uns

### Langfristig (Ongoing)

9. **Wikidata-Eintrag** für STORIA anlegen
10. **Earned-Media-Outreach** — Münchner Foodblogs, Stadtmagazine
11. **GEO-Tracking** — 20 Test-Prompts definieren, wöchentlich gegen ChatGPT/Claude/Perplexity prüfen (pixel.db → neuer Skill `geo-monitor`)
12. **@graph-Consolidation** — Alle Schema-Blöcke in einen @graph zusammenführen
13. **llms-full.txt** — Flat-Markdown aller Hauptseiten erstellen

---

## GEO-Score Timeline

| Schicht | Jetzt | Nach Quick Wins | Nach Komplett |
|---------|-------|-----------------|---------------|
| Crawl Access | 7/10 | 9/10 | 9/10 |
| Maschinenstruktur | 4/10 | 6/10 | 9/10 |
| Content | 6/10 | 7/10 | 9/10 |
| Off-Page | 3/10 | 4/10 | 7/10 |
| **Gesamt** | **50 %** | **65 %** | **85 %** |
