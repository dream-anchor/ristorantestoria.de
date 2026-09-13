# KONZEPT — Ausbau Silvester- und Weihnachtsseite (Inhalt + Conversion)

**Freigegeben:** Antoine, 13.09.2026 (Plan-Freigabe). Rolle der Analyse: Senior SEO + Senior GEO,
Wettbewerbsrecherche und Audit vorgelagert.

## Ausgangslage

Die beiden Saison-Seiten sind seit der Konsolidierung vom 12.09.2026 die kanonischen URLs ihres
Anlasses (`/besondere-anlaesse/silvester/`, `/weihnachten-muenchen/`). Beide stehen im Zustand
„Menü noch nicht veröffentlicht": Haupt-CTA führt auf `#signup-form` (Vormerk-Formular, sammelt nur
eine E-Mail), daneben steht zustandsunabhängig ein zweiter, konkurrierender CTA („auf
events-storia.de anfragen"). OpenTable kommt auf keiner der beiden Seiten vor.

## Vorgaben von Antoine (13.09.2026)

| Thema | Festlegung |
|---|---|
| Silvester-Betrieb | Ausschließlich Gala-Menü, **kein à la carte** |
| Silvester-Preis | **99 €**, mit Weinbegleitung **150 €** — dasselbe Menü, Unterschied nur die Weinbegleitung |
| Silvester-Menü | Menü des Vorjahrs **beispielhaft einfügen** |
| Weihnachten | **Zwei Wege:** Tisch buchen und à la carte von der saisonalen Karte essen, **oder** als Firma/Gruppe ein Weihnachtsmenü direkt mit dem Restaurant besprechen. Kein festes Weihnachtsmenü zum Veröffentlichen |
| MAESTRO | **Keine Widgets** (haben Probleme gemacht, bleiben deaktiviert). Stattdessen ein **eigenes Formular**, das per JavaScript direkt an `POST /api/public/inquiries` sendet |
| Bestandsschutz | **Kein bestehendes Formular darf brechen** |
| events-storia | Wird **nur auf diesen beiden Seiten** durch das eigene Formular ersetzt |

## Wettbewerbsbefund (Recherche 13.09.2026)

- Der Ranking-Artikel für Silvester-Dinner München listet **17 Restaurants — STORIA fehlt**.
  Dasselbe beim Weihnachtsfeier-Listicle (11 Locations, STORIA fehlt).
- Alle Einträge werden nach demselben Raster verglichen: **Gangzahl · Preis · Uhrzeit**.
- Preisgefüge Silvester München: 99 € (Seehaus) bis 555 € (Florio), Median ca. 165 € — STORIA liegt
  mit 99 €/150 € am unteren Rand, nutzt das aber nicht als Argument.
- Direkter Vergleichsfall **Ristorante ROMANS** (Neuhausen, italienisch, beide Anlässe): druckt
  jeden Gang mit Zutaten und Allergenen ab, auch wenn das neue Menü noch nicht steht, ausdrücklich
  als „Das war unser letztes Silvester-Menü". Hat dafür **keine** FAQ, keine echten Fotos, keine
  Bewertungen, keine Online-Buchung, keine Stornobedingungen.
- STORIA ist textlich nicht im Rückstand (895 bzw. 825 Wörter sichtbar; ROMANS 1.200–1.500 inkl.
  Menütexten). Die Lücke ist **Konkretheit und Vergleichbarkeit**, nicht Menge.

## Der größte sofort hebbare Fund

**Das vollständige Silvester-Menü liegt bereits im Code — aber nur im JSON-LD.**
`SilvesterMuenchen.tsx:192-232` enthält drei MenuSections («Vegetale», «Mare», «Terra») mit je vier
Gängen und vollständigen Gerichtsnamen, dazu à-la-carte-Preise (`:239-265`). Suchmaschinen und
KI-Systeme sehen das, Besucher nicht. Sichtbarmachen = der ROMANS-Hebel, ohne neue Inhalte.

## Faktenwidersprüche (GEO-kritisch, weil KI-Systeme sie gegeneinander lesen)

| # | Widerspruch | Fundstelle | Auflösung |
|---|---|---|---|
| 1 | Hub-Seite nennt Silvester **65,90 € / 99 €** (alte, am 12.09. korrigierte Preise) | `BesondereAnlaesse.tsx:48` | → 99 € / 150 € |
| 2 | Sichtbar: Classic 4-Gang, Premium **5-Gang**. JSON-LD: beide 4 Gänge | `de.ts:1869/1878` vs. `SilvesterMuenchen.tsx:181` | → **4 Gänge in beiden**, Unterschied ist die Weinbegleitung |
| 3 | Firmenfeier-Seite: „5-Gänge-Menü ab 99 €" | `FirmenfeierMuenchen.tsx:282` | → 4 Gänge |
| 4 | `llms.txt`: „5-Gänge ab 99 €" + toter Link auf die abgeschaltete Pillar-URL | `llms.txt:93,101,152` | → korrigieren |
| 5 | Weihnachten: Pakete ab 6 Gäste, FAQ sagt „ab 2 Personen buchbar" | `de.ts:2028` vs. `2085` | → à la carte ab 1 Person, Gruppenmenü ab 6 |
| 6 | Beide JSON-LD-`image`-URLs zeigen auf **nicht existierende Dateien** | `SilvesterMuenchen.tsx:179`, `WeihnachtenMuenchen.tsx:159` | → echte Datei oder Feld entfernen |
| 7 | Silvester rendert **zwei** BreadcrumbLists | `SilvesterMuenchen.tsx:141` + `:160-166` | → eine entfernen |
| 8 | TODO im Repo: Weihnachtspreis 45 € vs. 49 € | `facts.ts:67` | → 45 € beibehalten (überall konsistent live), TODO bleibt bis Antoine entscheidet |

## GEO-Verstöße gegen die eigene verbindliche Checkliste (`docs/geo-content-guidelines.md`)

- **Regel 3:** 0 autoritative Outbound-Links auf beiden Seiten (gefordert: min. 1)
- **Regel 1:** Intros beginnen emotional („La Dolce Vita zum Jahreswechsel") statt mit Definition-Lead
- **Regel 10:** `llms.txt` veraltet
- **Regel 8:** `FoodEvent` gefordert, aktuell generisches `Event`
- `tldr`-Texte existieren für beide Seiten (`de.ts:1852`, `2010`), werden aber **nirgends gerendert**

## Wiederverwenden statt neu bauen

- `ReservationBooking` kennt Silvester bereits: am 31.12. nur Slots **19:00–20:00**, 24./25.12. als
  Ruhetage gesperrt (`ReservationBooking.tsx:32-42`, `:91-108`)
- Einbindungsmuster auf Landingpages etabliert: `headingLevel="h3"` + `onBook`-Lead-Callback
  (`OktoberfestMuenchen.tsx:460`, `WmPublicViewingMuenchen.tsx:477`)
- Formular-Bestandsmuster: `FilmfestInquiryForm.tsx` (react-hook-form + Zod, Submit-Lock)
- `SilvesterMuenchen.tsx` enthält seit der Konsolidierung **toten `standalone`-Code**
  (`:52-58, 109-115, 126-131, 296-299, 338-363, 497-500`)

---

## MAESTRO-Endpunkt — verifizierter Vertrag (Recherche 13.09.2026, maestro-cloud)

**Wichtig: es gibt im maestro-cloud-Repo KEINE Einbau-Doku für diesen Weg** (nur für den
Widget-Weg, der hier nicht verwendet wird). Deshalb steht der Vertrag hier vollständig.

**`POST https://storia.schrittmacher.ai/api/public/inquiries`**, `Content-Type: application/json`,
kein Auth-Header, kein Turnstile (`maestro-cloud/apps/api/src/routes/public-inquiry.ts:128`).

**Mandant** wird aus der Subdomain abgeleitet (`storia.` → Slug `storia`), **nicht** aus dem Payload.

**CORS bereits freigegeben:** `CORS_ORIGINS` in `maestro-cloud/apps/api/wrangler.toml:23` enthält
`https://ristorantestoria.de` und `https://www.ristorantestoria.de`. Exakter String-Vergleich, kein
Wildcard. **Kein Handlungsbedarf.**

**Payload** (`public-inquiry.ts:80-111`) — einziges Pflichtfeld ist `customerName`:

| Feld | Typ | Hinweis |
|---|---|---|
| `customerName` | string 1–200 | **Pflicht** |
| `customerEmail` | string (email) ≤320 | optional |
| `phone` | string ≤60 | optional |
| `eventDate` | string, **volles ISO-8601-Datetime** | `"2026-12-31"` → 422. Leerstring wird zu `undefined` normalisiert |
| `guests` | **number** (int, >0) | `"12"` als String → 422 |
| `message` | string ≤5000 | optional |
| `company` | string ≤200 | optional |
| `eventTime` | string ≤20 | optional |
| `eventType` | string ≤120 | optional |
| `sourceDetail` | `^[a-zA-Z0-9_-]{1,100}$` | Konvention im System: `ristorante_*` → hier `ristorante_silvester` / `ristorante_weihnachten` |
| `language` | `"de"` \| `"en"` | nur diese zwei |
| `serviceKind` | `"catering"` \| `"event"` | hier `"event"` (im Haus) |
| `details` | Objekt, siehe unten | unbekannte Schlüssel werden verworfen, max. 8 KB |
| `website` | string ≤2000 | **Honeypot** — muss im Formular versteckt existieren |

`details` (alle optional): `dateFlexible`, `arrivalTime`, `preferredMenu`, `estimatedPrice`,
`budget`, `dietaryRequirements`, `deliveryAddress`, `groupSize`, `format`, `originalPage`,
`referrer`, `utmSource`, `utmMedium`, `utmCampaign`, `utmTerm`, `utmContent`.

**Antworten** — für die Frontend-Unterscheidung entscheidend:

| Fall | Status | Body |
|---|---|---|
| Erfolg | **201** | `{"data":{"id":"<uuid>","confirmationSent":bool,"operatorNotified":bool}}` |
| Honeypot befüllt | **202** | `{"data":{"ok":true}}` — **kein `id`**, stilles Verwerfen |
| Validierungsfehler | 422 | `{"error":"validation_error","issues":[…]}` |
| Rate-Limit | 429 | `{"error":"rate_limited","message":"Zu viele Anfragen, bitte kurz warten."}` |

**Achtung:** 201 **und** 202 sind beide `response.ok === true`. Eine reine `res.ok`-Prüfung reicht
nicht — auf `data.id` prüfen.

**Rate-Limit:** 10 Anfragen pro 60 Sekunden, Bucket = Mandant + Client-IP (`CF-Connecting-IP`).
Fail-closed: bei DB-Störung ebenfalls 429.

**Idempotenz:** gleiche Kombination aus Mandant, E-Mail und Nachricht innerhalb von 2 Minuten
liefert dieselbe `id` ohne zweiten Datensatz (`confirmationSent: false`). Doppelklick ist damit
serverseitig abgesichert — der clientseitige Submit-Lock bleibt trotzdem sinnvoll.

**Endpunkt-URL nicht hart kodieren:** laut `maestro-cloud/docs/storia-migration/P2-CUTOVER-EXECUTION.md:91-98`
setzen die Websites die URL per Build-Env `VITE_MAESTRO_INTAKE_URL` **ohne** hartkodierten
Prod-Fallback. Dieses Muster übernehmen.

---

## Umsetzung in drei Einheiten

### E1 — Fakten, Menü sichtbar machen, GEO-Basis
Kein neues Integrationsrisiko, nur Text/Schema/Rendering.

1. Acht Widersprüche auflösen; kanonische Werte in `src/config/facts.ts`, dann Hub-Teaser,
   Firmenfeier-Referenz, JSON-LD und `llms.txt` daran angleichen.
2. **Silvester-Menü sichtbar rendern** — die drei Varianten aus dem JSON-LD als Menü-Abschnitt,
   klar als Beispiel des Vorjahrs gekennzeichnet, mit Hinweis auf das kommende Menü im Oktober.
3. **„Auf einen Blick"-Block** unter dem Intro beider Seiten: Gangzahl · Preis · Beginn ·
   Kapazität · Reservierungsfrist.
4. **Weihnachtsseite auf die Zwei-Wege-Realität umstellen** (à la carte am Tisch vs. Gruppenmenü
   nach Absprache) statt „Menü folgt im Herbst".
5. Definition-Lead als ersten Satz beider Intros, `tldr` rendern.
6. Je ein autoritativer Outbound-Link (GEO-Regel 3).
7. JSON-LD: `FoodEvent` statt `Event`, doppelte BreadcrumbList entfernen, `image` reparieren, bei
   Weihnachten `highPrice` ergänzen.
8. `llms.txt` aktualisieren; toten `standalone`-Zweig in `SilvesterMuenchen.tsx` entfernen.

### E2 — Conversion-Umbau
1. **OpenTable** über `ReservationBooking` im etablierten Landingpage-Muster einbinden. Silvester:
   Überschrift macht klar, dass am 31.12. ausschließlich das Gala-Menü serviert wird. Weihnachten:
   regulärer Tischbetrieb im Advent. Optionale, abwärtskompatible Props `defaultDate`/`defaultGuests`
   — ohne Props verhält sich die Komponente exakt wie heute, `Reservierung.tsx` bleibt unangetastet.
2. **Eigenes Anfrageformular** nach dem Muster `FilmfestInquiryForm.tsx`, sendet an den oben
   dokumentierten Endpunkt, inklusive Honeypot `website` und Unterscheidung 201/202/422/429.
3. **Vormerk-Formular nur aushängen, nicht abbauen:** die zwei Mount-Punkte entfallen, Komponente,
   alle vier Edge Functions, Tabelle `seasonal_signups` und Admin-Oberfläche bleiben intakt
   (Valentinstag und generischer Anlass-Fallback nutzen sie weiter).
4. CTA-Hierarchie vereinheitlichen: ein primärer Weg je Absicht.

### E3 — Inhaltliche Tiefe
Stornobedingungen/Anzahlung · Kapazitätsblock in Zahlen · Social Proof (4,5 ★, 800+ Bewertungen) ·
Bildstrecke · FAQ-Ausbau.

**Off-Page, kein Code, größter Sichtbarkeitshebel:** Aufnahme in die beiden Ranking-Listicles
(in-muenchen.de Silvester, Mit Vergnügen Weihnachtsfeier) schlägt jede weitere On-Page-Arbeit für
diese Queries.

## Nicht in diesem Konzept

MAESTRO-Widgets (bleiben deaktiviert), sprachabhängiges JSON-LD (Event-Schema auf EN/IT/FR
weiterhin hartcodiert deutsch — eigener GEO-Punkt), Umstellung weiterer Seiten auf das neue
Formular, Valentinstag, Preisanpassung nach oben.
