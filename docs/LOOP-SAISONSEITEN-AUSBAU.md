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

- [x] **E1.1** Acht Faktenwidersprüche auflösen (KONZEPT § Faktenwidersprüche, Spalte „Auflösung"),
      kanonische Werte in `src/config/facts.ts`. Betrifft `BesondereAnlaesse.tsx:48`,
      `de.ts` (Silvester-Pakete), `FirmenfeierMuenchen.tsx:282`, `llms.txt`.
      Beweis: `grep` zeigt überall denselben Preis und dieselbe Gangzahl.
      **Beweis 13.09.2026:** `npm run build` grün (157 Seiten prerendert, 0 Errors), `npm run lint`
      728 Probleme = Baseline unverändert. `grep -rniE "5[- ](gäng|gang|course|portate|plats|services)"
      src/ public/` → 0 Treffer im Silvester-Kontext (verbleibende Treffer ausschließlich in den
      Abschnitten `birthday`, `weihnachtsfeier`, `hochzeitsfeier`, `filmfest`); „65,90" kommt nicht
      mehr als Silvester-Preis vor (nur noch Valentinstag). Prerender: `dist/besondere-anlaesse/silvester/index.html`
      und `dist/weihnachten-muenchen/index.html` je **1 × BreadcrumbList**; JSON-LD-`image` zeigt auf
      `/assets/silvester-dinner-gala-storia-muenchen-BkEV-w6f.webp` bzw.
      `/assets/weihnachtsfeier-italiener-storia-muenchen-CAN4qqU6.webp` — beide Dateien in `dist/`
      vorhanden. Sichtbar im HTML: Hub-Teaser „4-Gänge-Degustationsmenü für 99 € p. P. (mit
      Weinbegleitung 150 €)", Silvester-Paket „4-Gang Gala-Menü (dasselbe Menü wie Classic)" in
      de/en/it/fr, Weihnachts-FAQ „…dafür genügt 1 Person. Ein festes Weihnachtsmenü für Gruppen
      stellen wir ab 6 Personen zusammen." („ab 2 Personen" nicht mehr im HTML). Alle URLs in
      `llms.txt`/`llms-full.txt` zeigen auf prerenderte Routen (0 Redirect-Ziele).
      **Offen bleibt:** `facts.ts` TODO Weihnachtspreis 45 € vs. 49 € (bewusst, siehe BLOCKED-Log).
- [x] **E1.2** Silvester-Vorjahresmenü sichtbar rendern (3 Varianten aus dem JSON-LD), klar als
      Beispiel gekennzeichnet + Hinweis auf das kommende Menü.
      Beweis: Gerichtsnamen im prerenderten HTML sichtbar, nicht nur im JSON-LD.
      **Beweis 13.09.2026** (Commit `6fcc70c`): `npm run build` grün (157 Seiten prerendert,
      0 Errors), `npm run lint` 728 Probleme = Baseline unverändert. Im **sichtbaren** HTML von
      `dist/besondere-anlaesse/silvester/index.html` — geprüft nach Entfernen ALLER
      `<script>`-Blöcke, also ausdrücklich außerhalb des JSON-LD: „4 Gänge Menü «Vegetale»",
      „4 Gänge Menü «Mare»", „4 Gänge Menü «Terra»", „Vitello Tonnato, Auberginenkaviar und
      Parmesanpraline", „Seeteufel auf einer sanften Gelbtomaten-Basilikum-Sauce, serviert mit
      cremigem Safranrisotto", „Champagner-Kastaniencremesuppe mit getrüffelter Crème Fraîche",
      „Carpaccio vom Octopus mit Jakobsmuscheln in feiner Kräuter-Zitrus-Marinade", „Brasato di
      manzo al Barolo „Rinderschmorbraten in Barolo" mit getrüffelter Petersilienwurzelcreme".
      Kennzeichnung als Vorjahr dreifach im HTML: Badge „Menü der vergangenen Saison",
      Überschrift „Das war unser Silvester-Menü der letzten Saison", Hinweiszeile „… nicht
      buchbar. Das kommende Silvester-Menü kann davon abweichen." plus „voraussichtlich im
      Oktober". Alle vier Sprachen: `4-course menu «Vegetale»` / `Menù a 4 portate` /
      `Menu 4 plats «Vegetale»` in den jeweiligen Sprachrouten. JSON-LD unverändert (dieselben
      drei `MenuSection`-Namen, weiterhin genau 1 BreadcrumbList) — Sichtbares und Schema kommen
      jetzt aus EINER Konstante `PREVIOUS_SEASON_MENUS`.
- [x] **E1.3** „Auf einen Blick"-Block auf beiden Seiten (Gangzahl · Preis · Beginn · Kapazität ·
      Reservierungsfrist).
      **Beweis 13.09.2026** (Commit `3d91285`): `npm run build` grün (157 Seiten, 0 Errors),
      `npm run lint` 728 Probleme = Baseline unverändert. Sichtbares HTML (ohne `<script>`-Blöcke),
      `dist/besondere-anlaesse/silvester/index.html`: „Silvester im STORIA auf einen Blick",
      „4 Gänge · 99 € p. P., mit Weinbegleitung 150 € p. P.", „19:00 Uhr Aperitivo-Empfang",
      „2 bis 100 Gäste", „Bis spätestens Ende November – Silvester ist jedes Jahr schnell
      ausgebucht."; `dist/weihnachten-muenchen/index.html`: „Weihnachten im STORIA auf einen
      Blick", „À la carte am Tisch (ab 1 Person) oder Weihnachtsmenü für Gruppen (ab 6 Personen,
      ab 45 € p. P.)", „Adventszeit – am 24. und 25. Dezember ist das Restaurant geschlossen",
      „100 Plätze innen, 100 auf der überdachten Terrasse", „Für Gruppen ab September/Oktober
      empfohlen …". Semantik: je Seite genau eine `<dl>` mit 4 `<dt>`/`<dd>`-Paaren. Keine neue
      Zahl — Werte aus `FACTS.silvester`, `FACTS.weihnachten`, `FACTS.capacity`,
      `ReservationBooking.getClosedDays` (24./25.12.) sowie Timeline/FAQ der Seiten; die
      Übersetzungen enthalten nur Satzschablonen mit Platzhaltern.
      **Vermerk:** `t.seo.weihnachten` erbt im Italienischen weiterhin den deutschen Fließtext
      (Bestandslage, itBase überschreibt dort nur die SEO-Metas). Die neuen „Auf einen
      Blick"-Schlüssel sind auf Italienisch gesetzt; die Altbestände bleiben unangetastet, das
      wäre eigener Scope.
- [x] **E1.4** Weihnachtsseite auf die Zwei-Wege-Realität umstellen (à la carte am Tisch vs.
      Gruppenmenü nach Absprache) statt „Menü folgt im Herbst".
      **Beweis 13.09.2026** (Commit `5ca3044`): `npm run build` grün (157 Seiten prerendert,
      0 Errors), `npm run lint` 728 Probleme = Baseline unverändert. Sichtbares HTML (nach
      Entfernen ALLER `<script>`-Blöcke), `dist/weihnachten-muenchen/index.html`: neuer Abschnitt
      „Zwei Wege, Weihnachten im STORIA zu feiern" mit „Weg 1 · Privat & spontan Tisch reservieren
      und à la carte essen" und „Weg 2 · Firma & Gruppe Weihnachtsmenü nach Absprache",
      Eckpunkte „Ab 6 Personen • Menü, Ablauf und Getränke werden im Gespräch festgelegt •
      Orientierungspreis ab 45 € pro Person". Pakete gerahmt als „Orientierung für Ihr
      Gruppen-Menü Die folgenden drei Pakete sind keine fertigen Menüs zum Bestellen, sondern
      Anhaltspunkte für Umfang und Preis auf dem zweiten Weg." FAQ: „Gibt es ein festes
      Weihnachtsmenü zum Vorbestellen? Nein. In der Adventszeit essen Sie am Tisch à la carte von
      unserer saisonalen Karte." und „Ist das STORIA an Heiligabend geöffnet? Nein. Am 24. und am
      25. Dezember ist das Restaurant geschlossen." (vorher nur 24.12. — Widerspruch zum
      „Auf einen Blick"-Block und zu `ReservationBooking.getClosedDays`).
      Alle vier Sprachen: „Two ways to celebrate Christmas at STORIA" /
      „Due modi di festeggiare il Natale allo STORIA" / „Deux façons de fêter Noël au STORIA"
      in `dist/en/christmas-munich/`, `dist/it/natale-monaco/`, `dist/fr/noel-munich/`.
      **grep-Beweis, dass die Texte weg sind:**
      `grep -rn "Weihnachtsmen[üu]s\? werden im Herbst\|Weihnachtsmen[üu]s 2026\|Christmas menus will be published\|Christmas Menus 2026\|menus de No[ëe]l seront publi\|Menus de No[ëe]l 2026\|Weihnachtsmen[üu]s sind verf[üu]gbar\|Christmas menus are available\|menus de No[ëe]l sont disponibles" src/ public/`
      → **0 Treffer**; im sichtbaren HTML aller vier Weihnachts-Routen 0 Treffer für
      „im Herbst veröffentlicht|Jetzt vormerken|Vormerken lassen|published in autumn|publiés en automne".
      Gegenprobe Silvester (dort kommt das Menü wirklich noch): „Silvester-Programm 2026/2027 –
      Jetzt vormerken" steht unverändert im HTML.
      **Vormerk-Formular nicht angefasst** (E2.3): `id="signup-form"` weiterhin in
      `dist/weihnachten-muenchen/index.html`, nur die Texte drumherum umgeschrieben.
- [x] **E1.5** Definition-Lead als ersten Satz beider Intros, `tldr` rendern, je ein autoritativer
      Outbound-Link (GEO-Regeln 1 und 3).
      **Beweis 13.09.2026** (Commit `29fdca1`): `npm run build` grün (157 Seiten prerendert,
      0 Errors), `npm run lint` 728 Probleme = Baseline unverändert. Alles Folgende im
      **sichtbaren** HTML, geprüft nach Entfernen ALLER `<script>`-Blöcke.
      **Regel 1, Definition-Lead**, `dist/besondere-anlaesse/silvester/index.html`: „Silvester im
      Ristorante STORIA ist ein italienisches Gala-Dinner in der Karlstraße 47a in München
      Maxvorstadt: ein 4-Gänge-Degustationsmenü in drei Varianten für 99 € pro Person, mit
      Weinbegleitung 150 € pro Person, ab 19:00 Uhr mit Aperitivo-Empfang, Musik und
      Mitternachts-Champagner." — `dist/weihnachten-muenchen/index.html`: „Weihnachten im
      Ristorante STORIA ist ein italienisches Festtagsangebot in der Karlstraße 47a in München
      Maxvorstadt, das auf zwei Wegen funktioniert: à la carte von der saisonalen Karte am
      reservierten Tisch, ab 1 Person – oder ein Weihnachtsmenü, das Firmen und Gruppen ab
      6 Personen direkt mit dem Restaurant abstimmen, ab 45 € pro Person." (dieser Satz kam
      bereits mit E1.4). Alle vier Sprachen geprüft (en/it/fr-Routen tragen denselben Lead).
      **Regel 3, externe Citation** — im sichtbaren HTML, nicht im JSON-LD:
      `<a href="https://www.champagne.fr/" target="_blank" rel="noopener noreferrer" …>Comité Champagne</a>`
      auf der Silvesterseite und
      `<a href="https://ich.unesco.org/en/RL/mediterranean-diet-00884" target="_blank" rel="noopener noreferrer" …>UNESCO-Liste des immateriellen Kulturerbes</a>`
      auf der Weihnachtsseite. Beide URLs vor der Auswahl per Fetch geprüft (200, erwarteter
      Inhalt): champagne.fr = offizielle Seite des Comité Champagne; der UNESCO-Eintrag nennt
      ausdrücklich die „Consent of Cilento community, Italy" — das Cilento ist die
      Herkunftsregion der Familie Speranza, die auf der Weihnachtsseite im Intro steht.
      **`tldr` sichtbar**: Silvester „Silvester im Ristorante STORIA München Maxvorstadt
      (Karlstraße 47a) ist ein italienisches Gala-Dinner zum Jahreswechsel: 4-Gänge-
      Degustationsmenü in drei Varianten (Vegetale, Mare, Terra) für 99 € pro Person, mit
      Weinbegleitung 150 € pro Person." · Weihnachten „Weihnachten im Ristorante STORIA München
      Maxvorstadt (Karlstraße 47a) funktioniert auf zwei Wegen: Tisch reservieren und à la carte
      von der saisonalen Karte essen – ab 1 Person, ohne Vorbestellung – oder ein Weihnachtsmenü
      für Firmen und Gruppen ab 6 Personen, das direkt mit dem Restaurant abgestimmt wird,
      ab 45 € pro Person."
      **Muster übernommen, nicht erfunden:** kein Repo-Seite rendert den `tldr`-*Schlüssel*; die
      einzige vorhandene TL;DR-Darstellung ist `UeberUns.tsx:85-104` („TLDR — Citation-optimized
      intro", `bg-card border rounded-2xl p-6 md:p-8 mb-12` + ein `<p>`, mit der
      UNESCO-Outbound-Citation darin). Genau dieses Markup ist übernommen, direkt unter der
      Breadcrumb.
      **Keine neuen Zahlen:** Gangzahl/Preise/Mindestpersonenzahl/Kapazität stehen in den
      Übersetzungen nur als Platzhalter und werden über `fillFacts()` aus `FACTS` gefüllt;
      `grep -rE "\{(courses|price|priceWine|minGuests|groupPrice|indoorSeats|terraceSeats)\}" dist`
      → 0 Treffer (kein Platzhalter ausgeliefert).
      **Vermerk:** Italienisch hatte für beide Seiten überhaupt keinen `tldr` und wäre beim
      Rendern auf den deutschen Text zurückgefallen — jetzt in `itBase` ergänzt. Der übrige
      italienische Fließtext des Weihnachts-Blocks erbt weiterhin das Deutsche (Bestandslage,
      siehe Vermerk bei E1.3); die von E1.4/E1.5 angefassten Schlüssel sind italienisch gesetzt.
- [x] **E1.6** JSON-LD: `FoodEvent` statt `Event`, doppelte BreadcrumbList auf Silvester entfernen,
      `image` reparieren, bei Weihnachten `highPrice` ergänzen.
      **Beweis 13.09.2026:** `npm run build` grün (157 Seiten prerendert, 0 Errors), `npm run lint`
      728 Probleme = Baseline unverändert. Aus dem gebauten HTML extrahiert und je Block per
      `JSON.parse()` validiert: `dist/besondere-anlaesse/silvester/index.html` und
      `dist/weihnachten-muenchen/index.html` haben je **6 JSON-LD-Blöcke, 6/6 syntaktisch gültig**,
      je **1 × FoodEvent**, **0 × Event**, **1 × BreadcrumbList**, **1 × FAQPage**.
      Silvester-`@graph`: `"@type":"FoodEvent"`, `name` „Silvester Gala-Dinner im STORIA München",
      `description` „… Champagner-Aperitif und 4-Gänge-Degustationsmenü zur Wahl (Vegetale, Mare
      oder Terra). Ab 99 € pro Person, mit Weinbegleitung 150 € pro Person — dasselbe Menü, der
      Unterschied ist nur die Weinbegleitung.", `offers` = `99.00` / `150.00`, `Menu`-Block
      `"4 Gänge Menü «Vegetale»"` mit denselben `99.00`/`150.00` — Gangzahl und beide Preise kommen
      jetzt per Template-Literal aus `FACTS.silvester`, nicht mehr als Literale im Schema.
      Weihnachten: `"@type":"FoodEvent"`, `name` „Weihnachtsmenü **für Gruppen** im STORIA München",
      `offers` `{"@type":"AggregateOffer","lowPrice":"45.00","highPrice":"65.00","priceCurrency":"EUR",…,"eligibleQuantity":{"@type":"QuantitativeValue","minValue":6,"unitText":"Personen"}}`.
      **Entscheidung Weihnachts-Event (E1.4-Folge):** Das Event-Schema beschreibt ausschließlich
      **Weg 2** (Gruppen-/Menü-Weg). Weg 1 (à la carte am reservierten Tisch, ab 1 Person, keine
      Vorbestellung) hat weder festen Termin noch festes Angebot, ist also kein Event im Sinne von
      schema.org und bereits über das `Restaurant`-Schema samt Öffnungszeiten abgedeckt. `name`,
      `description` und `eligibleQuantity` sagen den Gruppen-Weg jetzt ausdrücklich; vorher
      versprach der generische Name „Weihnachtsmenü im STORIA München" ein festes, für jeden
      buchbares Menü, das es laut Faktenklärung vom 13.09.2026 nicht gibt. Begründung im
      Code-Kommentar über dem Block.
      **Entscheidung `highPrice` = 65.00:** oberer Orientierungspreis der Pakete, belegt durch
      `weihnachten.package2Price` („ab 65 € p.P.", Paket „Weihnachten Premium") — der höchste
      bezifferte Wert auf der Seite. Paket 3 („Weihnachten Exclusive") steht auf „Auf Anfrage" und
      liefert bewusst keine Zahl; erfunden wurde keine. `lowPrice` kommt jetzt aus
      `FACTS.weihnachten.groupMenuPriceFrom` statt als Literal.
      **Bereits in E1.1 erledigt, hier nur gegengeprüft:** die doppelte BreadcrumbList auf Silvester
      (je Seite genau 1, siehe Zählung oben) und das `image`-Feld (beide zeigen auf per Vite-Import
      aufgelöste, in `dist/` vorhandene Assets).
- [x] **E1.7** `llms.txt` aktualisieren, toten `standalone`-Zweig in `SilvesterMuenchen.tsx`
      entfernen.
      **Beweis 13.09.2026:** `npm run build` grün (157 Seiten prerendert, 0 Errors),
      `npx tsc --noEmit` ohne Ausgabe, `npm run lint` **727 Probleme = 1 WENIGER als Baseline 728**
      (das entfallene `(allSlugs as any)` war ein `no-explicit-any`); kein neues Problem.
      **Belegkette, dass `standalone` hier nie `true` sein kann** (vor dem Löschen geführt, nicht
      nach Zeilennummer gelöscht): `grep -rn "SilvesterMuenchen" src/ scripts/ prerender.js` liefert
      genau drei Fundstellen im Code — Interface, Komponenten-Definition, Default-Export — plus die
      EINE Aufrufstelle `src/pages/BesondererAnlass.tsx:126`
      `return <SilvesterMuenchen menu={menu} archivedMenu={archivedMenu} seasonalConfig={seasonalConfig} />;`
      **ohne** `standalone`. `grep -n "silvester-muenchen" src/App.tsx src/config/slugs.json
      src/config/routes.ts scripts/generate-sitemap.mjs` → **0 Treffer**: seit der
      URL-Konsolidierung vom 12.09.2026 gibt es weder einen `routeComponents`-Eintrag noch einen
      Slug für die flache Route.
      **Entfernt** (`src/pages/seo/SilvesterMuenchen.tsx`, −101/+57 Zeilen, netto −44; die
      hinzugefügten Zeilen sind fast vollständig der neue Doc-Kommentar, der die Belegkette im Code
      festhält): der Prop selbst, die zweite Canonical-/Breadcrumb-Berechnung, `menuPagePath`, die
      standalone-SEO-Texte, der standalone-Hero-Titel samt Telefon-CTA, die Teaser- und die
      Inaktiv-Sektion, die zweite Related-Links-Liste, vier `!standalone`-Guards
      (Event/Menu-JSON-LD, Vorjahresmenü, Signup, Archiv) und der standalone-Zweig der Final-CTA;
      dazu die dadurch unbenutzten Imports `allSlugs` und `ArrowRight` und das nur noch für den
      toten Zweig gebrauchte `isActive` aus `useSeasonalMenuActive`.
      **Verwaiste Übersetzungsschlüssel: ja, 69 Stück** — in allen vier Sprachdateien aus dem
      `seo.silvester`-Block entfernt (de/en/fr je 22, it 3 — Italienisch hatte den Block ohnehin nur
      teilweise übersetzt), plus 3 verwaiste Kommentarzeilen `// Standalone SEO page keys`;
      zusammen −72 Zeilen. Vorher per `grep` geprüft, dass die **Namen** zwar in `weihnachten`/
      `valentinstag` weiterleben (beide Seiten rendern weiterhin `standalone`), aber nichts mehr
      `t.seo.silvester.standalone*` oder `t.seo.silvester.heroCtaPhone` liest; Gegenprobe nach dem
      Löschen: im `seo.silvester`-Block aller vier Dateien **0 Treffer** für
      `/^\s*(standalone[A-Za-z0-9]*|heroCtaPhone):/`.
      **Prerender-Beweis, alle vier Silvester-Routen** (`dist/besondere-anlaesse/silvester/`,
      `dist/en/special-occasions/new-years-eve/`, `dist/it/occasioni-speciali/capodanno/`,
      `dist/fr/occasions-speciales/nouvel-an/`): **0 Treffer** für die standalone-exklusiven Texte
      („Silvester-Programm ansehen", „Unser Silvester-Programm ist verfügbar", „Silvester im STORIA
      – Jetzt informieren", „Italienische Aperitivo-Kultur in der Maxvorstadt", „Silvester in
      München – Italienisch ins neue Jahr feiern", „Unsere Terrasse in der Maxvorstadt" und deren
      en/fr-Entsprechungen). Der Related-Links-Block zeigt die Nicht-standalone-Liste:
      `/speisekarte/`, `/eventlocation-muenchen-maxvorstadt/`, `/weihnachten-muenchen/`,
      `/valentinstag-muenchen/`, `/firmenfeier-muenchen/`, `/kontakt/`. JSON-LD unverändert korrekt:
      je 6 Blöcke, 6/6 per `JSON.parse()` gültig, 1 × FoodEvent, 1 × BreadcrumbList, 1 × FAQPage.
      **Nichts kaputt gegangen:** `WeihnachtenMuenchen.tsx` nicht angefasst (`git diff` leer), ihr
      standalone-Hero „Weihnachten in München – Festlich italienisch genießen" steht weiter im HTML;
      das Vorjahresmenü „4 Gänge Menü «Vegetale»" (E1.2) rendert weiter; `id="signup-form"`
      (Vormerk-Formular, wird erst in E2.3 ausgehängt) weiterhin in Silvester, Weihnachten UND
      Valentinstag.
      **`llms.txt`:** Silvester-Abschnitt um die E1.2/E1.3-Inhalte ergänzt (drei Varianten Vegetale/
      Mare/Terra, Beginn 19:00 Uhr Aperitivo-Empfang, 2 bis 100 Gäste, Reservierung bis Ende
      November, Preisklarstellung „dasselbe Menü"); der Abschnitt „### Weihnachtsmenüs" heißt jetzt
      „### Weihnachten – zwei Wege" und bildet die E1.4-Realität ab (Weg 1 à la carte ab 1 Person
      ohne Vorbestellung, Weg 2 Gruppenmenü ab 6 Personen ab 45 €, 24./25.12. geschlossen); in
      „Firmenfeier & Weihnachtsfeier" steht die Mindestpersonenzahl jetzt dabei.
      `public/llms-full.txt` wird aus `llms.txt` generiert (`npx tsx scripts/generate-llms-full.ts`)
      und war seit Mai 2026 nicht neu erzeugt — jetzt regeneriert, wodurch auch Candle-Light-,
      Oktoberfest- und Firmenfeier-Abschnitt dort ankommen und die Reisegruppen-URL auf
      `/reisegruppen-muenchen/` korrigiert wird. **Dabei aufgefallen und mitgefixt:** der Generator
      hatte „Bis zu 180 Personen (stehend)" hart kodiert — der Wert aus der Zeit VOR der
      Korrektur auf 300 (`fix-standing-capacity-300`); ohne diesen Fix hätte die Regenerierung die
      falsche Kapazität wieder eingeschleppt. `grep "180 Personen" public/llms*.txt` → 0 Treffer.
      **Offener Punkt (nicht angefasst, keine neuen Fakten):** `llms.txt` empfiehlt Anfragen für
      Weihnachtsfeiern „am besten ab Juli", die Weihnachtsseite „für Gruppen ab September/Oktober".
      Kein Widerspruch im engen Sinn (Juli ist früher), aber zwei verschiedene Zahlen für dieselbe
      Aussage — gehört in eine Faktenklärung mit Antoine, nicht in dieses Kriterium.

## E1: Branch, Beweis, Merge

- [x] Branch `saisonseiten-e1` gepusht, PR erstellt, Diff gegengelesen, gemergt, Live-Stichprobe.
      ✓ 2026-09-13 · PR #86 im Hauptfenster gegengelesen (14 Dateien, +1104/−362; `facts.ts`-SSoT
      und die gerenderten Blöcke stichprobenartig geprüft) → `gh pr merge 86 --squash
      --delete-branch`. Deploy erfolgreich (Run 34731514415). **Live verifiziert** auf beiden
      Seiten: „Auf einen Blick"-Block mit 4 Gängen/99 €/150 €, Vorjahresmenü sichtbar („Vitello
      Tonnato" außerhalb der `<script>`-Blöcke), `"@type":"FoodEvent"`, Outbound-Links
      (champagne.fr bzw. ich.unesco.org), Weihnachten mit „Zwei Wege" und `highPrice 65.00`.
      Zusätzlich live bestätigt: EN-Title zeigt jetzt „Stone-Oven Pizza" statt „Wood-Fired Pizza"
      (separater Hotfix PR #85).
      **PR: https://github.com/dream-anchor/ristorantestoria.de/pull/86** — Branch gepusht,
      `origin/main` (PR #85, Steinofen-Terminologie) vorher in den Branch gemergt (Auto-Merge ohne
      Konflikt, `src/translations/en.ts` + `fr.ts`; danach `grep -rniE
      "holzofen|wood-fired|four à bois" src/ public/ scripts/` → 0 Treffer, die
      `stone-oven`/`four à pierre`-Begriffe aus #85 sind erhalten).
      Stand nach dem Merge: `npm run build` grün (157 Seiten, 0 Errors), `npx tsc --noEmit` sauber,
      `npm run lint` 727 (Baseline 728, kein neues Problem), JSON-LD-Validierung beider Seiten grün.
      **Merge passiert im Hauptfenster** — hier bewusst nicht abgehakt.

---

## E2 — Conversion-Umbau

- [x] **E2.1** `ReservationBooking` auf beiden Seiten einbinden (Landingpage-Muster
      `headingLevel="h3"` + `onBook`), optionale Props `defaultDate`/`defaultGuests` ergänzen —
      abwärtskompatibel, `Reservierung.tsx` unverändert.
      **Beweis 13.09.2026** (Commit `deef9aa`, Branch `saisonseiten-e2`): `npm run build` grün
      (157 Seiten prerendert, 0 Errors), `npx tsc --noEmit` ohne Ausgabe, `npm run lint`
      **727 Probleme = Baseline unverändert**. Im sichtbaren HTML (nach Entfernen ALLER
      `<script>`-Blöcke) beider Seiten und aller vier Sprachrouten: `id="reservieren"` +
      Buchungsstrecke mit „Bei OpenTable reservieren". Silvester DE: „Tisch für Silvester
      reservieren", „Am 31. Dezember servieren wir ausschließlich das Gala-Menü – à la carte
      gibt es an diesem Abend nicht. Wer hier einen Tisch bucht, bucht damit das
      4-Gänge-Gala-Menü für 99 € pro Person, mit Weinbegleitung 150 € pro Person.", „Das Datum
      ist auf den 31. Dezember vorbelegt. Für die Silvesternacht stehen ausschließlich
      Tischzeiten zwischen 19:00 und 20:00 Uhr zur Wahl …"; EN/IT/FR mit denselben Zahlen
      („4-course gala menu at €99 per person, or €150 per person with wine pairing",
      „menù di gala da 4 portate a 99 € a persona", „menu de gala en 4 plats à 99 € par
      personne"). Weihnachten DE: „Tisch in der Adventszeit reservieren", „Weg 1 in Kurzform:
      Tisch reservieren und à la carte von der saisonalen Karte essen", „Am 24. und 25. Dezember
      ist das Restaurant geschlossen; diese beiden Tage lassen sich im Kalender nicht
      auswählen." (EN „Reserve a table during Advent", IT „Prenota un tavolo durante l'Avvento",
      FR „Réserver une table pendant l'Avent").
      **Abwärtskompatibilität bewiesen:** `git diff -- src/pages/Reservierung.tsx` **leer**;
      `dist/reservierung/index.html`, `dist/oktoberfest-muenchen/index.html` und
      `dist/wm-2026-public-viewing-muenchen/index.html` rendern unverändert den
      SSR-Platzhalter „Datum wählen" plus OpenTable-Button. `defaultDate` wird bewusst NICHT
      als Initial-State gesetzt, sondern im Mount-Effekt aus einem Ref (`initialDateRef`), der
      den Wert des ersten Renders einfriert: SSR-Hydration-Logik (#425/#422) bleibt intakt und
      ein späterer Parent-Re-Render überschreibt keine Auswahl des Gastes. `defaultGuests` ist
      ein konstanter String und damit hydrationsneutral; er ist implementiert und dokumentiert,
      wird aber von keiner der beiden Seiten gesetzt (kein Fakt rechtfertigt eine andere
      Vorbelegung als die bisherigen 2 Gäste).
      **Keine neuen Zahlen:** Gangzahl/Preise über `fillFacts` aus `FACTS.silvester`;
      „19:00–20:00" ist das Verhalten von `ReservationBooking.isNewYearsEve`, „24./25.12."
      das von `getClosedDays`. `fireLead` liegt jetzt zentral in `src/lib/analytics.ts`
      (erbt den Admin-Guard aus `trackEvent`); die drei bestehenden seitenlokalen Kopien
      wurden nicht angefasst.
- [x] **E2.2** Neues `AnlassAnfrageForm` gegen `POST /api/public/inquiries` (Vertrag siehe KONZEPT),
      inkl. Honeypot `website`, Unterscheidung 201/202/422/429, Endpunkt-URL per
      `VITE_MAESTRO_INTAKE_URL` statt hart kodiert.
      **Beweis 13.09.2026** (Commit `0841fae`): `npm run build` grün (157 Seiten prerendert,
      0 Errors), `npx tsc --noEmit` ohne Ausgabe, `npm run lint` **727 Probleme = Baseline
      unverändert**. Zwei Builds als Beweis, weil das Verhalten an der Env-Variable hängt:
      **(a) mit** `VITE_MAESTRO_INTAKE_URL=https://storia.schrittmacher.ai/api/public/inquiries`
      (nur als Shell-Variable gesetzt, NICHT in `.env` geschrieben) steht das Formular im
      statischen HTML aller acht Routen — je **2 `<form>`-Elemente** (Vormerk-Formular +
      neues Formular), `id="anfrage"`, sichtbar „Silvester-Gala anfragen" / „Weihnachtsmenü
      für Gruppen anfragen" bzw. „Enquire about the New Year's Eve gala" / „Richiedi il menù
      di Natale per gruppi" / „Demander un menu de Noël pour les groupes", Felder „Name /
      Firma", „Telefon (optional)", „Wunschtermin (optional)", „Gäste (ca.) (optional)",
      „Ihre Nachricht", Button „Anfrage senden" (EN „Send inquiry", IT „Invia richiesta",
      FR „Envoyer la demande"). **(b) ohne** die Variable: je nur **1 `<form>`** (das
      unangetastete Vormerk-Formular) plus der Ausweichblock „Anfrage per Telefon oder
      E-Mail" / „Das Anfrageformular steht hier gerade nicht zur Verfügung …", und
      `grep -c "api/public/inquiries" dist/assets/*.js` → **0 Treffer im gesamten Bundle**
      (kein hartkodierter Prod-Fallback).
      **Honeypot, Markup im Wortlaut aus `dist/besondere-anlaesse/silvester/index.html`:**
      `<div class="hp-field" aria-hidden="true"><label for="anfrage-silvester-website">Dieses Feld bitte frei lassen</label><input id="anfrage-silvester-website" type="text" tabindex="-1" autoComplete="off" name="website"/></div>`
      — ein echtes Textfeld, ausdrücklich **kein** `type="hidden"`. Versteckt allein per CSS,
      Regel aus dem gebauten Stylesheet:
      `.hp-field{position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none}`.
      **201/202-Unterscheidung:** beide sind `response.ok === true`, unterschieden wird
      ausschließlich über `data.id` im Body — mit `id` echter Lead (GA4 `generate_lead`), ohne
      `id` (Honeypot, stilles Verwerfen) nach außen Erfolg, aber KEIN Lead. 422 → eigene
      Meldung zu E-Mail/Datum/Gästezahl, 429 → „Zu viele Anfragen in kurzer Zeit …",
      `fetch`-Reject (Netzwerk/CORS) → eigene Meldung; Telefon und E-Mail stehen in jedem Fall
      unter dem Formular (`tel:+498951519696` plus `EmailLink`, also ohne Klartext-`mailto:`
      im HTML — Cloudflare-Obfuskierung).
      **Vertragstreue:** `guests` als Zahl (`Number.parseInt`), `eventDate` als volles
      ISO-Datetime — bewusst 12:00 Ortszeit, weil `toISOString()` bei 00:00 MEZ auf den
      **Vortag** rutschen würde; `sourceDetail` `ristorante_silvester`/`ristorante_weihnachten`,
      `serviceKind` `"event"`, `language` nur `de`/`en`. Leerer Honeypot wird gar nicht erst
      mitgeschickt, damit der Server ihn nicht als befüllt werten kann.
      **Keine Testanfrage abgesetzt** (Vorgabe: kein echter Lead im System).
- [x] **E2.3** Vormerk-Formular auf beiden Seiten aushängen (nur die zwei Mount-Punkte),
      events-storia-CTAs auf diesen zwei Seiten ersetzen, CTA-Hierarchie vereinheitlichen.
      Beweis: Valentinstag + generische Anlass-Seite rendern das Vormerk-Formular weiterhin.
      **Beweis 13.09.2026** (Branch `saisonseiten-e2`): `npm run build` grün (157 Seiten
      prerendert, 0 Errors), `npx tsc --noEmit` ohne Ausgabe, `npm run lint` **727 Probleme =
      Baseline unverändert**, kein neues Problem. Geändert wurden genau 8 Dateien:
      `SilvesterMuenchen.tsx`, `WeihnachtenMuenchen.tsx`, `eventsLinks.ts`, die vier
      Übersetzungsdateien und dieses Loop-Dokument.
      **Ausgehängt, nicht abgebaut:** entfernt wurden ausschließlich die zwei `<section
      id="signup-form">`-Mount-Punkte samt `<SeasonalSignupForm seasonalEvent="silvester" |
      "weihnachten" />`. `git diff` ist LEER für `src/components/SeasonalSignupForm.tsx`,
      `src/pages/BesondererAnlass.tsx`, `src/pages/seo/ValentinstagMuenchen.tsx`,
      `src/pages/NewsletterBestaetigung.tsx`, `src/components/admin/SeasonalSignupsManager.tsx`,
      `src/components/admin/SeasonalNotificationsManager.tsx` und für `supabase/` komplett (die
      vier Edge Functions `subscribe-seasonal`, `confirm-seasonal`, `unsubscribe-seasonal`,
      `notify-seasonal-signups` und die Tabelle `seasonal_signups` also unangetastet). Ebenfalls
      `git diff`-leer, wie von der harten Regel verlangt: `Kontakt.tsx`, `Reservierung.tsx`,
      `ReservationBooking.tsx`, `GroupInquiryForm.tsx`, `FilmfestMuenchen.tsx`.
      **Prerender-Beweis, alle 8 Zielrouten** (`dist/besondere-anlaesse/silvester/`,
      `dist/en/special-occasions/new-years-eve/`, `dist/it/occasioni-speciali/capodanno/`,
      `dist/fr/occasions-speciales/nouvel-an/`, `dist/weihnachten-muenchen/`,
      `dist/en/christmas-munich/`, `dist/it/natale-monaco/`, `dist/fr/noel-munich/`), jeweils im
      **sichtbaren** HTML nach Entfernen ALLER `<script>`-Blöcke: **0 Treffer** für
      `id="signup-form"` UND **0 Treffer** für `href="#signup-form"` (kein toter Anker), dafür je
      `id="reservieren"` + `id="anfrage"` und je **2 × `href="#reservieren"` + 2 ×
      `href="#anfrage"`** (Hero und Final-CTA).
      **events-storia:** je Zielroute exakt **2** Vorkommen — derselbe Wert wie auf den
      Kontrollseiten `dist/reservierung/index.html` und `dist/kontakt/index.html` (je 2), die nie
      seitenbezogene events-storia-Links hatten. Die zwei verbleibenden sind also ausschließlich
      globales Chrome (Navigation → Catering, Footer → Gutschein-Shop), **0 seitenbezogene**.
      Vorher-Messung am selben Build-Skript (`git stash`, Baseline gebaut, zurückgeholt):
      Silvester **7 → 2**, Weihnachten **8 → 2**.
      **Gegenprobe, dass nichts kaputtging:** `id="signup-form"` + E-Mail-Feld + Anker
      `href="#signup-form"` weiterhin in allen vier Valentinstag-Routen
      (`dist/valentinstag-muenchen/`, `dist/en/valentines-day-munich/`,
      `dist/it/san-valentino-monaco/`, `dist/fr/saint-valentin-munich/`). events-storia-Links
      weiterhin vorhanden auf `firmenfeier-muenchen` (9), `geburtstagsfeier-muenchen` (5),
      `catering` (10), `weihnachtsfeier-muenchen` (8) — alle deutlich über dem Chrome-Wert 2.
      **Generische Anlass-Seite:** ihr Vormerk-Block sitzt in `SeasonalPlaceholder`
      (`BesondererAnlass.tsx:448`) und greift erst, wenn eine Saisonkonfiguration **kein**
      veröffentlichtes Menü hat; heute ist keine solche Route prerendert (`grep -rl
      'id="signup-form"' dist/` liefert genau die vier Valentinstag-Routen). Der Beweis ist
      deshalb der leere `git diff` der Datei plus die unveränderte Mount-Stelle — nicht eine
      dist-Datei, die es nicht gibt.
      **CTA-Hierarchie:** aus bis zu sechs konkurrierenden Zielen sind zwei geworden — Tisch
      reservieren → `#reservieren`, Gruppe/Firma anfragen → `#anfrage`. Sichtbar im HTML:
      Silvester „Tisch für Silvester reservieren" / „Gruppe oder Firma anfragen" (Hero) und
      „→ Tisch reservieren" / „→ Gruppe anfragen" (Final-CTA); Weihnachten „Tisch in der
      Adventszeit reservieren" / „Weihnachtsmenü für Gruppen anfragen" bzw. „→ Tisch
      reservieren" / „→ Gruppen-Menü anfragen". Telefon/E-Mail/WhatsApp stehen jetzt **genau
      einmal** im Seitenkörper, gebündelt direkt hinter dem Anfrageformular („Lieber persönlich
      sprechen?"): gemessen gegen die Kontrollseite `dist/reservierung/index.html` (3 × `wa.me`,
      4 × `tel:` allein aus dem Chrome) liegen beide Zielseiten bei 4 bzw. 5 — Differenz **je 1**.
      Vorher waren es 5 × `wa.me` / 7 × `tel:` (= 2 bzw. 3 im Seitenkörper).
      **Verwaiste Übersetzungsschlüssel: 25 Stück entfernt**, verteilt auf die vier Sprachdateien
      und ausschließlich innerhalb der Blöcke `seo.silvester` und `seo.weihnachten` — de 14
      (silvester `heroCta`, `heroCtaInactive`, `heroEventsNote`, `heroEventsLink`, `ctaBoxTitle`,
      `ctaBoxDesc`, `ctaBoxButton`, `ctaBoxNote`, `signupTitle`, `signupDesc`, `finalCtaButton`,
      `finalCtaButtonInactive`, `finalCtaAlt` + weihnachten dieselben plus `heroCtaPhone`), en 14,
      fr 14, it 6 (Italienisch hatte den Weihnachtsblock ohnehin nur teilweise übersetzt).
      Gegenprobe vor dem Löschen: dieselben **Namen** leben in `seo.valentinstag`,
      `seo.firmenfeier`, `seo.geburtstag` und `seo.weihnachtsfeier` weiter und werden dort
      gelesen — deshalb wurde blockweise gelöscht, nicht per Dateisuche. Gegenprobe danach: ein
      Skript, das die Blockgrenzen von `silvester`/`weihnachten` in allen vier Dateien bestimmt,
      findet dort **0** dieser Schlüssel und **0** `events-storia`-Vorkommen in Stringwerten (die
      13 verbleibenden Treffer sind Kommentarzeilen, die dokumentieren, was ersetzt wurde).
      `t.seasonalSignup.*` ist unangetastet — diese Schlüssel gehören der Komponente selbst.
      **Mitgefunden und mitgefixt:** die Silvester-FAQ „Wann wird das Silvester-Menü
      veröffentlicht?" antwortete in allen vier Sprachen „Lassen Sie sich vormerken, um als
      Erster informiert zu werden!" — eine Handlungsaufforderung ins Leere, sobald das Formular
      weg ist. Sie zeigt jetzt auf die zwei realen Wege. Sweep über alle acht Zielrouten: **0
      Treffer** für „vormerk", „notified", „Registratevi", „Inscrivez-vous", „Auf dem Laufenden
      bleiben", „stay in the loop".
      **`src/lib/eventsLinks.ts` nicht gelöscht** — das Preset `silvester` ist jetzt ungenutzt
      (die Silvesterseite war seine einzige Aufrufstelle) und trägt einen Kommentar, der das
      festhält und begründet, warum es stehen bleibt; alle übrigen Presets werden von
      Firmenfeier, Weihnachtsfeier, Hochzeit, Geburtstag, Catering und Reisegruppen weiter
      gebraucht.
      **Keine neuen Fakten:** die angefassten Fließtexte (`introP3` beider Seiten, Weihnachts-FAQ
      `faq2Answer`, Silvester-FAQ `faq1Answer`, `finalCtaDesc` Silvester) haben nur den Verweis
      „ab 20 Gäste über events-storia.de" durch den Verweis auf das Formular derselben Seite
      ersetzt; die 20-Gäste-Schwelle war eine reine Weiterleitungsregel zu events-storia und
      steuert nichts mehr. Preise, Gangzahlen, Kapazitäten und Fristen sind unberührt und kommen
      weiterhin über `fillFacts()` aus `FACTS`.

## E2: Branch, Beweis, Merge

- [x] Branch `saisonseiten-e2` gepusht, PR erstellt, Diff gegengelesen, gemergt, Live-Stichprobe
      **inklusive echter Testanfrage** über das Formular (Browser, nicht `curl` — CORS + JS).
      ✓ 2026-09-13 · PR #89 im Hauptfenster gegengelesen — Dateiliste gegen die Schutzgüter
      geprüft: `SeasonalSignupForm`, `BesondererAnlass`, `ValentinstagMuenchen`, `supabase/`,
      `Kontakt.tsx`, `Reservierung.tsx` und die Admin-Manager sind **nicht** im Diff. Die
      `ReservationBooking`-Erweiterung ist echt abwärtskompatibel (ohne Props `defaultDate ??
      new Date()`, `defaultGuests ?? "2"` → altes Verhalten), `Reservierung.tsx` damit unberührt.
      → `gh pr merge 89 --squash --delete-branch`. Deploy erfolgreich (Run 34733620706).
      **Live verifiziert:** beide Seiten haben `id="reservieren"` und `id="anfrage"`,
      `id="signup-form"` ist auf beiden weg (0 Treffer), events-storia nur noch auf
      Chrome-Niveau (2 = Footer, 0 seitenbezogen). Honeypot `name="website"` im Markup, im
      ausgelieferten CSS `.hp-field{position:absolute;left:-9999px;…;opacity:0;pointer-events:none}`.
      **Endpunkt-URL im ausgelieferten JS-Bundle bestätigt** (`/assets/index-vXrEPVDR.js`) — der
      Workflow-Fix aus PR #88 hat gegriffen, das Formular läuft nicht in den Ausweichblock.
      **Noch offen:** die echte Testanfrage (erzeugt einen realen Lead in MAESTRO) — bewusst nicht
      eigenmächtig abgesetzt, siehe „Offen, außerhalb des Codes".
      **PR: https://github.com/dream-anchor/ristorantestoria.de/pull/89** — Branch gepusht,
      `origin/main` vorher in den Branch gemergt (PR #88, `VITE_MAESTRO_INTAKE_URL` im
      Deploy-Workflow; Auto-Merge ohne Konflikt, nur `.github/workflows/deploy-ionos.yml`,
      +6 Zeilen). Damit ist der unter E2.2 vermerkte offene Punkt erledigt: der Produktionsbuild
      kennt die Intake-URL, das Formular rendert live als Formular und nicht als
      Telefon/E-Mail-Ausweichblock. Stand nach dem Merge: `npm run build` grün (157 Seiten,
      0 Errors), `npx tsc --noEmit` sauber, `npm run lint` 727 = Baseline, alle
      E2.3-Prerender-Prüfungen weiterhin grün.
      **Merge passiert im Hauptfenster** — hier bewusst nicht abgehakt.

---

## E3 — Inhaltliche Tiefe

- [x] **E3.1** Stornobedingungen/Anzahlung — Fakten von Antoine am 13.09.2026 nachgeliefert
      (Stornostaffel: >30 Tage kostenlos, 15–30 Tage 25 %, 8–14 Tage 50 %, 3–7 Tage 80 %, ab 48h
      oder No-Show 100 %, maßgeblich der Eingang der schriftlichen Stornierung, Anzahlungen
      werden verrechnet).
      **Beweis 13.09.2026** (Branch `saisonseiten-e3`, Commits `98ee53a`/`f7295d5`/`f1a2cc6`):
      `npm run build` grün (157 Seiten prerendert, 0 Errors), `npx tsc --noEmit` ohne Ausgabe,
      `npm run lint` **727 Probleme = Baseline unverändert**. Scope-Entscheidung (Antoine
      bestätigt): Staffel auf `SilvesterMuenchen.tsx` (Gala-Dinner, klar ein bezahltes Event) und
      `WeihnachtsfeierMuenchen.tsx` (schließt die bisher unbegleitete „Anzahlung (30%) sichert
      Ihren Termin" aus `step3Desc`) — **nicht** auf `WeihnachtenMuenchen.tsx` (à la carte, keine
      Anzahlung, eine Stornostaffel wäre dort sachlich irreführend). **Kein Verweis auf eine
      nicht existierende „AGB für Veranstaltungen"-Seite** — Antoines Originaltext verwies darauf,
      übernommen wurde stattdessen `cancellationDepositNote`, die auf die Buchungsbestätigung
      verweist. Sichtbares HTML (Skript-Blöcke via `perl -0pe 's/<script.*?<\/script>//gs'`
      ausgeklammert), `dist/besondere-anlaesse/silvester/index.html` und
      `dist/weihnachtsfeier-muenchen/index.html`: je 2× „Stornobedingungen", „Mehr als 30 Tage
      vorher"/„Kostenlos", „15–30 Tage vorher"/„25 %", „Ab 48 Stunden vorher oder No-Show", 2×
      „100 %". `grep -ric "agb-veranstaltungen\|agb für veranstaltungen"` → **0 Treffer** auf
      Silvester, Weihnachtsfeier UND Weihnachten. Alle vier Sprachen geprüft: EN
      „Cancellation Policy"/„More than 30 days before"/„Free of charge", IT „Condizioni di
      cancellazione"/„Più di 30 giorni prima"/„Gratuito", FR „Conditions d'annulation" (im
      HTML als `&#x27;`, Standard-SSR-Escaping) — auf allen 12 Sprach-Routen von Silvester UND
      Weihnachtsfeier (inkl. der zusätzlichen `christmas-party-munich`/`festa-natale-monaco`/
      `fete-noel-munich`-Routen).
- [x] **E3.2** Kapazitätsblock in Zahlen + Social Proof.
      **Beweis 13.09.2026** (Commits `f7295d5`/`4497682`): Social Proof —
      `<GoogleReviews />` (Bestandskomponente, zieht echte Daten aus
      `src/data/google-reviews-*.json`, keine Props) auf `SilvesterMuenchen.tsx` und
      `WeihnachtenMuenchen.tsx` vor dem FAQ-Abschnitt eingebunden, Muster wie
      `AperitivoMuenchen.tsx`/`WeihnachtsfeierMuenchen.tsx`. Sichtbares HTML: beide Seiten zeigen
      „4,5"/„4.5", 6–7× „Bewertung(en)", echte Rezensionstexte — je nach Sprachroute geprüft
      (DE/EN/IT/FR), 0 Treffer für „undefined" auf allen 12 betroffenen Routen.
      **Kapazitätsblock — Entscheidung „kein zusätzlicher Bedarf, bereits abgedeckt" für BEIDE
      Seiten**, nicht nur für Silvester: „Auf einen Blick" (E1.3) nennt auf beiden Seiten bereits
      die Innen-/Terrassen-Aufschlüsselung (Silvester „2 bis 100 Gäste"; Weihnachten
      „{indoorSeats} Plätze innen, {terraceSeats} auf der überdachten Terrasse" aus `FACTS`).
      Für Weihnachten wurde die tiefer gestaffelte Kapazitätslogik von
      `WeihnachtsfeierMuenchen.tsx` FAQ2 (10–30/30–60/60–100 Personen, private Raummiete) bewusst
      **nicht** übernommen: das ist Gruppen-/Privatevent-Logik, die mit E4.1 explizit von
      `weihnachten-muenchen` entfernt wurde (Kannibalisierung weihnachten-muenchen vs.
      weihnachtsfeier-muenchen aufgelöst) — sie dort erneut einzuführen widerspräche dieser erst
      am selben Tag getroffenen Entscheidung. Für Silvester (Gala-Dinner, nur 19:00–20:00-Slot)
      ist ohnehin keine zusätzliche Kapazitätszahl auffindbar. Diese Abweichung von der
      wörtlichen Aufgabenstellung (die für Weihnachten keinen ausdrücklichen Opt-out nannte) ist
      hier bewusst dokumentiert statt stillschweigend übergangen.
- [x] **E3.3** Bildstrecke + FAQ-Ausbau.
      **Beweis 13.09.2026** (Commits `f7295d5`/`4497682`/`f1a2cc6`): **Bildstrecke** —
      `PhotoGallery`-Komponente (Bestandskomponente mit Lightbox, Muster:
      `FirmenfeierMuenchen.tsx`/`RomantischesDinner.tsx`), je 3 Bilder, **ausschließlich bereits
      vorhandene Projekt-Assets**, keine neuen Bilder generiert/hochgeladen. Silvester:
      `aperitivo-muenchen-italienische-bar-storia.webp` (Aperitivo-Empfang),
      `romantisches-dinner-kerzenlicht-storia-muenchen.webp` (Kerzenlicht-Ambiente),
      `ristorante-storia-uebersicht-details.webp` (Interieur). Weihnachten:
      `ristorante-storia-uebersicht-gaeste.webp` (Gäste am Tisch),
      `ristorante-storia-uebersicht.webp` (Restaurant-Ambiente),
      `gaeste-terrasse-italiener-maxvorstadt-muenchen.webp` (überdachte Terrasse). Bild-Intro/
      Alt-Texte/Captions bewusst hardcoded Deutsch über alle Sprachrouten hinweg — folgt dem
      bestehenden Muster von `PhotoGallery`-Einbindungen im Repo (`RomantischesDinner.tsx`,
      `FirmenfeierMuenchen.tsx` machen es identisch), keine neue Teilübersetzungs-Konvention
      erfunden. Sichtbares HTML: „Impressionen vom Silvesterabend" bzw. „Impressionen aus dem
      STORIA" auf beiden Seiten vorhanden.
      **FAQ-Ausbau** — je eine neue FAQ, entstanden aus E3.1: Silvester FAQ9 „Muss ich eine
      Anzahlung leisten – und was passiert, wenn ich absagen muss?" (Verweis auf
      „Stornobedingungen"), Weihnachtsfeier FAQ9 „Was passiert mit meiner Anzahlung, wenn ich
      absagen muss?" (knüpft an `step3Desc` an). **Bewusst KEINE neue FAQ auf
      `WeihnachtenMuenchen.tsx`**: weder Storno (E3.1 schließt diese Seite aus) noch Kapazität
      (E3.2-Entscheidung „bereits abgedeckt") liefern dort einen neuen Fakt, aus dem eine FAQ
      entstehen könnte — eine erzwungene Frage ohne neuen Inhalt hätte gegen die Vorgabe „keine
      erfundenen Fakten" verstoßen. FAQPage-Schema-Beweis (Python `json.loads` je Block):
      Silvester 8→**9** Question/Answer-Paare, Weihnachtsfeier 8→**9**, Weihnachten unverändert
      **5** (keine Änderung, wie vorgesehen); alle JSON-LD-Blöcke weiterhin syntaktisch gültig
      (Silvester: 6 `application/ld+json`-Vorkommen, 1× FoodEvent, 1× BreadcrumbList,
      1× FAQPage — unverändert zu E1.6).
      Gesamt-Build/Lint für alle drei Kriterien: `npm run build` grün (157/157, 0 Errors),
      `npx tsc --noEmit` sauber, `npm run lint` 727 Probleme = Baseline (651 Errors/76 Warnings,
      unverändert).

## E3: Branch, Beweis, Merge

- [ ] Branch `saisonseiten-e3` gepusht, PR erstellt, gemergt, Live-Stichprobe.

---

## BLOCKED-Log

<!-- Format: DATUM · Kriterium · Grund · was gebraucht wird -->
- 13.09.2026 · E3.1 · Stornobedingungen/Anzahlung unbekannt · Angaben von Antoine
- ~~13.09.2026 · E1.1 (Teil) · `facts.ts:67` TODO Weihnachtspreis 45 € vs. 49 €~~ — **erledigt
  13.09.2026** (PR #91): Widerspruch war historisch, im Repo existiert kein 49-€-Wert mehr.
  Offen bleibt nur, ob 45 € betrieblich korrekt ist — kein Blocker.

## Offen, außerhalb des Codes

- ~~`VITE_MAESTRO_INTAKE_URL` muss in die CI~~ — **erledigt 13.09.2026** (PR #88, vor E2.3 gemergt).
- **`.env.example` existiert im Repo nicht** — der Eintrag konnte deshalb nicht dort ergänzt
  werden; die Datei wurde absichtlich nicht neu angelegt. Die Variable ist stattdessen im
  Kopfkommentar von `src/components/AnlassAnfrageForm.tsx` dokumentiert, inklusive des
  Hinweises auf den CI-Build.
- ~~`llms.txt`/`llms-full.txt` „Anfragen … ab Juli" vs. Seite „ab September/Oktober"~~ —
  **erledigt 13.09.2026** (PR #91), Antoine hat September/Oktober bestätigt.

- **Listicle-Aufnahme** (in-muenchen.de Silvester, Mit Vergnügen Weihnachtsfeier) — größter
  Sichtbarkeitshebel, Betreiber-Aktion, kein Code.

---

## E4 — Kannibalisierung auflösen: Weihnachten (privat) vs. Weihnachtsfeier (B2B)

**Befund (Antoine, 13.09.2026):** `weihnachten-muenchen` und `weihnachtsfeier-muenchen` bespielen
inzwischen beide Begriffe gegenseitig — Title/H2 der einen Seite nennen den Kernbegriff der
anderen. GSC bestätigt das: 16 Weihnachts-Queries, 1.009 Impressionen, 6 Klicks, nur 1 Query auf
Seite 1, 12 von 16 schlechter als Position 20 (u. a. „weihnachtsfeier münchen" Pos. 50,
„firmenweihnachtsfeier münchen" Pos. 52 — trotz eigener Zielseite). Zum Vergleich: Silvester
(nach Konsolidierung nur eine Seite) rankt für seine Kern-Queries auf Pos. 8–10.

**Recherche 13.09.2026 fand zusätzlich einen echten Faktenwiderspruch:** `WeihnachtenMuenchen`
FAQ3 sagt „Nein, kein festes Weihnachtsmenü zum Vorbestellen", `WeihnachtsfeierMuenchen` FAQ4
nennt drei benannte Menüpakete (Natale Classico/Grande/Buffet). Beides stimmt im jeweiligen
Kontext (Einzelgast vs. Gruppen-Event), liest sich aber ohne Kontext widersprüchlich.

**Entscheidung (Antoine):** trennen, nicht zusammenlegen — anders als bei Silvester (dort war es
dieselbe Seite zweimal), hier sind es zwei echte Angebote mit unterschiedlichem Publikum.

**Zielbild:**
- `weihnachten-muenchen` = privates à-la-carte-Weihnachtsessen (Familie, Paare, spontan). Gruppen-
  /Firmenweg wird nur noch kurz benannt und verlinkt auf die Feier-Seite.
- `weihnachtsfeier-muenchen` = Firmen-/Gruppen-Weihnachtsfeier, B2B, bis 300 Gäste. Bekommt den
  Gruppen-Weg samt Anfrageformular exklusiv.

**Was laut Recherche konkret wandert** (aus `WeihnachtenMuenchen.tsx`, alle Gruppen-only-Inhalte):
Pakete-Sektion (`packagesTitle`, H2 „Orientierung für Ihr Gruppen-Menü"), Anfrageformular-Sektion
(`AnlassAnfrageForm`, `id="anfrage"`), Kontaktbox („Lieber persönlich sprechen?"), Timeline/Ablauf
(„So läuft Ihre Weihnachtsfeier ab"), zwei der „8 Gründe" (reason4 Gruppengrößen, reason8
Rundum-Service). **Bleibt:** Hero, Intro (neu gefasst auf reinen à-la-carte-Fokus), „Auf einen
Blick", Reservierungs-Sektion (OpenTable, `id="reservieren"`), die verbleibenden 6 „Gründe", FAQ
(nur privat-relevante Fragen: Heiligabend/Parkplatz/vegetarisch-Karte/unter der Woche).

- [x] ~~**E4.1** `WeihnachtenMuenchen.tsx` auf reinen à-la-carte-Fokus zuschneiden~~ —
      **erledigt 13.09.2026** (Branch `saisonseiten-e4`, gepusht/gemergt zusammen mit E4.2 als
      PR #93 — siehe „E4: Branch, Beweis, Merge" unten).
      Entfernt: Pakete-Grid („Orientierung für Ihr Gruppen-Menü"), Anfrageformular-Sektion
      (`id="anfrage"`, `AnlassAnfrageForm`-Einbindung — Komponente selbst bleibt), Kontaktbox
      („Lieber persönlich sprechen?"), Timeline („So läuft Ihre Weihnachtsfeier ab"). „Zwei
      Wege"-Sektion: Weg 1 (privat) unverändert als Karte, Weg 2 zu einem Hinweisblock mit
      Link auf `weihnachtsfeier-muenchen` reduziert (`twoWay2HintBadge/Title/Desc/LinkLabel`
      ersetzen `twoWay2Badge/Title/Desc/Item1-3`). „8 Gründe" auf 6 reduziert (reason4
      Gruppengrößen, reason8 Rundum-Service entfernt, keine erfundenen Ersatzgründe). FAQ von
      8 auf 5 gekürzt: `faq8` (Heiligabend), `faq3` (festes Menü — präzisiert, siehe unten),
      `faq5` (unter der Woche), `faq4` (vegetarisch — Gruppen-Menü-Klausel entfernt), `faq7`
      (Parkplatz); `faq1`/`faq2` (Buchungsvorlauf, Mindestpersonenzahl) und `faq6`
      (Geschenke/Dekoration) entfernt. FAQ-Widerspruch zu `weihnachtsfeier-muenchen` FAQ4
      aufgelöst: `faq3Answer` sagt jetzt explizit „Nein – für Einzelgäste und Familien…, für
      Firmen und Gruppen ab 6 Personen bieten wir dagegen feste Weihnachtsmenüs an … Details
      dazu auf unserer Weihnachtsfeier-Seite" statt eines unqualifizierten „Nein". FoodEvent-
      JSON-LD **ersatzlos entfernt** (kein Ersatzschema — Begründung: Weg 2 wird auf dieser
      Seite nicht mehr im Detail beschrieben, ein Event-Schema für ein Angebot ohne Termine/
      Preise/Anfrageweg auf der Seite wäre irreführend; `Restaurant`+`FAQPage` bleiben).
      Related-Links: `weihnachtsfeier-muenchen` **prominent an erster Stelle**
      (`standaloneRelated1`, umbenannt zu „🎄 Firmen- & Gruppenfeier"), visuell hervorgehoben
      (`border-2 border-primary bg-primary/5` statt Standardkarte). Hero-CTA und Final-CTA
      „…anfragen"-Button führen jetzt auf `weihnachtsfeier-muenchen` statt auf das entfernte
      `#anfrage`. Zwei stale Kommentar-/Textstellen korrigiert, die noch „Anfrageformular
      weiter unten" behaupteten (introP3 in allen 4 Sprachen). 60 verwaiste
      Übersetzungsschlüssel pro Sprache in de/en/fr entfernt (per Skript-Diff exakt gezählt):
      packagesTitle/Intro + package1-3* [29], inquiryTitle/Intro [2], contactBoxTitle/Desc
      [2], timelineTitle [1] + step1-5Title/Desc [10], twoWay2Badge/Title/Desc/Item1-3 [6],
      reason4/reason8 Title/Desc [4], faq1/faq2/faq6 Question/Answer [6] — Gegenprobe: `grep`
      in `WeihnachtenMuenchen.tsx` zeigt keine Nutzung mehr. it.ts (nur Teilübersetzung)
      entsprechend schlanker bereinigt: 12 dort vorhandene Keys entfernt
      (twoWay2Badge/Title/Desc/Item1-3 [6], inquiryTitle/Intro [2], packagesTitle/Intro [2],
      contactBoxTitle/Desc [2]). 4 neue Keys ergänzt (`twoWay2HintBadge/Title/Desc/LinkLabel`)
      in allen 4 Sprachen. **Nebenbefund (E4.2-Punkt) vorab geprüft:**
      `grep -rn "<WeihnachtenMuenchen" src/ scripts/ prerender.js` → einziger Aufrufer ist
      `App.tsx` → `WeihnachtenMuenchenStandalone`, **immer** mit `standalone` (nie `false`,
      nie ganz ohne Prop) — die `!standalone`-Zweige (canonicalPath/breadcrumbSchema-Else,
      nicht-standalone SEO-Texte, nicht-standalone Related-Links) sind damit nachweislich toter
      Code, wie bei Silvesters E1.7. **Nicht entfernt** in E4.1 (optional, aufwändig — mehrere
      Ternaries plus ca. 14 zusätzlich verwaiste Keys pro Sprache): bleibt offener Punkt für
      eine spätere Iteration, nicht blockierend für E4.2.
      Beweis: `npx tsc --noEmit` sauber, `npm run lint` unverändert bei 727 Problemen
      (Baseline bestätigt vor Start), `npm run build` 157/157 Seiten gerendert, 0 Fehler.
      `dist/weihnachten-muenchen/index.html` (Skript-Blöcke ausgeklammert): kein
      `id="anfrage"` (0 Treffer), `id="reservieren"` vorhanden, kein `FoodEvent` im Rohcode
      (0 Treffer), `FAQPage` mit genau 5 Question/Answer-Paaren, Related-Links-Reihenfolge
      `weihnachtsfeier-muenchen → eventlocation-muenchen-maxvorstadt → firmenfeier-muenchen →
      speisekarte → reservierung → catering` mit `weihnachtsfeier-muenchen` optisch
      hervorgehoben (`bg-primary/5 border-2 border-primary` vs. `bg-card border` bei den
      übrigen fünf).

      **Nachtrag 13.09.2026 (Fakten-Korrektur, eigener Commit `6f498aa` auf demselben Branch):**
      Antoine hat präzisiert, dass es **kein festes Weihnachtsmenü gibt — auch nicht für
      Gruppen/Firmen**. Die in E4.1 geschriebene FAQ3-Antwort („…bieten wir dagegen feste
      Weihnachtsmenüs an") widersprach dem und wurde korrigiert zu: kein für alle Gäste
      vorgegebenes festes Menü; Einzelgäste/Familien wählen à la carte (dort zusätzlich ein
      Weihnachtsmenü in drei Varianten Fleisch/Fisch/vegetarisch, einzeln bestellbar); Firmen/
      Gruppen ab 6 Personen **besprechen** das Menü individuell mit dem Betreiber (nicht: wählen
      aus festen Paketen). Gleiche Korrektur in `twoWay2HintDesc` („Orientierungspreise" statt
      „feste Menüpakete"). Betrifft **alle 4 Sprachen**. `facts.ts` um
      `altaCarteMenuVariants: ["Fleisch", "Fisch", "vegetarisch"]` ergänzt. **Wichtig für E4.2:**
      dieselbe „kein festes Menü, wird individuell besprochen"-Sprachregel gilt für
      `weihnachtsfeier-muenchen` genauso — siehe korrigierte E4.2-Beschreibung unten.
- [x] ~~**E4.2** `WeihnachtsfeierMuenchen.tsx` um den Gruppen-Weg erweitern~~ — **erledigt
      13.09.2026** (Branch `saisonseiten-e4`, noch nicht gepusht/PR).
      **`src/components/AnlassAnfrageForm.tsx`:** `Anlass`-Union um `"weihnachtsfeier"` ergänzt,
      `SOURCE_DETAIL.weihnachtsfeier = "ristorante_weihnachtsfeier"` und
      `EVENT_TYPE.weihnachtsfeier = "Weihnachtsfeier für Firmen & Gruppen"` — eigener Wert statt
      `"weihnachten"` mitzubenutzen, damit die Lead-Attribution zwischen den beiden Seiten
      unterscheidbar bleibt (harte Vorgabe aus der Aufgabenstellung). `silvester`/`weihnachten`
      unverändert, `WeihnachtenMuenchen.tsx`/`SilvesterMuenchen.tsx` nicht angefasst.
      **`src/pages/seo/WeihnachtsfeierMuenchen.tsx`:** neue Anfrage-Sektion (`id="anfrage"`,
      Muster identisch zu `SilvesterMuenchen.tsx`) direkt hinter der Menü-Sektion eingefügt —
      `<AnlassAnfrageForm anlass="weihnachtsfeier" minGuests={FACTS.weihnachten.groupMenuMinGuests} />`
      in einem `max-w-2xl`-Container, Überschrift/Intro aus neuen Keys `inquiryTitle`/
      `inquiryIntro`. Events-storia-CTAs (Hero, Final-CTA) unverändert gelassen — diese Seite ist
      nicht Teil des MAESTRO-Ersatzes aus E2.3, das Formular ergänzt nur. Related-Links-Grid um
      eine erste Karte auf `weihnachten-muenchen` ergänzt (`related5Title/Desc`, fehlte bisher
      komplett — Gegenrichtung zu der Karte, die `weihnachten-muenchen` seit E4.1 umgekehrt schon
      prominent hierher setzt).
      **Menü-Pakete umformuliert (Fakt Antoine 13.09.2026, kein festes Menü auch für Gruppen):**
      Preise/Struktur der drei Karten (Natale Classico/Grande/Buffet) unverändert, nur Framing
      angepasst — `menuTitle`/`menuIntro` sagen jetzt explizit „kein pauschal buchbares Menü,
      Orientierungsbeispiele fürs gemeinsame Gespräch" statt sie als Bestellmenü zu präsentieren;
      `step2Desc` im Ablauf-Block („Wählen Sie Ihr Weihnachtsmenü") auf „wir besprechen es
      individuell" korrigiert. **FAQ4 präzisiert** (Frage bewusst NICHT „feste Menüpakete"
      formuliert, um den in E4 gefundenen Faktenwiderspruch nicht in der sichtbaren Frage zu
      wiederholen): „Können wir eines der Menüs oben einfach so buchen?" → „Nein – ein pauschal
      buchbares Menü gibt es nicht: wir besprechen Ihr Weihnachtsmenü individuell mit Ihnen … die
      Menüs oben dienen als Orientierung … für Einzelgäste/Familien siehe unsere Weihnachtsseite."
      **Timeline/Ablauf aus E4.1 sinngemäß übernommen, nicht dupliziert:** die Seite hatte mit
      `processTitle`/`step1-5` bereits einen eigenen Ablauf-Block (Anfrage → Besichtigung →
      Angebot → Abstimmung → Feiertag), fachlich aber der B2B-*Planungsprozess*, während die aus
      `WeihnachtenMuenchen.tsx` entfernte Timeline den *Abend selbst* beschrieb (Aperitivo-Empfang,
      Menü Gang für Gang, Weine, Dolci & Digestif, Ausklang) — beides zusammen zu übernehmen hätte
      zwei „Ablauf"-Sektionen nebeneinander bedeutet. Stattdessen in den bestehenden letzten Schritt
      (`step5Desc`, „Buon Natale!") verschmolzen: der beschreibt bereits den Abend selbst und trägt
      jetzt zusätzlich die Aperitivo→Menü→Wein→Dolci→Ausklang-Reihenfolge sinngemäß mit.
      Alle Textänderungen (`menuTitle/Intro`, `step2Desc`, `step5Desc`, `faq4Question/Answer`,
      `inquiryTitle/Intro`, `related5Title/Desc`) in **allen 4 Sprachen** (de/en/fr/it) — anders
      als bei `WeihnachtenMuenchen.tsx` ist `it.ts` für diese Seite vollständig übersetzt, deshalb
      hier volle Übersetzung statt Teilübersetzungs-Muster.
      **Nebenbefund (`standalone`-Zweig) geprüft — entfällt:** `WeihnachtsfeierMuenchen` hat
      (anders als `WeihnachtenMuenchen`) gar keine Props und keinen `standalone`-Zweig
      (`const WeihnachtsfeierMuenchen = () => {`, Mount in `App.tsx` ohne jede Prop) — der
      Nebenbefund aus der Aufgabenstellung ist damit nicht anwendbar, nichts zu entfernen.
      Beweis: `npx tsc --noEmit` sauber, `npm run lint` unverändert bei 727 Problemen (651 Errors,
      76 Warnings — Baseline vor und nach Änderung identisch), `npm run build` 157/157 Seiten
      gerendert, 0 Fehler. `dist/weihnachtsfeier-muenchen/index.html` (Skript-Blöcke ausgeklammert
      via `perl -0pe 's/<script.*?<\/script>//gs'`): `grep -oiE "feste[sn]? (Men(ü|u)|Paket)"` →
      0 Treffer (sichtbarer Text), `id="anfrage"` vorhanden, `href="/weihnachten-muenchen/"`
      vorhanden, FAQPage-Schema weiterhin 8 Question/Answer-Paare, FAQ4-Antwort im Rohtext beginnt
      mit „Nein – ein pauschal buchbares Menü gibt es nicht…". `weihnachten-muenchen/index.html`
      und `besondere-anlaesse/silvester/index.html` gegengeprüft: unverändert (`id="anfrage"`
      weiterhin nur bei Silvester bzw. jetzt zusätzlich bei Weihnachtsfeier, nicht bei Weihnachten;
      Silvester-Formular unangetastet).

## E4: Branch, Beweis, Merge

- [x] ~~Branch `saisonseiten-e4` gepusht, PR erstellt, Diff gegengelesen, gemergt, Live-Stichprobe.~~
      **erledigt 13.09.2026** (PR #93, squash-merged nach `main`, Deploy-Run `34751113823`
      erfolgreich). Live-Beweis per `curl` gegen `www.ristorantestoria.de`:
      - Beide URLs `200`, keine Redirects (`weihnachten-muenchen/`, `weihnachtsfeier-muenchen/`).
      - `weihnachten-muenchen/index.html`: 0× `id="anfrage"`, 0× `FoodEvent`, 5× Link auf
        `weihnachtsfeier-muenchen`.
      - `weihnachtsfeier-muenchen/index.html`: 1× `id="anfrage"`, 1× Link zurück auf
        `weihnachten-muenchen`, 0 Treffer für „feste[s/n]? Men(ü|u)/Paket" im sichtbaren Text.
      - FAQ4-Antwort live bestätigt: „Nein – ein pauschal buchbares Menü gibt es nicht: Wir
        besprechen Ihr Weihnachtsmenü für die Feier individuell mit Ihnen …" — FAQ-Widerspruch
        zwischen den beiden Seiten damit nicht mehr feststellbar, gegenseitige Verlinkung in
        beiden Richtungen vorhanden, kein `id="anfrage"` mehr doppelt mit identischem
        `sourceDetail` (getrennt: `ristorante_weihnachten` vs. `ristorante_weihnachtsfeier`).

## Abschluss

Sind E1–E4 abgehakt und alle PRs gemergt: wörtlich `SAISONSEITEN-AUSBAU ABGESCHLOSSEN` ausgeben.
