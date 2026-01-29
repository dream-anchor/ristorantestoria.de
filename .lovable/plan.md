

# Plan: Globale Verbesserung der Textlesbarkeit

## Uebersicht

Die Schriftgroesse und Lesbarkeit der Inhaltstexte wird auf der gesamten Webseite vereinheitlicht. Alle `text-sm` (14px) Beschreibungstexte werden auf `text-base` (16px) erhoeht, und alle `text-xs` (12px) werden auf `text-sm` (14px) angepasst.

## Betroffene Dateien und Aenderungen

### SEO Landingpages

| Datei | Aenderungen |
|-------|-------------|
| `src/pages/seo/LunchMuenchen.tsx` | 6 Stellen: Business Benefits (Z.197), Benefits Grid (Z.220), Lunch Offers (Z.255), Cross-Sell Cards (Z.302, 309) |
| `src/pages/seo/FirmenfeierMuenchen.tsx` | 2 Stellen: Benefits Grid (Z.182) |
| `src/pages/seo/WildEssenMuenchen.tsx` | 5+ Stellen: Wild dishes (Z.337), Features (Z.383), Season boxes (Z.422, 428) |
| `src/pages/seo/NeapolitanischePizza.tsx` | 4 Stellen: Pizza descriptions (Z.90, 94, 98, 102) |
| `src/pages/seo/RomantischesDinner.tsx` | Keine `text-sm` in Beschreibungen - bereits ok |
| `src/pages/seo/GeburtstagsfeierMuenchen.tsx` | Keine `text-sm` in Beschreibungen - bereits ok |
| `src/pages/seo/EventlocationMuenchen.tsx` | Keine `text-sm` in Beschreibungen - bereits ok |

### Hauptseiten

| Datei | Aenderungen |
|-------|-------------|
| `src/pages/Kontakt.tsx` | 1 Stelle: WhatsApp Hinweis (Z.137) `text-xs` → `text-sm` |

### Globale Komponenten

| Datei | Aenderungen |
|-------|-------------|
| `src/components/Footer.tsx` | Footer bleibt bei `text-sm` und `text-xs` (bewusst kompakter Stil fuer Footer, keine Aenderung) |

## Detaillierte Aenderungen

### 1. LunchMuenchen.tsx (6 Aenderungen)

```
Zeile 197: text-sm text-muted-foreground → text-muted-foreground
Zeile 220: text-sm text-muted-foreground → text-muted-foreground
Zeile 255: text-muted-foreground text-sm → text-muted-foreground
Zeile 302: text-muted-foreground text-sm → text-muted-foreground
Zeile 309: text-muted-foreground text-sm → text-muted-foreground
```

### 2. FirmenfeierMuenchen.tsx (1 Aenderung)

```
Zeile 182: text-sm text-muted-foreground → text-muted-foreground
```

### 3. WildEssenMuenchen.tsx (4 Aenderungen)

```
Zeile 337: text-muted-foreground text-sm → text-muted-foreground
Zeile 383: text-sm text-muted-foreground → text-muted-foreground
Zeile 422: text-muted-foreground text-sm → text-muted-foreground
Zeile 428: text-muted-foreground text-sm → text-muted-foreground
```

### 4. NeapolitanischePizza.tsx (4 Aenderungen)

```
Zeile 90: text-sm → text-base
Zeile 94: text-sm → text-base
Zeile 98: text-sm → text-base
Zeile 102: text-sm → text-base
```

### 5. Kontakt.tsx (1 Aenderung)

```
Zeile 137: text-xs text-muted-foreground/70 → text-sm text-muted-foreground/70
```

## Ausnahmen (keine Aenderung)

- **Footer.tsx**: Bewusst kompakter Stil mit `text-sm` und `text-xs` fuer Kontaktinfos und Legal Links - Fusszeilen sind traditionell kleiner
- **RomantischesDinner.tsx**, **GeburtstagsfeierMuenchen.tsx**, **EventlocationMuenchen.tsx**: Verwenden bereits Standard-Groesse fuer Beschreibungen
- **Badge-Texte** (z.B. "Beliebt", "Chefs Special"): Bleiben bei `text-xs` da diese bewusst klein und kompakt sein sollen
- **Kategorie-Labels** in WildEssenMuenchen (Z.331): Bleiben bei `text-xs` als Metadaten

## Ergebnis

Nach der Umsetzung:
- Alle Hauptbeschreibungstexte: **16px** (text-base)
- Sekundaere Hinweise: **14px** (text-sm)
- UI-Elemente und Badges: **12px** (text-xs) - unveraendert
- Footer: Kompakter Stil beibehalten

Die Aenderung betrifft **5 Dateien** mit insgesamt **16 Einzelaenderungen**.

