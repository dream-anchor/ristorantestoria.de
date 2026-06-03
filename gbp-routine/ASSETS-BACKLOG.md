# GBP Image Assets — Backlog für Domenico

## P0 — KI-Bilder deaktiviert (SOFORT-Ersatz nötig)

| Bild | Status | Warum P0 | Ersatz gesucht |
|---|---|---|---|
| `chefs.webp` | 🚫 deaktiviert | KI-generiert — bestätigt von Antoine | Echtes Foto: Domenico + Team in der Küche, Teig oder Pasta-Arbeit, kein gestelltes Portrait |
| `pasta.webp` | 🚫 deaktiviert | KI-generiert — bestätigt von Antoine (2026-05-09) | Echtes Pasta-Foto: handgemachte Pasta frisch gezogen oder auf dem Teller — kein Stock-Look, kein CGI |

**Warum kritisch:** `chefs.webp` hatte Tags `[team, handwerk]` und wurde von 5 Clustern genutzt (mamma_anekdoten, mimmo_kueche, personal_story u.a.). Ohne Ersatz verlieren diese Cluster ihren einzigen "team"-Bild-Fallback.

**pasta.webp** hatte Tags `[pasta, handwerk]`. Die 4 betroffenen Cluster (mimmo_kueche, pasta_handarbeit, steinofenpizza_muenchen, wild_kueche) haben je 5–14 weitere allyear-Bilder — kein Sofort-Blocker, aber Ersatz stärkt Bildvielfalt.

| Bild | Status | Warum P0 | Ersatz gesucht |
|---|---|---|---|
| `gaeste-terrasse-italiener-maxvorstadt-muenchen.webp` | 🚫 deaktiviert | Kein Brand-Match — wirkt nicht wie STORIA | Echte Abend-Szene auf der Terrasse: Gäste mit Wein/Aperitivo am Tisch, authentische Atmosphäre, abends, warm beleuchtet — kein Stock-Look |

**Nächster Schritt:** Domenico fragen ob aus Restaurant-Archiv (Handy, frühere Fotoshootings) echte Küchen- und Terrassen-Fotos vorhanden sind. Kein Profifoto nötig — authentisch > perfekt.

> Keine neue Fotoproduktion nötig. Bitte prüfe ob aus bestehendem Bestand (Handy, Restaurant-Archiv, Küchen-Shots) passende Fotos vorhanden sind.

## P1 — Starke Wiederholung (nur 1 Bild für diesen Cluster)

| Tag | Betroffener Cluster | Aktuelle Bilder | Was das Foto zeigen muss |
|---|---|---|---|
| `cilento` + `tradition` | `cilento_hintergrund` | `domenico-speranza.webp` (1×, immer dasselbe) | Mimmo oder Mamma bei der Arbeit — Teig formen, Zutaten aus dem Cilento, Olivenöl, frische Kräuter. Kein Portrait, kein gestelltes Lächeln. |

**Warum P1:** Der Cluster postet 1× pro Woche und hat nur dieses eine Bild. Nach 2 Wochen sieht jeder GBP-Nutzer dasselbe Foto zweimal.

---

## P2 — Fehlende Tags (kein Blocker, aber inhaltliche Lücke)

| Tag | Betroffene Cluster | Was das Foto zeigen muss |
|---|---|---|
| `truffel` | keiner direkt (würde `mimmo_kueche` + `wild_kueche` bereichern) | Tagliolini mit frisch gehobeltem Trüffel am Tisch, gerne mit Hobel sichtbar. |
| `mamma` | `mamma_anekdoten` (würde von echtem Mamma-Foto profitieren) | Mamma Speranza in der Küche oder beim Teig-Arbeiten — kein inszeniertes Portrait. |
| `familie` | `personal_story` (würde profitieren) | Mimmo, Nicola und Mamma gemeinsam — auch ein lockeres Foto aus dem Alltag ist besser als keins. |

**Warum P2:** Die Cluster laufen auch ohne diese Fotos, greifen dann auf `team`/`pasta`-Bilder zurück. Mit den Fotos wäre die Bildsprache authentischer.

---

## Format für neue Bilder

- **Format:** WebP (oder JPG/PNG — wir konvertieren)
- **Mindestgröße:** 800×600px (GBP empfiehlt 720px Breite)
- **Dateiname-Konvention:** `[beschreibung]-storia-muenchen.webp`
- **Ziel:** `public/gbp-images/` im Repo deployen, dann in `gbp_images` per `seed-images.ts` registrieren

---

*Zuletzt aktualisiert: 2026-05-09*
