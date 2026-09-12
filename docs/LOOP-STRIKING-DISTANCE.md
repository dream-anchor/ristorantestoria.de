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
- [ ] **B2** Italienisches Restaurant München, DE (`italienisches-restaurant-muenchen/`) — Title/H1/H2
      anpassen (KONZEPT § B2, größte Einzel-Phrase-Lücke im Audit).
- [ ] **B3** Italiener Königsplatz (`italiener-koenigsplatz/`) — Title/H1/H2 anpassen, „Maxvorstadt"
      ergänzen (KONZEPT § B3).
- [ ] **B4** Italiener Hauptbahnhof (`italiener-hauptbahnhof-muenchen/`) — nur H2 anpassen, Title/H1
      bewusst unverändert (KONZEPT § B4).

## Einheit B: Branch, Beweis, Merge

- [ ] Branch `striking-distance-b` gepusht, PR erstellt, Diff gegengelesen, gemergt. Live-Stichprobe
      nach Deploy.

---

## Einheit C — kleinere Cluster + IT-Markt

**Vor C1–C4: Copy-Tabelle aus KONZEPT § C1–C4 im Chat abstimmen.**

- [ ] **C1** Neapolitanische Pizza München (`neapolitanische-pizza-muenchen/`) — nur „beste" in H1
      ergänzen. **Kein** Holzofen-Synonym (Korrektur 12.09.2026) (KONZEPT § C1).
- [ ] **C2** Aperitivo München (`aperitivo-muenchen/`) — nur H2 anpassen (KONZEPT § C2).
- [ ] **C3** Geburtstagsfeier München DE (`geburtstagsfeier-muenchen/`) + EN
      (`en/birthday-party-munich/`) — DE: H2 anpassen (KONZEPT § C3). EN: **erst Title/H1/H2 live
      nachlesen** (war nicht Teil der Erstrecherche), dann analog fixen.
- [ ] **C4** IT Ristorante-Cluster (`it/miglior-ristorante-italiano-monaco/`) — Title/H1/H2 anpassen
      (KONZEPT § C4, zweitgrößte Einzel-Phrase-Lücke).

## Einheit C: Branch, Beweis, Merge

- [ ] Branch `striking-distance-c` gepusht, PR erstellt, Diff gegengelesen, gemergt. Live-Stichprobe
      nach Deploy.

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
