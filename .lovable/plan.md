## Bessere Hero-Bilder für 4 SEO-Seiten

### Problem
Das aktuelle Hero `gaeste-terrasse-italiener-maxvorstadt-muenchen.webp` ist nur **640×640 px** und wird als Vollbild-Hero auf 4 Seiten ausgespielt → verpixelt. Auf dem Homepage-Grid bleibt es (klein/quadratisch) korrekt.

### Umsetzung

**1. Hochzeit (`/hochzeitsfeier-muenchen/`)**
- Basis: echtes Foto `ristorante-storia-uebersicht-stehtische-weissen-hussen.webp` (1400×1050, weiße Hussen).
- Per KI behutsam zu festlicher Hochzeitsstimmung veredelt (warmes Licht, dezente Blumendeko), Raum bleibt erkennbar real.
- Neues `hochzeitsfeier-storia-muenchen.webp` + `-600w.webp` in `src/assets/`, eingebunden mit hochzeitsspezifischem Alt-Text + Geo-Keywords.

**2. Italienisches Restaurant (`/italienisches-restaurant-muenchen`)**
- Hero → `ristorante-storia-uebersicht.webp` (1400×934).

**3. Italiener München (`/italiener-muenchen`)**
- Hero → `ristorante-storia-uebersicht-gaeste.webp` (1400×934).

**4. Italiener Hauptbahnhof (`/italiener-hauptbahnhof-muenchen`)**
- Hero → `italiener-koenigsplatz-terrasse-storia-muenchen.webp` (1400×612).

### Technisch
- Pro Seite `heroImage` / `heroImage600` Imports umstellen; `srcSet`/`sizes`/Struktur bleiben, Alt-Texte seitenspezifisch.
- Hochzeit: KI-veredeltes Bild erzeugen, als webp (Haupt + 600w) ablegen.
- `FilmfestMuenchen` (nur Galerie-Kachel) und Homepage-Grid bleiben unverändert.
- Verify: `npm run build` (0 Errors), Schärfe im Preview prüfen.