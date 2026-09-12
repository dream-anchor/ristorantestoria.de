# KONZEPT — Konsolidierung Silvester/Weihnachten/Valentinstag-Dubletten

**Rolle:** Senior SEO + Senior GEO Analyse, angefordert von Antoine am 12.09.2026 als „Deep dive"
zu D1 aus `docs/LOOP-STRIKING-DISTANCE.md` (Silvester/Weihnachten-Struktur). Datengrundlage:
Recherche-Pass gegen den aktuellen Code-Stand (Zeilenbelege siehe Fußnoten je Abschnitt) +
GSC-Export vom 12.09.2026 (`docs/striking-distance-audit-2026-09-12.md`).

## 0. Executive Summary — die Ausgangslage ist einfacher als gedacht

Antoines Sorge war „Inhalte verschmelzen, damit nichts verloren geht" — das unterstellt zwei
divergierende Seiten. **Das ist nicht der Fall.** Silvester, Weihnachten und Valentinstag sind
technisch **je eine einzige React-Komponente**, die über einen `standalone`-Boolean-Prop an zwei
URLs gerendert wird (`src/pages/seo/SilvesterMuenchen.tsx`, `WeihnachtenMuenchen.tsx`,
`ValentinstagMuenchen.tsx`). Intro, „8 Gründe"-Sektion, Timeline und **das komplette FAQ inklusive
FAQPage-JSON-LD** sind auf beiden URLs wortwörtlich identisch — kein Content-Merge-Problem, sondern
eine reine **Routing-Dublette**: zwei URLs zeigen (bis auf SEO-Metadaten und Rahmung) denselben
Inhalt, verwässern sich aber gegenseitig bei Ranking-Signalen (Impressionen, interne Linkautorität,
Structured Data).

**Das ändert die Aufgabe von „Content vorsichtig zusammenführen" zu „redundante, schwächere Route
abschalten und per 301 auf die stärkere, vollständigere Route umleiten"** — strukturell sehr nah am
P2-Muster aus dem Vorgänger-Loop (`docs/KONZEPT-SEO-GSC-AUDIT.md` § P2.1).

**Update 12.09.2026, nach rigoroser Zahlen-Gegenprobe (Rolle: Senior Data Analyst, auf Antoines
Nachfrage):** Der ursprüngliche Reflex „Pillar gewinnt strukturell immer, weil reichhaltigeres
Schema" wurde geprüft und **für 2 von 3 Paaren widerlegt**. Google zeigt die jeweils andere URL
längst häufiger — dorthin umzuleiten wäre das riskantere Redirect. Gewinner steht **pro Anlass
einzeln fest**, nicht einheitlich (Details Abschnitt 2). Konsequenz: bei Weihnachten und
Valentinstag muss die **Standalone**-URL zusätzlich das bisher Pillar-exklusive Schema
(Event/Menu-JSON-LD, Live-Menü-Anbindung) bekommen, sonst ginge dabei tatsächlich etwas verloren —
siehe Abschnitt 3a.

## 1. Vollständige Bestandsaufnahme

Antoine nannte „Weihnachten, Silvester, Ostern etc." als Beispiele des allgemeinen Musters — geprüft,
aber **nicht alle davon sind tatsächlich Dubletten:**

| Anlass | Standalone-Route | Pillar-Route | Status |
|---|---|---|---|
| Silvester | `/silvester-muenchen/` | `/besondere-anlaesse/silvester/` | **Bestätigte Dublette** |
| Weihnachten | `/weihnachten-muenchen/` | `/besondere-anlaesse/weihnachtsmenue/` | **Bestätigte Dublette** |
| Valentinstag | `/valentinstag-muenchen/` | `/besondere-anlaesse/valentinstag-menue/` | **Bestätigte Dublette** |
| Ostern | — | `/besondere-anlaesse/ostermontag-menue/` (generisches Supabase-Sondermenü) | **Keine Dublette** — nie eine Standalone-Seite gebaut |
| Muttertag | — | — | **Existiert nicht** — weder Pillar noch Standalone |
| Weihnachtsfeier | `/weihnachtsfeier-muenchen/` | — | **Kein Pillar-Gegenstück** — eigenständige Firmen-Event-Seite, anderer Intent (siehe Audit § 5), nicht Teil dieser Konsolidierung |

Alle drei bestätigten Paare existieren **in allen 4 Sprachen** (DE/EN/IT/FR) — die Dublette ist kein
DE-Sonderfall.

## 2. Gewinner-URL pro Anlass — nach Zahlen, nicht nach Einheitlichkeit

**Grundsatz:** URL-Tiefe/Verschachtelung ist kein Google-Rankingfaktor — `/besondere-anlaesse/x/`
ist gegenüber `/x-muenchen/` weder strukturell besser noch schlechter. Was zählt, ist wo Google
bereits nachweislich Vertrauen aufgebaut hat (Impressionen/Position) — von der URL mit **mehr**
Vertrauen auf die URL mit **weniger** Vertrauen umzuleiten ist das riskantere Redirect, unabhängig
von der URL-Form.

| Anlass | Standalone (Impr./Pos.) | Pillar (Impr./Pos.) | **Gewinner (Ziel-URL)** |
|---|---|---|---|
| Silvester | 189 / 10,5 | **4.774 / 10,61** | **Pillar** — 25× mehr Volumen, eindeutig |
| Weihnachten | **761 / 11,86** | nicht in Top-163 (praktisch kein Traffic) | **Standalone** — deutlich |
| Valentinstag | **1.452 / 20,56** | 418 / 41,3 | **Standalone** — mehr Volumen UND bessere Position |

Nur Silvester spricht für Pillar. Bei Weihnachten und Valentinstag hat Google die **flache** URL
bereits klar bevorzugt — eine einheitliche „immer Pillar"-Regel hätte in 2 von 3 Fällen die von
Google bereits bevorzugte URL abgeschaltet.

**Zusatzargument für die flache URL, unabhängig von den Zahlen:** die dynamische
`besondere-anlaesse/:slug`-Route mit ihrem Slug-Matching war in diesem Projekt bereits mehrfach
Fehlerquelle (Oktoberfest-Sitemap-Dublette, verwaiste 404-Kombinationen, falscher `slug_fr:
"reveillon"` — alle dokumentiert im Vorgänger-Loop). Flache Routen sind einfacher und robuster.
Das spricht zusätzlich dafür, wo immer die Daten es zulassen (Weihnachten, Valentinstag) die
flache URL zu bevorzugen, statt sie ohne Not auf die fehleranfälligere dynamische Route zu ziehen.

**Nuance Valentinstag:** beide Varianten ranken aktuell schlecht (Pos. 20,56 bzw. 41,3) —
Lehrbuchbeispiel für Keyword-Kannibalisierung: die Suchintention wird auf zwei URLs aufgeteilt,
keine bekommt genug gebündeltes Signal. Die Konsolidierung selbst (Signale bündeln) ist hier
wichtiger als die Frage, welche der beiden URLs „gewinnt" — die flache URL wird gewählt, weil sie
schon mehr Volumen hat und weil sie die robustere Route ist.

## 3. Was beim Redirect NICHT verloren geht (Antoines Kernsorge)

Da beide Varianten **dieselbe Komponente mit identischem Intro/Gründe/Timeline/FAQ-Text** rendern,
gibt es keinen inhaltlichen Merge auf Textebene durchzuführen. Aber: pro Anlass überlebt eine
andere URL (Abschnitt 2), und die beiden Varianten sind **nicht** in jeder Hinsicht gleich
ausgestattet — das muss sauber aufgefangen werden, nicht nur der Text.

### 3a. Silvester (Pillar überlebt — einfacher Fall)

| Element | Nur auf Standalone | Auffang-Maßnahme |
|---|---|---|
| SEO-Title/Description/H1 (Standalone) | ja | Verworfen — Pillar hat eigene SEO-Texte |
| Teaser-/Inaktiv-Card | ja | Ersatzlos — Pillar zeigt Pakete/Live-Menü an derselben Stelle |
| 1 interner Link (`InternalLinks.tsx`) | ja | Ziel auf Pillar-URL ummünzen |

Pillar hat bereits alles (Schema, Live-Menü) — reiner Redirect, keine Komponentenänderung nötig.

### 3b. Weihnachten + Valentinstag (Standalone überlebt — der eigentliche Sorgfaltsfall)

Hier ist die Lage umgekehrt: die überlebende URL (Standalone) ist aktuell die **schwächer
ausgestattete** Variante — sie hat kein Event/Menu-JSON-LD und keine Live-Supabase-Menü-Anbindung
(nur Teaser-/Inaktiv-Card), weil diese laut Code exklusiv an `{!standalone && (...)}` hängen. Würde
man hier naiv nur redirecten, **ginge tatsächlich etwas verloren** — genau das, wovor Antoine
gewarnt hat.

**Auffang-Maßnahme (kein reiner Redirect, sondern eine kleine Komponentenanpassung):** die
Standalone-Route muss dieselben `menu`/`archivedMenu`/`seasonalConfig`-Props bekommen, die aktuell
nur `BesondererAnlass.tsx` an die Pillar-Route liefert. Konkret: die Supabase-Datenladelogik, die
`BesondererAnlass.tsx` für das Menü-Laden nutzt (Hook/Query zuerst exakt identifizieren, nicht
raten — vermutlich analog zu `useSpecialMenuBySlug` bzw. dem in `OktoberfestMuenchen.tsx:96`
referenzierten Muster laut Vorgänger-KONZEPT), auch am Mount-Punkt der Standalone-Route in
`src/App.tsx` aufrufen und die Ergebnisse als Props durchreichen — **statt** `standalone` zu
setzen. Der `standalone`-Boolean steuert dann nur noch die SEO-Metadaten/Breadcrumb-Auswahl, nicht
mehr, ob Schema/Live-Menü gerendert werden. Effekt: die überlebende flache URL bekommt exakt dieselbe
Ausstattung, die heute nur die Pillar-URL hat — **nichts geht verloren, es wird eher aufgewertet**
(die bisher schwächere URL wird jetzt vollwertig).

| Element | Bisher nur auf Pillar | Auffang-Maßnahme |
|---|---|---|
| Event/Menu-JSON-LD | ja | Auf Standalone-Mount-Punkt mit übertragen (siehe oben) |
| Live-Menü (Supabase) | ja | dito |
| Pakete-Grid (wenn kein Live-Menü aktiv) | ja | dito |
| E-Mail-Signup + Archiv-Menü (wenn inaktiv) | ja | dito |
| 1 interner Link (`InternalLinks.tsx`) | — (zeigt schon auf Standalone) | unverändert |
| Nav-Dropdown-Ziel | zeigt auf Pillar | auf Standalone-URL ummünzen |
| Mehrere Cross-Links von anderen Landingpages (siehe Recherche § 3) | zeigen auf Pillar | auf Standalone-URL ummünzen |

**Das ist der Grund, warum dieses KONZEPT mehr ist als ein reiner Redirect-Task** — bei Weihnachten
und Valentinstag wird die Zielseite technisch aufgewertet, nicht nur umgeleitet.

## 4. Nebenbefunde aus der Recherche (unabhängig von der Konsolidierung, aber im selben Zug fixbar)

1. **Datenfehler Silvester-JSON-LD:** Das Event/Menu-Schema auf der Pillar-Seite nennt
   65,90 €/99,00 € (Degustationsmenü Vegetale/Mare/Terra), der sichtbare Seiteninhalt (Pakete + FAQ)
   nennt 99–150 € (Classic/Premium) — zwei widersprüchliche Preisangaben auf derselben Seite,
   vermutlich ein nie aktualisierter Vorjahres-Rest im JSON-LD. Da nach der Konsolidierung **die
   gesamte Anlass-Nachfrage** über diese eine URL läuft und Google/KI-Systeme das JSON-LD als
   strukturierte Wahrheit lesen, sollte dieser Widerspruch im selben Zug korrigiert werden (JSON-LD
   an die sichtbaren Paketpreise angleichen) — sonst zeigt eine KI-Overview künftig einen falschen
   Preis. Bei Weihnachten/Valentinstag besteht dieser Widerspruch nicht.
2. **Falscher Banner-Link:** `SeasonalBanner.tsx` verlinkt den Silvester-CTA fälschlich auf
   `weihnachtsfeier-muenchen` statt auf ein Silvester-Ziel — unabhängiger Bug, im selben Zug
   korrigierbar (Ziel: die neue kanonische Silvester-Pillar-URL).
3. **Hartcodiertes Deutsch im mehrsprachigen JSON-LD:** die Event/Menu-`@graph`-Blöcke sind
   unabhängig von der aktiven Sprache immer deutsch. Nach der Konsolidierung bekommt diese eine URL
   den gesamten mehrsprachigen Traffic für den jeweiligen Anlass — spätestens dann lohnt sich ein
   sprachabhängiger JSON-LD-Text (name/description je Locale). **Empfehlung: als separates,
   nachgelagertes Kriterium behandeln** (GEO-Verbesserung, kein Blocker für den Redirect selbst).

## 5. Umsetzungsplan — freigegeben von Antoine, 12.09.2026 („Ja, setze das so um als /loop")

Drei Einheiten, da Silvester strukturell einfacher ist (reiner Redirect) als Weihnachten/
Valentinstag (Redirect + Komponenten-Aufwertung). Navigation bleibt für den Gast optisch/strukturell
identisch (Dropdown „Besondere Anlässe" zeigt weiterhin alle Anlässe gruppiert) — nur die
Link-Ziele ändern sich pro Anlass gemäß Abschnitt 2.

### K1 — Silvester (Standalone → Pillar, reiner Redirect)
1. `src/App.tsx` `generateRoutes()`: Standalone-Route `silvester-muenchen` (4 Sprachen) entfernen.
2. `public/.htaccess`: 301-Redirects `silvester-muenchen` (4 Sprachen) → `besondere-anlaesse/
   silvester` (korrekte Locale-Slugs aus `seasonalMenus.ts` verifizieren, nicht raten).
3. `src/components/InternalLinks.tsx` Zeile 27: Ziel von `silvester-muenchen` auf
   `besondere-anlaesse/silvester` ändern.
4. `Navigation.tsx`: Silvester-Nav-Ziel bleibt unverändert (zeigt schon auf Pillar).
5. Nebenbefund-Fix: `SilvesterMuenchen.tsx` Event/Menu-JSON-LD-Preise auf 99/150 € (Classic/
   Premium) korrigieren, damit sie zum sichtbaren Paket-Text passen.
6. Nebenbefund-Fix: `SeasonalBanner.tsx:28` — `cta1`-Ziel für Silvester von
   `weihnachtsfeier-muenchen` auf `besondere-anlaesse/silvester` korrigieren.

### K2 — Weihnachten (Pillar → Standalone, Redirect + Komponenten-Aufwertung)
1. **Zuerst recherchieren, nicht raten:** exakte Supabase-Datenladelogik in
   `BesondererAnlass.tsx` identifizieren (Hook/Query für `menu`/`archivedMenu`), die für den
   Weihnachten-Slug (`weihnachtsmenue`) verwendet wird.
2. `src/App.tsx`: Mount-Punkt für `weihnachten-muenchen` (4 Sprachen) so anpassen, dass er
   dieselbe Datenladelogik aufruft und `menu`/`archivedMenu`/`seasonalConfig` an
   `WeihnachtenMuenchen` durchreicht, statt `standalone` zu setzen (siehe § 3b) — `standalone`
   steuert danach nur noch SEO-Metadaten-Auswahl.
3. `public/.htaccess`: 301-Redirects `besondere-anlaesse/weihnachtsmenue` (4 Sprachen) →
   `weihnachten-muenchen` (Ziel-Slugs verifizieren).
4. `src/App.tsx` `generateRoutes()`/Pillar-Matching: Weihnachten-Slug aus dem generischen
   `besondere-anlaesse/:slug`-Matching entfernen (verhindert doppeltes Rendering).
5. `Navigation.tsx`: Weihnachten-Nav-Ziel von Pillar auf `weihnachten-muenchen` ändern.
6. Cross-Links von anderen Landingpages, die laut Recherche auf die Weihnachten-Pillar-URL
   zeigen (`SilvesterMuenchen.tsx:119`, `ValentinstagMuenchen.tsx:118`), auf
   `weihnachten-muenchen` umstellen.
7. `src/components/InternalLinks.tsx` Zeile 28: bereits auf Standalone — unverändert.

### K3 — Valentinstag (Pillar → Standalone, identisches Muster wie K2)
Analog zu K2, für `valentinstag-muenchen`/`besondere-anlaesse/valentinstag-menue`. Cross-Links laut
Recherche: `SilvesterMuenchen.tsx:120`, `WeihnachtenMuenchen.tsx:118`,
`RomantischesDinner.tsx:241`, `BesondereAnlaesse.tsx` — auf `valentinstag-muenchen` umstellen.

### Beweis je Einheit
`npm run build` (Prerender-Routenzahl darf sich nur um die entfernte Route ändern, nicht mehr) +
`npm run lint` grün. **Vorher/Nachher `curl -IL`** auf alle 4 Sprachvarianten der jeweils
abgeschalteten URL: vorher 200, nachher 301→200 auf die neue Ziel-URL — dasselbe
Verifikationsmuster wie im Vorgänger-Loop § P2.1. Zusätzlich bei K2/K3: Live-Check, dass die
überlebende URL jetzt tatsächlich Event/Menu-JSON-LD und Live-Menü/Pakete zeigt (nicht mehr die
alte Teaser-Karte).

### Was NICHT in diesem Umsetzungsplan passiert
Die sprachabhängige JSON-LD-Übersetzung (Nebenbefund 3, hartcodiertes Deutsch in EN/IT/FR-Aufrufen)
ist bewusst **kein** Teil dieses Plans — eigenständige GEO-Verbesserung, kein Blocker.

## 6. Risikoeinschätzung

**Höheres Risiko als die reinen Striking-Distance-Textänderungen** (Einheiten A–C) — hier werden
Routing/Redirects **und** bei K2/K3 eine Komponenten-Datenanbindung geändert, nicht nur Strings.
Ein falscher Redirect auf einer Live-Domain mit sofortigem SFTP-Deploy ist nicht trivial rückgängig
zu machen. Mitigation: exaktes Kopieren des bewährten P2-Redirect-Musters, Slug-Verifikation vor
jedem Redirect, `curl -IL` Vorher/Nachher-Beweis pro URL, **K1 zuerst** (einfachster, risikoärmster
Fall) um das Muster zu bestätigen, bevor K2/K3 (mit Komponentenänderung) angegangen werden.

## 7. Freigabe

**Erteilt: Antoine, 12.09.2026, „Ja, setze das so um als /loop"** — nach Klärung, dass die
Navigation für den Gast unverändert bleibt und pro Anlass einzeln nach Datenlage entschieden wird
(nicht einheitlich „immer Pillar"). Umsetzung läuft als eigener Loop, siehe
`docs/LOOP-SILVESTER-WEIHNACHTEN-KONSOLIDIERUNG.md`.
