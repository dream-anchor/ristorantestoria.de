## Ziel

Das Video `pizza-burrata.mp4` auf der Startseite **direkt nach dem Bild-Grid** (vor dem "Willkommen im STORIA"-Block) einbinden — komprimiert und SEO-/performance-konform.

## Komprimierung

Das Original ist 1280×720, 10 s, 4,8 MB (3,85 Mbps). Das lässt sich deutlich verkleinern:

- Re-Encode mit ffmpeg: H.264, CRF ~26–28, `-preset slow`, Auflösung 1280×720 beibehalten.
- Audio entfernen (`-an`) — das Video wird stumm als Loop abgespielt, spart zusätzlich.
- Zusätzlich ein Poster-Standbild (JPG, 1. Frame) für `preload="none"`.
- Erwartete Größe: ca. **0,8–1,2 MB** (statt 4,8 MB).

Ablage über Lovable Assets (kein Binär-Blob im Repo): `src/assets/pizza-burrata.mp4.asset.json` + Poster-Asset.

## Einbau

Neue Komponente `src/components/HomeVideo.tsx`:

- `<section>` im gleichen Stil wie die anderen Home-Sektionen (`container mx-auto px-4`, abgerundete Ecken, dezenter Schatten passend zum warmen Design).
- `<video>` mit `autoPlay muted loop playsInline`, `preload="none"`, `poster={…}`, abgerundet, max. Breite analog Grid.
- Stummschaltung → Autoplay erlaubt; barrierearm, kein Ton-Überfall.

In `src/pages/Index.tsx` zwischen `<ImageGrid />` und `<HomeIntro />` einsetzen:

```text
<ImageGrid />
<HomeVideo />   ← neu
<HomeIntro />
```

## Technische Details

- Pre-Render-Regel: KEIN `lazy()` — `HomeVideo` als eager import in `Index.tsx`.
- `preload="none"` gemäß SEO-Content-Regeln, damit das Video die Ladezeit nicht belastet.
- Video stumm + Loop, damit es ohne Ton automatisch startet (Browser-Autoplay-Policy).
- Assets via `lovable-assets create` aus dem komprimierten File, Import der `.asset.json` und Nutzung von `.url`.

## Offen

Ich gehe von **Autoplay stumm im Loop** (wie ein lebendiger Hintergrund-Clip) aus. Falls du stattdessen ein klickbares Video mit Ton möchtest, sag kurz Bescheid — dann passe ich es an.