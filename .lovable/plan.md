

# Plan: Verbesserte Lesbarkeit der Inhaltstexte

## Analyse des Problems

Die Aperitivo-Landingpage (und vermutlich auch andere SEO-Landingpages) verwenden durchgehend:
- `text-sm` (14px) für Beschreibungstexte - zu klein
- `text-muted-foreground` (hsl 25 10% 35%) - relativ heller Grauton
- Inter font-weight 400 (Regular) - kann auf Bildschirmen dünn wirken

Diese Kombination aus kleiner Schrift + heller Farbe + normalem Schriftgewicht führt zu schwer lesbarem Text.

## Loesung

Die Beschreibungstexte von `text-sm` (14px) auf `text-base` (16px) erhoehen und die Schriftstaerke leicht anpassen.

### Aenderungen in `src/pages/seo/AperitivoMuenchen.tsx`

Die folgenden Klassen werden angepasst:

| Stelle | Vorher | Nachher |
|--------|--------|---------|
| Drinks-Beschreibungen | `text-sm` | `text-base` |
| Card-Beschreibungen | `text-sm` | `text-base` |
| Origin/Herkunft-Texte | `text-xs` | `text-sm` |
| Feature-Beschreibungen | `text-sm` | `text-base` |
| Occasions-Beschreibungen | `text-sm` | `text-base` |
| Location-Listen | `text-sm` | `text-base` |
| FAQ-Antworten | Standard | `text-base` |

### Betroffene Bereiche (ca. 25 Stellen)

1. **Aperitivo Explained Cards** (Zeilen 279, 283, 287, 291): `text-sm` zu `text-base`
2. **Spritz Drinks** (Zeile 317): `text-sm` zu `text-base`, Zeile 318: `text-xs` zu `text-sm`
3. **Cocktails** (Zeilen 335-337): `text-sm` zu `text-base`, `text-xs` zu `text-sm`
4. **Wines** (Zeile 351): `text-sm` zu `text-base`
5. **Non-Alcoholic** (Zeile 367): `text-sm` zu `text-base`
6. **Why Features** (Zeile 415): `text-sm` zu `text-base`
7. **Occasions** (Zeile 432): `text-sm` zu `text-base`
8. **Location Cards** (Zeilen 450, 459, 469): `text-sm` zu `text-base`
9. **Related Content** (Zeilen in den Related-Cards): `text-sm` zu `text-base`

### Technische Umsetzung

Globaler Such-und-Ersetzen in der Komponente:
- `text-muted-foreground text-sm` zu `text-muted-foreground`
- `text-sm text-muted-foreground` zu `text-muted-foreground`
- Einzelne `text-xs` zu `text-sm` fuer sekundaere Infos (Herkunft, Origins)

### Ergebnis

- Haupttexte: 16px statt 14px (bessere Lesbarkeit)
- Sekundaere Texte: 14px statt 12px
- Beibehaltung der Farbhierarchie (`text-muted-foreground`)
- Keine Aenderung am Font-Weight (Inter Regular bleibt elegant)

