# KONZEPT — SEO/GEO-Fixes nach GSC-Export vom 01.09.2026

## Ausgangslage

Vollständiger GSC-Export vom 01.09.2026 (30 Dateien,
`~/Downloads/01_DOCUMENTS/SEO/ristorantestoria.de/2026-09/2026-09-01_01/`), ausgewertet und mit dem
Code abgeglichen (Details je Abschnitt unten). Kernbefund: keine der Structured-Data-Fehlermeldungen
ist geschäftskritisch (alle „nicht kritisch" markiert), aber zwei ranking-starke Lead-Seiten
(`kontakt/`, `reservierung/`) verlieren durch schwache Snippets massiv Klicks, und ein Rest an toten
Locale-Kombinationen/Duplikaten bremst die Indexierung von 26 Seiten.

**Ziel dieses Loops:** mehr physische Restaurantbesuche + mehr Leads für Event/Catering — gemessen an
der Leistung-Baseline vom Export (4.603 Klicks / 184.973 Impressionen über 92 Tage, 2026-05-30 bis
2026-08-29, Ø CTR 2,49%, Ø Position 10,60). Fokus auf die beiden Hebel mit direktem Lead-Bezug:
CTR auf `kontakt/`/`reservierung/` und Indexierung liegengebliebener Seiten.

## Scope

Sechs Blöcke, in dieser Reihenfolge (Abhängigkeiten beachten):

1. **P0 — Structured-Data-Bugfixes** (Video-`uploadDate`, Event-`performer`) — reine Bugfixes
2. **P1 — CTR-Killer auf Top-Rankings** (`kontakt/`, `reservierung/`, `mittags-menu/`, `en/food-menu/`)
3. **P2 — Tote Locale-Kombinationen + Duplikate** (Redirects in `public/.htaccess`)
4. **P3 — Interne Verlinkung stärken** (Grundlage für schnellere Indexierung von P2/P5)
5. **P4 — GEO-Content-Ausbau** (kein Bugfix — Analyse/Vorschlag als Deliverable, Freigabe nötig)
6. **P5 — Indexierung anstoßen** (erst NACHDEM P2/P3 deployed sind, analog zum events-storia.de-Vorbild)

Nicht in diesem Loop: GSC-Revalidierung für „Umleitungsfehler" (2 URLs, `reisegruppen/` +
`en/oktoberfest-munich/` — live per `curl -IL` bereits sauberer Single-Hop-301→200, vermutlich
veralteter Crawl-Snapshot; das ist eine externe GSC-UI-Aktion ohne Code, kein Loop-Kriterium).
HTTPS, Navigationspfade, Rezensions-Snippets, Links (Backlinks) und die 4 „Ereignisse"-Feldfehler
`offers`/`highPrice`/`validFrom` haben laut Export **0 betroffene URLs** — nicht Teil dieses Loops.

---

## P0 — Structured-Data-Bugfixes (verifiziert 01.09.2026)

### P0.1 — Video: „Ungültiger Datum/Uhrzeit-Wert" + „Zeitzone fehlt" (8 von 12 Video-Meldungen)

Betroffen: `/`, `/en/`, `/fr/`, `/it/` (identische Komponente auf allen 4 Sprach-Homepages).

**Ursache:** `src/components/HomeVideo.tsx:42` — `uploadDate: "2026-06-05"`. Reines Datum ohne
Uhrzeit/Zeitzonen-Offset; Google verlangt für `VideoObject.uploadDate` einen vollständigen
ISO-8601-Zeitstempel mit Offset.

**Fix:** `uploadDate: "2026-06-05T18:00:00+02:00"` (oder tatsächliches Upload-Datum/-Uhrzeit, falls
bekannt — sonst plausible Uhrzeit + Sommerzeit-Offset für München).

Der dritte Video-Fehlertyp („nicht auf Wiedergabeseite") ist architektonisch getrennt — die
Homepage ist keine dedizierte Video-Watchpage. **Kein Fix in diesem Loop** (bräuchte eine eigene
Landingpage fürs Video, kein reiner Bugfix, nicht kritisch laut Google-Validierung).

### P0.2 — Event: „performer fehlt" (3 URLs)

Betroffen: `/besondere-anlaesse/valentinstag-menue/`, `/besondere-anlaesse/silvester/`,
`/fr/occasions-speciales/nouvel-an/`.

**Ursache:** `src/pages/seo/SilvesterMuenchen.tsx:168-183` und
`src/pages/seo/ValentinstagMuenchen.tsx:166-179` — beide Event-JSON-LD-Blöcke haben `offers` und
`validFrom` bereits korrekt gesetzt, aber kein `performer`-Feld. Gerendert wird der Block nur ohne
`standalone`-Prop (`src/pages/BesondererAnlass.tsx:127`/`:137`).

**Fix:** `performer`-Feld ergänzen (z. B. `{"@type": "Restaurant", "name": "Ristorante STORIA"}` —
bei einem Menü-Event ohne externen Act ist das Restaurant selbst der naheliegende Wert, keine neue
Geschäftsentscheidung). **Schweregrad niedrig** — `performer` ist bei Google ein empfohlenes, kein
Pflichtfeld, blockiert keine Rich-Result-Eligibility.

---

## P1 — CTR-Killer auf Top-Rankings (höchster Lead-Hebel)

Aus der Leistungs-Baseline (92 Tage, 2026-05-30–2026-08-29), sortiert nach Relevanz für das
Lead-Ziel:

| Seite | Impr. | Klicks | CTR | Position |
|---|---|---|---|---|
| `kontakt/` | 4.219 | 14 | **0,33%** | **3,56** |
| `reservierung/` | 4.622 | 24 | **0,52%** | **3,72** |
| `mittags-menu/` | 5.084 | 42 | 0,83% | 4,62 |
| `en/food-menu/` | 3.352 | 30 | 0,89% | 4,65 |

`kontakt/` und `reservierung/` ranken im Top-3-Bereich (erwartbare CTR 15–25%), erzielen aber unter
1% — reine Snippet-Ursache (Title/Meta-Description), kein struktureller Rankingfehler. Das ist der
stärkste identifizierte Hebel für „mehr Leads", weil beide Seiten der direkte Conversion-Punkt sind.

**Ansatzpunkte:** `src/pages/Kontakt.tsx`, `src/pages/Reservierung.tsx`, `src/pages/MittagsMenu.tsx`
(bzw. deren EN-Pendant) — jeweils `<SEO title=... description=...>`-Aufruf oder die zugehörigen
`t.seo.*`-Strings in den Translation-Dateien prüfen (Muster wie in events-storia.de:
`src/translations/{de,en}.ts`, hier ggf. gleich strukturiert — vor dem Fix verifizieren).

**Fix-Richtung:** klickstärkere Title/Description mit klarem Klick-Anreiz (Öffnungszeiten,
Sofort-Reservierung, „jetzt anrufen"/„jetzt buchen"), Längenlimit beachten (<60 Zeichen Title,
<160 Zeichen Description), keine Trunkierung.

---

## P2 — Tote Locale-Kombinationen + Duplikate

26 URLs „Gecrawlt – zurzeit nicht indexiert" (Validierung bereits **fehlgeschlagen** — war schon
einmal Ziel eines Fixversuchs), 6 URLs 404, 5 URLs „durch noindex ausgeschlossen".

### P2.1 — Tote Locale-Kombinationen (404, live per `curl` verifiziert)

`it/besondere-anlaesse/valentinstag-menue/`, `it/besondere-anlaesse/silvester/`,
`en/special-occasions/oktoberfest-menue/`, `en/special-occasions/valentines-day-menu/`,
`en/besondere-anlaesse/valentinstag-menue/`, `en/besondere-anlaesse/silvester/`.

**Ursache:** `src/App.tsx` `generateRoutes()` (Zeilen 162–199) erzeugt nur die korrekten
Locale-Kombinationen aus `slugs.json` (en→`special-occasions`, it→`occasioni-speciali`,
fr→`occasions-speciales`). Für die falsche Kombination „deutscher Parent-Pfad + fremde Sprache"
bzw. veraltete Kind-Slugs existiert **kein 301-Redirect** in `public/.htaccess`.

**Fix:** Redirects nach dem Bestandsmuster „Legacy URL Redirects" in `public/.htaccess` (ab Zeile 55)
ergänzen — Ziel jeweils die korrekte aktuelle Locale-Kombination aus `slugs.json` (z. B.
`it/besondere-anlaesse/silvester/` → `it/occasioni-speciali/capodanno/`, exakten Ziel-Slug vorher
mit `slugs.json` gegenprüfen, nicht raten).

### P2.2 — www/Trailing-Slash-Dubletten (Teil der 26er-„Gecrawlt-nicht-indexiert"-Liste)

`italiener-hauptbahnhof-muenchen` (ohne Slash), `it/catering` (ohne Slash),
`ristorantestoria.de/geburtstagsfeier-muenchen` + `/aperitivo-muenchen` (ohne www, ohne Slash),
`/faq` (ohne Slash).

**Ursache:** laut `CLAUDE.md` § „SEO URL-Architektur" ist die Canonical-Form „mit www, trailing
slash IMMER" — diese Varianten sind Crawl-Reste ohne aktiven 301 auf die kanonische Form.

**Fix:** prüfen, ob die generische www+Trailing-Slash-Regel in `public/.htaccess` (Zeile 27/31)
diese Fälle bereits behandelt oder ob eine Lücke besteht (z. B. weil `italiener-hauptbahnhof-muenchen`
ohne Slash nicht durch die allgemeine Regel erfasst wird) — Ursache erst per `curl -IL` auf jede der
5 URLs verifizieren, dann gezielt nachziehen.

### P2.3 — CMS-Altlasten

`/cms/wp-content/uploads/*.pdf` (3 alte Mittagskarten), `/cms/speisekarte-2/`, `/cms/?page_id=2881`,
`/admin/`, `http://www.ristorantestoria.de/?page_id=1753` (Teil der 26er-Liste).

**Prüfen:** ob die bestehenden „WordPress Query-String Redirects" (`public/.htaccess` Zeile 38–52)
diese Pfade bereits abdecken. `?page_id=2881` fehlt vermutlich als expliziter Fall (nur `page_id=1753`
im Auszug sichtbar) — Bestandsregeln durchsehen, fehlenden Fall ergänzen oder generische Regel
prüfen, ob sie greift.

---

## P3 — Interne Verlinkung stärken

Aus der Links-Tabelle (interne Verlinkung, 120 Seiten): auffällig dünn verlinkt trotz
Performance-Relevanz — `fr/occasions-speciales/nouvel-an/` nur 1 interner Link,
`en/wm-2026-public-viewing-muenchen/` nur 2, `italiener-hauptbahnhof-muenchen/` und `mittags-menu/`
je nur 4 (beides Seiten mit erheblichem Suchvolumen, `mittags-menu/` zusätzlich ein P1-CTR-Killer).

**Fix:** Footer- oder Cross-Content-Links ergänzen — Bestandsmuster im Repo suchen (`Footer.tsx`
o. ä.), analog zum events-storia.de-Vorbild (dort wurden Anlass-/Kulinarik-Cluster im Footer
ergänzt). Ziel: die 4 genannten Seiten von ihrem aktuellen dünnen Link-Stand auf ein Niveau
vergleichbar mit den übrigen Landingpages heben.

---

## P4 — GEO-Content-Ausbau (kein Bugfix, Deliverable statt Code)

`Generative-KI.zip` (Googles AI-Overviews-Report, Filter „Letzte 3 Monate", nur Impressionen
verfügbar, keine Klicks/Position) zeigt steigenden Trend (34 Impr./Tag Ende Mai → 85–125 Ende
August). Top-Seiten nach AI-Overview-Impressionen sind exakt die geschäftsrelevanten
Anlass-/Event-Seiten: `wm-2026-public-viewing-muenchen/` (1.094), `/` (958),
`geburtstagsfeier-muenchen/` (785), `aperitivo-muenchen/` (762), `romantisches-dinner-muenchen/`
(650), `catering/` (525), `besondere-anlaesse/silvester/` (488).

**Kein Defekt** — aber ein Signal, wo organisches GEO-Wachstum bereits stattfindet, ohne dass
bislang gezielt investiert wurde. **Deliverable dieses Kriteriums:** ein kurzes Konzeptpapier
(Content-Gap-Analyse: welche dieser Top-Seiten hätten mit FAQ-Erweiterung/mehr strukturiertem
Content noch mehr AI-Overview-Potenzial), das Antoine zur Freigabe vorgelegt wird — **kein Code in
diesem Kriterium**, da Content-Entscheidungen außerhalb reiner Bugfix-Automatik liegen.

---

## P5 — Indexierung anstoßen (erst NACH P2/P3-Deploy)

9 URLs „Gefunden – zurzeit nicht indexiert", alle „Zuletzt gecrawlt: 1970-01-01" (nie gecrawlt):
neue Saison-Seiten (candlelight-menue/oktoberfest-menue/capodanno in EN/FR/IT) + `barrierefreiheit`.

**Tool:** `scripts/request-indexing.mjs` (liegt bereits lokal in diesem Repo, kein externes
Credential-Gate wie beim events-storia.de-Vorbild — `scripts/service-account.json` existiert
bereits). Aufruf: `node scripts/request-indexing.mjs "https://www.ristorantestoria.de/<pfad>/"`
je betroffener URL, oder `--priority` falls das Script nicht-indexierte Priority-URLs selbst
ermittelt (vorher Script-Optionen gegenprüfen).

**Warum erst nach P2/P3:** analog zum events-storia.de-Vorbild — für schlecht verlinkte/noch nicht
deployte Seiten zu beantragen, bevor die strukturellen Fixes live sind, verschwendet das
200-URLs/Tag-Kontingent.

---

## Deploy-Modell dieses Repos (wichtig für die Loop-Disziplin)

`.github/workflows/deploy-ionos.yml` deployt bei **jedem Push auf `main`** automatisch per SFTP —
keine PR-gated CI mit Test-Suite-Gate (siehe `docs/ci/CI-KOSTEN-STANDARD.md`: Smoke-Checks bei
Push, volle Suite nur nächtlich). Jeder Merge nach `main` ist sofortiges Live-Deployment. Beweis vor
jedem Merge: lokal `npm run build` (Client+Server+Prerender+Sitemap in einem Schritt) und
`npm run lint`, beide grün. `public/.htaccess`-Änderungen (P2) werden über den normalen Build/Deploy
mitausgeliefert — **nicht** über den separaten `upload-root-htaccess.yml`-Workflow (der betrifft nur
`root-htaccess/.htaccess`, den reinen HTTP→HTTPS-Redirect auf Port 80, unverändert in diesem Loop).
