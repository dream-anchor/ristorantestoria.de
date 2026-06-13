## Ziel
Das Hero-Bild auf `/terrasse-muenchen` (`src/assets/aussen.webp`) ist hinten rechts noch unscharf/pixelig. Komposition bleibt identisch, nur die Schärfe im Hintergrund wird verbessert.

## Umsetzung

1. **KI-Edit (gezielt nachschärfen)**
   - Basis: aktuelles `src/assets/aussen.webp` (896×1200).
   - `imagegen--edit_image`, Aspect Ratio `3:4`.
   - Prompt mit Fokus auf den hinteren rechten Bereich: schärfere Stühle, Tischkanten, Gläser, Sonnenschirme, Gebäudefassaden, Straße und Autos im Hintergrund — gleiche Komposition, gleiche Farben/Stimmung, keine neuen Objekte, fotorealistisch und tack-sharp.
   - Ausgabe als temporäres `src/assets/aussen-sharp.png`.

2. **Qualität prüfen**
   - Per `image_tools--zoom_image` in den hinteren rechten Bereich zoomen und Schärfe verifizieren.
   - Bei Bedarf Edit ein- bis zweimal mit angepasstem Prompt wiederholen.

3. **Einbinden**
   - PNG → WebP konvertieren (~90 Qualität).
   - `src/assets/aussen.webp` ersetzen (896×1200).
   - `src/assets/aussen-600w.webp` neu erzeugen (auf 600px Breite skaliert).
   - Temporäre Dateien (`aussen-sharp.png`) löschen.

4. **Verifizieren**
   - Preview auf `/terrasse-muenchen` öffnen, Hero-Screenshot, hinten rechts zoomen.
   - `npm run build` läuft automatisch (0 Errors erwartet).

## Hinweis
Keine Code-Änderungen in `TerrasseMuenchen.tsx` nötig — nur die Bild-Assets werden ersetzt; Imports, `srcSet`, `sizes` und Alt-Text bleiben unverändert.