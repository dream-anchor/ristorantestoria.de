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
P2-Muster aus dem Vorgänger-Loop (`docs/KONZEPT-SEO-GSC-AUDIT.md` § P2.1), nur mit einer
zusätzlichen Komponente: die **Pillar-Variante hat das reichhaltigere Schema** (Event/Menu-JSON-LD),
die Standalone-Variante hat gar keines. Der Gewinner steht damit für alle drei Paare bereits fest.

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

## 2. Warum die Pillar-Variante in allen drei Fällen die richtige Ziel-URL ist

| Kriterium | Standalone | Pillar | Gewinner |
|---|---|---|---|
| Interne Verlinkung | 1 Link (nur `InternalLinks.tsx`, Homepage) | Hauptnavigation (sitewide, „Besondere Anlässe"-Dropdown) + mehrere Cross-Links von anderen Landingpages + Übersichtsseite | **Pillar** |
| Event/Menu-JSON-LD | keines | vorhanden (`{!standalone && (...)}`) | **Pillar** |
| Live-Menü-Integration | nein (nur Teaser/Inaktiv-Card) | ja (Supabase `MenuDisplay`, sobald Saison-Menü veröffentlicht) | **Pillar** |
| GSC-Performance Silvester | 189 Impr. / Pos. 10,5 | 4.774 Impr. / Pos. 10,61 | **Pillar** (25× mehr Volumen) |
| GSC-Performance Weihnachten | 761 Impr. / Pos. 11,86 | nicht in Top-163 (zu wenig Traffic) | Pillar hat aktuell weniger Volumen — trotzdem technisch überlegen, siehe unten |
| GSC-Performance Valentinstag | 1.452 Impr. / Pos. 20,56 | 418 Impr. / Pos. 41,3 | Standalone hat mehr Volumen, aber schlechtere Position auf beiden — siehe Nuance unten |

**Nuance Valentinstag:** hier hat die Standalone-URL aktuell mehr Impressionen, aber beide Varianten
ranken schlecht (Pos. 20,56 bzw. 41,3 — deutlich schlechter als Silvester/Weihnachten). Das ist ein
Lehrbuchbeispiel für **Keyword-Kannibalisierung**: die Suchintention „Valentinstag München" wird auf
zwei URLs aufgeteilt, keine bekommt genug gebündeltes Signal, um gut zu ranken. Genau das behebt die
Konsolidierung — nicht „welche URL gewinnt heute", sondern „beide Signale auf eine URL bündeln,
damit die Summe besser rankt als beide Teile einzeln". Die Pillar-URL bleibt trotzdem die technisch
richtige Zielseite (Schema, Navigation, Live-Menü), unabhängig vom aktuellen Impressionen-Snapshot.

## 3. Was beim Redirect NICHT verloren geht (Antoines Kernsorge)

Da beide Varianten **dieselbe Komponente mit identischem Intro/Gründe/Timeline/FAQ-Text** rendern,
gibt es keinen inhaltlichen Merge durchzuführen. Was tatsächlich beim Wegfall der Standalone-Route
verschwindet — und wie es aufgefangen wird:

| Element | Nur auf Standalone | Auffang-Maßnahme |
|---|---|---|
| SEO-Title/Description/H1 (Standalone-Variante) | ja | Verworfen — Pillar-Variante hat eigene, ebenfalls funktionierende SEO-Texte (Teil der Striking-Distance-Arbeit selbst, falls Cluster relevant) |
| Teaser-/Inaktiv-Card | ja | Ersatzlos — Pillar zeigt an derselben Stelle die vollständigen Pakete bzw. das Live-Menü, keine Funktionslücke |
| 1 interner Link von `InternalLinks.tsx` (Homepage) | ja | Ziel auf die Pillar-URL ummünzen (3 Zeilen in `InternalLinks.tsx`, nicht löschen) |
| Direkter Traffic auf die alte URL (Lesezeichen, alte Backlinks) | — | 301-Redirect fängt das ab, kein Traffic-Verlust |

**Ergebnis: es gibt nichts zu „verschmelzen"** — der Auftrag reduziert sich auf (a) Redirect,
(b) einen internen Link umbiegen, (c) die Standalone-Route aus Prerender/Sitemap nehmen.

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

## 5. Umsetzungsplan (Vorschlag, vor Freigabe nicht committen)

Analog zum P2-Redirect-Muster des Vorgänger-Loops, aber mit einem zusätzlichen Routing-Schritt, da
hier — anders als bei reinen 404-Fixes — eine **aktuell aktive, indexierte** Route abgeschaltet wird:

### Schritt 1 — Route deaktivieren
In `src/App.tsx` `generateRoutes()`: die drei Standalone-Routen (`silvester-muenchen`,
`weihnachten-muenchen`, `valentinstag-muenchen`, je 4 Sprachen) aus der generierten Routenliste
entfernen, damit Prerender dafür keine statischen HTML-Dateien mehr baut und sie nicht mehr im
Sitemap-Generator (`scripts/generate-sitemap.mjs`) auftauchen.

### Schritt 2 — 301-Redirects ergänzen
In `public/.htaccess`, Bestandsmuster „Legacy URL Redirects"/§ P2.1 des Vorgänger-Loops
wiederverwenden: je Anlass × 4 Sprachen ein `RewriteRule` von der alten Standalone-URL auf die
korrekte Pillar-URL. **Exakte Ziel-Slugs vor Umsetzung gegen `src/config/seasonalMenus.ts`
(`slugs.en/it/fr`) verifizieren, nicht raten** — dieselbe Sorgfaltsregel wie beim Vorgänger-Loop
(„ein falscher Redirect auf einer Live-Domain mit sofortigem Deploy ist teurer als der ursprüngliche
Zustand").

### Schritt 3 — Internen Link umbiegen
`src/components/InternalLinks.tsx` Zeilen 26–28: die drei Standalone-Ziele durch die entsprechenden
Pillar-URLs ersetzen.

### Schritt 4 — Nebenbefunde mitfixen (selber PR, da ohnehin dieselben Dateien offen)
- `SilvesterMuenchen.tsx`: Event/Menu-JSON-LD-Preise auf 99/150 € (Classic/Premium) korrigieren,
  damit sie zum sichtbaren Seiteninhalt passen.
- `SeasonalBanner.tsx:28`: `cta1`-Ziel für Silvester von `weihnachtsfeier-muenchen` auf die
  kanonische Silvester-Pillar-URL korrigieren.

### Schritt 5 — Beweis
`npm run build` (Prerendering muss 3×4=12 Routen weniger zeigen als vorher, Sitemap ebenso) +
`npm run lint` grün. **Vorher/Nachher `curl -IL` auf alle 12 betroffenen URLs** (4 Sprachen × 3
Anlässe): vorher 200, nachher 301→200 auf die Pillar-URL — exakt das Verifikationsmuster aus dem
Vorgänger-Loop § P2.1.

### Was NICHT in diesem Schritt passiert
Die sprachabhängige JSON-LD-Übersetzung (Nebenbefund 3) ist bewusst **kein** Teil dieses
Umsetzungsplans — eigenständige GEO-Verbesserung, kein Blocker, würde den Scope unnötig aufblähen.

## 6. Risikoeinschätzung

**Höheres Risiko als die reinen Striking-Distance-Textänderungen** (Einheiten A–C), da hier
Routing/Redirects statt reiner Strings geändert werden — ein falscher Redirect auf einer Live-Domain
mit sofortigem SFTP-Deploy ist nicht trivial rückgängig zu machen. Mitigation: exaktes Kopieren des
bereits bewährten P2-Redirect-Musters, Slug-Verifikation vor jedem Redirect, `curl -IL`
Vorher/Nachher-Beweis pro URL (12 Stück), keine Abkürzung.

## 7. Freigabe-Frage

Bevor ein LOOP/Umsetzungsprotokoll dafür gebaut wird: **Freigabe für den Umsetzungsplan in
Abschnitt 5 nötig** (wie bei den Striking-Distance-Einheiten — Redirects sind hier zusätzlich eine
strukturelle statt reine Text-Entscheidung). Insbesondere: Einverständnis, dass die drei
Standalone-URLs **abgeschaltet** werden (nicht nur inhaltlich angeglichen) — das ist die Konsequenz
aus Abschnitt 3 (nichts geht verloren, weil nichts Eigenständiges drin steht), aber eine explizite
Bestätigung ist sinnvoll, da es eine andere Art Eingriff ist als die bisherigen Kriterien.
