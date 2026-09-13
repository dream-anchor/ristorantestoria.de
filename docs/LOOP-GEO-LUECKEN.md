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

- [ ] Branch `geo-luecken-v1` gepusht, PR erstellt, gemergt, Live-Stichprobe: alle 4 Sprachvarianten
      `curl -sIL` → 301 in maximal 1 Hop auf `romantisches-dinner-muenchen`, kein 404 mehr, die drei
      reparierten Seiten enthalten keinen Link mehr auf die alte URL.

---

## V2 — Weihnachtsfeier gewinnt den B2B-Cluster

Entscheidung Antoine: `weihnachtsfeier-muenchen` gewinnt, `firmenfeier-muenchen` gibt
Weihnachtsbegriffe ab. AKUT — Buchungssaison läuft laut eigener Seite „ab September/Oktober".

- [ ] **V2.1** `FirmenfeierMuenchen.tsx` + Übersetzungen: Weihnachts-Formulierungen aus `tldr`,
      `introP1`, Paket-/Anlass-Texten auf einen kurzen Satz + Link auf `weihnachtsfeier-muenchen`
      reduzieren. Generische Firmenfeier-Substanz (Sommerfest, Teambuilding, Jubiläum etc.)
      unangetastet lassen. Beleg vor/nachher: `grep -c -i "weihnacht" src/translations/de.ts`
      innerhalb des `firmenfeier`-Blocks.
- [ ] **V2.2** `WeihnachtsfeierMuenchen.tsx` + Übersetzungen: „Firmenweihnachtsfeier" und
      „Betriebsweihnachtsfeier" als Begriffe aufnehmen (H2 oder FAQ-Frage/Antwort) — beide Queries
      (zusammen 156 Impressionen) sind heute auf dieser Seite nicht vertreten. Keine neuen Fakten,
      nur Begriffsabdeckung für die bereits beschriebene Leistung.
- [ ] **V2.3** GEO nachrüsten nach Muster `WeihnachtenMuenchen.tsx`: Definition-Lead als
      allererster Satz (`introP1` umformulieren, weg von „Sie suchen die perfekte …?"), `tldr`
      rendern (Schlüssel existiert bereits, `de.ts:2907`, nur einbauen), „Auf einen Blick"-Block
      (Kapazität/Preis ab/Mindestgröße/Anfragezeitpunkt), ein autoritativer Outbound-Link (Thema
      passend wählen, z. B. zu italienischer Weihnachtstradition — nicht denselben Link wie
      Weihnachten/Silvester duplizieren, eigene Quelle suchen).
- [ ] **V2.4** Fakten zentralisieren: `FACTS.capacity.*` (existiert, wird auf dieser Seite nicht
      genutzt) statt der doppelten Kapazitätsangaben in `reason5Desc` UND `faq2Answer`;
      `FACTS.weihnachten.groupMenuPriceFrom` statt hartkodiertem „45 €" an den vier Fundstellen
      (`seoTitle`, `seoDescription`, `tldr`, `faq1Answer`). Reine Deduplizierung bereits angezeigter
      Werte, keine neue Preisbehauptung — die offene Frage „ist 45 € betrieblich korrekt" bleibt
      unabhängig davon offen (siehe BLOCKED-Log) und wird durch diesen Schritt nicht beantwortet.
      Alle Texte in 4 Sprachen, `it.ts`-Teilübersetzungsmuster beachten falls einschlägig.

## V2: Branch, Beweis, Merge

- [ ] Branch `geo-luecken-v2` gepusht, PR erstellt, Diff gegengelesen, gemergt, Live-Stichprobe.
      Beweis zusätzlich: `firmenfeier-muenchen` prerendertes HTML zeigt reduzierte
      Weihnachts-Nennungen, `weihnachtsfeier-muenchen` zeigt „Firmenweihnachtsfeier"/
      „Betriebsweihnachtsfeier", Definition-Lead als erster Satz, TL;DR gerendert.

---

## V3 — Valentinstag schärfen

Entscheidung Antoine: eigenständig, aber auf reine Valentins-Intention zugespitzt. Vorlauf bis
Januar (Peak Februar 2027, erste echte Saison dieser Seite).

- [ ] **V3.1** Romantik-Generika aus Title/Description/H2/Intro entfernen (Formulierungen wie
      „romantisches Restaurant/Dinner München" ohne Valentins-Bezug), durch internen Link auf
      `romantisches-dinner-muenchen` ersetzen. Ziel: die Seite kandidiert nicht mehr gegen die
      eigene stärkere Seite bei generischen Romantik-Queries.
- [ ] **V3.2** Title/Description auf die Queries mit echtem Volumen zuspitzen (`valentinstag
      münchen` 421 Impr., `valentinstag menü münchen` 186 Impr.) — konkretes Angebotsdetail statt
      Generika, um die CTR von 0,00 % zu heben.
- [ ] **V3.3** `ReservationBooking` ergänzen (Muster `SilvesterMuenchen.tsx:561`, `defaultDate`
      14.02.) **zusätzlich** zum bestehenden `SeasonalSignupForm` — NICHT ersetzen. **BLOCKED bis
      Antoine bestätigt, ob am 14.02. à la carte serviert wird** (sonst ergibt eine
      Tisch-Reservierungsstrecke keinen Sinn, siehe BLOCKED-Log).
- [ ] **V3.4** GEO nachrüsten: Definition-Lead, `tldr` rendern (Schlüssel existiert, `de.ts:2240`),
      autoritativer Outbound-Link, JSON-LD `Event` → `FoodEvent`, kaputte `image`-URL im Schema
      reparieren (zeigt auf `/valentinstag-menue-storia-muenchen.jpg`, die laut Audit nicht in
      `public/` existiert — Muster: Silvester nutzt das importierte Hero-Bild selbst, siehe
      `SilvesterMuenchen.tsx` `EVENT_IMAGE_URL`).
- [ ] **V3.5** Fakten zentralisieren: Valentinstag-Preise (aktuell 55 €/85 € an vier Stellen hart
      kodiert: JSON-LD-Description, 2 Offers, `package1Price`/`package2Price`,
      `seoDescription`) in `facts.ts` unter einem neuen `valentinstag`-Block zusammenführen.
      **Reine SSoT-Konsolidierung der bereits live angezeigten Werte** — ändert nichts an den
      Zahlen selbst. Ob 55 €/85 € noch aktuell sind, bleibt eine offene Faktenfrage (BLOCKED-Log),
      unabhängig von der Code-Konsolidierung.

## V3: Branch, Beweis, Merge

- [ ] Branch `geo-luecken-v3` gepusht, PR erstellt, Diff gegengelesen, gemergt, Live-Stichprobe.
      **Kein Formular gebrochen:** `id="signup-form"` weiterhin in allen 4 Sprachrouten, alle drei
      Anker (Hero/Archived-Menu/Final-CTA) zielen korrekt, `git diff` leer für
      `SeasonalSignupForm.tsx`. Beweis zusätzlich: `FoodEvent`-Schema mit auflösender `image`-URL,
      Definition-Lead, TL;DR gerendert, keine Romantik-Generika mehr in Title/H1.

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
