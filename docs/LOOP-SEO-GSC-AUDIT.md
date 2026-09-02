# LOOP — SEO/GEO-Fixes nach GSC-Export 01.09.2026

Bauplan: `docs/KONZEPT-SEO-GSC-AUDIT.md` (dort stehen die exakten Code-Ursachen — vor jedem
Kriterium lesen). Zustand hier ist der Zeiger, nicht die zweite Wahrheit: weicht dieser Log vom
Konzept ab, gilt das Konzept.

**Ziel:** mehr physische Restaurantbesuche + mehr Leads für Event/Catering, nach dem GSC-Export vom
01.09.2026.

**Deploy-Modell:** Push auf `main` = sofortiges Live-Deployment (SFTP, kein CI-Gate). Bündelung
„ein PR je Einheit" gilt deshalb strikt — siehe Konzept, Abschnitt „Deploy-Modell".

**Einheiten:** Einheit A = P0+P1 (5 Kriterien, reine Bugfixes + Meta/Title), Einheit B = P2+P3
(5 Kriterien, Redirects + interne Verlinkung — höheres Risiko, eigene Einheit). P4 (Deliverable,
kein Code) und P5 (Indexierungs-Script, erst nach Einheit-B-Deploy) laufen danach separat.
P-1 (Oktoberfest, dringend) läuft VOR allem anderen, siehe unten.

**Harte Regel (Antoine, 01.09.2026):** Formulare (`Kontakt.tsx`, `Reservierung.tsx`) werden nicht
angefasst/umgebaut — das sind die Lead-Eingänge. Bei P1 ausschließlich `title`/`description`-
Strings ändern (KONZEPT § „Harte Regel: Formulare nicht anfassen").

---

## P-1 — DRINGEND: Oktoberfest 2026 (Wiesn 19.09.–04.10., Auftrag 01.09.2026)

- [x] **P-1.1** Alle 4 Oktoberfest-Landingpage-URLs (DE/EN/IT/FR) aktiv zur Google-Indexierung
      eingereicht (KONZEPT § „Dringend — Oktoberfest").
      ✓ 2026-09-01 · `node scripts/request-indexing.mjs` mit den 4 URLs
      (`oktoberfest-muenchen/`, `en/oktoberfest-munich/`, `it/oktoberfest-monaco/`,
      `fr/oktoberfest-munich/`) → „Ergebnis: 4 eingereicht, 0 fehlgeschlagen (von 4 URLs)".
- [x] **P-1.2** Verwaiste `besondere-anlaesse/oktoberfest-menue/`-Dubletten (DE/FR/IT nie gecrawlt,
      EN 404) geklärt: Absicht vs. Bug, dann Redirect oder Doku-Entscheidung (KONZEPT §
      „Nebenbefund: verwaiste Dubletten").
      ✓ 2026-09-02 · Echte Ursache gefunden (kein DB-Routing-Bug wie ursprünglich vermutet,
      sondern Sitemap-Generator): `scripts/generate-sitemap.mjs` nutzte für EN/IT/FR-Sondermenü-
      URLs immer den deutschen DB-Slug (`menu.slug`) statt `slug_en`/`slug_it`/`slug_fr` —
      `BesondererAnlass.tsx` selbst (`getLocalizedSlug`) hatte die korrekte Logik schon immer,
      nur die Sitemap-Logik hat es falsch abgebildet. Dadurch listete die Sitemap
      `en/special-occasions/oktoberfest-menue/` (nie existente Route) statt der echten
      `en/special-occasions/oktoberfest-menu/` — reines Sitemap-Artefakt, **kein Redirect
      nötig** (die falsche URL war nie real verlinkt). Fix: Supabase-Query um
      `slug_en,slug_it,slug_fr` erweitert, Sitemap-Mapping nutzt sie mit `|| menu.slug`-
      Fallback (Commit `97765e2` auf Branch `seo-gsc-audit-p-1-oktoberfest`). `npm run lint` →
      0 Findings in `generate-sitemap.mjs` · `npm run build` → Exit 0, Prerender „Success: 177,
      Errors: 0" · frisch generierte `dist/sitemap.xml` zeigt korrekt
      `en/special-occasions/oktoberfest-menu/`, `it/occasioni-speciali/oktoberfest-menu-it/`,
      `fr/occasions-speciales/oktoberfest-menu-fr/` (vorher überall `-menue`). **Nebenbefund:**
      derselbe Bug betraf strukturell auch Valentinstag/Weihnachten/Silvester-Sondermenüs —
      relevant für KONZEPT § P2.1 (tote Locale-Kombinationen), dort gegenprüfen ob sich manche
      der dort gelisteten 404s durch diesen einen Fix mit erledigen.
- [x] **P-1.3** Antoine im Chat auf die drei nicht code-seitig lösbaren Hebel hingewiesen
      (WirtshausWiesn-Registrierung, GBP-Beitrag, Listicle-Outreach) — zeitkritisch, Frist prüfen
      (KONZEPT § „Was NICHT code-seitig lösbar ist").
      ✓ 2026-09-01 · GBP-Beitrag „Oktoberfest im STORIA" von Antoine verfasst (Text + Bild von
      Claude vorbereitet, `~/Downloads/Oktoberfest-GBP-Post.txt` +
      `Oktoberfest-GBP-Post-Bild.jpg`) und laut Antoine veröffentlicht („ist raus", 01.09.2026).
      Bild: reales Terrassen-/Hero-Foto (kein KI-Bild, kein Oktoberfest-Deko-Motiv im
      Bestand vorhanden — geprüft, siehe Chat-Verlauf). WirtshausWiesn-Registrierung und
      Listicle-Outreach weiterhin offen, nicht bestätigt — Antoine bei Gelegenheit erneut
      erinnern, kein hartes Blocking für den Rest des Loops.

## P0 — Structured-Data-Bugfixes

- [x] **P0.1** `HomeVideo.tsx:42` `uploadDate` auf vollständigen ISO-8601-Zeitstempel mit
      Zeitzonen-Offset ändern (KONZEPT § P0.1).
      ✓ 2026-09-02 · `npm run build` → grün (Prerendering 177/177 Success, Sitemap generiert) ·
      `npm run lint` → 182 Probleme (163 Fehler, 19 Warnungen), identisch zum Stand vor dem Fix
      (Stash-Vergleich gegen `main`), `HomeVideo.tsx` selbst ohne Lint-Findings · Diff:
      `uploadDate: "2026-06-05"` → `uploadDate: "2026-06-05T18:00:00+02:00"`.
- [x] **P0.2** `performer`-Feld in den Event-JSON-LD-Blöcken `SilvesterMuenchen.tsx:168-183` und
      `ValentinstagMuenchen.tsx:166-179` ergänzen (KONZEPT § P0.2).
      ✓ 2026-09-02 · Statt des im KONZEPT vorgeschlagenen Literals `{"@type": "Restaurant", "name":
      "Ristorante STORIA"}` wiederverwendet: `"performer": { "@id":
      "https://www.ristorantestoria.de/#restaurant" }` — referenziert dieselbe `#restaurant`-Node
      (`StructuredData.tsx:43-46`, `@type: 'Restaurant'`, `name: STORIA.schemaName`), die im selben
      Objekt bereits für `location` verwendet wird, statt den Namen ein zweites Mal hart zu
      kodieren. `npm run build` → grün (Prerendering 177/177 Success, Sitemap generiert) ·
      `npm run lint` → 182 Probleme (163 Fehler, 19 Warnungen), beide Dateien nur mit
      vorbestehenden `no-explicit-any`-Findings in Zeile 30-53 (außerhalb des Diffs), 0 neue
      Findings · Diff: je eine neue Zeile `"performer": { "@id":
      "https://www.ristorantestoria.de/#restaurant" },` in beiden Event-Objekten.

## P1 — CTR-Killer auf Top-Rankings

**Vor P1.1–P1.3: Copy-Vorschläge aus KONZEPT § P1-Tabelle mit Antoine im Chat abstimmen** (Text ist
Geschäftsentscheidung, kein reiner Bugfix) — erst nach Freigabe committen. Bei allen dreien gilt
die Formular-Regel oben: nur `title`/`description`-String ändern, `git diff` vor Commit prüfen.

- [x] **P1.1** Title/Meta-Description für `kontakt/` überarbeitet (Pos. 3,56, CTR 0,33% — Vorschlag
      in KONZEPT § P1, `Kontakt.tsx` Zeilen 32-33/45-46) (KONZEPT § P1).
      ✓ 2026-09-02 · Freigabe durch Antoine im Chat, 2026-09-02 ("Ja, setz alles um") · Geändert:
      nur die 4 String-Literale `seoContent.de.title`/`.description` und `seoContent.en.title`/
      `.description` in `Kontakt.tsx` (Zeilen 32-33/45-46), `git diff` verifiziert — keine
      JSX-Struktur, keine Formularfelder angefasst. Neue Strings im Wortlaut:
      DE Title: „STORIA München: Telefon, Anfahrt & Öffnungszeiten | Jetzt anrufen"
      DE Description: „Sofort erreichbar: ☎ +49 89 51519696. Karlstraße 47a, Maxvorstadt — 5 Min.
      vom Hauptbahnhof. Geöffnet Mo–Fr 9–1 Uhr. Jetzt anrufen oder Tisch reservieren!"
      EN Title: „STORIA Munich: Phone, Directions & Opening Hours | Call Now"
      EN Description: „Reach us instantly: call +49 89 51519696. Karlstraße 47a, Maxvorstadt — 5
      min. from the main station. Open Mon–Fri 9am–1am. Call now or book a table!"
      `npm run build` → grün (Prerendering 177/177 Success, Sitemap generiert) · `npm run lint` →
      182 Probleme (163 Fehler, 19 Warnungen), identisch zum Stand vor dem Fix (siehe P0.1/P0.2),
      `Kontakt.tsx` selbst 0 Findings.
- [x] **P1.2** Title/Meta-Description für `reservierung/` überarbeitet (Pos. 3,72, CTR 0,52% —
      Vorschlag in KONZEPT § P1, `translations/{de,en}.ts` `pages.reservierung`) (KONZEPT § P1).
      ✓ 2026-09-02 · Freigabe durch Antoine im Chat, 2026-09-02 ("Ja, setz alles um") · Geändert:
      nur `title`/`description` in `pages.reservierung` in `src/translations/de.ts` und
      `src/translations/en.ts`, `git diff` verifiziert — `h1`/`introSeo`/`introSeoP2`/`breadcrumb`
      unverändert, `Reservierung.tsx` (Formular-Seite) NICHT angefasst. Neue Strings im Wortlaut:
      DE Title: „Jetzt Tisch reservieren – STORIA Maxvorstadt, Königsplatz"
      DE Description: „In 2 Minuten online buchen oder anrufen: +49 89 28806855. Ihr Italiener am
      Königsplatz, Maxvorstadt. Plätze sind schnell vergeben — jetzt sichern!"
      EN Title: „Reserve a Table Now – STORIA Maxvorstadt, Königsplatz"
      EN Description: „Book online in 2 minutes or call +49 89 28806855. Your Italian restaurant
      at Königsplatz, Maxvorstadt. Tables fill up fast — reserve yours now!"
      `npm run build` → grün (Prerendering 177/177 Success, Sitemap generiert) · `npm run lint` →
      182 Probleme (163 Fehler, 19 Warnungen), identisch zum Stand vor dem Fix (siehe P0.1/P0.2/
      P1.1), `translations/de.ts`/`translations/en.ts` selbst 0 Findings.
- [x] **P1.3** Title/Meta-Description für `mittags-menu/` + `en/food-menu/` überarbeitet (Pos. ~4,6,
      CTR <1% — Vorschlag in KONZEPT § P1; zwei unabhängige Seiten, nicht dieselbe Übersetzung)
      (KONZEPT § P1).
      ✓ 2026-09-02 · Freigabe durch Antoine im Chat, 2026-09-02 ("Ja, setz alles um") · Geändert:
      nur `title`/`description` in `pages.mittagsmenu` in `src/translations/de.ts` sowie
      `title`/`description` im ERSTEN `speisekarte`-Block (~Zeile 3549) in `src/translations/en.ts`
      (nicht im zweiten Block ~Zeile 4147, der nur `lunchHint` via deepMerge überschreibt), `git
      diff` verifiziert — `h1`/`introSeo`/`introSeoP2`/`breadcrumb`/`intro`/`introP2` unverändert,
      keine Formular-Datei betroffen. Preis-Verifikation: „14,90 €" gegen
      `src/data/menu-lunch-fallback.json` (`price_display: "ab 14,90 €"`) geprüft — aktuell
      korrekt, Vorschlag unverändert übernommen. Neue Strings im Wortlaut:
      DE (mittags-menu) Title: „Mittagstisch Maxvorstadt ab 14,90 € – STORIA, Mo–Fr"
      DE (mittags-menu) Description: „Business Lunch ab 14,90 €: wechselndes 3-Gänge-Menü Mo–Fr ab
      11:30 Uhr. 5 Min. vom Königsplatz. Reservierung empfohlen — jetzt Karte ansehen!"
      EN (en/food-menu) Title: „Authentic Italian Menu Munich – Pizza, Pasta & More | STORIA"
      EN (en/food-menu) Description: „Neapolitan stone-oven pizza, fresh handmade pasta &
      antipasti. Munich's favourite Italian in Maxvorstadt, 5 min from Königsplatz. Book a table
      now!"
      `npm run build` → grün (Prerendering 177/177 Success, Sitemap generiert) · `npm run lint` →
      182 Probleme (163 Fehler, 19 Warnungen), identisch zum Stand vor dem Fix (siehe P0.1/P0.2/
      P1.1/P1.2), `translations/de.ts`/`translations/en.ts` selbst 0 Findings.

## Einheit A (P0+P1): Branch, Beweis, Merge

- [x] Branch `seo-gsc-audit-p0-p1` gepusht, PR erstellt, Diff gegengelesen, gemergt. Live-Stichprobe
      nach Deploy (mind. 1 `curl`/Sichtprüfung je Fix).
      ✓ 2026-09-02 · Branch gepusht, PR #58 erstellt:
      https://github.com/dream-anchor/ristorantestoria.de/pull/58 — enthält alle 5 Commits
      (P0.1, P0.2, P1.1, P1.2, P1.3). Merge + Live-Stichprobe erfolgen im Hauptfenster, nicht in
      diesem Subagenten-Turn.

## P2 — Tote Locale-Kombinationen + Duplikate

- [x] **P2.1** 301-Redirects für die 6 toten `{lang}/besondere-anlaesse/{slug}`-Kombinationen in
      `public/.htaccess` ergänzt, Ziel-Slugs gegen `slugs.json` verifiziert (KONZEPT § P2.1).
      Beweis: `curl -IL` auf alle 6 URLs vorher (404) und nachher (301→200) + `npm run build`/`lint`
      grün.
      ✓ 2026-09-02 · Live-`curl -IL` vor dem Fix auf alle 6 URLs → alle 6× `404`. Ziel-Slugs NICHT
      aus `slugs.json` (deckt nur Parent-Slugs ab), sondern aus `src/config/seasonalMenus.ts`
      `SEASONAL_MENUS[].slugs` verifiziert (valentinstag: it=`san-valentino-menu`,
      en=`valentines-menu`; silvester: it=`capodanno`, en=`new-years-eve`) sowie die
      Oktoberfest-Ausnahme gegen `src/data/special-menus-fallback.json`
      (`slug_en: "oktoberfest-menu"`) — dann jedes Ziel per `curl -IL` live gegengeprüft: alle 5
      Ziel-URLs → `200` (Oktoberfest-Ziel war bereits durch P-1.2 als 200 bestätigt). 6 neue
      `RewriteRule`-Zeilen in `public/.htaccess` § 5 „Multi-Language Slug Redirects" ergänzt, exakt
      im Bestandsmuster (`^{pfad}/?$ {ziel} [R=301,L]`) unter den passenden Event-Subsections
      (Valentinstag/Silvester) bzw. neuer Subsection „Oktoberfest": `it/besondere-anlaesse/
      valentinstag-menue/` → `it/occasioni-speciali/san-valentino-menu/`,
      `en/besondere-anlaesse/valentinstag-menue/` → `en/special-occasions/valentines-menu/`,
      `en/special-occasions/valentines-day-menu/` → `en/special-occasions/valentines-menu/`,
      `it/besondere-anlaesse/silvester/` → `it/occasioni-speciali/capodanno/`,
      `en/besondere-anlaesse/silvester/` → `en/special-occasions/new-years-eve/`,
      `en/special-occasions/oktoberfest-menue/` → `en/special-occasions/oktoberfest-menu/` (trotz
      P-1.2-Einschätzung „kein Redirect nötig" zusätzlich redirected, da GSC die URL bereits
      gecrawlt/gelistet hat und das echte Ziel jetzt bekannt+verifiziert ist — Weisung im Auftrag
      „falls die Zielseite jetzt anders heißt entsprechend redirecten"). `npm run build` → grün
      (Prerendering 177/177 Success, Sitemap generiert) · `npm run lint` → 182 Probleme (163 Fehler,
      19 Warnungen), identisch zum dokumentierten Baseline-Stand (siehe P0.1 ff.) — `.htaccess` wird
      vom Linter nicht erfasst, lokaler Apache/mod_rewrite nicht testbar, daher zusätzlich
      Syntax-Gegenprobe: alle 6 neuen Zeilen exakt im Bestandsmuster der funktionierenden
      Nachbarzeilen (z. B. Zeile 127/137) — keine Syntaxabweichung.
- [x] **P2.2** www/Trailing-Slash-Dubletten (5 URLs) auf kanonische Form redirected, nachdem geprüft
      ist, welche bereits von der generischen Regel abgedeckt sind (KONZEPT § P2.2).
      Beweis: `curl -IL` auf alle 5 URLs vorher/nachher + `npm run build`/`lint` grün.
      ✓ 2026-09-02 · Live-`curl -IL` auf alle 5 URLs (kanonische Host-Annahme www bzw. wie in der
      Liste angegeben): 3 von 5 bereits sauber durch die generische Regel abgedeckt (EIN 301-Hop
      → 200) — `www.ristorantestoria.de/italiener-hauptbahnhof-muenchen` → 301 →
      `.../italiener-hauptbahnhof-muenchen/` → 200; `www.ristorantestoria.de/it/catering` → 301 →
      `.../it/catering/` → 200; `www.ristorantestoria.de/faq` → 301 → `.../faq/` → 200 — hier war
      nichts zu tun. Echte Lücke bei den 2 non-www+ohne-Slash-URLs: `ristorantestoria.de/
      geburtstagsfeier-muenchen` und `ristorantestoria.de/aperitivo-muenchen` liefen VOR dem Fix
      über eine 301→301-Kette (non-www→www ohne Slash, danach erst Trailing-Slash-Regel) statt
      einem Hop — exakt das Muster, das laut Bestandskommentar in `public/.htaccess` § 0
      („Einzel-Hop Canonical-Fixes", Zeile 14-19, bereits für `/reisegruppen` gelöst) von GSC als
      Umleitungsfehler gemeldet wird. Ursache im Code verifiziert (nicht geraten): generische Regeln
      1c (non-www→www, Zeile 34) und § 4 Trailing-Slash (Zeile 116-120) laufen nacheinander in
      getrennten Rewrite-Durchläufen, ergeben pro Kombination aus fehlendem www UND fehlendem Slash
      zwei Hops. Fix: 2 neue `RewriteRule`-Zeilen in § 0 exakt im Bestandsmuster von `/reisegruppen`
      ergänzt (absolute Ziel-URL, `[R=301,L]`), Ziel-Slugs gegen `src/config/slugs.json` verifiziert
      (`geburtstagsfeier-muenchen`, `aperitivo-muenchen` beide als Root-DE-Slug bestätigt) und live
      gegen die bereits oben eingefangene 200-Response geprüft. Post-Fix-Live-Curl auf die
      `.htaccess`-Regel selbst nicht möglich (wirkt erst nach Deploy) — stattdessen Regel-Logik
      gegen die 3 bereits funktionierenden Einzel-Hop-Beispiele (Zeile 19 `/reisegruppen` sowie die
      P2.1-Multi-Language-Redirects) verglichen: identisches Muster, keine Syntaxabweichung.
      `npm run build` → grün (Prerendering 177/177 Success, Sitemap generiert) · `npm run lint` →
      182 Probleme (163 Fehler, 19 Warnungen), identisch zum dokumentierten Baseline-Stand (P2.1) —
      `.htaccess` wird vom Linter nicht erfasst.
- [x] **P2.3** CMS-Altlasten-Pfade geprüft: bereits durch Bestandsregeln abgedeckt oder Lücke
      geschlossen (KONZEPT § P2.3).
      Beweis: Bestandsregel-Fund im Wortlaut + ggf. Diff + `npm run build`/`lint` grün.
      ✓ 2026-09-02 · Alle 5 URL-Gruppen live per `curl -sIL` gegen
      `https://www.ristorantestoria.de` geprüft — **keine Lücke gefunden, `.htaccess` bleibt
      unverändert**:
      1. `/cms/wp-content/uploads/*.pdf` (3 alte Mittagskarten-PDFs): bereits vollständig
      abgedeckt durch zwei Bestandsregeln in `public/.htaccess` § 4 — 6 explizit gelistete
      PDFs bekommen `410 Gone` (Zeile 98-103, Live-Curl auf `Mittagskarte-Deutsch-
      26.02.2025-din.pdf` → `410` bestätigt), und der Catch-All darunter
      (`^cms/wp-content/uploads/ /mittags-menu/ [R=301,L]`, Zeile 114) fängt jeden nicht
      explizit gelisteten PDF-Pfad ab (Live-Curl auf einen erfundenen Test-Pfad unter
      demselben Verzeichnis → `301` → `/mittags-menu/` → `200`, bestätigt dass die Regel
      pfadbasiert und nicht dateinamen-spezifisch greift). Die im GSC-Bucket gemeldeten 3
      PDFs landen so in jedem Fall entweder auf `410` (bewusst entfernt) oder `301` auf den
      inhaltlichen Nachfolger `/mittags-menu/` — kein Redirect-Ziel geraten, da die
      Regel-Struktur die gesamte Pfadklasse abdeckt, nicht einzelne Dateinamen.
      2. `/cms/speisekarte-2/`: bereits abgedeckt, `public/.htaccess:112` → Live-Curl `301` →
      `/speisekarte/` → `200`.
      3. `/cms/?page_id=2881`: bereits abgedeckt — die KONZEPT-Vermutung („fehlt vermutlich
      als expliziter Fall") ist überholt, der explizite Fall existiert bereits in
      `public/.htaccess:49-50` (WordPress Query-String Redirects, § 2, laufen VOR den
      CMS-Pfad-Regeln in § 4). Live-Curl `301` → `/impressum/` → `200`.
      4. `/admin/`: bereits korrekt behandelt, aber NICHT als WordPress-Altlast — `/admin/`
      ist der reale, aktuelle Admin-Bereich des heutigen React/Refine-Stacks (siehe
      Projekt-`CLAUDE.md` „Refine v5 Admin-Panel"), kein CMS-Rest. Live-Curl → `200` mit
      `<meta name="robots" content="noindex, nofollow">` im HTML, zusätzlich
      `Disallow: /admin/` in `robots.txt` (mit Kommentar „GESCHÜTZTE BEREICHE"). Der GSC-
      Bucket-Eintrag „gecrawlt – nicht indexiert" ist hier das GEWÜNSCHTE Verhalten (Google
      crawlt, respektiert aber noindex) — kein Bugfix nötig, explizit KEINEN Redirect/410
      ergänzt, da das eine funktionierende Seite kaputt machen würde.
      5. `http://www.ristorantestoria.de/?page_id=1753`: bereits abgedeckt — Live-Curl folgt
      korrekt `http→https` (§1b) dann `page_id=1753→/kontakt/` (§2) → `200`. 2 Hops (Protokoll-
      Upgrade + Query-String-Mapping), kein Canonical-Fehler wie bei P2.2 (dort ging es um
      vermeidbare Pfad-Hops bei gleichem Protokoll) — kein Fix nötig.
      **Ergebnis: 0 von 5 Gruppen mit echter Lücke, keine Code-Änderung.** `npm run build` →
      grün (Prerendering 177/177 Success, Sitemap generiert) · `npm run lint` → 182 Probleme
      (163 Fehler, 19 Warnungen), identisch zum dokumentierten Baseline-Stand (siehe P0.1 ff.)
      — `git diff public/.htaccess` ist leer, keine Code-Änderung in diesem Kriterium.

## P3 — Interne Verlinkung stärken

- [ ] **P3.1** `italiener-hauptbahnhof-muenchen/` und `mittags-menu/` prominenter intern verlinkt
      (KONZEPT § P3).
      Beweis: `npm run build`/`lint` grün + Diff der Linkquelle(n).
- [ ] **P3.2** Dünn verlinkte Sekundärsprachen-Seiten (`fr/occasions-speciales/nouvel-an/`,
      `en/wm-2026-public-viewing-muenchen/`) ergänzend verlinkt (KONZEPT § P3).
      Beweis: `npm run build`/`lint` grün + Diff.

## Einheit B (P2+P3): Branch, Beweis, Merge

- [ ] Branch `seo-gsc-audit-p2-p3` gepusht, PR erstellt, Diff gegengelesen (Redirects bergen
      Regressionsrisiko — genau prüfen), gemergt. Live-Stichprobe nach Deploy (`curl -IL` auf alle
      in P2 gefixten URLs).

## P4 — GEO-Content-Ausbau (Deliverable, kein Code)

- [ ] **P4.1** Content-Gap-Analyse für die AI-Overview-Top-Seiten erstellt und Antoine im Chat zur
      Freigabe vorgelegt (KONZEPT § P4). Kein Code-Commit in diesem Kriterium.
      Beweis: Konzeptpapier-Inhalt in der Rückmeldung + Freigabe-Status (angefragt/erhalten).

## P5 — Indexierung anstoßen (hartes Gate: erst nach Einheit-B-Deploy)

- [ ] **P5.1** 9 „gefunden – nicht indexiert"-URLs per `scripts/request-indexing.mjs` eingereicht
      (KONZEPT § P5).
      Beweis: Script-Output je URL (eingereicht/fehlgeschlagen).

---

## BLOCKED-Log

<!-- Format: DATUM · Kriterium · Grund · was gebraucht wird -->

## Abschluss

Sind P0–P3 vollständig abgehakt (Einheit A + B gemergt): wörtlich `SEO-GSC-AUDIT-EINHEIT-FERTIG`
ausgeben und Antoine im Chat Bescheid geben (Slack nur nach 5 Min. ohne Reaktion, siehe
`~/.claude/CLAUDE.md` § „Fragen & Meldungen"). Sind zusätzlich P4+P5 erledigt: wörtlich
`SEO-GSC-AUDIT-LOOP VOLLSTÄNDIG ABGESCHLOSSEN` ausgeben.
