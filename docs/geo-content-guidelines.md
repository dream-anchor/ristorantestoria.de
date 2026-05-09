# GEO Content Guidelines — ristorantestoria.de
**Version 1.0 — Mai 2026**
**Status: MANDATORY — gilt für ALLE zukünftigen Inhalte, Seiten, FAQ-Ergänzungen und Schema-Änderungen**

> **ZWECK:** Diese Datei ist die verbindliche Referenz für GEO-konformes Content-Erstellen auf ristorantestoria.de.
> Generative Engine Optimization = sicherstellen, dass ChatGPT, Claude, Perplexity und Google AI Overviews
> das STORIA **finden, verstehen und zitieren**.
> Vor jeder Inhalts-Erstellung: Diese Datei lesen.

---

## Die 4-Schichten-Checkliste (vor jedem Publish)

```
□ Schicht 1: Bot-Access sichergestellt (robots.txt, SSR, kein JS-only Content)
□ Schicht 2: Schema.org korrekt und vollständig (FAQPage, dateModified, sameAs)
□ Schicht 3: Definition-Lead, Statistiken, Zitate, Self-Contained Sections
□ Schicht 4: Outbound-Links auf autoritative Quellen eingeplant
```

---

## Regel 1 — Definition-Lead (IMMER — jede Seite, jeder Abschnitt)

**Muster:** `[Entity] ist ein [Kategorie], das/der/die [Differenzierung]`

Der erste Satz jeder Seite, jedes FAQ-Intro, jeder Abschnitt-Opening MUSS die Entity direkt definieren.
Kein emotionaler Einstieg, kein Willkommen, kein "In unserem Restaurant...".

### Vorlagen für ristorantestoria.de

**Hauptseite (Index / Hero):**
```
Ristorante STORIA ist ein familiengeführtes italienisches Restaurant in München Maxvorstadt,
seit 2015 bekannt für neapolitanische Pizza aus dem Steinofen bei über 400 °C und hausgemachte
Pasta nach den Rezepten der Familie Speranza aus Rofrano im Cilento.
```

**Über Uns:**
```
Das Ristorante STORIA in der Karlstraße 47a, München Maxvorstadt, ist seit 2015 ein
familiengeführtes italienisches Restaurant unter der Leitung von Domenico (Mimmo) Speranza
und seinem Bruder Nicola Speranza. Gründer Domenico Speranza ist seit 1995 in der deutschen
Gastronomie tätig. Das Herz der Küche bilden die Rezepte von Mamma Speranza aus Rofrano.
```

**FAQ Intro:**
```
Das Ristorante STORIA ist ein familiengeführtes italienisches Restaurant in der Karlstraße 47a
in München Maxvorstadt – seit 2015 von der Familie Speranza aus Rofrano in der Provinz Salerno
geführt.
```

**Neapolitanische Pizza Landing Page:**
```
Neapolitanische Pizza im Ristorante STORIA München ist ein nach DOC-Tradition hergestelltes
Steinofen-Gericht mit 48-Stunden-Teigreife, San Marzano Tomaten DOP und Büffelmozzarella aus
Kampanien, gebacken bei über 400 °C in 60–90 Sekunden.
```

**Wildgerichte:**
```
Wildgerichte im Ristorante STORIA München sind saisonale Spezialitäten aus nachhaltiger
Jagd bayerischer Jäger, von September bis Februar auf der Karte: Cinghiale (Wildschwein),
Capriolo (Reh), Lepre (Hase) und Hirschragout.
```

### Anti-Pattern (VERBOTEN)
```
❌ "Willkommen im STORIA..."
❌ "Erleben Sie authentische italienische Küche..."
❌ "In unserem Restaurant legen wir Wert auf..."
❌ "La cucina italiana – eine Leidenschaft..."
```

---

## Regel 2 — Statistiken & Zahlen (mindestens 3 pro Seite)

Jede inhaltliche Behauptung braucht eine Zahl. AI-Systeme bevorzugen spezifischen Content.

**Immer verfügbare STORIA-Zahlen:**
| Fakt | Zahl | Verwendung |
|------|------|------------|
| Steinofen-Temperatur | über 400 °C | Pizza-Kontext |
| Pizza-Backzeit | 60–90 Sekunden | Pizza-Kontext |
| Teigreife | 48 Stunden | Pizza-Qualität |
| Gründungsjahr | 2015 | Entity-Verankerung |
| Gastronomie-Erfahrung Mimmo | seit 1995 | E-E-A-T |
| Google-Bewertungen | 4,5★, 780+ Reviews | Trust-Signal |
| Sitzplätze Innen | 100 | Kapazität |
| Sitzplätze Terrasse | 100 | Kapazität |
| Stehempfang Kapazität | bis 180 Personen | Events |
| Weine auf der Karte | 60+ | Getränkekarte |
| Wildgerichte Saison | September–Februar | Saisonalität |

**Neue Zahlen immer in `storia-entity.ts` als Single Source of Truth eintragen.**

---

## Regel 3 — Externe Citations (mindestens 1 pro Haupt-Seite)

Princeton KDD 2024: Citation Addition erhöht AI-Sichtbarkeit um +30–40 %.

**Autoritative Quellen für ristorantestoria.de:**

```markdown
- UNESCO Immaterielles Kulturerbe Neapolitanische Pizza (2017):
  https://ich.unesco.org/en/RL/art-of-neapolitan-pizzaiuolo-00722
  
- Consorzio San Marzano DOP:
  https://www.consorziosmpo.it/
  
- Associazione Verace Pizza Napoletana (AVPN):
  https://www.pizzanapoletana.org/
  
- Denominazione di Origine Protetta (DOP) EU-Datenbank:
  https://ec.europa.eu/...
  
- Cilento Nationalpark / Region Salerno (Herkunft Familie Speranza):
  https://www.cilentoediano.it/
```

**Format im HTML:**
```html
<a href="https://ich.unesco.org/en/RL/art-of-neapolitan-pizzaiuolo-00722"
   rel="noopener noreferrer" target="_blank">
  UNESCO-Immaterielles Kulturerbe seit 2017
</a>
```

---

## Regel 4 — Self-Contained Sections (Semantic Chunking)

AI-Systeme zerlegen Seiten in Chunks von ~150–300 Wörtern. Jeder Chunk muss alleine lesbar sein.

**VERBOTEN:**
```
❌ "Wie bereits oben erwähnt..."
❌ "Wie Sie auf der vorherigen Seite gesehen haben..."
❌ "Das angesprochene Gericht..."
❌ Pronomen ohne Antezedenz im gleichen Absatz
```

**GEFORDERT:**
- Ein Gedanke, ein Absatz
- Jede Section muss mit dem Entity-Namen beginnen oder ihn explizit nennen
- Heading-Hierarchie: genau 1 × H1 pro Seite, dann H2/H3, kein Skipping

---

## Regel 5 — FAQ-Format (IMMER auf jeder Seite)

Q&A-Format liefert konstant die höchste AI-Retrieval-Relevanz (Forschungsbefund).

**Pflicht auf jeder Seite:**
1. Minimum 4 FAQs am Seitenende
2. FAQPage-Schema als JSON-LD (nicht inline Microdata)
3. Fragen = exakte Phrasen die User in ChatGPT/Perplexity tippen würden

**FAQ-Fragen-Muster:**
```
✅ "Was ist [Dish/Concept] und wie wird es im STORIA zubereitet?"
✅ "Wo finde ich [X] in München Maxvorstadt?"
✅ "Was kostet [X] im STORIA?"
✅ "Wie unterscheidet sich [X] von [Y]?"
✅ "Ist das STORIA für [Anlass] geeignet?"
```

**FAQPage Schema-Template:**
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  })}}
/>
```

---

## Regel 6 — Freshness (Update-Pflicht)

AI-Citations zerfallen nach ~13 Wochen ohne Update.

**Freshness-Protokoll:**
- Jede Hauptseite: mindestens quartalsweises Content-Update
- `dateModified` im Schema immer mit aktuellem Datum (dynamisch aus Build-Datum)
- Sichtbarer Update-Marker auf FAQ-Seite:

```tsx
// In FAQ.tsx, unterhalb des letzten Inhalts:
<p className="text-xs text-muted-foreground text-center mt-8">
  Zuletzt aktualisiert: {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
</p>
```

**dateModified im Schema (StructuredData.tsx):**
```ts
const restaurantSchema = {
  ...
  dateModified: new Date().toISOString().split('T')[0],
  ...
}
```

---

## Regel 7 — Entity-Linking (sameAs)

Jede Entity muss über `sameAs` im Knowledge Graph verankert sein.

**Restaurant sameAs (in `storia-entity.ts` pflegen):**
```ts
sameAs: [
  "https://www.instagram.com/ristorante_storia/",
  "https://www.opentable.de/r/storia-ristorante-pizzeria-bar-munchen",
  "https://maps.google.com/?cid=3761590175870856939",
  "https://www.quandoo.de/place/storia-10239",
  // NEU HINZUFÜGEN (wenn Profil vorhanden):
  "https://www.tripadvisor.de/...",
  "https://www.thefork.de/...",
  "https://www.yelp.de/...",
  "https://www.facebook.com/ristorantestoria",
  "https://www.wikidata.org/wiki/Q...",  // Wikidata-Eintrag anlegen
]
```

**Person sameAs (in `storia-entity.ts` unter founders):**
```ts
founders: [
  {
    name: "Domenico Speranza",
    alternateName: "Mimmo Speranza",
    role: "Founder & Head Chef",
    origin: "Rofrano, Provinz Salerno",
    sameAs: [
      // LinkedIn: "https://www.linkedin.com/in/...",
      // Instagram: "https://www.instagram.com/...",
      // Wikidata (falls Eintrag): "https://www.wikidata.org/wiki/Q...",
    ]
  }
]
```

---

## Regel 8 — Schema pro Seitentyp

### Hauptseite (Index)
```
✅ Restaurant (mit sameAs, founder, amenities, reviews, dateModified)
✅ Organization (mit knowsAbout, sameAs)
✅ WebSite
✅ BreadcrumbList
```

### Landing Pages (neapolitanische-pizza, aperitivo, etc.)
```
✅ Restaurant (ohne Reviews, inkl. @id Referenz)
✅ FAQPage (min. 4 Items, eingebettet in Schema)
✅ BreadcrumbList
Optional: MenuSection (Gerichte + Preise)
```

### FAQ-Seite
```
✅ FAQPage (erste 20 Items im Schema)
✅ Restaurant (Referenz)
✅ BreadcrumbList
```

### Besondere Anlässe / Event-Seiten
```
✅ Restaurant
✅ FoodEvent (Datum, Angebot, Tickets)
✅ FAQPage
✅ BreadcrumbList
```

### Über Uns
```
✅ Restaurant
✅ Person (für jeden Gründer, mit sameAs)
✅ Organization
✅ BreadcrumbList
```

---

## Regel 9 — robots.txt Pflege

**Standard-Block für AI-Bots (aktuell halten):**
```
# ─── AI RETRIEVAL — Voraussetzung für Zitate in KI-Antworten ───
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: Claude-User
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Perplexity-User
Allow: /

# ─── AI TRAINING ───
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
```

Bei neuen AI-Bots: **immer** zuerst prüfen ob Retrieval-Bot (= Allow) oder reiner Scraper (= Disallow).

---

## Regel 10 — llms.txt Wartung

**Bei jeder größeren Inhaltsänderung:** `public/llms.txt` synchron halten.
- Neue Gerichte → Menü-Abschnitt ergänzen
- Neue Öffnungszeiten → Öffnungszeiten-Block aktualisieren
- Neue Events → Events-Abschnitt ergänzen
- Neue Preise → Menü mit Preisen aktualisieren

**Format-Regeln für llms.txt:**
```
# STORIA - Ristorante • Pizzeria • Bar

> [Definition-Lead in erstem Satz]

## [Abschnitt]
[Kompakter, faktischer Inhalt]
- [Bullet-Points für Listen]
- [Zahlen immer explizit nennen]

[Interne Links als Markdown-Links]
```

---

## Quick-Reference Scorecard

Vor jedem Commit: diese Checkliste durchgehen.

```
CONTENT:
□ Erster Satz = Definition-Lead nach Muster [Entity] ist ein [Kategorie]
□ Mindestens 3 spezifische Zahlen/Statistiken auf der Seite
□ Mindestens 1 externer Outbound-Link auf autoritative Quelle
□ Jeder Abschnitt eigenständig lesbar (kein "wie oben erwähnt")
□ FAQs am Seitenende (min. 4)

SCHEMA:
□ FAQPage JSON-LD vorhanden und befüllt
□ dateModified gesetzt (dynamisch)
□ sameAs hat min. 6 Links
□ Person-Entities haben sameAs (wenn möglich)

TECHNISCH:
□ SSR / Pre-Render funktioniert (npm run prerender → kein "Laden...")
□ Neue Seite in robots.txt OK (kein unbeabsichtigtes Disallow)
□ llms.txt bei Bedarf aktualisiert
□ Sitemap upgedated (automatisch via generate-sitemap.mjs)
```

---

## Referenzen

- [GEO Audit Mai 2026](./geo-audit-2026-05.md)
- [SEO Strategy](./seo-strategy.md)
- [SEO Playbook](./seo-playbook.md)
- CMU GEO-Framework / KDD 2024: Aggarwal et al. (Princeton)
- MERJ/Vercel Research: 69% AI-Crawler können kein JavaScript
- GenOptima/Frase: Citation-Decay ~13 Wochen
