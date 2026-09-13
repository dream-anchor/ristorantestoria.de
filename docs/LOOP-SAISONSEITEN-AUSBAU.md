# LOOP — Ausbau Silvester- und Weihnachtsseite

Bauplan: `docs/KONZEPT-SAISONSEITEN-AUSBAU.md` (dort stehen Wettbewerbsbefund, die acht
Faktenwidersprüche mit Auflösung, der vollständige MAESTRO-Endpunkt-Vertrag und die
GEO-Anforderungen — vor jedem Kriterium lesen). Zustand hier ist der Zeiger, nicht die zweite
Wahrheit: weicht dieser Log vom Konzept ab, gilt das Konzept.

**Freigegeben:** Antoine, 13.09.2026 (Plan-Freigabe) — gilt für E1–E3.

**Deploy-Modell:** Push auf `main` = sofortiges Live-Deployment (SFTP, kein CI-Gate).

## Harte Regeln

- **Kein bestehendes Formular darf brechen** (Antoine, ausdrücklich). Das Vormerk-Formular wird
  auf den zwei Zielseiten nur *ausgehängt* — Komponente, Edge Functions, Tabelle und
  Admin-Oberfläche bleiben unangetastet, weil Valentinstag und der generische Anlass-Fallback sie
  weiter nutzen.
- **Keine MAESTRO-Widgets.** Nur das eigene Formular gegen `POST /api/public/inquiries`.
- **Keine neuen Fakten erfinden.** Preise/Kapazitäten/Zeiten nur aus `storia-entity.ts`,
  `facts.ts` oder dem bereits vorhandenen Seiteninhalt. Silvester: 99 € / 150 € (mit
  Weinbegleitung), **4 Gänge in beiden Fällen**.
- **Steinofen, nie Holzofen** (projektweite Regel).
- **Branch-Disziplin:** Arbeitsverzeichnis wird mit dem Hauptfenster geteilt — vor jedem
  `git checkout`/`git branch` erst `git branch --show-current` prüfen.
- `Kontakt.tsx` und `Reservierung.tsx` bleiben unangetastet.

---

## E1 — Fakten, Menü sichtbar machen, GEO-Basis

- [ ] **E1.1** Acht Faktenwidersprüche auflösen (KONZEPT § Faktenwidersprüche, Spalte „Auflösung"),
      kanonische Werte in `src/config/facts.ts`. Betrifft `BesondereAnlaesse.tsx:48`,
      `de.ts` (Silvester-Pakete), `FirmenfeierMuenchen.tsx:282`, `llms.txt`.
      Beweis: `grep` zeigt überall denselben Preis und dieselbe Gangzahl.
- [ ] **E1.2** Silvester-Vorjahresmenü sichtbar rendern (3 Varianten aus dem JSON-LD), klar als
      Beispiel gekennzeichnet + Hinweis auf das kommende Menü.
      Beweis: Gerichtsnamen im prerenderten HTML sichtbar, nicht nur im JSON-LD.
- [ ] **E1.3** „Auf einen Blick"-Block auf beiden Seiten (Gangzahl · Preis · Beginn · Kapazität ·
      Reservierungsfrist).
- [ ] **E1.4** Weihnachtsseite auf die Zwei-Wege-Realität umstellen (à la carte am Tisch vs.
      Gruppenmenü nach Absprache) statt „Menü folgt im Herbst".
- [ ] **E1.5** Definition-Lead als ersten Satz beider Intros, `tldr` rendern, je ein autoritativer
      Outbound-Link (GEO-Regeln 1 und 3).
- [ ] **E1.6** JSON-LD: `FoodEvent` statt `Event`, doppelte BreadcrumbList auf Silvester entfernen,
      `image` reparieren, bei Weihnachten `highPrice` ergänzen.
- [ ] **E1.7** `llms.txt` aktualisieren, toten `standalone`-Zweig in `SilvesterMuenchen.tsx`
      entfernen.

## E1: Branch, Beweis, Merge

- [ ] Branch `saisonseiten-e1` gepusht, PR erstellt, Diff gegengelesen, gemergt, Live-Stichprobe.

---

## E2 — Conversion-Umbau

- [ ] **E2.1** `ReservationBooking` auf beiden Seiten einbinden (Landingpage-Muster
      `headingLevel="h3"` + `onBook`), optionale Props `defaultDate`/`defaultGuests` ergänzen —
      abwärtskompatibel, `Reservierung.tsx` unverändert.
- [ ] **E2.2** Neues `AnlassAnfrageForm` gegen `POST /api/public/inquiries` (Vertrag siehe KONZEPT),
      inkl. Honeypot `website`, Unterscheidung 201/202/422/429, Endpunkt-URL per
      `VITE_MAESTRO_INTAKE_URL` statt hart kodiert.
- [ ] **E2.3** Vormerk-Formular auf beiden Seiten aushängen (nur die zwei Mount-Punkte),
      events-storia-CTAs auf diesen zwei Seiten ersetzen, CTA-Hierarchie vereinheitlichen.
      Beweis: Valentinstag + generische Anlass-Seite rendern das Vormerk-Formular weiterhin.

## E2: Branch, Beweis, Merge

- [ ] Branch `saisonseiten-e2` gepusht, PR erstellt, Diff gegengelesen, gemergt, Live-Stichprobe
      **inklusive echter Testanfrage** über das Formular (Browser, nicht `curl` — CORS + JS).

---

## E3 — Inhaltliche Tiefe

- [ ] **E3.1** Stornobedingungen/Anzahlung (braucht Fakten von Antoine — bis dahin BLOCKED).
- [ ] **E3.2** Kapazitätsblock in Zahlen + Social Proof (4,5 ★, 800+ Bewertungen aus
      `storia-entity.ts`).
- [ ] **E3.3** Bildstrecke + FAQ-Ausbau.

## E3: Branch, Beweis, Merge

- [ ] Branch `saisonseiten-e3` gepusht, PR erstellt, gemergt, Live-Stichprobe.

---

## BLOCKED-Log

<!-- Format: DATUM · Kriterium · Grund · was gebraucht wird -->
- 13.09.2026 · E3.1 · Stornobedingungen/Anzahlung unbekannt · Angaben von Antoine
- 13.09.2026 · E1.1 (Teil) · `facts.ts:67` TODO Weihnachtspreis 45 € vs. 49 € · Entscheidung von
  Antoine; bis dahin bleibt 45 € (überall konsistent live), kein Blocker für den Rest von E1

## Offen, außerhalb des Codes

- **Listicle-Aufnahme** (in-muenchen.de Silvester, Mit Vergnügen Weihnachtsfeier) — größter
  Sichtbarkeitshebel, Betreiber-Aktion, kein Code.

## Abschluss

Sind E1–E3 abgehakt und alle PRs gemergt: wörtlich `SAISONSEITEN-AUSBAU ABGESCHLOSSEN` ausgeben.
