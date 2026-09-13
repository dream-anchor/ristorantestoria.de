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

- [ ] Branch `saisonseiten-e1` gepusht, PR erstellt, Diff gegengelesen, gemergt, Live-Stichprobe.
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
