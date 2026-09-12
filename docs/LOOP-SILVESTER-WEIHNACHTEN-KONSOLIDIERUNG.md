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

- [ ] **K1** Route deaktivieren, 301-Redirects (4 Sprachen), `InternalLinks.tsx` umbiegen,
      Nav bleibt unverändert, Silvester-JSON-LD-Preise korrigieren, `SeasonalBanner.tsx`-Link
      korrigieren (KONZEPT § 5, K1).
      Beweis: `npm run build`/`lint` grün + `curl -IL` auf alle 4 Sprachvarianten vorher (200)
      und nachher (301→200 auf `besondere-anlaesse/silvester`).

## K1: Branch, Beweis, Merge

- [ ] Branch `silvester-weihnachten-k1` gepusht, PR erstellt, Diff gegengelesen, gemergt.
      Live-Stichprobe nach Deploy (alle 4 Sprachvarianten `curl -IL`).

---

## K2 — Weihnachten (Pillar → Standalone, Redirect + Komponenten-Aufwertung)

- [ ] **K2** Supabase-Datenladelogik identifiziert, Standalone-Mount-Punkt aufgewertet
      (Event/Menu-JSON-LD + Live-Menü), 301-Redirects (4 Sprachen) Pillar→Standalone,
      Pillar-Slug aus generischem Matching entfernt, Nav + Cross-Links umgebogen (KONZEPT § 5, K2).
      Beweis: `npm run build`/`lint` grün + `curl -IL` auf alle 4 Sprachvarianten der
      Pillar-URL vorher (200) und nachher (301→200 auf `weihnachten-muenchen`) + Live-Check
      Event/Menu-JSON-LD und Live-Menü/Pakete auf der überlebenden URL vorhanden.

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
