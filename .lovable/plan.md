## Problem

Das Video erscheint als leere Box, weil `HomeVideo.tsx` die Datei über Lovable-CDN-Pfade einbindet (`/__l5e/assets-v1/...` aus den `.asset.json`-Pointern). Diese URLs existieren nur auf Lovable-Hosting. Die Live-Seite läuft auf IONOS (SFTP-Deploy von `dist/`), wo diese Pfade 404 liefern → kein Video, kein Poster.

Lösung: Video + Poster wie das bestehende `mamma-speranza-kueche-storia-muenchen.mp4` in `public/` legen (wird mit `dist/` deployed) und SEO/GEO-konform mit VideoObject-Schema einbetten.

## Schritte

1. **Video re-komprimieren & in `public/` ablegen**
   - Quelle `pizza-burrata.mp4` (4,8 MB) mit ffmpeg auf ~1 MB komprimieren (`-an -vf scale=1080:-2 -c:v libx264 -preset slow -crf 30 -movflags +faststart`).
   - Speichern unter SEO-konformem Dateinamen: `public/pizza-burrata-steinofen-storia-muenchen.mp4`.
   - Poster-Frame als `public/pizza-burrata-steinofen-storia-muenchen.jpg`.

2. **`HomeVideo.tsx` umbauen**
   - CDN-Asset-Imports entfernen, stattdessen absolute Public-Pfade (`/pizza-burrata-steinofen-storia-muenchen.mp4` + `.jpg`).
   - IntersectionObserver-Autoplay (stumm, Loop, `playsInline`, `preload="metadata"`) beibehalten.
   - SEO/GEO-Attribute: `<video>` mit `aria-label`, sichtbare `<figcaption>`/Heading mit lokalem Kontext (z.B. „Neapolitanische Pizza mit Burrata aus dem 400°C-Steinofen – STORIA München-Maxvorstadt"), `title`-Attribut.

3. **VideoObject-JSON-LD ergänzen (GEO/SEO)**
   - In `HomeVideo.tsx` via `Helmet` ein `VideoObject`-Schema einbinden: `name`, `description` (mit Standort München/Maxvorstadt), `thumbnailUrl` (absolute URL), `contentUrl` (absolute URL), `uploadDate`, `inLanguage: de-DE`, Verknüpfung zum Restaurant-`@id`.
   - Absolute URLs über `https://www.ristorantestoria.de` bauen (konsistent mit `SEO.tsx`).

4. **Aufräumen**
   - Alte Asset-Pointer löschen: `src/assets/pizza-burrata.mp4.asset.json`, `src/assets/pizza-burrata-poster.jpg.asset.json` (CDN-Assets via `delete_asset`).

## Technische Details

- Pre-Render-Regel beachten: `HomeVideo` bleibt eager import in `Index.tsx`, kein `lazy()`.
- `preload="metadata"` statt `none`, damit der Poster zuverlässig erscheint; Poster lädt sofort als sichtbares Standbild auch ohne Autoplay.
- VideoObject-`description` mit Geo-Keywords (München, Maxvorstadt, Königsplatz, Steinofen) für GEO-Sichtbarkeit.
- `.htaccess` braucht keine Anpassung (mp4 wird vom Server standardmäßig korrekt ausgeliefert, das bestehende Mamma-mp4 belegt das).
