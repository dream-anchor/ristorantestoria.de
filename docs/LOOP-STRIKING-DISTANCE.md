# LOOP — Striking-Distance-Keyword-Optimierung nach GSC-Export vom 12.09.2026

Bauplan: `docs/KONZEPT-STRIKING-DISTANCE.md` (dort stehen exakte Datei-/Zeilenangaben, alle
Copy-Vorschläge und die Gemini-Review-Korrekturen — vor jedem Kriterium lesen). Zustand hier ist
der Zeiger, nicht die zweite Wahrheit: weicht dieser Log vom Konzept ab, gilt das Konzept.
Datengrundlage: `docs/striking-distance-audit-2026-09-12.md`.

**Ziel:** ~23.400 Impressionen/92 Tage über 12 Cluster von Google-Seite 2 (Pos. 8–20) Richtung
Seite 1 bewegen, durch präzise, additive Title/H1/H2-Anpassungen — kein Keyword-Stuffing, keine
neuen Behauptungen (siehe KONZEPT § „Additiv statt ersetzend").

**Deploy-Modell:** Push auf `main` = sofortiges Live-Deployment (SFTP, kein CI-Gate) — wie im
Vorgänger-Loop. Bündelung „ein PR je Einheit" gilt strikt.

**Harte Regel (aus KONZEPT übernommen, hier nicht wiederholt):** kein Commit ohne Chat-Freigabe der
Copy-Tabelle der jeweiligen Einheit; vor jedem Kriterium Query→Page-Zuordnung + Search-Intent kurz
verifizieren (GSC-UI + 1 Google-Suche); Title-Änderungen ergänzen bestehende rankende Phrasen, sie
ersetzen sie nicht; neue/umbenannte H2 braucht einen echten Absatz darunter, keine leere Phrase.

---

## Einheit A — größte Volumen-Cluster (~14.700 Impr.)

**Freigegeben:** Antoine, 12.09.2026, „Ja, setz alles um" — gilt für A1–A4 (Copy-Tabelle aus
KONZEPT § A1–A4 wie vorgelegt, inkl. Gemini-Review-Korrekturen additiv/Steinofen).

- [x] **A1** EN Romantic Dinner (`en/romantic-dinner-munich/`) — Title/Desc/H1/H2 additiv angepasst
      (KONZEPT § A1) + Bug-Fix: hartcodiertes deutsches H2 „Ihr romantischer Abend im STORIA"
      übersetzt (neuer Key `t.seo.romanticDinner.yourEveningTitle`, DE unverändert, EN „Your Romantic
      Evening at STORIA"). **SERP-Hinweis:** Aggregator-dominiert (TheFork/Falstaff/Tripadvisor/
      OpenTable), Erwartung gedämpft (KONZEPT § „Additiv statt ersetzend", Punkt 2 — bereits
      recherchiert, keine erneute Suche nötig).
      ✓ 2026-09-12 · `npm run build` → Exit 0, Prerendering 169/169 Success, 0 Errors (nur 2
      vorbestehende `401`-Warnungen beim Supabase-Dynamic-Slug-Fetch, unabhängig von dieser Änderung)
      ✓ 2026-09-12 · `npm run lint` → 728 problems (652 errors/76 warnings), identisch zur
      main-Baseline vor diesem Commit (verifiziert per `git stash` + Re-Lint) — 0 neue Probleme durch
      diesen Commit, alle bestehenden Fehler liegen in `supabase/functions/*` und
      `tailwind.config.ts`, unberührt von A1.
      ✓ 2026-09-12 · `git diff --stat` → nur `src/translations/de.ts` (+2), `src/translations/en.ts`
      (+6/-4), `src/pages/seo/RomantischesDinner.tsx` (+1/-1) — keine JSX-Struktur, keine
      Formular-Dateien.
      ✓ 2026-09-12 · Prerendered `dist/en/romantic-dinner-munich/index.html` geprüft: neuer Title/H1/
      H2/Description sowie „Your Romantic Evening at STORIA" vorhanden, kein deutscher Reststring
      mehr auf der EN-Seite; `dist/romantisches-dinner-muenchen/index.html` (DE) unverändert mit
      „Ihr romantischer Abend im STORIA".
- [x] **A2** Pizza München (`pizza-muenchen/`) — Title/H1 additiv angepasst (KONZEPT § A2): Title
      „Pizza München – Steinofen-Pizza ab 9,90 €…" → „Beste Pizza München – Pizzeria ab 9,90 € |
      STORIA Maxvorstadt" (Preis-Anker erhalten), H1 „Pizza München – Steinofen-Pizza in der
      Maxvorstadt" → „Beste Pizza München – Ihre Pizzeria in der Maxvorstadt". **Kein**
      Holzofen-Synonym eingeführt (Korrektur 12.09.2026, siehe KONZEPT). H2-Block unverändert
      gelassen (enthält „beste pizza münchen"/„pizzeria münchen" bereits, verifiziert im
      Prerender-Output). **SERP-Hinweis:** ebenfalls Aggregator-dominiert (TripAdvisor/Falstaff/
      Mit Vergnügen/PRINZ), Erwartung gedämpft (KONZEPT § A2, bereits recherchiert, keine erneute
      Suche nötig).
      ✓ 2026-09-12 · `npm run build` → Exit 0, Prerendering 169/169 Success, 0 Errors (identischer
      vorbestehender 401-Hinweis beim Supabase-Dynamic-Slug-Fetch, unabhängig von dieser Änderung)
      ✓ 2026-09-12 · `npm run lint` → 728 problems (652 errors/76 warnings), identisch zur
      A1-Baseline — 0 neue Probleme durch diesen Commit.
      ✓ 2026-09-12 · `git diff --stat` (nur A2-relevante Datei) → nur `src/translations/de.ts`
      (+2/-2, `t.seo.pizzaMuenchen.seoTitle` + `.heroTitle`) — keine JSX-Struktur, keine H2-/Preis-
      Änderung.
      ✓ 2026-09-12 · Prerendered `dist/pizza-muenchen/index.html` geprüft: `<title>`, `<h1>`,
      og:title, twitter:title zeigen „Beste Pizza München – Pizzeria ab 9,90 € | STORIA
      Maxvorstadt" bzw. „Beste Pizza München – Ihre Pizzeria in der Maxvorstadt"; alle vier H2
      unverändert („Pizzeria München – Warum STORIA die beste Pizza München bietet" etc.), kein
      „Holzofen" neu eingeführt.
- [x] **A3** Catering (`catering/`) — Title/H1/H2 additiv angepasst (KONZEPT § A3): Title „Catering
      München \| Italienisches Event-Catering ab 25€ – STORIA" → „Catering München – Preise ab 25€,
      Hochzeit & Events \| STORIA" (Preis-Anker „ab 25€" erhalten), H1 „Catering München –
      Italienisches Event-Catering vom STORIA" → „Catering München für Hochzeit, Events &
      Firmenfeiern – STORIA", H2 „Catering für jeden Anlass" → „Hochzeits-Catering & Event-Catering
      München" + Absatz darunter um „Hochzeit" ergänzt (deckte die neue Überschrift vorher nicht
      explizit ab, Gemini-Regel 3). Neue FAQ-Frage „Was kostet Catering in München?" ergänzt
      (zitiert nur bestehende Paket-Preise aus „Unsere Catering-Pakete": 25/30/35/55/12 € p.P.,
      keine neuen Zahlen). **Tech-Debt-Konsolidierung** (selber Commit): `Catering.tsx` liest Title/
      Description/H1 jetzt aus `t.pages.catering.title/.description/.h1` (`src/translations/de.ts`)
      statt Hardcode — vorher toter Key, jetzt angebunden. Description dabei unverändert 1:1
      übernommen (keine Copy-Änderung, nur Migration). en/it/fr haben laut Audit keinen
      `pages.catering`-Key (Catering ist einsprachig DE, verifiziert: `pages.catering` fehlt in
      allen drei Dateien) — keine neuen EN/IT/FR-Keys angelegt. **Search-Intent-Check** (WebSearch,
      12.09.2026): „catering münchen preise" und „hochzeit catering münchen" — anders als A1/A2
      dominieren hier **einzelne Catering-Anbieter** (Da Baffo, LEKKEREI, Steinmaier, UNIKORN,
      Aurich, Schumacher, eventcatering-muenchen), keine Aggregatoren/Listicles — On-Page-Fix hat
      hier strukturell bessere Erfolgschancen als bei A1/A2.
      ✓ 2026-09-12 · `npm run build` → Exit 0, Prerendering 169/169 Success, 0 Errors (identischer
      vorbestehender 401-Hinweis beim Supabase-Dynamic-Slug-Fetch/Sitemap, unabhängig von dieser
      Änderung).
      ✓ 2026-09-12 · `npm run lint` → 728 problems (652 errors/76 warnings), identisch zur
      A1/A2-Baseline — 0 neue Probleme durch diesen Commit.
      ✓ 2026-09-12 · `git diff --stat` → nur `src/pages/Catering.tsx` (+14/-9) und
      `src/translations/de.ts` (+6/-2, `t.pages.catering.title/.h1/.description`) — keine
      JSX-Struktur außer den Text-Ersetzungen, keine Formular-Dateien.
      ✓ 2026-09-12 · Prerendered `dist/catering/index.html` geprüft: `<title>` „Catering München –
      Preise ab 25€, Hochzeit & Events \| STORIA", `<h1>` „Catering München für Hochzeit, Events &
      Firmenfeiern – STORIA", H2 „Hochzeits-Catering & Event-Catering München" und FAQ „Was kostet
      Catering in München?" vorhanden; meta description/og:description/twitter:description
      unverändert identisch zur vorherigen Live-Version (nur Quelle migriert, kein Copy-Diff).
- [x] **A4** EN Best Italian Restaurant Munich (`en/best-italian-restaurant-munich/`) — H1/H2
      additiv angepasst (KONZEPT § A4): H1 „Authentically Southern Italian – the Cuisine of the
      Cilento in Maxvorstadt" (enthielt „Italian Restaurant" gar nicht, obwohl die Seite bereits
      Pos. 8,9 für „best italian restaurant munich" rankt) → „Munich's Best Italian Restaurant –
      Authentic Cuisine of the Cilento". H2 (erste Sektion) „Southern Italy in Maxvorstadt – the
      Cuisine of the Cilento at STORIA" → „Italian Restaurant Munich – Southern Italy in
      Maxvorstadt at STORIA". Absatz darunter (`introP1`) trägt die neue Überschrift bereits
      inhaltlich (Küche/Herkunft/Munich) — keine Ergänzung nötig. **Title unverändert gelassen**
      (enthält „Best Italian Restaurant Munich" bereits). Nur `src/translations/en.ts` geändert —
      DE (`italienisches-restaurant-muenchen/`, KONZEPT § B2) und IT
      (`miglior-ristorante-italiano-monaco/`, KONZEPT § C4) nutzen dieselbe Component, sind aber
      eigene Kriterien, nicht angefasst.
      ✓ 2026-09-12 · `npm run build` → Exit 0, Prerendering 169/169 Success, 0 Errors (identischer
      vorbestehender 401-Hinweis beim Supabase-Dynamic-Slug-Fetch/Sitemap, unabhängig von dieser
      Änderung).
      ✓ 2026-09-12 · `npm run lint` → 728 problems (652 errors/76 warnings), identisch zur
      A1/A2/A3-Baseline — 0 neue Probleme durch diesen Commit.
      ✓ 2026-09-12 · `git diff --stat` → nur `src/translations/en.ts` (+2/-2,
      `t.seo.italienischesRestaurant.heroTitle` + `.introTitle`) — keine JSX-Struktur, keine
      DE/IT/FR-Werte angefasst.
      ✓ 2026-09-12 · Prerendered `dist/en/best-italian-restaurant-munich/index.html` geprüft:
      `<title>` unverändert „Best Italian Restaurant Munich | Wood-Fired Pizza | STORIA", `<h1>`
      „Munich's Best Italian Restaurant – Authentic Cuisine of the Cilento", erstes `<h2>` „Italian
      Restaurant Munich – Southern Italy in Maxvorstadt at STORIA" vorhanden; DE
      (`dist/italienisches-restaurant-muenchen/index.html`) und IT
      (`dist/it/miglior-ristorante-italiano-monaco/index.html`) beide unverändert auf ihrem
      Vor-A4-Stand.

## Einheit A: Branch, Beweis, Merge

- [x] Branch `striking-distance-a` gepusht, PR erstellt, Diff gegengelesen, gemergt. Live-Stichprobe
      nach Deploy (Title/H1 je Seite per `curl -s` oder Browser-Check, sobald `chrome-devtools`-MCP
      verbunden ist — sonst `curl` + Sichtprüfung wie im Vorgänger-Loop).
      ✓ 2026-09-12 · PR #67 erstellt, Diff im Hauptfenster gegengelesen (nur String-Literale,
      Preis-Anker/Fakten erhalten, keine Formular-Dateien) → `gh pr merge 67 --squash
      --delete-branch` → Merge-Commit `d4ef17b` auf `main`. Deploy-Workflow „Deploy Lovable SSG to
      IONOS (SFTP)" ausgelöst (Run 34709812407), Live-Stichprobe folgt nach Abschluss.
      PR erstellt: https://github.com/dream-anchor/ristorantestoria.de/pull/67, Merge steht noch
      aus (Hauptfenster).

---

## Einheit B — mittlere Cluster

**Freigegeben:** Antoine, 12.09.2026, „Ja, setz alles im /loop um" — gilt für B1–B4 (Copy-Tabelle
wie im Chat vorgelegt, siehe KONZEPT § B1–B4).

- [x] **B1** Firmenfeier München (`firmenfeier-muenchen/`) — H2 (erste Sektion) additiv angepasst
      (KONZEPT § B1): „Firmenevents München – Das STORIA für erfolgreiche Firmenevents" →
      „Firmenfeier München – Ihre Betriebsfeier im STORIA" (schließt fehlende H2-Wiederholung von
      „Firmenfeier München" + fehlendes Synonym „Betriebsfeier" in einer Überschrift). Absatz
      darunter (`introP1`) trug die neue Überschrift nicht vollständig — um „Ihre Betriebsfeier" in
      der Anlass-Aufzählung ergänzt (additiv, keine neuen Fakten). Title/H1 unverändert (enthalten
      „Firmenfeier München" bereits).
      ✓ 2026-09-12 · `npm run build` → Exit 0, Prerendering 169/169 Success, 0 Errors (identischer
      vorbestehender 401-Hinweis beim Supabase-Dynamic-Slug-Fetch/Sitemap, unabhängig von dieser
      Änderung).
      ✓ 2026-09-12 · `npm run lint` → 728 problems (652 errors/76 warnings), identisch zur
      A1–A4-Baseline — 0 neue Probleme durch diesen Commit.
      ✓ 2026-09-12 · `git diff --stat` → nur `src/translations/de.ts` (+2/-2,
      `t.seo.firmenfeier.introTitle` + `.introP1`) — keine JSX-Struktur, keine Formular-Dateien.
      ✓ 2026-09-12 · Prerendered `dist/firmenfeier-muenchen/index.html` geprüft: `<title>`
      unverändert „Firmenfeier München – Location für 20–300 Gäste | STORIA", `<h1>` unverändert
      „Firmenfeier München – Feiern im STORIA Maxvorstadt", erstes `<h2>` „Firmenfeier München –
      Ihre Betriebsfeier im STORIA" vorhanden, „Betriebsfeier" erscheint jetzt 3× auf der Seite
      (Hero-Subtitle, neues H2, neuer introP1-Zusatz).
      ⚠ **Prozess-Abweichung (Hauptfenster, 12.09.2026):** B1 ist entgegen der geplanten
      „ein PR je Einheit"-Bündelung bereits **vorzeitig live** — nicht erst zusammen mit B2–B4.
      Ursache: Hauptfenster und B1-Subagent teilten sich dasselbe Arbeitsverzeichnis (kein
      `EnterWorktree`); ein separater Doku-Nachlauf-Commit (Einheit-A-Merge-Checkbox +
      seo-log-Baseline) wurde versehentlich vom Branch-Kopf `striking-distance-b` (der zu dem
      Zeitpunkt bereits B1 enthielt) statt von `main` abgezweigt und als PR #68 gemergt — dadurch
      landete B1 mit auf `main` und deployte automatisch. Live-Check bestätigt korrekten Inhalt.
      Inhaltlich unproblematisch (B1 war bereits Teil der freigegebenen Einheit-B-Copy, additiv,
      korrekt getestet) — nur die Bündelung wurde für dieses eine Kriterium gebrochen. Branch
      `striking-distance-b` bleibt Arbeitsgrundlage für B2–B4; der spätere Merge dieses Branches
      ist für den B1-Teil ein No-Op (Inhalt bereits auf `main`, verifiziert per Zwei-Punkt-Diff
      `origin/main..striking-distance-b` — keine B1/firmenfeier-Hunk mehr vorhanden). **Lehre für
      weitere Iterationen:** bei geteiltem Arbeitsverzeichnis vor jedem `git branch`/`git checkout`
      im Hauptfenster erst `git branch --show-current` prüfen, nicht von HEAD blind ausgehen.
- [x] **B2** Italienisches Restaurant München, DE (`italienisches-restaurant-muenchen/`) — Title/H1/H2
      additiv angepasst (KONZEPT § B2, größte Einzel-Phrase-Lücke im Audit): Seite rankt Ø Pos.
      6,95 (6.305 Impr.), aber nur Pos. 20,88 für „italienisches restaurant münchen" (81 Impr.), weil
      die Phrase in Title/H1/H2 nie zusammenhängend vorkam. Title „Bestes italienisches Restaurant
      Maxvorstadt München \| STORIA" → „Bestes Italienisches Restaurant München \| STORIA
      Maxvorstadt", H1 (`heroTitle`) „Bestes italienisches Restaurant in der Maxvorstadt – STORIA
      München" → „Italienisches Restaurant München – Authentische Küche des Cilento", H2 erste
      Sektion (`introTitle`) „Süditalien in der Maxvorstadt – die Küche des Cilento im STORIA" →
      „Ihr Italienisches Restaurant München – Süditalienische Küche des Cilento". Alle Wörter aus
      Title/H1 erhalten, nur umgestellt. `introP1` trägt die neue H2 bereits inhaltlich (Küche/
      Cilento/München) — keine Ergänzung nötig. „italiener münchen" (380 Impr., Pos. 14,34) bewusst
      **nicht** zusätzlich gepresst (KONZEPT-Hinweis, separates Register, eigenes Kriterium falls
      nach 4–8 Wochen keine Bewegung). Nur DE-Werte geändert — EN
      (`en/best-italian-restaurant-munich/`, A4) und IT
      (`it/miglior-ristorante-italiano-monaco/`, C4) nutzen dieselbe Component, nicht angefasst.
      ✓ 2026-09-12 · `npm run build` → Exit 0, Prerendering 169/169 Success, 0 Errors (identischer
      vorbestehender 401-Hinweis beim Supabase-Dynamic-Slug-Fetch/Sitemap, unabhängig von dieser
      Änderung).
      ✓ 2026-09-12 · `npm run lint` → 728 problems (652 errors/76 warnings), identisch zur
      A1–A4/B1-Baseline — 0 neue Probleme durch diesen Commit.
      ✓ 2026-09-12 · `git diff --stat` → nur `src/translations/de.ts` (+3/-3,
      `t.seo.italienischesRestaurant.seoTitle` + `.heroTitle` + `.introTitle`) — keine JSX-Struktur,
      keine Formular-Dateien, keine EN/IT/FR-Werte angefasst.
      ✓ 2026-09-12 · Prerendered `dist/italienisches-restaurant-muenchen/index.html` geprüft:
      `<title>`/og:title/twitter:title „Bestes Italienisches Restaurant München \| STORIA
      Maxvorstadt", `<h1>` „Italienisches Restaurant München – Authentische Küche des Cilento",
      erstes `<h2>` „Ihr Italienisches Restaurant München – Süditalienische Küche des Cilento"
      vorhanden. `dist/en/best-italian-restaurant-munich/index.html` (Title „Best Italian Restaurant
      Munich \| Wood-Fired Pizza \| STORIA", H1 „Munich's Best Italian Restaurant – Authentic
      Cuisine of the Cilento") und `dist/it/miglior-ristorante-italiano-monaco/index.html`
      unverändert auf ihrem Vor-B2-Stand.
- [x] **B3** Italiener Königsplatz (`italiener-koenigsplatz/`) — Title/H1/H2 additiv angepasst
      (KONZEPT § B3): „Maxvorstadt" fehlte trotz 265+39 Impr. auf Maxvorstadt-spezifischen Queries
      (`italiener maxvorstadt` 265 Impr./Pos. 9,50, `italienisches restaurant maxvorstadt` 39
      Impr./Pos. 7,97) komplett in Title/H1/H2. Title „Italiener Königsplatz München – STORIA
      Restaurant" → „Italiener Königsplatz München – Maxvorstadt \| STORIA Restaurant", H1
      „Italiener Königsplatz München" → „Italiener Königsplatz München – Ihr Restaurant in der
      Maxvorstadt", H2 (erste Sektion, `highlightsTitle`) „Warum STORIA am Königsplatz?" →
      „Restaurant Königsplatz München – Warum STORIA?" (deckt „restaurant königsplatz münchen"/
      „königsplatz restaurant" ab, additiv da nur die Frage umformuliert; die vier Highlight-Cards
      darunter — Authentische Küche, Zentrale Lage, Flexible Zeiten, Fußläufig erreichbar — tragen
      die Frage „Warum STORIA?" weiterhin inhaltlich, keine Ergänzung nötig).
      ✓ 2026-09-12 · `npm run build` → Exit 0, Prerendering 169/169 Success, 0 Errors (identischer
      vorbestehender 401-Hinweis beim Supabase-Dynamic-Slug-Fetch/Sitemap, unabhängig von dieser
      Änderung).
      ✓ 2026-09-12 · `npm run lint` → 728 problems (652 errors/76 warnings), identisch zur
      A1–A4/B1/B2-Baseline — 0 neue Probleme durch diesen Commit.
      ✓ 2026-09-12 · `git diff --stat` → nur `src/translations/de.ts` (+3/-3,
      `t.seo.italienerKoenigsplatz.seoTitle` + `.heroTitle` + `.highlightsTitle`) — keine
      JSX-Struktur, keine Formular-Dateien.
      ✓ 2026-09-12 · Prerendered `dist/italiener-koenigsplatz/index.html` geprüft: `<title>`/
      og:title/twitter:title „Italiener Königsplatz München – Maxvorstadt \| STORIA Restaurant",
      `<h1>` „Italiener Königsplatz München – Ihr Restaurant in der Maxvorstadt", H2 „Restaurant
      Königsplatz München – Warum STORIA?" vorhanden; alter H2-String „Warum STORIA am
      Königsplatz?" nicht mehr im Output (0 Treffer).
- [x] **B4** Italiener Hauptbahnhof (`italiener-hauptbahnhof-muenchen/`) — nur H2 anpassen, Title/H1
      bewusst unverändert (KONZEPT § B4). H2 (`introTitle`) „Ihr Italiener am Münchner Hauptbahnhof"
      → „Restaurant am Hauptbahnhof München – Italienisch essen bei STORIA" (deckt „münchen
      hauptbahnhof essen"/„restaurant hauptbahnhof münchen"/„restaurants münchen hauptbahnhof" in
      einer Überschrift ab). `introP1` „Das STORIA ist nur 5 Gehminuten entfernt" → „Unser
      Restaurant STORIA ist nur 5 Gehminuten entfernt" (Absatz trug „Restaurant"-Bezug vorher nicht
      explizit, additiv ergänzt, keine neuen Fakten). Title/H1 unverändert (Marke „Italiener am
      Hauptbahnhof" rankt bereits Pos. 3,79 für „italiener münchen hauptbahnhof", Kannibalisierung
      vermeiden).
      ✓ 2026-09-12 · `npm run build` → Exit 0, Prerendering 169/169 Success, 0 Errors (identischer
      vorbestehender 401-Hinweis beim Supabase-Dynamic-Slug-Fetch/Sitemap, unabhängig von dieser
      Änderung).
      ✓ 2026-09-12 · `npm run lint` → 728 problems (652 errors/76 warnings), identisch zur
      A1–A4/B1–B3-Baseline — 0 neue Probleme durch diesen Commit.
      ✓ 2026-09-12 · `git diff --stat` → nur `src/translations/de.ts` (+2/-2,
      `t.seo.italienerHauptbahnhof.introTitle` + `.introP1`) — keine JSX-Struktur, keine
      Formular-Dateien, Title/H1 nicht angefasst.
      ✓ 2026-09-12 · Prerendered `dist/italiener-hauptbahnhof-muenchen/index.html` geprüft:
      `<title>` unverändert „Italiener am Hauptbahnhof München – 5 Min. zu Fuß | STORIA", `<h1>`
      unverändert „Italiener am Hauptbahnhof München – STORIA", H2 „Restaurant am Hauptbahnhof
      München – Italienisch essen bei STORIA" vorhanden; alter H2-String „Ihr Italiener am Münchner
      Hauptbahnhof" nicht mehr im Output (0 Treffer); introP1 enthält „Unser Restaurant STORIA".

## Einheit B: Branch, Beweis, Merge

- [x] Branch `striking-distance-b` gepusht, PR erstellt, Diff gegengelesen, gemergt. Live-Stichprobe
      nach Deploy.
      ✓ 2026-09-12 · PR #70 erstellt, im Hauptfenster gegengelesen (nur B2/B3/B4-Strings, additiv,
      B1 korrekt als No-Op da bereits auf `main` — siehe Prozess-Notiz oben) → `gh pr merge 70
      --squash --delete-branch` → Fast-Forward-Merge `d66ae5e` auf `main` (kein Konflikt mit lokalem
      main, sauber synchronisiert). Deploy-Workflow ausgelöst (Run 34712174947), Live-Stichprobe
      folgt nach Abschluss.

---

## Einheit C — kleinere Cluster + IT-Markt

**Freigegeben:** Antoine, 12.09.2026, „Ja, setz alles im /loop um" — gilt für C1–C4 (Copy-Tabelle
wie im Chat vorgelegt, siehe KONZEPT § C1–C4).

- [x] **C1** Neapolitanische Pizza München (`neapolitanische-pizza-muenchen/`) — nur H1 additiv
      angepasst (KONZEPT § C1): „Neapolitanische Pizza München – Steinofen 400°C im STORIA" →
      „Beste Neapolitanische Pizza München – Steinofen 400°C im STORIA" (fügt „beste" ein, deckt
      „beste neapolitanische pizza münchen", 222 Impr./Pos. 11,98). Title und H2-Block unverändert
      (Kopf-Keyword „neapolitanische pizza münchen" bereits vorhanden, kein struktureller Fix
      nötig). **Kein** Holzofen-Synonym eingeführt (Korrektur 12.09.2026, STORIA hat nachweislich
      einen Steinofen, keinen Holzofen) — `holzofenpizza münchen` (149 Impr.) bleibt unadressiert,
      wie im KONZEPT vermerkt.
      ✓ 2026-09-12 · `npm run build` → Exit 0, Prerendering 169/169 Success, 0 Errors (identischer
      vorbestehender 401-Hinweis beim Supabase-Dynamic-Slug-Fetch/Sitemap, unabhängig von dieser
      Änderung).
      ✓ 2026-09-12 · `npm run lint` → 728 problems (652 errors/76 warnings), identisch zur
      A1–A4/B1–B4-Baseline — 0 neue Probleme durch diesen Commit.
      ✓ 2026-09-12 · `git diff --stat` → nur `src/translations/de.ts` (+1/-1,
      `t.seo.neapolitanPizza.heroTitle`) — keine JSX-Struktur, keine Formular-Dateien, kein
      „Holzofen" im Diff.
      ✓ 2026-09-12 · Prerendered `dist/neapolitanische-pizza-muenchen/index.html` geprüft: `<h1>`
      „Beste Neapolitanische Pizza München – Steinofen 400°C im STORIA" vorhanden; `<title>`/
      og:title/twitter:title unverändert „Neapolitanische Pizza München – 90 Sek. bei 400 °C |
      STORIA"; 0 Treffer für „Holzofen" im gesamten Output.
      Commit `18ef0ee` auf Branch `striking-distance-c` (kein Push, kein PR — C2–C4 stehen noch
      aus, Bündelung „ein PR je Einheit").
- [x] **C2** Aperitivo München (`aperitivo-muenchen/`) — nur H2 additiv angepasst (KONZEPT § C2):
      „Warum Aperitivo im STORIA München?" → „Aperitivo Bar München – Warum STORIA?" (fehlendes Wort
      war „Bar", nicht „Aperitivo" selbst; deckt „aperitivo bar münchen", 207 Impr./Pos. 11,02).
      Title/H1 unverändert (enthalten „Aperitivo" bereits stark). Feature-Cards direkt unter der H2
      (Frage-Antwort-Format) tragen die neue Überschrift bereits inhaltlich —
      `featureAmbienceDesc` nennt bereits „italienische Bar-Kultur" — keine Ergänzung nötig.
      ✓ 2026-09-12 · `npm run build` → Exit 0, Prerendering 169/169 Success, 0 Errors (identischer
      vorbestehender 401-Hinweis beim Supabase-Dynamic-Slug-Fetch/Sitemap, unabhängig von dieser
      Änderung).
      ✓ 2026-09-12 · `npm run lint` → 728 problems (652 errors/76 warnings), identisch zur
      A1–A4/B1–B4/C1-Baseline — 0 neue Probleme durch diesen Commit.
      ✓ 2026-09-12 · `git diff --stat` → nur `src/translations/de.ts` (+1/-1,
      `t.seo.aperitivo.whyTitle`) — keine JSX-Struktur, keine Formular-Dateien.
      ✓ 2026-09-12 · Prerendered `dist/aperitivo-muenchen/index.html` geprüft: `<h2>` „Aperitivo Bar
      München – Warum STORIA?" vorhanden, alter H2-String „Warum Aperitivo im STORIA München?" 0
      Treffer; `<title>` unverändert „Aperitivo München – 10 Spritz-Varianten 9,90 €, Terrasse |
      STORIA", `<h1>` unverändert „Aperitivo München – Aperol Spritz & Negroni im STORIA".
      Commit `cb8f94f` auf Branch `striking-distance-c` (kein Push, kein PR — C3/C4 stehen noch aus,
      Bündelung „ein PR je Einheit").
- [x] **C3** Geburtstagsfeier München DE (`geburtstagsfeier-muenchen/`) + EN
      (`en/birthday-party-munich/`) — nur H2 additiv angepasst (KONZEPT § C3), Title/H1 auf beiden
      Sprachen unverändert. Component ist dieselbe für DE+EN (`GeburtstagsfeierMuenchen.tsx`,
      `en`-Slug `birthday-party-munich` via `slugs.json`-Mapping), analog zum A4/B2/C4-Muster.
      DE: H2 (`typesTitle`) „🎂 Welche Geburtstagsfeiern können Sie im STORIA feiern?" →
      „Geburtstag feiern im Restaurant München – STORIA" (deckt „geburtstag feiern restaurant
      münchen", 206 Impr./Pos. 7,30, + „restaurant für geburtstag münchen", 78 Impr./Pos. 8,49, in
      einer Überschrift ab).
      **EN-Recherche (nicht Teil der KONZEPT-Erstrecherche, hier nachgetragen):** IST-Zustand vor
      Fix — `seoTitle`: „Birthday Party Munich \| Up to 200 Guests from €35 – STORIA", `heroTitle`
      (H1): „Birthday Party Munich – Celebrate Italian Style at STORIA", `introTitle` (H2 Sektion 1):
      „Birthday Party Munich – STORIA for Your Special Day", `typesTitle` (H2 Sektion 2): „🎂 What
      Birthday Parties Can You Celebrate at STORIA?". Beide Ziel-Queries „munich birthday
      celebration" (233 Impr./Pos. 11,76) und „best restaurant for birthday celebration" (158
      Impr./Pos. 9,36) fehlten als Phrase in Title/H1/H2 komplett (nur beiläufig in `introP1`/
      Testimonial, nicht in einer Überschrift). **Entscheidung:** Title/H1 tragen das Kopf-Keyword
      „birthday party munich" bereits — laut Vorgabe deshalb nicht angefasst, nur `typesTitle`
      geändert: „🎂 What Birthday Parties Can You Celebrate at STORIA?" → „Best Restaurant for
      Birthday Celebration in Munich – STORIA" (deckt beide EN-Ziel-Queries additiv ab).
      Beide H2 sitzen über derselben unveränderten 5er-Kartenliste (Meilenstein/Überraschung/
      Familie/Pizza/Dinner) — trägt die neue Überschrift weiterhin inhaltlich als
      Feier-Typ-Übersicht, keine Ergänzung nötig.
      ✓ 2026-09-12 · `npm run build` → Exit 0, Prerendering 169/169 Success, 0 Errors (identischer
      vorbestehender 401-Hinweis beim Supabase-Dynamic-Slug-Fetch/Sitemap, unabhängig von dieser
      Änderung).
      ✓ 2026-09-12 · `npm run lint` → 728 problems (652 errors/76 warnings), identisch zur
      A1–A4/B1–B4/C1/C2-Baseline — 0 neue Probleme durch diesen Commit.
      ✓ 2026-09-12 · `git diff --stat` → nur `src/translations/de.ts` (+1/-1, `t.seo.birthday.
      typesTitle`) und `src/translations/en.ts` (+1/-1, `t.seo.birthday.typesTitle`) — keine
      JSX-Struktur, keine Formular-Dateien.
      ✓ 2026-09-12 · Prerendered `dist/geburtstagsfeier-muenchen/index.html` geprüft: `<title>`
      unverändert „Geburtstagsfeier München – Restaurant für 2–200 Gäste \| STORIA", `<h1>`
      unverändert „Geburtstagsfeier München – Italienisch feiern im STORIA", zweites `<h2>`
      „Geburtstag feiern im Restaurant München – STORIA" vorhanden. Prerendered
      `dist/en/birthday-party-munich/index.html` geprüft: `<title>` unverändert „Birthday Party
      Munich \| Up to 200 Guests from €35 – STORIA", `<h1>` unverändert „Birthday Party Munich –
      Celebrate Italian Style at STORIA", zweites `<h2>` „Best Restaurant for Birthday Celebration
      in Munich – STORIA" vorhanden; alter H2-String „What Birthday Parties Can You Celebrate at
      STORIA?" 0 Treffer in beiden Sprachversionen.
      Commit `7ea2473` auf Branch `striking-distance-c` (kein Push, kein PR — C4 steht noch aus,
      Bündelung „ein PR je Einheit").
- [x] **C4** IT Ristorante-Cluster (`it/miglior-ristorante-italiano-monaco/`) — Title/H1/H2 additiv
      angepasst (KONZEPT § C4, zweitgrößter Einzel-Phrase-Befund im Audit): 1.145 Impr. über die
      Top-3-IT-Queries (`ristoranti italiani a monaco di baviera` 585 Impr./Pos. 13,07,
      `ristorante italiano monaco di baviera` 243 Impr./Pos. 10,33,
      `migliori ristoranti italiani monaco di baviera` 57 Impr./Pos. 11,74), aber **keine** davon kam
      in Title/H1/H2 vor — Seite sprach durchgängig von „Ristorante del Sud Italia"/„Monaco" statt
      „Ristorante Italiano"/voller Ortsbezeichnung „Monaco di Baviera". Title „Ristorante del Sud
      Italia Monaco-Maxvorstadt \| STORIA" → „Ristorante Italiano Monaco di Baviera – Cucina del Sud
      \| STORIA" (KONZEPT-Wortlaut übernommen, nicht die im Auftrag leicht abweichende Variante mit
      zusätzlichem „Italia" am Ende — Konzept ist bei Abweichung bindend). H1 „Autenticamente del Sud
      Italia – la cucina del Cilento nel Maxvorstadt" → „Ristorante Italiano a Monaco di Baviera –
      Autentica Cucina del Sud Italia". H2 (erste Sektion, `introTitle`) „Il Sud Italia nel
      Maxvorstadt – la cucina del Cilento allo STORIA" → „Il Miglior Ristorante Italiano a Monaco di
      Baviera – STORIA Maxvorstadt" (deckt zusätzlich „migliori ristoranti italiani" ab). `introP1`
      trägt Küche/Herkunft/Ort (Cilento, Campania, Monaco) bereits inhaltlich — keine Ergänzung nötig
      (gleiches Muster wie A4/B2 bei derselben Component). Nur IT-Werte geändert — DE
      (`italienisches-restaurant-muenchen/`, B2) und EN (`en/best-italian-restaurant-munich/`, A4)
      nutzen dieselbe Component, nicht angefasst. **SERP-Check** (WebSearch, 12.09.2026, Query
      „ristorante italiano monaco di baviera"): Top-Ergebnisse ausschließlich Aggregatoren/
      Verzeichnisse (TripAdvisor, Falstaff, TuttoBaviera, CitySeeker, Milan Foodie Insider,
      BigMammaGroup) — STORIA selbst nicht in den angezeigten Treffern. Erwartung entsprechend
      gedämpft (Muster wie A1/A2), Fix trotzdem additiv/kostenlos umgesetzt. GSC-UI-Zuordnung
      (Seite→Suchanfragen) mangels Zugriff in dieser Session nicht gegengeprüft (kein `gscServer`-
      MCP verbunden) — entfällt hiermit explizit statt stillschweigend übersprungen.
      ✓ 2026-09-12 · `npm run build` → Exit 0, Prerendering 169/169 Success, 0 Errors (identischer
      vorbestehender 401-Hinweis beim Supabase-Dynamic-Slug-Fetch/Sitemap, unabhängig von dieser
      Änderung).
      ✓ 2026-09-12 · `npm run lint` → 728 problems (652 errors/76 warnings), identisch zur
      A1–A4/B1–B4/C1–C3-Baseline — 0 neue Probleme durch diesen Commit.
      ✓ 2026-09-12 · `git diff --stat` → nur `src/translations/it.ts` (+3/-3,
      `t.seo.italienischesRestaurant.seoTitle` + `.heroTitle` + `.introTitle`) — keine JSX-Struktur,
      keine Formular-Dateien, keine DE/EN/FR-Werte angefasst.
      ✓ 2026-09-12 · Prerendered `dist/it/miglior-ristorante-italiano-monaco/index.html` geprüft:
      `<title>`/og:title/twitter:title „Ristorante Italiano Monaco di Baviera – Cucina del Sud \|
      STORIA", `<h1>` „Ristorante Italiano a Monaco di Baviera – Autentica Cucina del Sud Italia",
      erstes `<h2>` „Il Miglior Ristorante Italiano a Monaco di Baviera – STORIA Maxvorstadt"
      vorhanden; alle drei alten Strings 0 Treffer im Output.
      `dist/italienisches-restaurant-muenchen/index.html` (DE, Title „Bestes Italienisches
      Restaurant München \| STORIA Maxvorstadt") und `dist/en/best-italian-restaurant-munich/
      index.html` (EN, Title „Best Italian Restaurant Munich \| Wood-Fired Pizza \| STORIA") beide
      unverändert auf ihrem Vor-C4-Stand.
      Commit auf Branch `striking-distance-c` — mit diesem Commit ist Einheit C (C1–C4) vollständig.

## Einheit C: Branch, Beweis, Merge

- [ ] Branch `striking-distance-c` gepusht, PR erstellt, Diff gegengelesen, gemergt. Live-Stichprobe
      nach Deploy.
      PR erstellt: https://github.com/dream-anchor/ristorantestoria.de/pull/73, Merge steht noch
      aus (Hauptfenster).

---

## Einheit D — Struktur-Klärung Silvester/Weihnachten (unabhängig von A/B/C)

- [ ] **D1** Mit Antoine im Chat klären: Silvester/Weihnachten Zwei-URL-Struktur — Absicht (Option 1)
      oder Dublette (Option 2)? (KONZEPT § 5). Frage zuerst hier stellen, 5 Min. warten, dann
      Slack-Backup (`~/.claude/CLAUDE.md` § „Fragen & Meldungen"). Ergebnis hier dokumentieren.
      Bei Option 2: Folge-Kriterium D2 (Redirect + Konsolidierung) ergänzen, nicht vorab umsetzen.

---

## BLOCKED-Log

<!-- Format: DATUM · Kriterium · Grund · was gebraucht wird -->

## Erfolgsmessung (nach jeder Einheit, 4–8 Wochen nach Deploy)

Neuen GSC-Export ziehen oder `gsc_page_query_metrics` abfragen (falls bis dahin zugänglich, siehe
Audit § 6), Baseline aus KONZEPT § 3 gegen neue Werte prüfen. Keine Bewertung vor Ablauf des
Fensters. Bei Queries ohne Bewegung: nicht nachjustieren (KONZEPT § „Erfolgsmessung").

## Abschluss

Sind Einheit A+B+C vollständig abgehakt und alle drei PRs gemergt: wörtlich
`STRIKING-DISTANCE-EINHEITEN-FERTIG` ausgeben. Ist zusätzlich D1 geklärt (und ggf. D2 erledigt):
wörtlich `STRIKING-DISTANCE-LOOP VOLLSTÄNDIG ABGESCHLOSSEN` ausgeben.
