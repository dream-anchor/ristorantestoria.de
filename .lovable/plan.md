## Ziel

Den Header (`ff-nav`) der Filmfest-München-Seite an den Standard-Header der Originalseite angleichen: Das Logo soll zur Startseite führen (nicht zum Seitenanfang der Landingpage), und die aus dem Original fehlenden Header-Elemente — allen voran der Sprachwechsler — werden ergänzt.

## Was aktuell fehlt / falsch ist

Vergleich `src/components/Header.tsx` (Original) ↔ `ff-nav` in `src/pages/seo/FilmfestMuenchen.tsx`:

| Element | Original-Header | Filmfest-Nav aktuell |
|---|---|---|
| Logo-Link | → Startseite (`home`) | → `#top` (nur Seitenanfang) ❌ |
| Sprachwechsler (DE/EN/IT/FR) | vorhanden | fehlt ❌ |
| Telefon | vorhanden | fehlt |
| E-Mail | vorhanden | fehlt |
| WhatsApp | vorhanden | fehlt |
| Instagram | vorhanden | fehlt |

## Umsetzung (nur `src/pages/seo/FilmfestMuenchen.tsx`)

1. **Logo führt zur Startseite**
   - `ff-brand` von `<a href="#top">` auf einen echten Link zur Startseite umstellen (React-Router `Link`/`LocalizedLink` zu `home`), `aria-label` entsprechend „STORIA – zur Startseite".

2. **Sprachwechsler einbinden**
   - Bestehende `LanguageSwitcher`-Komponente in `ff-nav` (rechts) einsetzen — kein neuer Switcher.
   - Da die Filmfest-Seite nur auf Deutsch existiert: Verhalten so absichern, dass ein Sprachwechsel auf EN/IT/FR auf die lokalisierte Startseite führt (Fallback), damit kein toter Link entsteht.

3. **Fehlende Header-Elemente ergänzen**
   - Kompakte Kontakt-Icons analog Original: Telefon (`+49 89 51519696`), E-Mail (`info@ristorantestoria.de`), WhatsApp (`wa.me/491636033912`), Instagram (`ristorante_storia`).
   - Auf Mobile dezent zusammenfassen, damit die bestehende Sektions-Navigation (Formate/Lage/Räume/Catering) + CTA „Termin anfragen" erhalten bleibt.

4. **Styling**
   - Neue Elemente an das dunkle `ff-nav`-Design (Bone/Amber) anpassen; Sprachwechsler-Trigger farblich an den Nav-Kontext angleichen.
   - Responsive: Bei `max-width:820px` Icons/Switcher sinnvoll reduzieren, ohne dass die Top-Bar überläuft.

5. **SEO/Pre-Render beachten**
   - Logo-Link und Header-Inhalte müssen im Quelltext (SSG) vorhanden sein — keine client-only Auslagerung.

## Technische Details

- `LanguageSwitcher` nutzt `useLanguage` + `useAlternateLinks`; für eine reine DE-Seite ohne Alternates greift der slug-basierte Fallback. Sicherstellen, dass dieser auf die DE-/Ziel-Startseite zeigt statt auf eine nicht existierende Filmfest-Übersetzung.
- Logo-Link über `LocalizedLink to="home"` (konsistent mit `Header.tsx`), damit die korrekte sprachabhängige Startseiten-URL erzeugt wird.
- Keine Änderungen an Business-Logik/Backend; rein Frontend/Presentation.
