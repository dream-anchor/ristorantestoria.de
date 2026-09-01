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

---

## P0 — Structured-Data-Bugfixes

- [ ] **P0.1** `HomeVideo.tsx:42` `uploadDate` auf vollständigen ISO-8601-Zeitstempel mit
      Zeitzonen-Offset ändern (KONZEPT § P0.1).
      Beweis: `npm run build` grün + `npm run lint` grün + Diff zeigt neuen `uploadDate`-Wert im
      ISO-8601-Format mit Offset.
- [ ] **P0.2** `performer`-Feld in den Event-JSON-LD-Blöcken `SilvesterMuenchen.tsx:168-183` und
      `ValentinstagMuenchen.tsx:166-179` ergänzen (KONZEPT § P0.2).
      Beweis: `npm run build`/`lint` grün + Diff zeigt `performer` in beiden Event-Objekten.

## P1 — CTR-Killer auf Top-Rankings

- [ ] **P1.1** Title/Meta-Description für `kontakt/` überarbeitet (Pos. 3,56, CTR 0,33% → Ziel:
      klickstärker, <60/<160 Zeichen) (KONZEPT § P1).
      Beweis: `npm run build`/`lint` grün + Diff + neue Title/Description-Strings im Wortlaut.
- [ ] **P1.2** Title/Meta-Description für `reservierung/` überarbeitet (Pos. 3,72, CTR 0,52%)
      (KONZEPT § P1).
      Beweis: wie P1.1.
- [ ] **P1.3** Title/Meta-Description für `mittags-menu/` + `en/food-menu/` überarbeitet (Pos. ~4,6,
      CTR <1%) (KONZEPT § P1).
      Beweis: wie P1.1, für beide Sprachvarianten.

## Einheit A (P0+P1): Branch, Beweis, Merge

- [ ] Branch `seo-gsc-audit-p0-p1` gepusht, PR erstellt, Diff gegengelesen, gemergt. Live-Stichprobe
      nach Deploy (mind. 1 `curl`/Sichtprüfung je Fix).

## P2 — Tote Locale-Kombinationen + Duplikate

- [ ] **P2.1** 301-Redirects für die 6 toten `{lang}/besondere-anlaesse/{slug}`-Kombinationen in
      `public/.htaccess` ergänzt, Ziel-Slugs gegen `slugs.json` verifiziert (KONZEPT § P2.1).
      Beweis: `curl -IL` auf alle 6 URLs vorher (404) und nachher (301→200) + `npm run build`/`lint`
      grün.
- [ ] **P2.2** www/Trailing-Slash-Dubletten (5 URLs) auf kanonische Form redirected, nachdem geprüft
      ist, welche bereits von der generischen Regel abgedeckt sind (KONZEPT § P2.2).
      Beweis: `curl -IL` auf alle 5 URLs vorher/nachher + `npm run build`/`lint` grün.
- [ ] **P2.3** CMS-Altlasten-Pfade geprüft: bereits durch Bestandsregeln abgedeckt oder Lücke
      geschlossen (KONZEPT § P2.3).
      Beweis: Bestandsregel-Fund im Wortlaut + ggf. Diff + `npm run build`/`lint` grün.

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
