# SEO-Audit & Strategie – Oktoberfest-Landingpage

**Seite:** `/oktoberfest-muenchen/` (+ EN/IT/FR)
**Rolle:** Senior SEO Engineer
**Stand:** Juli 2026 · vor der Saison (Wiesn 19. Sept – 4. Okt 2026)

> Ziel dieser Seite: **frühzeitige Positionierung** für Suchbegriffe, die während der
> Wiesn-Zeit aktiv gesucht werden – lokal, international (Touristen) und über die
> „Italiener-in-München"-Autorität, **ohne** die Money-Keywords (Pizza/Italiener) zu
> kannibalisieren. Off-Season quasi kein Volumen, September-Peak sehr groß.

---

## 1. On-Page-Audit (Live-Stand vor den Fixes)

| Kriterium | Befund | Bewertung |
|-----------|--------|-----------|
| `<title>` | „Oktoberfest München – Italiener mit Wiesnbier & Brotzeit \| STORIA" (72 Z.) | ✅ enthält „München", ggf. leicht zu lang |
| `<meta description>` | **252 Zeichen** – wird von Google abgeschnitten | ❌ → auf ~155 gekürzt |
| H1 | 1× („Oktoberfest" + Fraktur-Serif-Zeile) | ✅ |
| H2 / H3 | 18 / 61 | ✅ gute Struktur |
| Wortzahl | ~2.537 Wörter | ✅ ausreichend Tiefe |
| Interne Links (ausgehend) | ~40 | ✅ |
| Interne Links (**eingehend**) | 0 crawlbare von starken Seiten | ❌ → Pillar-Karte ergänzt |
| Bilder | 5, alle mit `alt` | ✅ |
| hreflang | 5 (de/en/it/fr + x-default) | ✅ |
| Canonical | vorhanden, mit www + Trailing Slash | ✅ |
| JSON-LD | Restaurant + AggregateRating + Review×5 + Event + FAQPage | ✅ → **Menu/hasMenu ergänzt** |
| `og:image` | generisch `/og-image.jpg` | ⚠️ P2: themen­spezifisches OG-Bild |
| Section-Eyebrows | **hartkodiertes Deutsch** auf EN/IT/FR („Stimmung", „Für wen"…) | ❌ Lokalisierungs-Bug → gefixt |

### Umgesetzte Code-Fixes (P1)
1. **Meta-Description** in allen 4 Sprachen auf ~150–160 Zeichen gekürzt.
2. **Lokalisierungs-Bug behoben:** Section-Eyebrows + Partner-Strip nutzen jetzt
   Übersetzungs-Keys (`eyebrowStimmung`, `eyebrowFuerWen`, `eyebrowInDerNaehe`,
   `eyebrowZurWiesn`, `eyebrowStandort`, `partnerLabel`, `partnerNote`).
   „Bavarese" (Marken-/Konzeptbegriff) und „FAQ" bleiben bewusst sprachneutral.
3. **`Menu`-Schema (hasMenuSection/hasMenuItem/Offer)** aus den – im Admin editierbaren –
   Menü-Sektionen generiert; Preise werden numerisch geparst (`parsePrice`).
4. **Interne Verlinkung:** dauerhaft crawlbare Karte von der Pillar-Page
   „Besondere Anlässe" → Oktoberfest-Seite (ganzjährig sichtbar für frühe Indexierung).

---

## 2. Keyword-Strategie (DataForSEO, Google DE)

| Keyword | Volumen/Monat | Einordnung |
|---------|---------------|------------|
| oktoberfest 2026 | 27.100 | Informational, Portal-dominiert |
| oktoberfest munich (EN) | 4.400 (Sept-Peak 22.200) | **Touristen** – große Chance |
| italiener münchen | 9.900 | Money-KW (nicht kannibalisieren) |
| italienisches restaurant münchen | 4.400 | Money-KW |
| pizza münchen | 5.400 | Money-KW |
| oktoberfest restaurant münchen | ~0 | Nische – leicht zu gewinnen |
| wiesnbier | 320 | Nische, gut bedienbar |

**Fokus-Cluster der Seite (Long-Tail, geringe Konkurrenz, hohe Passung):**
- „oktoberfest beim italiener münchen", „wiesn vorglühen restaurant maxvorstadt"
- „restaurant nähe theresienwiese gruppen", „wiesnbier vom holzfass restaurant"
- EN: „restaurants near oktoberfest munich", „where to eat before oktoberfest"

**Nicht anfassen:** Head-Terms (oktoberfest 2026, pizza münchen) – dort chancenlos bzw.
Kannibalisierung. Die Seite gewinnt über Nische + lokale + internationale Long-Tails.

---

## 3. SERP-Landschaft

- **Head-Terms** (oktoberfest 2026 / munich): dominiert von Portalen, offiziellen
  Seiten, Zelt-Übersichten & Guides → als Restaurant nicht angreifbar.
- **„restaurants near oktoberfest"**: Listicles (TripAdvisor, Falstaff) → Ziel:
  in diese Listen aufgenommen werden + eigene Gruppen-/Vorglüh-Nische besetzen.
- **Gruppen / After-Wiesn**: Wettbewerber wie Wiesnclub → wir differenzieren über
  „deutsch-italienische Freundschaft / mittags & Vorglühen / Gruppen".
- **Größte Off-Page-Chance: WirtshausWiesn** – offizielles oktoberfest.de-Programm
  für 40+ Gastro-Betriebe. Aufnahme = starker thematischer Backlink + Sichtbarkeit.

---

## 4. Off-Page / Local (höchster ROI – Betreiber-Seite)

**P0 (Marketing/Betreiber, nicht code-seitig):**
1. **WirtshausWiesn-Registrierung** auf oktoberfest.de (offizielles Programm).
2. **Google Business Profile:** Beitrag/Angebot „Oktoberfest im STORIA" mit Link
   zur Seite, Fotos, Zeitraum; Q&A pflegen.
3. **Verzeichnisse & Guides:** Aufnahme in „Restaurants near Oktoberfest"-Listicles
   (TripAdvisor, Falstaff, lokale Blogs) proaktiv anfragen.
4. **Hotel-Partnerschaften:** die bereits gelisteten Hotels (ibis, Ruby, 25hours,
   Koenigshof…) als Empfehlungs-/Link-Quelle für Reisegruppen ansprechen.

Für diese Punkte liefert das Dev-Team fertige Texte; die Registrierung/Freigabe
erfolgt durch den Betreiber.

---

## 5. Technik / Core Web Vitals

- Prerendered (SSG), Hero mit `fetchPriority=high` + `loading=eager`, restliche
  Medien lazy → gute LCP-Basis.
- Selbstgehostete Fraktur-Font (`font-display:swap`) – kein Render-Blocking.
- Video `preload="none"` (Projekt-Regel eingehalten).
- **P2:** themen­spezifisches `og:image` (aktuell generisch), WebP-Hero bereits gesetzt.

---

## 6. Roadmap

| Prio | Maßnahme | Owner | Status |
|------|----------|-------|--------|
| P0 | WirtshausWiesn-Registrierung | Betreiber | offen |
| P0 | GBP-Beitrag „Oktoberfest im STORIA" | Betreiber | offen |
| P1 | Meta-Description kürzen (4 Sprachen) | Dev | ✅ |
| P1 | Eyebrow-Lokalisierungs-Bug (EN/IT/FR) | Dev | ✅ |
| P1 | Menu/hasMenu-Schema | Dev | ✅ |
| P1 | Interne Verlinkung Pillar → Oktoberfest | Dev | ✅ |
| P2 | Themenspezifisches OG-Bild | Dev | offen |
| P2 | Listicle-/Verzeichnis-Outreach | Betreiber | offen |
| P2 | Google-Indexierung aller 4 URLs einreichen | Dev/Betreiber | offen (Service-Account nötig) |
