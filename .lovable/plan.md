## Ziel
Jede **Festnetz-Telefonnummer** (089 51519696 / +49 89 51519696 / +498951519696 sowie die Barrierefreiheits-Nummer 089 28806855) wird auf der gesamten Website und allen Landingpages zu einem klickbaren `tel:`-Link — auch wenn sie mitten im Fließtext (FAQ-Antworten, Hinweis-/CTA-Texte, Beschreibungen) steht.

Die **WhatsApp-Nummer** (0163 6033912 / +49 163 603 3912) bleibt unverändert (kein tel:-Link).

CTA-Buttons, die die Nummer bereits in `<a href="tel:…">` rendern, bleiben wie sie sind.

## Technischer Ansatz

### 1. Neuer Helfer `src/lib/linkifyPhone.tsx`
- Funktion `linkifyPhone(text: string): React.ReactNode` und Wrapper-Komponente `<PhoneText>{string}</PhoneText>`.
- Erkennt per Regex die Festnetz-Formate:
  - `+49 89 51519696`, `+498951519696`, `089 51519696`
  - `+49 89 28806855`, `089 28806855` (Barrierefreiheit)
- **Schließt die WhatsApp-Nummer explizit aus** (Präfixe `0163` / `+49 163` werden nicht gematcht).
- Wandelt jeden Treffer in `<a href="tel:+49…">…</a>` um (Original-Anzeigeformat bleibt erhalten), restlicher Text unverändert.
- Reine String-Verarbeitung → SSR-/Prerender-sicher (kein DOM-Walker, keine Hydration-Probleme).

### 2. Anwendung an den Render-Stellen mit Fließtext-Nummern
`<PhoneText>` wird dort eingesetzt, wo Übersetzungs-/Textstrings ausgegeben werden, die eine Festnetznummer enthalten können:

- **FAQ-Antworten** (deckt alle `faq*Answer`-Keys ab):
  `src/pages/FAQ.tsx`, `src/pages/BesondererAnlass.tsx`, `src/pages/seo/FilmfestMuenchen.tsx`, `src/pages/seo/WildEssenMuenchen.tsx`
- **Hinweis-/CTA-Texte & Beschreibungen** mit Nummer, u. a.:
  `ctaBoxNote`, `menuPriceNote`, `processStep1Desc`, `tldr`, `callForMenu`, internationale Gruppen-Beschreibung, sowie weitere `*Note`/`*Desc`-Absätze, die die Nummer enthalten.
- **Hardcodierter Fließtext** in TSX (z. B. Filmfest-FAQ-Text mit „…rufen Sie direkt unter +49 89 51519696 an") — über die FAQ-Funnel bereits abgedeckt.

Vorgehen zur Vollständigkeit: alle Übersetzungs-Keys, deren Wert die Festnetznummer enthält, werden ermittelt; jede zugehörige Render-Stelle wird mit `<PhoneText>` umschlossen.

### 3. Styling
Inline-Links erben die Textfarbe und bekommen `hover:underline` (dezent, kein auffälliger Button), damit das Layout optisch unverändert bleibt.

## Nicht angefasst
- WhatsApp-Nummer / WhatsApp-Links (bleiben grüner Inline-Text wie gehabt).
- Bereits bestehende `tel:`-CTA-Buttons.
- Strukturierte Daten / JSON-LD (Telefonnummer bleibt dort als Klartext).

## Verifikation
- `npm run build` fehlerfrei.
- Grep: jede gerenderte Festnetznummer ist von `PhoneText`/`tel:` erfasst; WhatsApp-Nummer nirgends als tel:-Link.
- Stichproben (Filmfest-FAQ, ctaBoxNote, FAQ-Seite) im Preview: Nummer klickbar, Layout unverändert.</content>
<summary>Festnetznummern sitewide & auf allen Landingpages auch im Fließtext als klickbare tel:-Links (per linkifyPhone-Helfer); WhatsApp bleibt unverändert.</summary>
</invoke>
