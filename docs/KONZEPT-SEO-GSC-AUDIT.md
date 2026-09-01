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

## Harte Regel: Formulare nicht anfassen (Antoine, 01.09.2026)

**Kontakt- und Reservierungsformulare werden in diesem Loop nicht verändert, nicht umgebaut, nicht
refactored.** Grund: das sind die tatsächlichen Lead-Eingänge — jedes Risiko dort ist inakzeptabel,
unabhängig vom SEO-Nutzen. Betrifft konkret P1 (`Kontakt.tsx`, `Reservierung.tsx`): erlaubt sind
**ausschließlich** Änderungen an `title`/`description`-Strings (Meta-Tags, SEO-Snippet-Text) —
keine JSX-Struktur, keine Formularfelder, kein `onSubmit`, keine Validierung, keine Imports der
Formular-Komponenten. Vor jedem P1-Commit per `git diff` verifizieren, dass ausschließlich
String-Literale in den `title`/`description`-Zuweisungen verändert wurden.

## Dringend — Oktoberfest 2026 muss jetzt ranken (Antoine, 01.09.2026)

Wiesn: 19.09.–04.10.2026 — **18 Tage ab Auftrag**. Die Landingpage `/oktoberfest-muenchen/`
(+ EN `oktoberfest-munich`, IT `oktoberfest-monaco`, FR `oktoberfest-munich`) existiert bereits,
ist laut `docs/oktoberfest-seo-audit.md` + `docs/oktoberfest-landing-konzept.md` (beide 09.08.2026)
inhaltlich stark ausgebaut (Bavarese-Konzept, Menu-Schema, interne Verlinkung ab Pillar-Page —
alle dort als Dev-P1 markierten Punkte bereits ✅). Aktueller Live-Stand aus dem GSC-Export
(92-Tage-Fenster): 279 Impr./7 Klicks DE (Pos. 8,04), 44/1 EN (Pos. 9,61), 32/1 IT (Pos. 8,97),
12/0 FR (Pos. 8,08) — **knapp außerhalb Seite 1**, keine Klicks aus AI-Overviews trotz Impressionen
dort (10/7/2/1).

**Sofort erledigt (01.09.2026, risikofrei, kein Code):** alle 4 URLs per
`node scripts/request-indexing.mjs` aktiv zur Google-Indexierung eingereicht — „4 eingereicht,
0 fehlgeschlagen". Beschleunigt den Re-Crawl, ersetzt aber keine Ranking-Signale.

### Nebenbefund: verwaiste Dubletten unter „besondere-anlaesse"

`useSpecialMenuBySlug("oktoberfest-menue")` in `OktoberfestMuenchen.tsx:96` ist nur ein
**Daten-Slug** (Admin-editierbares Sondermenü), keine eigene Route. Trotzdem liefert
`besondere-anlaesse/oktoberfest-menue/` (DE/FR/IT) live **HTTP 200** mit nie gecrawltem Inhalt
(„Zuletzt gecrawlt: 1970-01-01") und die EN-Entsprechung
`en/special-occasions/oktoberfest-menue/` **404**. Diese Dubletten sind vermutlich ein
`/besondere-anlaesse/:slug`-Routing-Restfund, der den Slug fälschlich als eigene Anlassseite
matched, und verwässern potenziell Crawl-Budget/Autorität der echten Oktoberfest-Landingpage.
**Klärungsbedarf vor Fix:** ob diese Route Absicht (z. B. Weiterleitung auf die echte
Oktoberfest-Seite gewünscht) oder Bug ist — erst dann redirecten.

### Was NICHT code-seitig lösbar ist (an Antoine, zeitkritisch)

Laut `docs/oktoberfest-seo-audit.md` § „Roadmap" sind die höchsten verbleibenden ROI-Hebel
**Betreiber-Aktionen außerhalb des Codes**, seit Juli 2026 offen:
- **WirtshausWiesn-Registrierung** auf oktoberfest.de (offizielles Programm für Gastro-Betriebe) —
  starker thematischer Backlink + Sichtbarkeit, hat möglicherweise eine Anmeldefrist.
- **Google-Business-Profil-Beitrag** „Oktoberfest im STORIA" (Fotos, Zeitraum, Link zur Seite).
- Aufnahme in „Restaurants near Oktoberfest"-Listicles (TripAdvisor, Falstaff u. ä.).

Diese drei Punkte entscheiden laut dem eigenen Audit-Dokument stärker über die Ranking-Chance in
18 Tagen als weitere Code-Iterationen — Ranking-Positionsänderungen brauchen selbst mit optimalem
Code typischerweise Wochen, Off-Page-Signale wirken hier schneller. **Empfehlung: Antoine im Chat
auf diese drei Punkte hinweisen, da rein SEO-technisch keine schnellere Lösung existiert.**

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

**Wichtig — kein Trunkierungs-Problem:** alle vier aktuellen Descriptions liegen unter 160 Zeichen
(Kontakt 159, Reservierung 144, Mittagsmenu 131) — es wird nichts abgeschnitten. Die schwache CTR
trotz Top-Position ist bei lokalen Intents wie „Kontakt"/„Reservierung" ein bekanntes Muster:
Googles **Local Pack / Maps-Box** über den organischen Ergebnissen fängt bei diesen Suchanfragen
oft den Großteil der Klicks ab. Snippet-Optimierung kann das nicht vollständig kompensieren, aber
stärkere Differenzierung/CTA erhöht die Chance, gegen die verbleibende organische Konkurrenz zu
gewinnen. **Erwartung ehrlich einordnen: das ist ein Versuch, kein garantierter CTR-Sprung.**

**Betroffene Dateien (nur `title`/`description`-String, siehe Formular-Regel oben):**
- `src/pages/Kontakt.tsx` Zeilen 32–33 (DE), 45–46 (EN) — eigener `seoContent`-Objekt, **nicht**
  `t.pages.kontakt` in den Translation-Dateien (das wird von `Kontakt.tsx` nicht referenziert,
  vor dem Fix gegenprüfen ob es toter Code ist oder anderswo gebraucht wird).
- `src/translations/de.ts`/`en.ts` Zeile ~3671 (DE) / ~3587 (EN): `pages.reservierung.title`/`.description`.
- `src/translations/de.ts`/`en.ts` Zeile ~3648 (DE) / entsprechend (EN): `pages.mittagsmenu.title`/`.description`.
- `en/food-menu/` ist **nicht** das EN-Pendant von `mittags-menu/`, sondern die EN-Version der
  Speisekarte (Slug `speisekarte`→`food-menu`, `src/translations/en.ts` Zeile 3549): eigener Fix,
  nicht dieselbe Übersetzung.

**Konkrete Vorschläge (Entwurf, vor Umsetzung mit Antoine abstimmen — Copy ist eine
Geschäftsentscheidung, kein reiner Bugfix):**

| Seite | Aktuell | Vorschlag |
|---|---|---|
| `kontakt/` Title (57 Z.) | „Kontakt & Anfahrt – STORIA Ristorante München Maxvorstadt" | „STORIA München: Telefon, Anfahrt & Öffnungszeiten \| Jetzt anrufen" (59 Z.) |
| `kontakt/` Desc (159 Z.) | „STORIA München Kontakt: Karlstraße 47a, Maxvorstadt. Nähe Hauptbahnhof, Königsplatz & TU München. Öffnungszeiten Mo-Fr 9-1 Uhr. Jetzt anrufen: +49 89 51519696!" | „Sofort erreichbar: ☎ +49 89 51519696. Karlstraße 47a, Maxvorstadt — 5 Min. vom Hauptbahnhof. Geöffnet Mo–Fr 9–1 Uhr. Jetzt anrufen oder Tisch reservieren!" (154 Z.) |
| `reservierung/` Title (38 Z.) | „Tisch reservieren – Restaurant München" | „Jetzt Tisch reservieren – STORIA Maxvorstadt, Königsplatz" (58 Z.) |
| `reservierung/` Desc (144 Z.) | „Tisch reservieren im STORIA München Maxvorstadt: Online buchen oder anrufen. Ihr Italiener nahe Königsplatz & Hauptbahnhof. Jetzt Platz sichern!" | „In 2 Minuten online buchen oder anrufen: +49 89 28806855. Ihr Italiener am Königsplatz, Maxvorstadt. Plätze sind schnell vergeben — jetzt sichern!" (152 Z.) |
| `mittags-menu/` Title (54 Z.) | „Mittagskarte München – wechselndes Menü Mo–Fr \| STORIA" | „Mittagstisch Maxvorstadt ab 14,90 € – STORIA, Mo–Fr" (52 Z.) |
| `mittags-menu/` Desc (131 Z.) | „Mittagsmenü im STORIA München Maxvorstadt: Frische italienische Küche Mo-Fr. Lunch nahe Hauptbahnhof & Königsplatz. Jetzt genießen!" | „Business Lunch ab 14,90 €: wechselndes 3-Gänge-Menü Mo–Fr ab 11:30 Uhr. 5 Min. vom Königsplatz. Reservierung empfohlen — jetzt Karte ansehen!" (156 Z.) |
| `en/food-menu/` Title | „Menu – Pizza & Pasta" | „Authentic Italian Menu Munich – Pizza, Pasta & More \| STORIA" (60 Z.) |
| `en/food-menu/` Desc | „STORIA menu: Neapolitan stone-oven pizza, fresh pasta & antipasti. Italian restaurant Maxvorstadt near Königsplatz. Book now!" | „Neapolitan stone-oven pizza, fresh handmade pasta & antipasti. Munich's favourite Italian in Maxvorstadt, 5 min from Königsplatz. Book a table now!" (157 Z.) |

Preise/Öffnungszeiten/Telefonnummern in den Vorschlägen stammen aus dem bereits vorhandenen Text
derselben Seite (keine neuen Fakten erfunden) — vor Commit trotzdem gegen die Live-Seite
verifizieren, falls sich Preise/Zeiten seit der letzten Textpflege geändert haben.

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
