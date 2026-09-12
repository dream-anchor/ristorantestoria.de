# AUDIT — Striking-Distance-Keywords nach GSC-Export vom 12.09.2026

**Status: Audit only, keine Code-Änderung.** Datengrundlage: manueller GSC-Export
`ristorantestoria.de-Performance-on-Search-2026-09-12.zip` (`Suchanfragen.csv` 1.000 Zeilen,
`Seiten.csv` 163 Zeilen), Fenster ca. 92 Tage bis 12.09.2026. On-Page-Ist-Zustand (Title/H1/H2)
live aus dem Repo gelesen (Stand heute), nicht aus dem Export.

## 1. Die Theorie — stimmt sie?

**Ja, mit Einschränkungen.** Bekannt als „Striking Distance" (Rank Ranger, Aleyda Solis u. a. seit
~2016), teils auch „SERP Proximity" oder schlicht „Quick Wins". Kernlogik korrekt:

- Google hält eine Seite für eine Query bereits für relevant genug, um sie auf Pos. 8–20 zu zeigen
  — das ist der eigentliche Beweis, den man sonst mühsam aufbauen müsste (Themenrelevanz,
  Grundautorität). Fehlt nur noch der letzte Schub an On-Page-Signalen.
- Eine exakte Keyword-Phrase in Title/H1/H2 ist eines der günstigsten verbleibenden Signale, weil
  Nutzer und Google Textbausteine nahe am Seitenanfang stärker gewichten (Title > H1 > erste
  Absätze > weiterer Content).
- Empirisch oft schneller wirksam als neue Seiten von Position 0 aufzubauen — die „letzten Meter"
  brauchen weniger neue Signale als der Sprung von Seite 3 auf Seite 1.

**Einschränkungen, die im konkreten Datensatz sofort relevant werden** (Abschnitt 3):
1. Funktioniert nur, wenn die Seite **thematisch bereits wirklich passt** — Keyword in Title zu
   pressen, ohne dass der Content das Thema trägt, bringt nichts und riskiert Rankingverlust auf
   den Queries, für die die Seite bisher schon rankt (Title-Länge, Klarheit).
2. **Positionsdaten pro Einzel-Query bei niedrigem Impressions-Volumen sind verrauscht** — bei
   <25 Impressionen/92 Tage ist die gemessene Position statistisch wenig belastbar. Nur Queries mit
   spürbarem Volumen berücksichtigt.
3. **Korrelation ≠ Kausalität**: eine Positionsänderung nach dem Fix kann auch an Google-Algo-
   Schwankungen, Saisonalität oder Konkurrenzbewegung liegen. Vorher/Nachher-Fenster von 4–8 Wochen
   nötig, nicht nach 3 Tagen bewerten.
4. Dieser Export liefert **keine Page×Query-Kombination** (nur Top-Queries site-weit und Top-Seiten
   site-weit getrennt) — die Supabase-Tabelle `gsc_page_query_metrics` hätte das, war aber ohne
   Login/Access-Token nicht erreichbar (siehe Abschnitt 6). Die Zuordnung Query→Seite unten beruht
   auf (a) thematischer Passung der URL/Slug-Struktur und (b) Abgleich der Ø-Position der Query
   gegen die Ø-Position der Seite im selben Fenster — beides ein Näherungsverfahren, kein Beweis.
   Vor Umsetzung: Google Search Console UI → Seite filtern → Suchanfragen-Tab, um die Zuordnung
   pro Ziel-URL exakt zu bestätigen (5 Min. Aufwand, sollte vor P1 des Umsetzungs-Loops passieren).

## 2. Kernbefund

Für **jede** der 15 geprüften Zielseiten fehlt die exakte Kopf-Keyword-Phrase in Title **und** H1
**und** H2 — nicht wegen fehlendem Content, sondern wegen **Wortstellung**: „Pizza München" steht
da, aber nicht „Beste Pizza München"; „Italienisches Restaurant **in** München" statt „Italienisches
Restaurant München" (das „in" bricht den Exact-Match); „Silvester **in** München" statt „Silvester
München". Das ist ein systematisches Muster über fast den gesamten SEO-Seitenbestand, kein
Einzelfall — spricht für einen gemeinsamen Root Cause (vermutlich: Title/H1 wurden auf natürliche
Lesbarkeit statt auf Exact-Match optimiert) und dafür, dass sich der Fix als eine Einheit sauber
bündeln lässt.

**Adressierbares Volumen** (nur Cluster mit verifiziertem Content-Gap, WM-2026- und
Marken-Verwechslungs-Queries siehe Abschnitt 3 bereits herausgerechnet): **~23.400 Impressionen /
92 Tage** über 11 Cluster, aktuell 0–13 Klicks je Query trotz Pos. 8–20 (CTR auf Seite 2 praktisch
immer <1 %, da kaum jemand auf Google-Seite 2 klickt).

## 3. Aus dem Kandidaten-Set ausgeschlossen (Noise)

| Queries | Impr. | Grund |
|---|---|---|
| `storia stadeln`, `pizzeria storia stadeln` (+ Varianten), `pizza storia`, `pizzeria storia` | ~1.850 | Andere Pizzeria gleichen/ähnlichen Namens in Stadeln bei Fürth (~170 km entfernt) — Markenverwechslung, keine eigene Zielseite, „Stadeln" ins München-Content einzubauen wäre sachlich falsch. |
| `la storia*` (Forst, Hotel, Speisekarte, Ristorante) | ~500 | Anderes Unternehmen namens „La Storia" (Hotel/Restaurant Forst u. a.) — gleiche Logik. |
| `la famiglia münchen` | 457 | Eigenständiges Münchner Restaurant dieses Namens — keine Keyword-Optimierung, die das für uns kapert. |
| `wm finale public viewing münchen`, `public viewing wm 2026 münchen`, `wm finale münchen public viewing`, `königsplatz public viewing` u. ä. | ~1.500 | WM-Finale war 19.07.2026, seit ~2 Monaten vorbei. Traffic baut sich natürlich ab, unabhängig von On-Page-Fixes — laut `docs/LOOP-SEO-GSC-AUDIT.md` P3.2 bewusst evergreen gehalten, aber keine Keyword-Investition mehr sinnvoll. |
| `*near me`-Queries (`best italian restaurants near me`, `italian restaurant near me` etc.) | ~450 | Local-Pack-/Geo-Signal-getrieben (Nutzerstandort), nicht primär durch Title/H1-Text lösbar — gehört zu GBP-Optimierung, nicht zu diesem Audit. |
| `beste holzofenpizza münchen`, `holzofenpizza münchen` | ~358 | **Korrektur (Antoine, 12.09.2026):** STORIA verwendet einen Steinofen, keinen Holzofen (offene Flamme) — kein austauschbares Synonym, sondern ein anderer Ofentyp. Ursprünglich in 4.2/4.9 als Content-Gap vorgeschlagen, zurückgezogen, um keine falsche Tatsachenbehauptung zu erzeugen. |

## 4. Priorisierte Opportunities (Top-Cluster, absteigend nach Volumen)

Format je Zeile: Query — Impr. (92 Tage) — Ø Position — aktuell in Title/H1/H2?

### 4.1 EN Romantic Dinner (`en/romantic-dinner-munich/`) — größter Einzel-Hebel
- `best restaurants romantic` — 4.864 Impr. — Pos. 9,28 — fehlt überall
- `best restaurants for date` — 1.813 Impr. — Pos. 10,73 — fehlt überall
- `romantic restaurants munich` — 118 Impr. — Pos. 7,50 — H2 hat nur Singular „Romantic Restaurant"
- weitere: `romantic dinner` (52), `date night munich` (46), `romantic restaurants` (42), `romantic restaurants in munich` (44)

Ist-Title: „Romantic Dinner Munich | 5 min from Königsplatz | STORIA"
Ist-H1: „Romantic Dinner Munich – Candlelight at STORIA"

**Zusatzbefund (Bug, nicht Teil der Keyword-Optimierung):** Ein H2 auf dieser EN-Seite ist
hartcodiert deutsch geblieben — „Ihr romantischer Abend im STORIA" — erscheint unübersetzt auf der
englischen Seite. Sollte im Umsetzungs-Loop mitgefixt werden (translations/en.ts, `t.seo.romanticDinner`).

**Empfehlung (Beispiel, nicht final — Text ist Geschäftsentscheidung, siehe Abschnitt 7):**
Title so umbauen, dass „best romantic restaurant" bzw. „romantic dinner" **und** ein Date-Bezug
beide wörtlich vorkommen, z. B. Title: „Best Romantic Restaurant Munich – Date Night Dinner | STORIA".
Ein H2 exakt „Best Romantic Restaurants in Munich for Date Night" ergänzen/umbenennen.

### 4.2 Pizza München (`pizza-muenchen/`)
- `beste pizza münchen` — 1.751 — Pos. 9,79 — nur im H2 („beste Pizza München bietet"), nicht in Title/H1
- `pizzeria münchen` — 1.488 — Pos. 18,19 — nur im H2, nicht in Title/H1
- `pizza münchen` — 554 — Pos. 19,94 — bereits in Title/H1/H2 (dieser exakte Longtail rankt trotzdem schlecht — evtl. Sättigung/Kannibalisierung mit anderen Pizza-Seiten prüfen)
- `beste pizzeria münchen` — 353 — Pos. 10,23 — nur im H2
- weitere: `pizzerien münchen` (182), `beste pizza in münchen` (275), `pizzeria in münchen` (265), `beste holzofenpizza münchen` (209), `günstige pizza münchen` (52), `gute pizza münchen` (92), `beste pizzeria münchen innenstadt` (103)

Ist-Title: „Pizza München – Steinofen-Pizza ab 9,90 € | STORIA Maxvorstadt"

**Empfehlung:** „Beste Pizza München" bzw. „Pizzeria München" testweise in Title/H1 vorziehen, z. B.
Title: „Beste Pizza München – Pizzeria ab 9,90 € | STORIA Maxvorstadt" (additiv: nichts vom
bestehenden Title entfernt, nur „Beste"/„Pizzeria" ergänzt — Preis-Anker bleibt erhalten).

**Korrektur (Antoine, 12.09.2026): kein Holzofen-Synonym.** STORIA verwendet einen **Steinofen**,
keinen Holzofen (offene Flamme) — beides ist technisch nicht dasselbe. `beste holzofenpizza münchen`
(209 Impr.) und `holzofenpizza münchen` (149 Impr., siehe 4.9) sind damit **kein** Content-Gap,
sondern nicht adressierbar, ohne eine falsche Tatsachenbehauptung zu machen — von einer
„Holzofen"-Ergänzung wird abgesehen. Beide Queries wandern in die Noise-Liste (Abschnitt 3).

### 4.3 Catering (`catering/`) — schwächste Ø-Position aller Top-10-Seiten (17,72)
- `hochzeit catering münchen` — 474 — Pos. 17,23
- `catering münchen private feier` — 372 — Pos. 19,66
- `catering münchen preise` — 321 — Pos. 13,69
- `catering hochzeit münchen` — 266 — Pos. 14,82
- `pizza catering münchen` — 206 — Pos. 12,15
- weitere: `geburtstags catering münchen` (127), `buffet catering münchen` (102), `catering münchen günstig` (61), plus 5× `catering münchen N personen` (20/30/50/10/100 Gäste, zusammen ~220 Impr.)

Ist-Title: „Catering München | Italienisches Event-Catering ab 25€ – STORIA"

Kein einziges der Ziel-Keywords kommt wörtlich in Title/H1/H2 vor — Seite spricht durchgängig von
„Event-Catering", nie von „Hochzeit" oder „Preise" in der Struktur (Preise stehen nur im Fließtext
der Pakete). **Nebenbefund (Tech-Debt, kein SEO-Impact):** `Catering.tsx` hat Title/H1/Description
hartcodiert direkt im Component statt aus `translations/de.ts` zu ziehen; ein passendes
`t.pages.catering.*`-Objekt existiert dort bereits, wird aber nirgends referenziert (toter Key) —
lohnt sich, im selben Zug zu konsolidieren, damit künftige Title-Änderungen an einer Stelle
passieren wie bei allen anderen Seiten.

**Empfehlung:** eigene H2 „Hochzeits-Catering München" ergänzen (Pakete-Sektion existiert bereits,
nur ohne diese Überschrift), Title um „Preise" oder eine Preiszahl ergänzen (Nutzer suchen aktiv
danach: `catering münchen preise` 321 Impr.).

### 4.4 EN Best Italian Restaurant Munich (`en/best-italian-restaurant-munich/`)
- `best italian restaurant munich` — 734 — Pos. 8,90 — in Title (aber Title ist bereits stark, evtl. Sättigung)
- `italian restaurant munich` — 626 — Pos. 13,41 — nicht als eigenständige Phrase (immer „...in Munich")
- weitere: `best italian restaurants near me` (368, Noise siehe 3.), `best italian restaurants in munich` (102), `italian restaurants munich` (112), `best italian munich` (93), `munich italian restaurant` (99)

Ist-H1: „Authentically Southern Italian – the Cuisine of the Cilento in Maxvorstadt" — **enthält
„Italian Restaurant" gar nicht.** Das ist der auffälligste Einzelbefund im ganzen Audit: die Seite
rankt für „best italian restaurant munich" bereits auf Pos. 8,9 (Title trägt das), aber H1 und alle
H2 sprechen konsequent von „Cilento-Küche" statt „Italian Restaurant" — Relevanzsignal fehlt exakt
dort, wo es am stärksten zählt.

**Empfehlung:** H1 um „Italian Restaurant" ergänzen ohne die Cilento-Differenzierung zu verlieren,
z. B. „The Best Italian Restaurant in Munich – Cuisine of the Cilento in Maxvorstadt".

### 4.5 Firmenfeier München (`firmenfeier-muenchen/`)
- `firmenfeier münchen` — 1.144 — Pos. 15,12 — in Title/H1, aber in KEINEM H2 wiederholt
- `betriebsfeier münchen` — 32 — Pos. 10,88 — Wort „Betriebsfeier" kommt nirgends vor (Synonym-Lücke, wie Holzofen/Steinofen oben)
- `firmenveranstaltungen münchen` — 47 — Pos. 17,98 — fehlt

**Empfehlung:** ein H2 mit exakter Phrase „Firmenfeier München" ergänzen (aktuell nur „Firmenevents
München" als nächstliegende Variante), „Betriebsfeier" einmal als Synonym im Intro-Absatz ergänzen.

### 4.6 Italienisches Restaurant München (`italienisches-restaurant-muenchen/`) — Kopf-Keyword komplett leer
- `italienisches restaurant münchen` — 81 Impr. — Pos. 20,88 — **kommt in Title, H1 UND jeder H2 nicht als zusammenhängende Phrase vor** (immer „...Restaurant in München" oder „...Restaurant Maxvorstadt München", „in"/„Maxvorstadt" bricht den Match)
- `italiener münchen` — 380 — Pos. 14,34 — Seite nutzt konsequent „italienisches Restaurant", nie „Italiener"

Auffällig: Seite rankt für dieses Kopf-Keyword schlechter (Pos. 20,88) als der Seitendurchschnitt
laut `Seiten.csv` (Pos. 6,95 über 6.305 Impr.) — d. h. die Seite rankt gut für andere (vermutlich
Maxvorstadt-spezifische) Varianten, aber nicht für den generischen Haupt-Suchbegriff. Klarster
Einzelfall im Audit, bei dem das exakte Kopf-Keyword schlicht fehlt.

**Empfehlung:** Title/H1 so umformulieren, dass „Italienisches Restaurant München" als
zusammenhängende Phrase einmal vorkommt (aktuell trennt „Maxvorstadt" bzw. „in der" den Match),
z. B. Title: „Italienisches Restaurant München-Maxvorstadt | Bestes Restaurant | STORIA".

### 4.7 Italiener Königsplatz (`italiener-koenigsplatz/`)
- `königsplatz restaurant` — 118 — Pos. 8,53 — fehlt
- `restaurant königsplatz münchen` — 114 — Pos. 9,22 — fehlt (Wortstellung: Seite hat „Italiener Königsplatz", nicht „Restaurant Königsplatz")
- `italiener maxvorstadt` — 265 — Pos. 9,50 — Wort „Maxvorstadt" kommt in Title/H1/H2 gar nicht vor, nur im Fließtext
- `italienisches restaurant maxvorstadt` — 39 — Pos. 7,97 — dito

**Empfehlung:** „Maxvorstadt" strukturell in mindestens ein H2 heben (steht bisher nur im Fließtext),
z. B. „Italienisches Restaurant in der Maxvorstadt am Königsplatz".

### 4.8 Italiener Hauptbahnhof (`italiener-hauptbahnhof-muenchen/`)
- `münchen hauptbahnhof essen` — 210 — Pos. 12,46 — fehlt
- `restaurant hauptbahnhof münchen` — 163 — Pos. 12,45 — Wort „Restaurant" nie mit „Hauptbahnhof München" kombiniert (Seite sagt „Italiener am Hauptbahnhof")
- `restaurants münchen hauptbahnhof` — 80 — Pos. 13,43 — fehlt

**Empfehlung:** ein H2 mit „Restaurant am Hauptbahnhof München" ergänzen (zusätzlich zu „Italiener",
nicht statt dessen — beide Formulierungen werden gesucht).

### 4.9 Neapolitanische Pizza München (`neapolitanische-pizza-muenchen/`)
- `neapolitanische pizza münchen` — 1.083 — Pos. 10,23 — bereits in Title/H1/H2 ✓ (kein Fix nötig, rankt trotzdem nicht auf Seite 1 — Content-/Authority-Frage, kein Keyword-Problem)
- `beste neapolitanische pizza münchen` — 222 — Pos. 11,98 — „beste" fehlt überall
- `holzofenpizza münchen` — 149 — Pos. 12,21 — Seite nutzt nur „Steinofen" (Synonym-Lücke, siehe 4.2 — hier NUR ergänzen, nicht auf beiden Pizza-Seiten dieselbe neue Phrase verwenden, sonst Kannibalisierung zwischen 4.2 und 4.9)

### 4.10 Aperitivo München (`aperitivo-muenchen/`)
- `aperitivo` — 344 — Pos. 9,50 — bereits stark vertreten ✓
- `aperitivo bar münchen` — 207 — Pos. 11,02 — Wort „Bar" fehlt komplett
- `aperol bar münchen` — 140 — Pos. 8,53 — dito

**Empfehlung:** ein H2 „Aperitivo Bar München" statt/zusätzlich zu „Aperol Spritz & Negroni im
STORIA" — „Bar" ist der fehlende Baustein, nicht „Aperitivo" selbst.

### 4.11 Geburtstagsfeier München (DE `geburtstagsfeier-muenchen/` + EN `en/birthday-party-munich/`)
- DE: `geburtstag feiern restaurant münchen` (206, Pos. 7,30), `restaurant für geburtstag münchen` (78, Pos. 8,49) — beide fehlen, Seite sagt „Geburtstagsfeier", nie „Geburtstag feiern" oder „Restaurant für Geburtstag"
- EN: `munich birthday celebration` (233, Pos. 11,76), `best restaurant for birthday celebration` (158, Pos. 9,36) — nicht geprüft (nicht im Recherche-Auftrag enthalten), gleiche Cluster-Logik vermutlich anwendbar — vor Umsetzung nachprüfen.

### 4.12 IT — Ristorante Italiano Monaco di Baviera Cluster
- `ristoranti italiani a monaco di baviera` — 585 — Pos. 13,07
- `ristorante italiano monaco di baviera` — 243 — Pos. 10,33
- `migliori ristoranti italiani monaco di baviera` — 57 — Pos. 11,74
- weitere: `ristoranti italiani monaco di baviera` (198), `ristorante italiano monaco` (45), `ristoranti italiani a monaco di baviera centro` (62), `ristoranti italiani a monaco` (36)

Zielseite `it/miglior-ristorante-italiano-monaco/` spricht durchgängig von „Ristorante del Sud
Italia" + „Monaco" — nie „Ristorante Italiano" + „Monaco di Baviera" (die tatsächlich gesuchte
Kombination). Stärkster Wortstellungs-Fall im ganzen Audit: **keines** der drei Top-Keywords kommt
in Title/H1/H2 vor, bei zusammen 885 Impr.

**Empfehlung:** Title/H1 um „Ristorante Italiano" + „Monaco di Baviera" (volle Ortsbezeichnung,
nicht nur „Monaco") ergänzen, ohne das Cilento-Differenzierungsmerkmal zu verlieren — analog zu 4.4.

## 5. Strukturbefunde (kein Keyword-Fix, aber vor Umsetzung klären)

**Mögliche Kannibalisierung Silvester:** `silvester-muenchen/` und `besondere-anlaesse/silvester/`
sind **dieselbe Komponente** (`SilvesterMuenchen.tsx`) mit unterschiedlichem `standalone`-Flag,
liefern aber unterschiedliche Title/H1 aus — zwei live URLs für praktisch denselben Silvester-Intent
(`Seiten.csv`: `besondere-anlaesse/silvester/` Pos. 10,61/4.774 Impr., `silvester-muenchen/`
Pos. 10,5/189 Impr.). **Beide Seiten sind laut Code aktuell `isActive=false`** („Programm wird im
Oktober veröffentlicht") — das erklärt einen Teil der schwachen Rankings unabhängig von Title/H1
(dünnerer/Teaser-Content statt vollem Menü). Vor jedem Keyword-Fix hier klären: ist die
Zwei-URL-Struktur Absicht (z. B. eine als Sub-Page unter „Besondere Anlässe"-Pillar, andere als
eigenständige Landingpage mit unterschiedlicher Zielgruppe) oder historisch gewachsene Dublette?
Gleiches Muster bei **Weihnachten**: `weihnachten-muenchen/` und
`besondere-anlaesse/weihnachtsmenue/` (dieselbe Komponente `WeihnachtenMuenchen.tsx`), zusätzlich
eine dritte, inhaltlich andere Seite `weihnachtsfeier-muenchen/` (Firmen-Fokus, eigene Komponente)
— hier vermutlich kein echtes Kannibalisierungsproblem (unterschiedliche Intents: privates
Weihnachtsessen vs. Firmen-Weihnachtsfeier), aber die Silvester/Weihnachten-Dublette sollte
mitgeprüft werden, wenn schon an den Titles gearbeitet wird.

**Bug, EN Romantic Dinner:** Ein H2 ist hartcodiert deutsch geblieben (Abschnitt 4.1) — unabhängig
vom Keyword-Audit ein Übersetzungsfehler, der auf der Live-Seite sichtbar ist.

**Tech-Debt, Catering:** toter `t.pages.catering.*`-Key in `translations/de.ts`, Component nutzt
hartcodierte Strings (Abschnitt 4.3) — keine SEO-Auswirkung, aber macht künftige Title-Änderungen
inkonsistent zum Rest der Codebase.

**`pizza münchen` (exakter Match) rankt trotz Vollabdeckung in Title/H1/H2 nur Pos. 19,94** —
stärkstes Indiz im Datensatz, dass reines Keyword-Placement einen Deckel hat: bei sehr
wettbewerbsintensiven 2-Wort-Head-Terms ("pizza münchen", Suchvolumen laut Impressionen mit
Abstand am höchsten der ganzen Pizza-Gruppe) zählt Off-Page-Autorität vermutlich stärker als
On-Page-Text — realistische Erwartungssteuerung für Abschnitt 7.

## 6. Datenzugriff — offener Punkt

Für eine belastbare Page×Query-Zuordnung (statt der Näherung in Abschnitt 4) wäre `SELECT * FROM
gsc_page_query_metrics WHERE query IN (...)` in der projekteigenen Supabase-Tabelle der korrekte
Weg — Schema existiert bereits (`supabase/migrations/20240206000000_gsc_monitoring_schema.sql`),
befüllt über die Edge Function `gsc-sync`. Kein Zugriff in dieser Session möglich (`supabase login`
nicht verfügbar, kein Service-Role-Key lokal, projektweite Regel „Supabase nur über Lovable" gilt
für Schreiben/Migrationen — für einen reinen Lesezugriff zur Analyse wäre ein kurzer,
review-facher `SELECT` über die Supabase-SQL-Konsole vermutlich schneller als der CLI-Umweg,
falls gewünscht).

## 7. Vorschlag nächster Schritt

Kein Umsetzungs-Loop in diesem Turn gestartet (Auftrag war ausdrücklich „Audit zuerst"). Bei
Freigabe: neuer `KONZEPT-STRIKING-DISTANCE.md` + `LOOP-STRIKING-DISTANCE.md` nach demselben Muster
wie `docs/LOOP-SEO-GSC-AUDIT.md` — Title/H1/H2-Änderungen sind reine Textstrings (wie P1 im letzten
Loop), also risikoarm, aber Copy-Entscheidung: konkrete Formulierungen vor Commit hier im Chat
abstimmen, nicht automatisch übernehmen. Vor P1 des Umsetzungs-Loops: die 3–4 größten Cluster
(4.1, 4.2, 4.3, 4.6) in der GSC-UI direkt auf die Zielseite filtern, um die Query→Page-Zuordnung
zu bestätigen, bevor Title/H1 dafür umgeschrieben werden.
