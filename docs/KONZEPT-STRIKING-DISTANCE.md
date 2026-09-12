# KONZEPT — Striking-Distance-Keyword-Optimierung nach GSC-Export vom 12.09.2026

## Ausgangslage

Vollständiges Audit unter `docs/striking-distance-audit-2026-09-12.md` (Datenbasis: manueller
GSC-Export vom 12.09.2026, 92-Tage-Fenster, plus Live-Abgleich der 15 wichtigsten SEO-Landingpages
gegen den aktuellen Code-Stand). **Dieses Dokument baut direkt darauf auf — bei Widerspruch zählt
das Audit als Primärquelle für die Zahlen, dieses KONZEPT für die Umsetzung.**

**Kernbefund:** auf praktisch jeder geprüften Zielseite fehlt die exakte Kopf-Keyword-Phrase in
Title/H1/H2 — nicht wegen fehlendem Content, sondern wegen Wortstellung („Pizza München" statt
„Beste Pizza München", „Restaurant **in** München" statt „Restaurant München", Synonym-Lücken wie
„Steinofen" vs. „Holzofen"). Adressierbares Volumen nach Bereinigung um Noise (WM-2026 vorbei,
Markenverwechslungen „Storia Stadeln"/„La Storia"/„La Famiglia München", Near-me-Queries):
**~23.400 Impressionen/92 Tage** über 12 Cluster, aktuell fast durchweg <1 % CTR.

**Ziel dieses Loops:** die 12 identifizierten Cluster durch präzise Title/H1/H2-Anpassungen von
Google-Seite-2 (Pos. 8–20) Richtung Seite 1 bewegen — gemessen am Vorher-Zustand aus dem Audit
(Tabellen in Abschnitt 3 dieses Dokuments = Baseline). Sekundär: zwei Strukturbefunde klären
(mögliche Silvester/Weihnachten-Kannibalisierung) und zwei Nebenbugs mitfixen (unübersetztes H2 auf
der EN-Romantic-Dinner-Seite, toter Translation-Key in Catering.tsx).

## Harte Regel: Copy ist Geschäftsentscheidung (wie im Vorgänger-Loop)

**Kein Title-/H1-/H2-Text wird ohne explizite Freigabe im Chat committet.** Alle Vorschläge in
Abschnitt 3 sind Entwürfe eines Senior-SEO-Konzepts, keine finalen Texte. Vor dem ersten Commit
jeder Einheit (A/B/C) muss die zugehörige Copy-Tabelle im Chat vorgelegt und bestätigt werden —
analog zum Vorgänger-Loop, wo P1.1–P1.3 in einem Rutsch mit „Ja, setz alles um" freigegeben wurden.
Es reicht **eine** Freigabe pro Einheit, nicht 13 Einzel-Rückfragen. Änderungen sind **ausschließlich
String-Literale** (Title/Description/H1/H2-Überschriften) — keine JSX-Struktur, keine neuen
Komponenten, keine Preis-/Fakten-Änderungen außer den bereits im Audit belegten (Holzofen-Synonym,
Maxvorstadt-Erwähnung — beides Fakten, keine neuen Behauptungen).

## Harte Regel: Query→Page-Zuordnung vor jedem Kriterium verifizieren

Der Export liefert **keine** Page×Query-Kombination (Audit § 1, Punkt 4) — die Zuordnung unten
beruht auf thematischer Passung + Positions-Korrelation, nicht auf einer bestätigten GSC-Zeile.
**Vor jedem einzelnen Kriterium:** in der GSC-UI (search.google.com/search-console) die Zielseite
filtern → Tab „Suchanfragen" → prüfen, ob die im Kriterium genannten Queries dort tatsächlich mit
nennenswerten Impressionen auftauchen. Weicht die Realität von der hier angenommenen Zuordnung ab
(z. B. eine Query gehört zu einer anderen Seite als angenommen), Kriterium entsprechend anpassen,
nicht blind nach Schema umsetzen. Dauer: ~2 Min. je Kriterium, spart Fehlinvestition in falsche
Seite.

## Harte Regel: Additiv statt ersetzend (Gemini-Review, 12.09.2026, geprüft und übernommen)

Externe Zweitmeinung eingeholt — drei Punkte davon ändern dieses KONZEPT, zwei bestätigen bereits
getroffene Entscheidungen (Details unten):

1. **Title-Änderungen ergänzen, nicht ersetzen.** Ein Title, der bereits für ein anderes Keyword
   gut rankt (z. B. Pos. 1–3), darf dieses Keyword beim Striking-Distance-Fix nicht verlieren.
   Deshalb wurden zwei Vorschläge korrigiert (A1, A2 unten) — ursprünglich hätten sie bestehende
   Phrasen (Preis-Anker „ab 9,90 €", „Romantic Dinner Munich") komplett ersetzt statt ergänzt.
   **Regel für alle 12 Kriterien:** vor jeder Title-Änderung prüfen, ob die aktuelle Formulierung
   für eine andere, bereits stark rankende Query trägt (Stichprobe in `Suchanfragen.csv`/GSC-UI) —
   wenn ja, nur ergänzen, nie komplett neu schreiben.
2. **Search Intent vorab prüfen (inkognito googeln), nicht blind nach Position optimieren.** Für
   die zwei größten Cluster bereits durchgeführt (WebSearch, 12.09.2026):
   - `best romantic restaurants munich` / `best restaurants romantic`: Top-Ergebnisse sind
     durchweg Aggregatoren/Listicles — TheFork, Falstaff, Tripadvisor, OpenTable, The Culture
     Trip, Yelp, Wanderlog, Cityseeker. **Kein einzelnes Restaurant** erscheint in der sichtbaren
     Trefferliste.
   - `beste pizza münchen`: gleiches Bild — Mit Vergnügen, Tripadvisor, Falstaff, PRINZ,
     Secret München, WerKenntDenBesten dominieren; einzelne Pizzerien (Pizzesco, 60 Secondi,
     Casa Nostra) werden nur *innerhalb* dieser Artikel genannt, ranken nicht selbst auf Seite 1.
   - **Konsequenz für A1 und A2:** On-Page-Fix bleibt sinnvoll (kostenlos, ohne Risiko, siehe
     Regel 1), aber Erwartung dämpfen — der Sprung auf Seite 1 ist hier strukturell schwerer als
     bei den eng-lokalen Clustern (B3 Königsplatz, B4 Hauptbahnhof, C4 IT-Ristorante), wo in
     Stichproben einzelne Geschäfte durchaus vorne stehen. Zusätzliche, außerhalb des Code-Scopes
     liegende Empfehlung: Eintrag/Vollständigkeit auf genau diesen Aggregator-Plattformen (TheFork,
     Tripadvisor „Romantic"-Filter, Falstaff) hat für diese zwei Cluster vermutlich höheren ROI als
     weitere On-Page-Textarbeit — analog zur Listicle-Outreach-Empfehlung im
     Oktoberfest-Vorgänger-Loop (`docs/KONZEPT-SEO-GSC-AUDIT.md` § „Was NICHT code-seitig lösbar
     ist"). Kein Kriterium in diesem Loop, nur ein Hinweis an Antoine.
   - **Für die übrigen 10 Kriterien:** derselbe Kurz-Check (inkognito googeln, 1 Suche) ist Teil der
     bereits bestehenden Vor-Kriterium-Verifikation oben („Query→Page-Zuordnung vor jedem Kriterium
     verifizieren") — dort ergänzt, kein separater Schritt.
3. **Neue/umbenannte H2 braucht einen echten Absatz, kein Lippenbekenntnis.** Wo die Überschrift
   umbenannt wird, muss der Text direkt darunter die Suchanfrage tatsächlich beantworten — nicht
   nur das Keyword im Fließtext „unterbringen". Bei den meisten Kriterien hier deckt der
   bestehende Absatz das inhaltlich bereits ab (nur die Überschrift hat nicht gematcht, siehe
   Audit) — dann reicht die H2-Änderung. Wo das **nicht** der Fall ist, im jeweiligen Kriterium
   unten explizit vermerkt (aktuell keines — bei Abweichung während der Umsetzung nachtragen).
4. **Fokus auf Impressionen statt nur Position** — bereits im Audit umgesetzt (Filter Impr. ≥ 25,
   Cluster nach Volumen sortiert, siehe Audit § „Kernbefund"). Keine Änderung nötig, nur bestätigt.
5. **Interner Link-Push mit Exact-Match-Ankertext.** Sinnvolle Ergänzung, in jedem Kriterium unten
   als optionaler letzter Schritt aufgenommen: von einer bereits gut rankenden, thematisch
   verwandten Seite (Homepage oder eine andere Landingpage, siehe Bestandsmuster
   `InternalLinks.tsx`/„Related Pages"-Sektion, bereits im Vorgänger-Loop unter P3 verwendet — nicht
   neu erfinden) einen Kontext-Link zur Zielseite ergänzen, Ankertext = die jeweilige Ziel-Phrase.
   Nur wo eine passende Quellseite bereits existiert und der Link inhaltlich Sinn ergibt — kein
   erzwungener Link nur für den Ankertext.

## Deploy-Modell (unverändert zum Vorgänger-Loop)

Push auf `main` = sofortiges Live-Deployment per SFTP (`docs/LOOP-SEO-GSC-AUDIT.md` bereits
referenziert, siehe dort § „Deploy-Modell"). Bündelung „ein PR je Einheit" gilt strikt. Vor jedem
Merge: `npm run build` (Client+Server+Prerender+Sitemap) und `npm run lint` grün, `git diff`
verifiziert reine String-Änderungen.

## Einheiten

- **Einheit A** — größte Volumen-Cluster (4 Kriterien: Romantic Dinner EN, Pizza München, Catering,
  Best Italian Restaurant EN). Zusammen ~14.700 der ~23.400 Impressionen — höchste Priorität.
- **Einheit B** — mittlere Cluster (4 Kriterien: Firmenfeier, Italienisches Restaurant München,
  Italiener Königsplatz, Italiener Hauptbahnhof).
- **Einheit C** — kleinere Cluster + IT-Markt (4 Kriterien: Neapolitanische Pizza, Aperitivo,
  Geburtstagsfeier DE+EN, IT-Ristorante-Cluster).
- **Einheit D** — Struktur-Klärung (1 Kriterium: Silvester/Weihnachten-Dublette, siehe Abschnitt 5).
  Läuft **unabhängig** von A/B/C, da Ergebnis offen ist (Klärung, kein Text-Fix) — keine
  Reihenfolge-Abhängigkeit zu den anderen Einheiten.

Innerhalb einer Einheit: freie Reihenfolge nach Impressions-Volumen (höchstes zuerst), da alle
Kriterien unabhängig voneinander sind (verschiedene Dateien/Components, keine Code-Abhängigkeiten).

---

## Abschnitt 3 — Kriterien im Detail

Format je Kriterium: Zielseite/Datei, betroffene Queries mit Baseline (Impr./Pos.), aktueller Text,
Vorschlag, Begründung. Zeichenzahlen sind Richtwerte (Title ~55–65 Z., Description ~150–160 Z.,
Google schneidet pixel-basiert, nicht zeichenbasiert ab — bei Grenzfällen im Vorschau-Tool prüfen).

### A1 — EN Romantic Dinner (`en/romantic-dinner-munich/`)

**Datei:** `src/translations/en.ts`, `t.seo.romanticDinner` (Title/Desc ~Zeile 1286ff, H2-Block
~Zeile 151–387 in `src/pages/seo/RomantischesDinner.tsx` referenziert).

| Query | Impr. | Pos. |
|---|---|---|
| `best restaurants romantic` | 4.864 | 9,28 |
| `best restaurants for date` | 1.813 | 10,73 |
| `romantic restaurants munich` | 118 | 7,50 |
| `romantic dinner` | 52 | 9,35 |
| `date night munich` | 46 | 15,02 |
| `romantic restaurants in munich` | 44 | 7,30 |
| `romantic restaurants` | 42 | 9,43 |

**Title** — aktuell: „Romantic Dinner Munich \| 5 min from Königsplatz \| STORIA" (58 Z.)
→ Vorschlag (additiv, siehe Gemini-Regel 1 oben — „Romantic Dinner Munich" bleibt als
zusammenhängende Phrase erhalten, nur „Best" + „Restaurant" ergänzt, Distanz-Anker bewusst
beibehalten): „Best Romantic Dinner Munich – Date Night Restaurant \| STORIA" (63 Z.)

**Description** — aktuell: „Romantic dinner in Munich by candlelight at STORIA Maxvorstadt: Italian
menu, wine pairing and a rose, just 5 minutes from Königsplatz. Perfect for date night." (166 Z.)
→ Vorschlag (additiv, „5 minutes from Königsplatz" bleibt erhalten): „Munich's best romantic
dinner for date night: candlelight at STORIA Maxvorstadt, Italian menu, wine pairing & a rose —
5 min from Königsplatz." (150 Z.)

**H1** — aktuell: „Romantic Dinner Munich – Candlelight at STORIA"
→ Vorschlag: „Munich's Best Romantic Dinner – Candlelight Restaurant at STORIA" (behält „Romantic
Dinner" als Phrase, ergänzt „Best" + „Restaurant")

**H2** (erste Sektion) — aktuell: „Romantic Dining Munich – The Perfect Date Restaurant for Special
Evenings" → Vorschlag: „The Best Romantic Restaurant in Munich – Perfect for Date Night" (deckt
Cluster 1+2 in einer Überschrift ab).

**Bug-Fix (selbe Datei, selber Commit):** H2 „Ihr romantischer Abend im STORIA" (Zeile ~199 in
`RomantischesDinner.tsx`) ist hartcodiertes Deutsch, erscheint unübersetzt auf der EN-Seite. Fix:
neuer Übersetzungsschlüssel `t.seo.romanticDinner.yourEvening` o. ä. mit „Your Romantic Evening at
STORIA", Komponente auf `t.seo.romanticDinner.yourEvening` statt Hardcode umstellen. **Kein neuer
Fakt, reine Übersetzung eines bereits vorhandenen deutschen Strings.**

### A2 — Pizza München (`pizza-muenchen/`)

**Datei:** `src/translations/de.ts`, `t.seo.pizzaMuenchen` (~Zeile 2578ff), Component
`src/pages/seo/PizzaMuenchen.tsx` (Zeile 60–61 Title/Desc, H2-Block 143–454).

| Query | Impr. | Pos. |
|---|---|---|
| `beste pizza münchen` | 1.751 | 9,79 |
| `pizzeria münchen` | 1.488 | 18,19 |
| `pizza münchen` | 554 | 19,94 |
| `beste pizzeria münchen` | 353 | 10,23 |
| `pizzerien münchen` | 182 | 15,12 |
| `beste pizza in münchen` | 275 | 10,32 |
| `pizzeria in münchen` | 265 | 17,08 |
| `beste holzofenpizza münchen` | 209 | 8,28 |

**Wichtig:** „beste pizza münchen" und „pizzeria münchen" stehen laut Audit **bereits im H2**
(„Pizzeria München – Warum STORIA die beste Pizza München bietet") — hier fehlt nur Title/H1, H2
bleibt unverändert.

**Title** — aktuell: „Pizza München – Steinofen-Pizza ab 9,90 € \| STORIA Maxvorstadt" (65 Z.)
→ Vorschlag (additiv, Preis-Anker „ab 9,90 €" bleibt erhalten, siehe Gemini-Regel 1): „Beste Pizza
München – Pizzeria ab 9,90 € \| STORIA Maxvorstadt" (62 Z.)

**H1** — aktuell: „Pizza München – Steinofen-Pizza in der Maxvorstadt"
→ Vorschlag: „Beste Pizza München – Ihre Pizzeria in der Maxvorstadt"

**Korrektur (Antoine, 12.09.2026): kein Holzofen-Synonym.** STORIA verwendet einen **Steinofen**,
keinen Holzofen (offene Flamme) — das ist keine austauschbare Umgangssprache, sondern ein anderer
Ofentyp. `beste holzofenpizza münchen` (209 Impr.) wird **nicht** adressiert, um keine falsche
Tatsachenbehauptung zu machen. Query wandert in die Noise-Liste (Audit-Dokument aktualisiert).

### A3 — Catering (`catering/`)

**Datei:** `src/pages/Catering.tsx`, Zeilen 335–336 (Title/Desc, aktuell hartcodiert), Zeilen
380–641 (H1/H2).

| Query | Impr. | Pos. |
|---|---|---|
| `hochzeit catering münchen` | 474 | 17,23 |
| `catering münchen private feier` | 372 | 19,66 |
| `catering münchen preise` | 321 | 13,69 |
| `catering hochzeit münchen` | 266 | 14,82 |
| `pizza catering münchen` | 206 | 12,15 |
| `geburtstags catering münchen` | 127 | 19,43 |
| `buffet catering münchen` | 102 | 17,39 |
| `catering münchen günstig` | 61 | 15,64 |
| `catering münchen 20/30/50/10/100 personen` (5 Queries) | ~222 gesamt | 9,33–24,05 |

Schwächste Ø-Position aller Top-10-Seiten (17,72 laut `Seiten.csv`) — größtes Delta zwischen
Suchvolumen und Ranking im gesamten Audit.

**Title** — aktuell: „Catering München \| Italienisches Event-Catering ab 25€ – STORIA"
→ Vorschlag: „Catering München – Preise ab 25€, Hochzeit & Events \| STORIA" (63 Z.)

**H1** — aktuell: „Catering München – Italienisches Event-Catering vom STORIA"
→ Vorschlag: „Catering München für Hochzeit, Events & Firmenfeiern – STORIA"

**H2-Änderungen:**
- „Catering für jeden Anlass" → „Hochzeits-Catering & Event-Catering München" (bündelt größten
  Einzel-Cluster „Hochzeit" mit dem Oberbegriff)
- Neue FAQ-Frage/H3 in der bestehenden FAQ-Sektion (`t.catering.faqTitle`-Block): „Was kostet
  Catering in München?" mit einer Antwort, die die bereits vorhandenen Paket-Preise (siehe
  „Unsere Catering-Pakete") zusammenfasst — deckt `catering münchen preise` (321 Impr.) UND den
  Long-Tail `was kostet ein catering in münchen` (23 Impr., Pos. 21,74) in einer Antwort ab.

**Tech-Debt-Konsolidierung (selber Commit, selbe Datei ohnehin angefasst):** Title/Description/H1
in `Catering.tsx` sind hartcodiert, obwohl ein passendes `t.pages.catering.*`-Objekt in
`translations/de.ts` bereits existiert (toter Key). Bei diesem Commit auf das bestehende
Translation-Pattern umstellen (Component liest `t.pages.catering.title/.description/.h1` statt
Hardcode) — **kein Scope Creep**, da dieselbe Datei ohnehin für die Copy-Änderung geöffnet wird und
die Umstellung das Risiko künftiger Inkonsistenzen reduziert (Catering ist aktuell die einzige der
15 Zielseiten mit diesem Sonderfall).

### A4 — EN Best Italian Restaurant Munich (`en/best-italian-restaurant-munich/`)

**Datei:** `src/translations/en.ts`, `t.seo.italienischesRestaurant` (~Zeile 3048ff), Component
`src/pages/seo/ItalienischesRestaurantMuenchen.tsx` (Zeile 54–55 Title/Desc, H1/H2-Block 101–324).

| Query | Impr. | Pos. |
|---|---|---|
| `best italian restaurant munich` | 734 | 8,90 |
| `italian restaurant munich` | 626 | 13,41 |
| `best italian restaurants in munich` | 102 | 10,16 |
| `italian restaurants munich` | 112 | 12,37 |
| `best italian munich` | 93 | 10,00 |
| `munich italian restaurant` | 99 | 11,19 |
| `best italian food munich` | 48 | 9,46 |

**Title bleibt unverändert** (enthält bereits „Best Italian Restaurant Munich" — kein Fix nötig).

**H1** — aktuell: „Authentically Southern Italian – the Cuisine of the Cilento in Maxvorstadt"
(**enthält „Italian Restaurant" gar nicht** — auffälligster Einzelbefund im Audit, Seite rankt für
das Kopf-Keyword bereits Pos. 8,9 dank Title, aber H1 trägt das Signal nicht mit)
→ Vorschlag: „Munich's Best Italian Restaurant – Authentic Cuisine of the Cilento"

**H2** (erste Sektion) — aktuell: „Southern Italy in Maxvorstadt – the Cuisine of the Cilento at
STORIA" → Vorschlag: „Italian Restaurant Munich – Southern Italy in Maxvorstadt at STORIA"

---

### B1 — Firmenfeier München (`firmenfeier-muenchen/`)

**Datei:** `src/translations/de.ts`, `t.seo.firmenfeier` (~Zeile 649ff), Component
`src/pages/seo/FirmenfeierMuenchen.tsx` (Zeile 97 Title/Desc, H1/H2-Block 121–292).

| Query | Impr. | Pos. |
|---|---|---|
| `firmenfeier münchen` | 1.144 | 15,12 |
| `firmenveranstaltungen münchen` | 47 | 17,98 |
| `betriebsfeier münchen` | 32 | 10,88 |

Title/H1 enthalten „Firmenfeier München" bereits — **kein Fix nötig**. Lücke ist H2 (keine
Wiederholung) + fehlendes Synonym „Betriebsfeier".

**H2** — aktuell: „Firmenevents München – Das STORIA für erfolgreiche Firmenevents"
→ Vorschlag: „Firmenfeier München – Ihre Betriebsfeier im STORIA" (schließt beide Lücken in einer
Überschrift).

### B2 — Italienisches Restaurant München, DE (`italienisches-restaurant-muenchen/`)

**Datei:** `src/translations/de.ts`, `t.seo.italienischesRestaurant` (~Zeile 3117ff), selbe
Component wie A4 (Zeile 54–55 Title/Desc DE, H1/H2-Block 101–324).

| Query | Impr. | Pos. |
|---|---|---|
| `italienisches restaurant münchen` | 81 | 20,88 |
| `italiener münchen` | 380 | 14,34 |

**Auffälligster Einzelfall im gesamten Audit:** das Kopf-Keyword fehlt in Title, H1 **und** jedem
H2 als zusammenhängende Phrase (immer „...Restaurant **in** München" oder „...Restaurant
**Maxvorstadt** München"). Seite rankt laut `Seiten.csv` im Schnitt Pos. 6,95 (6.305 Impr.) — für
das exakte Kopf-Keyword aber nur Pos. 20,88. Klarer Beleg, dass die Seite thematisch stark ist, nur
der Exact-Match fehlt.

**Title** — aktuell: „Bestes italienisches Restaurant Maxvorstadt München \| STORIA"
→ Vorschlag: „Bestes Italienisches Restaurant München \| STORIA Maxvorstadt" (63 Z. — „Bestes" +
„Italienisches Restaurant München" jetzt als zusammenhängende Phrase)

**H1** — aktuell: „Bestes italienisches Restaurant in der Maxvorstadt – STORIA München"
→ Vorschlag: „Italienisches Restaurant München – Authentische Küche des Cilento"

**H2** (erste Sektion) — aktuell: „Süditalien in der Maxvorstadt – die Küche des Cilento im STORIA"
→ Vorschlag: „Ihr Italienisches Restaurant München – Süditalienische Küche des Cilento"

**Hinweis:** „italiener münchen" (380 Impr., Pos. 14,34) bewusst **nicht** zusätzlich in dieselben
Elemente gepresst — „Italiener" und „Italienisches Restaurant" sind unterschiedliche Register, ein
Vermischen in derselben Headline liest sich unnatürlich. Falls nach 4–8 Wochen keine Bewegung bei
„italiener münchen": eigenes Kriterium prüfen (z. B. ein zusätzliches H2 „Ihr Italiener in
München-Maxvorstadt" ergänzen), aber nicht vorab in dieser Einheit.

### B3 — Italiener Königsplatz (`italiener-koenigsplatz/`)

**Datei:** `src/translations/de.ts`, `t.seo.italienerKoenigsplatz` (~Zeile 2740ff), Component
`src/pages/seo/ItalienerKoenigsplatz.tsx` (Zeile 60–61 Title/Desc, H1/H2-Block 108–397).

| Query | Impr. | Pos. |
|---|---|---|
| `italiener maxvorstadt` | 265 | 9,50 |
| `königsplatz restaurant` | 118 | 8,53 |
| `restaurant königsplatz münchen` | 114 | 9,22 |
| `italienisches restaurant maxvorstadt` | 39 | 7,97 |

„Maxvorstadt" kommt in Title/H1/H2 **gar nicht** vor (nur im Fließtext) — trotz 265+39 = 304 Impr.
auf Maxvorstadt-spezifischen Queries. Priorität: Maxvorstadt vor dem Königsplatz-Wortstellungs-Fix.

**Title** — aktuell: „Italiener Königsplatz München – STORIA Restaurant"
→ Vorschlag: „Italiener Königsplatz München – Maxvorstadt \| STORIA Restaurant" (65 Z.)

**H1** — aktuell: „Italiener Königsplatz München"
→ Vorschlag: „Italiener Königsplatz München – Ihr Restaurant in der Maxvorstadt"

**H2** — aktuell: „Warum STORIA am Königsplatz?"
→ Vorschlag: „Restaurant Königsplatz München – Warum STORIA?" (deckt „restaurant königsplatz
münchen"/„königsplatz restaurant" ab)

### B4 — Italiener Hauptbahnhof (`italiener-hauptbahnhof-muenchen/`)

**Datei:** `src/translations/de.ts`, `t.seo.italienerHauptbahnhof` (~Zeile 3189ff), Component
`src/pages/seo/ItalienerHauptbahnhofMuenchen.tsx` (Zeile 54–55 Title/Desc, H1/H2-Block 101–329).

| Query | Impr. | Pos. |
|---|---|---|
| `münchen hauptbahnhof essen` | 210 | 12,46 |
| `restaurant hauptbahnhof münchen` | 163 | 12,45 |
| `restaurants münchen hauptbahnhof` | 80 | 13,43 |

Seite spricht durchgängig von „Italiener am Hauptbahnhof", nie „Restaurant" + „Hauptbahnhof
München" kombiniert. Title/H1 bewusst unverändert lassen (Marke „Italiener am Hauptbahnhof" ist
bereits eingeführt, Kannibalisierung mit „italiener münchen hauptbahnhof" vermeiden, das schon
Pos. 3,79 rankt — nicht anfassen was funktioniert). Fix nur im H2.

**H2** — aktuell: „Ihr Italiener am Münchner Hauptbahnhof"
→ Vorschlag: „Restaurant am Hauptbahnhof München – Italienisch essen bei STORIA" (deckt alle drei
Ziel-Queries in einer Überschrift ab, ohne Title/H1 anzufassen).

---

### C1 — Neapolitanische Pizza München (`neapolitanische-pizza-muenchen/`)

**Datei:** `src/translations/de.ts`, `t.seo.neapolitanPizza` (~Zeile 2284ff), Component
`src/pages/seo/NeapolitanischePizza.tsx` (Zeile 64–65 Title/Desc, H1/H2-Block 147–477).

| Query | Impr. | Pos. |
|---|---|---|
| `neapolitanische pizza münchen` | 1.083 | 10,23 |
| `beste neapolitanische pizza münchen` | 222 | 11,98 |
| `holzofenpizza münchen` | 149 | 12,21 |

Kopf-Keyword bereits in Title/H1/H2 ✓ (kein Fix an der Grundstruktur nötig). Zwei gezielte
Ergänzungen:

**H1** — aktuell: „Neapolitanische Pizza München – Steinofen 400°C im STORIA"
→ Vorschlag: „Beste Neapolitanische Pizza München – Steinofen 400°C im STORIA" (fügt „beste" ein)

**Korrektur (Antoine, 12.09.2026): kein Holzofen-Synonym, auch hier nicht.** Ursprünglich war
geplant, `holzofenpizza münchen` (149 Impr.) auf dieser Seite als vermeintliches Synonym zu
„Steinofen" zu adressieren — verworfen, da STORIA nachweislich einen Steinofen (kein Holzofen,
keine offene Flamme) verwendet. Query wandert in die Noise-Liste, kein Fix in diesem Kriterium.

### C2 — Aperitivo München (`aperitivo-muenchen/`)

**Datei:** `src/translations/de.ts`, `t.seo.aperitivo` (~Zeile 902ff), Component
`src/pages/seo/AperitivoMuenchen.tsx` (Zeile 96–97 Title/Desc, H1/H2-Block 192–572).

| Query | Impr. | Pos. |
|---|---|---|
| `aperitivo bar münchen` | 207 | 11,02 |
| `aperol bar münchen` | 140 | 8,53 |

„Aperitivo" allein bereits stark vertreten (Title/H1/H2 ✓) — fehlendes Wort ist „Bar", nicht
„Aperitivo" selbst.

**H2** — aktuell: „Warum Aperitivo im STORIA München?"
→ Vorschlag: „Aperitivo Bar München – Warum STORIA?"

### C3 — Geburtstagsfeier München DE + EN (`geburtstagsfeier-muenchen/`, `en/birthday-party-munich/`)

**Datei DE:** `src/translations/de.ts`, `t.seo.birthday` (~Zeile 1708ff), Component
`src/pages/seo/GeburtstagsfeierMuenchen.tsx` (Zeile 70 Title/Desc, H1/H2-Block 116–302).

| Query | Impr. | Pos. |
|---|---|---|
| `geburtstag feiern restaurant münchen` | 206 | 7,30 |
| `restaurant für geburtstag münchen` | 78 | 8,49 |
| `munich birthday celebration` (EN) | 233 | 11,76 |
| `best restaurant for birthday celebration` (EN) | 158 | 9,36 |

**H2 (DE)** — aktuell: „🎂 Welche Geburtstagsfeiern können Sie im STORIA feiern?"
→ Vorschlag: „Geburtstag feiern im Restaurant München – STORIA" (deckt beide DE-Queries in einer
Überschrift)

**EN-Seite: vor Umsetzung erst Title/H1/H2 der EN-Seite live nachlesen** (war nicht Teil der
Erstrecherche für dieses KONZEPT, Kriterium in der LOOP-Datei entsprechend als „Recherche + Fix"
statt nur „Fix" markiert).

### C4 — IT Ristorante-Cluster (`it/miglior-ristorante-italiano-monaco/`)

**Datei:** `src/translations/it.ts`, `t.seo.italienischesRestaurant` (~Zeile 2734ff), selbe
Component wie A4/B2 (Zeile 54–55 Title/Desc IT, H1/H2-Block 101–324).

| Query | Impr. | Pos. |
|---|---|---|
| `ristoranti italiani a monaco di baviera` | 585 | 13,07 |
| `ristorante italiano monaco di baviera` | 243 | 10,33 |
| `ristoranti italiani monaco di baviera` | 198 | 10,82 |
| `migliori ristoranti italiani monaco di baviera` | 57 | 11,74 |
| `ristoranti italiani a monaco di baviera centro` | 62 | 10,55 |

Stärkster Wortstellungs-Fall im Audit: **keines** der Top-3-Keywords kommt in Title/H1/H2 vor (Seite
spricht durchgängig von „Ristorante del Sud Italia" + „Monaco", nie „Ristorante Italiano" + volle
Ortsbezeichnung „Monaco di Baviera"), bei zusammen 1.145 Impr. für die Top-3 allein.

**Title** — aktuell: „Ristorante del Sud Italia Monaco-Maxvorstadt \| STORIA"
→ Vorschlag: „Ristorante Italiano Monaco di Baviera – Cucina del Sud \| STORIA" (66 Z.)

**H1** — aktuell: „Autenticamente del Sud Italia – la cucina del Cilento nel Maxvorstadt"
→ Vorschlag: „Ristorante Italiano a Monaco di Baviera – Autentica Cucina del Sud Italia"

**H2** (erste Sektion) — aktuell: „Il Sud Italia nel Maxvorstadt – la cucina del Cilento allo
STORIA" → Vorschlag: „Il Miglior Ristorante Italiano a Monaco di Baviera – STORIA Maxvorstadt"
(deckt zusätzlich „migliori ristoranti italiani" ab)

---

## Abschnitt 5 — Einheit D: Struktur-Klärung Silvester/Weihnachten (Geschäftsentscheidung, kein Fix)

**Befund (Audit § 5):** `silvester-muenchen/` und `besondere-anlaesse/silvester/` sind **dieselbe
Komponente** (`SilvesterMuenchen.tsx`) mit unterschiedlichem `standalone`-Flag, liefern aber
unterschiedliche Title/H1 aus — zwei live URLs für denselben Silvester-Intent
(`besondere-anlaesse/silvester/`: Pos. 10,61/4.774 Impr.; `silvester-muenchen/`: Pos. 10,5/189
Impr.). Beide Seiten sind aktuell **`isActive=false`** („Programm wird im Oktober veröffentlicht")
— erklärt einen Teil der schwachen Rankings unabhängig von Title/H1 (Teaser- statt Vollcontent).
Gleiches Strukturmuster bei Weihnachten (`weihnachten-muenchen/` +
`besondere-anlaesse/weihnachtsmenue/`, dieselbe Komponente `WeihnachtenMuenchen.tsx`) — vermutlich
weniger kritisch, da `weihnachtsfeier-muenchen/` als dritte, inhaltlich andere Seite (Firmen-Fokus)
eigenständig bleibt.

**Kein Fix in diesem KONZEPT vorgeschlagen** — das ist eine Architektur-/Geschäftsentscheidung, keine
Textkorrektur:

- **Option 1 — Absicht bestätigen:** die Zwei-URL-Struktur ist gewollt (z. B. eine Seite als
  Sub-Page unter dem „Besondere Anlässe"-Pillar für SEO-Struktur, die andere als direkt
  bewerbbare Landingpage für Ads/Social) → dann nur die Title/H1 klar genug differenzieren, dass
  Google sie nicht als Duplicate Content wertet (aktuell teilweise identischer H2-Text laut
  Recherche — das wäre der eigentliche Fix).
- **Option 2 — Dublette:** historisch gewachsen, keine bewusste Differenzierung → Konsolidierung
  auf eine URL + 301-Redirect der anderen (analog zum P2-Muster im Vorgänger-Loop), volle Autorität
  auf eine Seite bündeln statt sie zu splitten.

**Vorgehen:** im Chat mit Antoine klären, welche Option zutrifft (Frage zuerst hier stellen, siehe
`~/.claude/CLAUDE.md` § „Fragen & Meldungen" — 5 Min. warten, dann ggf. Slack-Backup). Ergebnis in
`docs/LOOP-STRIKING-DISTANCE.md` unter D1 festhalten. Führt die Klärung zu Option 2, wird daraus ein
Folge-Kriterium (Redirect + Title-Konsolidierung) ergänzt — nicht vorab spekulativ umsetzen.

---

## Erfolgsmessung

Baseline = die Positions-/Impressions-Werte in Abschnitt 3 dieses Dokuments (Stand GSC-Export
12.09.2026, 92-Tage-Fenster bis dahin). Nach Deploy jeder Einheit: **4–8 Wochen** warten, dann neuen
GSC-Export ziehen oder (falls bis dahin verfügbar, siehe Audit § 6) `gsc_page_query_metrics` direkt
abfragen, dieselben ~40 Queries erneut prüfen. Kein Bewertung vor Ablauf dieses Fensters — siehe
Audit § 1, Punkt 3 (Korrelation ≠ Kausalität, Tagesschwankungen sind kein Signal). Bei Queries ohne
jede Bewegung nach 8 Wochen: nicht weiter nachjustieren (Gefahr von Keyword-Stuffing), sondern als
„braucht Autorität statt Text" einordnen (siehe Audit § 5, Beispiel `pizza münchen` exakter Match
trotz Vollabdeckung nur Pos. 19,94 — Hinweis, dass On-Page-Text bei sehr kompetitiven 2-Wort-Termen
einen Deckel hat).
