# KI-Bilder kennzeichnen — verbindliche Regel für ristorantestoria.de

Stand: 07.10.2026. Gilt für die **gesamte Website** und **jede Bild-Arbeit** (Einbau, Tausch, Bearbeitung).
Keine Rechtsberatung. Dies ist eine Arbeitsregel auf Basis der unten genannten öffentlichen Quellen.
Bei Grenzfällen entscheidet Antoine, gegebenenfalls nach anwaltlicher Prüfung.

## Antoines Vorgabe (07.10.2026, wörtlich)

> In deinem konkreten Fall handelt es sich rechtlich gesehen um eine KI-gestützte Fotomontage bzw.
> Visualisierung. Da das Grundbild ein echtes Foto eures Restaurants ist und nur ein Element (die
> Leinwand) per KI hinzugefügt wurde, fällt dies unter die Kategorie KI-bearbeitet (oder KI-verändert)
> – nicht unter komplett KI-generiert. Weil ihr das Bild kommerziell nutzt (Werbung für eine
> Fußballübertragung), ist hier neben dem EU-KI-Gesetz (AI Act) vor allem das Wettbewerbsrecht (UWG)
> entscheidend: Gäste dürfen nicht in die Irre geführt werden. Wer morgen ins Restaurant kommt, darf
> nicht verärgert sein, dass die beworbene Leinwand in der Realität noch gar nicht hängt.
>
> 1. Direkt am Bild (Bildunterschrift / Caption): der wichtigste Ort. Beispiel: „Visualisierung: Die
>    Leinwand für die Fußballübertragung wurde zur Veranschaulichung per KI in das Foto eingefügt.“
>    Kurzform: „Symbolbild: Darstellung der geplanten Leinwand (KI-bearbeitet).“
> 2. Im Bild selbst (Overlay-Badge): ein kleines, sichtbares Icon in einer Ecke.
> 3. Im HTML-Code (Alt-Text): Beispiel alt="Innenraum des Restaurants. Eine Leinwand für
>    Fußballübertragungen wurde zur Veranschaulichung per KI in das Foto montiert."

## Kategorien

| Kategorie | Wann | Kennzeichnen? |
|---|---|---|
| **Echtes Foto** | Aufnahme ohne KI oder nur Standardbearbeitung (Zuschnitt, Belichtung, Farbe, Schärfe, Hochskalieren) | Nein |
| **KI-bearbeitet** | Echtes Foto, in dem KI ein inhaltlich relevantes Element hinzugefügt, entfernt oder verändert hat (z. B. eingefügte Leinwand, umarrangierte Platte) | **Ja** |
| **KI-generiert** | Bild/Video vollständig von einem KI-Modell erzeugt | **Ja** |

Im Zweifel kennzeichnen. Ist die Einstufung unklar, nicht raten: Antoine fragen.

## Pflichtbestandteile je KI-Bild

1. **Caption** direkt am Bild, sichtbar ohne Klick oder Hover, in der Seitensprache.
2. **Badge** im Bild, oben rechts: „KI-bearbeitet“ oder „KI-generiert“.
3. **Alt-Text**, der die KI-Bearbeitung bzw. -Erzeugung nennt.
4. Optional: **IPTC-Metadaten** in der Datei: `Iptc4xmpExt:DigitalSourceType` =
   `http://cv.iptc.org/newscodes/digitalsourcetype/compositeWithTrainedAlgorithmicMedia` (KI-bearbeitet)
   bzw. `.../trainedAlgorithmicMedia` (KI-generiert). Für uns als Betreiber ist das eine Empfehlung,
   keine Pflicht (siehe Quellen). Beispiel:
   `exiftool -XMP-iptcExt:DigitalSourceType="http://cv.iptc.org/newscodes/digitalsourcetype/compositeWithTrainedAlgorithmicMedia" bild.webp`

Auch Hero-Hintergrundbilder bekommen Badge und Caption sichtbar im Hero.

## Technische Umsetzung

- **Register:** `src/config/ki-bilder.ts`. Schlüssel = Dateiname, dazu Kategorie, Caption und alt in de/en/it/fr.
  **Jedes KI-Bild muss im Register stehen.** Jedes neue Bild wird vor dem Einbau eingestuft.
- **Komponente:** `src/components/KiBild.tsx`.
  - `<KiBild datei="…" src=… />` rendert `<img>` mit alt aus dem Register, dazu Badge und Caption.
  - `<KiHinweis datei="…" />` liefert Badge und Caption ohne `<img>`, etwa für Video oder für Karten mit eigenem `<img>`.
  - `kiAlt()` liefert den Register-Alt.
  - Der Elternteil muss `position: relative` haben.
- Alles wird vorgerendert (Vite-SSR/Prerender, kein `React.lazy`). Badge, Caption und alt stehen im statischen HTML.
- OG-/Social-Bilder: Ist das OG-Bild ein KI-Bild, gehört der Hinweis auch in den Begleittext des Posts.

## Register-Stand (07.10.2026)

| Datei | Kategorie | Seite(n) | Beleg |
|---|---|---|---|
| `wm-2026-fussball-uebertragung-innen-storia-muenchen.webp` (+600w) | KI-bearbeitet | /wm-2026-public-viewing-muenchen/ | Antoine 07.10.2026 (Leinwand eingefügt) |
| `tiramisu.webp` | KI-bearbeitet | Startseite (Bildraster) | Antoine, PR #125 |
| `neapolitan-pizza-hero.webp` (+600w) | KI-generiert | /pizza-muenchen/, /neapolitanische-pizza-muenchen/ | PR #123 |
| `cocktails.webp` | KI-generiert | Startseite (Bildraster) | PR #124 |
| `sommerfest-event.webp` (+600w) | KI-generiert | /catering/ (Hero) | PR #124 |
| `pizza-burrata-steinofen-storia-muenchen.mp4` (+ Poster .jpg) | KI-generiert | Startseite (Video) | PR #124 |
| `wm-2026-public-viewing-terrasse-storia-muenchen.webp` (+600w) | KI-bearbeitet | /wm-2026-public-viewing-muenchen/ (Hero) | Antoine 07.10.2026 („Ja, per KI eingefügt“) |
| `public/wm-2026-public-viewing-muenchen-og.jpg` | KI-bearbeitet | og:image der WM-Seite | Antoine 07.10.2026, siehe Hinweis unten |
| `romantisches-dinner-kerzenlicht-storia-muenchen.webp` (+600w) | KI-generiert | /romantisches-dinner-muenchen/, /valentinstag-muenchen/, /filmfest-muenchen/ (Hero), /besondere-anlaesse/silvester/ (Galerie), Besondere-Anlässe-Seite (Valentinstag-Hero) | Antoine 07.10.2026 („Alle KI, kennzeichnen“); bytegleich mit `romantisches-dinner-hero.webp` |
| `romantisches-dinner-hero.webp` | KI-generiert | nicht eingebunden (Kopie des Kerzenlicht-Bilds, gleicher Register-Eintrag) | Antoine 07.10.2026 |
| `wild-venison-hero.webp` (+600w) | KI-generiert | /wild-essen-muenchen/ (Hero) | Antoine 07.10.2026 |
| `silvester-dinner-gala-storia-muenchen.webp` (+600w) | KI-generiert | /besondere-anlaesse/silvester/ (Hero), Besondere-Anlässe-Seite (Silvester-Hero) | Antoine 07.10.2026 |
| `chefs.webp` | KI-generiert | nicht eingebunden; Register-Eintrag gilt beim Einbau | Antoine 07.10.2026 |

Offene Einstufungen: keine (Stand 07.10.2026).

**OG-Bild der WM-Seite:** Metadaten sind in `wm-2026-public-viewing-muenchen-og.jpg` nicht eingebettet,
weil im Build kein exiftool läuft. Wer sie nachträglich setzen will, nimmt den exiftool-Befehl oben mit
`compositeWithTrainedAlgorithmicMedia`. Bis dahin gilt: Wird die Seite in Social Media geteilt, gehört
„Leinwand per KI eingefügt“ in den Begleittext des Posts.

## Textbausteine

| | KI-bearbeitet | KI-generiert |
|---|---|---|
| **DE** Badge | KI-bearbeitet | KI-generiert |
| **DE** Caption | Visualisierung: [Element] wurde zur Veranschaulichung per KI in das Foto eingefügt. | Symbolbild: [Motiv], mit KI erstellt. Kein Foto aus unserer Küche/unseres Restaurants. |
| **EN** Badge | AI-edited | AI-generated |
| **EN** Caption | Visualisation: [element] was added to this photo using AI for illustration purposes. | Illustrative image: [subject], created with AI. Not a photo from our kitchen/restaurant. |
| **IT** Badge | Modificato con IA | Generato con IA |
| **IT** Caption | Visualizzazione: [elemento] è stato inserito nella foto con l'IA a scopo illustrativo. | Immagine illustrativa: [soggetto], creata con l'IA. Non è una foto della nostra cucina/del nostro ristorante. |
| **FR** Badge | Modifié par IA | Généré par IA |
| **FR** Caption | Visualisation : [élément] a été ajouté à la photo par IA à titre d'illustration. | Image d'illustration : [sujet] créé par IA. Ce n'est pas une photo de notre cuisine/restaurant. |

Kurzform (DE), wenn wenig Platz ist: „Symbolbild: Darstellung der geplanten Leinwand (KI-bearbeitet).“

## Rechtlicher Hintergrund (Kurzfassung, keine Rechtsberatung)

- **EU-KI-Verordnung (VO (EU) 2024/1689), Art. 50 Abs. 4.** Betreiber eines KI-Systems, das einen Deepfake erzeugt oder manipuliert, müssen offenlegen, dass der Inhalt künstlich erzeugt oder manipuliert ist.
  - Deepfake nach Art. 3 Nr. 60: Inhalt, der realen Personen, Gegenständen, **Orten**, Einrichtungen oder Ereignissen ähnelt und fälschlich echt wirkt. Ein echtes Restaurantfoto mit montierter Leinwand fällt darunter.
  - Art. 50 Abs. 5: Der Hinweis muss klar, eindeutig und barrierefrei sein, spätestens beim ersten Kontakt mit dem Inhalt.
  - Geltung ab **2. August 2026**.
  - Die erleichterte Kennzeichnung für offensichtlich künstlerische, satirische oder fiktionale Werke gilt für kommerzielle Werbung regelmäßig nicht.
- **Art. 50 Abs. 2** (maschinenlesbare Markierung) richtet sich an die **Anbieter** der KI-Systeme, also OpenAI, Google usw., nicht an uns als Betreiber.
  - Für Altsysteme läuft eine Übergangsfrist bis 2. Dezember 2026.
  - IPTC-/C2PA-Metadaten sind für uns deshalb eine Empfehlung.
- **UWG § 5** verbietet irreführende geschäftliche Handlungen, ausdrücklich auch durch **bildliche Darstellungen** (§ 5 Abs. 4).
  - Ein Werbebild, das Ausstattung zeigt, die es real (noch) nicht gibt, kann irreführen.
  - Das gilt unabhängig von der KI-VO (Art. 50 Abs. 6).
  - Wettbewerber und Verbände können Verstöße abmahnen (§ 3a UWG).

## Quellen

- Verordnung (EU) 2024/1689 (KI-VO), EUR-Lex: https://eur-lex.europa.eu/eli/reg/2024/1689/oj/deu (Art. 3 Nr. 60, Art. 50, Art. 113)
- EU-Kommission, AI Act Service Desk, Art. 50: https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50
- EU-Kommission, Leitlinien zu Art. 50 vom 20.07.2026 (C(2026) 5054): https://digital-strategy.ec.europa.eu/en/policies/guidelines-ai-transparency-obligations
- UWG § 5: https://www.gesetze-im-internet.de/uwg_2004/__5.html
- IHK Köln, Transparenzpflichten nach der KI-Verordnung: https://www.ihk.de/koeln/hauptnavigation/digitalisierung-und-innovation/digitalisierung/transparenzpflichten-nach-der-ki-verordnung-7100068
- Wettbewerbszentrale, Leitfaden Kennzeichnung KI-generierter Inhalte (02/2026): https://www.wettbewerbszentrale.de/wp-content/uploads/2026/02/2026_2_Leitfaden_KI_generierte_inhalte_1-1.pdf
- Taylor Wessing, Kennzeichnung KI-generierter Inhalte (07/2026): https://www.taylorwessing.com/de/insights-and-events/insights/2026/07/ki-generierte-werbeinhalte
- ZAW-Handreichung KI-VO (Stand 20.07.2026): https://www.gwa.de/content/uploads/2026/07/Handreichung_KI-VO_Stand_20Juli2026.pdf
- IPTC Digital Source Type: https://cv.iptc.org/newscodes/digitalsourcetype/
- C2PA, Content Credentials für synthetische Inhalte: https://c2pa.org/wp-content/uploads/sites/33/2026/07/Use-of-Content-Credentials-to-Identify-Synthetic-and-Non-Synthetic-Content.pdf
