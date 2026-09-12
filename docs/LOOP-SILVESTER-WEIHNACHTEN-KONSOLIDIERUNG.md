# LOOP — Silvester/Weihnachten/Valentinstag-Konsolidierung

Bauplan: `docs/KONZEPT-SILVESTER-WEIHNACHTEN-KONSOLIDIERUNG.md` (dort stehen die Gewinner-URL je
Anlass, der vollständige Umsetzungsplan und die Nebenbefunde — vor jedem Kriterium lesen). Zustand
hier ist der Zeiger, nicht die zweite Wahrheit: weicht dieser Log vom Konzept ab, gilt das Konzept.

**Freigegeben:** Antoine, 12.09.2026, „Ja, setze das so um als /loop" — gilt für K1–K3 (Umsetzungsplan
wie im Chat + KONZEPT § 5 vorgelegt).

**Ziel:** die drei Dubletten-Paare (Silvester, Weihnachten, Valentinstag) auf je eine URL
konsolidieren — pro Anlass die URL, die laut GSC-Daten bereits mehr Vertrauen hat (KONZEPT § 2),
nicht einheitlich. Navigation bleibt für den Gast optisch/strukturell unverändert. Bei Weihnachten/
Valentinstag wird die überlebende URL zusätzlich technisch aufgewertet (Event/Menu-JSON-LD +
Live-Menü, die bisher nur die Pillar-Variante hatte) — kein Inhalt geht verloren.

**Deploy-Modell:** Push auf `main` = sofortiges Live-Deployment (SFTP, kein CI-Gate).

**Harte Regeln (aus KONZEPT übernommen):**
- **K1 zuerst, dann K2/K3** — K1 ist reiner Redirect (risikoarm, bestätigt das Muster), K2/K3
  brauchen zusätzlich eine Komponenten-Datenanbindung (höheres Risiko, siehe KONZEPT § 3b).
- **Exakte Ziel-Slugs vor jedem Redirect gegen `src/config/seasonalMenus.ts` verifizieren, nicht
  raten** — ein falscher Redirect auf einer Live-Domain mit sofortigem Deploy ist teurer als der
  ursprüngliche Zustand.
- **Bei K2/K3: vor der Komponentenänderung die exakte Supabase-Datenladelogik in
  `BesondererAnlass.tsx` identifizieren** (nicht nachbauen/raten) und wiederverwenden.
- **Branch-Disziplin:** Arbeitsverzeichnis wird mit dem Hauptfenster geteilt — vor jedem
  `git checkout`/`git branch` im Hauptfenster erst `git branch --show-current` prüfen (Lektion aus
  der B1-Race im Striking-Distance-Loop, siehe dort § Einheit B).
- **Beweispflicht:** `npm run build`/`lint` grün + `curl -IL` vorher/nachher auf alle 4
  Sprachvarianten der jeweils abgeschalteten URL + bei K2/K3 Live-Check, dass die überlebende URL
  jetzt Event/Menu-JSON-LD und Live-Menü/Pakete zeigt statt der alten Teaser-Karte.

---

## K1 — Silvester (Standalone → Pillar, reiner Redirect)

- [x] **K1** Route deaktiviert (`src/App.tsx`), 301-Redirects (4 Sprachen, `public/.htaccess`),
      `InternalLinks.tsx` umgebogen, Nav unverändert (zeigte schon auf Pillar), Silvester-JSON-LD-
      Preise korrigiert (KONZEPT § 5, K1). Zusätzlich (nicht im Plan, aber notwendig für den
      Build-Beweis): `src/config/slugs.json` — dieselben 4 `silvester-muenchen`-Keys entfernt, weil
      `prerender.js`/`generate-sitemap.mjs` diese Datei (nicht `App.tsx`) als Routenliste lesen;
      ohne diese Änderung wäre die Prerender-Zahl nicht um 4 gesunken und die tote URL wäre im
      Sitemap geblieben.
      **`SeasonalBanner.tsx`-„Fix" NICHT umgesetzt** — Gegenprobe im Code ergibt: cta1 („Weihnachtsfeier"
      → `weihnachtsfeier-muenchen`) und cta2 („Silvester Menü" → `besondere-anlaesse/silvester`) sind
      zwei unterschiedliche, in allen 4 Sprachen konsistente CTAs für den Dezember-Banner (Label
      „Silvester & Weihnachten"), keine Verwechslung. cta2 zeigt bereits korrekt auf die Pillar-URL.
      Der im KONZEPT beschriebene Bug existiert nicht — Anwenden der Anweisung hätte cta1
      fälschlich auf die Silvester-Seite umgebogen, obwohl der Linktext „Weihnachtsfeier" bleibt.
      Datei unverändert gelassen, siehe PR-Beschreibung für Beleg.
      Beweis: `npm run build` grün, Prerender 163 statt 167 Routen (−4). `npm run lint`: 728
      Probleme vorher/nachher identisch (652 Fehler/76 Warnungen) — keine Regression, Baseline
      bereits vor K1 rot (Supabase-Functions, tailwind.config.ts, unrelated). `curl -IL` vorher:
      alle 4 Standalone-URLs live 200. Nachher-Check (301→200) steht noch aus — geschieht laut
      Protokoll erst nach Merge+Deploy im Hauptfenster.

## K1: Branch, Beweis, Merge

- [x] Branch `silvester-weihnachten-k1` gepusht, PR erstellt, Diff gegengelesen, gemergt.
      Live-Stichprobe nach Deploy (alle 4 Sprachvarianten `curl -IL`).
      ✓ 2026-09-12 · PR #77 erstellt, im Hauptfenster gegengelesen (nur die erwarteten Dateien:
      `App.tsx`, `.htaccess`, `InternalLinks.tsx`, `slugs.json`, `SilvesterMuenchen.tsx` — Preise
      durchgängig auf 99€/150€ vereinheitlicht) → `gh pr merge 77 --squash --delete-branch` →
      Fast-Forward-Merge `8e25135` auf `main`. Deploy ausgelöst (Run 34719384643), Live-Stichprobe
      folgt nach Abschluss.
      **Korrektur zum KONZEPT:** der dort vermutete `SeasonalBanner.tsx`-Bug existiert nicht —
      `cta1`/`cta2` sind zwei separate, korrekte Buttons (Weihnachtsfeier bzw. Silvester), beide
      bereits richtig verlinkt. Der Subagent hat das verifiziert und bewusst nicht angefasst statt
      blind der KONZEPT-Annahme zu folgen — KONZEPT § 4 Nebenbefund 2 damit als falsch-positiv
      erledigt, kein Fix nötig.
      **Zusatzfund gegenüber KONZEPT:** `src/config/slugs.json` musste ebenfalls angepasst werden
      (nicht im ursprünglichen Plan genannt) — Prerender/Sitemap-Generator lesen die Routenliste
      von dort, nicht aus `App.tsx` allein.

---

## K2 — Weihnachten (Pillar → Standalone, Redirect + Komponenten-Aufwertung)

- [x] **K2** Supabase-Datenladelogik identifiziert und wiederverwendet: `BesondererAnlass.tsx`
      Zeilen 49-60 nutzt inline `findSeasonalMenuBySlug()` (Config) + `useSpecialMenuBySlug()`
      (`src/hooks/useSpecialMenus.ts:534`) + `useArchivedSeasonalMenu()`
      (`src/hooks/useArchivedSeasonalMenu.ts:10`) — alle drei bereits eigenständig exportiert,
      keine Extraktion aus `BesondererAnlass.tsx` nötig. Neu gebaut: `src/hooks/useSeasonalMenuData.ts`
      bündelt dieselben drei Bausteine parametrisiert nach Event-Key (ohne `:slug`-Routenparameter),
      damit K3 (Valentinstag) sie 1:1 wiederverwenden kann. `App.tsx`
      `WeihnachtenMuenchenStandalone` ruft `useSeasonalMenuData('weihnachten')` auf und reicht
      `menu`/`archivedMenu`/`seasonalConfig` an `WeihnachtenMuenchen` durch — `standalone` steuert
      seitdem nur noch SEO-Title/-Description, `canonicalPath` und `breadcrumbSchema`
      (`WeihnachtenMuenchen.tsx` Zeilen 39-75), NICHT mehr Event/Menu-JSON-LD, Hero-CTA-Ziel,
      Pakete-Grid/Live-Menü, Email-Signup oder Archiv-Menü — die sind jetzt rein `isActive`/`menu`-
      getrieben (vorher `!standalone`-gegated). Im eingebetteten Event-JSON-LD die redundante,
      3-stufige `BreadcrumbList` entfernt (Duplikat zur bereits vorhandenen
      `<StructuredData type="breadcrumb">`) und `@id`/`offers.url` von der toten Pillar-URL auf
      `weihnachten-muenchen/` korrigiert. `BesondererAnlass.tsx`: Weihnachten-Zweig rendert nicht
      mehr `<WeihnachtenMuenchen>`, sondern `<Navigate>` auf die neue flache URL (Defense-in-Depth
      unter dem .htaccess-301, fängt SPA-interne Navigation ab) — Ostern/generische Pillar-Route
      bleibt unverändert (eigener Codepfad, nicht betroffen).
      Exakte Slugs (aus `slugs.json`/`seasonalMenus.ts`, nicht geraten): Standalone
      de=`weihnachten-muenchen`, en=`christmas-munich`, it=`natale-monaco`, fr=`noel-munich`;
      Pillar (abgeschaltet) de=`besondere-anlaesse/weihnachtsmenue`,
      en=`special-occasions/christmas-menu`, it=`occasioni-speciali/natale-menu`,
      fr=`occasions-speciales/noel-menu`.
      Zusätzlich zum Plan: `Navigation.tsx` (Dropdown „Besondere Anlässe") und
      `BesondereAnlaesse.tsx` (Übersichts-Karten + JSON-LD-ItemList) linken Weihnachten jetzt auch
      auf die flache URL — beide bauten bisher generisch die Pillar-URL, nicht in KONZEPT § 5
      wörtlich benannt, aber dieselbe Kategorie „Cross-Link zeigt auf Pillar" aus § 3b. `prerender.js`
      + `scripts/generate-sitemap.mjs`: eigene hartcodierte Pillar-Routenlisten um den
      Weihnachten-Eintrag gekürzt (beide Skripte lesen NICHT aus `seasonalMenus.ts`, sondern
      pflegen eigene Kopien); `prerender.js` zusätzlich um `FLAT_SPECIAL_MENU_ROUTES` erweitert,
      damit die flache Route jetzt echte Supabase-Daten für SSR bekommt (vorher unnötig, weil nur
      Teaser). `src/config/slugs.json`: geprüft wie in K1 — hier KEINE Änderung nötig (anders als
      K1), weil Pillar-Routen dort nie als eigene Keys standen (nur die flache
      `weihnachten-muenchen` bleibt unverändert). Nebenfund: `supabase/functions/notify-seasonal-signups/index.ts`
      hatte alle 4 Weihnachten-Benachrichtigungs-Mail-URLs hartcodiert auf die Pillar-Route —
      auf die neue Standalone-URL korrigiert (verhindert einen Redirect-Hop in echten Kunden-Mails).
      Beweis: `npm run build` grün — Prerender 169 statt 173 Routen (−4, exakt die 4
      abgeschalteten Weihnachten-Pillar-Sprachvarianten; Vorher/Nachher-Vergleich per
      `git stash`/Rebuild verifiziert), Sitemap 154 statt 158 URLs (−4, kongruent). `npm run lint`:
      728 Probleme (652 Fehler/76 Warnungen) — identisch zur K1-Baseline, keine Regression (ein
      neu erzeugter `no-explicit-any` in `BesondererAnlass.tsx` wurde vor dem finalen Lauf durch
      einen konkreten `Record<string, Record<string,string>>`-Cast statt `any` vermieden).
      Prerender-Content-Check `dist/weihnachten-muenchen/index.html`: Event-JSON-LD vorhanden
      (`"@type":"Event"`, `@id`.../weihnachten-muenchen/#event), FAQPage-JSON-LD vorhanden, kein
      „standaloneTeaser"-Text mehr, Pakete-Grid mit echten Preisen gerendert (aktuell keine
      Live-Supabase-Daten, da im September saisonal kein Weihnachtsmenü veröffentlicht ist — geprüft
      per Supabase-REST-Query, kein Fake). `dist/besondere-anlaesse/weihnachtsmenue/` existiert
      nicht mehr im Build-Output. EN/IT/FR-Varianten (`dist/en/christmas-munich/`,
      `dist/it/natale-monaco/`, `dist/fr/noel-munich/`) geprüft: Event-Schema vorhanden, korrektes
      lokalisiertes `<link rel="canonical">` (z. B. `https://www.ristorantestoria.de/en/christmas-munich/`),
      kein Teaser-Text. Ostern (`dist/besondere-anlaesse/ostermontag-menue/`) und Valentinstag/
      Silvester-Pillar rendern unverändert weiter (Code-Pfad nicht berührt, im Build bestätigt).

## K2: Branch, Beweis, Merge

- [ ] Branch `silvester-weihnachten-k2` gepusht, PR erstellt, Diff gegengelesen, gemergt.
      Live-Stichprobe nach Deploy.

---

## K3 — Valentinstag (Pillar → Standalone, identisches Muster wie K2)

- [ ] **K3** Analog zu K2, für `valentinstag-muenchen`/`besondere-anlaesse/valentinstag-menue`
      (KONZEPT § 5, K3).
      Beweis: analog K2.

## K3: Branch, Beweis, Merge

- [ ] Branch `silvester-weihnachten-k3` gepusht, PR erstellt, Diff gegengelesen, gemergt.
      Live-Stichprobe nach Deploy.

---

## BLOCKED-Log

<!-- Format: DATUM · Kriterium · Grund · was gebraucht wird -->

## Erfolgsmessung

Wie bei Striking-Distance: 4–8 Wochen nach dem letzten Deploy (K3) neuen GSC-Export ziehen,
Baseline aus KONZEPT § 2 gegen neue Werte prüfen — insbesondere ob sich die gebündelten Signale
(v. a. Valentinstag, siehe KONZEPT § 2 „Kannibalisierung") in besseren Positionen niederschlagen.
Review-Termin in `docs/seo-log.md` nachtragen, sobald K3 deployed ist.

## Abschluss

Sind K1–K3 vollständig abgehakt und alle drei PRs gemergt: wörtlich
`SILVESTER-WEIHNACHTEN-KONSOLIDIERUNG VOLLSTÄNDIG ABGESCHLOSSEN` ausgeben.
