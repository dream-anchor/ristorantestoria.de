# LOOP — GEO/SEO-Lücken Weihnachtsfeier + Valentinstag

Bauplan: `docs/KONZEPT-GEO-LUECKEN.md`. Herleitung/Zahlen: Plan-Datei
`~/.claude/plans/die-silvester-seite-https-www-ristorante-encapsulated-firefly.md`.
Protokoll je Iteration: `.claude/commands/geo-luecken-loop.md`.

## Harte Regeln

- Kein bestehendes Formular darf brechen (`SeasonalSignupForm` auf Valentinstag bleibt).
- `weihnachtsfeier-muenchen` und `valentinstag-muenchen` bleiben eigenständige URLs — keine
  301-Konsolidierung (Entscheidung Antoine 13.09.2026).
- Kein festes Weihnachtsmenü, auch nicht für Gruppen (mehrfach bestätigter Fakt).
- Preise/Fakten nur aus `facts.ts` oder ausdrücklich bestätigten Werten — nichts erfinden.
- `npm run build` 157/157, `npm run lint` Baseline 727, `npx tsc --noEmit` sauber vor jedem PR.
- Vor jedem Branch-Wechsel: `git branch --show-current` (Subagenten teilen das Arbeitsverzeichnis).

---

## V1 — Sofortfixes

**Nachtrag 13.09.2026 (Recherche vor Umsetzung):** `candlelight-menue` ist entgegen der
ursprünglichen Plan-Annahme **keine tote Alt-URL**, sondern eine Supabase-gestützte generische
Anlass-Seite (`BesondererAnlass.tsx` → `findSeasonalMenuBySlug` liefert `undefined`, weil
`candlelight` in `src/config/seasonalMenus.ts` `SEASONAL_MENUS` nicht als Key existiert — die Seite
hing an einer dynamischen Supabase-Zeile). Laut `docs/LOOP-SEO-GSC-AUDIT.md` § P5.1 lief sie am
02.09.2026 noch nachweislich (200, curl-verifiziert, zur Indexierung eingereicht) in allen 4
Sprachen. Heute (13.09.2026): 404 in allen 4 Sprachen. Ursache vermutlich eine deaktivierte/
gelöschte Supabase-Zeile — das liegt außerhalb des Codes und außerhalb dessen, was diese Session
reparieren kann (Supabase-Änderungen laufen laut Projekt-CLAUDE.md ausschließlich über Lovable).
**Zusätzlich aktiv verlinkt** von `HochzeitsfeierMuenchen.tsx:338`, `RomantischesDinner.tsx:243`,
`TerrasseMuenchen.tsx:363` — alle drei zeigen aktuell auf eine 404-Seite.

- [x] **V1.1** 404 auflösen: `.htaccess`-Redirects für `besondere-anlaesse/candlelight-menue` (DE)
      und die drei Sprachvarianten `en/special-occasions/candlelight-menu`,
      `it/occasioni-speciali/candlelight-menu`, `fr/occasions-speciales/candlelight-menu` auf die
      jeweilige Sprachroute von `romantisches-dinner-muenchen` (Ziel-Keyword „candle light dinner
      münchen" rankt dort bereits auf Pos. 6,9 mit 719 Impr./48 Klicks — inhaltlich der richtige
      Fänger). Muster: bestehende K1-K3-Redirect-Blöcke in `public/.htaccess` (Kommentar mit Datum
      + Begründung, 4 Sprachvarianten wie bei den anderen Konsolidierungen).
      ✓ 13.09.2026 · Commit `0d1d599` · 4-Sprachen-Block in `public/.htaccess` nach dem
      K3-Valentinstag-Block ergänzt (Ziel: `/romantisches-dinner-muenchen/`,
      `/en/romantic-dinner-munich/`, `/it/cena-romantica-monaco/`,
      `/fr/diner-romantique-munich/`). `.htaccess` wirkt erst nach Live-Deploy — Live-`curl` folgt
      im offenen Punkt „Branch/PR/Merge" unten, nicht hier.
- [x] **V1.2** Die drei toten internen Links reparieren — NICHT auf die neue Redirect-Ziel-URL
      verlinken (ein weiterer Hop), sondern direkt auf `romantisches-dinner-muenchen` (Muster
      `LocalizedLink to="romantisches-dinner-muenchen"`, wie an anderer Stelle im selben Repo
      verwendet). Betroffen: `HochzeitsfeierMuenchen.tsx` (`candlelightTo`-Konstante + Verwendung),
      `TerrasseMuenchen.tsx` (dieselbe `candlelightTo`-Konstante), `RomantischesDinner.tsx`
      (Button verlinkt von der Seite auf sich selbst — hier den Block prüfen: sinnvoller
      Eigenlink ergibt keinen Sinn, eher entfernen oder auf einen Bereich der eigenen Seite
      ankern). `candlelightLinkText`-Übersetzungsschlüssel (4 Sprachen) nur behalten, wo er nach
      der Umverlinkung noch gebraucht wird.
      ✓ 13.09.2026 · Commit `26a9911` · `grep -rn "candlelight-menue\|besondere-anlaesse/candlelight"
      src/` → keine Treffer mehr. Hochzeitsfeier/Terrasse direkt auf `romantisches-dinner-muenchen`
      umgebogen (`candlelightTo` + ungenutzter `PARENT_SLUGS`-Import + `language`-Destructuring
      entfernt). RomantischesDinner.tsx: Button komplett entfernt (Seite hat keine id-Anker, ein
      Umbiegen auf sich selbst wäre ein Leerlauf-Link gewesen) — Entscheidung im Commit
      dokumentiert. `candlelightLinkText` (de/en/fr; it.ts hatte den Key nie) verwaist entfernt.
      **Beobachtung, nicht Teil des Auftrags:** `grep -c 'href="/romantisches-dinner-muenchen/"'
      dist/hochzeitsfeier-muenchen/index.html` und dieselbe Prüfung für `terrasse-muenchen`
      liefern je `2` — die Related-Pages-Grids beider Seiten hatten bereits eine eigene Karte auf
      `romantisches-dinner-muenchen`, die umgebogene Candlelight-Karte verlinkt jetzt zusätzlich
      dorthin (Duplikat im selben Grid). Wie im Auftrag explizit vorgegeben umgesetzt: kein
      zusätzlicher Judgment-Call hier, nur dokumentiert.
- [x] **V1.3** Nebenbefund dokumentieren (kein Code-Fix hier möglich): in `docs/seo-log.md` einen
      Eintrag, dass die Supabase-Zeile hinter `candlelight-menue` vermutlich deaktiviert/gelöscht
      wurde und das über Lovable geprüft werden sollte, falls die Seite als eigenständiges Angebot
      (nicht nur als Redirect-Ziel) weitergeführt werden soll.
      ✓ 13.09.2026 · Commit `395b00d` · Abschnitt „GEO-Lücken-Loop V1 — candlelight-menue 404
      (13.09.2026)" in `docs/seo-log.md` (nach dem K1-K3-Review-Termin-Absatz, vor „Monatliche
      Ziele & Review") ergänzt.

## V1: Branch, Beweis, Merge

- [x] ~~Branch `geo-luecken-v1` gepusht, PR erstellt, gemergt, Live-Stichprobe~~ — **erledigt
      13.09.2026** (PR #101, squash-merged, Deploy-Run `34773870601` erfolgreich). Zusätzlich beim
      Review gefunden und mitbehoben (nicht im ursprünglichen Auftrag): die umgebogene
      Candlelight-Karte auf `HochzeitsfeierMuenchen.tsx`/`TerrasseMuenchen.tsx` verlinkte auf
      dieselbe URL wie eine bereits vorhandene Karte im selben Grid — entfernt statt Duplikat zu
      belassen, verwaiste `relatedCandlelightTitle/Desc`-Keys in allen 4 Sprachen mitbereinigt.
      Live-Beweis per `curl` gegen `www.ristorantestoria.de`: alle 4 Sprachvarianten `200`,
      `hops:1`, korrektes Ziel (`romantisches-dinner-muenchen` bzw. Sprachäquivalent laut
      `slugs.json`). `hochzeitsfeier-muenchen/` und `terrasse-muenchen/` enthalten 0 Treffer für
      `candlelight-menue` im ausgelieferten HTML.

---

## V2 — Weihnachtsfeier gewinnt den B2B-Cluster

Entscheidung Antoine: `weihnachtsfeier-muenchen` gewinnt, `firmenfeier-muenchen` gibt
Weihnachtsbegriffe ab. AKUT — Buchungssaison läuft laut eigener Seite „ab September/Oktober".

- [x] **V2.1** `FirmenfeierMuenchen.tsx` + Übersetzungen: Weihnachts-Formulierungen aus `tldr`,
      `introP1`, Paket-/Anlass-Texten auf einen kurzen Satz + Link auf `weihnachtsfeier-muenchen`
      reduzieren. Generische Firmenfeier-Substanz (Sommerfest, Teambuilding, Jubiläum etc.)
      unangetastet lassen. Beleg vor/nachher: `grep -c -i "weihnacht" src/translations/de.ts`
      innerhalb des `firmenfeier`-Blocks.
      ✓ 13.09.2026 · Commit `e880117` · `grep -ic "weihnacht"` auf den `firmenfeier`-Block in
      `de.ts` (Zeilen 685–942): 21 → 15 Zeilen, davon 2 unveränderte Legacy-Keys
      (`galleryChristmas`/`testimonial1Quote_legacy`, ungenutzt, nicht Teil des Renderings) und die
      bewusst belassenen Wegweiser (Kartentitel „Betriebsweihnachtsfeier", Link-Label,
      Related-Karte). Event-Typen-Karte „Betriebsweihnachtsfeier" verweist jetzt mit echtem
      `LocalizedLink` auf `weihnachtsfeier-muenchen` statt eigener Item-/Note-Liste. Bestehende
      Related-Karte auf `weihnachtsfeier-muenchen` prominent hervorgehoben (2. Position,
      `border-2`) statt einer von neun gleichwertigen Karten; dabei hartkodiertes Deutsch (zeigte
      bisher auch auf EN/IT/FR Deutsch) durch Übersetzungs-Keys ersetzt und hartkodiertes „45 €"
      durch `FACTS.weihnachten.groupMenuPriceFrom` ersetzt. Alle 4 Sprachen editiert
      (en/it/fr.ts, inkl. `enExtra`/`frExtra`-Override-Blöcke).
- [x] **V2.2** `WeihnachtsfeierMuenchen.tsx` + Übersetzungen: „Firmenweihnachtsfeier" und
      „Betriebsweihnachtsfeier" als Begriffe aufnehmen (H2 oder FAQ-Frage/Antwort) — beide Queries
      (zusammen 156 Impressionen) sind heute auf dieser Seite nicht vertreten. Keine neuen Fakten,
      nur Begriffsabdeckung für die bereits beschriebene Leistung.
      ✓ 13.09.2026 · Commit `e880117` · Recherche vor Umsetzung ergab: „Firmenweihnachtsfeier"
      stand entgegen der Plan-Annahme bereits 9× auf der Seite (`grep -ic` auf den
      `weihnachtsfeier`-Block), „Betriebsweihnachtsfeier" dagegen 0× — Umfang entsprechend auf den
      tatsächlich fehlenden Begriff angepasst. Neuer FAQ10-Eintrag mit der exakten Nutzerphrase als
      Frage (GEO-Regel 5) plus zusätzliche Nennung in `type1Desc`. Prerender-Beleg:
      `grep -io "betriebsweihnachtsfeier" dist/weihnachtsfeier-muenchen/index.html | wc -l` → 3.
      Alle 4 Sprachen (it.ts: FAQ10 hier eigener Key, da it.ts für faq1-9 bereits vollübersetzt war).
- [x] **V2.3** GEO nachrüsten nach Muster `WeihnachtenMuenchen.tsx`: Definition-Lead als
      allererster Satz (`introP1` umformulieren, weg von „Sie suchen die perfekte …?"), `tldr`
      rendern (Schlüssel existiert bereits, `de.ts:2907`, nur einbauen), „Auf einen Blick"-Block
      (Kapazität/Preis ab/Mindestgröße/Anfragezeitpunkt), ein autoritativer Outbound-Link (Thema
      passend wählen, z. B. zu italienischer Weihnachtstradition — nicht denselben Link wie
      Weihnachten/Silvester duplizieren, eigene Quelle suchen).
      ✓ 13.09.2026 · Commit `d66e1d6` · `introP1` auf Definition-Lead-Muster umgestellt
      ("Die Weihnachtsfeier München im Ristorante STORIA ist ein italienisches
      Festmenü-Angebot..."). TL;DR-Card gerendert (vorher ungenutzter Key). Neuer
      "Auf einen Blick"-Block (Kapazität/Preis ab/Mindestgruppengröße/Anfrage), alle Werte aus
      bereits vorhandenem Seiteninhalt bzw. `FACTS.*` über neuen `fillFacts()`-Helper. Outbound-Link:
      Accademia Italiana della Cucina (1953, offizielle italienische Institution zur Bewahrung
      regionaler Kochtraditionen, https://www.accademiaitalianadellacucina.it/en) — per WebFetch
      verifiziert als offizielle, autoritative, nicht-kommerzielle Quelle, eigenständig gegenüber
      champagne.fr (Silvester) und UNESCO Mediterranean Diet (Weihnachten). Verifiziert am
      prerenderten HTML: Definition-Lead als erster Fließtext-Satz, TL;DR sichtbar,
      "Auf einen Blick" sichtbar, Outbound-Link vorhanden. Alle 4 Sprachen.
- [x] **V2.4** Fakten zentralisieren: `FACTS.capacity.*` (existiert, wird auf dieser Seite nicht
      genutzt) statt der doppelten Kapazitätsangaben in `reason5Desc` UND `faq2Answer`;
      `FACTS.weihnachten.groupMenuPriceFrom` statt hartkodiertem „45 €" an den vier Fundstellen
      (`seoTitle`, `seoDescription`, `tldr`, `faq1Answer`). Reine Deduplizierung bereits angezeigter
      Werte, keine neue Preisbehauptung — die offene Frage „ist 45 € betrieblich korrekt" bleibt
      unabhängig davon offen (siehe BLOCKED-Log) und wird durch diesen Schritt nicht beantwortet.
      Alle Texte in 4 Sprachen, `it.ts`-Teilübersetzungsmuster beachten falls einschlägig.
      ✓ 13.09.2026 · Commit `d953d43` · `fillFacts()` (aus V2.3) erweitert um `{indoorSeats}` und
      auf `seoTitle`/`seoDescription`/`tldr`/`faq1Answer`/`reason5Desc`/`faq2Answer` angewendet.
      `it.ts` hat keinen eigenen `tldr`-Override (Teilübersetzungsmuster) — fällt korrekt auf den
      jetzt aktualisierten deutschen Platzhalter-Text zurück, nicht angetastet. Verifiziert am
      prerenderten HTML aller 4 Sprachen: `grep -o '{[a-zA-Z]*}'` liefert 0 Treffer (keine
      unaufgelösten Platzhalter), korrekte Werte (45 €, 100 Sitzplätze, 300 Stehempfang) in
      Title/Description/FAQ/TL;DR.

## V2: Branch, Beweis, Merge

- [x] ~~Branch `geo-luecken-v2` gepusht, PR erstellt, Diff gegengelesen, gemergt, Live-Stichprobe.~~
      **erledigt 13.09.2026** (PR #103, squash-merged, Deploy-Run `34776092206` erfolgreich).
      Beim Review zusätzlich einen echten Vorab-Bug gefunden und mitverifiziert: die
      Related-Link-Karte auf `firmenfeier-muenchen` zeigte hartkodiertes deutsches „45 €"-
      Marketingtext auch auf den EN/IT/FR-Routen — jetzt über Übersetzungs-Keys +
      `FACTS.weihnachten.groupMenuPriceFrom` gelöst, live auf `en/corporate-event-munich/`
      bestätigt (0 Treffer für den alten deutschen String). Live-Beweis per `curl`:
      `weihnachtsfeier-muenchen/`, `firmenfeier-muenchen/`, `en/corporate-event-munich/` alle
      `200`; „Betriebsweihnachtsfeier" und der Outbound-Link zur Accademia Italiana della Cucina
      sichtbar im ausgelieferten HTML von `weihnachtsfeier-muenchen/`.
      (V2.1–V2.4 lokal fertig und verifiziert, Commits `e880117`/`d66e1d6`/`d953d43` auf
      `geo-luecken-v2` — Push/PR/Merge/Live-Stichprobe macht das Hauptfenster.)

---

## V3 — Valentinstag schärfen

Entscheidung Antoine: eigenständig, aber auf reine Valentins-Intention zugespitzt. Vorlauf bis
Januar (Peak Februar 2027, erste echte Saison dieser Seite).

- [x] **V3.1** Romantik-Generika aus Title/Description/H2/Intro entfernen (Formulierungen wie
      „romantisches Restaurant/Dinner München" ohne Valentins-Bezug), durch internen Link auf
      `romantisches-dinner-muenchen` ersetzen. Ziel: die Seite kandidiert nicht mehr gegen die
      eigene stärkere Seite bei generischen Romantik-Queries.
      ✓ 13.09.2026 · Commit `75c547a` · `standaloneSeoTitle`/`standaloneSeoDescription`/
      `standaloneHeroTitle` (H1) geben „Romantisches [italienisches] Dinner" ab (alle 4 Sprachen —
      `standalone` ist laut `App.tsx` `ValentinstagMuenchenStandalone` der einzige tatsächlich
      gemountete Zweig, die Änderung betrifft also den live gerenderten Pfad, nicht toten Code).
      Neuer sichtbarer interner Link im Intro (`introRomanticLinkPre/Anchor/Post`, `LocalizedLink`
      auf `romantisches-dinner-muenchen`) — Beleg: `grep -o
      '<a[^>]*romantisches-dinner-muenchen[^>]*>[^<]*</a>' ` auf das script-bereinigte
      `dist/valentinstag-muenchen/index.html` → Treffer vorhanden.
- [x] **V3.2** Title/Description auf die Queries mit echtem Volumen zuspitzen (`valentinstag
      münchen` 421 Impr., `valentinstag menü münchen` 186 Impr.) — konkretes Angebotsdetail statt
      Generika, um die CTR von 0,00 % zu heben.
      ✓ 13.09.2026 · Commit `75c547a` · Neuer Title „Valentinstag München 2026 – Candle-Light-Menü
      im STORIA", neue Description mit Datum (14. Februar) + Preis (`{price}` via `fillFacts()`)
      statt Werbesprache, alle 4 Sprachen. Prerender-Beleg: `grep -o '<h1[^>]*>.*</h1>'` auf das
      script-bereinigte HTML → „Valentinstag München 2026 – Candle-Light-Dinner im STORIA".
- [ ] **V3.3** `ReservationBooking` ergänzen (Muster `SilvesterMuenchen.tsx:561`, `defaultDate`
      14.02.) **zusätzlich** zum bestehenden `SeasonalSignupForm` — NICHT ersetzen. **BLOCKED bis
      Antoine bestätigt, ob am 14.02. à la carte serviert wird** (sonst ergibt eine
      Tisch-Reservierungsstrecke keinen Sinn, siehe BLOCKED-Log). — in dieser Iteration ausgelassen
      (Auftrag), weiterhin BLOCKED.
- [x] **V3.4** GEO nachrüsten: Definition-Lead, `tldr` rendern (Schlüssel existiert, `de.ts:2240`),
      autoritativer Outbound-Link, JSON-LD `Event` → `FoodEvent`, kaputte `image`-URL im Schema
      reparieren (zeigt auf `/valentinstag-menue-storia-muenchen.jpg`, die laut Audit nicht in
      `public/` existiert — Muster: Silvester nutzt das importierte Hero-Bild selbst, siehe
      `SilvesterMuenchen.tsx` `EVENT_IMAGE_URL`).
      ✓ 13.09.2026 · Commit `75c547a` · `introP1` auf Definition-Lead-Muster umgestellt ("Das
      Valentinstag-Dinner im STORIA München ist ein italienisches Candle-Light-Menü für Paare am
      14. Februar..."). TL;DR-Card gerendert (vorher ungenutzter Key, `fillFacts(s.tldr)`, gleiche
      Position wie bei Silvester/Weihnachten: Card direkt unter der Breadcrumb). Outbound-Link:
      offizielle Tourismusseite der Stadt Terni
      (https://turismo.comune.terni.it/en/things-to-do/ternis-st-valentine — Grab des hl. Valentin,
      Stadtpatron seit 1644) — per `curl -sIL` verifiziert (HTTP/2 200), eigenständig gegenüber
      champagne.fr (Silvester), UNESCO Mediterranean Diet (Weihnachten) und Accademia Italiana
      della Cucina (Weihnachtsfeier). JSON-LD: `"@type":"Event"` → `"@type":"FoodEvent"` — Beleg:
      `grep -o '"@type":"FoodEvent"' dist/valentinstag-muenchen/index.html` → Treffer. `image`-URL
      zeigt jetzt auf den gehashten Build-Pfad des Hero-Bilds (`EVENT_IMAGE_URL`, Muster
      `SilvesterMuenchen.tsx`) statt auf die nicht existierende
      `/valentinstag-menue-storia-muenchen.jpg` — Beleg: `grep -o
      '"image":\["[^"]*romantisches-dinner[^"]*"\]' dist/valentinstag-muenchen/index.html` →
      `https://www.ristorantestoria.de/assets/romantisches-dinner-kerzenlicht-storia-muenchen-BC6qce0a.webp`.
      Alle 4 Sprachen (it.ts: `tldr` hat weiterhin keinen eigenen Override — Teilübersetzungsmuster
      wie bei Weihnachtsfeier V2.4, fällt korrekt auf den jetzt aktualisierten deutschen
      Platzhalter-Text zurück; `introP1`/`citationPre/Anchor/Post` dagegen eigens übersetzt, da
      dieser Teil der Seite in it.ts bereits vollübersetzt war).
- [x] **V3.5** Fakten zentralisieren: Valentinstag-Preise (aktuell 55 €/85 € an vier Stellen hart
      kodiert: JSON-LD-Description, 2 Offers, `package1Price`/`package2Price`,
      `seoDescription`) in `facts.ts` unter einem neuen `valentinstag`-Block zusammenführen.
      **Reine SSoT-Konsolidierung der bereits live angezeigten Werte** — ändert nichts an den
      Zahlen selbst. Ob 55 €/85 € noch aktuell sind, bleibt eine offene Faktenfrage (BLOCKED-Log),
      unabhängig von der Code-Konsolidierung.
      ✓ 13.09.2026 · Commit `75c547a` · `FACTS.valentinstag = { price: "55", pricePremium: "85" }`
      neu in `src/config/facts.ts`. `fillFacts()` (Muster `SilvesterMuenchen.tsx`) in
      `ValentinstagMuenchen.tsx` neu eingeführt und auf alle vier Fundstellen angewendet:
      JSON-LD-Description (Template-Literal `${FACTS.valentinstag.price}`), beide JSON-LD-Offers
      (`${FACTS.valentinstag.price}.00`/`${FACTS.valentinstag.pricePremium}.00`),
      `package1Price`/`package2Price` (Platzhalter `{price}`/`{pricePremium}` in allen 4 Sprachen),
      `seoDescription`/`standaloneSeoDescription`. Preise selbst unverändert (55/85), nur
      zentralisiert. Verifiziert am prerenderten HTML (script-bereinigt): `grep -o
      '{[a-zA-Z]*}'` → 0 Treffer (keine unaufgelösten Platzhalter); Definition-Lead zeigt „ab 55 €
      pro Person" korrekt aufgelöst. **Außerhalb des Auftrags-Umfangs belassen** (nicht Teil der
      „vier Fundstellen"): `reason8Desc`/`faq2Answer` enthalten weiterhin dieselben Literale
      55 €/85 € hart kodiert — bewusst nicht angefasst, um beim minimalen Eingriff zu bleiben; für
      eine künftige Iteration vermerkt, kein Blocker.

## V3: Branch, Beweis, Merge

- [x] ~~Branch `geo-luecken-v3` gepusht, PR erstellt, Diff gegengelesen, gemergt, Live-Stichprobe.~~
      **erledigt 13.09.2026** (PR #105, squash-merged, Deploy-Run `34777311970` erfolgreich).
      **Kein Formular gebrochen** (live bestätigt): `curl` gegen `valentinstag-muenchen/` zeigt
      `200`, `id="signup-form"` 1× im HTML, `SeasonalSignupForm.tsx` im gemergten Diff unangetastet.
      Live-Beweis zusätzlich: `"@type":"FoodEvent"` im JSON-LD, Outbound-Link
      `turismo.comune.terni.it` vorhanden, interner Link auf `romantisches-dinner-muenchen`
      vorhanden, „Candle-Light"-Formulierung (neuer Title/H1) im ausgelieferten HTML sichtbar.
      Beweis zusätzlich: `FoodEvent`-Schema mit auflösender `image`-URL,
      Definition-Lead, TL;DR gerendert, keine Romantik-Generika mehr in Title/H1.
      Lokal bereits verifiziert (13.09.2026, Commit `75c547a` auf `geo-luecken-v3`):
      `id="signup-form"` 1× im ausgelieferten HTML, `git diff --stat -- src/components/
      SeasonalSignupForm.tsx` leer, `npx tsc --noEmit` sauber, `npm run build` 157/157 0 Fehler,
      `npm run lint` 727 Probleme (Baseline unverändert). Push/PR/Merge/Live-Stichprobe macht das
      Hauptfenster.

---

## V4 — Messpunkte setzen

- [ ] **V4.1** Baseline-Tabelle (Cluster-Queries, Positionen, Impressionen aus diesem Loop) in
      `docs/seo-log.md` einfrieren — Vergleichsbasis für die beiden Review-Termine.
- [ ] **V4.2** Review-Termine eintragen: Anfang Dezember 2026 (Weihnachtssaison-Peak) und Anfang
      März 2027 (erste echte Valentinssaison dieser Seite) — mit denselben GSC-API-Abfragen
      (Query+Page-Dimension, siehe Plan-Datei) wiederholbar dokumentieren.

## V4: Branch, Beweis, Merge

- [ ] Branch `geo-luecken-v4` gepusht, PR erstellt, gemergt (reine Doku, kein Code — kleiner PR
      ohne Build/Lint-Beweis nötig, aber trotzdem Diff gegenlesen).

---

## BLOCKED-Log

<!-- Format: DATUM · Kriterium · Grund · was gebraucht wird -->
- 13.09.2026 · V3.3 · à la carte am 14.02. verfügbar? · Antwort Antoine (Chat, Frage steht)
- 13.09.2026 · V3.5 (Faktenfrage, nicht die Code-Konsolidierung) · sind 55 €/85 € noch aktuell? ·
  Antwort Antoine
- 13.09.2026 · V2.4 (Faktenfrage) · „ab 45 €" bei Weihnachtsfeier betrieblich bestätigt? · bereits
  offene Randfrage aus `facts.ts`, nicht neu durch diesen Loop

## Offen, außerhalb des Codes

- Supabase-Zeile hinter `candlelight-menue` — vermutlich deaktiviert/gelöscht, Prüfung nur über
  Lovable möglich (siehe V1.3).

## Abschluss

Sind V1–V4 abgehakt und alle PRs gemergt: wörtlich `GEO-LUECKEN ABGESCHLOSSEN` ausgeben.
